---
title: "Havacılık gelir yönetimi: rezervasyon tahminleme ve talep analizi"
domain: "aviation"
summary: "Gelir yönetiminde talep tahmini tek bir model değil, iki modelin kalkışa kalan süreye göre değişen ağırlıklarla karıştırılması: uzakta zaman serisi, yakında rezervasyon profili. Bölüm, çarpımsal ve toplamsal profil modellerinin nerede ayrıştığını, kapanan sınıfların sildiği talebin EM gibi yöntemlerle nasıl geri kazanıldığını ve basit ortalamanın neden çoğu zaman gelişmiş modelleri geçtiğini anlatıyor."
audience: "Gelir yönetimi sistemlerinin tahmin katmanını yazan, besleyen ya da çıktısını tüketen yazılımcı ve analist. Spill bölümlerinin okunmuş olması işe yarar; rezervasyon profili, çarpımsal ve toplamsal model, unconstraining, EM, MSE ve MAD metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Spill bölümleri hep aynı soruyu soruyordu: talep kapasiteyi aşarsa kaç yolcu
kaybedilir. Bu sorunun cevabı, talebin kendisinin ne kadar olacağını bilmeye
dayanıyor, ve o bilgi hiçbir zaman hazır gelmiyor. Gelir yönetimi sisteminin
optimizasyon katmanı ne kadar zekice kurulmuş olursa olsun, önüne konan talep
tahmini kadar doğru karar verebiliyor. **Havacılıkta talep tahmini tek bir
modelin işi değil; iki farklı modelin, kalkışa kalan süreye göre kayan
ağırlıklarla karıştırılması, ve çoğu zaman bu karışımın sadeliği
karmaşıklığından daha değerli.** Bu bölüm o karışımın parçalarını anlatıyor:
kısa vadeli rezervasyon profili tahmini, uzun vadeli zaman serisi, ikisinin
nasıl birleştirildiği, ve sistemin kendi kapattığı sınıflar yüzünden hiç
göremediği talebin nasıl geri kazanıldığı.

## Rezervasyon profili hacmi değil, zamanlamayı taşıyor

Bir uçuşun satışı kalkıştan aylar önce açılır ve rezervasyonlar zamana
yayılarak birikir. Geçmiş uçuşlara bakınca bu birikimin belli bir şekli
olduğu görülüyor: kalkışa belli bir süre kala toplam talebin ne kadarının
gelmiş olduğu, benzer uçuşlarda benzer çıkıyor. Bu eğriye rezervasyon
profili (booking profile) deniyor. Kısa vadeli tahmin bu profili kullanıyor:
bugüne kadar gelen rezervasyonlara bakıyor, profilin bu noktada ne kadar
dolmuş olması gerektiğini biliyor, oradan kalkışta ulaşılacak toplam talebi
çıkarıyor.

Yöntemin arkasındaki varsayım güçlü ve açıkça söylenmesi gerekiyor. Kaynak
metin bunu şöyle koyuyor: rezervasyon profili tabanlı tahmin,
sansürlenmemiş rezervasyon profilinin şeklinin talebin gerçek büyüklüğünden
bağımsız olduğunu varsayıyor. İş kuralı olarak okununca anlamı şu: bir uçuş
çok popüler de olsa, az talep de alsa, rezervasyonların zamana yayılma
biçimi değişmiyor; yalnızca eğrinin büyüklüğü değişiyor. Popüler uçuş aynı
eğriyi daha yüksekten çiziyor.

Bu varsayım yöntemi mümkün kılan şey. Şekil hacimden bağımsız olduğu için
profiller standartlaştırılabiliyor: her geçmiş uçuşun eğrisi kendi toplamına
bölünüp oransal hale getiriliyor ve farklı hacimdeki uçuşlar aynı profili
beslemek için bir araya konabiliyor. Yazılım tarafında bunun karşılığı,
profil deposunun mutlak rezervasyon sayısı değil, kalkışa kalan her okuma
noktası için birikmiş oran tutması. Hacim tahmini ile şekil tahmini iki ayrı
veri yapısında yaşıyor ve birbirine ancak tahmin anında çarpılıyor.

Varsayımın bir de bedeli var. Şekil hacimden bağımsız kabul edildiğinde,
yüksek talepli bir uçuşun rezervasyonlarının gerçekten daha erken gelip
gelmediği modelin göremeyeceği bir şey oluyor. Model bu farkı şekilde değil,
bir sonraki bölümde anlatılan model seçiminde yakalamaya çalışıyor.

## Çarpımsal model iyimser, toplamsal model muhafazakâr

Rezervasyon profilinden toplam talep tahmini üretmenin iki yolu var ve
ikisi, uçuş beklenenden hızlı satarken birbirinden belirgin şekilde
ayrışıyor.

Çarpımsal (multiplicative) model bugünkü rezervasyonu, profilin bu noktada
ulaşılmış olmasını beklediği orana bölüyor. Mevcut rezervasyonlar beklenen
seviyenin üzerindeyse, model bu fazlalığı kalkışa kadar kalan döneme de
yayıyor: erken gelen güçlü talebi, geç gelecek talebin de güçlü olacağının
işareti sayıyor. Sonuç, daha yüksek bir toplam talep tahmini.

Toplamsal (additive) model ise bugünkü rezervasyonun üzerine, geçmiş
uçuşlarda bu noktadan kalkışa kadar gelen ortalama ek rezervasyonu ekliyor.
Erken gelen fazlalık tahmine olduğu gibi giriyor ama çoğaltılmıyor; kalan
dönemin talebi mevcut durumdan bağımsız kabul ediliyor. Kaynak metin bunu
şöyle tarif ediyor: toplamsal model daha muhafazakâr, ve yüksek rezervasyon
durumunda bile daha düşük bir kalan talep tahmini üretiyor.

Hangisinin seçileceği bir matematik tercihi değil, bir iş kararı. Karar,
mevcut rezervasyonların beklenen seviyenin üzerinde olup olmamasına göre
veriliyor, çünkü iki model tam olarak bu durumda farklı konuşuyor. Beklenen
seviyedeki bir uçuşta ikisi birbirine yakın sonuç verir; beklentinin
üzerindeki uçuşta çarpımsal model daha fazla koltuğu yüksek ücrete saklatır,
toplamsal model daha fazlasını bugünkü ücretten satmaya razı olur.

Yazılım tarafında bunun karşılığı şu: model seçimi bir yapılandırma
sabitine gömülmemeli. Hangi modelin hangi koşulda çalıştığı, tahminin
çıktısıyla birlikte kayda geçmeli. Aksi halde bir uçuşun neden erken
kapandığını ya da neden son gün boş kaldığını sonradan açıklamak mümkün
olmuyor; iki model arasındaki fark, tam da tartışmalı uçuşlarda en büyük.

## Kalkışa uzaklık, hangi modele güvenileceğini belirliyor

Rezervasyon profili tahmininin gücü gerçek rezervasyon birikimini
kullanması. Zayıflığı da aynı yerde: satışın henüz başladığı günlerde
birikim yok denecek kadar az, ve az sayıda rezervasyonu profile bölmek
gürültüyü büyütmekten başka bir şey yapmıyor. Uzun vadeli tahmin bu yüzden
başka bir kaynağa dayanıyor: aynı uçuşun geçmiş dönemlerdeki gerçekleşmiş
talebinden kurulan zaman serisi (time series). Zaman serisi bu uçuşun bu
seferki rezervasyonlarını bilmiyor ama geçmişin düzenini biliyor.

İkisi birbirinin yerine seçilmiyor, birleştiriliyor. Kaynak metin ağırlığın
nasıl kaydığını tek cümleyle veriyor: kalkış tarihine yaklaştıkça, bir uçuş
için gerçek rezervasyon birikimi bilgilerini kullanan rezervasyon profili
tahminine daha yüksek bir ağırlık veriliyor. Kalkıştan uzakta zaman serisi
baskın, kalkışa yaklaştıkça rezervasyon profili. Ağırlığın pusulası
kalkışa kalan gün sayısı, yani sistemin tahmin ürettiği okuma günleri
(reading days).

Bu tasarımın bir mühendislik sonucu var: birleşik tahmin, iki tahminin ve
bir ağırlık fonksiyonunun ürünü. Ağırlık fonksiyonu elle çizilmiş bir sabit
tablo olabilir, ama daha iyisi her modelin geçmişteki hatasından
türetilmesi. Hangi okuma gününde hangi modelin ne kadar yanıldığı
biliniyorsa, o gün az yanılana daha çok güvenmek doğal.

## Hatayı MAD ile ölçmek bir hız tercihi

Modelin geçmişteki hatasına göre ağırlık vermek, o hatayı bir metrikle
ölçmeyi gerektiriyor. İki aday var. Hata kareler ortalaması (MSE, mean
squared error) her hatanın karesini alıyor; büyük sapmaları, aykırı
değerleri orantısız ağır cezalandırıyor. Ortalama mutlak sapma (MAD, mean
absolute deviation) hatanın yalnızca mutlak değerini alıyor; bütün
sapmalara aynı ölçekte bakıyor.

MSE'nin aykırı değerleri ağır cezalandırması bir avantaj: tek bir büyük
ıskalamanın, bir sürü küçük ıskalamadan daha pahalı olduğu durumlarda
doğru sinyali veriyor. Ama kaynak metnin tespiti, MAD'in hesaplama
açısından daha verimli olduğu. İş birimi işlem maliyetine ve hıza öncelik
veriyorsa MAD'i tercih edebiliyor.

Bu tercihin ağırlığı ölçekle anlaşılıyor. Tahmin tek bir uçuş için değil,
her uçuş, her sınıf ve her okuma günü için üretiliyor, ve ağırlıklar bu
hücrelerin her birinde güncelleniyor. Hücre başına küçük bir hesaplama
farkı, gece çalışan bir toplu işte bütün ağın süresine yansıyor. Yazılım
tarafında bunun karşılığı, hata metriğinin bir strateji arayüzü arkasında
durması: hangisinin kullanılacağı bir iş kararı, ve iş birimi aykırı
değerlere daha duyarlı olmak istediğinde kodu değil yapılandırmayı
değiştirebilmeli.

## Kapanan sınıf talebi silmiyor, gizliyor

Rezervasyon verisinin en sinsi sorunu, sistemin kendi kararlarının
izlerini taşıması. Bir ücret sınıfı dolduğunda ya da gelir yönetimi onu
bilerek kapattığında, o sınıftan rezervasyon gelmesi duruyor. Veride
görünen şey sıfır talep. Gerçekte olan ise talebin kesilmesi (demand
truncation): yolcu vardı, ama alacağı bir koltuk yoktu.

Bu kısıtlanmış veri (censored data) olduğu gibi geçmişe yazılırsa tahmin
bir kısır döngüye giriyor. Kapatılan sınıfın talebi düşük görünüyor, bir
sonraki dönemde o sınıfa daha az koltuk ayrılıyor, sınıf daha erken
doluyor, veri daha da düşük görünüyor. Spill bölümlerinde anlatılan
taşan talep burada tahmin verisinin içine sızıyor. Bu yüzden tahmin
yapılmadan önce veri, kısıttan arındırılıyor; buna unconstraining ya da
untruncation deniyor.

Kaynak metin kapalı dönemlerdeki eksik veriyi doldurmak için üç yol
sayıyor. Birincisi geçmiş uçuşlardan ödünç alınan verilerle ortalama
atama (mean imputation): sınıfın açık kaldığı benzer uçuşların
ortalaması, kapalı dönemin yerine konuyor. İkincisi medyan ya da belirli
bir yüzdelik değerin atanması (quantile). Üçüncüsü EM
(Expectation-Maximization) gibi yinelemeli algoritmalar: talep
dağılımının ortalaması ve varyansı için bir başlangıç tahmini yapılıyor,
kapalı dönemlerin beklenen talebi bu tahminle dolduruluyor, doldurulmuş
veriyle ortalama ve varyans yeniden hesaplanıyor, ve bu döngü değerler
sabitlenene kadar tekrarlanıyor.

EM'in öbür ikisinden farkı, kapalı dönemi bir sabitle doldurmak yerine
"burada gözlemlenen sayı gerçek talebin alt sınırıydı" bilgisini
kullanması. Kısıtlanmış bir gözlem, talebin en az o kadar olduğunu
söylüyor; EM bu bilgiyi atmıyor, dağılımın kuyruğunu tahmin etmek için
kullanıyor. Kaynak metin de bu tercihi bir iş kuralı olarak koyuyor:
sınıfların kapandığı dönemlerdeki veriyi yok saymak yerine, o dönemlerdeki
potansiyel talep EM ile sisteme geri kazandırılmalı.

Yazılım tarafında bunun karşılığı, rezervasyon geçmişinin yalnızca sayıyı
değil, o sayının gözlemlendiği anda sınıfın açık mı kapalı mı olduğunu da
tutması. Envanter durumu kaydedilmemiş bir geçmişte hangi sıfırın gerçek,
hangisinin kısıtlı olduğunu ayırmak mümkün değil; en iyi algoritma bile
bu ayrımı veride olmayan bir bilgiden üretemez.

## Basit ortalama çoğu zaman karmaşık modeli geçiyor

Tahmin doğruluğu artırılmak istendiğinde ilk refleks modeli
karmaşıklaştırmak oluyor: daha çok katman, daha çok değişken, yapay sinir
ağları. Kaynak metin bu reflekse karşı açık bir ampirik tespitte
bulunuyor: genel inanışın aksine, bireysel tahminlerin basit bir
ortalaması genellikle gelişmiş yaklaşımlardan daha doğru talep tahmini
sağlıyor.

Bu tespit, önceki bölümlerdeki yapının neden işe yaradığını da
açıklıyor. Zaman serisi ve rezervasyon profili farklı bilgi kaynaklarına
dayanıyor, dolayısıyla farklı yerlerde yanılıyorlar. Birinin fazla
tahmin ettiği yerde diğeri eksik tahmin ediyorsa, ortalamaları ikisinden
de doğruya yakın düşüyor. Tahmin katmanının değeri tek bir mükemmel
modelden değil, birbirinden bağımsız hata yapan modellerin birleşiminden
geliyor. Kaynak metin bu birleşime birleşik tahmin (composite forecast)
diyor.

Aynı mantık modele yeni üyeler eklemeyi de açıklıyor. Standart
tahminlere ek olarak Kalman filtresi gibi bağımsız bir model sürece dahil
edilebiliyor ve bütün modeller MSE ya da MAD değerlerine göre
birleştirilebiliyor. Kaynak metnin çıkarımı, bunun tahmin sapmalarını
(bias) en aza indirdiği. Burada önemli olan Kalman filtresinin kendisi
değil, bağımsız olması: diğer modellerle aynı hataları yapan bir
eklenti, ortalamaya bir şey katmıyor.

Bu, karmaşık modellerin hiçbir zaman kullanılmaması gerektiği anlamına
gelmiyor. Kaynak metnin koyduğu ölçüt bir denge: karmaşık modelin
maliyeti ile getirdiği marjinal iyileşme birlikte tartılmalı. Çok
katmanlı bir sinir ağının eğitimi, bakımı ve açıklanması bir maliyet;
farklı modellerin ağırlıklı ortalamasını alan birleşik tahmin hem
doğruluğu artırıyor hem hesaplama maliyetini düşürüyor. Yazılım
tarafında bunun karşılığı, tahmin motorunun bir model değil, bir model
kayıt defteri etrafında kurulması: her model aynı arayüzle tahmin ve
geçmiş hata üretiyor, birleştirici katman ağırlıkları hesaplıyor, yeni
bir model eklemek birleştiriciye dokunmayı gerektirmiyor.

## Yarın işe yarayacak dört çıkarım

1. **Ağırlığı kalkışa kalan güne bağla.** Tahmin motoru, kalkışa kalan
   okuma günü azaldıkça ağırlığı zaman serisinden rezervasyon profiline
   otomatik kaydırmalı. Ağırlıkları sabit bir tablodan değil, her modelin
   o okuma günündeki geçmiş hatasından türet.
2. **Model çeşitliliğini hata bağımsızlığıyla ölç.** Kalman filtresi gibi
   bağımsız modelleri sürece dahil et ve MSE ya da MAD değerlerine göre
   birleştir. Yeni bir modeli, doğruluğuyla değil, mevcut modellerden
   farklı yerde yanılıp yanılmadığıyla değerlendir.
3. **Kapalı sınıfın sıfırını talep sayma.** Rezervasyon geçmişine
   envanter durumunu da yaz, kapalı dönemlerin talebini EM ile geri
   kazan. Kısıtlanmış veriyle beslenen bir tahmin, kendi kapattığı
   sınıfı bir sonraki dönemde daha da küçültür.
4. **Karmaşıklığı marjinal iyileşmeyle tart.** Yapay sinir ağına geçmeden
   önce mevcut modellerin ağırlıklı ortalamasını alan birleşik tahmini
   dene. Daha karmaşık modelin getirdiği iyileşme, eğitim, bakım ve
   açıklanabilirlik maliyetini karşılamıyorsa birleşik tahminde kal.

Bu bölümde ne yok: tahmin edilen talebin kapasiteyi aştığında ne kadar
yolcu kaybettirdiği ve bu kaybın modellenmesi (spill bölümleri), yüksek
varyanslı talebin hangi dağılımla temsil edileceği ("Yüksek varyanslı
talep ve iki aşamalı Cox dağılımı"), ve tahminin ücret sınıflarına koltuk
ayıran optimizasyona nasıl girdiği. Bu bölüm yalnızca optimizasyonun
önüne konan sayının nereden geldiğini ve o sayıyı hangi varsayımların
şekillendirdiğini anlatmak için var.
