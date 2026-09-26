---
title: "Havacılık talep tahmini ve spill (taşan talep) modelleri analizi"
domain: "aviation"
summary: "Dolu kalkan bir uçuş, kapıdan dönen yolcuyu kaydetmez; o yolcu ancak bir dağılım varsayımıyla hesaplanır. Bu bölüm normal dağılıma dayanan Boeing spill modelini, logit yaklaşımının yüksek dolulukta spill'i neden fazla hesapladığını ve talebi sıfırın altına indirmeyen, sağa çarpık Gamma modelinin bu hatayı nasıl kapattığını anlatıyor."
audience: "Gelir yönetimi, talep tahmini ya da envanter sistemleriyle çalışan, bu sistemlerin içindeki dağılım varsayımının bir satış kararına nasıl dönüştüğünü görmek isteyen yazılımcı ve ürün insanı. Gelir yönetimi bölümlerinin okunmuş olması işe yarar; spill, kısıtsız talep, logit yaklaşımı, moment eşleştirme ve uçuş kapanış oranı metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Gelir yönetimi bölümleri koltuğu kime satacağına karar veren mekanizmayı
anlatıyordu: indirimli sınıfı ne zaman kapatacağını, yüksek ücretli yolcuya
kaç koltuk saklayacağını. O kararların hepsi bir sayıya dayanıyor: bu uçuşa
gerçekte kaç kişi binmek isterdi. Uçuş dolup satışa kapandığında bu sayı
artık gözlenemiyor; kapıdan dönen yolcu hiçbir tabloya yazılmıyor. Buna
spill, yani taşan talep deniyor: uçuşun gerçek talebi fiziksel koltuk
kapasitesini aştığında karşılanamayan kısım. **Spill modeli seçimi bir
istatistik zevki değil; hangi koltuğun hangi fiyattan satılacağına dair bir
karar, çünkü dağılım varsayımındaki hata doğrudan envanter kontrolüne
akıyor.**

![Sunumun kapak slaytı. Başlık: Havayolu Talebini Modellemek, Boeing ve Gamma Taşkın (Spill) Modelleri. Alt başlık: talep dağılımları, kapasite sınırları ve gelir optimizasyonu üzerine analitik bir bakış. Solda bir uçak silüetinin üzerine çizilmiş yeşil, sağa çarpık bir olasılık eğrisi; yatay eksen talep, dikey eksen olasılık. Eğrinin sağ tarafında dikey bir kapasite sınırı çizgisi var, çizginin sağında kalan turuncu taralı alan Taşkın (Spill) olarak işaretli. Sağdaki uzman notu: spill, uçuşun gerçek talebi fiziksel koltuk kapasitesini aştığında reddedilen, karşılanamayan talep; spill'i doğru modellemek kısıtsız talebi hesaplamak için kritik ve bu hesap havayolunun teklif yönetimi, tahmin ve fiyatlandırma sistemlerini doğrudan besliyor.](/decks/demand-forecast-spill/01.webp "Turuncu alan, uçağın hiç görmediği yolcular. Bu bölümün bütün tartışması o alanın büyüklüğünü neyle ölçtüğümüz üzerine.")

## Kaybedilen yolcu sistemde iz bırakmıyor, hesaplanıyor

Rezervasyon sistemi yalnızca kabul ettiği talebi kaydediyor. Bir uçuş
kalkıştan iki hafta önce dolduysa, sonraki iki haftada o uçuşu arayan her
yolcu ya başka bir uçuşa, ya başka bir havayoluna gitti ya da hiç uçmadı.
Satış verisinde bu uçuşun talebi kapasiteye eşit görünüyor; gerçek talep
ise kapasitenin üzerinde bir yerde. Aradaki farkı tahmin etmeye kısıtsız
talep hesabı (unconstraining) deniyor ve sunumun uzman notu bunu
havacılıktaki belki de en zor veri bilimi problemi olarak niteliyor: uçuş
dolmasaydı kaç kişinin rezervasyon yapacağını bulmak.

Hesabın girdisi geçmiş uçuşların talep profili. Sunum bunun için
analistlerin geçmiş rezervasyon eğrilerinden ortalama ve varyansı
çıkardığını, bu işin de PNR geçmişlerini, biletleme verisini ve geçmiş
uçuşların satışa açık ya da kapalı olma durumlarını saklayan sağlam bir veri
ambarı gerektirdiğini söylüyor. Yazılım tarafında bunun karşılığı şu: bir
uçuşun hangi sınıfının hangi gün kapandığı bilgisi, operasyonel sistemde
geçici bir durum gibi dursa da tahmin tarafı için tarihsel bir kayıt.
Kapanış durumunu üzerine yazıp saklamayan bir envanter sistemi, talep
tahminine sansürlü veriyi sansürsüz gibi veriyor.

Hesabın çıktısı da tek bir yere gitmiyor. Kapak slaytının notuna göre
kısıtsız talep teklif yönetimini, tahmin sistemini ve fiyatlandırmayı
besliyor. Yani spill modelindeki sistematik bir sapma, bu üç sistemin
hepsine aynı yönde taşınıyor.

## Boeing modeli hız için kuyruktan vazgeçti

Endüstride uzun süre standart olan yaklaşım Boeing spill modeli. Model talebin
normal dağıldığını varsayıyor ve spill'i bu dağılımın kapasite noktasının
ötesinde kalan kısmından hesaplıyor. Normal dağılımın kuyruk alanı kapalı
bir formülle yazılamadığı için model hesabı kolaylaştırmak adına normal
dağılıma lojistik bir yaklaşım, yani logit yaklaşımı uyguluyor. Bu yaklaşımda
kapasitenin ortalamadan kaç standart sapma uzakta olduğu tek bir değişkene
indiriliyor: k, kapasite eksi ortalama talebin standart sapmaya bölümü.

Brifinge göre bu mantık özellikle indirimli koltuk tahsisi kontrollerinde
(discount allocation controls) hızlı sonuç almak için kullanıldı. Sunumun
notu nedenini de veriyor: eski gelir yönetimi sistemleri milyonlarca
kalkış-varış güzergahını gece çalışan toplu işlerde değerlendiren
anabilgisayarlar üzerinde koşuyordu ve normal dağılımla logit varsayımı
hesaplama açısından hafifti. Mimari bir tercih, matematiksel bir tercihin
yerine geçmişti.

![Başlık: Boeing Taşkın Modeli, Logit Yaklaşımı. Üstte açıklama: normal dağılıma dayanan bu model, geçmişte indirimli bilet tahsis kontrollerini (discount allocation controls) yönetmek için sektör standartlarından biriydi. Ortada formül: bir bölü iki çarpı, 1.702 bölü doğal logaritma içinde bir artı e üzeri 1.702 k. Formülün altında k'nin tanımı: k eşittir kapasite eksi ortalama, bölü standart sapma. Altta turuncu kenarlı kutu, kritik dezavantaj: 4. dereceden polinom yaklaşımına kıyasla kuyruk olasılıklarını (aşırı talep) tahmin etmede yetersiz kalır ve spill miktarını sistemli olarak olduğundan fazla hesaplar. Sağdaki uzman notları: indirim tahsis kontrolleri, getiri yönetimi sistemlerinin rezervasyon sınıflarını (RBD) değerlendirip dinamik olarak açıp kapatması demek; eski RM sistemleri, milyonlarca O&D güzergahını gece toplu işlerde değerlendiren anabilgisayarlarda hesaplama olarak hafif oldukları için normal dağılım ve logit varsayımlarına dayanıyordu.](/decks/demand-forecast-spill/02.webp "Formülün tek girdisi k: kapasitenin ortalamadan kaç standart sapma uzakta olduğu. Dağılımın şekli hakkında başka hiçbir bilgi hesaba girmiyor.")

Bedeli slaytın alt kutusunda yazıyor. Logit yaklaşımı, dördüncü dereceden
bir polinom yaklaşımına kıyasla dağılımın uç noktalarındaki olasılıkları iyi
tahmin edemiyor ve spill'i sistematik olarak olduğundan fazla hesaplıyor.
Kelime önemli: rastgele değil, sistematik. Rastgele hata ortalamada
birbirini götürür; sistematik hata her uçuşta aynı yöne itiyor.

## Sapma dolulukla büyüyor ama en az dolu uçuşta en yüksek oranda

Brifing, 100 koltukluk bir uçuş için iki hesabı yan yana koyuyor. Doluluk
oranı yüzde 55 iken normal dağılım 0,17 yolcu spill hesaplıyor, logit
yaklaşımı 0,40; fark 0,23 yolcu. Yüzde 75'te 5,30'a karşı 5,69, fark 0,39.
Yüzde 85'te 17,94'e karşı 18,30, fark 0,36. Yüzde 95'te 81,60'a karşı
82,78, fark 1,18 yolcu. Her satırda logit daha yüksek.

Sunumun uzman notu buradaki doluluk oranının kapanmış uçuşlardaki doluluk
(LFCF, load factor on closed flights) olduğunu belirtiyor ve yüzde 95'teki
1,18 yolcuyu şöyle büyütüyor: tek uçuşta önemsiz görünen bu fark,
günde 1.000 uçuş üzerinden bir yıla yayıldığında envanter sistemlerini ucuz ücret
sınıflarını erken kapatmaya itiyor. Sonuç boş koltukla kalkan uçuş, yani
spoilage, ve eriyen marj.

![Başlık: Verilerle Yüzleşme, Taşkın (Spill) Sapması. Yatay eksen doluluk oranı (load factor), yüzde 70 ve yüzde 95 işaretli; dikey eksen 100 koltuk kapasitesi üzerinden taşan yolcu sayısı. İki eğri, turuncu ve mavi, yüzde 70 civarında neredeyse üst üste; burada not: sapma minimal, 2.72 ile 3.15 yolcu. Yüzde 95'e doğru eğriler ayrılıyor; turuncu kutu: sapma dramatik, 81.60 ile 82.78 yolcu. Eğrilerin sağ ucunda etiketler: Normal Dağılım ve Logit Yaklaşımı. Altta kutu: logit yaklaşımı düşük dolulukta makul olsa da, doluluk oranları kritik seviyelere çıktıkça kaybedilen yolcu sayısını abartır. Sağdaki uzman notu: doluluk oranı burada kapanmış uçuşlardaki doluluk (LFCF); yüzde 95 LFCF'deki 1.18 yolculuk fark küçük görünse de günde 1.000 uçuş üzerinden bir yıl boyunca çarpıldığında spill'i fazla tahmin eden model envanter sistemlerini ucuz sınıfları erken kapatmaya itiyor, uçuşlar boş koltukla (spoilage) kalkıyor ve marj eriyor.](/decks/demand-forecast-spill/03.webp "Etiketlere değil sayılara bak: brifingin tablosunda her doluluk seviyesinde logit daha yüksek, yani yukarıdaki eğri logit olmalı.")

Mutlak fark yüksek dolulukta büyüyor, bu doğru. Ama aynı tabloyu göreli
okuyunca başka bir şey görünüyor. Yüzde 55'te logit, normal dağılımın
hesapladığının iki katından fazlasını buluyor; yüzde 95'te fark yüzde ikinin
altında. Slayttaki yüzde 70 noktası da aynı şeyi söylüyor: 2,72'ye karşı 3,15
yolcu, yaklaşık yüzde 16 fazla. Yani yüksek dolulukta sorun, zaten büyük bir
sayıya eklenen küçük bir pay; düşük dolulukta ise tahminin kendisi yanlış
mertebede. Mühendislik tarafında bu, modeli tek bir hata metriğiyle
izlemenin yetmediği anlamına geliyor: mutlak sapma yüksek doluluklu
uçuşlarda, göreli sapma düşük doluluklu uçuşlarda alarm vermeli.

Brifingin iş kuralı yüksek doluluk üzerinde duruyor: bu uçuşlarda daha
hassas polinom yaklaşımlarını ya da Gamma modelini devreye almak. Bir de
uyarı ekliyor: gelir yönetimi sistemi yalnızca doluluk oranına bakmamalı,
çünkü logit modelinin yüksek dolulukta spill'i fazla tahmin etmesi uçuşların
vaktinden önce kapatılmasına ya da fiyatların gereksiz yere yükseltilmesine
yol açabiliyor.

## Normal dağılım talebin iki özelliğini inkâr ediyor

Logit hatası, normal dağılımın üzerine eklenen bir yaklaşımın hatası.
Altında daha derin bir sorun var: normal dağılımın kendisi. Kaynak metin
bunu açıkça koyuyor: Boeing spill modelinin temel sorunu normal dağılıma
dayanarak türetilmiş olması ve bu varsayımın iki temel sorunu var. Birincisi,
normal dağılım negatif değerlere de olasılık veriyor, oysa talep negatif
olamaz. İkincisi, normal dağılım simetrik bir çan eğrisi; gerçek talep ise
çoğunlukla sağa çarpık.

İkinci sorun spill için birincisinden daha önemli, çünkü spill tam da sağ
kuyrukta yaşıyor. Sunumun notu bu kuyruğun nereden geldiğini de söylüyor:
bayram hafta sonu gibi uç dönemlerde yolcu talebi üstel davranıyor ve
talebin uzun sağ kuyruğunu oluşturuyor. Simetrik bir dağılım bu kuyruğu
sol tarafın aynası olarak çiziyor ve gerçekte olandan kısa tutuyor.

![Başlık: Normal Dağılım Neden Yetersiz Kalıyor? İki panel. Sol panel, 1. Negatif Talep İmkansızdır: sıfır noktasında ortalanmış bir çan eğrisi, eğrinin sıfırın solundaki yarısı turuncuyla taranmış ve küçüktür sıfır diye işaretli. Altında: normal dağılım matematiksel olarak negatif rastgele değişkenlere izin verir, ancak uçak bileti talebi hiçbir zaman sıfırın altına düşemez. Sağ panel, 2. Talep Simetrik Değildir: kalın mavi, tepesi sola kaymış ve sağa doğru uzun kuyruk bırakan bir eğri, arkasında soluk kesikli simetrik bir çan eğrisi. Altında: ampirik testler kanıtlamıştır, havayolu talebi çan şeklinde değildir, çoğunlukla sağa çarpıktır. Alttaki uzman notları: kısıtsız talep hesabı (uçuş dolmasaydı kaç kişinin rezervasyon yapacağını tahmin etmek) havacılıktaki belki de en zor veri bilimi problemi; normal dağılım burada başarısız oluyor çünkü gerçek yolcu talebi bayram hafta sonu gibi uç olaylarda üstel davranıyor ve talebin uzun sağ kuyruğunu oluşturuyor.](/decks/demand-forecast-spill/04.webp "Sol panel bir tuhaflık, sağ panel bir kayıp. Spill kapasitenin sağında hesaplandığı için asıl zarar sağdaki kısa kuyruktan geliyor.")

Bu iki hata katmanını ayırmak işe yarıyor. Logit yaklaşımı, normal
dağılımın kendi cevabına göre spill'i fazla buluyor. Normal dağılım ise
gerçek talebin sağ kuyruğunu eksik çiziyor. Birincisi ucuz sınıfların erken
kapanmasına, ikincisi sunumun kapanış notundaki duruma yol açıyor: kusurlu
bir formül sisteme uçuşun dolacağını söylediği için geç rezervasyon yapan,
yüksek ücret ödeyen iş yolcusunun geri çevrilmesi. Aynı sistemde iki ters
yönlü hata birbirini kısmen örtebiliyor; bu da hiçbirinin tek başına fark
edilmemesi demek.

## Gamma talebin şeklini veriden öğreniyor

Gamma spill modeli iki sorunu da dağılımın kendisinden çözüyor. Kaynak metin
Gamma dağılımını normal dağılımdan ayıran özelliği şöyle tanımlıyor: rastgele
değişken yalnızca pozitif değerler için tanımlı. Negatif talep olasılığı
baştan yok. Şekli de sabit değil: α (şekil) ve β (ölçek) parametreleri
dağılımın ne kadar sağa çarpık olacağını belirliyor, bu yüzden model her
uçuşun kendi talep karakteristiğine uyabiliyor.

![Başlık: Çözüm, Gamma Taşkın Modeli. Solda metin: Gamma dağılımı, normal dağılımın kısıtlamalarını aşarak talep değişkenliğini havayolu gerçeklerine uyarlar. İki onay işaretli madde: sadece pozitif değerler için tanımlıdır (x büyüktür sıfır); talebin sağa çarpık yapısına uyum sağlar. Ortada sıfırdan başlayıp hızla yükselen, sonra uzun bir kuyrukla sağa doğru inen yeşil bir eğri. Sağ üstte Gamma olasılık yoğunluk fonksiyonu: f(x) eşittir beta üzeri alfa çarpı x üzeri alfa eksi bir çarpı e üzeri eksi beta x, bölü gamma fonksiyonu alfa. Oklarla işaretli: alfa şekil parametresi, beta ölçek parametresi. Sağdaki uzman notları: bu geçiş eski uçuş bacağı bazlı RM mantığından modern O&D gelir yönetimi sistemlerine evrimle ilgili; bir havayolu RM motorunu değiştirdiğinde (örneğin PROS, Amadeus Altéa RM ya da Sabre AirVision gibi modern sistemlere geçerken) normal dağılımdan Gamma ya da daha gelişmiş dağılımlara geçmek gelir optimizasyonu ve ağ getirisi için kritik bir yükseltme.](/decks/demand-forecast-spill/05.webp "Eğri sıfırdan başlıyor ve sola değil sağa uzanıyor. Normal dağılımın iki kusuru bu tek şekilde birlikte düzeliyor.")

Parametreler uçuş verisinden moment eşleştirmeyle (moments matching)
bulunuyor. Geçmiş uçuşlardan örneklem ortalaması ve varyansı çıkarılıyor;
Gamma dağılımının ortalaması αβ, varyansı αβ² olduğu için bu iki denklem
tersine çözülüyor: α ortalamanın karesi bölü varyans, β varyans bölü
ortalama. Yani Boeing modelinin kullandığı aynı iki girdi, ortalama ve
standart sapma, burada dağılımın şeklini de belirliyor. Girdi setini
değiştirmeden modeli değiştirmek mümkün; değişen, bu iki sayının neye
dönüştüğü.

![Başlık: Gamma Modelini Uçuş Verileriyle Beslemek. Açıklama: modelin gücü, mevcut talep profiline esnekçe ayarlanabilmesinden gelir; bu uyumlaştırma, örneklem ortalaması ve varyansının eşleştirilmesiyle (moments matching) gerçekleşir. Soldan sağa kesikli oklarla bağlı üç kutu. Adım 1, Girdiler: geçmiş uçuş verilerinden ortalama talep ve varyans. Adım 2, Dönüşüm: ortalama eşittir alfa çarpı beta, varyans eşittir alfa çarpı beta kare. Adım 3, Sonuç Parametreleri (yeşil kenarlı): alfa eşittir ortalamanın karesi bölü varyans, beta eşittir varyans bölü ortalama; altında Model Kalibrasyonu Tamamlandı etiketi. Alttaki uzman notları: analistler ortalama ve varyansı bulmak için geçmiş rezervasyon eğrilerini kullanır; bu eşleştirme, gerçek talep metriklerini hesaplamak için büyük miktarda PNR geçmişi, biletleme verisi ve geçmiş uçuş açıklık/kapanış durumlarını saklayan sağlam bir veri ambarı gerektirir.](/decks/demand-forecast-spill/06.webp "Üç kutunun hiçbiri pahalı değil. Pahalı olan birinci kutunun altındaki veri: kapanış durumlarıyla birlikte saklanmış rezervasyon geçmişi.")

İki slayt yan yana okunduğunda küçük ama öğretici bir tutarsızlık
görünüyor. Beşinci slayttaki yoğunluk formülü, β'nın üsteki eksi βx
terimiyle çarpıldığı biçimde yazılmış; bu yazımda β bir oran parametresi ve
dağılımın ortalaması α bölü β oluyor. Altıncı slayttaki moment eşleştirme
ise β'yı ölçek olarak kullanıyor, ortalama αβ. İkisi de geçerli; ama aynı
sembolün iki anlamı var. Hesap kütüphanesine veriyi taşırken bu ayrım
atlanırsa parametre ters giriyor ve dağılım yanlış yerde duruyor, üstelik
hata vermeden. Gamma modeline geçen bir ekibin ilk birim testi, üretilen
dağılımın ortalamasının girilen ortalamaya eşit çıkıp çıkmadığı olmalı.

## Kapanış kararı dağılımın kuyruğundan okunuyor

Modelin envantere dokunduğu yer uçuş kapanış oranı (flight closing rate).
Brifinge göre bir uçuşun kapanma olasılığı, talebin kapasiteyi aşma
olasılığına dayanıyor. Gamma modelinde bu, kümülatif dağılım fonksiyonunun
kapasite noktasındaki değerinin birden çıkarılmasıyla hesaplanıyor ve
kapasite yönetimi rezervasyon alımını durdurma kararını bu orana göre
veriyor.

![Başlık: Kapasite ve Taşkın (Spill) Analizi. Sağa çarpık bir talep eğrisi; tepe noktasının altında dikey çizgiyle μ (nominal talep) işaretli. Sağda kesikli dikey çizgi c (kapasite); çizginin sağında eğrinin altında kalan turuncu alan Taşan Yolcular (Spilled Passengers). Yatay eksen Trafik (t). Sağ üstte kutu, Uçuş Kapanış Oranı (Flight Closing Rate): talebin kapasiteyi aşma olasılığı eşittir bir eksi F_G(c); F_G kümülatif dağılım fonksiyonunu temsil ediyor. Sağdaki uzman notları: burada envanter kapasite kısıtı ile rezervasyon akışı karşı karşıya; dikey c çizgisi mutlak fiziksel uçak kapasitesi (örneğin bir A320'de 180 koltuk) ya da belirli bir yetkilendirme seviyesi (AU). Belirli bir uçuş için RM sistemleri sürekli büyük bir spill alanı gösteriyorsa ağ planlama uçağı daha büyüğüyle değiştirebilir (upgauging) ya da kaybedilen geliri yakalamak için yeni bir frekans ekleyebilir.](/decks/demand-forecast-spill/07.webp "Aynı turuncu alan iki ekibe iki ayrı şey söylüyor: RM'ye bugün satışı ne zaman durduracağını, ağ planlamaya gelecek sezon hangi uçağı koyacağını.")

Slaytın notu c çizgisinin iki anlamı olabileceğini hatırlatıyor: uçağın
mutlak fiziksel kapasitesi ya da belirli bir yetkilendirme seviyesi
(authorization level). İkincisi yazılım açısından önemli: aynı fonksiyon
fiziksel kapasite için çağrıldığında uçuşun, bir sınıfın yetkilendirme
seviyesi için çağrıldığında o sınıfın kapanma olasılığını veriyor.
Fonksiyonun girdisi bir koltuk sayısı ama anlamı çağıranın elinde.

Notun ikinci yarısı spill'i gelir yönetiminin dışına taşıyor. Bir uçuş için
sistem sürekli büyük bir spill alanı gösteriyorsa, ağ planlama o uçuşa daha
büyük bir uçak koyabilir ya da yeni bir frekans ekleyebilir. Yani spill
tahmini aynı zamanda filo ve tarife kararının girdisi. Sistematik olarak
fazla hesaplanan spill burada da aynı yöne itiyor: gereğinden büyük uçak,
gereğinden fazla sefer.

## Model seçimi bir test sonucuna bağlanmalı

Brifing Gamma'ya geçişi bir tercih olarak değil, bir kural olarak koyuyor.
Karar kriteri talebin asimetrik yapısı ve negatif değer alamaması. Ampirik
veri, Kolmogorov-Smirnov ya da Ki-kare testleriyle doğrulandığı üzere,
talebin normal dağılmadığını gösteriyorsa sistem Gamma modeline geçmeli.
Buradaki önemli kelime "gösteriyorsa": model seçimi bir kez verilip
unutulan bir mimari karar değil, veriyle yeniden sınanan bir koşul.

Parametrik esneklik de aynı yönde çalışıyor. Brifing α ve β'nın farklı
hatlardaki farklı talep yapılarını modellemek için kullanılmasını öneriyor;
örneği iş seyahati yoğun hatlarla tatil odaklı hatlar. İki hat aynı
ortalamaya sahip olsa bile çarpıklıkları farklıysa, aynı kapasitede farklı
spill ve farklı kapanış oranı üretiyorlar. Tek bir global dağılım varsayımı
bu farkı siliyor.

![Başlık: Özet Sentez, Model Karşılaştırma Matrisi. Üç sütunlu tablo: özellik, Boeing Modeli (gri başlık), Gamma Modeli (yeşil başlık). Dağılım şekli: Boeing simetrik çan eğrisi, Gamma sağa çarpık (gerçek talebe uygun). Negatif talep riski: Boeing var (sıfırın altına inebilir), Gamma yok (sadece x büyüktür sıfır). Taşkın (spill) hassasiyeti: Boeing yüksek dolulukta fazladan tahmin eder, Gamma uç değerlerde bile yüksek doğruluk. Kullanım alanı: Boeing temel indirim tahsisi kontrolleri, Gamma gelişmiş talep modelleme ve modern kapasite yönetimi. Alttaki uzman notları: normal dağılımdan Gamma dağılımına matematiksel geçiş, endüstrinin temel envanter kontrolünden gelişmiş gelir yönetimine evrimini yansıtıyor; talebin kuyruğunu doğru yakalamak, havayolunun geç rezervasyon yapan, yüksek ücret ödeyen iş yolcularını kusurlu bir formül sisteme uçuşun dolacağını söylediği için geri çevirmemesini sağlıyor.](/decks/demand-forecast-spill/08.webp "Son satır bir tarih okuması: Boeing modeli indirim kontrolü için yeterliydi, Gamma'yı gerekli kılan gelir yönetiminin kendisinin büyümesi.")

Sunumun notları bu geçişi daha geniş bir hikâyeye bağlıyor: uçuş bacağı
bazlı eski RM mantığından kalkış-varış bazlı modern gelir yönetimi
sistemlerine geçiş. Bir havayolu RM motorunu değiştirdiğinde normal
dağılımdan Gamma'ya ya da daha gelişmiş dağılımlara geçmek, gelir
optimizasyonu ve ağ getirisi için kritik bir yükseltme olarak anılıyor.
Motoru değiştirmek, varsayımı değiştirmenin fırsatı.

## Yarın işe yarayacak dört çıkarım

1. **Dağılımı seçmeden önce test et.** Talep verisini
   Kolmogorov-Smirnov ya da Ki-kare testinden geçir ve normal mi Gamma mı
   olduğuna veriyle karar ver. Testi bir kez değil, model yeniden
   kalibre edildikçe tekrarla; sonuç normal dağılımı reddediyorsa geçişi
   otomatik yap.
2. **Spill sapmasını iki metrikle izle.** Logit yaklaşımının hatası
   yüksek dolulukta mutlak olarak, düşük dolulukta göreli olarak büyük.
   Yüksek doluluklu uçuşlarda polinom yaklaşımı ya da Gamma modelini
   devreye al ve kapanış kararını yalnızca doluluk oranına bağlama.
3. **Parametreleri hat tipine göre ayır.** α ve β'yı iş seyahati yoğun
   hatlarla tatil odaklı hatlar için ayrı hesapla. Aynı ortalama, farklı
   çarpıklıkla farklı spill üretiyor.
4. **Kapanış durumunu tarihsel veri olarak sakla.** Kısıtsız talep
   hesabı, hangi uçuşun hangi sınıfının ne zaman kapandığını bilmeden
   yapılamıyor. Envanter sisteminin bu durumu üzerine yazmadan veri
   ambarına taşıdığından emin ol; Gamma'ya geçişte de ölçek ve oran
   biçiminin karışmadığını ortalama kontrolüyle doğrula.

Bu bölümde ne yok: spill tahmininin beslediği koltuk koruma mekanizmasının
kendisi (gelir yönetimi bölümleri), close-in re-fleeting ve kapasitenin
son üç aydaki değişimi ("Havayolu pazarlama planlama süreci ve iş mantığı
analizi"). Bu bölüm o kararların altındaki talep sayısının nasıl
tahmin edildiğini ve dağılım varsayımının o sayıyı nasıl eğdiğini anlatmak
için var.
