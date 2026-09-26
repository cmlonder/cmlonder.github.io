---
title: "Ücret yapılandırması, segmentasyon ve sadakat programları analizi"
domain: "aviation"
summary: "Havayolu her şehir çifti için ayrı fiyat yayınlamıyor; ücreti ana hat ücreti ile eklenti ücretinden kuruyor, çoklu para birimini NUC ile tek birime indiriyor ve aynı koltuğu farklı değer biçen yolculara farklı kurallarla satıyor. Bu bölüm ücret inşasını, fiyat noktası sayısını belirleyen koşulu ve mil kullanım kurallarının arkasındaki iş mantığını anlatıyor."
audience: "Fiyatlandırma, ücret hesaplama, kural motoru ya da sadakat sistemleriyle çalışan yazılımcı ve ürün insanı. Gelir yönetimi bölümlerinin okunmuş olması işe yarar; add-on, gateway, NUC, stopover, open jaw ve VFR metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Gelir yönetimi bölümleri koltuğun kime satılacağını anlatıyordu. O kararın
girdisi olan fiyat ise sanıldığı gibi bir tabloda hazır durmuyor. Havayolu
uçtuğu her şehir çifti için tek tek ücret yayınlamıyor; ücretin bir kısmını
satış anında parçalardan kuruyor, farklı para birimlerini tek bir yapay
birimde topluyor ve aynı koltuğu farklı kurallarla farklı yolculara satıyor.
**Ücret bir fiyat listesi değil, bir yapı: parçalardan inşa ediliyor,
kurallarla segmentlere bölünüyor ve ancak envanter kontrol edilebildiği
kadar çoğaltılabiliyor.** Bu bölüm o yapının üç ayağını ele alıyor: ücret
inşası, segmentasyon ve mil programlarının kullanım kuralları.

![Sunumun kapak slaytı. Lacivert zemin üzerinde birbirini kesen ince gri hatlardan oluşan bir ağ, bazı hatlar turuncu oklarla vurgulanmış; bir metro ya da uçuş ağı haritasını andırıyor. Başlık: Bir Uçak Koltuğunun Arkasındaki Fiyat Stratejisi ve Gelir Yönetimi. Alt başlık: Havacılıkta Fiyatlandırma, Yapılandırılmış Ücretler ve Pazar Segmentasyonu.](/decks/fare-structure-segmentation/01.webp "Turuncu oklar ağın içinden geçen tek tek yolculuklar. Her biri kendi fiyatını, ağın parçalarından kurulmuş olarak taşıyor.")

## Ücretlerin çoğu yayınlanmıyor, kuruluyor

Sorun ölçekte başlıyor. Bir havayolu on binlerce farklı pazarda, yani şehir
çiftinde, bilet satıyor. Her biri için ayrı ücret kaydı yayınlamak
milyonlarca satır veri demek; bu satırların her birinin rakibe göre
güncellenmesi, kurallarının tutarlı kalması ve dağıtım kanallarına
taşınması gerekiyor.

Çözüm ücreti iki parçaya bölmek. Uluslararası ana hatlar, yani gateway
denen ana geçiş noktaları arasındaki uçuşlar, standart olarak yayınlanıyor.
Yerel ve daha küçük noktalar bu ana ücrete bir eklenti (add-on) ücretiyle
bağlanıyor. Kaynak metnin örneği Phuket'ten Londra'ya giden bir yolcu:
Phuket-Londra için ayrı bir ücret yayınlanmamışsa sistem Phuket-Bangkok
eklentisini Bangkok-Londra ana ücretiyle birleştiriyor ve ortaya yeni bir
ücret kaydı çıkıyor. Buna yapılandırılmış ücret (constructed fare) deniyor.

![Başlık: Fiyatlandırma motorları her rota için tek tek fiyat yayınlamak yerine Yapılandırılmış Ücretler (Constructed Fares) kullanır. Ortada yatay bir hat üzerinde üç nokta: solda Phuket (HKT), ortada turuncu renkle Ana Merkez / Gateway olarak işaretli Bangkok (BKK), sağda Londra (LHR). Phuket-Bangkok arası kesikli çizgi, üzerinde Add-on Fare (Eklenti Ücret) etiketi. Bangkok-Londra arası düz çizgi, üzerinde Published Gateway Fare (Yayınlanmış Ana Ücret) etiketi. Üstte tüm hattı kapsayan turuncu parantez: Constructed Fare (Yapılandırılmış Ücret). Altta üç kutu. Problem: havayolları uçtukları on binlerce farklı pazar (şehir çifti) için tek tek spesifik fiyat verisi yayınlamak istemezler, bu milyonlarca satır veri demektir. Çözüm: uluslararası ana uçuş hatları (Gateway) standart olarak yayınlanır, yerel ve daha küçük noktalar bu ana uçuşlara bir eklenti (Add-on) olarak bağlanır. Sonuç: bilet fiyatı, uçuş öncesinde bu modüler parçaların sistem tarafından birleştirilmesiyle (Fare Construction) dinamik olarak oluşturulur.](/decks/fare-structure-segmentation/02.webp "Kesikli ve düz çizgi farkına dikkat: yayınlanan tek parça sağdaki. Soldaki parça ancak ana ücrete eklendiğinde bir fiyat oluyor.")

Havayolunun bu yöntemi tercih etme sebebi operasyonel. Her pazarı ayrı
ayrı tanımlamaya gerek kalmadan geniş bir rota ağında rekabet edebiliyor,
yönetilen kayıt sayısı düşüyor ve pazar katılımı artıyor. Bangkok-Londra
ücreti değiştiğinde, o ana ücrete bağlanan bütün küçük noktaların fiyatı
da kendiliğinden değişmiş oluyor.

Yazılım tarafında bunun karşılığı şu: fiyat, bir anahtar-değer araması
değil bir hesaplama. Fiyatlandırma motoru "HKT-LHR ücreti nedir" sorusuna
bir satır döndürerek değil, geçerli eklentileri ve ana ücretleri bulup
birleştirerek cevap veriyor. Bunun iki sonucu var. Birincisi, aynı pazar
için birden fazla geçerli kombinasyon çıkabiliyor ve motor bunlar arasında
seçim yapmak zorunda. İkincisi, bir ücretin nereden geldiğini açıklamak
için sonucu değil, onu üreten parçaları saklamak gerekiyor. Brifing
otomasyonun getirisini de açıkça söylüyor: gateway ve eklenti ücretlerinin
otomatik birleştirilmesi, havayolunun yeni pazarlara hızla girmesini ve
karmaşık rotalarda anlık fiyat üretmesini sağlıyor.

## Coğrafya ve para birimi ortak bir dile çevriliyor

Parçalardan kurulan bir ücretin tutarlı olması için parçaların aynı
kurallarla ölçülmesi gerekiyor. Bu ortak dilin ilk katmanı coğrafya.
IATA dünyayı üç trafik bölgesine ayırıyor: Area 1 (TC1) Kuzey, Orta ve
Güney Amerika ile Karayipler; Area 2 (TC2) Avrupa, Rusya, Orta Doğu,
Afrika ve Hint Okyanusu adaları; Area 3 (TC3) Asya, Hint alt kıtası,
Japonya ve Kore, Pasifik ve Okyanusya. Uluslararası biletleme, mil
hesaplamaları ve iade kuralları, uçuşun hangi bölgeler arasında
gerçekleştiğine göre belirleniyor.

![Başlık: Küresel havacılık kuralları ve tarife coğrafyası dünyayı üç ana IATA trafik bölgesine ayırır. Dünya haritası üç renge bölünmüş. Mavi-gri IATA Area 1 (TC1): Kuzey, Orta, Güney Amerika ve Karayipler. Turuncu IATA Area 2 (TC2): Avrupa, Rusya, Orta Doğu, Afrika ve Hint Okyanusu Adaları. Yeşil IATA Area 3 (TC3): Asya, Hint Alt Kıtası, Japonya ve Kore, Pasifik ve Okyanusya. Bölgeler arası sınırlar kesikli beyaz çizgilerle gösterilmiş. Altta not: uluslararası biletleme, mil hesaplamaları ve iade kuralları uçuşun hangi IATA bölgeleri (Traffic Conferences) arasında gerçekleştiğine göre belirlenir, bu bölgesel ayrımlar seyahat esnekliğinin omurgasıdır.](/decks/fare-structure-segmentation/03.webp "Sınırlar siyasi değil tarifeye ait: Rusya'nın bir kısmı turuncu bölgede, Orta Asya yeşil bölgede. Kural motoru ülkeye değil bu bölgelere bakıyor.")

İkinci katman para birimi. Phuket-Bangkok eklentisi bir para biriminde,
Bangkok-Londra ana ücreti başka birinde tanımlanmış olabilir. Bunları
toplamak için hesaplama NUC (Neutral Unit of Construction) üzerinden
yapılıyor. Kaynak metin NUC'u Temmuz 1989'da eski FCU'nun yerini alan,
ABD dolarına endeksli özel bir para birimi olarak tanımlıyor. NUC yerel
para birimi farklılıklarını ortadan kaldırıp küresel bir hesap standardı
sağlıyor; ama yolcu NUC ödemiyor. Slaytın notuna göre ücret NUC ile
hesaplanırken ödeme, seyahatin başladığı ülkenin para birimi üzerinden
tahsil ediliyor.

Mühendislik açısından NUC tanıdık bir desen: hesaplama birimi ile tahsilat
birimini ayırmak. Ücret inşası bütün parçaları tek birimde topluyor,
dönüşüm yalnızca en sonda ve yalnızca bir kez yapılıyor. Parçaları kendi
para birimlerinde toplayıp ara adımlarda dönüştüren bir motor, aynı yolculuk
için hangi sırayla dönüştürdüğüne bağlı olarak farklı fiyat üretir.

## Aynı koltuk, aynı değerde değil

Ücretin inşası teknik bir problem; kaç tane ücret olacağı ise ticari bir
problem. Brifingin çıkış noktası şu gözlem: uçaktaki her koltuk bir meta
(commodity) olarak görülse de, her müşterinin o koltuğa atfettiği algılanan
değer büyük ölçüde farklı. Fiyat farklılaştırmasının bütün gerekçesi bu
cümlede.

Farkın en temel ekseni iki davranış. Kaynak metin bunu, iş amaçlı seyahat
edenlerin programa daha duyarlı, tatil yolcularının ise düşük ücret için
alternatif uçuşları değerlendirmeye daha istekli olduğu şeklinde
özetliyor. İş yolcusu o gün uçmak zorunda; fiyat ikinci planda, iptal ve
değişiklik hakkı birinci planda. Tatil yolcusu bütçe odaklı; daha düşük
bir fiyat için başka bir uçuşu, başka bir saati ya da aktarmayı kabul
ediyor.

![Başlık: Uçaktaki her koltuk standart bir emtia olsa da yolcuların bu koltuğa biçtiği değer tamamen farklıdır. İki eksenli bir grafik: dikey eksen Programa Duyarlılık (Schedule Sensitive), yatay eksen Fiyata Duyarlılık (Price Sensitive). Sol üst çeyrekte turuncu kutu, İş Seyahati (Business Customer): saat ve esneklik odaklıdır, geçerli fiyat ne olursa olsun o gün uçmak zorundadırlar, iptal ve değişiklik hakkı talep ederler. Sağ alt çeyrekte gri kutu, Turistik Seyahat (Leisure Customer): bütçe odaklıdır, daha düşük bir fiyat bulmak için farklı bir uçuşu, farklı bir saati veya aktarma yapmayı seçmeye hazırlardır. Sağda metin kutusu: bu müşteri segmentasyonu olmadan gelişmiş bir Gelir Yönetimi sürecinin faydaları asla gerçekleşemez; ürün aynı olsa da etkin tarife yönetimi (Fare Management) doğru geliri elde etmenin ilk adımıdır.](/decks/fare-structure-segmentation/05.webp "İki kutu çaprazda duruyor: bir eksende yüksek olan diğerinde düşük. Segmentasyon bu çaprazlığı kurallarla ayırt edilebilir hale getirme işi.")

Fiyatlandırma mantığı bu farkı doğrudan ücret kurallarına çeviriyor. İş
yolcusuna son dakika rezervasyonu ve iade esnekliği sunan yüksek fiyatlı
biletler tanımlanıyor. Tatil yolcusuna düşük fiyatlı ama erken rezervasyon
şartı ve iptal cezası taşıyan kısıtlı biletler sunuluyor. Kısıtlama burada
bir ceza değil, bir ayırt edici: iş yolcusunun kabul edemeyeceği koşulu
ucuz ücrete bağlayarak, iş yolcusunun o ücrete kaymasını engelliyor.

## Fiyat noktası sayısını envanter sınırlıyor

Segment farkı kabul edildiğinde sıradaki soru kaç tane fiyat noktası (price
point) olacağı. Kaynak metnin cevabı iddialı: müşteri segmentlerini
yakalamak için ne kadar çok fiyat noktası sunulursa o kadar iyi, yeter ki
ilişkili envanter kontrol edilebilsin. Cümlenin ağırlığı ikinci yarısında.
Havayolu, envanter kontrol sistemleri (CRS) üzerinden her bir segmentin
talebini tahmin edebildiği ve o segmente ait koltuk kapasitesini
yönetebildiği sürece, mümkün olan en fazla segmenti kapsayacak kadar çok
fiyat noktası belirliyor.

![Başlık: Gelir yönetimi, envanteri kontrol edebildiği sürece pazarda mümkün olan en fazla fiyat noktası ile var olmalıdır. Solda üç katmanlı, aşağı doğru daralan bir üçgen. En üstte gri Regülasyon Dönemi: sınırlı sayıda sabit fiyat noktası, kısıtlı hedef kitle. Ortada kahverengi Deregülasyon Etkisi: düşük maliyetli taşıyıcılar ve SuperSAAver tarifelerinin pazarı açması. En altta turuncu Eksponansiyel Büyüme: pazardaki tüm segmentleri yakalayan çok sayıda dinamik fiyat noktası. Sağda iki kutu. Temel Kural, Sınırsız Segmentasyon: hedeflenen yolcu segmentlerinin talebi tahmin edilebildiği (Forecasting) ve rezervasyon sistemlerinde envanter kontrolü (Inventory Control) sağlandığı sürece, pazara sunulan fiyat noktası (Price Point) ne kadar fazlaysa o kadar iyidir. Pazarın Genişlemesi: sektördeki deregülasyon ve indirimli tarifeler, daha önce hiç uçmamış yepyeni bir nüfus segmentini havayolu seyahatine çekerek pazardaki fiyat karmaşıklığını eksponansiyel olarak artırmıştır; amaç premium geliri korurken boş koltukları doldurmaktır.](/decks/fare-structure-segmentation/06.webp "Temel kuraldaki iki kalın kelime, tahmin ve envanter kontrolü, fiyat noktası sayısının üst sınırını belirliyor; ticari istek değil.")

Slayt bu çoğalmanın tarihini de veriyor. Regülasyon döneminde sınırlı
sayıda sabit fiyat noktası vardı. Deregülasyonla birlikte düşük maliyetli
taşıyıcılar ve SuperSAAver gibi indirimli tarifeler pazarı açtı, daha önce
hiç uçmamış bir nüfusu havayolu seyahatine çekti ve fiyat karmaşıklığı
katlanarak arttı. Amaç değişmedi: premium geliri korurken boş koltukları
doldurmak.

Brifingin çıkarımı da bu koşula dayanıyor: çok sayıda fiyat noktası, ancak
gelişmiş bir gelir yönetimi ve talep tahmin sistemiyle birleştiğinde kâr
getiriyor. Tahmini olmayan bir fiyat noktası, hangi koltuğun o fiyattan
satılacağını kimsenin bilmediği bir indirim. Yazılım tarafında bu şu
anlama geliyor: yeni bir ücret sınıfı açmak bir fiyatlandırma değişikliği
olarak görünse de aslında tahmin modeline ve envanter kontrolüne yeni bir
boyut eklemek. Ücret sistemi ile gelir yönetimi sistemi arasındaki sınıf
eşlemesi bozulursa, pazarda satışta olan ama kimsenin kontrol etmediği bir
fiyat oluşuyor.

## Her segmentin kuralı kendi zayıf noktasına göre yazılıyor

İki temel segment pratikte daha ince bölünüyor ve her alt segmentin
biletleme kuralı, onu diğerlerinden ayıracak koşula göre tasarlanıyor.
Premium ve iş seyahati tarafında First Class ya da tam fiyatlı Y bileti
son dakika alınıyor ve cezasız tam iade içeriyor. Kurumsal biletler
önceden belirlenmiş indirimli ücretler; genellikle kısıtlamasız, esneklikleri
yüksek.

Bireysel ve tatil tarafında indirimli ücretler önceden alınıyor, iptal
cezası taşıyor ve maksimum kalış süresi (max stay) sınırıyla geliyor.
VFR (visiting friends and relatives, akraba ziyareti) segmenti çok önceden
alınan, düşük esneklikli, yüksek cezalı ve uzun kalışlar için tasarlanmış
derin indirimli ücretlere denk geliyor. Grup tarafında tur grupları, kara
paketiyle entegre IT ücretleri üzerinden ciddi kısıtlamalarla biletleniyor.

![Başlık: Yolcu segmentleri ve biletleme kuralları uçaktaki geliri maksimize edecek şekilde tasarlanır. Dört sütunlu tablo: segment, satın alma zamanı, iade/iptal esnekliği, özellikler ve kısıtlamalar. Premium ve iş seyahati (Business) grubu: First Class / Full Y, son dakika alınır, cezasız tam iade, esneklik, koltuk aralığı ve yüksek zaman esnekliği odaklı. Kurumsal (Corporate), hacme bağlı müzakere edilmiş, yüksek, önceden belirlenmiş indirimli ücretler, genellikle kısıtlamasız. Bireysel ve tatil (Leisure) grubu: İndirimli Ücretler, önceden alınır, iptal cezaları vardır, maksimum kalış süresi (Max Stay) sınırları uygulanır. VFR (Akraba Ziyareti), çok önceden alınır, düşük esneklik ve yüksek ceza, derin indirimli ve uzun süreli kalışlar için tasarlanmış. Grup ve diğer: Tur Grupları, önceden alınır, ciddi kısıtlamalar içerir, kara paketiyle entegre bilet (IT Fares). Grup Biletleri, sayıya göre müzakere edilmiş, kısmi esneklik, yayınlanmış ücrete haritalanır, biletleme süresi (TTL) esnekliği.](/decks/fare-structure-segmentation/07.webp "Satın alma zamanı sütunu yukarıdan aşağı erkene kayıyor, esneklik sütunu aynı yönde daralıyor. Tablonun bütün mantığı bu iki sütunun birlikte hareketi.")

İndirimin nasıl belirlendiği de segmente göre değişiyor. Kurumsal
biletlerin indirimi beklenen rezervasyon hacmine dayalı müzakereyle
belirleniyor. Grup biletlerinde ise indirim genellikle grubun büyüklüğüne
göre, yayınlanmış bir ücret üzerinden tanımlanan sabit bir yüzde olarak
hesaplanıyor; grup bileti yayınlanmış ücrete haritalanıyor ve biletleme
süresi (TTL) konusunda esneklik taşıyor.

Bu iki mekanizma veri modelinde farklı yerlere düşüyor. Kurumsal indirim
müşteriye, yani bir sözleşmeye bağlı; grup indirimi ise bir yayınlanmış
ücretin üzerine uygulanan bir türetme kuralı. İkisini aynı indirim
tablosunda tutan bir sistem, sözleşmenin süresi dolduğunda ya da grup
sayısı değiştiğinde hangi kuralın geçerli olduğunu ayırt edemez.

Kısıtlamaların işlevi burada da korumak. Brifing, VFR ve tur grupları gibi
alt segmentlerde kârlılığı korumak için maksimum kalış süresi, erken alım
şartı ve iptal cezası gibi kuralların katı biçimde uygulanması gerektiğini
söylüyor. Gevşek uygulanan bir kısıtlama, üst segmentteki yolcunun derin
indirime inmesine açılan bir kapı.

## Mil programının kuralları da bir fiyatlandırma kararı

Ödül biletler (redemption) ayrı bir dünya gibi görünse de aynı yapının
üzerinde çalışıyor. Farklı yerel para birimlerinin dahil olduğu
uluslararası rotalarda ödül bilet hesabı da NUC üzerinden yapılıyor ve
bölgesel kurallar burada da geçerli. Slaytın notuna göre ittifak içi
uçuşlarda kara geçişleri (surface sector) esnekliği de sağlanıyor.

![Başlık: Çoklu para birimleri ve sadakat programları tek bir küresel veri standardına entegre edilir. Sol yarı, Veri Standartlaştırma (Pricing): dolar, euro, yen, sterlin ve Türk lirası simgeleri bir huniye akıyor, huninin altında turuncu kutu NUC (Neutral Unit of Construction). Altında not: Temmuz 1989'da FCU'nun yerini aldı, ABD Doları'na endeksli sanal bir para birimidir, çoklu yerel para biriminin geçtiği uluslararası seyahatlerde bilet fiyatını tek bir standarda oturtur. Sağ yarı, Ödül Bilet (Redemptions) Kuralları: Ödül Bilet Stratejileri kutusundan üç dal. Stopovers (Duraklamalar): yolcuların aktarma noktasında 3 günden uzun süreli konaklama yapmasına olanak tanır. Open Jaws (Farklı Noktadan Dönüş): tek bir ödül bilet ile birden fazla şehri rotaya ekleme esnekliği sağlar. One-Way (Tek Yön): 2009'da endüstriye yayıldı, çift yön biletleri kırmak için 25.000, 37.500 veya 50.000 mil seçenekleri sunar, ancak genellikle stopover haklarını kısıtlar. Alt bant: yerel para birimleri NUC ile hesaplanırken, bilet ödemesi seyahatin başladığı ülkenin para birimi üzerinden tahsil edilir; ittifak (Alliance) içi uçuşlarda kara geçişleri (surface sectors) esnekliği sağlanır.](/decks/fare-structure-segmentation/04.webp "Sol ve sağ yarı aynı slaytta çünkü aynı motorda çalışıyor: ödül bilet de parayla satılan bilet gibi NUC ile hesaplanıp bölge kurallarından geçiyor.")

Ödül biletin rotası iki esneklikle genişliyor. Stopover (duraklama),
yolcunun aktarma noktasında üç günden uzun kalmasına izin veriyor. Open
jaw (açık uçlu rota), gidilen noktadan farklı bir noktadan dönmeyi, yani
tek ödül biletle birden fazla şehri rotaya eklemeyi sağlıyor. Hangisine
izin verileceği havayolunun politikası. Kaynak metne göre Air Canada ve
Cathay Pacific mil değerini artırmak için ikisine de izin veriyor;
American Airlines ise open jaw segmentlerine izin verip stopover'ı tamamen
kapatıyor. Brifing ilk yaklaşımı özellikle uluslararası taşıyıcılar için
müşteri sadakatini artıran bir değer önerisi olarak görüyor.

Tek yön kullanım (one-way redemption) ise ödül teklifinin mantığını
değiştiriyor. Slayta göre 2009'da endüstriye yayılan bu seçenek, gidiş-dönüş
bileti için tek bir sabit mil puanı yerine farklı esneklik seviyelerinde
farklı mil baremleri sunuyor: örneğin 25.000, 37.500 ya da 50.000 mil.
Yolcu için daha fazla seçenek, sistem için daha fazla optimizasyon alanı
demek; ama bedeli de var, tek yön ödül genellikle stopover hakkını
kısıtlıyor.

Mil ile alınan koltuğun envantere nasıl bağlandığı ise ikiye ayrılıyor.
Kısıtlamasız ödül bilet, uçuşta boş koltuk olduğu sürece her koltuğa
erişiyor ve bunun karşılığı genellikle iki katı mil. Kısıtlı ödül bilet
ise yalnızca belirli bir ödül sınıfı (award class) için ayrılmış kapasiteyle
sınırlı. Bu, yukarıdaki fiyat noktası mantığının aynısı: kısıtlı
ödül, envanterde kendine ayrılmış bir sınıfı olan ucuz bir fiyat noktası;
kısıtlamasız ödül ise son koltuğa kadar erişen pahalı bir fiyat noktası.
Mil de bir para birimi olarak davranıyor ve aynı envanter kontrolünden
geçiyor.

Yazılım tarafında bunun karşılığı şu: stopover, open jaw ve tek yön
kuralları sadakat sisteminin içinde gömülü sabitler olarak durmamalı.
Havayoluna göre değişen, zamanla açılıp kapanan politikalar bunlar; kural
motoru onları parayla satılan ücretin kurallarıyla aynı dilde ifade
edebiliyorsa, ödül bileti de aynı fiyatlandırma ve envanter boru
hattından geçirebiliyor.

## Yarın işe yarayacak dört çıkarım

1. **Fiyat noktası açmadan önce tahmini ve envanteri kur.** Bir pazardaki
   fiyat noktası sayısını artırmak ancak gelişmiş bir gelir yönetimi ve
   talep tahmin sistemiyle birleştiğinde kâr getiriyor. Her yeni ücret
   sınıfı, tahmin modelinde ve envanter kontrolünde karşılığı olan bir
   segment olmalı.
2. **Ücret inşasını otomatikleştir, parçaları sakla.** Gateway ve eklenti
   ücretlerinin otomatik birleştirilmesi yeni pazarlara hızla girmeyi ve
   karmaşık rotalarda anlık fiyat üretmeyi sağlıyor. Hesaplanan fiyatın
   yanında onu üreten ana ücreti ve eklentiyi de tut; açıklanamayan fiyat
   denetlenemiyor.
3. **Alt segmentlerin kısıtlamalarını katı uygula.** VFR ve tur grupları gibi
   derin indirimli segmentlerde maksimum kalış süresi, erken alım şartı ve
   iptal cezası kârlılığı koruyan kurallar. Gevşetilen her kısıtlama, üst
   segmentin aşağı kayması için bir yol açıyor.
4. **Ödül kurallarını bir değer önerisi olarak tasarla.** Stopover ve open
   jaw'a izin vermek, özellikle uluslararası taşıyıcılar için sadakati
   artıran bir teklif. Hangisinin açılacağını politika olarak yönet, kodda
   sabitleme; kısıtlı ödülü ayrılmış bir sınıfa, kısıtlamasızı genel
   envantere bağla.

Bu bölümde ne yok: yolcu miksini seçen kontrol mekanizmasının kendisi
("Yield Management: erken dönem stratejik analiz ve iş mantığı"), sadakat
programlarının ortaya çıkışı ve rekabetteki rolü ("PEOPLExpress ve
havacılık sektörü: sadakat programları ve dağıtım sistemleri stratejik
analizi"), ücret kurallarının kategori kategori nasıl kodlandığı (kural
motoru bölümleri). Bu bölüm fiyatın hangi parçalardan kurulduğunu ve kaç
parçaya bölünebileceğini neyin sınırladığını anlatmak için var.
