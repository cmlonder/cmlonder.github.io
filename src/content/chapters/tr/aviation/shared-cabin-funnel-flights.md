---
title: "Paylaşımlı kabin envanteri ve funnel uçuşlar"
domain: "aviation"
summary: "Bir koltuğu iki kabinde birden saymak da, iki uçuşu tek bir uçuş numarasıyla satmak da aynı fikrin iki hali: satılan birim ile uçan birim birbirinden ayrılıyor. Bu bölüm paylaşımlı kabin envanterinin karar kurallarını, tam ve kısmi paylaşım arasındaki risk tercihini ve funnel uçuşların GDS ekranında kazandırdığını operasyonda nasıl geri istediğini anlatıyor."
audience: "Envanter, gelir yönetimi, DCS ya da yeniden konaklatma (re-accommodation) sistemleriyle çalışan, bir koltuğun neden birden fazla sayaçtan düştüğünü anlamak isteyen yazılımcı ve ürün insanı. Overbooking bölümlerinin okunmuş olması işe yarar; FCFS, from-with matrisi, change of gauge, operasyonel bacak ve VCR metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, use-case]
ai: generated
---

Önceki bölümler envanteri tek bir kabinin, tek bir uçuşun içinde
düşünüyordu: kaç koltuk var, kaçını fazla satarız, kime saklarız. Bu bölüm
o sınırların kendisini oynatıyor. Paylaşımlı kabin envanterinde bir koltuk
iki kabinin sayacında birden yaşıyor; funnel uçuşta iki ayrı uçuş tek bir
uçuş numarasının arkasında satılıyor. **Her iki modelde de satılan birim ile
uçan birim ayrışıyor; kazanç bu ayrışmadan, bütün risk de ikisini senkron
tutmaktan geliyor.** Paylaşım doluluk oranını (load factor) artırıyor,
funnel GDS ekranında sırayı yukarı taşıyor. İkisinin de faturası envanter
kontrolüne, gelir yönetimine ve bir şey ters gittiğinde müşteri deneyimine
kesiliyor.

## Boş üst kabin koltuğu tahmin üzerinden alt kabine satılıyor

Kaynak metin paylaşımlı kabinin amacını tek cümleyle koyuyor: First Class
gibi yüksek değerli bir kabinin Coach gibi düşük değerli bir kabinle
kapasite paylaşarak uçuşun genel doluluk oranını iyileştirmesi. Mantık
basit. Ön kabinde uçuşa boş giden bir koltuk sıfır gelir demek; aynı koltuk
arka kabin fiyatından satılırsa en azından o fiyat kadar gelir getiriyor.

Karar anı rezervasyon anı değil, tahmin anı. Sistem gelecekteki bir uçuş
için talep tahminine (forecast) bakıyor. Üst kabin talebinin düşük kalacağı
öngörülüyorsa, o kabinin koltuklarından bir kısmını rezervasyon sırasında
alt kabin yolcularına satışa açıyor. Yani paylaşım sabit bir konfigürasyon
değil, tahminin bir fonksiyonu. Tahmin değişirse açılan pay da değişmeli.

Satış iki aşamada ilerliyor. Önce alt kabinin kendine ait, paylaşılmayan
koltukları doluyor. Onlar bittikten sonra ek satışlar paylaşımlı havuzdan,
ilk gelen alır (first come, first served, FCFS) prensibiyle yapılıyor. Ve
buradan yapılan her satış hem üst hem de alt kabin envanterini eş zamanlı
olarak eksiltiyor.

Yazılım tarafında bunun karşılığı şu: paylaşımlı havuzdan yapılan satış
tek bir sayacı değil, iki sayacı değiştiren bir işlem. İkisinden biri
düşüp öteki düşmezse aynı fiziksel koltuk iki kabinde birden satılabilir
görünüyor. Bu iki azaltmanın aynı işlemin parçası olması, envanter
servisinin tasarımında pazarlık konusu değil.

## Paylaşılan koltuk geri istenebilir, bu yüzden yükseltme bir araç

Paylaşımın kendi sonrası var. Arka kabin bileti almış bir yolcu ön kabinden
paylaşılmış bir koltuğa oturabiliyor ya da havayolu yer açmak için başka
bir yolcuyu yukarı taşıyabiliyor. Hangi yolcunun üst kabine yükseltileceği
(upgrade) kararı havayolunun takdirinde: kendi belirlediği kriterlerle,
alt kabin talebine yer açmak için belirli "değerli" müşterilerini üst
kabine taşıyor. Brifing bu kriterleri tanımlamıyor; tanımlanması gereken
şeyin bir iş kuralı olduğunu söylüyor.

Yükseltme burada bir ödül olmaktan çok bir envanter hamlesi. Arka kabinde
yer açmak için ön kabindeki boş koltuk kullanılıyor, ama yükseltilecek
yolcuyu seçme ölçütü sadakat ve müşteri değeri. Aynı karar iki ekibin
diline aynı anda dokunuyor: envanter "yer açtım" diyor, sadakat programı
"kimi ödüllendirdim" diyor.

Öbür yönde bir risk duruyor. Paylaşılan koltuklar alt kabine satıldıktan
sonra üst kabinde beklenmedik bir talep artışı gelirse ne olacak? Brifingin
cevabı net: kabinde fiziksel olarak boş koltuk varsa üst kabin taleplerine
öncelik verilmeli ve bu talepler karşılanmalı. Yani paylaşım kalıcı bir
devir değil, koşullu bir ödünç. Tahmin yanıldığında yüksek değerli kabin
kendi koltuğunu geri alma hakkını koruyor, yeter ki koltuk hâlâ fiziksel
olarak boş olsun.

Buradan çıkan mühendislik kuralı: envanter sistemi paylaşılan bir koltuğun
hangi kabin adına satıldığını ve hangi kabine ait olduğunu ayrı ayrı
bilmek zorunda. Yalnızca "kalan koltuk sayısı" tutan bir model, üst kabine
öncelik verme kuralını uygulayamaz; hangi koltuğun geri istenebilir
olduğunu göremez.

## Tam paylaşım doluluğu, kısmi paylaşım güvenliği seçiyor

Paylaşımın ne kadar geniş olacağı iki modelle tanımlanıyor ve seçim bir
risk iştahı seçimi.

Tam paylaşımda (complete sharing) geçişkenlik bir "from-with" (kimden,
kiminle) matrisiyle kuruluyor. First Class hem Business hem Economy ile
kapasite paylaşabiliyor; Business ise Economy ile paylaşabiliyor. Her üst
kabin kendinden aşağıdaki bütün kabinlere açık.

Kısmi paylaşım (partial sharing) daha muhafazakâr. Paylaşım yalnızca bir
üst seviyeyle sınırlı: F sadece J ile, J sadece Y ile. First Class'taki
boş bir koltuk doğrudan Economy'ye inemiyor. Kaynak metne göre bu model
daha az aşırı satış (oversale) riski yaratıyor, ama doluluk oranının daha
düşük kalmasına neden olabiliyor.

Aradaki fark, bir koltuğun kaç farklı talep akışına açık olduğu. Tam
paylaşımda First Class koltuğu iki ayrı kabinin talebini karşılayabiliyor,
bu da boş gitme ihtimalini azaltıyor. Ama aynı koltuk daha fazla yerde
"müsait" göründüğü için, tahmin yanıldığında fiziksel kapasiteden fazla
söz verilmiş olma ihtimali de artıyor. Kısmi paylaşım bu olasılığı
kesiyor, karşılığında bazı koltukları boş uçurmayı kabul ediyor.

Brifingin öngörü tablosu seçimi hedefe bağlıyor: agresif büyüme hedefi
olan operasyon için tam paylaşım, riskten kaçınan ve aşırı satışı en aza
indirmek isteyen operasyon için kısmi paylaşım. Overbooking bölümlerinde
anlatılan denge burada kabinler arasına taşınmış halde: yine boş koltuğun
maliyeti ile fazla satılmış koltuğun maliyeti tartılıyor.

Yazılım tarafında from-with matrisi kodun içine gömülecek bir if zinciri
değil, veri. Tam ve kısmi paylaşım aynı yapının iki farklı doldurulmuş hali;
matris konfigürasyon olarak durursa model değiştirmek bir dağıtım değil,
bir ayar değişikliği oluyor.

## Funnel uçuş iki bacağı tek numarayla satıyor

Bölümün ikinci yarısı envanteri kabin ekseninde değil, uçuş ekseninde
bölüyor. Funnel (huni) uçuş, iki operasyonel uçuşun ortak bir aktarma
havalimanında birleşip tek bir uçuş numarasıyla sunulması. Yolcu
aktarma noktasında fiziksel olarak uçak değiştiriyor; buna change of gauge
(ekipman değişimi) deniyor. Ama uçuş numarası her iki bacak için aynı
tutuluyor ve sistemde uçuş non-stop kategorisinde sınıflandırılıyor.

Ticari mantık GDS ekranında. Funnel uçuş acente ekranında direkt uçuş
olarak göründüğü için ekran sıralamasında üst sıralarda yer alıyor,
görünürlüğü artıyor ve müşteriye aktarmasız bir uçuş algısı sunarak satış
şansını yükseltiyor. Brifingin öngörü tablosu bunu iç hat ile dış hat
bağlantıları için önerilen bir hamle olarak koyuyor: aktarmalı uçuşları
direkt uçuş kategorisinde listeletip satış dönüşümünü artırmak.

Aynı brifing uygulamanın adını da koymaktan çekinmiyor. Kaynak metin
funnel uçuşları, aktarma havalimanında uçak değişikliği olmasına rağmen
GDS ekranında üst sıralarda yer almak için direkt uçuş olarak gösterilen
aldatıcı bir uygulama diye tanımlıyor. İki cümle yan yana duruyor ve ikisi
de doğru: satışı artıran şey, yolcunun gerçekte ne satın aldığını ekranda
görememesi. Bu bölümü okuyan yazılımcı funnel tanımını kuran kişi
olabilir; ekranda neyin gösterildiği ile uçakta neyin olduğu arasındaki
farkı bilerek kurmalı.

## Sanal numaradan satılan koltuk üç envanterden düşüyor

Funnel uçuş numarası sanal. Brifingin örneğinde uçuş 300 üzerinden bir
koltuk satıldığında, satılan koltuk sayısı hem funnel uçuşun kendisinden
hem de onu oluşturan iki ayrı operasyonel bacağın (operating legs)
envanterinden eş zamanlı olarak düşülüyor. Tek bir satış, üç ayrı sayacı
değiştiriyor.

Hangi sayacın asıl olduğu da belli. Gelir yönetimi sistemleri funnel
uçuşun envanter kontrollerini funnel uçuşun kendisine göre değil,
operasyonel bacakları gerçekleştiren uçakların fiziksel kapasitelerine
göre türetiyor. Funnel numarası bir vitrin; kapasite bacaklarda. İki
bacaktaki uçak farklı büyüklükteyse, funnel uçuşun satılabilir kapasitesi
bacakların fiziksel gerçeğinden türetilmek zorunda.

Havayolu bu uçuşları dahili bir marketing codeshare olarak işliyor:
funnel uçuş pazarlayan taraf, operasyonel bacaklar işleten taraf gibi
davranıyor, ikisi de aynı havayolu. Funnel uçuş ile operasyonel bacaklar
arasındaki eşleşme (mapping) sürekli güncel tutuluyor ve envanter
güncellemeleri bu eşleşme üzerinden yapılıyor. Brifing bunu planlama
sistemlerinin hesaplama yükünü yönetme biçimi olarak anlatıyor.

Yazılım tarafında bunun karşılığı bir türetilmiş görünüm problemi. Funnel
envanteri kendi başına doğru olamaz; iki bacağın envanterinden türetilmiş
bir değer. Eşleşme tablosu eskirse ya da bacaklardan birine yapılan satış
funnel sayacına yansımazsa, sistem fiziksel kapasitenin üzerinde satış
yapabilir. Brifingin öngörü tablosu tam bu riski adlandırıyor: funnel uçuş
biletlemelerinde operasyonel bacakların envanterinin gerçek zamanlı
güncellendiğinden emin olunmazsa fiziksel kapasitenin üzerinde satış riski
doğuyor.

## Satışta kazanılan sadelik aksaklıkta geri ödeniyor

Funnel uçuşun zayıf noktası operasyon bozulduğunda ortaya çıkıyor. Kalkış
kontrol sistemleri (DCS) operasyonel bacaklar için ayrı kupon kayıtları
(VCR, virtual coupon record) oluşturmuyor; yalnızca funnel uçuş için tek
bir kupon var. Kaynak metin bunun sonucunu açıkça söylüyor: bu durum
aksaklık anında yolcu işlemlerini karmaşıklaştırıyor.

Somut olarak: bacaklardan birinde iptal ya da gecikme olduğunda yolcuyu
yeniden konaklatmak (re-accommodation) gerekiyor. Ama bilet tek bir
kupondan ibaret ve o kupon aksayan bacağa değil, bütün funnel uçuşa ait.
Standart yol, yani bilet değişimi yapılamıyor. Bunun için özel bir iş
süreci istisnası (business process exception) gerekiyor.

Burada satış ile operasyon arasındaki asimetri görünür oluyor. Satışta iki
bacağı tek bir birimmiş gibi göstermek avantaj. Operasyonda ise olay
bacak düzeyinde gerçekleşiyor: iptal edilen, geciken, uçak değiştiren şey
bir bacak. Bilet modeli bacağı görmediği için, bacak düzeyindeki bir olayı
bilet düzeyinde çözmeye çalışan standart süreç tıkanıyor.

Mühendislik açısından ders, veri modelinin en ince ayrıntı düzeyinde
bilgiyi kaybetmemesi gerektiği. Satış katmanı istediği kadar
birleştirebilir, ama bu birleştirmenin altında operasyonel bacağı tanıyan
bir kayıt yoksa, istisna süreci sistemin dışında, insan eliyle yürüyor.
Brifingin önerisi de bu yüzden önceden tanımlanmış iş süreci istisnaları:
aksaklık geldiğinde doğaçlama yapılmasın, standart VCR yapısının yetmediği
yer baştan bilinsin.

## Yarın işe yarayacak beş çıkarım

1. **Düşük talepli dönemde üst kabini alt kabin fiyatından aç.** Üst kabin
   talebinin düşük kalacağı öngörülen uçuşlarda First ve Business
   koltuklarını Coach fiyat seviyesinden satışa açarak doluluk oranını
   artır. Paylaşımı tahmine bağla, sabit bir ayar olarak bırakma; üst kabin
   talebi fiziksel boş koltuk varken gelirse önceliği ona ver.
2. **Paylaşım modelini hedefe göre seç.** Agresif büyüme hedefi için tam
   paylaşım, aşırı satışı en aza indirmek isteyen operasyon için kısmi
   paylaşım. From-with matrisini konfigürasyon olarak tut ki model
   değişikliği kod değişikliği gerektirmesin.
3. **Funnel tanımını bilinçli kullan.** İç hat ile dış hat bağlantılarında
   funnel uçuş tanımı aktarmalı uçuşu direkt uçuş kategorisinde listeletip
   satış dönüşümünü artırıyor. Ekranda gösterilen ile uçakta olan
   arasındaki farkın yolcuya nasıl yansıdığını da aynı kararın parçası
   say.
4. **Aksaklık sürecini aksaklıktan önce yaz.** Funnel uçuşlarda DCS tek
   bir VCR tuttuğu için bilet değişimi yapılamıyor. Bacaklardan birinde
   iptal ya da gecikme için iş süreci istisnalarını önceden tanımla.
5. **Bacak envanterini gerçek zamanlı senkronize et.** Funnel üzerinden
   yapılan her satışın operasyonel bacakların envanterinden aynı anda
   düştüğünden ve funnel ile bacaklar arasındaki eşleşmenin güncel
   olduğundan emin ol. Aksi halde fiziksel kapasitenin üzerinde satış
   yapılıyor.

Bu bölümde ne yok: fazla satışın kendisinin nasıl boyutlandırıldığı ve
biniş oranının nasıl tahmin edildiği ("Biniş oranı tahmini ve overbooking
stratejileri"), üst kabin talebini öngören tahmin modelleri (talep tahmini
bölümleri), dışarıdan bir ortakla yapılan codeshare anlaşmalarının gelir
paylaşımı ("Havacılıkta gelir paylaşımı: çok taraflı ve ikili prorate
anlaşmaları (MPA ve SPA)"). Bu bölüm envanterin sınırlarının, kabin ve
uçuş düzeyinde, nasıl esnetildiğini ve o esnemenin nerede kırıldığını
anlatmak için var.
