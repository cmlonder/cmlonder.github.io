---
title: "Havacılık rezervasyon ve küresel dağıtım sistemleri (GDS) analizi: stratejik gelişim ve iş mantığı"
domain: "aviation"
summary: "Havayolunun kendi rezervasyon sistemi acente ekranına dönüşünce haksız avantaj üretti; 1984'te devlet dört kuralla müdahale etti ve veri bir ürün oldu. Bu bölüm, MAARS Plus'ın neden battığını, acente kanalının parasının nasıl döndüğünü, MIDT ve BIDT'nin ne işe yaradığını ve dört sistemin nasıl üç deve dönüştüğünü anlatıyor."
audience: "GDS'i 'acentenin kullandığı eski sistem' sanan yazılımcı ve ürün insanı; özellikle bugün NDC entegrasyonu yazan ekipler. Önceki bölüm okunmuş olmalı; override, MIDT, BIDT ve churning metnin içinde tanımlanıyor."
pubDate: 2026-09-21
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölüm tarafsız sistemin beş kez ölmesiyle ve JICRS çökünce
Apollo, Sabre ve PARS silolarının yükselmesiyle bitmişti. Bu bölüm o
siloların sonrasını anlatıyor. **Havayolunun kendi envanter sistemine
acente ekranı eklemesi, sahibine haksız rekabet avantajı verdi;** 1984'te
Federal Düzenlemeler Kodu (CFR) buna dört kuralla son verdi ve bu kurallar
yalnızca ekranı değil, veriyi ve ücretlendirmeyi de yeniden tanımladı.
Sonra sektör dört sistemi üç deve indirdi ve GDS bir rezervasyon aracı
olmaktan çıkıp pazar yerine dönüştü.

![Sunumun kapak slaytı. Noktalı dünya haritası üzerinde kıtaları birbirine bağlayan açık mavi hatlar. Başlık: Havayolu Dağıtım Sistemlerinin Evrimi. Alt başlık: özel CRS'lerden küresel GDS pazaryerlerine geçiş ve rekabetin yeniden şekillenmesi. Sağ altta konuşmacı notu: bu sunum havayolu dağıtım alanındaki temel kaymayı kapsıyor, havayoluna ait doğrudan sistemlerden (host CRS) GDS'lerin topladığı dolaylı acente kanalına giden yol; ana akışlar AirShopping (acentelerin uçuşu nasıl bulduğu) ve offer management (havayolunun tarife ve fiyatı nasıl dağıttığı).](/decks/crs-to-gds/01.webp "Haritadaki hatlar havayolu rotası değil, veri hattı. Bu bölümde uçak değil, uçuşun bilgisi seyahat ediyor.")

## MAARS Plus: bağımsız olmak yetmedi

1970'lerde havayoluna özel (proprietary) rezervasyon sistemleri sahibi
olan havayoluna haksız avantaj sağlıyordu. İlk tarafsız girişim 1977'de
ITT'nin başlattığı MAARS Plus'tı: havayollarına da acentelere de ait
olmayan bir sistem. Çözümü, katılımcı bütün havayollarının rezervasyon
sistemlerine doğrudan bağlantı sunmak ve rezervasyonu havayolunun kendi
sisteminde saklamaktı. İki nedenle battı. Teknik uyumsuzluk: ortak bir
sistem dili yoktu, acenteler her havayolunun kendi kodlarını anlamakta
zorlandı. Kusurlu gelir modeli: yatırımcılar abonelik ücretini
acentelerden tahsil edemedi.

![Başlık: Erken Dönem Arayışları ve MAARS Plus Vakası. Üstte not: 1970'lerde havayoluna özel (proprietary) rezervasyon sistemleri sahibi olan havayollarına haksız rekabet avantajı sağlıyordu. Solda ortada bir sunucu kutusu, MAARS Plus (1977, ITT), etrafında AC 1'den AC 5'e beş uçak simgesine çift yönlü oklar; altında MAARS Plus çözümü: katılımcı tüm havayollarının rezervasyon sistemlerine doğrudan bağlantı sunan ve rezervasyonları havayolunun kendi sisteminde saklayan ilk bağımsız girişim. Sağda turuncu çerçeveli iki kutu. 1. Teknik uyumsuzluk: ortak bir sistem dilinin olmaması, seyahat acenteleri her havayolunun kendi sistemine ait farklı kodları anlamakta zorlandı. 2. Kusurlu gelir modeli: yatırımcılar sistem abonelik ücretlerini seyahat acentelerinden tahsil edemedi. Altta not: alan terimleri CRS, direct connect; ortak dilin yokluğu EDIFACT ya da teletype (TTY) öncesi standartlaşmamış havayolu mesajlaşma dönemini işaret ediyor; MAARS'ın rezervasyonu havayolu sisteminde saklaması erken bir dış order management örneği.](/decks/crs-to-gds/02.webp "Ortadaki kutu beş havayoluna bağlanıyor ama beşiyle beş ayrı dil konuşuyor. Bağlantı vardı, çeviri yoktu.")

Slaytın notu iki şeyi işaretliyor. Ortak dilin yokluğu, EDIFACT ya da
teletype öncesi dönemin sorunu: mesaj standardı yoktu, her havayolunun
kodu ayrıydı. Ve MAARS'ın rezervasyonu kendi tarafında değil havayolunun
sisteminde saklaması, bugün "dış order management" dediğimiz düzenin erken
bir örneği. Yani mimari doğruydu; öldüren şey standart eksikliği ve
faturayı kimin ödeyeceğinin çözülememesiydi. Birlikte çalışabilirlik
sorununun cevabı ortak dil ve standart kod yapısıdır; bu olmadan acente
sistemi anlayamıyor ve sistem batıyor.

## Acente kanalının ekonomisi: sıfır giriş, hacim taahhüdü, %10, override

Havayolunun CRS'i acenteyi nasıl bağladı, para nasıl döndü? Dört adım.
Sıfır giriş maliyeti: CRS'ler acentelere donanımı ve eğitimi ücretsiz
verdi. Hacim taahhüdü: acente, yaptığı rezervasyon hacmine dayalı bir
abonelik ücreti ödemeyi kabul etti. Standart komisyon: acente masrafını
havayollarından aldığı yaklaşık %10 standart komisyonla dengeledi.
Teşvikler (override): KPI eşikleri aşıldığında belirli havayollarını
tercih etmesi için acenteye ek komisyon ödendi.

![Başlık: Acente Kanalının Ekonomisi. Ortada üç düğümlü dairesel akış: havayolu/CRS, seyahat acentesi, yolcu; ortada financial ecosystem flowchart. Sağda dört adım. Adım 1, sıfır giriş maliyeti: CRS'ler acentelere ücretsiz donanım ve eğitim sağladı. Adım 2, hacim taahhüdü: acenteler yapılan rezervasyon hacmine dayalı abonelik ödemeyi kabul etti. Adım 3, standart komisyon: acenteler masraflarını havayollarından aldıkları yaklaşık %10 standart komisyon ile dengeledi. Adım 4, teşvikler (overrides): KPI'lara ulaşıldığında belirli havayollarını tercih etmeleri için ek komisyonlar ödendi. Altta arka ofis kutusu: artan rekabetle birlikte komisyon takibi ve acente satış raporları (ASR) için American Airlines'ın ADS'yi satın alması gibi arka ofis sistemlerine büyük yatırımlar yapıldı. Solda not: %10 standart komisyon artı override'lar doğası gereği taraflı bir satış ortamı yarattı; alan terimleri override, ASR; modern BSP ve ARC operasyonlarıyla ilgili.](/decks/crs-to-gds/03.webp "Dördüncü adım döngünün dışında, kesik çizgiyle. Standart komisyon herkese eşit; override, acentenin hangi havayolunu satacağını fiyatlayan gizli parametre.")

Bu model iki iş kuralı üretiyor. Gelir modeli: donanım ve eğitim bedava,
karşılığında hacme dayalı abone ücreti; acente bunu %10 komisyonla
dengeler. Yönlendirme: KPI eşiği aşılınca override tanımlanır ve acente
belirli havayoluna teşvik edilir. Slaytın notu sonucu açık yazıyor:
standart komisyon artı override, doğası gereği taraflı bir satış ortamı
yarattı. Bu taraflılık yalnızca ekranda değil, acentenin cüzdanında da
vardı. Takip edebilmek için arka ofis gerekti: komisyon takibi ve acente
satış raporları (ASR) için American, ADS'yi satın aldı. Bugünkü BSP ve ARC
operasyonlarının kökü bu arka ofis.

## 1984: devlet oyunu dört kuralla değiştirdi

Baskın CRS'lerin haksız avantajını engellemek için 1984'te yürürlüğe giren
CFR dört kural getirdi. Ekran ayrımcılığına son: eski durumda taşıyıcı
tercihli sıralama vardı, United Apollo kendi uçuşlarını daima ilk sıraya
koyuyordu; yeni kuralda sonuçlar acentenin sorgu parametrelerine en uygun
şekilde, tarafsız listelenmek zorunda. Evrensel kapasite: CRS içinde
belirli bir havayolu için geliştirilen özellik, katılımcı tüm havayolları
için erişilebilir olmalı. GDS ayrımcılığı yasağı: kendi CRS'ine sahip bir
havayolu, acentelere satılan rakip CRS'lere de katılmak zorunda; boykot
yasak. Adil ücretlendirme: eski durumda bazı havayolları hiç segment
ücreti ödemezken diğerlerinden fahiş ücret alınıyordu; yeni kuralda CRS'in
tüm katılımcılardan aldığı rezervasyon ücreti eşit ve ayrımcı olmayan
olmalı.

![Başlık: Oyunun Kuralları Değişiyor, 1984 CAB/CFR Regülasyonları. Alt başlık: baskın CRS'lerin haksız avantajlarını engellemek için getirilen dört ana kural. Dört sütun, her birinde eski durum ve yeni kural. 1. Ekran ayrımcılığına son. Eski: taşıyıcı tercihli sıralama (örneğin United Apollo'nun kendi uçuşlarını daima ilk sıraya koyması). Yeni: sonuçlar acentenin sorgu parametrelerine en uygun şekilde, tarafsız listelenmek zorundadır. 2. Evrensel kapasite. Yeni: CRS içinde belirli bir havayolu için geliştirilen bir özellik, katılımcı tüm havayolları için erişilebilir olmalıdır. 3. GDS ayrımcılığı yasağı. Yeni: kendi CRS'ine sahip bir havayolu, seyahat acentelerine satılan rakip CRS'lere de katılmak zorundadır (boykot yasağı). 4. Adil ücretlendirme. Eski: bazı havayolları hiç segment ücreti ödemezken diğerlerinden fahiş ücretler alınıyordu. Yeni: CRS'lerin tüm katılımcı taşıyıcılardan aldığı rezervasyon ücretleri eşit ve ayrımcı olmamak zorundadır. Altta not: ekranlarda taşıyıcı tercihi doğrudan uygunluk sıralama algoritmalarıyla ilgilidir; regülasyon, uçuş süresi ve zaman sapmasına dayalı tarafsız ekran algoritmalarının yaratılmasını zorladı; terimler availability display, segment booking fees.](/decks/crs-to-gds/04.webp "Dört kuraldan yalnızca birincisi ekranla ilgili. Diğer üçü sistemin özelliklerini, katılımını ve fiyatını düzenliyor; devlet bir algoritmayı değil, bir platformu regüle etti.")

Yazılım tarafındaki karşılığı notta: taşıyıcı tercihi doğrudan uygunluk
sıralama algoritmasının bir parametresiydi ve regülasyon, önceki bölümde
gördüğümüz o parametreyi yasaklayarak uçuş süresi ve zaman sapmasına
dayalı tarafsız ekran algoritmalarını zorunlu kıldı. Kural 1.1 böylece
şu hale geldi: sorguyu en iyi karşılayan uçuş ilk sırada, rakibinki bile
olsa. Kural 1.2: bir havayolu için geliştirilen her sistem yeteneği
katılımcı hepsine evrensel olarak açık.

## Veri ürün oldu: MIDT pazar için, BIDT fatura için

1984 düzenlemeleri rekabeti eşitlemekle kalmadı, verinin kendisini bir
ürüne dönüştürdü. MIDT (Marketing Information Data Tapes): CRS'in
topladığı küresel seyahat acentesi rezervasyon verisi; belirli bir ücret
karşılığında rakip CRS'lere ve havayollarına açık hale getirilmek zorunda.
BIDT (Billing Information Data Tapes): havayollarına kesilen rezervasyon
ücreti faturalandırma verisi; eskiden mikrofişle şeffaf olmayan biçimde
sunulan bu veri elektronik ortamda zorunlu olarak sağlanmaya başlandı.

![Başlık: Sistemlerden Stratejiye, Havacılık Verisinin Ticarileşmesi. Alt başlık: 1984 düzenlemeleri rekabeti eşitlemekle kalmadı, verinin kendisini bir ürüne dönüştürdü. Ortada merkezi CRS veritabanı silindiri, iki yana açık mavi veri hatları. Solda MIDT (pazar verisi): açılımı Marketing Information Data Tapes; içerik, CRS tarafından toplanan küresel seyahat acentesi rezervasyon verileri; etki, belirli bir ücret karşılığında rakip CRS'lere ve havayollarına açık hale getirilmek zorundadır. Sağda BIDT (finansal veri): açılımı Billing Information Data Tapes; içerik, havayollarına kesilen rezervasyon ücreti faturalandırma verileri; etki, eskiden mikrofiş ile şeffaf olmayan şekilde sunulan bu veriler elektronik ortamda zorunlu olarak sağlanmaya başlandı. Altta not: MIDT modern gelir yönetimi ve ağ planlaması için kritik bir araç, rakiplerin acente kanalından ne sattığını gösterir; BIDT mutabakat için kritik, GDS faturalarını pasif, mükerrer ya da iptal edilmiş PNR segmentlerine (churning) karşı denetlemekte kullanılır.](/decks/crs-to-gds/05.webp "Aynı veritabanından iki bant çıkıyor: sol taraf rakibin ne sattığını, sağ taraf senin ne ödediğini söylüyor. İkisi de 1984'ten önce sahibinin tekelindeydi.")

Notun "gizli bilgi" dediği kısım bugün de geçerli. MIDT gelir yönetimi
ve ağ planlaması için kritik: rakiplerin acente kanalından ne sattığını
gösteriyor. Önceki bölümdeki cüzdan payı körlüğünün acente kanalı için
kısmi ilacı bu. BIDT mutabakat için kritik: GDS faturasını pasif, mükerrer
ya da iptal edilmiş PNR segmentlerine karşı denetlemekte kullanılıyor; bu
kalıplara churning deniyor. Havayolu hangi segment için ne ödediğini
görebilmeli; BIDT bu görünürlüğün formatı.

## Büyük konsolidasyon: dört sistemden üç deve

1980'lerin bireysel host CRS'leri 2000'lerde üç küresel sisteme indi.
Amadeus (1987): Air France, Lufthansa, Iberia ve SAS ortaklığı; altyapı
System One rezervasyon motoru artı Air France fiyatlandırma motoru.
Worldspan (1990): PARS (TWA/Northwest) ve DATAS II (Delta) birleşmesi.
Galileo (1993): United'ın Apollo sistemi tabanlı, 11 Kuzey Amerika ve
Avrupa havayolunun ortaklığı. Sabre (1996): American Airlines (AMR Corp)
bünyesinden kısmen ayrılarak bağımsızlaştı. Travelport (2001-2007):
Galileo ve Orbitz'in alımı, ardından 2007'de Worldspan ile birleşerek tek
çatı.

![Başlık: Büyük Konsolidasyon Dalgası. Alt başlık: bireysel host CRS'lerden dev küresel sistemlere geçiş. Soldan 1980'ler, sağa 2000'ler akan lacivert hatlar. Amadeus (1987): Air France, Lufthansa, Iberia, SAS ortaklığı; altyapı System One rezervasyon motoru artı Air France fiyatlandırma motoru. Worldspan (1990): PARS (TWA/Northwest) ve DATAS II'nin (Delta) birleşmesi. Galileo (1993): United'ın Apollo sistemi tabanlı 11 Kuzey Amerika ve Avrupa havayolunun ortaklığı. Sabre (1996): American Airlines (AMR Corp) bünyesinden kısmen ayrılarak bağımsızlaştı. Sağda Travelport (2001-2007): Galileo ve Orbitz'in alımı, ardından 2007'de Worldspan ile birleşerek tek çatı olması. Altta not: Amadeus, yüksek hacimli gerçek zamanlı işlem için özelleşmiş bir IBM işletim sistemi olan TPF üzerinde çalışıyordu; host CRS'ten (havayolu envanterinin yaşadığı yer) GDS'e (acente satış noktası) kayış; havayolları bugün hâlâ GDS'e bağlanmak için PSS kullanıyor.](/decks/crs-to-gds/06.webp "Sabre'nin hattı hiçbir yere birleşmiyor; tek başına devam ediyor. Diğer üç hat Travelport'a akıyor. 1996'da havayolundan ayrılan sistem, 2007'de tek ayakta kalan bağımsızdı.")

| Bugünkü GDS | Köken ve birleşen sistemler |
|---|---|
| Sabre | American Airlines kökenli, STARS otomasyonuyla gelişti |
| Amadeus | Air France, Lufthansa, Iberia, SAS ortaklığı; System One temeli |
| Travelport | Galileo, Apollo, Worldspan ve Orbitz'in birleşimi |
| Worldspan (eski) | PARS ve DATAS II birleşimi; sonra Travelport'a katıldı |

Notun iki teknik hatırlatması: Amadeus, yüksek hacimli gerçek zamanlı
işlem için özelleşmiş bir IBM işletim sistemi olan TPF üzerinde
çalışıyordu; ve host CRS'ten GDS'e kayış, havayolu envanterinin yaşadığı
yer ile acentenin satış noktasının ayrılması demek. Havayolu bugün hâlâ
GDS'e bağlanmak için PSS kullanıyor. "SABRE'den PSS'e" bölümündeki
mimari, buradaki ayrımın havayolu tarafındaki ucu.

## GDS bugün bir pazar yeri: on binlerce tedarikçi, üç aracı

GDS'ler kapalı envanter sistemlerinden evrilerek küresel alıcıları on
binlerce tedarikçiye bağlayan B2B pazar yerlerine dönüştü. Tedarikçi
tarafı havayolları, oteller, araç kiralama, demiryolu ve kruvaziyer.
Ortada Big 3: Amadeus, Sabre, Travelport. Alıcı tarafı geleneksel seyahat
acenteleri, OTA'lar, konsolidatörler ve toptancılar. Kaynak metnin
tanımıyla GDS, alıcıları tedarikçilere bağlayan bir pazar yeridir.

![Başlık: Günümüzün GDS Pazaryeri. Solda tedarikçiler / içerik sağlayıcılar: havayolları, oteller, araç kiralama şirketleri, demiryolu ve kruvaziyer. Ortada küp şeklinde GDS (toplayıcı / aracı), altında Big 3 GDS: Amadeus, Sabre, Travelport. Sağda alıcı kanalları: geleneksel seyahat acenteleri, OTA (çevrimiçi seyahat acenteleri), konsolidatörler ve toptancılar. Altta: GDS'ler kapalı envanter sistemlerinden evrilerek küresel alıcıları on binlerce tedarikçiye bağlayan devasa B2B pazaryerlerine dönüşmüştür. Sağ üstte not: dağıtım ve aracı satış akışı; Big 3 dolaylı dağıtıma hâkim, toplayıcı olarak tarihlerini anlamak bugün NDC (New Distribution Capability) API'leri yazan mühendisler için kritik, NDC teklif oluşturmayı modern XML/JSON standartlarıyla havayoluna geri getirmeyi amaçlıyor.](/decks/crs-to-gds/07.webp "Soldaki beş tedarikçi türü ile sağdaki üç alıcı türü ortadaki tek küpten geçiyor. Bu bölümün başındaki 'havayolunun kendi sistemi' artık o küpün içindeki bir içerik satırı.")

Çoklu havayolu envanterini tek sistemde barındırmanın mantığı bu: GDS bir
toplayıcı olarak konumlanır, yalnızca havayollarını değil oteli, aracı ve
treni de aynı havuzda birleştirip acenteyle buluşturur. Notun uyarısı bu
bölümün yazılma sebebi: Big 3 dolaylı dağıtıma hâkim ve NDC API'si yazan
bir mühendis, bu üç aracının nasıl doğduğunu bilmeden NDC'nin neyi geri
almaya çalıştığını anlayamaz. NDC, teklif oluşturmayı XML/JSON
standartlarıyla havayoluna geri getirmeyi amaçlıyor; yani 1984'ün ve
2007'nin kurduğu düzeni tersine çevirmeyi.

## Yarın işe yarayacak dört çıkarım

1. **Standart dil bir özellik değil, hayatta kalma şartı.** MAARS Plus
   doğru mimariyle battı çünkü beş havayolu beş dil konuşuyordu. Yeni
   nesil dağıtımda standart veri formatı ve kod yapısı olmadan acente
   karmaşası sistemi öldürür.
2. **Veri erişimi iş modelinin parçası olmalı.** MIDT pazar payı analizi,
   BIDT maliyet kontrolü için kritik. Rakibin ne sattığını ve senin ne
   ödediğini gösteren bantlar, 1984'ten beri ücret karşılığı erişilebilir;
   bunları kullanmayan havayolu kör uçuyor.
3. **Sabit ücret değil, hacim ve KPI bazlı teşvik.** Acente kanalında
   rezervasyon hacmine ve eşiklere dayalı dinamik model kullanımı artırdı.
   Ama override'ın taraflı satış ortamı yarattığını unutmadan: teşvik
   parametresi, ekran parametresi kadar görünür olmalı.
4. **Rezervasyon sistemi arka ofisle konuşmalı.** Acentenin satış
   raporunu (ASR) ve komisyonunu takip edebilmesi için güçlü arka ofis
   entegrasyonu şart. American'ın ADS'yi satın alması bir lüks değil,
   komisyon karmaşasının zorunlu sonucuydu.

Bu bölümde ne yok: NDC'nin 1984 düzenini nasıl tersine çevirmeye
çalıştığı ve bunun neden teknik değil ticari bir kavga olduğu ("NDC:
dağıtımı kim kontrol ediyor") ve GDS'lerin hâlâ konuştuğu mesaj formatı
("Sektör hâlâ EDIFACT konuşuyor"). MAARS Plus'ın ortak dil sorunu o
formatın doğum sebebi.
