---
title: "Havacılıkta gelir paylaşımı: çok taraflı ve ikili prorate anlaşmaları (MPA ve SPA)"
domain: "aviation"
summary: "Bir yolcu tek bilet alıp iki havayoluyla uçtuğunda, biletin parası iki şirket arasında bölünmek zorunda. Bu bölüm o bölüşümün iki katmanını anlatıyor: IATA'nın mil ve maliyet faktörüyle çalışan varsayılan kuralı MPA ve havayollarının o kuralı ezen ikili ticari anlaşmaları SPA. Konu muhasebe gibi görünse de fiyatlandırmanın, gelir yönetiminin ve ağ stratejisinin tam ortasında duruyor."
audience: "Biletleme, gelir muhasebesi, interline faturalama ya da O&D gelir yönetimi sistemleriyle çalışan yazılımcı ve ürün insanı. Fiyatlandırma ve gelir yönetimi bölümlerinin okunmuş olması işe yarar; interline, validating ve operating carrier, TPM, CWMF, ePMP, MPA ve SPA metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Şimdiye kadarki fiyatlandırma bölümleri tek bir havayolunun kendi koltuğuna
fiyat koymasını anlatıyordu. Oysa yolculukların bir kısmı tek havayolunda
başlayıp bitmiyor: yolcu tek bir bilet alıyor, ilk bacağı bir havayolu,
ikinci bacağı başka bir havayolu uçuruyor. Buna interline taşımacılık
deniyor ve kaynak metne göre dünya genelindeki havayolu trafiğinin yüzde 8
ile 12'si bu şekilde gerçekleşiyor. **Interline biletin fiyatı bir kez
konuyor ama geliri iki kez paylaşılıyor, ve o paylaşımın kuralı biletin
fiyatı kadar ticari bir karar.** IATA'nın herkese uyguladığı varsayılan bir
kural var; havayolları o kuralı kendi aralarındaki özel anlaşmalarla ezmeyi
de biliyor.

![Sunumun kapak slaytı. Üstten inen bir çizginin ucunda koyu bir nokta; noktadan sola doğru yeşil, sağa doğru turuncu kesikli rotalar ayrılıyor. Başlık: Kesişen Rotalar, Paylaşılan Gelirler. Alt başlık: Havacılıkta Çok Taraflı ve İkili Prorasyon Anlaşmaları (MPA ve SPA). Alttaki not bandı: sunum, havayollarının birbirinin uçuşlarında bilet sattığı interlining kavramının ticari ve finansal mekanizmalarını kapsıyor; ilgili süreçler Offer/Order Management ve Revenue Accounting and Settlement.](/decks/prorate-agreements/01.webp "Tek nokta, iki renkli iki rota: biletin satıldığı yer bir, parayı hak eden taşıyıcı iki.")

## Paylaşım sorunu satışta değil, uçuştan sonra çıkıyor

Sorunun iki tarafı var. Yolcu açısından her şey basit: tek bilet, tek
ödeme, birbirine bağlanmış uçuşlar. Havayolları açısından ise o tek ödemenin
kime ne kadar ait olduğu belirsiz. Kaynak metin iki taraflı bir finansal
risk tanımlıyor: bileti kesen havayolu gereğinden fazla ödeyebilir, ya da
yolcuyu taşıyan havayolu hak ettiğinden az gelir alabilir.

![Başlık: Küresel Trafiğin Yüzde 8-12 sini Oluşturan Problem. Sol yarıda büyük bir bileti havaya kaldıran bir yolcu figürü ve arkasında iki uçaklı kesikli bir rota; altında Tek Bilet, Birden Fazla Havayolu: yolcu tek bir bilet satın alır, ancak yolculuk farklı havayolları tarafından birbirine bağlanarak gerçekleştirilir. Sağ yarıda A ve B harfli iki kuyruk arasında soru işaretli bir para kesesi. Büyük Soru: bilet geliri, uçuşu gerçekleştiren havayolları arasında adil bir şekilde nasıl bölüşülür. Finansal Risk: biletleyen havayolunun gereğinden fazla ödeme yapması veya taşıyıcı havayolunun hak ettiğinden az gelir elde etmesi. Not bandı: domain terimleri interline, validating carrier (biletleyen havayolu), operating carrier (taşıyıcı havayolu); NDC ve OneOrder ile bilet kavramı siparişe dönüşse de ödeme ve bölüşüm problemi aynı kalıyor, biletleme sistemi PNR içindeki diğer havayolu (OAL) segmentlerini doğrulamalı.](/decks/prorate-agreements/02.webp "Not bandındaki cümle önemli: bilet siparişe dönüşse de bölüşüm sorunu ortadan kalkmıyor, sadece başka bir veri modelinin içine taşınıyor.")

Paranın yolu, yolcunun yolundan farklı. Bileti kesen, yani validating
carrier, yolcudan bütün yolculuğun bedelini peşin tahsil ediyor. Yolcuyu
kendi uçağıyla taşıyan, yani operating carrier, uçuşu yaptıktan sonra
biletleyen havayoluna fatura kesip kendi payını, prorate'i talep ediyor.
Yolcu soldan sağa ilerlerken para sağdan sola geri dönüyor. Sunum notu bir
ayrıntı ekliyor: havayolları tek tek biletler için birbirine para transfer
etmiyor; bu faturalama aylık olarak netleştirilen IATA Clearing House (ICH)
ve SIS (Simplified Interline Settlement) platformu üzerinden toplu olarak
yürüyor.

![Başlık: Gelirin İzini Sürmek, Fiziksel Uçuş ve Finansal Akış. Üç daire soldan sağa: 1, Satış ve Tahsilat, biletleyen (validating) havayolu yolcudan tüm yolculuk bedelini peşin olarak tahsil eder; 2, Taşıma Hizmeti (Interline), işletici (operating) havayolu yolcuyu kendi uçağıyla hedefine ulaştırır; 3, Faturalandırma, işletici havayolu yolcuyu taşıdıktan sonra biletleyen havayoluna dijital bir fatura keserek kendi bilet payını (prorate) talep eder. Üstte turuncu kesikli ok: Yolcunun Fiziksel Rotası. Altta sağdan sola yeşil ok: Paranın ve Faturanın Rotası. Not bandı: endüstri akışları ticket issuance, flown revenue, interline billing; bireysel biletler için para transferi yapılmaz, süreç aylık netleştirilen IATA Clearing House (ICH) ve SIS üzerinden toplu yönetilir.](/decks/prorate-agreements/03.webp "İki ok ters yönde akıyor. Satış anında kesinleşen tek şey tahsilat; kimin ne kadar kazandığı uçuş gerçekleştikten sonra hesaplanıyor.")

Yazılım tarafında bunun karşılığı şu: bir interline biletin geliri satış
anında tek bir sayı olarak kaydedilemiyor. Satışta tahsil edilen tutar,
uçulan kupon işlendiğinde bölünüyor ve bölme kuralı o anda geçerli olan
anlaşmaya göre seçiliyor. Satış sistemi ile gelir muhasebesi sistemi aynı
bilete iki farklı zamanda, iki farklı soruyla bakıyor.

## Varsayılan kural mesafeyi ölçüyor, sonra mesafeyi düzeltiyor

Bölüşümün varsayılan katmanı MPA, yani Multilateral Prorate Agreement. IATA
Prorate Agency tarafından yönetilen, ittifaktan bağımsız, küresel bir gelir
paylaşım metodolojisi. En yalın hali Straight Rate Prorate (SRP): gelir,
kat edilen mesafe oranında bölünüyor. Kaynak metnin örneğinde yolcu toplam
1000 milin 700'ünü A havayoluyla, 300'ünü B havayoluyla uçuyorsa gelir
70/30 paylaştırılıyor.

Mesafenin kendisi de bir standart. Karar mekanizmasının temeli Ticketed
Point Mileage (TPM): havalimanı farklılıklarından bağımsız olarak iki nokta
arasındaki en kısa mesafe. Sunum notu bunun neden önemli olduğunu
söylüyor: TPM uçağın gerçekten izlediği hava trafik rotası değil,
matematiksel tutarlılık için standartlaştırılmış mil. İki havayolu aynı
kuponu hesapladığında aynı sayıya varabilmeli; gerçek uçuş rotası her gün
değişebilir, TPM değişmez.

Saf mil oranının bir sorunu var: kısa mesafeyi uçan havayolunu
cezalandırıyor. Slaytın ifadesiyle kısa mesafelerde işletme
maliyeti orantısız şekilde yüksek; bu maliyet mil sayısına yansımıyor. MPA bunu Prorate Factor ya da Cost Weighted Mileage Factors
(CWMF) ile düzeltiyor. TPM, coğrafi bölgenin operasyonel zorluklarına göre
ayarlanan bölgesel bir maliyet faktörüyle çarpılıyor ve ortaya maliyet
ağırlıklı bir mil faktörü çıkıyor. Kısa mesafe işletmecisi bu sayede ham
milinin söylediğinden daha yüksek bir pay alıyor.

![Başlık: MPA, Küresel Standart (Multilateral Prorate Agreement). Alt başlık: IATA Prorate Agency tarafından yönetilen, ittifak bağımsız küresel gelir paylaşım metodolojisi. Bir denklem: TPM (Biletlenen Mil, rota üzerindeki en kısa mesafe) çarpı Bölgesel Maliyet Faktörü (coğrafi bölgenin operasyonel zorluklarına göre ayarlanan ağırlık) eşittir CWMF / Prorate Faktörü (nihai maliyet ağırlıklı mil faktörü). Altta kalkan simgesiyle İstisnalar (Provisos): kısa mesafelerde işletme maliyeti orantısız şekilde yüksek olan havayollarını haksız düşük paylardan koruyan özel şartlar, IATA ePMP kılavuzunda yayınlanır. Not bandı: IATA Prorate Agency, ePMP (Electronic Prorate Manual-Passenger), TPM; fiyatlandırma motorları ve gelir muhasebesi sistemleri bu faktörleri otomatik hesaplamak için aylık ePMP veri dosyalarını içeri aktarmak zorunda; TPM ATC rotası değil, standartlaştırılmış mil.](/decks/prorate-agreements/04.webp "Denklemin sol tarafı fiziksel, sağ tarafı ekonomik: mesafe ölçülüyor ama pay, o mesafeyi uçmanın maliyetine göre veriliyor.")

Faktörün üstünde bir koruma katmanı daha var: provisos, yani istisnalar.
Bölgesel maliyet faktörleri ve istisnalar IATA'nın ePMP (Electronic Prorate
Manual-Passenger) el kitabında yayınlanıyor. Kaynak metin bu katmanın
amacını açıkça söylüyor: MPA, hiçbir havayoluna makul olmayan ölçüde düşük
bir gelir payı ayrılmamasını güvenceye alan koruyucu önlemler de içeriyor.
Yani MPA yalnızca bir formül değil, küçük ve yüksek maliyetli operatörleri
koruyan bir adalet mekanizması.

Mühendislik açısından bu, formülün sabit olmadığı anlamına geliyor. Sunum
notuna göre fiyatlandırma motorları ve gelir muhasebesi sistemleri, bilet
denetimi sırasında bu faktörleri otomatik hesaplayabilmek için aylık ePMP
veri dosyalarını içeri aktarmak zorunda. Kod içinde sabitlenmiş bir faktör
tablosu bir ay sonra yanlış paylar üretmeye başlıyor; faktörler versiyonlu
referans verisi olarak tutulmalı ve bir kupon, uçulduğu dönemde geçerli
olan versiyonla hesaplanmalı.

## Özel anlaşma varsayılanı eziyor, amacı da adalet değil avantaj

İkinci katman SPA, yani Special Prorate Agreement. İki ya da daha fazla
havayolu arasındaki özel, ikili (bilateral) veya tek taraflı (unilateral)
anlaşmalar. İttifakların temel yapı taşı, ama ittifak dışında da
yapılabiliyor. Sunum notu bunu bir ticari silah olarak tarif ediyor:
bağımsız havayolları, sanal ağlarını genişletmek için ittifaka girmeden de
SPA imzalayabiliyor.

İş kuralı net: bir SPA mevcutsa genel MPA kurallarını geçersiz kılıyor.
Amacı da MPA'nınkinden farklı. MPA endüstri standardı belirlemek ve adil bir
asgari paylaşım sağlamak için var; SPA ticari avantaj elde etmek ve pazar
erişimini genişletmek için. Bir havayolu SPA müzakeresine girerken iki şey
istiyor: kendi kestiği biletlerde karşı tarafa ödeyeceği payı düşük tutmak,
başka havayollarından gelen yolcuyu taşıdığında alacağı payı yüksek tutmak.
Karşı taraf da aynısını istiyor; anlaşma o iki isteğin buluştuğu nokta.

Hesaplama modeli de serbest. Sabit ücret (fixed rate), taşınan yolcu başına
net bir dolar tutarı. Mil bazlı model, uçulan mile göre basit oran. Millerin
karekökü, kısa mesafe taşıyıcısına avantaj sağlayan bir eğri. Yerel ücretin
sabit bir yüzdesi, tam yerel bilet fiyatının belirli bir oranı. Karekök
modeli ilginç, çünkü MPA'nın CWMF ile yaptığı düzeltmeyi tek bir matematik
işlemiyle yapıyor: mesafe büyüdükçe pay artıyor ama orantılı artmıyor.

![Başlık: SPA, Stratejik Avantaj (Special Prorate Agreement). Sol üst metin: iki veya daha fazla havayolu arasındaki özel, ikili (bilateral) veya tek taraflı (unilateral) anlaşmalardır; ittifakların temel yapı taşıdır, ancak ittifak dışında da yapılabilir. Sağ üstte turuncu bant: SPA, MPA Kurallarını Geçersiz Kılar. Temel hedef: rekabetçi fiyatlarla yeni pazarlara açılmak (kendi düzenlediği biletlerde daha düşük pay ödemek, başkasından kabul ettiği biletlerde daha yüksek pay almak). Altta dört gösterge kadranı: 1 Sabit Ücret (taşınan yolcu başına net dolar tutarı), 2 Mil Bazlı (uçulan mile göre basit orantı), 3 Karekök (millerin karekökü, kısa mesafe taşıyıcısına avantaj sağlar), 4 Yerel Ücret Yüzdesi (tam yerel bilet fiyatının belirli bir oranı). Not bandı: SPA devasa bir ticari silahtır; bir SPA oranı çok yüksekse O&D RM sistemi bağlantılı rezervasyonu otomatik olarak reddeder, çünkü ev sahibi havayolu o koltuğu yerel bir yolcuya satmaya kıyasla yeterli marj elde edemez.](/decks/prorate-agreements/05.webp "Dört kadran dört farklı pazarlık dili. Hangisinin seçildiği, bir tarafın hangi mesafede güçlü olduğunu gösteriyor.")

Kaynak metin SPA'nın gelir paylaşımından fazlası olduğunu vurguluyor:
gelir dağılımı için doğru şartlara sahip bir SPA, bir havayolunun ek
pazarları rekabetçi ücretlerle sunmasına imkân veriyor. Yani SPA
fiyatlandırma kararının bir girdisi. Karşı tarafa ödenecek pay düşükse,
havayolu kendi uçmadığı bir noktaya giden bağlantılı bileti daha ucuza
satabiliyor.

Aynı etki ters yönde de çalışıyor. Sunum notu gelir yönetimiyle bağlantıyı
kuruyor: bir SPA oranı çok yüksekse, O&D gelir yönetimi sistemi bağlantılı
rezervasyonu otomatik olarak reddediyor, çünkü koltuğu veren havayolu o
koltuğu yerel bir yolcuya satmaya kıyasla yeterli marj elde edemiyor.
Gelir yönetimi bölümlerinde gördüğümüz "doğru yolcuya sat" mantığı burada
prorate payını da hesaba katıyor. Aynı koltuk için bağlantılı yolcunun
getirisi bilet fiyatı değil, o havayolunun bu biletten alacağı pay.

## Kural motoru önce özel anlaşmaya bakıyor

İki katman bir hiyerarşi oluşturuyor ve bu hiyerarşi doğrudan bir sistem
akışına dönüşüyor. Sunum notuna göre gelir muhasebesi sistemi uçulmuş bir
kuponu işlerken kural motoru önce geçerli bir SPA olup olmadığını kontrol
ediyor. O şehir çifti ve taşıyıcı kombinasyonu için SPA yoksa MPA
tablolarına geri dönüyor.

![Başlık: Hangi Anlaşma, Ne Zaman Geçerli? (Diagnostic Matrix). İki sütunlu tablo, MPA ve SPA. Kapsam: MPA küresel ve çok taraflı (multilateral); SPA ikili veya tek taraflı (bilateral/unilateral). Yönetici: MPA IATA Prorate Agency (ePMP üzerinden); SPA havayollarının kendi ticari ekipleri. Temel amaç: MPA endüstri standardı belirlemek ve adil minimum paylaşım sağlamak; SPA ticari avantaj elde etmek ve pazar erişimini genişletmek. Sistem hiyerarşisi: MPA varsayılan (default fallback); SPA öncelikli (overrides MPA). Not bandı: gelir muhasebesi sistemi uçulmuş bir kuponu işlerken kural motoru önce geçerli bir SPA olup olmadığını kontrol eder, o şehir çifti/taşıyıcı kombinasyonu için SPA yoksa MPA tablolarına geri döner; SPA kuralları özel rezervasyon sınıfı eşleştirmeleri ve kısıtlamalar içerdiği için son derece karmaşıktır, ay sonu kapanışında doğru ayrıştırmak için uzman RA yazılımı gerektirir.](/decks/prorate-agreements/06.webp "Son satır tablonun asıl cevabı: iki anlaşma yan yana değil, üst üste duruyor. Önce özel olan aranıyor, bulunamazsa genel olana düşülüyor.")

Bu, tanıdık bir desen: özelden genele çözümlenen bir kural zinciri. Ama
buradaki eşleştirme anahtarı basit değil. Sunum notu SPA kurallarının
özel rezervasyon sınıfı eşleştirmeleri ve kısıtlamalar içerdiğini, bu
yüzden ay sonu kapanışında doğru ayrıştırmak için uzman gelir muhasebesi
yazılımı gerektiğini söylüyor. Yani SPA araması şehir çifti ve taşıyıcıyla
bitmiyor; rezervasyon sınıfı ve anlaşmanın kısıtları da eşleşmeye
giriyor. Eşleşme yanlış kurulursa sistem hata vermiyor, sessizce MPA'ya
düşüyor ve yanlış tutarda bir fatura üretiyor. Bu tür bir düşüşün
loglanması ve raporlanması, hatasız çalışan bir eşleşmeden daha değerli.

## Bir SPA iki ekibin arasında gidip gelerek doğuyor

SPA'nın içeriği ticari, ama onayı teknik bir denetimden geçiyor. Kaynak
metin yaşam döngüsünü beş adımda veriyor. İttifak ekipleri ya da strateji
departmanları yeni bir pazar fırsatı buluyor. Fiyatlandırma ekibi teklifi
pazar potansiyeli ve parametrelerin ticari uygunluğu açısından inceliyor.
Gelir muhasebesi ekibi finansal geçerliliği ve kârlılığı test ediyor, yani
parametrelerin sağlam olup olmadığını denetliyor. Üst yönetim nihai
sözleşmeyi imzalıyor. SPA ekibi anlaşmayı IT sistemlerine yüklüyor ve
performansını periyodik olarak değerlendiriyor.

Kritik olan ikinci ve üçüncü adım arasındaki ok. Fiyatlandırma ile gelir
muhasebesi arasındaki inceleme, iki ekip ortak karara varana kadar
tekrarlanıyor. Sunum notu bu sürtüşmenin kaynağını açıkça koyuyor: pazar
payı kazanmak için ucuz bağlantı ücretleri sunmak isteyen fiyatlandırma
ekibi ile interline bölünmesinden zarar edilmemesini sağlayan gelir
muhasebesi ekibi arasındaki gerilim sürekli. İterasyon bu gerilimi
çözmüyor, onu yönetilebilir kılıyor.

![Başlık: Bir SPA Nasıl Doğar? (Kurumsal Yaşam Döngüsü). Beş parçalı dairesel bir akış. 1, Fırsatın Belirlenmesi: ittifak ekipleri veya strateji departmanları yeni pazar fırsatları bulur. 2, Fiyatlandırma İncelemesi (Pricing): pazar potansiyeli ve parametrelerin ticari uygunluğu analiz edilir. 3, Gelir Muhasebesi İncelemesi (Rev. Accounting): finansal geçerlilik ve kârlılık test edilir. 2 ile 3 arasında iki yönlü turuncu oklar ve not: fiyatlandırma ekibi ile mutabakat sağlanana kadar iteratif olarak tekrarlanır. 4, Yönetim Onayı: üst yönetim tarafından nihai sözleşme imzalanır. 5, Yürütme ve İzleme: SPA ekibi anlaşmayı IT sistemlerine yükler ve periyodik olarak anlaşmanın performansını değerlendirir. Not bandı: ucuz bağlantı ücreti isteyen fiyatlandırma ile interline bölünmesinden zarar edilmemesini sağlayan gelir muhasebesi arasındaki sürtüşme süreklidir; büyük küresel ittifaklarda özel ittifak yönetim ekipleri ağ harmonizasyonu için bu akışı başlatır.](/decks/prorate-agreements/07.webp "Dairenin tek çift yönlü oku ikinci ve üçüncü adım arasında. Anlaşmanın asıl pazarlığı iki havayolu arasında değil, aynı havayolunun iki ekibi arasında yapılıyor.")

Brifingin önerisi bu döngünün dijital iş akışına entegre edilmesi:
fiyatlandırma incelemesinden gelir muhasebesi incelemesine giden adımın
e-posta zincirinde değil, iş akışı aracında yaşaması. Yazılım tarafında
bunun karşılığı, bir SPA'nın taslak halinden yürürlüğe girişine kadar
durum geçişleri olan bir nesne olarak modellenmesi. Her tur hangi
parametrenin kimin itirazıyla değiştiğini kaydetmeli; beşinci adımdaki
periyodik değerlendirme, anlaşmanın neden o şartlarla imzalandığını
bilmeden anlamlı yapılamıyor.

İzlemenin ölçütü de kaynakta tanımlı: anlaşmanın pazar varlığını artırıp
artırmadığı ve düşük doluluk oranına sahip pazarlarda ek gelir yaratıp
yaratmadığı. Bir SPA imzalandığı gün bitmiyor; bu iki soruya periyodik
olarak cevap vermesi gerekiyor.

## Birkaç anlaşma interline gelirinin çoğunu taşıyor

SPA'ların değeri eşit dağılmıyor. Kaynak metin iki sayı veriyor: en büyük
beş SPA anlaşması interline gelirinin yüzde 40'ını, en büyük 25 SPA
anlaşması da SPA gelirinin yüzde 80'ini oluşturabiliyor. Brifingin
eylem önerisinde bu ikinci sayı toplam interline gelirinin yüzde 80'i
olarak geçiyor; alıntının kendisi SPA gelirinden söz ediyor, bu yüzden
burada alıntıdaki hali esas alınıyor. Hangi paydayla okunursa okunsun
sonuç aynı: kritik azınlık küçük.

Kargo da aynı mantıkla çalışıyor. Kargo uçağı olan ya da olmayan
havayolları arasında, kilogram başına tanımlanmış bir ücret üzerinden SPA
yapılıyor. Slayt Emirates ve Qantas'ı örnek veriyor ve SPA'ların ağırlık
bazlı Air Waybill için de çalıştığını söylüyor. Kazanç yolcuda olduğu gibi:
havayolu kendi uçmadığı destinasyonlara kargo kabul edebiliyor, yani pazar
varlığı kazanıyor.

![Başlık: Neden Önemli? Büyüme ve Ağ Optimizasyonu. Sol panel, Pareto Etkisi (Kritik Azınlık): azalan sütunlardan oluşan bir grafik ve üzerinde yükselip düzleşen yeşil kümülatif eğri. 1 numaralı not: en iyi 5 SPA anlaşması toplam interline gelirinin yüzde 40 ını oluşturur. 2 numaralı not: en iyi 25 SPA anlaşması gelirlerin yüzde 80 ini oluşturur. Sağ üst panel, Sadece Yolcu Değil, Kargo da Dahil: bir kargo sandığı ve bir yolcu koltuğu, yanında yükselen turuncu ok; Emirates ve Qantas örneğinde olduğu gibi SPA lar hava kargo (ağırlık/kg bazlı Air Waybill) için de çalışır. Sağ alt panel, Nihai Stratejik Fayda: kendi filonuzla uçmadığınız noktalara erişim (sanal ağ genişlemesi); düşük doluluk oranına sahip rotalarda diğer havayollarından gelen yolcularla ek gelir ve besleme (feeder) trafiği yaratılması. Not bandı: SPA ların O&D gelir yönetimine entegrasyonu planlamanın en zor hedefi; gelişmiş RM sistemleri bir rezervasyon sınıfını açıp kapatmadan önce bağlantılı yolcunun beklenen prorate değerini hesaplar, kârlı bir SPA yolcusu düşük getirili bir yerel yolcunun yerini alarak uçuş gelirini maksimize edebilir.](/decks/prorate-agreements/08.webp "Eğri erken düzleşiyor: listenin kuyruğundaki her yeni SPA toplama az şey katıyor, ama izlenmesi gereken bir anlaşma daha demek.")

Buradan çıkan stratejik sonuç iki yönlü. Birincisi sanal ağ genişlemesi:
havayolu kendi filosuyla uçmadığı noktalara, ortağının uçağı üzerinden
bilet satabiliyor. İkincisi besleme trafiği: düşük doluluklu rotalarda
diğer havayollarından gelen yolcular ek gelir yaratıyor. Sunum notu
bunları gelir yönetimine bağlıyor: gelişmiş RM sistemleri bir rezervasyon
sınıfını açıp kapatmaya karar vermeden önce bağlantılı yolcunun beklenen
prorate değerini hesaplıyor. Kârlı bir SPA yolcusu, düşük getirili bir
yerel yolcunun yerini alarak uçuş gelirini artırabiliyor. Prorate burada
muhasebenin ay sonu işi olmaktan çıkıp envanter kararının anlık bir
girdisine dönüşüyor.

## Yarın işe yarayacak dört çıkarım

1. **İzlemeyi büyük anlaşmalara yoğunlaştır.** Değerin büyük kısmı az
   sayıda SPA'dan geliyorsa, genel MPA kurallarına güvenip bütün
   anlaşmaları aynı sıklıkla izlemek kaynak israfı. En büyük 25 anlaşmanın
   pazar varlığına ve düşük doluluklu pazarlardaki ek gelire katkısını
   düzenli ölç, gerisini MPA'ya bırak.
2. **Maliyet ağırlıklı hesaplamayı referans veri olarak yönet.** Kısa
   mesafeli uçuşlarda operasyonel maliyetin karşılanması, ePMP'deki
   bölgesel maliyet faktörlerinin ve istisnaların doğru uygulanmasına
   bağlı. Aylık ePMP dosyalarını versiyonlu içeri aktar; her kuponu
   uçulduğu dönemin faktörleriyle hesapla.
3. **Interline'ı ağ kaldıracı olarak kullan.** Kendi ağının dışında kalan
   noktalara erişmek ve doluluk oranını besleme trafiğiyle desteklemek
   için interline biletleme doğrudan bir araç. Doğru şartlı bir SPA, o
   pazarlarda rekabetçi fiyat sunmanın ön koşulu; prorate payını da RM
   kararına girdi olarak ver.
4. **Fiyatlandırma ile gelir muhasebesi arasındaki turu iş akışına al.**
   SPA teklifinin fiyatlandırma incelemesi ile gelir muhasebesi incelemesi
   arasındaki iterasyonu dijital iş akışına entegre et. Her turun hangi
   parametreyi neden değiştirdiği kayıtlı olursa, periyodik değerlendirme
   anlaşmanın neden imzalandığını yeniden keşfetmek zorunda kalmaz.

Bu bölümde ne yok: interline biletin fiyatının nasıl kurulduğu
(fiyatlandırma bölümleri), bağlantılı yolcuyu yerel yolcuya karşı tartan
mekanizmanın kendisi (gelir yönetimi bölümleri) ve ICH ile SIS üzerinden
yürüyen aylık mutabakatın ayrıntısı. Bu bölüm, tek bir biletin parasının
hangi kuralla ve hangi sırayla iki havayolu arasında bölündüğünü anlatmak
için var.
