---
title: "Karma ve hibrit envanter kontrol sistemleri"
domain: "aviation"
summary: "Klasik yuvalama bütün ücret sınıflarını ortalama ücrete göre tek bir merdivene dizer ve düşük getirili trafiği merdivenin en altına iter. Karma ve hibrit yapılar bu merdivene paralel kollar ekler: biri konsolidatör ve promosyon trafiğine garanti kontenjan verir, öteki satış kanallarını birbirinden yalıtır ama aralarında koltuk aktarımını yasaklar. Bu bölüm iki yapıyı, mevcudiyetin eşik yuvalamayla nasıl hesaplandığını ve sınıf kontrolünün segment kurallarıyla nasıl katmanlandığını anlatıyor."
audience: "Envanter, mevcudiyet ya da gelir yönetimi sistemleriyle çalışan, bir ücret sınıfının neden açık ya da kapalı göründüğünü anlamak isteyen yazılımcı ve analist. Önceki gelir yönetimi ve overbooking bölümlerini okumuş olmak işe yarar; yuvalama (nesting), koruma seviyesi, yetkilendirme limiti, karma, hibrit, eşik ve net yuvalama metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Overbooking bölümleri uçuşa kaç rezervasyon kabul edileceğini anlatıyordu.
Bu bölüm bir adım içeri giriyor: kabul edilen o kapasitenin ücret sınıfları
arasında nasıl paylaştırıldığına. Havayolu gelir yönetiminde koltuklar
tek tek sınıflara kesin paylar olarak bölünmüyor; sınıflar iç içe geçmiş bir
hiyerarşi halinde, yani yuvalanmış (nested) olarak tutuluyor. Pahalı sınıf
ucuz sınıfın koltuğunu kullanabiliyor, tersi mümkün değil. Bu yapı tek bir
kabin, tek bir kanal ve tek bir trafik tipi için iyi çalışıyor. Konsolidatör
anlaşmaları, cruise hatları, promosyonlar ve birbirinden bağımsız yönetilmek
istenen satış kanalları devreye girince yetmiyor. **Karma ve hibrit envanter
kontrolleri, tek merdivenli yuvalamanın düşük getirili trafiği yutmasına
karşı kurulmuş yapılar; ama bu korumanın bedeli esneklik, ve bedel en çok
hibrit yapıda, kanallar arası manuel müdahale zorunluluğu olarak ödeniyor.**

Kaynak metin dört kontrol tipini ele alıyor: karma (mixed) yuvalama, hibrit
(hybrid) yuvalama, eşik (threshold) yuvalama ve net yuvalama. İlk ikisi
hiyerarşinin şeklini, son ikisi o şekil üzerinde mevcudiyetin nasıl
hesaplandığını anlatıyor. Bölüm bu ayrımı izliyor.

## Hiyerarşi ortalama ücrete göre dizildiği için düşük getirili trafik en alta düşüyor

Yuvalamanın bütün mantığı bir sıralamaya dayanıyor. Rezervasyon sınıfları
k1, k2, ..., kN olarak, azalan ortalama ücret değerine (average fare value)
göre sıralanmış bir küme oluşturuyor: k1 ≥ k2 ≥ ... ≥ kN. En yüksek ücretli
sınıf en üstte duruyor ve en geniş yetkiye sahip. Kaynak metin bunu
önceliklendirme kriteri olarak koyuyor: sınıflar arasındaki öncelik başka
bir şeye değil, ortalama ücrete bakıyor.

Bu kuralın doğal sonucu, getirisi düşük olan her şeyin merdivenin alt
basamaklarına yerleşmesi. Tek bir hiyerarşide alt basamak, üst basamaklar
koltuğa ihtiyaç duyduğunda ilk kapanan yer demek. Çoğu trafik için doğru
davranış da bu: talep yüksekse koltuğu düşük ücretli yolcu yerine yüksek
getirili yolcuya saklamak yuvalamanın varlık sebebi.

Sorun, bazı düşük getirili trafiğin ticari olarak vazgeçilemez olması.
Kaynak metin örnekleri açıkça sayıyor: konsolidatörler, cruise hatları ve
promosyonlar. Bunlar birim başına az getiriyor ama arkalarında bir anlaşma,
bir kontenjan taahhüdü ya da bir pazarlama kampanyası var. Tek merdivenli
yapıda bu trafik, ortalama ücret sıralamasının kaçınılmaz sonucu olarak
talep arttıkça kapanıyor. Taahhüt verilmiş kontenjan, sistemin kendi
mantığı yüzünden tutulamıyor.

Yazılım tarafında bunun karşılığı şu: sınıf sıralaması bir konfigürasyon
değeri değil, bir iş kararı. Sıralamayı yalnızca ücret tablosundan otomatik
türeten bir sistem, ticari önceliği ücret sırasından farklı olan trafiği
ifade edecek yer bırakmıyor. Karma ve hibrit yapılar tam da bu boşluğu
dolduruyor.

## Karma yuvalama düşük getirili trafiği en üst sınıfa paralel bağlayarak koruyor

Karma yuvalanmış envanter kontrolü (mixed nested inventory control),
kaynak metnin tanımıyla düşük getirili trafik segmentlerine garanti
tahsisat sağlamak için kullanılan yapı. Metnin örneğinde bu trafik Z ve N
sınıflarıyla temsil ediliyor.

Mekanizma basit ama sonucu önemli. Bu sınıflar ana hiyerarşinin altına
eklenmiyor; hiyerarşinin en üst sınıfına, örneğin Y sınıfına, paralel
olarak yuvalanıyor. Yani bir sınıf ortalama ücret sıralamasında aşağıda
olsa bile, merdivenin dibinde değil, tepesinin yanında ayrı bir kolda
duruyor. Ana hiyerarşideki satışlar bu kolun kontenjanını aşağıdan
kemiremiyor. Kaynak metin sonucu tek cümleye indiriyor: düşük getirili
olmalarına rağmen bu sınıflar için belirli bir kontenjan garanti altına
alınıyor.

"Karma" adı da buradan geliyor. Aynı kabinde iki davranış bir arada:
bazı sınıflar ana hiyerarşiye dahil, yani klasik yuvalamanın bütün
kurallarına tabi; promosyonel sınıflar ise bağımsız ama paralel bir kolda
tutuluyor. Kaynak metnin kapanış notu karma yuvalamayı bir koruma kalkanına
benzetiyor: düşük getirili segmentlerin ana hiyerarşi tarafından
yutulmasını engelleyen yapı.

Bu korumanın neyi feda ettiği de açık. Paralel koldaki kontenjan, ana
hiyerarşide yüksek getirili talep bekleyen koltukları kullanamıyor olmakla
kalmıyor; ana hiyerarşi de o kontenjanı kendi talebi için kullanamıyor.
Garanti tahsisat, tanımı gereği, gelir optimizasyonunun o koltuklar üzerinde
söz hakkını kısıtlıyor. Bu yüzden karma yapı, garanti verilmesi gereken
trafik için bilinçli bir istisna olarak kullanıldığında anlamlı. Her düşük
ücretli sınıfı paralel kola taşımak, yuvalamanın kendisini devre dışı
bırakmak olur.

Sistem tasarımı açısından karma yapı, bir sınıfın iki ayrı özelliği
olduğunu kabul etmek demek: sıralamadaki yeri (ortalama ücret) ve
hiyerarşideki konumu (ana kol mu, paralel kol mu). Bu ikisini tek bir
"sıra numarası" alanına sıkıştıran bir envanter modeli, karma yapıyı
ifade edemiyor.

## Hibrit yuvalama kanalları yalıtıyor, ama tükenen kanala koltuk ödünç vermiyor

Hibrit yuvalanmış kontrol (hybrid nested inventory control) bir adım
daha ileri gidiyor. Kaynak metin bunu bir kabin içinde iki ya da daha
fazla bağımsız yuvalama yapısının bulunduğu varyant olarak tanımlıyor.
Amacı da farklı: garanti tahsisat değil, farklı satış kanallarını
birbirinden bağımsız yönetmek.

Hibrit yapıda farklı hiyerarşiler, metnin örneğinde Y ve N, aynı kabinin
içinde ama hiyerarşinin aynı seviyesinde, bağımsız yapılar olarak
kuruluyor. Her kanalın kendi merdiveni, kendi kapasite limiti var. Bir
kanaldaki satış, öteki kanalın merdiveninde hiçbir basamağı etkilemiyor.
Karma yapıda paralel kol ana hiyerarşiye bir üst sınıf üzerinden
bağlıydı; hibritte kollar arasında böyle bir bağ yok.

Yalıtımın bedeli kaynak metinde bir iş kuralı olarak yazılı: bir
hiyerarşi tükendiğinde, diğer bağımsız hiyerarşiden otomatik olarak koltuk
ödünç alınamıyor. Bunu aşmak için manuel müdahale gerekiyor; müdahale
olmazsa ilgili kanal satışa kapanıyor. Yani kabinde boş koltuk varken bir
kanal "dolu" diyebiliyor, çünkü boş koltuklar öteki kanalın merdiveninde
duruyor.

Kaynak metnin önemli notu bu kuralı sistemin en kritik kısıtı olarak
işaretliyor: hibrit sistemlerde hiyerarşiler arası manuel müdahale
zorunluluğu, esnekliği kısıtlayan en kritik iş kuralı. Bu, yapının bir
kusuru değil, tanımının parçası. Kanalları bağımsız yönetmek isteyen biri,
kanallardan birinin ötekinin kapasitesine dokunamamasını da istemiş oluyor.
Otomatik ödünç alma olsaydı yalıtım da olmazdı.

Yazılım tarafında bunun iki somut sonucu var. Birincisi, hibrit yapıda
"kabin kapasitesi" ile "satılabilir kapasite" aynı şey değil; mevcudiyet
sorgusu kabine değil, kanalın hiyerarşisine sorulmalı ve cevap o
hiyerarşinin durumunu yansıtmalı. İkincisi, manuel müdahale bir istisna
akışı değil, yapının normal işleyişinin parçası. Tükenen bir hiyerarşi
kimseye haber vermeden kanal kapatıyorsa, boş koltukla satılamayan talep
arasındaki fark ancak kalkıştan sonra fark ediliyor. Bir hiyerarşinin
tükenmeye yaklaştığını ve kardeş hiyerarşide boş kapasite olduğunu analiste
gösteren bir uyarı, bu kuralın operasyonel maliyetini düşüren en ucuz araç.

## Eşik yuvalamada her satış bütün hiyerarşiyi aynı anda düşürüyor

Hiyerarşinin şekli kurulduktan sonra ikinci soru geliyor: bir sınıfta kaç
koltuk açık? Kaynak metin koltuk mevcudiyetini hesaplamak için iki yöntem
sayıyor: eşik yuvalama (threshold nesting) ve net yuvalama (net nesting).

Eşik yuvalamada her sınıfın bir yetkilendirme limiti (authorization) var:
o sınıfın ve altındakilerin toplamda satabileceği en fazla koltuk.
Mevcudiyet de şöyle hesaplanıyor: bir i sınıfı için açık koltuk sayısı,
o sınıfın yetkilendirme limitinden kabin genelinde satılan toplam koltuk
sayısının çıkarılmasıyla bulunuyor.

Seats Available(i) = Authorization(i) − Total Seats Sold

Formülün kritik kısmı çıkarılan terim: sınıfın kendi satışı değil,
kabindeki toplam satış. Kaynak metin bunun sonucunu açıkça yazıyor:
herhangi bir sınıftan yapılan satış, hiyerarşideki tüm sınıfları
etkiliyor. Satış hangi sınıftan yapılırsa yapılsın, bütün sınıfların
mevcudiyeti aynı anda bir azalıyor ve üst sınıflar için tanımlanmış
koruma seviyeleri (protection levels) korunmuş oluyor.

Koruma seviyesi, bir sınıfın ve üstündekilerin kullanımına saklanan,
alt sınıflara satılmayacak koltuk sayısı. Eşik yuvalamada bu saklama
formülün içinde gömülü: alt sınıfın yetkilendirme limiti, üst sınıflara
ayrılan koltuklar kadar düşük tutuluyor. Toplam satış arttıkça en düşük
limitli sınıf ilk sıfıra iniyor ve kapanıyor; üst sınıflar hâlâ açık.
Pahalı bir koltuk satıldığında da ucuz sınıfın mevcudiyeti düşüyor, çünkü
toplam satış arttı. Hiyerarşinin neresinden satılırsa satılsın, koruma
çizgileri yerinde kalıyor.

Net yuvalama için kaynak metin daha az ayrıntı veriyor. Onu standart
kapasite yönetimi olarak ve karar noktasını yetkilendirme limitleri
üzerinden net hesaplama olarak tanımlıyor. Metin, iki yöntemin formül
düzeyindeki farkını eşik yuvalama kadar açmıyor; bu bölüm de o farkı
metnin ötesine taşımıyor.

Yazılım tarafında eşik yuvalamanın çekici yanı hesaplamanın sadeliği:
her sınıf için tutulması gereken durum tek bir sayı (limit), paylaşılan
durum da tek bir sayı (toplam satış). Bir satış tek bir sayacı
güncelliyor, bütün sınıfların mevcudiyeti o sayaçtan türetiliyor. Sınıf
başına ayrı sayaç tutup her satışta hepsini tek tek güncellemeye çalışan
bir tasarım, aynı sonucu daha çok yazma ve daha çok tutarsızlık fırsatıyla
üretir. Hibrit yapıda ise bu "toplam satış" kabin geneli değil, her
bağımsız hiyerarşinin kendi toplamı olmalı; yoksa bir kanalın satışı öteki
kanalın mevcudiyetini düşürür ve yalıtım kâğıt üzerinde kalır. Kaynak metin
bu birleşimi ayrıca tarif etmiyor, ama yalıtım tanımının doğal sonucu bu.

## Sınıf kontrolü tek başına yetmiyor, rota ve kural katmanlarıyla birleşiyor

Yuvalanmış kontroller envanterin tek katmanı değil. Kaynak metin bunların
segment limitleri (segment limits), segment kapatma göstergeleri (segment
close indicators) ve minimum/maksimum kontrollerle birlikte çalışacak
şekilde yapılandırılabildiğini söylüyor. Bu birleşim, kontrolün yalnızca
sınıf bazlı değil, rota ve kural bazlı da yapılmasını sağlıyor.

Pratikte bu, bir sınıfın açık görünmesi için birden fazla kapının aynı
anda açık olması gerektiği anlamına geliyor. Yuvalama hesabı sınıfta koltuk
olduğunu söyleyebilir, ama segment limiti dolmuşsa ya da segment kapatma
göstergesi açıksa satış yapılmıyor. Minimum ve maksimum kontroller de
yuvalamanın ürettiği sayıya alt ve üst sınır koyuyor.

Buradan çıkan mühendislik dersi, mevcudiyet cevabının bir hesap değil,
bir kesişim olduğu. "Bu sınıf neden kapalı?" sorusunun cevabı yuvalama
limitinde, segment limitinde, kapatma göstergesinde ya da min/max
kuralında olabilir. Mevcudiyet servisi yalnızca açık koltuk sayısını
dönüyorsa, kapanışın hangi katmandan geldiğini bulmak için bütün
kuralları yeniden çalıştırmak gerekiyor. Cevabın yanında hangi kontrolün
bağlayıcı olduğunu da dönen bir servis, hem analistin hem destek ekibinin
işini kısaltıyor. Bu özellikle hibrit yapıda önemli: tükenen bir
hiyerarşiyle segment kapatma göstergesi dışarıdan aynı görünüyor, ama
birinin çözümü manuel koltuk aktarımı, ötekinin çözümü bir göstergeyi
kaldırmak.

## Dört yapı dört farklı soruya cevap veriyor

Kaynak metnin özet tablosu dört kontrol tipini amaç ve karar noktasıyla
yan yana koyuyor. Tabloyu hangi yapının hangi soruya ait olduğunu gösteren
bir harita olarak okumak işe yarıyor.

| Kontrol tipi | Temel amaç | Karar noktası ya da kısıt |
|---|---|---|
| Karma yuvalama | Promosyon ve konsolidatör trafiği | Düşük getirili sınıflara (Z, N) garanti tahsisat |
| Hibrit yuvalama | Kanal yönetiminde bağımsızlık | Hiyerarşiler arası otomatik koltuk transferi yok |
| Eşik yuvalama | Koruma seviyelerinin muhafazası | Bir satış bütün hiyerarşiyi eş zamanlı etkiler |
| Net yuvalama | Standart kapasite yönetimi | Yetkilendirme limitleri üzerinden net hesaplama |

İlk iki satır hiyerarşinin şekliyle ilgili: hangi sınıf hangi kola
bağlı, hangi kollar birbirine dokunabiliyor. Son iki satır o şeklin
üzerinde sayının nasıl üretildiğiyle ilgili. Bir envanter sisteminde bu
iki soru ayrı bileşenlerde durmalı: şekil bir konfigürasyon modeli,
mevcudiyet hesabı bu modeli okuyan bir fonksiyon. İkisi aynı kodda
iç içe yazıldığında, yeni bir paralel kol eklemek hesaplama mantığına
dokunmayı gerektiriyor.

## Yarın işe yarayacak beş çıkarım

1. **Sınıfın sırasıyla konumunu ayrı alanlar olarak modelle.** Ortalama
   ücrete göre sıralama ile ana kol ya da paralel kol konumu farklı
   şeyler. Tek alana sıkıştırılırlarsa karma yapı ifade edilemiyor.
2. **Garanti tahsisatı istisna olarak kullan.** Karma yuvalama
   konsolidatör, cruise ve promosyon trafiğini ana hiyerarşinin
   yutmasından koruyor, ama paralel koldaki her koltuk optimizasyonun
   dışına çıkıyor. Yalnızca taahhüt verilmiş trafiği oraya taşı.
3. **Hibrit yapıda tükenmeyi önceden görünür kıl.** Hiyerarşiler
   arasında otomatik ödünç alma yok ve bu kural yapının tanımı. Bir
   kanalın merdiveni tükenirken kardeş hiyerarşide boş kapasite olduğunu
   analiste gösteren bir uyarı, kanalın sessizce kapanmasını önlüyor.
4. **Eşik yuvalamada tek sayaç tut.** Mevcudiyet yetkilendirme limitinden
   toplam satış çıkarılarak bulunuyor; her sınıfı ayrı sayaçla
   güncellemek aynı sonucu daha kırılgan üretir. Hibrit yapıda o sayaç
   hiyerarşi başına olmalı, kabin başına değil.
5. **Mevcudiyet cevabına bağlayıcı kontrolü ekle.** Yuvalama limiti,
   segment limiti, segment kapatma göstergesi ve min/max kuralı aynı
   kapanışı üretebilir. Hangisinin kapattığını dönen servis, "bu sınıf
   neden kapalı" sorusunu kuralları yeniden çalıştırmadan cevaplıyor.

Bu bölümde ne yok: rezervasyon limitinin kapasitenin üstüne nasıl
çıkarıldığı (overbooking bölümleri), koruma seviyelerinin hangi talep
tahminiyle hesaplandığı (talep tahmini bölümleri) ve aktarmalı yolcunun
güzergâh değerine göre sanal kovalara eşlendiği sanal yuvalama ("Gelir
yönetimi ve stratejik operasyonlar: PEOPLExpress ve American Airlines
analizi"). Bu bölüm tek bir uçuş bacağının kabininde hiyerarşinin nasıl
kurulduğunu ve mevcudiyetin o hiyerarşiden nasıl okunduğunu anlatmak için
var.
