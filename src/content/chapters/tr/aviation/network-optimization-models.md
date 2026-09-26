---
title: "Havacılık gelir yönetimi: şebeke optimizasyon modelleri"
domain: "aviation"
summary: "Şebeke optimizasyon modeli, kapasite kısıtı altında ağın toplam beklenen gelirini en büyük yapacak envanter kontrollerini arar ve bu arayışın yan ürünü olarak her bacağa bir teklif fiyatı yazar. Bu bölüm modelin kurulduğu değişkenleri, deterministik talep varsayımının neden agresif kontrol ürettiğini, talebin bir dağılım olarak modele nasıl girdiğini ve büyük ağlarda hesabın Lagrangian relaksasyonuyla nasıl küçültüldüğünü anlatıyor."
audience: "Envanter, erişilebilirlik (availability) ya da gelir yönetimi sistemleriyle çalışan ve teklif fiyatının nereden geldiğini görmek isteyen yazılımcı ve ürün insanı. O&D kontrolü ve spill bölümlerinin okunmuş olması işe yarar; teklif fiyatı (bid price), gösterge değişkeni, deterministik ve stokastik program, Gamma dağılımı, Lagrangian relaksasyonu ve alt-gradyan yöntemi metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing, scale-and-performance]
ai: generated
---

Önceki bölümler O&D kontrolünün neden gerektiğini anlatıyordu: bacak
bazlı bakan bir envanter, aktarmalı yolculuğun toplam değerini göremiyor
ve bazen yanlış yolcuyu kabul ediyor. Bu bölüm o sezginin arkasındaki
makineye bakıyor. Kaynak metin şebeke optimizasyon modelinin amacını tek
cümleyle koyuyor: mevcut kapasiteye tabi olarak ağdaki toplam beklenen
geliri en büyük yapan optimal envanter kontrollerini belirlemek. Cümlede
iki kelime yük taşıyor: "ağdaki" ve "beklenen". Birincisi kararın tek bir
uçuşta değil bütün ağda verildiğini, ikincisi talebin kesin bir sayı
değil bir belirsizlik olduğunu söylüyor. **Teklif fiyatı bir fiyat
listesi değil, ağ genelinde bir koltuğu harcamanın bedelini gösteren
marjinal bir ödünleşim ölçüsü; onu doğru üretmek de talebi kesin sanmayan
bir modele bağlı.** Bölümün geri kalanı bu iki kelimeyi açıyor.

## Sınıflar arası rekabet ancak ağ ölçeğinde fiyatlanabilir

Aynı koltuk için birden fazla hizmet sınıfı yarışıyor: aynı bacaktan
geçen doğrudan bir yolcu, o bacağı bir aktarmanın parçası olarak
kullanan başka bir yolcu, farklı ücret sınıflarında aynı yolculuğu
isteyen üçüncü biri. Bu yarışı yönetmenin iki yolu var. Birincisi her
bacağı kendi içinde değerlendirmek ve en yüksek ücreti ödeyene öncelik
vermek. İkincisi ödünleşimi ağ genelinde açıkça hesaplamak. Kaynak metin
ikincisini seçiyor: sistem, ağdaki marjinal ödünleşimleri açıkça
hesaplamak için bir şebeke optimizasyon modeli kullanıyor ve bu modelden
optimal teklif fiyatlarını (bid prices) çıkarıyor. Amaç, düşük değerli
talebin yüksek değerli talebin önünü kesmemesi.

"Marjinal" kelimesi burada kritik. Teklif fiyatı bir bacaktaki ortalama
ücret değil; o bacaktan bir koltuk daha harcamanın ağın geri kalanına
maliyeti. Bir koltuğu şimdi satmak, o koltuğu ileride isteyecek daha
değerli bir yolcuyu reddetmek anlamına gelebilir. Teklif fiyatı bu
vazgeçilen geliri tek bir sayıya indiriyor.

Kaynak metin etkinin dolaysız kısmıyla da yetinmiyor. Optimizasyon
yalnızca doğrudan etkileri değil, ağ içindeki birinci, ikinci ve üçüncü
derece etkileri de hesaba katıyor. Bir bacağın kullanımı önce o bacağı
paylaşan yolculukları etkiliyor; o yolculukların kullandığı diğer
bacaklar üzerinden başka yolculukları; onlar üzerinden de bir halka
dışarıdakileri. Bacak bazlı bakış bu zincirin yalnızca ilk halkasını
görüyor. Yazılım tarafında bunun karşılığı şu: bir bacağın doluluğunu
raporlayan bir ekran, o bacağı etkileyen bağlantı akışlarını göstermiyorsa
yöneticiye yerel bir optimum sunuyor. Kaynak metnin çıkarımı da bu
yönde: bağlantılı uçuşlar üzerindeki etki raporlamaya ve optimizasyona
girmeli, hedef yerel değil küresel ağ optimizasyonu olmalı.

## Model beş harfle kuruluyor ve teklif fiyatı kısıtın gölgesinden çıkıyor

Kaynak metnin kullandığı gösterim modeli neredeyse kendiliğinden
kuruyor. Her hizmet (s) ve sınıf (c) çifti için bir ücret değeri Rsc ve
bir beklenen talep tahmini Dsc var. Her uçuş bacağı (j) için bir kapasite
Cj var. Karar değişkeni Xsc: o hizmet ve sınıf çiftine ayrılacak envanter.
Beşinci harf modeli ağa bağlayan harf: Isc gösterge değişkeni. Bir hizmet
ve sınıf çifti j bacağından geçiyorsa değeri 1, geçmiyorsa 0. Kapasite
kısıtı bu göstergeyle yazılıyor; bir bacağın kapasitesini yalnızca o
bacaktan akan yolculuklar tüketiyor.

Bu parçalarla deterministik hali şöyle okunuyor:

```text
en büyük yap:   toplam( Rsc * Xsc )
kısıtlar:       her bacak j için   toplam( Isc,j * Xsc ) <= Cj
                her s, c için      0 <= Xsc <= Dsc
```

Model her ücret değerini beklenen talep tahminiyle karşılaştırıyor ve
kapasite kısıtı içinde toplam geliri en büyük yapacak şekilde en yüksek
marjinal getiriyi sunan talebe öncelik veriyor. Kaynak metin teklif
fiyatlarını belirleyen modelin deterministik ya da stokastik bir doğrusal
program olarak kurulabileceğini söylüyor. Deterministik halde teklif
fiyatı, her bacağın kapasite kısıtına bağlı ikili (dual) değer olarak
ortaya çıkıyor: o bacağa bir koltuk daha eklenseydi toplam gelirin ne
kadar artacağı. Bir kısıt gevşekse, yani bacakta boş koltuk kalıyorsa,
o bacağın teklif fiyatı sıfıra iner; kısıt sıkıysa pozitif olur.

Yazılım tarafında bunun iki karşılığı var. Birincisi, Isc bir seyrek
matris: ağdaki hizmet ve sınıf çiftlerinin çok büyük bir kısmı herhangi
bir bacaktan geçmiyor. Bu matrisi yoğun tutan bir veri modeli, ağ
büyüdükçe belleği boşa harcıyor. İkincisi, modelin çıktısı iki farklı
şeydir: Xsc bir tahsis, teklif fiyatları ise bacak başına bir vektör.
Envanter sistemine hangisinin gideceği, erişilebilirlik kontrolünün nasıl
çalışacağını belirliyor. Kaynak metnin çıkarımı vektörden yana: satış
mantığı yalnızca koltuk sınıflarına değil, her rezervasyon talebinin tüm
ağ üzerindeki maliyetini ve getirisini yansıtan teklif fiyatı vektörlerine
dayanmalı.

## Talebi kesin sanan model koltuğu fazla cesur dağıtıyor

Yukarıdaki modelde Dsc tek bir sayı. Model o sayıya tam güveniyor:
yüksek ücretli sınıfa tam olarak tahmin kadar koltuk ayırıyor, gerisini
aşağıya bırakıyor. Kaynak metin bunun sonucunu açıkça yazıyor:
deterministik şebeke problemini çözmek, talep kesin olarak bilindiği
varsayıldığı için agresif envanter kontrollerine yol açabiliyor.
Agresiflik burada şu anlama geliyor: model belirsizliğe karşı pay
bırakmıyor. Talep tahminin üstünde gelirse yüksek değerli yolcuya yer
kalmıyor, altında gelirse korunan koltuklar boş gidiyor. İki durumda da
kapasite, beklenmeyen talep değişimine göre yanlış yönetilmiş oluyor.

Kaynak metnin önerdiği çıkış, talebi bir sayı olarak değil bir olasılık
dağılımı olarak ele almak. Talep olasılık yoğunluk fonksiyonlarıyla
modelleniyor; örnek olarak Gamma dağılımı veriliyor. Spill bölümlerinde
aynı dağılımın kısıtlanmış veriden gerçek talebi geri kurmak için
kullanıldığını görmüştük; burada ileri yönde, tahsis kararının girdisi
olarak kullanılıyor. Envanter tahsisi Xsc artık stokastik doğrusal
programlama ya da doğrusal olmayan programlama yöntemleriyle
belirleniyor. Hedef fonksiyonda "beklenen" kelimesi burada gerçek
anlamını kazanıyor: bir sınıfa bir koltuk daha ayırmanın getirisi, o
koltuğun satılma olasılığıyla tartılıyor.

Kaynak metnin çıkarımı da bu: envanter yönetiminde yalnızca geçmiş
veriye dayalı sabit rakamlar yerine, talep belirsizliğini temsil eden
Gamma dağılımı gibi istatistiksel modeller benimsenmeli. Yazılım
tarafında bunun anlamı, tahmin modülünden optimizasyon modülüne giden
sözleşmenin değişmesi. Tahmin tek bir ortalama gönderiyorsa, optimizasyon
ne kadar gelişmiş olursa olsun deterministik çalışıyor. Dağılımın en
azından ikinci parametresi, yani değişkenliği de arayüze girmeli.

## Talep eğrisini basamaklara bölmek değişken sayısını patlatıyor

Stokastik modeli çözmenin kolay görünen bir yolu var: doğrusal olmayan
talep eğrisini parça parça doğrusal basamaklara bölüp yine doğrusal
programlama ile çözmek. Kaynak metin bu basamaklı doğrusal yaklaşımın
(stepwise linear approximation) bedelini gösteriyor. Talep eğrisi ayrık
birimlere bölündüğü için her basamak yeni bir karar değişkeni oluyor ve
değişken sayısı aşırı büyüyor. Hassasiyeti artırmak için basamağı
küçültmek, değişkeni daha da çoğaltmak demek.

Önerilen yol doğrudan modelleme. Fiyat, arz ve talep belirsizliği
arasındaki ilişki daha az değişkenle ve daha yüksek doğrulukla kuruluyor;
kaynak metin bunun çıktısını olasılıksal teklif fiyatı (probabilistic bid
price) olarak adlandırıyor. Fark yalnızca hesap süresinde değil. Basamaklı
yaklaşımda doğruluk basamak genişliğine bağlı bir tasarım parametresi;
doğrudan modellemede dağılımın kendisi modelin içinde.

## Büyük ağda hesap, kısıtları hedefe taşıyarak küçülüyor

O&D bazlı çalışan büyük bir taşıyıcıda hizmet ve sınıf çiftlerinin sayısı
ağın boyutuyla birlikte katlanarak büyüyor. Kaynak metin ölçek sorununu
bir örnekle anlatıyor ve yaklaşımın kökenini koltuk satışının dışında
gösteriyor: bu yaklaşım American'da uçuş ekibi eşleştirmesinde (crew
pairing) doğmuş; kaynak metne göre olası ekip eşleştirmelerinin sayısı
bilinmiyor, muhtemelen iki trilyonun üzerinde. Bu, algoritmik
yaklaşımların yalnızca koltuk satmak için değil, operasyonel karmaşıklığı
yönetmek için de geliştirildiğini gösteriyor. Aynı matematik sonra
envanter problemine taşınmış.

Kullanılan teknik Lagrangian relaksasyonu ve alt-gradyan (sub-gradient)
yöntemi. Fikir şu: problemi zorlaştıran kısıtlar, burada bacak kapasite
kısıtları, doğrudan dayatılmak yerine birer ceza çarpanıyla hedef
fonksiyona taşınıyor. Kısıtlar gevşeyince problem çok daha küçük ve
bağımsız parçalara ayrılıyor. Çarpanlar da yaklaşık ikili fiyatlar, yani
yaklaşık teklif fiyatları. Alt-gradyan yöntemi bu çarpanları iteratif
olarak güncelliyor: bir bacak aşırı kullanılıyorsa onun çarpanı
yükseliyor, boş kalıyorsa düşüyor. Kaynak metin sürecin amacını şöyle
tarif ediyor: çözüm alanını daraltmak için yaklaşık ikili fiyatları
hızlıca hesaplamak ve hedef fonksiyona en yakın değeri iteratif olarak
bulmak.

Burada bir ödünleşim var ve açık söylemek gerekiyor. Lagrangian
relaksasyonu kesin çözümü değil, ona yaklaşan bir çözümü veriyor. Karşılığında
kazanılan şey hız. Kaynak metnin çıkarımı da hıza vurgu yapıyor: büyük
ağlarda işlem yükünü azaltmak ve gerçek zamanlıya yakın kararlar
alabilmek için bu tür problem küçültme teknikleri sistem mimarisine
entegre edilmeli.

Yazılım tarafında bunun karşılığı, optimizasyonun bir yığın işi olmaktan
çıkması. Süreç iteratif olduğu için durma koşulu, yani ne kadar
yaklaşıldığında yetinileceği, bir iş kararı haline geliyor ve bu kararın
kodun derinine gömülmesi yerine görünür bir parametre olarak durması
gerekiyor. Çıktı ise her durumda aynı biçimde, bacak başına bir teklif
fiyatı vektörü olarak envantere yazılıyor.

## Teklif fiyatı rezervasyon anında bir karşılaştırmaya dönüşüyor

Modelin bütün ağırlığı, satış anında basit bir işleme iniyor. Bir
rezervasyon talebi geldiğinde sistem, talebin kullanacağı bacakların
teklif fiyatlarını topluyor ve ücreti bu toplamla karşılaştırıyor. Ücret
ağa yükleyeceği maliyeti karşılıyorsa talep kabul ediliyor, karşılamıyorsa
reddediliyor. Kaynak metnin "her rezervasyon talebinin tüm ağ üzerindeki
maliyetini ve getirisini yansıtan" teklif fiyatı ifadesi bu
karşılaştırmayı tarif ediyor.

Bu noktada optimizasyon modelinin ne kadar ağır olduğu ile
erişilebilirlik cevabının ne kadar hızlı olması gerektiği arasındaki
ayrım netleşiyor. Ağır iş, yani Lagrangian iterasyonları, arka planda
koşuyor; ön planda kalan tek iş birkaç sayıyı toplayıp bir ücretle
kıyaslamak. Envanter sisteminin mimarisi bu ayrımı korumalı: teklif
fiyatı hesabı ile teklif fiyatı kontrolü ayrı bileşenler, aralarındaki
sözleşme de bacak başına bir vektör.

## Yarın işe yarayacak dört çıkarım

1. **Tahminden tek sayı değil, dağılım iste.** Optimizasyon modülüne
   yalnızca ortalama talep gidiyorsa model deterministik çalışır ve
   agresif kontrol üretir. Gamma gibi bir dağılımla belirsizliği temsil
   eden parametreleri de arayüze ekle; geçmiş veriden türetilmiş sabit
   rakamlarla envanter yönetme.
2. **Büyük ağda kesinliği hıza bilerek sat.** O&D bazlı çalışan bir
   taşıyıcıda tam çözüm gerçek zamana yetişmez. Lagrangian relaksasyonu
   ve alt-gradyan gibi problem küçültme tekniklerini mimariye baştan
   yerleştir, iterasyon sayısını da ayarlanabilir bir parametre olarak
   tut.
3. **Satış kararını teklif fiyatı vektörüne bağla.** Erişilebilirliği
   yalnızca sınıf açık ya da kapalı bilgisiyle vermek yerine, talebin
   kullandığı bacakların teklif fiyatlarının toplamını ücretle
   karşılaştıran bir kontrol kur. Hesap ile kontrolü ayrı bileşenler
   olarak tasarla.
4. **Raporlamayı bacaktan ağa taşı.** Bir bacağın doluluğunu gösteren
   her rapora, o bacağı paylaşan bağlantı akışlarını ve birinci, ikinci,
   üçüncü derece etkileri ekle. Aksi halde yönetici yerel optimumu
   küresel sanır.

Bu bölümde ne yok: bacak bazlı ve O&D bazlı kontrol arasındaki seçimin iş
tarafı ("Havacılık gelir yönetimi alternatifleri ve iş mantığı analizi"),
modele giren O&D talebinin nasıl tahmin edildiği ("O&D talep tahmini:
birinci ve ikinci nesil yaklaşımlar") ve Gamma dağılımının kısıtlanmış
veriden gerçek talebi geri kurmak için kullanımı (spill bölümleri). Bu
bölüm o tahminin, kapasite kısıtıyla karşılaştığı anda teklif fiyatına
nasıl dönüştüğünü anlatmak için var.
