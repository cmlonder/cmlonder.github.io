---
title: "Havacılık envanter yönetimi ve GDS entegrasyon sistemleri"
domain: "aviation"
summary: "Havayolu envanterini GDS'e dört farklı derinlikte bağlayabilir: teletiple durum bildiren AVS/AVN, sayı göstermeyen BBR, havayolunun terminali gibi davranan DAI ve satıştan önce ana sistemi sorgulayan DCS/DCA. Bu bölüm her seviyenin acenteye neyi gösterdiğini, neyi geç öğrettiğini ve O&D kontrolünün neden yalnızca en üst basamakta mümkün olduğunu anlatıyor."
audience: "Envanter, PSS ya da dağıtım entegrasyonu üzerinde çalışan, GDS'teki bir koltuğun havayolu sistemindekiyle neden her zaman aynı olmadığını anlamak isteyen yazılımcı ve ürün insanı. Envanter kontrolü ve GDS bölümlerinin okunmuş olması işe yarar; AVS, AVN, BBR, DAI, LNIATA, DCS, DCA ve POS metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, use-case]
ai: generated
---

Önceki bölümler envanter kontrolünü havayolunun kendi sistemi içinde
anlattı: hangi sınıf ne zaman kapanır, yuvalama hangi değişmezi korur,
teklif fiyatı hangi talebi reddeder. Bu kararların hepsi havayolunun ana
sisteminde (host CRS) alınıyor. Ama satışın büyük kısmı başka bir yerde,
acentenin baktığı GDS ekranında gerçekleşiyor. İki sistem arasındaki hat ne
kadar ince ise havayolunun kararı ekrana o kadar geç ve o kadar kaba
ulaşıyor. **Entegrasyonun derinliği, havayolunun gelir yönetimi
stratejisini uygulayabileceği sınırı doğrudan belirliyor.** En iyi O&D
optimizasyonu, acentenin ekranına yalnızca açık ya da kapalı olarak
ulaşabiliyorsa, o ekranda bir O&D optimizasyonu yok demektir.

Bu bölüm o hattı en ince halinden en kalın haline doğru anlatıyor. Dört
basamak var: teletip durum mesajları (AVS/AVN), temel rezervasyon kaydı
(BBR), doğrudan erişimli etkileşim (DAI) ve kesintisiz satış ile
kullanılabilirlik (DCS/DCA). Her basamakta aynı üç soru soruluyor: acente
ne görüyor, satışın onaylandığını ne zaman öğreniyor, ve havayolunun
envanter mantığı bu kararın neresinde duruyor.

## Varsayılan durum açık; havayolu yalnızca istisnayı bildiriyor

En alttaki katman, havayolunun GDS'lere uçuş ve sınıf bazında satış
durumunu bildirdiği mesajlaşma. Envanter kontrol sistemi uçuşun doluluğuna
göre iki tip mesajdan birini gönderiyor. AVS (availability status) sınıfın
açık mı kapalı mı olduğunu söylüyor. AVN (availability numeric) ise o
sınıfta kaç koltuk kaldığını.

Bu katmanın asıl iş kuralı mesajların içeriğinde değil, mesaj gelmediğinde
ne varsayıldığında. Kaynak metin bunu açıkça söylüyor: host havayolu için,
havayolu bir kapatma mesajı göndermediği sürece bütün uçuş, segment, kalkış
tarihi ve sınıf kombinasyonları satışa açık kabul ediliyor. Yani sistem
istisna bazlı çalışıyor. GDS'in veritabanındaki her hücre "açık" olarak
doğuyor ve havayolu onu ancak aktif olarak kapattığında kapanıyor.

Yazılım tarafında bunun karşılığı ağır. GDS'teki durum, havayolundan gelen
olay akışının bir türevi; kaynağın kendisi değil, kopyası. Bir kapatma
mesajı gecikirse, kaybolursa ya da sıraya takılırsa, GDS hatası olmadan
yanlış bilgi gösteriyor: havayolunun kapattığı sınıf acentenin ekranında
hâlâ açık. Kopyanın varsayılan değeri "açık" olduğu için hata da hep aynı
yöne düşüyor. Kaybolan mesaj, satılmaması gereken bir koltuğun satılması
demek.

Bu basamakta bir de ara durum var. Havayolu AVS durumunu "request" olarak
işaretleyebiliyor. O zaman acente satışı yapıyor ama işlem havayolundan
gelecek manuel ya da sistemsel bir onaya kadar beklemede kalıyor. Bu
otomatik onayın bilinçli olarak kapatıldığı bir kontrollü satış modu:
havayolu koltuğu satışa açıyor ama son sözü kendine saklıyor. Envanter
mantığı açısından ilginç olan şu: request, ikili açık/kapalı dünyasına
üçüncü bir değer ekliyor ve bu üçüncü değer her rezervasyonun sonucunu
zamana yayıyor. Acentenin iş akışı artık tek adımlı değil; satış anı ile
teyit anı birbirinden ayrılıyor.

## BBR'de acente koltuğu değil, sınıfı görüyor

İkinci basamak, havayolunun GDS'e en düşük seviyede katıldığı model:
temel rezervasyon kaydı, BBR (Basic Booking Record). Burada acente
kullanılabilirlik sorgusunda sayısal bir değer görmüyor, yalnızca hizmet
sınıfını görüyor. Koltuğun gerçekten verilip verilmediğini ancak işlemi
sonlandırdıktan (End Transaction) sonra, havayolundan dönen teletip
yanıtıyla öğreniyor.

Bu, önce talep et, sonra teyit al mantığı. Mimari olarak bakınca BBR bir
asenkron istek-yanıt sözleşmesi: istemci (acente) isteği gönderip oturumu
kapatıyor, yanıt daha sonra ayrı bir kanaldan geliyor. Acente satış
sırasında bilgi eksikliğiyle karar veriyor; reddedilen bir talep, müşteri
masadan kalktıktan sonra ortaya çıkabiliyor.

BBR'nin ticari bir sonucu da var. BBR üzerinden yapılan rezervasyonlara
GDS teşvik primleri (incentives) uygulanmıyor. Gerekçe iş kuralında:
BBR en düşük katılım seviyesi ve havayolu sistemleriyle gerçek zamanlı,
derin bir entegrasyon sağlamıyor, bu yüzden GDS'in teşvik sistemlerinin
dışında tutuluyor. Başka bir deyişle, entegrasyon derinliği yalnızca veri
kalitesini değil, acentenin o havayolunu satmaya ne kadar istekli
olacağını da belirliyor. Teşvik görmeyen bir satış, acentenin önceliği
olmuyor.

## DAI'de GDS, havayolunun kendi terminali gibi davranıyor

Üçüncü basamakta yön değişiyor. Önceki iki modelde havayolu GDS'e durum
bildiriyor, GDS de kendi kopyasından satış yapıyordu. Doğrudan erişimli
etkileşimde, DAI (Direct Access Interactive), GDS acentesi havayolunun
kendi envanter sistemine, host CRS'e doğrudan erişiyor.

Bunun nasıl sağlandığı eski ama zarif bir mekanizma. GDS, havayolu
sistemine tahsis edilmiş özel bir LNIATA (Line Interchange Address Terminal
Address) havuzu üzerinden bağlanıyor. LNIATA, host sistemin bir terminali
tanıdığı adres. GDS bu havuzdaki adreslerden biriyle bağlandığında, yapılan
işlem havayolunun kendi personeli yapmış gibi kaydediliyor ve koltuk
doğrudan host envanterinden düşülüyor.

Yazılım gözüyle DAI şunu söylüyor: entegrasyon bir API sözleşmesiyle değil,
kimlik taklidiyle kuruluyor. Host sistem dış bir kanalı tanımıyor; ona
kendi iç kanallarından biri gibi görünen bir adres veriliyor. Bunun iyi
tarafı, işlemin kopya veriye değil gerçek envantere dokunması. Bedeli ise
dış trafiğin iç terminal trafiğinden ayırt edilmemesi. Satışı kimin
yaptığını, hangi kanaldan geldiğini ayrıştırmak isteyen her analiz, ancak
LNIATA havuzunun hangi adreslerinin kime ait olduğunu bildiği sürece bunu
yapabiliyor.

## Son koltuk, satıştan önce ana sistem sorgulanırsa garanti

En gelişmiş basamak kesintisiz satış ve kullanılabilirlik (seamless sell
and availability). Kaynak metin bu modeli bir cümleyle tanımlıyor:
kesintisiz kullanılabilirlik, host CRS'in envanter yönetim sistemini
GDS'ler aracılığıyla aboneye kadar uzatıyor. Yani acentenin ekranı artık
havayolunun sisteminin bir kopyası değil, bir uzantısı.

Bu basamağın iki parçası var ve sırası önemli. Birincisi DCS (Direct
Connect Sell). DCS'de GDS satışı gerçekleştirmeden önce havayolunun dahili
veritabanını anlık ve şeffaf bir şekilde sorguluyor. İşlem bitince
havayolu sistemi hemen bir kayıt lokatörü (record locator) döndürüyor ve
acente pozitif teyidi o anda alıyor. Son koltuk mevcudiyeti (last seat
availability) bu şekilde garanti ediliyor: GDS'in son koltuğu satabilmesi,
o koltuğun kendi kopyasında görünmesine değil, havayolunun o anda "evet"
demesine bağlı.

BBR ile yan yana koyunca fark netleşiyor. BBR'de teyit işlemden sonra,
ayrı bir teletiple geliyor. DCS'de teyit işlemin parçası; lokatör
dönmüyorsa satış olmamış demektir. Asenkron sözleşmenin yerini senkron bir
sözleşme alıyor.

İkinci parça DCA (Direct Connect Availability). Standart modelde GDS,
kullanılabilirliği kendi veritabanındaki AVS/AVN verisinden okuyor; bu
statik bir veri. DCA modelinde ise havayolunun ana sistemindeki gerçek
zamanlı mantık kullanılıyor. Acente, havayolunun envanter kurallarının o
an ürettiği cevabı görüyor. Bu hem satış kaybını hem de hatalı
rezervasyonu önlüyor: kopyada kapalı görünen ama aslında açık olan koltuk
kaçmıyor, kopyada açık görünen ama aslında kapanmış olan koltuk da
satılmıyor.

Kaynak metin iki parça arasındaki bağımlılığı da kesin koyuyor: DCA, DCS
olmadan desteklenemiyor. Bu mantıklı bir sıra. Kullanılabilirliği gerçek
zamanlı sorgulayıp satışı eski yoldan, kopyaya yazarak yapmak, doğru cevabı
alıp yanlış yere işlemek olurdu. Önce satışın ana sisteme gitmesi, sonra
sorgunun oraya taşınması gerekiyor.

## O&D kontrolü kopya veriyle yapılamaz

Kaynak metin DCA için bir cümle daha kuruyor: DCA, O&D kontrolü için bir
gereklilik. Bunun nedeni AVS/AVN'nin veri modelinde saklı. AVS ve AVN
uçuş ve sınıf bazında bilgi taşıyor: bu uçuşta bu sınıf açık, bu sınıfta
şu kadar koltuk var. O&D kontrolünün sorduğu soru ise başka: bu uçuştaki
bu sınıf, şu başlangıç ve şu varış arasındaki bu yolculuk için açık mı?

Aynı bacaktaki aynı sınıf, bir yolcu için açık, başka bir güzergâhla
bağlanan başka bir yolcu için kapalı olabilir. Uçuş-sınıf ızgarası bu
farkı taşıyamıyor; ızgaraya indirgenen her O&D kararı, bir yolcu grubu
için yanlış cevap üretiyor. Cevabın yolculuğa göre değişebilmesi için,
sorunun yolculuğun tamamıyla birlikte havayolunun sistemine gitmesi ve
orada hesaplanması gerekiyor. DCA tam olarak bunu yapıyor.

Stratejik sonuç açık: O&D bazlı envanter kontrolü yapmak isteyen bir
havayolu, DCS ve DCA entegrasyon seviyelerine mutlaka sahip olmalı.
Envanter optimizasyonuna yapılan yatırım, bu entegrasyon olmadan dolaylı
kanalda karşılık bulmuyor. Algoritma havayolunun kendi web sitesinde
doğru çalışıyor, GDS ekranında ise basitleştirilmiş kopyası görünüyor.

Yerel kopyanın bir maliyeti daha var. AVS/AVN mesajlarına dayanan yerel
GDS veritabanları, gerçek zamanlı host sorguları kadar doğru sonuç
vermeyebiliyor ve bu, uçak doluluk oranlarında sapmaya yol açabiliyor.
Kopya ile kaynak arasındaki her fark ya satılamayan bir koltuk ya da
satılmaması gereken bir koltuk olarak doluluğa yansıyor.

## Satış noktası bilgisi, envanteri yere göre değiştirmenin anahtarı

Kesintisiz modelin açtığı bir kapı daha var: satış noktasına (POS, point of
sale) göre envanter kontrolü ve fiyat ayarlaması. Bunu mümkün kılan
teknoloji mesaj formatı. EDIFACT standart veri paketleriyle acente
düzeyindeki tam POS bilgisi havayolu sistemine iletiliyor. Havayolunun
MCFA tablosu POS bazlı ayarlamaları destekliyorsa, sistem satışın yapıldığı
yere göre envanter kontrolünü ve fiyatlandırma mantığını otomatik olarak
değiştiriyor.

Burada teletip ile EDIFACT arasındaki fark bir biçim tercihi değil, bir
veri tercihi. Teletip mesajları uçuş ve sınıf durumunu taşımak için
tasarlanmış; isteğin kimden, nereden geldiğini taşımıyor. EDIFACT paketi
ise isteğin bağlamını, yani hangi acentenin hangi pazardan sorduğunu
havayoluna ulaştırabiliyor. Gelir yönetimi açısından bu kritik veri:
aynı koltuğun farklı pazarlarda farklı değeri varsa, havayolunun o farkı
kullanabilmesi için sorunun hangi pazardan geldiğini bilmesi gerekiyor.
Bağlamı taşımayan bir kanalda, POS'a duyarlı bir envanter kuralı ya
çalışmıyor ya da her pazar için aynı cevabı veriyor.

## Entegrasyon derinliği acente ekranında da görünüyor

Merdivenin en üstüne çıkmanın bir de pazarlama tarafı var. DCA kullanan
havayolları GDS ekranlarında özel bir satış göstergesiyle (sales
indicator) işaretleniyor. Acente, hangi havayolunun cevabının gerçek
zamanlı olduğunu ekranda görüyor. Bu, acenteler nezdinde güvenilirlik ve
farklılaşma sağlıyor: gösterge taşıyan havayolunda "satıldı" ile
"teyit edildi" arasında fark yok.

Merdiveni bir bütün olarak okuyunca her basamak bir öncekinin bir
belirsizliğini kaldırıyor. AVS/AVN'de acente kopyaya bakıyor ve kopyanın
güncel olduğunu umuyor. Request durumunda satış ile teyit arasına insan
giriyor. BBR'de acente sayı görmüyor ve sonucu işlem bittikten sonra
öğreniyor. DAI'de işlem gerçek envantere dokunuyor ama kanal kimliğini
kaybediyor. DCS satışın sonucunu anında veriyor, DCA ise sorunun kendisini
havayolunun mantığına taşıyor. Belirsizlik azaldıkça havayolunun gelir
yönetimi stratejisi ekrana daha az bozulmuş halde ulaşıyor.

## Yarın işe yarayacak dört çıkarım

1. **O&D kontrolünü entegrasyon planıyla birlikte ele al.** O&D bazlı
   envanter kontrolü, dolaylı kanalda ancak DCS ve DCA seviyesindeki
   entegrasyonla çalışıyor. Önce DCS, sonra DCA; DCA, DCS olmadan
   desteklenmiyor. Optimizasyon projesinin kapsamına bu bağlantıyı
   yazmayan plan, algoritmayı yalnızca doğrudan kanala teslim ediyor.
2. **POS bilgisini teletiple değil EDIFACT ile taşı.** Satış noktasına
   göre envanter ve fiyat ayarlaması, acente düzeyindeki tam POS
   bilgisinin havayolu sistemine ulaşmasına bağlı. Havayolu tarafındaki
   tablonun (MCFA) POS bazlı ayarlamayı desteklediğini de ayrıca doğrula;
   veri gelip kural onu okumuyorsa kazanç yok.
3. **Yerel kopyayı kaynak sanma.** AVS/AVN ile beslenen GDS veritabanı,
   havayolu envanterinin istisna bazlı bir kopyası; varsayılanı "açık".
   Kaybolan ya da geciken kapatma mesajı, satılmaması gereken koltuk
   olarak dönüyor. Doluluktaki sapmaları incelerken önce kopya ile host
   arasındaki farkı ölç.
4. **Entegrasyon seviyesini kanal performansına bağla.** BBR teşvik
   sistemlerinin dışında kalıyor, DCA ise ekranda satış göstergesi
   kazandırıyor. Acentenin bir havayolunu ne kadar satacağı, o havayolunun
   GDS'e ne kadar derin bağlandığıyla birlikte değerlendirilmeli.

Bu bölümde ne yok: havayolunun kendi içinde sınıfları nasıl açıp kapadığı
(envanter kontrolü ve teklif fiyatı bölümleri), O&D talebinin nasıl
tahmin edildiği ("O&D talep tahmini: birinci ve ikinci nesil yaklaşımlar")
ve GDS'lerin tarihsel olarak nasıl doğup birleştiği ("GDS ve havacılık
dağıtım ekosistemi: stratejik analiz ve iş mantığı rehberi"). Bu bölüm o
kararların GDS ekranına hangi hat üzerinden ve ne kadar bozulmadan
ulaştığını anlatmak için var.
