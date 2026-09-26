---
title: "Havacılık gelir yönetimi ve ücret yapıları analizi"
domain: "aviation"
summary: "Bir biletin fiyatı iki ayrı makinede kuruluyor: biri ücretin üstüne yakıt, kanal ve hizmet kalemlerini ekleyen teklif mekaniği, öteki kaç kişinin o bileti gerçekten istediğini tahmin eden talep mekaniği. Bu bölüm YQ/YR, OB ve OC kayıtlarının hangi taşıyıcıya ve hangi belgeye bağlandığını, sonra da hiç görülmeyen talebin (spill) nasıl tahmin edildiğini ve geri kazanım ile üst satış oranlarının envanter kararına nasıl girdiğini anlatıyor."
audience: "Fiyatlandırma, biletleme, yan gelir ya da gelir yönetimi sistemleriyle çalışan yazılımcı ve ürün insanı. Gelir yönetimi bölümlerinin okunmuş olması işe yarar; YQ/YR, OB, OC, EMD, validating ve operating carrier, spill, nominal talep, geri kazanım ve üst satış metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Önceki bölümler fiyatı tek bir sayı gibi konuşuyordu: bir ücret sınıfı,
bir tutar, açık ya da kapalı. Kasada ödenen tutar öyle oluşmuyor. Temel
ücretin üstüne yakıt ve sigorta ek ücretleri, satış kanalına ve ödeme
yöntemine bağlı ücretler, koltuk ve yemek gibi opsiyonel hizmetler
biniyor. Öte yandan o ücret sınıfının açık kalıp kalmayacağı, kaç kişinin
o uçuşu gerçekten istediğine dair bir tahmine bağlı, ve bu tahminin en
zor kısmı hiç görülmeyen yolcular. **Havayolu geliri iki ayrı makinenin
ürünü: biri teklifi kalem kalem kuruyor, öteki kimseye gösterilmeyen
talebi tahmin ediyor; ikisi birbirini bilmeden doğru çalışamıyor.**

![Sunumun kapak slaytı, teknik çizim üslubunda. Solda başlık: Havayolu Gelir Optimizasyonu, Ücret Kayıtları ve Getiri Yönetimi. Alt başlık: Teklif Mekaniği ve Talep Taşması (Spill) Analizi. Sağda yandan çizilmiş bir yolcu uçağının üzerinden yükselen turkuaz bir çizgi üç durağa uğruyor: Teklif Yönetimi (ATPCO fiyat ve ücretleri; base fare, ancillary fees, bundles), Bütünleşik Yaklaşım (modern retailing ve dynamic pricing) ve Getiri Yönetimi (kısıtlanmamış talep, kapasite kısıtları, spill analizi, optimize envanter döngüsü). Altta bir teşhis matrisi üç sütun gösteriyor: teklif mekaniği (ATPCO verisi, ücret kurulumu, kural motoru), talep ve spill analizi (kısıtlanmamış talep eğrisi, kapasite sınırı, spill hesabı, gelir etkisi) ve optimizasyon (bid price hesabı, erişilebilirlik kontrolü, gelir maksimizasyonu).](/decks/fare-structures-rm/01.webp "Çizgi alttaki teklif yönetiminden üstteki getiri yönetimine tırmanıyor; bu bölüm de aynı sırayı izliyor, önce kalemler sonra talep.")

![Başlık: Havayolları geliri iki temel eksende maksimize eder. Sol panel, Teklif Mekaniği: üstünde OB, OC, OA, YQ kodları yazan bir bilet çizimi; açıklama, isteğe bağlı ve operasyonel ücretlerin stratejik olarak yapılandırılması (ATPCO kayıtları). Sağ panel, Talep ve Kapasite Mekaniği: bir gösterge, bir yolcu figürü ve ikiye ayrılan oklar; açıklama, kısıtlanmamış talebin doğru tahmin edilmesi ve kapasite kısıtlarının yönetilmesi. Konuşmacı notu: sol taraf fiyatlandırma analistinin ve ürün motorlarının, sağ taraf getiri yönetimi analistinin ve RMS'in alanı; bir bileti kaç kişinin istediğini bilmeden doğru fiyatlayamazsın, ücretlerin davranış etkisini bilmeden de envanteri yönetemezsin.](/decks/fare-structures-rm/02.webp "İki panel iki ayrı ekibe ve iki ayrı sisteme ait. Bölümün iddiası aralarındaki boşluğun gelir kaybettirdiği.")

## Ek ücret bilete girer ama vergi değildir

Teklifin ilk katmanı taşıyıcının kendi belirlediği ek ücretler. Yakıt
(YQF/YRF) ve sigorta (YQI/YRI) ek ücretleri bu grubun en tanıdık
örnekleri. Kaynak metin hesaplamayı pazarlama taşıyıcısının (marketing
carrier) kontrolüne bırakıyor: sistem bu kalemleri kupon (sektör),
yolculuk bölümü ya da yolculuğun tamamı bazında otomatik olarak
hesaplıyor. Ayrıntı şurada: bu ücretler vergi statüsünde değil, ama
biletleme ya da raporlama tarafında hiçbir değişiklik gerektirmeden
toplam bilet tutarına yansıyor.

Yazılım tarafında bunun karşılığı, fiyat kırılımında YQ/YR'yi ne temel
ücretle ne de vergilerle aynı kovaya atmamak. Toplamda görünüyor, ama
iade, raporlama ya da gelir paylaşımı hesabında ayrı bir kalem olarak
izlenmesi gerekiyor. Brifingin önerdiği iş kuralı da otomasyonun
kendisi: bu kalemleri otomatik hesaplamak, biletleme sonrası elle
düzeltme yükünü azaltıyor.

İkinci grup OB kayıtları: dağıtım kanalına ve ödeme türüne bağlı
biletleme ücretleri. Bir havayolu çağrı merkezinden yapılan satışa ya da
belirli bir kredi kartıyla yapılan ödemeye ek ücret koymak istediğinde,
iş kuralı bu ücreti şehir veya havalimanına, departman ya da istasyon
kimliğine ve ödeme yöntemine göre özelleştirmeye izin veriyor. Kredi kartı
tipi kartın BIN numarasından okunuyor. Burada kritik kısıt şu: OB ücretleri
yalnızca onaylayan taşıyıcı (validating carrier) için geçerli ve interline
uçuşlarda uygulanamıyor. Brifing bunu kanal bazlı maliyet farklılaştırması
için bir araç olarak görüyor: web ile çağrı merkezi aynı bileti farklı
maliyetle satıyorsa, aradaki fark OB ile yolcuya yansıtılabiliyor.

![Başlık: Aviation engineer blueprint meets diagnostik matrix. Beş sütunlu tablo: kayıt, tanım, taşıyıcı tipi, interline uyumu, belge tipi. YQ/YR: yakıt/sigorta ek ücreti, validating carrier, interline hayır, biletin parçasıdır. OB: dağıtım kanalı / POS ücreti, validating carrier, hayır, biletin parçasıdır. OC: koltuk, yemek, bagaj vb. yolcu seçimleri, operating carrier, hayır, ayrı bir EMD olarak düzenlenir. OA: rezervasyon ücretleri, validating carrier, hayır, bilet işlemine tabidir. Konuşmacı notu: ATPCO bu ücret kurallarını Amadeus, Sabre ve Travelport gibi GDS'lere dağıtır; validating carrier bileti kesen ve parayı toplayan havayolu, operating carrier uçağı fiilen uçuran havayoludur; OC ücretleri hizmeti fiziksel olarak sunması gerektiği için operating carrier'a bağlıdır.](/decks/fare-structures-rm/03.webp "Taşıyıcı tipi sütununda tek bir satır farklı: OC. Hizmeti kim uçuruyorsa ücret onun, bileti kim kestiyse değil.")

Tablo bir tutarsızlığı da görünür kılıyor. Brifing YQ/YR hesabını
pazarlama taşıyıcısına bağlıyor; slayttaki tablo aynı satıra onaylayan
taşıyıcıyı yazıyor. Kaynaklar arasındaki bu fark, bir fiyat motoru
tasarlarken "bu kuralı hangi taşıyıcının verisinden okuyorum" sorusunun
kendiliğinden cevaplanmadığını gösteriyor. Validating, marketing ve
operating taşıyıcı aynı bilet üzerinde üç ayrı alan; kuralın hangisine
bağlandığını kodda açıkça seçmek gerekiyor.

## Opsiyonel hizmet bilete değil uçuşa bağlanıyor

Üçüncü grup OC kayıtları: koltuk seçimi, yemek, film ya da ek bagaj gibi
opsiyonel hizmetler. Buradaki iş kuralı öncekilerden ayrılıyor. Kaynak
metne göre bu hizmetler bilete değil, doğrudan uçuşa bağlanıyor ve
hizmeti sunan işletici taşıyıcı (operating carrier) üzerinden
tanımlanıyor. Sebep fiziksel: yemeği uçakta servis edecek, koltuğu
sağlayacak olan uçağı uçuran havayolu.

Uçuşa bağlı olmanın bir sonucu daha var. Hizmetin satılabilmesi için
sistemin envanter kontrolü yapması ve yeni mesajlaşma standartlarıyla
uygunluk teyidi alması gerekiyor. Sunumun konuşmacı notu bunu somut bir
örnekle anlatıyor: uçakta yalnızca 10 geniş diz mesafeli koltuk varsa,
onbirincisi satılamaz. OB bir işlem ücreti; OC ise kapasiteye bağlı bir
ürün.

![Başlık: Aviation engineer blueprint meets data dashboard. Sol panel, OB (S4 kaydı): salt işlemsel. Bir POS cihazı ve kredi kartı; BIN 4532 yazan kutudan bir işlemciye, oradan Ödeme Onayı kutusuna giden oklar. Maddeler: çağrı merkezi, POS veya kredi kartı BIN numarasına göre belirlenir; tamamen bilet işlemine entegredir, fiziksel kapasiteyle ilgisi yoktur. Sağ panel, OC (S5/S7 kayıtları): kapasiteye bağlı. Bir koltuk, bir yemek tepsisi ve bir bavul, ortadaki EMD belgesine kesikli çizgilerle bağlı. Maddeler: yolcu seçimlerine (önceden rezerve edilmiş koltuk, yemek) dayanır; biletten bağımsız, EMD (Elektronik Çeşitli Belgeler) olarak düzenlenir, envanter kontrolü ve mesajlaşma gerektirir. Konuşmacı notu: OC ücretleri modern yan gelirin omurgası; fiziksel sınır içerdikleri için (örneğin yalnızca 10 geniş diz mesafeli koltuk) sıkı envanter kontrolü ister; EMD bagaj ya da yemeğin muhasebesini uçuş biletinden (ETKT) ayırdı ve bu satış büyük ölçüde NDC mesajlaşmasına dayanıyor.](/decks/fare-structures-rm/04.webp "İki panelin başlıklarındaki sıfatlar ayrımı özetliyor: biri salt işlemsel, öteki kapasiteye bağlı. Kapasiteye bağlı olan her şey bir envanter sorusu.")

Belgelendirme de bu ayrımı izliyor. Kaynak metin opsiyonel hizmet
ücretlerinin ana biletten ayrı bir EMD (Electronic Miscellaneous
Document) olarak düzenlenmesini öngörüyor. EMD biletle eş zamanlı
oluşturulabiliyor, bilet kesildikten sonra da. Yazılım tarafında bunun
karşılığı, yan gelir satışını biletin yaşam döngüsüne kilitlememek:
bilet değişmeden koltuk eklenebilmeli, koltuk iptal edilirken bilete
dokunulmamalı. Konuşmacı notu EMD'nin etkisini de aynı yerden
tanımlıyor: bagajın ya da yemeğin muhasebesini uçuş biletinden ayırdı.

Brifingin bu katman için vardığı yer, OC kayıtlarında envanter kontrolü
ile mesajlaşma standartlarının (önceden rezerve edilmiş koltuk, yemek)
birlikte kurulmasının yan gelir yönetimi için kritik olduğu. Envanteri
olmayan bir OC, satılamayacak bir hizmeti satmak demek.

## Uçan yolcu sayısı talebin alt sınırı

Bölümün ikinci yarısı öteki makineye geçiyor. Gelir yönetimi fiyatı
kurmuyor, hangi fiyatın açık kalacağını seçiyor; bunu yaparken de bir
uçuşu kaç kişinin istediğini bilmesi gerekiyor. Sorun, bu sayının
doğrudan ölçülemiyor olması.

Kaynak metin kavramı şöyle tanımlıyor: spill, yolcuların ilk seyahat
tercihleri uygun olmadığında uçuş dışı kalması. Yani yolcu o uçuşu
istedi, ama istediği sınıf kapalıydı ya da uçak doluydu, ve başka bir
alternatife yöneldi. Sistem bu yolcuyu hiçbir zaman rezervasyon olarak
görmüyor.

![Uçak gövdesinin kesiti. Gövdenin içi Trafik yazan koltuk kareleriyle dolu; üstünde turkuaz bir kapak çizgisi, Uçuş Kapasitesi başlığı altında. Çizginin üzerinden dışarı savrulan küpler Taşan Yolcular (Spilled Passengers) olarak etiketli. Sağdaki kutu: Talep Taşması (Spill) Nedir? Bir uçuşta ilk tercihini yapmak isteyen yolcuların, uçuşun kapalı olması nedeniyle yer bulamaması ve başka alternatiflere yönelmek zorunda kalması. Temel kural: kısıtlanmamış talep her zaman taşınan fiili trafikten büyük veya ona eşittir. Vurgulu satır: spill verisi doğrudan ölçülemez, tahmin edilmesi gerekir. Konuşmacı notu: gelir yönetiminde kapalı olmak uçağın fiziksel olarak dolu olması demek değildir, belirli rezervasyon sınıfının (RBD) envanter tahsisinin sıfıra inmesi demektir; sınıf kapanınca sistem talebi reddeder ve RMS daha sonra kaç kişinin denediğini algoritmayla tahmin etmek zorundadır.](/decks/fare-structures-rm/05.webp "Küpler kapağın üstünde duruyor, yani veri tabanının dışında. Sistemin kaydettiği her şey kapağın altında kalıyor.")

Temel kural slaytta tek satır: kısıtlanmamış talep her zaman taşınan
fiili trafikten büyük ya da ona eşit. Uçan yolcu sayısı talebin kendisi
değil, alt sınırı. Konuşmacı notu buna önemli bir ayrıntı ekliyor:
gelir yönetiminde "kapalı" uçağın fiziksel olarak dolu olduğu anlamına
gelmiyor; belirli bir rezervasyon sınıfının (RBD) tahsisinin sıfıra
indiği anlamına geliyor. Bu yüzden yarısı boş kalkan bir uçakta da spill
yaşanabiliyor.

Kaynak metin boş koltuğa rağmen yaşanan spill'i üç nedene bağlıyor. İlki
yetersiz toplam kapasite: uçakta gerçekten yer yok. İkincisi indirim
tahsisi: yüksek değerli yolcuyu korumak için düşük ücretli sınıflar
kapatılıyor ve o sınıfı isteyen yolcu geri çevriliyor. Üçüncüsü yanlış
overbooking seviyeleri: fazla satış doğru ayarlanmadığı için uçuş
kapanıyor ama koltuklar boş gidiyor.

![Başlık: Talep Taşmasının Üç Temel Nedeni. Solda TALEP TAŞMASI / SPILL yazan bir işlemci çipi, devre yollarıyla sağdaki üç kutuya bağlı. 1, Yetersiz Fiziksel Kapasite: uçakta fiziksel olarak boş koltuk kalmaması; dolu koltuklu bir uçak planı. 2, İndirimli Sınıf Kontrolleri: yüksek getirili (high-yield) son dakika yolcuları için koltukların korunması, düşük ücretli talebin reddedilmesi; kilitli bir koltuk simgesi. 3, Hatalı Çifte Rezervasyon (Overbooking) Seviyeleri: algoritmaların no-show (uçağa gelmeyen yolcu) oranlarını yanlış hesaplaması sonucu uçuş kapansa bile uçağın boş kalkması; üzeri çarpı ile çizilmiş bir koltuk. Konuşmacı notu: ikinci neden getiri yönetiminin özü, bugün düşük değerli talebi taşırarak yarın yüksek değerli kurumsal yolcuya koltuk korumak; üçüncü neden, satılabilecekken boş kalan koltuk demek olan spoilage'a yol açar.](/decks/fare-structures-rm/06.webp "Üç nedenden yalnızca biri istemeden oluyor. İkincisi bilinçli bir tercih, üçüncüsü ise bir tahmin hatası.")

Üç neden aynı sonucu üretiyor ama biri bilinçli bir karar. İndirim
tahsisinden doğan spill, gelir yönetimi bölümlerinde anlatılan kısıtlı
indirim mantığının kendisi: düşük ücretli talebi bugün geri çevirip
koltuğu yarın gelecek yüksek getirili yolcuya saklamak. Bu spill ancak o
yolcu gerçekten gelirse kârlı. Gelmezse, üçüncü nedenle aynı yere
düşülüyor: satılabilecekken boş kalan koltuk.

## Gerçek talep, uçanlar artı geri çevrilenler

Uçan yolcu verisi, sistemin kapattığı talebi göstermiyor. Kaynak metnin
çözümü basit bir toplama: gerçek talebi bulmak için uçan yolcu ile
sistem kapandığı için geri çevrilen yolcunun toplanması gerekiyor. Bu
toplamın adı nominal talep; kaynak metin onu bir uçuş için
sınırlandırılmamış talep olarak tanımlıyor. Beklenen spill ise nominal
talep ile gözlemlenen talep arasındaki fark.

Bu tahminin iki çözünürlüğü var. Birincisi rezervasyon sınıfı bazında
çalışan ayrıntılı modeller, ikincisi kabin bazında çalışan genel spill
modelleri. Slayt ikisine teleskop ve mikroskop benzetmesi yapıyor ve
kimin hangisini kullandığını da söylüyor.

![Başlık: Talep Tahmin Modelleri. Sol panel, Makro (Spill Modeli), teleskop çizimi: kabin seviyesinde çalışır, geçmiş gerçekleşen trafiğe ve yük faktörüne dayanır, genellikle finansal ve pazarlama analistleri tarafından ad-hoc analizler için kullanılır. Sağ panel, Mikro (Detaylı Model), mikroskop ve üç boyutlu çubuk grafik çizimi: rezervasyon sınıfı (RBD) seviyesinde çalışır, kalkışa kalan belirli zaman dilimlerindeki (time-before-departure) envanter açılış/kapanış verilerini kullanır, getiri yönetimi sistemleri (RMS) tarafından kısıtlanmamış talebi tahmin etmek için zorunludur. Konuşmacı notu: mikro model talep untruncation işlemi yapıyor; PROS ve Amadeus Altéa gibi modern RMS'ler geçmiş rezervasyon eğrilerini sürekli analiz ediyor; bir sınıf kalkıştan 14 gün önce kapandıysa sistem, sınıf kalkış gününe kadar açık kalsaydı talebin ne olacağını tahmin etmek için veriyi untruncate etmek zorunda.](/decks/fare-structures-rm/07.webp "Aynı soruya iki ayrı ekip iki ayrı büyüklükte bakıyor. Makro model bir analiz aracı, mikro model ise envanterin günlük girdisi.")

Mikro modelin ihtiyaç duyduğu veri, yazılım tarafında sık atlanan bir
şey: sınıfın ne zaman açık ne zaman kapalı olduğunun kaydı. Konuşmacı
notundaki örnek bunu açık ediyor: bir sınıf kalkıştan 14 gün önce
kapandıysa, o sınıfın son 14 gündeki sıfır rezervasyonu talebin sıfır
olduğu anlamına gelmiyor. Model, sınıf açık kalsaydı ne olacağını
tahmin etmek için o kesilmiş veriyi tamamlamak (untruncation) zorunda.
Rezervasyon tablosunu tutan ama envanter açılış-kapanış geçmişini
tutmayan bir sistem, bu tamamlamayı yapacak veriyi baştan kaybetmiş
oluyor.

Brifingin bu noktadaki önerisi iki yönlü. Gelir yönetimi tarafında
tahmin yalnızca gerçekleşen trafiğe değil, spill modellerine
dayanmalı. Kapasite planlama tarafında ise spill modelinden çıkan nominal
talep, gelecekteki kapasite artırımı ya da uçak tipi değişimi
kararlarının temel veri kaynağı olmalı. Uçan yolcu sayısına bakarak uçak
küçülten bir havayolu, geri çevirdiği talebi de küçültmüş oluyor.

## Geri çevrilen yolcu üç yola gidiyor

Spill tek bir kayıp değil. İlk tercihi kapalı olan yolcunun önünde üç
yol var ve bunlardan yalnızca biri havayolu için tam kayıp. Birincisinde
yolcu rakibe gidiyor. İkincisinde aynı havayolunun farklı bir uçuşunu
kabul ediyor: kaynak metin buna geri kazanım (recapture) diyor.
Üçüncüsünde aynı uçuşta kalıp daha yüksek bir ücret sınıfına çıkıyor:
üst satış (upsell).

![Başlık: Yolcu Davranış Karar Ağacı. Solda İlk Tercih Kapalı yazan bir yolcu kutusu, üç yola ayrılıyor. A yolu, kesikli çizgi: rakiplere gider, sonuç Kayıp / Spill Loss. B yolu: aynı havayolu, farklı uçuş (örnek: 08:00 yerine 07:00), sonuç Geri Kazanım / Recapture. C yolu: aynı uçuş, daha yüksek ücret (örnek: 300 dolar yerine 400 dolar), sonuç Üst Satış / Upsell. Alttaki kutu: geri kazanım oranı, ilk tercihini bulamayan yolcuların aynı havayolunun alternatif bir uçuşunu kabul etme oranıdır; üst satış oranı, ilk tercihini bulamayan yolcuların aynı uçuşta daha yüksek bir ücret sınıfına (daha az kısıtlamalı bilet) geçiş yapma oranıdır. Konuşmacı notu: geri kazanım ile üst satışı ayırt etmek marjinal gelir hesabı için hayati; geri kazanım yüksekse havayolu yolcuyu zayıf performanslı uçuşlara yönlendirmek için bazı uçuşları agresif şekilde kapatabilir; sürekli fiyatlama ve seçime dayalı modelleme, C yolunu tahmin etmek için ödeme istekliliği (WTP) algoritmaları kullanır.](/decks/fare-structures-rm/08.webp "Yalnızca A yolu gerçek kayıp. B ve C, kapatılan sınıfın geliri başka bir yerden geri getirdiği durumlar.")

Geri kazanım bir oranla ölçülüyor ve bu oranın tersi de bir varsayım.
Kaynak metnin örneğinde geri kazanım oranı yüzde 25 ise, sistem
yolcuların yüzde 75'inin rakip havayollarına kayacağını varsayıyor.
Karar mekanizması yolcunun zaman hassasiyetine göre alternatif uçuşun
doluluğunu optimize ediyor. Konuşmacı notu bunun stratejik tarafını
söylüyor: geri kazanım yüksekse havayolu bazı uçuşları agresif şekilde
kapatıp yolcuyu daha zayıf dolan uçuşlara yönlendirebiliyor.

Üst satış da aynı şekilde bir orana bağlı. Brifingin örneği ücret
kurallarından geliyor: 14 gün önceden alım avantajı biten bir yolcunun 7
gün önceden alım fiyatına, yani daha yüksek bir ücrete razı olma eğilimi
ölçülüyor ve envanter bu olasılığa göre açılıyor ya da kapatılıyor.
Slayttaki örnekte aynı uçuş 300 dolar yerine 400 dolara satılıyor.

Yazılım tarafında bunun karşılığı, bir sınıfı kapatma kararının gelir
etkisini tek bir sayı olarak hesaplamamak. Kapatılan sınıfın talebi
yüzde yüz kayıp sayılırsa sistem gereğinden fazla indirimli koltuk açık
tutuyor; yüzde yüz upsell sayılırsa gereğinden erken kapatıyor. Doğru
cevap iki oranın arasında ve o oranlar rotaya, rakibe ve zamana göre
değişiyor. Brifing de bu yüzden geri kazanım ve üst satış oranlarının
rakip analizleri ve geçmiş veriyle düzenli olarak güncellenmesini
istiyor.

## İki makine aynı denklemde buluşuyor

Sunumun son slaytı iki yarıyı tek bir denkleme bağlıyor: nominal talep,
uçaktaki trafik ile beklenen spill'in toplamı. Konuşmacı notu bağlantıyı
açıkça kuruyor: doğru spill modellemesi envanter erişilebilirliğini
belirliyor, erişilebilirlik de ATPCO fiyat yapılarının (OB ve OC dahil)
tam olarak ne zaman ve nasıl sahaya çıktığını kontrol ediyor.

![Başlık: Temel Metrikler Kontrol Paneli. Ortada Nominal Talep yazan yarım daire bir gösterge. Altında iki parçalı bir çubuk: koyu renkli Fiili Trafik ve turkuaz Beklenen Taşma, ikisi yan yana göstergenin tamamını dolduruyor. Tanımlar: nominal talep (nominal demand), uçuş için kısıtlanmamış, gerçek talep seviyesi; beklenen taşma (expected spill), spill modelinden elde edilen birincil istatistik, nominal talep ile gözlemlenen talep (yük faktörü) arasındaki farkı ifade eder. Sonuç bandı: beklenen taşma doğru hesaplandığında havayolu envanter kısıtlarını optimize edebilir ve ATPCO ücret kayıtları üzerinden elde edeceği teklif gelirini (offer revenue) en üst düzeye çıkarır. Konuşmacı notu: bu slayt destenin iki yarısını birleştiriyor; nominal talep eşittir uçaktaki trafik artı beklenen spill.](/decks/fare-structures-rm/09.webp "Çubuğun koyu kısmı her sistemde var, turkuaz kısmı yalnızca tahmin eden sistemlerde. Göstergenin iğnesi ikisinin toplamını gösteriyor.")

Bağlantı iki yönde çalışıyor. Teklif tarafı talep tarafını bilmeden
fiyat kurarsa, kaç kişinin o fiyatı istediğini bilmiyor. Talep tarafı
teklif tarafını bilmeden envanter yönetirse, bir OB ücretinin ya da
koltuk fiyatının yolcu davranışını nasıl değiştirdiğini modele
katamıyor. İki makine ayrı ekiplerde, ayrı sistemlerde duruyor; ortak
dilleri nominal talep.

## Yarın işe yarayacak beş çıkarım

1. **YQ/YR'yi otomatik hesapla, ayrı kalem olarak taşı.** Yakıt ve
   sigorta ek ücretlerini kupon, yolculuk bölümü ya da yolculuk bazında
   otomatik hesaplamak biletleme sonrası elle düzeltme yükünü azaltıyor.
   Toplama yansısalar da vergi değiller; fiyat kırılımında ayrı dursunlar.
2. **Kanal maliyetini OB ile görünür kıl.** Web ile çağrı merkezi aynı
   bileti farklı maliyetle satıyorsa, OB kayıtları istasyon, kanal ve
   kart tipi bazında bu farkı yansıtabilir. Yalnızca onaylayan taşıyıcıda
   ve interline dışında geçerli olduğunu kural motoruna baştan yaz.
3. **OC'yi bir envanter ürünü gibi kur.** Opsiyonel hizmeti uçuşa ve
   işletici taşıyıcıya bağla, satıştan önce uygunluk teyidi al, ayrı bir
   EMD olarak düzenle. Envanteri olmayan bir koltuk ya da yemek satışı,
   uçakta karşılığı olmayan bir vaat.
4. **Talebi uçanlardan değil, uçanlar artı geri çevrilenlerden hesapla.**
   Tahmini spill modeline dayandır; sınıfların açılış-kapanış geçmişini
   sakla ki kesilmiş veri tamamlanabilsin. Kapasite ve uçak tipi
   kararına nominal talebi taşı, gerçekleşen trafiği değil.
5. **Geri kazanım ve üst satış oranlarını düzenli güncelle.** Kapatılan
   bir sınıfın talebinin ne kadarının rakibe, ne kadarının başka bir
   uçuşa, ne kadarının daha pahalı sınıfa gittiği bu iki orana bağlı.
   Rakip analizi ve geçmiş veriyle yenilenmeyen oran, geçen sezonun
   yolcusunu modelliyor.

Bu bölümde ne yok: kısıtlı indirim ve fazla satışın doğuşu ("Yield
Management: erken dönem stratejik analiz ve iş mantığı"), spill ve
talep tahmininin istatistiksel modelleri (talep tahmini bölümleri) ve
ATPCO'nun ücret dağıtımındaki yeri ("Havacılık endüstri standartları ve
yönetişim: stratejik analiz belgesi"). Bu bölüm teklifin kalemleriyle
talebin görünmeyen kısmının aynı gelir hesabında nerede buluştuğunu
anlatmak için var.
