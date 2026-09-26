---
title: "O&D gelir yönetimi ve koltuk kullanılabilirliği hesaplama"
domain: "aviation"
summary: "Bir rezervasyon talebine evet demek iki ayrı kontrolden geçiyor: önce kabinde fiziksel olarak koltuk var mı, sonra ücret yolculuğun tükettiği bacakların toplam teklif fiyatını geçiyor mu. Bu bölüm o sıralamayı, toplanabilirlik varsayımının neye dayandığını, satış noktasına göre aynı ürünün farklı açılmasını ve bu mantığın eski bir ana bilgisayarın yanına nasıl yerleştirildiğini anlatıyor."
audience: "Erişilebilirlik (availability) servisi, envanter ya da CRS entegrasyonu üzerinde çalışan, bir ücret sınıfının bir acenteye açık ötekine kapalı görünmesinin nedenini anlamak isteyen yazılımcı ve analist. Teklif fiyatı ve sürekli yuvalamanın anlatıldığı bölümü okumuş olmak işe yarar; fiziksel ve finansal kullanılabilirlik, toplam teklif fiyatı, MAT ve işbirlikçi kullanılabilirlik işlemcisi metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler teklif fiyatının ne olduğunu ve nasıl güncel tutulduğunu
anlatıyordu. Bu bölüm o sayının kullanıldığı ana bakıyor: bir acentenin
ekranında bir güzergâh için bir sınıfın açık mı kapalı mı göründüğü an.
Kaynak metnin çıkış noktası, gelir yönetiminin basit koltuk satışından
ağ optimizasyonuna evrildiği. Bunun erişilebilirlik tarafındaki karşılığı
tek cümle. **Bir koltuğun satılabilir olması artık yalnızca kabinde yer
olmasına değil, o koltuğun ağın toplam gelir potansiyeli içinde ne kadar
değerli olduğuna bağlı.** Kabinde boş koltuk olan bir uçuşta bir sınıf
kapalı görünebiliyor ve bu bir hata değil, sistemin tam olarak yapması
gereken şey.

Bu bölüm o kararın hangi sırayla verildiğini, hangi varsayıma yaslandığını,
satış noktasına göre nasıl inceltildiğini ve yıllarca çalışmış bir
rezervasyon sistemine nasıl eklendiğini anlatıyor. Sonunda da işin teknik
olmayan yarısına, organizasyona değiniyor.

## Kullanılabilirlik iki kapıdan geçiyor ve sıraları değiştirilemez

Bir rezervasyon talebi geldiğinde sistem iki ayrı soru soruyor. İlki
fiziksel kullanılabilirlik: ilgili kabinde satılmış koltuk sayısı,
yetkilendirilmiş kapasiteden (authorized capacity) az mı? Bu kontrol
olumsuzsa ikinci soruya hiç geçilmiyor. Kabin dolmuşsa ücretin ne kadar
yüksek olduğunun önemi yok.

İlk kapı açıksa ikinci soru finansal kullanılabilirlik. Burada bilet
ücretinden (fare) toplam teklif fiyatı (total bid price) çıkarılıyor.
Sonuç net gelir; net gelir pozitifse talep onaylanıyor. Kaynak metin
teklif fiyatını bir rezervasyonu kabul etmek için gereken minimum kabul
edilebilir ücret olarak tanımlıyor. Yani ikinci kapı, koltuğun havayolu
için ifade ettiği fırsat maliyetinden fazlasını getirmeyen talebi
durduruyor.

Sıranın bir mantığı var. Fiziksel kontrol ucuz ve kesin: bir sayaçla bir
tavanın karşılaştırması. Finansal kontrol ise yolculuğun bütün
bacaklarının değerini okumayı gerektiriyor. Ucuz ve kesin olan filtre
önce çalışınca, kapasitesi dolmuş uçuşlar için pahalı hesaba hiç
girilmiyor. Yazılım tarafında bunun karşılığı, erişilebilirlik
fonksiyonunun iki aşamalı bir boru hattı olarak yazılması ve her aşamanın
ret gerekçesini ayrı dönmesi. "Kabin dolu" ile "ücret yetmiyor" aynı
kapalı sınıf olarak görünür ama iki ayrı iş sorusu: biri kapasite
planlamasına, öteki fiyatlandırmaya gidiyor. İkisini tek bir "kapalı"
bayrağına indiren bir servis, sonradan yapılacak her analizin girdisini
kaybediyor.

## Aktarmalı yolculuğun eşiği bacakların toplamı

Tek bacaklı bir talepte finansal kontrol basit: ücret, o bacağın teklif
fiyatıyla karşılaştırılıyor. Birden fazla bacaktan oluşan bir O&D
talebinde ise sistem bir varsayım yapıyor: teklif fiyatları toplanabilir
(additive). Yolcunun seyahat edeceği bütün bacaklardaki bireysel teklif
fiyatları toplanıyor ve bu toplam, o güzergâh için kabul edilebilir
minimum eşiği oluşturuyor.

Toplamın anlamı şu. Aktarmalı yolcu iki bacakta birden koltuk tüketiyor.
O iki koltuk başka yolculara ayrı ayrı satılabilirdi; toplam teklif
fiyatı, bu alternatif satışlardan vazgeçmenin bedeli. Aktarmalı yolcunun
ödediği ücret tek bir bacaktaki yolcununkinden yüksek olabilir, ama
tükettiği iki koltuğun toplam değerini geçmiyorsa sistem onu reddediyor.

Kaynak verilerdeki örnek tablo bunu iki satırla gösteriyor. LAX-LHR
güzergâhında B sınıfı için bilet ücreti toplam teklif fiyatından düşük;
net gelir negatif ve sistem sınıfa kapalı (closed) statüsü veriyor, satışı
reddediyor. LAX-FCO güzergâhında B sınıfı için net gelir tam olarak sıfır.
Kaynak metne göre sistem bu durumda da genellikle kapalı kalma
eğiliminde, ya da sınır değer politikasına göre hareket ediyor.

Bu ikinci satır küçük görünüyor ama bir tasarım kararı saklıyor. Net
gelirin sıfır olduğu nokta, havayolunun bu koltuğu satmakla satmamak
arasında kayıtsız olduğu nokta. Karşılaştırmanın `>` mı `>=` mı olacağı
kodda tek bir karakter; iş tarafında ise bir politika. Sınır değer
politikası bir yapılandırma parametresi olarak açıkça tanımlanmazsa, o
karakteri hangi geliştiricinin yazdığı havayolunun politikası haline
geliyor.

## Toplanabilirlik bir varsayım ve denetlenmesi gerekiyor

Toplam teklif fiyatının güvenilir olması, bacak değerlerinin gerçekten
toplanabilir olmasına bağlı. Brifingin önerdiği içgörü bunu açıkça
söylüyor: hesaplamaların temeli olan toplanabilirlik varsayımının
geçerliliği için veri sürekliliği ve matematiksel modellerin sağlamlığı,
özellikle diferansiyellenebilirlik, denetlenmeli.

Neden önemli olduğu, teklif fiyatının kendisinin bir türev olmasından
geliyor. Teklif fiyatı bir sonraki koltuğun marjinal değeri; bu marjinal
değerin anlamlı olması, gelir fonksiyonunun o noktada düzgün davranmasına
bağlı. Veri kesintili ya da model kırıklıklar içeriyorsa, bacak başına
üretilen sayılar tek tek makul görünse bile toplamları gerçek fırsat
maliyetini temsil etmeyebiliyor. Kaynak metin bu denetimin nasıl
yapılacağını ayrıntılandırmıyor; söylediği, varsayımın kendiliğinden
doğru kabul edilmemesi gerektiği.

Aynı tedbirin zaman boyutu da var. Sistem küçük talep artışları için ağın
tamamını her seferinde yeniden optimize etmiyor; bunun yerine gradyan
(gradient) değerini kullanıyor. Gradyan bir sonraki koltuk için geçerli
artımlı teklif fiyatı; ağ genelinde büyük bir optimizasyon çalışmadan
önce mevcut koşullar altında fiyatı dinamik olarak güncellemeyi
sağlıyor. Ama gradyan kısa zaman aralıklarında doğrusal kabul ediliyor.
Brifingin buradan çıkardığı iş kuralı net: doğruluğu korumak için ağ sık
sık yeniden optimize edilmeli. Doğrusal yaklaşım optimizasyon anından
uzaklaştıkça yanılıyor; toplanan her bacak değeri de o yanılgıyı
taşıyor. Aktarmalı bir güzergâhta iki bacağın hatası toplamda birleşiyor.

## Sürekli yuvalamanın kazancı küçük bir yüzde ama bedelini ödüyor

Teklif fiyatı kontrolünün eski yönteme, sanal yuvalamaya (virtual
nesting) göre üstünlüğü iki başlıkta toplanıyor. Birincisi blokaj.
Kaynak metin, sanal yuvalamanın aksine teklif fiyatı kontrolleriyle
blokaj sorununun ortaya çıkmadığını söylüyor. Sanal yuvalamada belirli
sınıflar yanlışlıkla kapanabiliyor ya da talep olmasına rağmen
erişilemiyor; teklif fiyatının dinamik yapısı bu verimsizliği önlüyor.

İkincisi sistem yükü. Teklif fiyatı kontrolünde envanter kararı her talep
anında hesaplanıyor. Sanal yuvalamada ise indeksler önceden hesaplanıp
saklanıyor. Kaynak metne göre bu yüzden merkezi sistem (CRS) üzerindeki
yük teklif fiyatı yönteminde çok daha düşük. Önceden hesaplanan ve
saklanan her indeks, girdisi değiştiğinde yeniden yazılması gereken bir
kayıt; anlık hesapta saklanan şey yalnızca bacak başına değer.

Finansal gerekçe tek bir aralık: sürekli yuvalama (continuous nesting),
sanal yuvalama kontrollerine kıyasla yüzde 0,5 ile yüzde 1,5 arasında ek
gelir sağlıyor. Brifingin bağlam notu bunun büyük ölçekli havayollarında
milyonlarca dolarlık ek kazanç anlamına geldiğini ekliyor. Rakam küçük
görünüyor; ama maliyetini değiştirmeden, aynı uçaklarla ve aynı
yolcularla elde edilen bir gelir artışı. Yönetici özeti aynı cümlenin
devamında bedeli de söylüyor: bu geçiş ciddi bir teknolojik altyapı
yatırımı ve organizasyonel değişim gerektiriyor. Aşağıdaki iki başlık o
bedelin iki yarısı.

## Aynı ürün Paris'teki acenteye açık, Londra'dakine kapalı olabilir

Teklif fiyatı güzergâhın ve sınıfın değerini veriyor. Ama havayolu için
aynı ürünü kimin sattığı da önemli. Belirli bir seyahat acentesine ya da
bölgeye özel koltuk açma ve kapama kararı, kaynak metnin Pazar Rezervasyon
Sınıfı Ayarlama Tablosu (Market Booking Class Adjustment Table) dediği,
kısaca MAT (Market Adjust Table) olarak anılan tablo üzerinden yönetiliyor.
Bu tablo satış noktası (POS) bazında ayrıntılı kontrol sağlıyor.

Mekanizma şöyle. Rezervasyon talebiyle birlikte acentenin ARC ya da IATA
numarası geliyor ve sistem bu numarayı tanıyor. MAT'taki ilgili girişler
üzerinden o satış noktası için piyasa ayarlama değerleri uygulanıyor.
Paris'teki bir acente için bu değerler optimize edildiğinde, aynı ürün
için o acenteye Londra'daki bir acenteye kıyasla daha avantajlı bir
kullanılabilirlik sunulabiliyor. Aynı uçuş, aynı sınıf, aynı an; iki
ekranda iki farklı cevap.

Yazılım tarafında bunun anlamı, erişilebilirlik fonksiyonunun girdisinin
güzergâh ve sınıftan ibaret olmaması. Talebin kimliği, yani satış
noktası, kararın parametrelerinden biri. İki sonucu var. Birincisi önbellek:
güzergâh ve sınıf anahtarıyla önbelleğe alınmış bir erişilebilirlik
cevabı, satış noktasına göre farklılaşan bir sonucu yanlış acenteye
döndürüyor. Anahtarın içinde satış noktası yoksa MAT'ın bütün etkisi
önbellekte kayboluyor. İkincisi test: bir sınıfın "açık" olduğunu
doğrulayan bir test, hangi satış noktasından sorulduğunu belirtmiyorsa
neyi doğruladığı belirsiz.

Brifingin önerdiği kullanım da buradan çıkıyor: MCFA ve MAT tablolarıyla
sadık acentelere ya da yüksek kârlı pazarlara özel kapasite tahsis ederek
pazar payı ile kârlılık dengelenmeli. Tablo bir fiyat aracı değil,
bir ilişki yönetimi aracı; hangi acentenin öncelikli olduğu ticari bir
karar ve MAT onu envantere çeviriyor.

## Ana bilgisayarı değiştirmeden O&D kontrolü eklemek mümkün

Gerçek zamanlı O&D kontrolünün önündeki en somut engel, envanterin
yıllardır çalışan bir ana bilgisayar (mainframe) sisteminde durması. Ana
envanter paketini tamamen güncellemek maliyetliyse kaynak metin ikinci
bir yol tarif ediyor: ana CRS'e bağlı çalışan ve bütün O&D mantığını
barındıran, gerçek zamanlı işbirlikçi Unix tabanlı bir kullanılabilirlik
işlemcisi (real-time cooperative Unix-based availability processor). Bu
sistem her satış ve iptal işleminde iki aşamalı onay (two-phase commit)
ile ana sistemle senkronize çalışıyor.

Mimari olarak bu, sorumlulukların ayrılması. Ana sistem envanterin kayıt
defteri olarak kalıyor: hangi koltuğun satıldığı orada yazılı. Yardımcı
işlemci karar veriyor: teklif fiyatlarını tutuyor, güzergâhın toplamını
hesaplıyor, MAT ayarlarını uyguluyor. İki aşamalı onay da ikisinin
birbirinden kopmamasını sağlıyor. Bir satış ya da iptal ya iki sistemde
birden gerçekleşiyor ya da hiçbirinde. Bu garanti olmasa, yardımcı
işlemcinin karar verirken okuduğu doluluk ile ana sistemin gerçek
doluluğu ayrışır; fiziksel kontrol bir sistemde "yer var", ötekinde
"dolu" der.

Brifing bunu stratejik bir IT kararı olarak koyuyor: O&D kontrolüne
geçiş ya ana CRS sisteminin tamamen yenilenmesini ya da bir yardımcı
işlemcinin entegre edilmesini gerektiriyor. İkinci yol, eski sistemi
yerinde bırakıp yeni mantığı yanına kurmak; bedeli, iki sistem
arasındaki her işlemin koordinasyon maliyeti. İki aşamalı onay her
satışa bir tur daha ekliyor ve bir tarafın yanıt vermediği durumda ne
olacağı tasarımın en zor kısmı. Kaynak metin bu arıza senaryolarına
girmiyor; ama bu mimariyi seçen bir ekip için ilk sorulması gereken soru
bu.

## Fiyatlandırma ile verim yönetimi aynı çatıya girmeli

O&D tabanlı verim yönetimine geçişin ikinci yarısı teknik değil. Kaynak
metne göre bu geçiş organizasyonel bir birleşme gerektiriyor: verimliliği
artırmak için Fiyatlandırma (Pricing) ve Verim Yönetimi (Yield
Management) departmanlarının birleştirilmesi öneriliyor.

Gerekçe, erişilebilirlik kararının kendisinde görülüyor. Finansal kapı
iki sayıyı karşılaştırıyor: ücret ve toplam teklif fiyatı. Ücreti
fiyatlandırma kuruyor, teklif fiyatını verim yönetimi üretiyor. İki ekip
ayrı çalıştığında bir sınıfın neden kapalı olduğu sorusunun cevabı iki
ayrı masaya dağılıyor: fiyatlandırma ücretin rekabetçi olduğunu, verim
yönetimi teklif fiyatının doğru hesaplandığını söylüyor ve ikisi de
haklı olabiliyor. Karar ise ikisinin farkından çıkıyor. Aynı eşitsizliğin iki
tarafını ayrı organizasyonların sahiplenmesi, eşitsizliğin sonucunu
kimsenin sahiplenmemesi demek.

## Yarın işe yarayacak beş çıkarım

1. **Ret gerekçesini ayrı dön.** Erişilebilirlik servisinde fiziksel
   kapıyı önce, finansal kapıyı sonra çalıştır ve hangi kapıda
   reddedildiğini cevaba yaz. "Kabin dolu" ile "ücret teklif fiyatının
   altında" farklı ekiplerin sorusu.
2. **Sınır değer politikasını yapılandırmaya taşı.** Net gelirin tam
   sıfır olduğu durumda ne yapılacağı bir iş kararı; karşılaştırma
   operatörünün içine gömülü kalmasın.
3. **Yeniden optimizasyonu sık tut.** Gradyan kısa aralıkta doğrusal
   kabul ediliyor; optimizasyon anından uzaklaştıkça hata büyüyor ve
   aktarmalı güzergâhta bacakların hatası toplanıyor. Toplanabilirlik
   varsayımının dayandığı verinin sürekliliğini ve modelin düzgünlüğünü
   ayrıca denetle.
4. **Satış noktasını anahtarın parçası yap.** MAT ile aynı ürün farklı
   acentelere farklı açılıyorsa, erişilebilirlik önbelleği ve testler
   satış noktasını bilmeden doğru cevap veremez. Sadık acentelere ve
   yüksek kârlı pazarlara tahsisi bu tablo üzerinden bilinçli yap.
5. **Yardımcı işlemci yolunu seçiyorsan arıza senaryosunu önce yaz.**
   Ana sistemi yenilemek yerine işbirlikçi bir işlemci ekleyeceksen,
   iki aşamalı onayın bir tarafı yanıt vermediğinde satışın ne olacağını
   entegrasyondan önce kararlaştır. Aynı dönemde fiyatlandırma ile verim
   yönetiminin tek masada oturmasını da planın parçası say.

Bu bölümde ne yok: teklif fiyatının nasıl üretildiği ve satışla iptal
arasında nasıl kaydığı (teklif fiyatı ve sürekli yuvalama bölümü), O&D
talebinin nasıl tahmin edildiği ("O&D talep tahmini: birinci ve ikinci
nesil yaklaşımlar"), kapasitenin kendisinin overbooking ile nasıl
genişletildiği (overbooking bölümleri). Bu bölüm o sayıların bir
rezervasyon talebinin önünde hangi sırayla ve hangi altyapıda bir
evete ya da hayıra dönüştüğünü anlatmak için var.
