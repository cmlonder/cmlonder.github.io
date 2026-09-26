---
title: "O&D talep tahmini: birinci ve ikinci nesil yaklaşımlar"
domain: "aviation"
summary: "O&D talep tahmini 1990'ların ortasında segment tahminini tarihsel bilet akışlarıyla parçalara bölen tahmin zenginleştirmesiyle başladı, sonra doğrudan PNR'dan beslenen modellere geçti. Bölüm iki neslin veri kaynağını, 4 ila 12 haftalık muhasebe gecikmesinin neyi kırdığını, düşük hacimli sınıfların nasıl tahmin edildiğini ve tüketici seçim modelinin pazar talebini sınıflara hangi nedenlerle dağıttığını anlatıyor."
audience: "Gelir yönetimi, envanter ya da talep tahmini sistemleriyle çalışan, O&D tahmininin hangi veriden ve hangi seviyede üretildiğini anlamak isteyen yazılımcı ve analist. Spill bölümlerinin okunmuş olması işe yarar; O&D, PNR, çift yönlü mutabakat, Croston yöntemi, tüketici seçim modeli (CCM) ve displacement time metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Spill bölümleri tek bir uçuşun, tek bir bacağın talebiyle uğraşıyordu:
bu uçağa kaç yolcu gelmek istiyor, kaçını geri çeviriyoruz. Ağ taşıyan bir
havayolunda bu soru eksik kalıyor. Aynı koltukta oturan iki yolcudan biri
yalnızca o bacağı uçuyor, öteki bir aktarma merkezinden geçip başka bir
şehre gidiyor; ikisinin havayoluna bıraktığı gelir de, o koltuğu
kaybetmenin maliyeti de farklı. Kalkış-varış (origin and destination, O&D)
tahmini bu farkı görmek için var: talebi uçuş bacağına göre değil,
yolcunun gerçek seyahat rotasına ve sınıfına göre tahmin etmek.
**O&D tahmininin iki nesli arasındaki fark algoritmada değil, verinin
nereden ve ne zaman geldiğinde: birincisi dünün bilet akışıyla bugünün
segment tahminini bölüyor, ikincisi tahmini rezervasyonun yapıldığı
seviyede, her gün yeniden üretiyor.** Geri kalan her şey, düşük hacimli
sınıflar, seçim modelleri, fiyat duyarlılığı, bu temel farkın sonucu.

## Birinci nesil yeni bir tahmin üretmiyor, eskisini yeniden bölüyor

1990'ların ortasında O&D tahmininin ilk hali "tahmin zenginleştirme"
(forecast enrichment) adıyla ortaya çıktı. Kaynak metin yöntemi tek
cümleyle tanımlıyor: bir segment sınıfı tahmininin, bilet verilerinden
elde edilen tarihsel trafik dağılımına dayanarak bir O&D sınıfı tahminine
dönüştürülmesi. Yani sistem önce alışık olduğu işi yapıyor, uçuş bacağı ya
da segment bazında sınıf tahmini üretiyor. Sonra geçmiş biletlere bakıp o
segmentteki yolcuların hangi oranda hangi kalkış-varış çiftine ait
olduğunu çıkarıyor ve segment tahminini bu oranlarla paylaştırıyor.

Bu yaklaşımın cazibesi açık: mevcut segment tahmin altyapısına
dokunmadan O&D çıktısı veriyor. Yazılım tarafında bunun karşılığı,
çalışan bir tahmin servisinin önüne yeni bir model koymak yerine arkasına
bir dağıtım katmanı eklemek. Riski de aynı yerden geliyor: dağıtım
katmanı, altındaki segment tahmini ne kadar iyiyse o kadar iyi, ve
kullandığı oranlar ne kadar tazeyse o kadar güncel.

## Aktarma merkezinde sayımlar iki yönden birbirini tutmak zorunda

Segment tahminini O&D'ye bölmek tek bir segment için basit bir çarpım.
Ağ üzerinde ise bir tutarlılık problemi. Bir aktarma merkezine (hub) gelen
bacakta "bu yolcuların şu kadarı şu çıkış uçuşuna aktarma yapacak" diye
bölünen talep, o çıkış uçuşunun kendi segment tahmininden bölünen
"şu kadarı şu geliş uçuşundan geliyor" talebiyle aynı sayıyı vermeli.
Vermiyorsa sistem aynı O&D için iki farklı rakam taşıyor ve hangisine göre
koltuk korunacağı belirsiz.

Birinci nesil sistemler bunu "çift yönlü mutabakat" (bi-directional
reconciliation) ile çözüyor: hub'da uçuş öncesi ve sonrası sayımların
birbiriyle tutarlı olması sağlanana kadar dağılım iki uçtan birlikte
ayarlanıyor. Buradaki dersi yalnızca havacılığa ait saymamak gerekiyor.
Toplamdan parçaya inen her tahmin sisteminde, parçalar farklı toplamlardan
türetildiğinde bir mutabakat adımı gerekiyor; o adım yoksa tutarsızlık
sessizce envanter kararlarına sızıyor.

## En büyük zayıflık yöntem değil, 4 ila 12 haftalık gecikme

Tarihsel trafik dağılımı bilet verisinden, yani gelir muhasebesinden
geliyor. Kaynak metin bunu birinci nesil modellerin en kritik zayıflığı
olarak işaretliyor: gelir muhasebesi verilerine uçuş kalktıktan hemen
sonra ulaşılamıyor, verilerin erişilebilir olması 4 ila 12 hafta
sürebiliyor. Bu, dağıtım oranlarının her zaman en az bir ay, çoğu zaman
bir çeyreğe yakın geriden geldiği anlamına geliyor.

Sonucu tahmin etmek zor değil. Sistem geçmişteki trafik akışlarını baz
aldığı için piyasa koşullarına hızlı yanıt veremiyor. Rakip bir hub yeni
bir bağlantı açtığında, bir pazar birden canlandığında ya da bir kampanya
yolcu karmasını değiştirdiğinde, bu değişim dağıtım oranlarına ancak
haftalar sonra, o uçuşlar çoktan kalkmışken yansıyor.

Birinci nesil sistemlerin bu gecikmeyle yaşama yolu kalibrasyon.
Tarihsel veri sezon atamasından ve aykırı değer tespitinden (outlier
detection) geçiriliyor; bayram haftasının akışı sıradan bir haftaya
uygulanmıyor, tek seferlik bir sapma kalıcı bir oran gibi okunmuyor. Ama
bu, verinin yaşını düzeltmiyor, yalnızca eski verinin yanlış okunmasını
engelliyor. Gerçek zamanlı değişime cevap vermek için kaynak metin açıkça
ikinci nesle, PNR bazlı sistemlere geçişi öngörüyor.

Yazılım tarafında bunun karşılığı şu: bir modelin kalitesini
değerlendirirken girdi verisinin gecikmesini ayrı bir metrik olarak
izlemek gerekiyor. 12 hafta gecikmeli beslenen iyi bir model, günlük
beslenen vasat bir modelden hızlı değişen pazarda daha kötü karar
verebilir.

## İkinci nesil tahmini rezervasyonun yapıldığı seviyede üretiyor

Doğrudan O&D tahmini (direct O&D forecasting) veri kaynağını değiştiriyor.
Bilet muhasebesi yerine yolcu isim kaydı (Passenger Name Record, PNR)
kullanılıyor. PNR, rezervasyonun kendisi: yolcunun hangi kalkıştan hangi
varışa, hangi uçuşlardan ve hangi sınıfta yer aldığını, rezervasyon
yapıldığı anda taşıyor. Kaynak metin ikinci neslin metodolojik
üstünlüğünü tam burada görüyor: doğrudan O&D tahmini rezervasyon süreciyle
aynı seviyede tahmin üretiyor, yani tahminler rezerve edildikleri seviyede
oluşturuluyor.

Bu cümlenin ağırlığı birinci nesille karşılaştırınca anlaşılıyor.
Birinci nesil, O&D talebini dolaylı olarak, segmentten geriye doğru
çıkarıyordu. İkinci nesil O&D talebini doğrudan gözlüyor; segment
seviyesindeki sayı artık O&D tahminlerinin toplamı, tersi değil. Hub
mutabakatı gibi bir ara adıma olan ihtiyaç da bu yüzden azalıyor, çünkü
parçalar zaten aynı kaynaktan geliyor.

PNR'ın bir avantajı daha var: yaşayan bir kayıt. Yeni rezervasyon,
iptal, değişiklik, hepsi PNR'ı güncelliyor. Kaynak metnin önerisi bu
güncellemelerin günlük işlenmesi. Sistem rezervasyon hızını (booking
pace), eldeki rezervasyonları ve geçmiş trendleri birleştirerek bir taban
tahmin (baseline forecast) oluşturuyor ve bunu her gün yeniden kuruyor.
Brifingin sayısal iddiası da buradan geliyor: gelir muhasebesine dayalı
tahmin yerine günlük PNR güncellemelerini işleyen sistemler, pazar
değişimine tepki süresini 12 haftadan 1 güne indirebiliyor.

Bu süreçte bir karar noktası öne çıkıyor: budanmış talebin tahmini
(spill estimation, untruncation). PNR yalnızca kabul edilen talebi
gösteriyor. Bir sınıf satışa kapandıktan sonra gelen yolcu PNR'a
düşmüyor; veride görünmüyor ama vardı. Günlük PNR akışını olduğu gibi
tahmine sokan bir sistem, sık kapanan sınıfların talebini sistematik
olarak düşük tahmin ediyor, düşük tahmin daha az koruma, daha az koruma
daha erken kapanma getiriyor. Spill bölümlerinde anlatılan kısıtlanmış
talep problemi O&D seviyesinde de aynen geçerli, sadece daha fazla
hücreye dağılmış halde.

## Düşük hacimli sınıflar doğrudan değil, pazar üzerinden tahmin ediliyor

Tahmini O&D ve sınıf seviyesine indirmenin bedeli hücre sayısı. Bir ağda
kalkış-varış çiftlerinin, uçuş yollarının ve sınıfların çarpımı çok büyük
bir sayı veriyor ve bunların büyük kısmında talep az: çoğu gün sıfır,
arada bir birkaç yolcu. Bu tür kesikli (intermittent) talepte standart
zaman serisi yöntemleri kötü çalışıyor, çünkü ortalama etrafında dalgalanan
bir seri yerine uzun sıfır dizileri ve arada tekil sıçramalar var.

Kaynak metin iki yol gösteriyor. Birincisi, düşük hacimli veri için
özelleşmiş teknikler; örnek olarak verilen Croston yöntemi, kesikli
talebi tek bir seri olarak değil, talebin ne sıklıkla geldiği ve geldiğinde
ne büyüklükte olduğu olarak ayırıp ele alan bir yaklaşım. İkincisi, talebi
tek tek sınıflarda tahmin etmeye hiç çalışmamak: talebi pazar sınıfı
düzeyinde, verinin yeterince yoğun olduğu seviyede tahmin edip ardından
bir tüketici seçim modeliyle (Customer Choice Model, CCM) alt sınıflara
dağıtmak.

İkinci yol birinci nesle benziyor gibi görünüyor, çünkü o da toplamı
tahmin edip parçalara bölüyordu. Fark bölme mantığında. Birinci nesil
geçmiş bilet oranlarıyla bölüyordu: geçen çeyrek bu segmentin yüzde
kaçı bu O&D'ye gittiyse bu çeyrek de öyle. CCM ise yolcunun neden bir
seçeneği ötekine tercih ettiğini modelliyor ve bu nedenler değiştiğinde
dağılım da değişiyor. Brifing bu yolu tahmin sapmalarını en aza indirmenin
yöntemi olarak öneriyor: düşük trafikli rotalarda doğrudan tahmin yerine
pazar bazlı tahmin artı CCM.

## Seçim modeli talebi nedenlere göre dağıtıyor, oranlara göre değil

CCM'nin pazar talebini sınıflara bölerken kullandığı kriterler, bir
yolcunun iki uçuş arasında nasıl seçim yaptığının listesi. Kaynak metin
bunları nedensel faktörler olarak sayıyor: hizmet tipi (direkt ya da
aktarmalı), uçak tipi (geniş gövde, jet ve benzeri), kalkış ve varış
saatleri, toplam seyahat süresi, yolcunun istediği zamanla uçuş saati
arasındaki fark (displacement time), rotadaki uçuş frekansı, ücretler ve
bilet kısıtlamaları.

Displacement time bu listede ayrıca durmayı hak ediyor. Sabah dokuzda
toplantısı olan yolcu için sabah yedi uçuşu ile öğlen uçuşu aynı pazarın
iki ürünü değil; ilki ihtiyacını karşılıyor, ikincisi karşılamıyor.
Tarihsel oranla bölen bir sistem bu ayrımı ancak geçmiş veride iz
bıraktıysa görüyor. Seçim modeli ise bu farkı açıkça bir değişken olarak
taşıyor, dolayısıyla bir uçuşun saati değiştiğinde talebin nasıl yeniden
dağılacağını geçmişte o saatte bir uçuş olmasa bile hesaplayabiliyor.

Brifingin çıkarımı da bu yönde: tahmin modellerine yalnızca tarihsel
doluluğu değil, uçak tipi, seyahat süresi ve bilet kısıtlamaları gibi
nedensel faktörleri eklemek müşteri tercihlerini daha doğru yansıtıyor.
Yazılım tarafında bunun karşılığı, tahmin servisinin girdisinin yalnızca
rezervasyon geçmişi olmaması; tarife, ücret ve ürün verisinin de aynı
modele beslenmesi. Tarife sistemi ile tahmin sistemi arasındaki veri
bağımlılığı bu noktada tek yönlü olmaktan çıkıyor.

## Fiyat modele girdiğinde kampanya bir tahmin olayına dönüşüyor

Seçim modelinin nedensel faktörlerinden biri ücret. Kaynak metin fiyat
değişkeninin sisteme dahil edilmesiyle talep üzerindeki fiyat
hassasiyetinin CCM üzerinden ölçüldüğünü söylüyor. Bunun pratik anlamı
özellikle büyük çaplı ücret indirimlerinde ortaya çıkıyor: sistem talebi
hızla yeniden hesaplayabiliyor ve kapasite kontrolünü bu yeni talebe göre
ayarlayabiliyor.

Fiyatı bilmeyen bir tahmin modelinde kampanya bir anomali. Rezervasyon
hızı birden artıyor, model bunu ya aykırı değer olarak eliyor ya da
kalıcı bir talep artışı sanıp sonraki haftalara taşıyor; ikisi de yanlış.
Fiyatı bilen bir modelde aynı artış açıklanabilir bir tepki: ücret düştü,
talep şu esneklikle arttı. Kampanya bittiğinde model neyin geri döneceğini
de biliyor. Bu, fiyatlandırma ekibiyle gelir yönetimi ekibinin aynı
kararın iki ucunu tuttuğu yer; önceki fiyatlandırma bölümlerinde
anlatılan reaktif ve proaktif ücret hamlelerinin talep tarafındaki
karşılığı burada hesaplanıyor.

## Tekli sınıf modelleri iki etkileşimi yapısal olarak göremiyor

İkinci nesil de sınırsız değil. Kaynak metin tekli rezervasyon sınıfı
modellerinin gerçek dünyadaki iki talep etkileşimini modellemede yapısal
olarak yetersiz kaldığını söylüyor. Birincisi sınıf içi geçişler: yolcunun
aradığı sınıf kapalıyken bir üst sınıfı alması (upsell) ya da açık olan
daha ucuz sınıfa kayması (downsell). İkincisi uçuşlar arası geri kazanım
(cross flight recapture): bir uçuşta yer bulamayan yolcunun aynı
havayolunun başka bir uçuşuna geçmesi.

Her iki etkileşimde de talep bir sınıfa ya da uçuşa ait değil, yolcuya
ait; yolcu kendisine sunulan seçenekler arasında hareket ediyor. Her sınıfı
bağımsız bir talep akışı sayan model bu hareketi görmüyor. Bir sınıf
kapandığında o sınıfın talebinin kaybolduğunu varsayıyor, oysa bir kısmı
yukarı, bir kısmı başka bir uçuşa geçiyor. Sonuç, kapanmanın maliyetinin
olduğundan yüksek, bazen de yanlış yerde hesaplanması.

Bu sınırın çözümü de yine seçim modellerinden geçiyor: talebi seçenekler
kümesine karşı modelleyen bir yapı, bir seçenek kapandığında talebin
nereye aktığını tahmin edebiliyor. Birinci nesilden ikinci nesle geçiş
verinin kaynağını değiştirmişti; bir sonraki adım tahminin birimini
değiştiriyor, sınıftan yolcu tercihine.

## Tahmin tek başına değil, envanter kontrolüyle birlikte değer üretiyor

O&D tahmini kendi başına bir karar vermiyor; bir envanter kontrol
sistemine girdi oluyor. Brifing bunu somut bir örnekle bağlıyor: Apollo
gibi bir küresel dağıtım sisteminin (GDS) kontrolleriyle doğrudan O&D
tahminlerinin (örnek olarak Orion projesi veriliyor) eş zamanlı
çalıştırılması, gelir yönetiminde sanal yuvalamanın (virtual nesting)
etkinliğini artırıyor.

Sanal yuvalama, O&D ve sınıf kombinasyonlarını gelir değerlerine göre
sanal kovalara yerleştirip envanteri bu kovalar üzerinden koruyan
yaklaşım. Kovaların doğru kurulması, hangi O&D'nin ne kadar talep
getireceğinin bilinmesine bağlı. Tahmin 12 hafta geriden geliyorsa kovalar
dünkü ağa göre kurulu; günlük güncelleniyorsa bugünkü ağa. Yazılım
tarafında bunun karşılığı, tahmin servisi ile envanter kontrolü
arasındaki güncelleme sıklığının iki sistemin en yavaşı kadar olduğunu
akılda tutmak: tahmini her gün yenileyip envanter kurallarını haftada bir
yüklemek, günlük tahminin kazancını haftalığa indiriyor.

## Yarın işe yarayacak dört çıkarım

1. **Tahmin verisini rezervasyon akışından besle.** Gelir muhasebesine
   dayanan tahmin, 4 ila 12 haftalık gecikmeyi her karara taşıyor. Günlük
   PNR güncellemelerini işleyen bir tahmin hattı, pazar değişimine tepki
   süresini 12 haftadan 1 güne indirebiliyor. Girdi gecikmesini model
   kalitesinden ayrı bir metrik olarak izle.
2. **Düşük hacimli sınıfı doğrudan tahmin etmeye zorlama.** Kesikli
   talepte ya Croston gibi düşük hacme özel bir yöntem kullan ya da talebi
   pazar seviyesinde tahmin edip CCM ile sınıflara böl. Seyrek hücrede
   doğrudan tahmin, sapmayı büyütüyor.
3. **Seçim modeline nedensel faktörleri besle.** Tarihsel doluluğun
   yanında hizmet tipi, uçak tipi, saat, seyahat süresi, displacement
   time, frekans, ücret ve bilet kısıtlamalarını modele ver. Tarife ve
   ücret verisini tahmin servisinin girdisi olarak tasarla, sonradan
   eklenecek bir zenginleştirme olarak değil.
4. **Tahmini ve envanter kontrolünü aynı ritimde çalıştır.** Doğrudan O&D
   tahminini GDS envanter kontrolleriyle eş zamanlı işlet; sanal yuvalama
   kovaları ancak tahmin kadar günceldir. Bu sırada budanmış talebi
   geri kazanma adımını atlama, yoksa sık kapanan sınıfın talebi her gün
   biraz daha düşük görünür.

Bu bölümde ne yok: budanmış talebin nasıl geri kazanıldığı ve kaybedilen
yolcunun nasıl hesaplandığı (spill bölümleri), sanal yuvalamanın ve
envanter kontrolünün kendi mekanizması, upsell, downsell ve uçuşlar arası
geri kazanımı açıkça modelleyen seçim modellerinin ayrıntısı. Fiyat
değişiminin talebe nasıl yansıdığının ücret tarafı "Havacılıkta özel
ücretler ve fiyat esnekliği" bölümünde. Bu bölüm yalnızca O&D tahmininin
hangi veriden, hangi seviyede ve hangi sıklıkta üretildiğini, ve bu
seçimlerin tahminin neyi görüp neyi göremediğini nasıl belirlediğini
anlatmak için var.
