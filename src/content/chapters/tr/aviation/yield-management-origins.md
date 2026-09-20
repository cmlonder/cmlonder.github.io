---
title: "Yield Management: erken dönem stratejik analiz ve iş mantığı"
domain: "aviation"
summary: "Gelir yönetimi 1978'de bir gecede doğmadı. Kırk yıllık indirim kısıtlamaları, CAB'nin overbooking kuralları, Littlewood'un iki sınıflı modeli ve American Airlines'ın yedi yıllık Ar-Ge'si 1985'te DINAMO'da birleşti. Bu bölüm o birleşmenin iş mantığını anlatıyor: koltuk bozulabilir bir envanterdir ve doluluk değil gelir maksimize edilir."
audience: "Fiyat sınıflarının, overbooking kurallarının ve envanter tahsisinin arkasındaki karar mantığını merak eden yazılımcı ve ürün insanı. 1978 bölümünü okumuş olmak yeter; yöneylem araştırması bilgisi gerekmiyor."
pubDate: 2026-09-21
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölüm şu cümleyle bitmişti: garanti kalkınca gelir yönetimi doğdu.
Doğru ama eksik. Gelir yönetimi 1978'de sıfırdan icat edilmedi; **kırk yıl
boyunca parça parça biriken kuralların 1985'te tek bir sistemde toplanmış
haliydi.** Kısıtlı indirim 1948'de, overbooking'in resmi onayı 1967'de,
gelir maksimizasyonunun matematiği 1972'de vardı. Serbestleşmenin yaptığı,
bu parçaları bir araya getirmeyi hayatta kalma şartına çevirmekti. Bu bölüm
o parçaları sırayla ve her birinin arkasındaki karar mantığıyla anlatıyor.

![Sunumun kapak slaytı. Solda iç içe geçmiş lacivert hatlardan oluşan bir ağ, üç düğüm turuncu kareyle işaretli. Sağda başlık: Havacılıkta Gelir Yönetiminin (Yield Management) Doğuşu. Alt başlık: katı regülasyonların yarattığı statükodan, modern havacılığı kurtaran algoritmik devrime geçiş.](/decks/yield-revolution/01.webp "Ağdaki üç turuncu düğüm bu bölümün üç parçası: kısıtlı indirim, kontrollü overbooking ve gelir maksimizasyonu. Hatlar onları birbirine bağlayan kırk yıl.")

## Kısıtsız indirim gelir sızdırır; kısıtlama indirimin kendisi kadar önemlidir

Fiyat serbestliği bir gecede gelmedi, kademe kademe geldi. 1940'larda
tarifeler CAB'nin sıkı denetimindeydi; tek yenilik United Airlines'ın
öncülük ettiği düşük fiyatlı ikinci sınıf (coach) uçuşlardı. 1948'den
1960'lara kadar charter şirketlerinin baskısıyla ilk kısıtlı indirimler
çıktı: ölü saatlerde uçmak, aktarma yapmamak, iade istememek şartıyla ucuz
bilet. Aile ve gençlik tarifeleri de bu dönemin ürünü. 1970'lerde kurallar
esnedi: Texas International'ın Peanut Fares'i ve American Airlines'ın
30 gün önceden alım ve kısıtlı kalış şartıyla %45 indirimli SuperSAAver'ı.
1978 serbest bölge.

![Dört basamaklı merdiven grafiği, başlık: Pricing Freedom Evolution. 1940'lar: katı CAB kontrolü, tarifeler sıkı denetim altında, United Airlines öncülüğünde düşük bilet fiyatlı ikinci sınıf (coach) uçuşların başlaması. 1948-1960'lar: kısıtlı indirimlerin doğuşu, charter baskısı, ölü saatler, aktarmasız ve iadesiz şartlarıyla ilk indirimler, aile ve gençlik tarifeleri. 1970'ler: kuralların esnemesi, Texas International'dan Peanut Fares, American Airlines'dan %45 indirimli SuperSAAver (30 gün önceden alma, kısıtlı kalış). 1978: serbest bölge, CAB'nin fiyatlarda esnek dalgalanmalara izin vermesi ve yaklaşan deregülasyon fırtınası.](/decks/yield-revolution/02.webp "Her basamakta indirimin yanında bir kısıt var. 1948'den beri kural aynı: indirim tek başına satılmaz, koşuluyla satılır.")

Bu merdivenin her basamağında tekrar eden iş kuralı şu: düşük ücret, tam
ücret ödeyecek yolcunun eline geçmemeli. Bunun için indirimli bilet
şartlara bağlanır: yoğun olmayan saatte seyahat, aktarma yasağı, iade
yapılmaması, önceden satın alma zorunluluğu, minimum ve maksimum kalış
süresi. Bu kısıtların amacı yolcuyu cezalandırmak değil, iş yolcusunu
turistten ayırmak. İş yolcusu 30 gün önceden bilet alamaz ve cumartesi
kalmak istemez; tam ücreti öder. Turist bekleyebilir; indirimi alır.
Kısıt, segmentasyonun kendisidir.

Demografik indirimlerde (gençler, aileler, din görevlileri) ayrı bir
kural gerekiyor: hak sahipliği doğrulanmalı. Kimlik kartı ya da sistem
üzerinden bir doğrulama mekanizması olmadan indirim hedeflenen segmentin
dışına sızar. Yazılımcı için anlamı: fiyat kuralı bir sayı değil, bir
koşul kümesi; ve koşulun doğrulanamadığı yerde kural yoktur.

## Overbooking'i regülatör icat etmedi, ama veriyle meşrulaştırdı

Sorun no-show: yolcu bilet alıp uçuşa gelmiyor. Etkisi zarar: uçak
kalkınca boş koltuğun değeri sıfırlanıyor. Aksiyon overbooking:
kapasiteden fazla bilet satmak. Riski denied boarding: uçağa alınamayan
yolcu ve onun için ödenecek ceza. Bu döngü serbestleşmeden çok önce
kuruldu ve CAB onu yasaklamak yerine kurala bağladı.

![Başlık: Overbooking Dinamikleri ve CAB Regülasyonları. Solda dört oklu döngü: Sorun: no-show, yolcular bilet alıp uçuşa gelmiyor. Etki: zarar, boş kalan koltuklar devasa kayıp yaratıyor. Aksiyon: overbooking, planlı kapasite aşımı, kapasiteden fazla bilet satışı. Risk: denied boarding, uçağa alınamayan yolcular ve ceza mekanizmaları. Sağda CAB regülasyon verileri kutusu: 1961, gelmeyene %50 ceza, uçağa alınamayana %50 tazminat. 1965-1966, her 10.000 yolcuda sadece 7.69 uçağa kabul edilmeme vakası. 1967, kontrollü overbooking resmen onaylandı, tazminat %100'e çıkarıldı.](/decks/yield-revolution/03.webp "Sağdaki üç tarih bir kalibrasyon hikâyesi: önce ceza kondu, sonra oran ölçüldü, oran düşük çıkınca uygulama onaylandı ve bedel yükseltildi.")

Tarihler önemli. 1961'de CAB simetrik bir kural koydu: gelmeyen yolcu
bilet değerinin %50'si kadar no-show cezası öder, uçağa alınamayan yolcuya
%50 tazminat ödenir. 1965-1966'da ölçüm yapıldı: her 10.000 yolcuda 7.69
uçağa kabul edilmeme vakası. 1967'de kontrollü overbooking resmen onaylandı
ve tazminat %100'e çıkarıldı. Regülatörün mantığı şuydu: uygulama zaten
var, oran düşük, o halde yasaklamak yerine bedelini yükselt.

Karar kriteri bugün de aynı: overbooking oranı tarihsel no-show ve iptal
verisine dayanır. Denklemin bir tarafında boş koltuğun kaybı, diğer
tarafında fazla gelen yolcuya ödenecek tazminat. Bu domaindeki
"Overbooking bir hata değil, bir model" bölümü denklemin matematiğini
açıyor; burada önemli olan, cezanın ve tazminatın regülatör tarafından
fiyatlanmış olması. Fiyatlanmış risk, modellenebilir risk demek.

## Hedef doluluk değil gelir: Littlewood kuralı

Havacılığın altın kuralı üç satır. Uçak kalktığı an boş koltuğun değeri
sıfırlanır; envanter bozulabilir. Ekstra bir yolcu taşımanın marjinal
maliyeti neredeyse sıfırdır. Sonuç: o koltuktan elde edilen bilet geliri
doğrudan saf kârdır. Kaynak metnin ifadesiyle, marjinal yolcunun maliyeti
ihmal edilebilirdi ve "neredeyse saf kâr" idi.

![Solda bir uçak koltuğu ve içinde turuncu kum akan bir kum saati. Altında Havacılığın Altın Kuralı: uçak kalktığı an boş kalan koltuğun değeri tamamen sıfırlanır (perishable inventory); ekstra bir yolcu taşımanın marjinal maliyeti neredeyse sıfırdır; sonuç, elde edilen bilet geliri doğrudan saf kârdır. Sağda iki kutu. 1972, Littlewood Kuralı (BOAC): hedef sadece yolcu sayısını değil geliri maksimize etmektir; iki farklı rezervasyon sınıfı arasında indirim tahsisi yapan ilk model. 1980, William Swan (American Airlines): Littlewood'un modelinin logit yaklaşımı ve normal dağılım kullanılarak çoklu rezervasyon sınıflarına (multi-class) genişletilmesi.](/decks/yield-revolution/04.webp "Kum saati ile koltuk yan yana: kalkış saati geldiğinde kalan kum boşa akar. Littlewood'un sorusu kumun ne kadarını kime satacağın.")

Ama bu kural tek başına yanlış bir sonuca götürür: madem her koltuk saf
kâr, hepsini hemen ucuza sat. 1972'de BOAC'ta Ken Littlewood tam bu
tuzağı kapattı. Hedef yolcu sayısını değil geliri maksimize etmektir.
İki rezervasyon sınıfı arasında indirim tahsisi yapan ilk model: ucuz
sınıfa bir koltuk verirsin, ancak o koltuğu sonradan tam ücretle satma
olasılığının beklenen getirisi ucuz ücretin altındaysa. Ucuza satılan
koltuk, sonradan yüksek fiyat ödeyecek yolcunun yerini kapatmamalı.

1980'de American Airlines'ta William Swan bu iki sınıflı modeli logit
yaklaşımı ve normal dağılımla çoklu rezervasyon sınıflarına genişletti.
Çok sınıflı senaryoda algoritmik mantık şu: düşük ücretli sınıfların
kapasitesini sınırla, yüksek ücretli sınıflar için yer ayır. Sınıf sayısı
arttıkça "kaç koltuk ayrılacak" sorusu bir formülden bir sisteme dönüştü.
O sistemin adı birazdan geliyor.

## Rakip fiyatı kırdığında cevap eşleşmek değil, sınırlı eşleşmektir

1981'de Donald Burr'ın PEOPLExpress'i Newark merkezli, aşırı düşük
fiyatlı bir modelle pazara girdi. Peanut Fares'in mucidi, kısa sürede
ABD'nin en büyük beşinci havayolu oldu ve Fortune listesinde en hızlı
büyüyen şirket unvanını aldı. Karşısında Robert Crandall'ın American
Airlines'ı: yüksek operasyonel maliyet, hantal yapı, fiyat savaşlarında
eriyen kâr marjı. Mecburi strateji, yolcu karmasını (passenger mix)
optimize etmekti.

![Başlık: Deregülasyon ve Yeni Pazar Tehdidi. Solda lacivert çerçeveli kutu, baskı altındaki devler (legacy): American Airlines (Robert Crandall), yüksek operasyonel maliyetler ve hantal yapı, acımasız fiyat savaşlarında eriyen kâr marjları, mecburi strateji olarak yolcu karmasını (passenger mix) optimize etme zorunluluğu. Ortada şimşek simgesi. Sağda turuncu çerçeveli kutu, agresif yeni model (LCC, 1981): PEOPLExpress (Donald Burr), Peanut Fares mucidi, Newark merkezli aşırı düşük bilet fiyatlandırması, ABD'nin en büyük beşinci havayolu konumuna hızla yükseliş, Fortune listesinde en hızlı büyüyen şirket unvanı.](/decks/yield-revolution/05.webp "Soldaki kutunun son maddesi bütün bölümün özeti: American fiyatta yarışamazdı, karmada yarıştı.")

Karar mekanizması şu: rakibin fiyatını doğrudan eşleştirmek yerine, o
düşük fiyatı sınırlı sayıda koltukla satışa sunmak. Kapasite kontrolü.
Böylece hem rekabetçi kalınır hem de bütün uçak zararına satılmaz.
Kaynak metin bunu bir savaş stratejisi olarak tanımlıyor: yield management,
rekabet tehdidine karşı stratejik ve taktik bir silah olarak kullanıldı.
Teknik bir araç değil; PEOPLExpress'e karşı seçilen cephe.

## DINAMO tek seferde yazılmadı: yedi yıl, beş sistem

Crandall ve yöneylem araştırması direktörü Tom Cook'un ekibi 1979'dan
1986'ya kesintisiz çalıştı. 1979 MOMS: çok sınıflı optimizasyon modelleme,
ilk kural tabanlı sürüm. 1980 DADS: indirim tahsis karar sistemi. 1981
CARS: şehir tahsis raporlama sistemi. 1982 SCARS: süper şehir analiz,
MARK IV raporlaması. 1985/86 DINAMO: Dynamic Inventory Allocation
Maintenance Optimizer. Overbooking ve çok sınıflı indirim kontrollerini
tek çatıda barındıran ilk tam fonksiyonlu gelir yönetim sistemi. Altyapı
IBM mainframe, MVS işletim sistemi, 3270 terminaller.

![Başlık: Kesintisiz 7 Yıllık Ar-Ge Süreci. Alt başlık: American Airlines, Robert Crandall ve Tom Cook (yöneylem araştırması direktörü). Üst üste dizilmiş sunucu kutuları basamak gibi yükseliyor. Altta altyapı: IBM Mainframe, MVS OS, 3270 terminaller. 1979 MOMS: çok sınıflı optimizasyon modelleme, ilk kural tabanlı sürüm. 1980 DADS: indirim tahsis karar sistemi. 1981 CARS: şehir tahsis raporlama sistemi. 1982 SCARS: süper şehir analiz, MARK IV raporlaması. En üstte turuncu çerçeveli 1985/86 DINAMO: Dynamic Inventory Allocation Maintenance Optimizer, overbooking ve çok sınıflı indirim kontrollerini barındıran tam fonksiyonlu ilk gelir yönetim sistemi.](/decks/yield-revolution/06.webp "Turuncu kutu en üstte ama tek başına durmuyor; altındaki dört lacivert kutu olmadan var olamazdı. Beş yıl raporlama, iki yıl optimizasyon.")

Sıraya dikkat: ilk dört sistemden üçü raporlama ve karar destek. Tahsis
optimizasyonu, önce hangi şehir çiftinde ne olduğunu görebilen bir
raporlama katmanı kurulduktan sonra geldi. Bu, gelir yönetimi kuran her
ekibin tekrar keşfettiği bir sıra: veriyi görmeden modeli yazamazsın.

Dört ayrı parça tek tabloya sığıyor:

| Sistem veya metot | Dönem | Temel işlevi |
|---|---|---|
| SuperSAAver | 1970'ler | %45 indirimli, kısıtlamalı ücret yapısı |
| Littlewood kuralı | 1972 | Gelir maksimizasyonu, iki sınıf |
| MOMS | 1979 | Çok sınıflı optimizasyon |
| DINAMO | 1986 | Dinamik envanter ve overbooking optimizasyonu |

## Optimizasyon motoru rezervasyon motorundan ayrı, ama gerçek zamanlı konuşur

DINAMO tek başına hiçbir şey satmıyordu. Hangi fiyattan kaç koltuk
satılması gerektiğini hesaplıyor, indirimli biletler için dinamik envanter
kontrolü yapıyordu. Satışın kendisi Sabre PSS'teydi: operasyonel
rezervasyon motoru, acentelere uygunluk (availability) gösteren altyapı.
İkisinin arasındaki veri köprüsü iki kavramla tanımlanıyordu: net nesting
ve segment limitleri.

![Solda turuncu çerçeveli DINAMO kutusu, gelir optimizasyonu: hangi fiyattan kaç koltuğun satılması gerektiğini hesaplayan algoritma; indirimli biletler için dinamik envanter kontrolü. Sağda lacivert çerçeveli Sabre PSS kutusu, yolcu hizmet sistemi: operasyonel rezervasyon motoru; satış kanallarında (acenteler) uygunluk (availability) durumunu gösteren altyapı. Ortada çift yönlü oklar ve veri köprüsü etiketi: net nesting ve segment limits. Altta not: yüksek ücretli bir yolcu talebi geldiğinde sistem net nesting (ağ içi içe geçme) sayesinde düşük ücretli koltuk havuzundan anında kapasite devralabilir.](/decks/yield-revolution/07.webp "Oklar çift yönlü. DINAMO limitleri PSS'e yazıyor, PSS satışları DINAMO'ya geri bildiriyor; tek yönlü olsaydı limitler sabaha bayatlardı.")

Net nesting'in anlamı şu: sınıflar yan yana kovalar değil, iç içe halkalar.
Yüksek ücretli bir talep geldiğinde sistem düşük ücretli havuzdan anında
kapasite devralır; tam ücret ödeyene "ucuz sınıf dolu ama pahalı sınıfta
yer yok" denmez. Segment limiti ise her sınıfa satılabilecek koltuk
sayısının üst sınırı. DINAMO bu limitleri hesaplar, PSS uygular.
Ayrımın mimari sonucu: optimizasyon motoru istediği kadar karmaşık
olabilir, çünkü satış anındaki sorgu yalnızca limite bakıyor.

Bu iç içe halkaların bugünkü haline "Envanter koltuk değildir" bölümü
giriyor; burada yalnızca 1985'te iki sistemin neden ayrı doğduğunu ve
neden gerçek zamanlı konuşmak zorunda kaldığını bilmek yeter.

## 17 Ocak 1985: ucuz bilet satarken kârlı kalmanın formülü

17 Ocak 1985'te American Airlines, Ultimate Super Saver'ı piyasaya sürdü:
rakiplerinden bile ucuz, iadesiz biletler. Fark fiyatta değil, arkasındaki
kontroldeydi. PEOPLExpress'te envanter kontrolü yoktu; strateji bütün uçağı
çok ucuz fiyattan doldurmaktı. American'da DINAMO ucuz biletlerin uçağın
yüzde kaçını kaplayabileceğini kesin sınıra bağlıyordu.

![Başlık: 17 Ocak 1985, Ultimate Super Saver. American Airlines rakiplerinden bile ucuz olan iadesiz biletleri piyasaya sürer. İki sütun. PEOPLExpress modeli: envanter kontrolü yok, tüm uçağı çok ucuz fiyattan doldurma stratejisi, uzun vadede operasyonel maliyeti karşılamada mutlak başarısızlık. American Airlines modeli: DINAMO algoritmaları ile tam entegre, ucuz biletlerin uçağın yüzde kaçını kaplayabileceği sistem tarafından kesin kısıtlamaya (capacity control) tabi. Altta lacivert sonuç kutusu: analistler tarihte ilk kez derin indirimlerin erişilebilirliğini net olarak kontrol etti; yield management, ucuz bilet satarken bile kârlı kalabilmenin algoritmik formülünü çözerek modern havayolu taşımacılığının değişmez standardı haline geldi.](/decks/yield-revolution/08.webp "İki sütunda aynı ucuz bilet var. Soldakini herkes alabiliyor, sağdakini sistemin izin verdiği kadar kişi. Farkı yaratan fiyat değil, erişim.")

Kaynak metnin tespiti net: gelir yönetimi kontrolleri olmadığı için
PEOPLExpress bütün koltukları derin indirimli fiyattan sattı ve bu uzun
vadede sürdürülebilir değildi. Önceki bölümdeki iflas listesinde
PEOPLExpress'in yanında 1986 yazıyordu; bu bölüm o tarihin nedenini
veriyor. Analistler ilk kez derin indirimin erişilebilirliğini kontrol
edebildi ve yield management, ucuz satarken kârlı kalmanın algoritmik
formülü olarak sektörün standardı oldu.

## Yarın işe yarayacak dört çıkarım

1. **İndirim kısıtsız verilmez.** Fiyatı düşürmek yetmez; iade yasağı,
   önceden alım, kalış süresi gibi kurallar katı uygulanmazsa indirim tam
   ücret ödeyecek segmente sızar. Sızıntının adı gelir kaybıdır. Kural
   doğrulanamıyorsa (demografik indirimde kimlik gibi) kural yok demektir.
2. **Overbooking'i veriyle kalibre et, hisle değil.** No-show cezası ve
   tazminat politikası geçmiş uçuş verisiyle ayarlanır. 1961-1967 arasında
   CAB'nin yaptığı tam olarak buydu: ölç, sonra bedeli belirle.
3. **Pazar payı için bütün envanteri ucuza satma.** PEOPLExpress'in
   hatası fiyat değil, kapasite kontrolünün yokluğuydu. Yüksek gelirli
   müşteri için son ana kadar yer saklayan bir model, düşük fiyatı
   sürdürülebilir kılar.
4. **Optimizasyonu satıştan ayır, ama gerçek zamanlı bağla.** DINAMO ile
   Sabre PSS ayrı sistemlerdi; net nesting ve segment limitleri
   üzerinden anlık konuşuyorlardı. Ayrı olmak karmaşıklığı izole eder,
   gerçek zamanlı olmak talep değişimine yanıt verdirir. İkisinden birini
   feda eden sistem ya bayat limit uygular ya da satış anında optimizasyon
   çalıştırmaya kalkar.

Bu bölümde ne yok: rezervasyon sınıflarının ve iç içe kotaların bugünkü
modeli ("Envanter koltuk değildir") ve overbooking denkleminin matematiği
("Overbooking bir hata değil, bir model"). İkisi de burada anlatılan
1985'in devamı.
