---
title: "Havacılık gelir yönetimi: virtual nesting (sanal yuvalama) analizi"
domain: "aviation"
summary: "Virtual nesting, binlerce güzergah ve rezervasyon sınıfı kombinasyonunu yolcunun ağa kattığı net değere göre birkaç sanal kovaya toplayıp envanteri o kovalar üzerinden yönetir. Bu bölüm yolcu değerinin ücretten yerinden etme maliyetleri düşülerek nasıl hesaplandığını, kovaların neden iç içe dizildiğini ve kova sayısını neden matematiğin değil envanter kaydındaki boş alanın belirlediğini anlatıyor."
audience: "Envanter, PSS ya da gelir yönetimi sistemleriyle çalışan, bir uçuşta hangi sınıfın neden kapandığını anlamak isteyen yazılımcı ve analist. Overbooking ve talep tahmini bölümlerinin okunmuş olması işe yarar; O&D kontrolü, güzergah sınıfı, sanal kova, seri yuvalama, yerinden etme maliyeti, CER ve IND kaydı metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler bir uçuşa kaç rezervasyon kabul edileceğini anlatıyordu:
show-up tahmini, overbooking limiti, spoilage ile oversale arasındaki
denge. Bu bölüm bir sonraki soruya geçiyor: kabul edilecek o koltukların
hangisi kime satılacak? Klasik cevap rezervasyon sınıfıydı; Y açık, M
açık, Q kapalı. Ama sınıf yalnızca ücret seviyesini söylüyor, yolcunun
nereden nereye gittiğini söylemiyor. Aynı Q ücretiyle tek bacak uçan
yolcu ile o bacağı üç bacaklı bir yolculuğun ortasında kullanan yolcu
ağa aynı parayı bırakmıyor. **Virtual nesting, envanteri rezervasyon
sınıfına göre değil yolcunun ağa kattığı net değere göre yönetmenin, eski
envanter kayıtlarını baştan yazmadan bulunmuş yaklaşık ama işleyen
yoludur.** İlk kez 1987'de American Airlines tarafından uygulandı ve
gelir yönetiminde bacak bazlı kontrolden kalkış-varış (Origin &
Destination, O&D) kontrolüne geçişin ilk adımı sayılıyor.

Kaynak metin sistemin amacını tek cümlede tanımlıyor: virtual nesting,
yolcunun değerine dayanan yaklaşık bir O&D kontrolü sağlıyor. Cümledeki
iki kelime bütün bölümün iskeleti. "Değer" yolcunun ne ödediği değil, ağa
ne bıraktığı. "Yaklaşık" da tasarımın bilinçli bir tercihi: tam O&D
kontrolü her güzergah ve sınıf kombinasyonunu ayrı ayrı izlemeyi
gerektirir, virtual nesting ise bunları birkaç kovaya sıkıştırarak
hassasiyetten bir miktar feda edip mevcut altyapıda çalışabilir hale
geliyor.

## Kontrol birimi sınıf değil, kova

Geleneksel envanter kontrolünde her uçuş bacağında her rezervasyon
sınıfının bir satış limiti var. Sınıf kapanınca o ücret seviyesinden satış
duruyor, hangi güzergahın parçası olursa olsun. O&D kontrolünde ise
karar birimi güzergah sınıfı (itinerary class): bir kalkış-varış çifti ile
bir rezervasyon sınıfının birleşimi. LAX-LHR yolculuğunun Q sınıfı, JFK-LHR
yolculuğunun Q sınıfıyla aynı JFK-LHR koltuğunu istese bile ayrı bir
güzergah sınıfı.

Sorun sayıda. Bir ağda güzergah sınıfı sayısı binlerle ölçülüyor ve
yolcu servis sistemi (PSS) bunların her biri için ayrı bir envanter
kaydı tutacak şekilde tasarlanmamış. PSS'in bir uçuş bacağı için tuttuğu
envanter detay kaydı (Inventory Detail Record, IND) sınırlı sayıda
kontrol alanı barındırıyor; o alanlar da geleneksel olarak rezervasyon
sınıflarına ayrılmıştı.

Virtual nesting bu uyuşmazlığı bir eşleme tablosuyla çözüyor. Her
güzergah sınıfı, değerine göre az sayıdaki sanal kovadan (virtual bucket)
birine atanıyor. Envanter artık sınıfa değil kovaya göre kontrol
ediliyor; kaynak metin bunu açıkça söylüyor: kova, envanteri kontrol
etmek için rezervasyon sınıfının yerine kullanılıyor. Binlerce O&D
kombinasyonu IND üzerinde yönetilebilir küçük bir kümeye iniyor.

Yazılım tarafında bunun karşılığı bir dolaylama katmanı. Satış isteği
geldiğinde sistem önce "bu güzergah sınıfı hangi kovada?" sorusunu
tablodan cevaplıyor, sonra o kovanın açık olup olmadığına bakıyor.
Envanter kaydının şeması değişmiyor; değişen, kayıttaki alanların neyi
temsil ettiği. Yeni kontrol mantığını eski veri modelinin üstüne bu tür
bir eşlemeyle oturtmak, altyapıyı yeniden yazmadan davranışı
değiştirmenin bilinen yolu ve virtual nesting'in 1987'de uygulanabilir
olmasının sebebi de bu.

## Kovalar iç içe olduğu için kapanış kendiliğinden aşağı akıyor

Kovalar birbirinden bağımsız kotalar değil. Seri olarak iç içe
(nested) diziliyorlar: en yüksek değerli kova, altındaki bütün kovaların
envanterine erişebiliyor; en düşük değerli kova yalnızca kendi payına.
Yüksek değerli bir talep her zaman düşük değerli bir talebin
kullanabileceği koltuğu alabilir, tersi olmaz.

Bu dizilişin operasyonel sonucu otomasyon. Bir bacakta satışlar arttıkça
alt kovalar sırayla doluyor ya da kapanıyor. Bir kova kapandığında ona
eşlenmiş bütün güzergah sınıfları aynı anda satışa kapanıyor, üstteki
kovalar ise açık kalıyor. Analistin tek tek sınıf kapatmasına gerek
kalmıyor; sıradüzen bunu kendisi yapıyor.

Buradaki incelik şu: kapanan şey bir ücret seviyesi değil, bir değer
aralığı. Aynı rezervasyon sınıfı bir güzergahta üst kovaya, başka bir
güzergahta alt kovaya düşebiliyor. Dolayısıyla alt kova kapandığında bazı
Q yolcuları satışa kapanırken başka Q yolcuları hâlâ satın alabiliyor.
Geleneksel sınıf kontrolünde bu ayrım yapılamıyordu.

Yazılım tarafında bu, müsaitlik (availability) cevabının artık uçuş ve
sınıftan ibaret bir fonksiyon olmadığı anlamına geliyor. Aynı uçuşun aynı
sınıfı, isteğin hangi O&D'den geldiğine göre açık ya da kapalı
dönebiliyor. Müsaitliği önbelleğe alan ya da dağıtım kanallarına
yayınlayan her katman bu boyutu anahtarına eklemek zorunda; eklemezse bir
güzergahın cevabını başka bir güzergaha sızdırıyor.

## Yolcunun değeri ödediği ücret değil, geride bıraktığı net katkı

Güzergah sınıfını hangi kovaya koyacağımız değerine bağlı. Bu değerin
adı kaynakta CER (Cumulative Effective Revenue). Kaynak metin tanımı
açık yapıyor: bir güzergah sınıfının değeri, ücretten upline ve downline
yerinden etme maliyetlerinin düşülmüş hali.

Yerinden etme maliyeti (displacement cost), bir yolcunun bir bacakta
koltuk kullanmasının o koltuğu alabilecek başka bir yolcuyu dışarıda
bırakma bedeli. Upline, değerlendirilen bacaktan önceki bacaklar;
downline, sonrakiler. Bağlantılı bir yolcu birden fazla bacakta koltuk
tüketiyor ve her bacakta başka bir talebin önünü kesme ihtimali var.

Kaynağın kendi örneğiyle düşünelim: LAX-JFK-LHR. Bu yolcu JFK-LHR
bacağında değerlendirilirken ödediği toplam ücret yüksek görünüyor, çünkü
iki bacağın parasını taşıyor. Ama aynı yolcu LAX-JFK bacağında da bir
koltuk alıyor. O bacak doluysa ve koltuğu yüksek ücretli bir yerel
yolcuya satılabilecekse, bağlantılı yolcunun gerçek katkısı ödediği
ücretten o kaybın düşülmüş hali. CER bu farkı ölçüyor: yolcunun tek bir
bacakta bıraktığı parayı değil, bütün ağdaki kârlılığını.

Hesaplamanın sonucu doğrudan kova atamasına dönüyor. Yolcunun bir bacakta
uçması başka bir kârlı yolcunun o koltuğu almasını engelliyorsa yerinden
etme maliyeti yüksek çıkıyor ve CER'den düşülüyor. CER düşük kalırsa
güzergah sınıfı daha düşük bir sanal kovaya atanıyor. Düşük kova da,
iç içe dizilişin gereği, bacak dolmaya başladığında ilk kapananlardan
biri; yani sistemin o talebi reddetme olasılığı artıyor.

## Yerinden etme maliyeti ağ modelinden geliyor, bu yüzden bayatlıyor

Yerinden etme maliyetlerini virtual nesting kendisi üretmiyor, bir ağ
optimizasyon modelinden alıyor. Model her bacağın ne kadar sıkışık
olacağını tahmin ediyor ve bir koltuğun o bacaktaki fırsat maliyetini
çıkarıyor. CER bu çıktının üstüne kuruluyor.

Buradan iki sonuç çıkıyor. Birincisi, CER statik olamaz. Talep değiştikçe
bacakların sıkışıklığı değişiyor, yerinden etme maliyetleri değişiyor,
güzergah sınıflarının kova yerleri de değişmeli. Dünkü maliyetle
hesaplanan CER, bugün boşalmış bir bacak için bağlantılı yolcuyu gereksiz
yere cezalandırabilir ya da dolmuş bir bacak için korumasız bırakabilir.
Kaynak metnin önerisi de bu yönde: CER hesabı, ağdaki talep
değişikliklerine göre güncellenen yerinden etme maliyetlerini anlık
yansıtmalı.

İkincisi, ağ etkisi tek bacakla bitmiyor. Kaynak, ağ etkilerini birinci,
ikinci ve üçüncü derece olarak ayıran bir tabloya atıf yapıyor ve
bağlantılı uçuşların birbirine etkisinin CER formülüne eksiksiz girmesini
istiyor. LAX-JFK-LHR yolcusunu kabul etmek LAX-JFK'daki bir yerel
yolcuyu dışarıda bırakıyor; o yerel yolcunun yerine geçecek talep başka
bir bağlantının parçası olabiliyor ve etki böyle dalgalanıyor. Formül
yalnızca doğrudan komşu bacağı sayarsa bu zincirin geri kalanı görünmez
kalıyor.

Yazılım tarafında bunun karşılığı bir veri tazeliği sözleşmesi. Ağ
modelinin çıktısı ile müsaitlik cevabı veren sistem arasında bir
güncelleme döngüsü var ve iki sistemin ne sıklıkla senkronize olduğu,
kova atamalarının ne kadar doğru olduğunu belirliyor. Eşleme tablosunu
bir kez kurup bırakan bir entegrasyon, O&D kontrolünü kâğıt üzerinde
sağlayıp pratikte geçen haftanın ağını yönetiyor.

## Kovaları istatistik kuruyor, sayısını envanter kaydı belirliyor

Güzergah sınıflarının hangi değer aralıklarıyla kovalara bölüneceği
rastgele seçilmiyor. Kaynak bunun için dinamik programlama modeline
işaret ediyor ve modelin hedefini şöyle tanımlıyor: kümeleme süreci, bir
kova içindeki müşteri değerlerinin varyansını en aza indirirken kovalar
arasındaki ayrımı aynı anda en çoğa çıkarıyor. İçeride homojenlik,
dışarıda heterojenlik.

Bu hedefin mantığı kontrol hassasiyetinde. Bir kova açık ya da kapalı;
içindeki bütün güzergah sınıfları aynı kaderi paylaşıyor. Kovanın içinde
değerler birbirinden çok farklıysa, kova kapandığında değerli bir yolcu
değersiz komşusuyla birlikte reddediliyor ya da kova açık kaldığında
değersiz bir yolcu değerli komşusunun hakkına ortak oluyor. Varyansı
küçük tutmak bu kaybı küçültüyor. Kovalar arası ayrımı büyük tutmak da
her kapanış kararının anlamlı bir değer eşiğine karşılık gelmesini
sağlıyor.

Kaç kova olacağı ise matematiksel değil, fiziksel bir kararla
belirleniyor. Karar noktası PSS'teki IND kaydında kontrol alanı olarak
kullanılabilecek boş yer. Kova ne kadar çoksa değer aralıkları o kadar
dar, kontrol o kadar hassas; ama her kova IND üzerinde bir alan istiyor.
Daha hassas kontrol için daha fazla kova gerekiyorsa IND kayıtlarının
genişletilmesi gerekiyor ve kaynak bunun ciddi bir teknoloji yatırımı
olduğunu vurguluyor.

Yani virtual nesting'in hassasiyet tavanı, gelir yönetimi ekibinin
modelinde değil, eski bir envanter kaydının sabit genişliğinde
duruyor. Bu, SABRE'den PSS'e uzanan mimarinin neden bu kadar uzun
yaşadığını anlatan bölümün küçük bir yankısı: veri modeli bir kez
yerleşince üstündeki iş mantığı ona uymak zorunda kalıyor.

Kaynağın bu noktadaki önerisi pratik: IND genişletmesine yatırım
yapmadan önce mevcut kova sayısıyla elde edilen ayrıştırma verimliliğini
dinamik programlama çıktıları üzerinden ölç. Kümeleme mevcut kova
sayısıyla zaten iç varyansı düşük, dış ayrımı yüksek bir bölüntü
üretiyorsa, yeni alan açmanın getirisi maliyetini karşılamayabilir.
Kovaların içi hâlâ çok karışıksa yatırımın gerekçesi de o çıktıda.

## Neden "yaklaşık" kelimesi bir kusur değil, bir tasarım kararı

Virtual nesting tam bir O&D kontrolü değil. Değeri aynı kovaya düşen iki
güzergah sınıfı, aralarında fark olsa bile aynı muameleyi görüyor. Yerinden
etme maliyetleri bir modelin tahmini ve güncellenme sıklığı kadar doğru.
Kova sayısı ihtiyaçla değil kayıttaki boş alanla sınırlı.

Ama bu sınırların karşılığında elde edilen şey büyük: bacak bazlı sınıf
kontrolünün göremediği ağ etkisini, altyapıyı değiştirmeden envanter
kararına sokmak. Sınıf kontrolünde bağlantılı yolcu ile yerel yolcu aynı
sınıftaysa aynı kaderi paylaşıyordu. Virtual nesting'de değerleri
farklıysa farklı kovalara düşüyor ve bacak dolarken hangisinin önce
reddedileceği değerlerine göre belirleniyor.

Aynı ailenin sonraki halkaları, bu yaklaşıklığın maliyetini düşürmeye
çalışan tekniklerden oluşuyor: kovaları dinamik hale getirmek, envanteri
çift indekslemek, kovayı tamamen bırakıp teklif fiyatına (bid price)
geçmek. Hepsinin çıkış noktası bu bölümde anlatılan iki fikir: yolcunun
değeri ağdaki net katkısıdır ve kontrol, değere göre sıralanmış iç içe
bir yapı üzerinden yapılır.

## Yarın işe yarayacak dört çıkarım

1. **Kova sayısını artırmadan önce mevcut bölüntüyü ölç.** IND
   genişletmesi ciddi bir yatırım. Önce dinamik programlama çıktısında
   kovaların iç varyansına ve aralarındaki ayrıma bak; hassasiyet kaybı
   gerçekten kova sayısından mı geliyor, yoksa kümelemenin kendisinden mi,
   bunu ayır.
2. **Yerinden etme maliyetini bir sabit değil, bir akış olarak ele al.**
   CER'in doğruluğu ağ modelinden gelen maliyetlerin tazeliğine bağlı.
   Ağ modeli ile envanter arasındaki güncelleme döngüsünü ölç ve izle;
   eşleme tablosu talep değiştikçe değişmiyorsa O&D kontrolü sadece
   isimde kalıyor.
3. **Kapanışı sıradüzene bırak, elle sınıf kapatmayı azalt.** Seri
   yuvalama yüksek değerli talep geldiğinde alt kovaları otomatik
   kapatıyor. Manuel müdahaleyi bu mekanizmanın göremediği istisnalara
   sakla; sınıf bazlı elle kapatma, kova mantığının ürettiği O&D
   ayrımını ezer.
4. **Ağ etkisini ilk komşu bacakta kesme.** CER formülüne yalnızca
   doğrudan upline ve downline bacağı değil, kaynağın ayırdığı ikinci ve
   üçüncü derece etkileri de al. LAX-JFK-LHR gibi bağlantılı bir
   yolculuğun kabulü, dışarıda bıraktığı yolcunun yerine geçecek talep
   üzerinden başka bağlantılara da dokunuyor.

Bu bölümde ne yok: bir uçuşa toplamda kaç rezervasyon kabul edileceği
("Havacılıkta overbooking (fazla rezervasyon) ve show-up modelleme
stratejileri"), güzergah bazlı talebin nasıl tahmin edildiği ("O&D talep
tahmini: birinci ve ikinci nesil yaklaşımlar") ve kovaların dinamik hale
getirildiği ya da teklif fiyatıyla değiştirildiği sonraki teknikler. Bu
bölüm, envanterin sınıftan değere geçtiği ilk adımı anlatmak için var.
