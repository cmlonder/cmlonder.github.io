---
title: "Havacılıkta spill (taşan talep) modeli ve iş mantığı analizi"
domain: "aviation"
summary: "Dolu kalkan bir uçuşun verisi talebin kapasitede bittiğini söyler, oysa talep orada kesilmiştir. Spill modeli bu kesilen kısmı tahmin eder ve uçak büyütmeden kabin düzenine, kurumsal indirimden mil biletine kadar altı ayrı kararın fiyatını aynı hesaptan çıkarır. Bu bölüm Boeing modelinin mantığını, hesaplama altyapısını ve LFCF varsayımının neden taşmayı olduğundan az gösterdiğini anlatıyor."
audience: "Gelir yönetimi, envanter, filo ya da ağ planlama sistemleriyle çalışan, talep tahmininin kapasite kararına nasıl bağlandığını anlamak isteyen yazılımcı ve ürün insanı. Gelir yönetimi bölümlerinin okunmuş olması işe yarar; spill rate, uçuş ve yolcu kapanma oranı, displacement ve LFCF metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Bir uçuş yüzde yüz dolulukla kalktığında sistemdeki kayıt kapasite kadar
yolcu gösteriyor. Bu sayı talebin kendisi değil, talebin uçağa sığan kısmı.
Kapasitenin ötesinde koltuk arayıp bulamayan yolcu hiçbir tabloya
girmiyor; başka bir uçuşa, başka bir havayoluna ya da hiç uçmamaya
gidiyor. **Spill modeli, dolu uçağın susturduğu talebi sayıya çeviren araç;
filodan sadakat programına kadar kapasiteye dokunan her karar bu sayının
üzerine kuruluyor.** Brifing onu operasyonel bir ölçüt olarak değil,
stratejik bir planlama aracı olarak konumluyor, bu bölüm de o iddianın
arkasındaki mantığı açıyor.

![Sunumun kapak slaytı. Üstte bir çan eğrisi, ortasından dikey kesikli bir çizgiyle Kapasite Sınırı işaretlenmiş; sınırın sağında kalan kuyruk turuncu boyanmış ve Taşan Talep (Spill) olarak etiketlenmiş. Eğrinin altında, kesikli çizginin koltuk sıralarını kestiği yukarıdan görünen bir uçak kabini planı. Başlık: Havacılıkta Taşan Talep (Spill Rate). Alt başlık: Kapasite Kısıtları, Talep Tahmini ve Gizli Gelirlerin Optimizasyonu. Sağ sütunda uzman notları: bu hesap gelir yönetimi sistemlerinin özü ve kısıtsız talep tahmininin temeli; yolcunun AirShopping yaparken gördüğü uygunluk, havayolunun kapasiteyi gerçek talebe karşı ne kadar iyi modellediğine bağlı; geçmiş veride doluluk yüzde 100 ise sistem gerçek talebin kapasite artı taşma olduğunu bilerek optimizasyon kuruyor.](/decks/spill-model/01.webp "Turuncu kuyruk hiçbir rezervasyon kaydında görünmüyor. Bölümün tamamı o alanın büyüklüğünü tahmin etmekle ilgili.")

## Dolu uçuşun verisi talebi kapasitede kesiyor

Kaynak metnin temel tanımı basit: taşan yolcu oranı (spill rate), bir
uçuştaki taşan yolcu sayısının nominal talebe bölünmesiyle elde ediliyor.
Pay, uçağa binemeyen yolcular; payda, kapasite olmasaydı gelecek toplam
talep. Sorun ikisinin de doğrudan ölçülememesi. Geçmiş kayıtlarda görülen
şey kesilmiş (truncated) trafik; ihtiyaç duyulan şey kısıtsız
(unconstrained) talep.

Bu fark yalnızca akademik değil. Kapanmış uçuşların kaydını olduğu gibi
talep tahmininin girdisi yapan bir sistem, en yoğun günlerde talebi
sistematik olarak düşük görüyor. Bir sonraki dönem daha az kapasite
koyuyor, uçak yine doluyor, kayıt yine kapasitede kesiliyor. Döngü kendi
yanlışını doğruluyor. Yazılım tarafında bunun karşılığı şu: tahmin
servisine giden trafik verisi, uçuşun o gün kapalı olup olmadığı
bilgisini taşımıyorsa, servis kesilmiş bir gözlemle gerçek bir gözlemi
ayırt edemiyor.

## Yolcu kapanma oranı her zaman uçuş kapanma oranından büyük

Spill modeli iki olasılığı birbirinden ayırıyor ve kararların önemli bir
kısmı bu ayrımın doğru anlaşılmasına bağlı. Uçuş kapanma oranı (flight
closing rate), kısıtsız talebin uçağın fiziksel kapasitesini aşma
olasılığı: kaç günün dolu geçeceği. Yolcu kapanma oranı (passenger
closing rate) ise sisteme giren ek bir yolcunun boş koltuk bulamama ve
uçağa kabul edilmeme olasılığı: rastgele seçilmiş bir yolcunun geri
çevrilme ihtimali.

Kaynak metin aradaki ilişkiyi kesin bir kural olarak koyuyor: yolcu
kapanma oranı her zaman uçuş kapanma oranından büyük, çünkü uçuşun dolu
olduğu günlerde boş olduğu günlere kıyasla daha fazla yolcu koltuk
talep ediyor. Talep yoğun günlerde yığılıyor; yolcuların çoğu da tam o
günlerde geliyor. Uçağın on günden birinde dolu olması, yolculardan
yalnızca onda birinin etkilendiği anlamına gelmiyor.

Brifingin buradan çıkardığı iş kuralı karar vericiye yönelik: yalnızca
uçuşun dolma olasılığına bakma, ek bir yolcunun reddedilme olasılığına
odaklan. Slaytın notu da bunun hesaplanma yolunu gösteriyor: yolcu
kapanma oranı, yoğun günlerde yığılan talebi analiz etmek için PNR verisi
üzerinde koşullu olasılık kurmayı gerektiriyor. Envanter sisteminde bir
uçuşun kapalı sayılması da tanımlı bir olay: tüm rezervasyon
sınıflarında (RBD) izin verilen seviyeye (authorized level) ulaşıldığında
uçuş kapalı statüsüne geçiyor. Kapanma, sistemin kaydettiği bir durum;
taşma ise kaydedilmeyen sonucu.

![Başlık yok, üç kart ve bir uyarı bandı. Birinci kart, Taşan Yolcu Oranı (Spill Rate): taşan (uçamayan) yolcu sayısının uçağın nominal toplam talebine bölünmesiyle elde edilen metrik; ikonu taşan bir sepet. İkinci kart, Uçuş Kapanma Oranı (Flight Closing Rate): kısıtsız net yolcu talebinin uçağın fiziksel kapasitesini aşma olasılığı; ikonu SOLD OUT yazan bir ekran. Üçüncü kart, Yolcu Kapanma Oranı (Passenger Closing Rate): sisteme giren ek (marjinal) bir yolcunun boş koltuk bulamama ve uçağa kabul edilmeme olasılığı; ikonu koltuğa ulaşamayan bir yolcu ve kırmızı çarpı. Alttaki bant, Kritik Kural: yolcu kapanma oranı her zaman uçuş kapanma oranından büyüktür, çünkü yoğun günlerde koltuk arayan yolcu hacmi matematiksel olarak çok daha fazladır. Sağ sütundaki notlar: envanter sisteminde bir uçuş tüm RBD'lerde authorized level sınırına ulaşınca kapalı statüsüne geçer; yolcu kapanma oranı için PNR veritabanında koşullu olasılık denklemleri kurulur.](/decks/spill-model/02.webp "İkinci ve üçüncü kart aynı olaya iki farklı yerden bakıyor: biri takvimden, biri yolcudan. Kapasite kararı yolcunun gözünden verilmeli.")

## Aynı hesap altı ayrı kararın fiyatını veriyor

Spill modelinin değeri, tek bir soruya cevap vermesinden değil, farklı
departmanların farklı sorularını aynı mekanizmaya indirgemesinden geliyor.
Brifing kullanım alanlarını dört başlıkta topluyor, sunum altıya ayırıyor:
alternatif kapasiteler, kabin konfigürasyonu, yeni pazar girişi, kurumsal
indirim etkisi, tarife kârlılığı ve sadakat programı maliyeti. Hepsinin
ortak sorusu aynı: kapasite şu kadar değişirse ya da koltuğun bir kısmı
şu yolcuya verilirse, kaç gelirli yolcu kapıda kalır?

![Başlık: Taşma (Spill) Modelinin 6 Stratejik Kullanım Alanı. Altı kart. Alternatif Kapasiteler: rotada uçak büyütmenin (örnek B737'den B767'ye) getireceği ek (incremental) yolcu hacmini hesaplamak. Kabin Konfigürasyonu: Business koltuk eklemek (premium taşmayı azaltır) ile Economy'yi daraltmak arasındaki kârlılık takası. Yeni Pazar Girişi: yeni açılacak rotada beklenen kısıtsız talebe göre en ideal kapasiteye sahip uçak tipini belirlemek. Kurumsal İndirim Etkisi: indirimli B2B biletlerin tam ücretli yolcuyu ne kadar dışarı ittiğini (displacement) ölçmek. Tarife Kârlılığı: tarife planlamasında trafiği kısıtsız (untruncated) hale getirerek uçuş bazlı gerçek kârlılığı ölçmek. Sadakat (FFP) Maliyeti: millerle alınan ücretsiz biletlerin reddedilen paralı yolcular üzerinden yarattığı gizli maliyeti bulmak. Sağ sütun: akışlar fleet assignment, cabin zoning, pricing ve offer management; kritik terim displacement cost (yerinden etme maliyeti), yani düşük getirili bir kurumsal yolcu ya da ödül bileti sahibini uçağa alarak kalkışa yakın yüksek fiyattan bilet alacak bir yolcuyu kaçırmanın beklenen maliyeti; sistemler indirimli RBD'leri açarken bu fırsat maliyetini hesaplar.](/decks/spill-model/03.webp "Üst sıra kapasiteyi değiştiriyor, alt sıra kapasiteyi kime verdiğini. İki sıra aynı soruyu soruyor: kaç gelirli yolcu kapıda kalır.")

## Büyük uçak ancak taşıdığı ek yolcu kadar değerli

İlk kullanım en doğrudan olanı. Mevcut bir rotada uçağı büyütme kararı,
örneğin B737'den B767'ye geçiş, daha büyük uçakla taşınabilecek artımlı
yolcu (incremental passengers) sayısının tahminine dayanıyor. Mevcut talep
kapasitenin çok üzerindeyse ve spill modeline göre kazanılacak ek yolcu
geliri operasyonel maliyet artışını karşılıyorsa kapasite büyütülüyor.
Sunumdaki örnekte 110 koltuktan 210 koltuğa çıkılıyor; ama eklenen yüz
koltuğun tamamı dolmuyor. Dolan kısım, bugün taşan talebin büyük uçağa
sığan kısmı kadar.

Ters yön de aynı hesapla çalışıyor. Kapasite düşürüldüğünde beklenen
trafik kaybı, küçülmenin taşan yolcu sayısında yaratacağı artış simüle
edilerek bulunuyor; bu da kaybedilecek geliri veriyor. Slaytın notu bu
kararları ağ planlamanın operasyonel devirden önceki günlük kararları
olarak tanımlıyor: upgauging ve downgauging. Pazarlama planlama bölümünde
anlatılan kalkışa yakın uçak değişimi tam olarak bu hesabın son dakikada
tekrar çalıştırılması.

Kabin içinde aynı mantık daha ince bir çözünürlükte işliyor. Business
sınıfına koltuk eklemek premium taşmayı azaltıyor ve gelir artırıyor;
ama business koltuk fiziksel olarak daha fazla yer kapladığı için ekonomi
daralıyor, ekonomi taşması artıyor ve oradaki gelir düşüyor. Sunumun
notuna göre bir business koltuğunun yerinden etme etkisi fiziksel olarak
2-3 ekonomi koltuğuna eşdeğer. Karar, iki eğilimin kesiştiği
konfigürasyon. Brifing uluslararası pazarlar için somut bir davranış
tarif ediyor: business talebi yüksekse sistem premium spill oranını
düşürmek için business kapasitesini artırmayı önermeli, ama bunu
ekonomideki olası gelir düşüşüyle birlikte net kâr etkisi üzerinden
ölçmeli. Premium taşma analizi yalnızca baş sayısını değil, getiri
(yield) farkını da hesaplıyor; iki taşan yolcu aynı parayı kaybettirmiyor.

![Başlık: Kapasite ve Operasyonel Takaslar (Trade-offs). Sol yarı, Filo Büyütme/Küçültme (Gauging): üstte B737 (110 koltuk), aşağı ok, altta B767 (210 koltuk); ortadaki kutu, Matematiksel Gerekçe: taşma modelinin öngördüğü ek (incremental) yolcu hacminin operasyonel maliyeti aşıp aşmadığıdır. Sağ yarı, Kabin İçi Optimizasyon: mavi business ve gri ekonomi koltuklarını gösteren kabin planı, aradaki sınırın ekonomi tarafına kaydığını gösteren turuncu ok. Maddeler: Premium Genişleme, business koltuk eklemek premium taşmayı azaltır, gelir artar; Ekonomi Daralması, fiziksel alan kaybı nedeniyle ekonomi taşması artar, gelir düşer; Karar, sistem bu iki eğilimin kesiştiği ideal konfigürasyonu belirler. Sağ sütun notları: upgauging ve downgauging ağ planlama için operasyonel devirden önceki günlük kararlardır; premium taşma analizi yalnızca baş sayısını değil getiri farkını da hesaplar; 1 business koltuğun displacement etkisi fiziksel olarak 2-3 ekonomi koltuğuna eşdeğerdir.](/decks/spill-model/04.webp "Soldaki karar koltuk ekliyor, sağdaki koltuğu el değiştiriyor. İkisinde de ölçülen şey eklenen kapasite değil, geri kazanılan taşma.")

## İndirimli koltuğun maliyeti yerinden ettiği yolcu

Kapasite sabit kaldığında da spill modeli bir maliyet buluyor. Kurumsal
indirim alan yolcu uçakta bir koltuk kaplıyor ve o koltuk, aynı uçuşa
tam ücretle bilet almak isteyecek bir yolcunun olamıyor. Brifing bu kaybı
yerinden etme (displacement) olarak adlandırıyor: spill modeli, kurumsal
yolcuların yer kaplaması nedeniyle tam ücret ödeyen yolcuların ne
kadarının dışarıda kaldığını tahmin ediyor ve kurumsal programın gerçek
maliyeti bu yerinden etme maliyeti oluyor. İndirim oranı bir liste
fiyatı; asıl bedel, o koltuğun kime satılamadığı.

Sadakat programında mekanizma aynı, soru biraz farklı. Kaynak metin
modelin mil kullanımıyla yapılan uçuşlar reddedilseydi uçabilecek
beklenen artımlı gelirli trafiği tahmin etmek için kullanılabileceğini
söylüyor. Geçmiş veriler millerle uçan yolcu sayısını gösteriyor;
simülasyon bu ödül biletleri reddedilseydi yerlerine kaç gelirli
yolcunun geleceğini soruyor. Mil ile uçanların gerçek maliyeti, yerinden
edilen bu potansiyel gelirli yolcuların kaybı. Dolu olmayan bir uçuşta
bu maliyet sıfıra yakın; kapanan bir uçuşta ise tam bir biletin geliri.

Sunumun notları bunun sistemlerde nasıl izlendiğine dair iki ayrıntı
ekliyor. Sadakat programları genellikle ayrı ve kârlı iş birimleri olarak
işletiliyor, ama bir üye mil kullandığında havayolunun yolcu departmanı
arz edilen koltuk mili başına maliyet (CASM) bazında bir yerinden etme
maliyetine katlanıyor. Ödül koltukları da ayrı, gizli rezervasyon
sınıflarında tutuluyor (ekonomi için X, business için I); böylece yüksek
getirili biletlerin reddedilme oranı takip edilebiliyor. Yazılım tarafında
bunun karşılığı şu: indirimli ya da ödül sınıfını açma kararı bir fiyat
kuralı değil, bir fırsat maliyeti hesabı. Envanter servisi indirimli RBD'yi
açarken yalnızca o sınıfın ücretini değil, uçuşun kapanma olasılığını da
bilmek zorunda.

![Başlık: Ticari Kararlar, Yerinden Etme (Displacement) Maliyeti. Solda Uçak Kapasitesi etiketli şeffaf bir silindir; üst kısmı Tam Ücretli Yolcu (lacivert küpler), alt kısmı İndirimli / Mil Yolcusu (turuncu küpler). Alttan yükselen turuncu küp, en üstteki lacivert küpü silindirin dışına itiyor; dışarı fırlayan küpün üzerinde DISPLACED yazıyor. Ortada iki metin. Kurumsal İndirimlerin Etkisi: indirimli bilet alan kurumsal yolcular uçağa bindiğinde aynı koltuğu tam ücretle alabilecek yetişkin yolcular dışarı itilir, taşma modeli bu görünmez kaybı sayısallaştırır. Sık Uçan Yolcu (FFP) Programı Maliyeti: geçmiş veriler millerle uçan yolcu sayısını gösterir, simülasyon bu ücretsiz biletler reddedilseydi ne kadar ek gelir getiren trafik sağlanırdı diye sorar; sadakat programının koltuk mili başına maliyeti tamamen bu yerinden etme kaybı üzerinden hesaplanır. Sağ sütun notları: FFP'ler genelde ayrı ve kârlı iş birimleridir ama mil kullanımında yolcu departmanı CASM bazında yerinden etme maliyetine katlanır; sistemler ödül koltuklarını gizli RBD'lerde (ekonomi için X, business için I) tutarak yüksek getirili biletlerin reddedilme oranını izler.](/decks/spill-model/05.webp "Silindirin tepesinden düşen küp faturada görünmüyor. Kurumsal sözleşmenin ve mil biletinin gerçek fiyatı o küpün değeri.")

## Yeni rota ve tarife kararı kısıtsız talebe dayanmalı

Kullanım alanlarının son ikisi geleceğe bakıyor. Yeni açılacak bir rotada
uçak tipi seçerken spill modeli, hedef pazardaki beklenen talebi ve
alternatif tiplerin koltuk kapasitesini karşılaştırıp taşan talebi en aza,
kârlılığı en üste çıkaracak tipi belirliyor. Brifingin buradaki uyarısı
önemli: yalnızca ortalama talep tahminine değil, modelin öngördüğü uçuş
kapanma oranlarına dayan. Ortalama talebi tam karşılayan bir uçak, talebin
ortalamanın üstünde kaldığı her gün yolcu kaybediyor ve o günler
yolcuların çoğunun geldiği günler.

Tarife planlamada (schedule profitability) ise model tersinden çalışıyor.
Geçmiş verideki kısıtlanmış trafiği analiz edip gerçek kısıtsız talebi
tahmin ediyor; yeni tarifelerin kârlılığı bu tahminle değerlendiriliyor.
Kesilmiş veriyle yapılan kârlılık analizi, en çok talep gören uçuşları
olduklarından zayıf gösteriyor, çünkü onların kaydı tam da kapasitede
kesiliyor.

## Boeing modeli çan eğrisinin kuyruğunu hesapladı

Sunum yöntemin kökenini Boeing taşma modeline, DeSylva'nın 1976
çalışmasına bağlıyor. Temel varsayım yolcu talebinin normal dağılım
göstermesi. Mekanizma geometrik: ortalama talep (μ) ile kapasite (c)
arasındaki ilişkiye bakılıyor, kapasite kısıtının sağında kalan alanın
beklenen değeri kaybedilen talebi veriyor. Tarihsel zorluk, bu alan için
kapalı formül olmamasıydı. Sunumun notuna göre bilgisayarlı gelir yönetimi
yazılımlarından önce analistler kapasite kararlarını kalın, basılı Boeing
Spill Tables klasörlerinden, varyasyon katsayısı olan k-faktörü üzerinden
elle hesaplıyordu.

Normal dağılım varsayımının bir sınırı var. Düşük talepli rotalarda çan
eğrisinin sol kuyruğu sıfırın altına uzanıyor ve model kesirli ya da
negatif yolcu üretebiliyor. Sunum, modern sistemlerin bu hataları önlemek
için normal dağılım yerine Poisson veya Gamma dağılımlarını kullandığını
not ediyor. Dağılım seçimi bir modelleme ayrıntısı gibi görünüyor, ama
küçük rotada taşma tahmininin anlamlı olup olmayacağını belirliyor.

![Başlık: Klasik Yaklaşım, Boeing Taşma Modeli (DeSylva, 1976). Bir çan eğrisi; ortada kesikli çizgiyle μ (Ortalama Talep), sağında düz dikey çizgiyle c (Kapasite). c'nin sağında kalan kuyruk turuncu boyanmış ve Taşan Yolcular (Spilled Passengers) olarak etiketlenmiş. Alttaki kutu: Temel Varsayım, yolcu talebi kusursuz bir normal dağılım gösterir; Mekanizma, kapasite kısıtının (c) sağında kalan alanın beklenen değeri kaybedilen talebi verir; Tarihsel Zorluk, başlangıçta kapalı formüller yoktu, analistler basılı tablolardan k-faktörü (varyasyon katsayısı) üzerinden manuel hesap yapardı. Sağ sütun notları: PROS veya Amadeus Altea gibi bilgisayarlı RM yazılımlarından önce analistler basılı Boeing Spill Tables klasörlerini kullanırdı; modern sistemler özellikle düşük talepli rotalarda kesirli ya da negatif yolcu hatalarını önlemek için Poisson veya Gamma dağılımları kullanır.](/decks/spill-model/06.webp "c çizgisi sağa kaydıkça turuncu alan küçülüyor ama hiç sıfırlanmıyor. Kapasite kararı o alanın hangi büyüklükte kabul edileceği kararı.")

Tablonun yerini bugün bir yaklaşım formülü alıyor. Uçuş kapanma oranı,
yani talebin kapasiteyi aşma olasılığı, bir eksi standart normal
dağılımın kümülatif fonksiyonunun k noktasındaki değeri olarak yazılıyor.
Kümülatif fonksiyonun cebirsel kapalı formu yok; sunum, modern
yazılımların tam entegrasyon yerine Abramowitz ve Stegun'un 1965 tarihli
dördüncü dereceden polinom yaklaşımını kullandığını söylüyor ve dört
sabiti veriyor: 0.1968, 0.1151, 0.0003 ve 0.0195.

Mühendislik gerekçesi tanıdık. Sunumun notuna göre saniyede çok sayıda
rezervasyon işleyen motorlar işlemciyi kilitlemeyecek hızda hesaba ihtiyaç
duyuyor ve polinom, gerçek zamanlı fiyatlandırma ile uygunluk
kontrollerinde bu hesabı sürekli bir fonksiyon olarak ucuza yapıyor. Aynı
hesap her uygunluk sorgusunda tekrar çalışıyorsa, sayısal entegrasyon
yerine sabit katsayılı bir polinom, önbellek katmanı eklemeden gecikmeyi
düşürmenin en basit yolu.

![Başlık: Analitik Altyapı, 4. Dereceden Polinom Yaklaşımı. Alt başlık: milisaniyeler içinde çalışan modern sistem mimarisi. Ortada formül: Pr(D büyüktür c) eşittir 1.0 eksi fi(k). Etiketler: sol taraf Uçuş Kapanma Oranı (talebin kapasiteyi aşma ihtimali), fi Kümülatif Yoğunluk Fonksiyonu, k Standart Normal Dağılım Katsayısı. Algoritma Temeli: modern yazılımlar entegrasyon formülleri yerine c1 (0.1968), c2 (0.1151), c3 (0.0003) ve c4 (0.0195) sabitlerini kullanan 4. dereceden polinom yaklaşımını (Abramowitz ve Stegun, 1965) kullanır. Pratik Anlamı: kapalı formül eksikliğini çözen bu sürekli fonksiyon, talebin kapasiteyi aşma ihtimalini büyük sistem yükü yaratmadan hesaplar. Sağ sütun, Mühendislik Perspektifi: standart normal dağılımın kümülatif fonksiyonu cebirsel kapalı formül vermez; çok sayıda PNR işleyen motorlar ultra hızlı hesaplara ihtiyaç duyar ve polinomlar gerçek zamanlı dinamik fiyatlandırma ve uygunluk kontrollerine olanak tanır.](/decks/spill-model/08.webp "Formülün sol tarafı önceki slaytlardaki uçuş kapanma oranı. Klasörlerdeki tablonun yerini dört sabit almış.")

## LFCF'yi 1.0 kabul etmek taşmayı olduğundan az gösteriyor

Orijinal modelin en pahalı varsayımı, kapanmış bir uçuşun tam dolu
kalktığı. Teknik adıyla kapanmış uçuşlardaki doluluk faktörü (LFCF, load
factor on closed flights) 1.0 kabul ediliyor. Brifingin açıklamasına
göre model aşırı rezervasyonun (overbooking) tam optimize edilmediğini
varsayarak bu değeri 1.0 alıyor; gerçekte değer 0.945 ile 0.98 arasında.
Kaynak metin sonucu açıkça yazıyor: LFCF'nin 1.0 kabul edilmesi, taşan
yolcu sayısının eksik tahmin edilmesine yol açıyor.

Nedeni operasyonda. Sunumun örneğinde 100 koltuklu bir uçakta yüzde 10
aşırı rezervasyonla 110 bilet satılıyor; bağlantısını kaçıran ya da
planı değişen yolcular (no-show) yüzünden uçak 98 kişiyle kalkabiliyor.
Satış açısından kapanmış uçuş, kalkışta boş koltukla gidiyor (spoilage).
Model uçuşun kapasitede kesildiğini varsayıyor; oysa kesilme daha erken,
kapasitenin altında bir noktada oluyor. Talebin görülmeyen kısmı modelin
sandığından büyük. Sunum düzeltmeyi Vinod'un 1987 çalışmasına bağlıyor:
LFCF, 1'den küçük bir girdi parametresi olarak alınıyor ve aşırı
rezervasyon yapılsa bile no-show'lar hesaba katılıyor.

Bu bölümün en uygulanabilir kısmı burası. LFCF, spill hesabında tek bir
sayı; ama o sayının 1.0'da sabitlenmiş olması, üzerinde kurulan her
kapasite, kabin ve maliyet kararını sessizce aşağı çekiyor. Yazılım
tarafında karşılığı: LFCF sabit kodlanmış bir değer değil,
yapılandırılabilir ve gerçekleşen no-show verisiyle güncellenen bir
parametre olmalı. Gelir yönetimi bölümlerinde anlatılan kontrollü fazla
satış burada öbür yüzünü gösteriyor; aşırı rezervasyon politikası
değiştikçe kapanmış uçuşların gerçek doluluğu da değişiyor.

![Başlık: Modelin Zayıf Noktası, LFCF Varsayımı. İki gösterge. Sol, Klasik Boeing Modeli: turuncu ibre 1.0 (yüzde 100) değerinde. Altında Hata: kapanmış bir uçuşun daima yüzde 100 dolu kalktığını (LFCF eşittir 1.0) varsayar, bu durum taşmayı eksik hesaplar (underestimate). Sağ, Gelişmiş Esnek Model: yeşil ibre 0.945 ile 0.98 arasında işaretli bir bantta. Altında Gerçeklik (Vinod, 1987): LFCF 1'den küçük bir girdi parametresi olarak alınır, aşırı rezervasyon yapılsa bile no-show'lar hesaba katılır. Alt bant, Gerçek Operasyon: havayolları overbooking yapsa da uçağa gelmeyen yolcular nedeniyle kapanmış uçuşlar hiçbir zaman 1.0 doluluğa ulaşmaz, gelişmiş model bu fireyi düzeltir. Sağ sütun notları: 100 koltuklu bir uçakta yüzde 10 overbooking ile 110 bilet satılsa bile no-show'lar yüzünden uçak 98 kişiyle kalkabilir; kapanmış uçuş boş koltukla kalkar (spoilage) ve klasik model bunu hesaba katamıyordu.](/decks/spill-model/07.webp "İki ibre arasındaki fark birkaç puan. O birkaç puan, modelin kaç yolcuyu hiç yokmuş gibi saydığını belirliyor.")

## Spill departmanlar arasında ortak birim

Sunumun kapanışı spill'i bir ölçüt değil, havayolunun sinir sistemi
olarak tarif ediyor. Ağ planlama, filo tahsisi, fiyatlandırma ve sadakat
aynı merkeze bağlanıyor, çünkü dördünün de sorusu kapasite ile talebin
nerede kesiştiği. Sunum üç faydayı sıralıyor: uçuş yüzde yüz dolsa bile
piyasada gerçekte ne kadar talep olduğu sorusuna matematiksel cevap
veriyor, departmanların kapasite ve talep dengesinde ortak bir dille
konuşmasını sağlıyor, ücretsiz itfaların ve kurumsal indirimlerin
yarattığı görünmez yerinden etme etkisini finansal değere çeviriyor.

Notlardaki modern döneme dair iddia da bu çerçeveye oturuyor: NDC ve
sürekli fiyatlandırma çağında bile kısıtsız talep ve spill mekanizması
temel yapı olarak kalıyor. Bir havayolu yolcuya özel bir teklif
sunmadan önce, o fiziksel envanteri bir başkasına satmamanın fırsat
maliyetini bilmek zorunda. Teklif motoru değişiyor, sorulan soru
değişmiyor.

![Başlık: Sentez, Taşma Yönetiminin Stratejik Değeri. Alt başlık: spill sadece bir metrik değil, havayolunun sinir sistemidir. Ortada parlayan bir daire: Taşma (Spill) Modeli, Maksimum Gelir ve Kârlılık. Dört köşeden daireye oklarla bağlanan kutular: Ağ Planlama (Network), Filo Tahsisi (Fleet), Fiyatlandırma (Pricing), Sadakat (Loyalty). Alttaki maddeler: Veri Körlüğünü Önler, uçuş yüzde 100 dolsa bile gerçekte piyasada ne kadar talep vardı sorusunu matematiksel olarak yanıtlar; Siloları Yıkar, departmanların kapasite ve talep dengesinde ortak bir operasyonel dille konuşmasını sağlar; Gizli Kayıpları Yakalar, ücretsiz itfalar veya B2B indirimlerin yarattığı görünmez yerinden etme etkisini finansal değere dönüştürür. Sağ sütun notları: NDC ve sürekli fiyatlandırma çağında dahi kısıtsız talep ve spill mekanizmasını anlamak en temel yapıdır; havayolu yolcuya özel bir teklif sunmadan önce o fiziksel envanteri bir başkasına satmamanın fırsat maliyetini bilmek zorundadır; taşma modelleri bugünkü dinamik fiyatlandırma mantığının tarihsel ve algoritmik kalbidir.](/decks/spill-model/09.webp "Dört kutunun her biri kendi kararını veriyor ama aynı sayıyı okuyor. O sayı yanlışsa dört karar birlikte yanlış.")

## Yarın işe yarayacak dört çıkarım

1. **LFCF'yi 1.0'ın altında tut.** Spill hesabında kapanmış uçuş doluluğunu
   0.945 ile 0.98 aralığında bir parametre olarak kullan ve gerçekleşen
   no-show verisiyle güncelle. 1.0 varsayımı taşmayı sistematik olarak
   eksik gösteriyor ve bu eksiklik üzerine kurulan her kapasite kararına
   geçiyor.
2. **Kabin düzenini getiri farkıyla yeniden değerlendir.** Özellikle
   mevsimsel talep değiştiğinde business ve ekonomi kapasitesini spill
   modelinin gelir dengesi analiziyle tart; premium taşmadaki kazancı
   ekonomi taşmasındaki kayıpla aynı hesapta, net kâr üzerinden karşılaştır.
3. **Kurumsal sözleşmeyi yerinden etme maliyetiyle yenile.** İndirim
   oranına değil, bu yolcuların tam ücretli yolcuyu dışarıda bırakma
   maliyetine bak. Aynı hesabı ödül biletleri için de yap: mil biletinin
   maliyeti, kapanan uçuşta yerine gelebilecek gelirli yolcunun geliri.
4. **Yeni rotada ortalamaya değil kapanma oranına bak.** Uçak tipini
   ortalama talep tahminine göre değil, modelin öngördüğü uçuş ve yolcu
   kapanma oranlarına göre seç. Ortalamayı karşılayan uçak, yolcuların
   çoğunun geldiği yoğun günlerde yolcu kaybediyor.

Bu bölümde ne yok: kısıtlanmış veriden kısıtsız talebin hangi yöntemlerle
geri kazanıldığı ve rezervasyon eğrilerinin nasıl tahmin edildiği (talep
tahmini bölümleri), aşırı rezervasyon politikasının kendisi ve Littlewood
kuralı ("Yield Management: erken dönem stratejik analiz ve iş mantığı"),
kalkışa yakın uçak değişiminin planlama döngüsündeki yeri ("Havayolu
pazarlama planlama süreci ve iş mantığı analizi"). Bu bölüm o parçaların
ortak kullandığı sayının, yani taşan talebin, nasıl hesaplandığını ve
nerede yanıldığını anlatmak için var.
