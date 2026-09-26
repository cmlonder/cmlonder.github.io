---
title: "Havacılık ücret kuralları ve yolculuk tipleri stratejik analizi"
domain: "aviation"
summary: "Ücret kuralları pazarı segmentlere bölmek için yazılıyor, yolcular da o kuralların boşluklarını arıyor: çakışan biletler, saklı şehirler, ucuz ülkeden başlayan seyahat. Bu bölüm bu üç taktiğin hangi fiyatlandırma mantığını sömürdüğünü, gelir bütünlüğü yazılımının onları nasıl yakaladığını ve tek yön, gidiş-dönüş, çember, açık çene ve dünya turu gibi yolculuk tiplerinin sistemde nasıl modellendiğini anlatıyor."
audience: "Fiyatlandırma, alışveriş (shopping), biletleme ya da PNR tarafında çalışan ve ücret kurallarının neden bu kadar katı yazıldığını anlamak isteyen yazılımcı ve ürün insanı. Gelir yönetimi bölümlerinin okunmuş olması işe yarar; back-to-back biletleme, skiplagging, POC, ATPCO kategorileri, ARNK ve open jaw metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture, use-case]
ai: generated
---

Gelir yönetimi bölümleri kısıtlı indirimin nasıl doğduğunu anlatmıştı:
Cumartesi gecesi kalma şartı gibi bir kural, esnek olmak zorunda olan iş
yolcusunu indirimli koltuktan uzak tutuyor. O kural bir kez yazıldıktan
sonra ne olduğunu ise pek konuşmadık. Kaynak metin cevabı tek cümlede
veriyor: yolcular pazarlık avcısı bir mantıkla hareket ediyor ve sıklıkla
ücret kurallarını bozmaya çalışıyor. **Ücret kuralı, yazıldığı gün bir
saldırı yüzeyi haline geliyor; havayolu fiyatlandırması statik bir katalog
değil, kural koyanla kuralı delen arasında hiç bitmeyen bir döngü.** Bu
bölüm o döngünün iki tarafını anlatıyor: yolcunun kullandığı üç taktik ve
havayolunun yolculuğu tanımlamak için kullandığı geometriler.

![Kapak slaytı. Ortada ince çizgilerle çizilmiş bir dünya küresi; Kuzey Amerika, Avrupa, Orta Doğu, Doğu Asya ve Güney Amerika üzerinde turuncu noktalar, aralarında eğri uçuş hatları. Başlık: Havacılıkta Biletleme Mimarisi. Alt başlık: Ücret Kuralları, Rota Stratejileri ve Yolculuk Türleri. Sunucu notları: sunum teklif ve sipariş yönetimi (Offer and Order Management) dünyasını, alışveriş, fiyatlandırma ve biletleme akışlarını inceliyor; havayolunun teklifleri rotalar ve kurallarla nasıl kurduğu ile tüketicinin biletleme açıklarını kullanarak bu kurguyu nasıl manipüle ettiği arasında köprü kuruyor.](/decks/fare-rules-journey-types/01.webp "Küredeki hatlar tek bir rotayı değil, birbirine bağlanan birkaç bileti gösteriyor olabilir. Bu bölümün sorusu tam da o: sistem bir yolculuğu nereden tanıyor.")

## Kural segmentasyonu korumak için var, boşluk onu çözüyor

Havayolu gelir yönetimi segmentasyona dayanıyor. İş seyahati yapan yolcu
esneklik istiyor ve Cumartesi gecesi kalma kuralına uymuyor; bu yüzden daha
yüksek ücret ödüyor. Minimum kalış süresi gibi kısıtlamalar bu ayrımı
algoritmik olarak kilitliyor. Yolcu tarafında ise hedef aynı kilidin
açılması: katı kısıtlamaları aşmak ve aktarmalı fiyatlandırmadaki
algoritmik boşluklardan yararlanmak.

Sunumun terimi burada önemli. Yolcunun bulduğu her yasal boşluk
segmentasyonu tahrip ediyor ve getiri kaybına (yield spillage) yol açıyor.
Yani sorun tek bir biletin ucuza satılması değil; yüksek ücret ödemesi
beklenen segmentin düşük ücrete sızması. Bir boşluk yayıldıkça, o boşluğun
kapattığı segmentin geliri de sızıyor.

![İkiye bölünmüş slayt. Sol yarı, Kusursuz Fiyatlandırma: sürgüleri ve kilidiyle kapalı bir kasa kapısı; altında havayollarının pazar segmentasyonunu korumak ve kârı maksimize etmek için kuralları ve kısıtlamaları (minimum kalış süresi gibi) algoritmik olarak birbirine kilitlediği yazıyor. Sağ yarı, Akıllı Yolcu: bir dünya haritası üzerinde büyüteç, büyütecin içinde turuncu rotalar; altında yolcuların sistemin katı kısıtlamalarını aşmak ve aktarma fiyatlandırmalarındaki algoritmik boşluklardan faydalanmak için yaratıcı kural delme stratejileri geliştirdiği yazıyor. Sunucu notları: gelir yönetimi segmentasyona dayanır; iş seyahati yapanlar esneklik ihtiyacı ve Cumartesi gecesi kalış kuralına uymamaları nedeniyle daha yüksek ücret öder; yolcuların bulduğu yasal boşluklar segmentasyonu tahrip ederek getiri kaybına (Yield Spillage) yol açar.](/decks/fare-rules-journey-types/02.webp "Kasa ile büyüteç aynı haritaya bakıyor. Kasanın her yeni sürgüsü, büyüteç için yeni bir incelenecek nokta demek.")

Aşağıdaki üç taktik bu boşluğun üç farklı katmanını kullanıyor: biri
kuralın kendisini, biri O&D fiyatlandırmasını, biri de biletin başladığı
coğrafyayı.

## Çakışan biletler kuralı değil kuponları kullanıyor

Minimum kalış kuralını delmenin yolu kuralla tartışmak değil, iki bileti
üst üste bindirmek. Yolcu aynı varış noktası için iki ayrı gidiş-dönüş
bileti alıyor. Birinci biletin gidiş kuponuyla gidiyor, ikinci biletin ilk
kuponuyla dönüyor. Her iki bilet de kendi içinde kurala uyuyor; aradaki
kısa seyahati ise hiçbir bilet tek başına görmüyor.

Sunumdaki örnek bunu tarihlerle gösteriyor. Birinci bilet 1 Mayıs'ta
DFW'den SEA'ya gidiyor, 15 Temmuz'da dönüyor. İkinci bilet 4 Mayıs'ta
SEA'dan DFW'ye geliyor, 11 Temmuz'da geri gidiyor. Yolcu 1 Mayıs'ta gidip
4 Mayıs'ta dönüyor; üç günlük bir iş seyahatini, uzun kalışlı iki indirimli
biletin ilk kuponlarıyla yapmış oluyor. Temmuz'daki iki kupon da aynı
şekilde ikinci bir kısa seyahate dönüşebiliyor.

![Başlık: Çakışan Uçuşlar (Back-to-Back Ticketing). Amaç: minimum kalış (örneğin Cumartesi gecesi) kuralını delmek. Üst sırada Bilet 1: DFW-SEA 1 Mayıs ve SEA-DFW 15 Temmuz kuponları. Alt sırada Bilet 2: SEA-DFW 4 Mayıs ve DFW-SEA 11 Temmuz kuponları. Zikzak turuncu bir ok Bilet 1'in ilk kuponundan Bilet 2'nin ilk kuponuna iniyor; balon: gerçekleşen uçuş, yolcu Bilet 1'in ilk kuponuyla 1 Mayıs'ta gider, Bilet 2'nin ilk kuponuyla 4 Mayıs'ta döner. Uyarı kutusu, Risk: havayolları bunu kesinlikle yasaklar, tespit edilirse sık uçan yolcu hesapları kapatılabilir. Sunucu notları: her uçuş bacağı bir bilet kuponudur ve elektronik bilette OPEN, FLOWN, VOID gibi durum kodları alır; gelir bütünlüğü (Revenue Integrity) yazılımları aktif PNR veritabanlarında toplu taramalarla kurgusal isimleri ve çakışan bilet anomalilerini tespit eder; minimum kalış şartları ATPCO Kategori 10 altında dosyalanır.](/decks/fare-rules-journey-types/03.webp "Oka dikkat: iki bilet arasında dolaşıyor. Tek bileti doğrulayan hiçbir kural bu oku göremez, ancak biletleri yan yana koyan bir tarama görür.")

Yazılım tarafında bunun karşılığı açık: fiyatlandırma motoru kuralı bilet
kapsamında doğruluyor, ihlal ise biletler arası. Kaynak metin tespit işini
buna göre tarif ediyor: gelir bütünlüğü (revenue integrity) yazılımı,
kuralları ihlal eden müşterileri bulmak için aktif PNR'ları tarıyor. Bakılan
sinyaller aynı yolcu adı, çakışan uçuş tarihleri, aynı güzergâh çiftleri ve
biletlerin birbirini tamamlayan kupon yapısı. Sunum bir adım daha ekliyor:
bu taramalar kurgusal isimleri de arıyor. Yani tespit, fiyatlandırma anında
değil sonradan, rezervasyon veritabanı üzerinde çalışan bir toplu iş. Kural
tek bir kayıtta değil, kayıtlar arasındaki ilişkide yaşıyor.

Yaptırım da bu ilişkiyi hedefliyor. Havayolları bu yöntemi yasaklıyor ve
tespit edilirse sık uçan yolcu hesabını kapatabiliyor. Brifingin önerisi de
aynı yönde: özellikle uluslararası rotalarda back-to-back biletlemeyi
durdurmak için gelir bütünlüğü yazılımı sadakat programı verisiyle entegre
çalışmalı. Mantıklı, çünkü iki ayrı PNR'ı aynı kişiye bağlamanın en güvenilir
anahtarı isim değil, üyelik numarası.

Kuralın kendisi de hareket ediyor. Brifinge göre ABD iç pazarında Cumartesi
gecesi konaklama zorunluluğu 2020 sonrasında kalktı ve bu, yolcu
manipülasyonunu azalttı. Kuralı delmenin en kesin yolu, kuralın
kaldırılması oldu.

## Saklı şehir, fiyatın bacaklardan toplanmadığını sömürüyor

İkinci taktik kurala değil fiyatın nasıl kurulduğuna dayanıyor. Bir
bağlantılı uçuş (A-B-C), doğrudan uçuştan (A-B) ucuz olabiliyor, çünkü
havayolu A-C pazarındaki rekabet yüzünden o rotada fiyat kırıyor. Yolcu A-C
biletini alıp B'de iniyor, son bacağa binmiyor.

Sunumdaki örnekte LGA'dan (New York) Omaha'ya (OMA) direkt uçuş 500 dolar,
Omaha aktarmalı LGA-Phoenix (PHX) bileti 300 dolar. Yolcu Omaha'da iniyor ve
200 dolar tasarruf ediyor. Bunun mümkün olmasının sebebi O&D
fiyatlandırması: havayolu fiyatı bacakların toplamına göre değil, LGA-PHX
pazarındaki rekabete göre belirliyor. Aynı koltuk, iki farklı pazarın
fiyatıyla satılıyor.

![Başlık: Saklı Şehirler (Skiplagging). Mantık: tek yönlü direkt uçuşların aktarmalı uçuşlardan daha pahalı olabilmesi. Üç havalimanı: 1 LGA (New York), 2 OMA (Omaha), 3 PHX (Phoenix). LGA'dan OMA'ya koyu gri ok, üzerinde 500 dolar. LGA'dan PHX'e turuncu ok, üzerinde 300 dolar; turuncu hat OMA üzerinden geçiyor ve OMA-PHX bacağının üzerinde büyük bir turuncu X var. Balon: yolcu OMA'da iner ve son bacağı kullanmaz (200 dolar tasarruf). Sol kutu, kritik kısıtlamalar: bagaj yok, check-in bagajı kesinlikle verilemez çünkü bagaj her zaman biletteki son durağa gider; rezervasyon iptali, aktarmada uçağa binilmezse (no-show) rezervasyonun geri kalanı anında iptal olur; yasal durum, yasadışı olmasa da havayolları bunu taşıma sözleşmesi (Contract of Carriage) ihlali sayar. Sunucu notları: yöntem O&D fiyatlandırmasını sömürür, fiyat bacakların toplamına göre değil LGA-PHX pazarındaki rekabete göre belirlenir; yolcu uçağa binmediğinde DCS (Kalkış Kontrol Sistemi) no-show kaydeder, bu da envanteri boşaltmak için PSS'e kalan bacakları iptal etmesi için otomatik mesaj tetikler; BHS (Bagaj Taşıma Sistemleri) etiketteki son durağı okuduğu için kısa check-in yasaktır.](/decks/fare-rules-journey-types/05.webp "İki okun fiyatı ters: kısa olan pahalı. Bu hata değil, iki ayrı pazarın iki ayrı rekabet koşulunun aynı koltukta kesişmesi.")

Havayolunun cevabı burada bir iş kuralından çok bir sistem akışı. Kaynak
metne göre yolcu son bacağa binmezse tüm rezervasyon iptal ediliyor. Sunum
bu zinciri adım adım veriyor: yolcu uçağa binmediğinde kalkış kontrol
sistemi (DCS) bir no-show kaydediyor, bu kayıt envanteri boşaltmak için
PSS'e kalan bütün bacakları iptal etmesini söyleyen otomatik bir mesaj
tetikliyor. Bu yüzden saklı şehir yalnızca son bacakta çalışıyor; ilk
bacakta denenirse geri kalan her şey düşüyor.

Bagaj ikinci engel. Kayıtlı bagaj otomatik olarak biletin nihai varış
noktasına etiketleniyor; bagaj taşıma sistemi (BHS) etiketteki son durağı
okuyor ve bagaj Omaha'da değil Phoenix'te iniyor. Kısa check-in, yani
bagajı ara durağa etiketletmek yasak. Yazılımcı için ilginç olan şu:
havayolu bu taktiği tek bir yerde durdurmuyor, DCS, PSS ve BHS'in her biri
kendi alanında aynı sonucu zorluyor. Savunma bir servis değil, üç sistemin
ortak davranışı.

Hukuki durum gri. Kaynak metin, gizli şehir biletlemesinin bazı taşıyıcılar
tarafından taşıma sözleşmesinin ihlali sayıldığını ama yasal kabul
edildiğini söylüyor. Brifingin çözüm önerisi de teknik değil sözleşmesel:
bacaklardan birinin kaçırılması durumunda uygulanacak yaptırımlar, taşıma
sözleşmesinde net yazılmalı ve yolcuya biletleme aşamasında açıkça
gösterilmeli.

## Başlangıç noktası fiyatın para birimini de seçiyor

Üçüncü taktik coğrafi. Havayolları pazarın satın alma gücüne, yerel
rekabete ve döviz kuruna göre bölge bazlı fiyatlandırma yapıyor; biletin
hangi ülkede başladığı fiyatı belirliyor. Kaynak metnin somut örneği:
Krakow'dan (KRK) başlayan business class biletleri, Dallas'tan (DFW)
başlayanlara göre yüzde 30 daha ucuz.

Sunum bunu bir senaryoyla kuruyor. ABD'den Avrupa'ya yılda 6 ila 9 kez
business class uçan bir yolcu önce DFW-KRK gidiş-dönüş bileti alıyor ama
dönüşünü kullanmıyor. Bundan sonraki bütün seyahatlerini çıkış noktası KRK
olan biletlerle yapıyor. Biletler başlangıç noktası KRK olduğu için Polonya
zlotisiyle kesiliyor ve DFW çıkışlılara göre yüzde 30'a varan avantaj
sağlıyor. Sunum bu yöntemin tamamen yasal olduğunu da ekliyor.

![Başlık: Başlangıç Noktası Fiyatlandırması (Point of Commencement). Dünya haritasında iki fiyat etiketi: lacivert etiket DFW üzerinde, Çıkış Noktası ABD, yüksek maliyet endeksi; turuncu etiket KRK üzerinde, Çıkış Noktası Polonya, düşük maliyet endeksi, PLN. DFW'den KRK'ye kesikli bir hat, kullanılmayan dönüş bacağı (throwaway) etiketiyle; KRK'den Afrika üzerinden DFW'ye dönüp tekrar KRK'ye giden turuncu bir halka, sürekli döngü etiketiyle. Sağ sütun. Senaryo: ABD'den (DFW) Avrupa'ya (KRK) yılda 6-9 kez seyahat eden bir business class yolcusu. Uygulama: DFW-KRK gidiş-dönüş bileti alınır ama dönüş kullanılmaz; kalan tüm seyahatler için çıkış noktası KRK olan biletler alınır. Sonuç: biletlemeler başlangıç noktası KRK olduğu için Polonya zlotisiyle yapılır, DFW çıkışlılara göre yüzde 30'a varan maliyet avantajı sağlanır, yöntem tamamen yasaldır. Sunucu notları (DIN Alternate): fiyatlandırma algoritmaları başlangıç noktasına (POC) büyük ağırlık verir; ücretler NUC (Nötr Yapı Birimi) olarak dosyalanır ve ROE (döviz kuru) ile yerel para birimine çevrilir; ilk dönüş bacağı uçulmadığında bilet veritabanında süresi dolana kadar OPEN durumunda kalır, ancak saklı şehir taktiğinin aksine otomatik iptal cezalarını tetiklemez.](/decks/fare-rules-journey-types/04.webp "Kullanılmayan tek kupon bütün döngüyü açıyor. Saklı şehirdeki iptal zinciri burada çalışmıyor, çünkü atlanan kupon biletin son kuponu.")

Mekanizmanın teknik tarafı şöyle. Fiyatlandırma algoritmaları başlangıç
noktasına (point of commencement, POC) büyük ağırlık veriyor. Ücretler NUC
(nötr yapı birimi) cinsinden dosyalanıyor ve ROE, yani dönüşüm kuru ile
yerel para birimine çevriliyor. Satış noktasının para birimi değiştikçe,
aynı ücret yapısından farklı bir son fiyat çıkıyor.

Burada saklı şehirle ince ama önemli bir fark var. Kullanılmayan dönüş
bacağı bilet veritabanında süresi dolana kadar OPEN durumunda kalıyor ve
otomatik iptal cezası tetiklemiyor, çünkü arkasında iptal edilecek başka
kupon yok. Aynı "bacağa binmeme" davranışı, kuponun biletteki yerine göre
ya bütün rezervasyonu düşürüyor ya da hiçbir şey yapmıyor. Kupon durum
kodları (OPEN, FLOWN, VOID) bu yüzden raporlama ayrıntısı değil, gelir
bütünlüğünün asıl girdisi.

Brifingin bu taktiğe cevabı savunma değil fiyat: başlangıç noktası bazlı
uçurumları küçültmek için bölgesel kurlar ve pazar talebi gerçek zamanlı
izlenmeli, arbitraj fırsatı daraltılmalı. Brifing uluslararası pazarlarda
başlangıç noktasına bağlı fiyat farkının hâlâ önemli bir karar noktası
olduğunu söylüyor; ABD iç pazarındaki Cumartesi kuralının aksine burada
kural kaldırılarak çözülecek bir şey yok, fark pazarın kendisinden geliyor.

## Kuralın asıl işi kategorilerde, çoğu değişiklik anında çalışıyor

Bu taktiklerin hepsi bir kural setine karşı oynanıyor ve o kural seti
ATPCO kategorileri olarak dosyalanıyor. Minimum kalış şartı, back-to-back
biletlemenin hedefi, Kategori 10 altında duruyor. Sunum dört kategoriyi
daha öne çıkarıyor.

Kategori 31 gönüllü değişiklikleri, yani yeniden düzenleme ve bilet
değişimini algoritmik olarak yönetiyor. Sunum onu havacılıktaki en karmaşık
yazılım mantıklarından biri sayıyor: bilet değişirken ücreti manuel
müdahale olmadan yeniden hesaplamak için binlerce koşulu ayrıştırıyor.
Kategori 33 gönüllü rota değişikliği ve iadedeki kısıtlamaları belirliyor.
Kategori 35 anlaşmalı ve net ücretleri kapsıyor: seyahat acentesinin net
fiyatın üzerine kendi komisyonunu ekleyip GDS'te göstermesini sağlıyor ve
Sabre, Amadeus gibi GDS'ler aracılığıyla B2B dağıtımın nasıl çalıştığını
açıklıyor. Kategori 50 ise kural başlığı: geçerli coğrafya, yolculuk tipi
ve diğer temel şartlar hakkında yalnızca metin amaçlı bilgi taşıyor.

![Başlık: Havayolu Ücret Kuralları (Fare Rules) Altyapısı. Dört hücreli tablo, her birinde bir simge. Kategori 31, Gönüllü Değişiklikler (dişli simgesi): yeniden düzenleme ve bilet değişim işlemlerini algoritmik olarak yönetir. Kategori 33, Gönüllü Rota Değişikliği ve İade (geri dönüş oku): rota değişimlerindeki kısıtlamaları ve iade şartlarını belirler. Kategori 35, Anlaşmalı/Net Ücretler (fiyat etiketi ve el sıkışma): seyahat acentelerinin net fiyatların üzerine kendi komisyonlarını ekleyip GDS'lerde göstermesini sağlar. Kategori 50, Kural Başlığı ve Uygulama Varsayımı (küreli belge): geçerli coğrafya, yolculuk tipi ve diğer temel şartların sadece metin amaçlı bilgisini barındırır. Sunucu notları: bu kategoriler küresel otomatik havayolu fiyatlandırmasının omurgası olan ATPCO (Airline Tariff Publishing Company) tarafından tanımlanır; Kategori 31, manuel müdahale olmadan bilet değişimlerinde ücreti otomatik yeniden hesaplamak için binlerce koşulu ayrıştıran, havacılıktaki en karmaşık yazılım mantık sistemlerinden biridir; Kategori 35, Sabre ve Amadeus gibi GDS'ler aracılığıyla B2B dağıtımın nasıl çalıştığını açıklar.](/decks/fare-rules-journey-types/06.webp "Dört kategoriden ikisi biletin satıldığı anı değil sonrasını yönetiyor. Kuralın yükünün büyük kısmı satıştan sonra, değişiklik ve iadede taşınıyor.")

Buradan çıkan mühendislik dersi: bir ücret kuralı yalnızca satış anında
doğrulanan bir filtre değil. Kategori 31 ve 33 biletin ömrü boyunca, her
değişiklik isteğinde yeniden çalışıyor. Kategori 50'nin metin amaçlı
olması da ayrı bir uyarı: okunabilir kural metni ile makinenin uyguladığı
kural aynı şey değil, ve yolcuya gösterilen metin makinenin uyguladığını
tam anlatmıyor olabilir.

## Yolculuk tipi bir şablon, motor rotayı ona göre kuruyor

Kuralların öbür yüzü, havayolunun yasal esneklik olarak sunduğu yolculuk
tipleri. Alışveriş motorları ham uçuş programlarından geçerli yolculuklar
kurmak için bu şablonları kullanıyor. Temel geometri dört tane.

Tek yön, başlangıç noktasından varış noktasına tek yönlü hareket (örneğin
AUS-DFW). Gidiş-dönüş, varış noktasından seyahatin başladığı noktaya tam
geri dönüş (AUS-DFW-AUS). Çember seyahat (circle trip), birden fazla
noktaya uğrayıp aynı başlangıca dönüş (JFK-FCO-DEL-JFK) ve en az iki
duraklama (stopover) içeriyor. Dünya turu (round the world) ise tek yönde
uçup başlangıca dönmeyi gerektiriyor.

![Başlık: Yolculuk Geometrisi (Temel Rotalar). Dört hücreli tablo, her birinde basit bir diyagram. Tek Yön (One-Way): A'dan B'ye tek ok; başlangıç noktasından varış noktasına tek yönlü hareket (örneğin AUS-DFW). Gidiş-Dönüş (Roundtrip): A ile B arasında zıt yönlü iki ok; seyahatin başladığı orijine tam geri dönüş (örneğin AUS-DFW-AUS). Çember Seyahat (Circle Trip): A, B ve C'yi birleştiren bir halka; orijinden çıkıp birden fazla lokasyona uğrayarak aynı orijine dönüş, en az 2 duraklama (stopover) içerir (örneğin JFK-FCO-DEL-JFK). Dünya Turu (Round the World): etrafında yörünge halkası olan bir küre; tek yönde (doğu ya da batı) uçarak Uluslararası Tarih Çizgisini geçme ve başlangıca dönüş, kısıtlamalar min/maks uçuş ve aynı ittifak taşıyıcıları. Sunucu notları: stopover (24 saatten uzun planlı duraklama) ile layover (kısa süreli aktarma) arasındaki fark bir seyahatin circle trip olup olmadığını belirler; alışveriş motorları ham uçuş programlarından geçerli yolculuklar oluşturmak için bu şablonları kullanır; RTW biletleri, bilet gelirini birden fazla taşıyıcı arasında paylaştırmak için Oneworld, Star Alliance gibi ağların özel prorate (bölüştürme) anlaşmalarına dayanır.](/decks/fare-rules-journey-types/07.webp "Aynı üç şehir bir durakta 24 saat kalındığında çember, kalınmadığında başka bir yolculuk sayılıyor. Geometriyi rota değil, duraklama süresi belirliyor.")

Sınıflandırmanın kaderi ayrıntıda. Çember seyahati belirleyen şey,
duraklamanın stopover mı yoksa layover mı olduğu: 24 saatten uzun planlı
bir duraklama stopover, kısa süreli aktarma layover. Aynı şehir dizisi bu
tek eşiğe göre farklı bir yolculuk tipine düşüyor ve farklı fiyatlanıyor.
Yazılım tarafında bunun karşılığı, yolculuk tipinin girdi değil, uçuş
saatlerinden türetilen bir sonuç olması; saat değiştiğinde yolculuk tipi de
değişebiliyor.

Dünya turu en katı şablon. Kaynak metne göre yolculuğun tek yönde (doğu ya
da batı) olması, uluslararası tarih çizgisinin geçilmesi ve başlangıç
noktasına dönülmesi gerekiyor; uçuş ve duraklama sayısı da belirli
sınırlar içinde kalmalı. Sunum ayrıca taşıyıcıların aynı ittifaktan olması
şartını ekliyor. Bunun sebebi gelir: RTW biletinin geliri birden fazla
taşıyıcı arasında paylaşılıyor ve bu paylaşım Oneworld, Star Alliance gibi
ittifakların özel bölüştürme (prorate) anlaşmalarına dayanıyor.

## Açık çene, uçulmayan bir parçayı sistemde temsil etmek zorunda

Beşinci tip açık çene (open jaw). Sistem yolcunun bir şehre inip başka bir
şehirden dönmesine izin veriyor. Aradaki ulaşım, tren ya da kara yolu,
havayolunun sorumluluğunda değil. Sunum dört varyasyon gösteriyor: arasına
yüzey ulaşımı giren yolculuk (JFK-LON, yüzeyden devam, CDG-JFK), yolcunun
kalktığından farklı bir şehre döndüğü model (DFW-LON-SAT), ve başlangıç ile
varış noktalarının tamamen farklı olduğu, tek bilette birleşen iki bağımsız
uçuş (DFW-FRA, bağımsız, VIE-AUS). Son ikisi sunumda çifte açık çene
(double open jaw) başlığı altında duruyor.

![Başlık: Açık Çene (Open Jaw) Varyasyonları. Dört hücre. Sol üst: JFK'den B'ye ok, B'den LON'a kesikli çizgi, CDG'den B'ye çizgi; uçuşlar arasına farklı ulaşım yöntemlerinin (kara ya da demiryolu) girdiği yolculuk (örneğin JFK-LON, yüzey, CDG-JFK). Sağ üst, Çifte Açık Çene (Double Open Jaw): DFW'den aşağı SAT'a kırılan ok; yolcunun kalkış yaptığı şehirden farklı bir şehre dönüş yaptığı model (örneğin DFW-LON-SAT). Sol alt, Varış Noktası Açık Çene: DFW'den FRA'ya ok; açıklama metni sol üst hücredekiyle aynı tekrar ediyor (JFK-LON yüzey CDG-JFK örneği). Sağ alt, yine Çifte Açık Çene (Double Open Jaw): VIE'den AUS'a kesikli ok; orijin ve varış noktalarının tamamen farklı olduğu, tek bilette birleşen iki bağımsız uçuş (örneğin DFW-FRA, bağımsız, VIE-AUS). Sunucu notları: kesik yüzey çizgileri rezervasyon sisteminde (PNR) bir ARNK (Arrival Unknown, varış bilinmiyor) segmenti olarak temsil edilir, bu da PSS'e kayıp uçuş segmentine rağmen yolculuğun devam ettiğini bildirerek otomatik iptali engeller; açık çene biletleri genellikle gidiş ve dönüş ücretlerini birleştiren yarım gidiş-dönüş (half-roundtrip) olarak fiyatlandırılır ve iki bağımsız tek yön sayılmamaları için katı mesafe kontrollerine tabi tutulur.](/decks/fare-rules-journey-types/08.webp "Kesikli çizgilere bak: bunlar uçulmayan parçalar ve PNR'da ARNK olarak duruyor. Bu segment olmasa, saklı şehri yakalayan iptal zinciri meşru bir yolcuyu da düşürürdü.")

Sunumdaki slaytın bir kusuru var: alt sol hücre varış noktası açık çenesini
DFW-FRA okuyla çiziyor ama açıklama metni üst hücrenin metnini tekrar
ediyor. Ayrımın özü yine de net: açıklık ya dönüşün başladığı şehirde ya
da yolculuğun bittiği şehirde olabiliyor.

Asıl mühendislik ayrıntısı sunumun notlarında. Kesik yüzey çizgisi PNR'da
bir ARNK (arrival unknown, varış bilinmiyor) segmenti olarak temsil
ediliyor. Bu segment PSS'e, uçuş segmenti eksik olsa da yolculuğun devam
ettiğini bildiriyor ve otomatik iptali engelliyor. Saklı şehir bölümündeki
zinciri hatırlayın: uçulmayan bacak kalan her şeyi iptal ettiriyordu. ARNK
aynı sisteme "bu boşluk kasıtlı" demenin yolu. Yani PSS'in iptal mantığı,
yasal bir boşlukla bir kural ihlalini veri modelindeki tek bir segment
tipiyle ayırıyor.

Fiyatlandırma tarafında açık çene, gidiş ve dönüş ücretlerini birleştiren
yarım gidiş-dönüş (half-roundtrip) olarak hesaplanıyor. Kaynak metin
fiyatın "iki ayrı tek yön" ya da "açık uçlu dönüş" mantığıyla kurulduğunu
söylüyor; sunum, iki bağımsız tek yön gibi fiyatlanmaması için katı mesafe
kontrollerine tabi tutulduğunu ekliyor. Burada da amaç aynı: esneklik
tanınıyor ama o esnekliğin ucuz bir tek yön kombinasyonuna dönüşmemesi
kontrol ediliyor.

## Kural, boşluk ve bekçi aynı döngünün üç adımı

Sunumun kapanışı parçaları bir döngüye bağlıyor. Ücret kuralları ve rota
tasarımı (geometrik rotalar ve ATPCO kategori 31 ve 33) kısıtlama yaratıyor.
Yolcu optimizasyonu, yani saklı şehirler ve çakışan uçuşlar, o kısıtlamanın
boşluğunu buluyor. Boşluk da sistem güncellemesini tetikliyor. Ortada gelir
bütünlüğü duruyor.

![Başlık: Bilet Mimarisi, Sürekli Bir Denge Oyunu. Solda üç madde: havayolu biletleme ekosistemi statik bir menü değil, sürekli evrilen bir savunma mimarisidir; kurallar pazar segmentasyonunu korumak için tasarlanmıştır; yolcuların bu mimarideki boşlukları kullanması havayollarını algoritmalarını ve gelir bütünlüğü yazılımlarını sürekli güncellemeye zorlar. Sağda döngü şeması: üstte lacivert kutu, Ücret Kuralları ve Rota Tasarımı (geometrik rotalar ve ATPCO Kat 31/33); sağa inen ok, kısıtlamalar yaratır; altta turuncu kutu, Yolcu Optimizasyonu (saklı şehirler, çakışan uçuşlar); sola çıkan turuncu ok, sistem güncellemesini tetikler. Döngünün ortasında bir kalkan simgesi ve Gelir Bütünlüğü (Revenue Integrity). Sunucu notları: havayolu fiyatlandırması statik bir katalog değil canlı bir döngüdür; kurallar rotaları oluşturur, yolcular boşlukları bulur, havayolu bu açıkları kapatmak için otomatik bekçileri (revenue integrity) devreye sokar; sektördeki mühendislik vizyonu, katı sistem kısıtlamaları ile sınırları zorlayan insan davranışı arasındaki bu mücadelenin anlaşılmasını gerektirir.](/decks/fare-rules-journey-types/09.webp "Döngünün hiçbir oku durmuyor. Kapatılan her boşluk yeni bir kural, yeni bir kural da yeni bir boşluk demek.")

Brifingin son önerisi bu döngüye farklı bir yerden giriyor: kural delmeyi
yalnızca cezalandırmak yerine yasal esnekliği kolaylaştırmak. Açık çene ve
çember seyahat gibi karmaşık yolculuklar için kullanıcı dostu arayüzler
sunulursa, yolcu kuralı delmek yerine sistemin tanıdığı esnekliği
kullanıyor. Bu yaklaşım bekçiye daha az iş bırakıyor, çünkü yolcunun
ihtiyacını meşru bir şablona taşıyor.

## Yarın işe yarayacak dört çıkarım

1. **Gelir bütünlüğünü biletler arası ilişkiye kur.** Back-to-back biletleme
   tek bir bilette görünmüyor; aktif PNR'ları aynı yolcu, çakışan tarih, aynı
   güzergâh çifti ve tamamlayıcı kupon yapısıyla tarayan bir iş kur ve
   yolcuyu isimle değil sadakat programı verisiyle eşleştir.
2. **Taşıma sözleşmesini biletleme anında göster.** Saklı şehre karşı
   savunmanın hukuki yarısı sözleşmede. Bir bacağın kaçırılması durumundaki
   yaptırımı sözleşmede net yaz ve yolcuya satın alma aşamasında açıkça sun.
3. **Başlangıç noktası farkını kaynağında izle.** POC arbitrajı yasal ve
   kural kaldırılarak kapanmıyor. Bölgesel kurları ve pazar talebini gerçek
   zamanlı takip ederek başlangıç noktası bazlı fiyat uçurumlarını daralt.
4. **Meşru esnekliği kural delmekten kolay yap.** Açık çene ve çember seyahat
   gibi yolculuk tiplerini alışveriş ekranında kolayca kurulabilir hale
   getir; yolcunun ihtiyacı yasal bir şablona sığıyorsa boşluk aramasına
   gerek kalmıyor.

Bu bölümde ne yok: kısıtlı indirimin ve minimum kalış kuralının nasıl
doğduğu ("Yield Management: erken dönem stratejik analiz ve iş mantığı"),
ATPCO'nun sektördeki yeri ve tarifelerin nasıl dağıtıldığı ("Havacılık
endüstri standartları ve yönetişim"), Kategori 35'in arkasındaki acente
komisyonu ekonomisi ("Seyahat dağıtım ekosistemi ve yeni dağıtım yeteneği
(NDC) analizi"). Bu bölüm, o kuralların yolcuyla karşılaştığı anda ne
olduğunu anlatmak için var.
