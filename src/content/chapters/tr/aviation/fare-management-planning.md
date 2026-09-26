---
title: "Havacılıkta ücret yönetimi ve planlama stratejileri"
domain: "aviation"
summary: "Bir ücret aksiyonu iki veri setinin kesişiminde doğar: rekabet manzarası ve pazar profili. Bu bölüm rakibin hangi hamlesine nasıl karşılık verileceğini, fiyat esnekliğinin bir indirimi ne zaman gelire ne zaman kayba çevirdiğini ve RASK hedefinin hacimle getiri arasında nasıl bölündüğünü anlatıyor."
audience: "Fiyatlandırma, ücret dosyalama ya da teklif yönetimi sistemleri üzerinde çalışan, bir fiyat kararının arkasındaki iş kurallarını modellemek isteyen yazılımcı ve ürün insanı. Gelir yönetimi ve pazarlama planlama bölümlerinin okunmuş olması işe yarar; RASK, yield, sell-up, fiyat esnekliği ve traffic mix metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Pazarlama planlama bölümü fiyatlandırmayı planlama döngüsünün bir sütunu
olarak gösterip geçmişti: rakiplere ve pazar koşullarına göre ücret
oluşturmak. Bu bölüm o sütunun içine giriyor ve tek bir ücret aksiyonunun
nasıl karar verildiğine bakıyor. **Bir ücret kararı rakibin fiyatına
bakılarak değil, rekabet manzarası ile pazar profili birlikte okunarak
verilir; ikisinden biri eksikse karar kör kalır.** Rakibin ne yaptığını
bilip pazarın fiyata nasıl tepki verdiğini bilmeyen havayolu yanlış yere
indirim yapar. Pazarı bilip rakibi izlemeyen havayolu da payını fark
etmeden kaybeder.

![Sunumun kapak slaytı. Arka planda dünya haritası ve kıtalar arasında yoğun uçuş hatları; Kuzey Amerika, Avrupa ve Doğu Asya'da hatlar düğümleniyor. Başlık: Ücret Yönetimi ve Fiyatlandırma Stratejisi. Alt başlık: Rekabet Analizinden Taktiksel Fiyatlandırmaya. Etiket: Havacılık Sektörü Analiz Çerçevesi. Alttaki sistem içgörüsü kutusu: havacılıkta fiyatlandırma (ücret ve kuralların ATPCO üzerinden dosyalanması) ile gelir yönetimi (bu ücretten kaç koltuk satılacağının RBD'ler aracılığıyla belirlenmesi) birbirine sıkı sıkıya bağlı ama farklı disiplinlerdir; belge bir fiyat aksiyonunun teklif yönetimi akışındaki yerini inceler.](/decks/fare-management-planning/01.webp "Alttaki kutudaki ayrım bölümün geri kalanının anahtarı: fiyatlandırma hangi ücretin var olacağını, gelir yönetimi o ücretten kaç koltuğun açık kalacağını belirliyor.")

İki disiplinin ayrımı yazılım tarafında da bir sınır çiziyor. Ücret ve
kurallar ATPCO üzerinden dosyalanıyor; o ücretten kaç koltuk satılacağı
ise gelir yönetiminin rezervasyon sınıfları (RBD) üzerinden verdiği karar.
Fiyatlandırma motoru ile envanter motoru aynı teklifi üretiyor ama farklı
soruları cevaplıyor. Bu bölüm birincisinin karar mantığıyla ilgili;
ikincisi yalnızca iki yerde, talep yönetiminde ve pazar payını korurken,
sahneye giriyor.

![Başlık: Bir Ücret Aksiyonunun İki Boyutu. Alt başlık: havacılıkta başarılı bir fiyatlandırma kararı iki temel veri setinin kusursuz analizini gerektirir, biri olmadan diğeri eksik kalır. Solda turuncu şeritli Rekabet Manzarası kutusu, radar simgesiyle: rakiplerin hamleleri, pazar payları ve sundukları hizmetin kalitesi. Sağda mavi şeritli Pazar Profili kutusu, dilimli pasta grafiği simgesiyle: pazarın büyüklüğü, müşteri segmentleri ve fiyat değişimlerine verilen tepki. Ortada iki yöne bakan oklu bir terazi. Sistem içgörüsü: modern bir teklif yönetim sisteminde (OMS) fiyatlandırma motorunun temel girdileri bunlardır; rekabet verisi genellikle ATPCO saatlik akışlarından ve GDS'lerden gelen MIDT verisinden, pazar profili ise geçmiş PNR verisi ve kısıtsız talep tahminlerinden türetilir.](/decks/fare-management-planning/02.webp "Alttaki kutu iki boyutun iki ayrı veri boru hattından beslendiğini söylüyor: biri dışarıdan saatlik akışla, diğeri içeriden geçmiş rezervasyonlarla.")

## Rakibin fiyatı değil, rakibin paketi karşılanır

Bir rakip fiyat değiştirdiğinde ilk refleks rakamı karşılaştırmak. Brifing
bunun yetmediğini söylüyor: karar mantığı yalnızca rakibin baz ücretine
değil, o ücretin kurallarına ve kısıtlamalarına, seyahat ve biletleme
tarihlerine ve ücretin hangi kanallardan dağıtıldığına bakmalı. Sistem bu
değişkenlerin tamamını analiz edip benzer bir değer paketi sunup
sunmayacağına karar veriyor.

Bunun somut anlamı şu. Rakibin daha ucuz görünen ücreti iade
edilemez, yalnızca belirli günlerde geçerli ve yalnızca kendi web
sitesinde satılıyor olabilir. O ücreti rakamıyla eşleştiren havayolu, daha
geniş haklarla ve daha çok kanalda aynı fiyatı vermiş olur; yani rakibin
sunduğundan daha değerli bir ürünü daha ucuza satar. Karşılanan şey fiyat
değil, fiyatla kuralların birlikte oluşturduğu paket olmalı.

Slaytın içgörü kutusu bu kuralların teknik karşılığını da veriyor: yolcunun
ücrete hak kazanıp kazanmadığını belirleyen ATPCO kategori kuralları,
örneğin cezaları taşıyan Cat 16 ve birleştirilebilirliği taşıyan Cat 10.
Kanal tarafında geleneksel EDIFACT GDS ile NDC API'leri ayrışıyor. Yazılım
tarafında bunun karşılığı, rakip ücret verisinin tek bir fiyat alanı
olarak saklanamayacağı: karşılaştırma yapan bir motorun kural
kategorilerini ve dağıtım kanalını da aynı kayıtta taşıması gerekiyor,
yoksa elmayla armudu kıyaslıyor.

![Başlık: Boyut 1, Rekabet Manzarasını Anlamak. Üç sütun, her birinin üstünde turuncu bir simge şeridi. 1. Rekabet Ortamı: sadece rakibin fiyatı değil, kural ve kısıtlamaları; seyahat ve biletleme tarihleri; fiyatların hangi kanallardan dağıtıldığı. 2. Pazar Pozisyonu: rakibin o pazardaki varlığı ve pazar payı; tüketici tercih oranları; çıkış noktasındaki toplam kapasite (lift). 3. Hizmet Kalitesi: uçuş programı kıyaslaması (schedule); havalimanı ve uçak içi hizmet farkları; tarihsel doluluk oranları (load factor). Sistem içgörüsü: kural ve kısıtlamalar ATPCO kategori kurallarıdır (örneğin Cat 16 cezalar, Cat 10 birleştirilebilirlik); kanallar geleneksel EDIFACT GDS ve NDC API'leridir; kapasite (lift) OAG ve Cirium verileri üzerinden analiz edilir; havayolları programlarını rakiplerine karşı değerlendirmek ve adil pazar payını tahmin etmek için QSI (Hizmet Kalitesi Endeksi) modellerini kullanır.](/decks/fare-management-planning/03.webp "Üç sütun üç ayrı soru: rakip ne sunuyor, rakip bu pazarda ne kadar güçlü, biz ona göre ne kadar iyiyiz. Fiyat yalnızca ilk sütunun ilk satırı.")

## Her rakip aynı tepkiyi hak etmiyor

Rekabet manzarasının ikinci sütunu, tepkinin kime verildiğiyle ilgili.
Brifing burada açık bir iş kuralı koyuyor: pazar payı yüksek bir rakiple
düşük bir rakibe aynı tepki verilmemeli. Pazar payı zayıf bir rakibe karşı
agresif fiyat tepkisi gereksiz olabilir; hakim bir oyuncunun hamlelerine
ise pazar payını korumak için hızla yanıt verilmeli. Rakibin o pazardaki
varlığı, tüketici tercih oranları ve çıkış noktasındaki toplam kapasite
(lift) bu kararın girdileri.

Bu, otomatik fiyat eşleştirmenin en sık atlanan boyutu. Her rakip hamlesine
aynı kuralla cevap veren bir sistem, pazarda neredeyse hiç payı olmayan bir
oyuncunun deneme amaçlı indirimini takip ederek kendi getirisini boşuna
düşürür. Tepki kuralının rakip kimliğine ve o rakibin o pazardaki ağırlığına
göre parametrelenmesi gerekiyor.

Üçüncü sütun aynaya bakmak: havayolunun kendi uçuş sıklığı, havaalanı
hizmetleri ve uçak içi servis kalitesi rakiple kıyaslanıyor. Programı ve
hizmeti rakipten zayıf olan havayolu aynı fiyattan aynı payı alamaz. Slayt
bu kıyaslamanın matematiksel aracını da adlandırıyor: havayolları
programlarını rakiplerine karşı değerlendirmek ve adil pazar paylarını
tahmin etmek için QSI (Hizmet Kalitesi Endeksi) modellerini kullanıyor.
Brifing buna bir tetikleyici ekliyor: tarihsel doluluk oranı (load factor)
sistem ortalamasının altındaysa, bu durum fiyat indirimine gitmek için bir
karar kriteri olarak kullanılabilir. Yani indirim kararı yalnızca dışarıdan,
rakipten gelmiyor; havayolunun kendi performans verisi de onu
tetikleyebiliyor.

## Pazarın büyüklüğü ve yolcu karması kuralları belirliyor

İkinci boyut pazarın kendisi. Brifing onu üç adımda okuyor: yoğunluk,
segmentler ve stimülasyon.

Yoğunluk pazarın ölçeği: küçük, orta ya da büyük. Pazarın büyüklüğü, çevre
şehirlerden çekilebilecek potansiyel talebi belirliyor. Büyük pazarlarda
daha fazla segmentasyon yapılabiliyor; küçük pazarlarda ise talep toplamaya
odaklı, daha sabit bir yapı izleniyor. Slaytın içgörü kutusu yoğunluğun
nasıl ölçüldüğünü de söylüyor: yalnızca bacak bazlı uçuşlardan değil, O&D
(kalkış-varış) trafik akışları ve yakın havalimanlarının etki alanı
(catchment area) analizleriyle.

Segmentler iş ve tatil yolcusunun karışımı. İş segmentinin yoğun olduğu
pazarlarda fiyata duyarlılık az olduğu için getiriyi (yield, yolcu başına
elde edilen birim gelir) artıracak kurallar öne çıkıyor: esneklik, son
dakika iptal hakkı gibi. Tatil segmentinde ise hacim yaratmak için daha
kısıtlayıcı ama ucuz baz ücretler sunuluyor. Aynı rotada iki farklı ürün
mantığı, çünkü iki farklı yolcu var. Slayt bu karışımın gelir yönetimine
de taşındığını not ediyor: kurumsal ve tatilci karması, RM sistemindeki
rezervasyon eğrilerini (booking curves) doğrudan etkiliyor.

![Başlık: Boyut 2, Pazar Profilini Çözümlemek. Soldan sağa, mavi oklarla bağlı üç kutu. Pazar Yoğunluğu (Density): pazarın ölçeği (küçük, orta, büyük) ve yakın şehirlerden gelebilecek potansiyel talebin cazibesi. Pazar Segmentleri (Segments): kurumsal (business) ve tatil (leisure) amaçlı yolcu dağılımı, müşteri tipolojisinin analizi. Pazar Stimülasyonu (Stimulation): fiyat indirimleri talebi canlandırabilir mi, bu canlanma uzun vadede sürdürülebilir mi, yoksa pazar fiyat değişimlerine duyarsız mı. Sistem içgörüsü: yoğunluk bacak bazlı uçuşlardan ziyade O&D trafik akışları ve catchment area analizleriyle değerlendirilir; kurumsal ve tatilci karması RM rezervasyon eğrilerini doğrudan etkiler; RM sistemlerindeki stimülasyon modelleri yalnızca fiyat düştüğü için uçmayı seçen yolcuları, yani uyarılmış talebi (induced demand) hesaplar.](/decks/fare-management-planning/04.webp "Oklar soldan sağa gidiyor ama son kutu bir soru: ilk iki adım pazarı tanımlıyor, üçüncüsü o tanımın indirime izin verip vermediğini soruyor.")

## İndirim ancak esnek pazarda gelir getirir

Stimülasyon adımı brifingin en keskin sorusunu soruyor. Bir fiyat indirimi
kararı verilmeden önce iki şey sorgulanmalı: fiyat indirimi talebi
canlandırabilir mi, ve bu canlanma uzun vadede sürdürülebilir mi? Pazar
fiyata duyarsızsa (inelastic) indirimden kaçınılmalı.

Bu sorunun cevabı fiyat esnekliğinde (ε) yatıyor: fiyattaki yüzde
değişimin talepte kaç yüzdelik değişim yarattığı. Esnekliğin mutlak değeri
toplam gelirin fiyat değişimine nasıl tepki vereceğini belirliyor ve ilişki
beş durumda özetlenebiliyor. Tamamen esneksiz (|ε| = 0) ve esneksiz
(0 < |ε| < 1) pazarlarda fiyat artarsa gelir artar, düşerse azalır. Birim
esnek (|ε| = 1) pazarda fiyat hangi yöne giderse gitsin gelir değişmez.
Esnek (|ε| > 1) ve tamamen esnek (|ε| = ∞) pazarlarda tersi geçerli: fiyat
artarsa gelir düşer, fiyat düşerse gelir artar.

![Başlık: Fiyat Esnekliği ve Toplam Gelir İlişkisi. Alt başlık: pazar stimülasyonunun kalbi, fiyat değiştiğinde toplam gelir matematiksel olarak nasıl tepki verir. Dört sütunlu koyu bir tablo: esneklik tipi, ε değeri, fiyat artarsa gelir, fiyat düşerse gelir. Tamamen esneksiz (|ε| = 0): artar, düşer. Esneksiz (|ε| < 1): artar, düşer. Birim esnek (|ε| = 1): değişmez, değişmez; bu satır açık renkle vurgulanmış. Esnek (|ε| > 1): düşer, artar. Tamamen esnek (|ε| = ∞): düşer, artar. Artışlar yeşil yukarı, düşüşler kırmızı aşağı oklarla gösterilmiş. Sistem içgörüsü: fiyat esnekliği PROS, Amadeus gibi modern gelir yönetimi sistemlerindeki ödemeye isteklilik (willingness-to-pay) algoritmalarının temel bileşenidir; iş amaçlı kurumsal pazarlar tipik olarak esneksizdir (|ε| < 1) ve fiyatı düşürmek yalnızca geliri seyreltir; tatil pazarları esnektir (|ε| > 1) ve fiyat düştüğünde yeterli yeni hacim yaratarak toplam geliri artırır.](/decks/fare-management-planning/05.webp "Tablonun ortasındaki açık renkli satır iki dünyanın sınırı: onun üstünde indirim gelir yakar, altında gelir getirir. Kararın ilk sorusu pazarın bu çizginin hangi tarafında durduğu.")

Tablonun pratik sonucu brifingin çıkarımlarından birinde duruyor: talebin
fiyata duyarsız olduğu pazarlarda hacim artırmak için indirim yapmak
yerine fiyatı artırarak toplam geliri büyütmek. Slayt bunu segmentlere
bağlıyor. İş amaçlı kurumsal pazarlar tipik olarak esneksiz; orada fiyatı
düşürmek yalnızca geliri seyreltiyor, çünkü zaten uçacak olan yolcu daha az
ödüyor. Tatil pazarları esnek; fiyat düştüğünde yeterli yeni hacim gelip
toplam geliri artırıyor. RM sistemlerindeki stimülasyon modelleri tam bu
farkı hesaplıyor: yalnızca fiyat düştüğü için uçmayı seçen yolcuyu, yani
uyarılmış talebi (induced demand).

Yazılım tarafında bu, indirim kararını bir kural değil bir tahmin haline
getiriyor. İndirim önerisi üreten bir sistem, önce pazarın esneklik
tahminine bakmak zorunda. Esneklik tahmini olmayan bir otomatik indirim
kuralı, esneksiz bir iş pazarında sessizce gelir kaybettirir ve bunu hacim
artışı olarak raporlar.

## RASK iki çelişen hedefin dengesidir

Bütün bu kararların ölçüldüğü tek bir hedef var. Kaynak metin bunu açıkça
koyuyor: bir havayolunun fiyatlandırma stratejisinin temel amacı, bazen
birbiriyle çatışan iki girişim yoluyla mevcut koltuk başına geliri, yani
RASK'ı (arz edilen koltuk kilometre başına gelir) iyileştirmek. Havayolu
aynı anda hem hacmin hem değerin peşinde.

Birinci girişim hacim ve talep yaratmak: geniş erişimli taban ücretler ve
promosyonlarla hacmi artırmak. Pazarda düşük maliyetli bir taşıyıcı (LCC)
varsa bu girişimin somut bir ürün karşılığı var. Brifinge göre pazar payını
savunmak için LCC'lerin sunduğu kısıtlamasız fiyat ortamına uygun, cazip
tek yön (one-way) ücret seçenekleri sisteme dahil edilmeli; geleneksel
gidiş-dönüş zorunluluğu kaldırılmalı. Slayt bunun dağıtım tarafındaki
etkisini de söylüyor: LCC'ler geleneksel havayollarını GDS ve AirShopping
yanıtlarında rekabetçi kalabilmek için kısıtlamasız tek yön ücretler
sunmaya zorluyor.

İkinci girişim segmentasyon ve sell-up, yani yolcuyu daha yüksek ücretli
bileti almaya yönlendirmek. Rekabetçi fiyat uygunluğu ve zekice kurgulanmış
ücret kuralları bunu sağlıyor. Brifing buradaki ilişkinin dinamik
yönetilmesi gerektiğini vurguluyor: rekabetçi ücretlerin mevcudiyeti ile
ücret kuralları arasındaki ilişki. Slayt sell-up'ı markalı ücretlere
(branded fares) bağlıyor: yolcu kısıtlamalardan kaçınmak için doğal olarak
daha yüksek bir sınıfa geçiyor.

![Başlık: Nihai Hedef, RASK'ı Maksimize Etmek. Alt başlık: fiyatlandırma stratejisinin temel amacı RASK'ı (arz edilen koltuk kilometre başına gelir) en üst düzeye çıkarmaktır, bu da birbiriyle çelişebilen iki girişimin dengelenmesini gerektirir. Ortada büyük bir daire: RASK Optimizasyonu; daireden iki yana oklar çıkıyor. Sol kutu, 1. Hacim ve Talep Yaratma: geniş erişimli taban ücretler ve promosyonlarla hacmi artırmak; düşük maliyetli taşıyıcılara (LCC) karşı pazar payını korumak için cazip tek yönlü fiyatlar sunmak. Sağ kutu, 2. Pazar Segmentasyonu ve Sell-Up: yolcuları daha yüksek ücretli biletleri almaya teşvik etmek; rekabetçi fiyat uygunluğu ve zekice kurgulanmış ücret kuralları ile getiriyi artırmak. Sistem içgörüsü: sell-up davranışı havacılık mağazacılığındaki markalı ücretlerle yakından ilişkilidir, yolcular kısıtlamalardan kaçınmak için doğal olarak daha yüksek sınıfa geçer; LCC'ler geleneksel havayollarını GDS/AirShopping yanıtlarında kısıtlamasız tek yön ücretler sunmaya zorlar.](/decks/fare-management-planning/06.webp "Oklar zıt yönlere çekiyor: tek yön kısıtlamasız ücret sell-up'ın dayandığı kısıtları gevşetiyor. İki kutu aynı rotada birbirinin kaldıracını zayıflatabilir.")

Gerilimin kaynağı burada görünüyor. Sell-up kısıtlara dayanıyor: yolcu
ucuz ücretin kuralından kaçmak için yukarı çıkıyor. LCC'ye karşı sunulan
kısıtlamasız tek yön ücret ise o kısıtları kaldırıyor. İkisi aynı rotada
yan yana durduğunda biri ötekinin kaldıracını azaltıyor. Hangisinin ağır
basacağı pazarın hangi hedefe ihtiyacı olduğuna bağlı ve o ihtiyacı
bir sonraki çerçeve belirliyor.

## Pazar payı ile getiri tek matriste okunuyor

Brifing stratejik konumlandırmayı iki eksenli bir matrisle özetliyor: yatay
eksende pazar payı, dikeyde getiri. Dört kadranın her biri ayrı bir
fiyatlandırma stratejisi istiyor. Getirisi yüksek ama payı düşük pazarda
hedef büyümek: pazar varlığını genişletmek için etkili ürün segmentasyonu.
Hem getiri hem pay yüksekse hedef korumak: getiriyi iyileştirip payı
rakiplere karşı agresif biçimde savunmak. İkisi de düşükse fırsat kollamak:
trafik ve getiriyi fırsatçı bir yaklaşımla geliştirmek.

Brifingin ayrıca soru olarak işlediği dördüncü kadran en öğretici olanı:
pazar payı yüksek ama getirisi düşük pazar. Buradaki öncelik trafik
karışımını (traffic mix) iyileştirerek getiriyi artırmak. Havayolu payını
korurken daha yüksek ücretli segmentlere odaklanan bir fiyat yapısına
geçmeli. Slayt trafik karışımını aktarmalı yolcu ile yerel O&D yolcusu
arasındaki oran olarak tanımlıyor: aktarmalı yolcu segment başına düşük
getirili ama esnek, yerel O&D yolcusu yüksek getirili. Payı zaten yüksek
olan pazarda daha fazla yolcu aramak değil, hangi yolcunun taşındığını
değiştirmek gerekiyor.

![Başlık: Pazar Dinamiklerine Göre Fiyatlandırma Stratejisi. Dikey eksen getiri (yield), yatay eksen pazar payı (market share) olan dört kadranlı matris. Sol üst, yeşil BÜYÜT: pazar varlığını genişletmek için etkili ürün segmentasyonu yapın. Sağ üst, lacivert KORU: getiriyi iyileştirin ve pazar payınızı rakiplere karşı agresifçe savunun. Sol alt, turuncu FIRSAT KOLLA: trafik ve getiriyi fırsatçı bir yaklaşımla geliştirin. Sağ alt, açık mavi İYİLEŞTİR: daha kârlı bir trafik karması yaratarak getiriyi artırın. Sağ kenardaki sistem içgörüsü: trafik karması, aktarmalı yolcular (segment başına düşük getiri ama esnek) ile yerel O&D yolcuları (yüksek getiri) arasındaki oranı ifade eder; KORU kadranında RM analistleri koltuk envanterini yüksek ödeme yapan son dakika yolcularına korumak için alt rezervasyon sınıflarını (RBD) kapatarak düşük fiyatlı talebi bilinçli olarak reddeder.](/decks/fare-management-planning/07.webp "Sağdaki iki kadran aynı payla farklı işler yapıyor: üstte koltuk korunuyor, altta yolcu karması değiştiriliyor. Pay tek başına stratejiyi söylemiyor.")

Koru kadranı, fiyatlandırmanın gelir yönetimine devrettiği yer. Slayta göre
bu kadranda RM analistleri koltuk envanterini yüksek ödeme yapan son dakika
yolcularına saklamak için alt rezervasyon sınıflarını kapatıyor ve düşük
fiyatlı talebi bilinçli olarak reddediyor. Ücret orada duruyor, ama satılmıyor.
Bölümün başındaki ayrım burada işe yarıyor: fiyatlandırma ücreti
dosyalamış, gelir yönetimi o ücretin kapısını kapatmış.

Yazılım tarafında bu matrisin karşılığı, fiyat kurallarının pazar bazında
bir strateji etiketi taşıması. Aynı rakip hamlesine Koru kadranındaki bir
pazarda hızla karşılık vermek, Büyüt kadranındaki bir pazarda ise segment
tasarımına bakmak gerekiyor. Pazar başına strateji bilgisi olmayan bir
tepki motoru, her pazara aynı refleksle cevap verir.

## Tepki kuralı strateji değildir

Son soru havayolunun fiyatlandırmayı nasıl yürüttüğü. Kaynak metin
fiyatlandırma taktiklerini üç kategoriye ayırıyor: reaktif, proaktif ve
talep yönetimi. Bu üçlü havayollarının pazardaki olgunluk seviyesine göre
nasıl hareket ettiğini anlatıyor ve bir uyarıyla başlıyor: strateji tam
tanımlanmadığında taktikler pasif kalıyor.

Reaktif taktik rakiplerin ücret dosyalamalarının (fare filings) sürekli
izlenmesi ve pazar payını korumak için önceden belirlenmiş kurallara dayalı
standart, otomatik yanıtlar verilmesi. Slayt bunun araçlarını da
adlandırıyor: ATPCO Architect ya da Infare gibi otomatik fiyat eşleştirme
kurallarını tetikleyen araçlar. Proaktif taktik satış ekipleriyle yakın
çalışıp yeni talep yaratmak: belirli pazar segmentlerine yönelik
promosyonlar ve reklam destekli kampanyalar. Talep yönetimi ise indirim
kontrolleri aracılığıyla envanteri doğrudan yönetmek.

![Başlık: Taktiksel Fiyatlandırma Uygulamaları. Alt başlık: strateji tam tanımlanmadığında taktikler pasif kalır; olgunlaşmış bir pazarda taktiksel hamleler üç ana kategoriye ayrılır. Soldan sağa yükselen üç basamak. Turuncu Reaktif (Tepkisel): rakiplerin fiyat dosyalamalarının sürekli izlenmesi, pazar payını korumak için önceden belirlenmiş kurallara dayalı standart, otomatik yanıtlar verilmesi. Mavi Proaktif (Önleyici): satış ekipleriyle yakın çalışarak yeni talep yaratmak, belirli pazar segmentlerine yönelik promosyonlar ve reklam destekli kampanyalar düzenlemek. Yeşil Talep Yönetimi: indirim kontrolleri aracılığıyla envanteri doğrudan yönetmek; not, yalnızca fiyatın segmenti belirlediği kısıtlamasız LCC ortamlarında bu zordur. Altta soldan sağa bir ok: Pasif / Sistem Kuralları'ndan Aktif / Pazar Kontrolü'ne. Sistem içgörüsü: reaktif taktikler ATPCO Architect veya Infare gibi otomatik fiyat eşleştirme kurallarını tetikleyen araçlarla yönetilir; talep yönetimi fiyatlandırma ile envanter yönetiminin kesişimidir, RM sistemindeki bid price (bir koltuk için kabul edilebilir minimum gelir) ayarlanarak ya da RBD'ler kapatılarak yapılır; kısıtlamasız (fence-free) LCC ortamlarında herkes en ucuz bileti alacağı için talep yönetimi neredeyse tamamen sürekli fiyatlandırma (continuous pricing) algoritmalarına dayanır.](/decks/fare-management-planning/08.webp "Basamaklar pasiften aktife gidiyor ama en üst basamağın notu önemli: kısıtlar kalkınca envanter kontrolü de gücünü kaybediyor ve iş sürekli fiyatlandırmaya kalıyor.")

Talep yönetimi yine iki disiplinin kesiştiği yer. Slayta göre RM sistemindeki
bid price, yani bir koltuk için kabul edilebilir minimum gelir, ayarlanarak
ya da RBD'ler kapatılarak yapılıyor. Ama bir sınırı var: yalnızca fiyatın
segmenti belirlediği kısıtlamasız LCC ortamlarında bu zor. Kısıtlamasız
(fence-free) ortamda herkes en ucuz bileti alacağı için talep yönetimi
neredeyse tamamen sürekli fiyatlandırma (continuous pricing) algoritmalarına
dayanıyor. RASK bölümündeki gerilim burada geri dönüyor: LCC'ye karşı
kısıtları kaldıran havayolu, envanter kontrolüyle segment ayırma aracını
da kısmen elinden bırakıyor.

Olgunluk basamaklarının mühendislik dersi açık. Reaktif katman en kolay
otomatikleştirilen katman: rakip dosyalaması gelir, kural tetiklenir,
eşleşen ücret çıkar. Bu yüzden bir fiyatlandırma sisteminin ilk sürümü
genellikle bu katmandan ibaret kalıyor. Ama kurallar önceden belirlenmiş
olduğu sürece sistem pazarı yönetmiyor, rakibi takip ediyor. Brifingin
önerisi pasif taktiklerden kurtulmak için önce stratejiyi net tanımlamak,
sonra sürekli rakip takibinin yerine pazar segmentlerine özel, reklam
destekli proaktif promosyonlar koymak. Stratejinin sistemde bir karşılığı
olmadıkça, önceki bölümlerdeki matris ve esneklik tablosu yalnızca
analistin kafasında kalıyor.

## Yarın işe yarayacak dört çıkarım

1. **Sell-up'ı rekabet verisiyle birlikte yönet.** Yolcuları daha yüksek
   ücretli sınıflara geçirmek için rekabetçi ücretlerin mevcudiyeti ile
   ücret kuralları arasındaki ilişkiyi dinamik tut. Rakip daha esnek bir
   paketi ucuza açtığında, senin kısıtlarına dayanan sell-up kurgun
   çalışmayı bırakır.
2. **LCC rotalarında kısıtlamasız tek yön ücret aç.** Düşük maliyetli
   taşıyıcıların baskın olduğu rotalarda pazar payını korumak için
   gidiş-dönüş zorunluluğunu kaldır. Bunun sell-up kaldıracını ve envanter
   kontrolünü zayıflattığını bilerek yap; talep yönetimini o rotada sürekli
   fiyatlandırmaya dayanacak şekilde kur.
3. **İndirimden önce esnekliği sor.** Talebin fiyata duyarsız olduğu
   pazarda hacim için indirim yapma; fiyatı artırarak toplam geliri büyüt.
   İndirim önerisi üreten her kuralın önüne pazarın esneklik tahminini koy.
4. **Stratejiyi tanımla, sonra taktiği otomatikleştir.** Pasif fiyatlama
   taktiklerinden kurtulmak için pazar bazında stratejiyi net yaz;
   sürekli rakip takibinin yerine pazar segmentlerine özel, reklam destekli
   proaktif promosyonlar uygula. Rakip hamlesine verilen tepki, rakibin o
   pazardaki ağırlığına ve pazarın matristeki yerine göre değişmeli.

Bu bölümde ne yok: seçilen ücretin kaç koltukta açık kalacağını belirleyen
mekanizma (gelir yönetimi bölümleri), fiyatlandırmanın planlama döngüsündeki
yeri ve kullandığı MIDT, IATA DDS gibi veri setlerinin kör noktaları
("Havayolu pazarlama planlama süreci ve iş mantığı analizi"). Ücret
ürünlerinin kendisi ve kural motorlarının ayrıntısı ücret ve fiyatlama
bölümlerinin konusu. Bu bölüm tek bir ücret aksiyonunun hangi sorulara
cevap verilerek alındığını anlatmak için var.
