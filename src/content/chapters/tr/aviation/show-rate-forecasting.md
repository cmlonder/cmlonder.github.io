---
title: "Biniş oranı tahmini ve overbooking stratejileri"
domain: "aviation"
summary: "Overbooking modeli, kaç yolcunun gerçekten uçağa bineceğini tahmin eden tek bir sayının üzerinde duruyor: biniş oranı. Bu bölüm o sayının hangi düzeltmelerle hesaplandığını, verinin ne zaman kesildiğini, PNR özniteliklerinin tahmin hatasını ne kadar düşürdüğünü ve Binom modeliyle yetkilendirme limitinin nasıl arandığını anlatıyor."
audience: "Envanter, gelir yönetimi ya da kalkış kontrol sistemleriyle çalışan, overbooking limitinin arkasındaki hesabı görmek isteyen yazılımcı ve ürün insanı. Spill bölümlerinin okunmuş olması işe yarar; go-show, mis-connect, MAD, yetkilendirme limiti ve fazla satış oranı metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Spill bölümleri talebin kapasiteye sığmayan kısmını, yani hiç
satılamayan koltuğun karşılığı olan kaybı anlatıyordu. Bu bölüm tersine
bakıyor: satılmış ama boş kalkan koltuğa. Rezervasyon yapan her yolcu
kapıya gelmiyor; biri iptal ediyor, biri gelmiyor (no-show), biri
bağlantısını kaçırıyor. Havayolu bu boşluğu kapasitenin üzerinde satarak,
yani overbooking yaparak kapatıyor. Kaynak metin bu işin nereden
başladığını tek cümleyle söylüyor: biniş oranı tahmini, fazla rezervasyon
modelinin birincil girdisi. **Overbooking bir cesaret meselesi değil, bir
tahmin meselesi: limitin kalitesi, kaç kişinin gerçekten bineceğini
söyleyen sayının kalitesinden daha iyi olamaz.**

O sayıyı üreten zincir dört halkadan oluşuyor. Önce ham rezervasyon
verisinden gerçek biniş davranışı çıkarılıyor. Sonra verinin hangi anda
kesileceğine karar veriliyor. Sonra tahminin ne kadar yanıldığı ölçülüyor
ve bu ölçüm düzenli güncelleniyor. En sonda da bu tahmin, uçağa
alınamayan yolcu sayısına konmuş bir tavanla birlikte bir olasılık
modeline giriyor ve oradan satılabilecek koltuk sayısı çıkıyor.

## Ham rezervasyon sayısı biniş oranı değil

İlk tuzak, rezervasyon sayısını kalkıştaki biniş sayısıyla bölüp biniş
oranı elde ettiğini sanmak. Kaynak metin bu hesaba girmesi gereken dört
düzeltmeyi sayıyor, ikisi toplamı büyütüyor, ikisi küçültüyor.

Go-show yolcular, yani rezervasyonu olmadan havalimanına gelip uçağa
binenler, toplama ekleniyor. Rezervasyon kaydında görünmüyorlar ama
kabinde bir koltuk kaplıyorlar; onları saymayan bir model uçağın
gerçekte olduğundan daha boş kalktığını düşünür ve limiti fazla açar.
Mis-connect yolcular, yani bir önceki uçuşu gecikip bağlantısını
kaçıranlar, toplamdan çıkarılıyor. Bu yolcu bu uçuşu tercih etmekten
vazgeçmedi; başka bir uçağın gecikmesinin kurbanı oldu. Onu no-show
saymak, bu uçuşun yolcu davranışına ait olmayan bir gürültüyü tahmine
katmak demek.

Üst kabine yükseltilen (upgrade) yolcu, bindiği kabinin biniş sayısına
dahil ediliyor. Ekonomi rezervasyonuyla business'ta oturan kişi business
kabininde fiziksel bir koltuğu kullanıyor; kabin bazlı overbooking o
koltuğu boş sanarsa aynı koltuğu iki kez satar. Gelir getirmeyen
(non-revenue) yolcular ise hesaba hiç girmiyor. Model satılmış
koltuğun ne sıklıkla boşa çıktığını soruyor; satılmamış koltukta
oturan yolcu bu sorunun parçası değil.

Yazılım tarafında bunun karşılığı şu: biniş oranının girdisi
rezervasyon sistemindeki bir sayaç değil, kalkış kontrolünden gelen
gerçekleşmiş veriyle rezervasyon verisinin yolcu düzeyinde eşleştirilmesi.
Go-show'u görmek için kalkış kontrolüne, mis-connect'i ayırmak için
bağlantılı uçuşun gerçekleşme verisine, upgrade'i doğru kabine yazmak için
oturulan kabinle satılan kabinin ayrı alanlarda tutulmasına ihtiyaç var.
Bu alanlardan biri eksikse model hata vermez, sessizce yanlış bir oran
öğrenir.

## Verinin kesildiği an, tahminin ne gördüğünü belirliyor

Rezervasyon durumu kalkışa kadar sürekli değişiyor: iptaller geliyor,
yeni satışlar ekleniyor, isim değişiklikleri yapılıyor. Tahmin modeli
bu hareketli resmin bir anlık görüntüsünü (snapshot) alıp onun üzerine
kuruluyor. Hangi anın alınacağı, modelin hangi yolcu kompozisyonunu
göreceğini belirliyor.

Kaynak metnin tercihi açık: en iyi kesit, kalkıştan birkaç saat önce,
tercihen dört saat önce alınan görüntü. Bu mümkün değilse kalkıştan
önceki gecenin verisi baz alınıyor. Mantığı basit: kalkışa ne kadar
yakın alınırsa, iptal etme ihtimali olan yolcuların çoğu zaten iptal
etmiş, son dakika satışları da kayda girmiş olur. Geriye kalan
belirsizlik ağırlıklı olarak gelip gelmeme sorusudur, yani modelin
gerçekten tahmin etmesi gereken şey.

Bunun mühendislik tarafında iki sonucu var. Birincisi, snapshot bir
toplu iş değil bir zamanlama sözleşmesi: her uçuş için kalkış saatine
göre kaydırılmış bir tetik gerekiyor, gece yarısı herkesi birden çeken
bir iş değil. Gece verisine düşüş bir yedek plan olarak tanımlandığına
göre, sistemin hangi kesitle çalıştığını kaydetmesi de gerekiyor;
yoksa dört saatlik kesitle eğitilmiş bir oran gece kesitine uygulanır
ve kimse fark etmez. İkincisi, geçmiş biniş oranlarını hesaplarken de
aynı kesit kullanılmalı. Eğitimde bir anı, tahminde başka bir anı
kullanmak, iki farklı sorunun cevabını birbirine bölmek demek.

## Tahmin hatası da bir tahmin, onu da güncellemek gerekiyor

Overbooking limitini belirleyen şey yalnızca beklenen biniş oranı
değil, o oranın ne kadar oynadığı. Ortalaması aynı olan iki uçuştan
biri günden güne geniş bir aralıkta dalgalanıyor, öteki dar bir bantta
kalıyorsa, ikisi aynı limiti taşıyamaz. Bu yüzden model iki şeyi birlikte
izliyor: oranın kendisini ve etrafındaki dağılımı.

Kaynak metnin önerdiği yöntem sade. Biniş oranının standart sapması
basit bir üstel düzeltme (exponential smoothing) modeliyle güncelleniyor.
Tahmin hatasının sıfır ortalamalı normal dağıldığı varsayılıyor ve
varyans, ortalama mutlak sapma (MAD) üzerinden hesaplanıyor. MAD, her
uçuşta gerçekleşen oranla tahmin edilen oran arasındaki farkın mutlak
değerlerinin ortalaması; normal dağılım varsayımı altında standart
sapmayla arasında sabit bir oran olduğu için ondan varyansa geçmek
mümkün.

Bu seçim bir yazılımcı için anlamlı. Üstel düzeltme her yeni uçuşta
yalnızca bir önceki değeri ve yeni hatayı istiyor; geçmiş uçuşların
tamamını saklayıp yeniden taramak gerekmiyor. Binlerce uçuş-kabin
kombinasyonu için her gün güncellenecek bir parametrede bu, durum olarak
yalnızca iki sayı tutmak demek: güncel tahmin ve güncel MAD. Varsayımın
bedeli de açık: sıfır ortalamalı hata varsayımı, tahminin sistematik
olarak bir yöne kaymadığını kabul ediyor. Hatanın ortalaması sıfırdan
uzaklaşıyorsa sorun varyansta değil, oranın kendisinde; MAD bunu
yakalamaz, yalnızca dağılımı genişletir.

## PNR, zaman serisinin göremediği yolcuyu gösteriyor

Buraya kadar anlatılan yöntem bir zaman serisi yaklaşımı: bu uçuşun
geçmişte nasıl dolduğuna bakıp bugünü tahmin ediyor. Ama geçmiş biniş
oranı, bugün uçakta kimin olduğunu bilmiyor. Aynı uçuşun bir gün
ağırlıkla bağlantılı ve esnek biletli iş yolcusu, başka bir gün
aileyle seyahat eden tatilci taşıması, biniş davranışını değiştirir;
zaman serisi bu iki günü aynı ortalamayla karşılar.

PNR (yolcu isim kaydı) bu farkı görmenin yolu. Kaynak metin PNR'ı
yolcu davranışına dair zengin nitelikler barındıran bir kayıt olarak
tarif ediyor ve bu nitelikleri kullanan nedensel (causal) modellerin
geliştirilebileceğini söylüyor. Önerilen yön net: yalnızca geçmiş zaman
serisine dayanmak yerine PNR üzerindeki öznitelikleri modele katmak,
biniş oranındaki belirsizliği azaltmanın daha etkili yolu.

Kazancın büyüklüğü de verilmiş. Kaynak metne göre bu tür modeller
no-show tahmin hatasını %12,4 seviyesinden %9,5 seviyesine
çekebiliyor ve tipik olarak no-show tahmin doğruluğunda %3 ile %7
arasında iyileşme sağlıyor. Örnekteki düşüş yaklaşık üç puan, yani
bu aralığın alt ucuna denk geliyor. Metnin karar tablosu hedefi de
buna göre koyuyor: PNR içindeki yolcu verilerini modele katarak hata
payını %10'un altına indirmek.

Üç puan küçük görünebilir. Ama overbooking limiti hatanın büyüklüğüyle
doğrudan ölçekleniyor: tahmin ne kadar belirsizse, uçağa alınamayan
yolcu tavanını aşmamak için limit o kadar temkinli tutulmak zorunda.
Hatadaki her puan, güvenle satılabilecek koltuk sayısına dönüşüyor.

Yazılım tarafında bu, overbooking modülünün girdisinin uçuş düzeyinde
tek bir sayı olmaktan çıkıp yolcu düzeyinde bir veri akışına dönüşmesi
demek. PNR özniteliklerinin snapshot anında okunabilir, tutarlı ve
tarihsel olarak saklanmış olması gerekiyor; nedensel modeli eğitmek için
geçmiş PNR'ların o anki haliyle gerçekleşen biniş sonucunun eşleşmesi
lazım. Kaynak metin hangi özniteliklerin kullanılacağını saymıyor, o
yüzden burada da saymıyoruz; ama altyapı sorusu öznitelik listesinden
bağımsız: snapshot anındaki PNR'ı geri getiremeyen bir sistem, bu
modeli hiç eğitemez.

## Limit, kabul edilebilir kötü sonuç sayısından geriye doğru hesaplanıyor

Tahmin hazır olduğunda asıl soru geliyor: kaç koltuk satılacak? Bunun
cevabı bir kısıttan türetiliyor. Fazla satış yüzünden uçağa alınamayan
yolcu (denied boarding) havayoluna tazminat ve müşteri memnuniyeti
kaybı olarak dönüyor; bu yüzden havayolu, bunun ne sıklıkla olmasına
razı olduğunu önceden belirliyor.

Kaynak metne göre bu kısıt genellikle kabin düzeyinde biniş yapan her
10.000 yolcu başına uçağa alınamayan en fazla yolcu sayısı olarak
ifade ediliyor. Endüstri pratiği olarak verilen aralık, 10.000 yolcuda
10 ile 20 arası. Karar tablosu üst sınırı koyuyor: tazminat maliyeti
ve müşteri memnuniyeti dengesi için 10.000'de en fazla 20.

Bu kısıtın biçimi önemli. Limit "bu uçuşta kimseyi dışarıda bırakma"
diye değil, "binen yolcuların içinde dışarıda kalanların oranı şu
eşiği geçmesin" diye tanımlanıyor. Yani havayolu tek tek uçuşlarda
denied boarding olacağını kabul ediyor ve bunu kabin genelinde bir
oranla sınırlıyor. Kısıt kabin düzeyinde; bu da her kabinin kendi
biniş oranı, kendi limiti ve kendi fazla satış hesabıyla ayrı
yönetilmesi demek.

Yetkilendirme limiti, yani sistemin satışa açtığı toplam koltuk sayısı,
bu kısıttan geriye doğru bulunuyor. Kaynak metnin tarif ettiği süreç
şöyle: limit sırayla artırılıyor, her adımda beklenen fazla satış oranı
hesaplanıyor ve bu oranın eşiği aştığı nokta tespit ediliyor.

## Binom modeli, iptali ve no-show'u tek bir olasılıkta topluyor

Her adımda beklenen fazla satışı hesaplamak için bir olasılık modeli
gerekiyor. Kaynak metnin önerdiği Binom dağılımı iki parametreyle
kuruluyor: n, kalkış anındaki rezervasyon sayısı; p, tahmin edilen
biniş oranı. Her rezervasyon p olasılıkla uçağa binen, 1−p olasılıkla
binmeyen bir deneme gibi ele alınıyor. İptaller ve no-show'lar bu
modelde ayrı ayrı izlenmiyor, tek bir olasılık paydası altında
birleşiyor: yolcu ister iptal etsin ister gelmesin, sonuç aynı, koltuk
boş kalıyor.

Bu bir basitleştirme ve bilerek yapılıyor. Karar tablosu Binom modelini
standartlaştırmayı, iptallerle no-show'lar arasındaki ilişkiyi
basitleştirmek ve operasyonel kararları hızlandırmak için öneriyor.
Model her yolcuyu aynı p ile ve birbirinden bağımsız ele alıyor;
kazanç, tek bir parametreyle kapalı biçimde hesaplanabilen bir
dağılım. Önceki başlıktaki PNR tartışmasıyla birlikte okununca iş
bölümü netleşiyor: yolcular arasındaki farkı nedensel model p'nin
içine taşıyor, Binom da o p ile koltuk sayısını hesaplıyor.

Limit her artırıldığında iki değer hesaplanıyor: beklenen biniş
(expected boarded) ve beklenen fazla satış (expected oversales).
Beklenen biniş, kapasiteyle sınırlı olarak uçağa alınması beklenen
yolcu sayısı; beklenen fazla satış, kapıya gelip kapasite dolu olduğu
için alınamayan yolcu sayısının beklenen değeri. İkincinin birinciye
oranı, 10.000 yolcu başına ölçeklendiğinde, kısıtla karşılaştırılan
sayı oluyor. İterasyon, fazla satış oranı eşiği geçtiği anda duruyor
ve bir önceki güvenli limit optimal overbooking seviyesi olarak
seçiliyor.

## Sıralı arama doğru, ikiye bölme hızlı

Limiti birer birer artırıp her adımda Binom dağılımını baştan
hesaplamak doğru sonucu verir ama pahalıdır. Bunu her uçuş, her kabin
ve her snapshot için tekrarlayan bir sistemde maliyet hızla büyüyor.
Kaynak metin bu yüzden sıralı artırma yerine ikiye bölme aramasını
(bisection search) öneriyor: hesaplama maliyetini düşürmek ve süreci
hızlandırmak için.

Bu önerinin çalışmasının nedeni problemin yapısında. Satışa açılan
koltuk arttıkça kapıya gelen beklenen yolcu da artar, kapasite sabit
kaldığı için beklenen fazla satış oranı da düşmez. Oran limitle birlikte
tek yönde hareket ettiği için, eşiği aşmayan en büyük limiti bulmak
sıralı bir dizide sınır aramaktan farksız. İkiye bölme, alt sınırı
eşiği aşmayan, üst sınırı aşan bir aralıkla başlayıp her adımda aralığı
yarıya indiriyor; sıralı taramada limit sayısı kadar hesaplama gerekirken
burada o sayının logaritması kadar hesaplama yetiyor.

Yazılım tarafında buradan çıkan ders şu: arama algoritması, modelin
tek yönlü davrandığı varsayımına yaslanıyor. Binom modelinde bu
varsayım doğal olarak sağlanıyor. Ama biri ileride modeli değiştirip
limitle birlikte oranın tek yönde hareket etmediği bir yapı kurarsa,
ikiye bölme hata vermeden yanlış bir limit döndürür. Bu varsayımı
testle korumak, algoritmayı değiştirmekten ucuz.

## Yarın işe yarayacak beş çıkarım

1. **Biniş oranını ham sayaçtan değil, düzeltilmiş veriden hesapla.**
   Go-show'u ekle, mis-connect'i çıkar, upgrade'i oturulan kabine yaz,
   gelir getirmeyen yolcuyu dışarıda bırak. Bu dört alandan biri
   eksikse model hata vermez, yanlış bir oran öğrenir.
2. **Snapshot'ı kalkıştan dört saat önce al.** Bu mümkün değilse önceki
   gecenin verisine düş, ama hangi kesitle çalıştığını kaydet ve
   eğitimde de aynı kesiti kullan.
3. **Hatayı da tahmin et.** Biniş oranının standart sapmasını üstel
   düzeltmeyle ve MAD üzerinden güncelle; hatanın ortalaması sıfırdan
   kayıyorsa sorunun varyansta değil oranın kendisinde olduğunu bil.
4. **PNR'ı modele sok.** Yalnızca zaman serisine dayanmak yerine PNR
   özniteliklerini kullanan nedensel modelle no-show hatasını %10'un
   altına indirmeyi hedefle. Bunun ön şartı, snapshot anındaki PNR'ı
   sonradan geri getirebilen bir veri saklama düzeni.
5. **Limiti kısıttan geriye doğru ara.** Kabin düzeyinde 10.000
   biniş başına en fazla 20 denied boarding tavanı koy, Binom modeliyle
   beklenen biniş ve beklenen fazla satışı hesapla, eşiği aşmayan en
   büyük limiti ikiye bölme aramasıyla bul.

Bu bölümde ne yok: overbooking limitinin gelir tarafındaki karşılığı,
yani dışarıda kalan yolcunun tazminat maliyetiyle boş kalkan koltuğun
kaybının parasal olarak tartılması, ve satılamayan talebin kendisi
(spill bölümleri). Bu bölüm, o hesapların hepsinin dayandığı tek
sayının, kaç kişinin gerçekten bineceğinin nasıl tahmin edildiğini
anlatmak için var.
