---
title: "İki aşamalı Cox dağılımıyla spill ölçümü"
domain: "aviation"
summary: "Satış sistemi kapıdan dönen yolcuyu görmüyor; iki aşamalı Cox dağılımı onu geçmiş talebin ortalaması ve standart sapmasından geri kuruyor. Bölüm, moment eşleştirmeyle parametrelerin nasıl türetildiğini, uçuş kapanma olasılığı, beklenen spill ve spill oranının aynı kuyruk alanından nasıl çıktığını ve bu sayıların uçak tipi ile envanter kararına nasıl bağlandığını anlatıyor."
audience: "Gelir yönetimi, envanter ya da teklif yönetimi tarafında spill hesabı üreten veya tüketen yazılımcı ve analist. Önceki bölüm (Yüksek varyanslı talep ve iki aşamalı Cox dağılımı) dağılımın yapısını anlatıyor, okunmuş olması işe yarar; moment eşleştirme, a kalibrasyon sabiti, uçuş kapanma oranı, beklenen spill, spill oranı ve spoilage metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölüm iki aşamalı Cox dağılımının neden gerektiğini ve nasıl
kurulduğunu anlattı: birinci sınıf talebi negatif üstel dağılımın
taşıyamayacağı kadar oynak, iki üstel fazdan kurulan bir model bu
oynaklığı yakalıyor. Bu bölüm dağılımın öbür ucuna, çıktısına bakıyor.
Model kurulduktan sonra ondan hangi sayılar okunuyor, o sayılar hangi
girdilerden türetiliyor ve hangi kararı besliyor? **Spill'i doğrudan
ölçemezsin; yalnızca geçmiş talebin iki momentinden bir dağılım kurup o
dağılımın kapasitenin ötesinde kalan alanını hesaplayabilirsin. Yani spill
bir gözlem değil, bir modelin çıktısı, ve modelin girdileri kadar
doğru.**

![Sunumun kapak slaytı. Solda iki çan eğrisi yan yana duruyor; sağdaki eğrinin kuyruğu uzayıp bir yolcu uçağının gövde çizgisine dönüşüyor. Başlık: Gelir Yönetiminde İki Aşamalı Cox Dağılımı. Alt başlık: Talep Taşma (Spill) Modellerinin Optimizasyonu ve Kapasite Analizi. Üst yazı: temel ücretlendirmede matematiksel modelleme yaklaşımları. Altta uzman notu: gelir yönetimi ve envanter kontrolü bağlamında optimizasyon motoru, uçağın sınırsız kapasitesi olsaydı kaç kişinin uçacağını (kısıtlanmamış talep) tahmin etmek için bu modeli kullanır; envanter ve teklif yönetimi akışlarını doğrudan etkiler.](/decks/coxian-spill/01.webp "Eğrinin kuyruğu uçağa dönüşüyor: modelin ilgilendiği kısım dağılımın tepesi değil, gövdeye sığmayan uç.")

## Satış sistemi reddettiği talebi hiç görmüyor

Spill tanımı basit: havayolu talebi (D) uçağın fiziksel kapasitesini (c)
aştığında, kapasite yetersizliği yüzünden bilet alamayan potansiyel
yolcular taşan talebi oluşturuyor. Zor olan tanım değil, ölçüm. Sunumun
sistem notu mekanizmayı somut koyuyor: yolcu hizmet sistemi (PSS)
kapasite sıfıra indiğinde satışı durduruyor, EDIFACT ya da XML
mesajları kesiliyor. O andan sonra gelen talep hiçbir sisteme istek
olarak düşmüyor. Sistemler yalnızca gerçekleşen satışı görüyor;
reddedilen talep kayıt bırakmıyor.

![Başlık: Kapasite Sınırları ve Taşma Etkisi. Solda bir uçak gövdesinin kesiti; soldan tek sıra halinde gelen koyu mavi noktalar gövdeyi c harfiyle işaretli bir koltuk bloğu olarak dolduruyor, sağ kenardan turuncu noktalar dökülüyor ve Taşma (Spill) etiketi taşıyor. Sağda dört kutu: havayolu talebi (D) genellikle uçağın fiziksel kapasitesini (c) aşar; kapasite yetersizliğinden dolayı bilet alamayan potansiyel yolcular taşma oluşturur; sistemler yalnızca gerçekleşen satışları görür, reddedilen görünmez talebi ölçemez; çözüm olarak iki aşamalı Cox dağılımı bu kayıp talebi geçmiş verilere dayanarak matematiksel olarak yeniden inşa eder. Alttaki uzman notu: yolcu hizmet sistemleri (PSS) kapasite 0 olduğunda satışı durdurur (EDIFACT/XML mesajları kesilir); RM tahmin motoru reddedilen bu görünmez talebi istatistiksel dağılımlar kullanarak hesaplar. Zıt kavram: spoilage (boş koltukla uçma).](/decks/coxian-spill/02.webp "Turuncu noktalar hiçbir log dosyasına yazılmıyor. Onları sayan tek şey, mavi noktalardan geriye doğru kurulan bir dağılım.")

Aynı slayt zıt kavramı da hatırlatıyor: spoilage, yani boş koltukla
uçmak. Kapasite kararı bu iki kaybın arasında duruyor. Spoilage
görünür, çünkü boş koltuk manifestoda sayılıyor. Spill görünmez. Bu
asimetrinin mühendislik sonucu açık: raporlama katmanı yalnızca olay
verisinden besleniyorsa, iki kaybın biri her zaman eksik görünür ve
karar tek yöne kayar. Yazılım tarafında bunun karşılığı şu: spill,
envanter olaylarından türetilen bir metrik değil, tahmin motorunun
ürettiği ayrı bir veri ürünü olarak tasarlanmalı ve raporda spoilage'ın
yanında, aynı ağırlıkla durmalı.

## Moment eşleştirme iki sayıyı modele çeviriyor

Görünmeyen talebi geri kurmak için elde iki sayı var: geçmiş talebin
örneklem ortalaması (μ) ve standart sapması (σ). İkisinden türeyen
üçüncü sayı varyasyon katsayısı (CV), standart sapmanın ortalamaya
oranı. Kaynak metin parametrelerin bu verilerden moment eşleştirme
(matching moments) yöntemiyle türetildiğini söylüyor: modelin ortalaması
ve varyansı, geçmiş verinin ortalaması ve varyansına eşitlenecek
şekilde aşama parametreleri γ1 ve γ2 hesaplanıyor. Böylece teorik
dağılım eldeki tarihsel talep verisiyle istatistiksel olarak tutarlı
kalıyor.

Denklemde bir serbestlik daha var ve o, a adında bir kalibrasyon
sabitiyle kapatılıyor. Kaynak iki kural koyuyor. Birincisi bir sınır:
a, CV'ye doğrudan bağlı ve a < 2/(1+CV²) koşulunu sağlamak zorunda.
İkincisi bir başlangıç değeri: geçmiş çalışmalar ve kalibrasyon
süreçleri, pratikte a = 0,1'in etkili bir başlangıç noktası olduğunu
gösteriyor.

![Başlık: Modelin Kalibrasyonu, Moment Eşleştirme Yöntemi. Soldan sağa üç kutu ve aralarında oklar. Girdiler (Geçmiş Veri): μ örneklem ortalaması, σ standart sapma, CV varyans katsayısı. Ok üzerinde Moment Eşleştirme (Matching Moments) yazıyor. Ortadaki kutu, Matematiksel Sabitler: empirik kalibrasyon sabiti a eşittir 0.1; sınır koşulu a küçüktür 2 bölü (1 artı CV kare). Sağdaki kutu, Çıktılar (Cox Parametreleri): γ1 aşama 1 parametresi, γ2 aşama 2 parametresi. Altta kritik içgörü: geçmiş verilerdeki ortalama ve varyans kullanılarak parametreler doğrudan türetilir ve dağılım modeli ilgili uçuşa özel hale getirilir. Uzman notu, mühendislik perspektifi: moment eşleştirme, motorların her gece milyonlarca O&D kombinasyonuna eğri uydurması için çok verimli bir hesaplama yöntemidir; sabit bir kalibrasyon değeri (a eşittir 0.1) kullanmak, devasa işlem süresi tasarrufu sağlayarak toplu veri işleme süreçlerini hızlandırır.](/decks/coxian-spill/03.webp "Ortadaki kutu bir tasarım kararı: a sabitlenince her O&D için yalnızca iki sayı hesaplanıyor, eğri uydurma bir arama değil bir formül oluyor.")

Sınırın pratik anlamı, CV büyüdükçe a için izin verilen aralığın
daralması. CV bir iken üst sınır bir; CV 1,40 iken 2/(1+1,96), yani
yaklaşık 0,68. Oynaklık arttıkça a'nın seçilebileceği bölge küçülüyor.
a = 0,1 bu sınırın altında epey geniş bir pay bırakıyor, bu yüzden
yüksek CV'li uçuşlarda da geçerli bir başlangıç.

Sunumun mühendislik notu bu tercihin maliyet tarafını söylüyor: moment
eşleştirme, bir tahmin motorunun her gece milyonlarca O&D
kombinasyonuna eğri uydurması için çok verimli bir yöntem, ve sabit bir
a değeri toplu işlemde ciddi süre kazandırıyor. Yöntem iteratif bir
optimizasyon değil; ortalama ve varyans okunuyor, parametreler kapalı
formda çıkıyor. Yazılım tarafında bunun karşılığı, kalibrasyonun gece
koşan bir batch işinde her O&D için sabit maliyetli bir adım olması.
Bedeli de burada: sabit a bir varsayım ve her satır için doğrulanmıyor.
Sınır koşulu ise bir doğrulama kuralı olarak koda girmeli. CV'si
a = 0,1'i geçersiz kılacak kadar büyük bir satır geldiğinde motor
sessizce anlamsız bir γ üretmemeli, satırı işaretlemeli.

## Üç metrik aynı kuyruk alanının üç okuması

Parametreler hazır olduğunda dağılımdan üç sayı okunuyor, üçü de
kapasitenin ötesindeki kuyruğa bakıyor.

Birincisi uçuş kapanma oranı (flight closing rate): talebin kapasiteyi
aşma olasılığı, Pr(D > c). Cox dağılımının yoğunluğu iki üstel terimin
toplamı olduğu için bu olasılık da kapalı formda çıkıyor: A·e^(−γ1·c)/γ1
artı B·e^(−γ2·c)/γ2. Bu sayı uçağın satışa kapanma sıklığını, yani
dolma hızını anlatıyor.

İkincisi beklenen spill: kapasite yetersizliği yüzünden reddedilmesi
beklenen ortalama yolcu sayısı. Tanım olarak, kapasitenin ötesindeki
her x için talebin x'i aşma olasılığının c'den sonsuza integrali.
Aynı üstel yapı sayesinde bu da kapalı formda kalıyor: paydalar kareye
çıkıyor, A·e^(−γ1·c)/γ1² artı B·e^(−γ2·c)/γ2². Kaynak metin bu
hesabın operasyon ekibine uçağın ne kadar küçük kaldığına dair somut
bir veri verdiğini söylüyor.

Üçüncüsü spill oranı: beklenen spill'in ortalama talebe (μ) bölümü,
yani toplam talebe oranla kaçırılan yolcu yüzdesi.

![Başlık: Cox Dağılımı ile Hesaplanabilen Temel Taşma Metrikleri. Üç sütun. Uçuş Kapanma Oranı: talebin (D) uçağın kapasitesini (c) aşma olasılığıdır; formül Pr(D büyüktür c) eşittir A çarpı e üzeri eksi γ1 c bölü γ1 artı B çarpı e üzeri eksi γ2 c bölü γ2. Beklenen Taşma: kapasite yetersizliğinden dolayı reddedilmesi beklenen ortalama yolcu sayısıdır; formül Expected Spill eşittir A çarpı e üzeri eksi γ1 c bölü γ1 kare artı B çarpı e üzeri eksi γ2 c bölü γ2 kare. Taşma Oranı: beklenen taşmanın ortalama talebe (μ) bölünmesiyle elde edilen yüzdelik orandır; Spill Rate eşittir Expected Spill bölü μ. Uzman notu, sistem akışları: bu metrikler doğrudan EMSR (Beklenen Marjinal Koltuk Geliri) hesaplamalarını besler; beklenen taşma yüksekse sistem düşük getirili bilet sınıflarını erkenden kapatır. Gelişmiş O&D ağ sistemlerinde c, fiziksel kabinden ziyade sanal ağ kapasite sınırlarını temsil edebilir.](/decks/coxian-spill/04.webp "İlk iki formül arasındaki tek fark paydadaki üs. Aynı A, B, γ1 ve γ2 bir kez hesaplanıyor, üç metrik ondan ucuza çıkıyor.")

Üç metriğin ayrımı rapor tasarımında önemli, çünkü farklı soruları
cevaplıyorlar. Kapanma oranı bir sıklık: bu uçuş kaç günde bir doluyor?
Beklenen spill bir miktar: dolduğunda kaç kişi dışarıda kalıyor?
Spill oranı bir oran: talebin ne kadarını kaçırıyoruz? Sık kapanan ama
az yolcu kaçıran bir uçuşla nadiren kapanan ama kapandığında çok yolcu
kaçıran bir uçuş aynı spill oranını üretebilir; kapasite ve fiyat
açısından ise farklı sorunlardır.

Sunumun sistem notu bu metriklerin nereye aktığını da söylüyor: doğrudan
EMSR (beklenen marjinal koltuk geliri) hesabına. Beklenen spill yüksekse
sistem düşük getirili bilet sınıflarını erkenden kapatıyor. Kaynak metin
aynı mantığı kapanma oranı için kuruyor: kapanma oranı öngörülenin
üzerindeyse sistem baz ücreti artırma ya da envanteri kısıtlama kararı
alabiliyor. Bir not daha var: gelişmiş O&D ağ sistemlerinde c fiziksel
kabin değil, sanal bir ağ kapasite sınırı olabiliyor. Yazılım tarafında
bunun karşılığı, spill fonksiyonunun imzasında c'nin koltuk sayısı olarak
değil soyut bir kapasite değeri olarak durması. Aynı fonksiyon bir bacak
kabini için de, bir O&D'ye ayrılmış sanal kapasite için de çağrılabilmeli.

## Spill oranı yüksek dolulukta dikleşiyor

Spill oranıyla gözlemlenen doluluk arasındaki ilişki pozitif, ama
doğrusal değil. Kaynağın Şekil 3.8 olarak andığı grafik bunu CV 1,40 ve
yüzde 100 kapanış doluluğu (LFCF, satışa kapanan uçuşlardaki doluluk)
varsayımıyla gösteriyor: gözlemlenen doluluk arttıkça spill oranı hızla
yükseliyor. Sunumdaki çizim şekli belirginleştiriyor: eğri uzun bir süre
sıfıra yakın seyrediyor, yüzde 80 dolulukta dikleşiyor ve yüzde 100'e
doğru neredeyse dikey çıkıyor.

![Başlık: Taşma Oranının Doluluk Faktörü ile İlişkisi (Şekil 3.8 Analizi). Yatay eksen gözlemlenen doluluk oranı yüzde 0'dan yüzde 100'e, dikey eksen taşma oranı yüzde 0'dan yüzde 100'e. Eğri yüzde 60 civarına kadar sıfıra yakın düz gidiyor, yüzde 80'den sonra koyu maviden turuncuya dönerek dikleşiyor ve yüzde 100 dolulukta en üste ulaşıyor. Eğrinin ucunda not, model sabitleri: LFCF eşittir yüzde 100, CV eşittir 1.40. Sağda Yönetimsel Sonuç kutusu: gözlemlenen doluluk oranı yüzde 80'in üzerine çıktıkça taşma oranı üstel olarak artar; yüzde 100 doluluk oranları operasyonel bir başarı gibi görünse de, artan taşma oranı nedeniyle sistemin kabul edemediği ciddi bir gizli gelir kaybına (Unaccommodated Demand) işaret eder. Uzman notu, yönetim ikilemi: havayolu CEO'su yüzde 100 dolu bir uçak ister, ancak RM analisti yüzde 100 doluluğu sevmez; çünkü bu, koltukların erkenden çok ucuza satıldığı ve uçağın son dakika yüksek ücret ödeyecek kurumsal yolcuları reddettiği anlamına gelir. Matematiksel optimizasyon maksimum doluluğu değil, maksimum geliri hedefler.](/decks/coxian-spill/05.webp "Eğriyi değer okumak için değil dirsek noktası için kullan: yüzde 80'den sonra doluluktaki her puan, spill tarafında çok daha büyük bir fark demek.")

Bu çizim stilize, değer okumak için değil şekli görmek için var;
önceki bölümün tabloları aynı ilişkiyi rakamla ve farklı varsayımlarla
veriyordu. Şeklin söylediği şey ise tutarlı: kayıp, doluluğun kuyruğunda
birikiyor. Talebin ortalaması kapasiteye yaklaştıkça talebin kapasiteyi
aştığı günler hem sıklaşıyor hem de aşımın büyüklüğü artıyor; kalın
kuyruklu, yüksek CV'li talepte bu daha erken ve daha sert oluyor.

Sunumdaki yönetim notu bunun kurumsal yüzünü söylüyor. Tam dolu bir uçak
operasyonel bir başarı gibi görünüyor. Gelir yönetimi analisti ise yüzde
100 doluluğu sevmiyor, çünkü bu, koltukların erken ve ucuz satıldığı,
son dakikada yüksek ücret ödeyecek kurumsal yolcunun kapıdan döndüğü
anlamına gelebiliyor. Sunumun ifadesiyle optimizasyon en yüksek doluluğu
değil, en yüksek geliri hedefliyor. Kaynak metin buradan somut bir iş
kuralı çıkarıyor: yüksek doluluk beklenen uçuşlarda spill riskini azaltmak
için daha yüksek kapasiteli uçak ya da dinamik fiyatlandırma önerilmeli.

Mühendislik açısından bu eğrinin bir sonucu daha var: yüksek dolulukta
spill tahmini, girdilerdeki küçük hatalara karşı çok hassas. Aynı
kavisin dik bölgesinde CV ya da LFCF'deki küçük bir kayma büyük bir
spill farkına dönüşüyor. Kaynağın CV 1,40 ve üzerindeki yüksek
belirsizlikli uçuşlar için yeniden kalibrasyon önermesi bu yüzden. Tek
bir parametre setiyle çalışan bir motor, düşük dolulukta güvenilir,
yüksek dolulukta ise tam da kararın verildiği bölgede en belirsiz
sonucu üretir.

## Dağılım seçimi verinin şekline göre yapılmalı

Cox tek aday değil. Kaynak metin Li ve Oum'un 2000 tarihli çalışmasına
dayanarak nominal talebin farklı istatistiksel dağılımlar
sergileyebileceğini hatırlatıyor ve normal, lojistik ve gama
dağılımlarını alternatif olarak anıyor. Önerdiği iş kuralı nötr: verinin
çarpıklığına ve varyansına göre en düşük hata payını veren dağılım
seçilmeli. Cox'un avantajı iki aşamalı yapısının verdiği esneklik.

Sunum dört ailenin ne zaman işe yaradığını kısaca ayırıyor. Normal
dağılım en yaygın ve en basit model; simetrik, ama yüksek varyanslı
veride eksi yolcu talebi gibi anlamsız tahminler üretebiliyor. Lognormal
ve gama sağa çarpık yapılarıyla talebin sıfırın altına hiç düşmediği
durumlar için güvenilir. Lojistik dağılım normale göre daha kalın
kuyruklu, uç ve beklenmedik talepleri daha iyi yakalıyor. Cox ise
empirik veriye yüksek uyum sağlıyor ve asimetrik talep için a = 0,1
sabitiyle kalibre edilebiliyor.

![Başlık: Alternatif Talep Dağılım Modellerinin Karşılaştırması. Alt başlık: Li ve Oum (2000) çalışması baz alınarak nominal talep analizi. Dört hücreli tablo. İki Aşamalı Cox Dağılımı: empirik verilere yüksek uyum sağlar, asimetrik talepler için kalibre edilebilir (a eşittir 0.1 sabiti ile) ve modern kapasite modellemelerinde oldukça esnektir. Normal Dağılım: en yaygın ve basit modeldir; simetriktir, ancak yüksek varyanslı verilerde eksi yolcu talebi gibi mantıksız tahminler üreterek sistemi yanıltabilir. Lognormal ve Gamma Dağılımları: pozitif çarpık (right-skewed) yapıları sayesinde talebin hiçbir zaman sıfırın altına düşmediği (eksi yolcu olmayan) senaryolar için çok güvenilir alternatiflerdir. Lojistik Dağılım: kuyruk verilerinin analizinde normal dağılıma kıyasla daha kalın kuyruklu (fat-tailed) bir yapı sunarak aşırı uç, beklenmedik talepleri daha iyi yakalar. Uzman notu, evrimsel bilgi: 90'larda kurulan eski RM sistemleri işlem gücü tasarrufu için normal dağılım kullanıyordu; modern O&D sistemleri havayolu biletleme doğasına uygun olan Cox, Gamma veya Lognormal modellere geçmiştir. Bu değişim teklif yönetimi akışlarını derinden etkileyen stratejik bir IT yatırımıdır.](/decks/coxian-spill/06.webp "Normal dağılımın zaafı hücrede yazıyor: eksi yolcu. Oynak talepte simetrik bir model, olmayan yolcuyu hesaba katıyor.")

Sunumun tarihsel notu seçimin nereden geldiğini açıklıyor: 90'larda
kurulan gelir yönetimi sistemleri işlem gücünden tasarruf için normal
dağılım kullanıyordu. Modern O&D sistemleri Cox, gama ya da lognormal
modellere geçmiş durumda ve sunum bu geçişi teklif yönetimi akışlarını
derinden etkileyen stratejik bir IT yatırımı olarak niteliyor. Yani
dağılım seçimi bir istatistik tercihi olduğu kadar bir mimari miras.
Eski bir sistemin içinde normal dağılım varsayımı, adı konmadan birçok
modüle yayılmış olabiliyor.

Yazılım tarafında bunun karşılığı, dağılımın arkasında bir arayüz
durması. Spill motorunun ihtiyaç duyduğu şey sınırlı: kapasitenin
ötesindeki olasılık ve o bölgedeki beklenen aşım. Bu iki fonksiyonu
sunan her dağılım aynı yere takılabilmeli. Böylece Li ve Oum'un önerdiği
kural, yani veriye en düşük hatayla uyan dağılımı seçmek, pazar ya da
kabin bazında bir konfigürasyon kararına dönüşüyor; motoru yeniden
yazmayı gerektiren bir projeye değil.

## Yarın işe yarayacak üç çıkarım

1. **Kalibrasyonu a = 0,1 ile başlat, sınırı kodda denetle.** Talep
   tahmin modellerinde a = 0,1'i ortak başlangıç değeri yap; bu,
   modeller arasında tutarlılık sağlıyor. Ama a < 2/(1+CV²) koşulunu
   her satır için doğrula ve sınırı ihlal eden satırı işaretle, sessizce
   işleme.
2. **Spill oranı yüzde 10-20 bandını aşan rotada uçak tipini masaya
   koy.** Cox dağılımından çıkan spill oranı bu bandın üstüne çıktığında
   uçak tipi değişikliğini (equipment change) değerlendir. Beklenen spill
   yüksek, kapanma oranı öngörülenin üzerindeyse kısa vadede cevap
   envanterde: düşük getirili sınıfları erken kapat ya da baz ücreti
   yükselt.
3. **Yüksek belirsizlikli uçuşları ayrı kalibre et.** CV'si 1,40 ve
   üzerinde olan uçuşlarda spill oranlarını Şekil 3.8'deki Cox modeline
   göre yeniden kalibre et. Bu uçuşlar eğrinin dik bölgesinde duruyor;
   ortak parametre seti orada en büyük hatayı üretiyor.

Bu bölümde ne yok: iki aşamalı Cox dağılımının yapısı, faz tipi
dağılımların kökeni ve kapanış doluluğu varsayımının kayıp yolcu
tahminini nasıl katladığı "Yüksek varyanslı talep ve iki aşamalı Cox
dağılımı" bölümünde; CV ve LFCF'nin hangi veriden, hangi filtreyle
kalibre edildiği "Havacılık spill modelleri için girdi parametrelerinin
kalibrasyonu" bölümünde. Taşan yolcunun aynı havayolunun başka uçuşuna
geçmesi (recapture) ve kısıtlanmamış talebin optimizasyona nasıl
girdiği de spill bölümlerinin konusu. Bu bölüm yalnızca Cox modelinden
hangi üç sayının okunduğunu, o sayıların hangi girdilerden türediğini
ve hangi karara aktığını anlatmak için var.
