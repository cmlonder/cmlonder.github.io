---
title: "Havacılık gelir yönetimi ve tüketici tercih modellemesi"
domain: "aviation"
summary: "Klasik talep tahmini bir uçuşa kaç yolcu geleceğini geçmiş rezervasyonlardan çıkarır; tercih modellemesi ise yolcunun önündeki seçenekler arasından neden birini seçtiğini modeller. Bu bölüm fayda fonksiyonunu, çok terimli logit (MNL) modelini, bir seçenek kapandığında talebin nereye kaydığını ve bu kaymanın varsayımının nerede kırıldığını anlatıyor."
audience: "Talep tahmini, envanter kontrolü ya da markalı ücret ailesi tasarımıyla çalışan, seçim modelinin hangi varsayımla ne ürettiğini anlamak isteyen yazılımcı ve analist. Spill bölümlerinin okunmuş olması işe yarar; beyan edilen ve ortaya çıkarılan tercihler, fayda fonksiyonu, MNL, ölçek parametresi, IIA ve yer değiştirme süresi metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Spill bölümleri talebi bir sayı olarak ele alıyordu: bu uçuşa ortalama kaç
yolcu gelmek istiyor, dağılımı ne kadar oynak, kapasite bunun ne kadarını
kesiyor. O sayının nereden geldiği sorulmuyordu. Talep uçuşun bir
özelliğiymiş gibi davranılıyordu; oysa yolcu bir uçuşu değil, önündeki
listeden bir seçeneği satın alıyor. Aynı saatte daha ucuz bir rakip, daha
kısa bir aktarma ya da daha geniş bir uçak varsa, "bu uçuşun talebi" başka
bir şeye dönüşüyor. **Talep, havayolunun sunduğu seçeneklerin bir
fonksiyonu; seçenek değiştiğinde talep de değişir, ve bunu modellemeyen
bir tahmin sistemi kendi kararlarının etkisini göremez.** Bu bölüm bu
bakışın iki kullanımını anlatıyor: ürün paketini tasarlarken tercihi
ölçmek, ve envanter açılıp kapanırken talebin nereye kayacağını
hesaplamak.

## Paket, yolcunun karşılık verdiği niteliklerden kurulur

Markalı ücret aileleri (branded fare families) tercih modellemesinin en
görünür uygulaması. Havayolu tek tek satılabilecek hakları bir araya
getirip isimlendiriyor. Kaynak metnin örneği Air Canada'nın Latitude
paketi: bagaj hakkı, lounge erişimi ve değişiklik ücreti muafiyeti ek
ücret ödenmeden tek üründe toplanıyor.

Buradaki tasarım sorusu "hangi hakları koyalım" değil, "yolcu hangi
niteliğe karşılık veriyor ve o nitelik için ne kadar ödemeye razı".
Lounge erişimi bir segment için paketin tek gerekçesi olabilir, başka bir
segment için sıfır değer taşıyabilir. Pakete değer katmayan bir nitelik
yalnızca maliyet ekler; yolcunun gerçekten istediği bir niteliği pakete
koymamak ise o yolcuyu bir alt pakete ya da rakibe iter. Karar, tüketici
tercihlerini etkileyen niteliklerin (attributes) belirlenmesine dayanıyor.

Bunu ölçmenin iki yolu var. Birincisi beyan edilen tercihler (stated
preferences): anket ya da birleşik analiz (conjoint analysis) ile yolcuya
varsayımsal paketler gösterip hangisini seçeceğini sormak. İkincisi ortaya
çıkarılan tercihler (revealed preferences): gerçek satın alma verisinden
yolcunun ne yaptığını okumak.

## Yolcunun söylediği, yaptığının yerine geçmez

Kaynak metin iki yaklaşım arasında taraf tutuyor ve gerekçesi basit.
Beyan edilen tercihte ne müşterinin dürüstlüğü ne de gerçek satın alma
anındaki psikolojisi garanti edilebiliyor. Ankette "değişiklik
esnekliği için daha fazla öderim" diyen yolcu, ödeme ekranında iki fiyat
yan yana durduğunda ucuz olanı seçebiliyor. Anket bir niyet ölçüyor,
satış verisi bir davranış.

Ortaya çıkarılan tercihlerin ikinci avantajı daha teknik: kaynak metne
göre gerçek satın alma verisine dayandığı için tüketicinin davranışını
açık bir fayda fonksiyonu belirtmeden tahmin etmeye olanak tanıyor, ve
veri erişilebilir olduğu sürece daha üstün bir doğruluk sağlıyor. Şart
cümlenin sonunda: veri erişilebilir olduğu sürece. Hiç satılmamış bir
paketin satış verisi yok. Yeni bir niteliği ilk kez piyasaya sürerken
anket tek kaynak olabilir; ürün satışa çıktıktan sonra ise modelin
beslendiği yer satış kaydına dönmeli.

Yazılım tarafında bunun karşılığı şu: paket tasarımını besleyen veri
hattı, yalnızca satılan paketi değil, yolcunun o anda gördüğü seçenekleri
de kaydetmeli. "Latitude satıldı" bilgisi tek başına yarım; yolcunun
önünde hangi paketlerin hangi fiyatlarla durduğu bilinmeden, neyi neye
tercih ettiği okunamaz. Ortaya çıkarılan tercih, seçimle birlikte seçim
kümesinin de saklanmasını gerektiriyor.

## Seçim, fayda puanı en yüksek seçeneğe gider

Tercih modellemesinin çekirdek varsayımını kaynak metin şöyle kuruyor:
tüketici seçimi modelleme yaklaşımı, tüketicilerin uçuş arama süreci
sırasında bir dizi alternatif arasından bir itinerer seçtiğini varsayar.
İtinerer, yolcunun satın aldığı uçuş planı: tek bir direkt uçuş ya da
aktarmalı bir bacak dizisi. Bu cümlenin sonucu büyük. Havayolu artık
yalnızca kendi kapasitesine değil, pazarın tamamındaki seçenek kümesine
(choice set) bakmak zorunda, çünkü yolcunun karşılaştırdığı küme rakibin
uçuşlarını da içeriyor.

Her alternatif için sistem bir fayda fonksiyonu (utility function, Ui)
hesaplıyor. Fonksiyon deterministik bileşenlerin toplamı: pazar
büyüklüğü, uçak tipi (geniş gövde, turbojet gibi), uçuşun direkt mi
aktarmalı mı olduğu, fiyat, kalkış ve varış saatleri, taşıyıcı tercihi.
Yolcunun en yüksek faydayı sağlayan alternatifi seçeceği varsayılıyor.

Değişkenlerin her biri aynı ağırlıkta değil. Fayda fonksiyonundaki her
değişken (Xj) için bir parametre (βj) tahmin ediliyor ve bu parametre, o
özelliğin tercih üzerindeki göreceli önemini tanımlıyor. Geniş gövdeli
uçak tercihi, β katsayısı üzerinden toplam fayda puanını artıran bir
kriter olarak modele giriyor. Fayda böylece Ui = β1·X1 + β2·X2 + ... gibi
doğrusal bir toplam oluyor; modeli kalibre etmek, geçmiş seçimlerden bu
β'ları çıkarmak demek.

Bu yapının getirdiği şey karşılaştırılabilirlik. "Geniş gövde mi daha
önemli, yoksa kırk dakika daha iyi bir kalkış saati mi" sorusu, iki
katsayı aynı ölçekte durduğu için cevaplanabiliyor. Fiyat katsayısı
da aynı ölçekte durduğunda her niteliğin para cinsinden karşılığı
okunabiliyor. Paket tasarımındaki "yolcu bunun için ne kadar öder"
sorusunun matematiksel cevabı tam olarak bu oran.

## Fiyat ve zaman, faydayı aşağı çeken iki değişken

İki değişken iş mantığında özel yer tutuyor. Birincisi yer değiştirme
süresi (displacement time): yolcunun uçmak istediği saat ile gerçek uçuş
saati arasındaki fark. Kural açık: fark arttıkça uçuşun fayda puanı
düşüyor. Sabah dokuzda uçmak isteyen yolcu için yedi buçuk uçuşu dokuz
uçuşundan daha az çekici; öğleden sonra ikideki uçuş ise daha da az. Bu
değişken yolcunun alternatif bir uçuşa ya da rakip havayoluna yönelip
yönelmeyeceğine karar veren bileşen, dolayısıyla tarife kararının talebe
nasıl yansıdığını modele taşıyan kanal.

İkincisi fiyat. Kaynak metinde fiyat gidiş-dönüş ücretinin yarısı olarak
alınıyor ve fayda fonksiyonuna negatif bir katsayıyla giriyor: fiyat
arttıkça fayda düşüyor. Fiyatı modele doğrudan koymanın pratik getirisi,
sistemin büyük indirimlere ve kampanya dönemlerine hızlı tepki
verebilmesi. Zaman serisi tabanlı bir tahmin, kampanya haftasındaki
sıçramayı ancak birkaç hafta geriden, geçmiş veriye işlendikten sonra
görür. Fiyat bir açıklayıcı değişken olduğunda ise model, fiyat değiştiği
anda seçimin nasıl değişeceğini hesaplayabiliyor.

Yazılım tarafında bu iki değişkenin karşılığı veri bağımlılığı. Yer
değiştirme süresini hesaplamak için yolcunun istediği saat gerekiyor;
arama isteğindeki tarih ve saat tercihi bu yüzden atılacak bir log
satırı değil, modelin girdisi. Fiyat için ise rakip fiyatının da bilinmesi
gerekiyor, çünkü seçim kümesi rakibi içeriyor. Kendi fiyatını bilen ama
rakibinkini bilmeyen bir seçim modeli, kümenin yarısıyla çalışıyor.

## MNL, fayda puanlarını pazar payına çeviriyor

Fayda puanı tek başına bir olasılık değil. Puanları seçim olasılığına,
dolayısıyla pazar payına çeviren en yaygın yapı çok terimli logit
(multinomial logit, MNL). MNL'de her alternatifin payı, fayda puanının
üstel değerinin tüm alternatiflerin üstel değerleri toplamına oranı:
Pi = exp(μ·Ui) / Σ exp(μ·Uj). Buradaki μ ölçek parametresi.

Ölçek parametresi modelin ne kadar "kararlı" davrandığını belirliyor.
Kaynak metne göre μ sıfıra yaklaştırıldığında model pazar payını bütün
alternatiflere eşit dağıtıyor: fayda farkları önemsizleşiyor, her seçenek
aynı payı alıyor. μ aşırı büyütüldüğünde model yalnızca maksimum faydayı
sağlayan seçeneğe odaklanıyor: en iyi puan her şeyi alıyor, ikinci en iyi
hiçbir şey. Gerçek pazar ikisinin arasında duruyor, ve standart
uygulamada μ genellikle 1'e sabitleniyor. Yazılım tarafında bu, μ'nün
bir ayar düğmesi gibi pazar pazar oynanacak bir değer değil, kalibrasyon
sözleşmesinin sabit bir parçası olarak kayıt altına alınması demek.

Talep tahmininde bu yapının yeri şu: geleneksel zaman serileri bir
uçuşun geçmişteki rezervasyon eğrisine bakıp geleceği çiziyor. Seçim
modelleri ise gerçek seçim sürecini simüle ediyor. Fark, havayolu
bir şeyi değiştirdiğinde ortaya çıkıyor. Tarife kayarsa, fiyat değişirse
ya da rakip yeni bir sefer koyarsa, zaman serisinin geçmişi artık geçerli
değil; seçim modeli ise yeni kümeyle yeniden hesaplanabiliyor.

## Bir sınıf kapandığında talep yok olmuyor, kayıyor

Seçim modelinin envanter kontrolüne asıl katkısı burada. Bir ücret sınıfı
ya da uçuş satışa kapandığında (sold out), o seçeneği seçecek olan yolcu
ortadan kalkmıyor. MNL ile satın alma olasılığı anlık olarak yeniden
hesaplanabiliyor: kapanan seçenek kümeden çıkarılıyor, kalan
alternatiflerin payları yeniden normalleşiyor.

Bu normalleşmenin bir kuralı var. MNL'nin IIA özelliği gereği kapanan
seçeneğin talebi, kalan açık alternatiflere çekicilikleri oranında
dağıtılıyor. Buna orantılı yeniden çekim (proportional re-attraction)
deniyor. Kalan iki uçuştan birinin payı ötekinin iki katıysa, kapanan
seçenekten gelen yolcuların da iki katı o uçuşa gidiyor. Kaynak metin
IIA'yı ilgisiz niteliklerin bağımsızlığı olarak adlandırıyor; seçim
modelleri literatüründe aynı kısaltma daha çok ilgisiz alternatiflerin
bağımsızlığı olarak geçiyor. Adı ne olursa olsun anlamı aynı: iki
alternatifin birbirine göre oranı, kümede başka hangi alternatiflerin
bulunduğundan etkilenmiyor.

Spill bölümlerinden bakınca bu, recapture sorusunun modelle cevaplanmış
hali. Taşan yolcunun ne kadarının aynı havayolunun başka uçuşuna, ne
kadarının rakibe gideceği sabit bir oran olarak girilmiyor; seçim
kümesindeki faydalardan hesaplanıyor. Yazılım tarafında bunun karşılığı,
envanter kararının bir sınıfı kapatırken yalnızca o sınıfın gelirini
değil, talebin kayacağı yerlerin gelirini de hesaba katabilmesi. Bunun
için tahmin servisi, "bu uçuşun bu sınıfındaki talep" yerine "bu seçim
kümesi verildiğinde her seçeneğin payı" döndürmeli; aynı çağrı küme
değiştiğinde yeniden yapılabilmeli.

## Orantılı yeniden çekim, benzemeyen seçenekler arasında bozuluyor

IIA'nın gücü aynı zamanda zayıflığı. Kaynak metin sınırı açıkça
koyuyor: MNL modelinin bir eksikliği IIA özelliği, ve uçuş kalkış
saatleri birbirine yakın olmadığında orantılı yeniden çekim makul
olmayabilir.

Somut bir durum düşünelim. Sabah sekiz, sabah dokuz ve akşam altı
uçuşları var. Sabah dokuz kapanıyor. MNL, bu uçuşun yolcularını sabah
sekiz ile akşam altıya, iki uçuşun o ana kadarki payları oranında
dağıtıyor. Akşam uçuşu fiyatı ya da uçağı sayesinde büyük pay alıyorsa,
sabah dokuzdan kayan yolcuların büyük kısmı da ona gidiyor. Gerçekte
sabah dokuzu seçmiş yolcu, bir saat öncesine kaymayı akşama kaymaya
açıkça tercih eder; iki sabah uçuşu birbirinin yakın ikamesi, akşam uçuşu
değil. MNL bu yakınlığı göremiyor, çünkü kümenin içinde hangi
alternatiflerin birbirine benzediğini bilmiyor.

Kaynak metnin önerdiği çıkış, uçuşlar arasında uzun saat farkları
olduğunda basit MNL yerine iç içe geçmiş seçim modelleri (nested choice
models) gibi daha karmaşık yapılara gitmek. Bu modeller benzer
alternatifleri bir yuvada topluyor; bir seçenek kapandığında talep önce
aynı yuvadaki kardeşlerine, sonra dışarıya kayıyor. Bedeli daha fazla
parametre ve daha zor kalibrasyon.

Buradan çıkan mühendislik kararı, modelin tek bir yerde sabitlenmemesi.
Birbirine yakın saatlerde çok sefer olan yoğun bir pazarda MNL'nin
varsayımı makul olabilir; günde iki seferin sabah ve akşama dağıldığı bir
pazarda aynı varsayım kaymayı sistematik olarak yanlış yöne çeker. Seçim
modeli servisinin arayüzü, MNL ile iç içe model arasında pazar bazında
geçiş yapılabilecek şekilde kurulmalı; hangi pazarda hangisinin
kullanıldığı da çıktıyla birlikte görünmeli.

## Yarın işe yarayacak üç çıkarım

1. **Paketi satış verisiyle tasarla.** Markalı ücret ailesine hangi
   niteliğin gireceğine yalnızca anketle karar verme. Gerçek satın alma
   verisinden ödeme istekliliğini çıkar, ve bunun için satılan paketle
   birlikte yolcunun o anda gördüğü seçenekleri de kaydet. Anketi yalnızca
   henüz satış verisi olmayan yeni nitelikler için kullan.
2. **Sınıf kapanınca talebin nereye gideceğini hesapla.** Bir uçuş ya da
   sınıf kapandığında talebin diğer uçuşlara nasıl kayacağını MNL tabanlı
   yeniden çekimle öngör; envanter kararını yalnızca kapanan sınıfın
   geliri üzerinden verme. Kalkış saatleri birbirinden uzak uçuşların
   olduğu pazarlarda orantılı kaymanın yanıltabileceğini bil ve iç içe
   modeli devreye alabilecek bir yapı kur.
3. **Fayda değişkenlerini yalnızca fiyatla sınırlama.** Uçak tipi, aktarma
   sayısı ve kalkış saati gibi fiyat dışı etkenleri β parametreleriyle
   ayrı ayrı kalibre et. Yer değiştirme süresini hesaplayabilmek için
   yolcunun istediği saati, seçim kümesini tamamlayabilmek için rakip
   fiyatını veri hattına al.

Bu bölümde ne yok: seçim modelinin bir optimizasyon problemine nasıl
bağlandığı, köken-varış (O&D) bazlı tahminin ayrıntıları ve markalı ücret
ailelerinin rezervasyon sınıflarına nasıl eşlendiği. Taşan talebin
hesaplanması ve dağılım varsayımları spill bölümlerinde, özellikle
"Havacılıkta spill (taşan talep) modeli ve iş mantığı analizi" ve
"Yüksek varyanslı talep ve iki aşamalı Cox dağılımı" başlıklarında;
özel ücretler ve fiyat esnekliği "Havacılıkta özel ücretler ve fiyat
esnekliği" bölümünde. Bu bölüm yalnızca talebi bir sayı olmaktan çıkarıp
bir seçim olarak modellemenin ne kazandırdığını ve nerede kırıldığını
göstermek için var.
