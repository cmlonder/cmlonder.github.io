---
title: "Havacılık rezervasyon ve envanter yönetimi: stratejik iş mantığı analizi"
domain: "aviation"
summary: "Envanter bir koltuk sorusuna yalnızca uçuşa ve sınıfa bakarak cevap vermiyor; soruyu kimin, nereden ve hangi yolculuğun parçası olarak sorduğuna da bakıyor. Bu bölüm o bağlamı taşıyan dört mekanizmayı anlatıyor: segmentleri yolculuğa bağlayan Married to Journey, koltuk haritası ve ön rezervasyon, satış noktası (POS) hiyerarşisi ve acentenin satış noktası oyununu kapatan yolculuk başlangıç noktası (POC). Sonda aynı sınıfta farklı acentelere verilen liste dışı ücretlerin teklif fiyatıyla nasıl denetlendiği var."
audience: "Rezervasyon (CRS), envanter ya da gelir yönetimi sistemleriyle çalışan, bir uygunluk (availability) cevabının arkasındaki bağlam kurallarını anlamak isteyen yazılımcı ve ürün insanı. Envanter kontrolü ve O&D bölümlerinin okunmuş olması işe yarar; married segment, Married to Journey, POS hiyerarşisi, POC, host airline, liste dışı ücret (off-tariff), teklif fiyatı ve gelir seyrelmesi metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Envanter bölümleri şimdiye kadar tek bir soruyu farklı açılardan
cevapladı: bu sınıf açık mı, kapalı mı. Yuvalama, segment limitleri, teklif
fiyatı hep o sorunun cevabını üreten makinelerdi. Bu bölüm sorunun kendisine
bakıyor. **Envanter bir koltuğun açık olup olmadığına tek başına karar
vermez; soruyu kimin sorduğuna, nereden sorduğuna ve o koltuğun hangi
yolculuğun parçası olduğuna bakarak karar verir.** Aynı uçuşta, aynı sınıfta,
aynı anda iki acente iki farklı cevap alabilir ve bu bir hata değil, iş
kuralının kendisidir. Kaynak metin bu bağlamın dört taşıyıcısını sayıyor:
segmentin bağlı olduğu yolculuk, koltuk haritası, satış noktası ve
yolculuğun başladığı nokta. Hepsinin ortak amacı, havayolunun satışı
bağlamından koparıp tekil bir koltuk işlemi gibi görmemesi.

## Segment tek başına satılmaz, bir yolculuğun parçası olarak satılır

O&D kontrolünün temel varsayımı şu: bir bağlantılı yolculuğun değeri,
parçalarının değerlerinin toplamı değil. Aktarmalı bir yolculuğun ilk
bacağı, aynı bacağın tek başına satılmasıyla aynı gelir anlamına
gelmiyor. Havayolu bu farkı ancak segmentleri birbirine
bağlayabilirse görebiliyor. Sektörün bunun için kullandığı fiil
"evlendirmek" (marrying): birbirine bağlanan segmentler evli segment
(married segment) olarak birlikte değerlendiriliyor.

Standart segment evliliğinin bir kısıtı var. Yalnızca aynı anda satılan
segmentleri birleştirebiliyor. Yolcu iki bacağı tek işlemde alıyorsa
sorun yok; ama bir bacağı bugün, bağlantıyı günler sonra alıyorsa, ikinci
talep geldiğinde sistem onu birinciden habersiz, tek başına bir segment
satışı gibi değerlendiriyor. O&D kontrolü tam da bu noktada kör kalıyor.

Married to Journey bu boşluğu kapatıyor. Daha önce satılmış bir segmenti
yeni gelen satış talebiyle ilişkilendiriyor, böylece havayolu güzergâhın
(itinerary) tamamını tek bir bütün olarak görüyor ve talebi onaylayıp
onaylamayacağına O&D kontrol gereksinimlerine göre karar veriyor. Kaynak
metin bunu iki cümlede kuruyor: havayolu talebi onaylarken resmin tamamını
görebiliyor ve yolculuk verisi (journey data) O&D kontrolü için bir
gereklilik.

Yazılım tarafında bunun karşılığı açık. Uygunluk ve satış isteği yalnızca
istenen segmenti değil, rezervasyonda zaten var olan segmentleri de
taşımalı; envanter servisinin kararı o yolculuk bağlamıyla verilmeli.
Segmenti PNR'dan bağımsız işleyen bir envanter API'si, O&D kontrolünü
kağıt üzerinde destekler ama gerçekte bağlantılı yolculuğu zamana yayılmış
bir dizi tekil satışa böler. "Gereklilik" kelimesi burada süs değil: yolculuk
verisi yoksa O&D kontrolü yok.

## Koltuk haritası çağrı merkezinin yükünü alıyor, ek gelirin zeminini kuruyor

Bağlamın ikinci taşıyıcısı fiziksel koltuğun kendisi. Etkileşimli koltuk
haritası her kabin için koltuk uygunluğunu gerçek zamanlı gösteriyor ve
seyahat acentesinin işlemi doğrudan bu grafik harita üzerinden yapmasına
izin veriyor. Bu olmadan acente, belirli bir koltuğun boş olup olmadığını
ya da atamanın onaylanıp onaylanmadığını öğrenmek için havayolunun
rezervasyon merkezini arıyor. Harita bu aramaları ortadan kaldırıyor ve
rezervasyon merkezinin mesaisi gelir getiren taleplere kayıyor.

İkinci etki daha az görünür ama daha önemli. Etkileşimli ön rezervasyonlu
koltuk (Interactive Pre-reserved Seats) mekanizması, koltuk atama talebinin
havayoluna anında iletilmesini ve belirli bir koltuk için havayolundan
anında onay alınmasını sağlıyor. Bu anlık gidiş dönüş, ücretli koltuk
seçimi (Paid for Seats) gibi ek gelir (merchandising) ürünlerinin
pazarlanması ve anında konfirme edilmesi için gereken teknik zemin. Onayı
dakikalar ya da saatler sonra gelen bir koltuğu para karşılığı satamazsınız;
yolcu ödediği şeyin kendisine ait olduğunu ödediği anda bilmek istiyor.

Buradan çıkan mühendislik dersi şu: koltuk ataması başta operasyonel bir
kolaylık olarak kurulsa bile, senkron ve anında onaylanan bir akış olarak
tasarlanmadıysa sonradan ürüne dönüştürülemiyor. Ek gelir tarafı, koltuk
servisinin gecikme ve tutarlılık karakteristiğine bağımlı. Ek hizmet
ürünlerinin fiyatlandırma ve paketleme mantığı ayrı bir bölümün konusu;
burada önemli olan, o ürünlerin envanter tarafında gerçek zamanlı bir
onay kanalı olmadan var olamaması.

## Satış noktası tek bir alan değil, bir hiyerarşi

Üçüncü taşıyıcı satışın yapıldığı yer. Satış noktası (Point of Sale, POS),
havayolunun hangi acenteye hangi sınıfta koltuk açacağını belirleyen temel
kriterlerden biri. Ama POS tek bir değer değil, çoktan teke (many-to-one)
inen bir hiyerarşi: bölge, ülke, şehir grubu, şehir, acente grubu ve en
altta bireysel seyahat acentesinin ARC/IATA numarası. Uygunluk kuralları bu
hiyerarşinin farklı seviyelerinde tanımlanıyor; bir kural bütün bir bölgeye,
bir başkası tek bir acenteye uygulanabiliyor.

Hiyerarşi olması, kuralların üst üste binebileceği anlamına geliyor. Bölge
seviyesinde açık bırakılan bir sınıf, acente grubu seviyesinde kapatılmış
olabilir. Yazılım tarafında bunun karşılığı, POS'un düz bir eşleşme alanı
gibi değil, ağaçta yukarı doğru yürünen bir çözümleme olarak modellenmesi:
istek bir ARC/IATA numarasıyla geliyor, sistem o numaranın hangi acente
grubuna, şehre, şehir grubuna, ülkeye ve bölgeye ait olduğunu bilmek ve her
seviyedeki kuralı hesaba katmak zorunda. Hangi seviyenin hangisini ezdiği
açıkça tanımlanmadıysa aynı istek iki farklı sunucuda iki farklı cevap
alır.

POS farklı ülkelerde olduğunda iki değişken daha devreye giriyor. Birincisi
para birimi. Kaynak metin, POS farklı ülkelerdeyse para biriminin de farklı
olabileceğini ve uluslararası pazarlarda döviz dalgalanmalarının havayolu
ağındaki trafik akışını kontrol etmek için önemli olduğunu söylüyor. Aynı
ücret iki ülkede iki farklı yerel değer taşıyorsa, kurdaki bir hareket bir
satış noktasını ötekine göre sessizce ucuzlatabiliyor. İkincisi trafik
hakları: üçüncüden altıncıya kadar trafik özgürlükleri, bir havayolunun
hangi ülke çiftleri arasında hangi yolcuyu taşıyabileceğini belirliyor ve
bu haklar pazardan pazara farklılaşıyor. Sistem ağdaki trafik akışını
kontrol etmek için hem bu hakları hem yerel para birimi farklarını iş
mantığına katmak zorunda. POS kuralı bu yüzden yalnızca "bu acenteye bu
sınıfı aç" demiyor; "bu ülkeden, bu para biriminde, bu trafik hakkıyla
satılan bu yolculuğa" diyor.

## Satış noktası değiştirilebilir, yolculuğun başladığı yer değiştirilemez

POS'un bir zaafı var: satışın yapıldığı yer, satışı yapanın elinde. Bazı
seyahat acenteleri ve OTA'lar, daha elverişli bir koltuk kontenjanına
erişmek için satış noktalarını değiştirebiliyor. Birden fazla ülkede ofisi
ya da kimliği olan bir acente, bir pazarda kapalı olan sınıfı başka bir
pazarın POS'u üzerinden açık bulabiliyor. POS tek başına kullanıldığında
envanter kuralı, onu en iyi bilen tarafça en kolay atlatılan kural oluyor.

Yolculuk başlangıç noktası (Point of Commencement, POC) bu açığı kapatmak
için var. POC, yolculuğun kronolojik olarak başladığı ilk nokta
(origination). Satışın nereden yapıldığı değiştirilebilir, ama yolcunun
nereden yola çıktığı değiştirilemez; o, yolculuğun kendisinin bir
özelliği. Sistem POC'u POS ile birlikte değerlendirerek acentenin uygunluk
kurallarını manipüle etmesini önlüyor. Kaynak metin bunu açıkça bir
suistimal önleme gerekçesiyle kuruyor: havayolları O&D kontrolü için,
daha elverişli uygunluktan yararlanmak üzere satış noktaları arasında
geçiş yapabilen acente ve OTA'ların suistimallerini önlemek amacıyla POC'u
tercih ediyor.

İşin ince yeri interline yolculuklarda, yani birden fazla havayolunun
segmentlerinden oluşan güzergâhlarda. GDS standartları seyahat talebindeki
ilk segmenti POC kabul ediyor. Ama o ilk segment başka bir havayolunun
uçuşu olabilir ve havayolunun O&D kontrolü açısından anlamlı olan, kendi
ağına nereden girildiği. Bu yüzden havayolları O&D kontrolü için yolculuk
verisindeki ilk ev sahibi havayolu (host airline) segmentini POC olarak
belirleyen bir mantığı tercih ediyor.

Bu iki tanım arasındaki fark bir yazılım kararı. POC'u istekteki ilk
segmentten okuyan bir uygulama GDS standardına uyuyor ama havayolunun O&D
kontrolüne yanlış girdi veriyor. Doğru olanı, POC'u yolculuk verisinden
hesaplamak: segmentleri kronolojik sırayla dolaşıp ev sahibi havayolunun
ilk segmentini bulmak. Bu da bizi bölümün başına, Married to Journey'e
geri götürüyor. Yolculuk verisi eksikse POC da yanlış hesaplanıyor; aynı
eksik veri iki ayrı kontrolü birden bozuyor.

## Aynı sınıfta iki fiyat, teklif fiyatıyla ayrışıyor

Son mekanizma fiyatla ilgili. Satış temsilcileri tek tek acentelerle
pazarlık ederek liste dışı (off-tariff) ücretler belirliyor. Sonuç, aynı
pazarda ve aynı rezervasyon sınıfında (booking class) farklı acentelere
farklı fiyatların verilmiş olması. Rezervasyon sınıfı tek bir harfse ve
arkasında onlarca farklı müzakere edilmiş ücret duruyorsa, sınıfı açmak ya
da kapatmak kaba bir alet kalıyor: sınıf açıksa en düşük anlaşmalı fiyattan
da satış yapılıyor.

Denetim iki parçalı. Birincisi, POS hiyerarşisinin en alt seviyesi:
sistem bu satışlarda POS'u bireysel ARC/IATA numarası düzeyinde kontrol
ediyor, çünkü fiyat acenteye özgü. İkincisi, teklif edilen ücretin teklif
fiyatı (bid price) ile karşılaştırılması. Teklif fiyatı, bir koltuğu şimdi
satmanın havayoluna fırsat maliyeti; ücret bunun üzerindeyse satış kâr
bırakıyor, altındaysa koltuğu daha değerli bir talebe saklamak daha iyi.
Kaynak metnin verdiği örnek bu mantığın aynısı: toplam teklif fiyatı belirli
bir eşiğin üzerindeyken yüksek fiyatlı anlaşma kabul ediliyor, altındaki
düşük fiyatlı anlaşma reddedilebiliyor. Aynı sınıf, aynı uçuş, aynı an; iki
acente, iki cevap.

O&D kontrolü burada her acente için tanımlanan özel kurallarla, aynı pazar
ve sınıf içindeki geniş fiyat dağılımını yönetiyor. Kazanılan şey gelir
seyrelmesinin (revenue dilution), yani koltuğun ödenebilecek olandan daha
düşük bir fiyata gitmesinin önlenmesi. Kaynak metin bunu, bireysel
acentelerle müzakere edilen ücret değerlerinin geniş dağılımının
seyrelmeyi hassasiyetle ele alarak etkin biçimde kontrol edilebileceği
şeklinde ifade ediyor. Sonuç, havayolunun karmaşık fiyat yapıları üzerindeki
kontrolü geri alması.

Yazılım tarafında bunun anlamı, uygunluk kararının yalnızca sınıfa değil
ücrete bakması. Envanter servisi "bu sınıf açık mı" sorusunu değil, "bu
acentenin bu ücreti, bu yolculuğun teklif fiyatını geçiyor mu" sorusunu
cevaplamalı. Bu da acenteye özgü ücretin uygunluk isteği anında
bilinmesini gerektiriyor; ücret ancak fiyatlama aşamasında belli oluyorsa
denetim geç kalıyor.

## Dört mekanizma, tek bir girdi

Bu bölümdeki dört mekanizma ayrı özellikler gibi görünüyor ama aynı
girdiye dayanıyor. Married to Journey yolculuk verisine ihtiyaç duyuyor.
POC yolculuk verisinden hesaplanıyor. Liste dışı ücretin teklif fiyatıyla
karşılaştırılması, O&D bazında bir teklif fiyatı gerektiriyor; o da yine
yolculuğun bütününe bakıyor. Koltuk haritası bile, ücretli koltuk ürününe
dönüştüğünde, koltuğu yolculuğa ve yolcuya bağlı bir satış olarak ele
alıyor. Envanter sistemi segmenti bağlamından koparıp işlediğinde bu
mekanizmaların hiçbiri doğru çalışmıyor; bağlamı taşıdığında hepsi aynı
veriden besleniyor.

## Yarın işe yarayacak beş çıkarım

1. **Segmentleri yolculukla ilişkilendir.** Farklı zamanlarda satılan
   segmentleri Married to Journey mantığıyla bağla; uygunluk isteğinin
   rezervasyondaki mevcut segmentleri taşıdığından emin ol. Yalnızca aynı
   anda satılanları birleştiren segment evliliği, zamana yayılmış
   yolculuklarda O&D kontrolünü kör bırakır.
2. **Koltuk onayını anlık tut.** Acentelerin koltuk haritası üzerinden
   doğrudan işlem yapmasına izin ver ve atama onayını gerçek zamanlı ver.
   Hem rezervasyon merkezine giden aramaları azaltır hem de ücretli koltuk
   seçimi gibi ürünlerin anında konfirme edilmesinin zemini olur.
3. **POS'u hiyerarşi olarak modelle.** Kuralları bölgeden bireysel ARC/IATA
   numarasına kadar inen seviyelerde tanımla, hangi seviyenin hangisini
   ezdiğini açıkça belirle. Farklı ülkelerdeki satış noktalarında para
   birimi ve trafik hakkı farklarını iş mantığına kat.
4. **POS'u POC ile birlikte değerlendir.** Satış noktasını değiştirerek daha
   iyi kontenjana ulaşmaya çalışan acenteleri yolculuğun kronolojik
   başlangıç noktasıyla denetle. Interline yolculukta POC'u istekteki ilk
   segmentten değil, yolculuk verisindeki ilk ev sahibi havayolu
   segmentinden hesapla.
5. **Liste dışı ücreti teklif fiyatıyla sına.** Acenteye özgü müzakere
   edilmiş ücretleri bireysel ARC/IATA numarası düzeyinde tanı ve teklif
   fiyatıyla karşılaştır; eşiğin altında kalan anlaşmayı reddetmekten
   çekinme. Gelir seyrelmesi sınıf seviyesinde değil, ücret seviyesinde
   önleniyor.

Bu bölümde ne yok: teklif fiyatının kendisinin nasıl hesaplandığı (O&D ve ağ
optimizasyonu bölümleri), yuvalama ve segment limitleri gibi sınıf
seviyesindeki kontroller (envanter kontrolü bölümleri) ve ücretli koltuğun
bir ürün olarak nasıl paketlendiği ("Havayolu ek hizmetleri (ancillaries)
ve iş mantığı analizi"). Bu bölüm, o kararların hangi bağlamla birlikte
envantere sorulduğunu anlatmak için var.
