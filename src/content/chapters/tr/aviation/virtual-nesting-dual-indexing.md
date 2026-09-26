---
title: "Sanal gruplama ve çift indeksleme: havacılık envanterinde koltuğun kime açılacağı"
domain: "aviation"
summary: "Sanal gruplama, bir uçuş bacağındaki koltuğu rezervasyon sınıfına göre değil, yolculuğun ağa bıraktığı net değere göre açar: ücretten o bacağın yer değiştirme maliyeti düşülür, çıkan değer yolcuyu bir gruba koyar. Çift indeksleme aynı yolcuyu aktarmalı yolculuğun iki bacağında ayrı ayrı değerlendirir. Bu bölüm iki mekanizmanın mantığını ve hub-and-spoke ağda neden iki indeksin yettiğini anlatıyor."
audience: "Envanter, erişilebilirlik ya da gelir yönetimi sistemleriyle çalışan, bir rezervasyon sınıfının neden bir O&D için açık, öbürü için kapalı göründüğünü anlamak isteyen yazılımcı ve analist. Bacak bazlı ve O&D bazlı kontrol farkını bilmek işe yarar; yer değiştirme maliyeti, CER, sanal grup (bucket), net nesting, EMSR ve çift indeksleme metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Klasik envanter kontrolünde bir uçuş bacağının koltukları rezervasyon
sınıflarına göre açılır ve kapanır. K sınıfı açıksa, K sınıfından bilet
arayan herkes o koltuğu görür. Bu model, bacağın üzerinde oturan
yolcuların farklı yolculuklar yaptığını bilmez: LAX-JFK koltuğunda oturan
biri yalnızca o bacağı uçuyor olabilir, bir başkası o bacağı daha uzun
bir aktarmalı yolculuğun parçası olarak kullanıyor olabilir. İkisi aynı
sınıfta, aynı koltuğu istiyor, ama havayoluna bıraktıkları para aynı
değil. Kaynak metin, American Airlines ve Sabre PSS gibi sektör
standartlarından yola çıkarak bu farkı yönetmek için kurulan üç
mekanizmayı anlatıyor: yer değiştirme maliyeti, sanal gruplama (virtual
nesting) ve çift indeksleme (dual indexing). **Bir koltuğun kime açılacağını
rezervasyon sınıfı değil, o koltuğu dolduran yolculuğun ağa bıraktığı net
değer belirler; sınıf yalnızca bu kararın girdilerinden biri.**

## Bir koltuğun değeri, ücretinden başkasına satılamamanın bedeli düşülünce ortaya çıkar

Mekanizmanın ilk adımı tek bir çıkarma işlemi. Sistem, bir hizmet
sınıfının ücretinden (fare), ağ optimizasyon modelinin o uçuş bacağı için
belirlediği yer değiştirme maliyetini (displacement cost) düşüyor. Çıkan
sayıya kaynak metin CER diyor, açılımı Contribution to Expected Revenue:
beklenen gelire katkı. Formül kaynakta şöyle geçiyor: CER, s sınıfının
ücreti eksi j bacağının yer değiştirme maliyeti.

Yer değiştirme maliyeti, o koltuğu bu yolcuya verince başka bir potansiyel
yolcuya satamamanın fırsat maliyeti. Kaynak metin hesabın amacını bu fırsat
maliyetini "harmonize etmek" olarak tarif ediyor. Kaba ifadeyle: bir
yolcunun bıraktığı ücret brüt değer, yer değiştirme maliyeti o yolcunun
yerinden ettiği yolcunun beklenen değeri. Aradaki fark, havayolunun bu
satıştan gerçekten kazandığı.

Bu çıkarma aktarmalı yolculuk için özellikle önemli. Uzun bir aktarmalı
yolculuğun toplam ücreti yüksek görünebilir, ama o ücret birden fazla
bacağın koltuğunu tüketiyor. Her bacakta kendi yer değiştirme maliyeti
düşüldüğünde, yolculuğun gerçek katkısı brüt ücretin söylediğinden farklı
çıkabiliyor. Ücret tablosuna bakarak verilen karar, bu farkı göremiyor.

## Yer değiştirme maliyeti sabit bir tarife değil, ağın o anki durumunun fiyatı

Kaynak metin bu noktada açık: yer değiştirme maliyeti sabit bir rakam
değil. Ağ optimizasyon modeli onu her uçuş bacağı (leg j) için ayrı ayrı
belirliyor ve değer ağın genel doluluk ve talep durumuna göre değişiyor.
Dolmaya yakın, talebi güçlü bir bacakta koltuğu vermenin bedeli yüksek;
boş gidecek bir bacakta düşük.

Bunun iki sonucu var. Birincisi, aynı ücretli aynı O&D'nin CER değeri
bacaktan bacağa değişiyor, çünkü düşülen maliyet bacağa özel. İkincisi,
aynı bacakta bile zamanla değişiyor, çünkü ağın doluluk ve talep durumu
değiştikçe model maliyeti yeniden belirliyor. CER bir ürün özelliği
değil, bir anlık görüntü.

Yazılım tarafında bunun karşılığı şu: yer değiştirme maliyeti bir
konfigürasyon tablosunda duran sabit değil, ağ optimizasyon modelinin
periyodik çıktısı. Envanter sistemi bu değeri tüketen taraf. Maliyet
değiştiğinde ona bağlı her şeyin, yani CER sıralamasının ve aşağıda
anlatılacak grup atamasının, yeniden hesaplanması gerekiyor. Maliyeti
bir kere okuyup önbellekte unutan bir envanter servisi, dünkü ağın
kararını bugün vermeye devam eder.

## Sanal gruplama, yolculukları rezervasyon sınıfına göre değil net değere göre sıralar

CER hesaplandıktan sonra sanal gruplama devreye giriyor. Aynı uçuş
bacağını kullanan farklı başlangıç ve varış noktalarına sahip yolculuklar,
yani farklı O&D'ler, CER değerlerine göre yüksekten düşüğe sıralanıyor.
En yüksek net değere sahip olanlar 1. gruba (Index 1) giriyor, sonrakiler
sırayla daha alt gruplara. Kaynak metin, örneğin ekonomi kabini için bu
yapının genellikle dört gruptan (bucket) oluştuğunu söylüyor.

Buradaki "sanal" kelimesi önemli. Gruplar rezervasyon sınıfları değil;
yolcu onları görmüyor, acente ekranında da çıkmıyorlar. Envanter
sisteminin içinde duran, O&D ve sınıf çiftlerini değer katmanlarına
eşleyen bir ara yapı. Satış kanalına görünen hâlâ rezervasyon sınıfı;
ama o sınıfın bir O&D için açık olup olmadığını, eşlendiği grup belirliyor.

Kaynak metne göre bu yapının amacı, havayolunun daha değerli olan
bağlantılı uçuş yolcularını yerel ve daha az kâr bırakan yolcuların önüne
alabilmesi. Bacak bazlı kontrol bunu yapamıyordu, çünkü bacak bir
yolcunun nereden gelip nereye gittiğini bilmiyordu. Sanal gruplama O&D
bilgisini bacak düzeyindeki koltuk kararına taşıyor, ama bunu her O&D
için ayrı bir envanter açmadan, sınırlı sayıda grup üzerinden yapıyor.

## Aynı sınıf iki farklı gruba düşebilir; yüksek sınıf koltuğu garanti etmez

Sanal gruplamanın en sezgiye aykırı sonucu burada. Aynı rezervasyon
sınıfına, kaynak metnin örneğiyle K sınıfına sahip farklı O&D'ler, farklı
sanal gruplara düşebiliyor. Bir O&D'nin net değeri düşükse, yüksek bir
ücret sınıfında olsa bile daha alt bir gruba, örneğin 4. gruba
yerleştirilip envantere erişimi kısıtlanabiliyor.

Yani "K açık mı?" sorusunun tek bir cevabı yok. Cevap, K'yı hangi O&D için
sorduğuna bağlı. Bir O&D için K satılabilirken, aynı bacağı kullanan başka
bir O&D için aynı anda kapalı olabilir. Bu, kaynağın deyişiyle indeks
sıralamasının rezervasyon sınıfı ve ücret ilişkisini yönetme biçimi: sınıf
bir fiyat etiketi olarak kalıyor, erişim kararı ise net değere taşınıyor.

Bu durum ürün ve destek ekipleri için bir tuzak. Acente ya da müşteri
"bu sınıf dün açıktı, şimdi neden kapalı" ya da "bu sınıf şu rotada açık,
benimkinde neden değil" diye sorduğunda, sınıf tablosuna bakarak cevap
verilemiyor. Cevap, o O&D'nin o bacaktaki CER değerinde ve eşlendiği
grupta. Yazılım tarafında bunun karşılığı şu: erişilebilirlik sorgusu
bacak ve sınıfla değil, O&D bağlamıyla birlikte gelmek zorunda. O&D
bilgisini taşımayan bir sorgu, sanal gruplamanın verdiği kararı
tekrarlayamaz; ya fazla açık ya fazla kapalı cevap döner. Denetim ve
hata ayıklama için de her erişim kararının yanına hangi gruba
eşlendiğini ve o anki CER'i kaydetmek, kararın sonradan açıklanabilmesinin
tek yolu.

## Kaç koltuğun açılacağını grup değil, gruplar arası iç içe yetkilendirme belirler

Gruplar sıralamayı veriyor, ama bir bacakta hangi gruba kaç koltuk
satılabileceği ayrı bir soru. Kaynak metin, örneğin LAX-JFK bacağında
satışa açılacak koltuk sayısının, yani yetkilendirme seviyesinin
(authorization level), "net nesting" yöntemine dayandığını söylüyor. Her
sanal grup için beklenen marjinal koltuk geliri (EMSR, expected marginal
seat revenue) hesabının varyasyonları kullanılıyor ve hangi grubun kaç
koltuk satabileceği otomatik olarak belirleniyor.

"Net" kelimesi, EMSR hesabının brüt ücret yerine CER üzerinden, yani yer
değiştirme maliyeti düşülmüş değer üzerinden yapılmasına işaret ediyor.
"Nesting" ise grupların iç içe olduğunu söylüyor: üst gruba ayrılan
koltuklar alt gruba kapalı, ama alt gruba açık koltuklar üst grubun da
erişiminde. Böylece değerli yolculuk hiçbir zaman değersiz olanın
bulduğu koltuğu bulamaz duruma düşmüyor.

Sıralama bir kez kurulduğunda yetkilendirme onun üzerinde çalışıyor.
Bu yüzden iki hesabın doğruluğu birbirine bağlı: CER sıralaması yanlışsa,
EMSR ne kadar iyi hesaplanırsa hesaplansın yanlış gruba koltuk ayırır.
Yer değiştirme maliyetinin güncelliği, dolaylı olarak bacağın kaç
koltuğu kime açtığını da belirliyor.

## Çift indeksleme, aynı yolcuyu her bacakta o bacağın rakiplerine göre değerlendirir

Aktarmalı yolculukta mesele bir adım daha karmaşıklaşıyor. Kaynak metnin
örneği AUS-DFW-BOS: Austin'den Dallas'a, oradan Boston'a giden bir yolcu.
Bu yolcu iki bacak kullanıyor, AUS-DFW ve DFW-BOS, ve her iki bacakta da
aynı rezervasyon sınıfında. Soru şu: iki bacakta da aynı gruba mı düşmeli?

Çift indeksleme mantığı hayır diyor. Yolcunun değeri her uçuş bacağı için
ayrı ayrı değerlendiriliyor. Kaynak metnin örneğinde yolcu ilk bacakta
(AUS-DFW) o bacağın pazar koşullarına göre yüksek değerli kabul edilip 2.
gruba düşerken, ikinci bacakta (DFW-BOS) diğer pazar sınıflarıyla
kıyaslandığında daha düşük değerli görülüp 4. gruba düşebiliyor.

Atamanın dayandığı fonksiyonu kaynak metin "görece değer" (relative value)
olarak adlandırıyor: ilgili O&D'nin, o uçuş bacağı üzerindeki diğer tüm
pazar sınıflarına göre sahip olduğu değer. Aynı yolculuk, AUS-DFW
bacağında o bacağı kullanan diğer O&D'lerle yarışıyor; DFW-BOS bacağında
ise tamamen farklı bir rakip kümesiyle. Birinci bacakta güçlü bir aday
olan yolculuk, ikinci bacakta Boston'a giden daha değerli yolculukların
arasında sıradan kalabiliyor. Kaynak metnin stratejik notu da bunu
söylüyor: çift indeksleme ile bir aktarmalı pazar, rezervasyon değerine
bağlı olarak ilk bacakta ikinci bacağa kıyasla farklı şekilde
indekslenebiliyor ve bu, havayolunun koltuk envanterini her bacakta en
kârlı kombinasyonla doldurmasını sağlıyor.

Yazılım tarafında bunun karşılığı şu: aktarmalı bir yolculuğun
erişilebilirliği tek bir arama değil, bacak başına bir arama. Her bacak
kendi indeks tablosuna bakıyor, kendi grubunu buluyor ve kendi
yetkilendirme seviyesine göre karar veriyor. Yolcu iki koltuğa birden
ihtiyaç duyduğu için yolculuk ancak iki bacak da izin verdiğinde
satılabiliyor. Grup ataması da bu yüzden bir O&D özelliği olarak değil,
O&D ile bacak çiftinin özelliği olarak saklanmalı; O&D başına tek bir
grup numarası tutan veri modeli çift indekslemeyi ifade edemiyor.

## İki indeksin yetmesi ağın şeklinden geliyor, algoritmanın sınırından değil

Mantık genellenebilir: üç bacaklı bir yolculuk üç indeks, dört bacaklı
bir yolculuk dört indeks alabilirdi. Kaynak metin bu çoklu indekslemenin
(multiple indexing) neden genellikle tercih edilmediğini ağın
ekonomisiyle açıklıyor.

Hub-and-spoke ağ yapısında yolcu trafiğinin yaklaşık yüzde 30'u yerel,
yüzde 70'i aktarmalı. Ama aktarmalı yolcunun ezici çoğunluğu tek bir
merkezden geçiyor: kenardan merkeze, merkezden kenara. Kaynak metne göre
ortalama bir yolcunun seyahat ettiği uçuş bacağı sayısı 1.7, yani ikiden
az. İki bacağı aşan yolculuk, bu ağda istisna. Çift indeksleme, kaynak
metnin ifadesiyle operasyonel verimlilik ve kârlılık dengesini sağlamak
için yeterli kabul ediliyor.

Bu bir tasarım kararının gerekçesi olarak okunmalı. Çift indeksleme,
çoklu indekslemenin "yetersiz bir yaklaşıması" değil; trafiğin gerçek
şekline göre seçilmiş bir sadeleştirme. Ortalama yolcu iki bacaktan az
uçuyorsa, üçüncü ve dördüncü indeks için tutulan tablolar ve yapılan
hesaplar trafiğin küçük bir kesimine hizmet ediyor. Buradan çıkan
mühendislik dersi de genel: bir modelin karmaşıklığını, verinin
dağılımının kuyruğuna değil gövdesine göre ayarla. Kuyruk değişirse,
örneğin ağ yapısı noktadan noktaya uçuşlara ya da birden fazla merkezli
yolculuklara kayarsa, varsayımı yeniden sınamak gerekir. 1.7 bir doğa
sabiti değil, belirli bir ağın ölçümü.

## Yarın işe yarayacak beş çıkarım

1. **Erişilebilirliği O&D bağlamıyla sorgula.** Bir sınıfın açık olup
   olmadığını bacak ve sınıf ikilisiyle soran bir arayüz, sanal gruplamanın
   kararını yeniden üretemez. Sorguya O&D'yi taşı; aynı sınıfın bir O&D
   için açık, öbürü için kapalı olması bir hata değil, mekanizmanın
   kendisi.
2. **Yer değiştirme maliyetini canlı bir girdi olarak ele al.** Değer
   bacağa özel ve ağın doluluk ve talep durumuyla değişiyor. Ağ
   optimizasyon modeli yeni değer ürettiğinde CER sıralamasını, grup
   atamasını ve yetkilendirme seviyelerini birlikte yeniden hesapla.
3. **Grup atamasını O&D ile bacak çifti üzerinde sakla.** Çift indeksleme
   aynı yolcuyu iki bacakta iki farklı gruba koyabiliyor. O&D başına tek
   grup tutan bir veri modeli bu kararı taşıyamaz; aktarmalı yolculuğun
   satışı da iki bacağın ayrı ayrı izin vermesine bağlı.
4. **Her erişim kararının gerekçesini kaydet.** "Bu sınıf neden kapalı"
   sorusunun cevabı sınıf tablosunda değil, o anki CER'de ve eşlenen
   grupta. İkisini karar anında kaydetmeyen bir sistem, destek ekibine
   açıklanamayan kapanışlar bırakır.
5. **İndeks sayısını ağın şekline göre seç ve varsayımı izle.** Çift
   indeksleme, yüzde 70'i aktarmalı ve ortalama 1.7 bacaklı bir hub-and-spoke
   trafiği için yeterli. Ortalama bacak sayısını düzenli ölç; ağ
   değiştiğinde yeterlilik varsayımı da değişir.

Bu bölümde ne yok: ağ optimizasyon modelinin yer değiştirme maliyetini
nasıl ürettiği, EMSR hesabının kendisi ve bacak bazlı kontrolden O&D
kontrolüne geçişin tarihi ("Gelir yönetimi ve stratejik operasyonlar:
PEOPLExpress ve American Airlines analizi"). O&D düzeyindeki talebin nasıl
tahmin edildiği "O&D tahminleme ve must-forecast listesi" bölümünde,
kapasiteyi aşan talebin kaybı spill bölümlerinde. Bu bölüm yalnızca iki
şeyi netleştirmek için var: koltuğun neden sınıfa değil net değere göre
açıldığı ve aktarmalı yolcunun neden her bacakta ayrı değerlendirildiği.
