---
title: "Rekabetçi havayolu alışveriş verileri analizi"
domain: "aviation"
summary: "Rezervasyon verisi yolcunun neyi aldığını gösterir, alışveriş verisi ise neyin karşısında aldığını. Bu bölüm GDS sorgu ve yanıtlarından oluşan bu veri kümesinin talep tahmininden dinamik fiyata, tarife kârlılığından ekran sıralamasına ve NDC karşılaştırmasına kadar hangi kararları beslediğini anlatıyor."
audience: "Talep tahmini, gelir yönetimi, shopping motoru ya da acente ekranı üzerinde çalışan, satılmayan seçeneklerin veride neden tutulması gerektiğini anlamak isteyen yazılımcı ve analist. Pazarlama planlama ve spill bölümlerinin okunmuş olması işe yarar; alışveriş verisi, CCM, gerçekleşmemiş talep, net katkı, fayda değeri ve book-ability metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Talep tahmini bölümleri şimdiye kadar tek bir kör noktanın etrafında
dolaştı: havayolu yalnızca satılan bileti görüyor. Uçuş dolduğunda satışa
kapanıyor ve kapanıştan sonra gelen yolcu hiçbir kayda düşmüyor; spill
modelleri bu görünmeyen kısmı istatistikle geri kazanmaya çalışıyordu. Bu
bölüm aynı boşluğa başka bir yerden bakıyor. GDS'lere her gün düşen
devasa hacimdeki sorgular ve bu sorgulara dönen yanıtlar, yani alışveriş verisi
(shopping data), yolcunun ne aldığını değil, ekranında neyi gördüğünü ve
hangi fiyatla gördüğünü kaydediyor. **Rezervasyon verisi yolcunun neyi
aldığını söyler; alışveriş verisi neyin karşısında aldığını da söyler, ve
gelir yönetiminin eksik parçası tam olarak bu ikincisi.** Kaynak metin bu
verinin hacmi yüzünden modern havacılıkta büyük veri ekosisteminin
merkezine yerleştiğini söylüyor. Hacim meselenin yalnızca bir yüzü; asıl
değişen, verinin cevap verebildiği soru.

## MIDT neyin alındığını gösteriyor, neyin reddedildiğini göstermiyor

Pazarlama planlama bölümünde MIDT'yi, GDS üzerinden yapılan acente
rezervasyonlarının verisi olarak anlatmıştık: pazar payını ve acente
performansını okumak için standart kaynak. Tarife kârlılığı söz konusu
olduğunda bu kaynağın sınırları belirginleşiyor. Kaynak metin MIDT'nin iki
kusurunu açıkça sayıyor: birincisi, seyahat acentesine hangi
güzergahların sunulduğu ve bunlardan hangisinin rezerve edildiği
bilinmiyor; ikincisi, güzergahın fiyatı veride yok.

Bu iki kusur birlikte düşünüldüğünde ciddi bir şey söylüyor. Bir yolcunun
rakip havayolunun aktarmalı uçuşunu seçtiğini MIDT gösterebilir. Ama
yolcunun o anda sizin direkt uçuşunuzu da görüp görmediğini, gördüyse hangi
fiyatla gördüğünü göstermez. Seçim bir karşılaştırmanın sonucu; MIDT ise
karşılaştırmanın yalnızca kazananını kaydediyor. Kaybeden seçenekler ve
onların fiyatı olmadan, yolcunun neden o uçuşu seçtiğine dair her çıkarım
tahmin olarak kalıyor.

Alışveriş verisi bu iki boşluğu doğrudan dolduruyor. Her sorgu için
acenteye sunulan seçenekler listesi ve her seçeneğin fiyatı kayıtta. Hangi
seçeneğin rezervasyona dönüştüğü de eklendiğinde elde edilen şey bir
satış kaydı değil, bir seçim deneyi: şu alternatifler, şu fiyatlarla,
şu sırayla gösterildi ve yolcu bunu seçti.

Yazılım tarafında bunun karşılığı şu: shopping yanıtını müşteriye dönüp
unutan bir sistem, analitiğin en değerli girdisini çöpe atıyor. Rezervasyon
tablosu yalnızca kazananı tutar. Sunulan setin tamamı ayrı bir akış olarak
saklanmadıkça bu bölümdeki kullanım alanlarının hiçbiri kurulamaz.

## Seçim modeli satılmayan seçeneklerden kalibre ediliyor

Alışveriş verisinin ilk ve en doğrudan kullanıldığı yer talep tahmini.
Gelir yönetimi sistemleri talebi yalnızca uçuş ve sınıf bazında değil,
müşterinin hangi hizmet seviyesine yöneldiğine göre de tahmin etmek
zorunda: aynı başlangıç-varış (O&D) pazarında bir yolcu direkt uçuşa mı,
tek aktarmalıya mı, bağlantılı başka bir seçeneğe mi gidecek? Bu yönelimi
tanımlayan yapı müşteri tercih modeli (CCM, customer choice model). Model,
her pazar ve sınıf için müşterinin farklı hizmet seçeneklerine hangi
olasılıkla yöneldiğini ağırlıklarla ifade ediyor.

Kaynak metin bu ağırlıkların nereden geleceğini net söylüyor: alışveriş
verisi, talep tahmininde kullanılan müşteri seçim modellerini kalibre
etmek için ideal bir veri kaynağı. Nedeni bir önceki bölümdeki iki kusurun
tersi. Bir hizmet seviyesinin ağırlığını hesaplamak için yolcunun o
seviyeyi seçtiği durumları bilmek yetmez; seçebilecekken seçmediği
durumları da bilmek gerekir. Direkt uçuş ekranda yokken aktarmalıyı seçen
yolcu ile direkt uçuş ekrandayken aktarmalıyı seçen yolcu aynı tercihi
göstermiyor. Rezervasyon verisinde ikisi aynı satır; alışveriş verisinde
ikisi ayrı gözlem.

Aynı mantık gerçekleşmemiş talebe de uzanıyor. Spill bölümlerinde
kısıtlanmış (truncated) talebin, yani uçuş satışa kapandığı için
gözlemlenemeyen talebin nasıl istatistiksel olarak geri kazanıldığını
anlatmıştık. Alışveriş verisi bu soruya ikinci bir yol açıyor. Veri
yalnızca satılan biletleri değil, sunulan ama seçilmeyen seçenekleri de
içerdiği için, CCM üzerinden pazarın gerçek kapasite ihtiyacını ve kayıp
talebi analiz etmek mümkün hale geliyor. Kısıtlanmamış (untruncated) talep
artık yalnızca bir dağılım varsayımından değil, yolcunun gerçekten ne
gördüğünden ve neyi geri çevirdiğinden de besleniyor.

Burada dikkat edilmesi gereken nokta, iki yöntemin birbirinin yerine
geçmediği. Spill modelleri havayolunun kendi satış verisinden, kapanış
anındaki dolulukla çalışıyor. Alışveriş verisi ise pazarın tamamında
yolcunun karşısına çıkan seçenekleri görüyor. Birincisi kendi uçuşunun
kaybettiği talebi tahmin eder; ikincisi o talebin nereye gittiğini de
gösterebilir.

## Envanteri ezmek bir gelir hesabı, bir istisna değil

Talep tahmini geriye dönük bir iş: geçmiş gözlemlerden model kuruyor.
Alışveriş verisinin ikinci kullanım alanı ise anlık. Dinamik kullanılabilirlik
(dynamic availability) motoru, mevcut envanter kontrolünün verdiği kararı
belirli koşullarda geçersiz kılabiliyor (override). Yani gelir yönetimi
sistemi bir sınıfı kapatmış olsa bile, motor o sorgu için koltuğu açabiliyor
ya da tersini yapabiliyor.

Bu kararın dayanağı keyfi değil. Kaynak metne göre motor, alışveriş
verisinden gelen anlık pazar koşullarını analiz ediyor ve iki büyüklük
arasındaki dengeye bakıyor: beklenen gelir maksimizasyonu ile net katkı.
Net katkı burada pazar değeri ile toplam teklif fiyatı (bid price)
arasındaki fark olarak tanımlanıyor. Bir güzergahın pazarda ne kadar
edebileceği, o güzergahın kullandığı koltukların sistem için fırsat
maliyetinden yüksekse satış açılıyor; değilse kapanıyor. Envanter kontrolü
anlık olarak bu hesaba göre güncelleniyor.

Aynı hesabın fiyat tarafındaki karşılığı optimal fiyat noktası. Kaynak
metin bu noktanın belirlenmesini üç girdinin harmanlanması olarak
anlatıyor: talep, kalan kapasite ve alışveriş verisinden gelen rakip
fiyatları. Seçim modelleri üzerinden müşterinin o fiyat noktasında satın
alma ihtimali hesaplanıyor ve beklenen geliri en üst düzeye çıkaran nokta
o sorguya atanıyor. Rakip fiyatı bu denklemde bir referans değil, satın
alma ihtimalinin girdisi: yolcu sizin fiyatınızı rakibinkinin yanında
görüyor, model de öyle görmek zorunda.

Yazılım tarafında bunun karşılığı, fiyat ve kullanılabilirlik kararının
sorgu anında verilmesi. Önceden hesaplanıp dosyalanmış sınıf açıklıkları
yerine, her sorguda seçim modeline ve güncel pazar görüntüsüne danışan bir
servis. Bu servis ne kadar yavaşsa shopping yanıtı o kadar gecikir; aşağıda
alışveriş maliyeti bölümünde bu gerilimin öbür ucu var.

## Tarife kârlılığı acentenin ekranında ölçülüyor

Alışveriş verisinin üçüncü kullanım alanı planlama. Bir tarifenin, yani
hangi saatte hangi uçuşun hangi bağlantılarla konacağının kârlılığını
ölçmek, o tarifenin pazarda ne kadar yolcu çekeceğini tahmin etmeyi
gerektiriyor. Geleneksel yaklaşım bunu MIDT'ye dayanarak yapıyordu, ve
yukarıdaki iki kusur burada doğrudan hata kaynağına dönüşüyor.

Bir tarife değişikliğinin etkisini tahmin ederken sorulan soru şu: bu uçuşu
şu saate çekersek, ekranda hangi rakip seçeneklerin yanında görünecek ve
kaç yolcu onu seçecek? MIDT bu sorunun yarısına bile cevap veremiyor,
çünkü mevcut durumda uçuşun hangi alternatiflerle birlikte gösterildiğini
bilmiyor. Kaynak metne göre alışveriş verisiyle zenginleştirilmiş modeller
acenteye sunulan alternatifleri ve fiyatları denkleme dahil ediyor ve
tarifelerin gerçek kârlılık potansiyelini daha sağlam biçimde ölçüyor.

Buradan çıkan planlama dersi basit: bir uçuşun rekabet gücü, uçuşun kendi
özelliklerinden çok, acentenin ekranında yanında durduğu seçeneklere
bağlı. Tarife kararını veren ekip o ekranı görmüyorsa, karar yarım veriyle
veriliyor.

## Sıralama bir fayda fonksiyonu, en ucuz fiyat değil

Şimdiye kadarki kullanımlar havayolunun kendi kararlarıyla ilgiliydi. Dördüncü
ve beşinci kullanım alanı, alışveriş deneyiminin kendisini tasarlamakla
ilgili: yolcuya hangi seçeneklerin hangi sırayla gösterileceği.

Kaynak metin modern alışveriş algoritmalarının seyahat bağlamına ve
kişiselleştirmeye dayalı müşteri segmentasyonunu desteklediğini söylüyor.
Sıralamanın mantığı buradan çıkıyor. Önce belirli bir müşteri segmenti
için baskın olan tarife ve ücret nitelikleri belirleniyor; kaynak metnin
verdiği örnekler uçuş süresi ya da bagaj hakkı. Sonra her seçenek için bu
niteliklerden bir fayda değeri (utility value) hesaplanıyor ve seçenekler
bu değere göre sıralanıyor. Kısa iş seyahatinde uçuş süresi ağır basan
segment ile uzun tatilde bagaj hakkına bakan segment, aynı seçenek setini
farklı sırayla görmeli.

Bunun anlamı, "en ucuzu en üste koy" kuralının bir fayda fonksiyonunun özel
bir hali olması: yalnızca fiyata ağırlık veren, diğer her niteliği sıfırlayan
bir fonksiyon. Kaynak metin bu verinin yalnızca istatistiksel bir araç
değil, kişiselleştirilmiş müşteri deneyimi sunmak için bir motor olduğunu
vurguluyor. Fayda ağırlıklarının hangi segmentte ne olduğu da yine
alışveriş verisinden, yani hangi segmentin hangi seçeneği gördüğünde neyi
seçtiğinden öğreniliyor.

## Ekran alanı kıt; dönüşümü çeşitlilik taşıyor

Sıralama tek başına yetmiyor, çünkü ekran sonsuz değil. Kaynak metin bunu
ekran alanı (real estate) olarak adlandırıyor: bir sorguya dönebilecek
seçenek sayısı sınırlı, ve o sınırlı alanın nasıl doldurulduğu rezervasyon
dönüşüm oranını (conversion rate) doğrudan etkiliyor.

Önerilen çözüm çeşitlilik (shopping diversity). Ekran; direkt uçuşlar, tek
veya çift aktarmalı seçenekler ve havayolları arası (interline)
seçeneklerin doğru karışımıyla doldurulmalı. En yüksek fayda değerine sahip
on seçenek birbirinin çok benzeri olabilir, örneğin aynı saatte kalkan ve
yalnızca bağlantı noktası farklı aktarmalı uçuşlar. Böyle bir ekran yolcuya
gerçekte tek bir seçenek sunuyor. Çeşitlilik, yolcunun aradığı şey listenin
başındaki seçenek değilse bile ekranda bir alternatif bulmasını sağlıyor.

Gidiş-dönüş sorgularında bu problem bir kat daha zorlaşıyor. Kaynak metne
göre sistem, alışveriş verisini kullanarak her gidiş segmenti için en uygun
dönüş çeşitliliğini belirliyor ve ekran alanını buna göre optimize ediyor.
Yani her gidiş seçeneğinin yanına aynı dönüş listesi eklenmiyor; hangi
gidişi seçen yolcunun hangi dönüş çeşitliliğine ihtiyaç duyduğu veriden
öğreniliyor.

## Alışverişin kendisi bir maliyet kalemi

Alışveriş verisinin büyük veri olmasının nedeni, sorgu sayısının
rezervasyon sayısından çok daha fazla olması. Her sorgu işlem gücü
tüketiyor, ve bu maliyet rezervasyona dönüşmeyen sorgular için de
ödeniyor. Altıncı kullanım alanı bu yüzden havayolunun ya da shopping
sağlayıcısının kendi altyapısıyla ilgili: alışveriş maliyetini düşürmek.

Kaynak metin performans ile doğruluk arasındaki dengenin hangi
parametrelerle kurulduğunu sayıyor: önbellek ömrü (cache time-to-live),
önbellek sonuçlarının kullanım sıklığı ve geri döndürülecek uçuş planı
sayısı. Bu parametreler alışveriş verisi üzerinde yapılan deneylerle
ayarlanıyor. Korunması gereken metrik ise rezervasyon yapılabilirlik
(book-ability): yolcuya gösterilen seçeneğin, seçildiğinde gerçekten o
fiyatla rezerve edilebilmesi.

Bu bir yazılımcının tanıdığı bir gerilim. Önbellek ömrü uzadıkça sorgu
başına maliyet düşüyor ama gösterilen fiyat ile gerçek envanter arasındaki
fark açılıyor; yolcu ekranda gördüğü fiyatı rezervasyon adımında
bulamıyor. Döndürülen seçenek sayısı azaldıkça yanıt hızlanıyor ama bir
önceki bölümdeki çeşitlilik daralıyor. Kaynak metnin önerisi bu
parametreleri sabit bir değere değil, veri setindeki gerçek
arama-rezervasyon oranlarına göre dinamik olarak ayarlamak. Çok aranıp az
satılan bir pazarda önbellek daha uzun yaşayabilir; sık rezerve edilen bir
pazarda bayat fiyatın bedeli daha yüksek.

## NDC'de karşılaştırma, önce normalize etmeyi gerektiriyor

Son kullanım alanı dağıtımın bugünkü dönüşümüyle ilgili. Geleneksel GDS
ekranında karşılaştırma görece kolaydı: seçenekler uçuş, saat ve fiyattan
oluşuyordu, ve bunlar birbiriyle yan yana konabiliyordu. NDC ile havayolları
markalı ücretler (branded fares) ve ek hizmetler (ancillaries) içeren
paketler sunmaya başladığında bu karşılaştırma bozuluyor. Bir havayolunun
bagajlı, koltuk seçimli paketi ile diğerinin bagajsız ama esnek değişiklikli
paketi aynı fiyat sütununda anlamlı biçimde sıralanamıyor.

Kaynak metnin önerisi, farklı içeriklerin karşılaştırılabilmesi için
normalize edilmiş çözümler geliştirmek. Mekanizma bir benzerlik puanı: bir
paket rezerve edildiğinde sistem diğer alternatifleri o pakete yüzde kaç
eşleştiğine göre, örneğin yüzde 90 eşleşme gibi bir puanla sıralıyor ve
acenteye karşılaştırma rehberliği sunuyor. Acente artık yalnızca fiyata
değil, fiyatın neyi içerdiğine de bakarak karşılaştırma yapabiliyor.

Yazılım tarafında bunun karşılığı, paket içeriğinin karşılaştırılabilir bir
şemaya indirgenmesi. Her havayolunun kendi adıyla sunduğu hakların (bagaj,
değişiklik, koltuk) ortak bir nitelik kümesine eşlenmesi gerekiyor;
benzerlik puanı ancak bu eşleme üzerinde hesaplanabilir. Bu da yukarıdaki
fayda değeri hesabıyla aynı temele dayanıyor: seçenekleri nitelik
vektörleri olarak görmek.

## Yarın işe yarayacak dört çıkarım

1. **Reddedilen seçenekleri modele sok.** Gelir yönetimi modellerini
   yalnızca gerçekleşen satış verisiyle değil, alışveriş verisinden gelen
   sunulan ama reddedilen seçeneklerle de güncelle. CCM ağırlıkları ve
   kısıtlanmamış talep ancak yolcunun neyi geri çevirdiği bilindiğinde
   sağlam kalibre edilir. Bunun ön koşulu shopping yanıtlarını, sunulan
   setin tamamıyla birlikte saklamak.
2. **NDC paketlerini benzerlik puanıyla karşılaştırılabilir kıl.** Farklı
   havayollarından gelen karmaşık paketleri acente için basitleştirmek
   üzere bir benzerlik puanlama sistemi kur. Önce paket içeriğini ortak bir
   nitelik kümesine eşle, sonra alternatifleri eşleşme yüzdesine göre sırala.
3. **Ekranı en ucuza göre değil, fayda ve çeşitliliğe göre doldur.** Sınırlı
   ekran alanını yönetirken alışveriş verisinin gösterdiği segment
   tercihlerine göre fayda değerini hesapla ve listeyi direkt, aktarmalı ve
   interline seçeneklerin dengeli bir karışımıyla oluştur.
4. **Önbellek ömrünü arama-rezervasyon oranına bağla.** Alışveriş
   maliyetini düşürmek için cache TTL değerlerini sabit bırakma; pazar
   bazında gerçek arama-rezervasyon oranlarına göre dinamik ayarla ve her
   değişikliğin book-ability oranına etkisini ölç.

Bu bölümde ne yok: kısıtlanmış talebin istatistiksel olarak geri
kazanılması ve spill hesabının kendisi (spill bölümleri), MIDT, DDS ve
diğer pazar veri setlerinin kapsam karşılaştırması ("Havayolu pazarlama
planlama süreci ve iş mantığı analizi"), NDC'nin dağıtım kanallarındaki
dönüşümü ("NDC@Scale: havacılık dağıtım kanallarında dönüşüm ve iş mantığı
analizi"). Teklif fiyatı ve O&D envanter kontrolünün nasıl hesaplandığı da
burada yok. Bu bölüm yalnızca bir şeyi göstermek için var: satılmayan
seçenek, satılan bilet kadar veri.
