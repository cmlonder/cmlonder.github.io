---
title: "Proaktif fiyatlandırma ve ücret rasyonalizasyonu: stratejik iş mantığı analizi"
domain: "aviation"
summary: "Proaktif fiyatlandırma rakibin hamlesini beklemeden pazara tutarlı bir mesaj vermektir: satış kampanyası, fiyat artışı ve hedefli indirim üç ayrı karar kuralıyla yönetilir. Ama bu kararların gelire dönüşmesi, ücretlerin rezervasyon sınıflarına temiz bir hiyerarşiyle oturmasına bağlı. Bu bölüm iki tarafı birlikte anlatıyor: fiyatlandırmanın stratejisini ve o stratejiyi sessizce boşa çıkaran ücret çakışmasını."
audience: "Fiyatlandırma, ücret dosyalama ya da gelir yönetimi sistemleriyle çalışan, RM sisteminin neden beklenen artışı vermediğini anlamak isteyen yazılımcı ve ürün insanı. Gelir yönetimi bölümlerinin okunmuş olması işe yarar; RBD, RBD saflığı, ücret inversiyonu, gelir sulanması ve AHP metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Pazarlama planlama bölümü planlamayı arzla talebin farklı çözünürlüklerde eşleştirilmesi
olarak anlatıyordu ve fiyatlandırmayı o döngünün kısa vadeli, oynak ayağına
koyuyordu. Bu bölüm o ayağın içine giriyor. İki ayrı soru var: fiyat
kararı nasıl verilmeli, ve verilen karar sisteme nasıl yazılmalı ki gelir
yönetimi onu doğru okusun. **Fiyatlandırmanın stratejisi ne kadar iyi olursa
olsun, ücretler rezervasyon sınıflarına temiz bir hiyerarşiyle oturmuyorsa
RM sistemi o stratejiyi gelire çeviremez.** Birinci soru pazarla ilgili,
ikincisi veriyle. Kayıp da çoğu zaman ikincisinde oluyor, çünkü orada hata
bir alarm çaldırmıyor, sadece daha az para kazandırıyor.

![Sunumun kapak slaytı. Solda başlık: Proaktif Fiyatlandırma ve Ücret Optimizasyonu. Alt başlık: Havacılıkta Stratejik Fiyatlandırma ve Rezervasyon Sınıfı Hiyerarşisi Yönetimi. Sağda üst üste dizilmiş, sağa hizalı beş yatay çubuk; üstteki ikisi mavi, alttaki üçü gri, uzunlukları farklı.](/decks/proactive-pricing/01.webp "Çubuklar sıralı değil: uzunlukları yukarıdan aşağı düzenli azalmıyor. Bu bölümün ikinci yarısı tam olarak o düzensizliğin maliyetini anlatıyor.")

## Proaktif fiyat, rakibe cevap değil pazara mesajdır

Reaktif fiyatlandırma rakip bir ücret düşürdüğünde aynısını yapmaktır.
Proaktif fiyatlandırma ise pazarın ve rakiplerin hamlesini önceden tahmin
edip fiyatı ona göre kurmak. Kaynak metin bunun hedefini iki somut sonuca
bağlıyor: proaktif fiyatlandırmanın temel amacı, pazar bazında hedeflenen
indirim seviyelerine ve hedeflenen trafik dağılımına ulaşmak. Trafik
dağılımı da sezonlara göre tanımlanıyor: yoğun, yoğun olmayan ve geçiş
sezonları için ayrı ayrı.

Bu tanımın önemli tarafı, hedefin ölçülebilir olması. "Pazarda rekabetçi
olmak" bir hedef değil; "bu pazarda bu sezon indirimli trafiğin payı şu
seviyede olsun" bir hedef. Yazılım tarafında bunun karşılığı şu: fiyat
aksiyonu bir kampanya kaydı olarak değil, pazar ve sezon bazında
tanımlanmış bir hedefe bağlı bir karar olarak tutulmalı. Hedef yoksa
aksiyonun işe yarayıp yaramadığını sonradan ölçecek bir referans da yok.

![Başlık: Proaktif Fiyatlandırmanın Temel Amacı. Solda mavi bir hedef tahtası. Ortada metin: pazar dinamiklerini ve rakip hamlelerini önceden tahmin ederek fiyat liderliğini sağlamak. Buradan iki kutuya dal ayrılıyor: Hedef İndirim Seviyelerine Ulaşmak (pazar bazında optimizasyon) ve Hedef Trafik Dağılımını Sağlamak (yoğun, yoğun olmayan ve geçiş sezonları için). Altta bant: Sonuç, piyasaya tutarlı mesaj gönderir ve irrasyonel fiyatlandırma riskini minimize eder.](/decks/proactive-pricing/02.webp "Sağdaki iki kutunun ikisi de parantez içinde bir kapsam taşıyor: pazar ve sezon. Hedef hiçbir zaman ağ geneli tek bir sayı değil.")

İkinci kazanç operasyonel. Brifinge göre süreç pazara tutarlı bir mesaj
göndererek ölçeklenebilir ve tekrarlanabilir bir yapı kuruyor ve böylece
rasyonel olmayan fiyatlandırma eylemlerini en aza indiriyor. Tekrarlanabilir
kelimesi burada kilit. Her pazarda analistin o günkü sezgisine göre verilen
fiyat kararı, yüzlerce pazarda birbirini tutmayan yüzlerce sinyal üretiyor.
Rakip ve yolcu o sinyali okuyor; tutarsız okunan fiyat, havayolunun
kendisine karşı çalışan bir fiyat.

## Üç senaryo, üç ayrı karar kuralı

Kaynak metin proaktif fiyatlandırmayı üç senaryoya ayırıyor ve her birinin
sorduğu soru farklı: satış girişimleri (promosyon), ücret artışları ve
hedefli fiyatlandırma. Üçünü aynı onay akışından geçirmek, üçüne aynı
soruyu sormak demek. Oysa her birinin riski başka yerde.

![Başlık: 3 Temel Proaktif Fiyatlandırma Senaryosu. Üç kart. Satış İnisiyatifleri (Promosyonlar): aksiyon, piyasayı canlandırmak için ücretleri düşürmek; risk, pazar uyarımının uzun vadeli sürdürülebilirliği. Ücret Artışları (Fiyat Revizyonu): aksiyon, fiyatları yukarı yönlü revize etmek; kritik faktör, havayolunun pazardaki hakimiyeti ve pazar payı gücü. Hedefli Fiyatlandırma (Segmentasyon): aksiyon, belirli müşteri segmentleri için stratejik indirimler; metodoloji, karar alma sürecinde AHP (Analitik Hiyerarşi Süreci) kullanımı. Her kartın başlığının altında sunum şablonundan kalma bir yazı tipi adı satırı da görünüyor.](/decks/proactive-pricing/03.webp "Kartların alt kutularındaki etiketlere bak: risk, kritik faktör, metodoloji. Üç senaryo aynı formla onaylanamaz, çünkü üçü farklı bir şeyi sorguluyor.")

Promosyonda ikilem zamanla ilgili. Fiyat düşünce talep artıyor, bu kısmı
kolay. Zor soru, indirimli fiyatla sağlanan pazar canlanmasının uzun vadede
sürdürülebilir olup olmadığı. Brifingin kuralı açık: kısa vadeli talep
artışı uzun vadeli gelir hedefleriyle çelişmemeli. Bir kampanyanın
başarısını kampanya dönemindeki satış adediyle ölçen bir rapor bu soruyu
hiç sormuyor. Kampanya bittiğinde talebin nereye döndüğüne bakmayan ölçüm,
promosyonu her seferinde başarılı gösterir.

Fiyat artışında ikilem güçle ilgili. Kaynak metin burada lafı dolandırmıyor:
fiyat artışları doğası gereği talep kaybına yol açar. Soru kayıp olup
olmayacağı değil, havayolunun o kaybı taşıyıp taşıyamayacağı. Bunu belirleyen
iki faktör var: havayolunun o pazardaki payı ve hakimiyet gücü. Pazarın
büyük kısmını elinde tutan taşıyıcı fiyat artırdığında yolcunun gidecek
yeri az; küçük paylı bir taşıyıcı aynı artışı yaptığında yolcu rakibe
geçiyor. Aynı fiyat hamlesi iki pazarda iki zıt sonuç verebilir, o yüzden
ağ genelinde tek bir artış oranı uygulamak bu kuralı baştan çiğniyor.

## Hedefli indirim sezgiyle değil hiyerarşiyle önceliklendirilir

Üçüncü senaryo en karmaşığı. Belirli müşteri segmentlerine stratejik
indirim vermek, hangi pazarda hangi segmente ne kadar indirim verileceğine
karar vermek demek; bu da yüzlerce değişkenin aynı anda tartılması. Kaynak
metin burada bir yöntem öneriyor: Thomas L. Saaty'nin geliştirdiği
Analitik Hiyerarşi Süreci, kısaca AHP. Yaklaşım büyük miktardaki veriyi
yapılandırılmış hiyerarşilere dönüştürüyor ve öncelikleri önceden
belirlenmiş objektif kriterlere göre sıralıyor.

Brifingin ifadesiyle AHP süreci, yapılandırılmış hiyerarşiler kurarak
aksiyonlarda mantıksal tutarlılık sağlıyor. Uygulamada bu, pazar bazlı
objektif kriterlerden oluşan bir sete karşı hiyerarşik bir önceliklendirme
matrisi kurmak anlamına geliyor. Her pazar aynı kriterlerle ölçülüyor, ama
her pazarın kendi dinamiğine göre farklı bir sıraya düşüyor.

![Başlık: Fiyatlandırma Kararlarında AHP (Analitik Hiyerarşi Süreci). Yukarıdan aşağı daralan üç katman. En üstte gri: Büyük Veri Setleri, karmaşık pazar verilerinin toplanması; dağınık noktalar. Ortada mavi: Yapılandırılmış Hiyerarşiler, verilerin problem yapısına göre organize edilmesi; düzenli kareler. Altta lacivert: Objektif Önceliklendirme, pazar bazında hedeflere göre kesin karar. Aşağı inen bir ok sonuç kutusuna varıyor: fiyatlandırma ekipleri için yüzlerce değişken arasında mantıksal tutarlılık sağlar.](/decks/proactive-pricing/04.webp "Üst katmandaki dağınık noktalar ortada kareye dönüşüyor: AHP'nin yaptığı iş veriyi azaltmak değil, aynı veriyi karşılaştırılabilir bir düzene sokmak.")

Mühendislik açısından değerli olan taraf şu: kriterler ve ağırlıklar
açıkça yazılmış bir modelde duruyorsa karar tekrar üretilebilir ve
denetlenebilir. Aynı girdiyle aynı sıralama çıkıyor, iki analist aynı
pazara iki farklı indirim önermiyor. Brifing bunu fiyatlandırma disiplini
olarak adlandırıyor ve hedefli fiyatlandırmada subjektif kararlar yerine
AHP gibi yapılandırılmış modellerin kullanılmasını öneriyor. Birinci
bölümdeki tutarlı mesaj ilkesi, hedefli indirimde ancak böyle bir modelle
ölçeklenebiliyor.

## Rezervasyon sınıfları kesin bir değer sırası taşımalı

Buraya kadar anlatılan her şey fiyatın ne olması gerektiğiyle ilgiliydi.
Bölümün ikinci yarısı o fiyatın sisteme nasıl oturduğuyla ilgili ve
brifingin en sert iş kuralı burada. Havayolu ücretleri rezervasyon
sınıflarına, yani RBD'lere (Reservation Booking Designator) eşleniyor.
Örnekteki sınıflar Y, B, M, H, V, Z ve Q. Kural, bu sınıflar arasında
kesin bir hiyerarşi olması: Y > B > M > H > V > Z > Q. Her sınıfın ortalama
değeri bir altındakinden yüksek olmalı ve sınıfların ücret aralıkları
birbiriyle çakışmamalı.

Kaynak metin bu durumu RBD saflığı (RBD purity) olarak adlandırıyor ve
yerini açıkça söylüyor: RBD'lerin saflığı, bir gelir yönetimi programının
başarısı için kritik bir gereklilik. Sebep, RM sisteminin koltuk koruma
kararlarını sınıflar arasındaki değer farkı üzerinden vermesi. Sınıflar
temiz ayrışmıyorsa sistemin girdisi bozuk.

![Başlık: Fiyat Planlamasında Kritik Sorun, Ücret Rasyonalizasyonu. Solda yedi katmanlı bir piramit; tepede dar Y, aşağı doğru genişleyerek B, M, H, V, Z ve en altta geniş Q. Üst katmanlar mavi, alt katmanlar gri. Sağda Rezervasyon Sınıfı Hiyerarşisi (RBD) başlığı ve kural: temel kural, her sınıfın değerinin azalan sırada olmasıdır. Kutu içinde Y > B > M > H > V > Z > Q. Altında sarı bir uyarı üçgeni ve metin: pazardaki kayıtlı ücretler (filed fares) ile eşleştirildikleri rezervasyon sınıfları arasındaki değer tutarsızlıkları, tüm gelir yönetimi altyapısını çökertebilir.](/decks/proactive-pricing/05.webp "Uyarı metnindeki çift dikkat çekiyor: sorun ücretin kendisi değil, kayıtlı ücretle eşlendiği sınıf arasındaki uyumsuzluk.")

Bu kuralın yazılımdaki izdüşümü doğrudan: ücret dosyalama akışı, yeni bir
ücretin hangi sınıfa bağlandığını ve o sınıfın komşularıyla sırasını
kontrol eden bir doğrulamadan geçmiyorsa, hiyerarşiyi bozan bir kayıt
sessizce sisteme giriyor. Ücret tek başına geçerli, sınıf tek başına
geçerli; hata yalnızca ikisi yan yana konduğunda görünüyor.

## Ücret aralıkları çakışınca RM üst sınıfı korumayı bırakıyor

Çakışmanın etkisi kademeli. Sınıflar arasındaki ücret aralıkları üst üste
bindiğinde sınıflar arası ortalama ücret farkı daralıyor. RM sistemi üst
sınıf için ne kadar koltuk koruyacağına bu farka bakarak karar verdiği için,
fark azalınca koruduğu koltuk sayısını da kendiliğinden düşürüyor. Brifing
bunun sonucunu gelir sulanması (revenue dilution) olarak adlandırıyor:
yüksek ödemeye hazır yolcuya saklanması gereken koltuk daha ucuza satılıyor.

Uç durumun adı ücret inversiyonu (fare inversion). Hiyerarşide üstte duran
bir sınıfın, örneğin Y'nin, altındaki bir sınıftan, örneğin B'den daha düşük
ortalama ücrete sahip olması. Brifing sistemin bunu nasıl okuduğunu tek
bir oranla tarif ediyor: gelir oranı R(B)/R(Y) 1'i geçtiğinde sistem üst
sınıf için sıfır koruma kararı veriyor. Kaynak metnin ifadesiyle fiyat
inversiyonları, algılanan yüksek değerli sınıf için alt sınıftan sıfır
koruma sağlanmasıyla sonuçlanabilir.

![Başlık: Ücret Kesişmeleri ve Fare Inversion (Ücret Tersinmesi) Sorunu. Solda yatay çubuk grafik, yatay eksen fiyat (düşükten yükseğe). Y sınıfı ücret aralığı gri, orta-yüksek bantta. B sınıfı ücret aralığı mavi, daha solda başlıyor ama Y'nin bittiği yerin de ötesine uzanıyor; sağ uçtaki taşma sarı bir halkayla işaretli. M sınıfı ücret aralığı açık gri, en solda. Sağda kutu, Matematiksel İhlal: beklenen R(B) / R(Y) < 1; mevcut durum R(B) / R(Y) > 1 (sistem hatası). Altında açıklama, Kesişim Bölgesi (Overlap Zone): alt sınıfın (B) ortalama ücreti, sistemdeki üst sınıftan (Y) daha yüksek hale gelir.](/decks/proactive-pricing/06.webp "Halkanın içindeki bölge küçük görünüyor ama oran bire değdiği anda sistemin davranışı kademeli değil, bir anda değişiyor.")

Oranın neden bu kadar belirleyici olduğu, gelir yönetimi bölümlerinde
anlatılan Littlewood kuralından okunabiliyor. Kural, üst sınıf için bir
koltuğu daha korumanın ancak o koltuğun üst sınıftan satılma olasılığı
iki ücretin oranından büyük olduğu sürece anlamlı olduğunu söylüyordu.
Oran 1'e yaklaştıkça korumanın eşiği yükseliyor; 1'i geçtiğinde hiçbir
olasılık o eşiği aşamıyor. Algoritma hata yapmıyor, kendisine verilen
ücretlerle tutarlı olarak doğru hesabı yapıyor. Yanlış olan girdi.

![Başlık: Hiyerarşi Bozulduğunda Sistem Nasıl Çöker? Soldan sağa üç ok biçimli adım. 1. Kesişen Ücret Aralıkları (mavi): sınıflar (RBD) arası ortalama ücret ayrımı ve netlik ortadan kalkar. 2. Sıfır Koruma, Zero Protection (gri): sistem, yüksek değerli sınıflar için ayırması gereken koltuk korumasını sıfıra indirir (RM sistemleri alt sınıfları açık tutmaya başlar). 3. Gelir Kaybı, Revenue Dilution (sarı): beklenen marjinal koltuk geliri hesaplamaları bozulur, uçağın gelir maksimizasyonu engellenir.](/decks/proactive-pricing/07.webp "Zincirde hata mesajı üreten bir halka yok. Üç adımın hiçbiri bir istisna fırlatmıyor, sadece rapordaki gelir düşüyor.")

Bu yüzden inversiyon bir fiyatlandırma hatası olarak değil, bir veri
bütünlüğü hatası olarak ele alınmalı. Veritabanında yabancı anahtar
kısıtı olmayan bir tablo nasıl tutarsız kayıtları kabul ediyorsa, sınıf
sırasını kontrol etmeyen bir ücret deposu da inversiyonu kabul ediyor.
Fark şu ki burada tutarsızlığın bedeli bir sorgu hatası değil, kalkan her
uçuşta koltuk başına kaybedilen gelir.

## RM beklenen artışı vermiyorsa önce tarife yapısına bak

Brifingin tanı kuralı, sistemin semptomundan geriye doğru çalışıyor.
Envanter kontrol sisteminin alt sınıfları hatalı biçimde açık tuttuğu
tespit edilirse ilk bakılacak yer algoritma değil, tarife yapısı (tariff
structure) ve bu yapının rezervasyon sınıflarıyla ilişkisi. Hizalama hatası
bulunursa pazar bazında yeniden düzenleme yapılıyor.

Bu sıra önemli, çünkü sezgi tersini söylüyor. RM sistemi alt sınıfları
açık tutuyorsa akla ilk gelen tahmin modelinin ya da optimizasyon
parametrelerinin bozuk olduğu. Oysa yukarıdaki zincir gösteriyor ki
sistem, kendisine verilen ücret yapısıyla tutarlı olarak alt sınıfı açık
tutuyor olabilir. Algoritmayı ayarlamaya çalışmak, bozuk girdiyle doğru
çalışan bir hesabı bozmaya çalışmak olur.

Çözümün adı ücret rasyonalizasyonu ve üç adımı var. Fiyatlar ve
rezervasyon sınıfları pazar bazında tek tek inceleniyor. Gerekli hiyerarşik
ayarlamalar yapılıp ücretler sisteme yeniden yükleniyor (refiling).
Stratejik değeri olmayan gereksiz ücretler sistemden tamamen temizleniyor.

![Başlık: Çözüm, Ücret Rasyonalizasyonu ve Sınıf Yeniden Hizalama. Solda merdiven biçiminde bir grafik, yatay eksen ücret değeri (artan). M sınıfı gri blok en solda ve en altta, B sınıfı mavi blok ortada, Y sınıfı lacivert blok en sağda ve en üstte; bloklar yatayda birbirine değiyor ama üst üste binmiyor. Sağda üç adım: 1, fiyatlar ve rezervasyon sınıfları pazar bazında titizlikle incelenir. 2, gerekli hiyerarşik ayarlamalar yapılır ve ücretler sisteme yeniden yüklenir (refiling). 3, stratejik değeri olmayan gereksiz ücretler (fares) sistemden tamamen temizlenir. Altta bant: Sonuç, sınıflar arası net ortalama ücret ayrımı (gelir yönetimi algoritmaları için zorunlu altyapı).](/decks/proactive-pricing/08.webp "Önceki kesişim grafiğiyle yan yana düşün: aynı üç sınıf, bu kez her blok bir öncekinin bittiği yerde başlıyor.")

Üçüncü adım en kolay atlanan. Ücret dosyaları zamanla birikiyor: eski bir
kampanyadan kalan ücret, artık satılmayan bir ürünün ücreti, bir rakibe
cevap olarak açılıp kapatılmayı unutulmuş ücret. Her biri tek başına
zararsız görünüyor ama hepsi bir sınıfın ücret aralığını genişletiyor ve
komşu sınıfla çakışma ihtimalini artırıyor. Yazılım tarafında bunun
karşılığı, ücret deposunun yalnızca ekleme alan bir kayıt defteri gibi
değil, düzenli budanan bir veri seti gibi yönetilmesi. Bu da her ücretin
neden var olduğunu bilen bir sahiplik kaydı gerektiriyor.

## Strateji ancak saf bir yapının üstünde gelire dönüşüyor

Bölümün iki yarısı birbirinden bağımsız gibi duruyor: biri pazar
stratejisi, diğeri veri temizliği. Kapanış slaytı ikisinin birbirine
bağımlı olduğunu söylüyor. Proaktif strateji pazar dinamiklerini
yönlendiren hedefli fiyat girişimlerini ve indirimleri kapsıyor; yapısal
saflık hatalı kesişimlerden arındırılmış, matematiksel olarak kusursuz bir
tarife hiyerarşisini. Stratejik indirimler ve hedefler, ancak alt yapıda
kusursuz bir RBD hiyerarşisi varsa artımlı gelire dönüşüyor.

![Başlık: Başarılı Bir Gelir Yönetimi İçin Çift Yönlü Yaklaşım. Ortada bir sonsuzluk işareti; sol halka mavi, sağ halka lacivert, kesiştikleri yerde sarı bir eşkenar dörtgen. Solda Proaktif Strateji: pazar dinamiklerini yönlendiren hedefli fiyat inisiyatifleri ve indirimler. Sağda Yapısal Saflık (RBD Purity): hatalı kesişimlerden arındırılmış, matematiksel olarak kusursuz tarife hiyerarşisi. Altta kutu: stratejik indirimler ve hedefler, ancak alt yapıda kusursuz bir RBD hiyerarşisi mevcutsa Artımlı Gelire (Incremental Revenue) dönüşür.](/decks/proactive-pricing/09.webp "Ortadaki sarı nokta iki halkanın ancak birlikte ürettiği şey: artımlı gelir. Halkalardan biri kopunca orada bir şey kalmıyor.")

Bu bağımlılığın pratik anlamı şu: bir hedefli indirim kampanyası yeni bir
ücretle dosyalandığında, o ücret yanlış sınıfa oturuyorsa kampanya iki kez
kaybettiriyor. Birincisi indirimin kendisi, ikincisi o indirimin üst sınıfın
korumasını düşürmesi. Fiyatlandırma ekibi kampanyayı başarılı sayarken RM
ekibi aynı pazarda neden gelirin düştüğünü arıyor olabilir. İki ekip ayrı
sistemlere bakıyorsa bu hatayı ikisi de görmüyor.

## Yarın işe yarayacak üç çıkarım

1. **Beklenen artışı vermeyen pazarda önce ücretleri denetle.** RM sistemi
   bir pazarda beklenen artışı sağlamıyorsa, algoritmaya dokunmadan önce o
   pazardaki bütün ücretleri ve RBD eşleşmelerini pazar bazında incele.
   Hizalama hatasını düzelt, ücretleri yeniden yükle, stratejik değeri
   olmayan ücretleri ele.
2. **Ücret dosyalarken hiyerarşiyi ve ayrımı birlikte koru.** Her yeni
   ücrette Y > B > M > H > V > Z > Q sırasının bozulmadığından emin ol.
   Sıranın korunması yetmiyor; sınıflar arası ücret farkı da RM sisteminin
   koltuk koruma algoritmasını besleyecek kadar açık olmalı. Bu kontrolü
   dosyalama akışının içine bir doğrulama adımı olarak koy, sonradan
   yapılan bir denetime bırakma.
3. **Hedefli fiyatlandırmada kararı modele bağla.** Hangi pazarda hangi
   segmente indirim verileceğini sezgiyle değil, AHP gibi yapılandırılmış
   bir modelle, pazar bazlı objektif kriterlere karşı önceliklendir.
   Promosyonu kampanya sonrası talebiyle, fiyat artışını o pazardaki payınla
   tart; üç senaryoyu aynı onay formundan geçirme.

Bu bölümde ne yok: koltuk koruma hesabı ve Littlewood kuralının
kendisi (gelir yönetimi bölümleri, özellikle "Yield Management: erken
dönem stratejik analiz ve iş mantığı"), fiyatlandırmanın planlama
döngüsündeki yeri ("Havayolu pazarlama planlama süreci ve iş mantığı
analizi"). Bu bölüm o hesabın girdisi olan ücret yapısının neden temiz
tutulması gerektiğini ve fiyat kararlarının hangi kurala göre verildiğini
anlatmak için var.
