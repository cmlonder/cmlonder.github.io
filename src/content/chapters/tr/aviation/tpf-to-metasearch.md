---
title: "Havacılık rezervasyon sistemleri ve dijital dağıtım kanalları stratejik analizi"
domain: "aviation"
summary: "Sistemin kalbinde hâlâ assembly atıyor ve onu yazacak insan azalıyor; bu yüzden TPF'den açık sistemlere geçiş bir tercih değil, zorunluluk. Aynı dönemde kontrol üç kez el değiştirdi: 1980'lerde envanteri tutan, 2000'lerde işlemi tutan, 2020'lerde dikkati tutan kazandı. Bu bölüm eAAsy Sabre'den Google Flights'a o kaymayı anlatıyor."
audience: "Legacy PSS migrasyonu planlayan ya da OTA ve metasearch entegrasyonu yazan yazılımcı ve ürün insanı. Önceki bölüm okunmuş olmalı; TPF, kademeli migrasyon, ters açık artırma, referral fee ve deep link metnin içinde tanımlanıyor."
pubDate: 2026-09-22
topics: [solution-architecture, scale-and-performance]
ai: generated
---

Önceki bölüm OTA'ların rezervasyonsuz bin sonuç talebinin TPF mainframe'i
çökertme noktasına getirdiğini anlatmıştı. Bu bölüm iki soruyla devam
ediyor. Birincisi: o mainframe hâlâ orada mı? Evet, ve **kalbinde hâlâ
assembly atıyor;** onu yazacak insan azaldığı için açık sistemlere geçiş
zorunluluk oldu. İkincisi: mainframe'in dışında kontrol kimde? 1985'te
American'ın modemli müşterisinde başlayan yol, 1996'da OTA'ya, 2004'te
meta-aramaya, 2010'da Google'a geçti. Dağıtım mimarisi artık kodu kimin
yazdığıyla değil, müşterinin arama anını kimin yönettiğiyle ilgili.

![Sunumun kapak slaytı. Başlık: Havacılıkta Dağıtım Mimarisi. Alt başlık: anaçatı sistemlerinden modern dijital perakendeciliğe mimari evrim. Solda koyu gri, bloklardan oluşan bir mainframe kütlesi; sağa doğru parçalanıp dağılıyor ve renkli küçük pencere ve belge kartlarından oluşan, birbirine kavisli çizgilerle bağlı bir ağa dönüşüyor.](/decks/tpf-to-metasearch/01.webp "Soldaki kütle tek parça, sağdaki ağ yüzlerce parça. Bu bölüm kütlenin neden parçalanmak zorunda kaldığını ve parçaların kimin eline geçtiğini anlatıyor.")

## Sistemin kalbinde hâlâ düşük seviyeli diller atıyor

IBM TPF (Transaction Processing Facility), IBM Airline Control Program
(ACP) tabanlı bir mimari. Son on yılda IBM z/TPF sürümlerine kısıtlı bir
geçiş sağlandı. Kriz noktası: eski nesil, düşük seviyeli dillerde
(assembly) uzmanlaşmış programcı bulmak giderek zorlaşıyor. Slayttaki üç
satır kod bunu gösteriyor: PNR adresini yükle, dört baytı karşılaştır,
eşit değilse hata rutinine dallan. Bugün milyarlarca dolarlık rezervasyon
akışı bu seviyede yazılmış kodun üzerinde çalışıyor.

![Başlık: Sistemin kalbinde hâlâ düşük seviyeli diller atıyor. Solda kesit görünümlü bir mainframe kabini, içinde disk paketleri ve kartlar; ortada etiket IBM TPF (Transaction Processing Facility). Sağda koyu bir terminal kutusunda üç satır assembly: LOAD R1, PNR_ADDR; MVC 0(4, R1), =C'XXXX'; BNE ERROR_ROUTINE. Altında üç not. Köken: IBM Airline Control Program (ACP) tabanlı mimari. Mevcut durum: son on yılda IBM z/TPF sürümlerine kısıtlı geçiş sağlandı. Kriz noktası: eski nesil, düşük seviyeli dillerde (assembly) uzmanlaşmış programcı bulmak giderek zorlaşıyor.](/decks/tpf-to-metasearch/02.webp "Üç satır kodun ilk kelimesi PNR. Kayıt, 1960'ların bellek adresinde duruyor ve o adresi okuyabilen insan sayısı her yıl azalıyor.")

İnsan kaynağı sorusunun cevabı burada. Assembly uzmanı bulmanın zorlaşması,
sistemleri modern programlama dillerini destekleyen açık sistemlere
taşımak için bir zorunluluk (incentive) yaratıyor. İş mantığı, yetenek
havuzunun geniş olduğu dilleri kullanarak teknik borcu ve işe alım riskini
azaltmak. Kod çalışıyor; sorun kodun değil, onu okuyacak kişinin ömrü.

## Kapalı sistemlerden açık mimariye mecburi geçiş

Dört boyutta karşılaştırma. Donanım maliyeti: TPF özel donanım ister; açık
sistem uygun maliyetli standart donanımla çalışır. Ölçeklenebilirlik:
TPF'de işlem hacmi arttıkça maliyet katlanır; servis odaklı mimaride
(SOA) işlem hacmiyle birlikte dikey ölçeklenir. İş gücü: TPF'de daralan
eski nesil yazılımcı havuzu; açık sistemde modern dillere hâkim geniş
yetenek havuzu. Pazara çıkış hızı: TPF'de düşük esneklik ve uzun teslim
süresi; açık sistemde yüksek esneklik ve hızlı entegrasyon.

![Başlık: Kapalı sistemlerden açık mimariye mecburi geçiş. İki sütunlu tablo; sol sütun koyu zeminde TPF / kapalı sistemler, sağ sütun açık zeminde açık sistemler / SOA; satırlar arasında vs. etiketleri. Donanım maliyeti: özel donanımlar (TPF) karşısında uygun maliyetli standart donanımlar. Ölçeklenebilirlik: işlem hacmi arttıkça maliyet katlanır karşısında işlem hacmiyle birlikte dikey ölçeklenebilir (servis odaklı mimari). İş gücü: daralan eski nesil yazılımcı havuzu karşısında modern programlama dillerine hâkim geniş yetenek havuzu. Pazara çıkış hızı: düşük esneklik, uzun teslim süreleri karşısında yüksek esneklik ve hızlı entegrasyon.](/decks/tpf-to-metasearch/03.webp "Dört satırın ikisi para, ikisi insan ve zaman. Karar yalnızca donanım faturasıyla verilmiyor; üçüncü satır olmadan ilk ikisi yeterli gerekçe olmazdı.")

Altyapı değişimi kararının kriterleri buradan çıkıyor: toplam sahip olma
maliyetinin (TCO) düşürülmesi, sistem esnekliğinin artırılması ve yeni
ürünün pazara çıkış süresinin (time-to-market) kısaltılması. Dikey
ölçeklenebilen emtia donanımın (commodity hardware) işlem maliyeti
avantajı birincil kriter. Ama tablonun üçüncü satırı olmasa ilk iki satır
belki yıllarca ertelenirdi; havayolunu harekete geçiren, maliyetten çok
iş gücü kıtlığı.

## Temel havacılık sistemlerinin kademeli ayrışması

Hepsi bir anda taşınmıyor. Sıra: rezervasyon, envanter, kalkış kontrolü
(DCS), alışveriş (shopping), fiyatlandırma, biletleme. Sektör örneği
Amadeus (2018): açık sistemlere geçişi tamamlayan ilk sistem. Avantajı,
yalnızca temel PNR işlemlerinin TPF'de olmasıydı; envanter ve kalkış
kontrolü zaten açık sistemlerde geliştirilmişti.

![Başlık: Temel havacılık sistemlerinin kademeli ayrışması. Sol altta koyu mainframe zemininden çıkan basamaklı kutular sağ üste doğru yükseliyor: rezervasyon (koyu zeminde), envanter, kalkış kontrolü (DCS), alışveriş (shopping), fiyatlandırma, biletleme; her biri okla bir sonrakine bağlı, üst kutular renkli saydam katmanların üzerinde. Sağ altta kutu, sektör örneği Amadeus (2018): açık sistemlere geçişi tamamlayan ilk sistem; avantajı, sadece temel PNR işlemleri TPF'deydi, envanter ve kalkış kontrolü zaten açık sistemlerde geliştirilmişti.](/decks/tpf-to-metasearch/04.webp "Rezervasyon kutusu tek başına koyu zeminde: en son taşınan o. PNR'ı en sona bırakmak korkaklık değil, bağımlılık haritasının sonucu.")

Kademeli migrasyonda önceliklendirme sorusu: strateji, bileşenleri sistem
kritikliğine ve bağımlılık haritasına göre aşamalandırıyor. Amadeus
envanteri ve kalkış kontrolünü doğrudan açık sistemlerde geliştirdi, PNR
işlemeyi en son taşıdı. Mantık şu: her şeyin bağlı olduğu kayıt en son
hareket eder, çünkü onun etrafındaki her bileşen açık tarafa geçince
taşınacak yük en aza iner. "PNR bir kayıt değil, bir sözleşme" bölümü o
kaydın neden bu kadar ağır olduğunu anlatacak.

## 1985: çevrimiçi dönemin sembolik ilk adımı

1985'te American Airlines eAAsy Sabre'yi başlattı: modem donanımlı
bilgisayardan sefer, uygunluk ve ücret sorgulama imkânı. Etkisi sınırlı,
yalnızca 150.000 kullanıcı bilet aldı; ama dönüm noktası oldu. 1990'da
CompuServe (550.000 üye), Prodigy ve Nynex üzerinden erişim geldi;
eAAsy Sabre, OAG (Official Airline Guide) ve TWA/Northwest'in
Travelshopper'ına bağlanma imkânı.

![Başlık: Çevrimiçi dönemin sembolik ilk adımı. Solda eski bir kişisel bilgisayar ve ekranında eAAsy Sabre yazan pencere; kesikli çizgiyle sağdaki bir veri merkezi binasına bağlı. Altta zaman çizgisi, iki nokta. 1985: American Airlines eAAsy Sabre sistemini başlattı; erişim, modem donanımlı bilgisayarlardan sefer, uygunluk ve ücret sorgulama imkânı; etki, sadece 150.000 kullanıcının bilet aldığı sembolik bir adımdı, ancak dönüm noktası oldu. 1990: CompuServe (550.000 üye), Prodigy ve Nynex üzerinden erişim; eAAsy Sabre, OAG (Official Airline Guide) ve Travelshopper'a (TWA/Northwest) bağlanma imkânı.](/decks/tpf-to-metasearch/05.webp "Kesikli çizgi bir modem hattı. 1985'te acentenin terminalindeki ekran ilk kez yolcunun evine girdi; sayı küçük, yön kalıcı.")

Yazılımcı için anlamı: acentenin gördüğü ekranın yolcuya açılması yeni
bir sistem gerektirmedi, yeni bir erişim yolu gerektirdi. Ama o yol
açılınca sorgu sayısı acente sayısıyla değil, modem sayısıyla sınırlı
hale geldi. Önceki bölümdeki look-to-book sıçramasının ilk tohumu bu.

## 1996: web süpermarketleri dağıtım gücünü ele geçiriyor

1996'da Sabre yöneticisi Terry Jones liderliğinde dünyanın ilk online
rezervasyon sistemi Travelocity kuruldu; hemen ardından Microsoft,
Expedia'yı başlattı. Dolaylı kanal mimarisi: OTA'lar havayolu, otel ve
araç kiralama hizmetlerini birleştirerek pazarda benzersiz bir şeffaflık
yarattı. Çalışma prensibi: rezervasyon yönetimi için GDS altyapısı
kullanılırken biletleme, müşteri hizmetleri ve muhasebe harici acente
entegrasyonuyla yönetiliyor.

![Başlık: Web süpermarketleri dağıtım gücünü ele geçiriyor. Solda tüketici simgesi, oradan bir boru OTA (tek durak noktası) etiketli katmanlı kutuya giriyor; kutudan çıkan boru ikiye ayrılıyor: üstte arka plan işleyişi, GDS (rezervasyon yönetimi) sunucu rafları ve ağ simgesi; altta harici acente entegrasyonu, üç katman: biletleme, müşteri hizmetleri, muhasebe. Altta üç kutu. 1996: Sabre yöneticisi Terry Jones liderliğinde dünyanın ilk online rezervasyon sistemi Travelocity kuruldu, hemen ardından Microsoft Expedia'yı başlattı. Dolaylı kanal mimarisi: OTA'lar havayolu, otel ve araç kiralama hizmetlerini birleştirerek pazarda benzersiz bir şeffaflık yarattı. Çalışma prensibi: rezervasyon yönetimi için GDS altyapısı kullanılırken biletleme ve muhasebe harici olarak yönetilir.](/decks/tpf-to-metasearch/06.webp "Boru ikiye ayrılıyor: rezervasyon GDS'e, para ve müşteri hizmeti acenteye. OTA, GDS'i değiştirmedi; onun önüne bir vitrin koydu ve arkasına bir muhasebe.")

Mimari ders şu: OTA, GDS'in yerine geçmedi, GDS'in önüne geçti. Envanter
ve rezervasyon hâlâ GDS'te; OTA'nın kendi tarafında tuttuğu şey vitrin,
müşteri ilişkisi ve para. Bu bölümün sonundaki güç kayması tam bu
ayrımdan doğuyor: envanteri tutan değil, müşteriyi tutan kazanmaya
başladı.

## Priceline 1997: satıcıyı gizleyerek atıl kapasiteyi eriten model

Ters açık artırma dört adım. Kullanıcı kör bir parasal teklif girer,
garantili fiyat. Priceline gelen talepleri toplar. Talep, gizli havayolu
atıl envanteriyle eşleştirilir. Havayolu kimliği ve uçuş saati
açıklanmadan işlem tamamlanır. Priceline 1997'de Jay S. Walker tarafından
kuruldu ve "kendi fiyatını belirle" modeli patentlendi. Stratejik değer:
havayolu satılamayan kapasiteyi nakde çeviriyor. Kusursuz denge: marka
kimliği ve uçuş saati satın alma sonrasına kadar gizli tutularak normal
fiyatlandırma stratejisine, özellikle kurumsal seyahate, zarar verilmesi
engelleniyor.

![Başlık: Satıcıyı gizleyerek atıl kapasiteyi eriten model. Ortada dört dilimli daire, merkezde Kendi Fiyatını Belirle. Adım 1: kullanıcı kör bir parasal teklif girer (garantili fiyat), gözü bağlı kişi ve para simgesi. Adım 2: Priceline gelen talepleri toplar, veritabanına giren oklar. Adım 3: talep, gizli havayolu atıl envanteri ile eşleştirilir, koltuk planı simgesi. Adım 4: havayolu kimliği ve uçuş saati açıklanmadan işlem tamamlanır, maskeli yolcu ve onaylı kart simgesi. Sağda üç kutu. Priceline (1997): Jay S. Walker tarafından kurulan ve patentlenen kendi fiyatını belirle modeli. Stratejik değer: havayolları bu modeli kullanarak atıl (satılamayan) kapasiteyi nakde çevirir. Kusursuz denge: marka kimliği ve uçuş saati satın alma sonrasına kadar gizli tutularak normal fiyatlandırma stratejisine (kurumsal seyahatler) zarar verilmesi engellenir.](/decks/tpf-to-metasearch/07.webp "Birinci adımdaki göz bağı ile dördüncü adımdaki maske aynı kuralın iki yüzü. Alıcı satıcıyı görmüyor ki tam ücret ödeyen yolcu bu fiyatı görmesin.")

Eşleşme mantığı: alıcı, gitmek istediği yer için ödemeyi taahhüt ettiği
garantili bir fiyat sunar; sistem talebi havayollarına iletir; havayolu
elinde kalan fazla envanteri (surplus inventory) eritmek için kabul eder.
Belirsizlik dengesi: derin indirim karşılığında şeffaflıktan ödün verilir;
satın alma gerçekleşene kadar satıcının kimliği ve uçuş programı gizli.
Model, zaman hassasiyeti düşük ve fiyat hassasiyeti yüksek boş zaman
gezgini (leisure) segmentine odaklanıyor. Gelir yönetimi bölümlerindeki
kısıtlı indirim mantığının en uç hali: kısıt, bilginin kendisi.

## Orbitz 2001: havayollarının doğrudan bağlantı kurma girişimi

Orbitz 2001'de American, Continental, Delta, Northwest ve United'ın ortak
yatırımıyla kuruldu. Model: rezervasyonların bir kısmını Worldspan GDS
üzerinden değil, doğrudan havayolu CRS'ine yönlendiren düşük maliyetli
doğrudan bağlantı (direct link). Eleştiri Travelocity CEO'su Sam
Gilliland'dan: doğrudan bağlantı kursanız bile maliyetleri yalnızca bir
yerden alıp başka bir yere itiyorsunuz; sonuçta havayoluna ekonomik
faydası çok az olacak.

![Başlık: Havayollarının doğrudan bağlantı kurma girişimi. Solda OTA kutusu, sağda havayolu CRS kutusu. Üstte standart dağıtım: iki kutuyu birleştiren boru ortadaki GDS kutusundan geçiyor, üzerinde dolar işareti. Altta yeşil düz boru, Orbitz doğrudan bağlantı (direct link), GDS'i atlayarak iki kutuyu birleştiriyor, üzerinde dolar işareti. Sağda notlar. Orbitz (2001): American, Continental, Delta, Northwest ve United havayollarının ortak yatırımı. GDS'i devre dışı bırakmak: rezervasyonların bir kısmını Worldspan GDS üzerinden değil, doğrudan havayolu CRS'ine yönlendiren düşük maliyetli model. Eleştiri, Travelocity CEO'su Sam Gilliland: doğrudan bağlantı kursanız bile, maliyetleri sadece bir yerden alıp başka bir yere itiyorsunuz.](/decks/tpf-to-metasearch/08.webp "İki borunun ikisinde de dolar işareti var. Alttaki boru GDS'in ücretini kaldırıyor ama boruyu kurmanın ve işletmenin bedelini havayoluna taşıyor.")

Ekonomik mantık: doğrudan tedarikçi bağlantısıyla GDS maliyetinden
kaçınmak. Risk: maliyetin bir sistemden diğerine aktarılması (pushing
costs). İş kuralı, toplam dağıtım maliyetinde gerçek bir azalma olup
olmadığını sorgulamalı. Yazılımcı için bu, "aracıyı kaldırdık" cümlesinin
her zaman "maliyeti kaldırdık" demek olmadığının erken bir örneği;
aracının yaptığı iş bir yere gitmedi, sahibi değişti.

## İki büyük çekim merkezi pazarı konsolide ediyor

Sürekli birleşme ve satın almalar sonucunda dolaylı dağıtım pazarı bir
düopol haline geldi. Expedia Holdings: Travelocity (2013), Orbitz (2015),
Hotels.com, Hotwire, CheapTickets; TripAdvisor 2005-2011 arasında sahip
olundu, şimdi bağımsız. Booking Holdings: eski adıyla The Priceline Group
(2018), Booking.com. TripAdvisor gibi kullanıcı tarafından oluşturulan
içerik (UGC) platformları bağımsızlığını kazanırken işlem odaklı
platformlar tekelleşti.

![Başlık: İki büyük çekim merkezi pazarı konsolide ediyor. Solda merkezde Expedia Holdings, yörüngesinde Travelocity (2013), Orbitz (2015), Hotels.com, Hotwire, CheapTickets; kesikli okla dışarıda TripAdvisor (2005-2011 arası sahip olundu, şimdi bağımsız). Sağda merkezde Booking Holdings (eski adıyla The Priceline Group, 2018), yörüngesinde Booking.com. Altta iki not: sürekli birleşme ve satın almalar sonucunda dolaylı dağıtım pazarı bir düopol (iki oyunculu pazar) haline geldi; TripAdvisor gibi kullanıcı tarafından oluşturulan içerik (UGC) platformları bağımsızlığını kazanırken, işlem odaklı platformlar tekelleşti.](/decks/tpf-to-metasearch/09.webp "Bu bölümde adı geçen üç öncü, Travelocity, Orbitz ve Priceline, artık iki dairenin içinde. Öncü olmak hayatta kalmayı garanti etmedi; işlem hacmi etti.")

Bu bölümün önceki üç başlığındaki isimlerin hepsi bu iki dairede
toplandı: Travelocity ve Orbitz Expedia'nın içinde, Priceline Booking'in
adı. GDS tarafındaki Big 3 konsolidasyonu OTA tarafında Big 2 oldu.
Havayolu için sonuç aynı: kanal sayısı azaldıkça her kanalın pazarlık
gücü arttı.

## 2004: meta-arama motorları trafiğin en üstüne yerleşiyor

2004 ve sonrasında Kayak ve Skyscanner ile arama motoru mantığı seyahat
sektörüne uyarlandı. Derin bağlantı (deep linking): kullanıcıyı
rezervasyon için tedarikçi ya da OTA sitesine doğrudan yönlendiren yapı.
Risk ve gelir modeli: yönlendirme ücreti (referral fee) alınır ama
rezervasyon garantisi yoktur; müşteri siteye gittikten sonra satın almayı
terk edebilir. Taraflılık: motorlar genellikle yalnızca kendilerine
komisyon ödeyen sitelerin sonuçlarını arama eğiliminde.

![Başlık: Meta-arama motorları trafiğin en üstüne yerleşiyor. Üstte meta-arama motoru (Kayak / Skyscanner) kutusu; oradan mavi ve turuncu oklar aşağıya iki gruba iniyor: solda koyu kutular tedarikçi siteleri, sağda mavi kutular OTA'lar. Kalın turuncu ok derin bağlantı (deep link) etiketiyle sağ alta, uyarı işaretli kullanıcı simgesine gidiyor: sepeti terk etme (abandonment) riski. Sağda dört kutu. 2004 ve sonrası: Kayak ve Skyscanner ile arama motoru mantığı seyahat sektörüne uyarlandı. Derin bağlantı (deep linking): kullanıcıyı rezervasyon için tedarikçi veya OTA sitesine doğrudan yönlendiren yapı. Risk ve gelir modeli: yönlendirme ücreti (referral fee) alınır, ancak rezervasyon garantisi yoktur, müşteri siteye gittikten sonra satın almayı terk edebilir. Taraflılık: motorlar genellikle sadece kendilerine komisyon ödeyen sitelerin sonuçlarını arama eğilimindedir.](/decks/tpf-to-metasearch/10.webp "Turuncu ok satışı değil, yolcuyu taşıyor. Meta-arama koltuk satmıyor; dikkat satıyor ve dikkatin sepete dönüşmesi başkasının sorunu.")

GDS üyesi olmayan havayolu nasıl dahil oluyor? Meta-arama motoru,
havayolunun kendi web sitesinden (supplier site) doğrudan veri çekerek en
düşük ücreti belirleyebiliyor. Bu, havayolunun GDS'e katılma
zorunluluğunu ortadan kaldırıyor; karşılığında meta-arama sitesine
yönlendirme ücreti ödeniyor. Soldaki koyu kutular tam bu: GDS'te olmayan
ama meta-aramada görünen havayolları. Önceki bölümlerdeki "her havayolu
GDS'te kalır" kuralının ilk gerçek istisnası.

## 2010: arama devinin sektörü yeniden şekillendiren altyapısı

Google Flights iki kaynaktan besleniyor: canlı sonuçlar (ITA Software
QPX) ve önbellek (cache) sonuçları. Çıktı, fiyat ve kolaylık eksenlerinde
sıralanıyor. ITA Software 2010'da Google tarafından satın alındı; QPX
doğrudan havayolu sitelerine de güç veren alışveriş motoru. Oyunun
kurallarını değiştiren hamle: Google, hem havayollarına hem OTA'lara
yönlendirmeleri ücretsiz sunmaya başladı. Stratejik hedef: yönlendirme
geliri modelini yıkarak rakipleri zayıflatmak, kaybı yeni reklam
formatlarıyla telafi etmek ve kullanıcıya en alakalı uçuşu sunmak.

![Başlık: Arama devinin sektörü yeniden şekillendiren altyapısı. Solda iki giriş: canlı sonuçlar (ITA Software QPX) ve önbellek (cache) sonuçları; ikisi de ortadaki katmanlı Google Flights kutusuna akıyor; sağda çıktı, fiyat (price) ve kolaylık (convenience) eksenli bir grafik. Altta üç kutu. ITA Software (2010): Google tarafından satın alınan ve doğrudan havayolu sitelerine güç veren QPX alışveriş motoru. Oyunun kurallarını değiştiren hamle: Google, hem havayollarına hem de OTA'lara yönlendirmeleri (referrals) ücretsiz sunmaya başladı. Stratejik hedef: yönlendirme geliri modelini yıkarak rakipleri zayıflatmak, kaybı yeni reklam formatlarıyla telafi etmek ve kullanıcıya en alakalı uçuşu sunmak.](/decks/tpf-to-metasearch/11.webp "İki giriş, tek çıkış: canlı ile önbellek karışıyor ve kullanıcı hangisine baktığını bilmiyor. Sağdaki grafiğin ekseninde komisyon yok; sıralamayı fiyat ve kolaylık belirliyor, geliri reklam.")

Sıralama algoritması sorusu: sıralama kullanıcı için alaka düzeyine
(relevance) göre yapılıyor; ağırlıklı kriterler bilet fiyatı ve uçuşun
kolaylığı. Veri, canlı ve önbelleğe alınmış sonuçların birleşimi. Kaynak
metnin ifadesiyle Google'ın gerekçesi, uçuşları fiyat ve kolaylık gibi
faktörlerle kullanıcıyla alaka düzeyine göre sıralamak. Ücretsiz referral
sorusu: Google'ın yönlendirme ücretini kaldırması, bu gelire bağımlı diğer
meta-arama oyuncularını zorluyor; gelir kaybı yeni reklam formatları ve
tedarikçiye yönelik tanıtım seçenekleriyle dengeleniyor. Kaynak metindeki
uyarı sert: bu aracılar (Google, Amazon, Kayak) kullanıcı için pahalı;
şartlarını ve ücretlerini kabul etmeyen işletmenin pazarda yer almasına
artık izin verilmiyor.

## Kontrolün envanterden dikkat ekonomisine kayışı

Güç kayması üç durak. 1980'ler, envanter kontrolü: havayolları ve
GDS'ler, TPF altyapısıyla pazarın tek hâkimi. 2000'ler, işlem kontrolü:
OTA'lar, şeffaflık ve dolaylı dağıtımla tüketiciyi yakalama. 2020'ler,
dikkat kontrolü: Google ve meta-arama, arama hunisinin en üstünü ele
geçirerek trafiği yönlendirme. Slaydın kapanışı: maliyeti düşürmek ve
modern mimariye geçmek, havayolunun dijital perakendecilik savaşında
hayatta kalması için yalnızca bir başlangıç.

![Başlık: Kontrolün envanterden dikkat ekonomisine kayışı. Üstte bant: güç kayması (the power shift). Üç panel birbirine kablolarla bağlı. Koyu gri panel, sunucu simgesi, 1980'ler envanter kontrolü: havayolları ve GDS'ler, TPF altyapısı ile pazarın tek hâkimi. Turuncu panel, alışveriş sepeti simgesi, 2000'ler işlem kontrolü: OTA'lar, şeffaflık ve dolaylı dağıtım ile tüketiciyi yakalama. Mavi panel, arama kutusu simgesi, 2020'ler dikkat kontrolü: Google ve meta-arama, arama hunisinin en üstünü ele geçirerek trafiği yönlendirme. Altta: maliyetleri düşürmek ve modern mimariye geçmek, havayollarının dijital perakendecilik savaşında hayatta kalması için sadece bir başlangıçtır; dağıtım mimarisi artık kodu kimin yazdığıyla değil, müşterinin arama anını kimin yönettiğiyle ilgilidir.](/decks/tpf-to-metasearch/12.webp "Üç panelin simgeleri sıralamayı anlatıyor: sunucu, sepet, arama kutusu. Her on yılda kontrol bir katman yukarı, müşteriye bir adım daha yakına çıktı.")

Bu bölümün iki yarısı burada birleşiyor. İlk yarı TPF'den açık sisteme
geçişin zorunluluğunu anlattı; ikinci yarı o geçiş sürerken kontrolün
havayolunun elinden çıkıp önce OTA'ya, sonra arama motoruna geçtiğini.
Sonuç slaydın cümlesi: mimariyi modernleştirmek şart ama yeterli değil.
Envanteri en iyi sistemle tutan değil, müşterinin arama anını yöneten
kazanıyor.

## Yarın işe yarayacak dört çıkarım

1. **Açık sisteme geçişi insan kaynağı takvimine göre planla, donanım
   takvimine değil.** TPF kodu çalışıyor; okuyacak kişi azalıyor. Geçiş
   yalnızca donanım tasarrufu değil, modern geliştirme pratiklerine ve
   geniş yetenek havuzuna erişim. Sıra bağımlılık haritasından: PNR en sona.
2. **Ters açık artırmayı fiyat hassasiyeti yüksek segmentle sınırla.**
   Fazla envanteri eritmek için model hâlâ geçerli ama marka kimliğini ve
   uçuş saatini satın alma sonrasına kadar gizle; yoksa kurumsal
   yolcunun ödediği tam ücreti kendin kırarsın.
3. **Reklam maliyetini stratejik kalem olarak yönet.** Google ve benzeri
   aracıların pazar hâkimiyeti karşısında ücretsiz referral modelinden
   yararlan ama doğrudan kanal sadakatini paralel güçlendir; aracının
   şartı değişince görünürlüğün de değişir.
4. **Canlı veri ile önbellek arasındaki dengeyi sepet terk oranıyla ölç.**
   Meta-aramada görünen fiyat siteye gelince değişirse müşteri terk eder.
   Önbelleğin tazeliği bir performans ayarı değil, dönüşüm oranının
   doğrudan girdisi.

Bu bölümde ne yok: Google'ın satın aldığı QPX'in içindeki arama
algoritmalarının nasıl çalıştığı (önceki bölümdeki VTCR ve ESV) ve
havayolunun bu aracılara karşı kendi doğrudan kanalını NDC ile nasıl
kurmaya çalıştığı ("NDC: dağıtımı kim kontrol ediyor"). Bu bölümdeki güç
kaymasının cevabı o bölümün konusu.
