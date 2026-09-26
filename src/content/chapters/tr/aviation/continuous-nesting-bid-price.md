---
title: "Sürekli yuvalama (continuous nesting) ve teklif fiyatı kontrol sistemleri analizi"
domain: "aviation"
summary: "Sürekli yuvalama, koltukları önceden sınıflara ayırmak yerine her koltuğa anlık bir değer biçen ve her talebi o değerle karşılaştıran envanter kontrolüdür. Bu bölüm net katkı kuralını, satış ve iptalle kayan teklif fiyatını, doğrusal eğim ile teklif fiyatı eğrisi arasındaki farkı ve POS gibi pazar değişkenlerinin karara nasıl girdiğini anlatıyor."
audience: "Envanter, erişilebilirlik ya da gelir yönetimi sistemleriyle çalışan, bir rezervasyon talebine neden evet ya da hayır dendiğini anlamak isteyen yazılımcı ve analist. Sanal yuvalamanın anlatıldığı bölümler okunmuş olsa iyi olur; teklif fiyatı, net katkı, teklif fiyatı eğimi, teklif fiyatı eğrisi, MAF ve olasılıksal gölge fiyat metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler envanterin bir ucuna bakıyordu: kapasiteden fazla
rezervasyon kabul etmek ve gelmeyen yolcunun koltuğunu geri kazanmak. Bu
bölüm öbür uca, satılabilir koltuğun kime verileceğine bakıyor. Gelir
yönetimi uzun süre bu soruya kontenjanla cevap verdi: her ücret sınıfına
belli sayıda koltuk ayrılır, sınıf dolunca kapanır. O&D kontrolünün ilk
kuşağı da bu mantığı korudu; güzergâhları sanal kovalara eşledi ve
kovaları yönetti. Sürekli yuvalama (continuous nesting) kovayı ortadan
kaldırıyor. **Koltuk artık bir sınıfa ayrılmıyor; her koltuğun anlık bir
fiyatı var ve her talep o fiyatla karşılaştırılıyor.** Kaynak metin bunu
envanter kontrollerinin tahsis odaklı (allocation-driven) dünyasından
fiyat odaklı (price-driven) bir çerçeveye radikal bir geçiş olarak
tanımlıyor.

Bu geçişin iş mantığı tek bir karşılaştırmaya dayanıyor. Geri kalan her
şey, o karşılaştırmanın iki tarafındaki sayıların nasıl üretildiği ve
nasıl güncel tutulduğuyla ilgili.

## Kabul kararı tek bir eşitsizlik: ücret, yolun toplam teklif fiyatını geçmeli

Teklif fiyatının (bid price) tanımı bölümün geri kalanını taşıyor: kaynak
metin onu bir uçuşta artımlı bir koltuğa sahip olmamanın fırsat maliyeti
olarak tanımlıyor. Yani bir bacaktaki bir sonraki koltuğu bugün satarsan,
ileride o koltuğu başka bir yolcuya satarak elde edebileceğin beklenen
geliri kaybediyorsun. Teklif fiyatı o kaybın parasal karşılığı.

Kabul kuralı bunun üstüne kuruluyor ve adı net katkı (net contribution).
Talep edilen hizmetin ücreti, o hizmeti oluşturan uçuş bacaklarının toplam
teklif fiyatından yüksekse talep kabul ediliyor; değilse reddediliyor.
Tek bacaklı bir yolculukta bu, ücretle o bacağın teklif fiyatını
karşılaştırmak demek. Aktarmalı bir seyahat programında (itinerary) ise
fırsat maliyeti, yolculuğu oluşturan bütün bacakların teklif fiyatlarının
toplamı. Bu toplam, o koltukların başka bir yolcu kombinasyonuna satılması
durumunda elde edilebilecek muhtemel geliri temsil ediyor.

Kuralın gücü burada ortaya çıkıyor. Kaynak metin, bu tanımın sistemin
neden her zaman en yüksek ücretli yolcuyu değil, ağın toplam gelirini
maksimize edecek yolcu kombinasyonunu seçtiğini açıkladığını söylüyor.
Aktarmalı yolcu toplamda daha yüksek bir ücret ödüyor olabilir; ama iki
yoğun bacağın ikisinde de koltuk tüketiyorsa, toplam teklif fiyatı o
ücreti aşabilir. Tersi de geçerli: düşük ücretli bir yolcu, boş kalacak
bir bacakta koltuk istiyorsa teklif fiyatı düşük olduğu için kabul
ediliyor. Karar ücretin mutlak büyüklüğüne değil, ağda neyi yerinden
ettiğine bakıyor.

Yazılım tarafında bunun karşılığı çok sade bir erişilebilirlik fonksiyonu:
girdi olarak güzergâhın bacak listesini ve ücreti alıyor, bacak başına
teklif fiyatını okuyup topluyor, tek bir karşılaştırmayla cevap dönüyor.
Karmaşıklık bu fonksiyonda değil, okuduğu tablonun nasıl doldurulduğunda.

## Teklif fiyatı bir kez hesaplanıp bırakılmıyor, her satışla kayıyor

Optimizasyon modeli teklif fiyatını belli aralıklarla üretiyor. Ama iki
optimizasyon arasında rezervasyon gelmeye, iptal düşmeye devam ediyor.
Her satılan koltuk kalan kapasiteyi azaltıyor ve bir sonraki koltuğun
fırsat maliyetini yükseltiyor; her iptal tersini yapıyor. Teklif fiyatı
sabit kalırsa sistem, dolmakta olan bir uçakta son koltukları ilk
koltuklarla aynı değerden satmaya devam ediyor.

Kaynak metnin tarif ettiği çözüm teklif fiyatı eğimi (bid price
gradient). Bir rezervasyon kabul edildiğinde mevcut teklif fiyatına eğim
miktarı ekleniyor, fiyat yükseliyor. Bir iptal geldiğinde eğim miktarı
mevcut fiyattan çıkarılıyor, fiyat düşüyor. Böylece fırsat maliyeti her
koltuk değişimiyle anlık olarak güncelleniyor ve optimizasyonun bir
sonraki koşusunu beklemek zorunda kalmıyor.

Buradaki mühendislik ayrıntısı önemli: eğim, satış ve iptal olaylarını
dinleyen bir bileşenin teklif fiyatı tablosunu yerinde güncellemesi
demek. Bunu yapan kod yolu, rezervasyonu onaylayan yolla aynı işlemin
içinde olmalı; aksi halde iki eşzamanlı talep aynı eski teklif fiyatını
okuyup ikisi birden kabul edilebilir. Brifing bu eşzamanlılık sorununu
ayrıca ele almıyor, ama anlık güncelleme vaadi ancak bu sıralama
korunursa gerçek oluyor.

## Doğrusal eğim küçük adımlarda yeter, büyük adımlarda eğri gerekir

Eğim yaklaşımının bir varsayımı var: teklif fiyatı kapasiteyle doğrusal
değişiyor. Kaynak metin bunun kapasitedeki küçük değişiklikler için hızlı
bir yaklaşım olduğunu, ama büyük değişikliklerde hata payının arttığını
söylüyor. Gerçek fırsat maliyeti kalan kapasiteyle doğrusal değişmiyor;
uçak dolmaya yaklaştıkça bir sonraki koltuğun değeri bir önceki kadar
değil, daha hızlı artabiliyor. Tek bir sabit eğimle bu eğriliği taklit
etmek, doluluk optimizasyon anındaki noktadan uzaklaştıkça yanılma
payını büyütüyor. Grup rezervasyonu ya da toplu iptal gibi kapasiteyi bir
anda çok oynatan olaylar da aynı sorunu tetikliyor.

Alternatif teklif fiyatı eğrisi (bid price curve), diğer adıyla teklif
fiyatı vektörü. Tek bir değer ve bir eğim yerine, farklı doluluk
seviyeleri için önceden hesaplanmış teklif fiyatları saklanıyor. Satış
ya da iptal olduğunda sistem eğimle tahmin yürütmüyor, yeni doluluk
seviyesine karşılık gelen değeri doğrudan okuyor. Kaynak metne göre bu,
optimizasyonlar arasındaki gecikme (latency) süresinde bile daha doğru ve
doğrusal olmayan fiyatlandırma kararları verilmesini sağlıyor.

Yazılım tarafında ödünleşim açık. Eğim bacak başına iki sayı tutuyor:
teklif fiyatı ve eğim. Eğri bacak başına bir dizi tutuyor ve
optimizasyonun her koşusunda bu dizinin tamamını yayınlamak gerekiyor.
Karşılığında erişilebilirlik fonksiyonu hesap yapmayı bırakıp tablo
okumaya dönüyor ve iki optimizasyon arasındaki pencere uzasa bile karar
kalitesi eğimdeki kadar hızlı bozulmuyor. Hangisinin seçileceği, o
pencerenin ne kadar uzun olduğuna ve kapasitenin pencere içinde ne kadar
oynadığına bağlı.

## Kova kalkınca hem granülarite artıyor hem CRS'in yükü azalıyor

Sanal yuvalama (virtual nesting) O&D kontrolünün ilk ciddi adımıydı:
güzergâh ve sınıf kombinasyonları değerlerine göre sabit kovalara
eşleniyor, kontrol kova üzerinden yapılıyordu. Sürekli yuvalamanın bu
yönteme göre temel operasyonel avantajı, envanteri bireysel seyahat
programı ve sınıf düzeyinde kontrol etmesi. Sabit kova mantığı ortadan
kalktığı için her talep kendi ücreti ve kendi bacak kombinasyonuyla,
benzersiz olarak değerlendiriliyor. Kaynak metnin karşılaştırma tablosu
bunu granülarite sütununda özetliyor: geleneksel yaklaşımda düşük ve
kova bazlı, sürekli yuvalamada çok yüksek ve işlem bazlı.

İkinci kazanç ilk bakışta sezgiye ters: daha ince kontrol, daha az sistem
yükü getiriyor. Kaynak metne göre sürekli yuvalama merkezi rezervasyon
sistemleri (CRS) üzerindeki veri yükünü azaltıyor. Tablo nedenini de
veriyor: geleneksel kontrolde yük yüksek, çünkü CRS üzerinde kova eşleme
yapılıyor; teklif fiyatı kontrolünde yük düşük, çünkü kontrol fiyat
tabanlı. Kova dünyasında her güzergâh ve sınıf kombinasyonunun hangi
kovaya düştüğü tutulmalı ve güncel kalmalı. Fiyat dünyasında CRS'e inen
şey bacak başına bir teklif fiyatı; güzergâhın değeri talep anında
toplanarak hesaplanıyor.

Bu, envanter sistemi tasarlayanlar için somut bir mimari tercih.
Eşleme tablosu kombinasyon sayısıyla büyüyen bir veri yapısı; teklif
fiyatı tablosu bacak sayısıyla büyüyor. Güzergâh çeşitliliği arttıkça
kova eşlemesini güncel tutmanın bedeli de artıyor; teklif fiyatı
tablosunun bedeli ise yalnızca bacak sayısına bağlı kalıyor.

Kaynak metnin karşılaştırma tablosu iki yaklaşımı beş eksende yan yana
koyuyor:

| Özellik | Geleneksel (bacak/segment) | Sürekli yuvalama (teklif fiyatı) |
|---|---|---|
| Karar birimi | Sabit sınıf kontenjanları | Artımlı gelir / fırsat maliyeti |
| Granülarite | Düşük (kova bazlı) | Çok yüksek (işlem bazlı) |
| Sistem yükü | Yüksek (CRS üzerinde kova eşleme) | Düşük (fiyat tabanlı kontrol) |
| Esneklik | Kısıtlı | POS ve doğrudan maliyetler eklenebilir |
| Güncelleme | Periyodik optimizasyon | Satış/iptal anında anlık güncelleme (eğim) |

Güncelleme satırı eğim başlığında anlatıldı; esneklik satırı bir sonraki
başlığın konusu.

## Aynı koltuk, farklı pazardan gelen talebe farklı fiyat biçebiliyor

Kova sisteminde bir güzergâh ve sınıf kombinasyonunun değeri kovaya
eşlendiği anda sabitleniyordu. Teklif fiyatı çerçevesinde değer bir
hesap olduğu için hesaba yeni terimler eklenebiliyor. Kaynak metin
sürekli yuvalamanın teklif fiyatı hesaplamasına doğrudan değişken
maliyetleri, döviz dalgalanmalarını ve stratejik promosyonel değerleri
dahil etme esnekliğine sahip olduğunu söylüyor.

Satış noktası (Point of Sale, POS) ve seyahat başlangıç noktası (Point of
Commencement, POC) bu esnekliğin en görünür kullanımı. Aynı koltuk için
farklı pazarlardan gelen talepler farklı stratejik değerlerle
değerlendirilebiliyor. Bir pazarda satılan biletin ücreti farklı bir
para biriminden geliyorsa, döviz etkisi karşılaştırmanın ücret tarafına
yansıyor. Havayolu belli bir pazarda büyümek istiyorsa, o pazardan gelen
talebe promosyonel bir değer ekleyerek net katkıyı kendi stratejisine
göre ayarlayabiliyor. Karar kuralı değişmiyor, yalnızca ücret tarafına
giren sayı zenginleşiyor.

Yazılım tarafında bu, erişilebilirlik isteğinin bacak listesi ve ücretle
sınırlı kalmaması demek: isteğin POS'u, POC'u ve para birimi de
fonksiyonun girdisi oluyor. Bu alanları taşımayan bir erişilebilirlik
arayüzü, sürekli yuvalamanın esnekliğini baştan kullanılamaz hale
getiriyor.

## MAF, kapasite daraldıkça yükselen bir eşik

Teklif fiyatının bir başka okunuşu minimum kabul edilebilir ücret
(Minimum Acceptable Fare, MAF). Kaynak metin MAF'ı, bir uçuş bacağında
bir birim ek kapasitenin sağlayabileceği artımlı toplam gelir olarak
tanımlıyor. Rezervasyonlar arttıkça ve uçaktaki kapasite azaldıkça MAF
yükseliyor. Yolcunun ödemeye razı olduğu ücret MAF'ın altındaysa koltuk,
daha yüksek değerli bir talep için saklanıyor.

Bu, eğim bölümündeki mekanizmanın müşteri tarafından görünüşü. Satış
geldikçe teklif fiyatı yukarı kayıyor; dışarıdan bakan için bu, uçak
doldukça kabul edilen en düşük ücretin yükselmesi olarak görünüyor.
Kontenjan dünyasında aynı etki, alt sınıfların sırayla kapanmasıyla
elde ediliyordu. Burada kapanan bir sınıf yok; yükselen tek bir eşik var.

## Teklif fiyatı kesin bir sayı değil, belirsizliğin fiyatı

Teklif fiyatını üreten modelin kendisi de brifingde tanımlanıyor. Sistem
teklif fiyatını olasılıksal bir gölge fiyat (probabilistic shadow price)
olarak ele alıyor. Hesap stokastik bir ağ optimizasyon modeline dayanıyor
ve dört şeyi birlikte değerlendiriyor: mevcut rezervasyon durumu, kalan
talep tahmini, tahminlerdeki varyasyon, yani belirsizlik, ve kalan
kapasite.

Üçüncü kalem bu listenin en kolay atlanan parçası. Kalan talebin
ortalaması aynı olsa bile, tahminin ne kadar oynadığı bir sonraki
koltuğun değerini değiştiriyor. Tahmin belirsizliği modelin girdisi
olmadığında, teklif fiyatı ortalama bir geleceğe göre hesaplanıyor ve o
gelecekten sapan her gün yanlış kabul ya da yanlış ret kararına
dönüşüyor. Bu yüzden teklif fiyatının kalitesi, önceki bölümlerde
anlatılan talep tahmininin yalnızca ortalamasına değil, varyansına da
bağlı.

## Yarın işe yarayacak dört çıkarım

1. **Kabul kararını net katkıyla ver.** Bir rezervasyonu değerlendirirken
   ücreti tek başına değil, güzergâhı oluşturan bacakların toplam teklif
   fiyatıyla karşılaştır. En yüksek ücretli yolcuyu değil, ağın toplam
   gelirini büyüten kombinasyonu kabul et.
2. **Teklif fiyatını her işlemde güncelle.** Satış ve iptallerin teklif
   fiyatını eğimle anında oynatmasını sağla; optimizasyonun bir sonraki
   koşusunu bekleme. Bu güncellemeyi rezervasyon onayıyla aynı işlemin
   içinde tut.
3. **Kapasite çok oynuyorsa eğim yerine eğri kullan.** Doğrusal eğimin
   büyük kapasite değişimlerinde yanıldığını hesaba kat. Farklı doluluk
   seviyeleri için önceden hesaplanmış teklif fiyatı eğrisi sakla ve
   optimizasyonlar arasındaki gecikmede de ondan oku.
4. **Pazar değişkenlerini hesaba sok.** POS ve POC bazlı stratejik
   değerleri, döviz etkisini ve değişken maliyetleri teklif fiyatı
   karşılaştırmasına dahil et; erişilebilirlik arayüzünün bu alanları
   taşıdığından emin ol.

Bu bölümde ne yok: teklif fiyatını üreten stokastik ağ optimizasyonunun
matematiği, kalan talep tahmininin nasıl yapıldığı ("O&D talep tahmini:
birinci ve ikinci nesil yaklaşımlar", "O&D tahminleme ve must-forecast
listesi") ve sanal yuvalamanın ilk kuşak O&D kontrolü olarak nasıl
devreye alındığı ("Gelir yönetimi ve stratejik operasyonlar: PEOPLExpress
ve American Airlines analizi"). Kapasiteden fazla rezervasyon kabul
etmenin hesabı overbooking bölümlerinde. Bu bölüm yalnızca kabul
kararının hangi karşılaştırmaya dayandığını ve o karşılaştırmanın
sayılarının iki optimizasyon arasında nasıl güncel tutulduğunu anlatmak
için var.
