---
title: "Havacılıkta veri odaklı iş mantığı ve karar destek sistemleri"
domain: "aviation"
summary: "Alışveriş verisi havacılıkta beş ayrı karar sistemini besliyor: acentenin ek komisyon hedefi, net ücretin kâr marjı, bileti şimdi mi sonra mı alma tavsiyesi, O&D talep tahmini ve envanter kontrolü. Bu bölüm o sistemlerin iş kurallarını, robotik aramaların veriyi neden kirlettiğini ve aynı tavsiyenin kanala göre neden ters sonuç verdiğini anlatıyor."
audience: "Talep tahmini, fiyat tahmini, acente tarafı sıralama ya da GDS veri ürünleriyle çalışan, bu sistemlerin hangi veriyle hangi kararı verdiğini anlamak isteyen yazılımcı ve ürün insanı. Talep tahmini bölümlerinin okunmuş olması işe yarar; override komisyon, display bias, robotik arama, Q-learning, QSI ve CCM metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki talep tahmini bölümleri tek bir soruyla uğraşıyordu: uçağın
kapasitesini aşan talep ne kadar, ve kaybolan yolcu nasıl hesaplanır. O
soruların hepsi rezervasyon verisinden başlıyordu; satılmış koltuktan
geriye doğru talep tahmin ediliyordu. Bu bölüm başka bir veri setine
bakıyor: satılmamış olanlara. Bir yolcunun bilet almadan önce yaptığı
aramalar, yani alışveriş verisi (shopping data), rezervasyonun göremediği
şeyi görüyor: hangi fiyatı, hangi saati, hangi aktarmayı görüp
vazgeçtiğini. **Alışveriş verisi, havacılıkta beş ayrı karar sistemini
besleyen ortak ham madde; ama temizlenmeden kullanıldığında beşini birden
yanıltıyor.** Bu bölüm o beş sistemi, her birinin iş kuralını ve ortak
kirliliğin kaynağını anlatıyor.

Beş sistem şunlar: acentenin havayoluyla yaptığı ek komisyon
sözleşmelerinin optimizasyonu, büyük seyahat yönetim şirketlerinin net
ücret üzerine koyduğu kâr marjı, bilet fiyatının yönünü tahmin eden ve
yolcuya "al" ya da "bekle" diyen tavsiye motoru, köken-varış (O&D) bazlı
talep tahmini ve bu tahmini kullanan envanter kontrolü. İlk üçü acente
tarafında, son ikisi havayolu tarafında çalışıyor. Hepsinin ortak
noktası, geçmişe değil geleceğe dair bir tahmin istemeleri.

## Komisyon hedefi geçmiş satıştan değil gelecek talepten okunur

Havayolları acentelerle temel komisyonun üstüne ek bir teşvik anlaşması
yapar: belirli bir hacme ya da pazar payına ulaşan acente, ek komisyon
(override commission) kazanır. Acente açısından soru şu: gelecek dönem
için hangi havayoluyla, hangi hedefi kabul etmeli?

Alışılmış cevap geçmiş satış verisine bakmak. Geçen yıl bu rotada şu kadar
bilet satılmışsa bu yıl da benzeri satılır. Kaynak metin bunun yetmediğini
söylüyor: sistem geçmiş verinin ötesine geçip gelecek dönemin talep
tahminlerini girdi olarak almalı. Hangi rotada ya da hangi zaman
diliminde komisyon hedefine ulaşılabileceği, geçen yılın satışından değil
gelecek dönemin talep sinyalinden çıkıyor. Bir rotaya yeni bir rakip
girdiyse, ya da talep bir sezondan ötekine kaydıysa, geçmiş satış bunu
göstermiyor; alışveriş verisindeki arama hacmi gösteriyor.

Yazılım tarafında bunun karşılığı şu: komisyon sözleşmesi analizi bir
raporlama işi değil, bir tahmin işi. Geçmiş satışları toplayıp gösteren
bir pano bu kararı desteklemiyor; talep tahmini modelinin çıktısını
sözleşme hedefiyle karşılaştıran bir hesap destekliyor.

## Sıralama, acentenin komisyonuna hizmet edecek şekilde bükülebilir

Ek komisyonun ikinci yüzü ekranda. Acente bir arama sonucunu listelerken
uçuşları yalnızca fiyata göre sıralamak zorunda değil. Kaynak metin,
algoritmanın acenteye en yüksek ek komisyonu kazandıracak havayollarını
ya da uçuşları öne çıkaran yanlı bir sıralama (display bias) yapabileceğini
söylüyor.

Bu, dağıtım bölümlerinde anlatılan ekran yanlılığının acente tarafındaki
karşılığı. Bir zamanlar rezervasyon sistemini işleten havayolu kendi
uçuşlarını listenin başına koyuyordu; burada sıralamayı acentenin
komisyon sözleşmesi belirliyor. İş mantığı açısından fark şu: sıralama
kuralı artık bir sabit değil, sözleşme hedefine olan mesafenin bir
fonksiyonu. Hedefine yaklaşmış bir havayolunun uçuşları, hedefi zaten
tutturulmuş olanınkinden daha değerli.

Yazılım tarafında bu, sıralama servisinin komisyon sözleşme verisine
bağımlı olması demek. Fiyat ve süreye göre sıralayan bir arama sonucu
servisi, bu kuralı eklemek için sözleşme durumunu bilen bir girdiye
ihtiyaç duyuyor. O girdi de bir önceki bölümdeki tahminden besleniyor:
hangi hedefin tutacağını bilmeden hangi uçuşun öne çıkacağı bilinmiyor.

## Robotik aramalar ayıklanmadan alışveriş verisi tahmine girmez

Alışveriş verisinin büyük bir sorunu var: aramaların hepsi insan değil.
Otomatik süreçler, gerçek bir yolcunun yapmayacağı sıklıkta ve hızda
arama yapabiliyor. Bu aramalar talep tahminine girerse, kimsenin
uçmak istemediği bir rotada yüksek talep varmış gibi görünüyor.

Kaynak metin ayrıştırmayı örüntü algılama modellerine bırakıyor. Bu
modeller arama sıklığına, kullanıcı davranışına ve veri talep hızına
bakıp her kayda "robotik" ya da "organik" bayrağı atıyor. Önemli olan
kayıtların silinmemesi, işaretlenmesi. Aynı veri seti farklı müşterilere
farklı amaçla gidiyor ve her müşteri robotik trafiği farklı kullanıyor.

Bayrağın ticari değeri de burada. Kaynak metin, robotik aramaların
bayraklanmasının, tahmin amacıyla bu verileri hariç tutan müşteriler için
GDS veri ürünlerini daha değerli kıldığını söylüyor. Tahmin modeli kuran
bir müşteri robotik aramaları analiz dışında tutmak istiyor; temizlenmiş
veri tahminsel modellemenin doğruluğunu artırıyor. Aynı bayrak başka bir
işe de yarıyor: robotik trafiğin nereye yoğunlaştığını görmek, önbellekleme
fırsatlarını belirlemeye yardım ediyor. Aynı soruyu tekrar tekrar soran
bir robot, cevabın önbellekten verilebileceği bir yer gösteriyor.

Yazılım tarafında çıkarım açık. Robotik bayrağı, alışveriş verisini
tüketen her sistemin önündeki bir ön işleme adımı. Filtre tüketicide
değil üreticide durmalı; yoksa beş sistem aynı ayrıştırmayı beş ayrı
şekilde yapar ve beş ayrı talep sayısı üretir. Bayrak bir silme işlemi
değil bir nitelik olduğu için, robotik trafiği isteyen tüketici (örneğin
önbellek planlaması) de aynı kaynaktan besleniyor.

## Net ücretin marjı alışveriş verisindeki pazar fırsatından çıkıyor

Büyük seyahat yönetim şirketleri (TMC) havayollarıyla net ücret pazarlığı
yapıyor: havayolu belirli bir fiyatı komisyonsuz, net tutar olarak
veriyor, üzerine ne kadar ekleneceğine TMC karar veriyor. Soru, o farkın
ne kadar olacağı.

Kaynak metnin cevabı yine alışveriş verisi. Pazarlık edilmiş net ücretin
müşteriye ne kadar farkla satılacağını belirlemek için alışveriş verisi
üzerinden bir pazar fırsatı tahmini yapılmalı. Aynı pazarda yolcuların
hangi fiyatları gördüğü, hangi fiyatta arayıp hangi fiyatta vazgeçtiği,
marjın üst sınırını belirliyor. Net ücret, alt sınır; alışveriş verisi,
pazarın kaldırabileceği üst sınır.

Bu da robotik ayrıştırmanın neden önce geldiğini gösteriyor. Robotların
şişirdiği bir arama hacmi, olmayan bir pazar fırsatını gösterir ve marjı
pazarın kaldıramayacağı bir seviyeye çeker.

## Aynı fiyat tahmini kanala göre ters tavsiyeye dönüşür

Dördüncü sistem bilet fiyatının yönünü tahmin ediyor: bu uçuşun fiyatı
önümüzdeki günlerde yükselecek mi düşecek mi? Kaynak metin, alışveriş
verisinin pekiştirmeli öğrenmenin özel bir durumu olan Q-learning modeliyle
kalibre edilerek fiyat hareketlerinin öngörülebileceğini söylüyor.
Q-learning, bir ajanın her durumda hangi eylemin uzun vadede daha iyi
sonuç verdiğini deneyerek öğrendiği bir yöntem; burada eylemler "şimdi al"
ve "bekle".

İlginç kısım modelin kendisi değil, çıktısının nasıl kullanıldığı. Model
"fiyat düşecek" dese bile "bekle" tavsiyesi her kanalda aynı sonucu
vermiyor. Kaynak metin, OTA'ların tipik olarak yalnızca "satın al"
önerisini kullandığını, çünkü uçak bileti fiyatlarının yükselme eğiliminde
olduğunu söylüyor. Asıl gerekçe ise sadakat. Online seyahat acentesinin
(OTA) müşterisi zayıf bağlı; ona "bekle" denirse fiyat düşüşünü başka bir
sitede bekliyor ve bileti orada alıyor. OTA için "bekle" demek, satışı
rakibe bırakmak.

Yönetilen seyahat (managed travel) kanalında durum tersine dönüyor.
Kurumsal acentenin müşterisi bir esir kitle (captive audience): şirketin
seyahat politikası gereği o kanaldan bilet almak zorunda. Ona "bekle"
denirse başka yere gitmiyor, bekliyor. Maliyet tasarrufu hedefi olan bir
kurumsal müşteri de bu tavsiyeye uyma eğiliminde. Aynı fiyat tahmini,
bir kanalda satış kaybı, ötekinde müşteriye tasarruf üretiyor.

Yazılım tarafında bunun karşılığı, tahmin ile tavsiyenin ayrı katmanlar
olması. Fiyat tahmini modeli kanaldan bağımsız: fiyatın yönünü söylüyor.
Tavsiye katmanı ise kanal tipine göre farklı yapılandırılıyor; kaynak metin
fiyat tahmin araçlarının kurumsal ve bireysel kanala göre farklı aksiyon
önerileri sunacak şekilde yapılandırılması gerektiğini söylüyor. İkisini
tek bir servise gömmek, OTA'ya "bekle" diyen bir sistem kurmak demek.

## Talebi fiyat ve tarife belirliyor, bu yüzden tahmin onları görmeli

Beşinci sistem havayolu tarafında: köken-varış bazlı talep tahmini. Kaynak
metin buradaki temel iddiayı açıkça koyuyor: fiyat ve uçuş programı, bir
kalkış ile varış noktası arasındaki talebin en büyük belirleyicileri. Bu
cümle, talep tahmininde alışveriş verisinin neden kritik olduğunu
açıklıyor. Geleneksel tahmin rezervasyon geçmişine bakıyor; rezervasyon
geçmişi ise yolcunun hangi seçeneği gördüğünü, hangi fiyatı reddettiğini
bilmiyor. Alışveriş verisi biliyor.

Bu iddianın bir sonucu var: tahmin modeli fiyatı ve tarifeyi bir girdi
olarak görmeli, yalnızca sonucunu değil. Rakip havayolu fiyatını
düşürdüğünde ya da bir rotaya yeni bir sefer koyduğunda, bir havayolunun
talebi değişiyor; bunu rakibin fiyatını ve tarifesini görmeyen bir model
yakalayamıyor. Kaynak metin bu yüzden geleneksel tahmin tekniklerinden
vazgeçilip rakip fiyatlarını, uçuş programlarını ve müşteri seçim
modellerini içeren "üçüncü nesil" tahmin yöntemlerine geçilmesini
öneriyor.

## Yolcunun seçimi fiyattan fazlasıyla modellenir

Üçüncü nesil tahminin çekirdeği müşteri seçim modeli (CCM, consumer choice
model). Soru şu: belirli bir pazarda yolcuya birkaç uçuş seçeneği
sunulduğunda, belirli bir seçeneği seçme olasılığı ne?

Kaynak metin, sistemin bu olasılığı birkaç faktörü "algılanan değer"
üzerinden modelleyerek hesapladığını söylüyor: fiyat, kalkış saati, toplam
seyahat süresi, aktarma sayısı, uçak tipi (jet mi, bölgesel jet mi) ve
havayolu tercihi. Her seçenek bu faktörlerin bir bileşimi; yolcu da en
yüksek algılanan değeri veren seçeneğe yöneliyor. Ucuz ama iki aktarmalı
bir seçenek, biraz pahalı ama direkt bir seçeneğe kaybedebiliyor.

Bu yaklaşımın daha eski bir akrabası var: hizmet kalitesi endeksi (QSI,
quality of service index). Kaynak metin ikisini şöyle ayırıyor: QSI her
tercihe istatistiksel ağırlıklar atayan daha basit ve doğrusal bir model;
CCM ise daha karmaşık ayrık seçim modellerini (discrete choice models)
kullanarak pazar payı ve talep tahmini yapıyor. Doğrusal modelde her
faktörün katkısı toplanıyor; ayrık seçim modelinde yolcunun seçenekler
arasındaki seçimi olasılıksal olarak modelleniyor.

Yazılım tarafında fark şurada hissediliyor. QSI bir ağırlık tablosuyla
hesaplanabiliyor; ağırlık değiştiğinde sonuç doğrusal olarak değişiyor ve
açıklaması kolay. CCM'in girdisi ise pazardaki bütün seçeneklerin kümesi:
bir havayolunun bir uçuşu için talep hesaplamak, o pazardaki rakip
uçuşların da o anki fiyatını ve tarifesini bilmeyi gerektiriyor. Model
uçuş başına değil, pazar başına çalışıyor.

## Üst satışı görmeyen envanter kontrolü geliri seyreltir

Seçim modelinin son ve en doğrudan sonucu envanter tarafında. Yolcunun
seçimi yalnızca havayolları ya da uçuşlar arasında değil, aynı uçuştaki
ücret sınıfları arasında da oluyor. İstediği ucuz sınıf kapalıysa bir
yolcu başka havayoluna gidebilir, ama bir kısmı aynı uçuşun daha pahalı
sınıfına geçer. Buna üst satış (upsell) deniyor.

Kaynak metin bunun envanter kontrolüne etkisini tek cümleyle koyuyor: üst
satış olasılıkları dikkate alınmazsa envanter kontrolleri daha az agresif
olur ve bu da gelir seyrelmesine (revenue dilution) yol açar. Mekanizma
şu: sistem ucuz sınıfı kapattığında o yolcunun tamamen kaybolacağını
varsayarsa, kapatmanın maliyetini olduğundan yüksek görür ve ucuz sınıfı
açık tutar. Oysa yolcuların bir kısmı pahalı sınıfa geçecekti. Açık
tutulan ucuz sınıf, daha fazla ödemeye hazır yolcuya daha az ücretle
satış yapıyor; gelir seyrelmesi tam olarak bu.

Bu cümle gelir yönetimi ile ağ optimizasyonu arasındaki bağı da gösteriyor.
Talep tahmini ile envanter kontrolü ayrı sistemler olarak kurulabilir, ama
tahmin yolcunun seçim davranışını envantere aktarmıyorsa, envanter doğru
tahminle yanlış karar veriyor. Spill bölümlerinde kapasiteyi aşan talebin
nereye gittiği sorulmuştu; burada aynı sorunun sınıf düzeyindeki hali
var: kapatılan sınıfın talebi kaybolmuyor, bir kısmı üst sınıfa taşınıyor.

Yazılım tarafında bu, tahmin çıktısının şeklini değiştiriyor. Sınıf başına
bağımsız bir talep sayısı, üst satışı taşıyamıyor. Envanter kontrolünün
ihtiyacı, bir sınıf kapandığında o talebin hangi oranla hangi sınıfa
geçtiğini de söyleyen bir çıktı. Tahmin servisi ile envanter servisi
arasındaki arayüz, sınıf başına tek sayıdan daha zengin olmak zorunda.

## Yarın işe yarayacak dört çıkarım

1. **Komisyon hedefini talep sinyaliyle revize et.** Havayolu
   sözleşmelerindeki ek komisyon hedeflerini yalnızca geçmiş satışa
   bakarak değil, gelecek dönemin talep sinyallerini analiz ederek belirle.
   Hedefin tutup tutmayacağı geçen yılın satışında değil, bu yılın
   aramalarında görünüyor.
2. **Tavsiye motorunu kanala göre yapılandır.** Fiyat tahmini aracını
   kurumsal ve bireysel kanalda farklı aksiyon önerileri sunacak şekilde
   kur. Esir kitleye "bekle" demek tasarruf, sadakati zayıf OTA müşterisine
   "bekle" demek satışı rakibe bırakmak.
3. **Alışveriş verisini tahmine girmeden önce ayıkla.** Tahmin modellerine
   giren alışveriş verisini robotik aramalar için ön filtrelemeden geçir.
   Bayrağı silme değil işaretleme olarak uygula; robotik trafik önbellek
   planlaması için ayrıca değerli.
4. **Üçüncü nesil tahmine geç.** Geleneksel tahmin tekniklerini, rakip
   fiyatlarını, uçuş programlarını ve müşteri seçim modellerini (CCM)
   içeren yöntemlerle değiştir. Envanter kontrolüne üst satış olasılığını
   taşımayan bir tahmin, doğru talebi görse bile geliri seyreltir.

Bu bölümde ne yok: kapasiteyi aşan talebin nasıl hesaplandığı (spill
bölümleri), ekran yanlılığının tarihi ve 1984 kuralları ("Havacılık
rezervasyon ve küresel dağıtım sistemleri (GDS) analizi: stratejik gelişim
ve iş mantığı"), ek komisyon ve acente gelir modellerinin geniş resmi
("Seyahat dağıtım ekosistemi ve yeni dağıtım yeteneği (NDC) analizi"). Bu
bölüm o sistemlerin hepsinin aynı ham maddeyi, alışveriş verisini, nasıl
farklı kararlara çevirdiğini anlatmak için var.
