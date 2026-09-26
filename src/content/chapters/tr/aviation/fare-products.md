---
title: "Havacılık fiyatlandırma ürünleri ve iş mantığı analizi"
domain: "aviation"
summary: "Aynı uçaktaki iki yolcu aynı koltuğa farklı fiyat ödüyorsa, aslında farklı iki ürün satın almışlardır: ürünü kısıtlama tanımlar, fiyatı değil. Bu bölüm üç indirim türünü, kısıtlama kalkınca gelir yönetiminin neden çöktüğünü ve bir ücretin ücret esas kodu, ücret kategorisi ve rezervasyon sınıfı arasında çoktan teke daralan eşleme zincirinde nasıl temsil edildiğini anlatıyor."
audience: "Fiyatlandırma motoru, envanter ya da dağıtım entegrasyonuyla çalışan, ücret esas kodu ile rezervasyon sınıfının neden ayrı tutulduğunu anlamak isteyen yazılımcı ve ürün insanı. Gelir yönetimi bölümlerinin okunmuş olması işe yarar; fence, RFP, fare basis code, RBD ve interline metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Gelir yönetimi bölümleri koltuğun kime satılacağını anlatıyordu:
kısıtlı indirim, Littlewood kuralı, iç içe geçmiş sınıflar. Ama o
anlatının hep varsaydığı bir şey vardı: satılan şeyin ne olduğu. Bu bölüm
o varsayımı açıyor. **Havacılıkta fiyat bir rakam değil, kısıtlamalarla
tanımlanmış bir üründür; ve o ürün sistemde tek bir kayıt olarak değil,
fiyatlandırmadan envantere doğru daralan bir kodlar zinciri olarak
yaşar.** Zincirin bir halkası yanlış eşlenirse gelir kaybı ne bir hata
mesajı ne bir istisna olarak görünür; bilet kesilir, uçak kalkar, para
eksik gelir.

![Sunumun kapak slaytı. Solda başlık: Görünmez Kodlar, Gerçek Gelirler, Havayolu Ücretlendirme Anatomisi. Alt başlık: Ürün Stratejisinden Sistem Entegrasyonuna. Sağda milimetrik kâğıt üzerinde çapraz duran bir uçak bileti çizimi; biletten turuncu düğümlerle bir devre kartı gibi dallanan hatlar çıkıyor. Altta uzman notu kutusu: sunum, fiyatlandırma ve teklif yönetimi (ücreti oluşturma) ile gelir yönetimi ve envanter (müsaitliği kontrol etme) arasındaki köprüyü kuruyor; buradaki kavramlar AirShopping ve Offer Creation akışlarını yönetiyor, yolcu uçuş aradığında fiyatlandırma motorunun döndüreceği kesin fiyatı bu kurallar belirliyor; materyal, NDC paradigmalarına geçmeden önce geleneksel EDIFACT ve ATPCO yapılarının havayolu perakendesini nasıl tanımladığını anlamak için bir temel.](/decks/fare-products/01.webp "Biletten çıkan hatlar devre kartı gibi çizilmiş: bir bilet, arkasında birçok ayrı sisteme uzanan bağlantıların görünen ucu.")

## Aynı koltuğa farklı fiyat, ürünü değiştirerek meşrulaşıyor

Bir uçaktaki koltuk fiziksel olarak aynı. Yan yana oturan iki yolcunun
birinin diğerinden fazla ödemesini meşru kılan şey, sistemin fences, yani
çit adı verilen kısıtlamalarla müşteriyi segmente etmesi: önceden satın
alma şartı, cumartesi gecesi konaklama kuralı, sezonluk geçerlilik.
Bu kısıtlamalar fiyatı değil ürünün doğasını değiştiriyor. Yan yana oturan
iki yolcu aynı koltuğun farklı iki fiyatını değil, tamamen farklı iki ücret
ürününü satın almış oluyor.

Kısıtlamanın ikinci işi müşteri davranışını değiştirmek. Brifingin tarif
ettiği iş kuralı kademeli tetikleyicilere dayanıyor: 3, 7, 14 ve 21 gün
önceden alım şartları. Her kademe müşteriyi uçuştan biraz daha önce satın
almaya itiyor, havayolu da talebi daha erken görüp envanterini daha iyi
planlıyor. Yani kısıtlama hem bir segmentasyon aracı hem bir erken sinyal
üreticisi. Yazılım tarafında bunun karşılığı şu: satın alma tarihi ile
kalkış tarihi arasındaki gün farkı, bir ücretin geçerli olup olmadığına
karar veren birinci sınıf bir girdi. Onu fiyat hesaplamasının sonunda
uygulanan bir filtre gibi değil, ürünün tanımının parçası gibi modellemek
gerekiyor.

## Üç indirim türünün her biri farklı bir risk taşıyor

Standart tam ücretin (full fare) ötesinde havayolları üç temel indirim
kullanıyor ve bunlar birbirinin varyantı değil, üç farklı mekanizma.

Kısıtlı indirimler (restricted) yukarıda anlatılan türden: 14 gün önceden
alım ya da cumartesi gecesi kuralı gibi çitlerle ürünü değiştiriyor ve
envanter tarafından kontrol ediliyor. Havayolu kaç koltuğu bu ürüne
ayıracağına kendisi karar veriyor.

Nitelikli indirimler (qualified) başka bir mantıkla çalışıyor. Ürün aynı
kalıyor; indirimi hak ettiren şey yolcunun bir gruba üyeliği. Kurumsal
anlaşmalar ya da AAA, AARP gibi kuruluşların üyelerine sunulan ücretler bu
türden. Brifingin vurguladığı iş kuralı bu ücretlerin sabit bir rakamla
değil, kamuya açık ücret üzerinden bir yüzde indirimi olarak tanımlanması.
Böylece piyasa fiyatı hareket ettikçe nitelikli ücret de onunla birlikte
yüzüyor (floating). Bunun bedeli de burada: genel fiyatla paralel
dalgalanan bir ücreti bağımsız olarak kontrol etmek zor. Satış hacmini
artırıyor ama gelir seyreltmesine (dilution), yani zaten daha fazlasını
ödeyecek bir yolcunun indirimli fiyattan uçmasına kapı açıyor.

Kısıtlamasız indirimler (unqualified) ya da RFP, düşük maliyetli
havayollarının popülerleştirdiği kısıtlamasız fiyat aralıkları. Ürünü
değiştiren bir çit yok, indirimi hak ettiren bir üyelik de yok; yalnızca
farklı fiyat seviyeleri var. Slaytın bu sütun için yazdığı risk en ağırı:
geleneksel gelir yönetimi yaklaşımlarını çökertiyor.

![Başlık: İndirim Stratejileri Karşılaştırma Matrisi. Üstte açıklama: standart tam ücretlerin (full fare) ötesinde havayolları envanteri yönetmek ve müşterileri segmente etmek için üç temel indirim kullanır. Üç sütun. Kısıtlamalı İndirimler (Restricted), asma kilit ikonuyla: mekanizma, ürünün doğasını değiştirir (örneğin 14 gün önceden alım, cumartesi gecesi konaklama kuralı); amaç, müşteriyi segmente etmek ve erken alıma teşvik ederek envanter planlamasını iyileştirmek; kontrol, envanter kontrollüdür, yan yana oturan yolcular tamamen farklı ürünler satın almış olabilir. Nitelikli İndirimler (Qualified), yaka kartı ikonuyla: mekanizma, yolcunun belirli bir gruba (kurumsal anlaşmalar, AAA) üyeliği sayesinde sunulan, ürün farkı olmayan indirimler; risk, genel fiyatlarla paralel dalgalanır, bağımsız kontrolü zordur, satış hacmini artırır ancak gelir kaybına (dilution) yol açabilir. Kısıtlamasız İndirimler (Unqualified / RFP), açık kapı ikonuyla: mekanizma, düşük maliyetli havayolları (LCC) tarafından popülerleştirilen kısıtlamasız fiyat aralıkları (RFP); risk, geleneksel gelir yönetimi yaklaşımlarını çökertir, en düşük fiyat o anın tek fiyatı haline gelir. Altta uzman notu: geleneksel gelir yönetimi, iş seyahatindeki yolcuların ucuz tatil ücretlerini satın almasını önlemek için çitlere (ATPCO Cat 3, Cat 5) güvenir; RFP bu çitleri kaldırarak geleneksel bacak ve segment bazlı optimizasyon algoritmalarını zorlar.](/decks/fare-products/02.webp "Üç ikona bak: kilit ürünü kapatıyor, yaka kartı kapıyı yalnızca üyeye açıyor, açık kapıda ise kimseyi ayıran bir şey kalmıyor.")

Uzman notundaki parantez önemli bir bağlantı kuruyor: çitlerin kendisi
sistemde soyut bir kavram değil, ATPCO kural kategorileri olarak
dosyalanıyor (slayt Cat 3 ve Cat 5'i örnek veriyor). Yani iş tarafının
çit dediği şey, mühendislik tarafında bir kural kategorisinin içinde duran
veri. Bu bağ aşağıda ücretin anatomisine geçtiğimizde yeniden karşımıza
çıkacak.

## Çit kalkınca en düşük ücret o anın tek fiyatı oluyor

Geleneksel gelir yönetimi iki şeye aynı anda güveniyor: fiyat seviyelerinin
varlığına ve bu seviyeler arasındaki çitlere. Tam ücreti ödemeye hazır bir
iş yolcusu, ucuz tatil ücretini alamıyor çünkü cumartesi gecesi kalmak
istemiyor ya da üç hafta önceden plan yapamıyor. Çit onu kendi fiyatında
tutuyor.

Kısıtlamasız fiyatlandırmada bu mekanizma ortadan kalkıyor. Sistem brifingin
fare of the moment dediği mantığa geçiyor: o anda açık olan en düşük
ücret, herkes için tek fiyat. 120 dolar ödemeye hazır yolcu, 100 dolarlık
seviye açıksa onu alıyor; onu yukarıda tutacak bir çit yok.

Kaynak metnin bu durumu tarif eden cümlesi bölümün en keskin tespiti:
gelir yönetimi, müşterinin ne ödemeye istekli olduğuna odaklanmak yerine
tedarikçinin neyi kabul etmeye istekli olduğuna odaklanmış, bu da gelir
seyreltmesiyle sonuçlanmış. Çitli dünyada bu odak işe yarıyordu, çünkü
müşterinin istekliliğini çit dolaylı olarak ölçüyordu. Çit kalkınca geriye
yalnızca tedarikçinin kabul ettiği en düşük fiyat kalıyor.

Asıl kırılma düşük talep döneminde yaşanıyor. Kapasite talepten fazlaysa
sistemin yüksek fiyatlı ürünü koruma kapasitesi düşüyor ve bütün sınıflar
açılıyor. Çitli dünyada bu kabul edilebilir bir sonuçtu; çitsiz dünyada
yüksek getirili yolcu doğrudan en alt sınıfı alıyor ve büyük bir gelir kaybı
oluşuyor. Brifingin önerdiği çözüm, algoritmanın bütün sınıfları körlemesine
açmak yerine upsell olasılığını hesaplaması: düşük ücretli ürüne uygun bir
yolcunun daha yüksek ücretli ürüne geçme ihtimalini tahmin edip en düşük
ücreti açık tutma kararını buna göre vermesi.

![Başlık: Gelir Yönetimi Çıkmazı, Kısıtlamasız Fiyatlar Neden Zorludur. Sol panel, Geleneksel Çitli RM: iki yolcu figürü; soldaki yolcunun oku FENCE yazan koyu bir duvara çarpıp 120 dolarlık kutuya iniyor, sağdaki yolcu 100 dolarlık kutuya gidiyor. Sağ panel, Kısıtlamasız Fiyatlandırma (RFP): duvar kırılmış; 120 dolar tarafındaki yolcunun oku kırık duvarın içinden geçip 100 dolara gidiyor, 120 dolar kutusunun yanında talep anında sıfıra iner yazıyor. Açıklama: kısıtlamalar olmadığında anlık olarak mevcut olan en düşük fiyat o anın fiyatı olur; müşterinin ne ödemeye hazır olduğu değil, tedarikçinin neyi kabul ettiği geçerli olur. Sarı kutu, Teori ve Gerçeklik (Upsell Olasılığı): geleneksel çözüm, düşük ücretli ürünü alabilecek yolcunun yüksek değerli ürüne geçme ihtimalini hesaplayarak talebi şişirmek; sistem hatası, düşük talep dönemlerinde kapasite talepten fazlaysa sistem tüm sınıfları açar, çitler yoksa yüksek getirili yolcu direkt en alt sınıfı alır ve büyük gelir kaybı yaşanır. Sol altta uzman notu: sektördeki Continuous Pricing ve Dynamic Pricing inovasyonları tam olarak bu sorunu, fiyatlandırma ile envanter arasındaki sürtüşmeyi çözmek için geliştiriliyor.](/decks/fare-products/03.webp "120 dolarlık kutunun yanındaki küçük not asıl bulgu: çit kırıldığında o fiyat seviyesi yavaş yavaş değil, bir anda boşalıyor.")

Slaytın sol alt köşesindeki not, sorunun nerede durduğunu adlandırıyor:
fiyatlandırma ile envanter arasındaki sürtüşme. Continuous Pricing ve
Dynamic Pricing bu sürtüşmeye verilen cevaplar olarak anılıyor. Ayrıntıları
bu bölümün konusu değil; bu bölüm için önemli olan, sürtüşmenin hangi
noktada doğduğunu görmek. O nokta da ücretin sistemde nasıl temsil
edildiğinde.

## Ücret esas kodu bir kural değil, altı ayrı kayda işaretçi

Yolcunun biletinde gördüğü ücret esas kodu (fare basis code) tek başına bir
kural değil. Başka yerlerde tanımlanmış ve fiziksel olarak ayrı tutulan
altı kural setine işaret eden bir referans. Brifingin tablosu ve slayt bu
boyutları aynı şekilde sayıyor:

- **Ücret kaydı (fare record):** kalkış-varış noktası, ücret tutarı, ücret
  esas kodu, dipnot ve güzergâh numarası.
- **Kurallar (fare categories):** ücrete uygulanan spesifik kısıtlamalar.
- **Dipnotlar (footnotes):** seyahat ya da biletleme tarihlerine ait ek
  kısıtlamalar.
- **Genel kurallar (general rules):** sistem genelinde geçerli daha geniş
  kısıtlamalar.
- **Güzergâh (routing):** kalkış, varış ve aradaki izin verilen aktarma
  şehirleri.
- **RBD doğrulaması:** ilgili rezervasyon sınıfının o anki müsaitliğinin
  onaylanması.

Brifing bu listeyi bir ön koşul olarak da okuyor: bir GDS'in bir ücreti
otomatik fiyatlandırabilmesi (auto-pricing) için bu bileşenlerin tamamının
doğrulanması gerekiyor. Birinin eksik ya da tutarsız olması, fiyatın
hesaplanamaması ya da yanlış hesaplanması demek.

![Başlık: Bir Ücretin Anatomisi, 6 Bağımsız Boyut. Açıklama: Ücret Esas Kodu (Fare Basis Code) tek başına bir kural değildir; başka yerlerde tanımlanmış ve fiziksel olarak ayrı tutulan 6 farklı kural setine işaret eden bir referanstır. Ortada koyu kutu: Ücret (Fare Master Record). Kesikli çizgilerle bağlı altı kutu: 1. Ücret Kaydı (Fare Record), kalkış-varış (O&D), ücret tutarı, ücret esas kodu, dipnot ve rota; 2. Kurallar (Rules), ücrete uygulanabilen spesifik kısıtlamalar (ücret kategorileri); 3. Dipnotlar (Footnotes), seyahat veya biletleme tarihlerine ait ek kısıtlamalar; 4. Genel Kurallar (General Rules), sistem genelinde geçerli daha geniş kısıtlamalar; 5. Rota (Routing), kalkış, varış ve aradaki izin verilen aktarma şehirleri; 6. RBD Doğrulaması (RBD Validation), ilgili rezervasyon sınıfının o anki müsaitliğini doğrulama adımı. Altta uzman notu (ATPCO Filing): fiyatlandırma motoru önce ücret kaydını çeker, ardından kuralları (ATPCO Kategori 1-50) çalıştırır, son olarak envanter sistemine bu spesifik harf (örneğin V sınıfı) şu an açık mı diye sorarak RBD doğrulaması yapar; bu 6 fiziksel boyut günde birden fazla kez GDS'lere dağıtılır.](/decks/fare-products/04.webp "Altı kutudan beşi fiyatlandırmanın elindeki statik veri; altıncısı, RBD doğrulaması, fiyatı envanterin o anki cevabına bağlayan tek canlı çağrı.")

Uzman notu bu altı boyutu bir çalışma sırasına diziyor ve yazılımcı için
asıl değerli kısım bu sıra. Fiyatlandırma motoru önce ücret kaydını
çekiyor, sonra 1'den 50'ye kadar numaralanan ATPCO kural kategorilerini
çalıştırıyor, en son envanter sistemine belirli bir harfin (slaytın
örneğinde V sınıfı) şu an açık olup olmadığını soruyor. İlk adımlar
dosyalanmış veriyi okuyor; son adım başka bir sisteme canlı bir soru.
Ücret verisinin de kendi yaşam döngüsü var: bu altı boyut günde birden
fazla kez GDS'lere dağıtılıyor. Yani fiyatlandırma motoru hem sık değişen
bir kural tabanına hem de her aramada sorgulanan bir envantere bağlı; ikisi
farklı hızlarda güncelleniyor ve tutarlılıkları kimsenin garantisinde değil.

Brifingin alıntıladığı bir ayrıntı bu tabloyu tamamlıyor: ücret esas kodu
yayınlanmıyor; fiyatlandırma süreci tarafından oluşturuluyor ve bilet
üzerinde gösteriliyor. Kod bir girdi değil, fiyatlandırmanın çıktısı.
Mühendislik açısından bu, ücret esas kodunu tek başına ürünün kimliği
saymamak gerektiği anlamına geliyor: kod, arkasındaki altı kaydın
fiyatlandırma anındaki bir özeti; ürünü tanımlayan o kayıtların kendisi.

## Kodlar çoktan teke daralıyor, envanter yalnızca son harfi görüyor

Ücretin sistemdeki temsili üç katmanlı bir hiyerarşi ve her katmanda
çeşitlilik biraz daha daralıyor. Birçok ücret esas kodu tek bir ücret
kategorisine, birçok ücret kategorisi de tek bir rezervasyon sınıfına
(RBD, reservation booking designator) eşlenebiliyor. Brifing bu ilişkiyi
çoktan teke (many-to-one) diye adlandırıyor.

Bu daralmanın bir amacı var. Rezervasyon sınıfları sınırlı sayıda, tek
harflik kodlar ve gelir yönetiminin çalıştığı birim onlar. Kaynak metin
RBD'nin üç işini sayıyor: gelir yönetimi onu talebi tahmin etmek,
rezervasyon sisteminde envanter kontrollerini ayarlamak ve havayolunun
koltuk müsaitliğini GDS'lere dağıtmak için kullanıyor. Karmaşık fiyat
kurallarının sınırlı sayıda rezervasyon sınıfıyla yönetilebilmesi bu
hiyerarşi sayesinde mümkün.

![Başlık: Fiyatlandırmadan Envantere, Kodların Hiyerarşisi. Üstte kutu, Ücret Esas Kodu (Fare Basis Code): maksimum 15 karakter; fiyatlandırma süreci oluşturur, bilette görünür; dışa dönük kuralların kısaltmasıdır; örnek kodlar KEC01403 ve MILYX7D7. Üç ok aşağıdaki Ücret Kategorisi (Fare Category) kutusuna iniyor; iki segment: Premium Economy Segmenti ve Askeri / Endüstri İndirimi Segmenti. İki segmentten inen oklar turuncu bir ünlem işaretinin altında tek bir kutuda birleşiyor: Rezervasyon Sınıfı (Booking Class / RBD), içinde büyük Y harfi. Açıklama: RM'in talebi tahmin ettiği, envanteri kontrol ettiği ve GDS'lere dağıttığı tek harf; otomatik fiyatlandırma için zorunlu. Sağda sarı kutu, Entegrasyon Riski: ideal dünyada her kategori tek bir RBD'ye eşlenmelidir; gerçekte Premium Economy ve mil biletleri aynı Y sınıfına düşebilir; yanlış eşleştirme veya hatalı interline kod kullanımı doğrudan gelir kaybına yol açar. Altta uzman notu: envanter sistemi sadece Y sepetinin açık veya kapalı olduğunu görür; biletleme yapılana kadar yolcunun hangi spesifik ücreti (fare basis) satın aldığını bilemez; yanlış interline haritalaması IATA takasında ciddi eksik ödemelere neden olur.](/decks/fare-products/05.webp "Ünlem işareti tam daralma noktasında duruyor: iki farklı ürün aynı harfe indiği anda envanter onları birbirinden ayıramaz hale geliyor.")

Daralmanın bedeli de aynı yerde. Slaytın örneğinde premium ekonomi ile mil
ödülü bileti aynı Y sınıfına düşüyor. Envanter sistemi yalnızca Y
sepetinin açık mı kapalı mı olduğunu görüyor; biletleme yapılana kadar
yolcunun hangi spesifik ücreti satın aldığını bilemiyor. Gelir yönetimi Y
sınıfının talebini tahmin ederken, o talebin içinde tamamen farklı gelir
değerine sahip iki ürün olduğunu harf düzeyinde göremiyor.

Brifingin buna cevabı, farklı ücret kategorileri aynı sınıfa atansa bile
sistemin arka planda ürün farklılaştırmasını ve önceliklendirmeyi ücret
esas kodu ile ücret kategorisi üzerinden sürdürmesi. Yani ayrım bilgisi
kaybolmuyor, ama harfte değil bir üst katmanda duruyor. Yazılım tarafında
bunun karşılığı şu: harf düzeyinde toplanmış envanter verisini gelir
analizi için tek başına yeterli saymak, kategori bilgisini bilerek atmak
demek. Eşleme tablosu bir yapılandırma dosyası değil, gelir hesabının
parçası.

## Ücret sınıfı ile rezervasyon sınıfı iki ayrı alanın dili

Bu hiyerarşide en sık yapılan hata iki terimi eş anlamlı kullanmak.
Brifingin eyleme dönük önerilerinin ilki bunu doğrudan söylüyor:
rezervasyon sınıfları ile ücret sınıfları birbirine karıştırılmamalı.

Ücret sınıfı (fare class) 1 ile 8 karakter uzunluğunda, bir havayolu
ücretinin kurallarını belirleyen biletleme kodu. Tamamen fiyatlandırma
motoru tarafından kullanılıyor ve fiyatlandırma veri tabanındaki ana kural
dizini. Rezervasyon sınıfı tek harf, bir envanter havuzunu temsil ediyor ve
tamamen gelir yönetimi ile koltuk müsaitliği tarafından kullanılıyor. GDS'in
otomatik fiyatlandırma yapabilmesi için zorunlu.

![Başlık: Analistlerin Düştüğü Tuzak, İki Kavramı Karıştırmayın. Açıklama: gelir yönetimi analistleri sıklıkla bu iki terimi eşanlamlı gibi kullanır, ancak aralarında sistem mimarisi açısından aşılmaz bir fark vardır. Solda mavi çerçeveli kutu, Ücret Sınıfı (Fare Class), kural kitabı ve veritabanı ikonuyla: karakter, 1 ila 8 karakter uzunluğunda; tanım, bir havayolu ücretinin kurallarını belirleyen biletleme kodu; kullanım yeri, tamamen fiyatlandırma (Pricing) motoru tarafından kullanılır, fiyatlandırma veri tabanındaki ana kural dizinidir. Ortada VS işareti. Sağda sarı zeminli kutu, Rezervasyon Sınıfı (Booking Class / RBD), koltuk ikonuyla: karakter, tek harf; tanım, envanter havuzunu temsil eder, GDS sistemlerinin otomatik fiyatlandırma yapabilmesi için zorunlu unsurdur; kullanım yeri, tamamen gelir yönetimi (RM) ve koltuk müsaitliği (Availability) tarafından kullanılır. Altta uzman notu (System Interaction): mühendisler için Fare Class kural kitabıdır (Pricing Domain), Booking Class koltuk sepetidir (Inventory Domain); bir acente PNR fiyatlandırdığında GDS önce ATPCO kurallarını (Fare Class) kontrol eder, ardından havayolunun envanter sistemine NAVS/AVS mesajıyla M sınıfı koltuk müsait mi diye sorar; bu iki verinin karıştırılması hatalı konfigürasyonlara yol açar.](/decks/fare-products/06.webp "Kullanım yeri satırlarına bak: iki kutuda da tamamen kelimesi geçiyor. İki kavramın ortak kullanıcısı yok, aralarındaki tek bağ eşleme.")

Slaytın uzman notu bu ayrımı mühendisin anlayacağı dile çeviriyor: ücret
sınıfı bir kural kitabı ve fiyatlandırma alanına ait; rezervasyon sınıfı
bir koltuk sepeti ve envanter alanına ait. Bir acente PNR'ı
fiyatlandırdığında GDS önce ATPCO kurallarını kontrol ediyor, ardından
havayolunun envanter sistemine NAVS/AVS mesajıyla M sınıfında koltuk
müsait mi diye soruyor. İki ayrı sistem, iki ayrı soru, iki ayrı veri.

Domain modellemesi açısından bu, iki kavramı aynı varlığın iki alanı gibi
değil, iki ayrı sınırlı bağlamın (bounded context) kendi kavramları gibi
ele almayı gerektiriyor. Aralarındaki ilişki bir eşleme, ve o eşlemeyi
kimin sahiplendiği açık değilse iki ekip de onu diğerinin sorumluluğu
sayıyor. Brifingin önerisi bu eşleşmelerin periyodik olarak valide
edilmesi; çünkü ücret kategorilerinin yanlış rezervasyon sınıflarına
eşlenmesi doğrudan gelir kaybı demek ve bu kayıp kendiliğinden bir alarm
üretmiyor.

## Interline eşleme hatası başka bir havayolunun defterinde patlıyor

Eşleme hatasının en pahalı hali, bilet birden fazla havayolunun uçuşunu
kapsadığında ortaya çıkıyor. Interline, yani havayolları arası anlaşmalarda
bir havayolunun sattığı bilet başka bir havayolunun uçuşunu da içeriyor ve
ödemeler IATA takası üzerinden akıyor. Brifing burada iki hata
türünü adlandırıyor: yanlış havayolu tasarımcı kodu (designator) ve yanlış
rezervasyon sınıfı eşleşmesi. Slaytın notuna göre yanlış interline
haritalaması IATA takasında ciddi eksik ödemelere neden oluyor.

Buradaki zorluk hatanın gecikmesi. Bilet kesildiği anda her şey doğru
görünüyor; eksiklik ancak IATA takas sürecinde, eksik bir ödeme olarak
ortaya çıkıyor.
Brifingin önerdiği kontrol mekanizması, ATPCO ve SITA üzerinden dağıtılan
verilerin senkronizasyonu ve RBD validasyon süreçlerinin kritik bir iş
kuralı olarak işletilmesi. Aynı öneri dipnotlar ve genel kurallar için de
geçerli: ücret kurallarının karmaşıklığını yönetmenin yolu, bu kuralların
ATPCO ve SITA gibi küresel toplayıcılar aracılığıyla güncel ve tutarlı
dağıtılması.

Yazılım tarafında bunun karşılığı tanıdık bir dağıtık sistem problemi:
aynı referans veri birden fazla kaynaktan, farklı zamanlarda, birden fazla
tüketiciye akıyor. Tutarsızlık bir hata olarak değil, eksik bir gelir
satırı olarak görünüyor. Bu yüzden doğrulama bir kez yapılıp bırakılan bir
kurulum adımı değil, sürekli çalışan bir mutabakat işi olmak zorunda.

## Yarın işe yarayacak dört çıkarım

1. **Eşlemeleri düzenli valide et.** Ücret kategorisi ile rezervasyon
   sınıfı arasındaki eşleme tablosunu bir yapılandırma değil, gelir
   verisi say. Yanlış eşleme hata mesajı üretmiyor, doğrudan gelir kaybı
   üretiyor; bu yüzden periyodik doğrulama ayrı bir iş olarak planlanmalı.
2. **Kısıtlamayı segmentasyon aracı olarak kur.** Kısıtlı indirimleri
   yalnızca fiyat düşürmek için değil, müşteri segmentlerini birbirinden
   ayıran çitler olarak tasarla. Kademeli önceden alım şartları hem
   segmenti ayırır hem talebi erken görünür kılar.
3. **Düşük talepte upsell olasılığını hesapla.** Kapasite talepten fazla
   olduğunda bütün sınıfları açmak yerine, düşük ücretli ürüne uygun
   yolcunun yüksek ücretli ürüne geçme olasılığını hesaba kat. Çitin
   olmadığı yerde koruma yalnızca bu tahminden gelebilir.
4. **Kural dağıtımını tek kaynaktan tutarlı yönet.** Dipnotları ve genel
   kuralları ATPCO ve SITA gibi küresel toplayıcılar üzerinden güncel
   tut; interline anlaşmalarında bu verilerin senkronizasyonunu ve RBD
   validasyonunu kritik bir iş kuralı olarak işlet.

Bu bölümde ne yok: rezervasyon sınıflarını açıp kapatan mekanizmanın
kendisi, kısıtlı indirim ve Littlewood kuralı ("Yield Management: erken
dönem stratejik analiz ve iş mantığı"), fiyatın NDC ile havayolu tarafında
dinamik olarak kurulması ("NDC@Scale: havacılık dağıtım kanallarında
dönüşüm ve iş mantığı analizi"), ücret kurallarının ve özel ücretlerin
ayrıntısı. Bu bölüm, bir ücretin ne olduğunu ve sistemde hangi kodlar
zinciriyle temsil edildiğini anlatmak için var.
