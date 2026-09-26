---
title: "Havacılık envanter kontrolü ve O&D yönetimi"
domain: "aviation"
summary: "O&D kontrolü kâğıt üzerinde bir optimizasyon problemi, sahada ise üç mekanizmanın toplamı: GDS'in yerel kopyası yerine havayoluna soran pazar kısıtlı uçuşlar, bağlantılı yolculuğu tek parça tutan evli segmentler ve segmenti bütün yolculuğun içinde fiyatlayan seyahat verisi. Bu bölüm üçünün ne işe yaradığını, neye mal olduğunu ve biri eksikken O&D kontrolünün neden sessizce değer kaybettiğini anlatıyor."
audience: "Envanter, rezervasyon, GDS entegrasyonu ya da gelir yönetimi sistemleriyle çalışan, O&D kontrolünün teoriden rezervasyon mesajına nasıl indiğini anlamak isteyen yazılımcı ve ürün insanı. Yuvalama ve teklif fiyatı kavramlarının bilinmesi işe yarar; market restricted (MR) uçuş, polling fee, AVS/NAVS, married segment ve journey data metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Köken-varış (O&D) kontrolü üzerine yazılanların çoğu optimizasyon tarafında
kalıyor: hangi yolculuk hangi koltuğu hak ediyor, bir bacağın teklif fiyatı
ne olmalı, ağın değeri nasıl hesaplanır. Ama optimizasyonun ürettiği karar,
satış anında sorulan soruya cevap olarak dönmüyorsa hiçbir şey değişmiyor.
**O&D kontrolü bir algoritma değil, satış anında havayolunun sözünü
geçirebildiği bir altyapıdır; o altyapının her parçasının bir faturası var.**
Bu bölüm o altyapının üç parçasına bakıyor: pazar kısıtlı uçuşlar (market
restricted, MR), bağlantılı segmentler (married segments) ve seyahat verisi
(journey data). Birincisi soruyu doğru yere yönlendiriyor, ikincisi satılan
şeyin parçalanmasını engelliyor, üçüncüsü satılan şeyin değerini bütün
yolculuk üzerinden ölçüyor.

Kaynak metin bu üçünü bir "alan ve iş mantığı analizi" gözüyle inceliyor ve
özellikle Amadeus gibi küresel dağıtım sistemleriyle (GDS) olan maliyet
ilişkisinin altını çiziyor. O maliyet ilişkisi bölümün geri kalanının
anahtarı, çünkü O&D kontrolünün teknik olarak mümkün olup ekonomik olarak
kapatıldığı yer tam orası.

## Uygunluk sorusunun kime sorulduğu, O&D kontrolünün kaderini belirliyor

Bir acente GDS ekranında bir uçuşun uygunluğunu sorduğunda cevap iki yerden
gelebilir. Birincisi GDS'in kendi tarafında tuttuğu yerel veri: havayolunun
AVS/NAVS mesajlarıyla beslediği, sınıf bazında açık/kapalı bilgisini taşıyan
kopya. İkincisi havayolunun ana rezervasyon sisteminin (host CRS) kendisi.
Yerel kopya hızlı ve bedava; ama sınıf bazında açık/kapalı bilgisinden
ibaret olduğu için yolculuğun tamamını bilemez. Aynı sınıf, bir yolcu için
tek bacak olarak satıldığında açık, üç bacaklı değerli bir yolculuğun
parçası olarak satıldığında kapalı olmalıysa, bu ayrımı yalnızca yolculuğun
tamamını gören sistem yapabilir.

Pazar kısıtlı uçuş kavramı bu noktada devreye giriyor. Bir uçuş MR
statüsündeyse sistem GDS üzerindeki yerel veriyi (AVS/AVN) kullanmıyor;
gerçek son koltuk durumu (true last availability) için sorguyu doğrudan
havayolunun host CRS'ine gönderiyor. Böylece cevap, O&D mantığını çalıştıran
sistemden, o yolculuğun o anki değerine göre dönüyor.

Bedeli de burada. Havayolu, GDS'in kendisine yönlendirdiği her sorgu için
bir sorgulama ücreti (polling fee) ödüyor. Kaynak metin çatışmayı tek
cümleyle koyuyor: uygunluk AVS/NAVS üzerinden dönerse polling ücretlerinden
kaçınılabilir, ama bu O&D kontrollerinin amacını boşa çıkarır. Yani ya her
sorguya para ödeyip doğru cevap veriyorsun ya da parayı cebinde tutup
sınıf bazlı, yolculuğu görmeyen bir cevapla yetiniyorsun. Arada kalan her
uçuş için bir karar vermek gerekiyor. Kaynak ayrıca Amadeus üzerinde host
edilen havayollarının bu maliyetlere daha hassas olduğunu not ediyor.

Yazılım tarafında bunun karşılığı şu: MR bir bayrak gibi görünse de aslında
bir yönlendirme kuralı. Bayrağın arkasında bir maliyet satırı ve bir gelir
satırı var, ikisi de ayrı sistemlerde ölçülüyor. Bayrağı değiştiren servisin
her iki satırı da görmesi gerekiyor; yalnızca birini gören bir ekip ya
maliyeti ya da O&D kontrolünü sessizce feda eder.

## MR kararı bir uçuş özelliği değil, zamanla değişen bir tavsiye

Bir uçuşun MR statüsüne alınıp alınmayacağı kaynak metinde sabit bir liste
değil, gelir yönetimi sisteminin ürettiği bir tavsiye olarak geçiyor. Bu
tavsiyenin girdileri dört tane: rezerve doluluk oranı (booked load factor),
kalkışa kalan gün sayısı, uçuşta beklenen bağlantılı trafik oranı ve segment
üzerinden akan ücretlerin teklif fiyatıyla (bid price) kıyası.

Dördünün de mantığı aynı soruya çıkıyor: bu uçuşta O&D ayrımı yapmanın
getirisi, her sorgu için ödenen ücreti karşılıyor mu? Doluluk düşükse ve
kalkışa çok zaman varsa, hangi yolculuğa koltuk verileceği henüz kritik
değil; neredeyse her talebi kabul etmek zaten doğru karar. Bağlantılı trafik
azsa ayrım yapılacak yolculuk da az; uçuşu dolduranların çoğu zaten yerel
yolcu. Segmentten akan ücretler teklif fiyatının rahatça üzerindeyse, kaba
bir sınıf bazlı cevap da doğru cevaba yakın düşüyor. Tersine, uçak
dolmaya başladığında, bağlantılı trafik yoğun olduğunda ve ücretler teklif
fiyatına yaklaştığında, hangi yolculuğun koltuğu alacağı kararı gelirin
kendisi haline geliyor.

Kaynak, MR'ı devre dışı bırakıp AVS/NAVS üzerinden cevap vermenin ne zaman
tercih edildiğini de açık yazıyor: GDS polling ücretlerinden kaçınılmak
istendiğinde. Ama bu O&D kontrollerinin değerini düşürdüğü için ancak düşük
bağlantılı trafik beklenen ya da maliyetin kontrolden daha öncelikli olduğu
senaryolarda seçiliyor.

Buradan çıkan mühendislik sonucu, MR statüsünün bir kez atanıp unutulan bir
tarife özelliği olmaması. Doluluk ve kalkışa kalan gün değiştikçe aynı uçuş
bir gün MR dışında, birkaç hafta sonra MR içinde olabilir. Bu da RMS ile
dağıtım katmanı arasında düzenli akan bir statü güncellemesi demek. Statüyü
belirleyen kural ile statüyü GDS'e bildiren mekanizma ayrı yerlerde yaşıyorsa,
aradaki gecikme süresince yanlış taraf cevap veriyor.

## MR, bacak kontrolünden O&D kontrolüne geçişin köprüsü

MR'ın maliyet tarafı kadar önemli bir rolü daha var. Kaynak metin, MR
kabiliyetinin havayollarının bacak/segment bazlı kontrolden tam O&D
kontrolüne kademeli geçişini kolaylaştıran bir köprü olduğunu söylüyor.

Bunun pratik anlamı şu: O&D kontrolüne geçmek bütün ağı bir gecede yeni
mantığa almak zorunda değil. Bağlantılı trafiğin yoğun, O&D ayrımının
getirisinin açık olduğu uçuşlar MR'a alınıp host CRS'e yönlendiriliyor; geri
kalanı sınıf bazlı, yerel kopyadan cevap vermeye devam ediyor. Geçiş uçuş
uçuş ilerleyebiliyor, her adımda polling faturası ile elde edilen ek gelir
karşılaştırılabiliyor.

Yazılım gözüyle bu, bildik bir göç kalıbı: yeni mantığı bütün trafiğe açmak
yerine trafiği bir yönlendirme kuralıyla bölüp yeni yola kontrollü bir dilim
göndermek. Farkı, buradaki dilimin boyutunu teknik risk değil, sorgu başına
ödenen ücret belirliyor.

## Yolculuğu tek parça tutmayan O&D kontrolü, kendi kararını geri satar

MR soruyu doğru sisteme getiriyor. Ama doğru sistemin verdiği cevap, satış
sonrasında korunmazsa yine boşa gidiyor. Bağlantılı segment (married
segment) mantığı bu korumayı sağlıyor.

Kaynak metne göre bir O&D bazlı uygunluk ekranından seçim yapıldığında
sistem seçilen segmentleri satış, fiyatlandırma ve biletleme süreci boyunca
tek bir ünite olarak ele alıyor; bu evlendirme en fazla üç segmenti
kapsıyor. Segmentler evli olarak işaretlendikten sonra kural sert: servisin
içindeki herhangi bir segment iptal edilirse, servisteki bütün segmentler
iptal ediliyor. Kaynak metin bu kuralı İngilizce aslındaki haliyle, tek bir
segmentin iptalinin servisin tamamının iptaline yol açacağı şeklinde veriyor.

Neden bu kadar sert olduğu, O&D kararının neye dayandığına bakınca
anlaşılıyor. Bir bağlantılı yolculuğa verilen sınıf, o yolculuğun bütününün
değerine göre açılmış. Aynı sınıf, bağlantının tek bir bacağı için tek
başına sorulsaydı kapalı olabilirdi. Yolcu ya da acente bağlantılı yolculuğu
rezerve edip sonra işine yaramayan bacağı iptal ederse, elinde yerel pazar
için açılmamış bir fiyattan alınmış tek bir segment kalıyor. Kaynak bunu
envanter manipülasyonu (inventory gaming) olarak adlandırıyor: uygun olmayan
bir segmenti almak için bağlantılı uçuş rezerve edip sonra bağlantıyı
koparmak. Evli segment kuralı bu boşluğu bir talimatla değil, teknik bir
kural setiyle kapatıyor.

Yazılım tarafında bunun karşılığı, evli segmentlerin PNR içinde bağımsız
satırlar gibi değil, tek bir birim gibi davranması gerektiği. İptal, değişiklik
ya da bölme işlemlerinin her biri bu birimi bir bütün olarak ele almak
zorunda; tek bir segmentin durumunu değiştirebilen bir API yolu bırakmak,
kuralı fiilen devre dışı bırakmak demek. Evlilik bilgisinin kendisi de
satışı yapan uygunluk cevabından geliyor; yani O&D ekranı ile PNR arasında
bu bağın kaybolmadan taşınması gerekiyor.

## Evli segment acenteyi de koruyor

Bağlantılı segment mantığı yalnızca havayolunu korumuyor. Kaynak metin
acente tarafındaki etkisini de anlatıyor: satış doğrudan O&D ekranından
yapıldığı için acente yaptığı işlemin geçerli olduğunu biliyor. Bu da
havayolunun hatalı rezervasyon nedeniyle acenteye borç kaydı (debit)
çıkarmasını ya da ek işlem yapmasını önleyen bir iş mantığı oluşturuyor.

Başka bir deyişle, evli segment satış anında verilen O&D kararını hem
havayolu hem acente için bağlayıcı hale getiriyor. Kural baştan
uygulandığında, sonradan denetimle yakalanıp cezalandırılacak bir
rezervasyon zaten oluşmuyor. Yazılım gözüyle bu, doğrulamanın işlem anında
yapılmasının sonradan yapılan mutabakattan ucuz olduğu bilinen durumun
havacılıktaki hali: geçersiz bir durumu üretmeyen bir sistem, geçersiz
durumu sonradan bulan bir sistemden daha az kavga çıkarıyor.

## Segmentin değeri, içinde bulunduğu yolculuk kadar

Üçüncü parça seyahat verisi (journey data). Kaynak metin onu, bir uçuş
segmentinin yolcunun bütün yolculuğuna göre değerlendirilmesini sağlayan
veri olarak tanımlıyor; amaç ürünün gerçek değerine göre fiyatlanması.
Sistem her segmenti bağımsız bir parça olarak değil, yolcunun güzergahıyla
(itinerary) olan ilişkisi içinde değerlendiriyor.

Bu, O&D kontrolünün en temel fikrinin veri tarafı. Aynı koltuk, kısa bir yerel
yolculuğun tamamı olarak satıldığında başka, uzun bir bağlantılı yolculuğun
bir bacağı olarak satıldığında başka bir gelir getiriyor. Seyahat verisi
yoksa sistem segmenti kendi başına görüyor ve yolculuğun geri kalanının
taşıdığı değeri hesaba katamıyor. O zaman O&D kontrolü adını taşısa da
fiilen segment bazlı çalışıyor.

Journey data ile evli segment kontrolü birlikte çalıştığında kaynak metnin
vardığı sonuç şu: envanter yalnızca en yüksek değerli O&D taleplerine
ayrılıyor ve bu havayolu için kademeli gelir (incremental revenue) artışı
yaratıyor. İkisinin neden birlikte gerektiği de açık. Seyahat verisi
koltuğun hangi yolculuğa verilmesi gerektiğini söylüyor; evli segment o
kararın satıştan sonra bozulmamasını sağlıyor. Biri olmadan öteki yarım
kalıyor: değerlemesi doğru ama korunmayan bir karar geri satılıyor,
korunan ama yanlış değerlenmiş bir karar ise sadece yanlışı kalıcı hale
getiriyor.

Yazılım tarafında bunun karşılığı, uygunluk ve fiyat hesabının girdisinin
tek bir segment değil, yolculuğun tamamı olması. Segment bazlı bir API'ye
sonradan eklenen bir "bağlam" alanı çoğu zaman yetmiyor; değerlemeyi yapan
servisin yolculuğu birinci sınıf bir kavram olarak görmesi gerekiyor.

## Üç parça, tek bir zincir

Bölümün üç mekanizmasını yan yana koyunca bir zincir çıkıyor. MR, uygunluk
sorusunun O&D mantığını çalıştıran sisteme ulaşmasını sağlıyor ve bunun
için sorgu başına ücret ödetiyor. Seyahat verisi, o sistemin cevabı segmente
değil yolculuğa göre vermesini sağlıyor. Evli segment, verilen cevabın
satıştan sonra parçalanıp başka bir ürüne dönüştürülmesini engelliyor.

Zincirin herhangi bir halkası eksik olduğunda O&D kontrolü gürültü çıkarmadan
değer kaybediyor. Uçuş MR dışındaysa cevap GDS'in yolculuğu görmeyen yerel
kopyasından dönüyor. Seyahat verisi yoksa cevap doğru yerden ama segment
bazlı dönüyor. Segmentler evli değilse doğru cevap bir iptal işlemiyle geri
alınabiliyor. Üçünde de sistem çalışıyor, rezervasyon alınıyor, hata mesajı
yok; sadece O&D kontrolünün vaat ettiği ek gelir gelmiyor. Bu yüzden bu tür
bir kaybı hata kaydında değil, gelir raporunda aramak gerekiyor.

## Yarın işe yarayacak dört çıkarım

1. **MR statüsünü bir maliyet-getiri kararı olarak yönet.** Hangi uçuşun MR
   olacağına rezerve doluluk oranı, kalkışa kalan gün, beklenen bağlantılı
   trafik oranı ve segmentten akan ücretlerin teklif fiyatına kıyasıyla karar
   ver. Statüyü bir kez atayıp bırakma; bu girdiler değiştikçe tavsiye de
   değişiyor.
2. **Polling faturasını ve O&D gelirini aynı ekranda gör.** MR'ı kapatmak
   polling ücretini düşürüyor ama O&D kontrolünün amacını boşa çıkarıyor.
   Bu takası yalnızca maliyet ya da yalnızca gelir tarafından bakan bir
   ekibe bırakma; özellikle Amadeus üzerinde host ediliyorsan maliyet
   hassasiyeti daha yüksek.
3. **Evli segment kuralına tek segmentlik bir kaçış yolu bırakma.** O&D
   ekranından satılan en fazla üç segmentlik bağlantıyı satış, fiyatlama ve
   biletleme boyunca tek ünite olarak tut; herhangi bir segmentin iptali
   hepsini iptal etsin. PNR'da tek segmentin durumunu değiştiren her yol
   envanter manipülasyonuna açılan bir kapı.
4. **O&D'ye kademeli geç, yolculuk verisini baştan kur.** MR'ı bacak bazlı
   kontrolden O&D kontrolüne uçuş uçuş geçmek için köprü olarak kullan. Ama
   değerlemeyi yapan tarafta journey data'yı baştan birinci sınıf veri olarak
   ele al; segmenti yolculuğundan koparan bir değerleme, O&D kontrolünü
   adında bırakır.

Bu bölümde ne yok: O&D talebinin nasıl tahmin edildiği ("O&D tahminleme ve
must-forecast listesi" ile "O&D talep tahmini: birinci ve ikinci nesil
yaklaşımlar"), teklif fiyatının nasıl hesaplandığı ve sınıfların nasıl iç
içe dizildiği (yuvalama ve teklif fiyatı bölümleri), GDS'in kendisinin
tarihi ve iş modeli (dağıtım bölümleri). Bu bölüm o hesapların sonucunun
satış anında nasıl geçerli kılındığını ve bunun neye mal olduğunu anlatmak
için var.
