---
title: "Markalı ücret aileleri ve bağlantı mimarisi"
domain: "aviation"
summary: "Markalı ücret ailesi bagajı, koltuğu, iadeyi ve daha fazlasını tek pakette satar; ama 10 ücret seviyesi ve 3 markalı bir havayolu 30 rezervasyon sınıfına ihtiyaç duyar ve GDS'in 26 harflik alfabesine sığmaz. Bu bölüm paketin hangi niteliklerden kurulduğunu, markalar arası fiyat farkının neden bir eşitsizliğe bağlı olduğunu ve acenteye ürünün eksiksiz ulaşması için hangi mesajlaşma ve katılım seviyelerinin gerektiğini anlatıyor."
audience: "Teklif, fiyatlandırma ya da dağıtım tarafında markalı ücretlerle çalışan, alışveriş yanıtında bir markanın neden görünmediğini anlamaya çalışan yazılımcı ve ürün insanı. Ücret ürünleri ve ek hizmetler bölümlerinin okunmuş olması işe yarar; RBD, ücret temeli kodu, seyrelme (dilution) ve kanal eşitsizliği metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Ek hizmetler bölümü koltuğu, bagajı ve lounge'u ayrı ayrı satılan ürünler
olarak anlatıyordu. Markalı ücret aileleri (branded fare families) aynı
parçaları tersinden kuruyor: tek tek satmak yerine paketleyip bir ad
veriyor. Model, yolcuya sunulan hizmetleri kaynak metnin "soft qualifier"
dediği yumuşak niteliklere göre segmentlere ayırıyor; bagaj hakkı, koltuk
seçimi ve iade edilebilirlik bir paket halinde, bir marka adıyla satılıyor.
Kâğıt üzerinde bu bir ürün tasarımı kararı. **Pratikte markalı ücret, en
çok dağıtım katmanında zorlanan bir veri modeli problemi.** Paketin içini
gelir yönetimi belirliyor ama paketin acentenin ekranına eksiksiz ulaşıp
ulaşmadığını RBD alfabesi, mesajlaşma standardı ve GDS katılım seviyesi
belirliyor.

## Bir marka, sekiz niteliğin hangi değerleri aldığıyla tanımlanır

Havayolu bir markayı kurarken belirli niteliklerden (attributes) başlıyor.
Kaynak metin bunları sekiz başlıkta topluyor. Değişiklik ücretleri, seyahat
planındaki değişiklikler için uygulanan cezaları kapsıyor. İade
edilebilirlik, bileti seyahat öncesinde ya da sırasında iade etme imkânını
ve buna bağlı cezaları. Koltuk ataması, standart ya da premium koltuğun
önceden ayrılmasını. Bagaj hakkı, parça ya da ağırlık bazlı limiti.
Yükseltilebilirlik, nakit ya da mil puanıyla bir üst sınıfa geçişi. Mil
biriktirme, sadakat puanının kazanılma oranını. Lounge erişimi, havayolunun
ya da üçüncü tarafın bekleme salonuna girişi. Premium servisler de hızlı
check-in, öncelikli biniş ve limuzin transferi gibi hizmetleri.

Bu listeye bir tablo gibi değil, bir şema gibi bakmak gerekiyor. Her marka,
bu sekiz alanın her birine bir değer atanmış bir kayıt: "bagaj: bir parça",
"iade: cezalı", "lounge: yok". Yazılım tarafında bunun karşılığı şu: markayı
bir ad ve bir açıklama metni olarak modellemek yetmiyor. Marka adı
pazarlamanın, nitelik değerleri ise fiyatlandırmanın ve teşhirin konusu.
Alışveriş ekranında markaları yan yana karşılaştıran matris, ancak bu
niteliklerin her marka için yapılandırılmış veri olarak tutulduğu yerde
tutarlı kurulabiliyor. Nitelikler serbest metinde kalırsa iki kanal aynı
markayı farklı anlatır.

Hangi hizmetin hangi pakete gireceği sorusu ise bir fayda hesabı. Karar,
her ek hizmet setinin yolcu nezdindeki faydasına (utility) ve kâr
maksimizasyonuna dayanıyor. Müşterinin belirli bir özellik grubuna ödeme
istekliliği analiz ediliyor ve segmentler arası geçişi, yani yolcuyu bir üst
pakete çıkmaya (upsell) teşvik edecek kombinasyon seçiliyor. Buradaki
incelik şu: paketin amacı yalnızca bir fiyat noktası yaratmak değil,
komşu paketle arasındaki farkı yolcunun ödemeye razı olacağı bir fark
haline getirmek. Bir alt pakete yolcunun çok değer verdiği bir niteliği
koymak, üst paketin satış gerekçesini zayıflatıyor.

## Alt paketi seçen yolcu hâlâ bir müşteri

Markalı ücretin sık gözden kaçan tarafı alt pakette kalan yolcu. Düşük
değerli bir marka alan yolcu, pakete girmeyen bir hizmeti yine de satın
almak isteyebilir; en tipik örneği koltuk seçimi. Sistem bu durumda
yolcuya münferit ek hizmet satın alma opsiyonu sunuyor ve bunu ATPCO ile
IATA'nın geliştirdiği servis ücreti çözümleri üzerinden yapıyor: OB, OC ve
OA ücret tipleri.

Bunun mimari sonucu şu: markalı ücret ile tek tek satılan ek hizmet iki
ayrı ürün hattı değil, aynı niteliklerin iki farklı satış biçimi. Aynı
koltuk ataması bir markada paketin içinde, başka bir markada ayrıca
fiyatlanmış bir OC ücreti olarak duruyor. Teklif tarafında bu iki yolun aynı
nitelik tanımına bakması gerekiyor. Aksi halde "paket içinde koltuk seçimi"
ile "ayrıca satın alınan koltuk seçimi" iki farklı şey gibi davranır ve
bir sonraki bölümdeki fiyat tutarlılığı hesabı yapılamaz hale gelir.

## Üst markanın fiyatı bir eşitsizliğe bağlı

Markalar arasındaki fiyat farkı (fare differential) serbest bir pazarlama
kararı değil. Kaynak metin kuralı açık koyuyor: fiyat tutarlılığı, üst
segmentteki markanın fiyatının, alt segmentteki marka artı içine eklenen
hizmetlerin toplam fiyatından daha düşük olmasını sağlamak için gerekiyor.
Yani fiyatlandırma motoru üst markayı fiyatlarken, alt markanın baz
fiyatıyla o farkı kapatan ek hizmetlerin toplamının altında bir barem
belirlemek zorunda.

Mantık basit: yolcu alt paketi alıp eksik hizmetleri tek tek satın
alabiliyorsa, üst paket bu toplamdan pahalı olduğu anda üst paketi almak
irrasyonel hale gelir. Yolcu hizmetleri parça parça toplar, havayolu
paketlemenin getirdiği upsell'i kaybeder. Eşitsizlik korunduğunda ise paket
almak tek tek almaktan ekonomik olarak daha mantıklı oluyor. Kaynak metin
bunu seyrelmeyi (dilution) önlemenin ve yolcuyu üst pakete teşvik etmenin
koşulu olarak görüyor.

Yazılım tarafında bu eşitsizlik bir doğrulama kuralı. Üst markanın fiyatı,
alt markanın fiyatı ve aradaki hizmetlerin OC fiyatları farklı sistemlerde,
farklı ekipler tarafından ve farklı zamanlarda güncellenebiliyor. Bir koltuk
ücretindeki indirim, hiçbir marka fiyatına dokunulmadan eşitsizliği
bozabilir. Bu yüzden kontrolün tek bir fiyat değiştiğinde değil, üç
girdiden herhangi biri değiştiğinde çalışması gerekiyor. Brifing bu
kontrolün nerede koşacağını söylemiyor; söylediği, kuralın kendisinin
fiyatlandırma motorunun sorumluluğunda olduğu.

## Seyrelmeye karşı savunma satış anında yapılıyor

Eşitsizlik fiyatların statik ilişkisini koruyor; satış anındaki kontrol
ise dinamik tarafı. Sistem belirli bir zaman diliminde her kategori için
yalnızca tek bir geçerli satış fiyatı (selling fare) sunuyor. Bunun üstüne
talep analizi yaparak, üst paketlerin değerini korumak için alt paketlerin
erişilebilirliğini dinamik olarak kısıtlayabiliyor.

Bu, gelir yönetimi bölümlerinde anlatılan envanter kontrolünün markalı
ücretteki karşılığı. Klasik modelde düşük ücret sınıfı, yüksek ücretli
yolcuya koltuk saklamak için kapatılıyordu. Markalı modelde kapatılan şey
bir ücret seviyesiyle birlikte bir paket de oluyor: talep güçlüyken en alt
markayı kapatmak, yolcuyu hem daha yüksek bir fiyata hem de daha zengin bir
pakete itiyor. "Her kategori için tek satış fiyatı" kuralı da alışveriş
yanıtının belirsiz olmamasını sağlıyor; aynı markanın aynı anda iki fiyatla
görünmesi, yolcuya ucuz olanı arama sebebi veriyor.

## Otuz rezervasyon sınıfı yirmi altı harfe sığmıyor

Buraya kadar anlatılan her şey havayolunun kendi sisteminde çalışıyor.
Sorun, ürün GDS üzerinden dağıtılmaya başladığında çıkıyor. Kaynak metnin
hesabı şu: ortalama 10 ücret seviyesi ve 3 markası olan bir havayolu 30
benzersiz RBD'ye (rezervasyon sınıfı, reservation booking designator)
ihtiyaç duyuyor; bu da GDS dağıtımında kullanılan 26'lık limiti aşıyor.
RBD alfabenin bir harfi, alfabe de 26 harf. Her marka ile her ücret
seviyesinin kesişimine ayrı bir harf vermek istediğinizde harfler bitiyor.

Sonucu alışveriş yanıtında (shopping response) görülüyor: markaları ve
ücret seviyelerini gösteren matriste boşluklar oluşuyor ve havayolu bütün
ücret seviyelerini bütün kanallarda gösteremiyor. Bu, markalı ücretin ürün
olarak iyi tasarlanmış olmasının dağıtımda tek başına yetmediği yer. Paketi
ne kadar doğru kurarsanız kurun, taşıyıcı katmanın veri modeli 26 hücreyle
sınırlıysa matrisin bir kısmı acenteye hiç ulaşmıyor.

Brifing iki çözüm yolu veriyor. Birincisi, ücret temeli kodlarını (fare
basis code) istisnai bazda markalarla eşleştirmek. İkincisi, ücret temeli
kodunun son karakterini markayı tanımlayan bir standart olarak kullanmak.
İkisinde de markanın kimliği RBD harfinden alınıp ücret temeli koduna
taşınıyor; harf artık yalnızca ücret seviyesini, kodun sonu da markayı
söylüyor. Ama kaynak metin bedelini de yazıyor: bu yaklaşım, alışveriş ve
fiyatlandırma motorlarının bu kodları yorumlayabilecek kapasitede olmasını
gerektiriyor.

Yazılım tarafında bunun karşılığı açık. Bir alanın anlamını aşırı yüklüyor
ve o anlamı bir konvansiyonla başka bir alana kodluyorsunuz. Konvansiyonu
bilen motor markayı doğru çözer; bilmeyen motor ücret temeli kodunu opak
bir dize olarak görür ve markayı kaybeder. Yani çözüm havayolunun tek
başına uygulayabileceği bir değişiklik değil, zincirdeki her okuyucunun
aynı konvansiyonu tanımasına bağlı bir sözleşme. Test edilmesi gereken de
havayolunun ürettiği kod değil, karşı tarafın o kodu okuyup markayı geri
kurabildiği.

## Web sitesi ile GDS arasındaki fark kabul edilen bir boşluk

RBD limiti doğrudan bir kanal eşitsizliği (channel disparity) üretiyor:
havayolunun kendi web sitesinde görünen ürün, acentenin GDS ekranında
görünenden farklı oluyor. Brifingin iş mantığı bu farkı sıfırlamayı değil,
yönetmeyi öngörüyor. GDS satışlarında teknik limitler nedeniyle oluşan
boşluklar kabul ediliyor; web sitesinde ise daha özelleştirilmiş, bütün
markaların görüntülenebildiği bir matris sunuluyor. Tam uyum ise endüstri
standardı kodlama protokollerinin uygulanmasına bırakılmış bir hedef.

Bunu bir öncelik sırası olarak okumak mümkün: havayolunun kontrol ettiği
kanalda ürün eksiksiz, kontrol etmediği kanalda ürün taşıyıcının izin
verdiği kadar. Ürün yöneticisi için pratik anlamı, hangi markanın ve hangi
ücret seviyesinin hangi kanalda görünüp görünmediğinin bilinçli bir karar
olarak tutulması gerektiği. Matristeki boşluk bir hata değil de bir tercih
olduğunda, hangi hücrelerin feda edildiğini de biri seçmiş olmalı.

## Acente ancak havayolunun konuştuğu dili konuşursa satabilir

Markalı ürünün GDS'e bağlı bir seyahat acentesi tarafından satılabilmesi
bir de mesajlaşma meselesi. Sistem mimarisi farklı karmaşıklık
düzeylerindeki mesajlaşma standartlarını, yani teletype, EDIFACT ve XML'i
desteklemek ve acentelerden gelen istek-yanıt (request/respond) trafiğine
anlık cevap verebilmek zorunda. Havayolu hangisinin karşısına
çıkacağını seçemiyor; ürünü satacak acente hangi standardı konuşuyorsa
cevap o standartta verilmeli.

Mühendislik açısından bu, aynı ürün modelinin üç farklı ifade gücüne sahip
kanala dökülmesi demek. Zengin nitelikleri olan bir markanın her kanalda
aynı zenginlikte anlatılabileceğinin garantisi yok; kanal ne kadar dar
ise o kadar çok bilgi yol üzerinde düşüyor. Ücret temeli kodunun son
karakterine marka gömme fikri de tam olarak bu dar kanallar için var.

## O&D yatırımı, GDS katılım seviyesini de bağlıyor

Son parça bağlanabilirlik (connectivity) seviyesi. Gelir yönetiminde O&D
(origin and destination) yatırımı yapmış bir havayolu, kararını tek tek
uçuş bacaklarına değil yolculuğun tamamına göre veriyor. Bu kararın
acenteye doğru ulaşması için brifing, satış hacmini maksimize etmek
amacıyla bütün GDS'lerde en yüksek katılım seviyelerinin desteklenmesini
öneriyor: married connections, seamless sell ve seamless availability.
Kaynak metnin gerekçesi, bağlantılı uçuşların ve anlık koltuk durumunun
acentelere en şeffaf şekilde iletilmesi.

Bu üç seviye markalı ücret problemiyle aynı eksende duruyor. Brifingin
vurguladığı iki şey var: bağlantılı uçuşların acenteye bir bütün olarak
iletilmesi ve koltuk durumunun anlık görünmesi. Katılım seviyesi düşük
kalırsa, havayolunun
O&D bazında verdiği kapat-aç kararı acenteye gecikmeli ya da bacak bazında
parçalanmış olarak ulaşır. Markalı ücrette olduğu gibi burada da iyi karar
havayolunun içinde veriliyor, ama o kararın değeri taşıyıcı katmanın ne
kadarını geçirebildiğiyle sınırlı.

Böylece bölüm başladığı yere dönüyor: markalı ücret ailesi, gelir
yönetiminin paketleme kararı ile dağıtımın veri taşıma kapasitesi arasında
bir sözleşme. Paketin içeriği, fiyatlar arasındaki eşitsizlik, RBD'nin 26
harfi, ücret temeli kodunun son karakteri, mesajlaşma standardı ve katılım
seviyesi aynı sorunun farklı katmanları: yolcunun ve acentenin gördüğü
ürünün, havayolunun tasarladığı ürünle aynı olup olmadığı.

## Yarın işe yarayacak beş çıkarım

1. **Markayı nitelik değerleriyle modelle.** Değişiklik ücreti, iade,
   koltuk, bagaj, yükseltme, mil, lounge ve premium servisleri her marka
   için yapılandırılmış veri olarak tut. Marka adı pazarlamaya aittir;
   karşılaştırma matrisi ve fiyat tutarlılığı kontrolü nitelik değerlerine
   dayanır.
2. **Fiyat tutarlılığını bir doğrulama kuralı yap.** Üst markanın fiyatı,
   alt markanın fiyatı artı aradaki hizmetlerin toplamından düşük kalmalı.
   Kontrolü yalnızca marka fiyatı değiştiğinde değil, OB, OC ve OA
   üzerinden satılan tekil hizmet fiyatlarından biri değiştiğinde de
   çalıştır.
3. **RBD sayısını dağıtımdan önce hesapla.** Ücret seviyesi sayısı ile marka
   sayısının çarpımı 26'yı geçiyorsa, matriste boşluk kaçınılmazdır. Hangi
   hücrelerin GDS'te görünmeyeceğini ya da ücret temeli kodunun son
   karakteriyle markayı nasıl taşıyacağını ürünü yayına almadan karar ver.
4. **Konvansiyonu karşı taraftan test et.** Markayı ücret temeli koduna
   gömüyorsan, kabul testi havayolunun ürettiği kod değil, alışveriş ve
   fiyatlandırma motorunun o koddan markayı geri kurabilmesi olsun.
5. **Katılım seviyesini O&D yatırımıyla hizala.** O&D bazında karar veren
   bir havayolu için married connections, seamless sell ve seamless
   availability bir tercih değil, o kararın acenteye bozulmadan ulaşmasının
   koşulu. Her GDS'te en yüksek seviyeyi hedefle.

Bu bölümde ne yok: tekil ek hizmetlerin ürün ve gelir mantığı ("Havayolu
ek hizmetleri (ancillaries) ve iş mantığı analizi"), ücret ürünlerinin
sınıflandırılması ve kuralları (ücret ve fiyatlama bölümleri), GDS dışındaki
teklif modelleri ("Seyahat dağıtım ekosistemi ve yeni dağıtım yeteneği
(NDC) analizi"). Bu bölüm paketin nasıl kurulduğunu ve eski
dağıtım katmanında nerede kırıldığını anlatmak için var.
