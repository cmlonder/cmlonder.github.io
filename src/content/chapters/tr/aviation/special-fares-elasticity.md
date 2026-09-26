---
title: "Havacılıkta özel ücretler ve fiyat esnekliği"
domain: "aviation"
summary: "Tek fiyatla satan havayolu, o fiyattan fazlasını ödeyecek yolcuyla daha azını bekleyen yolcunun parasını masada bırakıyor. Bu bölüm o parayı toplamanın iki aracını anlatıyor: belirli segmentlere kilitlenen özel ücretler ve kalkışa kalan süreye göre değişen fiyat esnekliği."
audience: "Ücret dosyalama, teklif ya da gelir yönetimi sistemleriyle çalışan, fiyatın neden tek bir sayı olmadığını anlamak isteyen yazılımcı ve ürün insanı. Private fare, PTC, gerçekleşmemiş gelir, fiyat esnekliği ve çapraz fiyat esnekliği metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Bir uçağın koltukları aynı, yolcuları değil. Kimi o koltuk için 200 dolar
ödemeye razı, kimi 50 doların üstünde hiç düşünmüyor; kimi aylar önce
bakıyor, kimi kalkıştan iki gün önce zorunlu olarak alıyor. Havayolu bu
insanların hepsine tek fiyat gösterirse bir kısmından eksik para alıyor,
bir kısmını hiç göremiyor. **Fiyatlandırmanın işi doğru fiyatı bulmak değil,
aynı koltuğa birden çok fiyat koyup her yolcuyu kendi fiyatında
yakalamak.** Bu bölüm bunun iki aracını anlatıyor. Birincisi özel ücretler:
herkese açık olmayan, belli bir segmente kilitlenmiş fiyatlar. İkincisi
fiyat esnekliği: talebin fiyata ne kadar tepki verdiğini ölçen ve kalkışa
yaklaştıkça değişen sayı.

![Sunumun kapak slaytı. Arka planda ızgara üzerinde soldan sağa inen turkuaz bir talep eğrisi ve eğrinin altında basamak basamak alçalan açık renkli sütunlar. Başlık: Havayolu Fiyatlandırma Ekonomisi. Alt başlık: Gelir Optimizasyonunun Arkasındaki Matematik ve Talep Esnekliği. Alttaki uzman notu: bu sunum teklif yönetimi ve gelir yönetimi kavramlarının merkezini oluşturur; modern havayolları statik ATPCO ücret dosyalamasından, sonsuz fiyat noktası mantığını temel alan dinamik fiyatlandırma motorlarına geçiyor.](/decks/special-fares-elasticity/01.webp "Eğrinin altındaki basamaklara bak: bölümün bütün argümanı, o basamakların sayısının neden artması gerektiği.")

## Tek fiyat, iki yönden para kaybettiriyor

Kaynak metin sorunu gerçekleşmemiş gelir (unrealized revenue) adıyla
koyuyor. Tek bir fiyat noktası seçildiğinde iki grup dışarıda kalıyor. İlki
o fiyattan fazlasını ödemeye razı olan yolcu: bileti alıyor ama ödeyebileceği
farkı havayoluna bırakmıyor. İkincisi o fiyatı yüksek bulan yolcu: bileti hiç
almıyor, oysa daha düşük bir fiyattan koltuk yine de boş gitmeyecekti. İki
grubun toplamı, talep eğrisinin altında kalan ama kasaya girmeyen alan.

Sunumdaki grafik bunu bir dikdörtgenle anlatıyor. Sol grafikte tek fiyat
noktası seçilmiş ve talep eğrisinin altında tek bir koyu blok kalıyor; bloğun
üstündeki ve sağındaki taralı alanlar kayıp gelir. Slayttaki örnek etiket 75
dolardan 40 yolcu, yani 3.000 dolar diyor (blok grafikte 100 dolar hizasına
çizilmiş; sayılarla şekil birebir örtüşmüyor, ama anlatılan fikir aynı). Sağ
grafikte aynı eğrinin altı dokuz ayrı fiyat basamağıyla dolduruluyor ve
eğriyle basamaklar arasında yalnızca küçük turuncu üçgenler kalıyor.

![Başlık: Fiyatlandırmada Kayıp Gelir Problemi. Alt başlık: tek bir fiyat noktası masada para bırakır, geliri maksimize etmek için talebe göre ayarlanmış ve envanter kontrollü çoklu fiyat noktalarına ihtiyaç vardır. Sol grafik, ücret ekseni 50 ile 200 dolar arasında, talep ekseni 20 ile 80 arasında: tek fiyat noktası (örnek: 75 dolar çarpı 40 eşittir 3.000 dolar) koyu bir dikdörtgen olarak gerçekleşen geliri gösteriyor; eğrinin altında kalan taralı turuncu alanlar kayıp (gerçekleşmeyen) gelir olarak işaretli. Sağ grafik: aynı eğrinin altı yeşil basamaklarla, yani çoklu fiyat noktalarıyla dolduruluyor, eğriyle basamaklar arasında yalnızca küçük turuncu üçgenler kalıyor; altta not: farklı müşteri segmentlerini yakalayarak gerçekleşmeyen geliri minimize eder. Uzman notu: grafikler PSS içindeki envanter kontrolünün fiziksel gösterimidir; havayolları Y, B, M, H, Q gibi farklı rezervasyon sınıfları (RBD) için farklı ücretler belirler ve eğrinin altındaki alanı büyütüp merdiven etkisi yaratmak için bu sepetleri açıp kapatır.](/decks/special-fares-elasticity/03.webp "Sağ grafikteki turuncu üçgenler basamak sayısı arttıkça küçülüyor. Hiçbir zaman sıfır olmuyorlar; sorulması gereken, onları küçültmenin neye mal olduğu.")

Kaç basamak gerektiği sorusunun teorik cevabı rahatsız edici: sonsuz.
Gerçekleşmemiş gelirin tamamını toplamak için her yolcunun ödemeye razı
olduğu fiyatın ayrı bir basamak olması gerekiyor. Pratikte bu sonsuzluk
envanter kontrolüyle yönetiliyor. Slaytın uzman notu mekanizmayı adıyla
söylüyor: havayolu Y, B, M, H, Q gibi rezervasyon sınıflarına farklı
ücretler bağlıyor ve bu sınıfları açıp kapatarak merdiveni kuruyor. Kapak
slaytının notu da yönü gösteriyor: statik ATPCO ücret dosyalamasından,
sonsuz fiyat noktası mantığını esas alan sürekli fiyatlandırma motorlarına
geçiş.

Yazılım tarafında bunun karşılığı şu: harf harf sınıf listesi, sonsuz fiyat
fikrinin sonlu bir yaklaşımı. Sınıf sayısı bir iş kararı değil, sistemin
çözünürlüğü. Sabit sayıda RBD'ye göre kurulmuş bir veri modeli, dinamik
fiyatlandırmaya geçildiği gün "fiyat bir sınıfın özelliğidir" varsayımını
kaybediyor; fiyat ayrı hesaplanan bir değer, sınıf ise onun taşıyıcısı
oluyor.

## Özel ücret, fiyatı değil görünürlüğü kısıtlıyor

Basamakları çoğaltmanın bir yolu herkese aynı merdiveni göstermemek.
Yayınlanmamış ücretler (private fares) havayolu ile seyahat acentesi
arasında müzakere edilen, kamuya açık olmayan fiyatlar. Kaynak metin bu
alanın kilit noktasını Crandall'a (1998) dayandırıyor ve Türkçesiyle şunu
söylüyor: temel mesele, rezervasyon sistemi ücretlerin erişilebilirliğini
kontrol edebiliyorsa, bütün müşteri segmentlerini hedeflemek için ücret
dosyalayabilmek.

Cümlenin ağırlığı ikinci yarısında değil, koşulunda. Özel ücret dosyalamak
kolay; zor olan o ücretin yalnızca hedeflenen segmente görünmesi. Özel ücret
yanlış ekrana düştüğü anda merdivenin alt basamağı olmaktan çıkıp herkesin
ödediği fiyata dönüşüyor ve üstündeki basamakların gelirini yiyor. Yani
buradaki kısıt fiyat üzerinde değil, erişilebilirlik (availability) üzerinde.

Slaytın uzman notu bu kontrolün nasıl kurulduğunu gösteriyor: özel ücretler
standart GDS dağıtımını atlayarak, acenteye özel PCC (Pseudo City Code)
yetkileriyle ATPCO üzerinden gizli olarak sunuluyor. Ücret dosyada duruyor
ama kimin göreceği bir yetki listesine bağlı.

![Başlık: Pazara Özel Ürünler, Temel Ücret Kategorileri. Üç kutu. Özel Ücretler (Private Fares): havayolu ve seyahat acentesi arasında müzakere edilen, kamuya açık olmayan (unpublished) özel fiyatlandırmalar; el sıkışan eller ve çanta simgesi. Acil Durum ve Cenaze Ücretleri (Bereavement Fares): yalnızca özel koşullarda sunulan ve biletleme öncesinde kesin doğrulama (validation) gerektiren ücret tipi; kalkanlı belge simgesi. Çocuk Ücretleri (Child Fares): bir yetişkin eşliğinde seyahat etme şartına bağlı olarak sunulan indirimli ücretler; yetişkin ve çocuk simgesi. Uzman notu: bu yolcu tipleri sistemlerde PTC (Passenger Type Code) olarak geçer, örneğin yetişkin için ADT, çocuk için CHD; özel ücretler standart GDS dağıtımını atlayarak acentelere özel PCC yetkileriyle ATPCO üzerinden gizli sunulur; cenaze ücretleri sipariş yönetimi aşamasında manuel ya da otomatik doğrulama gerektirir.](/decks/special-fares-elasticity/02.webp "Üç kutu üç farklı kapı bekçisi: soldakinde kanal, ortadakinde belge, sağdakinde başka bir yolcu. Fiyat ancak kapıdan geçince görünüyor.")

## İndirim bir kurala bağlı, kural ise başka bir veriye

Segment yalnızca acente üzerinden tanımlanmıyor; yolcunun kendisi de bir
segment. Kaynak metin iki örnek veriyor ve ikisi de indirimi bir koşula
bağlıyor.

Acil durum yas ücreti (emergency bereavement fare) ancak geçerli bir
doğrulama sağlandığında erişilebilir oluyor. Slayt bunu biletleme öncesinde
kesin doğrulama olarak tarif ediyor; uzman notu ise doğrulamanın sipariş
yönetimi aşamasında manuel ya da otomatik yapıldığını ekliyor. Yani fiyatı
açan şey arama anındaki bir parametre değil, sonradan gelen bir belge. Fiyat
teklif edilebiliyor ama belge gelmeden bilete dönüşmemeli.

Çocuk ücreti ise sistem tarafından yalnızca bir yetişkin eşlik ettiğinde
indirimli uygulanıyor. Sistemlerde bu ayrım yolcu tipi koduyla (PTC)
taşınıyor: yetişkin için ADT, çocuk için CHD. Kural tek bir yolcunun
kaydına bakarak doğrulanamıyor; aynı rezervasyondaki başka bir yolcuya
bakmak gerekiyor.

Mühendislik açısından bu iki örnek ücret kuralının nerede değerlendirildiği
sorusunu açıyor. Yas ücretinde kural zamana yayılıyor: arama anında
koşullu, biletleme anında kesin. Çocuk ücretinde kural yolculara yayılıyor:
tek satırlık bir kontrol değil, rezervasyon düzeyinde bir kısıt. Fiyatı tek
bir yolcu ve tek bir an için hesaplayan bir motor, iki kuralı da ya
atlıyor ya da yanlış yerde uyguluyor.

## Esneklik fiyatın hangi yöne gideceğini söylüyor

Merdivenin kaç basamak olacağı bir soru, basamakların nereye konacağı başka
bir soru. İkincisinin aracı fiyat esnekliği. Sunum esnekliği fiyattaki
yüzde 1'lik değişime karşılık talepteki yüzde değişim olarak tanımlıyor ve
işaretinin daima negatif olduğunu söylüyor: fiyat artınca talep düşüyor.
Asıl önemli olan mutlak değer, çünkü o fiyat artışının toplam geliri artırıp
artırmayacağını belirliyor.

Sunumun tablosu üç durum sayıyor. Esnek (elastic) talepte fiyat artarsa
gelir düşüyor, çünkü kaybedilen yolcu kazanılan farktan fazla. Birim esnek
(unit elastic) talepte gelir değişmiyor. Esnek olmayan (inelastic) talepte
fiyat artarsa gelir artıyor, çünkü yolcu fiyata rağmen kalıyor.

Burada dikkatli okumak gerekiyor. Hem brifing hem slayt esnek talebi
|ε| < 1, esnek olmayan talebi |ε| > 1 olarak yazıyor. Tablonun gelire etki
sütunu doğru, ama eşikler sunumun kendi tanımına göre ters. Yüzde 1'lik
fiyat değişimi talebi yüzde 1'den fazla oynatıyorsa (|ε| > 1) kaybedilen
yolcu kazanılan farktan ağır basar; talep esnektir ve fiyat artışı geliri
düşürür. Talep yüzde 1'den az oynuyorsa (|ε| < 1) esnek değildir ve fiyat
artışı geliri artırır. Birim esneklikte (|ε| = 1) iki etki birbirini
götürür.

![Başlık: Fiyat Esnekliği Matrisi, Fiyat Değişimlerine Tepki Ölçümü. Alt başlık: fiyat esnekliği, fiyattaki yüzde 1'lik bir düşüşe karşılık talepteki yüzde değişim oranıdır (daima ε küçüktür 0), talebin fiyata ne kadar duyarlı olduğunu belirler. Üç satırlı tablo, sütunlar pazar durumu, matematiksel tanım ve fiyat artışının gelire etkisi. Esnek (elastic): mutlak ε küçüktür 1 yazılmış, fiyat artarsa gelir düşer, turuncu aşağı ok. Birim esnek (unit elastic): mutlak ε eşittir 1, fiyat artarsa gelir değişmez, gri çizgi. İnelastik (inelastic): mutlak ε büyüktür 1 yazılmış, fiyat artarsa gelir artar, yeşil yukarı ok. Alt not: log-log lineer ve yarı-log lineer dönüşümler, talep-fiyat ilişkisini kurmak ve kalibre etmek için kullanılan yaygın ekonometrik modellerdir. Uzman notu: O&D gelir yönetimi analistleri günlük envanter sepeti tahsislerini bu esneklik eğrilerine göre ayarlar; tatil amaçlı seyahatler yüksek esnekliğe sahipken son dakika kurumsal iş seyahatleri inelastiktir.](/decks/special-fares-elasticity/04.webp "Sağ sütundaki oklar doğru; orta sütundaki eşikler, başlıktaki tanıma göre yer değiştirmeli. Kodda bu satırı slayttan kopyalama.")

Bu küçük hata, tam da yazılımcının yakalaması gereken türden. Bir
fiyatlandırma kuralının içinde `if abs(e) > 1: fiyatı artır` yazan satır,
eşik ters çevrildiğinde derleniyor, testleri geçiyor ve en fiyat duyarlı
yolcuya zam yapıyor. Esnekliği hesaplayan modülle onu kullanan kuralın
aynı tanımı paylaştığını bir birim testiyle sabitlemek, tartışmayı bir kez
bitiriyor.

Slaytın alt notu esnekliğin nasıl ölçüldüğüne de değiniyor: talep-fiyat
ilişkisini kurmak ve kalibre etmek için log-log lineer ve yarı-log lineer
dönüşümler yaygın ekonometrik modeller. Uzman notu ise esnekliğin kimde
yüksek olduğunu söylüyor: tatil amaçlı yolcu fiyata duyarlı, son dakika
kurumsal iş yolcusu değil. Esneklik yolcunun kendisinden çok, yolculuğun
amacına bağlı.

## Aynı yolcunun esnekliği kalkışa yaklaştıkça düşüyor

Esnekliği tek bir sayı olarak ölçüp bırakmak cazip, ama kaynak metin bunu
açıkça reddediyor. Türkçesiyle şöyle diyor: fiyat esnekliği uçuşun ömrü
boyunca tipik olarak sabit değil, kalkışa kalan süreye göre değişiyor;
talep kalkıştan uzun süre önce oldukça esnek, kalkışa yaklaştıkça daha az
esnek.

Bunun sonucu doğrudan algoritmaya yansıyor. Gelir yönetimi modelleri
esnekliği tek bir değer olarak değil, kalkış öncesi belirli zaman dilimleri
için ayrı ayrı kalibre etmek zorunda. Aylar önce fiyata çok duyarlı olan
talep, kalkış günü yaklaştıkça fiyata aldırmayan bir talebe dönüşüyor.
Rezervasyon eğrisinin sonunda esneklik düştüğü için daha yüksek getiri o
dönemde mümkün oluyor.

![Başlık: Zaman Çizelgesinde Esneklik, Uçuş Yaşam Döngüsü. Alt başlık: sabit fiyat esnekliği modelleri bir uçuşun tüm yaşam döngüsü boyunca geçerli değildir; fiyat esnekliği kalkışa kalan süreye göre dinamik olarak değişir ve optimizasyon için kalkış öncesi spesifik zaman dilimlerine göre yeniden kalibre edilmelidir. Grafik: yatay eksen soldaki Aylar Önce'den sağdaki Kalkış Günü'ne uzanıyor, turkuazdan turuncuya dönen bir eğri önce yüksek seyredip ortada düşüyor ve sonra düz bir tabana oturuyor. Sol etiket: yüksek esneklik (elastic bölge), kalkıştan aylar önce talep fiyata son derece duyarlıdır. Sağ etiket: düşük esneklik (inelastic bölge), uçuş tarihi yaklaştıkça fiyat duyarlılığı azalır. Uzman notu: bu görselleştirme RM tahmin algoritmalarında kullanılan rezervasyon eğrilerini temsil eder; dinamik olarak değişen esneklik, ATPCO kategori kurallarındaki erken satın alma (advance purchase, AP) kısıtlamalarıyla fizikselleşir; örneğin 21 veya 14 günlük AP sınırına sahip biletler yüksek esnekliğe sahip tatil talebini yakalamak için tasarlanmıştır ve kalkış yaklaştıkça sistem tarafından otomatik olarak kaldırılarak geriye sadece pahalı ve inelastik ücretler bırakılır.](/decks/special-fares-elasticity/05.webp "Eğrinin kırıldığı orta bölgeye bak: 21 ve 14 günlük erken satın alma sınırları tam oraya, esnek talebin tükendiği yere konuyor.")

Slaytın uzman notu bu soyut eğrinin somut karşılığını veriyor: ATPCO
kategori kurallarındaki erken satın alma (advance purchase) kısıtları.
21 ya da 14 günlük erken satın alma sınırı taşıyan ücretler, esnek tatil
talebini yakalamak için tasarlanmış; kalkış yaklaştıkça sistem bu ücretleri
kendiliğinden kapatıyor ve geriye yalnızca pahalı, esnek olmayan talebe
yönelik ücretler kalıyor. Yani esneklik eğrisi yalnızca bir tahmin modeli
değil, ücret kurallarına gömülü bir takvim.

Yazılım tarafında bu şu anlama geliyor: esneklik parametresi bir uçuş ya da
pazar için tek bir kolon değil, kalkışa kalan gün dilimine göre indekslenmiş
bir tablo. Tek sayıyla çalışan bir model aylar önce fiyatı fazla yüksek,
son günlerde fazla düşük tutuyor; yani tam olarak yanlış iki yerde para
bırakıyor.

## Rakibin zammı senin talebini artırıyor

Esneklik tek bir ürünün kendi fiyatına tepkisini ölçüyor. Çapraz fiyat
esnekliği ise bir ürünün fiyatındaki değişimin başka bir ürünün talebini
nasıl etkilediğini ölçüyor. Kaynak metin ayrımı işaretle yapıyor:
Türkçesiyle, çapraz fiyat esnekliği negatifse iki ücret ürünü tamamlayıcı,
pozitifse ikame.

Tamamlayıcı ürün örneği uçuş ve otel paketi. Uçak bileti pahalanırsa otel
talebi de düşüyor, çünkü iki ürün birlikte alınıyor. İkame ürün örneği
rakip havayolunun benzer uçuşu. Rakip fiyat artırırsa senin talebin
artıyor, çünkü yolcu birinden vazgeçip ötekine geçiyor. Kaynak metnin iş
kuralı da buradan çıkıyor: sistem rakip fiyatlarındaki artışı kendi
talebini artıracak bir girdi olarak işlemeli.

![Başlık: Çapraz Fiyat Esnekliği, Rekabet ve Ortaklık. Alt başlık: bir ürünün fiyatındaki değişimin başka bir ürünün talebini nasıl etkilediğinin ölçümü. Sol kutu, uçak artı otel simgesi, Tamamlayıcı Ürünler (Negatif Çapraz Esneklik): iki ürün birbirini yedeklemez, aksine tamamlar; örnek: uçuş artı otel paketleri, uçak bileti fiyatı artarsa otel talebi de düşer. Sağ kutu, karşı karşıya duran iki turuncu kuyruk simgesi, İkame Ürünler (Pozitif Çapraz Esneklik): benzer niteliklere sahip ürünler birbiriyle rekabet eder; örnek: rakip havayolunun benzer uçuşu, rakip fiyat artırırsa sizin talebiniz artar. Uzman notu: sol panel havayolu ile otelin birleştirildiği tur operatörü akışlarını ve dinamik paketleme sistemlerini temsil eder, genellikle IT/BT (Inclusive Tour ve Bulk Tour) bilet tanımlayıcıları kullanılır; sağ panel Infare ve ATPCO Radar gibi rekabetçi ücret istihbaratını vurgular; RM sistemleri ikame ürün esnekliğini modellemek için QSI (Quality Service Index) kullanır ve rakibin dosyaladığı ücretlere göre kendi uygunluğunu dinamik olarak ayarlar.](/decks/special-fares-elasticity/06.webp "İki panel iki ayrı veri akışı istiyor: soldaki bir ortağın fiyatını, sağdaki bir rakibin fiyatını. Aynı işaretle modellenirlerse sistem ortağın zammına rakibin zammı gibi sevinir.")

Uzman notu iki panelin sistemlerdeki karşılığını veriyor. Tamamlayıcı taraf
tur operatörü akışları ve dinamik paketleme; bu biletlerde genellikle IT/BT
(Inclusive Tour, Bulk Tour) tanımlayıcıları kullanılıyor. İkame taraf
rekabetçi ücret istihbaratı: Infare ya da ATPCO Radar gibi kaynaklardan
gelen rakip fiyatları. RM sistemleri ikame esnekliğini modellemek için QSI
(Quality Service Index) kullanıyor ve rakibin dosyaladığı ücretlere göre
kendi uygunluğunu dinamik olarak ayarlıyor.

Mühendislik açısından bu, rakip fiyat akışının talep tahmininin bir
girdisi olması demek, yalnızca bir raporlama ekranının değil. Rakip fiyatı
bir gösterge tablosunda duruyor ama tahmin modeline girmiyorsa, havayolu
rakibin zammını ancak doluluk yükseldikten sonra, yani fark etmesi gereken
zamandan çok sonra görüyor.

## Beş aracın tek hedefi: eğrinin altını doldurmak

Parçalar birleşince tablo netleşiyor. Çoklu fiyat noktaları merdiveni
kuruyor. Özel ücretler merdivenin bazı basamaklarını yalnızca belli
segmentlere gösteriyor. Yolcu tipi kuralları indirimi bir koşula bağlıyor.
Zamana göre esneklik basamakların hangi dönemde açık kalacağını söylüyor.
Çapraz esneklik de merdivenin rakibin ve ortağın hareketine göre kaymasını
sağlıyor. Hepsinin ortak noktası envanter kontrolü: kaynak metin fiyat
esnekliği verisinin envanter kontrolüyle entegre edilmesini, böylece talebin
fiyata en duyarlı olduğu zamanlarda en uygun koltuk atamasının yapılmasını
öneriyor.

## Yarın işe yarayacak beş çıkarım

1. **Tek fiyatla değil, merdivenle sat.** Çoklu fiyat noktaları kur ve
   envanter kontrolüyle yönet; hedef talep eğrisinin altında kalan
   gerçekleşmemiş geliri küçültmek. Sınıf sayısını bir sistem
   çözünürlüğü olarak gör, veri modelini ona kilitleme.
2. **Özel ücretin kontrolünü fiyata değil görünürlüğe koy.** Acentelerle
   müzakere edilen yayınlanmamış ücretlerin yalnızca hedef segmente
   görünmesini erişilebilirlik ve kanal yetkisi düzeyinde garanti et. Yanlış
   ekrana düşen özel ücret merdivenin tamamını aşağı çeker.
3. **Koşullu indirimleri doğru katmanda doğrula.** Yas ücretini belge
   gelmeden bilete çevirme; çocuk ücretini tek yolcunun kaydına değil,
   rezervasyondaki yetişkinin varlığına bakarak uygula.
4. **Esnekliği kalkışa kalan süreye göre kalibre et ve eşiğini test et.**
   Esnekliği zaman dilimlerine göre ayrı tut; rezervasyon eğrisinin sonunda
   düşen esneklik daha yüksek getiri demek. Esnek ve esnek olmayan eşiğinin
   yönünü bir birim testiyle sabitle, slayttan kopyalama.
5. **Rakip fiyatını talep girdisi olarak modelle.** İkame ürünlerin fiyat
   değişimlerini pozitif çapraz esneklik olarak işle; rakibin zammı senin
   talebini artırır. Tamamlayıcı ürünleri (uçuş artı otel) ayrı, negatif
   işaretle modelle.

Bu bölümde ne yok: yolcu miksini seçen mekanizmanın ve Littlewood kuralının
kendisi ("Yield Management: erken dönem stratejik analiz ve iş mantığı"),
ücret dosyalarını taşıyan standart kurumlar ve takas odaları ("Havacılık
endüstri standartları ve yönetişim"), kalkışa kalan süreye göre talebin
nasıl tahmin edildiği (talep tahmini bölümleri). Bu bölüm, fiyatın neden
tek bir sayı olmadığını ve birden çok fiyatın hangi araçlarla yönetildiğini
anlatmak için var.
