---
title: "Gelir artışı ve tahmin doğruluğu: iki boyutlu zamanda talep tahmini"
domain: "aviation"
summary: "Gelir yönetiminde tahmin, perakendedeki satış tahmininden bir boyut fazlasıyla çalışır: aynı uçuş hem rezervasyonun yapıldığı günle hem kalkış günüyle indekslenir. Bu bölüm iki boyutlu zamanı, kısıtlanmamış talebin neden görünen satıştan geri hesaplandığını, tahmini besleyen değişkenleri ve tahminin toplam ya da kalan kurguyla envanter kararına nasıl dönüştüğünü anlatıyor."
audience: "Gelir yönetimi, envanter ya da teklif yönetimi sistemlerine veri sağlayan veya bu sistemlerin çıktısını tüketen yazılımcı ve ürün insanı. Spill bölümlerinin okunmuş olması işe yarar; booking curve, DTD, kısıtlanmamış talep, upsell ve recapture metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Spill bölümleri tek bir soruya odaklanıyordu: dolu kalkan uçuş kaç
yolcuyu kapıda bıraktı. Bu bölüm o sorunun neden sorulduğuna geri
çekiliyor. Kaynak metnin başlığı ilişkiyi doğrudan kuruyor: gelir artışı
ile tahmin doğruluğu birbirine bağlı. Sunumun kapağındaki not bu bağı
bir ölçekle veriyor: tahmin doğruluğundaki yüzde 1'lik bir artış,
havayolu ağında milyonlarca dolarlık gelir artışı sağlıyor.
**Gelir yönetiminde tahmin, geleneksel tahminlemeden bir boyut fazlasıyla
çalışır ve o boyutu kaybeden sistem, doğru ortalamayı yanlış günde
kullanır.** Satırların geri kalanı bu fazla boyutun ne getirdiğini ve
tahminin koltuk kararına nasıl indiğini anlatıyor.

![Sunumun kapak slaytı. Bir ızgara üzerinde, soldan sağa yükselen, kesişen lacivert ve turuncu dört eğri. Üst etiket: Havacılık Finansmanı ve Analitik. Başlık: Havacılıkta Gelir Yönetimi Tahminlemesi. Alt başlık: Geleneksel Modellerden İki Boyutlu Zaman Çerçevesine Geçiş ve Talep Optimizasyonu. Alttaki domain notu: havacılık gelir yönetimi doğru koltuğu doğru müşteriye, doğru zamanda ve doğru fiyata satma matematiğidir; envanter ve teklif yönetimi akışlarını doğrudan etkiler; tahmin doğruluğundaki yüzde 1'lik bir artış havayolu ağında milyonlarca dolarlık gelir artışı sağlar.](/decks/revenue-improvement/01.webp "Eğriler aynı noktadan çıkıp farklı hızlarda yükseliyor ve kesişiyor: bölümün geri kalanı, hangi eğrinin hangi uçuşa ait olduğunu ayırt etme işi.")

## Talep tahmininin zamanı tek eksenli değil

Perakendede tahmin tek bir zaman ekseninde yürüyor: ürün rafa çıkıyor,
satılıyor, satış verisi doğrusal bir seriye dönüşüyor, bir sonraki dönem
o seriden tahmin ediliyor. Kaynak metin havacılığı tam bu noktada
ayırıyor: havacılıkta talep tahmini geleneksel tahminden farklı, çünkü
zaman için iki boyutun birlikte hesaba katılması gerekiyor, rezervasyon
zamanı ve kalkış tarihi.

Fark şu: bir uçuşun satışı, uçuş gerçekleşmeden haftalar, aylar önce
başlıyor. Bugün yapılan her rezervasyon, gelecekteki farklı kalkış
günlerinden birine düşüyor. Dolayısıyla tahminin sorusu yalnızca "bu
uçuşa kaç kişi binecek" değil, "bu uçuşa kalkışa şu kadar gün kala kaç
kişi rezervasyon yapmış olacak". Brifing bunu stratejinin temel yapı
taşı olarak koyuyor: ne kadar satılacağıyla ne zaman satılacağı
arasındaki dinamik ilişki.

![Başlık: Zaman Algısındaki Paradigma Değişimi. Alt başlık: gelir yönetimini geleneksel tahminlemeden ayıran en temel fark zamanın iki boyutlu işlenmesidir. Sol kutu, Geleneksel Tahminleme (1 Boyutlu): tek bir yatay ok; maddeler tek boyutlu zaman akışı, doğrusal satış verisi, sabit ürün lansmanı ve tüketim döngüsü. Sağ kutu, Havacılık Gelir Yönetimi (2 Boyutlu): yatay ekseni Rezervasyon Zamanı, dikey ekseni Uçuş Tarihi olan bir nokta bulutu; maddeler iki boyutlu zaman çerçevesi gerekliliği, boyut 1 rezervasyonun yapıldığı an, boyut 2 uçuşun gerçekleşeceği tarih, anlık rezervasyonların sürekli sentezi. Sağdaki domain notu: PNR oluşturma ve AirShopping akışlarında kritik rol oynar; bir teklif yönetimi sistemi yalnızca bugüne değil, rezervasyon tarihi (örneğin AP-14) ile kalkış tarihinin kesişimine bakarak 300'den fazla gelecek uçuşu aynı anda sorgular.](/decks/revenue-improvement/02.webp "Sağdaki grafikte her nokta iki koordinat taşıyor. Veri modelinde de öyle olmalı: kalkış tarihi olmayan bir rezervasyon kaydı tahmine girdi olamaz.")

Yazılım tarafında bunun karşılığı veri modelinde başlıyor. Tahmin
motorunun okuduğu tablo, rezervasyon olaylarının düz bir akışı değil;
her kayıt hem işlem tarihini hem uçuş tarihini taşımak zorunda ve
sorguların doğal anahtarı ikisinin farkı, yani kalkışa kalan gün.
Slayttaki not bunun ölçeğini de veriyor: bir teklif yönetimi sistemi,
tek bir arama anında 300'den fazla gelecek uçuşu, her birini kendi
rezervasyon-kalkış kesişiminde sorguluyor. Tek eksenli bir zaman serisi
tablosu bu sorguyu taşıyamaz.

## Tahmin bir sayı değil, bir eğri

İki boyutlu zamanın pratik biçimi rezervasyon eğrisi (booking curve).
Aynı uçuş numarasının farklı kalkış günleri için, kalkışa kalan gün
sayısına göre birikmiş talep çiziliyor. Eğriler uzun süre yatay gidiyor,
kalkışa yaklaştıkça dikleşiyor. Havayolunun elinde tek bir "beklenen
yolcu" sayısı değil, her kalkış günü için bu eğrinin beklenen biçimi var.

Brifingin önerdiği karar mantığı bu eğriyi ölçüt olarak kullanıyor.
Sistem, kalkışa kalan gün sayısında (days to departure, DTD) mevcut
rezervasyon hızını geçmiş yılların aynı noktadaki hızıyla
karşılaştırıyor. Mevcut hız geçmiş ortalamanın üzerindeyse, uçuş
beklenenden hızlı doluyor demek; sistem yüksek ücretli sınıflara daha
fazla yer ayırıp alt sınıfları kapatma yönünde karar veriyor. Yavaşsa
tersi.

![Başlık: Rezervasyonların Seyri (Booking Curve). Alt başlık: aynı uçuş için farklı kalkış tarihlerindeki rezervasyon hızının (pace of bookings) görselleştirilmesi. Grafikte yatay eksen Uçuşa Kalan Gün Sayısı, 104'ten 0'a; dikey eksen Talep Miktarı. Beş eğri: 1, 8, 15, 22 ve 29 Haziran kalkışları; hepsi uzun süre düz gidip son 20 günde dikleşiyor, 1 Haziran en üstte, 29 Haziran en altta bitiyor. Sağda turuncu daire, Kapanışa Doğru Hızlanma: uçuşa yaklaştıkça rezervasyon hızı artar; sistemler geçmiş uçuşların verilerini ve mevcut eğilimleri kullanarak geleceği tahmin eder. Alttaki domain notu: eski envanter sistemlerinde (TPF, mainframe) uçuşa kalan gün (DTD) kritik bir indekstir; optimizasyon algoritmaları gerçekleşen rezervasyon eğrisini (actual) tahmin edilen eğriyle (forecast) karşılaştırarak otomatik fiyat (bid price) güncellemelerini tetikler.](/decks/revenue-improvement/03.webp "Eğrilerin çoğu son 20 günde ayrışıyor. Erken dönemde birbirine bu kadar yakın duran eğriler, hız karşılaştırmasının neden ortalamaya değil DTD'ye göre yapılması gerektiğini gösteriyor.")

Slayttaki not mekanizmanın sistem tarafını da söylüyor: eski envanter
sistemlerinde DTD kritik bir indeks ve optimizasyon, gerçekleşen eğriyle
tahmin edilen eğriyi karşılaştırıp bid price güncellemelerini tetikliyor.
Mühendislik açısından bu, tahminin tek seferlik bir batch çıktısı
olmadığı anlamına geliyor. Tahmin eğrisi bir referans; asıl olay
gerçekleşenin o referanstan sapması. Sapmayı DTD noktalarında izlemeyen
bir sistem, eğrinin sonunda, yani artık müdahale için geç kalınan son
günlerde fark ediyor.

## Talebi yalnızca geçmiş satış açıklamıyor

Eğrinin biçimini belirleyen şey yalnızca aynı uçuşun geçmişi değil.
Brifing ve slaytlar tahmini besleyen değişkenleri beş başlıkta topluyor:
o ana kadarki kesin rezervasyonlar, haftanın günü, sezonsallık, ilişkili
uçuşların talebi ve özel etkinlikler.

Haftanın günü iki ayrı değişken. Biri kalkış günü: brifing iş günleriyle
hafta sonu uçuşları için ayrı talep desenleri tanımlanmasını istiyor.
Örneği Pazartesi sabah uçuşu; iş seyahati ağırlıklı olduğu için esneklik
talebi yüksek ve sistem bu uçuşlarda son ana kadar koltuk saklama
eğiliminde. Öteki satın alma günü. Slayttaki not bunu ince bir detay
olarak işaretliyor: iş seyahati yapanlar genellikle Salı ve Çarşamba
öğleden sonraları rezervasyon yaparken tatilciler hafta sonlarını tercih
ediyor. Yani aynı kalkış gününün eğrisi, hangi hafta gününde satış
aldığına göre farklı bir yolcu karışımını işaret edebiliyor.

Sezonsallıkta da aynı ikilik var: uçuşun ayı ya da çeyreği ile satın
almanın yapıldığı ay ya da çeyrek. İlişkili talep, aynı saat profiline
sahip diğer uçuşlardaki hareket; brifing benzer karakteristikteki
uçuşların korelasyonunu modellerin temel girdileri arasında sayıyor.
Özel etkinlikler ise takvim dışı sıçramalar.

![Başlık: Talep Tahminini Şekillendiren Bağımsız Değişkenler. Alt başlık: bir uçuşun talebi sadece geçmiş satışlara değil, birbiriyle ilişkili birçok veri noktasına bağlıdır. Solda beş kutu, çizgilerle sağdaki Tahminleme Motoru dairesine bağlanıyor: 1, mevcut rezervasyonlar (bookings to date), o ana kadar gerçekleşen kesin satışlar; 2, haftanın günleri (day of week), hem kalkış günü hem satın alma işleminin yapıldığı gün; 3, sezonsallık, uçuşun ve satın almanın yapıldığı ay veya çeyrek; 4, ilişkili talep, aynı saat profiline sahip diğer uçuşlardaki talep hareketleri; 5, özel etkinlikler, dönemsel sıçrama yaratan takvim dışı etkenler. Alttaki domain notu: satın alma işleminin yapıldığı gün ince bir detaydır; iş seyahati yapanlar genellikle Salı ve Çarşamba öğleden sonraları rezervasyon yaparken tatilciler hafta sonlarını tercih eder; ilişkili talep ikame uçuşlardaki taşmaları (overflow) hesaplar.](/decks/revenue-improvement/04.webp "İkinci ve üçüncü kutu ikişer değişken saklıyor: biri kalkışa, biri satın almaya ait. İki boyutlu zaman değişkenlerin içine de işliyor.")

Brifingin çıkarımlarından biri buraya düşüyor: özel etkinlikler ve
tatil dönemleri standart modelin dışına çıkıyor, bu yüzden onlar için
manuel ya da olay bazlı ayrı bir düzeltme katmanı kurulması gerekiyor.
Yazılım tarafında bu katmanın ayrı durması önemli. Bir konser ya da
fuar haftasının etkisi temel modelin katsayılarına karışırsa, ertesi
yıl etkinlik olmayan aynı haftada model hayali bir talep görüyor.
Düzeltmeyi temel tahminin üzerine binen, adı ve tarih aralığı olan bir
kayıt olarak tutmak, hem geri alınabilir hem denetlenebilir kılıyor.

## Görünen satış talebin kendisi değil

Tahmin modelinin kalibre edileceği veri, ilk bakışta satış geçmişi gibi
görünüyor. Kaynak metin bunun yetmediğini açıkça söylüyor: tahmin
modellerinin kalibrasyonu kısıtlanmamış talebi, yani gerçek talebi
gerektiriyor ve buna bir rezervasyon sınıfı satışa kapalı olduğu için
kaybedilen müşteriler de dahil.

Sebep basit. Bir sınıf satışa kapandığı anda o sınıfın satış kaydı
duruyor; talep durmuyor. Slayttaki not örneği veriyor: bir sınıf
kalkışa 10 gün kala kapanırsa rezervasyon sıfır görünür, ama talep sıfır
değildir. Kapanmış sınıfın sıfırlarıyla eğitilen bir model, bir sonraki
dönem o sınıfa daha az talep bekliyor, sınıfı daha az koruyor ya da daha
erken kapatıyor ve kendi kısıtını kendi girdisine çeviriyor. Brifingin
ifadesiyle kaybedilen talebi veri setine katmak, satış verisinin
yanıltmasını önlemenin ve gerçek pazar ihtiyacını görmenin yolu.

![Başlık: Kısıtlanmamış Talep Kurgusu (Unconstrained Demand). Alt başlık: tahmin modellerinin kalibrasyonu için sadece bilet alanları değil, almak isteyip de alamayanları da hesaplamak zorunludur. Bir denklem: Görünen Satış (açık rezervasyon sınıflarındaki gerçekleşmiş kesin satışlar) artı Reddedilen Talep, Spill (rezervasyon sınıfı kapalı olduğu için bilet alamayan ya da kaybedilen yolcular) eşittir Kısıtlanmamış Talep (hiçbir kapasite ve envanter kısıtlaması olmasaydı oluşacak gerçek talep). Ortadaki kutu: tahmin modellerinin ilk adımı envanterin açılış ve kapanış (open/close) bilgilerini kullanarak kısıtlanmamış talebi hesaplamaktır. Alttaki domain notu: gelir yönetimindeki en zor matematiksel problem budur; bir sınıf 10 gün kala kapanırsa rezervasyon sıfır görünür ama talep sıfır değildir; beklenti maksimizasyonu (EM) gibi algoritmalar ve yolcu hizmet sisteminden (PSS) gelen open/close zaman damgaları kullanılarak bu talep yeniden inşa edilir.](/decks/revenue-improvement/05.webp "Denklemin ortasındaki terim hiçbir sistemde kayıt olarak durmuyor: görünen satıştan ve sınıfın ne zaman kapalı kaldığından geri hesaplanıyor.")

Geri hesabın hammaddesi sınıfın açık ve kapalı olduğu zaman aralıkları.
Slayt bunu tahmin modelinin ilk adımı olarak koyuyor: envanterin
açılış-kapanış bilgisini kullanarak kısıtlanmamış talebi hesaplamak;
not da beklenti maksimizasyonu (EM) gibi algoritmaları ve PSS'ten gelen
open/close zaman damgalarını anıyor. Buradan çıkan mühendislik kuralı
net: sınıf durumu değişikliklerini zaman damgasıyla saklamayan bir
envanter sistemi, tahmin tarafının en önemli girdisini üretmiyor. Anlık
durumu tutmak yetmiyor; durumun geçmişi gerekiyor.

Brifing bir adım daha öneriyor: sınıf kapalıyken gelen arama trafiğini
analiz etmek. Kullanıcı web sitesinde aradığı sınıfı bulamayıp
ayrıldığında, sistem gerçekleşmeyen satışı yetersiz kapasite olarak
kodluyor ve bu talebi potansiyel satış olarak gelecekteki modele
ekliyor. Aramayı talep sinyali olarak kullanmak, zaman damgalarından
yapılan istatistiksel geri hesaba doğrudan bir gözlem ekliyor. Spill
bölümlerindeki modeller bu geri hesabın dağılım tarafını ayrıntılı
işliyordu; burada görünen, o hesabın tahmin zincirinde nereye oturduğu:
en başa.

## Kaybedilen yolcu her zaman kaybedilmiyor

Kısıtlanmamış talep hesaplandıktan sonra bir soru daha kalıyor: kapanan
sınıfın reddettiği yolcu nereye gitti? Slayt iki bağımlı talep metriği
adlandırıyor ve tüm modellerin tahmin doğruluğunu artırmak için bunlarla
entegre çalıştığını söylüyor: yukarı satış (upsell) ve geri kazanım
(recapture).

Upsell, alt sınıf kapandığında yolcunun bir üst sınıftan bilet alma
eğilimi. Brifingin karar mantığı şöyle: sistem geçmiş veride alt sınıf
kapandığında müşterilerin yüzde kaçının bir üst fiyat kategorisinden
bilet aldığını hesaplıyor. Bu oran yüksekse alt sınıfları daha erken
kapatmak toplam geliri artırıyor, çünkü reddedilen yolcunun önemli bir
kısmı kaybolmuyor, daha pahalı bilete geçiyor.

Recapture, kaybedilen yolcunun rakibe gitmek yerine aynı havayolunun
başka bir uçuşunu seçmesi. Brifing bunu benzer özellikteki uçuşlar,
yani yakın kalkış saati ve aynı varış noktası arasındaki korelasyonla
yönetmeyi öneriyor: bir uçuşun taşan talebi, ötekinin boş kapasitesine
yönlendiriliyor; bu süreçte yolcunun sadakat programı seviyesi ve bilet
tipi belirleyici kriter olabiliyor. Tahmin değişkenleri arasındaki ilişkili talep
değişkeni de bu yüzden var: ikame uçuşlardaki taşmayı hesaplamak için.

![Başlık: Talep Tahmini Model Kategorileri. Alt başlık: iki boyutlu zaman çerçevesinde kısıtlanmamış talep verisini işleyen ana analitik yaklaşımlar. Üç kart. 1, Zaman Serisi (Time Series): geçmiş verilerin kronolojik analizine dayanır, sadece tarihsel trendlerin geleceğe projeksiyonunu sağlar. 2, Nedensel (Causal ve Choice): müşteri tercih modellerini içerir, fiyat, rekabet ve dış faktörlerin etkisini ölçer. 3, Kombine Modeller (Combined): farklı tahmin yaklaşımlarının güçlü yönlerini birleştiren entegre tahminleme sistemleri. Kartların altındaki turuncu kutu, bağımlı ve bağımsız talep metrikleri: tüm modeller tahmin doğruluğunu artırmak için yukarı satış (upsell) ve geri kazanım (recapture) metrikleri ile entegre çalışır. Alttaki domain notu: recapture kaybedilen yolcuların ne kadarının rakibe gitmek yerine aynı havayolunun bir sonraki uçuşunu seçeceğini ölçer; upsell kapanan alt sınıf yerine üst sınıftan bilet alma eğilimidir; modern müşteri seçim modelleri (CCM) bu bağımlı talep senaryolarını olasılıksal olarak yönetir.](/decks/revenue-improvement/06.webp "Turuncu kutu üç kartın hepsinin altından geçiyor: hangi model seçilirse seçilsin, sınıflar arası ve uçuşlar arası kayma hesaba girmeden tahmin eksik kalıyor.")

Model seçimi de bu ayrımla ilgili. Kaynak metin tahminin karma
yöntemlerle yürüdüğünü söylüyor: zaman serisi yöntemleri, regresyon ya
da nedensel yöntemler ve müşteri seçim modelleri. Zaman serisi yalnızca
geçmiş trendi ileri taşıyor; bir sınıfın kapanmasının yolcuyu nereye
ittiğini bilmiyor. Seçim modelleri fiyatın, rekabetin ve açık
alternatiflerin etkisini ölçüyor; slayttaki not modern seçim
modellerinin bağımlı talep senaryolarını olasılıksal olarak yönettiğini
söylüyor. Yazılım tarafında bunun anlamı şu: talebi sınıf başına
birbirinden bağımsız sayılar olarak modelleyen bir veri yapısı upsell ve
recapture'ı ifade edemiyor. Sınıflar ve uçuşlar arasında geçiş
olasılıklarını taşıyabilecek bir model gerekiyor.

## Tahmin ancak envanter kararına dönünce gelir üretiyor

Tahminin kendisi hiçbir koltuğu kapatmıyor. Zincirin son halkası onu
bilet sınıfı tahsisine çeviren optimizasyon. Kaynak metin burada
optimizasyona iki giriş noktası tanıyor: gelir yönetimi indirim tahsis
modelleri, kalkıştaki toplam talep ve toplam kapasiteyle ya da kalan
talep ve kalan kapasiteyle çalışabiliyor.

İki kurgu aynı soruyu iki farklı anda soruyor. Toplam kurgu uçuşun
tamamına bakıyor: kalkışta beklenen toplam talep, uçağın toplam
kapasitesi. Kalan kurgu ise bugünden bakıyor: bugünden kalkışa kadar
gelmesi beklenen talep ve henüz satılmamış koltuklar. Brifing bunu
optimizasyonun hangi veri noktalarında karar verebileceğine dair
operasyonel bir esneklik olarak sunuyor. Pratikte kalan kurgu, rezervasyon
eğrisinin ürettiği sapma sinyaliyle doğal olarak birleşiyor: her DTD
noktasında kalan talep yeniden tahmin ediliyor, kalan kapasiteyle
yeniden karşılaştırılıyor.

![Başlık: Tahminden Aksiyona, Envanter Kontrolü ve Optimizasyon. Alt başlık: elde edilen tahmin, geliri maksimize etmek için sistemdeki bilet sınıfı tahsisine dönüştürülür. Akış şeması: en üstte Talep Tahmini (Demand Forecast) kutusu iki kola ayrılıyor, Toplam Kurgu (toplam beklenen talep ve toplam kapasite) ile Kalan Kurgu (kalan talep ve kalan kapasite). İki kol birleşip turuncu İndirim Tahsisi (Discount Allocation) kutusuna iniyor; oradan en alttaki Bacak / Segment Envanter Kontrolü (Leg/Segment Inventory Control) kutusuna: hangi rezervasyon sınıflarının açılıp kapanacağına karar verilerek gelir maksimizasyonu sağlanır. Alttaki domain notu: bacak (leg) tek bir fiziksel uçuştur (örneğin IST-LHR); segment (O&D) ise tüm yolculuğu kontrol eder; modern sistemler network bid price (bir koltuğu açmak için gereken minimum gölge fiyat) kullanarak rezervasyon sistemine (Amadeus, Sabre) hangi RBD'lerin açık kalacağını anlık iletir.](/decks/revenue-improvement/07.webp "Akışın en altında karar bir açık/kapalı listesi oluyor. Yukarıdaki bütün tahmin katmanları, rezervasyon sisteminin göreceği tek şey olan bu listeye iniyor.")

Son adım envanter kontrolünün hangi birimde yapıldığı. Bacak (leg) tek
bir fiziksel uçuş; slayttaki örnekle IST-LHR. Segment ya da O&D ise
yolcunun bütün yolculuğu. Brifing gelir maksimizasyonu için segment
bazlı tahmin öneriyor: bir bacaktaki koltuğun, o bacağı toplam rotada
daha yüksek gelir getiren bir aktarmalı yolcu tarafından kullanılıp
kullanılamayacağı analiz edilerek tahsis yapılmalı. Yalnızca bacağa
bakan bir kontrol, o bacaktaki yerel yolcuyla aynı bacağı geçen aktarmalı
yolcuyu ayırt edemiyor.

Slayttaki not bunun bugünkü mekanizmasını da anıyor: modern sistemler
network bid price, yani bir koltuğu açmak için gereken en düşük gölge
fiyatı kullanarak rezervasyon sistemine hangi RBD'lerin açık kalacağını
anlık iletiyor. Buradan çıkan mimari gözlem şu: tahmin, optimizasyon ve
envanter üç ayrı sistem olabilir ama aralarındaki sözleşme tek yönlü bir
rapor değil. Envanterin açık/kapalı geçmişi tahmine geri akıyor
(kısıtlanmamış talep için), tahmin optimizasyona akıyor, optimizasyonun
kararı envantere dönüyor. Döngünün herhangi bir yerinde zaman damgası ya
da DTD bilgisi düşerse, bir sonraki turun tahmini bozuk veriyle
başlıyor.

## Yarın işe yarayacak beş çıkarım

1. **Kalibrasyonu kısıtlanmamış talep üzerinden yap.** Tahmin modelini
   yalnızca gerçekleşen rezervasyonlarla değil, sınıfın kapalı olduğu
   dönemlerde reddedilen talebi de geri hesaplayarak kalibre et. Bunun
   için envanterdeki sınıf açılış-kapanış olaylarını zaman damgasıyla
   sakla; anlık durum yetmez.
2. **Rezervasyon ve kalkış tarihini aynı kayıtta işle.** Tahmin
   motorunun veri modeli iki zamanı eşzamanlı taşısın ve sorgular
   kalkışa kalan gün üzerinden kurulsun. Gerçekleşen eğriyi tahmin
   edilen eğriyle DTD noktalarında karşılaştır; sapmayı kalkışın son
   günlerinde değil, oluştuğu noktada yakala.
3. **İlişkili uçuşların talep geçişkenliğini ölç.** Aynı kalkış günü ve
   benzer saat profilindeki uçuşlar arasındaki korelasyonu izle ki bir
   uçuş dolduğunda diğerine yönelecek talep (recapture) önceden
   planlanabilsin. Aynı veri, alt sınıf kapandığında üst sınıfa geçen
   yolcu oranını (upsell) da hesaplamak için kullanılır.
4. **Özel etkinlikleri ayrı bir katmanda tut.** Tatil dönemleri ve özel
   etkinlikler için temel modelin dışında, manuel ya da olay bazlı bir
   düzeltme katmanı kur. Etkinliğin etkisi temel modelin katsayılarına
   karışırsa, etkinliğin olmadığı yıl da aynı haftada talep görülür.
5. **Haftanın gününü iki değişken olarak modelle.** Kalkış günü ile
   satın alma günü farklı yolcu karışımlarını işaret ediyor: iş
   seyahati hafta içi öğleden sonraları, tatilciler hafta sonları
   rezervasyon yapıyor. İkisini tek bir gün değişkenine indirgeme.

Bu bölümde ne yok: reddedilen talebin dağılımının nasıl kurulduğu,
Boeing, Gamma ve Cox modelleri ve LFCF ile CV kalibrasyonu (spill
bölümleri); indirim tahsisinin kendi matematiği ve kapasitenin planlama
döngüsündeki yeri ("Havayolu pazarlama planlama süreci ve iş mantığı
analizi" bölümü). Bu bölüm tahminin neden iki boyutlu olduğunu,
kalibrasyonun neden görünen satışla yapılamadığını ve tahminin envanter
kararına hangi yoldan indiğini göstermek için var.
