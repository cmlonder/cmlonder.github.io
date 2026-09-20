---
title: "GDS ve havacılık dağıtım ekosistemi: stratejik analiz ve iş mantığı rehberi"
domain: "aviation"
summary: "GDS'in müşterisi havayolu değil; TMC, OTA, tatil acentesi ve teknoloji sağlayıcısı. 1994'te bilet veritabanı satırına dönüştü, 2004'te DOT kuralları kaldırdı, OTA'lar rezervasyonsuz bin sonuç isteyince mainframe çöktü ve arama motoru açık sistemlere taşındı. Bu bölüm o üç kırılmayı ve look-to-book oranının 10:1'den 10.000:1'e sıçramasını anlatıyor."
audience: "GDS API'sine bağlanan ya da bir uçuş arama motoru yazan yazılımcı ve ürün insanı. Önceki iki bölüm okunmuş olmalı; VTCR, ESV, stateless shopping ve look-to-book metnin içinde tanımlanıyor."
pubDate: 2026-09-21
topics: [solution-architecture, scale-and-performance]
ai: generated
---

Önceki iki bölüm GDS'i havayolu tarafından anlattı: nasıl doğdu, kim
regüle etti, altında hangi tesisat var. Bu bölüm öbür taraftan bakıyor.
**GDS'in asıl müşterisi havayolu değil, içeriği satın alan dört küme;** ve
o kümelerin en yenisi olan OTA'lar, 1996'dan sonra sistemi çökertecek bir
talep getirdi: rezervasyon yapmadan bin sonuç. Bu talep, 1994'teki e-bilet
ve 2004'teki DOT serbestleşmesiyle birleşince, 1980'lerin yeşil ekranlı
B2B terminali bugünkü yüksek hızlı B2C arama motoruna dönüştü.

![Sunumun kapak slaytı. Solda başlık: Küresel Dağıtım Sistemleri ve Dijital Hava Sahasının Evrimi. Alt başlık: havacılık ağında aktörler, regülasyonlar ve uçuş arama teknolojilerinin dönüşümü. Sağda havalimanı apron ve taksi yollarının izometrik teknik çizimi, park halinde uçaklar ve turuncu düğümler. Altta uzman notları: bu sunum havacılık dağıtım ekosisteminin evrimini haritalandırır; legacy PSS ve yeşil ekranlardan modern offer/order management ve yüksek hacimli REST API çağına geçiş incelenmektedir; regüle edilmiş bir B2B terminal ağının küresel seyahati yönlendiren yüksek hızlı B2C uçuş arama (AirShopping) motoruna nasıl dönüştüğünü teknik bakış açısıyla ele alır.](/decks/gds-ecosystem/01.webp "Notun son cümlesi bölümün tezi: B2B terminalden B2C arama motoruna. Aradaki fark ekranın rengi değil, saniyedeki sorgu sayısı.")

## GDS'in müşterisi havayolu değil, dört küme

GDS içerik tedarikinin ana omurgası; etrafında dört küme var. TMC
(kurumsal seyahat şirketleri): hizmet, fiyat ve raporlama odaklı B2B
akışlar; AmEx GBT, CWT, BCD Travel. OTA (çevrimiçi seyahat acenteleri):
bireysel yolcu için self-servis uçuş arama, REST ve SOAP API'ler
üzerinden bağlanır; Booking, Expedia, Hopper. Tatil acenteleri: uçtan uca
seyahat tasarımı; dnata, Flight Centre. Teknoloji sağlayıcıları: doğrudan
ya da dolaylı içerik tüketicileri; Google Flights, Farecompare. Sektörel
uyum ve standartlar CASMA konferanslarında belirleniyor.

![Başlık: GDS Ekosistemi, İçerik Tedariki ve İşbirliği Ağları. Ortada altıgen merkez düğüm, GDS (içerik tedarikinin ana omurgası); dört köşeye oklar. Küme 1, TMC (kurumsal seyahat şirketleri): hizmet, fiyat ve raporlama odaklı B2B akışlar; örnek AmEx GBT, CWT, BCD Travel. Küme 2, OTA (çevrimiçi seyahat acenteleri): bireysel yolcular için self-servis uçuş arama, REST ve SOAP API'ler üzerinden bağlanır; örnek Booking, Expedia, Hopper. Küme 3, tatil acenteleri: uçtan uca seyahat tasarımı; örnek dnata, Flight Centre. Küme 4, teknoloji sağlayıcıları: doğrudan/dolaylı içerik tüketicileri; örnek Google Flights, Farecompare. Altta ağ katmanı notu: sektörel uyum ve standartlar CASMA konferanslarında belirlenir. Sağda uzman notları: ilgili akışlar distribution, inventory, PNR oluşturma; teknik kırılım, SOAP'tan REST/JSON API'lere geçiş muazzam bir mimari sıçramadır, eski SOAP API'ler (XML içinde EDIFACT) ağır ve durum bağımlıydı (stateful), REST/JSON ise OTA'ların oturumu açık tutmadan devasa paralel arama taleplerini karşılayan mobil uyumlu uygulamalar oluşturmasını sağladı.](/decks/gds-ecosystem/02.webp "Dört kümeden yalnızca ikisi düz okla bağlı: OTA ve tatil acentesi. Diğer ikisi kesikli çizgi; TMC ve teknoloji sağlayıcısı GDS'e bağlı ama onun etrafından dolaşan yolları da var.")

İki karar bu slayttan çıkıyor. Kurumsal içerik tedariki: kurum, seyahat
içeriğini doğrudan tedarikçiden mi yoksa TMC üzerinden mi alacak? Karar
ölçeğe ve operasyonel ihtiyaca bağlı. Büyük Fortune 500 şirketleri
teknoloji, hizmet kalitesi ve raporlama avantajı için TMC'yi tercih
ediyor; istisnai durumlarda doğrudan tedarikçi sözleşmesiyle maliyet
kontrolü sağlıyor. API seçimi: OTA ya da mobil uygulama geliştiricisi GDS
verisine hangi protokolle erişmeli? Kriter platform ve veri işleme hızı.
Notun dediği gibi eski SOAP API'ler XML içinde EDIFACT taşıyordu, ağır ve
durum bağımlıydı; REST/JSON, oturum açık tutmadan devasa paralel arama
taleplerini karşılayan mobil uygulamaları mümkün kıldı. Eski sistemle
entegrasyon gereken yerde SOAP sürer, yeni mobil uygulamada REST seçilir.

## Devlet gözetimi üç sütun: operasyon, ticari davranış, güvenlik

GDS'in sınırlarını üç sütun çiziyor. Operasyonel düzenlemeler: ABD
Ulaştırma Bakanlığı (DOT), zamanında kalkış ve varış raporlama
zorunlulukları. Ticari davranış kuralları: Avrupa Komisyonu, GDS davranış
kuralları; uçuş uygunluk ekranlarının ve sözleşme şartlarının tarafsız
yönetimini zorunlu kılıyor. Güvenlik ve veri gizliliği: göçmenlik ve
güvenlik teşkilatları, uluslararası veri gizliliği standartlarına ve
göçmenlik politikalarına küresel uyum.

![Başlık: Sistemin Sınırları, Devlet Gözetimi ve Uyum Sütunları. Üç sütun ve aralarından geçen yatay çizgiler. 1. Operasyonel düzenlemeler: kurum U.S. DOT; kapsam zamanında kalkış/varış (on-time) raporlama zorunlulukları. 2. Ticari davranış kuralları: kurum Avrupa Komisyonu (EU); kapsam GDS davranış kuralları, uçuş uygunluk (availability) ekranlarının ve sözleşme şartlarının tarafsız yönetimini zorunlu kılar. 3. Güvenlik ve veri gizliliği: kurum göçmenlik ve güvenlik teşkilatları; kapsam uluslararası veri gizliliği standartları ve göçmenlik politikalarına küresel uyum. Altta uzman notları: havacılık terimleri Secure Flight Passenger Data (SFPD), APIS (Advance Passenger Information System), availability; ticari bağlam, AB davranış kuralları kritikti çünkü eski GDS terminalleri tek seferde az sayıda uçuş gösteriyordu, sıralamadaki yanlılık rakip havayolunun satışlarını bitirebilirdi; teknik bağlam, veri gizliliği order management'ı ve PNR'ları doğrudan etkiler, mühendisler GDPR gibi veri maskeleme kurallarıyla APIS gibi göçmenlik gereksinimlerini aynı mimaride çözmek zorundadır.](/decks/gds-ecosystem/03.webp "Üçüncü sütun mühendis için en zoru: aynı PNR'a bir kural veriyi maskele diyor, diğeri sınır polisine ver diyor. İkisi aynı mimaride yaşamak zorunda.")

Yerel mevzuat sorusunun cevabı notta: iş kuralı mutlak yerel uyumluluk.
GDS faaliyet gösterdiği her ülkenin göçmenlik, güvenlik ve veri gizliliği
standartlarına uymak zorunda; aksi halde operasyonel lisans riski doğar.
Teknik bedeli PNR'da görünüyor: GDPR gibi veri maskeleme kurallarıyla
APIS ve Secure Flight gibi "yolcu verisini devlete ilet" gereksinimleri
aynı kayıt üzerinde, aynı mimaride çözülmek zorunda. Notun ticari
hatırlatması da önceki bölümdeki ekran yanlılığının neden bu kadar ağır
regüle edildiğini açıklıyor: eski terminal tek seferde az sayıda uçuş
gösteriyordu, sıralamadaki yanlılık rakibin satışını bitirebiliyordu.

## 1994: bilet kupon olmaktan çıktı, satır oldu; sonra herkes ayrıldı

Ayrılık dönemi dört adım. 1994: elektronik bilete geçiş maliyetleri
düşürdü. 1992-1997: Galileo, Apollo'yu bünyesine kattı ve halka açıldı.
2000: Sabre, American Airlines'tan ayrılarak bağımsız oldu. 2000'lerin
başı: Amadeus, kurucu havayollarından bağımsızlığını kazanıp Madrid
borsasına kote oldu. Rezervasyon payı: internet öncesi %80, bugün
%40-50 arası; kalan doğrudan satışa kaydı. Büyük üçlü Amadeus (en büyük
pay), Sabre ve Travelport (Apollo, Galileo, Worldspan); bölgesel GDS'ler
TravelSky (Çin, devlet destekli), Kiu (Latin Amerika), Sirena-Travel
(Rusya), TOPAS (Güney Kore), INFINI (Japonya).

![Solda başlık: Ayrılık Dönemi ve Küresel Pazarın Yeniden Şekillenmesi; zaman çizgisi. 1994: elektronik biletlere (e-ticket) geçiş maliyetleri düşürdü. 1992-1997: Galileo, Apollo'yu bünyesine kattı ve halka açıldı. 2000: Sabre, American Airlines'tan ayrılarak bağımsız oldu. 2000'lerin başı: Amadeus, kurucu havayollarından bağımsızlığını kazanıp Madrid borsasına kote oldu. Sağda başlık: rezervasyon payı, internet öncesi %80, günümüzde %40-%50 (doğrudan satışa kayış). Büyük üçlü (global GDS): Amadeus (en büyük pazar payı), Sabre, Travelport (Apollo, Galileo, Worldspan). Bölgesel GDS'ler: TravelSky (Çin, devlet destekli), Kiu System (Latin Amerika), Sirena-Travel (Rusya), TOPAS (Güney Kore), INFINI (Japonya). Altta uzman notları: havacılık terimleri ticketing, EMD (Electronic Miscellaneous Document), PSS; teknolojik zorluk, fiziksel biletlerden elektronik biletlere geçiş devasa bir veritabanı dönüşümüydü, biletler kupon olmaktan çıkıp veritabanı satırlarına dönüştü; sektörel paradoks, havayolları GDS'lerden ayrıldı ancak onları kullanmayı bırakmadı, Amadeus ve Sabre gibi devler havayollarının kullandığı PSS çözümlerini (Altea ve SabreSonic) geliştirdi, havayolları platform sahibi olmaktan en büyük yazılım müşterisi olmaya geçiş yaptı.](/decks/gds-ecosystem/04.webp "Sağdaki iki yüzde arasındaki fark internetin aldığı pay. Ama alttaki paradoks daha önemli: havayolu GDS'i sattı, sonra ondan PSS satın aldı.")

Kaynak metnin ifadesiyle kâğıt biletin dijital sürümü rezervasyon
sisteminde saklanınca biletleme ucuzladı. Notun dediği gibi bu devasa bir
veritabanı dönüşümüydü: bilet kupon olmaktan çıkıp veritabanı satırına
dönüştü. Yazılımcı için asıl ders sektörel paradoksta: havayolları
GDS'lerden hisse olarak ayrıldı ama onları kullanmayı bırakmadı. Amadeus
ve Sabre, havayollarının kullandığı PSS çözümlerini (Altea, SabreSonic)
geliştirdi; havayolu platform sahibi olmaktan çıkıp en büyük yazılım
müşterisi oldu. "SABRE'den PSS'e" bölümündeki mimari, bu paradoksun
havayolu tarafındaki sonucu.

## 2004: DOT kuralları kaldırdı, tam içerik müzakereye açıldı

Temmuz 2004'te DOT, CRS regülasyonlarını sonlandırdı. Eşitlik maddeleri
(parity clauses): 2004 öncesi zorunluydu, havayolu bütün GDS'lerde aynı
hizmet seviyesini sunmak zorundaydı; sonrasında kaldırıldı, havayolu GDS
seçmekte özgür kaldı. Tam içerik anlaşmaları: öncesinde zorunlu katılım
şartıydı, web fiyatları dahil bütün tarifeler GDS'e verilmeliydi;
sonrasında ticari müzakereye tabi oldu, özel anlaşma ve farklılaştırılmış
içerik dönemi başladı. Görüntüleme yanlılığı satırında kaynaklar
çelişiyor: slayt 2004 sonrasında "serbest bırakıldı, algoritmik ve ticari
esneklik" diyor; brifing ise havayolları için yasak kaldığını, ama otel
ve araç kiralamayı kapsamadığını söylüyor. Bu bölüm ikisini de aktarıp
seçim yapmıyor; kesin olan, önceki iki satırın kalktığı.

![Başlık: Katalizör, 2004 DOT GDS Serbestleşmesi. Alt başlık: Temmuz 2004'te ABD Ulaştırma Bakanlığı (DOT) bilgisayarlı rezervasyon sistemi (CRS) regülasyonlarını sonlandırarak pazar dinamiklerini kökten değiştirdi. Üç satırlı tablo, sütunlar 2004 öncesi (regüle edilmiş) ve 2004 sonrası (serbest piyasa). Görüntüleme yanlılığı (display bias): önce yasaktı, GDS'ler belirli bir havayolunu kayıran ekran sıralamaları yapamazdı; sonra serbest bırakıldı, algoritmik ve ticari esneklik sağlandı. Eşitlik maddeleri (parity clauses): önce zorunluydu, havayolları tüm GDS'lerde aynı hizmet seviyesini sunmak zorundaydı; sonra kaldırıldı, havayolları GDS'leri seçmekte özgür kaldı (ancak kurumsal talepler nedeniyle sistemlerde kaldılar). Tam içerik anlaşmaları (full content): önce zorunlu katılım şartıydı, web fiyatları dahil tüm tarifeler GDS'e verilmeliydi; sonra ticari müzakereye tabi oldu, özel anlaşmalar ve farklılaştırılmış içerik dönemi başladı. Sağda uzman notları: terimler direct connect, NDC; domain içgörüsü, tam içerik zorunluluğunun kalkması modern dağıtım savaşlarının tohumunu attı, havayolları GDS komisyonlarını aşmak için ucuz web tarifelerini kendi sitelerinde tutmaya veya NDC API'lerini piyasaya sürmeye başladı; operasyonel gerçeklik, 1980'lerin yeşil ekranlı terminallerinde seyahat acenteleri nadiren sayfa 1'i geçerdi, uçuşunuz ilk ekranda değilse o koltuğu satamazdınız.](/decks/gds-ecosystem/05.webp "Ortadaki satırın parantezi bütün hikâye: özgür kaldılar ama kaldılar. Yasa kapıyı açtı, kurumsal müşteri kapıda durdu.")

Havayolu katılım stratejisi sorusu bu tablonun ikinci satırında
cevaplanıyor. Teorik olarak havayolu GDS seçiminde seçici davranabilir,
eşitlik maddeleri kalktı. Pratikte, kaynak metnin dediği gibi, bu olmadı
çünkü her havayolu premium kurumsal segmente erişmek istiyor ve o segment
TMC'ler üzerinden, yani bütün ana GDS'lerden geliyor. Tam içerik sorusu
üçüncü satırda: GDS, web tarifelerinin sistemde yer almasını havayoluyla
yaptığı katılım anlaşmasına tam içerik şartı koyarak garanti ediyor;
2004'ten sonra bu şart yasadan sözleşmeye taşındı. Notun tespiti:
zorunluluğun kalkması modern dağıtım savaşlarının tohumu; havayolu GDS
komisyonundan kaçmak için ucuz web tarifesini kendi sitesinde tutmaya ya
da NDC API'sini piyasaya sürmeye başladı.

## OTA'lar rezervasyonsuz bin sonuç istedi, mainframe çöktü

Uçuş arama motorlarının evrimi dört basamak. 1980'ler, temel arama
(mainframe/TPF): fiyatlandırma için önce rezervasyon yapılması
zorunluydu; Sabre FPC, Apollo Best Buy Quote. 1984 ve 1993, ilk otomatik
arama: Bargain Finder 9 sonuç, Bargain Finder Plus 19 sonuç; çeşitlilik
kısıtlıydı. 1996-2004, OTA patlaması ve açık sistemler: rezervasyonsuz
(stateless) arama ile tek sorguda 200-1000+ sonuç talebi; 2004'te Sabre
ATSE devreye girdi. 2008 sonrası, yüksek performanslı algoritmalar: VTCR
veri yapısı ve ESV (tahmini koltuk değeri) hesaplamaları; ITA Software
gibi modern alternatifler.

![Başlık: Uçuş Arama (Air Shopping) Motorlarının Evrimi. Dikey eksen işlem yükü ve ihtimal sayısı, yatay eksen zaman çizelgesi; basamaklı yükselen bir eğri ve dört işaretli nokta. 1980'ler, temel arama dönemi (mainframe/TPF): fiyatlandırma için rezervasyon yapılması zorunluydu (Sabre FPC, Apollo Best Buy Quote). 1984 ve 1993, ilk otomatik arama: Bargain Finder (9 sonuç) ve Bargain Finder Plus (19 sonuç), sonuç çeşitliliği kısıtlıydı. 1996-2004, OTA patlaması ve açık sistemler: rezervasyonsuz arama (stateless) ile tek sorguda 200-1000+ sonuç talebi, 2004'te Sabre ATSE devreye girdi. 2008+, yüksek performanslı algoritmalar: VTCR veri yapısı ve ESV (tahmini koltuk değeri) hesaplamaları, ITA Software gibi modern alternatifler. Altta uzman notları: terimler TPF, stateless shopping, RBD, ESV, ITA QPX; mühendislik derinliği, rezervasyonsuz arama talebi eski TPF mainframe'lerini çökertme noktasına getirdi, eskiden sistem envanterde koltuk kilitlendikten sonra fiyatlama yapardı, OTA'lar ise koltuğu kilitlemeden binlerce ihtimalin fiyatlanmasını istedi; çözüm, yekpare mainframe'lerden milyarlarca VTCR kombinasyonunu önceden hesaplayıp önbelleğe alan dağıtık açık sistemlere (Linux/x86 cluster) geçiş.](/decks/gds-ecosystem/06.webp "Eğrinin dikleştiği yer üçüncü nokta. 9 sonuçtan 19'a geçmek on yıl sürdü; 19'dan bine geçmek mimariyi değiştirmek demekti.")

Kaynak metnin ifadesiyle OTA'lar, her arama isteği için önce rezervasyon
yapmak zorunda kalmadan çok sayıda güzergâh (200-1000+) döndüren bir
arama servisi istedi. Notun mühendislik dersi: eski sistem envanterde
koltuk kilitlendikten sonra fiyatlıyordu; OTA koltuğu kilitlemeden
binlerce ihtimalin fiyatlanmasını istedi ve bu talep TPF mainframe'lerini
çökertme noktasına getirdi. Çözüm, milyarlarca VTCR kombinasyonunu önceden
hesaplayıp önbelleğe alan dağıtık açık sistemlere, Linux/x86 kümelerine
geçişti.

İki iş mantığı buradan çıkıyor. Çeşitlilik: ATSE gibi bir alışveriş
motoru yüzlerce sonuç arasından hangilerini sunacağını yalnızca en düşük
fiyata göre (fare-led) değil, tarifeye göre de (schedule-led) belirliyor;
kullanıcıya ucuzlar değil, farklı saat ve operatör içeren bir yelpaze
gidiyor. Performans: veri VTCR hiyerarşisine göre organize ediliyor:
satıcı (vendor), tarife (tariff), taşıyıcı (carrier), kurallar (rules),
ücret sınıfı (fare class). Bu yapı, yüksek performanslı motorun karmaşık
fiyatlama kurallarını hızla taramasını sağlıyor. Fiyat hesaplama artık
rezervasyonun sonucu değil, rezervasyondan önce yapılan bir toplu iş.

## Sentez: açık sistem artı düzenleyici esneklik eşittir OTA devrimi

Teknolojik evrim (altyapı): mainframe tabanlı stateful sistemlerden bulut
tabanlı, yüksek kapasiteli, stateless açık sistemlere geçiş. Artı
düzenleyici esneklik (çevre): 2004 DOT kararlarıyla görüntüleme yanlılığı
ve tam içerik zorunluluğunun kalkması algoritmik özgürlük getirdi. Eşittir
OTA devrimi (sonuç): saniyede binlerce look-to-book sorgusunu kaldıran
REST API'ler Expedia ve Booking gibi devleri yarattı; seyahat acentesinin
tekelindeki hacim kırıldı, GDS işlem terminalinden küresel arama motoruna
dönüştü.

![Başlık: Sentez, Açık Sistemler Seyahat Pazarını Nasıl Yeniden Yazdı? Üç kutu toplama ve eşittir işaretiyle dizili. Teknolojik evrim (altyapı): mainframe tabanlı (stateful) sistemlerden bulut tabanlı, yüksek kapasiteli ve durumsuz (stateless) açık sistemlere geçiş. Artı düzenleyici esneklik (çevre): 2004 DOT kararları ile görüntüleme yanlılığı ve tam içerik zorunluluğunun kalkması algoritmik özgürlüğü getirdi. Eşittir OTA devrimi (sonuç): saniyede binlerce bak ve geç (look-to-book) sorgusunu kaldıran REST API'ler Expedia ve Booking gibi devleri yarattı; seyahat acentelerinin tekelindeki hacim kırıldı, GDS işlem terminallerinden küresel arama motorlarına dönüştü. Arka planda merkezden dışarı yayılan çizgiler. Sağda uzman notları: terimler look-to-book oranı, metasearch, open systems; sektörel analiz, eski sistemlerde look-to-book (arama/satın alma) oranı 10:1 civarındaydı ve bu işi insanlar yapıyordu, stateless API'ler, OTA'lar ve Google Flights gibi metasearch motorlarıyla bu oran 10.000:1 seviyelerine sıçradı; kapanış fikri, GDS ekosistemini anlamak teknolojik ölçeklenebilirlik sınırlarının iş modellerini en az hükümet regülasyonları kadar şekillendirdiğini idrak etmektir, modern hava sahası milyarlarca sorguyu yönetirken envanteri gerçek zamanlı ve doğru tutma üzerine kuruludur.](/decks/gds-ecosystem/07.webp "Notun sayısı bölümün tamamı: 10'a 1'den 10.000'e 1'e. Her satın alma için bin kat daha fazla bakış; envanteri doğru tutan sistemin yükü de bin kat.")

Notun tespiti bu bölümün kapanışı: eski sistemde look-to-book oranı
10'a 1 civarındaydı ve bu işi insanlar yapıyordu; stateless API'ler,
OTA'lar ve Google Flights gibi metasearch motorlarıyla oran 10.000'e 1'e
sıçradı. Teknolojik ölçeklenebilirlik sınırı, iş modelini en az hükümet
regülasyonu kadar şekillendirdi. Modern hava sahası milyarlarca sorguyu
yönetirken envanteri gerçek zamanlı ve doğru tutma üzerine kurulu; bu
bölümdeki her kırılma o dengeyi bir kez daha zorladı.

## Yarın işe yarayacak dört çıkarım

1. **SOAP'tan REST'e geçiş bir tercih değil, mobil ve çeviklik şartı.**
   XML içinde EDIFACT taşıyan stateful API, oturum açık tutmadan paralel
   arama yapan uygulamayı kaldıramaz. Eski entegrasyonu koru, yeni yüzü
   REST/JSON ile kur.
2. **GDS stratejisini maliyetle değil erişimle ölç.** Havayolu 2004'ten
   beri GDS seçmekte özgür ama kârlı kurumsal segment TMC ve ana GDS'ler
   üzerinden geliyor. GDS'ten çıkmanın bedeli komisyon tasarrufu değil,
   o segmentte görünmez olmak.
3. **Arama motorunu fiyattan fazlasına göre kur.** Fare-led ve
   schedule-led birlikte; VTCR hiyerarşisinde organize edilmiş veri ve
   ESV gibi değer hesapları, sunulan teklifin ticari değerini ve alaka
   düzeyini artırır. Bin sonucu döndürmek yetmez, doğru bini seçmek gerek.
4. **Mevzuat takibini merkezi bir birime ver.** DOT raporlama, AB davranış
   kuralları, GDPR maskeleme ve APIS iletimi aynı PNR üzerinde çalışıyor.
   Dört otoritenin gereksinimini tek mimaride tutmak operasyonel
   sürekliliğin şartı; parça parça çözülemez.

Bu bölümde ne yok: NDC'nin tam içerik zorunluluğunun kalkmasından nasıl
doğduğu ("NDC: dağıtımı kim kontrol ediyor") ve OTA'ların istediği
rezervasyonsuz bin sonucun envanter tarafında ne demek olduğu ("Envanter
koltuk değildir"). İkisi de bu bölümdeki 10.000'e 1'in devamı.
