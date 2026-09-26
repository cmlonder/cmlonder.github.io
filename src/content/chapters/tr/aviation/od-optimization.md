---
title: "Havacılık gelir yönetimi ve O&D optimizasyonu: sanal yuvalama ve CER"
domain: "aviation"
summary: "Yüzlerce O&D-sınıf kombinasyonu, rezervasyon sisteminin izin verdiği birkaç sanal kovaya sığdırılmak zorunda. Bu bölüm o sığdırmanın hangi değerle (bilet ücreti değil, CER), hangi algoritmayla (dinamik programlama ile optimal bölümleme) ve hangi veriyle (gerçekleşmiş tarihsel bilet verisi) yapıldığını anlatıyor."
audience: "Envanter kontrolü, gelir yönetimi ya da rezervasyon sistemi entegrasyonuyla çalışan, O&D kontrolünün kod tarafında neye dönüştüğünü görmek isteyen yazılımcı ve analist. Overbooking ve O&D tahmini bölümlerinin okunmuş olması işe yarar; sanal yuvalama, CER, displacement maliyeti ve optimal bölümleme metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler uçağa kaç rezervasyon kabul edileceğini konuşuyordu:
overbooking limiti, biniş oranı, show-up varyansı. Bu bölüm o limitin
içindeki koltukların kime ayrılacağına geçiyor, ve bunu tek bir uçuşun
değil bütün ağın gözünden yapıyor. Kaynak ve varış noktası (O&D) bazlı
kontrolde soru artık "bu bacakta hangi ücret sınıfı açık" değil, "bu
koltuğu bu yolculuğa satmak ağa ne kazandırıyor". **Bir O&D'yi
envanterde doğru yere koyan şey bilet ücreti değil, ücretten ağın geri
kalanında yerinden ettiği değer düşüldükten sonra kalan net katkı.**
Bölümün geri kalanı bu net katkının nasıl hesaplandığını, rezervasyon
sisteminin dar kapısına nasıl sığdırıldığını ve hangi veriyle
beslendiğinde anlamlı kaldığını anlatıyor.

## Envanter sistemi O&D'yi tanımıyor, kovayı tanıyor

O&D optimizasyonunun ilk pratik engeli matematikte değil, altyapıda.
Bir hub havayolunun tek bir bacağından geçen O&D ve sınıf
kombinasyonlarının sayısı brifingde 300 ile 500 arası olarak veriliyor.
İstanbul-Frankfurt bacağındaki bir koltuk, yalnızca İstanbul-Frankfurt
yolcusuna değil, İstanbul üzerinden Frankfurt'a giden her aktarmalı
yolculuğa da satılabilir; her birinin kendi ücret sınıfları var.
Rezervasyon sistemi ise bu kombinasyonların her biri için ayrı bir
envanter kontrolü tutmuyor. Tuttuğu şey sınırlı sayıda sanal kova.

Sanal yuvalama (virtual nesting) tam olarak bu köprü: her O&D-sınıf
kombinasyonu bir değer ölçüsüne göre sıralanıyor ve bu sıralama birkaç
kovaya bölünüyor. Kovalar iç içe (nested) duruyor; en değerli kova en
alt kovaların koltuklarına da erişebiliyor, tersi olmuyor. Rezervasyon
talebi geldiğinde sistem O&D'ye bakmıyor, O&D'nin eşlendiği kovaya
bakıyor ve o kovanın açık olup olmadığına göre kabul ya da ret veriyor.

Kaç kova olacağı bir tasarım tercihi değil. Kaynak metin bunu açıkça
söylüyor: sanal yuvalama kovalarının sayısını rezervasyon sisteminin
yetenekleri belirliyor. Brifingdeki örnek Sabre ve sekiz kova. Yani
300-500 kombinasyon, sekiz kutuya sığmak zorunda. İş kuralı da buradan
çıkıyor: bütün O&D sınıfları bu kısıtlı sayıdaki kovaya optimal şekilde
eşlenmeli. "Optimal" kelimesinin ağırlığı bu kısıttan geliyor; kova
sayısı sınırsız olsaydı her kombinasyon kendi kovasını alır, eşleme
problemi ortadan kalkardı.

Yazılım tarafında bunun karşılığı şu: optimizasyon modeli ile
rezervasyon sistemi arasındaki arayüz, modelin ürettiği zenginliğin
büyük kısmını kaybettiren bir sıkıştırma katmanı. Model 500 ayrı değer
hesaplasa da envantere giden şey sekiz eşik. Kova sayısı modelin
dışında bir parametre olarak değil, en baştan birincil kısıt olarak
algoritmaya girmeli. Aksi halde model, hedef sistemin kabul edemeyeceği
bir çözüm üretir ve o çözümü sekize indirmek için sonradan yapılan her
el yapımı birleştirme, optimizasyonun kazancından yer.

## Sıralamanın ölçüsü ücret değil, CER

Kovaya eşleme bir sıralama ister; sıralama da bir ölçü. İlk akla gelen
ölçü bilet ücreti. Brifing bunu doğrudan reddediyor. Kaynak metin, sanal
yuvalama ortamında pazarları indekslemek için genel olarak ücretin
kullanılmaması, onun yerine CER'in hesaplanıp kullanılması gerektiğini
söylüyor.

Gerekçe ağın yapısında. Aktarmalı bir yolculuk birden fazla bacakta
koltuk tüketiyor. Ücret, o yolcunun ödediği toplam parayı gösteriyor ama
o koltukların başka yolculara satılsaydı ne getireceğini göstermiyor.
Bir bacağın satılmasının diğer bacaklar üzerinde yarattığı fırsat
maliyetine yer değiştirme (displacement) maliyeti deniyor. Ücret bu
maliyeti hesaba katmıyor; bu yüzden yüksek ücretli ama iki dolu bacağı
birden işgal eden bir aktarmalı yolculuk, ücret sıralamasında olduğundan
değerli görünüyor.

Kümülatif Etkin Gelir (Cumulative Effective Revenue, CER) bu farkı
kapatıyor. Tanımı brifingde tek cümle: CER, O&D ücretinden upline ve
downline bacakların displacement maliyeti düşülerek bulunuyor. Upline,
yolculuğun ilgili bacaktan önceki bacakları; downline, sonrakileri.
Bir bacağın envanterini yöneten sistem için bir O&D'nin değeri, ücretin
tamamı değil, o bacağa düşen net pay: yolcunun ödediği paradan, aynı
yolculuğun öbür bacaklarda yerinden ettiği değer çıkarıldıktan sonra
kalan. Brifing bunu her koltuğun gerçek ağ değeri olarak tarif ediyor.

Bu değişim bir parametre ayarı değil, bir metrik dönüşümü. Klasik ücret
sınıfı (fare class) mantığında bir koltuğun değeri sabit bir tablodan
okunur. CER mantığında aynı koltuğun değeri, ağın geri kalanındaki
doluluğa bağlı: downline bacak boşsa displacement düşük, CER ücrete
yakın; downline bacak doluysa displacement yüksek, CER düşük. Aynı O&D,
farklı günlerde farklı kovaya düşebilir.

Yazılım tarafında bunun iki sonucu var. Birincisi, CER hesaplayan servis
tek bir bacağın verisiyle çalışamaz; her O&D için yolculuğun diğer
bacaklarının displacement değerlerine erişmesi gerekiyor. Bu, envanter
modülünün bacak bazlı sınırlarını aşan bir bağımlılık. İkincisi, kova
eşlemesi statik bir referans tablosu olarak tasarlanamaz. Displacement
değerleri değiştikçe CER değişiyor, CER değiştikçe eşleme değişebiliyor.
Eşleme tablosunun bir sürümü, bir geçerlilik zamanı ve onu yeniden
üreten bir süreci olmalı.

## Sekiz kovanın sınırları dinamik programlamayla çiziliyor

CER'e göre sıralanmış 300-500 kombinasyon elde edildikten sonra ikinci
problem başlıyor: bu sıralı listeyi sekiz ardışık parçaya nereden
kesmeli? Her kesim noktası bir kova sınırı. Kesimi yanlış yere koymak,
değeri birbirinden çok farklı O&D'leri aynı kovaya koymak demek; o kova
kapandığında ikisi birden kapanıyor, açıldığında ikisi birden açılıyor.

Brifing bu problemin çözümünü bir dinamik programlama olarak veriyor.
Sistem F_n(j) özyinelemeli formülünü kullanarak her bölümleme sayısı n
için en iyi çözümü adım adım hesaplıyor. Burada c_ij, sıralı listenin
i'nci ile j'nci elemanları arasını tek bir kova yapmanın maliyet ya da
gelir indeksi. F_n(j) de ilk j elemanı n kovaya bölmenin en iyi değeri.
Brifing formülün açık halini vermiyor; ama gösterim, bilinen bölümleme
özyinelemesinin yapısına işaret ediyor: ilk j elemanı n parçaya bölmenin
en iyi yolu, son kovanın nereden başlayacağını seçip, ondan öncesini n-1
parçaya bölmenin en iyi yoluna eklemek. Her n değeri bir öncekinin
tablosunu kullanıyor.

İki kısıt bu hesabı çerçeveliyor. Birincisi, bölümleme sayısı n önceden
belirlenmiş; o da yukarıdaki rezervasyon sistemi kısıtından geliyor.
İkincisi, her c_ij değerinin hesaplamadan önce hazır olması gerekiyor.
Çözüm, mevcut alt kümeler arasındaki en düşük maliyetli kombinasyonu
bulmaya odaklanıyor. Hesap bitince geri izleme (backtracking) devreye
giriyor: tablonun son hücresinden geriye doğru yürüyerek hangi kesim
noktalarının seçildiği çıkarılıyor. Toplam maliyeti en aza indiren ya da
geliri en çoğa çıkaran bölümleme noktaları böyle bulunuyor.

Yazılım gözüyle bu kısım tanıdık: bir tablo doldurma, bir de geri
yürüme. Ama maliyetin nerede olduğunu doğru görmek gerekiyor. c_ij
değerlerinin hepsinin önceden hesaplanması şartı, eleman sayısının
karesi kadar çiftin hazırlanması demek. 500 kombinasyonlu bir bacak için
bu, bacak başına yüz binin üzerinde çift. Bir hub'ın bütün bacakları
için bu hesap her yeniden eşlemede tekrar ediliyor. Dinamik
programlamanın kendisi değil, c_ij matrisinin üretimi ve güncellenmesi
darboğaz olmaya daha yakın aday. Bu matrisi hangi sıklıkla, hangi veri
değiştiğinde yeniden üreteceğine en baştan karar vermek, algoritmayı
seçmek kadar önemli.

## İyi bir eşleme ortada şişkin, uçlarda ince

Kesim noktaları nereye düşmeli, sezgisel bir cevabı var: her kovaya
eşit trafik düşecek şekilde. Brifing bu eşit trafik sezgiselini
optimal çözümle karşılaştırıyor ve farklı bir şekil tarif ediyor. Kaynak
metin, frekans dağılımının tipik olarak ortada şişkin olduğunu ve
ortalamadan uzaklaştıkça inceldiğini söylüyor.

Yani optimal indekslemede kovaların doluluk dağılımı düz değil, çan
şeklinde. Talebin en yoğun olduğu orta segmentlerdeki kovalar daha fazla
trafik alıyor; en yüksek ve en düşük değerli uçlardaki kovalar daha az.
Brifingin gerekçesi, bu dağılımın talebin yoğunlaştığı orta segmentlerde
kova kullanımını artırarak sistem verimliliğini en çoğa çıkarması.

Buradan izlenebilir bir sinyal çıkıyor. Kovaların doluluk dağılımı
düzenli olarak ölçülebilir, ve beklenen şekil biliniyor. Dağılım uçlarda
yığılma yapıyorsa, yani en üst ya da en alt kova orantısız trafik
alıyorsa, indeksleme modeli beklenen şekilden sapmış demektir. Brifingin
önerisi bu durumda modelin tarihsel verilerle yeniden kalibre edilmesi.
Yazılım tarafında bu, eşleme sürecine bir sağlık metriği eklemek demek:
kova başına doluluk histogramı ve onun ortası ile uçları arasındaki
oran. Bir eşik aşıldığında yeniden kalibrasyonu tetikleyen bir alarm,
modelin sessizce bozulmasının önüne geçiyor.

## Model gürültüyü değil, gerçekleşmiş uçuşu görmeli

Sıralamanın ve bölümlemenin kalitesi, girdisinin kalitesinden iyi
olamaz. 300-500 O&D sınıfının arasında nadir görülen ya da aşırı yüksek
veya düşük değerli kombinasyonlar var. Bunlar ham haliyle modele
girerse, CER sıralamasının bir ucunda tek başına duran bir değer, dinamik
programlamanın bölümleme maliyetini o noktada bozabiliyor. Brifingin
tarif ettiği risk tam olarak bu: uç değerin tek başına bir kovayı işgal
etmesi. Sekiz kovadan biri, yılda birkaç kez satılan bir kombinasyona
harcanmış oluyor.

Çözüm modelin kendisinde değil, önündeki veri hazırlığında. Model
çalıştırılmadan önce tarihsel uçuş verileri kullanılarak ağırlıklı
ortalamalar hesaplanıyor. Böylece nadir kombinasyonların ağırlığı,
gerçekten ne sıklıkla uçtuklarıyla orantılı kalıyor ve gruplandırma
dengeleniyor.

Hangi verinin kullanıldığı da açık: ham teklifler değil, gerçekleşmiş
tarihsel bilet verisi (historical flown ticketed data). Fark önemli.
Ham teklif, sistemin bir anda sunduğu fiyat; kimsenin satın almadığı
teklifler de dahil. Uçulmuş biletlenmiş veri, gerçekten para ödenmiş ve
gerçekten uçulmuş yolculukları içeriyor. Birincisiyle kurulan model
sistemin ne sunduğunu, ikincisiyle kurulan model yolcunun ne aldığını
öğreniyor. Uç değerlerin yarattığı sapma ikincisinde daha küçük.

Yazılım tarafında bunun karşılığı, optimizasyon hattının girişine ayrı
bir temizleme aşaması koymak ve o aşamanın kaynağını açıkça sabitlemek.
Teklif logları hacimli ve el altında olduğu için cazip; ama doğru kaynak
gerçekten uçulmuş ve biletlenmiş yolculukların kaydı. İki kaynağı karıştıran bir
hat, hangi kovanın neden kaydığını sonradan açıklayamaz hale geliyor.

## Dört parça tek bir hat

Buraya kadar anlatılanlar ayrı teknikler gibi duruyor ama tek bir
hattın ardışık aşamaları. Uçulmuş biletlenmiş veriyle ağırlıklı
ortalamalar çıkarılıyor ve uç değerler bastırılıyor. Her O&D-sınıf
kombinasyonu için ücretten upline ve downline displacement düşülerek
CER hesaplanıyor. CER'e göre sıralanan liste, rezervasyon sisteminin
izin verdiği kova sayısına dinamik programlama ve geri izlemeyle
bölünüyor. Ortaya çıkan eşlemenin doluluk dağılımı izleniyor; ortada
şişkin, uçlarda ince değilse hat baştan, tarihsel veriyle yeniden
kalibre ediliyor.

Her aşamanın hatası bir sonrakine taşınıyor. Temizlenmemiş veri CER
sıralamasını bozuyor; ücretle yapılan sıralama bölümlemeyi yanlış
listenin üzerinde optimize ettiriyor; kova sayısını hesaba katmayan bir
model de hedef sisteme hiç sığmıyor. Bu yüzden hattın herhangi bir
parçasını ayrı bir ekibe ya da ayrı bir takvime bırakmak, bütünün
kazancını en zayıf aşamanın seviyesine çekiyor.

## Yarın işe yarayacak dört çıkarım

1. **İndekslemeyi ücret sınıfından CER'e taşı.** Rezervasyon
   sistemlerinde O&D'leri kovalara eşlerken nominal ücreti değil, upline
   ve downline displacement maliyeti düşülmüş CER değerini kullan. CER'i
   hesaplayan servisin yolculuğun bütün bacaklarına erişebileceği şekilde
   tasarla.
2. **Kova dağılımını izle, uçlarda yığılmayı alarm say.** Kovaların
   doluluk dağılımı ortada şişkin, uçlarda ince olmalı. Uçlarda yığılma
   görürsen indeksleme modelini tarihsel veriyle yeniden kalibre et.
3. **Rezervasyon sisteminin kova limitini birincil kısıt yap.** Sabre
   gibi bir sistemin sekiz kovalık sınırı, optimizasyon modelinin
   sonradan uyum sağlayacağı bir detay değil. Bölümleme sayısını modelin
   girdisi olarak baştan ver.
4. **Modeli uçulmuş biletlenmiş veriyle besle.** Ham teklifler yerine
   gerçekleşmiş tarihsel bilet verisini kullan, model öncesinde ağırlıklı
   ortalamalarla uç değerleri bastır. Nadir bir kombinasyonun tek başına
   bir kovayı işgal etmesine izin verme.

Bu bölümde ne yok: displacement maliyetinin kendisinin nasıl tahmin
edildiği, O&D talep tahmininin hangi veriden ve hangi seviyede üretildiği
("O&D talep tahmini: birinci ve ikinci nesil yaklaşımlar"), sanal
yuvalamanın tarihsel olarak nasıl ortaya çıktığı ("Gelir yönetimi ve
stratejik operasyonlar: PEOPLExpress ve American Airlines analizi"), ve
overbooking limitinin nasıl seçildiği (overbooking bölümleri). Bu bölüm
yalnızca, ağ değerinin rezervasyon sisteminin dar kapısından nasıl
geçirildiğini anlatmak için var.
