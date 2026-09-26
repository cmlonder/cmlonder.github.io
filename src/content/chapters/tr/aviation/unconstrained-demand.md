---
title: "Gelir yönetiminde talep tahmini ve kısıtlanmamış talep analizi"
domain: "aviation"
summary: "Satışa kapalı bir sınıfın rezervasyon geçmişinde görünen sıfır, talebin sıfır olduğunu söylemiyor; yalnızca satışın durdurulduğunu söylüyor. Bu bölüm kapalı dönemlerin talebinin rezervasyon profili ve EM algoritmasıyla nasıl geri kazanıldığını, brüt talepten uçağa binecek yolcuya nasıl inildiğini ve geleceğe dönük tahmin modellerinin hangi girdilerle kurulduğunu anlatıyor."
audience: "Gelir yönetimi, envanter ya da talep tahmini sistemleriyle çalışan, tahmin modeline giren verinin neden ham rezervasyon sayısı olmadığını anlamak isteyen yazılımcı ve analist. Spill bölümlerinin okunmuş olması işe yarar; untruncation, sansürlenmiş veri, rezervasyon profili, EM algoritması ve biniş oranı metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler taşan talebi (spill) uçak düzeyinde ele aldı: kabin
dolunca kapıdan dönen yolcuyu hangi dağılımla, hangi varsayımla
hesaplayacağımızı. Bu bölüm aynı sorunun daha ince çözünürlükteki haline
iniyor. Gelir yönetimi sistemi uçağın tamamını değil, tek tek satış
sınıflarını ve rezervasyon dönemlerini yönetiyor; bir sınıf kapatıldığında
o sınıfın geçmişine sıfır yazılıyor. **Rezervasyon geçmişi talebi değil,
havayolunun talebe izin verdiği kısmı kaydediyor; tahmin modeline bu kaydı
olduğu gibi vermek, sistemi kendi kapattığı kapıları talep yokluğu diye
okumaya zorlamak demek.** Bölüm üç adımı anlatıyor: kapalı dönemin talebini
geri kazanmak (untruncation), o talepten uçağa gerçekten binecek yolcuya
inmek ve geleceğe dönük tahmini hangi girdilerle ve hangi yöntemlerle
kurmak.

## Satışa kapalı dönemdeki sıfır bir ölçüm değil

Bir rezervasyon sınıfı kapalıyken o sınıfta gerçekleşen rezervasyon
sayısı sıfır. Ama bu sıfırın anlamı, açık bir dönemde görülen sıfırla aynı
değil. Açık dönemde sıfır, gerçekten kimsenin gelmediğini söylüyor. Kapalı
dönemde ise yalnızca kimsenin alamadığını söylüyor; o sırada kaç kişinin
almak istediği hakkında hiçbir bilgi taşımıyor. Kaynak metin bu yüzden
kapalı dönemlerdeki gerçek talebi belirlemeyi kritik bir iş süreci olarak
tanımlıyor ve bu işe talep kısıtlamasını kaldırma (demand untruncation)
adını veriyor.

Bu fark tahmin modelinin başına dert oluyor, çünkü geçmiş veride kapalı
dönemler rastgele dağılmıyor. Bir sınıf genellikle talep yüksek olduğu için
kapatılıyor. Yani sıfırların yığıldığı yer, talebin en güçlü olduğu yer.
Kapalı dönemleri olduğu gibi ortalamaya katan bir model, yoğun uçuşların
talebini sistematik olarak düşük tahmin ediyor, düşük tahmin daha az koltuk
ayırmaya, daha az koltuk da bir sonraki dönemde yine erken kapanmaya ve
yine sıfıra yol açıyor. Kaynak metnin çıkarım tablosu bunu açıkça
söylüyor: satışa kapalı dönemlerde gerçekleşmeyen rezervasyonlar yalnızca
sıfır olarak kabul edilmemeli.

Yazılım tarafında bunun karşılığı veri modelinde başlıyor. Untruncation
yapılabilmesi için her rezervasyon döneminin yanında o dönemde sınıfın açık
mı kapalı mı olduğunun da saklanması gerekiyor. Yalnızca rezervasyon
sayısını tutan bir geçmiş tablosu, sonradan hangi sıfırın gerçek hangisinin
yapay olduğunu ayırt edemez; o bilgi o gün kaydedilmediyse geri gelmez.

## Kapalı dönemin payı, açık dönemlerin payından geri hesaplanıyor

Kapalı dönemin talebini bulmanın ilk yolu oransal. Sistem önce tarihsel
veriden, benzer uçuşlarda toplam rezervasyonun zaman içinde nasıl
biriktiğini gösteren bir rezervasyon profili çıkarıyor. Kaynak metin bunlara
tarafsız rezervasyon profili yüzdeleri diyor: her rezervasyon döneminin
toplam talebin yüzde kaçını taşıdığını söyleyen bir dağılım. Tarafsız
olması önemli, çünkü profil kapalı dönemlerin yapay sıfırlarından
etkilenmemiş olmalı; yoksa geri kazanmaya çalıştığımız kaybı profile
gömmüş oluruz.

Hesap üç adım. Gerçekleşen toplam rezervasyon sayısı, satışa açık olan
dönemlerin profil yüzdelerinin toplamına bölünüyor. Çıkan sayı kısıtlanmamış
toplam rezervasyon (unconstrained total): sınıf hiç kapanmasaydı toplam
talebin ne olacağının tahmini. Bu toplamdan açık dönemlerde gerçekleşen
rezervasyonlar çıkarılınca kalan, kapalı döneme düşen pay oluyor.

Kaynak metin bunu tek bir örnekle veriyor: satışa açık dönemler toplam
rezervasyon profilinin yüzde 85'ini temsil ediyor ve bu dönemlerde 50
rezervasyon gerçekleşmiş. Kısıtlanmamış toplam 50 bölü yüzde 85, yani 58,8.
Aradaki 8,8 rezervasyon, sınıf kapalıyken gelip geri çevrilen talebin
tahmini. Rakam küçük görünebilir ama gerçekleşen satışın yaklaşık altıda
biri kadar; ve tekrar ediyor, çünkü bu sınıf her yoğun dönemde aynı şekilde
kapanıyor.

Yöntemin varsayımı açık: kapalı dönemdeki talebin, açık dönemlere göre
oranı tarihsel profildekiyle aynı. Profil ne kadar iyi kurulduysa geri
kazanılan talep o kadar güvenilir. Profili yanlış olan bir sistem,
untruncation'ı doğru uygulasa bile yanlış bir sayıyı özenle hesaplıyor.

## Kısmen açık dönemde büyük olan kazanıyor

Gerçek hayat dönemleri temiz biçimde açık ve kapalı diye ayırmıyor. Bir
sınıf dönemin ortasında kapanabiliyor ya da yeniden açılabiliyor. Bu kısmen
açık (partially open) dönemler için kaynak metin bir iş kuralı tanımlıyor:
maksimum kuralı. O dönemde gerçekleşen gerçek net rezervasyon sayısı ile
profilden hesaplanan tahmini talep karşılaştırılıyor, hangisi büyükse
kısıtlanmamış talep olarak o kabul ediliyor.

Kuralın mantığı tek yönlü bir güvenlik payı. Dönemin bir kısmı açık
olduğundan gerçekleşen rezervasyon, gerçek talebin alt sınırı: en az bu
kadar insan gelmiş. Tahmini talep bu alt sınırın altında kalıyorsa tahmin
açıkça yanlış demek, gözlem kazanıyor. Tahmin üstteyse, kapalı kalan kısmın
kaybı hesaba katılmış oluyor. Yazılım tarafında bu, untruncation
fonksiyonunun dönemin durumuna göre üç dala ayrılması demek: tam açık
dönemde gözlemi kullan, tam kapalı dönemde profilden hesapla, kısmen açık
dönemde ikisinin maksimumunu al. Durum bilgisi ikili değil üç değerli
olmalı; açık ve kapalı diye iki durum tutan bir şema kısmen açık dönemi
temsil edemez.

## Sansürlenmiş veri, basit ortalamanın çözemediği bir problem

Profil yöntemi oransal bir düzeltme. Daha genel çözüm, sorunu istatistiğin
bilinen bir sınıfı olarak ele almak: sansürlenmiş veri (censored data).
Kaynak metin sansürlenmeyi iş mantığı açısından şöyle tanımlıyor:
bağımlı değişkenin, yani talebin, gözlemlenebilen aralığı kısıtlanmış.
Satış kapandığında ya da kapasite limitine ulaşıldığında gözlem bir tavana
çarpıyor; tavanın üstünde ne olduğunu veri söylemiyor. Gözlemlenen sayı
talebin kendisi değil, talep ile tavanın küçüğü.

Buna uygulanan algoritma EM. Kaynak metin adını Expected Maximization
olarak veriyor; literatürdeki yaygın adı beklenti maksimizasyonu
(Expectation-Maximization). Algoritma eldeki kısıtlı rezervasyon verisini
girdi olarak alıyor ve dağılım parametrelerinin maksimum olabilirlik
tahminlerini yinelemeli olarak hesaplıyor. Her turda mevcut parametre
tahminiyle sansürlenmiş gözlemlerin beklenen gerçek değerlerini dolduruyor,
sonra bu tamamlanmış veriyle parametreleri yeniden tahmin ediyor; bu döngü
parametreler oturana kadar sürüyor. Amaç, kısıtlı veri setinden gerçek
talep dağılımını çıkarmak.

Kaynak metne göre EM'yi kısıtlanmamış talep tahmininde uygulanabilir
olduğu için popüler hale getirenler Talluri ve van Ryzin (2004). Brifing
bunu modern gelir yönetimi sistemlerinin basit ortalamalarla değil,
olasılık hesaplarıyla ve yinelemeli algoritmalarla çalıştığının bir
göstergesi olarak okuyor.

İki yöntemin farkı mühendislik açısından somut. Profil yöntemi tek geçişli
bir hesap: bir bölme, bir çıkarma. EM ise yinelemeli bir optimizasyon;
yakınsama ölçütü, tur sınırı ve başlangıç değeri gerektiriyor, çalışma
süresi veriye göre değişiyor. Binlerce uçuş ve sınıf için gece çalışan bir
toplu işte bu fark, işin zaman penceresine sığıp sığmayacağını belirliyor.
Hangisinin seçileceği brifingin konusu değil; ama ikisinin aynı sorunu
farklı maliyetle çözdüğünü bilmek, seçimi bilinçli yapmanın ön şartı.

## Kurtarılan talep henüz yolcu değil

Untruncation'dan çıkan sayı brüt talep: dönemde rezervasyon yapmak
isteyen insan sayısı. Kapasite ve envanter kararı ise uçağa gerçekten
binecek yolcuya göre veriliyor. Arada iki filtre var.

Birincisi iptal. Standart rezervasyon iptal oranı profili kullanılarak,
rezervasyon yapanlardan kaçının iptal etmeyeceği hesaplanıyor. İkincisi
biniş. Bu sayıya uçağa biniş oranı tahmini (boarding rate forecast)
uygulanıyor ve fiilen kapıya gelecek yolcu sayısı, yani show-up bulunuyor.
Sonuç net talep.

Sıralama önemli ve kaynak metin de bu sırayı izliyor: önce kısıtlamayı kaldır,
sonra iptali düş, sonra binişi uygula. Filtreleri untruncation'dan önce
uygulamak, zaten eksik olan bir sayıyı daha da küçültmek demek. Brifingin
çıkarım tablosu da net talep tahmininde yalnızca rezervasyon sayısına değil
iptal ve biniş oranlarına bakmanın operasyonel gerçekçiliği artırdığını
söylüyor.

Yazılım tarafında bunun karşılığı üç ayrı tahminin zincirlenmesi:
kısıtlanmamış rezervasyon tahmini, iptal profili ve biniş oranı tahmini.
Üçü ayrı modeller, ayrı kalibre ediliyor ve ayrı hata üretiyor. Zincirin
sonundaki net talep rakamı hatalı çıktığında hatanın hangi halkadan
geldiğini bulabilmek için ara sonuçların da saklanması gerekiyor; yalnızca
son rakamı tutan bir boru hattı hata ayıklanamıyor. Biniş oranı ve fazla
rezervasyon (overbooking) ilişkisi ayrı bir konu; burada yalnızca net
talebin hesabındaki yeri önemli.

## Tahmin geçmişle değil, geçmiş artı şu anla kuruluyor

Untruncation geçmişi temizliyor. Geleceğe dönük tahmin bu temizlenmiş
geçmişin üstüne kuruluyor ama tek girdisi o değil. Kaynak metin bir uçuşun
talep tahmininde önceliklendirilen girdileri şöyle sayıyor: tarihsel veri,
mevcut rezervasyon durumu (bookings on hand), rezervasyon sınıflarının
açık ya da kapalı statüsü, sezonluk etkiler ve talebi etkileyen diğer
bağımsız değişkenler, örneğin özel etkinlikler.

Listede iki kalem dikkat çekiyor. Birincisi mevcut rezervasyon durumu:
tahmin kalkışa kadar sabit kalmıyor, eldeki rezervasyonlar biriktikçe
güncelleniyor. Brifingin çıkarım tablosu bunu rezervasyon hızı (booking
pace) olarak anıyor ve anlık olarak modele entegre edilmesi gerektiğini
söylüyor. İkincisi açık/kapalı statü: bu yalnızca geçmişi untruncate
etmek için değil, bugünkü tahmini okumak için de gerekiyor. Şu an kapalı
bir sınıfta rezervasyon hızı düşükse, bu talebin zayıf olduğunu değil
sınıfın kapalı olduğunu gösteriyor. İki bilgi aynı anda modele girmezse
model aynı hatayı bu kez gerçek zamanlı yapıyor.

Mimari açıdan bu, tahmin servisinin yalnızca bir veri ambarından toplu
okuma yapmadığı anlamına geliyor. Envanter sisteminin güncel durumunu,
yani sınıfların açıklığını ve eldeki rezervasyonları da görmesi gerekiyor.
Tahmin ile envanter arasındaki bağ iki yönlü: envanter kararı tahminden
çıkıyor, tahmin de envanterin güncel durumunu girdi olarak alıyor.

## Tatilin tarihi değil, türü modeli belirliyor

Sezonluk etkilerin en zor kısmı tatiller, çünkü her yıl aynı yerde
durmuyorlar. Kaynak metin tatilleri üç kategoriye ayırıyor ve modelin her
tür için farklı ayarlama yaptığını söylüyor.

Sabit haftalı tatiller ayın belirli bir haftasına denk geliyor; örnek
Şükran Günü. Hareketli tatillerin tarihi her yıl değişiyor; örnek Paskalya.
Sabit tarihli tatillerin tarihi hep aynı, ama haftanın hangi gününe
düştüğü değişiyor; örnek Noel. Üçü takvimde farklı davranıyor. Şükran
Günü her yıl haftanın aynı gününde ama farklı bir tarihte. Noel her yıl aynı
tarihte ama farklı bir günde. Paskalya ise ikisinden de bağımsız hareket
ediyor.

Bu ayrım neden önemli: tahmin modeli geçen yılın aynı tarihine bakarak
Noel'i yakalar ama Şükran Günü'nü kaçırır; geçen yılın aynı haftasının aynı
gününe bakarak Şükran Günü'nü yakalar ama Noel'in bu yıl hafta sonuna mı
hafta içine mi düştüğünü kaçırır. Paskalya'yı ise ikisi de kaçırır. Brifingin
çıkarımı da bu: tatil tahmin edilirken yalnızca tarih değil, tatilin sabit
tarihli mi hareketli mi olduğu ve haftanın hangi gününe denk geldiği
modele girmeli. Yazılım tarafında bunun karşılığı, tatilleri bir tarih
listesi olarak değil, türü ve kuralıyla birlikte tutan bir takvim tablosu;
tahmin modeli tatili tarihle değil, bu tablodaki kimliğiyle eşleştiriyor.

## Yöntem seçimi zaman serisinden makine öğrenmesine uzanıyor

Girdiler belli olduktan sonra geriye yöntem kalıyor. Kaynak metin iki kuşak
sayıyor. Klasik yaklaşımlarda zaman serileri, örneğin Holt-Winters,
regresyon modelleri ya da bunların kombinasyonları kullanılıyor. Daha
güncel yaklaşımlarda makine öğrenmesi teknikleri, yani Random Forests,
Support Vector Machines ve sinir ağları, tahmin doğruluğunu artırmak için
tercih ediliyor.

Brifing bu geçişi koşulsuz önermiyor. Çıkarım tablosundaki ifade şu:
geleneksel zaman serisi modellerinin yetersiz kaldığı karmaşık talep
senaryolarında makine öğrenmesine geçiş değerlendirilmeli. Yani yöntem
seçimi bir modernleşme kararı değil, bir yetersizlik teşhisine verilen
cevap. Önce klasik modelin nerede yetersiz kaldığını ölçmek gerekiyor.

Bu bölümün geri kalanıyla birlikte okununca bir nokta daha çıkıyor: yöntem,
zincirin son halkası. Hangi model seçilirse seçilsin, kapalı dönemlerin
sıfırlarını talep yokluğu diye okuyan bir veriyle eğitildiyse aynı hatayı
daha karmaşık biçimde tekrarlıyor. Untruncation, iptal ve biniş filtreleri,
tatil sınıflandırması ve anlık rezervasyon durumu doğru kurulmadan model
değiştirmek, yanlış girdiyi daha pahalı bir kutuya koymak demek.

## Yarın işe yarayacak beş çıkarım

1. **Kapalı dönemin sıfırını talep olarak saklama.** Rezervasyon geçmişine
   her dönem için sınıfın açık, kapalı ya da kısmen açık olduğunu da yaz.
   Kapalı dönemlerde talebi profil yüzdeleri üzerinden geri hesapla; kısmen
   açık dönemde gerçekleşen ile hesaplananın büyüğünü al.
2. **Rezervasyon hızını ve açık/kapalı durumu tahmine canlı ver.** Tahmin
   yalnızca tarihsel veriden beslenmesin; eldeki rezervasyonlar ve
   sınıfların güncel durumu anlık olarak modele girsin. Kapalı sınıftaki
   yavaşlamayı zayıf talep diye okuma.
3. **Tatilleri türüyle modelle.** Takvimde her tatilin sabit haftalı,
   hareketli ya da sabit tarihli olduğunu ve bu yıl haftanın hangi gününe
   düştüğünü tut; modeli tarihe göre değil bu sınıflandırmaya göre ayarla.
4. **Makine öğrenmesine yetersizlik gösterildiğinde geç.** Klasik zaman
   serisi modelinin hangi senaryoda yetersiz kaldığını ölç; karmaşık talep
   desenlerinde Random Forests ya da sinir ağlarını değerlendir, ama önce
   girdinin untruncate edildiğinden emin ol.
5. **Net talebi zincir olarak hesapla, ara sonuçları sakla.** Kısıtlanmamış
   rezervasyondan iptal oranı profiliyle iptal etmeyecekleri, biniş oranı
   tahminiyle kapıya gelecekleri çıkar. Her halkanın çıktısını ayrı tut ki
   net talep yanlış çıktığında hatanın nereden geldiği bulunabilsin.

Bu bölümde ne yok: taşan talebin uçak düzeyindeki modelleri ve dağılım
seçimi (spill bölümleri, özellikle "Yüksek varyanslı talep ve iki aşamalı
Cox dağılımı"), biniş oranının fazla rezervasyon kararına nasıl girdiği ve
kurtarılan talebin sınıflar arasında koltuk tahsisine nasıl dönüştüğü. Bu
bölüm yalnızca tahmin modeline giren sayının nereden geldiğini anlatmak
için var: kapalı kapının arkasındaki talebi nasıl geri kazandığımızı ve o
talebi uçağa binecek yolcuya nasıl indirdiğimizi.
