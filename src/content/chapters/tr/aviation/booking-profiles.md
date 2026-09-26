---
title: "Rezervasyon profilleri ve talep tahmini"
domain: "aviation"
summary: "Bir uçuşun kalkışa kadar nasıl dolduğu, okuma günlerinde alınan anlık görüntülerle bir rezervasyon profiline dönüşüyor ve talep tahmininin ham maddesi oluyor. Bu bölüm tam ücretli ve indirimli sınıfların neden ters eğriler çizdiğini, profilin neden segment sınıfı düzeyinde kurulduğunu ve satışa kapalı dönemlerin 0/1 göstergesiyle ayıklanmadan tahmine giremeyeceğini anlatıyor."
audience: "Gelir yönetimi, envanter ya da talep tahmini sistemlerine veri taşıyan, snapshot işleri yazan veya tahmin motorunun girdisini tasarlayan yazılımcı ve ürün insanı. Spill bölümlerinin okunmuş olması işe yarar; rezervasyon profili, okuma günü (RD/DCP), erken satın alma kısıtı, segment ve bacak sınıfı, açık/kapalı göstergesi ve bütünleme (untruncation) metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Spill bölümleri talebin kapasiteye çarptığı anı modelliyordu: uçak dolunca
kaç yolcunun dışarıda kaldığını. Bu bölüm bir adım geri çekilip o talebin
zaman içinde nasıl geldiğine bakıyor. Kaynak metin tanımı tek cümleyle
koyuyor: bir uçuşun kalkıştan önceki rezervasyon hızı bir rezervasyon
profilinde yakalanır ve bu profiller talep tahmininin önemli bir
bileşenidir. **Rezervasyon profili, sistemin kaydettiği satışların eğrisi
değil, satışa açık olduğu anlarda gördüğü talebin eğrisidir.** Aradaki fark
küçük görünüyor ama tahmin motorunun doğru ya da sistematik olarak eksik
çalışması tam bu farka bağlı.

![Sunumun kapak slaytı, teknik çizim üslubunda. Başlık: Kalkışa Doğru, Rezervasyon Profilleri ve Talep Tahmini. Alt başlık: havayolu sistemleri zaman, talep ve envanter verilerini nasıl işler? Soldan sağa uzanan kalın mavi bir T-0 zaman çizgisi, ucunda T-0 (Kalkış) yazan bir hedef işareti; üzerinde kalkışa geçen bir yolcu uçağı. Altta üç kol: Zaman Verileri (rezervasyon akışı grafiği), Talep Eğrileri (talep dalgalanması ve yüksek talep uyarısı), Envanter Kontrolü (çubuk grafik ve koltuk bloğu). Sağ altta alan bilgisi kutusu: gelir yönetimi, kalkış saatine karşı verilen bir yarışta bozulma (spoilage, boş koltukla uçmak) ile sızma (spill, erken satılan ucuz biletler yüzünden yüksek gelirli yolcuyu reddetmek) arasındaki dengeyi kurmayı amaçlar; bu süreç PSS ile RM motorlarının nasıl etkileşime girdiğini belirler.](/decks/booking-profiles/01.webp "Zaman çizgisi takvimle değil kalkışa kalan günle ölçülüyor; bölümün geri kalanı bu eksen üzerinde duruyor.")

## Profil, geleceğin zamanlamasını geçmişten okuyor

Rezervasyon profili, bir uçuşun kalkışından önceki zaman diliminde
rezervasyonların hızını ve dağılımını haritalandırıyor. Yatay eksende
kalkışa kalan gün, dikey eksende birikmiş rezervasyon var. Geçmiş uçuşların
eğrileri, gelecekteki bir uçuşun talebinin ne zaman geleceğini öngörmek
için kullanılıyor. Yani profil yalnızca "kaç yolcu" sorusuna değil,
"ne zaman" sorusuna da cevap veriyor; envanter kontrolünün asıl ihtiyacı
da bu ikincisi.

![Başlık: Rezervasyon Profili Nedir? Alt başlık: rezervasyon profili, bir uçuşun kalkışından önceki zaman diliminde rezervasyonların hızını ve dağılımını haritalandırır. Bir alan grafiği: yatay eksende kalkışa kalan günler, dikey eksende 0 ile 100 arası rezervasyon hacmi; eğri solda düşük başlayıp T-0'a yaklaştıkça hızla yükseliyor. Ortadaki kutu: talep tahmininin ve envanter kontrolünün temel taşıdır, geçmiş veriler kullanılarak gelecekteki yolcu talebinin zamanlaması öngörülür. Alt bant, alan bilgisi: RM analistleri bu profilleri günlük olarak izler; gelecekteki bir uçuş için mevcut rezervasyonlar tarihsel profili aşarsa (çok hızlı veya çok yavaş rezervasyon), sistem RBD (rezervasyon sınıfı belirleyici) tahsisini ayarlamak için bir uyarı tetikler.](/decks/booking-profiles/02.webp "Alt banttaki uyarı mekanizması profilin gündelik kullanımı: bugünkü uçuş geçmiş eğriden saparsa biri bakmalı.")

Slaytın alt bandı profilin operasyondaki yerini gösteriyor. Analistler
profilleri günlük izliyor; gelecekteki bir uçuşun rezervasyonları tarihsel
profilden belirgin biçimde hızlı ya da yavaş gidiyorsa sistem, rezervasyon
sınıfı tahsisini ayarlamak için uyarı üretiyor. Yazılım tarafında bunun
karşılığı bir sapma alarmı: bugünkü noktayı aynı okuma günündeki tarihsel
banda karşı test eden bir kural. O kuralın anlamlı olması için de iki
uçuşun aynı eksende karşılaştırılabilmesi gerekiyor.

## Havayolu zamanı takvimle değil, kalkışa kalan günle sayıyor

Rezervasyon hızı "okuma günleri" (reading days, RD) ya da "veri toplama
noktaları" (data collection points, DCP) denen, kalkış tarihine kadar
uzanan belirli anlarda takip ediliyor. Kaynak metin profili, kalkış
tarihine kadar olan farklı zaman noktalarındaki rezervasyon hızını gösteren
şey olarak tanımlıyor. Sistem her okuma gününde rezervasyon durumunun anlık
görüntüsünü alıyor ve bunu tarihsel veriyle karşılaştırarak talep eğrisini
kuruyor.

![Başlık: Kalkışa Geri Sayım, Okuma Günleri (Reading Days). Alt başlık: havayolu sistemleri zamanı takvim tarihleriyle değil, kalkışa kalan gün sayısıyla ölçer. Üstte masa takvimi sayfaları: -360, -90, -60, -30, -14. Altta bir zaman çizgisi üzerinde noktalar: -360, -90, -60, -30, -14, -7 ve 0 (T-0); son üç okuma noktası turuncu. Solda Key Concept kutusu, terim: Okuma Günleri (RD) / Veri Toplama Noktaları (DCP); işlev: sistem her okuma gününde rezervasyon durumunun anlık görüntüsünü (snapshot) alır, kalkışa doğru geri sayan standart bir endeks oluşturur. Alt bant, alan bilgisi: eski PSS sistemleri bu kesin DCP'lerde envanter anlık görüntülerini toplamak için gün sonu toplu işleri (batch jobs) çalıştırır; modern sürekli RM sistemleri bunu gerçek zamanlı yapmaya çalışsa da RD endekslemesi farklı kalkış tarihlerindeki uçuşları karşılaştırmak için endüstri standardı matematiksel çerçeve olmaya devam etmektedir.](/decks/booking-profiles/03.webp "Noktalar kalkışa yaklaştıkça sıklaşıyor: talebin en hızlı değiştiği yer, en sık ölçülmesi gereken yer.")

Bu endeksin mühendislik anlamı şu: ilkbaharda kalkan bir uçuşla sonbaharda
kalkan bir uçuş takvimde hiçbir noktada çakışmıyor, ama ikisinin de bir
"kalkışa 30 gün" anı var. Profil bu anları hizalıyor. Slayttaki not,
eski PSS'lerin bu anlık görüntüleri kesin DCP'lerde gün sonu toplu
işleriyle topladığını, modern sürekli RM sistemlerinin bunu gerçek zamanlı
yapmaya çalıştığını ama RD endekslemesinin farklı kalkış tarihlerini
karşılaştırmanın standart çerçevesi olarak kaldığını söylüyor. Yani veri
akışı olay tabanlı olsa bile, tahmin katmanının beklediği şekil hâlâ
"uçuş, sınıf, okuma günü" anahtarlı bir tablo. Akışı ne kadar sık
tutarsanız tutun, sonunda bu ızgaraya indirgemek zorundasınız.

## Tam ücretli ve indirimli sınıflar birbirinin ayna görüntüsü

Profilin tek bir eğri olmamasının sebebi yolcunun tek tip olmaması. İş
kuralı, tam ücretli (unrestricted) sınıfların kalkışa çok yakın zirve
yapacağını, indirimli sınıfların ise erken satın alma kısıtları yüzünden
kalkıştan çok önce rezervasyon alacağını öngörüyor.

Esnek, kısıtsız tam ücretli bilet alan yolcu biletlemeyi genellikle uçuşa
çok kısa süre kala yapıyor; talep kalkışa yakın zirve yapıyor. Havayolunun
kârlılığı büyük ölçüde bu geç gelen, yüksek ödeyen yolcuya dayanıyor ve
envanter bu yüzden erken alıcılardan korunuyor.

![Başlık: Esnek Biletlerde Rezervasyon Eğilimi. Solda üç madde: kısıtlaması olmayan, tam ücretli biletleri temsil eder; yolcular biletleme işlemlerini genellikle uçuşa çok kısa bir süre kala gerçekleştirir; talep T-0 noktasına (kalkış) yakın bir zamanda zirve yapar. Sağda grafik, Esnek Bilet (Unrestricted Fare): yatay eksende kalkışa kalan günler 100, 90, 60, 30, 10, T-0; dikey eksende 0 ile 100 arası rezervasyon hacmi. Eğri 10 güne kadar sıfıra yakın seyrediyor, sonra neredeyse dikey biçimde 100'e fırlıyor. Alt bant, alan bilgisi: alan terimleri esnek biletler, Y-sınıfı, J-sınıfı; kalkışa yakın, yüksek getirili talep; bu havayolu kârlılığının temelidir; havayolu bu geç rezervasyon yapan yüksek ödemeli kurumsal yolculara koltuk ayırmak için erken alıcılardan envanteri aktif olarak saklar (korur).](/decks/booking-profiles/04.webp "Eğrinin son on güne sıkışması, koltuğu erken satmanın neden risk olduğunu gösteriyor: en değerli talep henüz gelmedi.")

İndirimli sınıf tam tersini yapıyor. Derin indirimli, katı kurallı
tatil ve eğlence biletleri kalkıştan çok önce satılıyor, kalkışa yakın
dönemde ise hiç aktivite görmüyor. Kaynak metin bunun sebebini açıkça
söylüyor: bu ücret sınıfı kalkışa yakın dönemde hiçbir rezervasyon
aktivitesi görmez, çünkü erken satın alma kuralları kalkışa yakın
rezervasyonları yasaklar.

![Başlık: İndirimli Biletlerde Rezervasyon Eğilimi. Solda üç madde: derin indirimli ve katı kuralları olan tatil/eğlence biletlerini temsil eder; rezervasyonlar kalkıştan çok önce yapılır; erken alım (advance purchase) kısıtlamaları nedeniyle kalkışa yakın dönemde hiçbir rezervasyon aktivitesi görülmez. Sağda turuncu grafik, Kısıtlı İndirimli Bilet (Restricted Fare): eğri 100 gün civarında zirve yapıyor, 30 güne doğru sıfıra iniyor ve kalkışa kadar sıfırda düz kalıyor; 30 ile 10 gün arasında kesikli dikey bir çizgi, Erken Alım Kuralı. Alt bant, alan bilgisi: alan terimleri erken alım (advance purchase, AP) kısıtlamaları; ATPCO (havayolu tarife yayın şirketi) ücret kuralları bu kısıtlamaları belirler (örneğin kalkıştan 14 gün önce satın alınmalıdır); RM sistemi T-14'ten sonra bu rezervasyon sınıfı için herhangi bir talep öngörmemesi gerektiğini bilir.](/decks/booking-profiles/05.webp "Kesikli çizginin sağındaki düz hat talep yokluğu değil, kural. Tahmin motoru bu ikisini ayırt edemezse yanlış öğrenir.")

## Düz çizgi iki farklı şey söyleyebilir

Erken satın alma kısıtı, belirli bir tarihten sonra o sınıfta rezervasyon
yapılmasını teknik olarak engelliyor. Profilde bu, o noktadan sonra yatay
bir seyir olarak görünüyor. Brifingin buradaki iş kuralı net: tahmin
algoritması bu durulmayı talep azlığı olarak değil, sistemsel bir kısıt
olarak okumalı. Slayttaki örnekte ATPCO ücret kuralı kalkıştan 14 gün
önce satın almayı şart koşuyorsa, RM sistemi T-14'ten sonra o sınıf için
talep öngörmemesi gerektiğini biliyor.

Yazılım tarafında bunun karşılığı, ücret kuralının tahmin katmanına veri
olarak girmesi. Eğer tahmin motoru yalnızca rezervasyon sayılarını görüp
ücret kuralını görmüyorsa, T-14 sonrasındaki sıfırları "bu sınıfa son iki
haftada talep gelmiyor" diye öğreniyor. Bu tesadüfen doğru bir sonuç, ama
yanlış bir sebepten. Kural değiştiğinde, diyelim ki AP süresi kısaldığında,
model eski sıfırları taşımaya devam ediyor. Aynı ilişki fiyatlandırma
tarafına da uzanıyor: brifing, kısıtlı ücretlerin rezervasyon eğrisinin
promosyonların ne zaman bitmesi gerektiğini belirleyen erken satın alma
kurallarıyla doğrudan uyumlu olması gerektiğini söylüyor.

![Başlık: Karşılaştırma Matrisi, Yolcu Eğilimleri. Üç sütunlu tablo: özellik, Esnek Tam Ücretli (Unrestricted), Derin İndirimli (Discounted). Zirve zamanı: kalkışa çok yakın, kalkıştan çok önce. Erken alım kuralı: yok, sıkı kısıtlamalar mevcut. Kalkışa yakın aktivite: yüksek, yok (kurallar gereği engellenir). Eğri şekli: mavi eğri düz gidip sonda yukarı kıvrılıyor; turuncu eğri başta sivri bir zirve yapıp sonra düz. Altta 100'den T-0'a bir zaman çizgisi. Alt bant, alan bilgisi: iç içe geçmiş envanterin (nested inventory) var olmasının nedeni bu farklılaşan eğrileri anlamaktır; RM motorları bu matrisleri karşılaştırarak herhangi bir anda bir koltuk için kabul edilebilir minimum gelir olan teklif fiyatını (bid price) hesaplar.](/decks/booking-profiles/06.webp "İki eğri aynı koltuk için yarışıyor ama farklı zamanlarda. Envanterin iç içe kurulması bu zaman farkını yönetmek için.")

İki eğrinin yan yana konması envanter kontrolünün mantığını açıklıyor.
Ucuz talep önce geliyor, pahalı talep sonra. Her koltuğu ilk gelene
satarsanız pahalı yolcu geldiğinde yer kalmıyor; koltuğu gereğinden fazla
korursanız uçak boş kalkıyor. Kapaktaki spoilage ve spill ikilemi bu iki
eğrinin çakışmasından doğuyor. Slayttaki not bunu iç içe envanterin
varoluş sebebi olarak koyuyor: RM motoru bu eğrileri karşılaştırarak bir
koltuk için kabul edilebilir minimum geliri, teklif fiyatını hesaplıyor.
Profil yanlışsa, o eşik de yanlış.

## Tahmin bir boru hattı, profil onun ortasında duruyor

Rezervasyon profili tek başına bir çıktı değil; talep tahmininin
ardışık adımlarından biri. Sunum bu akışı dokuz adımlı bir döngü olarak
çiziyor: tarihsel veri toplama, aykırı değer tespiti, veri temizleme,
tarafsız profil çıkarma, talep bütünleme (untruncation), tahmin modelleri,
parametre tahmini, talep tahmini üretimi ve doğruluk ölçümü. Son adım
sürekli geri bildirimle ilk adıma dönüyor.

![Başlık: Talep Tahmin Boru Hattı (Pipeline). Dokuz kutudan oluşan dairesel bir akış: 1 tarihsel veri toplama, 2 aykırı değer (outlier) tespiti, 3 veri temizleme, 4 tarafsız profil çıkarma, 5 talep bütünleme (untruncation), 6 tahmin modelleri, 7 parametre tahmini, 8 talep tahmini üretimi, 9 doğruluk ölçümü; 9'dan 1'e kesikli bir ok, sürekli geri bildirim. Altta 100'den T-0'a bir zaman çizgisi. Alt bant, alan bilgisi: bu bir RM tahmin motorunun tam mikro hizmet mimarisidir; adım 2 (aykırı değer tespiti), normal yolcular için temel talep tahminini zehirleyecek olan devasa grup rezervasyonlarını (örneğin bir futbol takımı) filtrelemek için kritik öneme sahiptir.](/decks/booking-profiles/07.webp "Tarafsız profil dördüncü adımda, bütünleme beşincide. İkisinin sırası tesadüf değil: önce neyin ölçülebildiğini ayırıyorsun, sonra ölçülemeyeni tahmin ediyorsun.")

Slayttaki notun verdiği örnek akılda kalıcı: tek bir futbol takımının
grup rezervasyonu, normal yolcular için temel talep tahminini
zehirleyebilir. Aykırı değer tespiti bu yüzden profilden önce geliyor.
Yazılım tarafında her adım ayrı bir sorumluluk; sunum bunu bir RM tahmin
motorunun mikro hizmet mimarisi olarak adlandırıyor. Hizmetlere bölmeseniz
bile, adımların arasındaki veri sözleşmesini ayrı tutmak işe yarıyor:
temizlenmiş veriyle ham veriyi aynı tabloda tutan bir sistemde,
doğruluk ölçümü hangi versiyonun ölçüldüğünü bilemiyor.

## Profil segment sınıfında kuruluyor, çünkü açık/kapalı bilgisi orada

Profilin hangi ayrıntı düzeyinde kurulacağı ikinci tasarım kararı. Tahmin
ve envanter kontrolü için profiller genellikle segment rezervasyon sınıfı
(segment booking class) düzeyinde oluşturuluyor. Alternatifi bacak sınıfı
(leg class). Brifingin gerekçesi pratik: çoğu rezervasyon sistemi açık ve
kapalı bilgisini segment düzeyinde sunuyor, dolayısıyla bu seviye daha
ayrıntılı analiz imkânı veriyor.

![Başlık: Veri Toplama Topolojisi, Segment ve Bacak (Leg). Alt başlık: rezervasyon profilleri, veri hassasiyetini artırmak için genellikle bacak sınıfı yerine segment rezervasyon sınıfı düzeyinde oluşturulur. Üç daire: A (Ankara), B (İstanbul), C (Londra). A'dan B'ye kesikli ok, Bacak (Leg); A ile C arasında üstten kavis çizen kalın ok, Segment (O&D). Sağda kutu: sistemler envanter açık/kapalı bilgisini bu segment seviyesindeki detaylı kayıtlardan çeker. Alt bant, alan bilgisi: alan terimleri O&D (origin and destination, başlangıç ve varış), leg, segment; eski RM sistemleri uçuşları bacak bacak (sadece IST-LHR) yönetirdi; modern RM, O&D mantığı kullanır, uygunluğu onaylamadan önce toplam ağ değerini hesaplamak için yolcunun tüm yolculuğuna (ESB-IST-LHR) bakar.](/decks/booking-profiles/08.webp "Hangi düzeyde profil kurabileceğini, hangi düzeyde açık/kapalı kaydı tuttuğun belirliyor. Veri modeli burada tahmin modelinden önce geliyor.")

Brifingin stratejik çıkarımı da aynı yönde: segment bazlı kontrol, bacak
bazlı kontrole göre daha hassas veri sunduğu için gelir yönetimi
sistemlerinde öncelikli olmalı. Buradaki mühendislik dersi, profil
düzeyinin bir modelleme tercihi olmaktan önce bir veri mevcudiyeti sorusu
olması. Aşağıda görüleceği gibi, tarafsız profil her okuma
günü için "bu sınıf açık mıydı" sorusunun cevabına ihtiyaç duyuyor. O
cevabı hangi düzeyde saklıyorsanız, profili de o düzeyde kurabiliyorsunuz.

## Kapalı dönemdeki sıfır, talebin sıfır olduğu anlamına gelmiyor

Profilin tarafsız olması için yalnızca satışa açık dönemlerin verisi baz
alınmalı. İki okuma günü arasında sınıf kapalıysa, o aralıktaki veri
kısıtlanmış (truncated) sayılıyor. Kaynak metin bunun için açık bir
gereklilik koyuyor: tarafsız segment sınıfı ya da bacak sınıfı
rezervasyon profillerinin oluşturulması, okuma günü bazında açık ve kapalı
göstergelerini gerektiriyor; 0 açık, 1 kapalı demek. Sistem bu göstergeyle
yalnızca açık dönemlerdeki akışı kısıtlanmamış talep olarak tanımlıyor.

![Başlık: 0/1 İkili Kapısı, Açık ve Kapalı Göstergeleri. Alt başlık: tarafsız bir rezervasyon profili oluşturmak için sistemin okuma günlerinde bilet sınıflarının durumunu bilmesi gerekir. Solda mavi, açık bir bariyerden geçen yolcu figürleri, 0 = AÇIK; sağda turuncu, kapalı bir bariyerin önünde durdurulmuş, üzerlerinde çarpı işaretleri olan yolcu figürleri, 1 = KAPALI. Açıklama kutuları: 0 (açık), sınıf satışa açıktır, gelen rezervasyonlar gerçek talebi yansıtır; 1 (kapalı), sınıf satışa kapalıdır, bu dönemde sistem talep gelse bile bunu doğrudan ölçemez. Alt bant, alan bilgisi, dağıtım/GDS uygunluk kontrolleri: bir seyahat acentesi GDS (Amadeus, Sabre) üzerinden uygunluk kontrol ettiğinde havayolunun PSS'i yanıt verir; RBD kapalıysa 0 veya C döner; RM veritabanında bu kapalı durum, bu dönemdeki tarihsel rezervasyonların sıfır olduğu anlamına gelir, ancak gerçek talep sıfır değildir.](/decks/booking-profiles/09.webp "Kapalı bariyerin önünde bekleyenler kayıtlara hiç girmiyor. Göstergenin işi, onların yokluğunu talep yokluğundan ayırmak.")

Bu slaytta küçük ama pahalı bir tuzak var. Göstergede 0 açık demek; ama
notun anlattığı GDS uygunluk yanıtında sınıf kapalıyken dönen değerlerden
biri de 0. İlki bir durum bayrağı, ikincisi kapalı sınıfın yanıtı. İki
sistem arasında veri taşıyan bir entegrasyonda bu iki sıfırın aynı
sütuna düşmesi, açık ile kapalıyı ters çevirmenin en kısa yolu.
Göstergeyi bir tamsayı olarak değil, adı konmuş bir durum olarak saklamak
bu riski ortadan kaldırıyor.

Eğer veri günlük anlık görüntüler olarak toplanıyorsa, iki okuma günü
arasındaki kapanma oranları da hesaplanabiliyor. Brifing buna parçalı
kapanma (fractional closure) diyor ve hesabın envanter detay kayıtlarındaki
tarihsel koltuk uygunluğunu gözlemleyerek yapılması gerektiğini söylüyor.
Okuma günleri seyrekleştikçe, örneğin -90 ile -60 arasında, bir sınıfın o
aralığın bir kısmında açık bir kısmında kapalı olması olasılığı artıyor.
Aralığı tek bir 0 ya da 1 ile etiketlemek o durumda bilgi kaybı. Brifingin
veri yönetimi çıkarımı bu yüzden günlük snapshot'ı kritik sayıyor: okuma
günleri arasındaki boşluklarda olan doluluk değişimlerini görmenin ve
parçalı kapanma analizi yapmanın yolu o.

## Bütünleme, kapalı musluğun arkasındaki talebi geri koyuyor

Kapalı dönemleri ayıklamak işin yarısı. Diğer yarısı, o dönemde kaybedilen
potansiyel talebi matematiksel olarak geri koymak: bütünleme
(untruncation, unconstraining). Sunumdaki not bunu gelir yönetimindeki
muhtemelen en zor matematiksel problem olarak niteliyor ve bir örnek
veriyor: uçak kalkıştan 30 gün önce dolarsa, son 30 günde tam olarak sıfır
tarihsel rezervasyon olur. Bütünleme algoritmaları, EM gibi yöntemler, kaç
kişinin rezervasyon yapmaya çalıştığını tahmin ediyor ve havayolunun
gelecek yıl için eksik tahmin yapmasını önlüyor.

![Başlık: Gizli Talebi Ortaya Çıkarmak, Bütünleme (Untruncation). Alt başlık: kapalı okuma günleri (1) arasında kalan zaman dilimlerinde kaybedilen potansiyel talep matematiksel olarak bütünlenmelidir (unconstrained). Solda açık bir vana (0) ve borudan akan su bir kovayı dolduruyor: talep, kayıtlı rezervasyonlar. Sağda kapalı bir vana (1), borudan kesikli çizgilerle çizilmiş hayalet bir akış boş görünen bir kovaya iniyor: bütünlenen (untruncated) talep. Ortada formül: aralık başına düşen ortalama rezervasyon bölü o sınıftaki toplam rezervasyon eşittir her okuma günü aralığı için ortalama rezervasyon yüzdesi. Alt bant, alan bilgisi, bütünleme (unconstraining): muhtemelen RM'deki en zor matematiksel problemdir; uçak kalkıştan 30 gün önce dolarsa son 30 gün içinde tam olarak 0 tarihsel rezervasyon olur; bütünleme algoritmaları (EM gibi) kaç kişinin rezervasyon yapmaya çalıştığını tahmin eder ve havayolunun gelecek yıl için eksik tahmin yapmasını önler.](/decks/booking-profiles/10.webp "Sağdaki kova boş görünüyor ama kesikli akış orada. Bütünlenmemiş veriyle eğitilen model gelecek yılı bu boş kovaya göre planlıyor.")

Yanılgının döngüsel olduğunu görmek önemli. Bu yıl erken kapanan bir
sınıfın son haftalarındaki sıfırlar bütünlenmeden tahmine girerse, model
gelecek yıl o haftalara daha az talep bekliyor. Daha az talep bekleyen
sistem koltuğu daha erken ucuz sınıflara açıyor, sınıf yine erken doluyor,
yine sıfır kaydediliyor. Her tur bir öncekinin hatasını pekiştiriyor.
Brifingin tahmin modeli çıkarımı bu döngüyü kıracak kuralı koyuyor: talep
tahmin modelleri yalnızca tarihsel rezervasyonları değil, bu rezervasyonların
yapıldığı dönemdeki satışa açıklık durumunu da işlemek zorunda.

Slaytın ortasındaki formül profilin standart hale getirilmesini anlatıyor.
Belirli bir aralıktaki ortalama rezervasyon, o sınıfta (segment ya da
bacak düzeyinde) gerçekleşen toplam rezervasyona bölünüyor ve her okuma
günü aralığı için ortalama bir yüzde çıkıyor. Bu yüzde, gelecekteki
uçuşların doluluk hızını kıyaslamak için bir kıyas noktası oluyor.
Mutlak sayı yerine yüzde kullanmak, farklı büyüklükteki uçuşların
profillerini karşılaştırılabilir kılıyor. Bu yüzdenin anlamlı olması için payın da paydanın da bütünlenmiş
veriden gelmesi gerekiyor; aksi halde kapalı dönemin sıfırları oranın
içine sızıyor.

## Tek bir rezervasyonun yolculuğu

Sunumun sentez slaytı bütün bu parçaları tek bir veri noktasının
hikâyesine bağlıyor. Bir yolcu kalkışa 45 gün kala bilet alıyor. Sistem
o anda ilgili segment sınıfının açık olup olmadığına bakıyor. Kapalı
günlere ait veriler algoritmalarla bütünleniyor. Veri, ilgili bilet
türünün tarihsel profiline ekleniyor. Sonunda gelecek uçuşlar için talep
tahmini güncelleniyor ve yeni fiyatlamalar optimize ediliyor.

![Başlık: Sentez, Bir Veri Noktasının Anatomisi. Soldan sağa oklarla bağlı beş pencere. 1 eylem: yolcu kalkışa 45 gün kala (RD-45) bilet alır, yürüyen bir figür ve RD-45 yazan takvim. 2 kontrol: sistem segment sınıfı kapısının açık (0) olup olmadığına bakar, açık bir bariyer. 3 işlem, turuncu vurgulu: kapalı günlere ait veriler algoritmalarla bütünlenir (untruncated), vana ve dişli simgeleri. 4 entegrasyon: veri, ilgili bilet türünün tarihsel profiline eklenir, veritabanı simgesi. 5 sonuç: gelecek uçuşlar için talep tahmini güncellenir ve yeni bilet fiyatlamaları optimize edilir, yükselen çubuk grafik. Alt bant, alan bilgisi, uçtan uca akış: alışveriş, sipariş yönetimi, envanter kaydı, RM bütünlemesi, tahmin, gelecek optimizasyonu; bu sürekli döngü her yolcu hareketinin RM motoruna bir sonraki uçuşu nasıl daha akıllıca fiyatlandıracağını öğretmesini sağlar.](/decks/booking-profiles/11.webp "İkinci pencere olmadan üçüncüsü çalışamıyor: neyin bütünleneceğini açık/kapalı kaydı söylüyor.")

Alt banttaki uçtan uca akış, bu bölümü dağıtım bölümlerine bağlıyor:
alışveriş, sipariş yönetimi, envanter kaydı, RM bütünlemesi, tahmin,
gelecek optimizasyonu. Satış tarafında yazılan her sistem, envanter
kaydına düşen olayın içeriğini belirliyor. O olay "bir rezervasyon oldu"
bilgisinin yanında "o anda bu sınıf açıktı" bilgisini de taşımıyorsa,
bütünleme adımı elindeki en önemli girdiyi başka bir yerden, genellikle
daha kaba bir snapshot'tan yeniden kurmak zorunda kalıyor.

## Yarın işe yarayacak dört çıkarım

1. **Rezervasyonla birlikte satışa açıklık durumunu da sakla.** Talep
   tahmin modeli yalnızca tarihsel rezervasyon sayılarını değil, her okuma
   günü için sınıfın açık mı kapalı mı olduğunu da işlemeli. Açık/kapalı
   göstergesi olmayan bir geçmiş, tarafsız profil üretemez; kapalı
   dönemin sıfırları talep yokluğu olarak öğrenilir ve bir sonraki yılın
   tahminini aşağı çeker.
2. **Günlük snapshot al.** Okuma günleri seyrek olsa bile envanter
   durumunu günlük topla. İki okuma günü arasındaki parçalı kapanmaları
   ancak böyle hesaplayabilirsin; aralığı tek bir 0 ya da 1 ile
   etiketlemek, aralığın içinde açılıp kapanan sınıfların bilgisini
   siler.
3. **Profili segment sınıfı düzeyinde kur.** Segment bazlı veri, bacak
   bazlı veriye göre daha hassas ve rezervasyon sistemleri açık/kapalı
   bilgisini çoğunlukla bu düzeyde sunuyor. Gelir yönetimi sisteminde
   önceliği segment bazlı kontrole ver.
4. **Erken satın alma kuralını tahmine ve promosyona aynı kaynaktan
   besle.** Kısıtlı ücretin AP kuralı, tahmin motoruna "bu tarihten sonra
   talep bekleme" bilgisini, fiyatlandırmaya da "promosyon burada biter"
   bilgisini veriyor. İkisi ayrı yerlerden okunursa kural değiştiğinde
   biri eski eğriyle çalışmaya devam eder.

Bu bölümde ne yok: bütünleme algoritmalarının kendisi ve kapasiteye
çarpan talebin nasıl modellendiği (spill bölümleri, özellikle
"Beklenen kapasite aşımı (expected spill) ve Boeing modeli analizi"),
iptallerin profile etkisi ve tahmin modellerinin nasıl seçildiği. Bu
bölüm yalnızca tahmin motoruna giren eğrinin nasıl kurulduğunu ve o
eğrinin hangi veri olmadan yanlış kurulacağını anlatmak için var.
