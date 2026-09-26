---
title: "Gelir yönetiminde kritik durum belirleme ve O&D stratejileri"
domain: "aviation"
summary: "Büyük bir ağ taşıyıcısında gelir yönetimi her gece baştan çalışan ve sabah analistin önüne hazır gelmesi gereken bir üretim sistemi; günde 5.000 kalkış ve 1,65 milyon ileri tarihli envanter biriminde hangi uçuşa bakılacağını KPI eşikleri seçiyor. Bu bölüm istisna bazlı yönetimin mantığını, analist müdahalesinin ne zaman gelir kazandırıp ne zaman kaybettirdiğini ve bağlantılı trafikte bacak bazlı kontrolün yerini neden O&D kontrolünün aldığını anlatıyor."
audience: "Gelir yönetimi, envanter ya da rezervasyon sistemleriyle çalışan ve bu sistemlerin analist ekranına ne düşürdüğünü, neden düşürdüğünü anlamak isteyen yazılımcı ve ürün insanı. Overbooking ve talep tahmini bölümlerinin okunmuş olması işe yarar; istisna bazlı yönetim, uçuş ve pazar varlığı, override, O&D kontrolü, itinerary control ve CRC metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, scale-and-performance]
ai: generated
---

Önceki bölümler tek bir kararın matematiğine bakıyordu: kaç yolcunun
geleceği, limitin nereye çekileceği, gelmeyen yolcunun koltuğunun kime
satılacağı. Bu bölüm o kararların üretildiği ortama bakıyor. Gelir
yönetimi bir model değil, her gün çalışan bir operasyon; ve büyük bir
havayolunda o operasyonun asıl sorusu hangi uçuşun doğru fiyatlandığı
değil, hangi uçuşa hiç bakılmayacağı. **Ölçek, analisti bütün uçuşları
izleyen biri olmaktan çıkarıp sistemin işaretlediği istisnaları çözen
birine dönüştürüyor; istisnayı kimin, hangi eşikle tanımladığı da gelir
yönetiminin kendisi kadar önemli bir tasarım kararı.** Aynı ölçek
bağlantılı trafikte bir adım daha ileri gidiyor: tek bacağa bakarak
verilen karar, ağın geri kalanında kaybettirebiliyor.

## Gelir yönetimi her gece çalışan bir üretim sistemi

Kaynak metin gelir yönetimini açıkça görev kritik bir uygulama olarak
tanımlıyor. Veri işleme ve modellerin yürütülmesi günlük gerçekleşmeli ki
uçuş ve pazar performansına dair bütün bilgi sabah analistler işe
geldiğinde hazır olsun. Bu cümlenin arkasındaki beklenti basit: analist
güne dünün rakamlarıyla başlamamalı.

Yazılım tarafında bunun karşılığı, gelir yönetiminin bir karar destek
aracı gibi değil, bir üretim hattı gibi işletilmesi. Gece toplu işi
geciktiğinde ya da yarıda kaldığında analist sabah eksik ya da bayat bir
tabloya bakıyor ve o gün verdiği her karar o tabloya dayanıyor. Yani
işin bir hizmet düzeyi hedefi var ve o hedef "sabah mesai başlamadan
önce" gibi somut bir saatle ifade ediliyor. Bu hedef tutmadığında sorun
yalnızca teknik bir gecikme değil, bir günlük envanter kararının kör
verilmesi.

Döngünün girdisi de çıktısı da belli. Ana CRS ya da DCS sisteminden gelen
PNR verisi, yani rezervasyon kayıtları, O&D talep tahmini ve ağ
optimizasyonu modellerine besleniyor. Buradan çıkan sonuçlar envanter
kontrollerini, yani iç içe geçmiş sınıf limitlerini (nested controls) ve
teklif fiyatlarını (bid price) güncelliyor. Güncellenen kontroller yeni
rezervasyonları şekillendiriyor, yeni rezervasyonlar ertesi gecenin
girdisi oluyor. Kaynak metin bunu sürekli bir geri bildirim döngüsü
olarak tarif ediyor ve modelin güvenilirliğinin bu döngünün sürekliliğine
bağlı olduğunu söylüyor.

## 1,65 milyon envanter birimini insan gözü taramaz

Ölçeği sayılar anlatıyor. Kaynak metin büyük ölçekli bir ağ taşıyıcısı
için günde 5.000 kalkıştan ve yaklaşık 1,65 milyon geleceğe dönük
envanter biriminden söz ediyor. Envanter birimi burada satışa açık,
kalkışı henüz gerçekleşmemiş her uçuş-tarih-sınıf kombinasyonu gibi
düşünülebilir: bugün satılan koltuk aylar sonraki bir kalkışa ait ve o
kalkışın bütün sınıfları bugün de kontrol altında.

Bu hacimde kaynak metnin vardığı sonuç kaçınılmaz: kritiklik derecesine
bakılmaksızın bütün uçuşları gözden geçirmek imkânsız bir görev, ve
uçuşların yönetiminde istisna bazlı işleme (exception processing) norm.
İstisna bazlı yönetim, sistemin her şeyi kendi başına yönettiği ve
analistin yalnızca belirli kriterleri karşılamayan durumları gördüğü
bir çalışma biçimi. Normal seyreden uçuş analistin önüne hiç gelmiyor.

Hacmi yönetilebilir kılan ikinci mekanizma gruplama. Analistler uçuşları
tek tek değil, uçuş varlıkları (flight entities) ve pazar varlıkları
(market entities) olarak gruplanmış veriler üzerinden yönetiyor. Her
grup belirli bir analiste ya da analist ekibine atanıyor; devasa
operasyonel hacim böylece parçalara bölünüyor ve her parçanın bir sahibi
oluyor. Yazılım tarafında bunun karşılığı bir sahiplik modeli: bir
istisna üretildiğinde kimin kuyruğuna düşeceği belli olmalı. Sahipsiz
istisna, üretilmemiş istisnadan daha kötü, çünkü sistem uyardığını
sanıyor ama kimse görmüyor.

## Bir uçuşu kritik yapan eşik, eşiği belirleyen de pazar

Sistem bir uçuşu kritik olarak nasıl işaretliyor? Her uçuş için önceden
tanımlanmış KPI'lar ve bu KPI'ların eşik değerleri izleniyor. Kaynak metin
bu göstergelere örnek olarak rezervasyon artış hızını, beklenen doluluk
oranını ve kapasiteye oranla aşırı rezervasyon seviyesini sayıyor.
Somut bir örnek de veriyor: kalkışa 21 gün kala doluluğun yüzde 91'i
geçmesi ya da grup rezervasyonlarının belirli bir günü aşması otomatik
olarak bir istisna yaratıyor ve analisti müdahaleye çağırıyor.

Örnekteki iki parçanın ikisi de önemli. Yüzde 91 tek başına bir şey
söylemiyor; kalkışa bir gün kala yüzde 91 doluluk sıradan, üç hafta kala
yüzde 91 ise talebin beklenenden hızlı geldiğinin ve düşük sınıfların
belki gereğinden uzun açık kaldığının işareti. Eşik bir değer değil, bir
zaman noktası ile bir değerin çifti. Yani KPI tanımı rezervasyon eğrisinin
neresinde durulduğunu bilmek zorunda.

Kaynak metnin bu konudaki aksiyon önerisi eşiklerin sabit kalmaması:
rezervasyon hızı ve doluluk oranı gibi KPI'lar için belirlenen eşikler
pazarın dinamiklerine göre sürekli güncellenmeli. Bunun gerekçesi açık.
Eşik fazla gevşekse analistin kuyruğu dolup taşıyor ve istisna bazlı
yönetimin bütün faydası kayboluyor; fazla sıkıysa gerçekten müdahale
gerektiren uçuş sessizce geçiyor. İkisi de aynı sonuca, yanlış yere
harcanan analist zamanına çıkıyor.

Yazılım tarafında bunun karşılığı şu: eşikler koda gömülü sabitler
olmamalı, pazar ve zaman ufku bazında yönetilen bir yapılandırma olmalı.
Bir eşiğin iyi çalışıp çalışmadığını anlamanın yolu da ürettiği istisna
sayısına ve o istisnaların kaçının gerçekten bir müdahaleyle
sonuçlandığına bakmak. Hiç müdahale getirmeyen istisna, analistin
dikkatinden alınmış bir vergi.

## Analist müdahalesi, sistemin bilmediği bir şeyi bildiğinde değerli

İstisna analistin ekranına düştüğünde bir sonraki soru ne yapacağı.
Sistemin ürettiği önerilere analistin elle müdahale etmesi, yani
override, kaynak metnin deyişiyle sektörde hâlâ tartışılan bir konu.
Metnin tutumu ise net: normal çalışma koşullarında sistem önerilerine
yapılan kullanıcı müdahaleleri, gelir kaybını önlemek için minimumda
tutulmalı. Sistem dışı müdahale çoğu zaman gelir kaybettiriyor.

Bunun nedeni modelin neye dayandığında. Tahmin ve optimizasyon
modelleri tarihsel veriden öğreniyor; tarih geleceği temsil ettiği
sürece, bir analistin sezgisi binlerce uçuşun örüntüsünü görmüş bir
modelden daha iyi değil. Analist bir uçuşa bakıp "bu bana fazla dolu
göründü" diye sınıf kapattığında, çoğu zaman modelin zaten fiyatladığı
bir riski ikinci kez fiyatlıyor.

Müdahaleyi değerli yapan durumlar tam da tarihin geleceği temsil etmediği
durumlar. Kaynak metin bunları sayıyor: özel etkinlikler, rakiplerin
beklenmedik fiyat indirimleri, bir pazara ilk kez girilmesi ve COVID-19
gibi katastrofik olaylar. Yeni pazarda tarihsel veri hiç yok; rakip
indiriminde veri var ama değişen koşulu içermiyor; pandemide ise
tarihsel örüntünün kendisi geçersiz. Bu durumlarda insan müdahalesi
kaynak metnin ifadesiyle vazgeçilmez bir gereklilik.

İş kuralı buradan çıkıyor: müdahale ancak artan gelir (incremental
revenue) yaratılacağına dair güçlü bir veri ya da pazar bilgisi
olduğunda tercih edilmeli. Yani analistin elindeki bilgi, modelin
elindeki bilgiden farklı olmalı. Aynı veriye bakıp farklı bir karar
vermek müdahale değil, modelle yarışmak.

Yazılım tarafında bu ayrım kayıt altına alınabilir bir şey. Her override
bir gerekçe koduyla (özel etkinlik, rakip hamlesi, yeni pazar, kriz)
saklanırsa, hangi tür müdahalenin gerçekten gelir getirdiği sonradan
ölçülebilir. Gerekçesiz override ise hem ölçülemez hem de modelin
bir sonraki öğrenme turunda gürültü olarak geri döner.

## Bağlantılı trafikte bacağa bakan karar ağda kaybettirir

İstisnayı belirlemek ve ona müdahale etmek, kontrolün hangi birim
üzerinden yapıldığından bağımsız sorular. Ama ağ taşıyıcıları için o
birimin kendisi de bir sorun. Kaynak metin, bacak (leg) bazlı yönetimin
ağ taşıyıcıları için yetmediğini, bağlantılı trafiğin hub havalimanları
üzerinden akışını kontrol etmenin esas olduğunu söylüyor.

Bacak bazlı kontrol her uçuş parçasını ayrı bir envanter olarak görüyor:
bu bacakta hangi sınıfta kaç koltuk açık. Oysa hub üzerinden aktarma
yapan bir yolcu iki bacakta birden koltuk kullanıyor ve ödediği ücret
iki bacağa bölünüyor. Bacak bazında bakıldığında o yolcu her iki bacakta
da ucuz görünebilir; ağ bazında bakıldığında ise iki ayrı yerel yolcudan
daha değerli ya da daha değersiz olabilir. Karar hangisi olduğunu
bilmeden veriliyorsa, doğru çıkması tesadüf.

Bu karmaşıklığın büyük havayollarına özgü olmadığını kaynak metin ayrıca
vurguluyor: O&D bazında rezervasyon envanterinin kontrolü, günde yalnızca
iki yüz kalkış yapan ve yüzde 20 bağlantılı trafiği olan bir havayolu
için bile karmaşık. Kombinasyon sayısı kalkış sayısıyla doğrusal değil,
bağlantı olanaklarıyla büyüyor; beşte bir oranında bir aktarma payı bile
ağın bacaklarını birbirine bağlamaya yetiyor.

## Yolcunun değeri ödediği ücretten fazlası

O&D kontrolünün merkezindeki soru, bir yolcuya koltuk satılıp
satılmayacağına karar verilirken o yolcunun değerinin nasıl
hesaplandığı. Kaynak metne göre bu değer yalnızca bilet fiyatına
bakmıyor; bütün seyahat planına (itinerary), kalkış tarihine, kabine
(F, J, Y), rezervasyon sınıfına (Y, B, M gibi), satış noktasına ve
tarife dışı özel ya da gizli fiyat tanımlarına (off-tariff) göre dinamik
olarak kuruluyor.

Listedeki her boyut bir anahtar. Aynı sınıftaki iki koltuk talebi,
biri yurt içinde satılmış yerel bir yolculuk, diğeri yurt dışında
satılmış bağlantılı bir yolculuk olduğunda iki farklı değer taşıyor.
Off-tariff fiyatların listede olması da önemli: yayımlanmış ücret
tablosundan okunamayan bir değerin envanter kararına girmesi gerekiyor,
yani değer hesabı ücret tablosunun ötesinde bir veriye erişmek zorunda.

Bu değeri koltukla karşılaştırmanın yolu teklif fiyatı (bid price) ve
ağ optimizasyonu. Kaynak metin bu karmaşıklığın bu tür sofistike
teknikleri zorunlu kıldığını söylüyor ve bağlantılı uçuşlardaki trafik
akışının itinerary control mantığıyla yönetildiğini anlatıyor. Itinerary
control, envanter kararının bacak yerine yolculuğun tamamı üzerinden
verilmesi. Erişilebilirlik verilirken tek bir bacaktaki boş koltuk sayısı
değil, bütün ağdaki gelir potansiyeli ve teklif fiyatı eğrileri dikkate
alınıyor; öncelik en yüksek toplam değeri getirecek yolcuya veriliyor.

Yazılım tarafında bunun karşılığı, erişilebilirlik sorgusunun artık
tek bir envanter kaydına bakıp cevap verememesi. Soru "bu bacakta M
sınıfı açık mı" olmaktan çıkıp "bu yolculuğun değeri, kullandığı
bacakların teklif fiyatlarının toplamını karşılıyor mu" haline geliyor.
Cevap için yolculuğun bütün bacaklarının durumu ve değer hesabının bütün
boyutları aynı anda gerekiyor. Günlük toplu işin ürettiği teklif
fiyatları burada devreye giriyor: gece hesaplanıyor, gün boyunca her
erişilebilirlik sorgusunda okunuyor.

## Envanter kararı gelir yönetiminin sınırında bitmiyor

Gelir yönetimi analistinin kararları tek başına işlemiyor. Uçuş
programı değiştiğinde, iptal ya da gecikme nedeniyle yolcuların başka
uçuşlara yeniden yerleştirilmesi (reaccommodation) gerektiğinde ve
bekleme listeleri yönetilirken envanterin başka bir sahibi de devreye
giriyor. Kaynak metin bu noktada Merkezi Kontrol Birimi'ni (CRC) anıyor
ve RM analistleri ile CRC arasındaki iletişim kanallarının optimize
edilmesi gerektiğini söylüyor.

Buradaki gerilim somut. Gelir yönetimi bir uçuşu en yüksek değeri
getirecek yolcu karmasına göre kontrol ediyor; yeniden yerleştirme ise
aynı koltukları o değerden bağımsız olarak, mağdur yolcuyu taşımak için
kullanıyor. İki taraf birbirinin ne yaptığını görmezse, gelir yönetimi
bir sonraki gece kendi kontrolünün dışında dolmuş bir uçuşu olağandışı
bir talep sinyali gibi okuyabilir ya da CRC'nin ihtiyaç duyduğu koltuğu
yüksek sınıf için saklıyor olabilir.

Yazılım tarafında bu, geri bildirim döngüsünün yalnızca PNR akışını
değil, operasyonel olayları da taşıması gerektiği anlamına geliyor. Bir
rezervasyonun satıştan mı yoksa yeniden yerleştirmeden mi geldiğini
bilmeyen tahmin modeli, bir aksaklık gününü talep artışı olarak
öğrenir. Kaynak metnin veri geri bildirim döngüsü önerisi de tam bunu
söylüyor: O&D modellerinin güvenilirliği, sistemden gelen performans
verisinin talep tahmini ve ağ optimizasyonu bileşenlerine sürekli
beslenmesine bağlı.

## Yarın işe yarayacak dört çıkarım

1. **KPI eşiklerini yapılandırma olarak yönet.** Rezervasyon hızı ve
   doluluk oranı eşiklerini pazar ve kalkışa kalan gün bazında tanımla,
   pazar dinamiği değiştikçe güncelle. Her eşiğin ürettiği istisna
   sayısını ve kaçının müdahaleyle sonuçlandığını izle; hiç müdahale
   getirmeyen eşik analistin zamanını boşa harcıyor.
2. **Override'ı gerekçeyle sınırla.** Normal koşullarda sistem
   önerisinden sapma. Müdahaleyi özel etkinlik, rakip fiyat hamlesi, yeni
   pazar ve kriz gibi tarihsel verinin yetersiz kaldığı durumlara ayır;
   her müdahaleyi gerekçesiyle kaydet ki artan gelir getirip getirmediği
   sonradan ölçülebilsin.
3. **CRC ile envanter olaylarını paylaş.** Tarife değişikliği, yeniden
   yerleştirme ve bekleme listesi kararlarının RM analistine ve RM
   modellerine ulaştığı kanalı netleştir. Satıştan gelmeyen rezervasyon
   talep sinyali olarak okunmamalı.
4. **Geri bildirim döngüsünü kesintisiz tut.** CRS/DCS'ten gelen PNR
   verisini ve sistemin performans verisini O&D talep tahmini ile ağ
   optimizasyonuna her gün besle; gece işi sabah mesaisinden önce
   bitmiyorsa bunu bir envanter riski olarak ele al.

Bu bölümde ne yok: teklif fiyatının ve ağ optimizasyonunun nasıl
hesaplandığı, iç içe geçmiş sınıfların limitlerinin nasıl kurulduğu ve
O&D talebinin nasıl tahmin edildiği. Tahmin tarafı "O&D talep tahmini:
birinci ve ikinci nesil yaklaşımlar" ve "İtinerer tercih modelleri ve
talep analizi" bölümlerinde; gelmeyen yolcunun koltuğunun nasıl
satıldığı overbooking bölümlerinde. Bu bölüm o modellerin ürettiği
kararların hangi ölçekte, hangi eşikle ve hangi insan müdahalesiyle
işletildiğini anlatmak için var.
