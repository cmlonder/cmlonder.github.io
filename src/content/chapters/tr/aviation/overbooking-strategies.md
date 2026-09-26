---
title: "Havacılık ve hizmet sektöründe overbooking stratejileri ve operasyonel analiz"
domain: "aviation"
summary: "Overbooking, uçağı kapasitesinin üzerinde satarak kalkışta boş kalacak koltuğu geri kazanma işidir; ama her fazladan satılan koltuk, kapıda birini geri çevirme ihtimali taşır. Bu bölüm boş koltuk maliyeti ile yolcu reddetme maliyeti arasındaki dengeyi, bu dengeyi aşağı çeken hizmet kalitesi kısıtlarını ve aynı mantığın otelcilikte neden farklı işlediğini anlatıyor."
audience: "Envanter, rezervasyon ya da kalkış kontrol sistemleriyle çalışan ve bu sistemlerin neden kapasiteden fazla satış kabul ettiğini anlamak isteyen yazılımcı ve ürün insanı. Spill bölümlerinin okunmuş olması işe yarar; spoilage, oversale, VDB, IDB, DBC ve NOREC metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Spill bölümleri talebin kapasiteye sığmadığı durumu anlatıyordu: uçak
dolu, yolcu kapıdan dönüyor, gelir rakibe gidiyor. Bu bölüm tersine
bakıyor. Uçak satışta dolu görünüyor, ama kalkışta boş koltuklarla
havalanıyor, çünkü rezervasyon yapan herkes gelmiyor. Kaynak metin
overbooking'i tam da bu açığı kapatmak için tanımlıyor: iptallerin,
gelmeyen yolcuların (no-show), mükerrer rezervasyonların ve bağlantı
kaçıran yolcuların etkisini dengelemek için gerçek uçak kapasitesinin
üzerinde ek rezervasyon satma süreci. **Overbooking bir risk alma
kararı değil, iki ayrı kaybın toplamını küçültme kararı: biri boş kalkan
koltuk, öteki kapıda geri çevrilen yolcu.** Hangisinin daha pahalı
olduğu uçuşa, kabine, havalimanına ve hatta ülkenin hukukuna göre
değişiyor; bu bölüm o değişkenleri tek tek açıyor.

## Kalkan uçaktaki boş koltuk geri alınamaz, overbooking bu yüzden var

Her şey envanterin doğasından başlıyor. Kaynak metin havayolu koltuğunu
bozulabilir (perishable) bir envanter olarak tanımlıyor: uçuş kalktığında
boş koltuk sonsuza dek kaybediliyor ve bir daha geri kazanılamıyor. Bir
depodaki ürün yarın da satılabilir; koltuk yalnızca o uçuşta var. Bu tek
özellik iş kuralını belirliyor. Uçağı gerçekten dolu kaldırmak
isteniyorsa, satışın gerçek kapasitenin üzerine çıkması gerekiyor.

Kalkışta kalan boş koltuğun adı spoilage. Kaynak metin bunu ayrıca bir
metrik olarak da tanımlıyor: spoilage factor, uçuş kapandığında kalan boş
koltuk sayısı. Havayolunun iç verisi, dışarıya yayınlanmıyor ve
politikanın ne kadar iyi çalıştığının ölçüsü olarak kullanılıyor; ne
kadar düşükse o kadar iyi.

Boş koltuğun kaynakları tek tip değil. İptaller var, hiç gelmeyenler var,
aynı yolculuk için birden fazla rezervasyon tutanlar var, bir de önceki
uçuşunu kaçırdığı için bağlantıya yetişemeyen yolcular (misconnect).
Tersi de oluyor: rezervasyon kaydı olmadan kapıya gelen yolcu (NOREC).
Kaynak metin sistemin bu yolcu tiplerinin olasılıksal dağılımını
operasyonel metriklerden hesapladığını ve overbooking limitlerini bu
risk faktörlerine göre periyodik olarak güncellediğini söylüyor. Yani
limit bir sabit değil; iptal, no-show ve bağlantı kaçırma dağılımlarının
bir fonksiyonu.

Yazılım tarafında bunun karşılığı şu: overbooking limiti envanter
sisteminde elle girilmiş bir yüzde gibi görünse bile, arkasında düzenli
beslenmesi gereken bir veri hattı var. Bu hat kalkış kontrolünden
no-show ve NOREC sayılarını, rezervasyon sisteminden iptal akışını,
bağlantı verisinden misconnect oranını topluyor. Hat durursa limit geçen
dönemin davranışıyla satmaya devam ediyor.

## Optimum, iki maliyet eğrisinin kesiştiği yerde duruyor

Kaynak metin overbooking'i iki hedefli bir dengeleme eylemi olarak
tanımlıyor: geliri maksimize etmek için spoilage ve oversale
maliyetlerini aynı anda minimize etmek. Oversale, kapasite aşıldığı için
bir yolcunun uçağa alınmaması. İki maliyet ters yönde hareket ediyor.
Limit düşükse uçak boş koltukla kalkıyor; limit yüksekse kapıda fazla
yolcu birikiyor ve her biri için tazminat ödeniyor.

Aradaki denge noktası, toplam geliri maksimize eden teorik optimum.
"Teorik" kelimesi önemli, çünkü aşağıda göreceğimiz gibi pek çok durumda
havayolu bilerek bu noktanın altında kalıyor. Ama önce optimumun
kendisini neyin belirlediğine bakmak gerekiyor, çünkü denklemin oversale
tarafı sanıldığından çok daha fazla değişken taşıyor.

Oversale maliyetinin bir kısmı doğrudan: tazminat. Bir kısmı dolaylı:
geri çevrilen yolcunun havayoluna küsmesi. Kaynak metin karar
algoritmasının yalnızca anlık tazminatı değil, yolcunun kaybedilmesinden
doğan prestij kaybını ve gelecekte kaybedilecek işi de bir maliyet kalemi
olarak hesaba kattığını söylüyor. Bu kalem ölçülmesi en zor olanı, ama
atlanırsa model oversale'i olduğundan ucuz görüyor ve limiti fazla
yukarı itiyor.

## Kapıda geri çevirmenin bedeli havalimanına göre değişiyor

Kapasite aşıldığında süreç bir sırayla işliyor. İş kuralı önce
gönüllüleri aramayı öngörüyor: uçuşu kendi isteğiyle bırakacak yolcu.
Gönüllüye gelecekteki seyahatlerde kullanılmak üzere belirli bir dolar
değerinde tazminat kuponu (voucher) sunuluyor. Gönüllü çıkmazsa gönülsüz
reddetme prosedürü devreye giriyor ve bu aşamada yasal zorunluluklar ve
maliyetler belirleyici oluyor.

Bu iki yolun adları metriklere de yansıyor. Gönüllü olarak uçuşu bırakan
yolcu sayısı VDB (voluntary denied boarding), isteği dışında uçağa
alınmayan yolcu sayısı IDB (involuntary denied boarding). İkisi de 10.000
yolcu başına ölçülüyor. Aralarındaki fark verinin görünürlüğünde:
kaynak metne göre IDB, ABD Ulaştırma Bakanlığı (DOT) tarafından üç ayda
bir yayınlanıyor, VDB ise kamuoyuna açık değil. Yani bir havayolunun
dışarıdan en kolay karşılaştırılabilen overbooking sonucu, en çok
kaçınmak istediği sonuç. IDB bu yüzden yalnızca bir maliyet değil, yasal
uyum ve prestij göstergesi olarak da izleniyor; VDB ise gönüllülüğün
maliyet analizine giriyor.

Kuponun değeri sabit değil. Kaynak metin tazminat maliyetinin
havalimanının konumuna, müşteri demografisine ve kurumsal politikalara
göre değiştiğini söylüyor; New York LaGuardia gibi yüksek maliyetli
merkezlerde sunulan kuponun daha küçük havalimanlarındakinden yüksek
olabileceğini örnek veriyor. Bu maliyetin bir de adı var: DBC (denied
boarding cost), havalimanı bazlı yolcu tazminat maliyeti. Kamuya açık
değil ve optimal overbooking seviyesinin hesabına doğrudan giriyor.

Buradan çıkan sonuç açık: aynı uçak tipi, aynı doluluk ve aynı no-show
oranıyla iki farklı havalimanından kalkan iki uçuşun optimum
overbooking seviyesi farklı olmalı. DBC yüksek olan yerde oversale
pahalı, eğri sola kayıyor. Yazılım tarafında bunun karşılığı, DBC'nin
modele tek bir global parametre olarak değil, havalimanı anahtarlı bir
tablo olarak girmesi. Global tek değer kullanan bir model, pahalı
merkezlerde fazla, ucuz havalimanlarında az satar.

Kuponun değeri aynı zamanda gönüllü bulma olasılığını da belirliyor.
Düşük kupon gönüllü çıkarmıyor ve süreci gönülsüz reddetmeye itiyor, o da
IDB'yi ve prestij maliyetini büyütüyor. Yüksek kupon gereksiz para
harcıyor. Kuponu yerel koşullara göre ayarlamak, bu iki uç arasında
kalmanın yolu.

## Her kabinde ekonomik optimum geçerli değil

Buraya kadar anlatılan mantık, kaynak metnin "ekonomik model" dediği,
gelir odaklı yaklaşım. Kaynak metin bunun genellikle coach (ekonomi)
sınıfında kullanıldığını söylüyor. First ve Business sınıflarında ise
hizmet kalitesi kısıtlı model (quality-of-service constraint) tercih
ediliyor. Bu model optimumu aramıyor; reddetme olasılığına bir tavan
koyup limiti o tavanın altında tutuyor.

Üst kabinde yaklaşım daha muhafazakar ve daha elle yönetiliyor. Kaynak
metin burada kabin büyüklüğüne ve haftanın gününe göre manuel
müdahalelerin ya da standart varsayılan değerlerin kullanıldığını
söylüyor. Bunun bir mantığı var: yüksek ücret ödeyen ve sadakati en
değerli olan yolcuyu kapıda geri çevirmenin prestij maliyeti, ekonomik
modelin tahmin edebileceğinden büyük. Model bu maliyeti ölçemediği yerde
havayolu ona güvenmek yerine kısıt koyuyor.

Yazılım tarafında bunun karşılığı, overbooking hesaplayıcısının tek bir
optimizasyon fonksiyonu değil, kabine göre seçilen bir strateji olması.
Ekonomi kabininde gelir maksimizasyonu, üst kabinde hizmet kısıtı
çalışıyor. İkisinin çıktısı da aynı yerde, kabin bazında bir satış
limitinde birleşiyor; ama o limite nasıl varıldığı ve kimin elle
değiştirebildiği kabine göre farklı.

## Hukuk sıkılaştıkça limit optimumun altına iniyor

Hizmet kalitesi kısıtını devreye sokan yalnızca kabin değil, coğrafya da.
Kaynak metin Avrupalı taşıyıcıların overbooking konusunda muhafazakar
olduğunu, bazı havayollarının web sitelerinde overbooking yapmadıklarını
bile iddia ettiğini söylüyor. Gerekçe EU 261 kuralı: Avrupa Birliği'nde
cezalar çok yüksek.

Ceza yüksek olduğunda oversale maliyeti yalnızca yükselmiyor, bir
noktadan sonra ekonomik modelin konuşabileceği bir sayı olmaktan çıkıyor.
Kaynak metin bu durumda sistemin hizmet kalitesi kısıtını ekonomik
gelirin önüne koyabileceğini ve bunun overbooking limitlerini teorik
optimumun altında tutacağını söylüyor. Yani havayolu bilerek gelir
bırakıyor: bir miktar spoilage'ı, yasal ve itibari riskin bedeli olarak
kabul ediyor.

Bu, yukarıdaki optimumun neden "teorik" olduğunu da açıklıyor.
Aynı uçak, aynı rota, aynı talep; ama kalkış noktası AB içindeyse
kısıtlı model, dışındaysa ekonomik model çalışabilir. Envanter sistemi
bunu bilmek zorunda. Kural motorunda kabin bilgisinin yanında
düzenleyici bölge de overbooking stratejisinin seçiminde bir girdi.

## Statik model zamanı görmez, dinamik model görür

Overbooking seviyesi ne kadar iyi hesaplanırsa hesaplansın, hesaplandığı
an ile kalkış arasında rezervasyon listesi değişiyor. Kaynak metin iki
model ailesini bu açıdan ayırıyor.

Statik modeller, uçuşa giden belirli zaman noktalarındaki iptalleri
açıkça modellemiyor; periyodik güncellemelerle yetiniyor. Her güncelleme
noktasında limit yeniden hesaplanıyor, iki nokta arasında olan biten
modele görünmüyor. Dinamik modeller ise zaman boyutunu, anlık iptalleri
ve yeni rezervasyon akışını sürekli takip ederek karar veriyor. Kaynak
metin dinamik modelleri daha karmaşık ve daha hassas senaryolarda tercih
edilen seçenek olarak konumluyor.

Seçimin ölçütü de oradan çıkıyor: iptal ve yeni rezervasyon akışı
yoğunsa, iki güncelleme noktası arasında çok şey değişiyor ve statik
modelin hata payı büyüyor. Akış sakin bir uçuşta periyodik güncelleme
yetebilir. Yazılım tarafında bu fark, zamanlanmış bir toplu işle olay
güdümlü bir hesaplama arasındaki farka denk geliyor. Statik model belirli
günlerde çalışan bir iş olarak kurulabilir; dinamik model iptal ve
rezervasyon olaylarını dinlemek zorunda. Bu yalnızca algoritma seçimi
değil, envanter sistemiyle overbooking hesaplayıcısı arasındaki
entegrasyonun şeklini de belirleyen bir mimari karar.

## Otel odası koltuk değil, overbooking de aynı kelimeyle anılmıyor

Kaynak metin aynı mantığı otelcilikle karşılaştırıyor ve fark
öğretici. Oteller de odayı gerçek kapasitenin üzerinde satıyor, ama
"overbooking" demek yerine "under departures" terimini, yani beklenenden
az çıkış demeyi tercih ediyor. Terim, sorunun kaynağını otelin satış
kararından çıkarıp misafirin davranışına taşıyor.

Bunun altında envanterin farkı yatıyor. Kaynak metne göre otel odası,
havayolu koltuğu gibi standart bir emtia (commodity) olarak görülmüyor;
manzara farkı bunun örneği. Müşteri rezervasyon yaparken belirli bir
odayı, örneğin deniz manzaralı bir odayı gözünde canlandırmış oluyor. Bu
yüzden taşan misafire alternatif sunulurken deneyim eşdeğerliği
gözetiliyor; eşdeğer olmayan bir teklif müşteri sadakatine ciddi zarar
veriyor.

Havayolu koltuğunda bu sorun daha küçük, çünkü aynı kabindeki koltuklar
büyük ölçüde birbirinin yerine geçebiliyor ve yolcuyu bir sonraki
uçuşa almak çoğu zaman kabul edilebilir bir telafi. Otel odasında
alternatif, farklı bir ürün demek. Genelleme şu: envanter ne kadar az
emtia gibiyse, oversale'in dolaylı maliyeti o kadar yüksek ve ekonomik
modelden hizmet kısıtlı modele geçme gerekçesi o kadar güçlü. Aynı
çizgi, havayolu içinde ekonomi kabininden üst kabine giderken de
görünüyor.

## Dört metrik, dördü de farklı yerde duruyor

Kaynak metin operasyonel başarıyı dört metrikle tarif ediyor ve her
birinin kime açık olduğu, nasıl kullanılabileceğini belirliyor.

VDB, gönüllü olarak uçuşu bırakan 10.000 yolcu başına sayı. Kamuya açık
değil, gönüllülüğün maliyet analizinde kullanılıyor. IDB, isteği dışında
uçağa alınmayan 10.000 yolcu başına sayı. DOT tarafından üç ayda bir
yayınlanıyor, yasal uyum ve prestij yönetiminin göstergesi. DBC,
havalimanı bazlı yolcu tazminat maliyeti. Kamuya açık değil, optimal
overbooking seviyesinin hesabına giriyor. Spoilage factor, uçuş
kapandığında kalan boş koltuk sayısı. Havayolunun iç verisi, politikanın
ne kadar etkin olduğunun ölçüsü.

Dördünü yan yana koyunca bir asimetri görünüyor. Dışarıdan
görülebilen tek metrik IDB, yani dengenin oversale tarafının en pahalı
ucu. Spoilage ise tamamen içeride kalıyor. Dışarıdan bakan biri bir
havayolunun overbooking'i ne kadar iyi yaptığını değil, yalnızca ne kadar
sık yolcu geri çevirdiğini görüyor. Havayolu içeride iki tarafı birlikte
izlemezse, dışarıdaki görünürlüğün baskısıyla limiti gereğinden fazla
düşürüp spoilage'ı büyütebilir. Yazılım tarafında bunun karşılığı,
spoilage factor ile VDB/IDB'nin aynı raporda, aynı uçuş ve aynı dönem
kırılımında durması; biri olmadan ötekini yorumlamak mümkün değil.

## Yarın işe yarayacak dört çıkarım

1. **Hizmet kısıtını bilinçli uygula.** Üst kabinde (First/Business) ve
   EU gibi yasal yaptırımın ağır olduğu bölgelerde ekonomik optimumun
   altında kalan, hizmet kalitesi kısıtlı modeli seç. Bu bir gelir
   kaybı değil, ölçülemeyen prestij ve ceza riskinin bilinçli fiyatı.
2. **Akışı yoğun uçuşta dinamik modele geç.** İptal ve yeni rezervasyon
   akışının yoğun olduğu uçuşlarda zaman boyutunu gören dinamik modelle
   statik modelin güncelleme noktaları arasındaki hata payını kapat.
   Sistemini bunun için olay güdümlü kurman gerektiğini baştan hesaba
   kat.
3. **Tazminatı yerelleştir.** Kupon değerini ve DBC'yi havalimanı
   konumuna ve yolcu demografisine göre ayarla. Doğru kupon hem gönüllü
   bulma olasılığını artırıyor hem gereksiz maliyeti kesiyor; tek global
   değer ikisini birden kaçırıyor.
4. **Modeli envanterin doğasına göre seç.** Birbirinin yerine geçebilen
   standart koltuklarda ekonomik modeli, manzara gibi emtia dışı nitelik
   taşıyan envanterde (otel odası örneğinde olduğu gibi) müşteri
   deneyimi odaklı hizmet kısıtlı modeli kullan.

Bu bölümde ne yok: kapasiteyi aşan talebin nasıl ölçüldüğü ve tahmin
edildiği (spill bölümleri) ile koltuğun hangi ücret sınıfına ayrılacağına
karar veren mekanizma (gelir yönetimi bölümleri). Gelmeyen yolcunun
oranının, yani biniş oranının nasıl tahmin edildiği de ayrı bir konu. Bu
bölüm yalnızca kapasitenin üzerine ne kadar satılacağının hangi
maliyetlerle ve hangi kısıtlarla belirlendiğini anlatmak için var.
