---
title: "Gelir yönetiminde talep profilleri ve veri arındırma"
domain: "aviation"
summary: "Rezervasyon sistemindeki sayı talep değil, envanterin izin verdiği satış; iptaller onu şişiriyor, kapanan sınıflar onu kesiyor. Bu bölüm net talep profilinin iptali nasıl içine aldığını, iptal oranı profilinin neden karar aracı olamadığını ve kapalı sınıfın sansürlü verisinin standart rezervasyon profiliyle nasıl kısıtlanmamış talebe geri çevrildiğini anlatıyor."
audience: "Talep tahmini, rezervasyon verisi ya da gelir yönetimi (RM) sistemleriyle çalışan, tahmin modeline hangi verinin hangi düzeltmeden sonra girdiğini anlamak isteyen yazılımcı ve analist. Spill bölümlerinin okunmuş olması işe yarar; okuma günü, net talep profili, iptal oranı profili, sansürlü veri ve untruncating metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Spill bölümleri dolu uçuşun kapıda bıraktığı yolcuyu uçuş düzeyinde,
dağılımlarla hesaplıyordu. Bu bölüm bir adım geriye, tahmin modelinin
beslendiği ham veriye iniyor. Bir RM sisteminin elindeki en bol veri
rezervasyon sayısı: hangi uçuşun hangi sınıfında, kalkışa kaç gün kala kaç
koltuk satılmış. Sorun şu ki bu sayı iki yönden bozuk. İptaller onu
olduğundan yüksek gösteriyor, çünkü bugün satılan koltuğun bir kısmı
kalkışa kadar geri dönecek. Kapanan sınıflar onu olduğundan düşük
gösteriyor, çünkü satışa kapalı bir sınıfa gelen talep hiçbir yere
yazılmıyor. **Rezervasyon verisi talebin kendisi değil, envanterin izin
verdiği kadarı; gelir yönetiminin ilk işi bu veriyi tahmin modeline
girmeden önce arındırmak.** Bölüm bu arındırmanın iki ayağını anlatıyor:
iptali içine alan net talep profili ve kapanan sınıfın kaybettiği talebi
geri getiren untruncating.

## Rezervasyon eğrisi okuma günlerinde çekilen fotoğraflardan kurulur

Önce dil. Bir uçuşun rezervasyonları satışa açıldığı günden kalkışa kadar
birikiyor ve RM sistemi bu birikimi sürekli değil, belirli kontrol
noktalarında okuyor. Bu noktalara okuma günü (reading day) deniyor:
kalkıştan 90, 60, 20 gün önce gibi. Her okuma gününde sistem, o uçuşun her
sınıfında kaç rezervasyon olduğunu kaydediyor. Bu kayıtların kalkışa doğru
dizilmesiyle bir rezervasyon eğrisi çıkıyor.

Tek bir uçuşun eğrisi gürültülü. Aynı pazarda, aynı gün ve saatte kalkan
uçuşların geçmiş eğrileri üst üste konunca ise bir örüntü beliriyor:
kalkışa şu kadar gün kala toplam rezervasyonun şu kadarı genellikle
gerçekleşmiş oluyor. Bu örüntüye standart rezervasyon profili deniyor.
Kaynak metin bu profillerin tahmin algoritmalarının merkezinde durduğunu
vurguluyor. Nedenini aşağıda göreceğiz: kapanan bir sınıfın kaybettiği
talebi geri hesaplamanın tek yolu, eğrinin o noktada ne kadarının dolmuş
olması gerektiğini bilmek.

Ama önce eğrinin neyi saydığına karar vermek gerekiyor. Brüt rezervasyon
mu, iptallerden arındırılmış rezervasyon mu? İki seçenek iki ayrı profil
türü doğuruyor.

## Net profil, iptali geleceğe taşıyarak eğriyi monoton tutuyor

Eldeki rezervasyon sayısı (on-hand) okuma günleri arasında düşebilir: iki
okuma arasında yeni satıştan çok iptal gelirse eğri aşağı iner. Aşağı inen
bir eğriyle tahmin yapmak zor, çünkü "kalkışa şu kadar gün kala toplamın
yüzde kaçı gerçekleşti" sorusunun cevabı anlamını yitiriyor; aynı uçuş iki
okuma gününde toplamın farklı yüzdelerinde görünebiliyor.

Net talep profili bu sorunu iptali bulunduğu yerden alıp rezervasyonun
yapıldığı güne taşıyarak çözüyor. Kural şu: her okuma aralığında yapılan
yeni rezervasyon sayısından, o aralıkta yapılıp kalkışa kadar iptal
edilecek rezervasyon sayısı çıkarılıyor. Kalan değer o aralığın net
katkısı. Bu net değerler kalkışa doğru biriktirildiğinde, her aralığın
katkısı sıfır ya da pozitif olduğu için eğri hiç düşmüyor. Kaynak metin
buna monotonik artış diyor ve net profilin değerini buradan alıyor: kalkış
tarihine yaklaştıkça değeri azalmayan bir eğri, analizin daha sağlam bir
zemine oturmasını sağlıyor.

Burada ince bir nokta var. Net katkı, rezervasyonun yapıldığı anda değil,
kalkıştan sonra kesinleşiyor. Bir aralıkta satılan koltuklardan hangisinin
iptal edileceği ancak uçuş kalktığında belli oluyor. Yani net profil,
geçmiş uçuşların tamamlanmış verisinden kurulan bir kalıp; açık bir uçuşa
uygulanırken o kalıptaki iptal payı zaten içinde taşınıyor. Profilin
başarısı, rezervasyonun yalnızca yapıldığı anı değil, iptal edilme
olasılığını da içeren verinin derinlemesine analizine bağlı.

## Net profilin bedeli PNR verisi

Monotonluk bedava gelmiyor. "O aralıkta yapılıp kalkışa kadar iptal
edilen rezervasyon" bir sayaçtan okunamaz; her rezervasyonu yapıldığı
günden iptal edildiği güne kadar takip etmek gerekiyor. Bunu taşıyan kayıt
PNR (Passenger Name Record), yani yolcu kaydı. Kaynak metin iş kuralını
açıkça koyuyor: net rezervasyon profilini oluşturmak için PNR verisinin
işlenmesi şart.

Ve çoğu sistem bunu yapmıyor. Kaynak metin net talep profilinin sık
kullanılmadığını, çünkü bacak ya da segment bazlı RM sistemlerinin çoğunun
profili kurmak için gereken PNR verisini işlemediğini söylüyor. Bacak
bazlı bir sistem uçuş ve sınıf düzeyinde toplam sayılarla çalışıyor: bu
okuma gününde Y sınıfında kaç koltuk dolu. O sayının içinde hangi
rezervasyonun hangi gün yapıldığı yok. Toplamdan net profil
çıkarılamıyor.

Brifingin bundan çıkardığı sonuç önemli: bir RM sisteminin teknolojik
olgunluğu, kullanabileceği tahmin modelinin karmaşıklığını doğrudan
sınırlıyor. Model seçimi bir istatistik tercihi gibi görünse de aslında
veri altyapısı tercihine bağlı. Yazılım tarafında bunun karşılığı şu:
tahmin ekibi daha iyi bir profil istediğinde, cevap modelde değil
rezervasyon akışının RM'e hangi ayrıntı düzeyinde aktarıldığında. Uçuş ve
sınıf bazında toplam sayı gönderen bir entegrasyon, net profili kapıdan
çeviriyor. Rezervasyon ve iptal olaylarını kayıt kimliğiyle taşıyan bir
entegrasyon ise aynı profili mümkün kılıyor.

Kaynak metin PNR işleme kapasitesini bacak ve segment bazlı RM'den daha
karmaşık ve maliyetli buluyor. O yüzden karar teknik değil ticari:
havayolu bu yatırımı, operasyonel maliyeti ile tahmin doğruluğundan
beklediği kazancı karşılaştırarak veriyor. Net profilin sağladığı
istikrar, bu yatırımın ana gerekçesi olabilecek şey.

## İptal oranı profili hesaplanabilir ama tek başına karar veremez

PNR verisi olmayan ya da iptali ayrı izlemek isteyen bir sistemin
aklına gelen ikinci yol, iptali doğrudan bir oran olarak profillemek.
Kaynak metin bu oranın tanımını da veriyor: belirli bir okuma gününde
rezervasyon yapıp kalkışa kadar iptal eden yolcu sayısı, o gün rezervasyon
yapan toplam yolcu sayısına bölünüyor. Her okuma günü için böyle bir oran
hesaplanınca bir rezerve iptal oranı profili (booked cancellation rate
profile) çıkıyor.

Tanım net, sorun davranışında. Kaynak metin bu profili içsel volatilitesi
nedeniyle önermiyor. Bir okuma gününde yapılan rezervasyon sayısı küçük
olabiliyor; küçük bir paydanın üstündeki birkaç iptal oranı sert
oynatıyor. Oynak bir oran doğrudan kapasite kararına bağlandığında,
tahmin ettiği şeyin gürültüsünü kararın içine taşıyor. Brifing bu yüzden
daha kararlı olan net talep modellerini tercih ediyor ve iptal verisinin
yerini açıkça tarif ediyor: karar mekanizmasında doğrudan kullanılan bir
kriter değil, net talep profilini besleyen ikincil bir girdi.

Burada iki profil birbirinin alternatifi gibi dursa da aslında aynı
bilgiyi farklı yerde tutuyor. İptal oranı profili iptali ayrı bir sinyal
olarak öne çıkarıyor ve oynaklığını da beraberinde getiriyor. Net profil
aynı iptali rezervasyonun içine eritiyor ve oynaklığı eğrinin geneline
yayıyor. Tercih, oynaklığın karar anında mı yoksa kalıp kurulurken mi
emileceği.

## Kapalı sınıfın verisi sansürlü, sıfır değil

Profilin iptalden arındırılması verinin bir yönünü düzeltiyor. Öbür yön
daha sinsi. Bir sınıftaki koltuklar tükendiğinde ya da RM sistemi o sınıfı
kapattığında, o sınıfa gelen talep reddediliyor ve hiçbir kayda
düşmüyor. Kaynak metin bunu şöyle koyuyor: rezervasyon (trafik) verisi
sansürlü veridir, çünkü envanter rezervasyon sınıfına göre kapatılmış
olabilir ve bu da talebin taşmasına (spill) yol açar.

Sansürlü veri, istatistikte bir değerin yalnızca belli bir eşiğe kadar
gözlemlenebildiği veri demek. Kapalı bir sınıfta görülen 50 rezervasyon,
"bu sınıfın talebi 50" değil, "bu sınıfın talebi en az 50" anlamına
geliyor. Gerçek değer eşiğin üstünde bir yerde ve kayıt onu göstermiyor.

Bu ayrımı yapmayan bir tahmin modeli kendi kendini besleyen bir hataya
düşüyor. Brifing bunu açıkça söylüyor: yalnızca gerçekleşen satışlara
bakmak talebi eksik tahmin ettiriyor. Eksik tahmin edilen talep o sınıfa
daha az koltuk ayrılmasına, daha az koltuk sınıfın daha erken
kapanmasına, erken kapanma da bir sonraki dönemin verisinin daha çok
sansürlenmesine yol açıyor. Bu yüzden kaynak metin untruncating işlemini
gelir yönetiminin ilk adımı sayıyor. Tahmin, bu adımdan sonra başlıyor.

## Kapalı sınıfı tanımak için rezervasyon sayısı yetmiyor

Untruncating'in ön koşulu, hangi verinin sansürlü olduğunu bilmek.
Rezervasyon sayısı tek başına bunu söylemiyor: bir sınıfta 50 rezervasyon
olması, talebin 50'de bitmiş olmasıyla sınıfın 50'de kapatılmış olmasını
ayırt edemiyor. Kaynak metnin önerdiği mantık, ilgili segment ya da bacak
sınıfı için açık/kapalı göstergelerini (open/close indicators) takip
etmek. Sınıf kapalıysa o dönemin rezervasyon verisi sansürlü kabul
ediliyor; açıksa olduğu gibi kullanılıyor.

Brifingin uygulanabilir önerilerinden biri bunun altyapı karşılığı:
sistem her okuma gününde yalnızca rezervasyon sayılarını değil, sınıfların
açılış-kapanış durumunu da tarihsel bir veri seti olarak saklamalı.
Yazılım tarafında bu, çoğu zaman gözden kaçan bir şema kararı. Envanter
durumu genellikle anlık bir durum olarak tutuluyor: sınıf şu an açık ya da
kapalı. Tahmin ise geçmişe bakıyor ve geçmişteki her okuma gününde sınıfın
hangi durumda olduğunu soruyor. Anlık durumu üzerine yazan bir tablo bu
soruya cevap veremiyor. Okuma gününe göre saklanmayan kapanış bilgisi,
geriye dönük olarak yeniden kurulamıyor; o dönemin verisi temiz mi
sansürlü mü, bir daha bilinemiyor.

## Standart profil, kesilen eğriyi bir oranla tamamlıyor

Veri sansürlü olarak işaretlendikten sonra soru şu: sınıf açık kalsaydı
ne kadar talep alacaktı? Cevabı standart rezervasyon profili veriyor.
Mantık, mevcut okuma gününün toplam rezervasyon eğrisindeki yüzdelik
karşılığına dayanıyor.

Kaynak metnin örneği bunu somutlaştırıyor. Standart profil, kalkışa 20
gün kala toplam rezervasyonun yüzde 40'ının gerçekleşmiş olması
gerektiğini söylüyor. O okuma gününde mevcut rezervasyon 50. Toplam talep
potansiyeli 50'nin 0,40'a bölünmesiyle 125 çıkıyor. Kalkışa kadar gelmesi
beklenen talep de toplam tahminden mevcut rezervasyonun çıkarılmasıyla,
125 eksi 50, yani 75 oluyor.

Aynı hesap kapalı bir sınıfa uygulandığında anlamı değişiyor. Sınıf 20.
günde kapandıysa, o günden sonra gelen 75 kişilik talep sistemin hiçbir
yerinde görünmeyecek. Kayıtta 50 duracak, tahmin modeli ise untruncating
sayesinde 125 ile çalışacak. Aradaki 75, kapanmanın sessizce kestiği
talep; spill bölümlerinin uçuş düzeyinde dağılımla hesapladığı kaybın
sınıf ve okuma günü düzeyindeki karşılığı.

Bu hesap iki şeye yaslanıyor ve ikisi de bu bölümün önceki kısımlarından
geliyor. Birincisi profilin kendisi: yüzde 40 gibi bir oran, eğri monoton
olduğunda anlamlı. İptallerle aşağı inip çıkan bir eğride "toplamın yüzde
40'ı" tek bir noktaya karşılık gelmiyor; net profilin istikrarı burada
işe yarıyor. İkincisi okuma günlerinin tutarlılığı: oranı karşılaştırmak
için geçmiş uçuşların ve bugünkü uçuşun aynı kontrol noktalarında
okunmuş olması gerekiyor. Brifing bu yüzden okuma günlerinin
standartlaştırılmasını ve her okuma gününde gerçekleşen rezervasyonun
standart profil yüzdesiyle karşılaştırılmasının otomatikleştirilmesini
öneriyor.

Hesabın sadeliği yanıltıcı olmasın. Paydada duran yüzde, geçmiş uçuşların
ortalamasından geliyor ve o geçmiş uçuşların kendi verisi de sansürlü
olabilir. Profil kurulurken de açık/kapalı göstergelerine bakılması,
kapalı dönemlerin profili aşağı çekmemesi gerekiyor. Arındırma yalnızca
bugünkü uçuşa değil, onu tahmin eden kalıba da uygulanıyor.

## Arındırma bir zincir: her halka bir öncekinin verisine muhtaç

Bölümün parçaları yan yana konunca bir bağımlılık zinciri çıkıyor.
Untruncating standart profile muhtaç. Standart profilin güvenilir olması
monotonluğa, monotonluk net profile, net profil PNR verisine muhtaç.
Untruncating ayrıca her okuma gününün açık/kapalı durumuna muhtaç, o da
envanter durumunun tarihsel olarak saklanmasına. İptal oranı bu zincirin
yan kolu: kendi başına karar vermiyor, net profili besliyor.

Zincirin en zayıf halkası çoğu zaman istatistik değil veri. Bacak bazlı
toplam sayılarla çalışan ve envanter durumunu üzerine yazan bir sistem,
en iyi tahmin algoritmasını bile sansürlü ve iptalle şişmiş bir girdiyle
çalıştırıyor. Kaynak metnin vurgusu da bu yönde: PNR verisini işlemek
maliyetli ama kritik, standart profiller ise tahmin algoritmalarının
merkezinde.

## Yarın işe yarayacak dört çıkarım

1. **PNR entegrasyonunun maliyet-fayda hesabını yap.** Bacak bazlı bir
   RM sisteminden PNR verisi işleyebilen bir sisteme geçişi, operasyonel
   maliyetle tahmin doğruluğu beklentisini karşılaştırarak değerlendir.
   Net talep profilinin sağladığı istikrar bu yatırımın ana gerekçesi
   olabilir; entegrasyonu tasarlarken rezervasyon ve iptal olaylarını
   kayıt kimliğiyle taşı ki profil kurulabilsin.
2. **Okuma günlerini standartlaştır ve karşılaştırmayı otomatikleştir.**
   Rezervasyon döngüsü boyunca sabit kontrol noktaları belirle (örneğin
   kalkıştan 90, 60, 20 gün önce). Her okuma gününde gerçekleşen
   rezervasyonu standart profil yüzdesiyle karşılaştıran hesabı elle
   değil, sistemin her okumasında çalışan bir adım olarak kur.
3. **İptal oranını karar kriteri değil girdi olarak kullan.** Rezerve
   iptal oranı profili oynak olduğu için onu doğrudan kapasite ya da
   envanter kararına bağlama. İptal verisini net talep profilini besleyen
   ikincil bir girdi olarak tut.
4. **Envanter durumunu okuma gününe göre tarihsel olarak sakla.** Her
   okuma gününde yalnızca rezervasyon sayısını değil, her sınıfın
   açık/kapalı durumunu da kaydet. Anlık durumu üzerine yazan bir tablo,
   hangi geçmiş verinin sansürlü olduğunu söyleyemez ve untruncating
   yapılamaz.

Bu bölümde ne yok: taşan talebin uçuş düzeyinde dağılımlarla nasıl
hesaplandığı ve kapanış doluluğu varsayımının etkisi (spill bölümleri),
reddedilen yolcunun bir kısmının aynı havayolunun başka uçuşuna ya da
sınıfına geçmesi, ve arındırılmış verinin üzerine kurulan tahmin
yöntemleri. Bu bölüm, tahmin modeline giren sayının neden ham rezervasyon
sayısı olamayacağını ve hangi altyapı kararlarının onu düzeltmeyi mümkün
kıldığını anlatmak için var.
