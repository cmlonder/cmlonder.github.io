---
title: "Havacılıkta gelir yönetimi ve rekabet stratejileri: Sun Tzu prensipleriyle iş mantığı analizi"
domain: "aviation"
summary: "Gelir yönetimi yalnızca bir fiyat hesaplama aracı değil, pazar payını ve marjı aynı anda hedefleyen bir rekabet silahı. Bu bölüm Sun Tzu'nun Savaş Sanatı'ndaki ilkeleri havayolu iş kurallarına çeviriyor: misyon netliği, ne zaman savaşılacağı, rakibi ve kendini tanımak, kaynağın büyük ve küçük pazarlara dağıtılması ve uzman ekibin müdahalesiz karar yetkisi."
audience: "Gelir yönetimi ya da fiyatlandırma sistemi yazan, algoritmanın doğru çalıştığı halde neden kazandırmadığını merak eden yazılımcı ve ürün insanı. Önceki gelir yönetimi bölümlerinin okunmuş olması işe yarar; fiyat koridoru, yetki matrisi ve rekabet istihbaratı matrisi metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Önceki gelir yönetimi bölümleri mekanizmayı anlattı: kısıtlı indirim,
Littlewood kuralı, DINAMO, kalkış-varış bazlı kontrol. Bu bölüm bir adım
geri çekilip o mekanizmayı kimin, hangi amaçla ve hangi yetkiyle
çalıştırdığına bakıyor. Kaynak metin bunu alışılmadık bir çerçeveyle
yapıyor: gelir yönetimi uygulayıcılarını, rekabet ve zorluklar karşısında
marjları iyileştirmeye çalışan modern zaman savaşçıları olarak tanımlıyor
ve Sun Tzu'nun Savaş Sanatı'nı iş mantığına tercüme ediyor. **Gelir
yönetimi teknik hesaplamayla kazanmıyor; net bir stratejik yön, her
kademede anlaşılan bir misyon ve hem rakibin hem kurumun kendi
yetkinliğinin derin analiziyle kazanıyor.** Algoritma bu üçünün icra
aracı, yerine geçen şeyi değil.

![Sunumun kapak slaytı. Beyaz, ızgaralı bir zeminde soldan yükselen gümüş renkli bir uçak kanadı izi, ortada lacivert zikzaklı bir yükseliş okuna dönüşüyor ve sağ üstte bir nişangâhın merkezine varıyor. Başlık: Gelir Yönetimi Sanatı. Alt başlık: Havacılıkta Rekabet, Fiyatlandırma ve Stratejik Üstünlük.](/decks/revenue-management-sun-tzu/01.webp "Ok düz yükselmiyor, iki kez kırılıyor. Hedefe giden yol rakibin hamlelerine verilen cevaplardan oluşuyor.")

## Gelir yönetimi fiyat aracı değil, iki hedefli bir saldırı planı

Kaynak metnin ilk iddiası tanımla ilgili. Gelir yönetimi sadece bir
fiyatlandırma aracı olarak görülürse, amacı tek bir uçuşun gelirini
maksimize etmekle sınırlı kalıyor. Metin ise onu pazar payını artırmak ve
aynı anda kârlılığı, yani marjı iyileştirmek için kullanılan stratejik bir
saldırı planı olarak konumluyor. Metnin ifadesiyle bu disiplin, savaşın
sıcaklığında rakipleri alt etmek için kullanılıyor.

İki hedef aynı yöne çekmiyor. Pazar payı kazanmak çoğu zaman fiyatı
aşağı çekmek demek; marjı korumak ise fiyatı tutmak. Sunum bunu üç
görevle somutlaştırıyor: zorluklara ve maliyet baskılarına rağmen uçuş
bazlı geliri maksimize ederek kâr marjını korumak, rekabetin yoğun olduğu
rotalarda yolcu trafiğini rakiplerden almak ve pazar dinamiklerine önleyici
ve düzeltici aksiyonlarla anında yanıt vermek. Üçüncüsü ilk ikisi
arasındaki gerilimi yöneten şey: hangi rotada hangi hedefin ağır basacağı
sabit bir ayar değil, pazarın o anki durumuna göre verilen bir karar.

![Başlık: Modern Zaman Savaşçıları, Gelir Yöneticileri. Solda bir radar ya da pusula kadranı: dikey ekseni Pazar Payı, yatay ekseni Kâr Marjı olarak etiketlenmiş, iç içe halkalar ve dış çemberde derece işaretleri var; sağ üst çeyrekte, iki eksenin arasında bir mavi nokta duruyor. Kadranın altında: Tek Odak, Rekabeti Aşmak. Sağda üç kutu. Kâr Marjını Korumak: zorluklara ve maliyet baskılarına rağmen uçuş bazlı geliri maksimize etmek. Pazar Payı Kazanmak: rekabetin yoğun olduğu rotalarda yolcu trafiğini rakiplerden almak. Taktiksel Çeviklik: pazar dinamiklerine anında önleyici ve düzeltici aksiyonlarla yanıt vermek.](/decks/revenue-management-sun-tzu/02.webp "Nokta iki eksenden birinin üstünde değil, arasında duruyor. Gelir yöneticisinin işi o noktayı rota rota yeniden konumlamak.")

Yazılım tarafında bunun karşılığı şu: optimizasyon motorunun amaç
fonksiyonu tek boyutlu değil. Sistem yalnızca beklenen geliri
maksimize edecek şekilde kurulursa, pazar payı hedefi hiçbir yerde
temsil edilmiyor ve o hedefi taşıyan karar sistemin dışında, elle
alınıyor. Hangi hedefin hangi pazarda öncelikli olduğu sisteme bir girdi
olarak verilmeli.

## Amacı karışık olan rakibine cevap veremez

Sun Tzu'dan aktarılan ilk alıntı liderlikle ilgili: amacında kafası
karışık olan biri, düşmanına yanıt veremez. Kaynak metin bunun iş
mantığındaki karşılığını açık kuruyor: stratejik yön net değilse, piyasa
değişimlerine ve rakip hamlelerine karşı proaktif aksiyon alınamıyor.
Liderlik burada insanları ve süreçleri mükemmelliğe taşımak olarak
tanımlanıyor, ve bunun ön koşulu yönün tek olması.

İkinci şart yönün aşağıya kadar inmesi. Sun Tzu'nun öğretisine göre bir
işletmenin misyonu organizasyonun en alt kademesinden en üst kademesine
kadar net anlaşılmadıkça rakiplere karşı zafer imkânsız. Havayolunda bu
zincir somut: üst yönetim bir strateji belirliyor, bir analist bir
pazarın fiyat seviyesini değiştiriyor, bir algoritma bir rezervasyon
sınıfını kapatıyor. Üçü aynı amaca hizmet etmiyorsa her biri kendi
başına doğru karar verip toplamda yanlış sonuç üretebiliyor.

![Başlık: Kusursuz Uyum ve Liderlik. Ortada birbirine geçmiş, dikey dizilmiş üç lacivert dişli çark. Sağ üstte mavi kutuda alıntı: Amacı karmaşık olan biri, düşmanına yanıt veremez (Sun Tzu). Çarkların yanında üç açıklama. Liderlik (Strateji): fiyatlandırma ve getiri stratejisini net bir şekilde belirler ve yön çizer. İletişim (Aktarım): kurumsal misyon, organizasyonun tüm kademelerine eksiksiz ve şeffaf bir şekilde aktarılır. İnsan ve Süreç (İcra): tüm ekipler ve algoritmalar, rekabetçi mükemmellik için aynı hedef doğrultusunda hizalanır. Altta bant: kurumsal hedef en alt kademeye kadar anlaşılamazsa, rakibi yenmek imkânsızdır.](/decks/revenue-management-sun-tzu/03.webp "En alttaki çarkta ekiplerle algoritmalar yan yana yazılmış. Misyonun ulaşması gereken en alt kademe bazen bir insan değil, bir parametre.")

Stratejinin nasıl aktarılacağı sorusuna brifingin önerdiği iş kuralı
şu: strateji yalnızca rakamlarla değil, pazar payı önceliği ya da marj
koruma önceliği gibi net direktiflerle ve tüm organizasyonun aynı dili
konuşmasını sağlayacak eğitim ve iletişim kanallarıyla aktarılmalı. Bir
hedef gelir rakamı analiste ne yapacağını söylemiyor; bu pazarda marjı
koru demek söylüyor.

Aynı mantık tek tek kararların denetimine de uzanıyor. Bir kampanya ya da
fiyat değişikliği kararı alınırken kurumun ana misyonuyla çelişip
çelişmediği sorulmalı. Brifing burada bir kontrol mekanizması öneriyor:
her aksiyonun uzun vadeli kârlılık ve rekabetçi konumlandırma üzerindeki
etkisi ölçülmeli, misyona uymayan kısa vadeli kazançlar reddedilmeli.
Yazılım tarafında bu, fiyat değişikliği iş akışında bir onay adımı değil,
bir doğrulama kuralı: değişiklik, o pazar için tanımlı öncelikle
karşılaştırılıyor ve çelişiyorsa gerekçe istiyor.

## Zaferin beş unsuru, beş iş kuralı

Sun Tzu zaferi öngörmek için beş unsur sayıyor ve sunum bunları
havacılığa uyarlıyor. Zamanlama: ne zaman rekabet edileceğini ve ne zaman
geri çekileceğini bilmek. Kaynak tahsisi: büyük ve küçük kapasiteleri,
yani filo ve koltuğu, doğru pazarlara yönlendirmek. Ortak amaç: üst
yönetim stratejisiyle operasyonel ekiplerin aynı hedefte birleşmesi.
Hazırlık: talep dalgalanmalarına tam donanımlı olup hazırlıksız rakibi
beklemek. Bağımsız karar: operasyonel müdahalelerden arındırılmış, yetkin
bir karar mekanizması.

![Başlık: Zaferin 5 Temel Unsuru (Havacılık Uyarlaması). Yan yana beş dikey kart, her birinin üstünde bir simge. Zamanlama (saat): ne zaman rekabet edileceğini ve ne zaman geri çekileceğini bilmek. Kaynak Tahsisi (terazi): büyük ve küçük kapasiteleri (filo ve koltuk) doğru pazarlara yönlendirmek. Ortak Amaç (birbirine bağlı düğümler): üst yönetim stratejisi ile operasyonel ekiplerin aynı hedefte birleşmesi. Hazırlık (kalkan): talep dalgalanmalarına tam donanımlı olup hazırlıksız rakibi beklemek. Bağımsız Karar (zincir halkası): operasyonel müdahalelerden arındırılmış, yetkin bir karar mekanizması.](/decks/revenue-management-sun-tzu/04.webp "Beş kartın üçü bir karar kuralına, ikisi bir organizasyon kuralına karşılık geliyor. Sistemin çözebildiği kısım ilk üçü.")

Ortak amaç önceki başlığın konusuydu. Kalan dördü ayrı ayrı bir karar
noktasına dönüşüyor.

### Ne zaman savaşılacağını bilmek bir karşılaştırma işi

Metnin alıntısıyla, bir uygulayıcı ne zaman savaşacağını ve ne zaman
savaşmayacağını bilmeli. İş mantığındaki karşılığı hangi pazarlarda fiyat
savaşına girileceği, hangi durumlarda geri çekilip marjın korunacağı
kararı. Brifing bu kararın hangi algoritmaya dayanacağını da tarif
ediyor: algoritma, rakibin hamlesinin kalıcı bir pazar payı kaybına yol
açıp açmayacağını ve olası bir fiyat savaşının marjlar üzerindeki tahrip
edici etkisini kıyaslamalı, sonuca göre proaktif ya da savunmacı bir
aksiyon önermeli.

Burada iki tahmin karşılaştırılıyor, ikisi de belirsiz. Pazar payı kaybı
geçici mi kalıcı mı, fiyat savaşı ne kadar sürer ve marjı ne kadar
aşındırır. Önceki bölümlerdeki sınırlı eşleşme ilkesi, yani rakip fiyatı
kırdığında bütün koltuklarla değil kısıtlı bir miktarla cevap vermek, bu
karşılaştırmanın ara bir cevabıydı: tamamen savaşmak da tamamen çekilmek
de değil.

### Büyük ve küçük kuvvetler aynı kuralla yönetilmez

Sun Tzu'nun büyük ve küçük kuvvetlerin istihdamı ilkesi havayolunda
kapasitenin pazarlar arasında dağıtılması sorusuna karşılık geliyor.
Brifingin önerisi bir denge kuralı: sistem toplam kârlılığı maksimize
etmek için yüksek marjlı küçük pazarları ihmal etmeden, ana gövde
pazarlarda dominant pozisyonu koruyacak şekilde kapasite dağıtmalı.

Tehlike iki yönlü. Yalnızca büyük pazara bakan bir tahsis küçük ama
kârlı pazarları sessizce aç bırakıyor; yalnızca marja bakan bir tahsis
ise ana pazardaki pozisyonu rakibe bırakıyor. Yazılım tarafında bu,
tahsis modelinde pazarların tek bir sıralama ölçütüyle dizilmemesi
demek. Hacim ve marj ayrı ayrı temsil edilmeli, yoksa model hangisini
seçerse diğerini görünmez yapıyor.

### Hazırlık tahmin kalitesinin başka bir adı

Hazırlık unsuru talep dalgalanmalarına tam donanımlı olmak ve
hazırlıksız rakibi beklemek. Gelir yönetiminde donanım talep tahmini ve
envanter kontrolü demek: dalgalanma geldiğinde fiyat ve kapasite
cevabının önceden hazır olması. Rakip aynı dalgalanmaya ancak geldikten
sonra tepki veriyorsa, aradaki fark hazırlığın kendisi.

### Bağımsız karar, sınırı önceden çizilmiş yetki demek

Beş unsurun sonuncusu için metnin alıntısı şu: kendi generali yetenekli
olan ve hükümdar tarafından müdahale edilmeyen kazanır. İş mantığındaki
karşılığı gelir yönetimi ekiplerinin üst yönetim tarafından mikro yönetime
maruz kalmadan karar verebilmesi.

Bağımsızlık sınırsız yetki anlamına gelmiyor. Brifing operasyonel bir
kriz anı için somut bir yapı öneriyor: önceden tanımlanmış acil durum
fiyat koridorları ve yetki matrisleri. Fiyat koridoru, bir analistin ya
da sistemin onay beklemeden hareket edebileceği alt ve üst fiyat
sınırları; yetki matrisi ise hangi kararın hangi rolde, hangi büyüklüğe
kadar alınabileceğini gösteren tablo. Bu ikisi tanımlıysa lider kritik
anda üst onay beklemeden rekabetçi hamle yapabiliyor, çünkü hükümdarın
müdahalesi olayın içinde değil, önceden, sınırın çizildiği anda
gerçekleşmiş oluyor. Yazılım tarafında bunun karşılığı, fiyat koridorunun
bir dokümanda değil sistemde bir kural olarak durması: koridor içindeki
değişiklik doğrudan uygulanıyor, dışındaki onaya düşüyor.

## Rakibi tanımak yetmez, kendi envanterini de tanımalısın

Sun Tzu'nun belki en bilinen ilkesi zaferin anahtarını iki bilgiye
bağlıyor: düşmanı tanımak ve kendini tanımak. Kaynak metin sonucu da
açık söylüyor: kendi kapasitesini bilip rakibini analiz etmeyen ya da
ikisinden de habersiz olan organizasyonların başarısızlığı kaçınılmaz.

Sunum bu iki bilgiyi bir matrisin iki ekseni yapıyor. Dikey eksen kendini
tanıma, yani iç veri ve kapasite hâkimiyeti; yatay eksen rakibi tanıma,
yani pazar ve rekabet istihbaratı. Dört çeyrek dört farklı havayolu
tarif ediyor. İkisinde de zayıf olan rastgele fiyatlandırıyor ve kesin
yeniliyor. Yalnızca iç veride güçlü olan pazar dinamiklerine kör kalıyor,
fırsatları kaçırıyor, ancak zaman zaman kazanıyor. Yalnızca rakibi iyi
analiz eden, kendi envanter kontrolü zayıf olduğu için reaktif kalıyor.
İkisinde de güçlü olan ise kusursuz talep tahmini ve dinamik
fiyatlandırma üstünlüğüyle stratejik hâkimiyet kuruyor.

![Başlık: Rekabet İstihbaratı Matrisi. İki eksenli dört çeyrekli bir matris. Dikey eksen: Kendini Tanıma (İç Veri ve Kapasite Hakimiyeti). Yatay eksen: Rakibi Tanıma (Pazar ve Rekabet İstihbaratı). Sol üst, Zaman Zaman Zafer: iç veriler ve kapasite güçlü, ancak pazar dinamiklerine karşı körlük var, fırsatlar kaçırılır. Sağ üst, vurgulu, Yüz Savaşta Güvenlik: stratejik hakimiyet, kusursuz talep tahmini ve dinamik fiyatlandırma üstünlüğü. Sol alt, Kesin Yenilgi: ne pazar dinamikleri ne de kendi ağ kapasitesi biliniyor, rastgele fiyatlandırma. Sağ alt, Taktiksel Yanılgı: rakip iyi analiz ediliyor ancak kendi envanter kontrolü zayıf, reaktif kalınır.](/decks/revenue-management-sun-tzu/05.webp "Sağ alt çeyrek en tehlikelisi olabilir: rakibi izleyen ama kendi envanterini kontrol edemeyen havayolu her hamleye cevap verir, hiçbirini seçmez.")

Kendini tanıma sisteme ne demek? Brifingin cevabı iki parçalı: mevcut
kapasitenin, yani uçak tipinin ve koltuk sayısının, en yüksek verimi
getirecek şekilde segmente edilmesi ve geçmiş verilerdeki başarı ve
başarısızlık oranlarının gerçek zamanlı kararlara dahil edilmesi. İkinci
parça çoğu zaman eksik kalıyor. Bir sistem rakip fiyatlarını her gün
tarıyor ama kendi geçmiş kararlarının sonucunu, yani hangi fiyat
hamlesinin gerçekten gelir getirdiğini, bir sonraki karara geri
beslemiyorsa matrisin sağ alt çeyreğinde duruyor.

Rakibi tanıma tarafında brifingin uyarısı veri toplamanın yetmediği.
Rakip analizi ve öz analiz kapasitesi yalnızca veri toplama olarak değil,
o veriyi anlamlı bir stratejiye dönüştürecek araçlarla güçlendirilmeli.
Yazılım tarafında bunun karşılığı tanıdık: rakip fiyat verisini depolayan
bir tablo istihbarat değil; o veriyi bir karar önerisine bağlayan kural
ya da model istihbarat.

## Havayolunda doğan disiplin başka sektörlerin standardı oldu

Kaynak metin yield management kavramını havacılık terminolojisine
kazandıran kişi olarak Bob Crandall'ı anıyor. Crandall'ın American
Airlines'taki rolü önceki bölümlerde anlatıldı; burada vurgulanan,
kavramın havacılıkla sınırlı kalmadığı. Metne göre bu disiplin bugün
otelcilik, perakende ve yüksek teknoloji üretimi gibi pek çok sektörde
rekabet avantajı sağlamanın temel taşı.

Sunum yayılmayı dalgalar halinde çiziyor. Merkezde havacılık ve
Crandall; ikinci dalgada oteller, araç kiralama, kruvaziyer ve
demiryolu; dış dalgada ileri teknoloji üretimi, tüketici elektroniği ve
perakende. Sunumun kapanış cümlesine göre havacılığın hayatta kalma
stratejisi olarak başlayan yaklaşım, bugün akademik ve endüstriyel
inovasyonu tetikleyen küresel bir iş standardına dönüşmüş.

![Başlık: Havacılıktan Doğan Küresel Bir Standart. Merkezde bir nokta ve yanında uçak simgesi; noktaya bir ok uzanıyor, etiketi: Bob Crandall (American Airlines), Yield Management kavramının doğuşu. Merkezden dışa iç içe halkalar. İkinci Dalga (Seyahat ve Konaklama), yatak ve tren simgeleriyle: oteller, araç kiralama, kruvaziyer ve demiryolu ağlarına entegrasyon. Dış halkada iki kez tekrarlanan Üçüncü Dalga (Küresel Ticaret), çip ve alışveriş çantası simgeleriyle: ileri teknoloji üretimi, tüketici elektroniği ve perakende sektörlerinde benimsenme. Altta lacivert bant: havacılığın hayatta kalma stratejisi olarak başlayan bu yaklaşım, günümüzde akademik ve endüstriyel inovasyonu tetikleyen küresel bir iş standardına dönüşmüştür.](/decks/revenue-management-sun-tzu/06.webp "İkinci dalgadaki sektörlerin ortak noktası havayoluyla aynı: tarihi geçince değeri sıfırlanan bir envanter satıyorlar.")

Bunun havayolu yazılımcısı için pratik anlamı şu: gelir yönetimi
problemlerinin çoğu havacılığa özgü değil. Aynı envanter kontrolü ve
segmentasyon sorusu otel odasında, kiralık araçta ve kruvaziyer
kabininde de soruluyor; havacılıkta geliştirilen prensipler, brifingin
hatırlattığı gibi, perakende ya da üretim gibi dikey sektörlerdeki
kârlılık sorunlarına da uygulanabiliyor. Tersine de işliyor: o
sektörlerde olgunlaşan bir çözüm havayolu problemine uyarlanabilir.

## Yarın işe yarayacak dört çıkarım

1. **Stratejiyi rakamla değil öncelikle aktar.** Her pazar için pazar
   payı önceliği mi marj koruma önceliği mi olduğunu açıkça yaz ve bunu
   hem analistin hem sistemin görebileceği bir yerde tut. Üst ve alt
   kademelerin aynı amaca sahip olması, bütün departmanların bu
   öncelikle senkronize edilmesiyle mümkün.
2. **İstihbaratı karara bağla.** Rakip verisi toplamak ve kendi geçmiş
   performansını saklamak yetmiyor; ikisini bir karar önerisine
   dönüştüren araçlara yatırım yap. Kendi fiyat hamlelerinin sonucunu
   bir sonraki karara geri besle.
3. **Özerkliği sınırla tanımla.** Stratejik yön netleştiğinde uygulamada
   uzman ekiplere hareket alanı bırak, bürokratik engelleri azalt. Bunu
   önceden tanımlanmış fiyat koridorları ve yetki matrisleriyle yap ki
   kriz anında kimse onay beklemesin.
4. **Çözümü sektör dışında da ara.** Yield management prensipleri
   havacılıktan otelciliğe, perakendeye ve üretime taşındı. Bir gelir
   problemi havayoluna özgü görünüyorsa, önce aynı bozulabilir envanter
   sorusunu çözmüş bir sektöre bak.

Bu bölümde ne yok: kısıtlı indirimin ve Littlewood kuralının mekanizması
("Yield Management: erken dönem stratejik analiz ve iş mantığı"),
Crandall'ın American Airlines'ta kurduğu ağ, maliyet ve sadakat düzeni
("Gelir yönetimi ve stratejik operasyonlar: PEOPLExpress ve American
Airlines analizi"). Bu bölüm o mekanizmanın hangi amaçla ve kimin
yetkisiyle çalıştırıldığını anlatmak için var.
