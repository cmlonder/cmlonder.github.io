---
title: "Gelir yönetimi ve stratejik operasyonlar: PEOPLExpress ve American Airlines analizi"
domain: "aviation"
summary: "Gelir yönetimi tek başına kazandırmadı. American Airlines onu hub-and-spoke ağı, MD-80 standardizasyonu, zeytin ve boya düzeyinde maliyet kültürü ve AAdvantage'ın verisiyle birleştirdi. Bu bölüm, uçuş bazlı kontrolden ağ bazlı kontrole geçişin ve etrafındaki dört parçanın nasıl tek formül olduğunu anlatıyor."
audience: "Önceki iki bölümü okumuş, 'peki bunu bir sisteme nasıl bağladılar' diye soran yazılımcı ve ürün insanı. O&D, married segment ve virtual nesting kavramları metnin içinde tanımlanıyor."
pubDate: 2026-09-21
topics: [solution-architecture, pricing]
ai: generated
---

Önceki iki bölüm bir düelloyu anlattı: DINAMO'ya bağlı Ultimate Super Saver
ve karşısında envanter kontrolü olmayan PEOPLExpress. Bu bölüm düellonun
etrafındaki sistemi anlatıyor. **American Airlines gelir yönetimini yalnız
bırakmadı;** ağı hub-and-spoke'a çevirdi, filoyu standartlaştırdı, maliyeti
zeytin düzeyinde kıstı ve sadakat programını bir veri aracı olarak kurdu.
Yazılım tarafında bunun karşılığı büyük: gelir yönetimi tek uçuşa bakan
bir modelden bütün ağa bakan bir modele geçti ve 1993'te adı bile değişti.

![Sunumun kapak slaytı, fırçalanmış metal zemin. Solda başlık: Modern Havacılığın Temelleri, 1980'lerde havayolu endüstrisinin operasyonel ve ticari dönüşümü. Altta konuşmacı notu: bu sunum modern havayolu ticari sistemlerinin kuruluş dönemini kapsıyor; offer ve order management öncüllerinin, modern dağıtımın (GDS) ve ağ planlamasının doğuşu; sıkı regüle edilmiş bir kamu hizmeti sektöründen aşırı rekabetçi, algoritma güdümlü bir perakende işine geçiş. Sağda kanat uçları turuncuyla vurgulanmış bir yolcu uçağının üstten teknik çizimi.](/decks/hub-and-spoke/01.webp "Notun son cümlesi bölümün çerçevesi: kamu hizmetinden algoritma güdümlü perakendeye. Kanat uçlarındaki turuncu, bu bölümde değişen parçaları işaretliyor gibi.")

## Kapasite kontrollü indirim havacılığı kitleye açtı

1985'te Ultimate SuperSAAver biletleriyle %70'e varan indirim geldi; fiyat
aralığı 39 ile 129 dolar arasındaydı. Kapasite kontrollü, derin indirimli
biletler daha önce hiç uçmamış bir kitleyi gökyüzüyle buluşturdu. Slaytın
notu bunun modern AirShopping ve offer management'ın doğuşu olduğunu
söylüyor: derin indirime kapasite kontrolü koyunca, yüksek getirili iş
trafiğini sulandırmamak için uygunluğun dinamik yönetilmesi gerekti.

![Üstte bir huni: solda tek sıra halinde birkaç takım elbiseli yolcu simgesi, sağa doğru genişleyip yüzlerce turuncu ve yeşil yolcu simgesine dönüşüyor; üstünde kutu, %70 indirim, 39 ile 129 dolar. Altta başlık: 1985, havayolu seyahati artık lüks değil. Maddeler: Ultimate SuperSAAver biletleriyle %70'e varan indirimler; 39 ile 129 dolar arası fiyatlandırma; kapasite kontrollü, derin indirimli biletler daha önce hiç uçmamış yepyeni bir kitleyi gökyüzüyle buluşturdu. Sağda konuşmacı notu: bu modern AirShopping ve offer management'ın doğuşuydu; derin indirimli ücretlere kapasite kontrolü getirince havayolları yüksek getirili iş trafiğini sulandırmamak için envanter uygunluğunu dinamik kontrol etmenin yolunu bulmak zorunda kaldı; bu doğrudan yield management'a götürür.](/decks/hub-and-spoke/02.webp "Huninin dar ucundaki birkaç kişi tam ücret ödeyenler. Geniş ucu kazanmanın şartı, dar ucu kaybetmemek.")

Aynı koltuğun farklı segmentlere farklı fiyata satılmasının mantığı
burada: bütün müşteriler eşit değil. Sistem, müşterinin rezervasyon
zamanına ve seyahat detaylarına (itinerary) duyarlılığını ölçüyor. Erken
rezervasyon yapan ya da bütçesi kısıtlı yolcuya kapasite kontrollü
indirimli bilet açılıyor; son dakika yolcusu için yüksek fiyatlı sınıflar
korunuyor. Ölçüm kriteri fiyat değil, davranış.

## Koltuk bozulabilir bir envanterdir ve 1993'te disiplinin adı değişti

Mekanizma tek cümle: uçak kalktığı an satılmayan koltuğun değeri sonsuza
dek kaybolur. Temel kural dört "doğru": doğru koltuğu, doğru müşteriye,
doğru fiyata, doğru zamanda satmak. Burr'un 1989'daki sözü, PEOPLExpress
bölümünün özeti gibi: gelir yönetimi hakkında bilmedikleriniz sizi
öldürebilir.

![The Aviators Dashboard başlığı altında iki panel. Solda mavi bir uçak koltuğu, oturma yerinde turuncu kum akan bir kum saati ve altında dijital sayaç 00:00:00. Sağda başlık: Uçak Koltuğu Bozulabilir Bir Envanterdir. Alıntı kutusu: hasılat yönetimi hakkında bilmedikleriniz sizi öldürebilir, Donald Burr (PEOPLExpress). Mekanizma: uçak kalktığı an satılmayan koltuğun değeri sonsuza dek kaybolur; tüm müşteriler eşit yaratılmamıştır. Temel kural: doğru koltuğu, doğru müşteriye, doğru fiyata, doğru zamanda satmak. Konuşmacı notu: bozulabilir envanter kavramı havayolu gelir yönetiminin temelidir; önce yield (yolcu-mil başına gelir) maksimize edildi; geçiş resmen 1993'te IATA'nın yield management'ı revenue management olarak yeniden adlandırmasıyla oldu.](/decks/hub-and-spoke/03.webp "Sayaçtaki sıfırlar kalkış anı. Kum saatinin üst haznesinde kalan her tane, o an değersizleşen bir koltuk.")

Slaytın notundaki tarih önemli. Disiplin önce yield'i, yani yolcu-mil
başına geliri maksimize ediyordu; adı da oradan geliyordu. 1993'te terim
"revenue management" olarak yeniden adlandırıldı, çünkü hedef artık verim
değil toplam gelirdi. Bu ad değişikliği kozmetik değil: verim yüksek ama
uçak boş bir senaryo verimi maksimize eder, geliri değil. Bundan sonra
metinde gelir yönetimi diyeceğim.

## Karar destek üçlüsü: overbooking, tahsis ve dağıtım

Gelir yönetimi başlangıçta kural tabanlıydı; zamanla marjinal gelire
dayalı karar destek sistemine dönüştü. Üç adım var. DINAMO, ekonomik
overbooking: reddedilen biniş maliyetiyle boş kalan koltuk maliyeti
arasındaki dengeyi hesaplar. Littlewood ve EMSRB, indirim tahsisi: düşük
değerli sınıflara karşı yüksek değerli sınıflar için ortak koruma seviyesi
kurar. Sabre PSS: merkezi rezervasyon sisteminin gücüyle entegrasyon,
bilet ve tarife verisinin anlık yönetimi.

![Başlık: Karar Destek Sistemlerinin Yükselişi. Üç kutu okla bağlı. Adım 1, DINAMO: ekonomik çifte rezervasyon, reddedilen biniş maliyetleri (overbooking) ile boş kalan koltuk maliyeti arasındaki dengenin hesaplanması. Adım 2, Littlewood ve EMSRB: indirim tahsis modeli, düşük değerli sınıflara karşı yüksek değerli rezervasyon sınıfları için ortak koruma seviyelerinin oluşturulması. Adım 3, Sabre PSS: merkezi rezervasyon sisteminin (CRS) gücüyle entegrasyon, bilet ve tarife verilerinin anlık yönetimi. Altta konuşmacı notu: EMSRB (Expected Marginal Seat Revenue) optimal rezervasyon limitleri için hesaplama açısından uygulanabilir bir sezgisel yöntemdi; optimal çözümler çok boyutlu sayısal integrasyon (konvolüsyon integralleri) ve devasa hesaplama gücü gerektiriyordu; offer management'a uygulanan erken veri bilimi.](/decks/hub-and-spoke/04.webp "Alttaki not üç kutudan daha önemli: optimal çözüm hesaplanamıyordu, o yüzden hesaplanabilir bir yaklaşık yöntem seçildi. EMSRB doğru olduğu için değil, çalıştığı için kazandı.")

Overbooking kararının kriteri: uçağa gelmeyen yolcu yüzünden boşa giden
koltuk maliyeti ile yolcunun uçağa alınamaması durumundaki tazminat ve
hizmet maliyeti kıyaslanır; toplam maliyeti en aza indiren denge seçilir.
İndirim tahsisinin kriteri: düşük değerli sınıftan gelen talep ile yüksek
değerli sınıf için beklenen marjinal koltuk geliri kıyaslanır; yüksek
değerli yolcu için bir koruma seviyesi (protection level) ayrılır.
Notun mühendislik dersi ayrı: optimal limitler çok boyutlu konvolüsyon
integrali istiyordu, o günün makinesinde yoktu. EMSRB hesaplanabilir bir
sezgisel yöntem olarak seçildi. Doğru cevap yerine zamanında cevap.

## Hub-and-spoke: uçak kullanımı için ağ yeniden çizildi

MD-80 uçaklarının filoya katılması ağı dönüştürdü. Noktadan noktaya
modelden topla-dağıt modeline geçildi; Dallas/Fort Worth (1981) ve Chicago
O'Hare merkezleri kuruldu. Sonuç daha geniş coğrafi erişim ve daha yüksek
uçak kullanımı. 1984-1990 arasında filo iki katına çıktı, zirvede 363 MD-80.

![Başlık: Uçuş Ağının Yeniden Tasarımı, Hub ve Spoke. Solda noktadan noktaya (point-to-point) kutusu: birbirine karışık çizgilerle bağlanmış gri düğümler. Sağda topla-dağıt (hub and spoke) kutusu: merkezdeki yeşil düğümden dışarı açılan turuncu ve yeşil ışınlar. Altta stratejik değişim: MD-80 uçaklarının filoya katılması ağı dönüştürdü, noktadan noktaya modelden hub ve spoke modeline geçiş, Dallas/Fort Worth (1981) ve Chicago O'Hare merkezlerinin inşası ile daha geniş coğrafi erişim ve daha yüksek uçak kullanımı. Veri noktası: 1984-1990 arası filo iki katına çıktı, zirvede 363 adet MD-80. Konuşmacı notu, ağ planlama ve çizelgeleme: hub ve spoke'a geçiş eski bacak bazlı gelir yönetimi sistemlerini kırdı, çünkü A'dan B'ye oradan C'ye uçan aktarmalı yolcu artık A-B bacağındaki koltuk için yalnızca A-B uçan yerel yolcuyla rekabet ediyordu.](/decks/hub-and-spoke/06.webp "Sağdaki yıldızın her ışını iki yönlü bir bacak, ama yolcuların çoğu iki ışını art arda kullanıyor. Soldaki ağda böyle bir yolcu yoktu.")

Notun söylediği şey bu bölümün teknik kırılması. Hub-and-spoke eski bacak
bazlı gelir yönetimini kırdı. A'dan B'ye, oradan C'ye uçan aktarmalı yolcu
artık A-B bacağındaki koltuk için yalnızca A-B uçan yerel yolcuyla
yarışıyor. Bacak bazlı sistem ikisini aynı görür; oysa biri ağa iki bacak
gelir getiriyor, diğeri bir.

## Hub matematiği: %30 yerel, %70 aktarmalı

Hub modelinde trafik dengesi %30 yerel, %70 bağlantılı. Yerel trafik
sadece o şehre gidenler; bağlantılı trafik merkezi aktarma noktası olarak
kullananlar. Serbestleşme sonrası bu model operasyonel maliyeti düşürüp
geliri artırarak havayollarının devasa ölçeklere ulaşmasını sağladı.

![The Aviators Dashboard, başlık: Hub Ekonomisinin Matematiği. Halka grafik: yeşil %30 dilim ve taralı turuncu %70 dilim. Veri dökümü: %30 yerel trafik, sadece o şehre gidenler; %70 bağlantılı trafik, merkezi aktarma noktası olarak kullananlar. Sonuç: deregülasyon sonrası bu model operasyonel maliyetleri düşürüp geliri artırarak havayollarının devasa ölçeklere ulaşmasını sağladı. Konuşmacı notu: %70 aktarmalı trafiği yönetmek PSS ve GDS sistemlerinde büyük yükseltmeler gerektirdi; sistem etkinleştiricileri gerçek zamanlı interaktif uygunluk, married segment control (acentelerin bağlantılı segmentleri ayırmasını önleme) ve journey control.](/decks/hub-and-spoke/07.webp "Turuncu dilim ne kadar büyükse yazılım o kadar zor: yolcuların yüzde yetmişinin ürünü tek bacak değil, iki bacağın toplamı.")

Notta üç sistem yeteneği sayılıyor ve üçü de %70'in bedeli. Gerçek zamanlı
interaktif uygunluk: acente eski bir kopyaya değil, o anki envantere
bakar. Married segment control: A-B ve B-C bacakları tek ürün olarak
değerlendirilir; sistem iki bacağı ayrı ayrı satmak yerine birleşik
yolculuk olarak görür ve envanteri bu bütünsel değere göre açar ya da
kapatır. Acentenin bağlantılı segmentleri ayırıp ucuz bacağı tek başına
satması engellenir. Journey control: kararın birimi bacak değil yolculuk.

## Bacak bazlıdan kalkış-varış bazlıya: 1987

Bacak/segment bazlı kontrol uçuş bazlı optimizasyon yapar. Basit ağlar
için uygundur ama aktarmalı yolcunun gerçek değerini göremez. Kalkış-varış
(O&D) bazlı kontrol tüm ağın gelirini maksimize eder; rezervasyon
talebinin gerçek değerini yakalar. Etki: sanal iç içe geçme (virtual
nesting) modeliyle ağ genelinde %1-2 ek gelir; ideal eşlemeyle ilave %0.4.
Çalışma 1992'de Edelman Ödülü aldı.

![The Aviators Dashboard, başlık: Envanter Kontrolünün Evrimi (1987). İki sütunlu tablo. Bacak/segment bazlı: uçuş bazlı optimizasyon; sınırlamalar, basit ağlar için uygundur, aktarmalı yolcunun gerçek değerini göremez. Kalkış-varış (O&D) bazlı, yeşil başlık: tüm ağın gelirini maksimize eder, rezervasyon talebinin gerçek değerini yakalar. Turuncu etki kutusu: sanal iç içe geçme (virtual nesting) modeli ile ağ genelinde %1-2 ek gelir, ideal eşleme ile ilave %0.4 gelir (1992 Edelman Ödülü). Konuşmacı notu: bacak/segment kontrolleri leg class nested inventory ve segment close indicator kullanıyordu; O&D kontrolleri güzergâhları sanal kovalara eşliyordu. Küresel bağlam: Avrupalı taşıyıcılar arasında SAS O&D kontrollerini çok daha sonra, 1993'te devreye aldı.](/decks/hub-and-spoke/05.webp "%1-2 küçük görünür; bir önceki bölümdeki başabaş çubuğunu hatırla. Kâr o çubuğun son dilimindeyse yüzde iki, kârın kendisinin büyük bir parçası.")

Karar mantığındaki değişim şu: tek bir uçuşun doluluğuna bakmak yerine,
rezervasyon talebinin bütün ağ için yarattığı toplam değere bakılır.
Sanal yuvalama yöntemiyle güzergâhlar sanal kovalara eşlenir; aktarmalı
ve yüksek değerli yolcuya öncelik verilir. Bacak bazlı sistemin araçları
leg class nested inventory ve segment close indicator idi; O&D bunların
üstüne güzergâh haritası koydu. Avrupa'da SAS aynı adımı 1993'te attı;
American altı yıl önce atmıştı.

## Mikro optimizasyon, makro tasarruf: Crandall'ın maliyet kültürü

Gelir tarafı ne kadar akıllı olursa olsun, maliyet tarafı da sıkılıyordu.
Mikro: salatalardan tek bir zeytinin çıkarılması, "yolcular fark
etmeyecek", yılda 40.000 dolar. Makro: uçakların boyanmaması. "Boya yok,
daha az ağırlık demektir." Gümüş kuşlar hem yakıt tasarrufu hem marka
kimliği oldu. İşgücü: B-scale, yeni işe alınan pilotlar için daha düşük
maaş skalası.

![The Aviators Dashboard, başlık: Mikro Optimizasyonlar, Makro Tasarruflar, Robert Crandall'ın Maliyet Kültürü. Solda mikro tasarruflar: nişangâh içinde yeşil bir zeytin; zeytin, salatalardan tek bir zeytinin çıkarılması, yolcular fark etmeyecek, yılda 40.000 dolar tasarruf. Sağda makro tasarruflar: boyasız, parlatılmış metal gövdeli bir uçak fotoğrafı; gümüş kuşlar (silver birds), uçakların boyanmaması, boya yok daha az ağırlık demektir, ciddi yakıt tasarrufu. Altta B-ölçeği (B-scale): yeni işe alınan pilotlar için daha düşük bir maaş skalası oluşturularak işgücü maliyetlerinin düşürülmesi. Konuşmacı notu: uçuş operasyonları, ağırlık ve denge, mürettebat yönetimiyle ilgili; yakıt tüketimi sıfır yakıt ağırlığına (ZFW) aşırı duyarlıdır, boyayı kaldırmak uçak ağırlığını önemli ölçüde azalttı; B-scale havayolu işçi ilişkilerinde devrim yarattı.](/decks/hub-and-spoke/08.webp "Zeytin ve boya aynı kuralın iki ucu: yolcunun görmediği, hacimde büyüyen maliyet. Tek zeytin sıfır, bir yıl boyunca her salatadan bir zeytin kırk bin dolar.")

Hangi maliyetin kesileceğine karar veren kural, brifingde açıkça yazıyor:
müşteri deneyimini doğrudan etkilemeyen ama toplam hacimde büyük tasarruf
sağlayan alanlar analiz edilip uygulanır. Zeytin ve boya bu kuralın
sınavını geçiyor; koltuk aralığını daraltmak geçmez, çünkü yolcu fark
eder. Yazılımcı için tanıdık bir ölçüt: kullanıcının görmediği yerde
çarpan büyük.

## Sadakat programı bir ödül sistemi değil, bir veri aracı

1979-1980'de ilk denemeler geldi: Texas International'ın mil bazlı
programı ve Western Airlines'ın Travel Bank'i. 1 Mayıs 1981'de AAdvantage
lanse edildi. Stratejik hedef sadece uçuş satmak değildi: markayı
tanıtmak, sık uçanların tüketim kalıplarını izlemek ve en sadık
müşterilere hedefli teklif sunmak.

![Başlık: Sadakat Programlarının Doğuşu. Solda kesik çizgili bir yol üzerinde iki durak: 1979-1980 uçak simgesi, 1 Mayıs 1981 parlayan kart simgesi. Sağda ilk denemeler: Texas International (ilk mil bazlı program) ve Western Airlines (Travel Bank). AAdvantage programının lansmanı. Stratejik hedef: sadece uçuş satmak değil, markayı tanıtmak, sık uçanların tüketim kalıplarını izlemek ve en sadık müşterilere hedefli teklifler sunmak. Konuşmacı notu: müşteri veri platformları (CDP) ve sadakat yönetimi; sadakat programları havayollarını işlem odaklı işten ilişki odaklı işe taşıdı; tüketim kalıplarını izlemek modern kişiselleştirmenin ve sürekli fiyatlandırmanın öncülüydü.](/decks/hub-and-spoke/09.webp "Kartın parlaması ödülü değil, kimliği temsil ediyor. 1981'den önce havayolu bir bileti satıyordu ama kime sattığını bilmiyordu.")

Notun tespiti: sadakat programı havayolunu işlem odaklı işten ilişki
odaklı işe taşıdı. Gelir yönetimi koltuğu tanıyordu, yolcuyu değil. Sık
uçan programı yolcuya kimlik verdi ve tüketim kalıbını kayda geçirdi. Bu
veri, bugünkü kişiselleştirme ve sürekli fiyatlandırmanın öncülü. Program
puan dağıtmak için değil, müşteri veri platformu kurmak için vardı.

## Dört parça tek formül

Verim yönetimi, hub-and-spoke ağı, operasyonel verimlilik ve müşteri
sadakati toplandığında sonuç: 1989-1991 döneminde ana şirket AMR'nin
toplam kârı 892 milyon dolar, verim yönetiminin sağladığı ek gelir 1.4
milyar dolar. Slaydın kendi sonucu: sistem destekli optimizasyon
olmasaydı havayolu kârlı bir operasyon yürütemezdi.

![Başlık: Modern Havayolunun Başarı Formülü. Dört kutu artı işaretleriyle toplanıyor: verim yönetimi, hub ve spoke ağı, operasyonel verimlilik, müşteri sadakati; eşittir, sağda turuncu çerçeveli ekran: 1989-1991 dönemi, ana şirket (AMR) toplam kârı 892 milyon dolar, verim yönetiminin sağladığı ek gelir 1.4 milyar dolar. Altta sonuç: sistem destekli optimizasyon olmasaydı havayolu şirketi kârlı bir operasyon yürütemezdi, mühendislik ve ticaretin kusursuz birleşimi. Konuşmacı notu: bu, havacılıkta karar destek sistemlerinin devasa yatırım getirisini kanıtlıyor; bu gelir, küresel dağıtım ağlarında satış noktasına göre gerçek son koltuk uygunluğu (true last seat availability by point of sale) ile mümkün oldu.](/decks/hub-and-spoke/10.webp "Ekrandaki iki sayıyı yan yana oku: ek gelir toplam kârdan büyük. Gelir yönetimi olmasa dönem zararla kapanırdı.")

İki sayının sırası önemli: gelir yönetiminin ek geliri, dönemin toplam
kârından fazla. Yani formülün ilk parçası çıkarılınca kalan üçü zararı
kapatamıyor. Notun eklediği teknik şart da atlanmamalı: bu gelir, küresel
dağıtım ağlarında satış noktasına göre gerçek son koltuk uygunluğuyla
mümkün oldu. Acente hangi ülkede olursa olsun, sistemin o an verdiği
cevap gerçek envanterden geliyordu.

## Yarın işe yarayacak dört çıkarım

1. **Envanterin ömrü varsa tahmin tek başına yetmez.** Talep tahmini
   marjinal gelir analiziyle desteklenmeli: bu birimi şimdi ucuza
   satmanın bedeli, sonra pahalıya satma olasılığının beklenen değeri.
   Optimal hesap pahalıysa EMSRB gibi hesaplanabilir bir yaklaşık yöntem seç.
2. **Ağ etkisi varsa kararın birimini değiştir.** Bacak yerine yolculuk,
   ürün yerine güzergâh. O&D kontrolü %1-2 getirdi; küçük görünen bu
   oran kârın büyük bölümüydü. Married segment kuralı olmadan ağ etkisi
   satış anında parçalanır.
3. **Merkezi sistem üç yeteneği desteklemeli:** sanal yuvalama, gerçek
   zamanlı interaktif uygunluk ve satış noktasına göre gerçek son koltuk.
   Bunlar olmadan gelir yönetimi stratejisi kâğıtta kalır; acente bayat
   veriye satar.
4. **Sadakat programını ödül sistemi değil, veri madenciliği aracı
   olarak kur.** Amaç tüketim alışkanlığını izlemek ve kişiselleştirilmiş
   teklif üretmek. Puan, verinin bedeli.

Bu bölümde ne yok: sanal kovaların ve rezervasyon sınıflarının bugünkü
kurulumu ("Envanter koltuk değildir") ve hub'da aktarma kaçırıldığında
olanlar ("IROPS"). İkisi de bu bölümdeki %70'in devamı.
