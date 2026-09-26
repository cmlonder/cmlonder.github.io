---
title: "Havacılık dağıtım kanalları ve ücret kuralları: stratejik analiz belgesi"
domain: "aviation"
summary: "Ekranda görünen tek bir bilet fiyatı iki katmanın kesişimi: havayolunun GDS ile imzaladığı tam içerik anlaşmasının hangi kanalda hangi fiyatı yasakladığı ve ATPCO'nun 29 kural kategorisinin o fiyatı kimin, ne zaman, hangi rotada, hangi cezayla kullanabileceği. Bu bölüm web ücretlerinden NDC'ye uzanan kanal pazarlığını ve fiyatı rafta duran bir sayı olmaktan çıkaran kural motorunu birlikte anlatıyor."
audience: "Fiyatlama motoru, teklif yönetimi ya da biletleme akışı üzerinde çalışan, bir ücretin neden bir kanalda çıkıp diğerinde çıkmadığını ya da bir aktarmanın neden fiyatı değiştirdiğini anlamak isteyen yazılımcı ve ürün insanı. Dağıtım bölümlerinin okunmuş olması işe yarar; tam içerik anlaşması, parite, PTC, stopover, Fare by Rule ve ADM metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Dağıtım bölümleri kanalları, pazarlama planlaması da o kanalların maliyet
dengesini anlatıyordu. Bu bölüm bir katman aşağı iniyor ve tek bir bilet
fiyatının nasıl ortaya çıktığına bakıyor. **Bir bilet fiyatı rafta duran
bir sayı değil, iki ayrı sözleşmenin kesişiminde anlık olarak kurulan bir
sonuç.** Birinci sözleşme ticari: havayolunun GDS ile imzaladığı anlaşma,
hangi fiyatın hangi kanalda görünebileceğini belirliyor. İkincisi teknik:
ATPCO'nun kural kategorileri, ham bir ücretin kimin tarafından, ne zaman,
nerede ve hangi şartlarla kullanılabileceğini belirliyor. Fiyatlama
motoru ikisini aynı anda doğrulamak zorunda.

![Sunumun kapak slaytı. Üstte bir barkod; barkodun çizgileri aşağı doğru uzayıp mavi ve sarı düğümlerle dolu bir devre ağına dönüşüyor. Başlık: Havayolu Ücretlendirme Mimarisi. Alt başlık: Dağıtım Kanallarından Karmaşık Biletleme Kurallarına Modern Fiyatlandırma. Alttaki not kutusu: etki alanı havayolu fiyatlandırması, dağıtım ve teklif yönetimi (offer management); bu sunum ticari dağıtım stratejileri (kanallar) ile düşük seviyeli sistem yürütmesi (ATPCO) arasındaki köprüyü kurar.](/decks/fare-rules-and-channels/01.webp "Barkodun her çizgisi ağın içinde ayrı bir yoldan geçiyor. Bu bölüm o yolların iki katmanını ayrı ayrı açıyor: kanal ve kural.")

## Web ücreti bir fiyat değil, bir kanal kararıydı

Web ücretleri (web fares) 2000'li yılların başında ortaya çıktı ve ilk
halleri özel ücretlerdi: yalnızca havayolunun kendi web sitesinden
alınabilen fiyatlar. Amaç iki yönlüydü; marka bilinirliğini artırmak ve
dağıtım maliyetini düşürmek. Havayolu GDS segment ücretinden kaçınıp kendi
sitesinden sattığında ciddi bir dağıtım maliyetinden tasarruf ediyordu.

GDS açısından bu doğrudan bir tehditti. Kaynak metin ilişkiyi açıkça
koyuyor: GDS havayolu web ücretleriyle her zaman ters düşmüş; kendi
bakışlarına göre ise havayollarıyla müzakere ettikleri tam içerik yenileme
anlaşmalarıyla verimli bir pazar yeri için dengeli bir çözüm sunuyorlar.
Yani GDS'in cevabı teknolojik değil sözleşmeseldi.

![Başlık: Web Ücretleri ve GDS Gerilimi. Solda ızgara desenli mavi panel, GDS (Küresel Dağıtım Sistemleri): büyük taşıyıcılarla geniş pazar erişimi karşılığında katı tam içerik (full content) anlaşmaları; dengeli ve verimli bir pazar yeri çözümü sunmayı hedefler. Sağda açık panel, Web Ücretleri (Doğrudan Tüketiciye): 2000'lerin başında özel ücretler (private fares) olarak doğdu; marka bilinirliğini artırmak ve dağıtım maliyetlerini düşürmek temel amaçtır; sadece havayolunun kendi web sitesinden alınabilir. Paneller arasında karşılıklı iki ok. Altta sarı kutu: GDS'in sunduğu geniş pazar yeri ile havayollarının doğrudan satış yaparak maliyetleri düşürme isteği arasında süregelen stratejik bir rekabet vardır. Not kutusu: terimler GDS, doğrudan ve dolaylı kanal, private fares; akış AirShopping ve dağıtım; havayolları GDS segment ücretlerinden kaçınarak web üzerinden sattıklarında devasa dağıtım maliyetlerinden tasarruf eder.](/decks/fare-rules-and-channels/02.webp "İki panelin arasındaki oklar iki yönlü: bu bir geçiş değil, her anlaşma döneminde yeniden kurulan bir pazarlık.")

## Parite, tam içerik anlaşmasının asıl maddesi

Tam içerik anlaşmasının (Full Content Agreement) teknik anlamı basit:
havayolu bütün ücretlerini ATPCO'ya, bütün seferlerini SSIM dosyalarıyla
OAG ya da Cirium'a gönderiyor ve böylece GDS havayoluyla birebir aynı
veriye sahip oluyor. Ticari anlamı ise daha keskin. Anlaşma, havayolunun
kendi sitesinde GDS kanalında bulunmayan daha düşük fiyatları yayınlamasını
engelleyen bir kurallar bütünü. Bunun adı parite: havayolu kendi sitesinde
GDS'ten daha ucuza bilet satamıyor.

Web'e özel bir ücret yayınlayıp yayınlamama kararı bu yüzden bir
fiyatlandırma kararı değil, bir sözleşme sorgusu. Havayolu tam içerik
yenileme anlaşmasını imzalamışsa web sitesinde GDS'te olmayan daha düşük
ücret yayınlayamıyor. Anlaşmaya dahil olmayan taşıyıcılar ise yalnızca
kendi sitelerinden biletlenebilen özel ücretler tanımlayabiliyor. Yazılım
tarafında bunun karşılığı şu: web kanalına bir promosyon çıkaran her akış,
o pazarda geçerli bir tam içerik anlaşması olup olmadığını bilmek zorunda.
Parite ihlali pazarlama ekibinin hatası gibi görünür ama önünü alacak
kontrol kampanya motorunda durur.

![Başlık: GDS'in Hakimiyet Aracı, Tam İçerik Anlaşmaları. Solda tanım: havayollarının kendi web sitelerinde GDS kanalında bulunmayan daha düşük fiyatları yayınlamasını engelleyen kurallar bütünü. Sağda bal peteği gibi dizilmiş numaralı altıgenler: 1 Tam İçerik (Full Content), tüm sefer ve ücretlerin eksiksiz verilmesi; 2 Uzun Vadeli Odak, anlaşmaların uzun yılları kapsaması; 3 Hizmet Bedeli Koruması, GDS kârlılığının güvence altına alınması; 4 Eşit Muamele (Parity), kanallar arası fiyat ayrımcılığı yapılmaması; iki ayrı 5 numaralı altıgen, Acente Esnekliği, seyahat acentelerinin (özgür araç) seçimi; 6 Değer Bazlı Teşvik, eklenen değere dayalı prim ödemeleri. Not kutusu: kilit kavram eşit muamele (parity), havayolları kendi sitelerinde GDS'ten daha ucuza bilet satamaz; teknik detay, tam içerik havayollarının tüm ücretlerini ATPCO'ya ve tüm seferlerini SSIM dosyalarıyla OAG/Cirium'a göndermesi demektir, böylece GDS havayoluyla birebir aynı veriye sahip olur.](/decks/fare-rules-and-channels/03.webp "Altı maddeden biri havayoluna ait değil: hizmet bedeli koruması doğrudan GDS'in kârlılığını güvenceye alıyor. Anlaşmanın kimin için yazıldığı orada okunuyor.")

## Yan hizmetler sözleşmenin dışında kaldı

Tam içerik anlaşmasının kapsadığı şey ücret ve sefer. Koltuk seçimi,
bagaj ya da yemek gibi yan hizmetler (ancillaries) bu kapsamın dışında.
Kaynak metin bunu açıkça söylüyor: tam içerik anlaşmaları havayollarının
sattığı yan hizmet ürünlerinin satışı için geçerli değil; bu da
havayollarının yan hizmetleri ATPCO'ya ve GDS'e dağıtmak zorunda olmadığı
anlamına geliyor.

Sonucu önemli. Parite yan hizmete uzanmadığı için bu ürünlerin satışı ve
fiyatlandırma gücü tamamen havayolunun elinde kalıyor. Yüksek kârlı bir
ürün grubu, GDS maliyetine hiç girmeden doğrudan kanaldan satılabiliyor.
Kanal pazarlığında havayolunun en rahat hareket ettiği alan, sözleşmenin
yazılmadığı alan.

## NDC tam içerik anlaşmasını kendi eliyle eskitiyor

Geleneksel modelde teklifi GDS kuruyor: EDIFACT mesajları ve ATPCO
kurallarıyla. Fiyatlandırma gücü sistem sağlayıcının kontrolünde ve katı
parite kurallarına tabi. IATA'nın Yeni Dağıtım Kabiliyeti (NDC) bu sırayı
tersine çeviriyor; teklifi havayolunun kendi sistemleri XML ya da JSON
API'leriyle kuruyor ve fiyatlandırma gücü havayoluna geçiyor.

Kaynak metnin öngörüsü doğrudan: NDC'nin benimsenmesi fiyatlandırma
gücünü GDS'ten havayoluna kaydıracağı için sonunda tam içerik
anlaşmalarını işlevsiz bırakacak. Mantık şu: parite, GDS'in havayoluyla
aynı veriye sahip olmasına dayanıyordu. Teklifi havayolu kendi sistemiyle
anlık kurmaya başladığında GDS'in elinde eşitlemesi gereken sabit bir
ücret listesi kalmıyor. Havayolu kendi içeriğini, fiyatını ve yan
hizmetlerini daha esnek ve doğrudan yönetebiliyor.

![Başlık: Fiyatlandırma Gücünün El Değiştirmesi. Üç satırlı karşılaştırma tablosu, sütunlar Geleneksel GDS ile NDC ve Web Ücretleri. Fiyatlandırma gücü: GDS'te sistem sağlayıcının kontrolünde, katı eşlik (parity) kurallarına tabi; NDC'de tamamen havayolunun kontrolünde, dinamik fiyatlandırmaya açık. Ek hizmetler (ancillaries): GDS'te tam içerik anlaşmalarına dahil değil, dağıtımı zordur; NDC'de doğrudan satış sürecine tam entegre (koltuk, bagaj, yemek); bu satırın üzerinde soldan sağa uzanan büyük sarı bir ok var. Teknolojik altyapı: GDS'te eski nesil veri iletişim standartları; NDC'de IATA onaylı Yeni Nesil Dağıtım Kapasitesi. Altta kutu: IATA'nın NDC standardı fiyatlandırma gücünü GDS'ten havayoluna geri vererek geleneksel tam içerik anlaşmalarını yavaş yavaş geçersiz kılmaktadır. Not kutusu: eski sistemde GDS teklifi EDIFACT mesajları ve ATPCO kuralları ile oluşturur, NDC modelinde teklifi havayolunun kendi bilişim sistemleri XML/JSON API'leri ile oluşturur.](/decks/fare-rules-and-channels/04.webp "Sarı ok yan hizmetler satırında: sözleşmenin dışında kalan ürün, NDC'de doğrudan satışın ortasına yerleşiyor.")

## Fiyat, kural süzgecinden geçerek inşa ediliyor

Kanal katmanı hangi fiyatın nerede görüneceğini söylüyor; kural katmanı
o fiyatın geçerli olup olmadığını. Bir seyahat programını
fiyatlandırmanın karmaşıklığı, tek bir ücrete uygulanabilecek onlarca
farklı kuraldan geliyor. Sektör standardı ATPCO, bir biletin
geçerliliğini sınamak için 29 farklı kural kategorisi kullanıyor. Ham bir
ücretin satılabilir bir bilete dönüşmesi için bu kuralların hepsi aynı
soruya cevap vermeli: bu bilet kim tarafından, ne zaman, nerede ve hangi
finansal şartlarla kullanılabilir?

Sunumun notu bunu motor düzeyine indiriyor: Sabre Bargain Finder Max ya da
Amadeus MasterPricer gibi bir fiyatlandırma motoru, bir ücretin yasal
olarak satılıp satılamayacağını doğrulamak için saniyede milyonlarca
kombinasyonu bu kategori süzgeçlerinden geçiriyor. Yazılım tarafında bu,
fiyatın bir veritabanı satırı değil bir hesaplama sonucu olduğu anlamına
geliyor. Önbelleğe alınan şey ücret olabilir, ama satılabilirlik her
istekte yeniden sınanıyor.

![Başlık: Bir Bilet Fiyatının Anatomisi, Kural Kategorileri. Sağda yukarıdan küplerin, yani baz ücretlerin döküldüğü bir huni; huninin içinde dört süzgeç katmanı sırayla Kim?, Ne zaman?, Nerede? ve Finansal? diye etiketli. Huninin altından bir bilet çıkıyor ve yanında Fiyat onaylı, 4.500 TL yazan bir onay kutusu duruyor. Soldaki metin: bir seyahat programının fiyatlandırılmasındaki karmaşıklık tek bir ücrete uygulanabilecek onlarca farklı kuraldan kaynaklanır, fiyatlar statik değildir, milisaniyeler içinde inşa edilir; sektör standardı ATPCO bir biletin geçerliliğini test etmek için 29'dan fazla farklı kural kategorisi kullanır, ham bir ücretin satılabilir bir bilete dönüşmesi için bu kurallar biletin kim tarafından, ne zaman, nerede ve hangi şartlarla kullanılabileceğini doğrulamak zorundadır. Not kutusu: 29 kategori aslında ATPCO ücret kategorileridir (Kategori 1-50 arası); Sabre Bargain Finder Max veya Amadeus MasterPricer gibi bir fiyatlandırma motoru bir ücretin yasal olarak satılıp satılamayacağını doğrulamak için saniyede milyonlarca kombinasyonu bu kategori süzgeçlerinden geçirir.](/decks/fare-rules-and-channels/05.webp "Dört süzgeç, bu bölümün geri kalanının haritası: aşağıdaki üç başlık sırasıyla kim ve ne zaman, nerede, finansal katmanları açıyor.")

## Kim ve ne zaman: yolcu tipi ile takvim fiyatı ayırıyor

Süzgecin ilk katmanı yolcunun kendisi. Kategori 1 (Uygunluk) sektördeki
150'den fazla yolcu tipi kodu (PTC, Passenger Type Code) arasından
hangisinin yolcuya uygulanacağını belirliyor. Sistem yolcunun yaş
aralığına (çocuk, bebek), statüsüne (öğrenci, asker) ve özel durumlarına
(refakatsiz çocuk, cenaze yolcusu) ait kimlik gereksinimlerini kontrol
ediyor ve en uygun ücret sınıfını atıyor. Aynı koltuğun farklı yolcuya
farklı fiyatla satılabilmesinin hukuki zemini bu kategori.

İkinci katman zaman. Kategori 5 biletin uçuştan ne kadar önce alınması
gerektiğini, kalış süresi kuralları dönüşün en erken ne zaman başlayıp
en geç ne zaman bitebileceğini, karartma tarihleri de seyahate hiç izin
verilmeyen dönemleri tanımlıyor. Sunumun notu minimum ve maksimum kalış
kurallarının tarihsel işlevini açıkça yazıyor: pazartesi gidip perşembe
dönen iş yolcusunu hafta sonu kalan tatilciden ayırmak ve iş yolcusundan
çok daha yüksek ücret almak. Gelir yönetimi bölümlerinde anlatılan segment
ayrımının biletin üzerindeki izi bu kurallar.

![Başlık: Kategori Sentezi 1, Yolcu ve Zaman Kısıtlamaları. Sol panel, Kim Seyahat Ediyor? (Yolcu Uygunluğu), kategoriler 1, 13, 19, 20, 21, 26: yolcu tipi kodları (PTC), sektörde 150'den fazla kod bulunur, örneğin ADT yetişkin, CHD çocuk, UNN refakatsiz çocuk, INF koltuksuz bebek, INS koltuklu bebek, BEV cenaze, STU öğrenci; özel şartlar, birlikte seyahat etme (refakatçi) zorunluluğu ve grup/acente indirimleri. Sağ panel, Seyahat Ne Zaman? (Zaman Kısıtlamaları), kategoriler 2, 3, 5, 6, 7, 11: erken alım, rezervasyon ve biletleme için uçuşa kalması gereken süre; kalış süresi, minimum ve maksimum süreler; karartma tarihleri (blackout), seyahate kesinlikle izin verilmeyen tarihler veya sezonlar. Not kutusu: minimum/maksimum kalış kuralları tarihsel olarak iş seyahati yapanları (pazartesi gidip perşembe dönenler) tatilcilerden (hafta sonu kalanlar) ayırmak ve iş yolcularından çok daha yüksek ücret talep etmek için kullanılır.](/decks/fare-rules-and-channels/06.webp "Sağ paneldeki kalış süresi kuralı teknik bir kısıt gibi duruyor ama işi bir segmentasyon: iş yolcusunu takviminden tanıyor.")

## Transfer ile stopover arasındaki fark bir eşik değeri

Süzgecin üçüncü katmanı rota. Burada iki şey ayrılıyor ve sistem
açısından aralarındaki fark büyük. Transfer yalnızca uçak değiştirmek.
Stopover (duraklama) ise ara noktada uzun süre bekleme hakkı; genellikle
ek vergilere tabi ve ücret hesaplamasını değiştiriyor. İkisini ayıran
şey bekleme süresinin kendisi değil, o sürenin hangi eşiği geçtiği.

Kategori 8'in mantığı uçuşun niteliğine bakıyor. ABD içi uçuşlarda 4
saati aşan bekleme stopover sayılıyor, uluslararası uçuşlarda eşik 24
saat. Eşik aşıldığında Kategori 8 kuralları devreye giriyor ve ek ücret
tetikleniyor. Yazılım tarafında bunun karşılığı sıralı bir karar: sistem
önce seyahatin iç hat mı dış hat mı olduğunu sınıflandırmalı, ancak
ondan sonra bekleme süresini doğru eşikle karşılaştırabilir. Sınıflandırma
yanlışsa eşik de yanlış, fiyat da yanlış.

Rota katmanında başka kurallar da var. Kategori 4 fiyatı yalnızca belirli
uçuş numaralarına bağlıyor. Kategori 9, 14 ve 17 hangi şehirler üzerinden
aktarma yapılabileceğini, HIP (Higher Intermediate Point) istisnalarını
ve rotalama şartlarını tanımlıyor. Kategori 10 ise nihai güzergâh
fiyatını oluşturmak için birden fazla ücretin nasıl birleştirilebileceğini
belirliyor.

![Başlık: Kategori Sentezi 2, Rota, Uçuş ve Aktarma Şartları. Sol liste: uçuş kısıtlamaları (Kat. 4), fiyatın sadece belirli uçuş numaralarında geçerli olması; duraklamalar, stopovers (Kat. 8), uçuş noktalarında uzun süreli bekleme hakkı, iç hatlarda 4 saatten fazla, dış hatlarda 24 saatten fazla bekleme; aktarmalar ve rotalar (Kat. 9, 14, 17), hangi şehirler üzerinden aktarma yapılabileceği, HIP (Higher Intermediate Point) istisnaları ve rotalandırma şartları; kombinasyonlar (Kat. 10), nihai güzergah fiyatını oluşturmak için birden fazla farklı ücretin birleştirilebilme kuralları. Sağda A noktasından B üzerinden C noktasına giden bir yay; B noktasında iki etiket: kısa ok simgesiyle Transfer ve saat simgeli altıgenle Stopover. Not kutusu: transfer ile stopover arasında büyük sistem farkı vardır, transfer sadece uçak değiştirmektir, stopover genellikle ekstra vergilere tabi olur ve ücret hesaplamasını değiştirir; rotalar yolcunun A noktasından B noktasına gitmek için haritada uçabileceği kesin güzergahı belirler.](/decks/fare-rules-and-channels/07.webp "B noktasında iki etiket aynı yerde duruyor: yolcu için ikisi de bekleme, sistem için biri serbest geçiş, diğeri yeni bir fiyat.")

## Kurumsal kontratın doğruluğu Kategori 25'te yazılıyor

Süzgecin son katmanı finansal. Kategori 12 belirli koşullar sağlandığında
bilete eklenen ek ücretleri (surcharges), Kategori 16 iptal, iade ya da
değişiklik durumunda uygulanacak cezaları tanımlıyor. Kategori 15, 18,
23 ve 29 biletin nerede satılabileceğini, depozito şartlarını ve bilet
onay (endorsement) gereksinimlerini kapsıyor.

Bu katmanın en ilginç kategorisi 25: Fare by Rule, yani kurala göre ücret.
Taşıyıcının mevcut baz ücretlerini ve kurumsal kurallarını kullanarak
dinamik olarak yeni ücretler üretiyor. Kurumsal şirketlerle yapılan
kontratlar karmaşık ve elle girildiğinde hataya açık. Acente bir bileti
elle fiyatlandırıp Fare by Rule limitleri gibi kuralları ihlal ettiğinde
havayolu aradaki farkı ceza olarak talep eden bir acente borç dekontu
(ADM, Agency Debit Memo) kesiyor. Kategori 25 bu zinciri baştan kesiyor:
kontrat şartları ATPCO'ya kural olarak hatasız girildiğinde fiyatlama
doğruluğu artıyor ve ADM'ler azalıyor.

Mühendislik açısından fark şu: kurumsal fiyat ayrı bir fiyat listesi
olarak tutulmuyor, baz ücretin üzerine uygulanan bir kural olarak
tutuluyor. Baz ücret değiştiğinde türetilen ücret de kendiliğinden
değişiyor. Elle bakımı yapılan paralel bir liste ise bir sonraki fiyat
güncellemesinde baz ücretten kopuyor ve kopukluğun faturası ADM olarak
geri dönüyor.

![Başlık: Kategori Sentezi 3, Finansal Kurallar ve İstisnalar. Solda dört kutu: ek ücretler (surcharges, Kat. 12), belirli koşullar sağlandığında bilet fiyatına eklenen özel şartlı kesintiler ve vergiler; cezalar (penalties, Kat. 16), iptal, iade veya değişiklik durumunda uygulanacak finansal yaptırımlar; kurala bağlı ücretler (fare by rule, Kat. 25), mevcut ücretler baz alınarak dinamik olarak yeni fiyatlar üretilmesi, karmaşık kurumsal sözleşmeleri yönetir ve acente borç dekontlarını (ADM) azaltır; satış ve idari kısıtlamalar (Kat. 15, 18, 23, 29), biletin nerede satılabileceği, depozito şartları ve bilet onay (endorsement) gereksinimleri. Sağda örnek bir bilet dökümü: PNR ABCDEF, uçuş TK1234, tarih 25 OCT 2023, fare basis YFLEX, baz ücret 500 USD, vergiler 150 USD, toplam 650 USD; sarıyla vurgulu ceza satırı 100 USD, maviyle vurgulu fare by rule düzeltmesi eksi 50 USD, ek ücret 30 USD; endorsement satırı iadesiz ve değişiklik ücreti uygulanır diyor. Not kutusu: Kategori 16 otomatik bilet iadelerinin mantığını çalıştırır; bir seyahat acentesi bileti manuel fiyatlandırır ve FBR limitleri gibi kuralları ihlal ederse havayolu aradaki farkı ceza olarak talep eden bir ADM keser.](/decks/fare-rules-and-channels/08.webp "Örnek biletteki iki vurgulu satır iki ayrı kategoriden geliyor: ceza Kategori 16'dan, düzeltme Kategori 25'ten. Toplam fiyat ikisinin de sonucu.")

## Kanal ve kural aynı istekte birleşiyor

İki katman ayrı ayrı anlatıldı ama çalışırken ayrı değiller. Akış
havayolunun ticari stratejisiyle başlıyor, kanal seçimiyle devam ediyor
(geleneksel GDS mi, NDC ya da web mi), ATPCO süzgecinde yolcu, zaman, rota
ve finansal kurallar milisaniyeler içinde doğrulanıyor ve sonunda tek,
satılabilir bir fiyat çıkıyor. Sunumun notunun ifadesiyle ücretler rafta
duran statik fiyatlar değil; kanal kısıtlamaları (kullanıcı nerede
alışveriş yapıyor?) ile ATPCO kural kategorileri (bu kullanıcı şu anda bu
bileti alabilir mi?) birleştirilerek anlık kuruluyor.

![Başlık: Ücretlendirmenin Kusursuz İşleyişi. Soldan sağa oklarla bağlı dört kutu: Strateji (satranç taşları simgesi), havayolunun ticari stratejisi; Kanal Seçimi (ayrılan yol okları), geleneksel GDS veya yeni nesil NDC/Web kanalının belirlenmesi; ATPCO Süzgeci (huni simgesi), yolcu, zaman, rota ve finansal kuralların milisaniyeler içinde doğrulanması; Nihai Bilet, tek, nihai ve satılabilir fiyat. Altta büyük resim kutusu: ekranda gördüğümüz tek bir bilet fiyatı aslında devasa bir sözleşme ve kural mimarisinin saniyeler içindeki kusursuz hesaplanmasıdır; geleceğin standardı NDC bu devasa hesaplama gücünü tamamen havayollarının kendi sistemlerine taşıyarak bu mimariyi yeniden şekillendirecektir. Not kutusu: uçtan uca akış alışverişten biletlemeye (AirShopping to Ticketing).](/decks/fare-rules-and-channels/09.webp "Kanal seçimi süzgeçten önce geliyor: hangi kuralların çalışacağı, isteğin hangi kapıdan girdiğine bağlı.")

Kapanış cümlesi bir önceki başlıkla birleşince tablonun geleceğini de
söylüyor. NDC ile fiyatlandırma gücü havayoluna geçerken bu hesaplama
yükü de havayolunun kendi sistemlerine taşınıyor. Parite kuralını da,
kural süzgecini de artık havayolu kendisi çalıştırmak zorunda kalıyor.

## Yarın işe yarayacak dört çıkarım

1. **Web promosyonunu sözleşmeye karşı sına.** Havayolu bir GDS ile tam
   içerik anlaşması imzalamışsa web sitesinden sunulan her promosyonun
   pariteyi ihlal etmediğinden emin ol. Bu kontrolü kampanya akışının
   içine koy, sonradan yapılan denetime bırakma.
2. **Yan hizmeti doğrudan kanaldan büyüt.** Yan hizmetlerin ATPCO'ya ve
   GDS'e dağıtılması zorunlu olmadığı için bu yüksek kârlı ürünleri
   öncelikle web ve mobil uygulama üzerinden sun; GDS maliyetine hiç
   girmesinler.
3. **Kurumsal kontratı kural olarak yaz, liste olarak değil.** Kurumsal
   satışlarda Fare by Rule (Kategori 25) kullanımını yaygınlaştır. Elle
   fiyat girişinden kaynaklanan mali kayıpları ve ADM'leri en aza indirmenin
   yolu, kontrat şartını baz ücrete bağlı bir kural olarak tutmak.
4. **Stopover eşiğini otomatik bariyer yap.** Uluslararası planlamada 24
   saat kuralını ücret hesaplamasında otomatik bir bariyer olarak kullan
   ve duraklama ücretleri konusunda yolcuya şeffaf bilgi ver. Eşiği
   seçmeden önce seyahatin iç hat mı dış hat mı olduğunu doğru
   sınıflandır.

Bu bölümde ne yok: ATPCO'nun ve IATA'nın sektördeki yönetişim rolü
("Havacılık endüstri standartları ve yönetişim: stratejik analiz
belgesi"), NDC'nin sertifikasyon seviyeleri ve acente tarafındaki etkisi
("Seyahat dağıtım ekosistemi ve yeni dağıtım yeteneği (NDC) analizi"),
fiyatlandırma gücü havayoluna geçtiğinde gelen arama yükü ("NDC@Scale:
havacılık dağıtım kanallarında dönüşüm ve iş mantığı analizi"). Bu bölüm
tek bir fiyatın kanal ve kural katmanlarından nasıl geçtiğini anlatmak
için var.
