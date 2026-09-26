---
title: "Rezervasyon profillerinin kümelenmesi ve iptal oranı analizi"
domain: "aviation"
summary: "Tek tek uçuşların rezervasyon profilleri tahmine doğrudan girecek kadar sağlam değil; k-means ile standart profillere indirgeniyor ya da hiyerarşik seviyelerde saklanıyor. Bu bölüm iki yolun neden farklı kabul gördüğünü ve profil ailesinin en istikrarlı üyesi olan iptal oranı profilinin nasıl hesaplandığını, aşırı satış kararına neden en güvenilir girdi olduğunu anlatıyor."
audience: "Talep tahmini, envanter ya da aşırı satış (overbooking) tarafında çalışan, rezervasyon verisinden tahmin girdisi üreten boru hattını kuran yazılımcı ve analist. Rezervasyon profillerinin ve okuma günlerinin anlatıldığı önceki bölümün okunmuş olması işe yarar; k-means, merkezcil (centroid), hiyerarşik profil ve iptal oranı profili metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Rezervasyon profili, bir uçuşun kalkıştan önceki okuma günlerinde ne hızla
dolduğunu gösteren eğri. Önceki bölüm bu eğrinin nasıl kurulduğunu, satışa
kapalı dönemlerin nasıl ayıklandığını anlattı. Bu bölüm bir sonraki soruyu
soruyor: kurulan binlerce eğriden hangisine, ne kadar güvenilir? Cevap iki
katmanlı. Rezervasyon profilleri tek başına oynak; ya kümelenip standart
profillere indirgeniyor ya da hiyerarşik seviyelerde birleştiriliyor. Ama
profil ailesinin bir üyesi bu düzeltmelere pek ihtiyaç duymuyor. **Gelir
yönetiminde en güvenilir profil, kaç yolcunun geleceğini değil, gelmiş
olanların kaçının gideceğini söyleyen iptal oranı profili.**

![Sunumun kapak slaytı. Üst etikette Havacılıkta Gelir Yönetimi, başlıkta Rezervasyon ve İptal Profilleri yazıyor. Altında iki bilgi satırı: veri kaynağı PSS, GDS, CRM; analiz filo optimizasyonu; dönem Q3 2024. Metrikler: ortalama doluluk (LF), ortalama ücret (AR), iptal oranı (CX RT). Sağda kareli zemin üzerinde birçok eğri tek bir noktada kesişiyor; kesişimde küçük daire ve karelerden oluşan bir küme var, etrafında RES-1011, FLT 734, CX-452, BK-5600 gibi kayıt etiketleri ve iki turuncu volatility alert işareti.](/decks/booking-profiles-cancellations/01.webp "Kapakta eğriler dağınık geliyor, tek bir kümede buluşuyor. Bölümün ilk yarısı o buluşmanın bedelini, ikinci yarısı hiç dağılmayan eğriyi anlatıyor.")

## Tek bir uçuşun profili tahmine girecek kadar sağlam değil

Kaynak metin sorunu kısa koyuyor: bireysel profiller oynak olma
eğiliminde. İki sebebi var. Birincisi tarihsel gözlem yetersizliği; belirli
bir uçuş, belirli bir sınıf ve belirli bir haftanın günü için geriye dönük
çok az örnek birikiyor. İkincisi, profili tarafsızlaştırırken satışa kapalı
zaman aralıklarının dışarıda bırakılması. Önceki bölümde anlatılan arındırma
doğru bir işlem, ama bedeli var: kapalı dönemi çıkarılan profil, zaten az olan
veriyi daha da inceltiyor.

Hacim sorunu da aynı yere çıkıyor. Profil sayısını uçuş ayağı ya da segment,
rezervasyon sınıfı ve haftanın günü belirliyor; bu üçü çarpılıyor. Sunumdaki
örnekte günde 100 uçuş, 10 sınıf ve 7 gün, 7.000 ayrı profil ediyor. Bu kadar
eğriyi tek tek izlemek analist için imkânsız, tek tek güvenmek de istatistik
için yanlış.

![Başlık: Veri Dalgalanması ve Hacim Problemi. Solda alt alta kutular: 100 Uçuş (Günlük), çarpı 10 Sınıf, çarpı 7 Gün; en altta mavi kutuda eşittir 7.000 Profil. Sağda dikey ekseni dalgalanma değeri, yatay ekseni zaman ve veri noktaları olan bir saçılım grafiği. Noktaların çoğu orta bantta dağınık; biri yukarıda, biri aşağıda iki yoğun öbek var. Üstteki öbeğe not: bireysel profillerin zayıflığı, yetersiz tarihsel veri kümeleri. Alttaki öbeğe not: kapatılmış kalkış öncesi zaman aralıklarının tarafsızlaştırılma sürecinde göz ardı edilmesi.](/decks/booking-profiles-cancellations/02.webp "Soldaki çarpım sistemin kaç eğri taşıdığını, sağdaki grafik bu eğrilerin neden tek başına güvenilmez olduğunu gösteriyor. İkisi aynı çözümü istiyor: birleştirmek.")

Yazılım tarafında bunun karşılığı tanıdık: kardinalitesi çarpımla büyüyen
bir anahtar uzayında her hücrenin kendi istatistiğini tutmak, hücre başına
örnek sayısını sıfıra yaklaştırır. Tahmin motoruna giden şey artık sinyal
değil, gürültü. Çözüm, benzer davranan hücreleri birleştirip daha az ama
daha dolu gruplar kurmak.

## K-means hızlı ama sonucu başladığı yere bağlı

Birleştirmenin ilk yolu standart profiller: benzer rezervasyon akışı gösteren
bireysel profilleri kümeleyip her kümeyi tek bir temsilci eğriyle ifade etmek.
Sunum burada k-means algoritmasını anıyor (Anderberg, 1973). Algoritma merkez
tabanlı (centroid-based) çalışıyor: her kümenin bir merkezi var, her profilin
o merkeze uzaklığı hesaplanıyor ve profiller adım adım yeniden eşlenerek küme
içi hata karelerinin toplamı azaltılıyor. Uzaklığın en büyük olduğu, yani
kümeye en kötü oturan profiller önce yer değiştiriyor.

Döngünün ilk adımı normalizasyon, ve bu atlanabilecek bir hazırlık değil.
Bir yoğun hat sınıfı yüzlerce rezervasyonla, bir tali hat sınıfı birkaç
rezervasyonla profil üretiyor. Ham sayılarla çalışan bir uzaklık ölçüsü
eğrinin şeklini değil büyüklüğünü kümeler; büyük uçuşlar kendi aralarında,
küçükler kendi aralarında toplanır. Normalize edilmiş profiller ise farklı
ölçekteki uçuşları aynı şekle göre yan yana koyuyor. Kaynak metnin çıkarımı
bu yüzden kesin: k-means öncesinde veri mutlaka normalize edilmeli.

![Başlık: K-Means ile Standart Profillerin Oluşturulması. Solda dairesel oklarla bağlı üç adım: Step 1 Veri Normalizasyonu, Step 2 Merkezcil Eşleme, Step 3 Hata Azaltma. Ortada bir sarı dağınık nokta bulutu ve üç mavi yoğun küme, her kümenin ortasında koyu bir merkez noktası. Sağda gri kutu: K-Means Algoritması (Anderberg, 1973). Toplam karesel hatayı azaltan yinelemeli süreç. Hızlı ve buluşsal yöntem. Uyarı: açgözlü (greedy) yaklaşım nedeniyle optimizasyon garantisi sunmaz; n adet takas aynı anda değerlendirilmez ve başlangıç çözümünden etkilenir.](/decks/booking-profiles-cancellations/03.webp "Sarı bulut henüz bir merkeze bağlanmamış profiller. Hangi kümeye düşecekleri, döngünün nereden başlatıldığına bağlı.")

Kaynak metin algoritmanın sınırını da açık söylüyor: k-means açgözlü bir
yaklaşım ve optimalliği garanti etmiyor. Yer değiştirmeleri eşzamanlı
değerlendirmiyor, tek tek yapıyor. Her adım o an en iyi görüneni seçtiği
için ulaşılan kümeleme büyük ölçüde başlangıç çözümüne ve tanımlanan
iterasyon sınırına bağlı. Durdurma kriteri de iş mantığının parçası: toplam
hata karesi için önceden belirlenmiş bir eşik ya da sabit bir iterasyon
sayısı. Eşiğe ulaşıldığında hesaplama hızı ile doğruluk arasındaki denge
gözetilerek işlem kesiliyor.

Buna rağmen tercih ediliyor, çünkü hızlı. Kombinatoryal doğasına karşın
diğer kümeleme algoritmalarına göre oldukça çabuk sonuç veriyor. Büyük veri
setine sahip bir havayolu için yeterince iyi bir kümelemeyi hızla almak,
mutlak optimuma yavaşça ulaşmaktan daha değerli olabiliyor.

Mühendislik tarafında bunun iki pratik sonucu var. Başlangıca duyarlı bir
algoritmanın çıktısı, başlangıç sabitlenmeden tekrar üretilemez; aynı veriyle
iki gece çalışan iş iki farklı standart profil seti verebilir ve analist
bunu talepte bir değişiklik sanabilir. Durdurma eşiği ve iterasyon sınırı da
kodun içine gömülü sabitler olmamalı; hız ile doğruluk arasındaki dengeyi
iş birimi ayarlıyor, o ayar görünür ve değiştirilebilir durmalı.

## Analist, ortalamaya değil kendi uçuşuna güveniyor

Kümelemenin zayıf noktası tam da gücünden geliyor. Standart profil bir
ortalama; belirli bir uçuşun gerçek rezervasyon akışından sapan genel bir
sonuç üretebiliyor. O sapma bazen gürültü, bazen de o uçuşa özgü gerçek bir
davranış. Kümeleme ikisini ayırt etmiyor.

Kaynak metin burada istatistikle insan arasındaki farka dikkat çekiyor:
hiyerarşik yaklaşım, verim yönetimi analistlerinden genellikle daha geniş
kabul görüyor. Hiyerarşik yapıda tarafsızlaştırılmış gerçek veri birkaç
seviyede saklanıyor: uçuş ayağı (leg), uçuş segmenti, pazar, pazar varlığı
(market entity) ve sistem geneli. Analist bir uçuşun kendi verisine
bakabiliyor, veri inceyse bir üst seviyeye çıkıp pazarın ya da sistemin
davranışıyla karşılaştırabiliyor. Makro ve mikro okuma aynı yapıda duruyor.

![Başlık: Hiyerarşik Profiller ile Analist Güvenini Kazanmak. Solda beş katlı bir piramit; aşağıdan yukarı Bacak, Parkur (segment), Pazar, Pazar Varlığı, Sistem. Sağda piramide bağlı üç kutu: kümelenme yönteminin sınırlılıklarını aşar; standart profillerden sapan gerçek rezervasyon verilerini korur; tarafsızlaştırılmış gerçek verilerin hiyerarşik seviyelerde saklanması gelir yönetimi analistleri tarafından daha geniş kabul görür.](/decks/booking-profiles-cancellations/04.webp "Piramidin tabanı en ayrıntılı ama en seyrek veri. Yukarı çıktıkça veri kalınlaşıyor, uçuşa özgülük kayboluyor.")

İki yaklaşımın farkı bir karşılaştırma tablosunda netleşiyor. Standart
profil veriyi standartlaştırıyor ve bunu yaparken gerçek sapmaları
silebiliyor; hiyerarşik profil gerçek ve tarafsız veriyi olduğu gibi
koruyor. Kümeleme hesaplama açısından hızlı ama optimum garantisi yok;
hiyerarşi ise depolama açısından daha yoğun. Analist kabulünde sonuç ters:
kümelemede sınırlı, hiyerarşide geniş.

![Başlık: Profil Stratejisi Karşılaştırma Matrisi. İki sütunlu tablo: Standart Profiller (K-Means Kümeleme) ve Hiyerarşik Profiller. Yöntem satırı: merkezcil algoritma ile gruplama; hiyerarşik seviyelerde veri saklama. Veri sadakati: veriyi standartlaştırır, gerçek sapmaları silebilir; gerçek ve tarafsız verileri birebir korur. Hesaplama: hızlı ve buluşsal, ancak optimizasyon garantisi yok; veri depolama açısından daha yoğun. Analist kabulü: düşük (sınırlı kabul); yüksek (geniş kabul).](/decks/booking-profiles-cancellations/05.webp "Tablonun satırları bir bedel listesi. Kümeleme işlem süresinden, hiyerarşi depolamadan tasarruf etmiyor; analistin güveni ise ikinci taraftan yana.")

Bu, sistem tasarımında göz ardı edilen bir gereksinim. Otomatik kümeleme
sonucunu tek girdi olarak sunan bir gelir yönetimi sistemi, analistin
itiraz edemediği bir kara kutu üretiyor. Kaynak metnin önerisi, otomatik
sonuçlara tek başına güvenmemek ve analistin kontrolüne izin veren
hiyerarşik veri yapılarını (pazar, segment seviyesi) sisteme baştan
eklemek. Yazılım karşılığı, aynı ham veriden beş seviyede toplanmış görünüm
tutmak ve her tahminin hangi seviyeden beslendiğini gösterebilmek. Depolama
maliyeti burada bilinçli olarak ödenen bir bedel.

## İptal oranı, profil ailesinin istikrarlı üyesi

Buraya kadar anlatılan her şey, rezervasyon profilinin oynaklığıyla başa
çıkmanın yollarıydı. İptal oranı profili bu yolların hiçbirine o kadar
muhtaç değil. Kaynak metin bunu yapısal bir özellik olarak tanımlıyor:
iptal oranı profilleri doğası gereği yüksek istikrar gösteriyor ve bu yüzden
yaygın olarak kullanılıyor.

Hesap bir oran. Belirli bir okuma gününde eldeki rezervasyonlardan
kalkıştan önce iptal edilenlerin sayısı, o okuma günündeki toplam
rezervasyon sayısına bölünüyor. Kaynak metin sonucu şöyle tanımlıyor: iptal
oranı eldeki rezervasyonların bir yüzdesi olarak ifade ediliyor. Yani profil
okuma günü başına tek bir soruyu cevaplıyor: bugün elimde duran
rezervasyonların yüzde kaçı uçağa binmeden düşecek?

![Başlık: Stabilite Sağlayan İptal Oranı Profilleri. Üstte kutu: iptal oranları, doğası gereği yüksek stabiliteye sahip olduğu için yaygın olarak kullanılır. Ortada bir kesir: pay, okuma gününde rezervasyonu olup kalkıştan önce iptal eden yolcu sayısı; payda, okuma günündeki toplam rezervasyon sayısı. Kesrin yanında not: eldeki rezervasyonların yüzdesi olarak ifade edilir. Altta basamaklı bir alan grafiği; yatay eksen kalkışa kalan gün: 104, 90, 76, 62, 48, 34, 27, 20, 13, 6, 0. Eğri 104. günde en yüksek seviyede başlıyor ve her okuma gününde bir basamak inerek kalkışa doğru alçalıyor.](/decks/booking-profiles-cancellations/06.webp "Paydaya dikkat: oran o güne kadar yapılan tüm rezervasyonlara değil, o gün elde duranlara göre kuruluyor. Eğrinin basamakları da okuma günlerinin kendisi.")

Tanımın iki ayrıntısı önemli. Birincisi payda: oran, o güne kadar alınmış
bütün rezervasyonlara değil, o okuma gününde elde duranlara göre kuruluyor.
Böylece profilin her noktası kendi başına kullanılabiliyor; 48. günde
elinde belli sayıda rezervasyon olan bir analist, o günün oranını çarparak
kalkışa kadar kaç tanesini kaybedeceğini öngörebiliyor. İkincisi eksen:
sunumdaki eğri 104. günden başlayıp 90, 76, 62, 48, 34, 27, 20, 13 ve 6.
günlerden geçerek kalkışa iniyor. Okuma günleri kalkışa yaklaştıkça
sıklaşıyor, ve eğri her basamakta biraz daha alçalıyor. Kalkışa ne kadar
az zaman kaldıysa, elde duran rezervasyonun iptal edilmek için o kadar az
fırsatı kalıyor.

Rezervasyon profilinden farkı da burada. Rezervasyon profili bir akışı
ölçüyor: iki okuma günü arasında kaç yeni rezervasyon geldi. Bu akış satışa
açıklığa, fiyata, rakibin hamlesine bağlı; sınıf kapandığında sıfırlanıyor
ve arındırma gerektiriyor. İptal oranı ise elde duran stoğun bir oranı;
yeni satışı değil, zaten alınmış rezervasyonun davranışını ölçüyor. Kaynak
metin istikrarın sebebini ayrıntılandırmıyor, ama tanımdaki bu fark
kümelemeye ve hiyerarşiye başvurulan oynaklık sorununun iptal tarafında
neden aynı şiddette konuşulmadığını açıklamaya yetiyor.

Operasyonel sonucu doğrudan. Kalkışa kalan gün sayısına göre elde duran
rezervasyonların yüzde kaçının kaybedileceğini bilmek, kapasiteyi o kayba
göre yönetmek demek. Kaynak metnin çıkarımı da bu yönde: iptal oranlarının
tarihsel istikrarı, aşırı satış (overbooking) stratejisi kurulurken en
güvenilir veri noktalarından biri olarak kullanılmalı. Aşırı satış, iptal
edecek yolcunun koltuğunu önceden satmak; ne kadar satılacağı da o
yolcunun oranına ne kadar güvenildiğine bağlı.

Yazılım tarafında bunun karşılığı veri modelinde başlıyor. Oranı hazır
yüzde olarak saklayan bir tablo, farklı uçuşları ya da seviyeleri
birleştirirken yanlış sonuç verir; yüzdelerin ortalaması, toplamların
oranı değil. Pay ve paydayı okuma günü başına ayrı tutmak, hiyerarşinin
her seviyesinde oranı doğru yeniden hesaplamanın tek yolu. İkinci
karşılık zaman ekseninde: iptal profili, rezervasyon profiliyle aynı okuma
günü takvimini kullanıyor. İki profilin gün ekseni ayrı ayrı tanımlanırsa,
tahmin motoru aynı günün iki farklı okumasını yan yana koyar.

## Üç profil tek bir tahmine akıyor

Sunumun son slaytı parçaları bir boru hattında birleştiriyor. Bireysel
rezervasyon verisi iki kola ayrılıyor: k-means ile kurulan standart
profiller ve hiyerarşik profiller. Rezervasyon iptal oranları üçüncü kol
olarak ayrıca geliyor. Üçü bir optimizasyon motorunda buluşuyor ve çıktı
temel ücret gelir tahmini. Bireysel rezervasyon dalgalanmaları ve iptal
eğilimleri, uçuş gelirini maksimize eden tahmin profillerine
dönüştürülüyor.

![Başlık: Gelir Yönetimi Tahmin Ekosistemi. Solda nokta bulutlu Bireysel Rezervasyon Verileri kutusu. Buradan iki ok çıkıyor: Standart Profiller (K-Means) ve Hiyerarşik Profiller. Altta ayrı bir kutu: Rezervasyon İptal Oranları, içinde küçük bir çubuk grafik. Üç kutu ortadaki kalın çerçeveli Optimizasyon Motoru kutusuna bağlanıyor; motordan çıkan ok, basamaklı artan bir eğri içeren Temel Ücret Gelir Tahmini kutusuna gidiyor. Altta bant: bireysel rezervasyon dalgalanmaları ve iptal eğilimleri, uçuş gelirini maksimize eden kesin tahmin profillerine dönüştürülür.](/decks/booking-profiles-cancellations/07.webp "İptal oranları kutusu bireysel veriden gelen oka bağlı değil, motora kendi yolundan giriyor. Diyagram onun kümelemeye ihtiyaç duymadığını da böyle söylüyor.")

Diyagramdaki ayrım kasıtlı okunmaya değer. Rezervasyon verisi motora
ancak bir düzeltmeden, kümeleme ya da hiyerarşiden geçtikten sonra
giriyor. İptal oranı ise doğrudan giriyor. Motorun iki girdisi var ve
biri ötekinden çok daha az işlem istiyor. Bir tahmin sisteminin kalitesini
iyileştirmek isteyen ekip, emeğini önce hangi girdinin oynak olduğuna göre
dağıtmalı.

## Yarın işe yarayacak dört çıkarım

1. **K-means'ten önce normalize et, başlangıcı sabitle.** Normalize
   edilmemiş profiller şekle göre değil büyüklüğe göre kümelenir. Algoritma
   açgözlü ve başlangıca duyarlı olduğu için başlangıç çözümünü, durdurma
   eşiğini ve iterasyon sınırını kayıt altına al; aksi halde iki çalıştırma
   arasındaki farkı talep değişimi sanırsın.
2. **Hızı mutlak optimuma tercih etmeyi bilinçli seç.** Büyük veri
   setlerinde yeterince iyi kümelemeyi hızla almak çoğu zaman daha
   değerli. Ama bu bir tercih; hata eşiğini iş birimine görünür ve
   ayarlanabilir bırak.
3. **Kümelemenin yanına hiyerarşi koy.** Tarafsızlaştırılmış veriyi bacak,
   segment, pazar, pazar varlığı ve sistem seviyelerinde sakla; analistin
   standart profilden sapan uçuşu kendi verisiyle görebilmesini sağla.
   Depolama maliyeti, analistin sisteme güvenmesinin bedeli.
4. **Aşırı satışı iptal profiline dayandır, pay ve paydayı ayrı tut.**
   İptal oranı eldeki rezervasyonun yüzdesi ve yapısal olarak istikrarlı;
   aşırı satış kararının en güvenilir girdilerinden biri. Oranı hazır
   yüzde olarak değil, okuma günü başına iptal sayısı ve eldeki
   rezervasyon sayısı olarak sakla ki her seviyede doğru toplanabilsin.

Bu bölümde ne yok: rezervasyon profilinin okuma günleriyle nasıl kurulduğu
ve satışa kapalı dönemlerin nasıl arındırıldığı (rezervasyon profillerini
anlatan önceki bölüm), satışa kapanan uçuşun göremediği talebin nasıl
hesaplandığı (spill bölümleri) ve aşırı satış seviyesinin kendisinin nasıl
optimize edildiği. Bu bölüm, tahmin motoruna giden profillerin hangisinin
ne kadar işlenmesi gerektiğini anlatmak için var.
