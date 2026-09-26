---
title: "Gelir yönetiminde ağ optimizasyonu ve bacak ayrıştırma"
domain: "aviation"
summary: "Ağ genelinde teklif fiyatı çözen bir gelir yönetimi motoru iki sorunla uğraşır: milyonlarca değerlendirmeyi zamanında bitirmek ve servis sınıflarının aynı kapasiteyi paylaştığını unutmamak. Bu bölüm Gamma dağılımının tablo aramasıyla hızlandırılmasını, Lagrangian gevşetmenin iyileşme ve durma kriterlerini, ayrıştırılmış modellerin geliri neden eksik tahmin ettiğini ve bacak ayrıştırma modelinin başarısını teklif fiyatı tabanlı paylaştırmaya borçlu olmasını anlatıyor."
audience: "Gelir yönetimi optimizasyon motoru yazan, bakımını yapan ya da bu motorun çıktısını envanter sistemine bağlayan yazılımcı. Talep tahmini ve overbooking bölümlerinin okunmuş olması işe yarar; teklif fiyatı (bid price), yuvalama (nesting), EMSR, Lagrangian gevşetme, alt gradyan ve bacak ayrıştırma metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, scale-and-performance, pricing]
ai: generated
---

Talep tahmini bölümleri sayıyı üretti, overbooking bölümleri o sayının
üzerine kaç koltuk fazla satılacağını hesapladı. Bu bölüm tahminle envanter
kontrolü arasındaki motora bakıyor: ağ genelinde geliri en büyüklemeye
çalışan optimizasyon modeline. Kaynak metin dört şeyi yan yana koyuyor:
servis sınıfı talebinin Gamma dağılımıyla modellenmesi, teklif fiyatlarının
Lagrangian gevşetmeyle çözülmesi, servis sınıflarının kapasiteyi yuvalanmış
biçimde paylaşması ve bacak ayrıştırma (leg decomposition) modeli.
**Bir ağ modelini iyi yapan şey matematiğinin inceliği değil, kapasitenin
sınıflar arasında gerçekte nasıl paylaşıldığını ve gelirin bacaklara nasıl
dağıtıldığını doğru varsaymasıdır.** Yanlış varsayımla kurulmuş zarif bir
model, geliri sistematik olarak eksik tahmin ediyor.

Terimleri baştan netleştirmek gerekiyor. Servis sınıfı (service class, sc)
bir rezervasyon sınıfı ile onun kullandığı güzergâhın birleşimi. Bacak (leg)
tek bir kalkış-varış uçuşu; bir O&D (origin and destination) yolculuğu bir
ya da birden fazla bacaktan geçiyor. Teklif fiyatı (bid price) bir bacaktaki
bir sonraki koltuğun fırsat maliyeti: bir talep, geçtiği bacakların teklif
fiyatlarını karşılıyorsa kabul ediliyor.

## Hız, doğruluğu bozmadan tablodan geliyor

Sistem, bir servis sınıfına gelen talebin Gamma dağılımına uyduğunu
varsayıyor. Sorun
dağılımın kendisinde değil, onunla yapılan hesaptaki tekrar sayısında.
Optimizasyonun her iterasyonu, her servis sınıfı için kümülatif dağılımı ve
onun tersini defalarca değerlendiriyor. Kaynak metin bunu açıkça söylüyor:
ağ optimizasyon modelinin gerektirdiği milyonlarca değerlendirme düşünülünce
doğrudan hesap yavaş kalıyor.

Çözüm üç yönlü interpolasyon içeren hızlı tablo aramaları (table lookup).
Dağılımın değerleri önceden bir ızgara üzerinde hesaplanıyor, çalışma
anında istenen nokta en yakın ızgara noktalarından interpole ediliyor.
Kaynağa göre bu yaklaşım hem matematiksel doğruluğu koruyor hem de
operasyonel hızı sağlıyor.

Yazılım tarafında bunun karşılığı tanıdık bir desen: pahalı ve saf bir
fonksiyonu, girdi uzayı sınırlı olduğu için önceden hesaplanmış bir tabloya
çevirmek. Ama iki şey kontrol altında tutulmalı. İlki ızgaranın
çözünürlüğü: interpolasyon hatası, optimizasyonun durma eşiğinden büyükse
algoritma tablonun gürültüsünü kovalıyor demek. İkincisi tablonun sürümü:
dağılım parametrelerinin kapsadığı aralık değiştiğinde tablo yeniden
üretilmeli, yoksa uç değerlerde sessizce yanlış sonuç döner. Bu tablo bir
önbellek değil, modelin parçası; testleri de ona göre yazılmalı.

Optimal değerin nasıl kurulduğu da tablo aramasının neden bu kadar sık
çağrıldığını açıklıyor. Kaynak metne göre bir servis sınıfı için optimal
değer (Xsc) üç bileşenden geliyor: servis sınıfının geçtiği bacaklar, o
bacakların gölge fiyatlarının (shadow prices) toplamı ve ilgili dağılımın
ters fonksiyonu. Yani her servis sınıfı için önce güzergâhındaki bacakların
gölge fiyatları toplanıyor, sonra bu toplam dağılımın tersinden geçiriliyor.
Gölge fiyatlar her iterasyonda değiştiği için ters fonksiyon da her
iterasyonda, her servis sınıfı için yeniden çağrılıyor. Milyonlarca
değerlendirme buradan çıkıyor.

## Bir iterasyonun iyileşme sayılması tek bir sayıya bağlı değil

Teklif fiyatları doğrusal olmayan programlama formülleriyle çözülüyor. Bu
süreçte Lagrangian gevşetme (Lagrangian relaxation) ve alt gradyan
(sub-gradient) yöntemi devreye giriyor. Lagrangian gevşetmede zor kısıtlar,
yani bacak kapasiteleri, doğrudan zorlanmıyor; her kısıta bir çarpan
atanıyor ve ihlal amaç fonksiyonuna bir maliyet olarak ekleniyor. Bacak
kapasite kısıtının çarpanı ekonomik olarak o bacağın gölge fiyatı. Alt
gradyan yöntemi bu çarpanları, kısıtların ne kadar ihlal edildiğine bakarak
her iterasyonda güncelliyor: kapasitesi aşılan bacağın fiyatı yükseliyor,
boş kalan bacağınki düşüyor.

Kaynak metin bir iterasyonun iyileşme sayılması için üç kriter veriyor ve
bunlardan birinin gerçekleşmesi yetiyor. Birincisi, mevcut iterasyondaki
Lagrangian maliyetinin o ana kadarki en iyi değerden (incumbent) düşük
olması. İkincisi, toplam kısıt ihlal hatasının azalması. Üçüncüsü, tüm
kısıtlar içindeki en büyük ihlal miktarının düşmesi.

Üç kriterin varlığı bir şey söylüyor: tek başına amaç değeri, ilerlemenin
güvenilir ölçüsü değil. Alt gradyan yöntemi monoton ilerlemiyor; amaç değeri
bir iterasyonda kötüleşirken kısıtlar daha iyi sağlanıyor olabilir. Yalnızca
Lagrangian maliyetine bakan bir uygulama, uygulanabilirliğe yaklaşan bir
adımı reddedip en iyi bilinen çözümü güncellemiyor. Toplam ihlal ile en
büyük ihlal arasındaki ayrım da ayrı bir sinyal: toplam hata azalırken tek
bir bacak kötüleşebilir, ya da tersi. İkisini birlikte izlemek, hatanın
ağa yayıldığı durumla tek bir darboğazda toplandığı durumu ayırıyor.

Durma kriteri de aynı mantığa dayanıyor. Algoritma, ana maliyet (primal
cost) ile Lagrangian maliyeti (dual cost) arasındaki fark önceden
tanımlanmış bir eşiğin altına düştüğünde duruyor. Bu fark, bulunan
çözümün teorik en iyiden en fazla ne kadar uzak olabileceğinin ölçüsü.
Sabit iterasyon sayısıyla durmak, çözümün ne kadar iyi olduğunu söylemiyor;
dualite farkıyla durmak söylüyor.

Yazılım tarafında bunun karşılığı gözlemlenebilirlik. Optimizasyon koşusu
bir kara kutu olarak loglanırsa, sonuç kötü çıktığında neyin yanlış
gittiği bilinmiyor. Her iterasyonda Lagrangian maliyeti, en iyi değer,
toplam ihlal, en büyük ihlal ve dualite farkı kayda geçmeli. Koşu eşiğe
ulaşmadan zaman sınırına takılıyorsa bu, üretimde sessizce kabul edilen
bir çözüm değil, alarm üretmesi gereken bir olay. Dualite farkı her gece
koşunun kalitesini tek sayıyla söyleyen metrik.

## Ayrıştırılmış modeller geliri sistematik olarak eksik tahmin ediyor

EMSR (expected marginal seat revenue), sınıf bazında beklenen marjinal
koltuk gelirine göre koruma seviyesi hesaplayan klasik yöntem ailesi.
EMSRa gibi geleneksel modeller servis sınıflarını birbirinden ayrılmış
(partitioned) bölmeler olarak ele alıyor: her sınıfa bir miktar kapasite
ayrılıyor ve o sınıf yalnızca kendi bölmesinden satıyor.

Gerçek envanter böyle çalışmıyor. Yuvalama (nesting) yapısında üst
sınıflar alt sınıfların kapasitesine erişebiliyor; yüksek ücretli yolcu,
düşük ücretli sınıfa ayrılmış koltuğu alabiliyor. Kaynak metin bu
formülasyonun, yuvalama dikkate alındığında servis sınıflarının tahsisleri
ortaklaşa paylaştığı gerçeğini göz ardı ettiğini söylüyor. Sonuç yönü
belli bir hata: model, üst sınıfın alt sınıf kapasitesinden alacağı
satışları görmediği için hem trafiği hem geliri eksik tahmin ediyor.

Hatanın rastgele değil sistematik olması önemli. Rastgele bir hata
ortalamada kapanır; sistematik eksik tahmin ise her kararı aynı yöne iter.
Eksik tahmin edilen gelir, bir rotanın, bir kapasite kararının ya da bir
fiyat hamlesinin olduğundan kötü görünmesi demek. Karar destek aracı
olarak kullanılan bir modelde bu, yanlış yöne verilmiş tutarlı tavsiye
anlamına geliyor.

Sürekli yuvalama (continuous nesting) bu varsayımı tersine çeviriyor.
Satışa açık olan tüm servis sınıfları uçağın kalan kapasitesini ortak bir
havuz olarak görüyor ve paylaşıyor. Sınıflar arasında sabit duvar yok;
bir sınıfın açık ya da kapalı olması, kalan kapasitenin ve o sınıfın
değerinin fonksiyonu.

Yazılım tarafında bunun karşılığı, envanter sistemi ile optimizasyon
modelinin aynı dünyayı modellemesi. Envanter sistemi yuvalanmış satıyor ama
optimizasyon modeli ayrıştırılmış varsayıyorsa, modelin önerdiği tahsisler
envanterde uygulandığı anda başka bir şeye dönüşüyor. Bu uyumsuzluğu bir
entegrasyon testinde yakalamak mümkün: modelin öngördüğü sınıf bazlı
satışlarla, aynı talep senaryosunun envanter simülasyonundan geçirilmiş
halini karşılaştırmak. Fark sürekli aynı yöndeyse, sorun tahminde değil
modelin yapısında.

## Bacak ayrıştırma başarısını paylaştırma kuralına borçlu

Ağ optimizasyonunun tam hali, bütün O&D'leri ve bütün bacakları tek bir
problemde çözmek. Bacak ayrıştırma modeli ağı bacaklara bölüyor ama
bacakları birbirinden koparmıyor: EMSRb tabanlı denklemleri bacak bazlı
teklif fiyatlarıyla birleştiriyor. Her bacak kendi içinde tek bacaklı bir problem gibi
çözülüyor, ama o bacağa düşen gelir ağın geri kalanının teklif
fiyatlarıyla belirleniyor. Kaynak metne göre modelin öne çıkan yanı,
servis sınıfları arasında envanter paylaşımına izin vererek sistem
performansını artırması.

Buradaki kritik karar paylaştırma (proration): çok bacaklı bir O&D
biletinin gelirinin hangi kısmının hangi bacağa yazılacağı. Geleneksel
yollar mil tabanlı ya da ücret tabanlı paylaştırma; gelir, bacakların
uzunluğuna ya da o bacaklardaki yerel ücretlere göre bölünüyor. Bacak
ayrıştırma modeli ise teklif fiyatı tabanlı paylaştırma kullanıyor: gelir,
ilgili bacağın teklif fiyatının, güzergâhtaki tüm bacakların toplam teklif
fiyatına oranına göre dağıtılıyor.

Farkın anlamı şu. Mil ve ücret, bir bacağın o anki kıtlığını söylemiyor.
Uzun ama boş bir bacak mil tabanlı paylaştırmada gelirin büyük kısmını
alıyor; oysa o bacakta koltuk bol, fırsat maliyeti düşük. Kısa ama dolu
bir bacak küçük pay alıyor; oysa koltuğu değerli olan o. Teklif fiyatı
tabanlı paylaştırma geliri, koltuğu gerçekten kıt olan bacağa yazıyor ve
o bacaktaki envanter kararını doğru sinyalle besliyor. Kaynak metin
simülasyon sonuçlarını yorumlarken temkinli ama açık: sonuçların olumlu
çıkması belki de mil ya da ücret tabanlı paylaştırma yerine teklif fiyatı
tabanlı paylaştırma kullanılmasındandı.

Denge noktası da ekonomik olarak tanımlı. Bacak bazlı teklif fiyatı
güncellenirken sistem optimumdayken, kaynağın ifadesiyle her bacağın
teklif fiyatı o bacakta satılan son koltuğun değerine eşit oluyor. Bu
tanım bir tutarlılık testi olarak da kullanılabilir: teklif fiyatı ile son
koltuğun net değeri arasındaki fark büyükse sistem dengede değil, ya
optimizasyon yakınsamamış ya da girdiler tutarsız.

Burada bir karışıklığı önlemek gerekiyor. Sitede MPA ve SPA prorate
anlaşmalarını anlatan bölüm, havayolları arasındaki gelir paylaşımıyla
ilgili: iki taşıyıcı ortak bir biletin gelirini sözleşmeyle bölüyor.
Buradaki paylaştırma ise tek bir havayolunun içinde, envanter kontrolü
için yapılan dahili bir muhasebe. Muhasebe tarafında hangi kural
kullanılırsa kullanılsın, optimizasyon tarafının kendi paylaştırma
kuralını fırsat maliyetine göre seçmesi mümkün. Yazılım tarafında bunun
karşılığı, iki paylaştırmayı aynı alanda saklamamak: gelir raporlamasına
giden paylaştırma ile kontrol sistemine giden paylaştırma farklı soruların
cevabı.

## Model seçimi bir tahmin doğruluğu sorusu değil, bir yapı sorusu

Dört temayı yan yana koyunca ortak bir çizgi çıkıyor. Tablo araması,
modeli çalıştırılabilir kılıyor. Lagrangian kriterleri, çözümün ne kadar
iyi olduğunu ölçülebilir kılıyor. Yuvalama ve teklif fiyatı tabanlı
paylaştırma ise modelin doğru şeyi optimize etmesini sağlıyor. Kaynak metnin
yönetici özetindeki temel bulgu da bu: sürekli yuvalama sistemleri ve
teklif fiyatı tabanlı gelir paylaştırma, ağ gelirini tahmin etmede ve en
büyüklemede daha başarılı.

Bunun pratik sonucu, bir gelir yönetimi sistemini değerlendirirken
sorulacak ilk sorunun "tahmin ne kadar doğru" olmaması. Tahmin kusursuz
olsa bile, sınıfları ayrı bölmeler gibi gören ve geliri mile göre bölen
bir model yanlış kararı tutarlı biçimde verir. Önce yapıya bakmak
gerekiyor: kapasite paylaşımı nasıl modellenmiş, gelir bacaklara nasıl
dağıtılıyor, optimizasyon ne zaman ve neye göre duruyor.

## Yarın işe yarayacak dört çıkarım

1. **Pahalı dağılım fonksiyonlarını tabloya çevir, tabloyu modelin parçası
   say.** Büyük ölçekli ağlarda kümülatif dağılım ve tersini her seferinde
   hesaplamak yerine interpolasyon destekli önceden hesaplanmış tablolar
   kullan. Interpolasyon hatasını durma eşiğiyle karşılaştır, tabloyu
   sürümle ve parametre aralığı değişince yeniden üret.
2. **Ayrıştırılmış modeli yuvalanmış envanterin önüne koyma.** Servis
   sınıflarını birbirinden izole eden modeller trafiği ve geliri eksik
   tahmin ediyor. Envanter paylaşımına izin veren yuvalanmış ya da teklif
   fiyatı tabanlı kontrol mekanizmalarını tercih et; modelle envanterin aynı
   varsayımla çalıştığını bir simülasyon testiyle doğrula.
3. **O&D gelirini bacaklara teklif fiyatıyla dağıt.** Mil ya da ücret
   tabanlı paylaştırma bacağın o anki kıtlığını görmüyor. Kontrol için
   kullanılan paylaştırmayı, bacağın teklif fiyatının güzergâhtaki toplam
   teklif fiyatına oranıyla yap; muhasebe paylaştırmasıyla aynı alana
   yazma.
4. **Optimizasyonu yalnızca amaç değeriyle izleme.** İyileşmeyi Lagrangian
   maliyeti, toplam ihlal ve en büyük ihlalle birlikte değerlendir; durmayı
   ana ve Lagrangian maliyet arasındaki farka bağla. Her koşunun dualite
   farkını kaydet ve eşiğe ulaşmadan biten koşuyu alarm olarak ele al.

Bu bölümde ne yok: dağılımın parametrelerini besleyen talep tahmini
(talep tahmini ve O&D tahminleme bölümleri), teklif fiyatının üzerine
eklenen fazla satış kararı (overbooking bölümleri) ve havayolları arasındaki
sözleşmeye dayalı gelir paylaşımı ("Havacılıkta gelir paylaşımı: çok taraflı
ve ikili prorate anlaşmaları (MPA ve SPA)"). Bu bölüm, tahmin ile envanter
kontrolü arasındaki optimizasyon motorunun hangi varsayımlarla doğru
sonuç verdiğini anlatmak için var.
