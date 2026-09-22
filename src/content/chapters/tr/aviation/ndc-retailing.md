---
title: "Seyahat dağıtım ekosistemi ve yeni dağıtım yeteneği (NDC) analizi"
domain: "aviation"
summary: "Acente beş koldan para kazanır ve en büyüğü havayolunun GDS'e ödediği ücretin yarısından fazlasını geri alan teşviktir. Havayolu bu döngüden çıkmak için 2015'ten beri GDS rezervasyonuna sürşarj koyuyor ve NDC ile teklifi kendisi kuruyor. Bu bölüm gelir mimarisini, aracısızlaştırmayı, ONE Order'ı ve dört seviyeli sertifikasyonu anlatıyor."
audience: "NDC entegrasyonu yazan, acente anlaşması müzakere eden ya da 'GDS neden hâlâ var' diye soran yazılımcı ve ürün insanı. Önceki iki bölüm okunmuş olmalı; override, net ücret, sürşarj, pasif segment ve ONE Order metnin içinde tanımlanıyor."
pubDate: 2026-09-22
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölüm iki sayıyla bitmişti: bilet başına 2.5 segment ücreti ve
acenteye geri dönen %50'yi aşan teşvik. Bu bölüm o iki sayının etrafındaki
sistemi anlatıyor. **Havayolu koltuk tedarikçisi olmaktan çıkıp ürün
pazarlamacısı olmak istiyor;** GDS ise ona yalnızca anonim bir koltuk
sattırıyor ve karşılığında ödediği ücretin yarısını acenteye dağıtıyor.
Bu açmazın iki cevabı var: GDS rezervasyonuna sürşarj koyarak trafiği
doğrudan kanala itmek ve NDC ile teklifi kendi sisteminde kurmak. İkisi
de aynı şeyi hedefliyor: fiyatlandırma gücünü aracıdan geri almak.

![Sunumun kapak slaytı, lacivert zemin. Solda başlık: Havacılıkta Dağıtımın Evrimi. Alt başlık: geleneksel GDS modellerinden NDC ve ONE Order ile perakende dönüşümüne. Sağda iki bölümlü akış şeması: solda mavi hatlarla legacy EDIFACT, GDS aggregator, travel agency (TMC/OTA), airline PSS (inventory/pricing), fragmented offer, ticketing ve PNR kutuları; ortada perakende dönüşümü oku; sağda turuncu hatlarla NDC API, direct connect / aggregator, ONE Order (offer management, order management, real time settlement), passenger / corporate buyer ve unified PNR ve ticket kutuları.](/decks/ndc-retailing/01.webp "Sol tarafta teklif parçalı, sağ tarafta tek kayıt. Oku geçince kutu sayısı azalmıyor; sahibi değişiyor.")

## Acente nasıl para kazanıyor: beş kol

Seyahat acentesinin gelir mimarisi beş kol. GDS teşvikleri: işlem başına
ödenir, rekabetçidir; acente geliri maksimize etmek için çoklu GDS
stratejisi kullanır. Ön uç komisyonları: bilet satışından alınan doğrudan
pay; uçuşlarda düşüşte ama lüks turlarda ve uluslararası pazarlarda hâlâ
kârlı. Arka uç komisyonları: havayolunun belirlediği dönemsel satış
hedefine ulaşıldığında ödenen toplu prim. Net bilet fiyatları: havayoluyla
müzakere edilmiş toptan fiyat, acente üzerine kendi marjını ekler. Hizmet
bedelleri: danışmanlık, yükseltme ve bağlantı işlemleri için müşteriden
doğrudan alınan ücret.

![Başlık: Seyahat Acentesi Gelir Mimarisi, Nasıl Para Kazanıyorlar? Beş kart yan yana. GDS teşvikleri: işlem başına ödenir, rekabetçidir, acenteler geliri maksimize etmek için çoklu GDS stratejisi kullanır. Ön uç komisyonları: bilet satışından alınan doğrudan pay, uçuşlarda düşüşte olsa da lüks turlar ve uluslararası pazarlarda hâlâ kârlıdır. Arka uç komisyonları: havayolunun belirlediği dönemsel satış hedeflerine ulaşıldığında ödenen toplu primler. Net bilet fiyatları: havayolu ile müzakere edilmiş toptan fiyatlar, acente üzerine kendi kâr marjını ekler. Hizmet bedelleri: müşteriden danışmanlık, yükseltme ve bağlantı işlemleri için doğrudan alınan ücretler. Altta turuncu çerçeveli uyarı: GDS teşvikleri bazen segment rezervasyon ücretlerinin %50'sini aşabilir ve doğrudan GDS kârlılığını olumsuz etkiler.](/decks/ndc-retailing/02.webp "Beş kolun yalnızca sonuncusu müşteriden geliyor. İlk dördü havayolundan ya da GDS'ten; acente, sattığı kişiden değil sattırdığı kurumdan kazanıyor.")

Üç iş kuralı buradan çıkıyor. GDS seçimi: acente genellikle çift GDS
stratejisi izleyip pazar rekabetinden yararlanır; GDS'ler havayolundan
aldıkları segment ücretinin %50'sinden fazlasını teşvik olarak geri
ödeyebilir ve acente en yüksek teşviği ya da en iyi imza bonusunu veren
GDS'i önceliklendirir. Pazar yönlendirmesi: havayolu performans bazlı arka
uç (override) komisyonu kullanır; acente belirli pazarda ya da dönemde,
örneğin çeyrek bazında, hedef rezervasyona ulaşınca toplu ödeme alır. Net
ücret tercihi: net ücret, havayolunun acenteye sunduğu çıplak maliyet;
acente üzerine marjını (mark-up) ekler ve bu yöntem standart komisyondan
genellikle daha yüksek işlem başına marj verir.

## Komisyonların düşüşü: 1995'te zincir kırıldı

1990'ların ortasına kadar acentelik oldukça kazançlı bir iş modeliydi;
tarihsel standart %10 komisyon. Kırılma 9 Şubat 1995: Delta Air Lines
ABD içi uçuşlarda %10 komisyonu iptal etti ve gidiş-dönüş için maksimum
50 dolar sınırı getirdi. 1996'da Amerikan Seyahat Acenteleri Birliği
(ASTA) antitröst davası açtı; komisyon tavanı kalıcı oldu ve sektörel
düşüş başladı. Bugün komisyon yalnızca teşvik edilen spesifik pazarlarla
sınırlı; acenteler GDS teşviklerine ve uluslararası uçuşlara yöneldi.

![Başlık: Komisyonların Düşüşü, Tarihsel Zaman Çizelgesi. Kıvrımlı bir hat üzerinde dört kutu. 1990'ların ortasına kadar: acentelik oldukça kazançlı bir iş modeliydi (tarihsel standart %10 komisyon). 9 Şubat 1995, kırık zincir simgesiyle turuncu çerçeveli: kırılma noktası, Delta Air Lines ABD içi uçuşlarda %10 komisyonu iptal etti, gidiş-dönüş maksimum 50 dolar sınırı getirildi. 1996, tokmak simgesi: Amerikan Seyahat Acenteleri Birliği (ASTA) antitröst davası açtı, komisyon tavanı kalıcı oldu ve sektörel düşüş başladı. Günümüz, küre simgesi: komisyonlar yalnızca teşvik edilen spesifik pazarlarla sınırlı, acenteler GDS teşviklerine ve uluslararası uçuşlara yöneldi.](/decks/ndc-retailing/03.webp "Kırık zincirin tarihi 1995, davanın tarihi 1996 ve dava kaybedildi. Acentenin gelir kaynağı o gün havayolundan GDS'e kaydı; bu bölümün geri kalanı o kaymanın bedeli.")

Bu tarih, önceki bölümlerdeki %10 komisyon ve override sisteminin nasıl
bittiğini açıklıyor. Ön uç komisyon kesilince acente gelirini GDS
teşvikine dayadı; GDS teşviki havayolunun segment ücretinden geliyor;
yani havayolu, acenteye ödemeyi kestiği komisyonu GDS üzerinden dolaylı
olarak ödemeye devam etti. Sürşarj ve NDC bu dolambaçlı ödemenin cevabı.

## Geleneksel dağıtım ve ödeme akışı

Para dört düğüm arasında dolaşıyor. Yolcu acenteye ya da OTA'ya kredi
kartı, nakit ve hizmet bedeli öder. Acente GDS'e abonelik ücreti öder;
GDS acenteye teşvik geri öder. GDS havayolundan rezervasyon ücreti alır.
Acente periyodik ödemeyi BSP ya da ARC takas odasına gönderir; takas odası
havayoluna net ödeme yapar.

![Başlık: Geleneksel Dağıtım ve Ödeme Akışı. Lacivert zeminde beş kutu ve oklar. Yolcu, kredi kartı, nakit ve hizmet bedeli ile seyahat acentesi / OTA'ya öder. Acente GDS'e abonelik ücretleri öder; GDS acenteye teşvikler gönderir. GDS'ten havayoluna rezervasyon ücretleri oku. Acenteden BSP / ARC (takas odası) kutusuna periyodik ödeme; takas odasından havayoluna net ödeme.](/decks/ndc-retailing/04.webp "GDS ile havayolu arasındaki ok tek yönlü ve para havayolundan çıkıyor. Yolcunun ödediği para alttan takas odasıyla, havayolunun ödediği ücret üstten GDS'le dolaşıyor; iki döngü hiç kesişmiyor.")

Endüstri standartları bölümündeki BSP ve ARC bu şemanın alt yolu; kayıtlı
satıcı acente olduğunda para o yoldan gidiyor. Üst yol ise bu bölümün
konusu: havayolunun GDS'e ödediği ücret ve o ücretin acenteye geri dönen
kısmı. Havayolunun gördüğü fatura üst yolda; kontrol edebileceği en büyük
gider kalemi de orada.

## Havayolunun açmazı: geleneksel sistem neden tıkanıyor

Ortada anonim bir koltuk, etrafında üç sorun. Gizli ek hizmetler: bagaj
ve koltuk seçimi gibi yan hizmetler GDS'in tam içerik anlaşmalarına dahil
değil, GDS bu ürünleri dinamik sunamıyor. Kontrol edilebilir son
maliyetler: GDS rezervasyon ücreti, kredi kartı kesintisi ve acente
ödemeleri, finans yöneticileri için bütçedeki en büyük dolaylı gider
kalemleri. Emtialaşma tehlikesi: havayolu yalnızca anonim bir koltuk
satmak istemiyor; temel ücretle yan hizmeti paketleyip perakendeciye
dönüşmek istiyor.

![Başlık: Havayolunun Açmazı, Geleneksel Sistem Neden Tıkanıyor? Ortada daire içinde koltuk simgesi, etrafında turuncu çerçeveli üç kutu. Gizli ek hizmetler: bagaj ve koltuk seçimi gibi yan hizmetler GDS'in tam içerik anlaşmalarına dahil değildir, GDS bu ürünleri dinamik olarak sunamaz. Kontrol edilebilir son maliyetler: GDS rezervasyon ücretleri, kredi kartı kesintileri ve acente ödemeleri, CFO'lar için bütçedeki en büyük dolaylı gider kalemleridir. Emtialaşma tehlikesi: havayolları sadece anonim bir koltuk satmak istemiyor, temel ücret ve yan hizmetleri paketleyerek perakendeciye dönüşmek istiyorlar.](/decks/ndc-retailing/05.webp "Ortadaki koltuk tek başına ve etiketsiz. Üç kutu aynı şikâyeti üç açıdan söylüyor: GDS bu koltuğa isim, bagaj ve fiyat farkı ekletmiyor.")

Yan hizmet sorusunun cevabı ilk kutuda. Havayolu bagaj, koltuk ve lounge
gibi ürünleri geleneksel GDS'ten satmak istemiyor çünkü tam içerik
anlaşmaları genellikle yan hizmeti kapsamıyor ve geleneksel modelde acente
de GDS de bu satıştan komisyon almıyor; yani kanalın bu ürünü satması için
hiçbir teşviki yok. NDC bu ürünlerin merchandising stratejisiyle
paketlenip satılmasını sağlıyor. Sadakat bölümündeki "emtia ürüne marka"
sorununun dağıtım tarafındaki hali bu: marka var, ama kanal onu
gösteremiyor.

## Dağıtımda kırılma: aracısızlaştırma ve sürşarj

Aracısızlaştırma tehdidi büyüyor: GDS'lerin tam içerik anlaşmaları
geçerliliğini yitirirken rezervasyonlar havayolunun doğrudan kanallarına
kayıyor. İki yol var. Düşük maliyetli havayolları (LCC), dolaylı dağıtım
maliyetinden kaçınmak için GDS'e hiç girmemeyi tercih ediyor ve doğrudan
kendi kanalından satıyor. Network havayolları ise acente üzerinden yapılan
GDS rezervasyonuna ek ücret (surcharge) yansıtarak trafiği doğrudan kanala
yönlendiriyor: 2015 Lufthansa başlattı, 2017 IAG (BA, Iberia) katıldı,
2018 Air France-KLM geçti, 2021 Singapore Airlines devreye aldı.

![Başlık: Dağıtımda Kırılma, Aracısızlaştırma (Disintermediation). Üstte kutu: aracısızlaştırma tehdidi büyüyor, GDS'lerin tam içerik anlaşmaları geçerliliğini yitirirken rezervasyonlar havayolunun doğrudan kanallarına kayıyor. Aşağıdan yukarıya iki ok ayrılıyor. Beyaz ok, düşük maliyetli havayolları (LCC): bütçe havayolları dolaylı dağıtım maliyetlerinden kaçınmak için GDS sistemlerine hiç girmemeyi tercih ediyor ve doğrudan kendi kanallarından satış yapıyor. Turuncu ok, network havayolları (geleneksel): acente üzerinden yapılan dolaylı GDS rezervasyonlarına ek ücret (surcharge) yansıtarak trafiği doğrudan kanallara yönlendirme stratejisi; 2015 Lufthansa ek ücret başlattı, 2017 IAG (BA, Iberia) katıldı, 2018 Air France KLM geçiş yaptı, 2021 Singapore Airlines devreye aldı.](/decks/ndc-retailing/06.webp "Beyaz ok hiç GDS'e girmeyenlerin, turuncu ok içindeyken çıkmaya çalışanların yolu. Turuncu okun yanındaki dört tarih, çıkışın altı yıl sürdüğünü ve hâlâ bitmediğini söylüyor.")

Kaynak metnin tanımı: aracısızlaştırma, GDS'i rezervasyon kanallarından
ve ücretlerinden devre dışı bırakacak teknoloji ve iş sürecidir. Sürşarj
mantığı: havayolu GDS rezervasyonuna ek ücret koyarak maliyeti acenteye ve
dolayısıyla yolcuya yansıtıyor; bu, acenteyi doğrudan bağlantıya ya da NDC
kanalına yönlendiren mali bir caydırıcı. Aracısızlaştırmanın havayolu için
iki hedefi var: rezervasyon ücretinden tasarruf ve müşteri verisiyle
teklif yönetimi üzerinde tam kontrol. GDS için sonucu, yalnızca
rezervasyon aracı olmaktan çıkıp çok kaynaklı içerik sağlayıcısına
dönüşme zorunluluğu.

## Paradigma değişimi: geleneksel GDS ile IATA NDC

Dört boyutta karşılaştırma. Fiyatlandırma gücü: GDS'te sistem tarifeleri
birleştirip teklifi kendisi hesaplar; NDC'de kontrol havayolunda, teklifi
kendi sisteminde dinamik oluşturur. İçerik kalitesi: GDS'te yalnızca temel
fiyat ve koltuk, emtia odaklı; NDC'de zengin içerik (görsel, video),
dinamik fiyatlandırma, kişiselleştirilmiş ürün. Ek hizmetler: GDS'te tam
içerik anlaşması dışında kalır, entegrasyonu ve satışı zordur; NDC'de
temel teklifin ayrılmaz parçası olarak doğrudan sunulur. Veri iletimi:
GDS'te eski nesil kısıtlı mesajlaşma altyapısı; NDC'de modern ve esnek
IATA NDC iletişim standardı.

![Başlık: Paradigma Değişimi, Geleneksel GDS ile IATA NDC. Solda GDS legacy, sağda airline OMS etiketleri, aralarında dört satırlı tablo. 1. Fiyatlandırma gücü: sistem tarifeleri birleştirip teklifi kendi hesaplar; karşısında kontrol havayolundadır, teklifi kendi sisteminde dinamik oluşturur. 2. İçerik kalitesi: sadece temel fiyat ve koltuk (emtia odaklı); karşısında zengin içerik (görsel, video), dinamik fiyatlandırma, kişiselleştirilmiş ürünler. 3. Ek hizmetler: tam içerik anlaşması dışında kalır, entegrasyonu ve satışı zordur; karşısında temel teklifin ayrılmaz bir parçası olarak doğrudan sunulur. 4. Veri iletimi: eski nesil kısıtlı mesajlaşma altyapısı; karşısında modern ve esnek IATA NDC iletişim standardı.](/decks/ndc-retailing/07.webp "Tablonun sağ sütununun başlığı airline OMS: order management system. NDC bir mesaj formatı değil, teklifi kuran sistemin hangi binada durduğunun cevabı.")

Fiyatlandırma gücü sorusunun cevabı ilk satırda. NDC öncesinde fiyat ve
tarife ATPCO gibi merkezi havuzlara yükleniyor ve GDS tarafından
fiyatlandırılıyordu; NDC ile havayolu kendi Host CRS'inde dinamik
fiyatlandırma yaparak teklifi (offer) kendisi oluşturur ve acenteye
iletir; kişiselleştirilmiş paket esnekliği buradan geliyor. Zengin içerik
sorusu ikinci satırda: GDS'in sınırlı metin tabanlı verisinin aksine NDC
üzerinden görsel, video ve detaylı hizmet açıklaması iletilebiliyor,
acente yolcuya daha iyi bir satış deneyimi sunuyor. Kaynak metnin
öngörüsü: NDC, dolaylı rezervasyon için fiyatlandırma gücünü GDS'ten
havayoluna kaydırdığı için tam içerik anlaşmalarını nihayetinde geçersiz
kılacak.

## Akış mimarisi: NDC ile işlem nasıl değişiyor

Yeni akışta müşteri ya da acente (OTA, TMC) havayolu sunucusuna (Host
CRS/OMS) doğrudan API ya da NDC bağlantısıyla ulaşıyor; sunucu
kişiselleştirilmiş, içi dolu teklifi (offer) üretiyor. GDS devreden
çıkmıyor ama rolü küçülüyor: yalnızca muhasebe için bir pasif segment
alıyor. GDS'e ihtiyaç duymadan doğrudan bağlantı; güzergâh üzerindeki bütün
değişiklik yetkisi tamamen havayolunun elinde.

![Başlık: Akış Mimarisi, NDC ile İşlemler Nasıl Değişiyor? Solda müşteri / acente (OTA, TMC) kutusu, turuncu kalın hatla doğrudan API / NDC bağlantısı etiketiyle ortadaki havayolu sunucusu (Host CRS/OMS) kutusuna bağlı; kutuda kişiselleştirilmiş içi dolu teklif (offer) üretimi. Sunucudan ince mavi hat sadece muhasebe için etiketiyle sağ alttaki GDS pasif segment kutusuna gidiyor. Sağ üstte turuncu kutu: GDS'e ihtiyaç duymadan doğrudan bağlantı, güzergâh üzerindeki tüm değişiklik yetkisi tamamen havayolunun elindedir.](/decks/ndc-retailing/08.webp "İki hattın kalınlığı rolleri anlatıyor: turuncu hat kalın, teklif oradan geçiyor; mavi hat ince, GDS'e yalnızca defter kaydı gidiyor.")

Pasif segment, acentenin arka ofisinin ve BSP mutabakatının hâlâ GDS
kaydına bağlı olmasının izi. Teklif ve sipariş havayolunda, ama acentenin
raporlama ve muhasebe zinciri GDS'teki kayıt üzerinden yürüyor; bu yüzden
NDC rezervasyonu bile GDS'te bir gölge bırakıyor. Endüstri standartları
bölümündeki takas odası zinciri değişmedi; yalnızca öndeki teklif üretimi
yer değiştirdi.

## Operasyonel devrim: ONE Order

Geleneksel modelde bir yolculuk üç kayıt: PNR (yolcu kaydı), e-bilet
(uçuş bedeli) ve EMD (ek hizmet belgesi). ONE Order üçünü tek bir müşteri
sipariş kaydında birleştiriyor. NDC programının ayrılmaz parçası; çoklu
rezervasyon kaydını ve karmaşık dokümanı ortadan kaldırıyor, ek hizmetin
(bagaj, koltuk) satışını ve yerine getirilmesini e-ticaret standardında
basitleştiriyor.

![Başlık: Operasyonel Devrim, ONE Order. Üstte üç kutu artı işaretleriyle: PNR (yolcu kaydı), e-bilet (uçuş bedeli), EMD (ek hizmet belgesi). Ortada aşağı bakan geniş turuncu ok, üzerinde dönüşüyor yazısı. Altta tek kutu: tek bir müşteri sipariş kaydı. En altta: NDC programının ayrılmaz parçası; çoklu rezervasyon kayıtlarını ve karmaşık dokümanları ortadan kaldırır; ek hizmetlerin (bagaj, koltuk) satışını ve yerine getirilmesini e-ticaret standartlarında basitleştirir.](/decks/ndc-retailing/09.webp "Üstteki üç kutu üç ayrı bölümün konusuydu: PNR bir sözleşme, e-bilet 1994'te veritabanı satırı oldu, EMD ek hizmetin belgesi. ONE Order üçünü tek satıra indirmeye çalışıyor.")

Karmaşık kaydı nasıl basitleştiriyor? Geleneksel modelde var olan PNR,
e-bilet ve EMD gibi çoklu kayıt yapılarını kaldırıp bütün veriyi tek
müşteri sipariş kaydında (single customer order record) birleştiriyor;
özellikle yan hizmetin takibi ve yerine getirilmesi kolaylaşıyor. "PNR
bir kayıt değil, bir sözleşme" bölümü o üç kaydın neden bu kadar zor
birleştiğini anlatacak; burada bilinmesi gereken, ONE Order'ın NDC'nin
teklif tarafının sipariş tarafındaki karşılığı olduğu.

## NDC benimseme ve sertifikasyon hunisi: dört seviye

Havayolları ve teknoloji sağlayıcıları IATA NDC siciline kaydolarak dört
seviyeyi tamamlıyor. Seviye 1, rezervasyon sonrası ek hizmetler: temel
e-ticaret başlangıcı. Seviye 2, teklif yönetimi: fiyat ve ürün kontrolünün
tamamen havayoluna geçmesi. Seviye 3, teklif ve sipariş yönetimi: satış ve
yerine getirme sistemlerinin entegrasyonu. Seviye 4, tam teklif ve sipariş
yönetimi: dijital perakendecilikte tam olgunluk.

![Başlık: NDC Benimseme ve Sertifikasyon Hunisi. Dört basamak yukarı doğru yükseliyor. Seviye 1, rezervasyon sonrası ek hizmetler: temel e-ticaret başlangıcı. Seviye 2 (açık mavi), teklif yönetimi: fiyat ve ürün kontrolünün tamamen havayoluna geçmesi. Seviye 3, teklif ve sipariş yönetimi: satış ve yerine getirme sistemlerinin entegrasyonu. Seviye 4 (turuncu, hedef simgesi), tam teklif ve sipariş yönetimi: dijital perakendecilikte tam olgunluk. Sağ altta not: havayolları ve teknoloji sağlayıcıları IATA NDC siciline kaydolarak bu seviyeleri tamamlar ve yeni nesil uçak bileti perakendeciliğinde kalıcı rekabet avantajı sağlar.](/decks/ndc-retailing/10.webp "İkinci basamak farklı renkte: fiyat kontrolünün havayoluna geçtiği yer. Birinci basamak bagaj satmak, ikincisi fiyatı kurmak; asıl kırılma orada.")

| Seviye | Tanım | İş mantığı |
|---|---|---|
| 1 | Post booking ancillaries | Rezervasyon sonrası yan hizmetlerin yönetimi |
| 2 | Offer management | Teklifin (güzergâh artı yan hizmet) havayolu tarafından oluşturulması |
| 3 | Offer ve order management | Teklif ve sipariş yönetiminin tam entegrasyonu |
| 4 | Full offer ve order management | Servis ve değişiklik yönetimi dahil bütün sürecin NDC üzerinden yürütülmesi |

## Yarın işe yarayacak üç çıkarım

1. **Havayolu için:** NDC dağıtım maliyetini düşürmek için zorunluluk,
   ama asıl getiri yan hizmet paketinde. Yalnızca bilet değil, bagaj,
   koltuk ve lounge'u paketleyip koltuk başına geliri artıran bir
   merchandising stratejisi kur; teklifi kuran sistem seninse, paketin
   içeriği de senin.
2. **Acente için:** Ön uç komisyon 1995'te kırıldı ve geri gelmiyor.
   Gelir modelini hizmet bedeline ve yüksek marjlı net ücret satışına
   kaydır; NDC uyumlu sisteme geçmeden zengin içeriğe ve kişiselleştirilmiş
   teklife erişemezsin, yani müşterine gösterecek ürünün olmaz.
3. **GDS için:** Geleneksel model sürşarjla ve doğrudan bağlantıyla
   kemiriliyor. Hayatta kalma yolu kaynak bağımsız (source agnostic) içerik
   sağlayıcısına dönüşmek: havayolunun NDC içeriğini de platforma entegre
   et, aksi halde pasif segment kaydından fazlası kalmaz.

Bu bölümde ne yok: NDC'nin on yılı aşkın süredir neden hâlâ dört seviyenin
tepesine çıkamadığı ve kavganın teknik değil ticari tarafı ("NDC:
dağıtımı kim kontrol ediyor") ve ONE Order'ın birleştirmeye çalıştığı
PNR'ın neden bu kadar dirençli olduğu ("PNR bir kayıt değil, bir
sözleşme"). Bu bölümdeki turuncu okun iki ucu o iki bölüm.
