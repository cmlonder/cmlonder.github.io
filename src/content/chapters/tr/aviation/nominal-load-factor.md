---
title: "Nominal doluluk oranı ve talep kaybı (spill) analizi"
domain: "aviation"
summary: "Dolu bir uçak, kaç yolcunun kapıdan döndüğünü söylemez. Bu bölüm gözlemlenen doluluktan gerçek talebe iteratif olarak nasıl geri gidildiğini, taşan yolcunun üç olası akıbetini, geri kazanım oranı hesaba katılmazsa talebin neden şiştiğini ve First Class talebinin neden çan eğrisiyle değil negatif eksponansiyel dağılımla modellendiğini anlatıyor."
audience: "Gelir yönetimi, talep tahmini ya da kapasite planlama sistemleriyle çalışan, tahmin modülüne giren talep rakamının nereden geldiğini merak eden yazılımcı ve ürün insanı. Nominal doluluk oranı, spill, recapture, varyasyon katsayısı (CV) ve negatif eksponansiyel dağılım metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Gelir yönetimi bölümleri hep aynı varsayımla başlıyordu: elimizde bir talep
tahmini var, koltuğu ona göre bölüştürüyoruz. Bu bölüm o tahminin ham
maddesine iniyor. Sorun basit görünüyor ama değil: bir uçuşta kaç kişinin
uçtuğunu biliyorsun, kaç kişinin uçmak istediğini bilmiyorsun. Uçak dolduğu
anda satış sistemi talebi kaydetmeyi bırakıyor, kapıdan dönen yolcu hiçbir
tabloya düşmüyor. **Gözlemlenen doluluk talebin kendisi değil, kapasiteyle
kesilmiş bir gölgesi; havayolunun kârı da o gölgenin arkasındaki gerçek
talebi, kaçan yolcuyu ve o yolcunun ne kadarının geri kazanıldığını doğru
hesaplamasına bağlı.**

![Sunumun kapak slaytı. Solda başlık: Havacılıkta Kapasite Sınırlarını Aşan Talebi Yönetmek. Alt başlık: Doluluk Oranlarından Taşma (Spill) ve Geri Kazanım (Recapture) Modellerine Analitik Bir Bakış. Sağda bir uçak kabin yerleşim planının üzerine çizilmiş, soldan sağa keskin düşüp uzun bir kuyrukla sönen bir eğri. Alttaki not kutusu: uçak yüzde 100 dolduğunda havayolu engellenmiş, sansürlü veriyle karşılaşır ve kapasite sonsuz olsaydı bilet alacak kişi sayısı (kısıtsız talep) bilinmez; Amadeus Altéa PrO veya Sabre AirVision gibi RM sistemleri marjinal koltuk gelirini (EMSR) hesaplamadan önce bu taşma modellerini temel alır.](/decks/nominal-load-factor/01.webp "Kabin planının üzerindeki eğri bölümün sonunda First Class talebi olarak geri dönecek. Şimdilik not kutusundaki ilk cümleye bak: dolu uçak, veri üretmeyi bırakan uçaktır.")

İstatistikte bunun adı sansürlü veri. Kısıtsız talep (unconstrained demand)
kapasite sonsuz olsaydı bilet alacak kişi sayısı; gözlemlediğin ise onun
kapasiteyle kırpılmış hali. Yazılım tarafında bunun karşılığı şu: satış
geçmişini doğrudan tahmin modeline besleyen bir boru hattı, her dolu uçuşta
talebi sistematik olarak düşük gösterir. Model de bu düşük talebe göre
kapasite ve koltuk koruma kararı verir; hata kendini besleyen bir döngüye
dönüşür. Kapak slaytının not kutusu bu yüzden taşma modellerini, marjinal
koltuk gelirini hesaplayan adımın öncesine koyuyor: ön işleme yanlışsa
arkadaki optimizasyon ne kadar iyi olursa olsun yanlış girdiyle çalışır.

## Nominal doluluk oranı bir kerede hesaplanmaz, gözlemle eşitlenene kadar aranır

Kısıtsız talebe geri dönmenin yolu kapalı bir formül değil, bir döngü.
Kaynak metin mantığı tek cümleyle kuruyor: tahmin edilen doluluk oranı
gözlemlenen doluluk oranından düşükse nominal doluluk oranı artırılır ve
süreç tekrarlanır. Nominal doluluk oranı burada, kapasite kısıtı olmasaydı
uçuşun ulaşacağı doluluk demek; nominal talep de o doluluğa karşılık gelen
yolcu sayısı.

Adımlar şöyle işliyor. Bir nominal değerle başlıyorsun ve bu nominal talep
kapasiteyle karşılaştığında ne kadar doluluk üreteceğini modelden
hesaplıyorsun. Bu tahmin edilen doluluğu gerçekte gözlemlenen doluluğa
koyuyorsun. Tahmin gözlemden düşükse, varsaydığın gerçek talep az demektir;
nominal değeri artırıp hesabı yeniliyorsun. İterasyon, iki değer
birbirine eşitlendiğinde duruyor. O eşitlik noktası, nominal doluluk oranı
için güvenilir tahminin elde edildiği karar noktası.

![Başlık: Gerçek Talebi Bulmak İçin Gözlemlenen Doluluk Oranının Ötesine Geçilmelidir. Sağ üstte uyarı kutusu: gözlemlenen doluluk her zaman gerçek talebi yansıtmaz, uçak tamamen dolduğunda kapasite nedeniyle reddedilen yolcu sayısı bilinmez. Ortada dört adımlı döngü: Adım 1, tahmini doluluk oranını belirle; Adım 2, gözlemlenen doluluk ile karşılaştır; Adım 3 (döngü), tahmin gözlemlenenden küçükse nominal değeri artır ve döngüyü tekrarla; Adım 4, eşitlik sağlandığında döngü sonlanır ve nominal talep tahmini elde edilmiştir. Döngünün ortasında bir kilit simgesi. Sağdaki not kutusu: bu döngüsel işlem tarihsel rezervasyon verilerindeki kısıtlamaları kaldırmak (detruncation) için kullanılan endüstri standardı bir buluştur; gelecekteki kalkış tarihlerinin tahminlerini güncellemek için her gece toplu işlem (batch) pencerelerinde çalıştırılır.](/decks/nominal-load-factor/02.webp "Ortadaki kilit döngünün çıkış koşulu: tahmin gözlemi yakalayana kadar nominal talep kilitlenmiyor.")

Bu, mühendisin tanıdığı bir kalıp: kapalı çözümü olmayan bir denklemin
kökünü sabit nokta iterasyonuyla aramak. Brifing yalnızca yönü veriyor
(tahmin düşükse artır) ve durma koşulunu (eşitlik). Uygulamada iki şeyi
kodun kendisi belirlemek zorunda. Birincisi eşitliğin toleransı: kayan
noktalı iki doluluk oranı nadiren birebir eşit çıkar, o yüzden "eşit"
kelimesi bir eşik değer olarak tanımlanmalı. İkincisi artışın adımı: kaba
adım eşitlik noktasını atlar, ince adım gece penceresini doldurur. Slayttaki
not bu hesabın her gece toplu işlem pencerelerinde, gelecekteki kalkış
tarihleri için çalıştırıldığını söylüyor. Yani iterasyonun maliyeti uçuş
sayısıyla, tarih sayısıyla ve tur sayısıyla çarpılıyor; yakınsamayan tek
bir uçuş bütün batch'i bekletmemeli, bir tavan tur sayısı ve "yakınsamadı"
diye işaretlenen bir çıkış yolu olmalı.

Kaynağın aksiyon listesi de aynı yere varıyor: sistem gözlemlenen
dolulukla tahmin edilen arasındaki farkı sürekli denetlemeli ve nominal
talebi güncel tutmak için bu iteratif düzeltmeyi otomatikleştirmeli. Elle
yapılan bir düzeltme bir sezon sonra eskir; talep değişirken nominal değer
geçen yılın gerçeğinde kalır.

## Taşan yolcunun üç akıbeti var, yalnızca biri kayıp

Kapasite aşıldığında geri çevrilen talebe spill, yani taşma deniyor. Ama
taşan yolcu tek bir kovaya düşmüyor. İş kuralı üç senaryo öngörüyor:
yolcu aynı havayolunun başka bir uçuşuna yönelebilir, rakip bir havayoluyla
uçmayı seçebilir ya da hava yoluyla seyahat etmekten tamamen vazgeçebilir.
Birincisi havayolu için geri kazanım (recapture), ikincisi pazar payı
kaybı, üçüncüsü pazarın kendisinden silinen talep.

![Başlık: Kapasite Aşıldığında Yolcu Akışı Taşma ve Geri Kazanım Ağlarına Yönelir. Soldan sağa akan bir Sankey şeması. Yolcu Talebi kutusu Dolu Uçuş çizgisinde ikiye ayrılıyor: üstte mavi Kabul Edilen akış, altta turuncu Taşma (Spill) akışı, yani kapasite yetersizliğinden geri çevrilen talep. Turuncu akış üçe bölünüyor: yeşil Geri Kazanım (Recapture), aynı havayolunun alternatif uçuşuna yönelenler; gri Rakip Havayolu, pazar payı kaybı; gri Seyahatten Vazgeçme, kayıp talep. Alttaki turuncu bant: ağ içindeki geri kazanım oranı mutlaka hesaba katılmalıdır, aksi takdirde aynı yolcu iki farklı uçuşun talebi gibi algılanır ve nominal talep gereğinden fazla hesaplanır. Sağdaki not kutusu: modern havayolları bacak bazlı değil ağ bazlı çalışır, bir yolcu 09:00 uçuşundan taşarsa sistem onun 11:00 uçuşunu alma olasılığını hesaplar; günümüz teklif yönetim sistemleri geri kazanımı hesaplamak için pazar payı yerine dinamik tüketici seçimi algoritmalarını (çoklu logit modeller) kullanır.](/decks/nominal-load-factor/03.webp "Yeşil kol kayıp değil, aynı havayolunun başka uçuşuna geçen gelir. Alttaki bant ise bu kolun tahmin tarafında yarattığı tuzağı anlatıyor.")

Kaynak metin burada ince bir ayrım yapıyor: yeniden çekilen talebin
(reattracted demand) konaklatılması, geri kazanılan taleptir (recaptured
demand). Yani yolcunun havayolunun başka bir uçuşunu istemesi yetmiyor; o
uçuşta ona gerçekten yer bulunması gerekiyor. Alternatif uçuş da doluysa,
yeniden çekilen talep ikinci kez taşıyor. Veri modelinde bu, "yönlendirildi"
ile "yerleşti" arasındaki fark: ikisini tek bir bayrakla tutan bir şema,
geri kazanımı olduğundan yüksek gösterir.

Yeniden kazanım oranını neyle tahmin edeceğin de ayrı bir karar. Basit yol
pazar payı: havayolu pazarın yüzde kaçını taşıyorsa, taşan yolcunun da o
kadarını geri alacağını varsaymak. Brifing bunun yerine tüketici seçim
modellerini (consumer choice models) öneriyor. Bu modeller, istenen uçuş
yokken alternatif uçuş programlarından her birinin seçilme olasılığını
hesaplıyor. Slayttaki not bunu somutlaştırıyor: yolcu sabah 09:00
uçuşundan taşarsa sistem onun 11:00 uçuşunu alma olasılığını hesaplıyor.
Pazar payı her alternatifi aynı çekicilikte sayar; seçim modeli iki saat
sonraki uçuşla akşamki uçuşu ayırt eder.

## Geri kazanımı saymayan tahmin, aynı yolcuyu iki kez sayar

Taşmayı modellemenin bir tahmin tarafı var ve en sinsi hata orada. Bir
uçuş grubunda, örneğin aynı gün aynı hatta birbirine yakın saatlerde
kalkan uçuşlarda, 09:00'dan taşıp 11:00'a geçen yolcu 11:00 uçuşunun
gözlemlenen talebinde görünüyor. Aynı zamanda 09:00 uçuşunun detruncation
hesabı da onu kaçan talep olarak geri ekliyor. Grup toplamına bakınca aynı
insan iki kez sayılmış oluyor.

Brifingin çözümü açık: grup içindeki uçuşlar arasında gerçekleşen yeniden
kazanım oranı mutlaka hesaplanmalı. Bu oran, taşan trafiğin ne kadarının
grubun diğer uçuşları tarafından absorbe edildiğini gösteriyor ve toplam
nominal talebin şişmesini engelliyor. Yazılım tarafında bunun karşılığı,
tahmin birimini tek uçuştan uçuş grubuna taşımak. Her uçuşun nominal
talebini bağımsız hesaplayıp sonra toplayan bir servis bu düzeltmeyi
yapamaz, çünkü düzeltme uçuşlar arası bir akışa bakıyor. Grup düzeyinde bir
adım lazım: önce her uçuşun taşmasını bul, sonra grubun içinde kalanı
toplamdan düş.

Şişmiş nominal talebin bedeli yalnızca bir raporun yanlış olması değil.
Şişmiş talep, planlamaya olduğundan büyük bir pazar gösteriyor. Kapasite
kararına giden veri bu olduğunda, gerçekte aynı yolcuların farklı saatlere
dağılmasından ibaret bir talep yeni kapasite gerekçesine dönüşüyor.

## First Class talebi çan eğrisi çizmiyor

Buraya kadar anlatılan her şey bir dağılım varsayımına dayanıyor: taşmayı
hesaplamak için talebin hangi olasılık dağılımına uyduğunu bilmen lazım.
Ekonomi (coach) kabininde talep genellikle normal dağılım gösteriyor.
First Class'ta göstermiyor. Veriler First Class talebinin, özellikle tam
ücretli ve ödül biletli yolcularda, daha çok negatif eksponansiyel bir
dağılım izlediğini gösteriyor. Yani ekonomi için yazılmış spill modeli
First Class'a olduğu gibi uygulanamıyor.

![Başlık: Ekonomi Sınıfı Modelleri First Class Kabinlerinin Dinamiklerini Çözemez. Üç sütunlu karşılaştırma tablosu: özellik, Ekonomi (Coach), First Class; sütun başlıklarında sırasıyla bir çan eğrisi ve bir düşüş eğrisi simgesi. Talep dağılım modeli: ekonomi için normal, gamma, lojistik, log normal; First Class için negatif eksponansiyel. Varyasyon katsayısı (CV): ekonomi için genellikle düşük (öngörülebilir); First Class için genellikle CV yaklaşık 1, CV 1'den küçükse Erlang veya Poisson, 1'den büyükse Coxian kullanılır. Talep karakteristiği: ekonomi için yüksek hacim ve düzenli yığılma; First Class için çok düşük hacim, seyrek ve aşırı dalgalı talep. Alt kutu: normal dağılım modeli First Class taşma hesaplamalarına uyarlanamaz, iki kabin tamamen farklı matematiksel kanunlara tabidir. Sağdaki not kutusu: CV gelir yönetiminde riski tanımlar, yüksek CV talebin çok dalgalı ve öngörülmesinin zor olduğunu gösterir; First Class yalnızca ücretli F sınıfıyla değil, operasyonel yükseltmeler (op-up) ve mil biletleriyle de dolar ve talep yapısı oldukça düzensizdir (lumpy).](/decks/nominal-load-factor/04.webp "Orta satırdaki CV bir sonraki kararın anahtarı: First Class için tek bir dağılım değil, CV'ye göre seçilen bir aile var.")

Farkı en çıplak gösteren şey ham veri. Kaynaktaki First Class sayımlarında
sıfır yolculu gözlem 4561 kez görülüyor ve toplamın yüzde 40,6'sını
oluşturuyor. Tek yolculu gözlem 2282 kez, yüzde 20,3; iki yolculu 1660
kez, yüzde 14,8; üç yolculu 973 kez, yüzde 8,7; dört yolculu 658 kez,
yüzde 5,9. Beş ve üzerinde frekans azalan bir seyirle yüzde 4'ün altına
iniyor. İlk beş satır tek başına gözlemlerin yüzde 90'ından fazlasını
tutuyor. Tepe sıfırda: en sık görülen First Class yolcu sayısı hiç
yolcu olmaması.

![Başlık: Gerçek Uçuş Verileri First Class Talebinin Keskin Bir Düşüş Eğrisi İzlediğini Gösteriyor. Sütun grafik: yatay eksende 0'dan 12'ye yolcu sayısı, dikey eksende yüzde frekans. Sıfır yolcu sütunu yaklaşık yüzde 40 ile en yüksek, bir yolcu yaklaşık yüzde 20; sonrakiler hızla kısalıyor ve 7'den sonra neredeyse sıfıra iniyor. Birinci balon: yüzde 40,6 zirve noktası, uçuşların neredeyse yarısında hiç First Class yolcusu yoktur ve sıfır yolcu frekansı en yüksek değerdir. İkinci balon: uzun kuyruk, 5'ten fazla yolcu görme olasılığı hızla sıfıra yaklaşır. Alt bant: bu veri seti talebin çan eğrisi olmadığını kanıtlar ve ancak negatif eksponansiyel dağılımla modellenebilir. Sağdaki not kutusu: uçuşların yüzde 40'ı sıfır yolcuyla kalkıyorsa First Class koltuklarına ayrılan fiziksel alan büyük bir fırsat maliyetidir; RM analistleri bu veriyi kullanarak ekonomide agresif overbooking yapar, çünkü boş First Class koltuklarına operasyonel sınıf atlatma (op-up) yapabileceklerini bilirler.](/decks/nominal-load-factor/05.webp "Sıfırdaki sütuna normal dağılım oturtmaya çalışan model, negatif yolcu sayısına olasılık vermek zorunda kalır. Grafiğin reddettiği şey tam olarak bu.")

Slaytın not kutusu bu verinin iki kabin arasındaki bağını da gösteriyor.
Uçuşların yüzde 40'ı sıfır First Class yolcusuyla kalkıyorsa, o koltuklar
ekonomiden taşan yolcu için bir tampon oluyor: RM analistleri ekonomide
agresif fazla satış yapıyor, çünkü boş First Class koltuğuna operasyonel
sınıf atlatma (op-up) yapılabileceğini biliyor. Aynı not, First Class'ın
yalnızca ücretli F sınıfıyla değil op-up ve mil biletleriyle de dolduğunu
söylüyor. Tahmin tarafı için bunun anlamı şu: First Class'ta gözlemlenen
doluluğun bir kısmı First Class talebi değil, ekonominin taşmasının
yansıması. İki kabinin tahmini birbirinden tamamen bağımsız kurulursa bu
akış iki tarafta da yanlış yere yazılır.

## Dağılımı varyasyon katsayısı seçer, kabin adı değil

Negatif eksponansiyel de her First Class kabinine uyan tek cevap değil.
Seçimi yapan ölçü varyasyon katsayısı (CV): standart sapmanın ortalamaya
oranı. Slayttaki not bunu gelir yönetimi dilinde riskin tanımı olarak
koyuyor; yüksek CV talebin çok dalgalı ve öngörülmesi zor olduğunu
gösteriyor. Negatif eksponansiyel dağılımın CV'si 1, First Class talebi de
genellikle bu civarda duruyor. Ama brifing sapma durumlarını da
tanımlıyor: varyans düşükse (CV 1'den küçükse) Erlang ya da Gamma dağılımı,
kesikli veri için Compound Poisson modeli kullanılmalı. Varyans yüksekse (CV
1'den büyükse) ampirik çalışmalara göre en iyi uyumu iki aşamalı Coxian
dağılımı sağlıyor.

Yazılım tarafında bunun karşılığı, dağılımın bir sabit değil bir strateji
olması. Kabin sınıfını dağılım tipine sabit bir haritayla bağlamak yerine,
her tahmin biriminin geçmiş verisinden CV'yi ölçüp dağılımı ona göre seçen
bir adım gerekiyor. Brifingin aksiyon listesindeki ilk madde de bu: kabin
sınıfına göre model değiştirilmeli, ekonomi için normal dağılım varsayımı
yapılabilirken First Class için CV'ye göre Erlang, Gamma veya Coxian
arasında dinamik geçiş yapılmalı. Bu seçimin kendisi de loglanmalı; bir
uçuşun tahmini bir gün Gamma'yla, ertesi gün Coxian'la yapıldıysa, tahmin
farkının sebebi veri değil model olabilir.

## Negatif eksponansiyelde taşma tek bir üstelle hesaplanıyor

Negatif eksponansiyelin pratik değeri, taşma hesabını kapalı formüllere
indirmesi. İki değişken yetiyor: ortalama talep μ ve kapasite c. Kaynak
metin beklenen taşmayı şöyle veriyor: beklenen taşma eşittir μ çarpı e
üzeri eksi c bölü μ. Slayt aynı çerçevede dört ölçüyü yan yana koyuyor.

![Başlık: Negatif Eksponansiyel Dağılım Taşma Oranlarını Matematiksel Olarak Modelliyor. Üst bant: μ ortalama talep, c uçuş kapasitesi, e Euler sayısı. Dört kutu. Uçuş Kapanma Oranı: e üzeri eksi c bölü μ, belirli bir kapasitenin talebi aşma olasılığı. Beklenen Trafik: μ çarpı (1 eksi e üzeri eksi c bölü μ), kapasite ile sınırlandırılmış olarak fiilen taşınan yolcu sayısı. Beklenen Taşma (Expected Spill): μ çarpı e üzeri eksi c bölü μ, nominal talep eksi beklenen trafik. Taşma Oranı (Spill Rate): e üzeri eksi c bölü μ, geri çevrilen talebin toplam talebe oranı. Sağdaki not kutusu: modern PSS altyapısında c fiziksel uçak kapasitesi değil, belirli bir rezervasyon sınıfı için belirlenen yetkilendirme seviyesi (AU) veya bid price sınırıdır; bu formülün hesaplama yükü çok düşüktür ve tarihsel olarak eski TPF ana bilgisayarlarının milyonlarca uçuş rotası için her gece dakikalar içinde işlem yapmasını sağlamıştır.](/decks/nominal-load-factor/06.webp "Soldaki ve sağdaki üst-alt kutular aynı ifadeyi taşıyor: bu dağılımda uçuşun dolma olasılığı ile talebin geri çevrilen payı aynı sayı.")

Formüller birbirine bağlı. Beklenen trafik, kapasiteyle sınırlandırılmış
olarak fiilen taşınan yolcu: μ çarpı bir eksi e üzeri eksi c bölü μ.
Beklenen taşma, nominal talepten beklenen trafiğin düşülmüş hali; μ'den
μ(1 − e^(−c/μ)) çıkarınca μe^(−c/μ) kalıyor. Taşma oranı, geri çevrilen
talebin toplam talebe oranı; beklenen taşmayı μ'ye bölünce e^(−c/μ)
kalıyor. Uçuş kapanma oranı (flight closing rate), yani kapasitenin talep
tarafından aşılma olasılığı da e^(−c/μ). Slayttaki iki kutunun aynı ifadeyi
taşıması bir tekrar değil, bu dağılımın bir özelliği: negatif
eksponansiyelde uçuşun dolma olasılığı ile talebin taşan payı aynı sayıya
çıkıyor.

Bu bölümün başındaki iteratif döngüyle bağ da burada kuruluyor. Beklenen
trafik formülü, verilen bir nominal talep ve kapasite için tahmin edilen
doluluğu üretiyor. Döngü de tam olarak bu fonksiyonu çağırıp sonucu
gözlemle karşılaştırıyor. Brifingin aksiyon listesi uçuş kapanma oranının
izlenmesini, hangi doluluk seviyelerinde talebin geri çevrilmeye
başladığının taşma oranıyla analiz edilmesini ve kapasite planlamasının bu
veriye göre revize edilmesini istiyor. Kapanma oranı ölçülebilir bir
şey; kapasiteye ulaşan uçuşları sayıyorsun. Taşma ise ölçülemiyor; model
onu kapanma oranından ve nominal talepten türetiyor.

Slaytın not kutusundaki bir ayrıntı yazılımcı için önemli: modern yolcu
hizmet sistemlerinde c her zaman fiziksel uçak kapasitesi değil, belirli
bir rezervasyon sınıfı için belirlenen yetkilendirme seviyesi (AU) ya da
bid price sınırı. Yani aynı formül, sınıf düzeyinde "bu sınıf kaç kez
kapandı, ne kadarı taştı" sorusuna da uygulanabiliyor; c'yi parametre
olarak almak, onu uçak tipinden okumaktan daha doğru arayüz. Not ayrıca
formülün hesaplama yükünün çok düşük olduğunu, tarihsel olarak eski TPF
ana bilgisayarlarının milyonlarca rota için her gece dakikalar içinde işlem
yapmasını sağladığını söylüyor. Tek bir üstel ifade, iterasyon içinde
binlerce kez çağrılsa bile ucuz.

## Taşma ve geri kazanım, fiyatlamadan önce çözülmesi gereken problem

Sunumun kapanışı üç ayağı yan yana koyuyor: doğru talep teşhisi, ağ
etkisi ve kabine özel analitik. Üçü de aynı noktaya varıyor: gelir
yönetiminin koltuğu kime saklayacağı kararı, bu üç hesabın çıktısına
dayanıyor.

![Başlık: Modern Gelir Yönetimi Kesin Matematiksel Dağılımlar Üzerine Kuruludur. İç içe üç altıgen. Doğru Talep Teşhisi (hedef tahtası ve buzdağı simgeleri): gözlemlenen doluluk buzdağının görünen kısmıdır, kapasite kısıtlamaları nedeniyle gizli kalan talebi (spill) tahmin döngüleriyle ortaya çıkarmak şarttır. Ağ (Network) Etkisi (ağ ve döngü simgeleri): kaybedilen bir yolcunun ne kadarının kendi ağımızda kaldığı (recapture) gerçek talep tahminimizi şekillendirir ve kapasitenin yanlış hesaplanmasını önler. Kabine Özel Analitik (koltuk ve grafik simgeleri): her kabin kendi kuralına göre oynar, ekonomi sınıfındaki homojen yığılmalar ile First Class'ın seyrek, eksponansiyel uçları aynı algoritmalarla yönetilemez. Sağdaki not kutusu: taşma ve geri kazanımı doğru modellemek havayolunun rahatça fazla satış yapmasını ve ücretli yolcu kilometresi (RPK) başına geliri en üst düzeye çıkarmasını sağlar; endüstri sürekli fiyatlandırma ve NDC'ye doğru kayarken, eski rezervasyon sınıfları terk edilse bile talebi kısıtsız hale getirme ve dinamik tüketici davranışını modelleme ihtiyacı teklif yönetiminin çekirdeğinde kalmaya devam eder.](/decks/nominal-load-factor/07.webp "Sağdaki son cümleyi oku: rezervasyon sınıfları kalksa bile dolu uçak yine sansürlü veri üretir. Bu problem mimari değişince kaybolmuyor.")

Not kutusundaki son cümle, NDC ve teklif yönetimi bölümleriyle bu bölümü
birbirine bağlıyor. Endüstri sürekli fiyatlandırmaya ve NDC'ye kaysa,
rezervasyon sınıfları terk edilse bile talebi kısıtsız hale getirme ve
tüketici davranışını modelleme ihtiyacı teklif yönetiminin çekirdeğinde
kalıyor. Sınıf kodu kaybolsa da dolu uçak yine kaçan yolcuyu kaydetmiyor.
Teklif motorunu yeniden yazan bir ekip, detruncation ve geri kazanım
hesabını eski sistemin bir kalıntısı sanıp dışarıda bırakırsa, fiyatı yeni
mimariyle ama talebi eski hatayla hesaplar.

## Yarın işe yarayacak dört çıkarım

1. **Dağılımı kabine değil CV'ye göre seç.** Ekonomi için normal dağılım
   varsayımı çoğu zaman yeterli; First Class için değil. Her tahmin
   biriminin varyasyon katsayısını ölç: CV 1 civarındaysa negatif
   eksponansiyel, 1'den küçükse Erlang, Gamma ya da kesikli veride Compound
   Poisson, 1'den büyükse iki aşamalı Coxian. Hangi dağılımın seçildiğini
   tahminle birlikte kaydet.
2. **Taşan yolcuyu kayıp hanesine yazmadan önce nereye gittiğine bak.**
   Geri kazanımı pazar payıyla değil tüketici seçim modeliyle tahmin et;
   09:00'dan taşan yolcunun 11:00'ı alma olasılığı, pazar payının söylediği
   ortalamadan farklı. Bu olasılıkları, taşan yolcuyu kendi ağındaki en
   uygun alternatif uçuşa yönlendirecek algoritmalara girdi yap.
3. **Kapanma oranını ölç, taşma oranını ondan türet.** Uçuş kapanma
   oranını izle ve hangi doluluk seviyelerinde talebin geri çevrilmeye
   başladığını taşma oranıyla analiz et. Kapasite planlamasını bu veriye
   göre revize et; gözlemlenen doluluk tek başına bu soruyu cevaplamaz.
4. **Nominal talep düzeltmesini otomatik ve grup düzeyinde çalıştır.**
   Gözlemlenen ve tahmin edilen doluluk arasındaki farkı sürekli denetleyen
   iteratif düzeltmeyi gece batch'ine koy; bir tolerans, bir tavan tur sayısı
   ve yakınsamayan uçuşlar için bir işaret tanımla. Uçuş grubu içindeki geri
   kazanımı toplamdan düşmeden grup talebini raporlama; aksi halde aynı
   yolcu iki kez sayılır.

Bu bölümde ne yok: taşma modelinin koltuk koruma ve fazla satış kararına
nasıl bağlandığı (gelir yönetimi ve envanter bölümleri), bacak bazlı
kontrolden köken-varış kontrolüne geçişin arka planı ("Gelir yönetimi ve
stratejik operasyonlar: PEOPLExpress ve American Airlines analizi") ve
talebin zaman boyunca nasıl tahmin edildiği (talep tahmini bölümleri). Bu
bölüm o hesapların hepsine giren tek rakamın, gerçek talebin, dolu bir
uçaktan nasıl geri çıkarıldığını anlatmak için var.
