---
title: "Havacılık gelir yönetimi alternatifleri ve iş mantığı analizi"
domain: "aviation"
summary: "Bir gelir yönetimi sistemi dört parçadan oluşur: veri toplama, tahmin, envanter kontrolü ve geri bildirim. Hangi kontrol yöntemini seçtiğiniz ağınızın yapısına bağlı, ama gelire en çok dokunan parça tahminin ne kadar kesin olduğu. Bu bölüm leg bazlı ile O&D bazlı kontrol arasındaki seçimi, talebi arındırmak için gereken veriyi ve yanlış tahminin iki yönünün neden aynı bedeli ödetmediğini anlatıyor."
audience: "Gelir yönetimi, envanter ya da rezervasyon sistemleri üzerinde çalışan, RM motorunun içine ne girdiğini ve çıktısının neden bu kadar tahmine bağlı olduğunu anlamak isteyen yazılımcı ve ürün insanı. Spill bölümlerinin okunmuş olması işe yarar; leg/segment ve O&D kontrolü, unconstrained demand, proration, dilution ve spiral down metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Gelir yönetimi bölümleri şimdiye kadar mekanizmayı anlattı: hangi koltuğun
hangi fiyattan açık kalacağı, reddedilen talebin nasıl ölçüleceği, kapasitenin
talebe ne kadar yakın durması gerektiği. Bu bölüm sistemin kendisine bakıyor:
bir havayolu gelir yönetimini hangi yöntemle kurar, motorun içine hangi veri
girer ve motorun çıktısını en çok ne bozar. **Gelir yönetiminde kontrol
yöntemini ağ belirler, ama gelir üzerindeki en büyük etkiyi yöntem değil
tahminin kesinliği yapar.** İyi kurulmuş bir O&D kontrolü kötü bir tahminle
çalışırsa, basit bir leg kontrolünün iyi tahminle yaptığından fazla para
kaybettirebilir.

![Sunumun kapak slaytı. Solda başlık: Gelir Yönetimi Alternatifleri ve Talep Tahmini. Alt başlık: Havacılıkta Envanter Kontrolü ve Optimizasyon Motoru. Sağda teknik çizim tarzında bir dünya haritası; Kuzey Amerika, Güney Amerika, Avrupa ve Afrika üzerindeki şehir noktaları yay biçimli uçuş hatlarıyla birbirine bağlanmış, kenarlarda ölçü çizgileri var.](/decks/rm-alternatives/01.webp "Haritadaki hatlar tek tek bacaklar, ama yolcu çoğu zaman birden fazlasını birlikte satın alıyor. Bölümün ilk sorusu bu farkın envantere nasıl yansıdığı.")

## Kontrol yöntemini ağın karmaşıklığı seçiyor

Bir havayolunun koltuk envanterini kontrol etmek için iki temel seçeneği var.
Birincisi leg ya da segment bazlı kontrol: her uçuş bacağı kendi içinde
bağımsız yönetiliyor. A'dan B'ye giden uçağın hangi rezervasyon sınıfının açık
kalacağına, o uçağa binen yolcunun nereden gelip nereye gittiğine bakılmadan
karar veriliyor. İkincisi O&D (origin and destination, başlangıç ve varış)
bazlı kontrol: yolcunun tüm seyahati bütünsel olarak değerlendiriliyor. A'dan
C'ye B üzerinden giden yolcu, A-B bacağında yalnızca o bacağın yolcusu gibi
değil, iki bacaklık bir gelir kalemi olarak görülüyor.

Seçimi belirleyen şey ağın yapısı ve büyüklüğü. Dünyadaki havayollarının büyük
çoğunluğu leg ya da segment bazlı kontrol kullanıyor. Daha karmaşık O&D
kontrolünü tercih edenler ise yaklaşık 25-30 büyük ağ taşıyıcısı. Bu sayı az
görünebilir ama nedeni açık: O&D kontrolünün getirisi, aktarmalı trafiğin
toplam içindeki payıyla büyüyor. Noktadan noktaya uçan bir havayolunda
yolcunun seyahati zaten tek bacak; O&D kontrolü orada ek bir şey görmüyor.
Hub üzerinden binlerce bağlantı kuran bir taşıyıcıda ise aynı koltuk, bir
yolcuya yerel bacak olarak, bir diğerine uzun bir yolculuğun ilk ayağı olarak
satılıyor ve ikisinin değeri çok farklı olabiliyor.

![Başlık: Envanter Kontrol Stratejileri, Leg/Segment vs. O&D. İki panel. Sol panelde A ve B noktaları arasında tek bir hat, altında Bacak/Segment Kontrolü. Kullanım: dünya çapındaki havayollarının büyük çoğunluğu. Mantık: her uçuş bacağı kendi içinde bağımsız yönetilir. Varsayım: rezervasyon sınıfları arasında bağımsız talep (kısıtlamalı ücretlerin olduğu geleneksel model). Sağ panelde A, B ve C noktaları, B vurgulu bir aktarma noktası, altında O&D Kontrolü. Kullanım: dünyanın en büyük 25-30 ağ taşıyıcısı. Mantık: yolcunun başlangıç ve varış noktası (tüm seyahat) bütünsel olarak kontrol edilir. Etken: LCC'lerin (düşük maliyetli taşıyıcılar) 1990'larda kısıtlamasız ücretleri getirmesiyle ortaya çıkan bağımlı talep yapısı.](/decks/rm-alternatives/02.webp "Sağ paneldeki B noktası büyütülmüş, çünkü O&D kontrolünün bütün gerekçesi aktarma noktasında aynı koltuğa iki farklı değerde yolcunun talip olması.")

Yazılım tarafında bunun karşılığı veri modelinde görünüyor. Leg bazlı bir
envanter, uçuş numarası, tarih ve bacak anahtarıyla indekslenen bir sınıf
tablosuyla yaşayabiliyor. O&D kontrolü ise kararı yolculuk düzeyine taşıyor:
bir bacağın koltuğunu satıp satmama kararı, o koltuğu kullanacak bütün
yolculukların beklenen değerine bakmak zorunda. Bu yüzden iki yöntem arasındaki
geçiş bir parametre değişikliği değil, envanter modelinin anahtarını
değiştiren bir mimari karar.

## Bağımsız talep varsayımı ürün kısıtlamalarına dayanıyor

Leg bazlı kontrolün altında sessiz bir varsayım var: rezervasyon sınıfları
arasındaki talep birbirinden bağımsız. Yani ucuz sınıfı kapattığınızda o
sınıfın yolcusu gidiyor, pahalı sınıfa geçmiyor; pahalı sınıfın talebi de ucuz
sınıfın açık olup olmamasından etkilenmiyor.

Bu varsayımın dayanağı bir iş kuralı. Kaynak metne göre bağımsızlık, fiyatların
güçlü kısıtlamalarla korunduğu ve müşteri segmentlerinin birbirinden net
şekilde ayrıldığı durumlarda geçerli. Hafta sonu kalma şartı, iade yasağı,
erken satın alma zorunluluğu gibi kurallar iş yolcusunu ucuz sınıftan uzak
tutuyor; bu sayede iki sınıfın talebi gerçekten iki ayrı kitleden geliyor.

Varsayımı kıran şey düşük maliyetli taşıyıcılar oldu. Slaytın ifadesiyle
LCC'ler 1990'larda kısıtlamasız ücretleri getirdi ve bununla bağımlı talep
yapısı ortaya çıktı. Kısıtlama yoksa yolcu, açık olan en ucuz sınıfı satın
alıyor. Ucuz sınıf açıkken pahalı sınıfın talebi sıfıra yaklaşıyor, ucuz sınıf
kapanınca aynı yolcu bir üst sınıfa kayıyor. Talep artık sınıfa değil, o an
açık olan fiyata bağlı. Kaynak metin burada net: pazarda kısıtlamasız fiyatlar
yaygınsa talep bağımlılığı artıyor ve sistem mantığının buna göre güncellenmesi
gerekiyor.

Mühendislik açısından önemli olan, bu varsayımın kodda bir yerde açıkça
yazmıyor olması. Bağımsız talep modeli, her sınıf için ayrı bir talep tahmini
üretip onları koruma seviyelerine çeviren algoritmanın içine gömülü. Ürün
ekibi kısıtlamaları gevşettiğinde, yani fiyat yapısını değiştirdiğinde,
optimizasyon motorunun varsaydığı dünya da değişiyor ama motor bunu bilmiyor.
Ücret yapısı değişikliği ile tahmin modelinin gözden geçirilmesi aynı karar
olarak ele alınmalı.

## Gelir yönetimi tek yönlü bir boru hattı değil, kapalı bir döngü

Sunumun ekosistem slaytı gelir yönetimini dört durağı olan bir döngü olarak
çiziyor: veri toplama, tahminleme, envanter kontrolleri ve geri bildirim. Veri
host CRS ve DCS'ten geliyor, tahminleme geçmiş verileri güncelleyip analiz
ediyor, envanter kontrolleri çifte rezervasyon (overbooking) ve indirim
tahsisleri üretiyor, geri bildirim de performans raporlaması ve kritik durum
tespitiyle döngüyü başa bağlıyor.

![Başlık: Gelir Yönetimi Ekosistemi. Sonsuzluk işaretine benzeyen iç içe oklardan oluşan bir döngü, dört durakla. Üstte Veri Toplama; açıklaması veri kaynakları, Host CRS / DCS rezervasyon ve kalkış sonrası verileri. Sağda Tahminleme; açıklaması talep tahmini, geçmiş verilerin güncellenmesi ve analizi. Altta Envanter Kontrolleri; açıklaması çifte rezervasyon (overbooking) ve indirim tahsisleri (discount allocations). Solda Geri Bildirim; açıklaması sürekli geri bildirim, performans raporlama ve kritik durum tespiti. Alttaki kutu: başarılı bir gelir yönetimi, modellerin öngörülebilirliğini ve doğruluğunu artırmak için kesintisiz bir geri bildirim döngüsüne dayanır.](/decks/rm-alternatives/03.webp "Döngünün kapanması, envanter kararlarının sonucunun bir sonraki tahminin girdisi olması demek. Bu da hatanın bir kez yapılıp geçmediğini, döngüye geri beslendiğini gösteriyor.")

Döngü olarak çizmenin anlamı şu: envanter kontrolünün bugün verdiği karar,
yarın toplanacak verinin ne olacağını belirliyor. Bir sınıfı kapatırsanız, o
sınıfa gelecek rezervasyonları hiç görmüyorsunuz. Geçmiş veri, geçmişteki
envanter kararlarınızın filtresinden geçmiş talep. Bu yüzden veri toplama
adımı yalnızca rezervasyonu kaydetmekle yetinemiyor.

## Satılan bilet talebin tamamını göstermiyor

Kaynak metnin veri toplama konusundaki ana iddiası, yalnızca gerçekleşen
rezervasyon verisinin yeterli olmadığı. Talebin gerçek boyutunu, yani
kısıtlanmamış talebi (unconstrained demand) tahmin etmek için sistemin
geçmişteki rezervasyon sınıflarının açık ya da kapalı olma durumunu da
toplaması gerekiyor. Bir sınıf kapalıyken o sınıfa hiç rezervasyon gelmemesi,
talebin olmadığı anlamına gelmiyor; talebin reddedildiği anlamına geliyor.
Açık/kapalı durum bilgisi olmadan bu iki durum veride aynı görünüyor: sıfır.

Sunumun veri mimarisi slaytı RM motorunu besleyen üç kaynağı ayrı ayrı
gösteriyor. Host CRS gecelik rezervasyon verisini ve kısıtlanmamış talebi
hesaplamak için gereken sınıf durumlarını veriyor. DCS, yani kalkış kontrol
sistemi, uçuş sonrasında gerçekleşen yolcu hareketlerini veriyor: kim gerçekten
uçtu, kim gelmedi. Gelir muhasebesi de bacak ya da segment bazlı gelir
tahminlerini sağlıyor.

![Başlık: Sistemin Yakıtı, Veri Toplama Mimarisi. Solda üç kaynak kutusu, sağda RM Motoru yazan büyük bir işlemci kutusu; kaynaklardan motora üç kalın akış hattı gidiyor. Host CRS (Merkezi Rezervasyon): gecelik rezervasyon verileri; kısıtlanmamış talebi (unconstrained demand) hesaplamak için sınıfların Açık/Kapalı (Open/Close) statüleri. DCS (Kalkış Kontrol Sistemi): uçuş sonrası gerçekleşen gerçek veriler (kalkış sonrası yolcu hareketleri). Gelir Muhasebesi: O&D bilet ücretlerinin oransal dağıtımı (proration) ile hesaplanan bacak/segment bazlı gelir tahminleri.](/decks/rm-alternatives/04.webp "Üç hattın üçü de gecikmeli veri taşıyor: gecelik, uçuş sonrası, muhasebe sonrası. RM motoru hiçbir zaman şimdiki anı görmüyor, en taze haliyle dünü görüyor.")

Brifingin çıkarımı bu kaynakların birleştirilmesi yönünde: yalnızca
rezervasyon verisiyle yetinmeyip DCS verilerini ve sınıf doluluk durumlarını
(IDR/IND kayıtları) tahmin modellerine entegre etmek. Yazılım tarafında
bunun somut karşılığı, sınıf açık/kapalı geçişlerinin zaman damgalı bir olay
olarak saklanması. Yalnızca son durumu tutan bir envanter tablosu, geçmişte
bir sınıfın hangi gün hangi saatte kapandığını söyleyemiyor; o zaman da
arındırma yapılamıyor.

## Leg bazlı sistem geliri bilete değil paylaştırmaya bakarak hesaplıyor

Veri mimarisinin üçüncü hattı leg bazlı kontrolün bir zaafını ortaya çıkarıyor.
Yolcu bileti O&D düzeyinde alıyor: A'dan C'ye tek bir fiyat. Ama leg bazlı
sistem kararını A-B ve B-C bacakları için ayrı ayrı veriyor. Her bacağın
gelirini bilmesi gerekiyor, fakat biletin üzerinde bacak başına bir fiyat
yazmıyor.

Kaynak metne göre bu sistemlerde gelir doğrudan bilet fiyatı üzerinden
değil, O&D bilet ücretlerinin proration (oranlama, paylaştırma) yöntemiyle her
bir bacağa dağıtılmasıyla elde edilen tahmini değerler üzerinden hesaplanıyor.
Yani leg bazlı sistemin kullandığı gelir rakamı bir ölçüm değil, bir türetim.
Paylaştırma kuralı ne kadar gerçekçiyse, bacak düzeyindeki karar da o kadar
doğru.

Bu ayrıntı iki yöntem arasındaki farkı başka bir açıdan da gösteriyor. O&D
kontrolü yolculuğun gerçek değerine bakarak karar veriyor; leg kontrolü ise
o değerin bacaklara nasıl bölündüğüne dair bir varsayıma bakarak. Aktarmalı
trafik arttıkça bu varsayımın kararlar üzerindeki ağırlığı da artıyor, ve bu
da büyük ağ taşıyıcılarının neden O&D'ye geçtiğinin bir başka açıklaması.

## Tahmin ne kadar kesinse kontrol o kadar agresif olabiliyor

Sunum RM bileşenleri arasında finansal etkisi en yüksek olanın talep
tahminindeki kesinlik olduğunu söylüyor. Bu iddianın mekanizması belirsizlik
ile kontrolün sertliği arasındaki ilişkide yatıyor.

Kaynak metnin kuralı şöyle: talep belirsizliği azaldıkça, yani tahmin
doğruluğu arttıkça, sistem daha agresif envanter kontrolleri uygular.
Belirsizlik yüksek olduğunda ise gelir kaybını (dilution, seyrelme) önlemek
için daha muhafazakar bir kontrol mekanizması devreye alınır. Agresif kontrol,
yüksek ücretli talebin geleceğinden emin olup ona koltuk saklamak demek. Emin
değilseniz, o koltuğu saklamak boş kalma riskini de beraberinde getiriyor.

![Başlık: Talep Tahmini ve Belirsizlik Dengesi. Yatay bir sürgü: sol yarısı turuncu, sağ yarısı mavi, sağ tarafta bir ayar düğmesi. Sol uç, Yüksek Belirsizlik, Yüksek Hata Payı: muhafazakar envanter kontrollerini zorunlu kılar, sonuç gelir seyrelmesi (revenue dilution). Sağ uç, Düşük Belirsizlik, Yüksek İsabet: kapasite ile kısıtlanmamış talebin kusursuz eşleşmesi, daha agresif ve kesin kontroller, sonuç maksimum gelir optimizasyonu. Alttaki kutu: RM bileşenleri arasında finansal etkisi en yüksek olan unsur, talep tahminindeki kesinliktir. Belirsizlik azaldıkça, sistemin agresifleşme kapasitesi artar.](/decks/rm-alternatives/05.webp "Ayar düğmesi sürgünün mavi tarafında duruyor ama oraya kendiliğinden gitmiyor. Düğmenin nerede duracağını tahminin güven aralığı belirliyor, satış hedefi değil.")

Brifingin önerdiği iş kuralı bu ilişkiyi otomatik hale getirmek: tahmin
modelindeki belirsizlik oranına göre envanter kontrolleri dinamik olarak
ayarlanmalı, belirsizlik katsayısı yüksekse sistem kendiliğinden korumacı
moda geçmeli. Yazılım tarafında bunun anlamı, tahmin modülünün yalnızca bir
nokta tahmini değil, o tahminin ne kadar güvenilir olduğunu da çıktı olarak
vermesi. Optimizasyon motoru yalnızca ortalamayı alıyorsa, yeni açılmış bir
rotadaki kararsız tahminle on yıllık bir rotadaki oturmuş tahmini aynı
güvenle kullanıyor demek.

## İki yönlü hatanın bedeli aynı değil

Tahmin iki yönde yanlış olabiliyor ve kaynak metin ikisinin de zararlı
olduğunu kabul ediyor, ama aynı ağırlıkta görmüyor.

Fazla tahmin (over-forecasting) durumunda sistem yüksek ücretli talebi
olduğundan fazla sanıyor. Kaynak metnin anlatımıyla, fazla tahmin, yüksek
rezervasyon sınıfları için talepten fazla koltuğun korunmasına ve kalkışta
boş koltuklara yol açıyor. Bu koltuklar düşük ücretli yolcuya satılabilirdi;
onun yerine hiç gelmeyecek yüksek ücretli yolcuya saklandılar ve uçak onlarla
boş kalktı. Sunum bunu gelir üzerindeki en yıkıcı etki olarak işaretliyor.
Brifingin analizi de aynı iş mantığını destekliyor: boş koltukla kalkmanın
maliyeti, düşük ücretli yolcu taşımaktan daha ağır.

Eksik tahmin (under-forecasting) durumunda ise tersi oluyor. Değerli sınıflara
az yer ayrılıyor, erken gelen indirimli talep gereğinden fazla kabul ediliyor.
Kaynak metin bunu daha fazla indirimli yolcunun kabul edilmesi olarak anlatıyor
ve adını koyuyor: spiral down etkisi. Son dakikada gelen yüksek bütçeli yolcu
için yer kalmıyor ve kayıp, yüksek ve düşük bilet arasındaki ücret farkı kadar.

![Başlık: Hatalı Tahminin Maliyeti. Soldan gelen bir hat ikiye ayrılıyor. Üstteki turuncu kol, Aşırı Tahmin (Over-forecasting), bir uçak koltuğu çizimine gidiyor. Sorun: yüksek ücretli sınıflar için gereğinden fazla koltuk korunması. Sonuç: kalkış anında boş koltuklar (spoilage), gelir üzerindeki en yıkıcı etki. Alttaki gri kol, Eksik Tahmin (Under-forecasting), aşağı doğru dönen bir sarmal çizimine gidiyor. Sorun: değerli sınıflara az yer ayrılıp erken gelen indirimli talebin gereğinden fazla kabul edilmesi. Sonuç: sarmal etkisi (spiral down effect), yüksek bütçeli son dakika yolcuları için yer kalmaması, yüksek ve düşük bilet arasındaki ücret farkı kadar gelir kaybı.](/decks/rm-alternatives/06.webp "Üstteki kaybın tamamı kalkışta ortaya çıkıyor; alttaki ise sarmal çizildiği için tek seferlik değil, kendini besleyen bir kayıp.")

Spiral down adının neden sarmal olduğu, ekosistem döngüsüyle birlikte
okununca anlaşılıyor. Eksik tahmin ucuz sınıfları açık tutuyor. Ucuz sınıflar
açık kalınca bağımlı talep ortamında yüksek ücretli yolcunun bir kısmı da ucuz
sınıftan alıyor. Bir sonraki tahmin turunda veri, yüksek ücretli talebin
daha da az olduğunu gösteriyor, çünkü o yolcular düşük sınıfta kaydedildi.
Model daha da az koruyor. Döngü, gerçekte değişmemiş talebi her turda biraz
daha aşağı çekiyor. Bu, bağımsız talep varsayımının kısıtlamasız fiyat
ortamında çalıştırılmasının doğrudan sonucu; bu yüzden brifing, talep
bağımlılığının yüksek olduğu ortamlarda bağımsız talep modellerinden bağımlı
talep tahmini ve optimizasyon modellerine geçilmesini öneriyor.

## Küçük tahmin iyileştirmesi gelirde çarpan etkisi yapıyor

Tahminin kesinliğine bu kadar ağırlık verilmesinin bir sayısal gerekçesi var.
Kaynak metnin aktardığına göre Poelt (1998), tahmin hatasındaki yüzde 20'lik
bir azalmanın yüzde 1'lik ek gelir artışına dönüşebileceğini tahmin etmiş.
Sunum aynı sonucu Lee (1990) ve Fiig ve arkadaşlarının (2019) simülasyonlarına
da bağlıyor.

![Başlık: Kesinliğin Finansal Değeri. Arka planda yükselen bir alan grafiği ve bir jet motorunun teknik çizimi. Ortadaki kutuda büyük harflerle: yüzde 20 tahmin hatası azalması eşittir yüzde 1 ekstra gelir artışı. Altta: Poelt (1998), Lee (1990) ve Fiig vd. (2019) simülasyonlarıyla kanıtlanmıştır. Yeterli veri hacmi, veri doğruluğu ve aykırı değerlerin (outliers) tespiti doğrudan karlılığa dönüşür.](/decks/rm-alternatives/07.webp "Yüzde 1 küçük görünüyor ama payda bir havayolunun toplam yolcu geliri. Denklemin sol tarafı ise veri kalitesiyle kazanılıyor, algoritmayla değil.")

Yüzde 1'lik bir artışın neden önemli olduğu, neyin yüzde 1'i olduğuyla
ilgili: bu bir rotanın değil, sistemin kontrol ettiği gelirin tamamının
yüzdesi. Brifing bunu küçük görünen tahmin iyileştirmelerinin çarpan etkisi
olarak okuyor. Sunumun alt satırı da iyileştirmenin nereden geldiğini
söylüyor: yeterli veri hacmi, veri doğruluğu ve aykırı değerlerin tespiti.
Yani yüzde 20'lik hata azalmasının önemli bir kısmı, önceki başlıklarda
anlatılan veri toplama işinden geliyor. Kapalı sınıfın sıfırını talep
yokluğu sanmayan, DCS'ten gelen gerçekleşmeyi rezervasyonla eşleyen bir veri
hattı, tahmin algoritmasını değiştirmeden hatayı düşürebiliyor.

## Geçmiş veri geleceği temsil etmediğinde tahmin modeli durmalı

Bütün bu yapı bir varsayıma dayanıyor: geçmişteki talep kalıpları gelecekteki
talebi temsil ediyor. Tahmin modelleri geçmiş veriyi güncelleyip analiz
ederek çalışıyor; geçmiş bozulursa model de bozuluyor.

COVID-19 bu varsayımın kırıldığı an. Sunumun ifadesiyle küresel krizler
havayolu talep kalıplarını kalıcı olarak değiştirdi ve gelecek talep artık
geçmişin bir kopyası değil. Kaynak metin bu durumda karar mantığının nasıl
değişmesi gerektiğini de söylüyor: geçmiş verilere dayalı geleneksel
tahminleme modelleri yerine sürekli talep yönetimi (Continuous Demand
Management) yaklaşımı benimsenmeli. Bu yaklaşım geçmiş veriden çok anlık
taktiksel iş akışlarına ve güncel KPI takibine odaklanan bir karar mekanizması
gerektiriyor.

![Başlık: Yeni Dönem, Kara Kuğu Olayları ve Kesintisiz Talep Yönetimi. Görsel ortadan bir çatlakla ikiye bölünmüş; çatlağın üzerinde uyarı bandı biçiminde COVID-19 Etkisi yazan bir levha. Sol tarafta çelik kirişler, dişliler ve bir saat; kutu başlığı Geçmiş (Tarihsel Veriye Bağımlılık): COVID-19 gibi küresel krizler havayolu talep kalıplarını kalıcı olarak değiştirdi, gelecek talep artık geçmişin bir kopyası değil. Sağ tarafta ışıklı veri kabloları ve bağlantı noktaları; kutu başlığı Gelecek (Kesintisiz Talep Yönetimi / Continuous Demand Management): sadece tarihsel verilere dayanmayan, taktiksel iş akışlarına sahip yeni bir yaklaşım; anlık KPI yönetimi ve pazar dinamiklerine anında adaptasyon.](/decks/rm-alternatives/08.webp "Soldaki yapı ağır ve sabit, sağdaki ise akış halinde. Mesele modeli daha iyi eğitmek değil, geçmişin geçersiz olduğunu tanıyıp kararın ağırlığını anlık sinyale kaydırmak.")

Brifingin kriz protokolü bunu somut hale getiriyor: pandemi gibi olağanüstü
durumlarda geçmiş veri setleri devre dışı bırakılmalı ve anlık talebi yöneten
taktiksel iş akışları önceliklendirilmeli. Belirsizlik bölümündeki kuralla
birlikte okununca tutarlı bir tablo çıkıyor: belirsizlik arttıkça sistem
önce korumacı moda geçiyor, geçmiş verinin kendisi güvenilmez hale geldiğinde
ise tahmin modeli karar zincirinden çıkarılıp yerine insan ve anlık KPI'lar
giriyor.

Yazılım tarafında bu, tahmin modülünün devre dışı bırakılabilir olması
demek. Geçmiş veri penceresinin hangi tarih aralığını kapsadığını
yapılandırılabilir kılmak, belirli bir dönemi eğitim verisinden dışlayabilmek
ve optimizasyon motoruna tahmin yerine analistin girdiği değerleri besleyen
bir yol açık tutmak, kriz geldiğinde kod değişikliği gerektirmeyen bir geçiş
sağlıyor.

## Yarın işe yarayacak dört çıkarım

1. **Kontrolün sertliğini belirsizliğe bağla.** Tahmin modelindeki
   belirsizlik oranına göre envanter kontrollerini dinamik olarak ayarla.
   Belirsizlik katsayısı yüksekse sistem kendiliğinden korumacı moda geçsin;
   bunun için tahmin modülü nokta tahmininin yanında güvenilirliğini de
   çıktı olarak versin.
2. **Talebi rezervasyonla değil, reddedilenle birlikte ölç.** Yalnızca
   rezervasyon verisiyle yetinme; DCS verilerini ve sınıf doluluk durumlarını
   (IDR/IND kayıtları) tahmin modellerine entegre et. Sınıfların açık/kapalı
   geçişlerini zaman damgalı sakla ki kapalı sınıfın sıfırı talep yokluğu
   sanılmasın.
3. **Ücret yapısı gevşediğinde modeli değiştir.** Kısıtlamasız fiyatların
   yaygınlaştığı, talep bağımlılığının yüksek olduğu ortamlarda bağımsız
   talep modellerinden bağımlı talep tahmini ve optimizasyon modellerine geç.
   Aksi halde eksik tahmin spiral down etkisiyle kendini besler.
4. **Kriz için tahmini kapatabilen bir yol hazırla.** Pandemi gibi
   olağanüstü durumlarda geçmiş veri setlerini devre dışı bırak ve anlık
   talebi yöneten taktiksel iş akışlarını önceliklendir. Bu geçişin kod
   değişikliği gerektirmemesi için veri penceresini ve manuel girdi yolunu
   önceden yapılandırılabilir kıl.

Bu bölümde ne yok: reddedilen talebin nasıl modellendiği ve kapasiteyle
ilişkisi (spill bölümleri), yüksek varyanslı talebin dağılımı ("Yüksek
varyanslı talep ve iki aşamalı Cox dağılımı"), O&D gelirinin bacaklara hangi
anlaşmalarla bölündüğü ("Havacılıkta gelir paylaşımı: çok taraflı ve ikili
prorate anlaşmaları (MPA ve SPA)"). Bu bölüm o parçaların üzerine oturduğu
RM sisteminin iskeletini ve iskeleti en çok neyin bozduğunu anlatmak için var.
