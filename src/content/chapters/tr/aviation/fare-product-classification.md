---
title: "Havacılık ücret ürünlerinin sınıflandırılması: stratejik analiz ve iş mantığı"
domain: "aviation"
summary: "Bir ücreti sınıflandıran şey fiyatı değil, kimin satabildiği ve kimin alabildiği. Açık ücretler bütün GDS'lerde herkese görünür; özel ve pazarlıklı ücretler ATPCO kategorileriyle (CAT 1, 15, 25, 35) kilitlenir, kuralla üretilir ve net tutar üzerinden BSP'de uzlaşılır. Bu bölüm o kategorilerin iş mantığını ve havayolunun nihai fiyat üzerindeki kontrolü neden kaybettiğini anlatıyor."
audience: "Fiyatlandırma motoru, teklif (offer) üretimi, biletleme ya da sipariş yönetimi sistemleri üzerinde çalışan, arama sonucunda bir ücretin neden çıkıp neden çıkmadığını anlamak isteyen yazılımcı ve ürün insanı. Dağıtım bölümlerinin okunmuş olması işe yarar; ATPCO kategorileri, Record 8, RBD, net remit ve BSP metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Önceki bölümler fiyatın kimin elinde olduğunu tartıştı: acente ekonomisi,
komisyonun kesilmesi, NDC ile fiyat gücünün havayoluna dönmesi. Bu bölüm o
tartışmanın altındaki veri modeline iniyor. **Bir ücret ürününü
sınıflandıran şey fiyatı değil, kimin satabildiği ve kimin satın
alabildiği.** Aynı uçuşun aynı koltuğu bir acentenin ekranında bir fiyatla,
bir kurumsal müşterinin ekranında başka bir fiyatla, bir toptancının
veritabanında üçüncü bir net rakamla duruyor. Bu farkları üreten şey bir
fiyat listesi değil, sırayla ayrıştırılan bir kategori sistemi.

![Sunumun kapak slaytı. Başlık: Havayolu Ücret Ürünlerinin Sınıflandırılması. Alt başlık: Açık Ücretler, Özel Tarife Mantığı ve ATPCO Kategori Sistemleri. Ortada bir biletin teknik çizimi: Origin alanında ORG / DET, Flight alanında FL187, Fare base alanında SIRE/130; biletin üzerinden oklar, anahtar kutuları ve dallanan hatlarla bir devre şeması geçiyor. Sağ altta uzman notu: alan havayolu fiyatlandırması ve teklif üretimi; bu mimari, sektör tamamen NDC ve sürekli fiyatlandırma modeline geçmeden önceki küresel havacılık dağıtımının temelidir; seyahat teknolojisi mühendisleri ve ürün yöneticileri için arama motoru yanıtlarını yöneten kuralların anlaşılması kritiktir.](/decks/fare-product-classification/01.webp "Biletin üzerindeki fare base alanı masum görünüyor, ama arkasındaki devre şeması o tek kodun hangi kurallardan geçerek oraya yazıldığını anlatıyor.")

## Üç ürün, üç ayrı erişim sözleşmesi

Havacılık fiyatlandırmasında temelde üç ücret ürünü var: açık (public)
ücretler, özel (private) ücretler ve web ücretleri. Ayrım fiyat düzeyine
göre yapılmıyor. Açık ücretler dünya genelinde bütün GDS'ler üzerinden
erişilebiliyor ve bütün müşteri segmentlerine açık. Özel ücretler özel
tarifeler altında yaratılıyor, sınırlı dağıtıma tabi ve belirli erişim
kurallarıyla korunuyor; kurumsal anlaşmalar ya da acente pazarlıkları
çerçevesinde belirli segmentlere kapalı bir satış kanalı gibi çalışıyor.
Web ücretleri ise doğrudan dijital kanallara özel ürünler.

Yazılım tarafında bunun karşılığı şu: kullanıcı uçuş aradığında
fiyatlandırma motoru bir teklif oluşturmak için bu tarifelerin hepsini
sorguluyor ve her birine ayrı bir soru soruyor. Açık ücrete "bu uçuş için
geçerli mi" diye soruyor; özel ücrete ayrıca "bu isteği yapan kim, bu
ücreti görmeye yetkisi var mı" diye soruyor. Sunumun uzman notu bu ayrımın
PSS içinde karmaşık kural motorlarını zorunlu kıldığını söylüyor. Yani
özel ücret, açık ücrete eklenmiş bir indirim alanı değil; kendi erişim
mantığı olan ayrı bir ürün.

![Başlık: Havayolu Fiyatlandırma Evreni. Dört sütun. Solda uzman notları: alan varlıkları Public Fares, Private Fares, Web Fares; akış AirShopping, bir kullanıcı uçuş aradığında fiyatlandırma motoru bir teklif oluşturmak için bu tarifeleri sorgular; içgörü, bu ücretler arasındaki kesin ayrım PSS içindeki karmaşık kural motorlarını zorunlu kılar. Mavi başlıklı Açık Ücretler (Public Fares) sütunu: tüm GDS'ler üzerinden dünya çapında erişilebilir; tüm müşteri segmentlerine açıktır. Turuncu başlıklı Özel Ücretler (Private Fares) sütunu: özel tarifeler altında yaratılır; sınırlı dağıtım ve spesifik erişim kurallarıyla (ATPCO) korunur. Soluk, kesikli çerçeveli Web Ücretleri (Web Fares) sütunu: doğrudan dijital kanallara özel ürünler.](/decks/fare-product-classification/02.webp "Web ücretleri sütunu soluk çizilmiş: sunum onları anıp geçiyor, asıl gerilim ilk iki sütun arasında.")

## Açık ücret şeffaf, çünkü parası brütten akıyor

Açık ücretin hattı düz. Havayolu ücreti yüklüyor (filing), ATPCO gibi fiyat
dağıtım sağlayıcıları onu GDS'lere taşıyor, GDS acenteye, acente yolcuya
sunuyor. Sistemde bu ücretlerin adı yayınlanmış (published), brüt (gross)
ya da IATA ücretleri. Sunumun notuna göre ATPCO her gün milyonlarca tarife
güncellemesini işliyor ve GDS'lere saatlik abonelikler gönderiyor; eski
sistemlerde bu veri tabanı alışveriş (shopping) motorunun omurgası.

Para da aynı hattın tersinden dönüyor. Biletin üzerinde brüt ücret yazıyor,
acente varsa standart komisyonunu kesiyor ve kalan net tutarı havayoluna
iletiyor. Açık ücretin şeffaflığı buradan geliyor: herkesin gördüğü rakamla
biletin üzerindeki rakam aynı, havayolunun alacağı da o rakamdan standart
bir kesintiyle hesaplanıyor.

![Başlık: Açık Ücretler, Standart Dağıtım Hattı. Soldan sağa beş kutu oklarla bağlı: Havayolu, Fiyat Dağıtım Sağlayıcıları / ATPCO, GDS, Acenteler, Yolcu. Altta açıklama kutusu: sistemdeki adı yayınlanmış ücretler (Published), brüt ücretler (Gross) veya IATA ücretleri; erişim küresel, havayolu tarafından yüklenir (filed), GDS'ler aracılığıyla herkese sunulur. Yolcudan havayoluna geri dönen kalın turuncu ok: finansal akış, biletin üzerinde brüt ücret yazar, acente standart komisyonunu (varsa) keser ve kalan net tutarı havayoluna iletir. Sağ altta uzman notu: terimler GDS (Amadeus, Sabre vb.), Gross Fare, Net Fare, Filing; ATPCO her gün milyonlarca tarife güncellemesi işler ve GDS'lere saatlik abonelikler gönderir; eski sistemlerde bu veri tabanı alışveriş motorunun omurgasıdır.](/decks/fare-product-classification/03.webp "Ücret soldan sağa, para sağdan sola akıyor. Özel ücretlerde bu iki akışın tutarları birbirinden ayrılacak.")

## Özel ücreti özel kılan dört kategori

Özel ücretin temeli sınırlı dağıtım ve bu sınırlar ATPCO kategori sistemiyle
yönetiliyor. Dört kategori işin çoğunu taşıyor. CAT 15 satış güvenliği:
bu ücreti kim satabilir, biletleme ve satış kısıtlamaları. CAT 1 alıcı
kuralları: bu ücreti kim alabilir, yani müşteri profili. CAT 25 kurala bağlı
ücret (fare-by-rule, FBR): yeni ücretler ve indirimler yaratan fiyat
motoru. CAT 35 müzakere edilmiş ücretler: kâr marjları, komisyonlar ve
gelişmiş güvenlik.

Özel statünün mantığı ilk ikisinin birleşiminden çıkıyor. Sistem CAT 15
ya da CAT 35 verisiyle kimin satabileceğini, CAT 1 kurallarıyla kimin
satın alabileceğini denetliyor. Satan acente ya da alan yolcu bu
kriterlerden birini karşılamıyorsa fiyatlandırma motoru o ücreti hiç
sunmuyor. Ücret reddedilmiyor, görünmüyor. Bu fark hata ayıklarken önemli:
"bu kurumsal ücret neden gelmedi" sorusunun cevabı çoğu zaman fiyatta değil,
isteğin kimliğinde.

![Başlık: Özel Ücretlerin Anatomisi, Kısıtlama Kodları. Alt başlık: özel ücretlerin temeli sınırlı dağıtımdır, bu sınırlar ATPCO kategori sistemi ile yönetilir. Dört kutu. Kalkan simgeli CAT 15 Satış Güvenliği: bu ücreti kim satabilir (ticketing ve satış kısıtlamaları). El sıkışma simgeli CAT 35 Müzakere Edilmiş Ücretler: kâr marjları, komisyonlar ve gelişmiş güvenlik. İnsan simgeli CAT 1 Alıcı Kuralları: bu ücreti kim alabilir (müşteri profili). Dişli simgeli CAT 25 Kurala Bağlı Ücret (FBR): yeni ücretler ve indirimler yaratan dinamik fiyat motoru. Altta mühendisler için uzman notu: ATPCO kategori mantığı devasa bir kural motorudur; bir fiyatlandırma algoritması belirli bir PNR'ın uygunluğunu doğrulamak için bu kategorileri sırayla ayrıştırır; CAT 35, CAT 15 güvenliğini geçersiz kılabilir (override).](/decks/fare-product-classification/04.webp "Üst sıra satış tarafını, alt sıra alıcı ve üretim tarafını anlatıyor. Alttaki nottaki sırayla kelimesi, motorun bunları paralel değil art arda değerlendirdiğini söylüyor.")

İki güvenlik kategorisi aynı ücrette bulunabiliyor ve öncelik kuralı net:
CAT 35 güvenliği varsa CAT 15 güvenliğinin yerini alıyor. Ama CAT 15
tamamen düşmüyor; biletleme tarihi ve satış kısıtlamalarını zorunlu kılmak
için yardımcı kural olarak kullanılmaya devam edebiliyor. Kural motoru
yazan biri için bu, iki kaynağın basitçe birleştirilmediği bir örnek:
yetki kontrolünde biri diğerini eziyor, tarih ve satış kısıtında ikisi
birlikte okunuyor. Bu öncelik veri modelinde açıkça temsil edilmezse, test
ortamında çalışan bir ücret canlıda yanlış acenteye görünür ya da doğru
acenteden kaybolur.

## Kurumsal ücret bir tablo değil, bir türetme

Kurumsal ücretler genellikle CAT 25 mantığıyla üretiliyor. Mekanizma ayrı
bir fiyat tablosu tutmak yerine piyasadaki mevcut bir açık ücretten yola
çıkıyor. Sistem Record 8 (Fare by Rule Index) verisini bir işaretçi olarak
kullanıyor: bu indeks üzerinden belirli bir açık ücrete, örneğin yetişkin
(ADT) temel ücretine, indirim uygulanıyor ya da mevcut kurallar geçersiz
kılınarak yeni bir ücret sınıfı oluşturuluyor. Sunuma göre kurumsal
ücretler bir teklif isteği (RFQ) süreciyle değil, arka planda otomatik
hesaplanıyor; orijinal açık ücretin kuralları korunabiliyor, ezilebiliyor
ya da birleştirilebiliyor.

Yazılım tarafında bunun karşılığı bir bağımlılık grafiği. Kurumsal ücret
kendi başına saklanan bir değer değil, başka bir kaydın türevi. Temel açık
ücret değiştiğinde türetilmiş ücret de değişiyor; temel ücret geri
çekildiğinde türetilmiş ücretin dayanacağı bir şey kalmıyor. Kurumsal ücreti
önbelleğe alan bir sistem, kaynağını da izlemek zorunda.

![Başlık: Kurumsal Ücretler ve CAT 25 Kural Motoru. Solda Açık Ücret (örnek: Yetişkin Temel Ücreti) kutusu, okla CAT 25 İşlem Modülü'ne bağlanıyor; modülün içinde CAT 25 (Fare-by-Rule) Motoru ve onun içinde Record 8 (FBR Index) Pointer kutusu. Modülden çıkan ok Kurumsal Ücret kutusuna gidiyor. Altta mekanizma: kurumsal ücretler RFQ süreciyle değil arka planda otomatik hesaplanır; orijinal açık ücretin kuralları korunabilir, ezilebilir veya birleştirilebilir. Sağda turuncu uyarı kutusu, Paradoks (Sınıf Kısıtlaması): bazen piyasadaki en düşük açık ücret en düşük kurumsal ücretten daha ucuz olabilir; neden, CAT 25 indirimleri her rezervasyon sınıfında (RBD) geçerli değildir, genellikle sadece yüksek fiyatlı (üst) sınıflara uygulanır. Altta uzman notu: terimler PTC, RBD, Record 8; akışlar fiyat/teklif hesaplama, envanter yönetimi; kurumsal indirimler genellikle indirimli sınıfları (O, G) hariç tutarak sadece Y veya B gibi üst sınıflara uygulanır.](/decks/fare-product-classification/05.webp "Uyarı kutusu, kurumsal müşterinin en sık sorduğu soruya cevap veriyor: anlaşmalı fiyatım neden internettekinden pahalı?")

## İndirimli kurumsal ücret açık ücretten pahalı olabilir

Bu türetmenin sonucu, ilk bakışta hata gibi görünen bir paradoks. Kaynak
metin kurumsal indirimin bütün rezervasyon sınıflarında (RBD) geçerli
olmadığını, genellikle hiyerarşideki daha yüksek RBD'lerle sınırlı
kaldığını söylüyor. Sunumun notu somutlaştırıyor: kurumsal indirimler
genellikle O ve G gibi indirimli sınıfları hariç tutup yalnızca Y ya da B
gibi üst sınıflara uygulanıyor.

Sonuç şu: alt sınıfta kamuya açık ucuz bir koltuk varsa, o koltuk indirim
uygulanmış üst sınıf kurumsal koltuktan daha ucuz çıkıyor. Kurumsal ücret
kendi sınıfına göre gerçekten indirimli, ama en ucuz açık ücrete göre
değil. Gelir yönetimi bölümlerinde anlatılan iç içe sınıf yapısı burada
geri dönüyor: indirimin hangi sınıfa bağlandığı, indirimin oranından daha
belirleyici. Bir teklif motoru kurumsal müşteriye yalnızca kurumsal ücreti
gösteriyorsa, müşteri bu paradoksu kendisi keşfediyor ve anlaşmaya olan
güveni aşınıyor.

## Pazarlıklı ücrette havayolu net fiyatı biliyor, satış fiyatını bilmiyor

Pazarlık usulü (negotiated) ücretler havayolu ile toptancılar ya da
acenteler arasındaki net fiyat anlaşmalarına dayanıyor. Havayolu bir net
fiyat belirliyor, acente bunun üzerine kendi kâr marjını (markup) ekleyerek
satıyor. Kaynak metin bu ücretlerin genellikle toptancılar, tur
operatörleri ve seyahat acenteleri aracılığıyla satıldığını vurguluyor;
yani perakende pazar için değil, net fiyat odaklı ara kanallar için
tasarlanmışlar.

Sunum bu alanın kaç farklı adla anıldığını da gösteriyor: off-tariff, net,
konsolidatör, gri pazar, yayınlanmamış (unpublished) ve bucket ücretler.
Hepsinin ortak noktası havayolu ile acente ya da konsolidatör arasındaki
gizli sözleşme. Ağ iki katmanlı: havayolu gizli sözleşmeyle tur
operatörlerine ve toptancılara bağlanıyor, onlar da perakende acentelere
dağıtıyor; perakende acente net ücretin üzerine kendi marjını ekliyor.
Acenteler bu sözleşmeleri abone oldukları GDS'in pazarlıklı ücret
veritabanına yükleyerek yönetiyor. Sunumun uzman notu işin bedelini tek
cümleyle söylüyor: havayolu bu süreçte son kullanıcıya sunulan perakende
fiyatın görünürlüğünü kaybediyor.

![Başlık: Müzakere Edilmiş Ücretler (CAT 35 ve Ağ Yapısı). Solda konsept: havayolu ile acente/konsolidatör arasındaki gizli sözleşmelerdir; üretim için CAT 25, kâr marjı ve güvenlik için CAT 35 birlikte çalışır. Altında basamak gibi dizilmiş altı etiket: Off-tariff, Net fares, Consolidator fares, Gray market fares, Unpublished fares, Bucket fares. Sol altta uzman notu: terimler Net Remit, Mark-up, Markdown; havayolu bu süreçte son kullanıcıya sunulan perakende fiyat görünürlüğünü kaybeder. Sağda ağaç şeması: Havayolu, iki gizli sözleşme okuyla Tur Operatörleri ve Toptancılar (Wholesalers) kutularına bağlanıyor; her biri altındaki Acenteler (Retail) kutusuna iniyor; perakende acenteye giden okta not, net ücretin üzerine kendi marjını ekler. Sağ altta sistem entegrasyonu: acenteler sözleşmeleri abone oldukları GDS'in negotiated fares veritabanına yükleyerek yönetir.](/decks/fare-product-classification/06.webp "Altı ayrı ad aynı yapıyı anlatıyor. Sağdaki ağaçta havayolunun gördüğü son kutu toptancı; perakende fiyat bir kat aşağıda oluşuyor.")

## İndirim ve marj iki ayrı kategoride hesaplanıyor

Havayolu bir acenteye hem indirim hem komisyon tanımlamak istediğinde iki
kategori art arda çalışıyor. Sunumun ifadesiyle üretim için CAT 25, kâr
marjı ve güvenlik için CAT 35. Sistem önce CAT 25 ile açık ücret üzerinden
indirimi hesaplıyor, ardından CAT 35 ile indirimli tutarın üzerine acente
için bir marj ya da satış komisyonu ekliyor. Brifing örnekte yüzde 10
indirim ve yüzde 1 komisyon veriyor; sunumdaki şelale grafiği aynı sırayı
yüzde 5'lik bir marjla somutlaştırıyor.

Grafiğin rakamları şöyle: 1.000 dolarlık açık ücretten CAT 25 ile yüzde
10, yani 100 dolar indirim düşülüyor ve havayolunun tahsilatı olan 900
dolarlık net ücret kalıyor. CAT 35 ile yüzde 5, yani 45 dolar acente marjı
ekleniyor ve müşteri 945 dolar ödüyor. Sunumun özetine göre havayolu yüksek
değerli bileti satıyor, müşteri 55 dolar indirim kazanıyor, acente 45 dolar
kâr ediyor.

![Başlık: Finansal Örnek, Fiyat Şelalesi. Beş çubuklu şelale grafiği (dikey eksen etiketleri bozuk basılmış). Başlangıç (Açık Ücret) 1000 dolar; CAT 25 (FBR indirimi yüzde 10) eksi 100 dolar; Net Ücret (Havayolunun Tahsilatı) 900 dolar; CAT 35 (Acente Kâr Marjı yüzde 5) artı 45 dolar; Müşterinin Ödediği Toplam 945 dolar. Altta sonuç: havayolu yüksek değerli bileti satar, müşteri 55 dolar indirim kazanır, acente 45 dolar kâr eder. Sağ altta uzman notu: akışlar Pricing, Distribution, Revenue Accounting; Brezilya (acente/havayolu doğrudan model) istisnası, CAT 35 CAT 25'i ezebilir, böylece havayolu doğrudan müşteriye satar ancak acente hâlâ tanımlı bir komisyon alır.](/decks/fare-product-classification/07.webp "Üç tarafın üç ayrı rakamı var: havayolu 900, acente 45, müşteri 945 görüyor. Biletin üzerindeki brüt ücret bunların hiçbirini tek başına anlatmıyor.")

Sıranın önemi burada: marj indirimli tutarın üzerine ekleniyor, açık
ücretin üzerine değil. Aynı yüzdeler ters sırayla uygulanırsa her üç
tarafın rakamı değişiyor. Sunumun notu bir istisnayı da kaydediyor:
Brezilya'daki acente-havayolu doğrudan modelde CAT 35, CAT 25'i ezebiliyor;
havayolu müşteriye doğrudan satarken acente yine tanımlı bir komisyon
alıyor. Yani iki kategorinin ilişkisi evrensel sabit bir sıra değil, pazara
göre değişebilen bir kural. Fiyatlandırma kodunda bu sıra sabit
kodlanmışsa, ilk istisna pazarında yanlış hesap yapıyor.

## Para net tutar üzerinden, BSP'de uzlaşıyor

Satış gerçekleştiğinde ödemenin yönetimi BSP (Billing and Settlement Plan)
üzerinden yapılıyor. Pazarlıklı ücrette akış üç adım: yolcu acenteye net
ücret artı marjı ödüyor, acente havayolu ile anlaştığı net tutarı, marj
hariç, BSP üzerinden havayoluna iletiyor, kalan kısım acentede kalıyor.
Sunumun notuna göre BSP bir IATA sistemi ve küresel bir finansal takas
odası işlevi görüyor; net remit programları tamamen BSP raporlamasına
bağımlı.

Açık ücretle farkı sentez tablosu açıkça koyuyor: açık ücrette finansal
akış brüt üzerinden standart komisyon, özel ücrette net tutar üzerinden BSP
mutabakatı. Sipariş yönetimi ve biletleme sistemi yazan biri için bunun
anlamı, biletin üzerindeki tutarın gelir muhasebesi için yeterli olmaması.
Havayolunun gerçekte ne alacağını bilmek için bilet kaydının yanında
anlaşmanın net tutarı da taşınmak zorunda.

![Başlık: Para Akışı ve BSP Sistemi (Settlement). Döngüsel şema: Yolcu, Acente, BSP (Billing and Settlement Plan) ve Havayolu. Yolcudan acenteye ok, Adım 2: Tahsilat (Net Ücret artı Kâr Marjı). Acenteden BSP'ye para akışı oku. BSP'den yukarı ok, Adım 3: Net Tutar Havayoluna Aktarılır. BSP'den acenteye geri dönen ok: kalan kısım (marj) acentede kalır. Sağda mekanizma: satış gerçekleştiğinde ödemelerin yönetimi BSP üzerinden yapılır; acente müşteri tahsilatından havayolu için anlaşılan net tutarı BSP aracılığıyla havayoluna iletir. Altta uzman notu: BSP bir IATA sistemidir; sipariş yönetimi ve biletleme sistemleri inşa eden mühendisler için BSP'yi anlamak kritiktir; küresel finansal takas odası işlevi görür; net remit programları tamamen BSP raporlamasına bağımlıdır.](/decks/fare-product-classification/08.webp "Havayolu döngünün en üstünde ama yolcuyla arasında doğrudan bir ok yok. Bildiği tek rakam BSP'den gelen net tutar.")

## Kontrol kaybı gelir kaybına dönüşüyor

Özel ücret modelinin bedeli üç başlıkta toplanıyor. Birincisi kanal
çatışması: acenteler elde ettikleri fiyat avantajıyla havayolunun kendi
doğrudan satış kanallarıyla rekabet eder hale geliyor. İkincisi gelir
seyrelmesi (revenue dilution). Kaynak metin net/net ücreti bilmenin ve
yönetmenin önemli olduğunu, çünkü brüt ücretlerin havayolunun ne alacağını
temsil etmediğini söylüyor; komisyonlar düşüldükten sonraki gerçek gelir
bazı durumlarda brüt ücretin yüzde 40'ına kadar inebiliyor. Üçüncüsü fiyat
kontrolünün kaybı: son kullanıcıya sunulan perakende fiyat tamamen
acentenin kontrolünde ve havayolu görünürlüğü kaybediyor.

Sunum bu modelin özellikle Asya-Pasifik, Latin Amerika ve Orta Doğu'da
yaygın olduğunu not ediyor. Uzman notu bağlantıyı önceki bölümlere
kuruyor: bu kontrol kaybı ve gelir azalması, havayollarının NDC'ye geçmek
için bu kadar baskı yapmasının birincil nedeni; NDC aracı kâr marjlarını
atlayarak kontrolü geri alıyor.

![Başlık: Özel Ücretlerin Havayolları İçin Stratejik Zorlukları. Solda noktalı bir dünya haritası; Latin Amerika, Orta Doğu ve Asya-Pasifik turuncuyla vurgulu. Altında bağlam: bu model özellikle Asya/Pasifik, Latin Amerika ve Orta Doğu'da oldukça yaygındır ve bazı kritik riskler taşır. Sağda üç uyarı kutusu. Kanal Çatışması (Channel Conflict): acenteler elde ettikleri fiyat avantajı ile havayolunun kendi direkt satış kanallarıyla rekabet eder hale gelir. Gelir Kaybı (Revenue Dilution): net/net ücretler (komisyonlar düşüldükten sonraki gerçek gelir) orijinal brüt ücretin yüzde 40'ına kadar düşebilir. Fiyat Kontrolünün Kaybı: son kullanıcıya sunulan nihai satış fiyatı (retail price) tamamen acentenin kontrolündedir, havayolu görünürlüğü kaybeder. Altta uzman notu: bu kontrol kaybı ve gelir azalması havayollarının NDC'ye geçmek için bu kadar baskı yapmasının birincil nedenidir; NDC aracı kâr marjlarını bypass ederek kontrolü geri alır.](/decks/fare-product-classification/09.webp "Ortadaki kutu diğer ikisinin sonucu: kanal çatışması ve fiyat kontrolünün kaybı, en sonunda gelir tablosunda yüzde 40'a kadar inen bir net rakam olarak görünüyor.")

Brifingin önerdiği iş kuralı kontrolü tamamen geri almak değil, sınırlamak:
havayolu net/net ücretleri izlemeli ve acente marj oranlarını belirli
aralıklarla (range) sınırlamalı. Böylece gelir seyrelmesi ve kanal
çatışması en aza indiriliyor. Yazılım tarafında bu, CAT 35 kaydında marjı
serbest bir alan olarak değil, alt ve üst sınırı olan bir parametre olarak
modellemek demek.

## İki mimari, iki ayrı sorumluluk dağılımı

Sentez tablosu iki ürünü beş eksende yan yana koyuyor. Erişim ve dağıtımda
açık ücret küresel GDS üzerinden herkese açık, özel ücret CAT 15 ve 35 ile
korunuyor. Fiyatı açık ücrette doğrudan havayolu belirliyor, özel ücrette
havayolu kuralları (CAT 25) artı acente marjı. Görünen fiyat açık ücrette
biletteki brüt ücret, özel ücrette net ücret artı marj. Altyapı açık
ücrette standart tarife yüklemeleri, özel ücrette CAT 25 ve CAT 35 kural
motorları. Finansal akış da yukarıda anlatıldığı gibi brüt üzerinden
komisyon ile net üzerinden BSP mutabakatı arasında ayrılıyor.

Tablonun satırları aslında bir sorumluluk haritası: açık ücrette her satırın
sahibi havayolu, özel ücrette her satırda en az bir aracı var. Sunumun
kapanış notu bu yapıya hakkını veriyor: eski havayolu teknolojisi bu ayrık
kod bloklarıyla karmaşık ama işleyen bir küresel pazar kurdu, ve eski tarife
ekosisteminden teklif ve sipariş (offers and orders) tabanlı modern
perakendeciliğe geçiş bugün havacılıktaki en büyük teknolojik dönüşüm.

![Başlık: Sentez, Fiyatlandırma Mimarisi Karşılaştırması. İki sütunlu tablo, mavi başlıklı Açık Ücretler (Public Fares) ve turuncu başlıklı Özel Ücretler (Private Fares). Erişim ve dağıtım: herkese açık (küresel GDS) ile sınırlı ve kısıtlı (CAT 15/35 ile korunur). Fiyat belirleyici: doğrudan havayolu ile havayolu kuralları (CAT 25) artı acente marjı. Görünen fiyat: biletteki brüt ücret (Gross) ile net ücret artı kâr marjı (Net Remit). Kullanılan altyapı: standart tarife yüklemeleri ile CAT 25 (FBR) ve CAT 35 kural motorları. Finansal akış: brüt üzerinden standart komisyon ile net tutar üzerinden BSP mutabakatı. Altta uzman notu: eski havayolu teknolojisi bu ayrık kod bloklarını kullanarak karmaşık ama işleyen bir küresel pazar yarattı; eski tarife ekosisteminden modern perakendeciliğe (Offers and Orders) geçiş bugün havacılıktaki en büyük teknolojik dönüşümdür.](/decks/fare-product-classification/10.webp "Sağ sütunun her hücresinde havayolundan başka bir aktör geçiyor. NDC'nin geri almaya çalıştığı şey tam olarak bu sütun.")

## Yarın işe yarayacak dört çıkarım

1. **Erişim kategorilerinin önceliğini açıkça modelle.** Kimin
   satabileceğini CAT 15 ya da CAT 35 ile, kimin alabileceğini CAT 1 ile
   denetle. İkisi bir arada olduğunda CAT 35 güvenliğini esas al, CAT 15'i
   biletleme tarihi ve satış kısıtları için yardımcı kural olarak tut. Bir
   ücret aramada çıkmıyorsa önce isteğin kimliğine bak.
2. **Kurumsal ücreti türetilmiş bir kayıt olarak ele al.** CAT 25 ücreti
   Record 8 işaretçisiyle bir açık ücrete bağlı; kaynağı izlemeden onu
   önbelleğe alma. İndirimin hangi RBD'lere bağlandığını kontrol et ve alt
   sınıftaki açık ücretin kurumsal ücretten ucuz çıkabileceğini teklif
   ekranında hesaba kat.
3. **İndirim ve marjı sırayla, pazar kuralıyla hesapla.** Önce CAT 25
   indirimi, sonra CAT 35 marjı; ama bu sırayı sabit kodlama, Brezilya
   örneğindeki gibi CAT 35'in CAT 25'i ezdiği pazarlar var.
4. **Brüt ücrete değil net/net ücrete bak, marjı aralıkla sınırla.** Gelir
   raporunu biletteki brüt tutardan değil BSP'den dönen net tutardan kur;
   gerçek gelir brütün yüzde 40'ına kadar inebiliyor. Acente marjını
   sınırları olan bir parametre olarak tanımla ki kanal çatışması ve gelir
   seyrelmesi kontrol altında kalsın.

Bu bölümde ne yok: acente komisyonunun tarihi ve NDC'nin bu modele cevabı
("Seyahat dağıtım ekosistemi ve yeni dağıtım yeteneği (NDC) analizi" ve
"NDC@Scale"), ATPCO ve BSP gibi kurumların sektördeki yeri ("Havacılık
endüstri standartları ve yönetişim"), rezervasyon sınıflarının iç içe
yapısını kuran mekanizma (gelir yönetimi bölümleri). Bu bölüm, o
yapıların üzerinde bir ücretin nasıl sınıflandırılıp kime göründüğünü
anlatmak için var.
