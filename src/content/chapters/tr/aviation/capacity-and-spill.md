---
title: "Havacılıkta kapasite yönetimi ve spill (taşan talep) analizi"
domain: "aviation"
summary: "Spill, uçak dolduğu için kapıda kalan talep; hiçbir sistem onu doğrudan kaydetmiyor, yalnızca kapanmış uçuşların doluluğundan geriye doğru tahmin ediliyor. Bu bölüm o tahminin dört parametresini anlatıyor: talep dağılımının şekli (Gamma ya da Normal), kapalı uçuş doluluk varsayımı (LFCF), bakılan pencereye göre büyüyen varyasyon katsayısı (CV) ve gözlenen doluluğa yakınsayan iteratif hesap."
audience: "Gelir yönetimi, envanter ya da kapasite planlama sistemlerine veri hazırlayan veya bu sistemlerin çıktısını okuyan yazılımcı ve ürün insanı. İstatistik bilgisi gerekmiyor; spill, spoilage, LFCF, varyasyon katsayısı (CV), okuma günü ve kapalı uçuş metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, use-case]
ai: generated
---

Bir uçuş satışa kapandığında sistemde iki sayı kalıyor: kaç koltuk vardı ve
kaç yolcu bindi. Üçüncü sayı, o uçağa binmek isteyip yer bulamayanların
sayısı, hiçbir yerde yazmıyor. Bu kayıp talebe spill (taşan talep) deniyor;
tersine, boş kalıp satılamadan uçan koltuğa spoilage. Kapasite kararları,
yani bir rotaya daha büyük uçak koymak ya da bir uçuşa ne kadar fazla
rezervasyon kabul etmek, ikisi arasındaki dengeye bakıyor. **Spill
ölçülmüyor, tahmin ediliyor; ve o tahminin her parametresi, analistin
bilerek seçmesi gereken bir varsayım.** Dağılımın şekli, uçuşun ne zaman
dolu sayıldığı, belirsizliğin ne kadar geniş tutulduğu ve hesabın nereden
başlatıldığı sonucu değiştiriyor.

![Sunumun kapak slaytı. Solda iki grup olasılık eğrisi üst üste çizilmiş: turuncu, sola yaslı ve sağa doğru uzun kuyruklu Gamma eğrileri (Alpha ve Beta parametreleriyle etiketli) ve mavi, simetrik çan biçimli Normal eğriler (Mean ve Sigma parametreleriyle etiketli). Başlık: Taşma Oranı Analizi. Alt başlık: Havayolu Kapasite Optimizasyonunda Gamma ve Normal Dağılım Modelleri. Etiket: Gelir Yönetimi, İleri Seviye Model Çıkarımları. Alttaki not üç sütun: bağlam, gelir yönetimi, envanter kontrolü ve çifte rezervasyon algoritmalarının matematiksel altyapısı; akış, spill (talebi karşılayamama) ve spoilage (boş koltukla uçma) risklerinin optimizasyonu; mühendislik, rezervasyon sistemleri (PSS) her gece bu dağılım modellerini çalıştırarak uçuşlar için maksimum satış limitlerini günceller.](/decks/capacity-and-spill/01.webp "İki eğri ailesi aynı talebi iki farklı biçimde hayal ediyor. Bölümün geri kalanı hangisinin ne zaman seçileceğiyle ilgili.")

## Kapalı uçuş talebin tavanını değil, kapının kapandığı yeri gösteriyor

Spill tahmininin ham maddesi kapalı uçuş. Sunumun operasyon notu kapalı
uçuşu bütün sınıfların satışa kapatılması, yani erişilebilirliğin sıfıra
inmesi olarak tanımlıyor. Kapanmış bir uçuşta gözlenen doluluk, talebin
ne kadar olduğunu söylemiyor; yalnızca satışın nerede durdurulduğunu
söylüyor. Kapının arkasında kaç kişinin kaldığını bulmak için bir ters
hesap gerekiyor. Sunum bunu gelir yönetimi sistemlerinin demand
unconstraining yöntemi olarak adlandırıyor: satışı durdurulmuş bir uçuşta
gerçek talebi bulmak.

Bu ters hesabın ilk parametresi LFCF, kapalı uçuşlardaki doluluk oranı.
Brifing sistem geneli için aylık bir düzeltme faktörünün nasıl kurulacağını
iki adımda tarif ediyor. Önce her okuma gününde ve her rezervasyon
sınıfında, geçmiş dönemin kapalı uçuşlarının ortalama doluluk oranı
hesaplanıyor. Sonra bu değerler, aynı dönemde spill olan yolcu
yüzdeleriyle ağırlıklandırılıp tek bir birleşik faktöre indiriliyor.
Okuma günü (reading day) kalkışa kalan gün sayısı, rezervasyon sınıfı
(booking class) ise uçaktaki sanal envanter sepetleri.

![Başlık: Kapalı Uçuşlarda Doluluk Oranı (LFCF) Tahmin Akışı. Alt başlık: sistem çapında aylık kalibrasyon faktörü hesaplama algoritması. Soldan sağa oklarla bağlı üç adım. Adım 1, Tarihsel Veri Analizi: okuma günü ve rezervasyon sınıfına göre geçmiş ayların kapalı uçuşlarındaki ortalama doluluk oranını hesapla. Adım 2, Taşma (Spill) Tespiti: aynı tarihsel periyot, okuma günü ve rezervasyon sınıfı için uçuşa alınamayan yolcuların yüzdesini tahmin et. Adım 3, turuncu çerçeveyle vurgulanmış, Kompozit Değer Sentezi: Adım 1'deki doluluk oranlarını Adım 2'deki taşma yüzdeleri ile ağırlıklandırarak nihai LFCF değerini formülize et. Sonuç kutusu: Ağırlıklı Ortalama Çıktısı. Alttaki not: Reading Day (DPD) kalkışa kalan gün sayısıdır, Booking Class (RBD) uçaktaki sanal envanter sepetleridir; bu üç adım satışı durdurulmuş bir uçuşta gerçek talebi bulmak için gelir yönetimi sisteminin kullandığı demand unconstraining yöntemidir.](/decks/capacity-and-spill/03.webp "İkinci adımdaki aynı kelimesine dikkat: ağırlık ile ağırlıklandırılan değer aynı dönemden, aynı okuma gününden ve aynı sınıftan gelmek zorunda.")

Ağırlıklandırmanın mantığı açık: spill'in çok olduğu okuma günü ve sınıf
kombinasyonu, faktörün içinde daha çok söz sahibi oluyor. Hiç taşmayan bir
sınıfın kapalı doluluğu, taşmanın nerede gerçekleştiğini anlatmıyor.

Yazılım tarafında bunun karşılığı bir birleştirme (join) disiplini. Faktör
okuma günü ve rezervasyon sınıfından oluşan bileşik bir anahtar üzerinde
hesaplanıyor ve iki girdisi aynı tarihsel pencereden gelmeli. Doluluk
ortalamasını bir aydan, spill yüzdesini başka bir aydan çeken bir boru
hattı hata vermez; sessizce yanlış bir ağırlıklı ortalama üretir. Pencere
tanımını iki sorgunun ortak parametresi yapmak, bu hatayı yapısal olarak
imkânsız kılmanın en ucuz yolu.

## Dağılımın şekli, kuyruğun ne kadar ciddiye alındığını belirliyor

Spill'i tahmin etmek için bir talep dağılımı varsaymak gerekiyor: bu
uçuşun talebi ortalamanın etrafında nasıl dağılıyor? Sunum iki adayı yan
yana koyuyor. Normal (çan eğrisi) dağılım simetrik ve ortalama etrafındaki
standart sapmalara odaklanıyor. Gamma dağılımı asimetrik, sağa çarpık ve
sıfırın altına inemiyor; odağı ortalamanın çok üstüne çıkan aşırı talep
anları.

Bu farkın iki pratik sonucu var. Birincisi, havacılık talebi negatif
olamaz ama Normal dağılım kuyruklarında matematiksel olarak negatif değer
üretebiliyor. Sunumun mühendislik notu bu yüzden gelir yönetimi
yazılımlarında Gamma ya da log-normal dağılımların tercih edildiğini
söylüyor. İkincisi, spill tam olarak kapasitenin üstündeki kuyrukta
yaşıyor. Sağa uzun kuyruk bırakan bir dağılım, o kuyruğa daha fazla
olasılık kütlesi koyuyor; talebin kapasiteyi aştığı günlerin sıklığını
farklı hesaplıyor.

![Başlık: Model Karşılaştırması, Gamma ve Normal Taşma (Spill) Eğrileri. Sağ üstte etiket: LFCF yüzde 100, değişim katsayısı (CV) 0.40. Solda turuncu Gamma spill modeli grafiği, 0 ile 100 arasındaki talepte sola yaslı tepe ve sağa uzanan kuyruk. Sağda beyaz Normal spill modeli grafiği, eksi 50 ile 50 arasında sıfır etrafında simetrik çan. Altta dört satırlık tablo. Eğri karakteristiği: Gamma asimetrik (sağa çarpık), Normal simetrik (çan eğrisi). Düşük talep davranışı: Gamma kesin sınırlandırılmış (negatif olamaz), Normal teorik olarak negatif değer üretebilir. Odak noktası: Gamma aşırı talep (extreme spikes) durumları, Normal ortalama etrafındaki standart sapmalar. Operasyonel kullanım: Gamma değişkenliği (CV 0.40) yüksek uçuşlar, Normal talep dalgalanmasının düşük olduğu rotalar. Alttaki not: havacılık talebi negatif olamaz; Normal dağılım kuyruklarda negatif değer üretebileceğinden gelir yönetimi yazılımlarında Gamma veya log-normal dağılımlar tercih edilir; CV 0.40 tatil (leisure) rotalarında sık görülen çok yüksek bir talep oynaklığını ifade eder.](/decks/capacity-and-spill/04.webp "Normal grafiğin yatay ekseni eksi 50'den başlıyor. Sol yarıdaki alan, hiçbir zaman gerçekleşmeyecek bir talebe olasılık veriyor.")

Tablonun son satırı seçimi rotaya bağlıyor: Gamma değişkenliği yüksek
uçuşlarda, Normal talep dalgalanmasının düşük olduğu rotalarda. Sunumun
notuna göre 0.40'lık bir CV, tatil rotalarında sık görülen çok yüksek bir
oynaklık.

Bir mühendis için buradaki ders, dağılım seçiminin bir kod sabiti değil,
rotaya bağlı bir konfigürasyon olması gerektiği. Normal dağılımla çalışan
bir modül kullanılacaksa, negatif talep üretebildiği bilinerek
kullanılmalı; o değerleri sessizce sıfıra kırpmak, dağılımın ortalamasını
fark ettirmeden kaydırır.

## Yüzde yüz doluluk varsayımı spill'i şişiriyor

İkinci varsayım, bir uçuşun ne zaman dolu sayılacağı. LFCF'yi yüzde 100
almak, kapanan uçuşun kusursuz biçimde, son koltuğuna kadar dolduğunu
kabul etmek demek. Sunum bunu teorik maksimum olarak adlandırıyor ve
sistemdeki en yüksek spill olasılığını hesapladığını söylüyor. Yüzde 96
ise pratik operasyonel tavan: son dakika iptallerini ve no-show
gerçekliğini içeren, daha düşük ama operasyonel olarak daha isabetli bir
taşma eğrisi veriyor.

Brifing bu seçimin sonucu doğrudan etkilediğini söylüyor: LFCF'nin yüzde
100 ya da yüzde 96 alınması, gözlenen doluluk ile spill oranı arasındaki
ilişkiyi değiştiriyor. İş kuralı, oranın uçuşun kapanma noktasındaki
gerçek performansını yansıtacak şekilde ayarlanması. Sunumun operasyon
notu gerekçeyi somutlaştırıyor: bagaj limitleri ya da vize sorunları gibi
operasyonel sebeplerle uçuşlar nadiren tam yüzde 100 dolulukla kalkıyor ve
gelir yönetimi sistemi hedefi yüzde 96-98 bandına koyarak optimizasyon
yapıyor.

![Başlık: LFCF Parametrelerinin Taşma Oranına Etkisi. Alt başlık: yüzde 100 ile yüzde 96 kapasite senaryoları (CV 0.40). Solda grafik: yatay eksende gözlenen doluluk oranı yüzde 55'ten yüzde 95'e, dikey eksende spill oranı 0'dan 1'e. Turuncu LFCF yüzde 100 eğrisi ve beyaz LFCF yüzde 96 eğrisi yüzde 75'e kadar sıfıra yakın seyrediyor, sonra dikleşiyor; yüzde 95'te turuncu eğri yaklaşık 0.85'e, beyaz eğri yaklaşık 0.55'e çıkıyor. Sağda üç kutu. LFCF yüzde 100 (teorik maksimum): uçuşun kusursuz şekilde tamamen dolduğu varsayımı, sistemdeki en yüksek taşma olasılığını hesaplar. LFCF yüzde 96 (pratik operasyonel tavan): son dakika iptalleri ve no-show gerçekliklerini içeren senaryo, daha düşük fakat operasyonel olarak daha isabetli bir taşma eğrisi sunar. Kritik gözlem: gözlemlenen doluluk oranı yüzde 80'i aştığında her iki modelde de taşma oranı hızla üstel bir artış trendine girer. Alttaki not: uçuşlar operasyonel sebeplerle (bagaj limitleri, vize sorunları) nadiren tam yüzde 100 ile kalkar, gelir yönetimi sistemi hedefi yüzde 96-98 bandına koyar; kapalı uçuş, tüm sınıfların satışa kapatılmasıdır (erişilebilirlik sıfır).](/decks/capacity-and-spill/05.webp "İki eğri arasındaki fark, doluluğun yüksek olduğu sağ uçta açılıyor. Kapasite kararlarının verildiği yer de tam orası.")

Grafikteki asıl bilgi eğrilerin biçimi. Sunumun kritik gözlemine göre
gözlenen doluluk yüzde 80'i aştığında, iki varsayımda da spill oranı hızla
üstel bir artışa geçiyor. Yani LFCF seçimi düşük doluluklu uçuşlarda
neredeyse hiçbir şeyi değiştirmiyor; farkı, büyük uçak ya da ek sefer
kararına aday olan dolu uçuşlarda yaratıyor. Yüzde 100 varsayımıyla
çalışan bir analiz, tam da en önemli uçuşlarda kaybedilen talebi olduğundan
büyük gösteriyor ve kapasite artışını olduğundan cazip kılıyor.

## Belirsizlik bakılan pencereyle birlikte büyüyor

Üçüncü parametre varyasyon katsayısı (CV): standart sapmanın ortalamaya
oranı, talebin ortalamaya göre ne kadar oynak olduğunun ölçüsü. Brifingin
kuralı açık: veri kümesi genişledikçe ve zaman aralığı uzadıkça CV
artırılmalı. Tek bir uçuş bacağının bir aylık analizi için 0.30-0.35
bandı, yıllık sistem geneli analiz için 0.46.

Sunum bu kuralı bir matrise döküyor. Tekil uçuşun aylık periyodu 0.30 ile
en düşük değer. Uçuş bacağı aylıkta 0.35, yıllıkta 0.38. Tüm sistem
aylıkta 0.42, yıllıkta 0.46 ile en yüksek değer. Artışın gerekçesi
mevsimsellik ve ağ büyüklüğü: tek bir uçuşun aylık varyansı düşük, ama
veri bütün ağ ya da bütün yıl üzerinden toplandığında mevsimsel
dalgalanmalar da içeri giriyor.

![Başlık: Taşma Modelleri İçin Değişim Katsayısı (CV) Matrisi. Alt başlık: veri kapsamı ve zaman ufku genişledikçe talep varyansı artar. Satırlarda kapsam, sütunlarda aylık ve yıllık periyot olan tablo. Tekil uçuş (flight): aylık 0.30, en düşük; yıllık değer yok. Uçuş bacağı (flight leg): aylık 0.35, yıllık 0.38. Tüm sistem (system): aylık 0.42, yıllık 0.46, en yüksek. Hücreler değer büyüdükçe koyu turuncuya dönüyor. Analiz: mevsimsellik ve ağ genişliği (network size) analiz denklemine dahil oldukça modelin belirsizlik toleransı (CV) 0.30'dan 0.46'ya tırmanır. Alttaki not: uçuş bacağı, uçağın tek bir kalkış ve inişi arasındaki bacaktır (örneğin LHR-DXB); tek bir uçuşun aylık varyansı düşüktür, veri tüm ağ veya yıllık bazda toplandığında mevsimsel dalgalanmalar nedeniyle CV 0.46'ya kadar çıkar.](/decks/capacity-and-spill/06.webp "Tekil uçuşun yıllık hücresi boş bırakılmış. Tablo her kombinasyonu doldurmuyor; kullanılacak değer analizin sorusuna göre seçiliyor.")

Brifingin kaygısı hata payı: aylık planlamadan yıllık stratejik planlamaya
geçerken CV güncellenmezse, model yıllık verideki mevsimsel oynaklığı
görmezden gelir; spill hesabının hata payı da büyür. Önceki başlıktaki grafikle
birleştirince tablo netleşiyor: spill, dağılımın kapasitenin üstünde kalan
kuyruğunda ölçülüyor ve o kuyruğun kalınlığını büyük ölçüde CV belirliyor.

Yazılım tarafında bunun karşılığı, CV'nin tek bir global sabit değil,
analizin kapsamı ve zaman ufkuyla anahtarlanan bir arama tablosu olması.
Aynı spill fonksiyonu hem bir hattın aylık raporunu hem yıllık filo
çalışmasını besliyorsa, çağıran taraf hangi hücreden okuduğunu açıkça
söylemeli. Varsayılan bir değere düşen çağrı, iki farklı soruya aynı
belirsizlikle cevap verir.

## Spill tek adımda hesaplanmıyor, yakınsatılıyor

Dört parametre seçildikten sonra hesabın kendisi geliyor ve o da tek
geçişte bitmiyor. Brifingin kurduğu ilişki şu: tahmin edilen doluluk
oranı, 1.0 eksi spill oranı. Sistemin aslında uçağa alabileceği
potansiyel talepten, kaçırılan kısım düşüldükten sonra kalan pay.

İteratif süreç, gözlenen doluluktan daha yüksek bir nominal doluluk
varsayımıyla başlatılıyor. Bu başlangıç noktası, seçilen CV ve LFCF
değerleriyle formülden geçiriliyor; çıkan tahmini doluluk gözlenen
dolulukla karşılaştırılıyor ve nominal değer, tahmin gözleneni
yakalayana kadar rafine ediliyor. Başlangıcın yukarıdan seçilmesinin
mantığı basit: spill yalnızca taşınan yolcuyu azaltabilir, dolayısıyla
gerçek talep gözlenen dolulukla aynı ya da ondan yüksek olmak zorunda.
Brifing bu başlangıcın algoritmanın doğru sonuca daha hızlı yakınsamasını
sağladığını söylüyor.

![Başlık: Taşma (Spill) Tahmininde İteratif Optimizasyon Döngüsü. Alt başlık: algoritmik sürekli kalibrasyon süreci. Saat yönünde dönen oklardan oluşan bir çember, ortasında formül kutusu: öngörülen doluluk oranı eşittir 1.0 eksi taşma oranı. Çemberin etrafında dört adım. 1, başlangıç varsayımı: nominal doluluk, gözlemlenen doluluktan büyük kabul edilir. 2, model çalıştırma: ilgili CV ve LFCF değerleriyle formül işleme alınır. 3, hata payı kontrolü: öngörülen sonuç gözlemlenen doluluk ile eşleştirilir. 4, sürekli iterasyon: sistem optimum dengeyi bulana kadar taşma tahminini günceller. Alttaki analist notu: modern PSS sistemlerinde bu işlem her gece toplu optimizasyon (batch optimization) süreciyle milyonlarca kez tekrarlanır; bu dinamik kapasite yönetimi, yolcuyu kaçırma korkusu ile boş koltuk uçurma riski arasındaki dengeyi bid price ve EMSR modelleri aracılığıyla kurar.](/decks/capacity-and-spill/07.webp "İkinci adım, önceki üç başlığın toplandığı yer: CV ve LFCF burada formüle giriyor. Parametre yanlışsa döngü yine yakınsar, ama yanlış noktaya.")

Döngünün mühendislik tarafı tanıdık bir kök bulma problemi. Sunumun notuna
göre bu işlem modern PSS'lerde her gece toplu optimizasyon içinde
milyonlarca kez tekrarlanıyor. O ölçekte iki şey önem kazanıyor: her
uçuşun bir yakınsama ölçütü ve bir iterasyon üst sınırı olması, ve
yakınsamayan uçuşların sessizce son değerle kaydedilmek yerine ayrıca
işaretlenmesi. Başlangıç noktasını gözlenen doluluğun üstünde tutmak da
kural değil, bir ön koşul olarak kodlanmaya uygun: altından başlayan bir
çağrı, zaten fiziksel anlamı olmayan bir bölgede arama yapıyor.

## Overbooking aynı kapasitenin öbür yüzü

Spill, kapasitenin yetmediği yerde kaybedilen yolcu. Overbooking (fazla
rezervasyon) ise ters yöndeki kaybı, rezervasyonu olduğu halde gelmeyen
yolcunun boş bıraktığı koltuğu hedefliyor. Sunumun kapak notu ikisini aynı
cümlede kuruyor: spill ile spoilage risklerinin optimizasyonu.

Brifing optimum overbooking seviyesini belirleyen girdileri dört başlıkta
sayıyor: biniş oranları, iptal oranları, rezervasyon kaydı olup
eşleşmeyen yolcular (no-records) ve bağlantılı uçuşunu kaçıran yolcular
(mis-connects). Sunum bunların her birinin hangi sistemden geldiğini de
işaretliyor ve iki kavramı açıyor. No-record, uçuş kontrol sisteminin
(DCS) listesine yansımayan, e-bileti kesilmemiş PNR'lar; kaynağı PSS ile
GDS arasındaki senkronizasyon hataları. Mis-connect, aktarmalı hub
uçuşlarında ilk bacağı geciken yolcu ve anlık takip gerektiriyor.

![Başlık: Optimum Çifte Rezervasyon (Overbooking) Girdileri. Solda dört turuncu şerit bir uçağın burnuna doğru akıyor, uçağın gövdesinden geçip sağ alttaki Optimum Çifte Rezervasyon Seviyesi kutusuna iniyor. Şeritler: artı işaretiyle Biniş Oranları (Boarding Rates), gerçekleşen yolcu talebi, veri kaynağı PSS; eksi işaretiyle İptal Oranları (Cancellation Rates), beklenen kapasite boşalması, veri kaynağı RMS; ünlem işaretiyle Kayıt Dışılar (No-records), operasyonel uyuşmazlıklar, veri kaynağı DCS/GDS; soru işaretiyle Bağlantıyı Kaçıranlar (Mis-connects), aktarma kaynaklı boşluklar, veri kaynağı hub operasyonları. Alttaki not: no-record yolcular DCS listesine yansımayan e-bileti kesilmemiş PNR'lardır (PSS-GDS senkronizasyon hataları); mis-connects aktarmalı hub uçuşlarında ilk bacağı geciken yolculardır ve anlık takip gerektirir; ilgili akışlar sipariş yönetimi ve biletleme ile kalkış operasyonları.](/decks/capacity-and-spill/02.webp "Dört şeridin veri kaynakları dört farklı sistem. Overbooking hesabı, bu sistemlerin aynı uçuş için aynı anda doğru konuşmasına bağlı.")

Bu dört girdinin ortak özelliği, hiçbirinin gelir yönetimi sisteminin
kendi içinde doğmaması. Biniş oranı PSS'ten, no-record DCS ile GDS
arasındaki uyuşmazlıktan, mis-connect hub operasyonundan geliyor. Yazılım
tarafında overbooking modelinin kalitesi, formülünden çok bu beslemelerin
tazeliğine ve birbirleriyle aynı uçuş anahtarında eşleşmesine bağlı.
Spill tarafındaki LFCF tartışmasıyla da doğrudan ilişkili: yüzde 96'lık
pratik tavanın arkasındaki son dakika iptalleri ve no-show'lar, overbooking
modelinin girdileriyle aynı olaylar.

## Yarın işe yarayacak dört çıkarım

1. **LFCF'yi sabit yüzde 100 bırakma.** Spill modelinde kapalı uçuş
   doluluğunu, uçuşun gerçek kapanma dinamiğini yansıtan bir değere (örneğin
   yüzde 96) çek. Fark en çok yüzde 80'in üstündeki dolu uçuşlarda, yani
   kapasite kararlarının verildiği yerde ortaya çıkıyor.
2. **İterasyonu gözlenen doluluğun üstünden başlat.** Nominal doluluk
   varsayımını gözlenen oranın üstünde tut; tahmini doluluğu 1.0 eksi spill
   oranı olarak hesapla ve gözlenene yakınsayana kadar rafine et. Yakınsamayan
   uçuşları ayrıca işaretle.
3. **CV'yi analizin ölçeğine göre seç.** Tek uçuşun aylık analizinde 0.30,
   uçuş bacağında 0.35-0.38, sistem genelinde 0.42-0.46 bandını kullan. Aylık
   planlamadan yıllık stratejik planlamaya geçerken CV'yi güncellemeyi
   unutma; hata payı buradan büyür.
4. **Dağılımı rotanın oynaklığına göre seç, düzeltme faktörünü aynı
   pencereden kur.** Değişkenliği yüksek uçuşlarda Gamma, dalgalanması düşük
   rotalarda Normal. Sistem geneli LFCF faktörünü okuma günü ve rezervasyon
   sınıfı bazında, doluluk ile spill yüzdesini aynı dönemden alarak
   ağırlıklandır.

Bu bölümde ne yok: spill modelinin temel formülleri ve kökeni (spill
bölümleri), talebin rezervasyon eğrilerinden nasıl tahmin edildiği ve
overbooking seviyesinin kendisinin nasıl optimize edildiği (talep tahmini
ve envanter bölümleri). Bu bölüm o modellerin hangi varsayımlarla
beslendiğini ve o varsayımların sonucu nereden değiştirdiğini anlatmak
için var.
