---
title: "Havacılık gelir yönetimi ve ağ optimizasyonu stratejileri"
domain: "aviation"
summary: "Bütün pazarlar O&D kontrolüne girdiğinde envanter artık sınıf tahsisleriyle değil, ağın bütününü yansıtan teklif fiyatlarıyla yönetiliyor. Bu bölüm o teklif fiyatının neden müşteri tercihini hesaba katmak zorunda olduğunu, optimizasyonun sınırının neden bir günün bütün programı olduğunu ve 300.000 ile bir milyonu aşan hizmet sınıflı bir ağda dinamik programlamanın neden hibrit modellere yenildiğini anlatıyor."
audience: "Envanter, müsaitlik ya da gelir yönetimi optimizasyon sistemleri yazan, bir ağ optimizasyonu işinin neyi kapsayıp ne sıklıkla çalışması gerektiğine karar vermek zorunda olan yazılımcı ve analist. O&D tahmini ve itinerer tercih bölümlerinin okunmuş olması işe yarar; O&D kontrolü, teklif fiyatı, upsell, recapture, kenar etkisi ve leg decomposition metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, scale-and-performance]
ai: generated
---

Önceki bölümler envanterin kenarlarıyla uğraştı: kaç yolcunun uçağa
geleceği, kaç koltuğun fazla satılabileceği. Bu bölüm envanterin
merkezine, koltuğun hangi fiyata satılmaya değer olduğunu kimin
belirlediğine dönüyor. Kaynak metin, gelir yönetimi sistemlerinin üç
yaklaşım arasında evrildiğini söylüyor: menşe ve varış (O&D) kontrolü,
teklif fiyatlandırması (bid pricing) ve dinamik programlama. Üçünün
ortak sorunu aynı: büyük bir havayolu ağı hesaplanamayacak kadar büyük,
müşteri de modelin varsaydığından daha hareketli. **Ağ optimizasyonunda
belirleyici olan en iyi algoritmayı seçmek değil, ağın ne kadarını, ne
sıklıkla ve hangi müşteri davranışıyla hesaplayacağına karar vermek.**

## O&D kontrolü sınıf tahsisini gereksiz kılıyor

Klasik envanter kontrolünde her uçuş bacağının (leg) kendi hizmet
sınıfları, her sınıfın da kendi tahsisi var: tam ücretli sınıfa şu kadar
koltuk, indirimli sınıfa bu kadar. Bu model bacağı tek başına görüyor.
Aktarmalı uzun bir güzergâhın parçası olarak o bacağı uçan yolcuyla
yalnızca o bacağı uçan yolcu, aynı sınıftan bilet aldıysa sistem için aynı
kişi.

O&D kontrolü soruyu bacaktan yolculuğa taşıyor: yolcunun nereden
başlayıp nerede bittiği kararın parçası oluyor. Kaynak metnin iş kuralı
burada net. Tüm pazarlar O&D kontrolü altındaysa spesifik hizmet sınıfı
tahsislerine gerek kalmıyor. Onların yerine envanter, ağın bütünsel
değerini yansıtan teklif fiyatları üzerinden yönetiliyor.

Teklif fiyatı, bir bacaktaki bir sonraki koltuğun ağ için ne kadar değerli
olduğunu söyleyen eşik. Bir talep geldiğinde sistem sınıfın açık olup
olmadığına değil, talebin getirdiği gelirin, kullandığı koltukların
değerini karşılayıp karşılamadığına bakıyor. Sınıf tahsisi sorusu
"bu kovada yer kaldı mı" iken teklif fiyatı sorusu "bu satış ağa
değer mi".

Yazılım tarafında bunun karşılığı, müsaitlik servisinin veri modelinin
değişmesi. Sınıf tahsisli dünyada müsaitlik bir sayaç tablosu: bacak,
sınıf, kalan koltuk. Teklif fiyatlı dünyada müsaitlik bir karşılaştırma:
talebin geliri ile güzergâhtaki bacakların eşiklerinin karşılaştırılması.
Birinden ötekine geçiş bir parametre değişikliği değil, müsaitlik
cevabını üreten fonksiyonun yeniden yazılması. Kaynak metnin koşulu da
önemli: bu geçiş tüm pazarlar O&D kontrolüne girdiğinde tam anlamını
buluyor. Ağın bir kısmı hâlâ sınıf tahsisiyle yönetiliyorsa iki model
yan yana yaşıyor ve sınırda hangisinin sözü geçeceği ayrı bir karar.

## Teklif fiyatı müşterinin kaçabileceği yerleri bilmek zorunda

Teklif fiyatı yalnızca kapasiteden hesaplanırsa müşteriyi sabit bir nesne
gibi görüyor: bu yolcu bu sınıfı istiyor, açık değilse gidiyor. Kaynak
metin güncel modellerin bundan fazlasını yapması gerektiğini söylüyor:
teklif fiyatı belirlenirken statik kapasitenin yanında müşterinin bir üst
sınıfı satın alma (upsell) ya da alternatif bir uçuşa yönelme
(recapture) ihtimali de hesaba katılmalı.

Bu iki ihtimal teklif fiyatının anlamını değiştiriyor. Bir sınıf
kapandığında talebin bir kısmı kaybolmuyor. Bir kısmı aynı uçuşta daha
pahalı sınıfa çıkıyor, bir kısmı aynı havayolunun başka bir uçuşuna
kayıyor. Bunları görmeyen bir model, sınıfı kapatmanın maliyetini olduğundan
yüksek hesaplıyor ve koltuğu gereğinden ucuza bırakıyor. Görmesi gerekenleri
görünce aynı koltuğu daha yüksek bir eşikle koruyabiliyor, çünkü kapattığı
kapının arkasındaki yolcunun tamamen gitmediğini biliyor.

Kaynak metin bu etkileşimleri iki adla ayırıyor: aynı uçuşta üst sınıf
satışı (same flight upsell) ve farklı uçuşa kayma (cross flight
recapture). İkisi de bir uçuşun ya da sınıfın kapanmasından doğuyor ve
ikisinin de simülasyon temelli bir seçim modeliyle analiz edilmesi
öneriliyor. Uygulanabilir öngörüler kısmı bunu daha sert söylüyor:
recapture ve upsell değişkenleri talep tahmini modellerine mutlaka
entegre edilmeli, çünkü simülasyon çalışmalarına göre bu belirgin gelir
artışı sağlıyor.

Burada bir ayrım yapmak gerekiyor. Recapture havayolunun kendi ağı
içinde bir kayma: yolcu kaçmıyor, başka bir koltuğa oturuyor. Bu yüzden
recapture'ı modellemek ağın geri kalanını bilmeyi gerektiriyor. Bir
uçuşun teklif fiyatını hesaplarken o uçuşun alternatiflerinin ne kadar
dolu olduğunu bilmeyen model, recapture'ı hesaba katamıyor. Bir sonraki
başlığın konusu tam olarak bu.

## Optimizasyonun sınırı bir günün bütün programı

Ağ optimizasyonu işi yazılırken ilk karar veri setinin sınırı: hangi
uçuşlar aynı hesabın içinde olacak? Hesaplama maliyeti bu sınırı daraltmaya
itiyor. Yalnızca bir hub'ın ya da bir bölgenin uçuşlarını almak işi
küçültüyor.

Kaynak metin bu yolu kapatıyor. Bir günün uçuş takvimi optimize edilirken
optimizasyon kenar etkilerinden (edge effects) kaçınmak için o güne ait
tüm programı kapsamalı. Kısmi bir ağı optimize etmek, ağın dışında kalan
bağlantılı hizmet sınıfları için hatalı gelir ayarlamalarına yol açıyor.

Kenar etkisinin mekanizması şu: optimizasyonun içindeki bir bacak, dışarıda
kalan bir bacakla aynı güzergâhı paylaşıyor. Aktarmalı yolcu ikisini de
uçuyor. Optimizasyon içerideki bacağın teklif fiyatını hesaplarken dışarıdaki
bacağın ne kadar dolu olduğunu, oradaki koltuğun ne kadar değerli olduğunu
bilmiyor. Ya o bacağı bedava sayıyor ya da sabit bir tahminle dolduruyor.
İki durumda da aktarmalı yolcuya verilen karar yanlış: ağın bir ucunda
değerli bir koltuk ucuza gidiyor ya da ucuza gitmesi gereken bir koltuk
boş kalıyor.

Yazılım tarafında bunun karşılığı, optimizasyonu bölgelere ya da hub'lara
göre paralel işlere bölme cazibesinin bir bedeli olduğu. Paralelleştirme
hız kazandırıyor ama bölme çizgisini bağlantılı trafiğin geçtiği yerden
çekiyorsa her çizgi bir kenar etkisi üretiyor. Kaynak metnin önerisi
günü bölmemek. Zamanda bölmek (her günü ayrı çözmek) mekânda bölmekten
daha az zarar veriyor, çünkü bir günün aktarmaları o günün içinde
kapanıyor.

## Tüm ağ günde 5 ila 50 kez yeniden hesaplanıyor

Gecelik bir toplu iş ağ optimizasyonu için yetmiyor. Rezervasyonlar gün
içinde gelmeye devam ediyor, analistler de piyasadaki bir değişikliği
gördüklerinde müdahale etmek istiyor. Kaynak metin bu yüzden anlık (ad
hoc) yeniden optimizasyondan bahsediyor: rezervasyon faaliyetlerine ya da
analist taleplerine bağlı olarak tetiklenen bir yeniden hesaplama.

Sıklık için verilen aralık geniş: ağın tamamının ad hoc yeniden
optimizasyonu günde ortalama 5 ile 50 kez arasında değişebiliyor. Bu
süreç operasyonel verimliliği korumak için gerçek zamanlıya yakın
çalışmalı. Kaynak metin bu cümleyi analistlerin ve sistem dinamiklerinin
ağ üzerindeki kontrol sıklığını, yani operasyonel yükü anlatmak için
kullanıyor.

Aralığın alt ve üst ucu arasında on kat fark var ve bu fark mimari için
önemli. Günde beş kez çalışan bir iş için kuyruğa atılıp saatler içinde
bitmek kabul edilebilir. Günde elli kez çalışan bir iş için ortalama
aralık yarım saatin altına iniyor; bir çalıştırma bir sonrakinin
başlangıcına taşarsa sistem birikmiş iş üretiyor ve analist bastığı
düğmenin sonucunu görmeden yeni bir karar veriyor. Tüm ağı kapsama
şartıyla birleşince tablo netleşiyor: işi küçültmek için ağı bölemiyorsun,
sıklığı artırmak için de çalışma süresini kısaltmak zorundasın. Tasarımın
başlangıç noktası, tüm günün programını bu aralığın üst ucuna yetişecek
bir sürede çözebilmek.

Kaynak metnin önerdiği asgari çizgi daha sade: ağ optimizasyonu her gün
en az bir kez, tüm günlük uçuş takvimini kapsayacak şekilde ve 90 günlük
bir projeksiyonla çalıştırılmalı. Ad hoc çalıştırmalar bu tabanın
üzerine geliyor.

## Dinamik programlama doğru ama büyük ağda yetişmiyor

Teorik olarak en temiz cevap dinamik programlama. Rezervasyon süreci
ardışık bir karar dizisi: her talep geldiğinde kabul ya da red, her kararın
sonucu bir sonraki kararın başlangıç durumu. Dinamik programlama bu diziyi
sondan başa çözerek her durumda en iyi kararı veriyor.

Sorunun ilki talebin geliş sırası. Farklı rezervasyon sınıfları arasındaki
zamansal varış sırasını (temporal arrival order) tahmin etmek zor. Kaynak
metin bu yüzden modelin
belirsizlik altında ardışık karar vermeyi simüle eden stokastik bir mantık
kullanması gerektiğini söylüyor. Sırayı bilmediğin için sırayı bir olasılık
süreci olarak modelliyorsun.

İkinci sorun boyut. Kaynak metin büyük ölçekli bir havayolu ağı için
300.000 ile 1.000.000'u aşan hizmet sınıfından bahsediyor. Dinamik
programlamanın durum uzayı her bacağın kalan kapasitesinin bir
kombinasyonu; bacak sayısı arttıkça bu uzay patlıyor. Kaynak metin sonucu
açıkça söylüyor: büyük bir ABD ana havayolu şirketinin geniş ağını çözmek
gerçek zamanlı olarak imkânsız olabilir. Bu cümle, bir önceki başlıktaki
günde 50 kez hedefiyle yan yana konunca asıl gerilimi gösteriyor. Tam
çözüm doğru ama yetişmiyor, yetişen çözüm de yaklaşık.

## Boyutsallık ufku daraltarak ve ağı ayrıştırarak aşılıyor

Kaynak metnin sistemin kilitlenmemesi için önerdiği önceliklendirme iki
parçalı. İlki zaman ufku: sistem gelecekteki 60-90 günlük periyodu hedef
alarak günlük optimizasyon yapmalı. Kalkışa bundan uzak uçuşlar için
rezervasyon henüz az, kararların etkisi küçük; onları her gün ağır
optimizasyonla hesaplamak kapasiteyi en az getiri üreten yere harcamak
demek.

İkinci parça yöntem. Boyutsallık problemini aşmak için hesaplama
açısından daha verimli alternatifler değerlendirilmeli: ağ ayrıştırma
(leg decomposition) ya da doğrusal olmayan programlama. Leg decomposition
ağı bacak bacak ele alıyor. Her bacak kendi başına çözülüyor, ama ağın
geri kalanının etkisi o bacağa bir düzeltme olarak taşınıyor; böylece
aktarmalı yolcunun diğer bacaklarda kullandığı koltukların değeri
tamamen kaybolmuyor. Tam ağ çözümünün doğruluğundan bir miktar
vazgeçiliyor, karşılığında çözüm süresi ağ büyüdükçe patlamıyor.

Uygulanabilir öngörüler kısmı bunu bir seçim kuralına çeviriyor: hesaplama
zorlukları ve boyutsallık sorunları nedeniyle dinamik programlama
uygulanırken ağın büyüklüğüne göre ölçeklenebilir hibrit modeller tercih
edilmeli. Hibrit burada kilit kelime. Dinamik programlamanın ardışık
karar mantığı bırakılmıyor, ama bütün ağa birden değil ayrıştırılmış
parçalara uygulanıyor.

Buradaki mühendislik dersi, önceki başlıklarla çelişiyor gibi görünen bir
şeyi çözmek. Optimizasyonun kapsamı tüm günün programı olmalı, ama tüm
ağı tek bir dinamik programla çözmek imkânsız. Çelişki kapsam ile
yöntem ayrılınca kalkıyor. Kapsam, hangi bacakların aynı hesaba girdiği:
bir günün hepsi. Yöntem, o hesabın nasıl yapıldığı: ayrıştırılmış ve
hibrit. Leg decomposition ağı bölüyor ama kenar etkisi üretmiyor, çünkü
bölerken bacaklar arasındaki bağı bir düzeltme terimi olarak taşıyor.
Bölgesel paralel işler ise bağı tamamen koparıyor.

## Müşteri tercihinin beş özelliği birinci derece etki

Teklif fiyatına upsell ve recapture'ı sokmanın ön koşulu, müşterinin bir
uçuşu ötekine neden tercih ettiğini modellemek. Kaynak metin bunun
değişkenlerini sayıyor: günün saati, toplam seyahat süresi, bağlantı
sayısı, marka bağlılığı ve fiyat. Algoritma bunları birinci derece etkiler
olarak kabul ederek müşteri tercihlerini öngörmeli.

"Birinci derece" ifadesi bir öncelik sırası kuruyor. Bu beş özellik
modelin ince ayarı değil, iskeleti. Kaynak metin bunu gelir yönetiminde
yalnızca kapasiteye değil, müşteri davranışsal verilerine odaklanmanın
önemini vurgulamak için kullanıyor. Kapasite, koltuğun var olup olmadığını
söylüyor; tercih modeli, o koltuk kapandığında yolcunun nereye gideceğini.

Bu listenin recapture ile bağı doğrudan. Bir uçuş kapandığında yolcunun
aynı havayolunun başka bir uçuşuna kayıp kaymayacağı, o uçuşun bu beş
özellikte ne kadar yakın olduğuna bağlı. Saati iki saat kayan ama
direkt kalan bir uçuş, saati aynı olup bir aktarma ekleyen bir uçuştan
farklı bir recapture oranı üretir. Yazılım tarafında bunun karşılığı,
tercih modelinin girdisinin bir uçuş kimliği değil, bir uçuşun
öznitelik vektörü olması. Tarife değiştiğinde, bir uçuşun saati
kaydığında ya da bağlantı eklendiğinde tercih modeli yeniden
eğitilmeden yeni duruma uyum sağlayabilmeli; bu da özniteliklerin
tarife verisinden türetildiği bir boru hattı demek.

## Yarın işe yarayacak dört çıkarım

1. **O&D kontrolü tamamlandıysa sınıf tahsisini bırak.** Tüm pazarlar
   O&D kontrolü altındaysa karmaşık hizmet sınıfı atamaları yerine teklif
   fiyatı odaklı bir modele geç. Müsaitlik servisini sayaç tablosundan
   eşik karşılaştırmasına taşımayı ayrı bir iş olarak planla; iki model
   bir süre yan yana yaşayacaksa sınırda hangisinin karar verdiğini açıkça
   yaz.
2. **Talep tahminine recapture ve upsell'i ekle.** Talep tahmini
   modellerine başka uçuşa kayma ve üst sınıfa çıkma değişkenlerini
   mutlaka entegre et; simülasyon çalışmaları bunun belirgin gelir artışı
   sağladığını gösteriyor. Tercih modelinin girdisini uçuş kimliği değil,
   saat, süre, bağlantı sayısı, marka ve fiyattan oluşan öznitelik seti
   olarak kur.
3. **Optimizasyonu günün bütün programı üzerinde, her gün çalıştır.**
   Kenar etkisini önlemek için ağ optimizasyonunu her gün en az bir kez,
   tüm günlük uçuş takvimini kapsayacak şekilde ve 90 günlük bir
   projeksiyonla çalıştır. Ad hoc tetikleyiciler için günde 5 ile 50
   arasında tam ağ çalıştırmasını kaldıracak bir çalışma süresi hedefle.
4. **Kapsamı koru, yöntemi ayrıştır.** Dinamik programlamayı büyük ağa
   olduğu gibi uygulama; ağın büyüklüğüne göre leg decomposition gibi
   ölçeklenebilir hibrit modelleri tercih et. Hesaplamayı hızlandırmak
   için ağı bölgelere bölmek yerine bacaklar arası bağı taşıyan bir
   ayrıştırma kullan.

Bu bölümde ne yok: O&D talebinin nasıl tahmin edildiği ("O&D talep
tahmini: birinci ve ikinci nesil yaklaşımlar", "O&D tahminleme ve
must-forecast listesi"), tercih modellerinin kendisi ve itinerer
seçiminin nasıl kurulduğu ("Havacılık gelir yönetimi ve tüketici tercih
modellemesi", "İtinerer tercih modelleri ve talep analizi"), kapanan bir
sınıfın arkasında kaybolan talebin miktarı (spill bölümleri). Bu bölüm o
tahminlerin ve tercih modellerinin bir teklif fiyatına nasıl dönüştüğünü,
o hesabın ne kadar sık ve hangi kapsamda yapılması gerektiğini anlatmak
için var.
