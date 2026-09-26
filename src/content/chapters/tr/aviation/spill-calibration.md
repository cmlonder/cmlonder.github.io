---
title: "Havacılık spill modelleri için girdi parametrelerinin kalibrasyonu"
domain: "aviation"
summary: "Bir spill modeli ancak beslendiği iki sayı kadar doğru: talep değişkenliği katsayısı (CV) ve kapalı uçuşlardaki doluluk oranı (LFCF). Bu bölüm iki parametrenin hangi veriden, hangi filtreyle ve hangi ayrıntı düzeyinde kalibre edildiğini, küçük bir kaymanın yüksek dolulukta taşan yolcu tahminini nasıl katladığını anlatıyor."
audience: "Talep tahmini, kapasite planlama ya da gelir yönetimi sistemlerinde spill hesabı yapan veya bu hesabı tüketen yazılımcı ve analist. Spill, CV, LFCF, kısıtsızlaştırma (unconstraining) ve yerinden edilmiş yolcu yanlılığı metnin içinde tanımlanıyor; regresyona aşina olmak yeterli."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Bir uçağın kapasitesi sabit, talebi değil. Talep kapasiteyi aştığında uçağa
binemeyen yolcuya spill deniyor: kapasite kısıtı yüzünden reddedilen,
rezervasyon sisteminde hiç görünmeyen potansiyel yolcu. Spill modeli bu
görünmeyen kitleyi matematiksel olarak tahmin ediyor ve bu tahmin uçak
büyüklüğü, kapasite tahsisi ve uçuş kapatma kararlarının girdisi oluyor.
**Spill modelinin formülü değil, beslendiği iki parametre sonucu belirliyor:
talep değişkenliği katsayısı ve kapalı uçuşlardaki doluluk oranı yanlış
kalibre edilirse, model yüksek dolulukta hatayı katlayarak büyütüyor.** Bu
bölüm iki parametrenin nereden, hangi filtreyle ve hangi ayrıntı düzeyinde
hesaplandığını anlatıyor.

![Sunumun kapak slaytı. Başlık: Taşan Yolcu (Spill) Modellerinde Girdi Parametrelerinin Kalibrasyonu. Alt başlık: Kapasite Planlama ve Gelir Yönetimi Sistemleri İçin İleri Seviye Analitik. Ortada yukarıdan görülen bir uçağın üzerine çizilmiş çan eğrisi biçiminde bir talep dağılımı ve eğriyi kesen yatay turuncu bir fiziksel kapasite çizgisi; çizginin üstünde kalan turuncu alan Spill (Taşan Yolcu) olarak işaretli. Sol alttaki kutuda talep dağılımı: ortalama 150, standart sapma 25. Sağ alttaki kutuda fiziksel kapasite 180 ve tahmini spill, talebin kapasiteyi aşma olasılığı olarak tanımlı.](/decks/spill-calibration/01.webp "Turuncu alanın büyüklüğünü iki şey belirliyor: çizginin yeri ve eğrinin genişliği. Bu bölüm eğrinin genişliğiyle, yani değişkenlikle ilgili.")

## Model iki kadranla çalışıyor, ikisi de ayrı kalibre ediliyor

Kaynak metin iki parametreye odaklanıyor. Birincisi talep değişkenliği
katsayısı, CV: standart sapmanın ortalamaya oranı, yani talebin ortalamadan
ne kadar saptığının boyutsuz ölçüsü. İkincisi kapalı uçuşlardaki doluluk
oranı, LFCF (load factor of closed flights): satışa kapanmış, yani teoride
dolmuş bir uçuşun gerçekte kalkıştaki doluluğu.

İkisi farklı sorulara cevap veriyor. CV talep dağılımının şeklini tarif
ediyor; LFCF kapasitenin gerçekte ne kadarının kullanılabildiğini. Biri
talep tarafının, öteki arz tarafının düzeltmesi. Yazılım tarafında bunun
karşılığı şu: iki parametre aynı konfigürasyon tablosunda yan yana dursa
bile ayrı veri hatlarından, ayrı sıklıkla güncellenmeli. Birini
kalibre edip ötekini varsayılan değerde bırakan model, yarım kalibre edilmiş
bir model.

![Başlık: Uçuş Kapasitesi ve Talep Arasındaki Çatışma, Modelin İki Temel Kadranı. Üstte kesiti açılmış bir uçak kabini; yukarıdan dökülen mavi sıvı kabini doldurup yanlardan taşıyor, taşan kısım turuncu ve Spill (Taşan Yolcu) olarak işaretli. Sağda tanım: spill modeli, kapasite kısıtlamaları nedeniyle reddedilen potansiyel yolcuların matematiksel tahminidir. Altta iki gösterge: birinci kadran Talep Değişkenlik Katsayısı (CV), ikinci kadran Kapalı Uçuşlardaki Doluluk Oranı (LFCF). Alt bant: doğru bir tahminleme için bu iki parametrenin kesin kalibrasyonu şarttır.](/decks/spill-calibration/02.webp "Göstergelerdeki sayılar süs; önemli olan iki kadranın ayrı durması. Biri talebin şeklini, öteki kapasitenin gerçek sınırını ayarlıyor.")

## CV'nin doğru değeri, sorulan soruya göre değişiyor

Tek bir CV yok. Kaynak metin bunu açıkça söylüyor: spill modelinin
uygulamasına bağlı olarak talep değişkenliği katsayısı farklı ayrıntı
düzeylerinde tahmin edilmeli. Sayılan yaygın düzeyler beş tane: bir ay için
uçuş, bir ay için uçuş bacağı, bir yıl için uçuş bacağı, bir ay için sistem
ve bir yıl için sistem.

Seçim uygulamaya bağlı. Belirli bir seferin kapasite kararını veren analiz,
aylık uçuş düzeyindeki CV'ye bakıyor; ağ genelinde filo büyüklüğünü tartan
bir çalışma sistem düzeyinde yıllık bir değerle yetinebiliyor. Hata,
birinin değerini ötekinin sorusunda kullanmakta. Sistem geneli CV,
ortalamaların ortalaması olduğu için tek bir rotanın oynaklığını
yumuşatıyor; o değerle tek bir seferin spill'ini hesaplayan model, o seferin
riskini olduğundan küçük görüyor.

![Başlık: 1. Kadran, Talep Değişkenlik Katsayısı (CV) ve Granülarite. Solda iç içe halkalardan oluşan bir hedef tahtası; üç okla üç düzey işaretli. Sistem Seviyesi: tüm ağ, aylık veya yıllık. Bacak Seviyesi: uçuş bacağı (leg), aylık veya yıllık. Uçuş Seviyesi: spesifik uçuş, aylık. Sağda iki kutu. CV Nedir: talebin ortalamadan ne kadar saptığını ölçer. Kural: modelin uygulama amacına göre doğru granülarite (veri çözünürlüğü) seviyesi seçilmelidir.](/decks/spill-calibration/03.webp "Halkalar içe doğru daralıyor: merkez tek bir sefer, dış halka bütün ağ. Hangi halkadan ölçtüğün, hangi karara cevap verdiğini belirliyor.")

Yazılım tarafında bu, CV'nin tek bir skaler değil, anahtarı ayrıntı düzeyi
ve dönem olan bir tablo olması demek. Spill hesabını çağıran servis hangi
düzeyi istediğini açıkça belirtmeli; varsayılan bir sistem değerine sessizce
düşmek, yanlış sorunun cevabını doğru sorunun yerine koymak.

## Gözlenen yolcu talep değil, kapasitenin izin verdiği kadarı

CV'yi hesaplamak için ilk akla gelen veri, gerçekleşen yolcu sayıları. Ama
dolmuş bir uçuşta gözlenen sayı talebi değil, kapasiteyi ölçüyor: uçak 180
koltuksa ve 180 kişi uçtuysa, talebin 180 mi 230 mu olduğu bu veriden
anlaşılmıyor. Dolu uçuşlarda gerçekleşen rakamlar talebin kesilmiş hali.

Kaynak metin iki çözüm yolu sunuyor. Birincisi kısıtsızlaştırma
(unconstraining): sadece gerçekleşen rakamlara bakmak yerine rezervasyon
sınıflarının açık ve kapalı durum bilgisini kullanarak kısıtlanmamış trafik
verisi üzerinden toplam talebi bulmak ve CV'yi bu gerçek talep üzerinden
tahmin etmek. Bir sınıf kalkıştan günler önce satışa kapandıysa, o
sınıftaki talebin gözlenenden fazla olduğu bilgisi o kapanma anında
saklı.

İkincisi regresyon. Aylık uçuş verisi üzerinde Y = β0 + β1X + E biçiminde
bir model kuruluyor: Y standart sapma, X ortalama doluluk oranı. Standart
sapma ortalamayla orantılı büyüyorsa, bu orantının katsayısı tanım gereği
CV. Eğim katsayısı β1 bu yüzden doğrudan hedeflenen CV değerini veriyor.

## Yüzde 60 filtresi olmadan regresyon değişkenliği küçük gösteriyor

Regresyonun bir tuzağı var ve kaynak metin onu tek bir kuralla kapatıyor:
örneklem yalnızca doluluk oranı yüzde 60'ın altında olan uçuşları
içermeli. Kaynak metin bu kuralın gerekçesini de veriyor: örneklemin
yalnızca doluluğu yüzde 60'tan az olan uçuşlardan oluşması, kalibrasyona
yerinden edilmiş yolcu yanlılığının (displaced passenger bias) girmemesi
için önemli.

Mekanizma şöyle. Doluluk arttıkça kapasite kısıtı devreye girmeye başlıyor
ve talep dağılımının üst kuyruğu kesiliyor. Kesilen kuyruk, yüksek talepli
günlerin gözlenen değerini tavana sabitliyor; tavana yapışmış değerlerin
standart sapması da gerçek dağılımınkinden küçük çıkıyor. Bu uçuşlar
regresyona girerse eğim düşüyor ve model talebin olduğundan daha kararlı
olduğunu sanıyor. Yüzde 60 sınırı, kısıtın henüz ölçümü bozmadığı bölgede
kalmanın yolu.

![Başlık: CV Tahminleme Hattı, Regresyon ve Yanılgı Filtresi. Üstte dört düğümlü bir akış: Node 1 aylık uçuş verileri; Node 2 filtre, doluluk oranı (LF) yüzde 60'ın üzerinde olanları çıkar; Node 3 regresyon modeli, Y eşittir β0 artı β1X artı E; Node 4 eğim (β1) eşittir CV katsayısı. Altta bir talep dağılımı eğrisi ve eğrinin sağ tarafını kesen bir tuğla duvar; duvarın arkasında kalan turuncu kuyruk Yer Değiştiren Yolcu Yanılgısı (Displaced Passenger Bias) olarak işaretli. Sağdaki kutu: yüksek doluluk oranlarında ölçüm yapmak, talebi kapasite ile sınırlar ve gerçek değişkenliği gizler.](/decks/spill-calibration/04.webp "Filtre ikinci düğümde, regresyondan önce duruyor. Sıra değişirse eğim zaten kesilmiş kuyruktan hesaplanmış oluyor.")

Bu filtrenin bir bedeli var ve karşılaştırma slaytı onu açıkça yazıyor:
regresyon yaklaşımı uygulaması basit ve matematiksel olarak doğrulanmış,
ama yüksek doluluklu popüler uçuşların verisini tamamen dışarıda bırakıyor.
Yani CV, tam da spill riskinin en yüksek olduğu uçuşlar hariç tutularak
tahmin ediliyor. Kısıtsızlaştırma yaklaşımı bütün uçuş verisini kullanıp
orijinal talebi simüle ediyor; bedeli gelişmiş bir veri altyapısı ve
karmaşık algoritmalar.

![Başlık: Teşhis Matrisi, CV Tahminleme Yöntemleri Karşılaştırması. İki sütunlu tablo. Regresyon Yaklaşımı. Mekanizma: sınırlı veri seti (LF yüzde 60'tan küçük) üzerinden istatistiksel eğim hesaplama. Avantaj: uygulaması basit, matematiksel olarak doğrulanmış. Dezavantaj: yüksek doluluklu popüler uçuşların verilerini tamamen dışarıda bırakır. Kısıtsızlaştırma (Unconstraining) Yaklaşımı. Mekanizma: rezervasyon sınıflarının açık/kapalı durumlarına göre trafik verilerini kısıtsızlaştırarak gerçek talebi bulma. Avantaj: tüm uçuş verilerini kullanır, orijinal talebi simüle eder. Dezavantaj: gelişmiş veri altyapısı ve karmaşık algoritmalar gerektirir.](/decks/spill-calibration/05.webp "İki sütunun dezavantajları birbirinin avantajı. Seçim, elindeki veri altyapısının neye izin verdiğine bağlı.")

Seçimi belirleyen şey çoğu zaman yöntem tercihi değil, veri. Kısıtsızlaştırma
için her rezervasyon sınıfının ne zaman açılıp ne zaman kapandığının
geçmişi gerekiyor. Envanter sistemi yalnızca güncel durumu tutuyor, durum
değişikliklerini tarihçesiyle saklamıyorsa, bu yol baştan kapalı. Yazılım
tarafında bunun karşılığı şu: sınıf açılış ve kapanış olaylarını bugün
saklamaya başlamak, yarın daha iyi bir CV hesaplayabilmenin ön koşulu.
Kaybedilen tarihçe geriye dönük üretilemiyor.

## Kapalı uçuş hiçbir zaman tam dolu kalkmıyor

İkinci kadran arz tarafında. Teoride satışa kapanmış bir uçuş doludur ve
doluluk oranı 1.0 olmalıdır. Kaynak metin pratiği farklı tarif ediyor:
uygulamada kapalı uçuşlardaki doluluk oranı, aşırı rezervasyon
(overbooking) sürecindeki belirsizlikler yüzünden hiçbir zaman 1.0'a eşit
olmuyor.

Sebep, kapanma ile kalkış arasındaki mesafe. Havayolu iptal ve gelmeyen
(no-show) yolcuyu öngörerek kapasitenin üzerinde satıyor; ama iptal ve
no-show sayısı tahmin, gerçekleşen değil. Tahmin tutmadığında satışa kapalı
uçuş boş koltukla kalkıyor. Aşırı rezervasyon bu açığı kapatmaya çalışıyor
ama belirsizliği ortadan kaldırmıyor.

![Başlık: 2. Kadran, Kapalı Uçuşlarda Doluluk Oranı (LFCF) Gerçekliği. Solda iki kutu. Teori: kapalı bir uçuşun doluluk oranı (LFCF) 1.0 (yüzde 100) olmalıdır. Pratik Gerçeklik: overbooking sürecindeki belirsizlikler nedeniyle LFCF asla yüzde 100'e tam eşit olmaz; LFCF'nin düşmesi taşan (spill) yolcu sayısının artması anlamına gelir. Sağda Expected vs. Actual LFCF başlıklı bir şelale grafiği: 100 koltuk (fiziksel kapasite), artı overbooking (çifte rezervasyon), eksi iptaller ve no-show yolcular, sonuçta gerçekleşen doluluk oranı (LFCF yüzde 100'ün altında).](/decks/spill-calibration/06.webp "Son sütun ilk sütundan kısa: aşırı rezervasyonla eklenen koltuklar, iptal ve no-show ile düşenleri her zaman karşılamıyor.")

LFCF'nin 1.0'ın altında olmasının spill tahminine etkisi sezgiye ters
geliyor: daha düşük LFCF daha fazla spill demek. Kapalı bir uçuş yüzde 100
yerine yüzde 96 dolulukla kalkıyorsa, kapanma daha düşük bir gözlenen
dolulukta gerçekleşiyor demek; model aynı gözlenen dolulukta uçuşların daha
büyük bir kısmını kapanmış, yani talebi geri çevirmiş sayıyor. Brifingdeki örnekte gözlenen doluluk
yüzde 90 iken LFCF yüzde 100 kabul edildiğinde spill oranı yüzde 14,12;
LFCF yüzde 96'ya indiğinde yüzde 20,31'e çıkıyor. Dört puanlık bir
düzeltme, spill tahminini üçte birden fazla artırıyor.

## İki parametre birlikte kayınca hata katlanıyor

Asıl risk, iki parametrenin etkisinin toplanmaması, çarpışması. Brifingin
tablosu yüzde 80 gözlenen dolulukta dört durumu karşılaştırıyor. CV 0,30 ve
LFCF yüzde 100 iken nominal doluluk yüzde 84,70, spill oranı yüzde 5,55 ve
uçuş kapatma oranı yüzde 25,19. CV 0,40'a çıkınca, LFCF aynı kalsa bile,
nominal doluluk yüzde 90,46'ya, spill yüzde 11,56'ya, kapatma oranı yüzde
34,92'ye çıkıyor. CV 0,30'da kalıp LFCF yüzde 96'ya indiğinde nominal
doluluk yüzde 86,62, spill yüzde 7,64, kapatma oranı yüzde 32,69. İkisi
birlikte, CV 0,40 ve LFCF yüzde 96 olduğunda, nominal doluluk yüzde 93,84,
spill yüzde 14,74, kapatma oranı yüzde 42,44.

Burada nominal doluluk, spill edilen talep de uçağa binseydi ulaşılacak
doluluk; yani kısıtsız talebin kapasiteye oranı. Gözlenen ile nominal
arasındaki makas, görünmeyen talebin büyüklüğü. Aynı yüzde 80'lik gözlenen
doluluk, parametrelere göre yüzde 84,70 ile yüzde 93,84 arasında değişen
bir gerçek talebe karşılık geliyor.

Değişkenliğin tek başına etkisi de küçük değil. CV 0,30'dan 0,40'a
çıktığında yüzde 80 dolulukta spill oranı yüzde 5,55'ten yüzde 11,56'ya,
yani iki katından fazlasına çıkıyor. Brifing buradan bir kapasite kuralı
çıkarıyor: CV'deki 0,10'luk bir artış, yüksek doluluklu uçuşlarda spill
miktarını yaklaşık ikiye katlayabilir ve kapasite planı bunu hesaba
katmalı. Yüksek belirsizlik karşısında sistemin daha agresif bir uçuş
kapatma ya da kapasite tahsis stratejisi uygulaması gerekiyor.

![Başlık: Sentez, Gama Taşma Tablolarında Parametre Etkileşimi. Yatay eksende gözlemlenen doluluk oranı (yüzde 55'ten 95'e), dikey eksende taşan yolcu oranı. Üç eğri. Kesikli mavi çizgi, baz senaryo, CV 0,30 ve LFCF yüzde 100: yüzde 95 dolulukta 23,17. Düz mavi çizgi, yüksek değişkenlik, CV 0,40 ve LFCF yüzde 100: yüzde 95 dolulukta 35,24. Kalın turuncu çizgi, gerçeklik şoku, CV 0,40 ve LFCF yüzde 96: yüzde 95 dolulukta 54,97. Tehlike Bölgesi kutusu: LFCF sadece yüzde 4 düştüğünde ve talep değişkenliği yüksek olduğunda, yüzde 95 dolulukta taşma oranı yüzde 54,97'ye fırlar.](/decks/spill-calibration/07.webp "Eğriler yüzde 65 civarında birbirine yakın, yüzde 95'te iki katından fazla ayrık. Kalibrasyon hatası en çok, kararın en pahalı olduğu yerde görünüyor.")

Grafik, tablonun gösteremediği şeyi gösteriyor: eğriler arasındaki mesafe
doluluk arttıkça açılıyor. Yüzde 95 dolulukta baz senaryo yüzde 23,17 spill
öngörürken, yalnızca CV'yi yükseltmek bunu yüzde 35,24'e, LFCF'yi de dört
puan düşürmek yüzde 54,97'ye taşıyor. Düşük dolulukta parametre hatası
birkaç puanlık bir sapma; yüksek dolulukta tahminin iki katından fazlası.
Kapasite kararlarının çoğu da tam bu bölgede, dolu uçuşlarda veriliyor.

## Kapatma oranı bir risk göstergesi olarak izlenmeli

Spill tahmini tek başına bir sayı; operasyonel karşılığı uçuş kapatma
oranı, yani uçuşların ne kadarının satışa kapandığı. Brifing bunun için
izlenecek göstergeyi tarif ediyor: gözlenen doluluk ile nominal doluluk
arasındaki makas. Nominal doluluk gözlenenin belirgin şekilde üzerine
çıktığında, özellikle CV yüksekse, kapatma oranı bir risk işareti. Brifingin
örneğinde yüzde 95 dolulukta kapatma oranı yüzde 90'ın üzerine çıkıyor: o
noktada uçuşların neredeyse hepsi talebi geri çeviriyor.

Yazılım tarafında bunun karşılığı, spill modelinin çıktısının tek başına
bir tahmin değil, izlenen bir metrik olması. Gözlenen ve nominal doluluk
her uçuş için yan yana raporlanırsa, makasın hangi rotada açıldığı görünür
hale geliyor. Açılan makas ya gerçekten büyüyen bir talebi ya da yanlış
kalibre edilmiş bir parametreyi gösteriyor; ikisini ayırmak için de
parametrelerin hangi veriyle, hangi tarihte kalibre edildiği kayıtlı olmalı.

![Başlık: Sistem Özeti, Doğru Kalibrasyonun Operasyonel Etkisi. Üç kart. CV'yi Temiz Veriyle Besleyin (huni simgesi): sadece yüzde 60 doluluk altındaki verileri kullanarak veya gelişmiş kısıtsızlaştırma (unconstraining) teknikleri uygulayarak yanılgı filtresini aşın. LFCF'yi Gerçekçi Tutun (nişangah simgesi): kapalı uçuşların yüzde 100 dolu kalkmadığını (overbooking belirsizliği nedeniyle) matematiksel olarak modele dahil edin. Üstel Etkiyi Unutmayın (yukarı kıvrılan eğri simgesi): gözlemlenen doluluk arttıkça, yanlış kalibre edilmiş bir CV veya LFCF taşma (spill) hatalarını üstel olarak büyütür ve potansiyel gelir kaybına yol açar.](/decks/spill-calibration/08.webp "Üçüncü kart ilk ikisinin neden önemli olduğunu söylüyor: ilk iki karttaki ihmal, dolu uçuşlarda katlanarak geri dönüyor.")

## Yarın işe yarayacak dört çıkarım

1. **CV'yi yüzde 60 filtresiyle hesapla.** Regresyon tabanlı CV
   kalibrasyonunda doluluğu yüzde 60'ın üzerindeki uçuşları örneklemden
   kesinlikle çıkar. Aksi halde kapasite kısıtı kuyruğu kesiyor ve talep
   değişkenliği olduğundan düşük çıkıyor. Filtreyi regresyondan önce uygula,
   sonra değil.
2. **Kısıtsız veriyi biriktirmeye bugün başla.** Yalnızca gerçekleşen uçuş
   verisiyle yetinme; rezervasyon sınıflarının açılış ve kapanış geçmişini
   içeren kısıtsız veri setlerini CV tahminine entegre et. Envanter sistemi
   bu geçmişi tutmuyorsa, önce onu saklamaya başla.
3. **LFCF'yi 1.0'da bırakma.** Gerçekçi bir model için LFCF'yi yüzde 100
   yerine operasyonel belirsizliği yansıtan daha düşük bir değerde tut;
   brifingdeki örnek yüzde 96. Modelin muhafazakâr mı agresif mi olacağına
   bu parametreyle, bilerek karar ver.
4. **Kapasite planını CV hassasiyetine göre kur.** CV'deki 0,10'luk bir
   artışın yüksek doluluklu uçuşlarda spill'i yaklaşık ikiye
   katlayabileceğini varsay. Gözlenen ve nominal doluluk arasındaki makası
   izle; yüksek CV'li rotada kapatma oranı yükseliyorsa bunu bir risk
   işareti olarak ele al.

Bu bölümde ne yok: spill modelinin kendisi ve taşan talebin hangi
dağılımla hesaplandığı (spill bölümleri), aşırı rezervasyonun nasıl
hesaplandığı ve yolcu miksini seçen mekanizma (gelir yönetimi bölümleri).
Bu bölüm o modellerin beslendiği iki sayının nereden geldiğini anlatmak için
var.
