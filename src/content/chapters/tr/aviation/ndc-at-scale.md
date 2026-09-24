---
title: "NDC@Scale: havacılık dağıtım kanallarında dönüşüm ve iş mantığı analizi"
domain: "aviation"
summary: "Fiyatlandırma gücü havayoluna geçince hesaplama yükü de geçti: 2019'da tek başına Sabre üzerinden günde 675 milyondan fazla uçuş araması yapılıyordu ve bu trafik artık havayolunun kendi sistemine vuruyor. Bu bölüm GDS'in varoluşsal tercihini, agregatörlerin açtığı boşluğu, satın almanın neden TPF'den çıkış yolu olduğunu ve şeffaflığın yerini alan normalizasyon problemini anlatıyor."
audience: "NDC API'si yazan, L2B trafiğini ölçeklendiren ya da farklı havayollarının tekliflerini tek ekranda karşılaştırmaya çalışan yazılımcı ve ürün insanı. Önceki bölüm okunmuş olmalı; L2B, normalizasyon, agregatör ve strangler fig metnin içinde tanımlanıyor."
pubDate: 2026-09-24
topics: [solution-architecture, scale-and-performance]
ai: generated
---

Önceki bölüm NDC'yi dört sertifikasyon seviyesiyle bırakmıştı: ikinci
basamakta fiyat kontrolü havayoluna geçiyor. Bu bölüm o cümlenin faturasını
anlatıyor. **Fiyatı kuran taraf, fiyatı hesaplayan makineyi de devralır.**
2019'da tek başına Sabre üzerinden günde 675 milyondan fazla uçuş araması
yapılıyordu ve bu aramaların çok büyük kısmı hiçbir zaman rezervasyona
dönüşmüyordu. Geleneksel dünyada o maliyeti GDS ana bilgisayarları
üstleniyordu; NDC ile aynı trafik havayolunun kendi sistemine vuruyor.
Aynı kayma GDS için varoluşsal bir tercih, müşteri için de şeffaflığın
sonu demek.

![Sunumun kapak slaytı. Başlık: Havacılık Dağıtımında Yeni Dönem, NDC@Scale. Alt başlık: GDS'lerin dönüşümü, yeni agregatörler ve değişen müşteri deneyimi. Ortada mavi kesikli çerçeve içinde legacy GDS kutusu ve EDIFACT protokolü etiketi; sağda turuncu daire, havayolu, NDC API provider etiketiyle. Soldan sağa turuncu doğrudan bağlantı hatları üç aktöre gidiyor: yeni nesil agregatör (XML/JSON), online seyahat acentesi (dynamic offer), kurumsal seyahat platformu (rich content); hatların üstünde offer and order management yazısı. Üstte gri ok: modern perakendecilik dönüşümü. Sağda alan notları: NDC, IATA'nın XML tabanlı veri iletim standardıdır, endüstriyi eski EDIFACT protokollerinden uzaklaştırır; nihai amacı havayolu web siteleri ile seyahat acenteleri arasındaki teknolojik uçurumu kapatarak modern perakendeciliğin önünü açmaktır.](/decks/ndc-at-scale/01.webp "Turuncu hatlar GDS kutusunun içinden değil, etrafından dolaşıyor. Kutu hâlâ orada ama artık trafiğin üzerinden geçtiği yer değil.")

## Fiyatlandırma gücü terazinin öbür ucuna geçti

Eski modelde fiyatlandırma ve uçuş arama algoritmaları GDS altyapısına
aitti; GDS kendi hesaplama gücüyle teklifleri oluşturuyordu. NDC modelinde
fiyatlandırılmış uçuş programları (priced itineraries) doğrudan havayolu
tarafından oluşturulup acenteye sunuluyor. Teknoloji odaklı büyük
yatırımlar ve içerik kontrolü artık GDS'in değil, havayolunun
sorumluluğunda.

![Başlık: Fiyatlandırma Gücü Havayollarına Geçiyor. Alt başlık: teknoloji odaklı büyük yatırımlar ve içerik kontrolü artık GDS'nin değil, havayollarının sorumluluğundadır. Ortada bir terazi; sol tarafta yukarı kalkmış mavi GDS bloğu, sağ tarafta aşağı inmiş turuncu havayolu bloğu, aralarında sağa bakan kalın turuncu ok. Eski model: fiyatlandırma ve uçuş arama algoritmaları GDS altyapısına aittir, GDS kendi hesaplama gücüyle teklifleri oluşturur. NDC modeli: fiyatlandırılmış uçuş programları (priced itineraries) doğrudan havayolu tarafından oluşturulur ve acenteye sunulur. Sağda alan notları: geleneksel olarak havayolları sabit fiyatları ATPCO, tarifeleri OAG/Cirium üzerinden yüklerdi, GDS fiyatlandırma motoru kuralları, fiyatları ve envanteri yerel olarak birleştirerek nihai fiyatı hesaplardı; NDC ile havayolu kendi offer management system (OMS) altyapısını kullanır, GDS yalnızca XML isteğini ileten ve yanıtı döndüren bir boru görevi görür.](/decks/ndc-at-scale/02.webp "Notun son cümlesi GDS'in yeni işini iki kelimeyle söylüyor: bir boru. Fiyatı kurmuyor, taşıyor.")

Kontrolün hangi kriterle kaydığı burada. İş kuralı gereği fiyatlandırılmış
güzergâhları sağlama sorumluluğu havayoluna geçiyor; havayolu program ve
ücret bilgisini GDS gibi dağıtıcılara yayınlamama kararı alabiliyor. O
karar verildiği anda GDS'in fiyatlandırma algoritmalarına yaptığı yatırım
boşa çıkıyor ve kontrol tamamen havayolu sistemlerine (PSS) geçiyor.
Kaynak metnin ifadesiyle fiyatlandırma gücü GDS'ten havayoluna kayacak ve
bu yatırım artık gerekmeyecek.

## Gücü alan, hesaplama yükünü de alıyor

Rakam bu bölümün çekirdeği: 2019 yılında sadece Sabre üzerinden günde
ortalama 675 milyondan fazla uçuş araması yapılıyordu. GDS'lerin arama ve
fiyatlandırma için yaptığı devasa yatırımlar boşa çıkarken, bu muazzam
işlem hacmi artık havayollarının kendi sistemleri tarafından karşılanmak
zorunda.

![Başlık: Altyapı ve Hesaplama Yükünün (Compute Load) Değişimi. Alt başlık: GDS'lerin arama ve fiyatlandırma için yaptığı devasa yatırımlar boşa çıkıyor, bu muazzam işlem hacmi artık havayollarının kendi sistemleri tarafından karşılanmak zorunda. Solda mavi sunucu kulesi, GDS altyapısı; sağda turuncu sunucu kulesi, airline IT; ikisinin arasında soldan sağa akan kalın turuncu ok demeti. Ortada büyük rakam: 675.000.000+, 2019 yılında sadece Sabre üzerinden günde ortalama yapılan uçuş araması (air shopping) sayısı. Sağda alan notları: bu hacim look-to-book (L2B) oranlarıyla ilgilidir, eski dünyada GDS ana bilgisayarları hiçbir zaman rezervasyonla sonuçlanmayan milyonlarca aramanın maliyetini ve hesaplamasını üstlenirdi; NDC aracılığıyla fiyatlandırma kontrolünü geri alarak havayolları kendi PSS ve fiyatlandırma motorlarını aniden agregatörlerden gelen devasa L2B API trafiğine maruz bırakmaktadır, bu havayolu tarafında büyük bir bulut ölçeklendirmesi gerektirir.](/decks/ndc-at-scale/03.webp "Ok demeti tek yönlü: yük soldan sağa taşınıyor, azalmıyor. Havayolunun kazandığı kontrolün faturası bu demetin kalınlığı.")

Buradaki mühendislik dersi, look-to-book oranı bölümündeki 10.000'e 1
rakamının devamı. Eski dünyada rezervasyona hiç dönüşmeyen milyonlarca
aramanın maliyetini GDS ana bilgisayarları üstleniyordu; havayolu yalnızca
satışı görüyordu. NDC ile fiyatlandırma kontrolünü geri alan havayolu,
kendi PSS ve fiyatlandırma motorunu bir anda agregatörlerden gelen devasa
L2B trafiğine açmış oluyor. Bunun karşılığı havayolu tarafında ciddi bir
bulut ölçeklendirmesi. NDC'yi bir mesajlaşma projesi sanan ekip, canlıya
çıkınca bunu bir kapasite projesi olarak yeniden keşfediyor.

## GDS'in tercihi: milyonlarca dolar yatır ya da içeriği kaybet

Havayolu NDC'ye hazır olduğunda, OTA ve TMC'ler için tek iletişim kanalı
olarak NDC'yi zorunlu kılabiliyor. GDS'in önünde iki yol kalıyor. Yatırım
yapmamak: kritik havayolu içeriğinin kaybedilmesi. Milyonlarca dolarlık
yeni yatırım: yeni iletişim protokolüne uyum ve hayatta kalma.

![Başlık: GDS'ler İçin Varoluşsal Tehdit ve Yatırım Zorunluluğu. Alt başlık: havayolları NDC'ye hazır olduğunda, OTA ve TMC'ler (kurumsal seyahat acenteleri) için tek iletişim kanalı olarak NDC'yi zorunlu kılabilir. Soldan gelen bir yol ikiye ayrılıyor. Üstte gri kesikli yol, yatırım yapmamak: sonuç, kritik havayolu içeriğinin kaybedilmesi (loss of content). Altta turuncu düz yol, milyonlarca dolarlık yeni yatırım: sonuç, yeni iletişim protokolüne (NDC) uyum ve hayatta kalma. Sağda alan notları: havayolları bu zorunluluğu GDS ek ücretleri (eski EDIFACT kanallarından yapılan rezervasyonlara eklenen cezai bir ücret) aracılığıyla veya en düşük ücret sınıflarını GDS'den tamamen esirgeyerek uygular; acenteleri rekabetçi kalabilmek için NDC hatlarını benimsemeye zorlar, bu GDS'nin dağıtım akışındaki rolünü doğrudan tehdit eder.](/decks/ndc-at-scale/04.webp "Gri yol kesikli çizilmiş: bir seçenek değil, bir sonuç. Havayolu tek kanalı seçtiği anda GDS için ikinci yol kalmıyor.")

Havayolunun bunu nasıl dayattığı notta: ya eski EDIFACT kanalından yapılan
rezervasyona cezai ek ücret (sürşarj) ekliyor, ya da en düşük ücret
sınıflarını GDS'ten tamamen esirgiyor. İkisi de acenteyi rekabetçi
kalabilmek için NDC hattına geçmeye zorluyor. Önceki bölümdeki 2015-2021
sürşarj dalgası bu baskının ilk hali; burada anlatılan, aynı baskının GDS
bilançosundaki karşılığı. Milyon dolarlık NDC yatırımını zorunlu kılan
şey teknoloji değil, içeriği kaybetme korkusu.

## Pazarda yeni bir boşluk açıldı: agregatörler

Yeni nesil agregatörler, 2020 sonu itibarıyla 40'tan fazlası Seviye 3
onaylı. Güçlü yönleri: modern teknoloji, modern API'ler, anında bağlantı
yeteneği (out-of-the-box connectivity), havayolları için uygun maliyet.
Zayıf yönleri: acente iş akışı yönetimi (workflow) ve güvenlikte eksiklik.
Geleneksel GDS'lerin güçlü yönü: derin acente entegrasyonu, yüksek
güvenlik ve kanıtlanmış güvenilirlik. Zayıf yönü: hantal ve eski altyapı
(legacy TPF), yüksek işletme maliyetleri.

![Başlık: Pazarda Ortaya Çıkan Yeni Boşluk, Agregatörler ile GDS. İki sütunlu tablo. Sol sütun yeni nesil agregatörler, 2020 sonu itibarıyla 40'tan fazlası Seviye 3 onaylı: güçlü yönler, modern teknoloji, modern API'ler, anında bağlantı yeteneği (out-of-the-box connectivity), havayolları için uygun maliyet; zayıf yönler, acente iş akışı yönetimi (workflow) ve güvenlikte eksiklik. Sağ sütun geleneksel GDS'ler: güçlü yönler, derin acente entegrasyonu, yüksek güvenlik ve kanıtlanmış güvenilirlik; zayıf yönler, hantal ve eski altyapı (legacy TPF), yüksek işletme maliyetleri. Sağda alan notları: Seviye 3 sertifikasyonu NDC olgunluğu için IATA'nın temel ölçütüydü, agregatörün teklif ve sipariş yönetimi akışlarını tam olarak işleyebileceği anlamına geliyordu; geleneksel GDS'ler hız için oluşturulmuş ancak modernleştirilmesi çok zor olan IBM ana bilgisayar işletim sistemi TPF'ye dayanır, yeni agregatörler ise geliştirmesi daha ucuz ve hızlı olan ancak GDS ana bilgisayarlarının onlarca yıllık uç durum iş mantığından yoksun bulut tabanlı mikro hizmetler kullanır.](/decks/ndc-at-scale/05.webp "Tablonun iki sütunu birbirinin aynası: birinin güçlü yönü diğerinin zayıf yönü. Notun son cümlesi eksik parçayı söylüyor, onlarca yıllık uç durum mantığı.")

Havayolunun neden yeni gelenleri tercih ettiği net: bu şirketler NDC
uyumlu modern API'ler üzerinden doğrudan havayolu bağlantısı sağlıyor ve
temel karar noktası, servisin eski altyapıya kıyasla çok daha kabul
edilebilir bir maliyetle (price point) sunulması. Ama kaynak metnin
uyarısı da açık: bu şirketlerin eksik olduğu şey acente iş akışı yönetimi
ve güvenlik uzmanlığı. Notun teknik çevirisi daha da somut: bulut tabanlı
mikro hizmetleri yazmak ucuz ve hızlı, ama GDS ana bilgisayarlarının
onlarca yılda biriktirdiği uç durum iş mantığı o kodda yok.

## Çıkış yolu TPF'yi yeniden yazmak değil, satın almak

GDS'ler modern teknolojiye sahip yeni agregatörleri satın almalı ya da
onlarla stratejik ortaklık kurmalı. Birinci fayda teknolojik: eski ve
pahalı TPF ortamından hızlı ve uygun maliyetli bir kaçış. İkinci fayda
operasyonel: agregatörlerin zayıf olduğu iş akışı ve güvenlik sorunları
GDS gücüyle çözülür. Sonuç, havayollarının en büyük önceliği olan dağıtım
maliyetlerinin düşürülmesi hedefine hızla ulaşılması.

![Başlık: Stratejik Çıkış Yolu, Satın Alma ve Ortaklık. Alt başlık: GDS'ler, modern teknolojiye sahip yeni agregatörleri satın almalı veya onlarla stratejik partnerlik kurmalıdır. Ortada birbirine geçen iki yapboz parçası: mavi parça, iş akışı ve güvenlik (GDS); turuncu parça, modern API ve çeviklik (agregatör). Fayda 1 (teknolojik): eski ve pahalı TPF (transaction processing facility) ortamından hızlı ve uygun maliyetli bir kaçış sağlar. Fayda 2 (operasyonel): agregatörlerin zayıf olduğu iş akışı ve güvenlik sorunları GDS gücüyle çözülür. Sonuç: havayollarının en büyük önceliği olan dağıtım maliyetlerinin düşürülmesi hedefine hızla ulaşılır. Sağda alan notları: havayolları geleneksel GDS dağıtım maliyetlerinden nefret eder, birleşme ve satın alma GDS'lerin modern agregatörün daha hafif altyapısından yararlanarak bu maliyetleri düşürmesine olanak tanır; doğrudan TPF'den taşınmak (TPF offload) çok yıllı, yüksek riskli bir mühendislik kâbusudur, satın alma strangler fig mimari modelini sağlayarak GDS'nin eski ana bilgisayar trafiğini yavaşça kapatırken NDC trafiğini modern yığın üzerinden yönlendirmesine olanak tanır.](/decks/ndc-at-scale/06.webp "İki yapboz parçası birbirine geçiyor ama kaynaşmıyor. Strangler fig tam olarak bu: yeni yığın eskisinin etrafını sarıyor, içini bir anda değiştirmiyor.")

Notun mimari adı önemli. Doğrudan TPF'den taşınmak çok yıllı, yüksek
riskli bir mühendislik kâbusu; "TPF'den meta-aramaya" bölümündeki assembly
darboğazı bunun neden böyle olduğunu anlatıyor. Satın alma ise strangler
fig modelini mümkün kılıyor: eski ana bilgisayar trafiği yavaşça
kapatılırken NDC trafiği modern yığın üzerinden yönlendiriliyor. Yani GDS
için doğru soru "TPF'yi nasıl yeniden yazarım" değil, "yeni trafiği hangi
yığına koyarım ve eskisini ne zaman söndürürüm".

## Müşteri tarafında bedel: şeffaflığın kaybı

Eski sistemde anlık fiyat karşılaştırması vardı: OTA ve GDS müşterileri,
farklı havayollarının aynı tipteki (homojen) biletlerini anında şeffafça
kıyaslayabiliyordu. NDC sonrasında model otomobil satın almaya benziyor:
havayolları farklı yan hizmetler (bagaj, Wi-Fi, koltuk) içeren dinamik
paketler (air bundles) sunuyor. İçerik artık homojen değil; tüketici anlık
görünürlük yerine özellikleri sürekli değişen spesifik teklifleri
değerlendirmek zorunda kalıyor.

![Başlık: Müşteri Deneyimi, Şeffaflığın Kaybı. Alt başlık: içerik artık homojen değildir, tüketici anında görünürlük yerine özellikleri sürekli değişen spesifik teklifleri değerlendirmek zorunda kalır. Üstte eski durum: on adet aynı mavi elma simgesi, her birinde fiyat etiketi; yanında not, eski sistem anında fiyat karşılaştırması, OTA ve GDS müşterileri farklı havayollarının aynı tipteki (homojen) biletlerini anında şeffafça kıyaslayabiliyordu. Altta NDC sistemi: bir galeride duran üç farklı turuncu otomobil, biri lastik takımıyla biri rozetle; yanında not, NDC sonrası otomobil satın alma modeli, havayolları farklı yan hizmetler (bagaj, Wi-Fi, koltuk) içeren dinamik paketler (air bundles) sunar. Sağda alan notları: EDIFACT kapsamında uçuş, RBD (reservation booking designator) ve ücret temel kodu ile kesin olarak tanımlanmış, metalaştırılmış bir koltuktu; NDC offer management ile havayolları bağlamsal verilere (sadakat durumu vb.) dayalı dinamik teklifler oluşturur; standart bir en düşük ücret kavramı ortadan kalkar çünkü temel ürün her havayolunda değişir.](/decks/ndc-at-scale/07.webp "Üstteki on elma aynı, alttaki üç araba değil. Karşılaştırma bir sıralama problemi olmaktan çıkıp bir değerlendirme problemine dönüşüyor.")

Kaynak metnin cümlesi bunu özetliyor: NDC ile uçak bileti almak yeni bir
araba almak gibi olacak. Mevcut modelde anlık ve şeffaf olan düşük ücret
araması, NDC ile homojen olmayan paketlere dönüşüyor; her havayolunun yan
hizmeti ve paket içeriği farklı olduğu için sistemlerin anlık karşılaştırma
yapması zorlaşıyor ve müşteri fiyatın ötesinde, paketin değerine dair
öznel bir karar vermek zorunda kalıyor. Notun teknik tespiti daha da
keskin: standart bir "en düşük ücret" kavramı ortadan kalkıyor, çünkü
temel ürün her havayolunda değişiyor. Bu domain'in gelir yönetimi
bölümlerindeki bütün mantık "aynı koltuğu kime kaça satarım" üzerine
kuruluydu; burada satılan şey artık aynı koltuk değil.

## Çözülmesi gereken yeni problem: normalizasyon

Sorun: acentelerin rezervasyon yapabilmesi için çoklu havayollarından
gelen karmaşık ve farklı NDC tekliflerinin standartlaştırılması şart.
Görev: GDS'ler bu homojen olmayan içeriği çevirmeli ve acente ekranları
için kıyaslanabilir formatlara dönüştürmeli. Gerçeklik: homojen olmayan
içeriği ekranlar için kusursuz şekilde normalize etme bilimi henüz
başlangıç aşamasında.

![Başlık: Çözülmesi Gereken Yeni Problem, Normalizasyon. Ortada büyük bir huni; üstünden farklı geometrik şekillerde turuncu cisimler dökülüyor, altından tek tip gri küpler çıkıyor. Üç katman: sorun, acentelerin rezervasyon (booking) yapabilmesi için çoklu havayollarından gelen bu karmaşık ve farklı NDC tekliflerinin standartlaştırılması şarttır. Görev: GDS'ler homojen olmayan bu içeriği çevirmeli ve acente ekranları için kıyaslanabilir formatlara dönüştürmelidir (normalizasyon). Gerçeklik: homojen olmayan içeriği ekranlar için kusursuz bir şekilde normalize etme bilimi henüz başlangıç aşamasındadır. Sağda alan notları: normalizasyon günümüzde dağıtım ve AirShopping alanlarındaki en büyük sürtünme noktasıdır, seyahat acenteleri standartlaştırılmış grafik arayüzleri (Amadeus Selling Platform Connect veya Sabre Red 360 gibi) kullanır; her havayolu API'si dinamik teklifleri için tamamen benzersiz bir JSON/XML şemasıyla yanıt verirse, agregatör bir acentenin sipariş oluşturma işlemini başlatmak üzere A ve B havayollarının paketlerini hızlıca karşılaştırabilmesi için bu farklı yükleri ayrıştırmalı, haritalamalı ve birleşik bir ön uç şemasına çevirmelidir.](/decks/ndc-at-scale/08.webp "Huninin altından çıkan küplerin hepsi aynı görünüyor ama alttaki ölçek çubuğu %75'te duruyor. Normalizasyon bitmiş bir iş değil, devam eden bir kayıp.")

Normalizasyonun iş mantığı: GDS'ler ve agregatörler farklı havayollarından
gelen karmaşık veri setlerini ortak bir formata çevirmeli ki acente
karşılaştırma yapabilsin. Bu mantık bilimsel olarak hâlâ mükemmelleşmemiş
olsa da acentenin rezervasyon yapabilmesi için temel bir gereklilik.
Yazılımcı için somut hali notta: her havayolu API'si kendi benzersiz
JSON/XML şemasıyla yanıt veriyor; agregatör bu farklı yükleri ayrıştırıp
haritalayıp birleşik bir ön uç şemasına çevirmek zorunda, yoksa acente iki
havayolunun paketini yan yana koyamıyor. Bir önceki bölümdeki omnichannel
offer parity problemi tek havayolunun kendi kanalları arasındaydı; bu,
aynı problemin havayolları arası hali ve daha zoru.

## Özet: üç aktör, üç iş

Yeni mimari üç adımda özetleniyor. Havayolu oluşturan: hesaplama yükünü
üstlenir, dinamik ve homojen olmayan paketler (air bundles) yaratır;
teklif ve fiyatlandırma kontrolü onda. Modern GDS ya da agregatör işleyen:
birleşme ve satın alma yoluyla yenilenmiş altyapıyla bu veriyi çeker,
güvenlik ve iş akışını sağlar, acente için normalize eder. Müşteri karar
veren: şeffaf fiyatlandırma yerine değer bazlı teklif seçimi yapar,
heterojen karşılaştırma.

![Başlık: Özet, Dağıtımın Yeni Mimarisi. Soldan sağa üç kutu ve aralarında oklar. 1. Havayolu (oluşturan), turuncu: hesaplama yükünü üstlenir, dinamik, homojen olmayan paketleri (air bundles) yaratır, teklif ve fiyatlandırma kontrolü. 2. Modern GDS / agregatör (işleyen), yarısı mavi yarısı turuncu: birleşme ve satın alma yoluyla yenilenmiş altyapısıyla bu veriyi çeker, güvenlik ve iş akışını sağlar ve acente için normalize eder; normalizasyon ve güvenlik. 3. Müşteri (karar veren), beyaz: şeffaf fiyatlandırma yerine değer bazlı teklif seçimi yapar, heterojen karşılaştırma. Sağda alan notları: bu slayt PNR merkezli eski bir dünyadan offer and order management dünyasına geçişi görsel olarak özetler; sonuçta NDC sadece ilk adımdır, bu mimari değişim eski PNR'ları, e-biletleri (ETKT) ve elektronik çeşitli belgeleri (EMD) tamamen kullanımdan kaldırıp perakende odaklı tek bir müşteri siparişi kaydına geçmeyi hedefleyen IATA'nın ONE Order girişiminin zeminini hazırlamaktadır.](/decks/ndc-at-scale/09.webp "Ortadaki kutu iki renkli: yarısı eski GDS, yarısı yeni agregatör. Satın alma stratejisinin bu şemadaki karşılığı tam olarak o iki renk.")

Notun kapanışı bu bölümü bir öncekine bağlıyor: NDC sadece ilk adım ve bu
mimari değişim, PNR'ları, e-biletleri ve EMD'leri kullanımdan kaldırıp tek
müşteri sipariş kaydına geçmeyi hedefleyen ONE Order girişiminin zeminini
hazırlıyor. Önceki bölümde ONE Order'ı üç kaydı birleştiren bir sadeleştirme
olarak görmüştük; burada görünen, o sadeleştirmenin önkoşulunun teklifi
havayolunun kurması olduğu.

## Yarın işe yarayacak dört çıkarım

1. **NDC'yi kapasite projesi olarak planla, mesajlaşma projesi olarak
   değil.** Fiyatlandırma kontrolünü geri alan havayolu, rezervasyona
   dönüşmeyen L2B trafiğinin maliyetini de devralıyor. Günde yüz milyonlarca
   aramayı karşılayacak bulut ölçeklendirmesi bütçelenmeden NDC canlıya
   çıkmaz.
2. **Eski yığından çıkışı yeniden yazarak değil, sararak yap.** TPF
   offload çok yıllı ve yüksek riskli; satın alma ya da ortaklık strangler
   fig modelini mümkün kılıyor. Yeni trafiği modern yığına yönlendir, eski
   ana bilgisayarı sonra söndür.
3. **Modern API yetmiyor, iş akışı ve güvenlik gerekiyor.** Agregatörlerin
   eksiği onlarca yıllık uç durum mantığı; bir NDC entegrasyonunu yalnızca
   mutlu yol üzerinden değerlendirme. Acente iş akışı ve güvenlik
   gereksinimlerini baştan listeye koy.
4. **Normalizasyona yatırım yap, çünkü en düşük ücret kavramı bitti.**
   Farklı şemalardan gelen heterojen teklifleri ayrıştırıp birleşik bir
   ön uç şemasına çeviren katman olmadan kullanıcı iki paketi
   karşılaştıramaz. Bu katman bugün dağıtımdaki en büyük sürtünme noktası
   ve henüz kimsede bitmiş değil.

Bu bölümde ne yok: teklifi kuran havayolunun o teklifi hangi seviyede
sertifikalandırdığı ve ONE Order'ın üç kaydı nasıl birleştirdiği
("Seyahat dağıtım ekosistemi ve yeni dağıtım yeteneği"), ve normalizasyonun
tek havayolu içindeki hali olan kanallar arası tutarlılık ("Seyahat değer
zinciri ve dağıtım kanalları"). Bu bölüm o ikisinin ölçek tarafını
anlatmak için var.
