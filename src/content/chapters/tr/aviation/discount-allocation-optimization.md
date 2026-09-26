---
title: "İndirim tahsisi ve rezervasyon optimizasyonu: EMSR ve entegre overbooking"
domain: "aviation"
summary: "İndirim tahsisi, belirsiz talep altında yüksek ücretli yolcuya kaç koltuk saklanacağı kararıdır; EMSR ailesi bu kararı her ek koltuğun beklenen gelirine bakarak veriyor. Bu bölüm EMSRA ile EMSRB arasındaki farkın neden gelire yansıdığını, talep verisinin biçiminin algoritma seçimini nasıl belirlediğini ve overbooking ile indirim tahsisini tek modelde birleştirmenin neden yüzde 1-3 ek gelir vaat ettiğini anlatıyor."
audience: "Envanter, gelir yönetimi ya da rezervasyon sistemleriyle çalışan, koruma seviyelerinin hangi hesapla çıktığını ve bu hesabın overbooking'le nerede kesiştiğini anlamak isteyen yazılımcı ve analist. Overbooking ve show-up bölümlerinin okunmuş olması işe yarar; koruma seviyesi, iç içe envanter (nesting), EMSR, EMSRA, EMSRB, varyasyon katsayısı ve spill rate metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler overbooking'i anlattı: rezervasyon yapan yolcunun kaçının
uçağa geleceğini tahmin edip kapasitenin üstüne ne kadar satılacağını
belirlemek. O hesap uçağın kaç koltuk satacağını söylüyor, hangi fiyattan
satacağını söylemiyor. Bu bölüm diğer yarıya bakıyor: aynı kabinde farklı
fiyatlı rezervasyon sınıfları varken, ucuz sınıfa kaç koltuk açılacağı ve
pahalı sınıfa kaç koltuk saklanacağı. Bu karara indirim tahsisi (discount
allocation) deniyor. Havacılıkta envanter kontrolü, talebin belirsiz olduğu
bir ortamda yüksek değerli yolcu için doğru sayıda koltuğu koruma işi;
korunan koltuk sayısına da koruma seviyesi (protection level) deniyor.
**İndirim tahsisinin kalitesi algoritmanın zekâsından çok iki şeye bağlı:
üst sınıfların talebini tek tek mi yoksa birlikte mi gördüğü, ve talebin
ortalamasının yanında ne kadar oynadığını hesaba katıp katmadığı.**

## Her ek koltuğun değeri, satılma olasılığıyla çarpılmış ücreti

Karar mekanizmasının çekirdeği tek bir hesap: beklenen marjinal koltuk
geliri, İngilizce kısaltmasıyla EMSR (Expected Marginal Seat Revenue). Bir
sınıfa ayrılan her ek koltuğun beklenen geliri, o sınıfın ücreti ile o
sınıfın talebinin bu koltuk sayısını aşma olasılığının çarpımı. İlk birkaç
koltuk neredeyse kesin satılacağı için beklenen gelirleri ücrete yakın.
Koltuk sayısı arttıkça talebin o sayıyı aşma olasılığı düşüyor, beklenen
gelir de düşüyor. Kaynak metin bunu matematiksel adıyla koyuyor: beklenen
marjinal gelir monoton artmayan bir fonksiyon. Yani bir sonraki koltuk hiçbir
zaman bir öncekinden daha değerli değil.

Bu, koruma kararının mantığını da veriyor. Pahalı sınıfa saklanan bir sonraki
koltuğun beklenen geliri, o koltuğu şimdi ucuz sınıfa satmaktan gelecek
kesin ücretin altına düştüğü noktada korumayı bırakmak gerekiyor. O noktaya
kadar korunan koltuk sayısı koruma seviyesi. İki sınıflı bu karar kuralı
Littlewood kuralı olarak biliniyor; bu bölümün geri kalanı onun ikiden fazla
sınıfa nasıl genişletildiğini anlatıyor.

Hesabın girdileri üç tane: talep tahmininin ortalaması, talep belirsizliği
ve talebin hangi istatistiksel dağılımla modellendiği. Kaynak metin
belirsizliği varyasyon katsayısıyla (CV, standart sapmanın ortalamaya oranı)
ölçüyor ve dağılım olarak Gamma gibi modelleri örnek veriyor. Yazılım
tarafında bunun karşılığı şu: talep tahmini servisi optimizasyon motoruna
tek bir sayı değil, en az iki parametre göndermeli. Yalnızca ortalamayı
taşıyan bir arayüz, motoru belirsizliği sıfır varsaymaya zorlar.

## Belirsizlik arttıkça koruma kararı ihtiyatlılaşıyor

Talep varyansı arttığında beklenen marjinal gelir eğrisinin şekli değişiyor.
Kaynak metin iki şeyin altını çiziyor: düşüş hızı doğrusal değil, ve sistem
yüksek belirsizlik altında koruma seviyelerini daha ihtiyatlı belirliyor.
Metnin ifadesiyle, belirsizlik yüksekken sistem yüksek ücretli sınıflar
için daha fazla koltuğu koruma altına alma eğilimi gösteriyor.

Bunun pratik anlamı, iki uçuşun aynı ortalama talep tahminiyle bambaşka
koruma seviyeleri alabilmesi. Ortalamaları eşit ama biri istikrarlı iş
trafiğinden, öteki dalgalı bir tatil pazarından besleniyorsa, motorun
onlara farklı davranması hata değil, doğru davranış. Tersi de geçerli:
yalnızca ortalamaya bakan bir rapor, bu iki uçuşun neden farklı
kapatıldığını açıklayamaz ve analisti sistemin bozuk olduğuna ikna eder.

Buradan çıkan mühendislik notu basit ama sık atlanıyor. Varyasyon katsayısı
bir tahmin çıktısı olarak saklanmalı, loglanmalı ve koruma seviyesinin
yanında gösterilmeli. Kaynak metnin önerisi de bu yönde: belirsizliğin
yüksek olduğu dönemlerde sistemin koruma seviyelerini dinamik olarak
yukarı çekmesi sağlanmalı. Bunu yapabilmek için belirsizliğin önce
görünür olması gerekiyor.

## Üst sınıfları tek tek değil birlikte gören model daha çok kazanıyor

İki sınıf için kural açık. Sınıf sayısı ikiyi geçince soru şu oluyor: en alt
sınıfa karşı kaç koltuk korunmalı, ve bu koruma üstteki sınıfların her biri
için ayrı ayrı mı hesaplanmalı, yoksa hepsi için birlikte mi? Littlewood
kuralının çoklu sınıfa iki yaygın genişletmesi bu soruya farklı cevap
veriyor: EMSRA ve EMSRB.

EMSRA sınıfları ikili karşılaştırmalarla (pairwise) ele alıyor. Her üst
sınıf için alt sınıfa karşı ayrı bir koruma hesaplıyor, sonra bunları
topluyor. EMSRB ise alt sınıftan korunacak koltuk sayısını belirlerken
bütün üst sınıfların talebini tek bir birleşik talep olarak ele alıyor ve
bu birleşik talebe ağırlıklı ortalama bir ücret atıyor. Kaynak metin farkın
kaynağını açıkça koyuyor: EMSRB'nin gelir artışı sağlamasının nedeni, alt
sınıftan korunacak seviyeyi belirlemek için üst sınıfların birleşik talep
dağılımının kullanılması.

Bu farkın önemli olduğu yer iç içe envanter (nested inventory). İç içe
yapıda üst sınıf, alt sınıfa ayrılmış koltuğu da satabiliyor; koltuklar
sınıflara kilitli kovalar değil, birbirinin içine geçen limitler. Böyle bir
yapıda üst sınıfların talepleri birbirinden bağımsız havuzlara dökülmüyor,
aynı koltuk havuzunu paylaşıyor. İkili karşılaştırma bu paylaşımı görmüyor;
birleşik talep görüyor. Kaynak metin bu yüzden iç içe envanter kontrolü
yapılan ortamlarda EMSRB'nin tercih edilmesi gerektiğini, EMSRA'nın ise daha
az optimal sonuç verdiğini söylüyor. EMSRB birleşik dağılımı kullandığı için
trafik ve gelir tahminlerinde de EMSRA'dan daha doğru.

## EMSRB teoride yanlış bir varsayımla pratikte kazanıyor

EMSRB'nin bir bedeli var. Üst sınıfları tek bir havuzda toplarken hepsinin
yer değiştirme oranının (displacement rate) aynı olduğunu varsayıyor. Yani
bir alt sınıf rezervasyonunun, hangi üst sınıftan olursa olsun, aynı
olasılıkla bir üst sınıf yolcusunu yerinden edeceğini kabul ediyor. Kaynak
metin bunun teorik olarak her zaman doğru olmadığını açıkça söylüyor. Buna
rağmen pratik uygulamalarda, örnek olarak American Airlines'ın DINAMO
sisteminde, EMSRB'nin daha yüksek verim sağladığı gösterilmiş.

Bu, gelir yönetimi tarihinde tekrar eden bir örüntünün küçük bir örneği:
optimal çözüm hesaplanamıyor ya da veri onu beslemeye yetmiyor, o yüzden
varsayımı yanlış ama hesaplanabilir ve tahmin hatasına dayanıklı bir yöntem
kazanıyor. Yazılım tarafında bunun karşılığı, bir optimizasyon modelini
teorik zarafetine göre değil, kendi verinle yapılmış geriye dönük
simülasyondaki gelirine göre seçmek. EMSRA daha "dürüst" bir model gibi
görünebilir; soru onun gelir getirip getirmediği.

Kontrolün doğru çalışıp çalışmadığını görmenin de bir yolu var. Kaynak
metne göre gelir yönetimi kontrolleri doğru ayarlandığında, gerçekleşen
spill rate (kapasite ya da kapanan sınıf yüzünden kaçırılan talebin oranı)
en yüksek ücretten en düşük ücrete doğru artıyor. Yani en pahalı sınıfta en
az talep kaçırılıyor, en ucuzda en çok. Bu, bir izleme metriği olarak
doğrudan kullanılabilir: sınıf bazında spill rate'i ücrete göre sırala;
sıra bozuksa, örneğin orta sınıflardan biri üst sınıftan daha az talep
kaçırıyorsa, koruma seviyeleri ya da onları besleyen tahmin yanlış
ayarlanmış demektir.

## En ucuz sınıf önce kapanır; bu bir sonuç değil, kısıt

Çok sınıflı bir uçuşta satışlar hangi sırayla kapanıyor? Havayolu envanter
sistemlerinin temel kuralı açık: en düşük değerli rezervasyon sınıfları her
zaman ilk kapanır. Kaynak metin bunu envanter sistemlerinin temel çalışma
kısıtı olarak koyuyor ve optimizasyon algoritmalarının bu kısıtı temel bir
parametre olarak kabul ettiğini söylüyor.

Bu ayrım önemli. Optimizasyon, alt sınıfın önce kapanmasını bir sonuç olarak
bulmuyor; bunu veri olarak alıyor ve koruma seviyelerini bu sıranın içinde
hesaplıyor. İç içe envanterle de doğrudan bağlantılı: üst sınıf alt sınıfın
koltuğunu satabildiği sürece, kapanma sırası aşağıdan yukarıya işlemek
zorunda. Yazılım tarafında bunun karşılığı, sınıf kapatma mantığının
optimizasyon motorunun dışında ayrıca bir kurallar katmanında tutulması
durumunda iki katmanın aynı sıralamayı paylaşması gerektiği. Bir yerde
ücret sırası, başka bir yerde rezervasyon sınıfı harfinin alfabetik sırası
kullanılıyorsa, motorun hesapladığı koruma seviyesi envanterde uygulanan
kapanma sırasıyla uyuşmaz.

## Talebin biçimi algoritmayı seçer, tercih değil

Optimizasyon motoru seçilirken genellikle modelin kendisi tartışılıyor.
Kaynak metin daha önceki bir soruyu öne alıyor: elindeki talep verisi
sürekli mi, kesikli mi? Farklı veri biçimleri için farklı yaklaşımlar var:

- Talep sürekli bir dağılım izliyorsa ve O&D (kalkış-varış) güzergâhlarını
  kapsıyorsa Curry yaklaşımı kullanılıyor.
- Talep kesikli (discrete) ise, yani yolcu sayısı tam sayılar olarak
  modelleniyorsa, Wollmer yaklaşımı kullanılıyor.
- Hem kesikli hem sürekli dağılımlarda optimizasyon gerekiyorsa Brumelle ve
  McGill modeline dayalı, alt diferansiyel (subdifferential) optimizasyon
  mantığı uygulanıyor.

Kaynak metnin uyarısı açık: veri türüne uymayan bir algoritma, örneğin
kesikli veride Curry yaklaşımı, hatalı koruma seviyelerine yol açabilir. Bu
bir tercih meselesi gibi görünüp aslında bir tip uyumu meselesi. Yazılım
tarafında karşılığı, talep tahmini çıktısının dağılım türünü açık bir alan
olarak taşıması ve optimizasyon motorunun bu alana göre yöntem seçmesi ya
da uyumsuzlukta hata vermesi. Dağılım türünün bir yapılandırma dosyasında
örtük olarak durduğu, tahmin ekibinin modeli değiştirdiğinde optimizasyon
ekibinin haberinin olmadığı bir düzen, tam da bu hatanın sessizce
yaşayacağı yer.

## Overbooking ile indirim tahsisini ayrı tutmak gelir bırakıyor

Tarihsel olarak iki model ayrı çalıştı. Overbooking modeli uçağın
fiziksel kapasitesinin üstüne kaç rezervasyon kabul edileceğini hesapladı.
İndirim tahsisi modeli de bu toplam limitin içinde sınıflara kaç koltuk
açılacağını. Ayrılığın nedeni karmaşıklıktı: iki problemi aynı anda çözmek
hesaplama açısından çok daha zor.

Ama iki kararın birbirinden bağımsız olmadığı açık. Overbooking limiti
doluluk oranını (load factor) belirliyor, indirim tahsisi sınıf karmasını
(class mix). Ayrı modeller bu ikisini ayrı ayrı iyileştiriyor, aralarındaki
dengeyi kimse kurmuyor. Birleşik modelin amacı tam bu dengeyi kurmak:
iptalleri, gelmeyen yolcuları (no-show), uçağa alınmayan yolcuları (denied
boarding) ve sınıf düşürme (downgrading) maliyetlerini tek bir hesapta
birlikte değerlendirmek. Kaynak metin bu entegrasyonun getirisini de
veriyor: doluluk oranını dengelemek ve sınıf karmasını optimize etmekten
gelen gelir artışı yüzde 1 ile 3 arasında tahmin ediliyor.

Bu oran küçük görünebilir. Ama aynı uçak, aynı tarife, aynı ücret yapısıyla,
yalnızca iki kararın birlikte verilmesinden geliyor. Kaynak metin bu yüzden
yalnızca kapasiteye odaklanan overbooking modellerinden, iptal ve iade
maliyetlerini sınıf bazlı talep tahminiyle birleştiren entegre overbooking
ve indirim tahsisi (Integrated Overbooking and Discount Allocation)
modellerine geçişi, marjinal gelir artışı için kritik bir adım olarak
koyuyor.

Yazılım tarafında bu geçişin ilk engeli genellikle modelin kendisi değil,
veri sözleşmesi. Ayrı çalışan iki modelde overbooking servisi show-up
tahminini, indirim tahsisi servisi sınıf bazlı talep tahminini tüketiyor.
Birleşik model ikisini birden, üstüne iptal ve sınıf düşürme maliyetlerini
aynı çözünürlükte istiyor. Show-up oranı kabin düzeyinde, talep sınıf
düzeyinde tutuluyorsa entegrasyon bir algoritma projesi olmadan önce bir
veri modeli projesi.

## Çok ayaklı uçuşta problem büyüyor, çözüm yöntemi değişiyor

Tek ayaklı uçuşta birleşik model zaten ağır. Çok ayaklı (multi-leg)
uçuşlarda karar mekanizmasının işlemesi gereken veri noktaları daha da
artıyor. Kaynak metin bunları sayıyor: bulanık talep koşulları (fuzzy
demand), yolcu tazminat cezaları, uçağa geliş oranları (show-up rate) ve
gelecek uçuşların talepleri. Bir ayakta verilen fazla rezervasyon kararı
yalnızca o ayağı değil, aynı yolcunun bağlandığı diğer ayakları ve
sonraki uçuşlara aktarılacak yolcuyu da etkiliyor.

Bu ölçekte kesin çözüm yöntemleri yerini sezgisel ve olasılıksal
yöntemlere bırakıyor. Kaynak metin iki araç ailesinden söz ediyor: birleşik
problemin Markov karar süreçleri ile modellenebileceğini, büyük ölçekli
çok ayaklı problemlerin de genetik algoritmalarla (GA) verimli şekilde
çözülüp beklenen kârın maksimize edilebileceğini söylüyor.

Buradaki mühendislik ödünleşimi tanıdık. Genetik algoritma kesin bir
optimum garanti etmiyor; belirli bir sürede iyi bir çözüm buluyor. Bu da
koruma seviyelerinin artık aynı girdiyle her çalıştırmada birebir aynı
çıkmayabileceği anlamına geliyor. Çıktıyı tüketen envanter sistemi ve onu
izleyen analist, sonuçların deterministik olmadığını bilerek
tasarlanmalı: hangi çalıştırmanın hangi girdiyle hangi limiti ürettiği
kayıt altında tutulmalı, yoksa bir limitin neden değiştiği sorusunun cevabı
kaybolur.

## Yarın işe yarayacak dört çıkarım

1. **İç içe envanterde üst sınıfları birlikte gör.** Karmaşık bir ağ ve iç
   içe sınıflar yönetiyorsan, sınıfları ikili karşılaştıran modeller yerine
   üst sınıfların talebini birleştiren EMSRB türevi modelleri tercih et.
   Varsayımı teoride kusurlu olsa da pratikte daha çok gelir getiriyor.
2. **Algoritmayı veriye göre seç.** Optimizasyon motorunu seçmeden önce
   talep verinin sürekli mi kesikli mi olduğunu analiz et. Sürekli O&D
   talebi için Curry, kesikli talep için Wollmer, ikisi birden için Brumelle
   ve McGill. Uyumsuz eşleşme hatalı koruma seviyesi üretir ve bunu sessizce
   yapar.
3. **Overbooking'i indirim tahsisinden ayırma.** Yalnızca kapasiteye bakan
   overbooking modelinden, iptal ve iade maliyetlerini sınıf bazlı talep
   tahminiyle birleştiren entegre modele geç. Kaynak metnin tahmini yüzde
   1-3 ek gelir; ilk iş show-up ve talep verisini aynı çözünürlüğe
   getirmek.
4. **Ortalamanın yanında varyasyon katsayısını izle.** Talep tahmininde
   yalnızca ortalamaya değil CV'ye de bak, belirsizlik yüksek olduğunda
   koruma seviyelerinin dinamik olarak yukarı çekilmesini sağla. Kontrolün
   sağlığını da sınıf bazında spill rate ile ölç: ücret düştükçe spill rate
   artmıyorsa bir yerde ayar bozuk.

Bu bölümde ne yok: show-up oranının kendisinin nasıl tahmin edildiği
("Biniş oranı tahmini ve overbooking stratejileri" ve "Havacılıkta
overbooking (fazla rezervasyon) ve show-up modelleme stratejileri"), EMSR
hesabını besleyen spill ölçümü ve talep dağılımları (spill ve Cox dağılımı
bölümleri), ve koruma seviyesinin tek ayaktan kalkış-varış ağına taşındığı
O&D kontrolü. Bu bölüm tek uçuşun kabinindeki koltukların hangi fiyata
ayrılacağını ve bu kararın overbooking'le nerede birleştiğini anlatmak için
var.
