---
title: "Seyahat değer zinciri ve dağıtım kanalları analizi: stratejik brifing notu"
domain: "aviation"
summary: "Gelir yönetimi karar verir, Host CRS uygular; ikisinin arasındaki ve CRS ile vitrinler arasındaki bağlantı zayıfsa en iyi fiyatlama bile boşa gider. Bu bölüm boş koltuğu satılabilir ürüne çeviren veri hattını, doğrudan ve dolaylı kanal ayrımını, bilet başına 2.5 rezervasyonun ve %50'yi aşan acente teşvikinin GDS'i neden ayakta tuttuğunu ve NDC'nin neyi geri almak istediğini anlatıyor."
audience: "Envanter ile dağıtım arasındaki bağlantıyı yazan ya da omnichannel fiyat tutarlılığı sorunuyla uğraşan yazılımcı ve ürün insanı. Önceki bölümler okunmuş olmalı; Host CRS, segment ücreti, kickback ve offer parity metnin içinde tanımlanıyor."
pubDate: 2026-09-22
topics: [solution-architecture, pricing]
ai: generated
---

Bu domain'in gelir yönetimi bölümleri kararın nasıl verildiğini, dağıtım
bölümleri kararın hangi kanaldan satıldığını anlattı. Bu bölüm ikisinin
arasındaki boruyu anlatıyor. **Boş bir koltuğu dinamik fiyatlı, satılabilir
bir ürüne çeviren şey bir veri hattı;** ve o hattın en zayıf noktası
algoritma değil, bağlantı. Gelir yönetimi bir sınıfı kapatır, OTA
önbelleğinde o sınıf hâlâ açıksa müşteri var olmayan bir fiyatı görür.
Kaynak metnin cümlesiyle: bir havayolunun gelir yönetimi süreci,
ürünlerinin farklı kanallardaki gösteriminin doğruluğu kadar etkilidir.

![Sunumun kapak slaytı. Solda başlık: Seyahat Değer Zinciri ve Gelir Yönetimi. Alt başlık: uçak biletinin dijital ekosistemdeki yolculuğu. Sağda geniş gövdeli bir yolcu uçağının üstten teknik çizimi, turuncu düğümlerle işaretli. Altta konuşmacı notları: bu deste havayolu dağıtımı ve gelir yönetiminin makro düzey mimarisini kapsıyor; mühendisler ve ticari ekipler için, havayolunun iç karar motorlarından (pricing/RM) yolcunun ekranına (offer/AirShopping) kadar olan yolu haritalıyor; anahtar kavram, seyahat değer zinciri esasen boş bir uçak koltuğunu dinamik fiyatlı, rezerve edilebilir bir ürüne dönüştüren veri hattıdır.](/decks/travel-value-chain/01.webp "Notun son cümlesi bölümün tanımı: değer zinciri bir veri hattı. Uçağın üzerindeki turuncu düğümler o hattın durakları gibi okunabilir.")

## Çekirdek sistem: karar ile uygulama ayrı yerde durur

Gelir yönetimi (RM) gelişmiş bir karar destek sistemi: optimum envanter
kontrollerini ve fiyatlandırma stratejisini üretir. Ana CRS (Host
Reservations System) sistemin yürütme ve uygulama merkezi: gelir
yönetiminden gelen kararları uygular ve envanteri barındırır. Kaynak
metnin tanımıyla gelir yönetimi, havayolunun ana rezervasyon sisteminde
uygulanan optimal envanter kontrolleri üreten gelişmiş bir karar destek
uygulamasıdır. Yani RM yalnızca tahmin aracı değil, çıktısı CRS'te bir
yürütme bileşeni olarak işlenen operasyonel bir kontrol mekanizması.

![Başlık: Çekirdek Sistem, Karardan Uygulamaya. İki kutu, aralarında kalın turuncu ok ve veri akışı etiketi. Solda beyin ve dişli simgesi, gelir yönetimi (revenue management): gelişmiş karar destek sistemidir; optimum envanter kontrollerini ve fiyatlandırma stratejisini üretir. Sağda sunucu ve veritabanı simgesi, ana CRS (host reservations system): sistemin yürütme ve uygulama merkezidir; gelir yönetiminden gelen kararları uygular ve envanteri barındırır. Altta konuşmacı notları: alan terimleri RMS, CRS, PSS; sistem etkileşimi, RM zekâ olarak optimizasyon algoritmalarını çalıştırır ve uygunluğu (özellikle RBD kontrollerini) Host CRS/PSS'e iter; teknik içgörü, CRS havayolu envanteri için tek doğruluk kaynağıdır, CRS çökerse order management ve envanter düşümleri durur ve satış tamamen kesilir.](/decks/travel-value-chain/02.webp "Ok tek yönlü ve turuncu: RM iter, CRS uygular. Ama notun son cümlesine dikkat: RM çökerse eski limitlerle satılır, CRS çökerse hiç satılmaz.")

Notun iki teknik cümlesi mimarinin özeti. RM, optimizasyon algoritmasını
çalıştıran zekâ ve çıktısını rezervasyon sınıfı (RBD) kontrolleri olarak
Host CRS'e itiyor; DINAMO ile Sabre PSS arasındaki köprüyü anlatan bölüm
bu ilişkinin 1985'teki hali. CRS ise havayolu envanterinin tek doğruluk
kaynağı: CRS çökerse order management ve envanter düşümleri durur, satış
tamamen kesilir. İki sistemin kritikliği simetrik değil; RM'nin yokluğu
gelir kaybıdır, CRS'in yokluğu satışın kendisinin yokluğu.

## Dağıtım yol ayrımı: doğrudan ve dolaylı kanallar

Ana CRS'ten iki yol çıkıyor. Dolaylı kanallar GDS gibi aracıları kullanır;
bütün fiziksel seyahat acentelerini ve OTA'ları kapsar; küresel
rezervasyonların %50'sinden fazlası bu kanaldan gelir. Doğrudan kanallarda
müşteri havayolunun kendi rezervasyon sistemine aracısız erişir; tarifeler,
fiyatlar ve uygunluk doğrudan Ana CRS'ten çekilir.

![Başlık: Dağıtım Yol Ayrımı, Doğrudan ve Dolaylı Kanallar. Solda ana CRS halkası, oradan iki boru çıkıyor. Üstte turuncu boru, dolaylı kanallar (indirect channels): GDS (küresel dağıtım sistemleri) gibi aracıları kullanır; tüm fiziksel seyahat acentelerini ve OTA'ları kapsar; yanında turuncu kutu, veri: küresel rezervasyonların %50'sinden fazlası bu kanaldan gelir. Altta lacivert boru, doğrudan kanallar (direct channels): müşteri havayolunun kendi rezervasyon sistemine aracısız erişir; tarifeler, fiyatlar ve uygunluk durumu doğrudan ana CRS'den çekilir. Altta konuşmacı notları: dağıtım stratejisi, havayolları yüksek dağıtım maliyetinden (GDS ücretleri) kaçınmak için müşteriyi dolaylıdan doğrudan kanala itmek için sürekli mücadele eder; ilgili akış AirShopping, doğrudan kanallar havayolunun PSS'ini doğrudan sorgular, dolaylı kanallar aracı önbelleklerine ya da EDIFACT sorgulamasına dayanır; içgörü, doğrudan satış baskısına rağmen %50'den fazla istatistiği doluluk oranını korumak için B2B dağıtım ağlarına devasa bağımlılığı gösterir.](/decks/travel-value-chain/03.webp "İki boru aynı halkadan çıkıyor ama farklı şey taşıyor: alttaki canlı sorgu, üstteki önbellek ya da EDIFACT sorgulaması. Bu bölümün senkronizasyon sorunu tam bu farktan doğuyor.")

Veri akış farkının kriteri: doğrudan kanallar (web sitesi, çağrı merkezi)
havayolunun kendi Host CRS'indeki program, ücret ve kontenjan verisine
doğrudan erişir; dolaylı kanallar (OTA, fiziksel acente) GDS'i aracı
olarak kullanır. Notun eklediği teknik ayrıntı önemli: doğrudan kanal
PSS'i canlı sorgular, dolaylı kanal aracının önbelleğine ya da EDIFACT
sorgulamasına dayanır. Havayolu GDS ücretinden kaçmak için müşteriyi
sürekli doğrudan kanala itmeye çalışıyor; ama %50'den fazla rakam,
doluluk oranını korumak için B2B ağlara ne kadar bağımlı olduğunu
gösteriyor.

## Vitrin matrisi: dört temas noktası, iki eksen

Müşteri temas noktaları iki eksende dört hücre. Yatay eksen dağıtım
stratejisi, doğrudan ile dolaylı; dikey eksen müşteri arayüzü, çevrimdışı
ile çevrimiçi. Doğrudan ve çevrimiçi: havayolu web sitesi ve mobil
uygulaması. Dolaylı ve çevrimiçi: OTA'lar. Doğrudan ve çevrimdışı:
havayolu çağrı merkezi, havalimanı bilet satış ofisleri (ATO), şehir içi
bilet satış ofisleri (CTO). Dolaylı ve çevrimdışı: geleneksel fiziksel
seyahat acenteleri.

![Başlık: Vitrin Matrisi, Müşteri Temas Noktaları. İki eksenli dört hücre. X ekseni dağıtım stratejisi (doğrudan ile dolaylı), Y ekseni müşteri arayüzü (çevrimdışı ile çevrimiçi). Sol üst, dizüstü simgesi: havayolu web sitesi ve mobil uygulaması. Sağ üst, küre ve imleç simgesi: çevrimiçi seyahat acenteleri (OTA). Sol alt, kulaklık ve bina simgesi: havayolu çağrı merkezi, havalimanı bilet satış ofisleri (ATO), şehir içi bilet satış ofisleri (CTO). Sağ alt, dükkân simgesi: geleneksel (fiziksel) seyahat acenteleri. Altta konuşmacı notları: alan terimleri OTA (Expedia, Booking.com), ATO, CTO; tarihsel bağlam, 1990'lara kadar yalnızca alt yarı vardı, internet üst yarıyı açtı ve envanter yönetimini büyük ölçüde karmaşıklaştırdı; sistem akışı, sol taraf doğrudan havayolunun Host PSS'iyle işlem yapar, sağ taraf aracı sorgulaması ya da GDS bağlantısı gerektirir.](/decks/travel-value-chain/06.webp "1990'lara kadar yalnızca alt satır vardı. İnternet üst satırı açtı ve vitrin sayısı ikiye katlanınca, aynı envanteri hepsinde aynı göstermek ayrı bir mühendislik sorunu oldu.")

Notun tarihsel cümlesi bu matrisin ağırlığını anlatıyor: 1990'lara kadar
yalnızca alt yarı vardı; internet üst yarıyı açtı ve envanter yönetimini
büyük ölçüde karmaşıklaştırdı. Sistem akışı sol ve sağ arasında ayrılıyor:
sol sütun doğrudan Host PSS ile işlem yapar, sağ sütun aracı sorgulaması
ya da GDS bağlantısı gerektirir. Dört vitrinin ikisi canlı veriye, ikisi
aracının kopyasına bakıyor.

## Çoklu kanal zorluğu: senkronizasyon ve tutarlılık

Zorluk iki cümle: aynı içerik bütün dağıtım kanallarında birebir aynı
görünmeli; bu, her platformda kusursuz bir teknolojik bağlantı ve
senkronizasyon gerektiriyor, aksi halde en iyi fiyatlandırma stratejisi
bile başarısız olur. Gelir yönetimi merkezde; dört vitrine tarifeler,
fiyatlar ve uygunluk paketleri gidiyor: havayolu web sitesi ve mobil
uygulaması, OTA'lar, çağrı merkezi ve bilet ofisleri, geleneksel acenteler.

![Başlık: Çoklu Kanal Zorluğu, Senkronizasyon ve Tutarlılık. Sağ üstte lacivert alıntı kutusu: bir havayolunun gelir yönetimi süreci, ürünlerinin farklı kanallardaki gösteriminin doğruluğu kadar etkilidir. Ortada gelir yönetimi (RM) kutusu ve üstünde kilitli senkronizasyon simgesi; dört köşeye giden oklar üzerinde tarifeler, fiyatlar, uygunluk etiketli paket simgeleri: havayolu web sitesi ve mobil uygulaması, çevrimiçi seyahat acenteleri (OTA), havayolu çağrı merkezi ve bilet satış ofisleri, geleneksel seyahat acenteleri. Solda zorluk: aynı içerik tüm dağıtım kanallarında birebir aynı görünmelidir; bu durum her platformda kusursuz bir teknolojik bağlantı ve senkronizasyon gerektirir, aksi takdirde en iyi fiyatlandırma stratejisi bile başarısız olur. Altta konuşmacı notları: alan zorluğu omnichannel offer parity, havayolu bilişiminin en zor problemlerinden biri; teknik bağlam, dolaylı kanallar sık sık önbellek verisi kullanır, müşteri OTA'da 100 dolarlık bir ücret görür ama RM o sınıfı kapatmıştır, bu rezervasyon hatalarına ve gelir sızıntısına yol açar; sonuç, envanter ile dağıtım arasındaki senkronizasyon RM matematiğinin kendisi kadar kritiktir.](/decks/travel-value-chain/07.webp "Ortadaki kilit simgesi bir dilek: dört ok aynı anda aynı paketi taşısın. Notun örneği kilidin kırıldığı an: OTA 100 dolar gösteriyor, RM o sınıfı çoktan kapatmış.")

Kontenjan bilgisinin doğruluğu neye bağlı? RM sürecinin başarısı ürün
ekranlarının (storefront) doğruluğuna bağlı; bütün kanallarda kontenjanın
özdeş olması için yüksek seviyeli bir bağlantı (connectivity) şart.
Senkronizasyon neden kritik? RM'nin çıktısı olan takvim, ücret ve kontenjan
bütün kanallarda tutarlı olmalı; değilse RM'nin etkinliği düşer, bu yüzden
kanallar arası özdeş envanter bir iş kuralı. Notun adı için: omnichannel
offer parity, havayolu bilişiminin en zor problemlerinden biri. Somut
hata: dolaylı kanal önbellek kullanıyor, müşteri OTA'da 100 dolarlık
ücreti görüyor, RM o sınıfı kapatmış; sonuç rezervasyon hatası ve gelir
sızıntısı. Notun sonucu bu bölümün tezi: envanter ile dağıtım arasındaki
senkronizasyon, RM matematiğinin kendisi kadar kritik.

## GDS ekosistemi ve ekonomik döngü: 2.5 rezervasyon, %50'yi aşan teşvik

GDS'in platform işlevi: tedarikçilerle seyahat acentelerini bağlayan B2B
ağ, karşılaştırmalı alışveriş imkânı. Döngü üç adım. Havayolu GDS'e
segment başına rezervasyon ücreti öder; bilet başına ortalama 2.5
rezervasyon. GDS bu gelirin bir kısmını sisteme abone acentelere teşvik
(incentive) olarak dağıtır. Bazı durumlarda acente teşviki ödenen
rezervasyon ücretinin %50'sini aşabilir.

![Başlık: GDS Ekosistemi ve Ekonomik Döngü. Platform işlevi: tedarikçiler ile seyahat acentelerini birbirine bağlayan B2B ağdır, karşılaştırmalı alışveriş imkânı sunar. Ortada altıgen GDS platformu; solda tedarikçiler (uçak, otel, araba simgeleri), sağda seyahat acenteleri (dükkân ve dizüstü simgeleri); oklarla üç adımlı döngü. Adım 1: havayolları GDS'e segment başına rezervasyon ücreti öder (bilet başına ortalama 2.5 rezervasyon). Adım 2: GDS bu gelirin bir kısmını sisteme abone olan acentelere teşvik (incentive) olarak dağıtır. Adım 3, turuncu kutu: bazı durumlarda acente teşvikleri ödenen rezervasyon ücretinin %50'sini aşabilir. Altta konuşmacı notları: alan terimleri GDS (Amadeus, Sabre), segment ile O&D farkı; gizli alan bilgisi, bilet başına 2.5 rezervasyon segmentleri ifade eder, aktarmalı bir gidiş-dönüş 4 segmenttir, GDS segment başına ücret aldığı için karmaşık güzergâhları dağıtmak pahalıdır; acente davranışı, %50'yi aşan teşvik döngüsü (GDS kickback) acentelerin doğrudan rezervasyon yerine GDS kullanmaya neden bu kadar motive olduğunu açıklar.](/decks/travel-value-chain/04.webp "Döngünün üçüncü oku turuncu ve tedarikçiye geri dönüyor: havayolunun ödediği ücretin yarısından fazlası, onu GDS'te tutan acentenin cebine giriyor. Havayolu kendi aracısını finanse ediyor.")

Notun gizli alan bilgisi metriği açıyor: bilet başına 2.5 rezervasyon,
segment demek. Aktarmalı bir gidiş-dönüş dört segment; GDS segment başına
ücret aldığı için karmaşık güzergâhı dağıtmak pahalı. Otelde ise mantık
farklı: konaklama süresine bakılmaksızın işlem başına ücret. Acente
davranışı sorusunun cevabı da burada: %50'yi aşan teşvik döngüsü (GDS
kickback), acentenin doğrudan rezervasyon yerine GDS'i neden bu kadar
tercih ettiğini açıklıyor. Acentenin kanal seçiminde ve iş modelinde bu
teşvik belirleyici finansal faktör; önceki bölümlerdeki override
komisyonlarının GDS tarafındaki ikizi.

## Dağıtımın evrimi: geleneksel GDS'ten NDC'ye

Üç boyutta karşılaştırma. Teknoloji: geleneksel GDS eski nesil platform
mimarisi; NDC doğrudan bağlantı ve modern veri standartları. Fiyatlandırma:
GDS'te fiyat ve uygunluk GDS üzerinde birleştirilir; NDC'de havayolu
uçuşları ve fiyatları kendi sisteminde doğrudan fiyatlandırır. İçerik:
GDS havayolunun ürünlerini görselleştirme ve sergileme konusunda
sınırlamalar içerir; NDC ek hizmetlerin (bagaj, Wi-Fi, özel koltuk)
acentelere dinamik sunulmasını sağlar.

![Başlık: Dağıtımın Evrimi, Geleneksel Sistemlerden Yeni Nesil Yeteneklere. İki sütun, arada ok. Geleneksel GDS (mevcut durum): teknoloji, eski nesil (legacy) platform mimarisi; fiyatlandırma, fiyatlar ve uygunluk GDS üzerinde birleştirilir; içerik, havayollarının ürünlerini görselleştirme ve sergileme konusunda sınırlamalar içerir. NDC mimarisi (gelecek, New Distribution Capability): teknoloji, doğrudan bağlantı ve modern veri standartları; fiyatlandırma, havayolları uçuşları ve fiyatları kendi sistemlerinde doğrudan fiyatlandırır; içerik, ek hizmetlerin (bagaj, Wi-Fi, özel koltuk) acentelere dinamik olarak sunulmasını sağlar. Altta konuşmacı notları: teknik içgörü, geleneksel GDS eski EDIFACT mesajlaşmasına dayanır, GDS fiyatı ATPCO'dan ücretleri ve OAG'den tarifeleri çekerek kendisi kurar; akış kayması, NDC modern XML API'leri kullanır, offer management'ı GDS'ten havayoluna geri taşır, havayolu teklifi modern e-ticaret gibi perakende yapmak için dinamik olarak kendisi oluşturur.](/decks/travel-value-chain/05.webp "Orta satır asıl kavga: bugün fiyatı GDS kuruyor, ATPCO'dan ücreti ve OAG'den tarifeyi çekip birleştirerek. NDC o birleştirme işini havayoluna geri veriyor.")

Kaynak metnin iki cümlesi kırılmayı anlatıyor. Bugünkü GDS, tedarikçinin
içeriğinin nasıl gösterilip satılacağı konusunda sınırlamaları olan bir
eski nesil platform. Gelecekte NDC dünyasında tedarikçiler seyahat
acenteleri için güzergâhları ve ek hizmetleri de kendileri
fiyatlandıracak. Notun teknik açıklaması bunun neden mimari bir fark
olduğunu söylüyor: geleneksel GDS EDIFACT mesajlaşmasına dayanır ve fiyatı
kendisi kurar, ATPCO'dan ücretleri, OAG'den tarifeleri çekerek. NDC modern
XML API'leriyle offer management'ı GDS'ten havayoluna geri taşır; havayolu
teklifi modern e-ticaret gibi dinamik olarak kendisi oluşturur.
Fiyatlama gücü aracıdan tedarikçiye kayıyor; ek hizmet kararı da onunla.

## Yarın işe yarayacak dört çıkarım

1. **Bağlantı katmanını RM matematiği kadar ciddiye al.** Gelir yönetimi
   başarısı bütün satış noktalarındaki, çevrimiçi ve çevrimdışı, veri
   tutarlılığına bağlı. Önbellekte açık kalan kapalı sınıf doğrudan gelir
   sızıntısı; connectivity zayıflığı bir altyapı sorunu değil, gelir sorunu.
2. **NDC'ye geçerken GDS'i yok sayma.** Dolaylı kanal küresel
   rezervasyonun yarısından fazlasını hâlâ taşıyor ve doluluk oranı ona
   bağlı. Geçiş, mevcut ekosistemi bir gecede kapatarak değil, yanına
   ikinci bir hat kurarak yapılır.
3. **NDC'yi bilet fiyatı için değil, ek hizmet için planla.** Kazanılan
   şey yalnızca fiyat kontrolü değil; bagaj, koltuk ve Wi-Fi gibi yan
   ürünleri acente kanalında da yönetme ve kişiselleştirme imkânı.
   Teklifi kuran sistem havayolununsa, teklifin içeriği de onun.
4. **Kanal değişikliği projesinde direncin kaynağını doğru teşhis et.**
   Acentenin GDS teşvikine bağımlılığı rezervasyon ücretinin %50'sini
   aşıyor. Müşteriyi doğrudan kanala yönlendirme projesi acenteyle
   karşılaştığında karşı çıkan şey alışkanlık değil, gelir.

Bu bölümde ne yok: NDC'nin bu tabloyu neden on yıldır tamamlayamadığı ve
kavganın hangi tarafının ticari olduğu ("NDC: dağıtımı kim kontrol
ediyor") ve RM'nin Host CRS'e ittiği RBD kontrollerinin envanter tarafında
neye dönüştüğü ("Envanter koltuk değildir"). Bu bölümün turuncu oku o iki
bölümün arasından geçiyor.
