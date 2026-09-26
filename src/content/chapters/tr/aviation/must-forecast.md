---
title: "O&D tahminleme ve must-forecast listesi"
domain: "aviation"
summary: "Ağdaki her kalkış-varış çiftini tek tek tahminlemek doğruluk getirmiyor; seyrek pazarlarda kesirli ve oynak tahminler üretip optimize ediciyi yanıltıyor. Bu bölüm, talebin büyük kısmını taşıyan pazarları bir must-forecast listesine almayı, geri kalanını bacak üzerinde pseudo-local adlı bir artık talep olarak yönetmeyi ve bu artığa tarihsel ortalama gelir atamayı anlatıyor."
audience: "Talep tahmini, gelir yönetimi ya da ağ optimizasyonu sistemleri üzerinde çalışan, hangi pazarın ayrı modellenip hangisinin toplu yönetileceğine karar vermesi gereken yazılımcı ve analist. Spill bölümlerinin okunmuş olması işe yarar; O&D, bacak (leg), yerel ve bağlantılı talep, pseudo-local talep ve oranlanmış ağırlıklı ortalama gelir metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki talep tahmini bölümleri tek bir uçuşa bakıyordu: bu kabine kaç
yolcu gelir, kapasiteyi aşan kısmı ne kadar, dağılımın şekli ne. Ağ
düzeyine çıkınca soru değişiyor. Bir havayolunun sattığı şey tek tek
uçuşlar değil, O&D (origin and destination, yolcunun gerçek kalkış ve
varış noktası) çiftleri; ve bu çiftlerin sayısı, uçuş sayısından çok daha
hızlı büyüyor. Her bağlantı yeni bir pazar açıyor. Doğal refleks hepsini
tahminlemek. **Ağdaki her O&D'yi ayrı ayrı tahminlemek daha fazla doğruluk
getirmiyor; seyrek pazarlarda gürültü üretiyor ve o gürültüyü doğrudan
optimize ediciye taşıyor.** Bu bölüm alternatifini anlatıyor: tahmini hak
eden pazarları bir listeye almak, geri kalanını tek bir artık kalem olarak
yönetmek.

## Seyrek pazarı tahminlemek bir sayı değil, gürültü üretiyor

Kaynak metnin örneği Waco-London: küçük bir noktadan Londra'ya aktarmalı
bir yolculuk. Ağda böyle bir pazar var, ara sıra rezervasyon da
alıyor; ama o kadar seyrek ki, belirli bir kalkış günü ve belirli bir
rezervasyon sınıfı için beklenen yolcu sayısı sıfıra çok yakın bir kesir
çıkıyor. Oysa bir uçuşa kesirli bir yolcu gelmiyor; ya biri geliyor ya
kimse gelmiyor.

Kaynak metin bunu açıkça söylüyor: bütün talebi tahminlemek kesirli talep
tahminlerine ve talebin değişkenliğinde yüksek oynaklığa yol açıyor. Buna
veri seyrekliği (data sparsity) deniyor. Tarihsel veride bu pazar için
gözlemler çoğunlukla sıfır, arada bir bir veya iki. Böyle bir seriden
çıkan ortalama da, varyans da güvenilir değil; bir sonraki dönemde tek bir
rezervasyon tahmini kökten değiştirebiliyor.

Asıl sorun tahminin kendisi değil, nereye gittiği. O&D tahminleri ağ
optimize edicinin girdisi. Optimize edici her pazara ne kadar koltuk
ayıracağına bu sayılarla karar veriyor ve bir sayının kesirli ya da oynak
olduğunu bilmiyor; ona verilen her girdiyi aynı ciddiyetle kullanıyor.
Binlerce seyrek pazarın her biri küçük bir gürültü taşıyorsa, toplamda
optimizasyon sonucu bu gürültüye göre salınıyor. Kaynak metnin ifadesiyle,
tahminin güvenilirliği düşüyor ve eniyileme modelleri yanılıyor.

Yazılım tarafında bunun karşılığı tanıdık: bir modeli, veri üretmeyen
anahtarlar için de çalıştırmak hem hesaplama maliyeti hem de çıktıda
yanlış bir kesinlik izlenimi yaratıyor. Tahmin tablosunda her satır aynı
biçimde görünüyor; Waco-London satırının arkasında neredeyse hiç gözlem
olmadığını tablo söylemiyor.

## Ağın talebi birkaç pazarda toplanıyor

Seyrekliği idare edilebilir kılan şey, talebin ağa eşit dağılmaması.
Kaynak metin bunu bir kural olarak veriyor: havayolu trafik verisi
genellikle O&D'lerin yüzde 20'sinin ağdaki toplam talebin yüzde 80 ila
90'ını oluşturduğunu gösteriyor. Brifing bunu 20/90 kuralı diye anıyor ve
Lufthansa örneğini veriyor: pazarların yüzde 20'si talebin yüzde 90'ını
karşılıyor.

Bu dağılımın iki sonucu var. Birincisi, tahmin doğruluğuna yapılan
yatırımın getirisi pazarlar arasında eşit değil. Yoğun pazarlarda tahmini
bir puan iyileştirmek ağın gelirine doğrudan yansıyor; seyrek bir pazarda
aynı çaba ölçülemeyecek kadar küçük bir fark yaratıyor. İkincisi, seyrek
pazarların tek tek ağırlığı küçük ama toplamı sıfır değil. Talebin yüzde
10 ila 20'si, O&D'lerin yüzde 80'ine dağılmış halde duruyor. Bunları
tahminden tamamen çıkarmak, o talebi yok saymak demek; uçaktaki koltuklar
onları da taşıyor.

Kaynak metnin çözümü bu iki sonucu birlikte ele alıyor: bütün talebi
tahminlemek yerine bir must-forecast (tahminlenmesi zorunlu) listesi
oluşturmak. Listeye talebin büyük kısmını taşıyan yüksek yoğunluklu
pazarlar giriyor. Liste dışındakiler tahminden çıkmıyor, sadece ayrı ayrı
tahminlenmiyor.

## Liste dışındaki pazarlar bacak üzerinde bir artık olarak yaşıyor

Seyrek pazarların talebini temsil etmek için kaynak metin pseudo-local
(sözde yerel) talep kavramını kullanıyor. Adını anlamak için iki terimi
ayırmak gerekiyor. Bacak (leg), tek bir kalkış ve iniş arasındaki uçuş
parçası. Bir bacakta oturan yolcuların bir kısmı yerel (local): yolculuğu
o bacakla başlayıp bitiyor. Bir kısmı bağlantılı (connecting): bacak,
onların daha uzun bir O&D yolculuğunun bir parçası.

Pseudo-local talep, bacaktaki yolcuların must-forecast listesinde
açıklanamayan kısmı. Kaynak metin bunu tek bir formülle tanımlıyor:
pseudo-local tahmin, toplam bacak talebinden must-forecast listesindeki
bağlantılı ve yerel talebin çıkarılmasıyla bulunuyor. Yani Waco-London
yolcusu tek başına tahminlenmiyor; Londra'ya giden bacağın üzerinde,
listedeki pazarlara ait olmayan bütün yolcularla birlikte tek bir havuza
düşüyor. O havuz, bacağın kendi yerel talebiymiş gibi davranıyor; adındaki
"sözde" bundan geliyor.

Kaynak metin bu havuzu bir vekil (surrogate) olarak niteliyor: pseudo-local
tahmin, seyrek O&D'lerin yerini tutuyor. Tek tek pazarlar gürültülü, ama
bir bacak üzerinde yüzlerce seyrek pazarın toplamı artık daha kararlı bir
seri. Seyrekliğin sorunu, veriyi ayrıntıdan toplama taşıyarak çözülüyor.

Yazılım tarafında bunun karşılığı bir "diğer" kovası, ama sıradan bir
kova değil. Değeri doğrudan ölçülmüyor, iki tahminin farkı olarak
türetiliyor. Bu, artığın kalitesinin iki girdiye bağlı olduğu anlamına
geliyor: toplam bacak tahmini ve listedeki pazarların tahminleri. Biri
kayarsa artık da kayıyor. Brifing bu durumun nasıl izleneceğini
tartışmıyor; ama formülün kendisi, artığın ayrı bir izleme metriği olarak
tutulması gerektiğini ima ediyor.

## Tutarlılık yukarıdan aşağıya tahminden geliyor

Toplam bacak tahmini ile O&D bazlı tahminler ayrı ayrı yapılırsa bir
tutarsızlık doğuyor: pazarların toplamı bacağın toplamına eşit çıkmıyor.
Aynı koltuklar iki farklı sayıyla anlatılıyor ve optimize edici hangisine
inanacağını bilmiyor.

Kaynak metnin iş kuralı sırayı sabitliyor. Toplam bacak tahmini en üst
katmanda yapılıyor ve hem yerel hem bağlantılı talebi içeriyor. Sonra
bilinen büyük pazarların, yani must-forecast listesinin tahminleri bu
toplamdan düşülüyor. Kalan miktar pseudo-local olarak tanımlanıyor.
Böylece parçaların toplamı tanım gereği bütüne eşit; tutarlılık bir
sonradan düzeltme adımıyla değil, hesaplamanın yapısıyla sağlanıyor.

Brifing bunu hiyerarşik, yukarıdan aşağıya (top-down) bir model olarak
tarif ediyor: önce toplam bacak kapasitesi ve talebi, ardından bu bütünden
belirli pazar payları, en sonda geriye kalan pseudo kapasite. Veri
bütünlüğünü koruyan şey bu sıra.

Mühendislik açısından burada dikkat edilecek nokta hesaplama sırasının
bir sözleşme olması. Bacak tahmini ve O&D tahmini farklı ekiplerin ya da
farklı servislerin sorumluluğundaysa, ikisinin aynı döneme, aynı veri
kesitine ve aynı sınıf kırılımına dayanması gerekiyor. Aksi halde çıkarma
işlemi iki uyumsuz sayının farkını alıyor ve artık, anlamı olmayan bir
sayı haline geliyor.

## Seyrek pazarın değeri tek bir biletle değil, tarihsel ortalamayla ölçülüyor

Talebi temsil etmek işin yarısı. Optimize edici her talebe bir değer de
bağlamak zorunda; bir koltuğun kime ayrılacağı, o koltuktan ne kadar gelir
beklendiğine bağlı. Seyrek pazarlarda bu değeri tek tek tahminlemek,
talebi tek tek tahminlemekle aynı sorunu yaşıyor: az gözlem, oynak sonuç.

Kaynak metnin çözümü gelir tarafında da toplamaya gitmek. Pseudo-local
kalemler için tarihsel gelir muhasebesi (revenue accounting) verisinden
türetilen bir ortalama ücret kullanılıyor. Brifing bunu oranlanmış
ağırlıklı ortalama gelir (prorated weighted average revenue) olarak
adlandırıyor. Oranlanmış, çünkü bağlantılı bir biletin geliri yolculuğun
bacaklarına paylaştırılıyor ve söz konusu bacağa düşen pay alınıyor.
Ağırlıklı, çünkü ortalama, geçmişte o bacağa gerçekten düşen yolcu
sayılarına göre hesaplanıyor.

Sonuç, nadir yolculuklar için tekil ve oynak değerler yerine anlamlı bir
ortalama. Brifingin öngörüsü de bu yönde: nadir seyahatler için gerçek
zamanlı fiyat tahmini yerine tarihsel veriden gelen ortalama gelir,
optimizasyon sonuçlarını daha istikrarlı yapıyor.

Burada bir veri kaynağı geçişi var ve yazılımcının gözden kaçırmaması
gereken şey bu. Must-forecast pazarlarının değeri gelir yönetiminin kendi
ücret ve talep verisinden gelirken, pseudo-local değeri muhasebe
verisinden geliyor. İki farklı sistem, iki farklı güncelleme ritmi. Gelir
muhasebesi verisi geriye bakıyor; bu, ortalamanın kararlı olmasının
sebebi, ama aynı zamanda fiyat yapısındaki bir değişikliği gecikmeyle
yansıtmasının da sebebi.

## Optimize edici üç kalem görüyor

Bütün bu ayrımların sonunda ağ optimize ediciye giden veri seti sade.
Kaynak metin üç kalem sayıyor:

- Must-forecast listesindeki pazarların bağlantılı talebi, servis
  sınıfına göre.
- Yerel talep, rezervasyon sınıfına göre.
- Pseudo-local talep, yine rezervasyon sınıfına göre.

Bu listede tek tek seyrek O&D'ler yok. Optimize edici Waco-London'u bir
pazar olarak görmüyor; Londra bacağında belirli bir rezervasyon sınıfında
belirli bir miktar pseudo-local talep ve ona bağlı ortalama bir gelir
görüyor. Kaynak metnin amacı da tam bu: ağ optimizasyonuna daha tutarlı ve
uygulanabilir veri sunmak.

Bunun bir bedeli olduğu açık. Pseudo-local havuzdaki yolcular, bağlantılı
yolculuklarının geri kalanı hesaba katılmadan, yalnızca bu bacaktaki
değerleriyle temsil ediliyor. Listedeki bir pazar için optimize edici
yolcunun bütün yolculuğunun ağa kattığı değeri tartabilirken, liste
dışındaki bir pazar için bunu yapamıyor. Must-forecast listesinin
sınırı, tam olarak ağ düzeyinde karar verilen talep ile bacak düzeyinde
karar verilen talep arasındaki sınır. Brifing bu bedeli ayrıca ölçmüyor;
ama 20/90 dağılımı, bedelin talebin küçük bir kısmına düştüğünü söylüyor.

## Liste bir kez kurulup bırakılacak bir şey değil

Hangi pazarın listeye gireceğinin kriteri brifingde yoğunluk: ağdaki
toplam talebin büyük çoğunluğunu oluşturan pazarlar. Bu tanım bir eşiğe
dayanıyor ve eşiğin iki yanındaki pazarlar zamanla yer değiştirebilir.
Yeni açılan bir rota seyrek başlayıp yoğunlaşabilir; bir zamanlar yoğun
olan bir pazar sönebilir.

Brifing listenin ne sıklıkla gözden geçirileceğini söylemiyor. Ama
yapının kendisinden bir sonuç çıkıyor: liste bir yapılandırma verisi, ve
her değişikliği hem must-forecast tahminlerini hem de pseudo-local
artığını aynı anda etkiliyor. Bir pazar listeye girdiğinde o pazarın
talebi artıktan çıkıp kendi satırına geçiyor; toplam değişmiyor, dağılımı
değişiyor. Bu değişikliği izlenebilir, sürümlü bir karar olarak tutmak,
tahmin sonuçlarındaki bir kaymanın modelden mi yoksa listeden mi
geldiğini ayırt etmenin tek yolu.

## Yarın işe yarayacak dört çıkarım

1. **Pazarları ikiye ayır, çabayı yoğun olana ver.** Rotaları
   must-forecast ve seyrek olarak sınıflandır. Tahmin doğruluğunu artırmak
   için ayrılan kaynağın büyük kısmını, talebin büyük kısmını taşıyan
   yüzde 20'lik pazarlara yönlendir.
2. **Seyrek pazarları tek tek tahminleme, bacak üzerinde birleştir.**
   Waco-London gibi düşük frekanslı pazarları bacak bazlı pseudo-local
   kategorisinde topla. Bu, tahmin modellerindeki gürültüyü ve oynaklığı
   azaltıyor ve optimize ediciye kesirli sayılar gitmesini önlüyor.
3. **Nadir yolculuğa ortalama değer ata.** Seyrek pazarlar için gerçek
   zamanlı fiyat tahmini yerine tarihsel gelir muhasebesi verisinden
   türetilen oranlanmış ağırlıklı ortalama geliri kullan. Optimizasyon
   sonuçları daha istikrarlı çıkıyor; muhasebe verisinin gecikmesini de
   hesaba kat.
4. **Tahmini yukarıdan aşağıya kur.** Önce toplam bacak talebini
   tahminle, sonra listedeki pazarları düş, kalanı pseudo-local say.
   Parçaların toplamı böylece tanım gereği bütüne eşit oluyor; iki
   tahminin aynı veri kesitine dayandığını sistem düzeyinde garanti et.

Bu bölümde ne yok: tek bir uçuşta talebin kapasiteyi nasıl aştığı ve
kayıp yolcunun nasıl hesaplandığı (spill bölümleri), ağ optimize edicinin
koltukları pazarlar arasında nasıl dağıttığı. Bu bölüm, optimize edicinin
önüne hangi talebin hangi ayrıntıda konacağına karar veren adımı anlatmak
için var.
