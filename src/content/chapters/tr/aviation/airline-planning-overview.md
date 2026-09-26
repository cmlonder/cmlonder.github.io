---
title: "Havacılık planlaması ve gelir yönetimi: stratejik analiz"
domain: "aviation"
summary: "Bir havayolunun kârı tek bir departmandan çıkmıyor: çizelge ürünü yaratıyor, fiyat onu segmente göre biçiyor, envanter koltuğu ağ değerine göre dağıtıyor, CRM müşteriyi tanıyor, dağıtım kanalı maliyeti belirliyor. Bu bölüm bu beş halkayı sırayla ve birbirine bağlandıkları yerden anlatıyor; algoritmanın cevaplayamadığı tek soruyla bitiyor."
audience: "Havayolu PSS, teklif, envanter, CRM ya da dağıtım sistemlerinden biriyle çalışan ve kendi modülünün zincirdeki yerini görmek isteyen yazılımcı ve ürün insanı. Fiyat esnekliği, bacak bazlı ve köken-varış (O&D) bazlı kontrol, teklif fiyatı (bid price), RBD, LCC ve FSC metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler gelir yönetimini doğduğu yerden anlattı: kâr garantisi
kalkınca ortaya çıkan kısıtlı indirim, kontrollü fazla satış, bacak bazlı
kontrolden köken-varışa geçiş. Bu bölüm aynı disiplini bugünkü haliyle,
yanındaki komşularıyla birlikte ele alıyor. Kaynak metnin çıkış noktası tek
cümle: doğru koltuğu, doğru zamanda, doğru müşteriye, müşterinin ödemeye
razı olduğu en yüksek fiyattan satmak. **Bu cümlenin her parçası farklı bir
departmanın işi, ve kârlılık hiçbirinin tek başına iyi olmasından değil,
aralarındaki verinin kesintisiz akmasından çıkıyor.** Kapasite planlaması
koltuğu yaratıyor, fiyatlandırma zamanı ve fiyatı biçiyor, gelir yönetimi
müşteriyi seçiyor, CRM onu tanıyor, dağıtım ona ulaşmanın maliyetini
belirliyor.

![Sunumun kapak slaytı. Solda bir dünya haritası ve üstüne çizilmiş küre, kıtalar arasında turuncu noktalarla işaretlenmiş havalimanları ve bunları birbirine bağlayan uçuş okları. Başlık: Sinerjiler, Havayolu Ticari Planlama ve Operasyon Ekosistemi. Alt başlık: Planlamadan Gelir Yönetimine Kadar Bütünsel Bir Mimari. Sağda uzman notları kutusu: havayolu ticari operasyonlarına genel bakış; ağ ve kapasite planlamasından başlayıp teklif yönetimi, sipariş yönetimi ve yolcu biletlemeye uzanan makro akış; temel teori olarak havayolunun silolar halinde çalışamayacağı, planlamanın envanteri belirlediği, fiyatlandırmanın CRM'i yönlendirdiği ve dağıtımın nihai getiriyi şekillendirdiği.](/decks/commercial-ecosystem/01.webp "Sağdaki son madde bölümün iskeleti: her fonksiyon bir sonrakinin girdisini üretiyor, hiçbiri kendi başına bitmiyor.")

![Başlık: Kârlılık Motoru, Entegre Bir Havayolu İş Modeli. Soldan sağa birbirine geçen beş ok biçiminde aşama, altlarından geçen turuncu bir akış oku. Kapasite Planlama: nereye, ne zaman, hangi uçakla uçulacak. Ürün ve Fiyatlandırma: doğru müşteri segmentine doğru ürün ve fiyat eşleştirmesi. Verim Yönetimi: kapasite kısıtlamalarını kullanarak ağ bazlı geliri maksimize etme. CRM ve Sadakat: müşteriyi tanıma, yeni talep yaratma ve kişiselleştirilmiş değer katma. Dağıtım Kanalları: maliyet etkin doğrudan ve dolaylı satış ağları kurma. Konuşmacı notu: bu, ticari havacılıktaki klasik departman ayrımı; modern havayolu BT sistemlerinde bu siloları birleştirmek için güçlü bir baskı var (örneğin gelir yönetimini ve fiyatlandırmayı birleştiren sürekli fiyatlandırma). Veri hattı genellikle tarife verisiyle (OAG/Cirium) başlar, havayolunun PSS'ine girer ve oradan gelir yönetimi sistemlerine ve CRM veri göllerine akar.](/decks/profitability-blueprint/02.webp "Beş kutu beş departman, altlarındaki ok tek bir veri hattı. Bu bölüm o oku soldan sağa takip ediyor.")

## Çizelge kilitlenmeden satılacak bir ürün yok

Zincirin ilk halkası uçuş çizelgesi, ve kaynak onu bütün operasyonun temeli
olarak konumluyor. Bir rotanın kârlı olup olmadığı dört girdinin kesişiminde
belirleniyor: pazar büyüklüğü tahmini, uçak tipi, operasyonel maliyetler ve
rakip çizelgeleri. Karar mantığı basit bir eşitsizlik: belirli bir uçak
tipinin kapasitesi o pazardaki talebe oturuyorsa ve beklenen gelir
operasyonel maliyeti aşıyorsa rota kârlı sayılıyor. Operasyonel maliyet
burada nihai hakem; talep ne kadar parlak görünürse görünsün, maliyet
verisi rotayı kesebiliyor.

Pazar payı tahmini de ayrı bir hesap. Kaynak, algoritmanın havayolunun o
pazardaki rekabet gücünü hesaplarken günün saatini, toplam yolculuk
süresini (elapsed time), uçak tipini ve kod paylaşımını hesaba katması
gerektiğini söylüyor. Yani aynı rotada aynı fiyatla uçan iki havayolundan
biri, sabah yedide ve aktarmasız uçtuğu için payın büyüğünü alabiliyor.
Kapasite kararı böylece fiyat kararından önce pazar payının bir kısmını
kilitlemiş oluyor.

![Başlık: Kapasite ve Talebi Buluşturmak. Solda üç girdi kutusu: Kamu ve Ticari Veriler, Rakip Uçuş Programları, Zaman ve Uçak Tipi. Okları ortadaki altıgen Kapasite Planlama kutusuna giriyor, oradan kalın turuncu bir ok Kârlı Pazar Payı kutusuna çıkıyor. Altta iki madde: uzun vadeli planlama pazar talebinin toplanması ve doğrulanmasıyla başlar; uçuş planlaması belirli bir uçak tipinin kapasitesi ve işletme maliyetleri göz önüne alınarak kârlı talep yaratacak rotaları belirler. Sağda teknik notlar: SSIM (Standart Tarife Bilgi Kılavuzu) mesajları, slot yönetimi, IATA yaz ve kış sezonları; kapasite planlama süreci 330 gün önceden fiziksel uçuş envanterini oluşturmak için havayolunun PSS altyapısını besler; yakıt, mürettebat ve bakım gibi işletme maliyetleri seçilen uçak tipine sıkı sıkıya bağlıdır ve LOPA (yolcu konaklama düzeni) temelinde maksimum potansiyel geliri kesin bir şekilde sınırlar.](/decks/commercial-ecosystem/02.webp "Sağdaki son not gözden kaçıyor: uçak tipi seçildiği anda gelirin tavanı da seçilmiş oluyor. Fiyatlandırma o tavanın altında çalışıyor.")

Yazılım tarafında bunun karşılığı somut. Sunumun notlarına göre çizelge
kilitlendiğinde, merkezi rezervasyon sisteminin (host CRS) envanter
bileşeninde uçuşları yaratıyor; çizelge PSS'e girmeden dağıtılacak ya da
satılacak tek bir ürün yok. Çizelge dünyaya SSIM formatındaki mesajlarla
yayılıyor ve bu süreç kalkıştan 330 gün önce fiziksel uçuş envanterini
oluşturuyor. Envanter, fiyat, teklif ve dağıtım modüllerinin hepsi bu ilk
yazımın üzerine kuruluyor. Çizelgedeki bir değişiklik, aşağı akıştaki her
sistem için bir ürün değişikliği demek.

![Başlık: Temel Taş, Uçuş Çizelgesi ve Kapasite Planlama Süreci. Girdi, süreç, çıktı düzeninde bir akış. Girdiler: Talep Verileri ve Pazar Büyüklüğü, Operasyonel Maliyetler, Rakip Çizelgeleri ve Uçuş Saatleri. Ortada altıgen içinde Kapasite Planlama Analizi. Çıktılar: Kârlı Rota Yapısı, Doğru Uçak Tipi Eşleştirmesi (kapasite optimizasyonu), Rekabetçi Uçak İçi Hizmet Seviyeleri (First, Business, Economy). Konuşmacı notu: çizelgeleme havayolu operasyonlarının mutlak temelidir; havayolları çizelgeleri küresel olarak SSIM gibi standart mesaj formatlarıyla yayınlar. Çizelge kilitlendiğinde host CRS'in envanter bileşeninde uçuşlar yaratılır; PSS'te çizelge yoksa dağıtılacak ya da satılacak ürün de yoktur.](/decks/profitability-blueprint/03.webp "Çıktılardan üçüncüsüne dikkat: kabin sınıfları da kapasite kararının ürünü. Fiyatlandırmanın satacağı sınıflar bu aşamada çiziliyor.")

## Ürün A'dan B'ye gitmek değil, bir teklif

Aynı çizelgedeki aynı koltuk tek başına bir emtia. Havayolunu rakibinden
ayıran şey, o koltuğun etrafına örülen hizmet seviyesi. Kaynak rekabetteki
farklılaşmayı müşteri ihtiyacını karşılayan uçak içi hizmet seviyelerine
bağlıyor; sadakat programları ve kabin içi yenilikler, geniş diz mesafesi
ya da daha iyi ikram gibi, pazar payını korumanın ve büyütmenin aracı.

![Başlık: Kârlılık Denklemi ve Ürün Farklılaştırması. Üstte küp biçiminde bir denklem: Hizmet artı Fiyat artı Beklenti eşittir Kârlılık (son küp turuncu). Altında yandan görünüşte bir uçak kabini üç bölgeye ayrılmış: Economy, Business, First. Altta iki madde: müşteri ihtiyaçlarını karşılayan uçak içi hizmet seviyeleri ile rekabette farklılaşma; sadakat programları ve kabin içi yenilikler (geniş diz mesafesi, iyileştirilmiş ikramlar) ile pazar payını koruma ve artırma. Sağda notlar: ilgili kavramlar LOPA, yan gelirler (ancillaries), mağazacılık (merchandising) ve sık uçan yolcu programları; PSS içinde fiziksel kabin sınıfları (First, Business, Economy), RBD (rezervasyon kayıt belirleyicileri) olarak bilinen mantıksal rezervasyon sınıflarıyla eşleştirilir; ekstra diz mesafesi gibi değer katma adımları ürünü basit bir emtia olmaktan çıkarıp farklılaştırılmış bir perakende teklifine dönüştürür.](/decks/commercial-ecosystem/03.webp "Kabin çizimi üç bölge gösteriyor ama sistem içinde sayı çok daha fazla: her fiziksel kabin birden çok mantıksal rezervasyon sınıfına bölünüyor.")

Buradaki mühendislik ayrımı önemli. Fiziksel kabin (First, Business,
Economy) uçağa ait; RBD denen mantıksal rezervasyon sınıfları ise satışa.
PSS bu ikisini birbirine eşliyor ve fiyatlandırmanın da gelir yönetiminin
de üzerinde çalıştığı katman ikincisi. Bir koltuğun ne kadara satılacağı
kabinin değil, o anda açık olan rezervasyon sınıfının sorusu.

## Doğru fiyat, müşterinin ödeyeceği en yüksek fiyat

Kaynak metin fiyatlandırmayı tek cümleyle tanımlıyor: doğru fiyat,
müşterinin bir ürün için ödeyeceği en yüksek fiyattır. Bu cümle, fiyatın
maliyetten değil müşteriden okunduğunu söylüyor, ve müşteri tek tip değil.
Segmentasyonun dayandığı değişken fiyat esnekliği: boş zaman (leisure)
yolcusu fiyata hassas, küçük bir fiyat değişimi talebini hızla artırıp
azaltıyor; iş (business) yolcusu fiyata daha az duyarlı, çünkü onun
önceliği zamanlama, esneklik ve iş planına uyum.

İş mantığı bu farkı iki ayrı stratejiye çeviriyor. Fiyata hassas leisure
segmentinde düşük ücretlerle talep yaratılıyor; fiyata duyarsız ama zamana
hassas business segmentine daha yüksek ücretler ve esnek rezervasyon
seçenekleri sunuluyor. Aynı uçuşta, aynı kabinde iki yolcu çok farklı
fiyatlar ödüyor ve ikisi de kendi açısından doğru fiyatı ödemiş oluyor.

![Başlık: Yolcu Segmentasyonu ve Fiyat Esnekliği. Üstte cümle: maksimum gelir, müşterileri ihtiyaçlarına ve ödeme isteklerine göre segmente etmekten geçer; doğru fiyat, müşterinin ödemeye hazır olduğu en yüksek fiyattır. Altta iki sütun. Tatil Amaçlı Yolcular: yavaşça düşen yatık bir talep eğrisi, Yüksek Fiyat Esnekliği, küçük bir fiyat değişimi talepte büyük bir dalgalanmaya yol açar. İş Amaçlı Yolcular: dik düşen bir eğri, Düşük Fiyat Esnekliği, iş kısıtlamaları nedeniyle fiyat değişimleri talebi çok az etkiler. Sağda notlar: ilgili akışlar teklif yönetimi ve ücret girişi (fare filing); kavramlar ATPCO, fiyat esnekliği ve rezervasyon eğrileri; RM sistemleri iki talep akışını tahmin etmek için geçmiş rezervasyon eğrilerini kullanır, tatil yolcusu erken ve ucuz, iş yolcusu geç ve pahalı rezervasyon yapar; sistem geç rezervasyon yapan esnek olmayan iş yolcusuna yer ayırmak için boş koltuk riskini alarak envanteri kasıtlı olarak geride tutar.](/decks/commercial-ecosystem/04.webp "Sağdaki son not segmentasyonun bedelini söylüyor: iş yolcusuna yer saklamak, o yer boş kalırsa kaybı kabul etmek demek.")

Segmentasyonun zaman boyutu, fiyatlandırmayı gelir yönetimine bağlayan
yer. Sunumun notlarına göre tatil yolcusu erken ve ucuz, iş yolcusu geç ve
pahalı rezervasyon yapıyor; gelir yönetimi sistemleri bu iki talep akışını
geçmiş rezervasyon eğrilerinden tahmin ediyor. Sistem, geç gelecek iş
yolcusuna yer ayırmak için envanteri kasıtlı olarak geride tutuyor ve boş
koltuk riskini bilerek alıyor. Teknik tarafta segmentasyon ücret temel
kodları (fare basis) ve biletin taşıdığı Y, J, C, Q gibi rezervasyon sınıfı
harfleriyle uygulanıyor; fiyat kuralları ATPCO üzerinden küresel olarak
yayınlanıyor ve havayolunun fiyat motoru nihai teklifi temel ücretleri
esneklik kurallarıyla birleştirerek hesaplıyor.

![Başlık: Müşteri Segmentasyonu, Fiyat Duyarlılığı ve Talep Esnekliği. Turuncu bant: geliri maksimize etmenin sırrı, müşterinin ödemeye hazır olduğu en yüksek değeri doğru analiz etmektir. Altta üç satırlı tablo, tatil amaçlı yolcu (leisure) ve iş amaçlı yolcu (business) karşılaştırması. Fiyat esnekliği: yüksek (elastik) ve düşük (inelastik). Tepki: ufak fiyat değişimleri talebi hızla artırır veya düşürür, ve fiyat değişimleri uçuş talebini çok az etkiler. Temel öncelik: düşük fiyat arayışı, ve zamanlama, esneklik ve iş planına uyum. Konuşmacı notu: bu matris havayolu fiyatlandırma ve teklif yönetiminin temel öncülüdür; havayolları bu segmentasyonu teknik olarak ücret temel kodları ve bilete eklenen Y, J, C, Q gibi RBD harfleriyle uygular. Fiyat kuralları ATPCO üzerinden küresel olarak yayınlanır ve dağıtılır; fiyat motoru nihai teklifi temel ücretleri esneklik kurallarıyla birleştirerek hesaplar.](/decks/profitability-blueprint/04.webp "Tablonun son satırı fiyat dışında bir eksen açıyor: business yolcusu ucuzluğu değil uyumu satın alıyor, esnek bilet koşulları da bu yüzden ürünün parçası.")

## Envanter uçuşu değil yolculuğu fiyatlamalı

Segmentasyon hangi yolcunun ne kadar ödemeye razı olduğunu söylüyor;
kimin koltuğu alacağına ise gelir yönetimi karar veriyor. Kaynağa göre
gelir yönetimi, sınırlı kapasiteyi en kârlı yolcu kompozisyonuna tahsis
etme süreci. Sistem her rezervasyon talebinde yolcunun havayolu için toplam
değerine bakıyor: ücret sınıfı, segment, köken-varış değeri. Daha yüksek
ücret ödeme potansiyeli olan yolcular için koltuk saklanıyor; kaynak buna
seçici kabul (selective acceptance) diyor.

Seçici kabulün hangi çözünürlükte yapıldığı her şeyi değiştiriyor.
Geleneksel bacak (leg) bazlı sistemler yalnızca tek bir uçuşun doluluğuna
bakıyor. Köken-varış (O&D) mantığı ise bütün ağın gelirini düşünüyor.
Kaynak O&D gelir yönetimini, toplam ağ gelirini maksimize etmek için
müşterileri ücrete, hizmet sınıfına ve kalkış tarihine göre seçici olarak
kabul etme ya da reddetme süreci olarak tanımlıyor. Pratik sonucu şu: tek
bir bacakta daha düşük ücretli bir yolcuyu reddedip o koltuğu daha uzun
mesafeli, toplamda daha kârlı bir aktarmalı yolcuya ayırmak, ağ gelirini
artırabiliyor.

![Başlık: Envanter Kontrolü, Maksimum Ağ Geliri. Üstte cümle: rezervasyon sisteminin (host CRS) envanter detay seviyesi, gelir yönetimi sisteminin gelişmişliğini belirler. Solda Geleneksel Yöntem, Bacak Bazlı: A'dan B'ye turuncu ok, B'den C'ye kesikli gri ok; altında bacak veya segment bazlı kararlar, ağın bütününü göremez. Sağda O&D Gelir Yönetimi: A'dan B'ye ve B'den C'ye iki mavi ok, üzerlerinde A ile C'yi birleştiren bir parantez; altında fiyat, hizmet sınıfı ve kalkış tarihine göre müşterileri seçici olarak kabul veya reddederek toplam ağ gelirini maksimize eder. Sağda notlar: kavramlar O&D, host CRS, bağlı segmentler (married segments) ve teklif fiyatı (bid price); O&D tabanlı bir RM sistemi, A-B-C yolculuğunun toplam değeri A-B geliri ile boş kalan B-C koltuğunun toplamından daha yüksekse, yüksek ücret ödeyen doğrudan bir A-B yolcusunu reddedip koltuğu daha düşük ücret ödeyen aktarmalı A-B-C yolcusu için saklayabilir; bu gerçek zamanlı erişilebilirlik (availability) talepleriyle değerlendirilir.](/decks/commercial-ecosystem/05.webp "Üstteki cümle bir mimari kısıt: RM ne kadar akıllı olursa olsun, envanter sistemi yolculuğu göremiyorsa o zekâyı kullanamıyor.")

Sunumun notları bu kararın hesabını açık yazıyor: A-B-C yolculuğunun toplam
değeri, A-B geliri ile boş kalacak B-C koltuğunun toplamından yüksekse,
sistem A-B için daha yüksek ücret ödeyen doğrudan yolcuyu reddedip koltuğu
aktarmalı yolcuya saklayabiliyor. Bacak bazlı bir sistem bu kararı veremez,
çünkü A-B-C'yi iki ayrı uçuşun iki ayrı satışı olarak görüyor.

Yazılım tarafında bunun karşılığı, gelir yönetiminin gelişmişliğinin
envanterin detay seviyesiyle sınırlı olması. Sunumun ifadesiyle eski PSS ve
host sistemleri yalnızca fiziksel bacakları görebiliyordu; modern RM
sistemleri teklif fiyatı (bid price) algoritmalarıyla tek bir koltuğun
bütün ağ yolculuğu üzerindeki ekonomik değerini hesaplıyor. Bir uçuş arama
(AirShopping) isteği geldiğinde envanter sistemi erişilebilirliği O&D
kontrolüyle hesaplıyor ve yüksek getirili aktarmalı yolcu için koltuk
koruyor. Bağlı segmentler (married segments) kavramı da buradan doğuyor:
aktarmalı yolculuğun bacakları tek bir birim olarak değerlendirilmeli, ayrı
ayrı satılıp iptal edilebilir iki satır olarak değil.

![Başlık: Verim Yönetiminin Evrimi, Ağı Bütünüyle Görmek. Solda Bacak ya da Segment Bazlı Kontrol (geleneksel): A'dan B'ye tek bir ok; maddeler: eski rezervasyon sistemlerinin kısıtlamaları nedeniyle her uçuş tekil olarak değerlendirilir; kritik hata, bağlantılı uçuşların yarattığı toplam ağ değeri gözden kaçırılır. Sağda O&D (Kalkış-Varış) Bazlı Kontrol (gelişmiş): A, B ve C arasında birbirine bağlanan birden çok eğri ok, A'dan C'ye turuncu bir yay; maddeler: tüm ağın toplam kârlılığını maksimize etmeye odaklanır; yolcular ücret, hizmet sınıfı ve kalkış tarihine göre seçici olarak kabul veya reddedilir. Konuşmacı notu: bu, envanter yönetiminde büyük bir mimari sıçrama; eski PSS ve host sistemleri yalnızca fiziksel bacakları görebiliyordu, modern RM sistemleri teklif fiyatı algoritmalarıyla tek bir koltuğun bütün ağ yolculuğu üzerindeki ekonomik değerini hesaplar. AirShopping isteği sırasında envanter sistemi erişilebilirlik hesabı için O&D kontrolünü kullanır ve yüksek getirili aktarmalı yolcular için koltuk korur.](/decks/profitability-blueprint/05.webp "Sağdaki ok demeti tek bir B-C koltuğunun kaç farklı yolculuğa ait olabileceğini gösteriyor. Koltuğun değeri de hangisine satıldığına göre değişiyor.")

## Sadakat verisi rezervasyon anına girmedikçe yalnızca bir mil defteri

Segmentasyon müşteriyi gruba koyuyor; CRM onu birey olarak tanımaya
çalışıyor. Kaynağa göre modern CRM uygulamaları geleneksel sadakat
programlarını tamamlıyor: amaç müşteriyi her temas noktasında tanımak ve
bireysel değerine göre hizmet sunmak. Sadakat programı veritabanındaki
profiller ve geçmiş seyahat verileri ileri analitikle işleniyor, çıktısı da
müşterinin değerine ve ihtiyacına uygun kişiselleştirilmiş teklifler: daha
üst sınıf koltuk, ek hizmetler. Çapraz satış (cross-sell) ve üst satış
(upsell) bu yolla ek gelir yaratıyor.

![Başlık: CRM ve Sadakat Döngüsü. Ortada koyu mavi daire içinde Sadakat Veritabanı, çevresinde Gelişmiş Analitik ve Bireysel Değer halkası, en dışta dönen üç yay: Çapraz Satış, Üst Satış, Özel Kampanyalar. Solda üç madde: geleneksel sadakat programlarını tamamlayan modern CRM uygulamaları; müşteriyi tüm temas noktalarında tanıma ve bireysel müşteri değerini anlama; müşteri profiline dayalı çapraz satış ve üst satış fırsatları ile yeni talep yaratma. Sağda notlar: sistemler CDP (müşteri veri platformu) ve sık uçan yolcu programı; akışlar pazarlama, mağazacılık ve modern havayolu perakendeciliği; yalnızca mil sayan eski sadakat programlarından modern CDP'lere geçiş havayollarının dinamik fiyatlandırma yapmasına olanak tanır; sistem uçuş arama (AirShopping) akışında yüksek değerli bir müşteriyi tanıdığında, standart olarak dosyalanmış bir ücret yerine o kişiye özel uyarlanmış bir paket veya fiyatı anında sunabilir.](/decks/commercial-ecosystem/06.webp "Döngünün merkezi veritabanı ama asıl iş en dış halkada: veri ancak bir teklife dönüştüğünde gelir üretiyor.")

Buradaki kilit fark, veriyi yalnızca mil hesabında tutan eski sadakat
programıyla onu arama anında kullanan sistem arasında. Sunumun notlarına
göre sadakat seviyesi uçuş arama cevabını doğrudan etkileyebiliyor: PNR'da
taşınan sık uçan yolcu numarasına bakarak envanter sistemi gizli bir
rezervasyon sınıfını açabiliyor ya da fiyat motoru bagaj ücretini
dinamik olarak kaldırabiliyor. CRM bu noktada teklif yönetimine ve
perakendeciliğe açılan köprü; derin müşteri bilgisi, rezervasyon akışı
içinde ekstra diz mesafesi ya da lounge erişimi gibi yan hizmetlerin
dinamik olarak paketlenmesine izin veriyor.

Yazılımcı için soru şu: müşteri değeri hangi sistemde hesaplanıyor ve
rezervasyon anında hangi sisteme ulaşıyor? Kaynak metnin önerisi açık,
CRM'den gelen müşteri değeri bilgisi dinamik teklif için gelir yönetimi
sistemine girdi olarak verilmeli. CRM verisi gece çalışan bir kampanya
işine akıp orada kalıyorsa, müşteri arama yaptığı saniyede tanınmıyor.

![Başlık: Sadakatten Yeni Talebe, Veri Odaklı CRM. Dört düğümlü dairesel bir akış. Üst düğüm, Sadakat Verisi: sadakat programları (frequent flyer) müşteriyi tanımak için mükemmel bir başlangıç noktası sunar. Sağ düğüm, Gelişmiş Analitik: müşteriyi tüm temas noktalarında tanıyarak bireysel müşteri değerini ölçme. Alt düğüm, Çapraz Satış ve Üst Satış: analitik algoritmalar sayesinde doğru hedeflenmiş fırsatlar yaratma. Sol düğüm, Kişiselleştirilmiş Hizmet: müşteri profiline uygun birebir hizmet sunma. Konuşmacı notu: CRM modern teklif yönetimine ve perakendeciliğe köprü görevi görür; derin müşteri bilgisi havayollarının rezervasyon akışında ekstra diz mesafesi ve lounge erişimi gibi yan hizmetleri dinamik olarak paketlemesine izin verir. Sadakat seviyeleri AirShopping cevabını doğrudan etkiler: PNR içinde iletilen sık uçan yolcu numarasına göre envanter sistemi gizli bir rezervasyon sınıfını açabilir ya da fiyat motoru bagaj ücretini dinamik olarak kaldırabilir.](/decks/profitability-blueprint/06.webp "Notun son cümlesi bir entegrasyon gereksinimi: sık uçan yolcu numarası PNR'a girdiği anda envanter ve fiyat motoru onu okuyabilmeli.")

## Kanal seçimi bir iş modeli seçimi

Zincirin son halkası ürünü müşteriye ulaştırmanın maliyeti. Kaynak iki
farklı stratejiyi karşılaştırıyor. Düşük maliyetli taşıyıcılar (LCC)
genellikle yalnızca düşük maliyetli doğrudan kanalları kullanıyor, çünkü
dağıtım maliyetini sıfırlamak iş modelinin parçası. Tam hizmet veren
taşıyıcılar (FSC) ise yüksek değerli kurumsal müşterilere ulaşmak için GDS
maliyetine katlanıp dolaylı kanallarda da yer alıyor. Havayolları GDS
maliyetinden kaçınmak için doğrudan kanala yöneliyor ama kurumsal müşteri,
seyahat politikası gereği çoğu zaman dolaylı kanaldan geliyor.

![Başlık: Dağıtım Kanalları İkilemi. Solda iki koyu kutu: Doğrudan Kanal ve GDS / Dolaylı Kanal. Doğrudan kanaldan LCC (düşük maliyetli) stratejisine ok: dağıtım maliyetlerini sıfırlamak için yalnızca doğrudan satış. Dolaylı kanaldan FSC (geleneksel) stratejisine ok: kurumsal politikalara bağlı, yüksek gelirli yolculara ulaşmak. İki strateji turuncu Bütçe ve Finansal Karar kutusunda birleşiyor; altında temel çatışma: dolaylı dağıtım maliyetlerini ortadan kaldırmak (aracıları çıkarma, dis-intermediation) ile yüksek değerli kurumsal müşterileri elde tutmak arasındaki denge. Sağda notlar: sektör terimleri GDS (Amadeus, Sabre), LCC, FSC ve aracıları çıkarma; etkilenen akışlar dağıtım ve biletleme; bu sayfa günümüz havacılığındaki en büyük teknoloji savaşına değiniyor, EDIFACT (eski GDS protokolü) ve NDC (yeni dağıtım kabiliyeti); havayolları GDS ücretlerini atlamak, daha zengin içerik sunmak ve aracıları çıkarma ikilemini çözmek için NDC'yi (doğrudan XML API'leri) zorluyor.](/decks/commercial-ecosystem/07.webp "Turuncu kutunun adı dikkat çekici: kanal seçimi bir teknoloji kararı olarak değil, bir bütçe kararı olarak konumlanıyor.")

Bu gerilimin bugünkü teknik adı NDC. Sunumun notları kanal ikilemini eski
GDS protokolü EDIFACT ile NDC arasındaki savaşa bağlıyor: havayolları GDS
ücretlerini atlamak, daha zengin içerik dağıtmak ve aracıları çıkarma
ikilemini çözmek için doğrudan XML API'leri olan NDC'yi zorluyor. Önceki
halkayla bağlantı da burada kuruluyor. Kişiselleştirilmiş teklif ancak
havayolunun teklifi kendisi kurduğu bir kanalda müşteriye ulaşabiliyor;
dolaylı kanalın eski protokolü o teklifi taşıyamıyorsa CRM'e yapılan
yatırım o kanalda görünmüyor.

![Başlık: Ürünü Pazara Sunmak, Maliyet Etkin Dağıtım Stratejileri. Solda Havayolu, sağda Müşteri altıgenleri. Üstte doğrudan geçen kalın turuncu ok, Doğrudan Dağıtım (direct channel): maliyet açısından en verimli kanal, özellikle düşük maliyetli taşıyıcıların birincil satış tercihi. Altta dolaylı yol: Havayolu, GDS (aracı), Kurumsal Müşteri ve Müşteri; kutu Dolaylı Dağıtım (GDS): tam hizmet veren havayolları tarafından yoğun olarak kullanılır, kurumsal seyahat politikalarına bağlı yüksek değerli müşterilere ulaşımı sağlar; sektörel hedef, havayolları GDS bağımlılığını ve aracı maliyetlerini azaltmak için stratejiler geliştirmektedir. Konuşmacı notu: slayt doğrudan satış (havayolu sitesi ve uygulaması) ile GDS (Sabre, Amadeus, Travelport) ve seyahat yönetim şirketleri üzerinden dolaylı dağıtım arasındaki gerilimi vurguluyor; aracı maliyetlerini azaltma hedefi bugün NDC ile ilerliyor, NDC havayollarının eski GDS teknik sınırlarını aşmasına, zengin içeriği doğrudan dağıtmasına ve ücretleri düşürmesine izin veren bir XML/API standardı.](/decks/profitability-blueprint/07.webp "Alttaki yol iki durak uzun ve her durak bir maliyet. Kurumsal müşteri ise tam o yolun sonunda duruyor.")

## Algoritma rakibin ne yapacağını bilmiyor

Buraya kadar anlatılan her halka bir sistemle desteklenebiliyor: çizelge
optimizasyonu, fiyat motoru, RM algoritması, CDP, NDC API'si. Kaynak metin
ise rekabet avantajının teknolojinin ötesinde bir yerde durduğunu
söylüyor: fiyatlandırma ve gelir yönetimi analisti için temel özellik,
rakibin zihnine girebilmek. Rakibin fiyat değişimine tepki modellerle
değil, analistin pazar dinamiklerini ve rakibin geçmiş davranış kalıplarını
yorumlamasıyla kuruluyor. Kararın temelindeki soru hep aynı: bu fiyatı
değiştirirsem rakibim nasıl yanıt verecek?

![Başlık: Rekabet Avantajının Sırrı, İnsan Faktörü. İki sütun: Teknoloji başlığı altında grafikler, pasta grafik ve ağ diyagramları; Strateji ve Sezgi başlığı altında satranç tahtası başında düşünen takım elbiseli bir adam. Altta üç cümle: teknoloji ve karmaşık karar destek sistemleri çözümün yalnızca bir parçasıdır; bir analistin en önemli özelliği pazar dinamiklerini bilmek ve rakibin zihnine girebilmektir; fiyatı değiştirirsem rakiplerim nasıl tepki verir sorusuna gelişmiş algoritmalar kesin yanıt veremez, bu ancak rakiplerin davranış kalıplarını anlayan uzman bir yönetici ile mümkündür. Sağda notlar: kavramlar RM analistleri, kullanıcı geçersiz kılmaları (user overrides) ve rakip ücretleri; RM sistemleri teklif fiyatı oluşturmak için geçmiş verilere bakar ama insan analistler ATPCO gibi sistemleri aktif olarak izler; bir rakip beklenmedik şekilde fiyat düşürürse algoritma talebin neden arttığını bilemez; analist sistemin çok ucuza tükenmesini önlemek için manuel bir kullanıcı geçersiz kılması uygulamalıdır.](/decks/commercial-ecosystem/09.webp "Sağdaki örnek algoritmanın kör noktasını tarif ediyor: talep artışını görüyor ama nedenini göremiyor, ve yanlış nedene göre fiyatlıyor.")

Sunumun notları bunun operasyonel karşılığını veriyor. RM sistemleri
teklif fiyatını geçmiş veriden üretiyor; rakip beklenmedik şekilde fiyat
düşürdüğünde algoritma talebin neden değiştiğini bilemiyor. Analist bu
durumda sistemin yanlış fiyattan tükenmesini önlemek için elle bir
kullanıcı geçersiz kılması (user override) uyguluyor. Analistler doluluk
oranı, getiri ve RASK gibi göstergeleri sürekli izliyor, rakip hareketlerini
dış rekabet istihbaratı araçlarıyla takip edip algoritmalar uyum sağlamadan
günlük ya da saatlik ayar yapıyor.

![Başlık: Sistemin Kalbi, Analistin Stratejik Rolü. Solda üç kesişen daire: Teknoloji, İş Süreçleri ve İnsan; kesişimde turuncu Rekabet Avantajı. Sağda kutu, kritik soru: bir fiyat değişikliği yaptığımda rakiplerim nasıl tepki verecek? Maddeler: insan zekâsının yeri, en gelişmiş yazılımlar bile bu soruyu kesin olarak cevaplayamaz; pazar dinamiklerini ve rakip davranışlarını okuyabilen fiyat ve verim yönetimi analistleri kârlılığın asıl mimarlarıdır; teknoloji ancak doğru insan sezgisi ve entegre iş süreçleriyle birleştiğinde gerçek rekabet avantajı yaratır. Konuşmacı notu: RM sistemleri büyük ölçüde otomatik ama RM analistleri doluluk oranı, getiri ve RASK gibi göstergeleri sürekli izler ve gerçek zamanlı pazar istihbaratına dayanarak sistem önerilerini elle geçersiz kılar; analistler rakip hareketlerini izlemek için Infare veya ATPCO FareManager gibi dış rekabet istihbaratı araçlarına dayanır ve algoritmalar uyum sağlamadan önce günlük ya da saatlik ayarlamalar yapar.](/decks/profitability-blueprint/08.webp "Kesişim üç dairenin hepsini gerektiriyor: süreci olmayan analist sezgisini sisteme aktaramıyor, analisti olmayan sistem rakibi okuyamıyor.")

Yazılım tarafında bunun karşılığı, override'ın bir istisna değil birinci
sınıf bir özellik olması. Kaynak metin, otomatik fiyatlandırma modellerine
ek olarak analistlerin pazar içgörüsünü ve rakip davranış tahminini sisteme
katabileceği karar destek mekanizmalarının güçlendirilmesini öneriyor. Bu,
elle girilen müdahalenin kim tarafından, neden ve ne kadar süreyle
yapıldığının kaydını tutan, algoritmanın bir sonraki çalışmasında
ezilmeyen bir arayüz demek.

## Entegrasyon bir yazılım projesi değil, bir işletme modeli

Beş halka ve onları yöneten insanlar ancak birbirine bağlıysa çalışıyor.
Kaynak metin pazarlama, planlama ve operasyon alanlarındaki iş süreçlerinin
entegrasyonunu etkili karar almanın anahtarı olarak görüyor; sürekli
iyileştirme için sistem performansının izlenmesi ve fonksiyonel alanlara
geri bildirim verilmesi şart. Sunum sektör dışından bir örnek de veriyor:
Fransız Ulusal Demiryolları (SNCF), entegre planlama, fiyatlandırma ve gelir
yönetimi kararlarıyla Edelman Ödülü'nü kazanmış.

![Başlık: Fonksiyonlar Arası Sürekli Entegrasyon. Birbirine geçmiş üç turuncu dişli: Planlama, Fiyatlandırma, Gelir Yönetimi; çevrelerinde Sürekli İyileştirme yazan dairesel oklar. Sağda iki madde: pazarlama, planlama ve operasyon alanlarında iş süreçlerinin entegrasyonu etkili karar almanın anahtarıdır; sürekli iyileştirme için sistem performansının izlenmesi ve fonksiyonel alanlara geri bildirim sağlanması şarttır. Altta tren simgeli kutu: sektör dışı başarı, Fransız Ulusal Demiryolları (SNCF) entegre planlama, fiyatlandırma ve gelir yönetimi kararlarıyla prestijli Edelman Ödülü'nü kazanarak bu sinerjinin gücünü kanıtlamıştır. Sağda notlar: teknik ihtiyaç, bu fonksiyonel alanları birbirine bağlamak devasa veri gölleri ya da ambarları gerektirir, tarihsel olarak PSS modülleri birbirinden oldukça kopuktu; sektörel dönüşüm, havacılık endüstrisi şu anda ONE Order yapısına geçiyor; ONE Order, IATA'nın geleneksel PNR, e-bilet ve EMD'leri tek bir perakende siparişine dönüştürerek RM, fiyatlandırma ve operasyonlar arasında bu tür bir iş süreci entegrasyonunu zorunlu kılan girişimidir.](/decks/commercial-ecosystem/08.webp "Dişliler aynı anda dönüyor; biri durursa hepsi duruyor. Sağdaki not bunun neden zor olduğunu söylüyor: PSS modülleri tarihsel olarak birbirinden kopuk kuruldu.")

Sunumun notları engeli de adıyla koyuyor: PSS modülleri tarihsel olarak
birbirinden oldukça kopuktu, bu alanları birbirine bağlamak da büyük veri
gölleri ve ambarları gerektiriyor. IATA'nın ONE Order girişimi PNR'ı,
e-bileti ve EMD'yi tek bir perakende siparişine dönüştürerek bu
entegrasyonu zorunlu kılıyor. Kaynak metnin önerisi aynı yöne bakıyor:
planlama, fiyatlandırma ve gelir yönetimi birimleri arasındaki iş süreçleri
ortak veri kullanımı, özellikle gelir yönetimi çıktıları üzerinden entegre
edilmeli.

Burada bir uyarı gerekiyor. Entegrasyonu yalnızca veri boru hattı olarak
görmek, sunumun kapanışta söylediğini kaçırmak olur. Başarılı bir gelir
yönetimi programının üç ayağı var: insan, süreç ve teknoloji. Sunumun
sentezine göre bir havayolu için asıl farklılaştırıcı yeni bir RM sistemi
satın almak değil; o sistemi tam kapasiteyle kullanacak yetenekli
analistlere ve departmanlar arası kusursuz iletişime sahip olmak. Temel
teknoloji zaten demokratikleşiyor.

![Başlık: Başarılı Bir Gelir Yönetimi Programı. Köşelerinde İnsan, Süreç ve Teknoloji yazan bir üçgen, ortasında turuncu altıgen içinde Maksimum Kârlılık ve Rekabet Gücü. Altta üç madde: gerçek sinerji kapasite, fiyatlandırma, CRM ve dağıtımın tek bir sistem olarak işlemesidir; insan faktörü ve iş süreçleri teknolojinin sağladığı verileri rekabetçi bir silaha dönüştürür; başarı bu üç unsurun kusursuz entegrasyonunda yatar. Sağda nihai sentez notu: havayolu BT altyapısı eski PSS yapılarından modern, yapay zekâ odaklı perakendecilik ortamlarına dönüşürken temel teknoloji demokratikleşmektedir; ilerleyen dönemde bir havayolu için asıl farklılaştırıcı unsur sadece yeni bir RM sistemi satın almak değil, bu sistemi tam kapasiteyle kullanacak yetenekli analistlere (insan) ve departmanlar arası kusursuz iletişime (süreç) sahip olmaktır.](/decks/commercial-ecosystem/10.webp "Teknoloji üç köşeden sadece biri, ve sağdaki nota göre giderek herkesin sahip olduğu köşe.")

Sunumun son slaytı beş halkayı beş cümleye indiriyor. Her cümle bu
bölümdeki bir başlığın karşılığı.

![Başlık: Özet, Sinerji ve Kârlılık Nasıl Yaratılır? Simgeli beş satır: veriye dayalı, maliyet ve talep odaklı kapasite planlaması yapmak; müşteri davranışını anlayarak talebe ve esnekliğe uygun fiyatlandırma stratejileri kurmak; bacak bazlı kısıtlamaları aşıp tüm ağı kapsayan O&D envanter yönetimine geçmek; CRM verisiyle desteklenen, maliyet etkin doğrudan dağıtım kanallarını güçlendirmek; gelişmiş algoritmaları rakibi okuyabilen insan sezgisi ve piyasa tecrübesiyle yönetmek. Konuşmacı notu: bir havayolunun finansal başarısı karmaşık bir boru hattıdır; doğru ürünü yaratmayı (çizelgeleme), onu dinamik fiyatlamayı (teklif yönetimi), yüksek değerli koltukları korumayı (gelir ve envanter yönetimi) ve verimli dağıtmayı (NDC ve doğrudan kanallar) gerektirir. Bu birbirine bağlı akışları anlamak, sipariş yönetim sistemlerinden yeni nesil PSS mimarilerine kadar modern havayolu BT sistemi kuran ya da entegre eden herkes için esastır.](/decks/profitability-blueprint/09.webp "Notun son cümlesi bu bölümün okuru için yazılmış: hangi modülü kuruyor olursan ol, beş satırdan hangisine dokunduğunu bilmen gerekiyor.")

## Yarın işe yarayacak dört çıkarım

1. **Envanteri O&D kontrolüne taşı.** Maksimum kârlılık için rezervasyon
   sistemlerinin bacak bazlı kontrolden O&D bazlı kontrole yükseltilmesi
   hedeflenmeli. RM'in gelişmişliği envanterin detay seviyesiyle sınırlı;
   envanter yolculuğu görmüyorsa teklif fiyatı hesabı da ağ değerini
   göremiyor.
2. **Planlama, fiyat ve RM'i ortak veriyle bağla.** Bu üç birim arasındaki
   iş süreçleri, gelir yönetimi çıktılarının ortak kullanımı üzerinden
   entegre edilmeli. Çizelgedeki bir değişiklik aşağı akıştaki her sistem
   için bir ürün değişikliği; bunu toplu aktarımla değil ortak bir veri
   sözleşmesiyle taşı.
3. **Müşteri değerini rezervasyon anına getir.** CRM'den elde edilen
   müşteri değeri bilgisi, dinamik teklif sunmak için gelir yönetimi
   sistemine girdi olarak verilmeli. Sık uçan yolcu numarası PNR'a girdiği
   anda envanter ve fiyat motoru onu okuyabiliyor olmalı; gece çalışan bir
   kampanya işi bu işi görmüyor.
4. **Analistin müdahalesine yer aç.** Otomatik fiyatlandırma modellerinin
   yanında, analistin pazar içgörüsünü ve rakip davranış tahminini sisteme
   katabileceği karar destek mekanizmaları güçlendirilmeli. Override'ı bir
   istisna yolu olarak değil, kaydı tutulan ve bir sonraki çalışmada
   ezilmeyen bir özellik olarak tasarla.

Bu bölümde ne yok: bacak bazlı kontrolden köken-varışa geçişin tarihi ve
aktarmalı hatların matematiği ("Gelir yönetimi ve stratejik operasyonlar:
PEOPLExpress ve American Airlines analizi"), acente kanalının gelir modeli
ve NDC'nin ayrıntıları ("Seyahat dağıtım ekosistemi ve yeni dağıtım
yeteneği (NDC) analizi"), planlamanın zaman çizelgesi ve pazar veri setleri
("Havayolu pazarlama planlama süreci ve iş mantığı analizi"). Bu bölüm o
parçaların tek bir kârlılık zincirinde nasıl birbirine bağlandığını
anlatmak için var.
