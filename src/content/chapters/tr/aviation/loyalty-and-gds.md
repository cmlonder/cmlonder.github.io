---
title: "PEOPLExpress ve havacılık sektörü: sadakat programları ve dağıtım sistemleri stratejik analizi"
domain: "aviation"
summary: "1980'lerde iki devrim aynı anda oldu: sadakat programı yolcuya kimlik verdi, GDS satış kanalını havayolunun eline verdi. Bu bölüm ikisinin iş mantığını anlatıyor: her mil kullanımı bir ücretli yolcunun yerini alır, tarafsız ortak sistem beş kez denendi ve beş kez öldü, ekran sıralaması bir iş kuralıdır."
audience: "Sadakat programını 'puan dağıtan modül', GDS'i 'acentenin ekranı' sanan yazılımcı ve ürün insanı. Önceki bölümü okumuş olmak yeter; displacement, cüzdan payı ve ekran yanlılığı metnin içinde tanımlanıyor."
pubDate: 2026-09-21
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölüm iki cümleyle bitmişti: AAdvantage puan dağıtmak için değil,
müşteri verisi kurmak için vardı; ve gelir yönetiminin ek geliri, dağıtım
ağında satış noktasına göre gerçek son koltuk uygunluğuyla mümkün oldu.
Bu bölüm o iki cümleyi açıyor. **Sadakat programı ve küresel dağıtım
sistemi aynı on yılda doğdu ve ikisi de aynı şeyi yaptı:** emtia haline
gelmiş bir ürünü, veriyle ve kanal kontrolüyle yeniden farklılaştırdı.
Biri yolcu tarafından, diğeri satış tarafından.

![Sunumun kapak slaytı, kareli teknik çizim zemini. Üstte turuncu küçük başlık: havayolu ticaretinin mimari taslağı. Büyük başlık: Sadakat Programları ve GDS'in Doğuşu. Alt başlık: müşteri bağlılığı stratejileri ve küresel dağıtım sistemleri (GDS) modern havayolu perakendeciliğinin temellerini nasıl inşa etti. Sağda lacivert ve turuncu hatlarla örülmüş bir ağ diyagramı; sağ altta bir bilet barkodu ve PNR, rota, uçuş, sınıf ve sadakat kodlarından oluşan bir kayıt satırı.](/decks/loyalty-and-gds/01.webp "Sağ alttaki barkod satırında PNR, rota ve sadakat kodu yan yana. Bu bölüm o satırın son alanının ve o satırı gösteren ekranın nereden geldiğini anlatıyor.")

## İki devrim aynı on yılda: biri yolcuyu, diğeri kanalı hedefledi

Yolcu boyutu sık uçan yolcu programları: müşteriyi ekosisteme kilitlemek
ve ömür boyu değer yaratmak; emtia haline gelmiş bir üründe marka sadakati
oluşturmak. Dağıtım boyutu küresel dağıtım sistemleri: biletleme ve
rezervasyon iş akışlarını standartlaştırmak; satış kanallarına teknolojik
altyapıyla hükmetmek. Havayolu ortada, çevresinde acente, kurumsal, GDS,
OTA, metasearch ve direkt kanal.

![Başlık: 1980'lerin İkili Devrimi. Solda iç içe halkaların ortasında bir yolcu simgesi; altında yolcu boyutu, sık uçan yolcu programları: müşteriyi ekosisteme kilitlemek ve ömür boyu değer yaratmak; emtia haline gelmiş bir üründe marka sadakati oluşturmak. Sağda ortada havayolu yazan halka, altı kanala çift yönlü oklarla bağlı: acente, kurumsal, GDS, OTA, metasearch, direkt; altında dağıtım boyutu, küresel dağıtım sistemleri: biletleme ve rezervasyon iş akışlarını standartlaştırmak; satış kanallarına teknolojik altyapı ile hükmetmek.](/decks/loyalty-and-gds/02.webp "Soldaki halkalar içe doğru daralıyor, sağdaki oklar dışa doğru açılıyor. Biri yolcuyu içeri çekmenin, diğeri ürünü dışarı itmenin mimarisi.")

İki boyutun ortak paydası şu: 1978 sonrası fiyat serbestleşince koltuk
bir emtia oldu. Aynı rotada aynı saatte iki havayolunun koltuğu arasında
fark kalmadı. Fiyat dışında bir fark yaratmanın iki yolu vardı: yolcuyu
bağlamak ve yolcunun gördüğü ekranı kontrol etmek.

## Sadakat fikri bankadan geldi, 1981'de patladı

Kök havacılıkta değil. Reklamcı Bill Bernbach bankaların sadık
müşterilerine hediye verdiğini gözlemledi ve American Airlines'a bir
"sadakat ücreti" (loyalty fare) konsepti önerdi. Konsept mil bazlı bir
sisteme evrildi. 1981'de patlama: American'ın AAdvantage'ı, United'ın
Mileage Plus'ı, TWA'nın Frequent Flight Bonus'u ve Delta'nın Frequent
Flyer Program'ı aynı yıl çıktı.

![Başlık: Sadakat Programlarının Kökleri. Solda üç basamaklı akış. İlham (bankacılık sektörü): reklamcı Bill Bernbach'ın bankaların sadık müşterilerine hediye vermesini gözlemlemesi. Kavramsal temel: American Airlines için önerilen sadakat ücreti (loyalty fare) konsepti. Evrim: mil bazlı sistemin geliştirilmesi. Sağda turuncu çerçeveli kutu, 1981 patlaması: American Airlines AAdvantage, United Airlines Mileage Plus, TWA Frequent Flight Bonus, Delta Air Lines Frequent Flyer Program.](/decks/loyalty-and-gds/03.webp "Sağdaki dört isim aynı yıl. İlk hamleyi yapanın avantajı aylarla ölçüldü; kalıcı avantaj programın kendisinde değil, topladığı veride oldu.")

Aynı yıl dört program çıkması önemli: sadakat programı bir rekabet
avantajı olarak doğdu ve aylar içinde sektör standardına dönüştü. Fark
yaratan programın varlığı değil, arkasındaki veri ve ekonomiydi.

## Emtia üründe marka: değer volanı dört adımda döner

Sadakat ekonomisi bir volan. Marka sadakati: emtialaşan pazarda ömür boyu
müşteri ilişkisi. Yeni talep yaratımı: ilave teşvikler ve statü hedefleri
seyahat sıklığını artırır. Ekosistem genişlemesi: oteller, araç kiralama,
perakende ve restoranlara entegre bir yaşam tarzı ağı. İkincil gelir: mil
ve puanların kredi kartı şirketlerine satılması devasa bir gelir kapısına
dönüşür. Ortada 50 milyondan fazla üye.

![Başlık: Sadakat Ekonomisi, Değer Volanı. Ortada dişli çark ve lacivert daire içinde 50 milyon+ üye. Çevresinde dört adımlı döngü. 1. Marka sadakati: emtialaşan pazarda ömür boyu müşteri ilişkisi yaratır. 2. Yeni talep yaratımı: ilave teşvikler ve statü hedefleri ile seyahat sıklığını artırır. 3. Ekosistem genişlemesi: oteller, araç kiralama, perakende ve restoranlara entegre bir yaşam tarzı ağı. 4. İkincil gelir: mil ve puanların kredi kartı şirketlerine satılarak devasa bir gelir kapısına dönüşmesi.](/decks/loyalty-and-gds/04.webp "Dördüncü adım birinciye geri dönüyor: kredi kartı geliri teşviki finanse ediyor, teşvik sadakati büyütüyor. Volanın yakıtı uçuş değil, mil satışı.")

Emtia ürünü farklılaştırmanın iş mantığı: yolcuyu mil kazanımı ve ek
teşviklerle sisteme hapsetmek (lock-in). Havayolu böylece yalnızca ulaşım
sağlayıcı olmaktan çıkıp kredi kartı şirketleri ve perakendecilerle ortak
pazarlama üzerinden ikincil gelir elde eden bir platforma dönüşür.
Başarının metrikleri de buradan çıkıyor: yaratılan yeni talep miktarı,
marka değerindeki artış, sadık müşteriyle kurulan yaşam boyu ilişkinin
derinliği ve ortaklık programlarından gelen gelir akışı. Uçuş sayısı bu
listede yok; sonuç orada görünür, ama ölçülen şey o değil.

## Cüzdan payı bilinmiyor; tahmin edilir

Programın en kritik verisi programın içinde yok. Sorun şu: müşteri sizinle
uçuyor olabilir ama rakip havayolunda iki kat daha fazla harcıyor
olabilir. Sistem bu kayıp veriyi doğrudan göremez. Kaynak metnin
ifadesiyle cüzdan payı verilerine ulaşılamamaktadır. Çözüm tahmine dayalı
analitik: anket verisi ve müşterinin geçmiş satın alma kalıpları üzerinde
çalışan modeller, toplam potansiyeli ve rakibe kayma ihtimalini simüle eder.

![Başlık: Cüzdan Payı Problemi ve Tahmine Dayalı Analitik. Solda bir pasta grafiği: lacivert dilim bilinen veri (havayolunun kendi payı), taralı turuncu dilim bilinmeyen veri (rakip havayolu harcaması); arkasında bir radar grafiği. Altta sorun: müşteri sizinle uçuyor olabilir ancak rakip havayolunda iki kat daha fazla harcıyor olabilir, sistem bu kayıp veriyi doğrudan göremez; çözüm tahmine dayalı analitik (predictive analytics). Sağda sektörler arası dersler. 1 Perakende (Walmart/Target): kredi kartı şirketlerinden posta kodu bazlı harcama verisi satın alarak pazarlama bütçesini optimize eder. 2 Casino (Harrah's): oynama süresi ve bakiye verisiyle müşteriyi segmentlere ayırır, rakibe gitme ihtimali olanları tespit edip özel tekliflerle hedefler.](/decks/loyalty-and-gds/05.webp "Taralı dilim lacivert dilimden büyük ve havayolu onu hiç görmüyor. Sağdaki iki sektör aynı körlüğü dış veriyle ve davranış modeliyle çözmüş.")

İki sektörün yöntemi havayoluna uyarlanabilir. Perakende (Walmart,
Target) kredi kartı şirketlerinden posta kodu bazlı toplu harcama verisi
alıp pazarlama bütçesini (basılı ilan, broşür) hangi bölgeye
yoğunlaştıracağına karar veriyor. Casino (Harrah's) oynama süresi ve
bakiye verisiyle müşteriyi segmentlere ayırıp rakibe gitme ihtimali
olanı tespit ediyor ve özel teklifle geri çağırıyor. Ortak mantık: kendi
verinle müşterinin pazar içindeki toplam potansiyelini, dış veriyle ve
modelle tahmin et; sonra onu geri getirecek teşviki hesapla.

## Her mil kullanımı bir ücretli yolcunun yerini alır

Sadakat programı gelir yönetimiyle çatışır. Kullanılan her sık uçan yolcu
mili, o koltuğu satın alabilecek potansiyel bir ücretli yolcunun yerini
işgal eder; buna yer değiştirme (displacement) maliyeti denir. Bu havayolu
için doğrudan bir fırsat maliyetidir; sınırsız ödül bilet kullanımı
kârlılığı yok eder. Çözüm kapasite kontrolü: ödül biletler sınırlandırılır
ve sadakat stratejisi doğrudan gelir yönetimi politikasıyla şekillenir.

![Başlık: Sadakat Programlarının Gelir Yönetimine (RM) Etkisi. Uçak kabin planı: ön bölümdeki koltuklar turuncu taralı, ödül bilet (redemption); arka bölümdeki koltuklar lacivert, ücretli yolcu (revenue). Altta üç sütun. Yer değiştirme maliyeti: kullanılan her sık uçan yolcu mili, o koltuğu satın alabilecek potansiyel bir ücretli yolcunun yerini işgal eder. Sistemik çatışma: bu durum havayolu için doğrudan bir fırsat maliyetidir, sınırsız ödül bilet kullanımı kârlılığı yok eder. Kapasite kontrolü: maliyet baskısı nedeniyle ödül biletler sınırlandırılır, sadakat stratejisi doğrudan gelir yönetimi politikaları tarafından şekillendirilir.](/decks/loyalty-and-gds/06.webp "Turuncu koltuklar bedava değil; her biri lacivert bir koltuğun satılmama ihtimali. Ödül bileti de bir rezervasyon sınıfıdır ve onun da bir limiti var.")

Yazılımcı için kural net: mil ile yapılan rezervasyon, ucuz ücret
sınıflarıyla aynı mekanizmaya tabi. Her uçuşta mil ile satılabilecek
koltuk sayısı sınırlı; limit, DINAMO bölümündeki segment limitleriyle aynı
yerden geliyor. Ödül koltuğu yalnızca boş kalacak koltuk değildir; nakit
akışını ve yer değiştirme maliyetini birlikte optimize eden bir kapasite
kontrol algoritmasıyla yönetilir.

## Tarafsız dağıtım ağı: herkes istedi, kimse kuramadı

Dağıtım tarafının hikâyesi bir başarısızlıkla başlıyor. 1960'lar ve
70'lerde seyahat acenteleri ve havayolları artan işlem hacmini yönetmek
için ortak bir zemin aradı. Temel amaç rezervasyon iş akışlarını
standartlaştırmak ve sektör çapında tarafsız bir endüstri rezervasyon
sistemi kurmaktı. OAG'nin sahibi Reuben H. Donnelly Corp. bu vizyonun
teknik altyapısını kurmaya çalışan ilk aktörlerdendi. Gerçeklik: mükemmel
görünen vizyon teknik yetersizlikten değil, finansman, rekabet ve
antitröst yasaları yüzünden sekteye uğradı.

![Başlık: Tarafsız Dağıtım Ağı Vizyonu. Solda dört kutu. Bağlam (1960'lar-70'ler): seyahat acenteleri ve havayolları artan işlem hacmini yönetmek için ortak bir zemin arayışına girdi. Temel amaç: rezervasyon iş akışlarını standartlaştırmak ve sektör çapında tarafsız endüstri rezervasyon sistemi kurmak. OAG'nin rolü: Reuben H. Donnelly Corp. bu vizyonu hayata geçirmek için teknik altyapıyı kurmaya çalışan ilk aktörlerden biriydi. Gerçeklik: mükemmel görünen bu vizyon teknik yetersizliklerden değil, finansman, rekabet ve antitröst yasaları nedeniyle sekteye uğradı. Sağda ortasında turuncu tarafsız ağ halkası olan, yüzlerce okla örülmüş dairesel bir ağ diyagramı.](/decks/loyalty-and-gds/07.webp "Ortadaki turuncu halka hiç kurulmadı. Etrafındaki karmaşa, onun yokluğunda her havayolunun kendi başına kurduğu bağlantılar.")

## Beş girişim, beş farklı ölüm nedeni

Ortak sistem girişimleri tek nedenle ölmedi. DOARS (1967, Reuben H.
Donnelly): finansman, 21 havayolundan geliştirme için yeterli fon
bulunamadı. ATARS (1970'ler başı): antitröst, yalnızca acente ve havayolu
özelinde olması Adalet Bakanlığı'nca yasaya aykırı bulundu. ASTA/CDC
(1973): kontrol kaygısı, havayolları acente erişiminin bir bilgisayar
satıcısının elinde olmasını reddetti. JICRS (1974, AA öncülüğünde):
finansman modeli, United yolcu hacmine dayalı yüksek maliyet yapısını
reddetti. MAARS (1970'ler sonu, ASTA): yasal engel, Sivil Havacılık Kurulu
diğer sistemlerin ifşa olması endişesiyle dokunulmazlık vermedi.

![Başlık: Ortak Sistem Girişimlerinin Çöküşü. Üç sütunlu tablo: girişim, yıl ve mimarı, iptal veya başarısızlık nedeni. DOARS, 1967 (Reuben H. Donnelly), finansman: 21 havayolundan geliştirme için yeterli fon bulunamadı. ATARS, 1970'ler başı, antitröst: sadece acente ve havayolu özelinde olması Adalet Bakanlığı tarafından yasaya aykırı bulundu. ASTA/CDC, 1973, kontrol kaygısı: havayolları acente erişiminin bir bilgisayar satıcısının elinde olmasını reddetti. JICRS, 1974 (AA öncülüğünde), finansman modeli: United yolcu hacmine dayalı yüksek maliyet yapısını reddetti. MAARS, 1970'ler sonu (ASTA), yasal engel: Sivil Havacılık Kurulu diğer sistemlerin ifşa olması endişesiyle dokunulmazlık vermedi.](/decks/loyalty-and-gds/08.webp "Üçüncü sütunda hiç 'teknik' yazmıyor. Beş ölüm nedeni: para, yasa, kontrol, para, yasa.")

JICRS'in çöküşü öğretici. Finansman modeli yolcu hacmine bağlıydı: büyük
havayolu daha fazla ödeyecekti. En büyük havayolu United bunu reddetti.
Üstüne havayolları, teknoloji sağlayıcısının acenteler üzerindeki
kontrolünden endişe ediyordu; antitröst yasaları ve bağışıklık sorunları
da ortaklığın önünü kesti. Ortak sistemin ölümü bir mühendislik kararı
değildi, bir maliyet paylaşımı ve güç kararıydı.

## JICRS çökünce silolar yükseldi: GDS'in doğuşu

Kırılma noktası: JICRS çökünce United kendi PARS tabanlı Apollo sistemini
acentelere açacağını duyurdu ve dağıtım kanalını kontrol etme hamlesi
yaptı. Domino etkisi: pazar payını korumak isteyen American (Sabre) ve
TWA (PARS) kendi sistemlerini acentelere sunmak zorunda kaldı. Havayolları
kendi envanterlerini tuttukları rezervasyon sistemlerine (CRS) acente
işlevleri ekledi. Sonuç: tek sistemde birden fazla havayolunu barındırma
devri başladı ve sistemler dünya çapında küresel dağıtım sistemine (GDS)
dönüştü.

![Başlık: Tescilli Sistemlerin Yükselişi ve Silolar. Ortada çatlamış bir platform üzerinde üç sunucu kulesi: Apollo (United), Sabre (American, turuncu vurgulu), PARS (TWA). Dört kutu. Kırılma noktası: JICRS çökünce United kendi PARS tabanlı Apollo sistemini acentelere açacağını duyurarak dağıtım kanalını kontrol etme hamlesi yaptı. Domino etkisi: pazar payını korumak isteyen American Airlines (Sabre) ve TWA (PARS) kendi sistemlerini acentelere sunmak zorunda kaldı. GDS'in doğuşu: havayolları kendi envanterlerini tuttukları rezervasyon sistemlerine (CRS) acente işlevleri ekledi. Sonuç: tek bir sistemde birden fazla havayolunu barındırma devri başladı, sistemler dünya çapında küresel dağıtım sistemlerine (GDS) dönüştü.](/decks/loyalty-and-gds/09.webp "Kulelerin altındaki platform tarafsız ağın kalıntısı. Üstüne çıkan üç kule birbirine değmiyor; GDS, silo olarak doğdu ve sonra çok taşıyıcılı oldu.")

Mimari sonuç şu: bugünkü GDS, tarafsız bir sektör altyapısı olarak
tasarlanmadı. Bir havayolunun envanter sistemine acente ekranı eklenmesiyle
doğdu ve sonradan rakip havayollarını da barındırmaya başladı. Bu doğum
lekesi bir sonraki başlıkta görünüyor.

## Ekran sıralaması bir iş kuralıdır

Klasik OAG mantığı dört basamaklı bir sıralama: aktarmasız uçuşlar, direkt
uçuşlar, aynı havayoluyla bağlantılar, farklı havayollarıyla bağlantılar.
Sabre bu formatı takip etmedi; kaynak metnin deyişiyle çok daha
sofistikeydi. Parametreler: toplam seyahat süresi (elapsed time), istenen
zamandan sapma (displacement) ve taşıyıcı tercihi (carrier preference).

![Başlık: Algoritma Savaşları ve Ekran Yanlılığı. İki eski terminal ekranı yan yana. Solda klasik OAG mantığı: 1. aktarmasız uçuşlar (non-stop), 2. direkt uçuşlar, 3. online bağlantılar (aynı havayolu), 4. interline bağlantılar (farklı havayolları). Sağda Sabre gelişmiş algoritması: toplam seyahat süresi, istenen zamandan sapma, taşıyıcı tercihi (carrier preference); üçü oklarla birbirine bağlı. Altta sonuç: Sabre'nin karmaşık mantığı ekran sonuçlarında kendi havayolunu kayırdığı algısını yarattı; bugün bile bu parametreler, tüketicilerin rotaları nasıl seçtiğini modelleyen gelişmiş seçim algoritmalarının temelini oluşturur.](/decks/loyalty-and-gds/10.webp "Sağ ekrandaki üçüncü satır sorunun kendisi: taşıyıcı tercihi bir parametre olarak sisteme girince, ekranın sahibi olan havayolu kendi uçuşunu üste taşıyabildi.")

Bu algoritma seyahat acentesinin seçimini doğrudan etkiler; acente
çoğunlukla ilk ekrandaki uçuşu satar. Sistem sahibi havayoluna stratejik
avantaj sağlar ve ekran yanlılığı (display bias) tartışması buradan doğdu:
Sabre'nin karmaşık mantığı kendi havayolunu kayırdığı algısını yarattı.
Slaytın son cümlesi bugünle bağı kuruyor: aynı parametreler, tüketicinin
rotayı nasıl seçtiğini modelleyen bugünkü seçim algoritmalarının temeli.
Toplam süre, zaman sapması ve taşıyıcı tercihi; her biri yolcunun bir
uçuşu seçme olasılığını belirleyen kritik bir iş kuralı.

## Büyük sentez: kime, hangi fiyata, hangi ekranda

Müşteri tarafı (sadakat): veriye dayalı talep yönetimi, cüzdan payı
tahmini, ikincil gelir inşası. Dağıtım tarafı (GDS): algoritmik uçuş
listeleme, acente ağlarının entegrasyonu, gelir yönetimi kaynaklı kapasite
kontrolleri. Biletin kime satılacağı, hangi fiyattan sunulacağı ve hangi
ekranda gösterileceği problemi bugün hâlâ 1980'lerde atılan bu iki temel
üzerinde çözülüyor.

![Başlık: Modern Havayolu Perakendeciliğinin Temelleri. Ortada uçağın teknik çizimi. Sol kanada turuncu oklarla müşteri tarafı (sadakat): veriye dayalı talep yönetimi, cüzdan payı tahmini, ikincil gelir (ancillary) inşası. Sağ kanada lacivert oklarla dağıtım tarafı (GDS): algoritmik uçuş listeleme, acente ağlarının entegrasyonu, gelir yönetimi kaynaklı kapasite kontrolleri. Altta büyük sentez kutusu: biletin kime satılacağı, hangi fiyattan sunulacağı ve hangi ekranda gösterileceği problemi, bugün hâlâ 1980'lerde yaşanan bu iki devrimin attığı temeller üzerinde çözülmektedir.](/decks/loyalty-and-gds/11.webp "İki kanat aynı gövdeye bağlı: sadakat verisi kime satılacağını, GDS hangi ekranda görüneceğini, gelir yönetimi hangi fiyattan olacağını söylüyor. Üçü ayrı sistem, tek karar.")

## Yarın işe yarayacak dört çıkarım

1. **Müşterinin toplam potansiyelini tahmin et, sadece geçmişini
   sayma.** Kendi verin cüzdan payının küçük dilimi. Harrah's'ın yaptığı
   gibi, müşterinin rakibe gitme olasılığını sistem kendisi hesaplamalı;
   gerekiyorsa dış veri (kredi kartı, posta kodu) satın al.
2. **Ödül birimini de kapasite kontrolüne bağla.** Mil ile satılan
   koltuk "boş kalacak koltuk" değil; her biri bir yer değiştirme
   maliyeti. Nakit akışı ve displacement'ı birlikte optimize eden bir
   algoritma olmadan sadakat programı gelir yönetimini içeriden deler.
3. **Sıralama parametresi bir iş kuralıdır, UI tercihi değil.** Toplam
   süre, zaman sapması ve taşıyıcı tercihi; her biri seçme olasılığını
   değiştirir. Parametreleri tüketici davranış modeliyle kalibre et ve
   hangisinin kimi kayırdığını bilerek koy.
4. **Sadakat programını maliyet merkezi olarak muhasebeleştirme.** Mil
   satışı kredi kartı ve perakende ortaklarından nakit getiriyor; program
   ikincil gelir kaynağı olarak konumlandırılmalı ve o gelirle ölçülmeli.

Bu bölümde ne yok: ortak sistemin beş kez ölmesinin bugünkü mirası olan
GDS ile doğrudan bağlantı kavgası ("NDC: dağıtımı kim kontrol ediyor") ve
PNR'daki sadakat alanının sözleşme olarak taşıdığı yük ("PNR bir kayıt
değil, bir sözleşme"). İkisi de bu bölümdeki barkod satırının devamı.
