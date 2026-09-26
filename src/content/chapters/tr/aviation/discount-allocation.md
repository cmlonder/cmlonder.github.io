---
title: "İndirim tahsis kontrolleri, Littlewood kuralı ve Gamma talep modeli"
domain: "aviation"
summary: "İndirimli koltuğu satıp satmama kararı, bugünkü ücretle gelecekteki tam ücretli yolcunun beklenen gelirini kıyaslayan tek bir kurala dayanır: 1972'de Littlewood'un koyduğu kural. Bu bölüm o kuralın iş mantığını, 21 günlük erken rezervasyon bariyerinin hangi segmenti ayırdığını, overbooking ile ilişkisini ve koruma seviyesini hesaplarken talebin neden normal değil Gamma dağılımıyla modellenmesi gerektiğini anlatıyor."
audience: "Envanter, fiyatlandırma ya da gelir yönetimi sistemleriyle çalışan, bir rezervasyon sınıfının neden kapandığını anlamak isteyen yazılımcı ve analist. Overbooking ve spill bölümlerinin okunmuş olması işe yarar; Littlewood kuralı, koruma seviyesi, erken rezervasyon bariyeri, istemsiz reddedilen yolcu ve Gamma dağılımının şekil ve ölçek parametreleri metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Gelir yönetiminin ilk yıllarında havayolunun envanter üzerindeki tek
aktif kontrolü overbooking'di: kaç yolcunun gelmeyeceğini tahmin edip
kapasitenin üstünde rezervasyon almak. Kaynak metne göre bu durum
1970'lerin başına kadar sürdü. Sonra iki şey aynı yıl oldu. 1972'de
British Overseas Aircraft Corporation (BOAC) 21 gün önceden rezervasyon
indirimini tanıttı, aynı yıl Littlewood bu indirimli koltukların kaç
tanesinin satılacağını belirleyen kuralı ortaya koydu. İndirim tahsis
kontrolü (discount allocation) bu ikisinin birleşiminden doğdu. **İndirimli
bir koltuğu satmak bir fiyat kararı değil, bir tahmin kararıdır: koltuğun
bugünkü ücretiyle, aynı koltuğun ileride tam ücretle satılma ihtimalinin
değeri kıyaslanır ve kararın kalitesi o ihtimali hesaplayan talep
modelinin kalitesinden yukarı çıkamaz.**

Bu bölüm o kıyaslamanın üç parçasını sırayla ele alıyor: kuralın
kendisi, kuralın çalışabilmesi için segmentleri ayıran bariyer ve kuralın
girdisi olan talep dağılımı. Arada overbooking'e de kısaca dönüyor, çünkü
indirim tahsisi ile fazla rezervasyon aynı koltuk sayısı üzerinde çalışan
iki ayrı kontrol.

## Littlewood kuralı bir fiyatı değil, bir beklentiyi eşik yapıyor

Kaynak metnin aktardığı ilke tek cümle: indirimli yolcu, indirimli ücret
gelecekte gelecek ve daha yüksek ödeyecek tam ücretli yolcuların beklenen
gelirinden fazlaysa kabul edilmeli. Tersi durumda, yani ileride gelmesi
muhtemel yüksek gelir mevcut indirimli fiyatı aşıyorsa, koltuk boş
tutuluyor. Kaynak metin bunu gelir yönetiminin altın kuralı ve modern
algoritmaların temeli olarak niteliyor.

Kuraldaki kritik kelime "beklenen". Tam ücret sabit bir sayı; o koltuğa
gerçekten tam ücretli bir yolcunun gelip gelmeyeceği ise belirsiz. Bir
koltuğu tam ücretli yolcuya saklamanın değeri, tam ücret çarpı o koltuğa
tam ücretli talebin ulaşma olasılığı. Yüksek ücretli talep güçlüyse bu
olasılık bire yakın ve koltuk saklanıyor. Talep zayıfsa olasılık düşük,
beklenen gelir indirimli ücretin altına iniyor ve koltuk indirimle
satılıyor. Aynı indirimli ücret, aynı uçuşta, farklı talep tahminleriyle
bir gün kabul bir gün ret sonucu verebilir. Kuralın mekanik bir tavan
olmadığı, her an güncellenen bir karşılaştırma olduğu buradan geliyor.

Bu karşılaştırma koltuk koltuk yapıldığında ortaya bir sayı çıkıyor:
yüksek ücretli sınıf için kaç koltuğun ayrılması gerektiği. Buna koruma
seviyesi (protection level) deniyor. Koruma seviyesinin altına inilince,
yani kalan koltuk sayısı korunan sayıya eşitlenince, düşük ücretli sınıf
satışa kapanıyor. Yolcunun rezervasyon ekranında gördüğü "bu sınıfta yer
yok" mesajının arkasında çoğu zaman bu eşik var; uçakta koltuk boş olsa
bile.

Yazılım tarafında bunun karşılığı şu: envanter sisteminin sorduğu soru
"bu sınıfta kaç koltuk kaldı" değil, "bu sınıfı açık tutmanın beklenen
maliyeti ne". İlki bir sayaç, ikincisi bir tahminin çıktısı. Sınıf
kapanış kararını statik bir kota tablosuna gömen sistem, talep tahmini
değiştiğinde kararın değişmesi gerektiğini bilemiyor. Kaynak metnin
çıkarımlarından biri de bu yönde: kuralı yalnızca sabit fiyatlar için
değil, beklenen marjinal gelirin sürekli güncellendiği dinamik senaryolar
için entegre etmek.

## İndirim ancak onu herkese vermeyen bir bariyerle çalışıyor

Littlewood kuralı iki farklı yolcu grubunun varlığını varsayıyor: indirimi
kabul eden ve tam ücreti ödemeye razı olan. Kural bu iki grubun ayrı ayrı
geldiğini, tam ücretli yolcunun indirimli koltuğa kaymadığını kabul
ediyor. Bu kabulü gerçeğe yaklaştıran şey kuralın kendisi değil, ücret
ürününün tasarımı.

BOAC'ın 21 gün önceden rezervasyon şartı tam bu işi görüyordu. Kaynak
metin bariyerin mantığını şöyle kuruyor: sistem, fiyat duyarlılığı yüksek
yolcuyu (tatil amaçlı) fiyat duyarlılığı düşük ama zaman duyarlılığı
yüksek yolcudan (iş amaçlı) ayırmak için erken rezervasyon (advance
booking) kısıtlamasını bir bariyer olarak kullanıyor. Tatilci planını
haftalar önce yapabiliyor ve indirim için bunu yapmaya razı. İş yolcusunun
seyahat ihtiyacı çoğu zaman son haftada doğuyor; 21 gün kuralı onun için
indirimi fiilen erişilmez kılıyor.

Burada zaman iki rol birden oynuyor. Birincisi segmentasyon: bariyer
kimin hangi ücrete erişebileceğini belirliyor. İkincisi sıralama:
indirimli talep erken, tam ücretli talep geç geliyor. Littlewood kuralının
"gelecekte gelecek yüksek ücretli yolcu" dediği şey tam olarak bu geç
talep. İndirimli koltuğu satıp satmama kararı, tam ücretli yolcu henüz
ortada yokken, onun geleceğine dair bir tahminle veriliyor. Bariyer
olmasaydı iki talep karışır, kuralın karşılaştırdığı iki büyüklük
birbirinden ayrılamazdı.

Yazılım tarafında bunun karşılığı, ücret kuralı ile envanter kontrolünün
ayrı katmanlar ama aynı mantığın iki parçası olması. Erken rezervasyon
şartı ücret kuralında yaşıyor; koruma seviyesi envanterde. Biri gevşetilip
öteki aynı bırakılırsa, örneğin bariyer kaldırılıp koruma seviyesi eski
segment varsayımıyla hesaplanmaya devam ederse, model tam ücretli yolcunun
indirime kaymasını hiç görmüyor. Talep tahmini de kayan yolcuyu indirimli
talep olarak kaydediyor ve hata kendini besliyor.

## Overbooking aynı koltuk sayısını öbür uçtan esnetiyor

İndirim tahsisi, var olan koltukların hangi ücret sınıfına gideceğini
belirliyor. Overbooking ise satılabilecek koltuk sayısının kendisini
esnetiyor. Kaynak metin iki kontrolü aynı gelir hedefinin parçası olarak
ele alıyor: havayolu geliri maksimize etmek ve boş koltuk riskini
yönetmek için kapasitenin üzerinde rezervasyon alıyor.

Karar mekanizması iki maliyeti kıyaslıyor: uçağın boş koltukla kalkmasının
maliyeti ve gelen yolcunun uçağa alınamamasının maliyeti. Maksimum
rezervasyon limiti bu ikisinin dengesinden çıkıyor. Kaynak metin hedefi
bir örnekle veriyor: overbooking ile doluluk oranını (load factor) örneğin
%89'dan %95'e çıkarmak. Aradaki fark, rezervasyonu olup gelmeyen
yolcuların bıraktığı ve aksi halde boş kalacak koltuklar.

Bu esnetmenin bir performans ölçüsü var ve kaynak metin onu açıkça
söylüyor: her 10.000 yolcu başına istemsiz reddedilen yolcu (involuntary
denied boarding) sayısı. İstemsiz reddedilen yolcu, rezervasyonu ve
biletiyle gelip kendi isteği dışında uçağa alınmayan yolcu. Kaynak metnin
aktardığı ABD Ulaştırma Bakanlığı (DOT) verisi 1990'ın üçüncü çeyreğine
ait ve iki havayolu arasındaki farkı gösteriyor: her 10.000 yolcuda
Southwest için 4,82, American için 0,85. Aynı dönemde beş
kattan fazla fark.

Bu fark tek başına hangi havayolunun daha iyi olduğunu söylemiyor; iki
havayolunun overbooking'e farklı risk iştahıyla yaklaştığını söylüyor.
Kaynak metnin önerisi de bu yüzden bir karşılaştırma: karar vericilerin
bu oranı izleyerek overbooking limitlerinin müşteri memnuniyeti ve yasal
tazminat limitleri içinde kalıp kalmadığını denetlemesi, oranı rakip
havayollarının verisiyle kıyaslaması. Oranın kendisi bir hedef değil,
limitin fazla agresif mi fazla temkinli mi kaldığını gösteren bir gösterge.

Yazılım tarafında bunun karşılığı, overbooking limitini hesaplayan
servisin çıktısının kapıda ne olduğunu gören operasyon verisiyle aynı
yerde toplanması. Limit bir modelden çıkıyor, reddedilen yolcu sayısı
kalkış kontrolünden. İkisi aynı tabloda buluşmazsa model kendi hatasını
hiç görmüyor.

## Talebi normal dağılımla modellemek imkânsız bir talep üretebiliyor

Littlewood kuralının ve koruma seviyesinin girdisi bir talep dağılımı:
bu uçuşta bu sınıfa kaç tam ücretli yolcunun geleceğinin olasılıkları.
Kuralın doğru karar vermesi, bu dağılımın gerçeğe ne kadar yakın olduğuna
bağlı. Kaynak metin burada net bir tercih yapıyor ve gerekçesini iki
noktaya dayandırıyor.

Birincisi işaret. Normal dağılım eksi sonsuzdan artı sonsuza uzanıyor;
ortalaması düşük, varyansı yüksek bir sınıfta dağılımın hatırı sayılır
bir kısmı sıfırın altına düşüyor. Kaynak metin bunu açıkça söylüyor:
normal dağılım negatif talebe izin verebiliyor, Gamma dağılımı ise her
zaman pozitif. Negatif talep fiziksel olarak mümkün değil; hiçbir uçuşa
eksi üç yolcu gelmiyor. Ama modelin olasılık kütlesinin bir kısmını
imkânsız bir bölgeye harcaması, gerçek bölgedeki olasılıkların yanlış
hesaplanması demek.

İkincisi şekil. Normal dağılım simetrik; ortalamanın iki yanındaki
sapmalar eşit sıklıkta. Gerçek talep ise kaynak metne göre asimetrik:
çoğu uçuşta talep belirli bir düzeyde yığılıyor, bazı uçuşlarda ise
beklenmedik sıçramalar oluyor. Kaynak metin Gamma dağılımının bu asimetrik
doğaya daha uygun bir matematiksel model sunduğunu söylüyor. Simetrik bir
model, talep artışlarını ve düşük talep dönemlerini aynı genişlikte
çiziyor; oysa ikisinin sıklığı ve büyüklüğü farklı.

Bu tercih koruma seviyesine doğrudan yansıyor. Littlewood kuralının
kıyasladığı olasılık, tam ücretli talebin belirli bir koltuk sayısını
aşma olasılığı. Bu, dağılımın kuyruğunda hesaplanan bir sayı. Kuyruğu
yanlış çizen model, koruma seviyesini de yanlış yere koyuyor: ya yüksek
ücretli yolcuya gereğinden fazla koltuk saklıyor ve o koltuklar boş
kalıyor, ya da gereğinden az saklıyor ve tam ücretli yolcu geldiğinde
koltuk indirimle çoktan satılmış oluyor. Kaynak metnin yönetici özeti
sonucu şöyle bağlıyor: veriler Gamma dağılımının daha kesin sonuçlar
verdiğini ve koruma seviyelerini daha iyi optimize ettiğini gösteriyor.

## Koruma seviyesi iki parametreye bağlı ve o parametreler eskiyor

Gamma dağılımı iki parametreyle tanımlanıyor: şekil (α) ve ölçek (β).
Şekil parametresi dağılımın ne kadar asimetrik olduğunu, ölçek
parametresi ne kadar yayıldığını belirliyor. Kaynak metne göre algoritma
talep belirsizliğini bu iki parametre üzerinden modelliyor, yüksek ücretli
yolcular için koruma seviyelerini bu parametrelerden hesaplıyor ve düşük
ücretli sınıfların satışa kapatılacağı eşik değerleri buradan belirliyor.

Zincir şöyle: geçmiş rezervasyon verisinden α ve β tahmin ediliyor, bu
ikisi bir talep dağılımı veriyor, dağılım Littlewood kuralının
kıyasladığı olasılığı veriyor, olasılık koruma seviyesini veriyor, koruma
seviyesi de hangi sınıfın ne zaman kapanacağını. Zincirin başındaki iki
sayı yanlışsa sonundaki satış kararı da yanlış. Zincirin hiçbir halkası
hata vermiyor; sistem sadece sessizce yanlış sınıfı açık ya da kapalı
tutuyor.

Parametrelerin eskimesi de buradan kaynaklanıyor. Talep profili
değişiyor: yeni bir rakip rotaya giriyor, bir sezon beklenenden erken
başlıyor, iş seyahati ile tatil seyahatinin oranı kayıyor. Kaynak metnin
çıkarımı bu yüzden bir bakım kuralı: talep profilindeki değişimlere hızlı
uyum sağlamak için α ve β'nın düzenli olarak yeniden kalibre edilmesi.
Bir kez tahmin edilip bırakılan parametre, bugünkü talebe değil
kalibrasyon günündeki talebe göre koltuk saklıyor.

Yazılım tarafında bunun karşılığı, dağılım parametrelerinin kod
sabiti değil, sürümlenen ve tarihlenen bir veri olması. Hangi koruma
seviyesinin hangi α ve β ile hesaplandığı kaydedilmezse, bir sınıfın
neden erken kapandığını sonradan açıklamak mümkün olmuyor. Dağılım
ailesinin kendisi de, yani normal mi Gamma mı, aynı şekilde
yapılandırılabilir olmalı. Kaynak metnin bir çıkarımı zaten bir geçişi
öngörüyor: rezervasyon sistemleri hâlâ normal dağılım kullanıyorsa
Gamma tabanlı modellemeye geçmek. Dağılımı kodun derinine gömen sistem
bu geçişi bir yapılandırma değişikliği olarak değil, bir yeniden yazım
olarak yaşıyor.

## Yarın işe yarayacak dört çıkarım

1. **Kapanış eşiğini beklenen gelirle hesapla, kotayla değil.** Littlewood
   kuralını yalnızca sabit fiyatlar için bir kez çalıştırıp kota tablosuna
   yazma. Beklenen marjinal gelir talep tahminiyle birlikte güncellendiğinde
   sınıf kapanış eşiği de güncellensin.
2. **Talep modelinde normal dağılımı sorgula.** Rezervasyon sistemi hâlâ
   normal dağılım kullanıyorsa, asimetrik talep artışlarını ve düşük talep
   dönemlerini daha iyi yakalamak için Gamma tabanlı modellemeye geç.
   Özellikle ortalaması düşük, varyansı yüksek sınıflarda normal dağılımın
   ne kadar olasılık kütlesini sıfırın altına koyduğuna bak.
3. **Overbooking limitini reddedilen yolcu oranıyla denetle.** Limitleri
   belirlerken her 10.000 yolcu başına istemsiz reddedilen yolcu oranını
   izle ve rakip havayollarının verisiyle kıyasla. Oran hem gelirin hem
   marka itibarının göstergesi; limit servisinin çıktısıyla kapı verisini
   aynı yerde topla.
4. **α ve β'yı düzenli yeniden kalibre et.** Gamma modelinin şekil ve
   ölçek parametrelerini talep profilindeki değişime göre düzenli olarak
   yeniden tahmin et. Parametreleri tarihli veri olarak sakla ki bir
   koruma seviyesinin hangi parametreyle hesaplandığı sonradan
   izlenebilsin.

Bu bölümde ne yok: overbooking limitinin show-up tahmininden nasıl
çıkarıldığı ("Biniş oranı tahmini ve overbooking stratejileri" ve
"Havacılıkta overbooking (fazla rezervasyon) ve show-up modelleme
stratejileri"), talebin kapasiteyi aştığında kaybedilen yolcunun nasıl
ölçüldüğü (spill bölümleri) ve ikiden fazla ücret sınıfına genişleyen
sıralı koruma seviyeleri. Bu bölüm iki sınıflı temel kararı ve o kararın
hangi talep modeline yaslandığını anlatmak için var.
