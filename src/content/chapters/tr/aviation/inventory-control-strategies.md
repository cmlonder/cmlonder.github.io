---
title: "Havayolu envanter kontrol stratejileri ve ağ etkileri"
domain: "aviation"
summary: "Aynı uçuştaki aynı son koltuk, envanteri hangi ayrıntı düzeyinde kontrol ettiğine göre 225 dolara da 1.712 dolara da satılabilir. Bu bölüm kontrolsüz satıştan bacak, segment ve güzergah kontrolüne giden dört kademeyi tek bir LAX-JFK örneği üzerinden anlatıyor, sonra bir promosyonun ağda nasıl birinci, ikinci ve üçüncü derece etki ürettiğini gösteriyor."
audience: "Envanter, müsaitlik (availability) ya da gelir yönetimi sistemleriyle çalışan, bir koltuk talebinin neden bazen kabul bazen ret aldığını anlamak isteyen yazılımcı ve analist. Rezervasyon sınıfı kavramına aşinalık işe yarar; bacak (leg), segment, güzergah (itinerary), O&D ve birinci/ikinci/üçüncü derece ağ etkisi metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler talebi tahmin etmekle ve kaç koltuğun satışa açılacağıyla
uğraşıyordu: hangi O&D'nin tahmin edilmesi gerektiği, yolcunun hangi
güzergahı seçeceği, gelmeyecek yolcu için kaç koltuk fazla satılacağı. Bu
bölüm o tahminlerin kullanıldığı ana bakıyor: bir koltuk talebi geldiğinde
sistem evet mi diyor, hayır mı. Kaynak metin bu soruyu tek bir koltuk
üzerinden soruyor, uçağın son koltuğu. **Son koltuğun değeri uçağın
özelliği değil, envanteri kontrol ettiğin ayrıntı düzeyinin sonucu; aynı
koltuk kontrol mekanizmasına göre 225 dolara da 1.712 dolara da gidiyor.**
Aradaki fark talebin kendisinde değil, sistemin talebi ne kadar iyi
ayırt edebildiğinde.

Kaynak metnin yönetici özeti gelir yönetimini sınırlı kapasitenin, yani
koltuk envanterinin, en yüksek değeri üretecek şekilde kullanılması olarak
tanımlıyor ve bu işin bir yelpazeye yayıldığını söylüyor. Bir ucunda
hiçbir kontrolün olmadığı ilk gelen alır modeli var. Öbür ucunda bütün
uçuş ağının birbirine bağlı etkilerini hesaplayan menşe ve varış noktası
yönetimi, kısaca O&D. Bölümün geri kalanı bu yelpazeyi dört durakta
yürüyor, sonra durağın sonunda ortaya çıkan ağ etkilerine bakıyor.

## Kontrol yoksa son koltuğu ilk gelen alır, en ucuz sınıf da olsa

Yelpazenin başlangıç noktası kontrolsüz envanter. Koltuklar hiçbir
kısıtlama olmadan satışa açılıyor. Sistem yolcunun hangi segmentten
geldiğine, ne ödediğine, nereye gittiğine bakmıyor. Tek kural sıra: ilk
gelen ilk alır.

Bu modelde son koltuğu kimin alacağı yalnızca talebin geliş sırasına
bağlı. Sistem düşük ücretli bir talebi reddetmek için hiçbir gerekçe
taşımıyor, o yüzden son koltuğu en düşük ücretli sınıfın alması da
mümkün. Kaynak metnin örneğinde son koltuk tam böyle, en düşük ücretli
sınıfa, 225 dolara gidiyor. Metin bunu tek cümleyle koyuyor: envanter
kontrolleri olmadığında son koltuğun değeri 225 dolar.

Bu rakam bir taban. Aşağıdaki her kademe aynı uçağın aynı son koltuğunu
alıyor ve ona daha yüksek bir değer biçmeyi başarıyor. Kazancın tamamı
yeni talep yaratmaktan değil, var olan talep arasında daha iyi seçim
yapmaktan geliyor.

## Bacak kontrolü sınıfı görüyor, yolculuğu görmüyor

İlk kontrol kademesi bacak sınıfı kontrolü (leg class control). Bacak,
uçağın kalkıştan inişe kadar tek bir uçuş parçası; örnekte LAX-JFK.
Sistem bu bacaktaki rezervasyon sınıflarını (Y, B, K gibi) göreceli
değerlerine göre sıralıyor ve düşük sınıfları kapatıp yüksek sınıfa yer
saklıyor. Son koltuk artık ilk gelene değil, en yüksek sınıfa, Y'ye
gidiyor.

Kaynak metnin örneğinde bu, son koltuğun LAX-JFK bacağındaki en düşük Y
sınıfı bedeline, 715 dolara satılması demek. Kontrolsüz duruma göre üç
katından fazla. Metin bunu şöyle anlatıyor: bacak sınıfı envanter
kontrollerinde son koltuk, LAX-JFK bacağından akan en yüksek değerli
rezervasyon sınıfına, Y'ye satılıyor.

Ama bacak kontrolünün kör noktası tam burada. Sistem yalnızca sınıfa
bakıyor, yolcunun nereden gelip nereye gittiğine bakmıyor. Aynı Y
sınıfında oturan iki yolcu düşün: biri yalnızca LAX-JFK uçuyor ve 715
dolar ödüyor, öteki JFK'den aktarma yapıp Roma'ya (FCO) gidiyor ve bütün
güzergah için 1.712 dolar ödüyor. Bacak kontrolü için ikisi aynı yolcu:
ikisi de Y. Hangisinin koltuğu alacağına yine sıra karar veriyor.

Yazılım tarafında bunun karşılığı şu: bacak kontrolünde müsaitlik
sorusunun anahtarı uçuş bacağı ve sınıf. İstek hangi O&D için gelirse
gelsin, aynı bacak ve aynı sınıf için cevap aynı. Bu, sistemi basit ve
hızlı tutuyor, ama bedelini ayırt edilemeyen gelir olarak ödüyor.

## Segment kontrolü uçuş numarasının tamamına bakıyor

Bir sonraki kademe segment sınıfı kontrolü (segment class control).
Segment burada tek bir uçuş numarasının tamamı; bir uçuş numarası birden
fazla bacağı kapsayabiliyor. Sistem kontrolü bacak bazında değil, uçuş
numarası bazında yapıyor. Karar, o segment üzerindeki en yüksek
rezervasyon sınıfı değerine göre veriliyor ve envanter bu değere göre
korunuyor, düşük değerli talep reddediliyor.

Örnekte bu değer 1.426 dolar. Güzergah ücret tablosunda aynı rakam
LAX-LHR Y ücreti olarak geçiyor. Yani segment kontrolü, LAX-JFK
bacağındaki koltuğu yalnızca o bacağın kendi Y ücretine göre değil, aynı
uçuş numarası üzerindeki daha uzun ve daha pahalı yolculuğa göre
değerlendirebiliyor. Son koltuğun değeri 715 dolardan 1.426 dolara
çıkıyor.

Kazanç gerçek ama sınırlı. Segment kontrolü uçuş numarasının içini
görüyor, dışını görmüyor. Yolcu başka bir uçuş numarasına aktarma
yapıyorsa, o bağlantının toplam değeri bu kademenin hesabına girmiyor.
Bir sonraki kademenin kapattığı boşluk tam bu.

## Güzergah kontrolü yerel yolcuyu bağlantılı yolcu için reddedebiliyor

Dördüncü kademe güzergah sınıfı kontrolü (itinerary class control).
Burada sistem bir bacağa ya da uçuş numarasına değil, o bacaktan geçen
bütün güzergahlara bakıyor. İş kuralı, belirli bir uçuş bacağından geçen
ağdaki en yüksek değerli güzergah sınıfını bulmak ve kapasiteyi ona göre
saklamak.

Örnekte LAX-JFK bacağından geçen en değerli güzergah LAX-FCO, 1.712
dolar. Sistem, gerekirse LAX-JFK yerel yolcusunu reddetme pahasına, bu
bağlantılı yolcu için koltuk saklıyor. Son koltuğun değeri 1.712 dolara
çıkıyor; kontrolsüz duruma göre yedi buçuk katından fazla.

Kaynak metin bu kademenin getirdiği yeni yeteneği bir takas olarak
tarif ediyor: güzergah sınıfı kontrolleriyle yerel, doğrudan ve bağlantılı
güzergahların kabul edilmesi ya da reddedilmesi arasında takas
yapılabiliyor. Önceki kademelerde bu takas mümkün değildi, çünkü sistem
takasın iki tarafını ayırt edemiyordu.

Dört kademe yan yana konunca desen netleşiyor. LAX-JFK bacağındaki son
koltuk kontrolsüzken 225 dolar, bacak sınıfı kontrolüyle 715 dolar,
segment sınıfı kontrolüyle 1.426 dolar, güzergah kontrolüyle 1.712 dolar.
Kaynak metin artışın kaynağını açıkça söylüyor: sistemin yerel yolcu
yerine bağlantılı ve daha yüksek değerli güzergahları tercih edebilmesi.
Uçak aynı, koltuk aynı, talep aynı. Değişen, sistemin talebi hangi
anahtarla gördüğü.

Burada gözden kaçmaması gereken bir ayrıntı var. Güzergah kontrolünde
LAX-JFK bacağında daha ucuza uçan bir yolcu, toplam ağda daha yüksek
gelir bırakabiliyor. LAX-FCO yolcusunun LAX-JFK bacağına düşen payı 715
dolardan az olabilir, ama bıraktığı toplam gelir 1.712 dolar. Bacak
bazında düşünen bir analist bu yolcuyu kötü satış sayar; ağ bazında
düşünen biri en iyi satış.

Yazılım tarafında bunun karşılığı şu: müsaitlik sorusunun anahtarı artık
bacak ve sınıf değil, güzergah ve sınıf. Aynı uçuşun aynı sınıfı, LAX-JFK
isteyene kapalı, LAX-FCO isteyene açık olabiliyor. Müsaitlik cevabı
isteğin O&D'sine bağlı hale geliyor. Bu, cevabın önbelleğe alınma
biçiminden, test senaryolarının nasıl kurulduğuna kadar her şeyi
değiştiriyor: yalnızca uçuş ve sınıfla yazılmış bir test, güzergah
kontrolündeki bir ret kararını hata sanabilir.

## O&D yönetimi tek bacağı değil, ağın tamamını optimize ediyor

Güzergah kontrolünün arkasındaki metodolojinin adı O&D gelir yönetimi.
Kaynak metin amacını şöyle koyuyor: toplam geliri maksimize etmek için
kısa, orta ve uzun mesafeli talebin doğru karışımını belirlemek. Buradaki
kilit kelime karışım. Amaç her zaman uzun mesafeli yolcuyu seçmek değil;
kapasite kısıtları altında hangi mesafe karışımının ağın toplamında en
çok geliri bıraktığını bulmak.

Bunun pratik karşılığı kapasite koruması (protection). Talep tahminine
dayanarak, yüksek değerli bağlantılı yolcu için yerel, kısa mesafeli
talep önceden kısıtlanıyor. Bağlantılı yolcu henüz gelmemişken koltuk
onun için saklanıyor, çünkü tahmin onun geleceğini söylüyor. Bu yüzden
güzergah kontrolünün kalitesi, önceki bölümlerde anlatılan O&D tahmininin
kalitesinden bağımsız değil: saklanan koltuğun değeri, gelmesi beklenen
yolcunun gerçekten gelmesine bağlı.

Kaynak metnin optimizasyon üzerine vardığı yargı da bu yönde: model tek
bir uçuş bacağını değil, kapasite kısıtlarını göz önünde bulundurarak
bütün rota ağını aynı anda optimize etmeli. Bacakları tek tek optimize
edip toplamak aynı sonucu vermiyor, çünkü bir bacakta verilen karar öbür
bacaklardaki müsaitliği değiştiriyor. Bu değişimin nasıl yayıldığı
bölümün ikinci yarısının konusu.

## Bir rotadaki promosyon, hiç dokunmadığın pazarları da değiştiriyor

Ağ bazlı kontrolün bedeli şu: bir yerdeki karar başka yerlerde sonuç
doğuruyor. Kaynak metin bunu bir promosyon örneğiyle ve üç derece etki
olarak anlatıyor.

Birinci derece etki doğrudan olanı. Bir rotada, örnekte SEA-DFW, düşük
bir promosyon fiyatı açılıyor. O rotada yerel talep patlıyor. Buraya
kadar beklenen bir şey: fiyatı indirdin, talep arttı.

İkinci derece etki ağdan geliyor. SEA-DFW bacağı yalnızca SEA-DFW
yolcusunu taşımıyor; SEA'dan çıkıp DFW'de aktarma yapan bağlantılı
yolcuları da taşıyor. Yerel talep bacağı doldurmaya başlayınca, kapasite
kısıtı yüzünden sistem bu bacağı kullanan bağlantılı güzergahların
müsaitliğini otomatik olarak kısıtlıyor. Kaynak metne göre sistem bunu
yerel kârlılığı ya da kapasite dengesini korumak için yapıyor. Sonuç:
promosyonun hedeflemediği SEA çıkışlı bağlantılı pazarlarda satış
daralıyor.

Üçüncü derece etki bir adım daha öteye gidiyor. SEA çıkışlı bağlantılı
pazarlar kısıtlanınca, o bağlantıların DFW sonrasında kullandığı
bacaklarda envanter boşalıyor. Bu yer, SEA-DFW bacağını hiç kullanmayan
başka pazarlara açılıyor. Sistem SEA dışındaki menşelerden gelen
uçuşlarda daha fazla müsaitlik sağlıyor ve trafik o yöne kayıyor. Bir
rotada yapılan fiyat değişikliği, bir tur dolaşıp bambaşka şehirlerden
gelen yolcunun daha kolay koltuk bulmasıyla sonuçlanıyor.

Bu zinciri önemli yapan, hiçbir halkasının ayrı ayrı bir hata
olmaması. Her adımda sistem tam olarak tasarlandığı şeyi yapıyor. Ama
promosyonu açan ekip genellikle yalnızca birinci derece etkiyi ölçüyor:
SEA-DFW'de satış arttı mı. İkinci derecede kaybedilen bağlantılı geliri
ve üçüncü derecede başka pazarlara kayan trafiği görmüyorsa, promosyonun
gerçek maliyetini de bilmiyor.

Yazılım tarafında bunun karşılığı, fiyat değişikliğinin etki analizinin
değiştirilen rotayla sınırlı kalamaması. Bir promosyonun sonucunu
ölçen rapor, o bacaktan geçen bağlantılı pazarların ve o bağlantıların
paylaştığı diğer bacakların müsaitlik değişimini de göstermiyorsa,
eksik bir resim çiziyor.

## Kontrolü inceltmek geliri artırıyor, açıklamayı zorlaştırıyor

Dört kademeye geri dönüp bakınca bir eğilim görünüyor. Her kademe bir
öncekinden daha fazla gelir buluyor, ama bunu kararın kapsamını
genişleterek yapıyor: bacaktan uçuş numarasına, uçuş numarasından
bütün güzergahlara, güzergahlardan bütün ağa. Kapsam genişledikçe tek
bir ret kararının nedeni de uzaklaşıyor.

Kontrolsüz modelde bir yolcunun neden koltuk bulamadığını açıklamak kolay:
uçak dolu. Bacak kontrolünde de kolay: o sınıf kapalı. Güzergah
kontrolünde cevap, başka bir şehirden gelecek başka bir yolcunun tahmin
edilen değeri. Ağ etkilerinin olduğu yerde cevap, hiç ilgisi yokmuş gibi
görünen bir rotadaki promosyon olabiliyor. Kaynak metin bu açıklanabilirlik
bedeli üzerine bir şey söylemiyor, ama kademelerin mantığı bunu kaçınılmaz
kılıyor: sistem ne kadar çok şeyi hesaba katıyorsa, bir kararın izini
sürmek için o kadar çok şeye bakmak gerekiyor.

## Yarın işe yarayacak dört çıkarım

1. **Yolcuyu güzergah değeriyle değerlendir.** Envanter kararında yalnızca
   koltuk sınıfına bakma, yolcunun bütün O&D değerine bak. Bir bacakta
   daha ucuza uçan yolcu, ağın toplamında daha yüksek gelir bırakıyor
   olabilir.
2. **Bağlantılı yolcu için kapasiteyi önceden koru.** Talep tahminine
   dayanarak yerel, kısa mesafeli talebi yüksek değerli bağlantılı yolcu
   lehine önceden kısıtla. Bu korumanın değeri, tahminin kalitesi kadar.
3. **Promosyonu açmadan önce ağda simüle et.** Düşük promosyon ücretinin
   yalnızca o rotadaki talebini değil, aynı bacağı kullanan bağlantılı
   uçuşları nasıl kısıtlayacağını (ikinci derece) ve trafiği hangi
   pazarlara kaydıracağını (üçüncü derece) de hesapla.
4. **Optimizasyonu bacakta değil ağda yap.** Modeli tek bir uçuş bacağı
   için değil, kapasite kısıtlarını göz önünde bulundurarak bütün rota
   ağı için aynı anda kur. Bacakları tek tek optimize edip toplamak,
   bir bacaktaki kararın öbürlerine yansımasını kaçırıyor.

Bu bölümde ne yok: güzergah kontrolünün dayandığı O&D talebinin nasıl
tahmin edildiği ("O&D talep tahmini: birinci ve ikinci nesil yaklaşımlar"
ve "O&D tahminleme ve must-forecast listesi"), yolcunun alternatif
güzergahlar arasında nasıl seçim yaptığı ("İtinerer tercih modelleri ve
talep analizi") ve reddedilen talebin kaybının nasıl ölçüldüğü (spill
bölümleri). Bu bölüm yalnızca iki şeyi netleştirmek için var: kontrolün
ayrıntı düzeyi son koltuğun değerini nasıl değiştiriyor, ve ağ bazlı bir
kontrol bir rotadaki kararı ağın geri kalanına nasıl yayıyor.
