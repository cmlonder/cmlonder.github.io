---
title: "İtinerer tercih modelleri ve talep analizi"
domain: "aviation"
summary: "Bir uçuşun pazar payı yalnızca fiyattan değil, toplam seyahat süresi, uçak tipi ve servis kalitesinden oluşan bir fayda puanından çıkıyor. Bu bölüm o puanın talebi seçenekler arasında nasıl paylaştırdığını, uçuş kalktığında ya da dolduğunda talebin nereye gittiğini, çok terimli lojit modelinin IIA varsayımının bu kaymayı neden yanlış hesapladığını ve havayolunun kendi rezervasyon verisinin neden yetmediğini anlatıyor."
audience: "Talep tahmini, tarife planlama ya da gelir yönetimi sistemleriyle çalışan, taşan talebin nereye aktığını modelleyen yazılımcı ve analist. Spill bölümlerinin okunmuş olması işe yarar; itinerer, fayda (utility), çok terimli lojit (MNL), IIA, nested logit, zaman bandı ve shopping verisi metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Spill bölümleri bir soruya cevap veriyordu: uçuş dolduğunda kaç yolcu
kapıdan dönüyor. Bu bölüm bir sonraki soruyu soruyor: dönen yolcu nereye
gidiyor? Aynı havayolunun bir sonraki seferine mi, rakibin aynı saatteki
uçuşuna mı, yoksa hiç uçmamaya mı? Cevap, yolcunun seçenekleri nasıl
tarttığına dair bir modele bağlı. **Havayolu talebi bir uçuşa değil bir
pazara gelir; uçuşlar o talebi kendi çekiciliklerine göre paylaşır, ve bu
paylaşımı yanlış modelleyen sistem kaybettiği yolcuyu da yanlış yere
yazar.** Bölüm o çekiciliğin neyden oluştuğunu, talebin seçenekler
arasında nasıl dağıldığını ve en yaygın modelin hangi noktada gerçeğe
uymadığını anlatıyor.

Önce terim. İtinerer (itinerary), yolcunun bir kalkış noktasından bir
varış noktasına gitmek için satın aldığı somut seyahat planı: hangi uçuş,
hangi saat, aktarmalıysa hangi bağlantı. Aynı şehir çifti için pazarda
aynı anda onlarca itinerer bulunabilir; bir kısmı sizin, bir kısmı
rakiplerin. Yolcu bunlardan birini seçer. Modelin işi, bu seçimin
olasılığını hesaplamak.

## Pazar payını fiyat değil fayda belirliyor

Kaynak metin bir itinererin pazar payını tek bir bileşik puana bağlıyor:
fayda (utility). Bu puanın bileşenleri şunlar: toplam seyahat süresi
(elapsed time), uçak tipi (jet, bölgesel jet ya da pervaneli uçak) ve
servis kalitesi. Servis kalitesi de kendi içinde ölçülebilir metriklere
ayrılıyor: zamanında kalkış performansı, bagaj işlemleri ve overbooking
metrikleri. Fiyat bu listede tek başına belirleyici değil; aynı fiyata
satılan iki itinererden biri daha kısa sürüyorsa ya da jetle uçuyorsa,
payın büyüğünü o alıyor.

Toplam seyahat süresinin etkisi en net olanı: süre kısaldıkça itinererin
çekiciliği artıyor. Bu, doğrudan uçuşun aktarmalıya, kısa bağlantılı
aktarmanın uzun bağlantılıya neden baskın geldiğini açıklıyor. Uçak tipi
ve servis kalitesi ise yolcunun doğrudan ödemediği ama tercihinde tarttığı
bileşenler. Rötar geçmişi kötü bir uçuş, fiyat aynı kalsa bile pazar
payından kaybediyor.

Paylaşım mantığı da basit: her itinererin payı, kendi çekiciliğinin
pazardaki bütün seçeneklerin toplam çekiciliği içindeki ağırlığına göre
belirleniyor. Toplam pazar talebi sabit bir havuz; itinererler o havuzdan
faydalarıyla orantılı pay alıyor. Model tek bir uçuşun talebini değil,
bütün seçeneklerin talebini birlikte hesaplıyor.

Yazılım tarafında bunun karşılığı veri modelinde başlıyor. Talep tahmini
uçuş numarasına bağlı bir sayı olarak tutulursa bu paylaşım ifade
edilemiyor. Doğru birim pazar (kalkış-varış çifti ve gün), altındaki
satır ise o pazardaki her itinererin fayda bileşenleri. Pay, bu
bileşenlerden türetilen bir hesap; saklanan bir değer değil.

## Tarife değişince model yeniden eğitilmiyor, yeniden dağıtılıyor

Fayda tabanlı modelin asıl gücü, tarife değiştiğinde ortaya çıkıyor.
Kaynak metin bağlantı süresi örneğini veriyor: bir aktarmalı itinererin
bağlantı süresi 3 saatten 90 dakikaya indiğinde, o itinererin fayda
katsayısı artıyor. Sistem bunun için yeni veri toplamıyor. Güncellenmiş
fayda değeriyle toplam pazar talebini mevcut seçenekler arasında yeniden
dağıtıyor. Kısalan bağlantı pay kazanıyor, kazandığı pay diğer
itinererlerden geliyor, pazarın toplamı değişmiyor.

Aynı mantık bir uçuşun tarifeden tamamen kalkmasında da çalışıyor. Bir
itinerer geçerli seçenek olmaktan çıktığında sistem tüketici tercih
modelini yeniden kalibre etmiyor. Kalan itinererlerin çekicilik
oranlarını kullanarak kalkan uçuşun payını onlar arasında paylaştırıyor.
Model bir kez kurulmuş; tarife onun girdisi.

Bunun planlama tarafındaki değeri büyük. Tarife ekibi "bu uçuşu kaldırırsak
yolcusu nereye gider" ya da "bağlantıyı kısaltırsak ne kazanırız" diye
sorduğunda cevap için geçmişte o senaryoyu yaşamış olmak gerekmiyor.
Mevcut fayda katsayılarıyla senaryo hesaplanabiliyor. Yazılım tarafında
bu, tercih modelinin iki ayrı katmana bölünmesi demek: seyrek çalışan ve
tarihsel veriyle katsayıları üreten kalibrasyon işi, bir de sık çalışan ve
yalnızca güncel tarifeyi alıp payları yeniden hesaplayan dağıtım işi.
İkincisi ucuz ve hızlı olmalı, çünkü tarife senaryoları onu defalarca
çağırıyor. İkisini aynı süreçte tutmak, her senaryo için gereksiz yere
kalibrasyon maliyeti ödemek demek.

## Taşan talep çekicilikle orantılı olarak diğer seçeneklere akıyor

Bir uçuş tarifeden kalkmadan da talebini taşıyamayabilir: koltuk sayısı
düştüğünde, ya da talep kapasiteyi aştığında. Bu durumda kabul edilemeyen
fazla talep, yani spill, kaybolmuyor. Kaynak metin kuralı açık koyuyor:
kapasite kısıtlı olduğunda fazla talep, diğer itinererlerin çekiciliğiyle
orantılı olarak kalan seçeneklere yeniden dağıtılıyor.

Bu cümle spill bölümlerindeki hesabı tamamlıyor. Orada soru, bir uçuşun
kaç yolcuyu geri çevirdiğiydi. Burada soru, geri çevrilen yolcunun hangi
uçuşa kaydığı. İkisi birlikte bir kapasite kararının gerçek bedelini
veriyor: taşan yolcunun büyük kısmı aynı havayolunun başka bir seferine
gidiyorsa kayıp küçük, rakibin uçuşuna gidiyorsa kayıp tam.

Kaynak metin bu noktanın bağlamını da veriyor: gelir yönetimi
sistemlerinin yalnızca fiyat odaklı değil, operasyonel kapasite odaklı da
çalışması gerektiği. Bir uçuşa daha küçük uçak koymak ya da bir sınıfı
kapatmak o uçuşun gelirini değil, bütün pazarın dağılımını değiştiriyor.
Yazılım tarafında bu, kapasite kısıtı bir uçuşa uygulandığında
yeniden dağıtımın aynı pazardaki bütün itinererler üzerinde tekrar
çalışması gerektiği anlamına geliyor. Uçuş bazında kapalı bir hesap,
taşan talebi ya sıfıra yazar ya da hiç yazmaz.

## Çok terimli lojit sabah yolcusunu akşam uçuşuna gönderiyor

Buraya kadar anlatılan paylaşım mantığının en yaygın matematiksel biçimi
çok terimli lojit (Multinomial Logit, MNL) modeli. Model güçlü bir
varsayım taşıyor: IIA, yani ilgisiz alternatiflerden bağımsızlık
(Independence from Irrelevant Alternatives). Varsayım, iki seçenek
arasındaki tercih oranının pazardaki diğer seçeneklerden etkilenmediğini
söylüyor. Yeni bir seçenek eklendiğinde ya da biri çıkarıldığında, kalan
seçeneklerin birbirine oranı sabit kalıyor.

Kağıt üzerinde temiz duran bu varsayım, havayolunda somut bir hata
üretiyor. Diyelim bir pazarda iki sabah uçuşu ve bir akşam uçuşu var.
Sabah uçuşlarından biri kalktığında, onu seçen yolcunun büyük kısmı
gerçekte diğer sabah uçuşuna geçer; sabah uçmak isteyen biri için akşam
uçuşu zayıf bir ikame. MNL ise kalkan uçuşun payını kalan iki seçeneğe
yalnızca çekicilikleri oranında dağıtıyor. Akşam uçuşunun çekiciliği
diğer sabah uçuşuna yakınsa, talebin neredeyse yarısını akşama yazıyor.
Kaynak metin bunu kalkış saatleri arasında büyük fark olan uçuşlarda
talebin yanlış, eşite yakın dağıtılması olarak tarif ediyor ve sonucunu
açıkça söylüyor: tahmin hatası.

Hatanın kaynağı modelin yolcunun gözünde hangi seçeneklerin birbirine
yakın olduğunu bilmemesi. Her seçeneği diğer her seçeneğe eşit uzaklıkta
sayıyor. Kaynak metnin parametre özetinde IIA özelliği için yazılan not
bu yüzden kısa: yanlış kullanıldığında talep tahmin hatalarına yol açıyor.

Yazılım tarafında bu hatanın zararı, fark edilmesinin zor olması. MNL
her zaman bir sayı üretir ve toplamlar tutar; pazar talebi korunur, payların
toplamı bire eşittir. Hata yalnızca dağılımın şeklinde, hangi uçuşun
fazla, hangisinin eksik tahmin edildiğinde saklı. Tutarlılık kontrolleri
bunu yakalamıyor. Yakalamanın yolu, geçmiş tarife değişikliklerinde
modelin öngördüğü kaymayı gerçekleşen rezervasyonlarla karşılaştırmak.

## Nested logit talebi önce aynı zaman diliminde tutuyor

Kaynak metnin çözümü yuvalanmış lojit (Nested Logit) modeli. Uçuşlar
günün bölümlerine göre gruplanıyor: sabah, öğle, akşam. Her grup bir
yuva (nest). Sabah uçuşu kapandığında sistem talebi bütün seçeneklere
dağıtmıyor; önce aynı zaman dilimindeki diğer alternatiflere öncelik
veriyor. Böylece sabah yolcusu, en yakın saatteki uçuşa yönlendiriliyor.

Kaynak metnin parametre özetinde bu gruplamanın adı zaman bandı (time
band) ve etkisi şöyle yazılmış: nested logit modellerinde doğru talep
kaymasını, yani recapture'ı sağlıyor. Recapture, taşan ya da kalkan bir
uçuşun yolcusunun aynı havayolunun başka bir seçeneğine geçmesi. Zaman
bandı doğru kurulmuşsa, bu geçişin nereye olacağı gerçeğe yakın
tahmin ediliyor.

Nested logit IIA'yı tamamen atmıyor; onu yuvanın içine hapsediyor. Aynı
zaman dilimindeki uçuşlar birbirinin yakın ikamesi sayılıyor, farklı
dilimlerdeki uçuşlar arasındaki geçiş ise daha zor. Bu, yolcunun tercih
davranışına dair bir hipotezi modelin yapısına yazmak demek.

Yazılım tarafında bu hipotez bir konfigürasyon olarak yaşıyor: günün hangi
saatleri hangi banda düşüyor. Bu sınırlar pazardan pazara değişebilir;
kısa mesafeli bir iş rotasıyla uzun mesafeli bir tatil rotasında yolcunun
saati tartma biçimi aynı olmayabilir. Bant tanımını kodun içine gömmek
yerine pazar bazında ayarlanabilir tutmak, modeli yeniden yazmadan
iyileştirmenin yolu. Kaynak metin bant sınırlarının nasıl seçileceğine dair
bir kural vermiyor; bu karar veriyle sınanmalı.

## Kendi rezervasyon verisi yalnızca kazandığın yolcuyu gösteriyor

Tercih modeli ne kadar iyi kurulursa kurulsun, beslendiği veri kadar
iyi. Kaynak metin burada havayolunun kendi verisinin sınırını çiziyor: bir
havayolunun yalnızca kendi rezervasyon verilerine erişmesi ve rekabetçi
ortamdaki pazar eğilimlerini dikkate almaması temel bir kısıt.

Sorun yapısal. Kendi rezervasyon verisi yalnızca gerçekleşen talebi,
yani havayolunun kazandığı yolcuyu gösteriyor. Rakibe giden yolcu bu
veride yok. Uçuş dolduğu için geri çevrilen yolcu da yok. Pazarın genel
eğilimi, rakibin fiyatı ve sunduğu seçenekler de yok. Bu veriyle
kurulmuş bir pazar payı modeli, paydayı bilmeden pay hesaplamaya
çalışıyor.

Çözüm olarak kaynak metin seyahat acentelerinden ve OTA'lardan gelen
alışveriş verisini (shopping data) öneriyor: yolcuların yaptığı aramalar
ve karşılarına çıkan seçenekler. Bu veri pazardaki bütün havayollarının
satış fiyatlarını ve sundukları seçenekleri şeffaf biçimde gösteriyor.
Kaynak metne göre bu şeffaflık üç şey sağlıyor. Pazar payı tahminlerinin
doğruluğu artıyor. Kısıtlanmamış talep (unconstrained demand), yani
kapasite sınırı olmasaydı gelecek talep, daha iyi ölçülüyor. Sonuç olarak
da koltuk mevcudiyeti (seat availability) kararları optimize edilebiliyor.

Buradaki zincir spill bölümleriyle doğrudan bağlantılı. Kısıtlanmamış
talep, spill hesabının girdisi; kendi rezervasyon verisinden yalnızca
dolaylı olarak, kısıtlanmış gözlemlerden geri kazanılarak tahmin
edilebiliyor. Alışveriş verisi ise yolcunun aradığı ama satın almadığı
seçenekleri de gösterdiği için, geri çevrilen ya da rakibe giden talebin
izini doğrudan taşıyor. Kaynak metnin vurgusu da bu: stratejik kararlar
yalnızca geçmiş satışlara değil, pazarın tamamından gelen gerçek zamanlı
alışveriş davranışına dayanmalı.

Yazılım tarafında bu, talep tahmini sisteminin girdi sözleşmesini
genişletmek demek. Rezervasyon akışı tek kaynak olmaktan çıkıyor; yanına
farklı hacimde, farklı gecikmeyle ve farklı biçimde gelen bir alışveriş
akışı ekleniyor. İki akış aynı pazar ve itinerer kavramına eşlenmeden
birleştirilemiyor. Rakip itinererlerin fayda bileşenleri (süre, uçak tipi,
fiyat) de ancak bu akıştan geliyor; tercih modelinin paydası ancak onunla
tamamlanıyor.

## Dört parametre girdiyi, taşmayı ve varsayımı ayırıyor

Kaynak metnin analitik çerçevesi dört parametreyi yan yana koyuyor ve her
biri bu bölümün bir başlığına denk düşüyor. Toplam seyahat süresi: süre
azaldıkça itinererin çekiciliği artıyor; fayda puanının en doğrudan
bileşeni. Zaman bandı: günün bölümlere ayrılması; nested logit
modellerinde talebin doğru yere kaymasını sağlıyor. Spill: kapasite
yetersizliği nedeniyle taşan talep; rakip ya da alternatif itinererlere
kayan talebi temsil ediyor. IIA özelliği: alternatifler arası bağımsızlık
varsayımı; yanlış kullanıldığında tahmin hatası üretiyor.

İlk ikisi modelin girdisi, üçüncüsü modelin dağıttığı şey, dördüncüsü
modelin varsayımı. Bir tahmin sistemini denetlerken bu ayrım işe yarıyor:
yanlış bir çıktının kaynağı ya eksik bir bileşen, ya yanlış dağıtılan bir
taşma, ya da gerçeğe uymayan bir varsayım.

## Yarın işe yarayacak beş çıkarım

1. **Talebi uçuşa değil pazara bağla.** Tahmin biriminin kalkış-varış
   çifti olmasını sağla ve her itinererin payını fayda bileşenlerinden
   (toplam süre, uçak tipi, zamanında kalkış, bagaj, overbooking
   metrikleri) hesapla. Payı saklanan bir sayı olarak değil, türetilen bir
   değer olarak tut.
2. **Kalibrasyonla dağıtımı ayır.** Tarife değişikliği, uçuş kaldırma ya
   da bağlantı süresi senaryoları modeli yeniden eğitmeyi gerektirmiyor;
   mevcut fayda katsayılarıyla yeniden dağıtım yeterli. Dağıtım adımını
   hızlı ve bağımsız çağrılabilir kur ki tarife ekibi senaryoları kendisi
   çalıştırabilsin.
3. **Kapasite kısıtını pazar düzeyinde yeniden hesapla.** Bir uçuşun
   koltuğu düştüğünde taşan talebi, aynı pazardaki diğer itinererlere
   çekicilikleriyle orantılı dağıt. Taşan yolcunun kendi seferine mi
   rakibe mi gittiğini ayırmadan kapasite kararının bedelini raporlama.
4. **IIA varsayımını zaman bandıyla sınırla.** Kalkış saatleri birbirinden
   uzak uçuşların bulunduğu pazarlarda MNL yerine nested logit kullan;
   uçuşları sabah, öğle ve akşam yuvalarına ayır. Bant sınırlarını pazar
   bazında ayarlanabilir tut ve geçmiş tarife değişikliklerinde öngörülen
   kaymayı gerçekleşen rezervasyonlarla karşılaştırarak sına.
5. **Rezervasyon verisini alışveriş verisiyle tamamla.** Acente ve OTA
   aramalarından gelen shopping verisini tahmin sistemine ikinci bir
   girdi olarak ekle. Rakip fiyat ve seçeneklerini, kısıtlanmamış talebi
   ve pazar payını bu akıştan ölç; koltuk mevcudiyeti kararını yalnızca
   kazandığın yolcunun verisine dayandırma.

Bu bölümde ne yok: taşan talebin miktarının nasıl hesaplandığı, beklenen
spill formülleri ve talep dağılımlarının seçimi (spill bölümleri, özellikle
"Havacılıkta spill (taşan talep) modeli ve iş mantığı analizi" ve "Yüksek
varyanslı talep ve iki aşamalı Cox dağılımı"). Tarife ve kapasite
kararının planlama döngüsündeki yeri "Havayolu pazarlama planlama süreci ve
iş mantığı analizi" bölümünde. Bu bölüm yalnızca bir şeyi netleştirmek
için var: talep bir uçuştan çıktığında hangi mantıkla nereye gidiyor.
