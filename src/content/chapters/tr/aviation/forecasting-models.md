---
title: "Gelir yönetiminde tahminleme modelleri ve iş mantığı analizi"
domain: "aviation"
summary: "Gelir yönetiminde tahmin modeli seçmek bir istatistik zevki değil, bir iş kuralıdır: veri ne kadar derin, parametreler ne kadar oynak, gürültü nereden geliyor. Bu bölüm Kalman filtresini, ARMA/ARIMA modellerini ve regresyonu bu üç soru üzerinden karşılaştırıyor ve havayolu rezervasyon verisinde neden esnek olanın kazandığını anlatıyor."
audience: "Gelir yönetimi sistemlerinde tahmin katmanını yazan, seçen ya da işleten yazılımcı ve analist. Spill ve talep tahmini bölümlerinin okunmuş olması işe yarar; Kalman kazancı, gözlem ve süreç gürültüsü, durağanlık, fark alma, eşdoğrusallık ve örneklem dışı tahmin metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Spill bölümleri talebin bir dağılımı olduğunu varsayıp o dağılımın
kapasiteye çarptığı yeri hesaplıyordu. Dağılımın ortalamasını ve
varyansını kimin, nasıl ürettiği sorusu açıkta kalmıştı. Bu bölüm o soruya
dönüyor: gelir yönetiminde talebi tahmin eden modeller hangileri ve
hangisi hangi koşulda iş görüyor. Kaynak metin üç aileye bakıyor: üstel
düzeltmenin evrimi olan Kalman filtresi, zaman serisi modelleri ARMA ve
ARIMA, ve regresyon. **Havayolu rezervasyon verisinde doğru model, en
karmaşık olanı değil, parametreleri zamanla değişen bir dünyaya kendini
uydurabilen olanıdır.** Diğer ikisinin sorunu matematiksel zayıflık değil;
varsayımlarının bu veriye uymaması.

Bu bölümü okurken şunu akılda tutmak işe yarar: burada anlatılan her
zorluk aslında bir iş kuralına dönüşüyor. "Bu model şu koşulda
güvenilmez" cümlesi, tahmin katmanında bir `if` bloğu demek. Model
seçimi, sistem tasarımının parçası.

## Sabit düzeltme katsayısı değişen pazara geç kalıyor

Üstel düzeltme, gelir yönetiminde tahminin en eski ve en yaygın yolu: her
yeni gözlem, önceki tahmine sabit bir ağırlıkla karıştırılıyor. Katsayı
büyükse tahmin her dalgalanmaya savruluyor, küçükse gerçek bir değişimi
haftalar sonra fark ediyor. Sorun katsayının kendisinde değil, sabit
olmasında. Pazar bir gün sakin, ertesi gün bir rakibin fiyat kırmasıyla
çalkantılı; tek bir katsayı ikisine birden doğru cevap veremiyor.

Kalman filtresi bu katsayıyı değişkene çeviriyor. Adı Kalman kazancı
(Kalman gain) ve her yeni gözlemden sonra yeniden hesaplanıyor. Kaynak
metin farkı tek cümlede veriyor: düzeltme "sabiti" artık bir sabit değil,
zamanla değişiyor ve bu da süreçteki değişikliklere daha hızlı uyum
sağlıyor. Sistemin tepki hızı böylece önceden seçilmiş bir sayıya değil,
o anki belirsizliğe bağlanıyor. Belirsizlik büyüdüğünde kazanç artıyor ve
tahmin yeni veriye daha çok kulak veriyor; belirsizlik azaldığında kazanç
düşüyor ve tahmin yerinde duruyor.

Yazılım tarafında bunun karşılığı şu: tahmin servisinin durumu yalnızca
"son tahmin" değil. Tahminin yanında o tahmine ne kadar güvenildiğini
gösteren bir belirsizlik değeri de saklanıyor ve her güncellemede ikisi
birlikte ilerliyor. Durum nesnesine tek bir alan eklemek gibi görünse de
bu, modelin tepki hızını konfigürasyondan çıkarıp veriye bırakmak demek.

## Her sapma bir sinyal değil; Kalman ikisini ayırıyor

Rezervasyon verisi kirli. Geç düşen iptaller, yanlış kodlanmış grup
kayıtları, bir kanaldan gecikmeyle gelen PNR'lar; bunların hepsi bir
gözlemi gerçekte olduğundan farklı gösteriyor. Öte yandan bazen sapma
gerçek: pazar değişmiş, yolcu profili kaymış, bir etkinlik talebi
yükseltmiş. Tahmin sisteminin cevaplaması gereken asıl soru "sapma var mı"
değil, "bu sapma hangi türden".

Kalman filtresinin gücü burada. Kaynak metne göre filtre, gürültülü veriyi
(gözlem gürültüsü, observation noise) değişen parametrelerden (süreç
gürültüsü, process noise) açıkça ayırarak modelliyor. Üstel düzeltmenin
yapamadığı tam olarak bu: onun gözünde her fark aynı fark. Kalman ise iki
ayrı varyans taşıyor. Sapma ölçüm hatasından geliyorsa tahmini koruyor;
temel bir parametre değişimine işaret ediyorsa tahmini hızla güncelliyor.

Bu ayrımın iş kuralı olarak karşılığı açık. Tek bir günün tuhaf
rezervasyon sayısı, fiyat ve envanter kararlarını yerinden oynatmamalı.
Ama birkaç gözlem üst üste aynı yöne işaret ediyorsa, sistem bunu gürültü
diye bastırmaya devam etmemeli. İki hatanın da maliyeti var: gürültüye
tepki veren sistem kontenjanı boş yere açıp kapıyor, gerçek değişimi
bastıran sistem ise ya koltuğu ucuza satıyor ya da talebi reddediyor.

Burada kritik bir ayar işi saklı. Filtrenin bu ayrımı doğru yapabilmesi,
süreç ve ölçüm gürültüsü varyanslarının, kaynak metindeki adlarıyla q ve
r'nin doğru kalibre edilmesine bağlı. Kaynak metin bunu ayrı bir iş süreci
olarak tanımlıyor: amaç, ortalama mutlak hatayı (MAE, Mean Absolute Error)
en aza indirecek q ve r değerlerini bulmak. q'yu r'ye göre büyük tutmak
filtreye "dünya hızlı değişiyor" demek; küçük tutmak "gözlemlerin kirli,
onlara az güven" demek. Yanlış oran, filtreyi ya üstel düzeltmenin aşırı
tepkili hâline ya da hantal hâline geri döndürüyor.

## Yeni rota için ön hazırlık gerekmiyor

Tahminin en zor anı başlangıç. Yeni açılan bir rotanın geçmişi yok; veri
eksik bir pazarda model neye dayanacak? Birçok yöntem burada ayrı bir ön
işleme adımı, bir ısınma dönemi ya da benzer rotalardan kopyalanmış bir
başlangıç seti istiyor.

Kaynak metne göre Kalman filtresi bunu gerektirmiyor. Belirli bir
başlangıç değeri ve bu değere ne kadar güvenildiğini gösteren bir
belirsizlik ölçüsü girildikten sonra, filtre her yeni veriyle optimal
tahmine çevrimiçi (online) olarak ilerliyor. Başlangıç belirsizliği
büyük tutulursa ilk gözlemler hızla tahmini şekillendiriyor; veri
biriktikçe belirsizlik küçülüyor ve kazanç kendiliğinden düşüyor.

Yazılım tarafında bu, yeni rota için ayrı bir kod yolu yazmamak demek.
Aynı güncelleme fonksiyonu, yalnızca farklı bir başlangıç durumuyla
çağrılıyor. Kaynak metin ayrıca filtrenin düşük bellek gereksinimini ve
uygulama kolaylığını vurguluyor: her uçuş için taşınan durum, tahmin ile
belirsizlikten ibaret, bütün geçmiş değil. Her uçuşun ve her birinin
birden çok rezervasyon noktasının ayrı ayrı tahmin edildiği düşünüldüğünde, geçmişin tamamını her
güncellemede yeniden okumayan bir modelin büyük ağlardaki hesaplama
verimliliği ayrı bir avantaj.

## ARMA ve ARIMA, havayolunun vermediği iki şeyi istiyor

Zaman serisi modelleri ilk bakışta talep tahmini için doğal aday:
rezervasyonlar zamana bağlı bir seri, ARMA ise tam da serinin kendi
geçmişinden ve geçmiş hatalarından geleceği kuran bir model. Kaynak metin
bu modellerin gelir yönetiminde yine de yaygın kullanılmadığını söylüyor
ve iki engel sayıyor.

Birincisi durağanlık. ARMA, verinin ortalamasının ve varyansının zaman
içinde sabit kaldığını varsayıyor. Havayolu rezervasyon eğrileri bu
varsayımı karşılamıyor; kaynak metin bu eğrilerin ortalamasının ve
varyansının zaman içinde yüksek değişkenlik gösterdiğini vurguluyor.
ARIMA buna bir çözüm getiriyor: veriyi fark alma (differencing) ile, yani
her değerden bir öncekini çıkararak, durağan hâle getiriyor ve modeli bu
dönüştürülmüş seriye kuruyor. Ama bu, sorunu modelin girişinde çözmeye
çalışmak; parametreler sürekli kayıyorsa her kaymada modelin yeniden
tanımlanması gerekiyor.

İkincisi veri derinliği ve bu, pratikte daha belirleyici olanı. Kaynak
metne göre ARMA ve ARIMA en az 2 yıllık, tercihen 5 yıl ya da daha fazla
veri istiyor. Havayolunda 5 yıl, bir rotanın aynı kalması için uzun bir
süre: tarife değişiyor, uçak tipi değişiyor, rakip giriyor ya da çıkıyor.
5 yıllık bir seri çoğu zaman aslında birkaç farklı pazarın birbirine
eklenmiş hâli.

Buradan çıkan iş kuralı basit ve kodlanabilir. Model seçim katmanı, önce
mevcut veri setinin uzunluğuna bakmalı. Seri 2 yıldan kısaysa ARMA/ARIMA
aday listesinden baştan elenmeli, çünkü o uzunlukta bu modellerin
açıklama kapasitesi sınırlı; 5 yıldan kısa serilerde de tercih daha az
veriyle çalışabilen yöntemlere gitmeli. Ortalama ve varyansın zamanla
değiştiği görülüyorsa ARMA doğrudan yetersiz; ya fark alan ARIMA ya da
Kalman gibi daha esnek bir model devreye girmeli.

Yazılım tarafında bu, model seçiminin bir kez verilip unutulan bir karar
değil, her pazar için çalışma zamanında yapılan bir kontrol olması demek.
Aynı sistem içinde köklü bir rota ile geçen sezon açılmış bir rota farklı
modellerle tahmin edilebiliyor ve bu farkın kaydı tutulmalı: bir tahminin
hangi modelden geldiği, o tahmine ne kadar güvenileceği sorusunun parçası.

## Regresyonun sorunu havayolu verisinin kendi yapısı

Regresyon, talebi fiyat, sezon, rakip kapasitesi ya da önceki
rezervasyon noktaları gibi açıklayıcı değişkenlere bağlamanın en tanıdık
yolu. Kaynak metin burada da net: regresyon modelleri havayolu verisinde
iyi sonuç vermeme eğiliminde, çünkü katsayı tahminleri eşdoğrusallık
(collinearity) yüzünden yanlı olabiliyor.

Eşdoğrusallık, bağımsız değişkenlerin birbirleriyle yüksek korelasyon
taşıması. Havayolu verisinde bu kaçınılmaz: aynı uçuşun farklı
dönemlerindeki rezervasyonlar birbirinden bağımsız değil. Erken dönemde
güçlü giden bir uçuşun kalkışa yakın dönemde de güçlü gitmesi şaşırtıcı değil;
ikisi aynı talebin iki ayrı ölçümü. Bunları regresyona ayrı değişkenler
olarak koyduğunda model, etkiyi hangisine atfedeceğini bilemiyor ve
katsayılar güvenilmez hâle geliyor. Toplam tahmin makul görünse bile tek
tek katsayılar, örneğin fiyatın etkisi, yanıltıcı olabiliyor. Fiyat kararı
da tam olarak o katsayıya bakılarak veriliyor.

Kaynak metnin önerdiği çıkış dinamik regresyon. Bu modelde bir dönemden
diğerine aktarılan hata payı (error term) denkleme dahil ediliyor ve
böylece dönemler arası korelasyonun etkisi azaltılıyor. Standart
regresyon her gözlemin hatasını bağımsız varsayarken, dinamik regresyon
dünün hatasının bugünü etkilediğini kabul ediyor. İş kuralı olarak
karşılığı: bağımsız değişkenler yüksek korelasyonluysa, standart
regresyon çıktısına dayalı fiyat kararından kaçınılmalı.

## Kalibrasyon aralığının dışında regresyon susmalı

Regresyonun ikinci zayıflığı daha sinsi. Model, kalibre edildiği aralıkta
iyi çalışıyor; o aralığın dışına, kaynak metnin deyişiyle örneklem
dışına (out of sample) çıkıldığında güvenilmez sonuçlar üretiyor. Model
hiç görmediği bir fiyat seviyesinde, hiç görmediği bir kapasitede ya da
hiç görmediği bir talep şokunda da bir sayı döndürüyor; sadece o sayının
bir dayanağı yok.

Tehlike, bu sayının diğerlerinden farklı görünmemesi. Ekranda aynı
biçimde, aynı ondalık hassasiyetle duruyor. Kaynak metin bu yüzden
güvenilmezliğin bir iş kuralı olarak tanımlanmasını istiyor: regresyon
tahmini kalibrasyon aralığının dışına çıktığında sistem tahminciyi
uyarmalı ya da Kalman filtresi gibi alternatif bir modele geçmeli.

Yazılım tarafında bunun anlamı, modelin yalnızca katsayılarını değil
kalibre edildiği girdi aralığını da saklamak. Her tahmin çağrısında
girdiler bu aralıkla karşılaştırılıyor; dışarıdaysa ya bir uyarı bayrağı
tahminle birlikte dönüyor ya da istek başka bir modele yönlendiriliyor.
Sessizce bir sayı dönmek, en kötü seçenek.

## Esneklik bir tercih değil, veri yapısının sonucu

Üç ailenin yan yana konması tek bir örüntü ortaya çıkarıyor. ARMA
durağanlık istiyor, havayolu verisi durağan değil. ARIMA fark alarak bunu
düzeltiyor ama yıllarca veri istiyor, havayolu pazarları o kadar uzun
aynı kalmıyor. Regresyon bağımsız değişken istiyor, aynı uçuşun
rezervasyon noktaları birbirine bağlı. Her birinin varsayımı, havayolu
verisinin bir özelliğine takılıyor.

Kalman filtresi bu listede öne çıkıyor çünkü varsayımları bu verinin
doğasına uyuyor: parametrelerin değişebileceğini baştan kabul ediyor,
gürültüyle değişimi ayrı modelliyor, az veriyle başlayabiliyor ve durumu
küçük. Kaynak metnin yönetici özetindeki sonuç da bu: dinamik ve hızla
değişen ortamlarda, zamanla değişen parametrelere uyum sağlayabilen esnek
modeller tercih edilmeli. Bu, diğer modellerin yasaklanması anlamına
gelmiyor; hangi koşulda devreye girebileceklerinin açık kurallara
bağlanması anlamına geliyor.

## Yarın işe yarayacak dört çıkarım

1. **Model seçimini veri derinliğine bağla.** Seçim katmanı önce seri
   uzunluğuna baksın: 2 yıldan kısa veride ARMA/ARIMA aday bile olmasın,
   5 yıldan kısa veride daha az veriyle çalışan yöntemler öne geçsin.
   Ortalama ve varyans zamanla kayıyorsa ARMA'yı hiç denemeden ARIMA'ya
   ya da Kalman'a geç.
2. **Kalman'da q ve r'yi bir iş süreci olarak kalibre et.** Süreç ve
   ölçüm gürültüsü varyansları bir kez girilip bırakılan sabitler değil;
   MAE'yi en aza indirecek şekilde düzenli olarak ayarlanmaları gerekiyor.
   Yanlış oran, filtreyi ya gürültüye tepki veren ya da gerçek değişimi
   kaçıran bir modele çeviriyor.
3. **Korelasyonlu değişkenlerde standart regresyona fiyat bağlama.** Aynı
   uçuşun farklı dönem rezervasyonları gibi birbirine bağlı değişkenler
   varsa katsayılar yanlı olabilir. Fiyat kararını bu katsayılara
   dayandırma; dönemler arası hata payını denkleme katan dinamik
   regresyonu kullan.
4. **Regresyonun kalibrasyon aralığını sakla ve her çağrıda kontrol et.**
   Girdi örneklem dışına çıktığında tahmin sessizce dönmesin: tahminciye
   uyarı gitsin ya da istek Kalman gibi alternatif bir modele yönlensin.

Bu bölümde ne yok: tahminin ürettiği dağılımın kapasiteyle nasıl
karşılaştırıldığı (spill bölümleri ve "Yüksek varyanslı talep ve iki
aşamalı Cox dağılımı"), tahminin koltuk kontenjanına nasıl çevrildiği ve
tahmin hatasının gelir üzerindeki etkisinin nasıl ölçüldüğü. Bu bölüm
yalnızca tahmin katmanının içindeki model seçimini ve o seçimin hangi
iş kurallarına dönüştüğünü anlatmak için var.
