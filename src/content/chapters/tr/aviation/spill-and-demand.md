---
title: "Gelir yönetiminde beklenen kayıp (spill) ve talep analizi"
domain: "aviation"
summary: "Dolu bir uçağın kapıda bıraktığı yolcu sayısı basit bir çıkarma işlemiyle bulunmuyor; talebin dağılımı üzerinden hesaplanıyor. Bu bölüm beklenen kaybın iki eşdeğer hesabını, gamma modelinin onu tek bir formüle nasıl indirdiğini ve tek bir yolcunun reddedilme olasılığının neden uçuşun kapanma olasılığından her zaman büyük olduğunu anlatıyor."
audience: "RM, envanter ya da kapasite planlama sistemlerinde çalışan ve talep tahmininin çıktısının nereye aktığını görmek isteyen yazılımcı ve ürün insanı. Olasılık yoğunluğu ve kümülatif dağılım kavramlarına aşinalık yeter; spill, kesilmiş talep, yolcu kapanış oranı ve gamma modeli metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Kapasite kararlarının hepsi aynı soruya dayanıyor: bu uçak dolarsa dışarıda
kaç kişi kalacak? Kapıda kalan bu yolcuya havacılıkta spill deniyor; Türkçe
kaynaklarda beklenen kayıp ya da taşan talep. Soru basit görünüyor, çünkü
akla gelen ilk cevap talepten kapasiteyi çıkarmak. **Beklenen kayıp talep
eksi kapasite değil; talebin olasılık dağılımı üzerinden hesaplanan bir
beklenen değer, ve o dağılımın şeklini yanlış seçmek, yüksek dolulukta
çalışan bir havayolunda en pahalı hataya dönüşüyor.** Bu bölüm o hesabın
iki eşdeğer yolunu, gamma dağılımının hesabı nasıl tek formüle indirdiğini
ve tek tek yolcuların gördüğü dünyanın uçuş istatistiklerinden neden daha
sert olduğunu anlatıyor.

![Sunumun kapak slaytı. Solda mavi bir teknik çizim zemini üzerinde yukarıdan görülen bir yolcu uçağı; kabin koltuklarla dolu, kapı bölgelerinde turuncu renkle vurgulanmış yolcu ve koltuk grupları dışarı taşıyor. Sağda başlık: Havacılıkta Beklenen Kayıp ve Yolcu Kapanış Oranları (Expected Spill ve Passenger Closing Rates). Alt başlık: Gamma Kayıp Modeli ile Talep ve Kapasite Optimizasyonu. Altta alan notu kutusu, RM sistemleri: modern RM sistemleri (örnek olarak Amadeus Altéa RM ve PROS) her gece gamma dağılımı hesaplamaları çalıştırarak en uygun rezervasyon limiti ve teklif fiyatı değerlerini belirler; kaybın eksik hesaplanması ucuza bilet satılmasına (dilution), fazla hesaplanması uçakların boş uçmasına (spoilage) neden olur.](/decks/spill-and-demand/01.webp "Kutudaki son cümle bölümün gerekçesi: spill tahmini iki yönde de para kaybettiriyor, biri seyreltme diğeri boş koltuk olarak.")

## Kayıp bir fark değil, dağılımın kuyruğundaki hacim

Başlangıç varsayımı şu: bir uçuşun talebi D sabit bir sayı değil, rastgele
bir değişken. Kapasite c ise sabit, satılabilir koltuk sayısı. Talep
kapasiteyi aştığında uçağa alınamayan ve reddedilen yolcuların beklenen
sayısı spill. Tanım net, ama "talep kapasiteyi aştığında" ifadesi hesabın
iki ayrı parçası olduğunu saklıyor: talebin kapasiteyi aşma olasılığı ve
aştığı durumlarda ne kadar aştığı.

Kaynak metin tanımı tek satırla veriyor: beklenen reddedilen yolcu sayısı,
talebin kapasiteden büyük olduğu durumdaki koşullu beklenen talepten
kapasitenin çıkarılması ve sonucun o durumun olasılığıyla çarpılması. Yani
`E(Spill) = [E(D | D > c) − c] · Pr(D > c)`. Sistem bunu talebin yoğunluk
fonksiyonu f(x) üzerinden, kapasitenin üstünde kalan bölgeyi entegre ederek
hesaplıyor. Ortalama talep kapasitenin altında olsa bile kuyruk sıfır
değil; uçak bazı günler dolacak ve o günlerde kapıda birileri kalacak.

![Başlık: Talep Kapasiteyi Aştığında Ne Olur. Üstte açıklama: uçuş talebinin (D) rastgele bir değişken olduğunu varsayalım; spill, talep kapasiteyi (c) aştığında uçağa alınamayan ve reddedilen beklenen yolcu sayısıdır. Ortada görsel denklem: mavi bir yolcu kalabalığı Talep (D), büyüktür işareti, bir uçak Kapasite (c), eşittir işareti, turuncu yürüyen yolcular Kayıp (Spill). Altta bir yoğunluk eğrisi f(x); c noktasında dikey çizgi, çizginin sağındaki turuncu kuyruk bölgesi E(D|D>c) olarak işaretli. Altında koşullu beklenti açıklaması ve soru: eğer uçağımız dolacaksa, dışarıda tam olarak kaç kişi kalacak. Sağda alan notu, talep tahmini: tarihsel rezervasyon verileri her zaman kapasite ile sınırlıdır (constrained demand); RM yazılımları gerçek f(x) eğrisini bulmak için EM algoritmaları ya da rezervasyon eğrisi modelleriyle veriyi serbest bırakmak (unconstraining) zorundadır; bu turuncu alan, uçağı büyütmenin (örneğin A320'den A321'e geçişin) kârlı olup olmadığını belirler.](/decks/spill-and-demand/02.webp "Turuncu alan hesabın bütün konusu: eğrinin şekli değişirse, ortalama aynı kalsa bile o alan değişiyor.")

Slaytın alan notu buradaki asıl mühendislik problemini gösteriyor. Elimizde
f(x) yok; elimizde geçmiş rezervasyonlar var ve onlar kapasitede kesilmiş.
Dolu uçmuş bir uçuşun verisinde talep hiçbir zaman kapasiteden büyük
görünmüyor, çünkü fazlası sisteme hiç girmedi. Yani kuyruğu ölçmek için
önce veride olmayan kuyruğu geri kurmak gerekiyor. Yazılım tarafında bunun
karşılığı şu: spill hesaplayan modülün girdisi ham satış tablosu olamaz,
bir kısıt kaldırma (unconstraining) adımından geçmiş talep tahmini olmalı.
Bu ikisini aynı tabloda, aynı kolon adıyla tutmak hatanın en kısa yolu.

## Aynı sayıya iki yoldan varılıyor ve biri çok daha kolay

Beklenen kayba ulaşmanın ikinci yolu kaybı hiç doğrudan hesaplamamak. İş
kuralı bir denge denklemi: toplam beklenen talep, beklenen trafik ile
beklenen kaybın toplamına eşit, `E(D) = E(Traffic) + E(Spill)`. Trafik burada
uçağa gerçekten binen yolcu, yani kapasitede kesilmiş (truncated) talep. Kaynak
metin iki hesabın aynı sonucu verdiğini açıkça not ediyor: kayıp, talepten
trafik çıkarılarak bulunduğunda da sonuç değişmiyor.

Beklenen trafiğin kendisi iki durumun ağırlıklı toplamı. Talep kapasitenin
altında kaldığında trafik talebin kendisi; bu durumun beklenen değeri bu
durumun olasılığıyla çarpılıyor. Talep kapasiteyi aştığında trafik tam
olarak kapasite; kapasite, uçağın dolma olasılığıyla çarpılıyor:
`E(Traffic) = E(D | D < c) · Pr(D < c) + c · Pr(D ≥ c)`. Bu kural uçağın
kapasitesinden fazla yolcu taşıyamayacağını istatistiksel olarak garanti
altına alıyor: formülün ikinci terimi hiçbir senaryoda c'yi geçmiyor.

![Başlık: Beklenen Kaybın Hesaplanması, İki Yaklaşım. Solda Yaklaşım 1, doğrudan kayıp hesabı: kapasiteyi aşan talebin doğrudan hesaplanması, karmaşık integraller içerir; slaytta formül E(Spill) = E(D|D>c) × Pr(D>c) − c olarak yazılmış; altında kuyruğu turuncu boyalı yoğunluk eğrisi. Sağda Yaklaşım 2, trafik üzerinden hesaplama: beklenen trafik kapasite sınırına takılmış (kesilmiş) taleptir, uçan yolcu sayısını toplam talepten çıkararak kaybı buluruz; E(Traffic) = E(D|D<c)Pr(D<c) + c·Pr(D≥c) ve E(Spill) = E(D) − E(Traffic). Altında iki yatay çubuk: üstte E(D) toplam talep, altta c noktasına kadar mavi E(Traffic) ve sonrasında turuncu Spill. Orta notta: her iki yaklaşım da gamma dağılımı kullanılarak aynı matematiksel sonuca ulaşır. Altta alan notu, veri ambarı gerçekleri: yaklaşım 2 RM algoritmalarında programlanması daha kolay olan yöntemdir; havayolu veri ambarlarında satış verisi her zaman kapasitede kesilir; 180 koltuklu bir uçakta 180 koltuk satıldıysa talep 180 değildir, 180 artı spilldir; E(Traffic) yatırımcılara raporlanan doluluk oranını ve dolayısıyla birim geliri (RASK) doğrudan etkiler.](/decks/spill-and-demand/03.webp "Soldaki formülde parantez kaymış: doğrusu kaynak metindeki gibi (E(D|D>c) − c) × Pr(D>c), kapasite olasılıkla birlikte çarpılıyor.")

Slayttaki "180 koltuk satıldıysa talep 180 değildir" cümlesi bu bölümün
en pratik cümlesi. Yaklaşım 2'nin programlanmasının kolay olması tesadüf
değil: E(D) zaten talep tahmin modülünün çıktısı, E(Traffic) ise kesilmiş
bir beklenti. Kaybı, iki bilinen sayının farkı olarak üretmek, kuyruk
integralini ayrıca yazmaktan daha az hata yüzeyi bırakıyor. Denge denklemi
bir de test olarak işe yarıyor: aynı dağılım parametreleriyle iki yoldan
hesaplanan kayıp birbirini tutmuyorsa, hata formülde değil kodda.

Planlama tarafına düşen uyarı da buradan çıkıyor. Beklenen trafik
hesaplanırken talebin uçuş kapasitesinde kırpıldığı unutulmamalı;
planlamalar bu limitli talep üzerinden yürümeli. Ortalama talebi doğrudan
yolcu sayısı gibi kullanan bir gelir projeksiyonu, uçağın kapasitenin
üstüne çıkamadığı günleri yok sayıp gelir fazlası gösterir.

## Gamma varsayımı iki integrali tek satıra indiriyor

Talebin dağılımı için bir şekil seçildiğinde integraller kapalı forma
dönüşüyor. Beklenen talep E(D) = μ ve talebin gamma dağılımı gösterdiği
varsayımıyla beklenen kayıp tek bir operasyonel formül oluyor:
`E(Spill) = μ · [1 − FG(α + 1, c/β)] − c · [1 − FG(α, c/β)]`. Burada μ
toplam potansiyel yolcu, c satılabilir koltuk sayısı, FG ise şekli α ve
ölçeği β ile belirlenen gamma kümülatif dağılım fonksiyonu.

![Başlık: Gamma Dağılımı ile Formülün Sadeleştirilmesi. Açıklama: beklenen talep E(D) = μ ve talebin gamma dağılımı (FG) gösterdiği varsayımıyla integraller tek bir operasyonel formüle dönüşür. Ortada parlak kutuda formül: E(Spill) = μ çarpı (1 − FG(α+1, c/β)) eksi c çarpı (1 − FG(α, c/β)). Formülün parçalarına çizgilerle bağlanan etiketler: μ beklenen nominal talep (toplam potansiyel yolcu), c uçuş kapasitesi (satılabilir koltuk sayısı), FG(α, β) uçuş talebinin şeklini ve ölçeğini belirleyen gamma kümülatif dağılım fonksiyonu (CDF). Altta alan notu, neden gamma: havayolları standart normal dağılım yerine neden gamma kullanır; birincisi uçuş talebi negatif olamaz, normal dağılım ise negatif sayılara izin verir; ikincisi havacılık talebi sağa çarpıktır (beklenmedik talep patlamaları), gamma sağa çarpık verileri iyi modeller; eski sistemler hesaplama yükünden kaçınmak için formülü canlı hesaplamak yerine hazır arama tabloları (look-up tables) kullanırdı.](/decks/spill-and-demand/04.webp "Formülün iki köşeli parantezine dikkat: biri α+1, öteki α ile çağrılıyor. Aşağıda göreceğimiz gibi bu iki terim iki ayrı kapanış oranı.")

Neden gamma, slaytın alan notu iki gerekçe veriyor. Uçuş talebi negatif
olamaz, normal dağılım ise negatif değerlere olasılık veriyor. Havacılık
talebi sağa çarpık: ortalamanın çok üstüne çıkan günler, altına inen
günlerden daha uzun bir kuyruk oluşturuyor, gamma da tam bu asimetriyi
taşıyor. Spill kuyruğun içinde yaşadığı için kuyruğun şekli, ortalamanın
yerinden daha önemli.

Aynı not tarihsel bir ayrıntı veriyor: eski sistemler bu formülü canlı
hesaplamak yerine hazır arama tablolarından okuyordu. Gamma kayıp tabloları
farklı doluluk senaryoları için önceden hesaplanmış değerlerdi. Bugün
gamma CDF'si her istatistik kütüphanesinde tek bir çağrı; tablonun
bıraktığı miras ise hâlâ görülebiliyor. Yazılım tarafında bunun karşılığı
şu: bir tablo aralığına yuvarlanmış eski sonuçlarla yeni motorun canlı
hesabını karşılaştırırken fark çıkarsa, önce tablonun ızgara aralığına
bakmak gerekiyor.

## Yolcunun gördüğü uçak, istatistikteki uçaktan daha dolu

Bölümün en sezgi dışı kısmı burada. Uçuş kapanma oranı (flight closing
rate) bir uçuşun dolma olasılığı, yani Pr(D > c). Yolcu kapanma oranı
(passenger closing rate) ise sisteme gelen ek bir yolcunun (incremental
passenger) boş koltuk bulamayıp reddedilme olasılığı. İkisi aynı şey gibi
duruyor; değil.

Yolcu kapanma oranı rastgele rastlantı (random incidence) prensibine
dayanıyor: gelen bir yolcunun, uçuşun kapalı olduğu bir ana denk gelme
ihtimali. Bunu hesaplamak için kaynak metin türetilmiş bir yoğunluk
tanımlıyor: talep yoğunluğu f(x) verildiğinde `gW(d) = x · f(x) / E(D)`.
Bu yoğunluk, her talep düzeyini içerdiği yolcu sayısıyla ağırlıklandırıyor.
Yüz kişilik talep günü, elli kişilik günün iki katı ağırlık alıyor, çünkü
rastgele seçilmiş bir yolcunun o günün yolcularından biri olma ihtimali
iki kat. Yani karar yalnızca uçuşun doluluğuna değil, talebin yoğunluğuna
göre veriliyor.

Kaynak metin sonucu kesin bir kural olarak koyuyor: yolcu kapanma oranı her
zaman uçuş kapanma oranından büyük. Sebep ağırlıklandırmanın kendisinde.
Yolcuların çoğu, zaten tanımı gereği, talebin yüksek olduğu günlerde
geliyor; talebin yüksek olduğu günler de uçağın kapandığı günler.
Uçuşların yüzde kaçının dolduğunu soran bir analist ile rezervasyon yapmaya
çalışan bir yolcu farklı dünyalar görüyor.

![Başlık: Yolcu Kapanış Oranı (Passenger Closing Rate). Tanım: sisteme gelen ekstra bir yolcunun (incremental passenger) koltuk bulamayıp reddedilme olasılığıdır. Görselde solda onay işaretli üç mavi yolcu açık bir kapıdan geçiyor; bir ok sağa, Rastgele Geliş (Random Incidence) etiketli turuncu bir yolcuya uzanıyor; yolcunun önünde KAPALI yazan turuncu bir bariyer. Sol altta nasıl hesaplanır: rastgele geliş prensibi ile, gelen yolcunun uçuşun kapalı olduğu bir ana denk gelme ihtimalidir. Sağ altta kutu: Kapanış Oranı = 1.0 − FG(α+1, c/β). Önemli kural: yolcu kapanış oranı her zaman uçuş kapanış oranından (flight closing rate) daha büyüktür. En altta alan notu, kapalı uçuş paradoksu, kuyruk teorisi: kapalı (sold-out) uçuşlar doğası gereği daha fazla talep çeker; ağ genelinde arama yapan rastgele bir yolcunun boş bir uçuştan ziyade popüler ve zaten dolmuş bir uçuşu rezerve etmeye çalışma olasılığı istatistiksel olarak çok daha yüksektir; bu oran OTA'ların PSS sisteminden yer yok hatası alma olasılığını belirler.](/decks/spill-and-demand/05.webp "Kutudaki formülü bir önceki slaytla yan yana koy: gamma kayıp formülünün ilk köşeli parantezi tam olarak bu oran.")

Gamma varsayımı altında bu tanım çok temiz bir yere varıyor. Gamma
yoğunluğunu x ile çarpıp normalize etmek, şekil parametresi bir artmış
başka bir gamma veriyor. Bu yüzden yolcu kapanma oranı `1 − FG(α + 1, c/β)`,
uçuş kapanma oranı ise `1 − FG(α, c/β)`. İki slaytı yan yana koyunca gamma
kayıp formülü kendini açıklıyor: beklenen kayıp, beklenen talep çarpı yolcu
kapanma oranı eksi kapasite çarpı uçuş kapanma oranı. Formüldeki iki köşeli
parantez aynı uçuşun iki farklı gözden görünüşü.

Slaytın alan notu bu oranı somut bir sisteme bağlıyor: bir OTA'nın PSS'ten
"yer yok" cevabı alma olasılığı. Yazılım tarafında bunun karşılığı, doluluk
panosunda gösterilen "uçuşların yüzde kaçı kapandı" metriğinin müşteri
deneyimini eksik anlatması. Müsaitlik sorgularının ne kadarının yer yok cevabıyla
döndüğünü ölçmek istiyorsan payda uçuş değil, sorgu ya da yolcu olmalı.

## Doluluk arttıkça hata payı sıfıra iniyor

Model seçimi yüksek dolulukta anlam kazanıyor. Kaynak metnin karşılaştırdığı
senaryo kapalı uçuşlarda yüzde 96 ile yüzde 100 doluluk faktörü (load
factor) arasındaki fark. Gamma kayıp tabloları farklı doluluk senaryoları
için kullanılıyor ve doluluk arttıkça kayıp miktarının artış eğilimi,
gamma ile normal modeller arasındaki farklar gözetilerek analiz ediliyor.
Karar vericinin işi, hedeflenen doluluk oranında hangi modelin gerçekçi
bir kayıp tahmini verdiğini seçmek.

Slayt bu artışın şeklini gösteriyor: yüzde 96'dan yüzde 100'e yaklaşırken
reddedilen yolcu oranı ve yolcu kapanış oranı üstel biçimde artıyor.
Kapasitenin uç sınırında işletilen uçuşlar talep tahmininde neredeyse hiç
hata payı bırakmıyor. Yüzde 80 dolulukta iki model arasındaki fark
kuyruğun ince ucunda kalıyor; yüzde 98'de kararın kendisi o kuyruk.

![Başlık: Sentez, Model Karşılaştırmaları ve Doluluk (Load Factor) Etkisi. Solda Normal ve Gamma grafiği: gri normal dağılım eğrisi ile mavi gamma eğrisi üst üste; gamma eğrisinin sağ kuyruğu daha uzun ve mavi gölgeli. Altında açıklama: gamma modeli havacılık talebindeki asimetrik (sağa çarpık) uç değerleri normal dağılıma göre çok daha doğru yakalar; bu yapı yüksek talepli uçuşlarda kaybı eksik hesaplama riskini ortadan kaldırır. Sağda kapalı uçuşlarda doluluk oranının etkisi grafiği: yatay eksende yüzde 70'ten yüzde 100'e doluluk, dikey eksende spill oranı; eğri yüzde 90'a kadar düz, yüzde 95 sonrası turuncu ve dik yükseliyor, tepede uyarı işareti. Altında açıklama: uçuşların doluluk oranı yüzde 96'dan yüzde 100'e yaklaştığında reddedilen yolcu oranı ve yolcu kapanış oranı üstel olarak artar; kapasitenin uç sınırlarında işletilen uçuşlar talep tahmininde sıfır hata payı gerektirir. En altta alan notu, modern operasyonlar: yüzde 96 üzeri dolulukla çalışan ultra düşük maliyetli taşıyıcılarda (ULCC) spill modellemesi işin en kritik parçasıdır; gamma ölçek parametresindeki (β) yüzde 1'lik bir hata bile milyonlarca dolarlık kayba yol açabilir; günümüzde yapay zekâ saf gamma modellerinin yerini alsa da E(Spill) değerini en aza indirme mantığı yeni nesil sürekli fiyatlandırma (continuous pricing) motorlarında birebir aynı kalmaktadır.](/decks/spill-and-demand/06.webp "Sağdaki eğrinin kıvrıldığı yer, kapasite kararının artık ortalamayla değil kuyrukla verildiği yer.")

Slaytın son notu iki iddia taşıyor ve ikisi de ağırlığını hak ediyor.
Birincisi, yüzde 96'nın üstünde dolulukla çalışan ultra düşük maliyetli
taşıyıcılar için spill modellemesi işin en kritik parçası; slayt gamma
ölçek parametresindeki küçük bir hatanın bile büyük bir kayba yol
açabileceğini söylüyor. İkincisi daha kalıcı: saf gamma modellerinin
yerini yeni yöntemler alsa da beklenen kaybı en aza indirme mantığı sürekli
fiyatlandırma motorlarında aynen duruyor. Modelin kendisi değişebilir;
optimize edilen büyüklük değişmiyor.

Bu da spill hesabının neden yalnızca kapasite planlamasının konusu
olmadığını gösteriyor. Kapak slaytının notu aynı hesabı iki yöne bağlıyor:
kayıp eksik hesaplanırsa koltuklar ucuza gidiyor, fazla hesaplanırsa uçak
boş uçuyor. Birincisi rezervasyon limitlerini, ikincisi teklif fiyatlarını
yanlış kuruyor. Her iki durumda da hata raporda görünmüyor, çünkü
kaybedilen yolcu hiçbir tabloya girmemiş olan yolcu.

## Yarın işe yarayacak dört çıkarım

1. **Talebi tek sayı olarak taşıma.** Talep tahmini modülünün çıktısı
   yalnızca beklenen değer olmasın; varyansı ya da dağılım parametrelerini
   de taşısın. Kapasite aşımını ortalamadan değil, f(x)'in kuyruğundan
   tahmin edebilirsin.
2. **Yolcu kapanma oranını emniyet payı olarak kullan.** Tek bir yolcunun
   reddedilme riski her zaman uçuşun kapanma riskinden yüksek. Erken kapanma
   kararlarında ve müsaitlik raporlamasında uçuş bazlı oranı değil, yolcu
   bazlı oranı esas al.
3. **Yüksek dolulukta modeli karşılaştır.** Spill oranını tahmin ederken
   gamma ile normal modeli yan yana çalıştır; özellikle hedef doluluk yüksekse
   doluluk faktörünün spill hızına etkisini ayrıca değerlendir. Normal
   dağılımın sol kuyruğundaki negatif talep bir uyarı işareti.
4. **Trafiği kesilmiş talep olarak planla.** Beklenen trafik hesabında talebin
   uçuş kapasitesinde kırpıldığını unutma. Gelir ve doluluk projeksiyonlarını
   ham talep üzerinden değil, bu limitli talep üzerinden yürüt; kaybı da
   `E(D) − E(Traffic)` olarak üretip doğrudan hesapla sına.

Bu bölümde ne yok: spill modelinin girdilerinin, özellikle gamma
parametrelerinin, geçmiş veriden nasıl kalibre edildiği ve kısıt kaldırma
(unconstraining) yöntemlerinin kendisi; bunlar talep tahmini üzerine
yazılacak bölümlerin konusu. Kaybın bir fiyatlandırma ve koltuk tahsis
kararına nasıl çevrildiği de gelir yönetimi bölümlerinde. Bu bölüm yalnızca
kapıda kalan yolcunun nasıl sayıldığını anlatmak için var.
