---
title: "Havacılık endüstri standartları ve yönetişim: stratejik analiz belgesi"
domain: "aviation"
summary: "GDS pazar yerinin altında görünmeyen bir tesisat var: kuralı IATA ve A4A yazıyor, mesajı SITA ve ARINC taşıyor, tarifeyi OAG ve ATPCO dağıtıyor, parayı BSP, ARC ve takas odaları hareket ettiriyor. Bu bölüm dört sütunu, PCA'daki tam içerik maddesini ve 'kayıtlı satıcı kim' sorusunun iki cevabını anlatıyor."
audience: "Havayolu entegrasyonu yazarken PCA, BSP, ATPCO, PADIS gibi kısaltmalara çarpan yazılımcı ve ürün insanı. Önceki bölüm okunmuş olmalı; her kısaltma metnin içinde açılıyor."
pubDate: 2026-09-21
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölüm GDS'i on binlerce tedarikçiyi üç aracıdan geçirip alıcıya
bağlayan bir pazar yeri olarak bırakmıştı. Bu bölüm o pazar yerinin
altındaki tesisatı anlatıyor. **Havayolu ile GDS arasındaki her etkileşim
dört sütuna dayanıyor:** kuralı kim yazıyor, veriyi kim dağıtıyor, mesajı
kim taşıyor, parayı kim takas ediyor. Yazılımcının bir entegrasyonda
çarptığı kısaltmaların neredeyse hepsi bu dört sütundan birine ait ve
hangisine ait olduğunu bilmek, hatanın nerede olduğunu bilmek demek.

![Sunumun kapak slaytı, kareli teknik çizim zemini. Başlık: Havacılık Dağıtım Ekosisteminin Anatomisi. Alt başlık: standartlar, ağlar ve küresel uçuş operasyonlarını yöneten kurumlar. Altta dünya haritası üzerinde Hub A, Hub B ve Hub C etiketli üç turuncu merkez; aralarında uçuş rotası, veri devresi, ağ rotası ve dijital hat etiketli kavisli çizgiler; kenarlarda uydu, sunucu ve havalimanı kulesi simgeleri.](/decks/industry-standards/01.webp "Haritada iki tür çizgi var: uçuş rotası ve veri devresi. Bu bölüm ikinci türün kim tarafından çekildiğini anlatıyor.")

## Ekosistem dört sütun üzerinde duruyor

Havacılık endüstrisi, GDS ile havayolları arasındaki etkileşimi dört
işlevsel sütun üzerinde kuruyor. Yönetişim: endüstri standartlarını ve
mesajlaşma protokollerini belirleyen kurumlar. Veri: uçuşların varlığını
ve fiyat etiketlerini dağıtan merkezler. İletişim: küresel sistemler
arası veri akışını sağlayan altyapı sağlayıcıları. Mutabakat: bilet
gelirinin acentelerden ve havayollarından doğru hesaba yönlendirilmesini
sağlayan sistemler.

![Başlık: Küresel Dağıtım Ekosisteminin Dört Temel Taşı. Alt başlık: havacılık endüstrisi, GDS ve havayolları arasındaki etkileşimi sağlayan dört işlevsel sütun üzerinde yükselir. Dört kutu. 1. Yönetişim (kural koyucular), tokmak ve terazi simgesi: endüstri standartlarını ve mesajlaşma protokollerini belirleyen kurumlar. 2. Veri (tarife ve planlar), veritabanı ve takvim simgesi: uçuşların varlığını ve fiyat etiketlerini dağıtan merkezler. 3. İletişim (ağlar), kesişen oklar simgesi: küresel sistemler arası veri akışını sağlayan altyapı sağlayıcıları. 4. Mutabakat (finansal takas), kasa ve kilit simgesi: bilet gelirlerinin acentelerden ve havayollarından doğru hesaplara yönlendirilmesini sağlayan sistemler.](/decks/industry-standards/02.webp "Dört sütun dört ayrı soruya cevap: ne konuşulabilir, ne var, nasıl ulaşır, kim öder. Bir entegrasyon hatası bunlardan yalnızca birine düşer.")

## Kural koyucular: IATA küresel, A4A Amerikan, PCA ikisinin arasında

IATA (Uluslararası Hava Taşımacılığı Birliği) küresel: dünya çapında
250'den fazla havayolu üyesi, endüstriye liderlik eder ve küresel
standartları yazar. Temel kılavuzları AIRIMP (rezervasyon mesajlaşma
prosedürleri) ve PADIS (yolcu ve havalimanı veri değişimi). A4A (Airlines
for America, eski adıyla ATA) Amerikan: ABD yolcu ve kargo trafiğinin
%90'ından fazlasını taşıyan havayollarının ana ticaret örgütü; temel
kılavuzu SIPP (Standart Interline Yolcu Prosedürleri). Kaynak metnin
tanımıyla AIRIMP ve SIPP, rezervasyon ve operasyonel mesajlaşmanın
anayasası.

![Başlık: Kural Koyucular, Küresel ve Bölgesel Yönetişim. Solda lacivert çerçeveli IATA (Uluslararası Hava Taşımacılığı Birliği): etki alanı küresel, dünya çapında 250'den fazla havayolu üyesi; temel rol, endüstriye liderlik eder ve küresel standartları yazar; temel kılavuzlar AIRIMP (rezervasyon mesajlaşma prosedürleri), PADIS (yolcu ve havalimanı veri değişimi). Sağda turuncu çerçeveli A4A (Airlines for America): etki alanı Amerika Birleşik Devletleri, eski adıyla ATA; temel rol, ABD yolcu ve kargo trafiğinin %90'ından fazlasını taşıyan havayollarının ana ticaret örgütü; temel kılavuz SIPP (Standart Interline Yolcu Prosedürleri). Altta sistem entegrasyonu kutusu, PCA (Katılımcı Taşıyıcı Anlaşması): havayolları ve GDS'ler arasındaki ticari bağdır; tam içerik (full content) kuralı, havayolunun kendi web sitesindeki tüm içeriği eksiksiz olarak GDS üzerinden de sunmasını zorunlu kılar.](/decks/industry-standards/03.webp "Üstteki iki kutu kuralı yazıyor, alttaki kutu sözleşmeyi. Havayolu ile GDS'in ilişkisi standartta değil PCA'da; tam içerik maddesi de orada.")

Havayolunun GDS'e katılımı Katılımcı Taşıyıcı Anlaşması (PCA) ile
düzenleniyor ve en kritik maddesi tam içerik (full content): havayolu,
kendi doğrudan kanallarında sunduğu bütün içeriği GDS üzerinden de sunmak
zorunda. Kaynak metnin ifadesiyle, havayolunun tüketiciye doğrudan web
sitesinde verdiği içeriğin aynısını GDS'ten de vermesi. İş kuralı olarak
sonucu: havayolu web sitesine özel bir kampanya yaptığında bunu GDS
ortaklarından saklayamaz; içerik eşitliği korunur, GDS satışında
ayrımcılık yapılmaz. Kanal stratejisi ve fiyat politikası bu maddenin
gölgesinde kuruluyor.

## Mesajlaşma: teletype'tan EDIFACT'a, oradan XML ve NDC'ye

Sektör 1920'lerden kalma teletype üzerine kuruldu. Type B: basit,
asenkron mesajlaşma; rezervasyon satışı, iptali, uçuş durumu
güncellemeleri ve codeshare formatları; IATA standartlaştırdı ve
sistemler arası iletişimin temelini attı. Etkileşimli çağ EDIFACT
(Type A): etkileşimli veri transferi, IATA'nın PADIS standartları
tarafından tanımlandı, geleneksel GDS altyapısının belkemiği. Modern çağ
XML ve JSON: zengin içerik ve web tabanlı aktarım; geliştiricileri Open
Travel Alliance (OTA) ve Open AXIS; IATA'nın NDC standardının temeli,
koltuk seçimi ve bagaj gibi yeni nesil ürünlerin GDS'e iletilmesini
sağlıyor.

![Başlık: Mesajlaşma Protokollerinin Evrimi. Üç basamak halinde yükselen eşkenar dörtgen platformlar: gri, lacivert, turuncu. 1920'ler, Teletype (Type B): özellik basit, asenkron mesajlaşma; kullanım rezervasyon satışı, iptali, uçuş durumu güncellemeleri ve codeshare formatları; sistemler arası iletişimin temelini attı, IATA tarafından standartlaştırıldı. Etkileşimli çağ, EDIFACT (Type A): özellik etkileşimli (interactive) veri transferi; standart IATA'nın PADIS standartları tarafından tanımlandı; geleneksel GDS altyapısının belkemiğidir. Modern çağ, XML ve JSON: özellik zengin içerik (rich content) ve modern web tabanlı aktarım; geliştiriciler Open Travel Alliance (OTA) ve Open AXIS; gelecek, IATA'nın NDC (New Distribution Capability) standardının temelidir, yeni nesil havayolu ürünlerinin (koltuk seçimi, bagaj vb.) GDS'lere iletilmesini sağlar. Altta bant: tüm GDS'ler, standartların gelişimini takip etmek için IATA forumlarına oy hakkı olmayan üyeler olarak katılır.](/decks/industry-standards/04.webp "Üç platform üst üste değil, yan yana yükseliyor: alttakiler kalkmadı. Bugün bir rezervasyon üç dilde birden dolaşabiliyor.")

Uyumluluk sorusunun cevabı slaytta gizli: yeni XML ve JSON standartları
geliştirilirken mevcut EDIFACT yapıları referans alınıyor. IATA'nın PADIS
standartları ve OTA protokolleri, hava, otel ve araç kiralama gibi farklı
dikey sektörler arasında birlikte çalışabilirliğin temel mantığını
oluşturuyor. Alttaki bant güç dengesini anlatıyor: bütün GDS'ler IATA
forumlarına katılıyor ama oy hakkı olmayan üye olarak. Standardı
havayolları yazıyor, GDS'ler izliyor.

## Ağlar: SITA ve ARINC, ekosistemin sinir sistemi

SITA (Société Internationale de Télécommunications Aéronautiques) 1949'da
Air France, KLM ve BOAC dahil 11 öncü havayolu tarafından kuruldu.
200'den fazla ülkede faaliyet gösteriyor ve dünyanın en büyük teletype
mesajlaşma ağını yönetiyor: günde 25 milyondan fazla mesaj. GDS'ler ve
çevrimiçi sağlayıcılar kendi ağlarını desteklemek için bu omurgayı
kullanıyor. ARINC (Aeronautical Radio, Inc.) ABD hükümeti dışındaki tek
telsiz iletişimi lisans sahibi ve koordinatörü (FCC yetkisiyle); 1978'de
ACARS'ı (uçak iletişim adresleme ve raporlama sistemi) tanıttı; uçak ile
yer istasyonları arasındaki radyo ve uydu iletişimini sağlıyor.

![Başlık: Ağ ve İletişim Ortakları, Ekosistemin Sinir Sistemi. Solda iki kurum. SITA (Société Internationale de Télécommunications Aéronautiques): kuruluş 1949 (Air France, KLM, BOAC dahil 11 öncü havayolu); ölçek, 200'den fazla ülkede faaliyet gösterir, dünyanın en büyük teletype mesajlaşma ağını yönetir (günde 25 milyondan fazla mesaj); işlev, GDS'ler ve çevrimiçi sağlayıcılar kendi ağlarını desteklemek için bu devasa omurgayı kullanır. ARINC (Aeronautical Radio, Inc.): statü, ABD hükümeti dışındaki tek telsiz iletişimi lisans sahibi ve koordinatörü (FCC yetkisiyle); inovasyon, 1978'de ACARS (uçak iletişim adresleme ve raporlama sistemi) tanıtıldı; işlev, uçak ile yer istasyonları arasındaki hayati radyo ve uydu iletişimini sağlar. Sağda bir uçak, uydu anteni ve küre üzerinde birbirine bağlı düğümlerden oluşan ağ çizimi.](/decks/industry-standards/05.webp "SITA yerdeki sistemleri birbirine, ARINC uçağı yere bağlıyor. Rezervasyon mesajı ilkinden, kokpit mesajı ikincisinden geçiyor.")

Operasyonel süreklilik sorusunun cevabı: havayolları maliyet etkinliği ve
küresel erişim için SITA ya da ARINC ağlarını kullanıyor. 200'den fazla
ülke ve günde 25 milyon mesaj, yedekli yapılar üzerinden. Bir GDS
entegrasyonunda "mesaj gitmedi" hatası genellikle uygulamada değil bu
katmandadır; ve bu katman 1949'dan beri aynı kurumun elinde.

## Veri: tarifeyi ATPCO, planı OAG dağıtıyor, MCT ikisinin kesişimi

Uçuş planı sağlayıcıları zaman verisini dağıtıyor: OAG 1929'dan beri
uçuş planlarını yayınlıyor, Innovata 1998'de OAG'ye rakip olarak çıktı;
format Standart Uçuş Planı Kılavuzu (SSIM), bütün dünyaya bu formatla
dağıtılıyor. Ücret yayıncıları fiyat verisini dağıtıyor: ATPCO 1975'te
bağımsız şirket olarak kuruldu, bugün 400'den fazla havayolundan veri
toplayıp GDS'lere dağıtıyor; SITA da ücret yayıncısı. Yüzlerce
havayolunun verisi bu merkezlerde toplanıp GDS'lere ve CRS'lere
dağıtılıyor; küresel uçuş ağının senkron çalışması bu merkezi yönetime
bağlı.

![Başlık: Uçuş Verisi, Tarife ve Planların Dağıtımı. Solda takvim ve saat simgesi, schedules; sağda fiyat etiketi simgesi, fares; ikisi ortadaki data convergence kutusuna ok ile akıyor. Solda uçuş planı sağlayıcıları (zaman verisi): OAG 1929'dan beri uçuş planları yayınlar; Innovata 1998'de OAG'ye rakip olarak ortaya çıktı; format, Standart Uçuş Planı Kılavuzu (SSIM) kullanılarak tüm dünyaya dağıtılır. Sağda ücret yayıncıları (fiyat verisi): ATPCO 1975'te bağımsız bir şirket olarak kuruldu, bugün 400'den fazla havayolundan veri toplayıp GDS'lere dağıtır; istisna, havayolları özel (private) ücretleri ATPCO'yu atlayarak doğrudan GDS'lere iletebilir. Altta turuncu çerçeveli kritik kesişim metrikleri: tarife toplayıcıları aynı zamanda aktarma noktalarını ve MCT (minimum bağlantı süresi) verilerini dağıtır; MCT, IATA standartlarında havalimanı otoritelerince belirlenir.](/decks/industry-standards/06.webp "İki ok tek kutuda buluşuyor: uçuş var mı ve kaç para. GDS ekranındaki bir satır, bu iki bağımsız kaynağın birleşimi.")

İki iş kuralı bu slayttan çıkıyor. Özel ücretler: havayolu, kapalı
(private) ücretlerini ATPCO ya da SITA'ya göndermeden yönetebilir, çünkü
GDS'ler agregatörü atlayıp doğrudan ücret alma kabiliyetine sahip.
Havayolu özel ücreti doğrudan GDS'e tanımlayarak genel piyasadan gizli
tutuyor; önceki bölümdeki tam içerik maddesiyle birlikte okununca, "kime
göstereceğim" sorusunun mekanizması bu. Minimum bağlantı süresi (MCT):
genel standartları havalimanı otoriteleri IATA standartlarında belirliyor
ve tarife toplayıcıları aktarma noktalarıyla birlikte dağıtıyor. Ama
kaynak metnin dediği gibi havayolları standartlara istisna dosyalayabilir:
kendi operasyonel kapasitesine göre kendi bağlantı süresini tanımlar.
Bağlantı arayan algoritma önce istisnaya, sonra standarda bakmalı.

## Para: dört kurum, iki eksen

Finansal takas dört kurumun matrisi. Havayolundan havayoluna (interline)
eksende küresel kapsamda ICH (IATA Clearing House): 475'ten fazla üye
havayolu, yılda 50 milyar dolarlık interline işlemi takası. ABD
kapsamında ACH (Airline Clearing House): 91 ABD havayolu, ICH ile entegre
çalışarak 12 milyar dolarlık alacak takası. Acenteden havayoluna eksende
küresel BSP (Billing and Settlement Plan): IATA yetkili acenteleri,
GSA'lar ve yer hizmetleri; küresel çapta tek rapor, tek ödeme noktası.
ABD'de ARC (Airline Reporting Corporation): ABD, Porto Riko ve ABD Virgin
Adaları; ARC yetkili acenteler için bilet dağıtım ve mutabakat sistemi.

![Başlık: Finansal Takas ve Mutabakat Matrisi, Paranın Dolaşım Ağı. İki eksenli dört hücre; üst satır küresel kapsam, alt satır ABD kapsamı; sol sütun havayolundan havayoluna (interline), sağ sütun acenteden havayoluna (B2C/B2B). ICH (IATA Clearing House): kapsam 475'ten fazla üye havayolu; hacim yılda 50 milyar dolarlık interline işlemi takası. BSP (Billing and Settlement Plan): kapsam IATA yetkili acenteleri, GSA'lar ve yer hizmetleri; işlev küresel çapta tek rapor, tek ödeme noktası. ACH (Airline Clearing House): kapsam 91 ABD havayolu; hacim ICH ile entegre çalışarak 12 milyar dolarlık alacak takası. ARC (Airline Reporting Corporation): kapsam ABD, Porto Riko ve ABD Virgin Adaları; işlev ARC yetkili acenteler için bilet dağıtım ve mutabakat sistemi.](/decks/industry-standards/07.webp "Sol sütun havayolları arasında, sağ sütun acenteyle havayolu arasında. Bir bilet iki sütundan da geçebilir: acente parayı BSP'ye verir, havayolları payı ICH'de bölüşür.")

Interline sorusunun cevabı sol sütunda. Birden fazla havayolunun dahil
olduğu biletin geliri ICH ya da ABD merkezli ACH üzerinden paylaştırılır;
sistem interline faturalandırma kurallarını kullanarak her taşıyıcının
payını hesaplar ve yılda 50 milyar doları aşan hacimde otomatik takas
yapar. Sağ sütun ise önceki bölümdeki acente kanalının parasını
merkezileştiriyor: acente yüz havayoluna yüz ayrı ödeme yapmıyor, tek
rapor ve tek ödeme noktası var.

## Kayıtlı satıcı kim: parayı acente mi toplar, havayolu mu

Finansal mutabakat iki iş akışını destekliyor ve fark, kayıtlı satıcının
(merchant of record) kim olduğu. Senaryo A, acente satıcı: yolcu bilet
ücretini acenteye öder; acente parayı merkezi takas odalarına (BSP/ARC)
gönderir; BSP/ARC tutarı nihai havayoluna aktarır. Avantajı, acentenin
birden fazla havayolu için tek ödeme raporu hazırlaması. Senaryo B,
havayolu satıcı: yolcu bilet işlemini acentenin sistemi üzerinden başlatır;
sistem doğrudan havayolunun ödeme ağ geçidine bağlanır; ödeme takas
odalarını atlayarak doğrudan havayoluna geçer.

![Başlık: Ödeme İş Akışları, Kayıtlı Satıcı (Merchant of Record) Kim? Senaryo A, seyahat acentesinin satıcı olması, gri oklarla üç kutu: yolcu bilet ücretini seyahat acentesine öder; acente parayı merkezi takas odalarına (BSP/ARC) gönderir; BSP/ARC tutarı nihai havayoluna aktarır. Altında not: avantaj, acenteler birden fazla havayolu için tek bir ödeme raporu hazırlar. Senaryo B, havayolunun satıcı olması, turuncu oklarla üç kutu: yolcu bilet işlemini acentenin sistemi üzerinden başlatır; sistem doğrudan havayolunun ödeme ağ geçidine bağlanır; ödeme takas odalarını atlayarak doğrudan havayoluna geçer.](/decks/industry-standards/08.webp "İki senaryonun ilk kutusu aynı: yolcu acentede. Fark ikinci kutuda, paranın kimin hesabına ilk dokunduğunda. Kayıtlı satıcı, iadeyi ve riski de taşıyan taraf.")

Seçim mantığı: karar, kullanılan teknolojik altyapıya ve acente
anlaşmasına bağlı. Acente kayıtlı satıcıysa parayı kendisi toplar ve
BSP/ARC üzerinden havayoluna iletir; havayolu kayıtlı satıcıysa yolcu,
acentenin sistemindeki ödeme geçidi aracılığıyla doğrudan havayoluna
öder. Yazılımcı için ayrım şurada: senaryo A'da acentenin sistemi bir
tahsilat sistemi, senaryo B'de yalnızca bir yönlendirici. Finansal risk
ve mutabakat yükü, kayıtlı satıcı kimse ondadır.

## Uçtan uca: dört sütun tek makine

Bütün parçalar bir araya geldiğinde endüstri tek bir makine gibi
çalışıyor. Standartlar: IATA ve A4A, verinin okunabilmesi için oyunun
kurallarını (XML/NDC, EDIFACT) yazıyor. Veri sağlayıcıları: OAG (zaman)
ve ATPCO (fiyat), biletin varlığını ve değerini kanıtlıyor. İletişim:
SITA ve ARINC ağları, rezervasyon mesajlarını küresel ölçekte
milisaniyeler içinde iletiyor. Mutabakat: işlem tamamlandığında BSP ve
ARC (ya da ICH/ACH), paranın güvenle ilgili havayolunun kasasına
ulaşmasını garanti ediyor.

![Başlık: Ekosistem Özeti, Uçtan Uca Biletleme Anatomisi. Alt başlık: bütün parçalar bir araya geldiğinde endüstri tek bir devasa makine gibi çalışır. Dört simge turuncu çizgiyle soldan sağa bağlı: tokmak, veritabanı, kesişen oklar, kasa. Standartlar: IATA ve A4A, bu verilerin okunabilmesi için oyunun kurallarını (XML/NDC, EDIFACT) yazar. Veri sağlayıcıları: OAG (zaman) ve ATPCO (fiyat), biletin varlığını ve değerini kanıtlar. İletişim: SITA ve ARINC ağları, bu rezervasyon mesajlarını küresel ölçekte milisaniyeler içinde iletir. Mutabakat: işlem tamamlandığında BSP ve ARC (veya ICH/ACH), paranın güvenle ilgili havayolunun kasasına ulaşmasını garanti eder. Altta: bu birbirine bağlı altyapı, her yıl milyarlarca yolcunun kesintisiz seyahat etmesini sağlayan küresel havacılık dağıtımının görünmez mimarisidir.](/decks/industry-standards/09.webp "Turuncu çizgi soldan sağa tek yönlü: kural, veri, mesaj, para. Bir biletin ömrü bu sırayla ilerliyor ve her adımda kurum değişiyor.")

## Yarın işe yarayacak dört çıkarım

1. **Kanal stratejisini PCA'nın tam içerik maddesiyle birlikte tasarla.**
   Web sitesine özel kampanya GDS'ten saklanamaz. Gizli tutmak istediğin
   fiyatın yolu kampanya değil, ATPCO'yu atlayıp doğrudan GDS'e tanımlanan
   özel ücret; ikisinin mekanizması farklı.
2. **Kayıtlı satıcıyı ilk mimari karar olarak ver.** Acente mi havayolu
   mu sorusu, sistemin tahsilat mı yönlendirici mi olduğunu belirliyor;
   iade, risk ve mutabakat yükü onunla birlikte taşınıyor.
3. **Bağlantı hesaplarken önce istisnaya bak.** MCT standardını havalimanı
   otoritesi koyuyor ama havayolu istisna dosyalayabiliyor. Standardı
   uygulayıp istisnayı okumayan algoritma, havayolunun satmak istediği
   bağlantıyı reddeder.
4. **Kısaltmayı sütununa yerleştir.** AIRIMP ve PADIS kural, ATPCO ve OAG
   veri, SITA ve ARINC iletişim, BSP ve ICH para. Bir entegrasyon hatası
   bu dört sütundan yalnızca birine düşer; hangisine düştüğünü bilmek
   kimi arayacağını bilmek demek.

Bu bölümde ne yok: EDIFACT'ın neden hâlâ yerinde durduğu ("Sektör hâlâ
EDIFACT konuşuyor") ve NDC'nin GDS ile ilişkiyi nasıl yeniden kurmaya
çalıştığı ("NDC: dağıtımı kim kontrol ediyor"). Buradaki mesajlaşma
merdiveninin ilk ve son basamağı o iki bölümün konusu.
