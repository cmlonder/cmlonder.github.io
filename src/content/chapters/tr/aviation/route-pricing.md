---
title: "Havacılık güzergah fiyatlandırması ve iş mantığı analizi"
domain: "aviation"
summary: "Bir biletin fiyatı tek bir sayı değil, yolculuğun ücret bileşenlerine bölünüp fiyatlandırılabilir birimler altında yeniden birleştirilmesinin sonucu. Aynı rota onlarca farklı şekilde bölünebiliyor; motor bunların arasından kurallara uyan, koltuğu müsait olan ve vergiler dahil en ucuz olanı seçiyor. Bu bölüm o bölme ve birleştirme mantığını, open jaw mesafe kuralını, IATA Trafik Konferansı bölgelerini ve vergilerin hesaba nerede girdiğini anlatıyor."
audience: "Shopping, fiyatlandırma, bilet değişimi ya da teklif yönetimi akışlarında çalışan, motorun neden aynı rotaya farklı fiyat döndürdüğünü anlamak isteyen yazılımcı ve ürün insanı. Ücret bileşeni, fiyatlandırılabilir birim (PU), open jaw, ARNK ve TC bölgeleri metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Kullanıcı bir kalkış ve varış noktası girip ara tuşuna bastığında ekrana
gelen fiyat, bir veritabanı satırından okunmuyor. Kaynak metnin tanımıyla
güzergah fiyatlandırması (itinerary pricing), yolculuğun ücret
bileşenlerine ayrılması ve bu bileşenlerin fiyatlandırılabilir birimler
altında yeniden birleştirilmesi süreci. **Bir biletin fiyatı bir değer
değil, bir arama sonucu: aynı rotanın mümkün olan bütün bölünüşleri
arasından seçilmiş en ucuz geçerli olan.** Bu seçimi kısıtlayan üç şey var:
kuralların uygulanabilirliği, koltuk müsaitliği ve devletin koyduğu
vergiler. Seçimin nasıl yapıldığı da seyahatin türüne ve IATA'nın dünyayı
böldüğü bölgelere göre değişiyor.

![Sunumun kapak slaytı. Başlık: Seyahat Programı Ücretlendirmesi ve IATA Coğrafyası. Alt başlık: Karmaşık Uçuş Rotalarının Arkasındaki Fiyatlandırma Anatomisi. Sağda enlem ve boylam çizgileriyle çizilmiş bir dünya küresi; üzerinde mavi noktalar ve bu noktaları birbirine bağlayan turuncu yaylar. Alttaki uzman sistem notları kutusunda iki madde: sunum, AirShopping ve Offer Management akışlarının temel mantığını kapsar; müşteri bir O&D (kalkış/varış) girdiğinde ücret motoru saniyeler içinde milyonlarca olasılığı hesaplar. İkinci madde: modern havayolları ATPCO (Airline Tariff Publishing Company) kurallarına dayanır ve bu kavramlar Amadeus, Sabre ve Travelport gibi GDS'lerin bilet fiyatlarını nasıl oluşturduğunun temelidir.](/decks/route-pricing/01.webp "Küredeki turuncu yaylar tek bir rota değil, aynı noktalar arasında kurulabilecek alternatif bağlantılar. Motorun işi bunların arasında seçim yapmak.")

## Fiyat yukarıdan değil, en küçük parçadan kuruluyor

Hiyerarşi dört katmanlı ve aşağıdan yukarı okunuyor. En altta ücret
bileşeni (fare component) duruyor: iki şehir çifti arasındaki ücret,
fiyatın en temel yapı taşı. Bir ya da daha fazla ücret bileşeni bir araya
gelip fiyatlandırılabilir birimi (priceable unit, PU) oluşturuyor. PU,
ücret kurallarının uygulandığı alan. Bir veya daha fazla PU'nun geçerli
birleşimi fiyatlandırma çözümünü (pricing solution) veriyor. En üstte de
seyahat programı (itinerary), yani yolcunun başlangıç noktasından varış
noktasına kadar bütün yolculuğu duruyor.

Motor bu hiyerarşiyi tersinden kullanıyor. Yolculuğu önce ücret kırılım
noktalarından (fare break points) bileşenlere bölüyor, sonra bileşenleri
PU'lara grupluyor, sonra PU'ların birleşimlerini deniyor. Yazılım
tarafında bunun karşılığı şu: fiyatlandırma bir hesaplama değil bir
arama problemi. Girdi bir rota, çıktı o rotanın olası bölünüşleri
üzerinde gezinip en ucuz geçerli olanı bulan bir algoritmanın sonucu.

![Başlık: Bir Uçuş Fiyatı Nasıl İnşa Edilir? İç içe kutular: en dışta Seyahat Programı (Itinerary), içinde Fiyatlandırma Çözümü (Pricing Solution), onun içinde iki Fiyatlandırılabilir Birim (PU) ve her PU'nun içinde üçer turuncu Ücret Bileşeni. Sağda tanımlar: seyahat programı yolcunun başlangıçtan varışa tüm yolculuğunu kapsayan en üst çerçeve; fiyatlandırma çözümü bir uçuş için geçerli olan bir veya daha fazla PU'nun başarılı kombinasyonu; PU ücret kurallarının uygulandığı ve birden fazla bileşenin gruplandığı ana kural alanı; ücret bileşeni iki şehir arasındaki spesifik ücreti temsil eden en temel yapı taşı. Alttaki notlar: fiyatlandırma motorları en ucuz modüler kombinasyonu bulmak için yolculuğu Fare Break Points (ücret kırılım noktaları) üzerinden böler. Gizli kural: aynı PU içindeki ücretler genellikle aynı taşıyıcıya ait olmalı veya ATPCO Kategori 10 (Combinability, birleştirilebilirlik) kurallarına uymalıdır; bu, ucuz iç hat kurallarının uluslararası uçuşlara uygulanmasını engeller.](/decks/route-pricing/02.webp "Kural PU seviyesinde uygulanıyor, bileşen seviyesinde değil. İki bileşenin tek başına geçerli olması, aynı PU içinde birlikte geçerli oldukları anlamına gelmiyor.")

## PU, kuralların birbirine çarptığı yer

Bileşenleri gelişigüzel gruplamak mümkün değil. Kaynak metne göre iş
kuralı, bir PU içindeki bütün ücretlerin aynı havayoluna ait olmasını
zorunlu kılabiliyor. Motor PU kombinasyonlarını oluştururken hem bu
havayolu kısıtını hem de ücret kurallarının birbiriyle tutarlı olup
olmadığını doğruluyor. Slayt bu kuralın ATPCO tarafındaki adını da
veriyor: aynı taşıyıcı değilse ücretler Kategori 10, yani
birleştirilebilirlik kurallarına uymak zorunda. Amacı somut: ucuz bir iç
hat ücretinin kuralları, aynı PU'ya sokularak uluslararası bir uçuşa
taşınamasın.

Buradan çıkan mühendislik sonucu, doğrulamanın tek tek ücretler üzerinde
değil grup üzerinde çalışması gerektiği. Her bileşeni ayrı ayrı geçerli
bulan bir doğrulayıcı, kombinasyonda ortaya çıkan çelişkiyi göremiyor.

## Yolculuğun şekli hangi PU'nun kurulabileceğini belirliyor

Kaynak metin bunu tek cümleyle söylüyor: müşterinin yolculuğu PU
olasılıklarını kısıtlıyor. Dört temel PU tipi var. Tek yön (one-way)
A'dan B'ye giden temel model. Gidiş-dönüş (roundtrip) A'dan B'ye gidip
aynı noktaya dönüş. Çember seyahat (circle trip) birden fazla noktayı
kapsayıp başlangıca dönen kapalı döngü. Açık çene (open jaw) ise bir
boşluk içeren çember seyahat türevi.

Kaynak metin open jaw'ı tam olarak böyle tanımlıyor: open jaw PU'ları,
boşluğun bulunduğu yerde bir ücret bileşeni eksik olan çember seyahatler
gibi. Yolcu B'ye uçuyor, C'den dönüyor; B ile C arası uçulmuyor. Slayt,
seyahat tipinin hangi ücret temel kodlarının (fare basis codes)
uygulanabileceğini belirlediğini de ekliyor. Yani tip sadece bir etiket
değil, hangi ücretlerin masaya gelebileceğini seçen bir filtre.

![Başlık: PU Tipleri ve Geometrik Sınırları. Dört panel. Tek Yön (One-Way): A'dan B'ye tek ok, sadece A noktasından B noktasına giden temel uçuş modeli. Gidiş-Dönüş (Roundtrip): A ile B arasında iki yönlü ok, A'dan B'ye gidiş ve aynı noktaya dönüş. Çember Seyahat (Circle Trip): A, B ve C arasında kapalı üçgen, birden fazla noktayı kapsayan ve başlangıca geri dönen kapalı döngü. Açık Çeneli (Open Jaw): A'dan B'ye ve C'den A'ya oklar, B ile C arası turuncu kesikli çizgi, bir boşluk (uçulmayan sektör) içeren çember seyahat türevi. Turuncu uyarı kutusu, açık çene kuralı: seyahatteki uçulmayan boşluk mesafesi, biletteki uçulan herhangi bir ücret bileşeni mesafesinden kesinlikle daha kısa olmalıdır. Alttaki notlar: seyahatin gidiş-dönüş mü açık çeneli mi olduğu hangi ücret temel kodlarının uygulanabileceğini belirler; açık çene boşluğu GDS sistemlerinde Surface Sector (ARNK, Arrival Unknown) olarak işlenir ve mesafe kuralı yolcuların alakasız şehirleri tek bilette birleştirerek fiyatlandırma açıklarından yararlanmasını önler.](/decks/route-pricing/03.webp "Dördüncü paneldeki kesikli çizgi, sistemin mesafesini ölçmek zorunda olduğu tek uçulmayan parça.")

## Open jaw'ın boşluğu ölçülmeden fiyat kurulamıyor

Open jaw'ın kritik iş kuralı bir mesafe karşılaştırması. İki uçuş
arasındaki boşluk, seyahatte uçulan bileşenlerin mesafesinden kısa
olmak zorunda. Slayt bunu kesin bir dille koyuyor: boşluk, biletteki
uçulan herhangi bir ücret bileşeninden kesinlikle kısa olmalı.

Kuralın neden var olduğu da slaytta yazıyor. Boşluk GDS'lerde yüzey
sektörü (surface sector) olarak, ARNK (Arrival Unknown) kaydıyla işleniyor
ve mesafe kuralı, yolcunun birbiriyle ilgisi olmayan şehirleri tek bir
bilette birleştirip fiyatlandırmadaki açıklardan yararlanmasını
engelliyor. Kural olmasa bir open jaw, iki bağımsız tek yön yolculuğu
gidiş-dönüş ücretiyle satın almanın yoluna dönüşürdü.

Yazılım tarafında bunun karşılığı, fiyatlandırma motorunun bir coğrafya
servisine bağımlı olması. Boşluğun geçerliliği bir kural tablosundan
okunmuyor, iki nokta arasındaki mesafe hesaplanıp bileşenlerin
mesafeleriyle karşılaştırılarak bulunuyor. Brifing bu kontrolün otomatik
yapılmasını hatalı fiyatlandırmanın önündeki engel olarak görüyor.

## Aynı rota, onlarca bölünüş, tek kazanan

Motorun en ilginç davranışı, tek bir rotayı birbirinden çok farklı
mimarilerle fiyatlandırabilmesi. Brifingin örneği LAX-ORD-LGA-DFW-LAX.
Bu rota tek bir çember seyahat PU'su olarak fiyatlanabilir. LAX-ORD-LGA ve
LGA-DFW-LAX olmak üzere iki open jaw PU'ya bölünebilir. Dört ayrı tek
yön PU olarak da kurulabilir. Slaytın başlığı durumu iyi özetliyor: aynı
uçuş, farklı mimari çözümler.

Hangisinin seçileceğini belirleyen kural brifingde açık: algoritma mevcut
bütün PU modellerini simüle ediyor ve kurallara uygun, koltuğu müsait,
bütün vergiler dahil toplam maliyeti en düşük olanı seçiyor. Kaynak
metin de başarı kriterini aynı üçlüyle tanımlıyor: güzergah
fiyatlandırması uygulanabilir ve müsait olan en ucuz çözümü buluyor.
Brifing bu esnekliği fiyat optimizasyonu için kritik bir yetenek sayıyor;
tek PU ile yetinen bir motor, daha ucuz bir bölünüş varken onu hiç
denemiyor.

![Başlık: Aynı Uçuş, Farklı Mimari Çözümler. Alt başlık: bir rota, algoritmalar tarafından ücret bileşenlerine ve PU'lara onlarca farklı şekilde bölünebilir. Solda örnek rota: LAX, ORD, LGA, DFW, LAX. Üç dal. Kombinasyon 1: tek Çember Seyahat (Circle Trip) PU, bütün rota tek parantez içinde. Kombinasyon 2, turuncu çerçeve ve onay işaretiyle vurgulanmış: iki Açık Çeneli (Open Jaw) PU; PU 1 LAX-ORD-LGA, PU 2 LGA-DFW-LAX, aralarında Surface Sector (ARNK) yazan noktalı çizgi. Kombinasyon 3: dört Tek Yönlü (One-Way) PU; LAX-ORD, ORD-LGA, LGA-DFW, DFW-LAX. Ortadaki kutu, sistemin hedefi: tüm olası fiyatlandırma çözümleri arasından, vergiler dahil edildiğinde geçerli ve müsait olan en ucuz rotayı seçmek. Alttaki notlar: OTA'lar (örneğin Expedia) veya havayolu arka uç sistemlerindeki shopping motorları bu grafik yapılarını milisaniyeler içinde inşa eder. Matematiksel olasılık müsaitlik anlamına gelmez; sistem belirli rezervasyon sınıflarında (RBD) müsaitliği doğrulamalıdır. Teorik olarak ucuz bir PU kombini, DFW-LAX bacağında gerekli L sınıfı envanter tükendiyse reddedilir.](/decks/route-pricing/04.webp "Onay işareti bu örnekte kazananı gösteriyor, her rotada değil. Hangi kombinasyonun kazanacağı, fiyat ve müsaitlik o an ne diyorsa ona göre değişiyor.")

Slaytın alt notu kritik bir ayrım yapıyor: matematiksel olasılık
müsaitlik demek değil. Teoride en ucuz çıkan PU kombinasyonu, örneğin
DFW-LAX bacağında gerektirdiği L sınıfı envanter tükendiyse reddediliyor.
Yani fiyatlandırma motoru ile envanter birbirinden bağımsız çalışamıyor.
En ucuz kombinasyonu bulan arama, her adayı rezervasyon sınıfı (RBD)
seviyesinde müsaitliğe sormak zorunda. Gelir yönetimi bölümlerinde
anlatılan sınıf kapatma kararları, tam bu noktada fiyatlandırma
çözümünün sonucunu değiştiriyor.

## Vergiler karşılaştırmanın içinde, sonrasında değil

Taban ücretin en ucuzu, biletin en ucuzu olmayabiliyor. Brifing bu yüzden
vergileri fiyatlandırma çözümünün ayrılmaz parçası olarak koyuyor: sistem
her çözüm için DOT'un zorunlu tuttuğu PFC (Passenger Facility Charge,
yolcu tesis ücreti), FET (Federal Excise Tax, federal tüketim vergisi),
segment ücreti ve 11 Eylül güvenlik harcı gibi kalemleri otomatik
hesaplayıp taban ücrete ekliyor. Slayt listeye uluslararası çıkış ve
varış harçlarını da koyuyor.

Karşılaştırmanın vergiler dahil yapılması brifingde hem yasal uyum hem
şeffaflık gereği olarak geçiyor. Sıralama önemli: vergi en ucuz taban
ücret seçildikten sonra eklenirse, başka bir bölünüşün daha düşük vergili
olduğu durum gözden kaçıyor. Segment ücreti uçulan her bacak için
alındığından, dört tek yön PU ile tek çember seyahat aynı bacakları
kapsasa bile toplam fiyatları farklı hesaplanabiliyor.

![Başlık: Nihai Fiyatın Matematiksel Formülü. Alt başlık: sistem en ucuz ücret bileşeni ağını bulduktan sonra zorunlu kılınan harçları ekler. Formül: Geçerli En Ucuz PU Kombinasyonu artı Zorunlu Devlet ve Havalimanı Vergileri eşittir Nihai Seyahat Programı Fiyatı (turuncu kutu). Vergi kutusundan beş dal iniyor: PFC, yolcu tesisi ücreti (Passenger Facility Charges); FET, federal tüketim vergisi (Federal Excise Tax); Segment Ücreti, uçulan her bir bacak için alınan sabit ücret; Güvenlik Harcı, 11 Eylül güvenlik harcı; Sınır Geçişleri, uluslararası çıkış ve varış harçları. Alttaki notlar: vergiler IATA TTBS (Ticket Tax Box Service) gibi devasa harici tablolar aracılığıyla yönetilir. Mühendislik perspektifi: 11 Eylül harcı (AY tax) ve PFC (XF tax) gibi vergilerin katı rotalama sınırları vardır (örneğin tek yönde en fazla 2 PFC); vergileri hesaplamak sadece bacakları değil tüm yolculuk bağlamını (bağlantı süresi 4 saatten kısa mı, konaklama mı) değerlendirmeyi gerektirir ve bu durum agresif fiyat önbelleğe almayı son derece zorlaştırır.](/decks/route-pricing/05.webp "Alt nottaki son cümle bir mimari uyarı: vergi bacaktan değil yolculuktan hesaplanıyorsa, bacak bazlı fiyat önbelleği yanlış toplam üretir.")

Slaytın mühendislik notu bu bölümün en pratik cümlesi. AY (11 Eylül
harcı) ve XF (PFC) gibi vergilerin katı rotalama sınırları var; örneğin
tek yönde en fazla iki PFC alınıyor. Vergiyi hesaplamak için bacaklara
değil bütün yolculuk bağlamına bakmak gerekiyor: bağlantı süresi dört
saatten kısa mı, yoksa bir konaklama mı. Bu da agresif fiyat
önbelleklemeyi zorlaştırıyor. Bir bacağın fiyatını önbellekten okumak
kolay; o bacağın hangi yolculuğun parçası olduğuna göre değişen vergiyi
önbelleğe almak mümkün değil. Vergiler de IATA TTBS (Ticket Tax Box
Service) gibi büyük harici tablolardan geliyor, yani motorun kendi
kuralları dışında ayrı bir veri bağımlılığı daha var.

## Dünyanın hangi bölgesinden geçtiğin, hangi kuralın geçerli olduğunu seçiyor

Fiyat inşasının coğrafi bir temeli var. Kaynak metin bunu şöyle koyuyor:
ücret inşası, müşterinin seyahat ettiği, yola çıktığı ya da aktarma
yaptığı dünya bölgelerine dayanıyor. IATA dünyayı üç Trafik Konferansı
(TC) alanına ayırıyor: TC1 Kuzey, Orta ve Güney Amerika; TC2 Avrupa, Orta
Doğu ve Afrika; TC3 Asya ve Pasifik. Bölgeler arası yolculuklar da kendi
adını alıyor: brifing TC12'yi Amerika ile Avrupa arası, TC23'ü Avrupa ile
Hindistan arası olarak örnekliyor ve ikisinin farklı ücret kurallarına ve
mil düzenlemelerine tabi olabileceğini söylüyor.

![Başlık: Global Oyun Alanı, IATA Trafik Konferansı (TC) Bölgeleri. Alt başlık: bilet kuralları, yolcunun dünyanın hangi bölgelerine seyahat ettiğine veya transit geçtiğine bağlı olarak dramatik şekilde değişir. Solda iki kutu. IATA dünyayı 3 ana bölgeye ayırır: TC1 Kuzey, Orta ve Güney Amerika; TC2 Avrupa, Orta Doğu ve Afrika; TC3 Asya ve Pasifik. Karma bölgeler (Inter-Area): TC12, ABD ile Almanya arasındaki uçuşlar; TC23, Avrupa ile Hindistan arasındaki uçuşlar. Sağda üç dikey şeride bölünmüş dünya haritası, üzerinde LAX, NYC, MIA, MEX, BOG, EZE, LHR, CDG, FRA, CAI, DXB, JNB, DEL, PEK, NRT, SIN, SYD, AKL gibi havalimanı kodları; NYC'den Avrupa'ya turuncu TC12 yayı, Avrupa'dan DEL'e turuncu TC23 yayı. Alttaki notlar: bu alanlar AT (Transatlantic) veya PA (Transpacific) gibi global göstergelerin (GI) belirlenmesinin temelidir. IATA Ücret İnşa El Kitabı, MPM (maksimum izin verilen mil) hesaplamak için bu alanları kullanır; TC1'den TC3'e TC2 üzerinden geçmek (örneğin LAX-LHR-SIN), Pasifik'i doğrudan geçmekten tamamen farklı ücret kurallarını ve duraklama sınırlarını tetikler.](/decks/route-pricing/06.webp "Haritadaki yayların nereden geçtiği, nereye vardıklarından daha önemli. Aynı iki uç, farklı bir transit bölgeyle başka bir kural setine düşüyor.")

Slayt bölgelerin neyi tetiklediğini açıyor. TC alanları AT (Transatlantik)
veya PA (Transpasifik) gibi global göstergelerin (global indicator)
temeli. IATA'nın ücret inşa el kitabı maksimum izin verilen mili (MPM)
bu alanlara göre hesaplıyor. Somut örnek: TC1'den TC3'e TC2 üzerinden
gitmek, yani LAX-LHR-SIN, Pasifik'i doğrudan geçmekten tamamen farklı
ücret kurallarını ve duraklama sınırlarını devreye sokuyor. Yazılım
tarafında bunun karşılığı, rota seçiminin fiyatlandırmanın ilk adımı
olması: motor ücret aramadan önce yolculuğun hangi bölgelere dokunduğunu
çözmek zorunda, çünkü hangi kural setinin yükleneceği buna bağlı.

## Asıl karmaşıklık istisnalarda ve bilet kesildikten sonra

Buraya kadar anlatılan standart ücret inşası. Slayt, bu kuralların
karmaşık istisnalara tabi olduğu altı durumu sıralıyor: yalnızca
onaylanmış uçuş yollarına izin veren belirli rotalamalar (specific
routings), bağlantı süresini aşan konaklamalar için duraklama (stopover)
ücretleri, business ile economy'nin aynı bilette birleştiği karma hizmet
sınıfları (mixed classes), uçuş dışı kara yolu bağlantıları olan yüzey
sektörleri, mevcut biletin yeniden düzenlenmesi (reissue) ve standart
mesafe kurallarından sapan özel mil karşılıkları.

![Başlık: Fiyatlandırmayı Zorlaştıran Etkenler. Alt başlık: standart ücret inşası kuralları aşağıdaki özel durumlarda karmaşık istisnalara tabi tutulur. Altı kutu, her birinde bir ikon. Belirli Rotalamalar (Specific Routings): yalnızca onaylanmış uçuş yolları. Duraklama (Stopover) Ücretleri: bağlantı süresini aşan konaklamalar. Karma Hizmet Sınıfları (Mixed Classes): Business ve Economy'nin birleşmesi. Yüzey Sektörleri (Surface Sectors): uçuş dışı kara yolu bağlantıları. Bilet Değişimi (Ticket Reissue): mevcut biletin yeniden düzenlenmesi. Özel Mil Karşılıkları: standart mesafe kurallarından sapmalar. Alttaki notlar: bu slayt rezervasyon sonrası (post-booking) servis akışlarını yoğun şekilde etkiler. Teknik içgörü: bilet değişimi, ATPCO Category 31 (Voluntary Changes) kurallarını kullanarak geçmiş ücretlerin güncel ücretlerle yeniden hesaplanmasını gerektirir; karma sınıflar ise yolcu business bileti alıp yerel aktarma sadece economy olduğunda sistemin dinamik bir sınıf farkı (class differential) hesaplamasını zorunlu kılar.](/decks/route-pricing/07.webp "Altı kutudan en az ikisi bilet kesildikten sonra devreye giriyor. Fiyatlandırma motoru satışla bitmiyor, servis akışında tekrar çağrılıyor.")

Brifing bilet değişimi ve yeniden düzenleme için ayrıca şunu söylüyor:
fiyatlandırma mantığı özel mil hükümlerini, karma sınıfları, duraklama
ücretlerini ve güvenlik ücretlerini yeniden değerlendirip güncel kurallar
üzerinden karar veriyor. Slayt bunun ATPCO tarafındaki karşılığını
veriyor: gönüllü değişiklikler Kategori 31 kurallarıyla, geçmiş ücret ile
güncel ücret yeniden hesaplanarak işleniyor. Karma sınıfta da yolcu
business bileti aldığı halde yerel aktarma yalnızca economy ise sistem bir
sınıf farkı (class differential) hesaplamak zorunda kalıyor.

Mühendislik sonucu açık. Değişim akışı, satış akışının basitleştirilmiş
bir kopyası olamaz; aynı motoru, eski biletin bağlamı ve güncel kurallar
birlikte verilmiş halde çağırmak gerekiyor. Satışta çalışan bir
fiyatlandırmanın reissue'da ayrı bir kural yolu izlemesi, iki yerde
bakımı yapılan ve zamanla ayrışan iki motor demek.

## Dört adım, milisaniyeler içinde

Döngünün tamamı dört adımda özetleniyor. Önce rota seçimi: O&D ve
yolculuğun dokunduğu TC bölgeleri tespit ediliyor. Sonra parçalara
ayırma: uçuş olası ücret bileşenlerine bölünüyor. Sonra kural uygulaması:
geçerli PU kombinasyonları test ediliyor. En son nihai fiyatlandırma: en
ucuz çözümün üzerine zorunlu harçlar ve vergiler ekleniyor. Slaytın
tanımıyla bütün bu iş, küresel coğrafi kuralların, kombinasyon
algoritmalarının ve vergi mevzuatının milisaniyeler içinde birleştiği bir
veri optimizasyonu süreci.

![Başlık: Seyahat Programı Ücretlendirmesi, Tam Döngü. Üstte kutu: bilet fiyatlandırması küresel coğrafi kuralların, kombinasyon algoritmalarının ve vergi mevzuatlarının milisaniyeler içinde birleştiği devasa bir veri optimizasyonu sürecidir. Dört ok şeklinde adım: Adım 1, Rota Seçimi: O&D (kalkış/varış) ve IATA TC bölgelerinin tespiti. Adım 2, Parçalara Ayırma: uçuşun olası ücret bileşenlerine (fare components) bölünmesi. Adım 3, Kural Uygulaması: geçerli fiyatlandırılabilir birim (PU) kombinasyonlarının test edilmesi. Adım 4, Nihai Fiyatlandırma (turuncu): en ucuz çözümün üzerine zorunlu harçların ve vergilerin eklenmesi. Altında onay işaretiyle biten bir devre hattı. Alttaki notlar: sektörel evrim, bu sunum EDIFACT ve GDS aracılığıyla küresel biletlemenin yüzde 90'ından fazlasını oluşturan geleneksel ATPCO ücret inşasını açıklamaktadır. Gelecek vizyonu (NDC): modern havayolları NDC (New Distribution Capability) ve dinamik tekliflere (Dynamic Offers) geçiş yapmaktadır; NDC dünyasında FC ve PU'ları katı şekilde birleştirmek yerine havayolunun kendi sistemleri yapay zeka kullanarak dinamik olarak fiyatlandırılmış tek bir sürekli teklif (continuous offer) üretir.](/decks/route-pricing/08.webp "Alt nottaki iki cümle aynı sistemin iki dönemini anlatıyor: bugün biletlemenin büyük kısmını taşıyan bileşen mantığı ve onun yerine geçmeye aday sürekli teklif.")

Slaytın alt notu bu yapının tarihteki yerini de gösteriyor. Anlatılan
geleneksel ATPCO ücret inşası, EDIFACT ve GDS üzerinden küresel
biletlemenin yüzde 90'ından fazlasını oluşturuyor. Havayolları ise NDC ve
dinamik tekliflere geçiyor; o dünyada ücret bileşenleri ve PU'lar katı
şekilde birleştirilmiyor, havayolunun kendi sistemi tek bir sürekli
teklif üretiyor. Bu bölümün anlattığı mantık, o geçişin neyi ortadan
kaldırmaya çalıştığını anlamak için de gerekli: NDC@Scale bölümünde
havayoluna geçtiği anlatılan hesaplama yükünün büyük kısmı tam olarak bu
arama.

## Yarın işe yarayacak dört çıkarım

1. **Tek bölünüşle yetinme.** LAX-LGA-DFW-LAX gibi karmaşık rotalarda
   motorun tek bir PU yerine birden fazla tek yön ya da open jaw
   kombinasyonu kurabilmesi, fiyat optimizasyonunun önkoşulu. Motorun
   hangi PU tiplerini denediğini ve hangilerini hiç üretmediğini bil.
2. **Open jaw mesafesini otomatik denetle.** Boşluk mesafesinin uçulan
   bileşenlerden kısa olması kuralını sistem kendisi kontrol etsin; bu
   kontrol hatalı fiyatlandırmanın ve fiyat açığı istismarının önündeki
   engel. Mesafe hesabı bir kural tablosu değil, bir coğrafya bağımlılığı.
3. **Çözümleri vergiler dahil karşılaştır.** PFC, FET, segment ücreti ve
   güvenlik harcını en ucuz taban ücret seçildikten sonra değil,
   karşılaştırmanın içinde hesapla. Vergi yolculuk bağlamına bağlı
   olduğundan bacak bazlı fiyat önbelleğine güvenme.
4. **Bölge geçişini fiyatlandırmanın ilk girdisi say.** TC1, TC2 ve TC3
   arasındaki geçişler mil hükümlerinden duraklama ücretlerine kadar
   bütün detayı değiştirebiliyor. Aynı uç noktalarla farklı transit
   bölgeden geçen iki rotayı aynı kural setiyle fiyatlandırma.

Bu bölümde ne yok: ücret ürünlerinin ve kurallarının kendisi (ücret ve
fiyatlama bölümleri), sınıf kapatma kararlarının mantığı (gelir yönetimi
bölümleri) ve NDC'de fiyatın havayoluna geçişi ("NDC@Scale"). Bu bölüm,
o ücretlerin tek bir biletin içinde nasıl bölünüp birleştirildiğini
anlatmak için var.
