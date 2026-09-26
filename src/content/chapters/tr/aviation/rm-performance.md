---
title: "Havacılık gelir yönetimi performans ölçümü"
domain: "aviation"
summary: "Gelir yönetimi sistemi kendi kararlarının sonucunu ölçmezse aynı hatayı her sezon tekrar eder. Bu bölüm RM performansını ölçen göstergeleri kalkıştan önce müdahale edilebilenler ve kalkıştan sonra ders çıkarılanlar diye ayırıyor; RASM ile CASM'in neden birlikte okunması gerektiğini, spoilage ve denied boarding maliyetinin nerede tutulduğunu ve tahmin hatasının hangi istatistiklerle sorgulandığını anlatıyor."
audience: "Gelir yönetimi, envanter ya da raporlama sistemleri üzerinde çalışan, bu sistemlerin ürettiği KPI'ların neyi ölçtüğünü ve hangi karara geri döndüğünü anlamak isteyen yazılımcı ve analist. Overbooking ve tahminleme bölümlerinin okunmuş olması işe yarar; RASM, CASM, spoilage, denied boarding, MAD, bias ve WMAPE metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler gelir yönetiminin kararlarını anlattı: talebi nasıl
tahmin ettiğini, overbooking limitini nasıl koyduğunu, hangi sınıfı ne
zaman kapattığını. Bu bölüm o kararların sonradan nasıl hesaba
çekildiğine bakıyor. **Performans ölçümü gelir yönetiminin raporlama
katmanı değil, kendi modellerini düzelttiği geri besleme döngüsü;
ölçmeyen bir RM sistemi aynı sistematik hatayı her sezon yeniden
üretir.** Kaynak metin amacı açık koyuyor: performans, gelir yönetimi
sürecindeki sistematik zayıflıkları bulmak ve alınacak düzeltici önlemleri
belirlemek için zaman içinde ölçülmeli. Buradaki anahtar kelime "zaman
içinde". Tek bir uçuşun sonucu şans olabilir; aylık ve yıllık
karşılaştırmada tekrar eden sapma ise modelin bir yerinde yanlış bir
varsayım olduğunu gösterir.

## Ölçüm tek seferlik bir rapor değil, modele geri dönen bir sinyal

Gelir yönetiminin kararları olasılıklı. Bir sınıfı erken kapatmak doğru
bir karar olabilir ve yine de o uçuşta boş koltukla kalkılabilir; talep
tahmini doğru olabilir ve yine de o gün yolcu gelmeyebilir. Bu yüzden
tek uçuşun sonucuna bakıp modelin iyi ya da kötü olduğuna karar
verilemiyor. Karar verilebilecek şey, sapmanın bir yöne doğru birikip
birikmediği.

Brifingin önerdiği mantık da bu: ölçüm verisi, RM modellerini sürekli
uyarlamak ve iyileştirmek için bir geri besleme döngüsü olarak
kullanılıyor. Aylık ve yıllık karşılaştırmalar süreçteki sistematik
hataları ortaya çıkarıyor, düzeltici aksiyonlar da bu hatalara göre
planlanıyor. Uzun vadeli performans artışı buradan geliyor; tek tek
uçuşları kurtarmaktan değil, aynı yanlışın bir sonraki sezona
taşınmamasından.

Yazılım tarafında bunun karşılığı şu: performans verisi RM sisteminin
dışında, ayrı bir raporlama aracında yaşarsa döngü kapanmıyor. Analist
raporu okuyor, bir sonuç çıkarıyor, parametreyi elle değiştiriyor ya da
değiştirmeyi unutuyor. Ölçüm çıktısının model eğitimine ve parametre
güncellemesine aynı veri hattından geri dönebilmesi, ölçümün kendisi
kadar önemli.

## Göstergeler kalkış anına göre ikiye ayrılıyor, çünkü yapabileceğin şey değişiyor

Kaynak metin performans metriklerini iki ana başlıkta topluyor: standart
temel performans göstergeleri (KPI) ve gelir fırsat modeli. Standart
KPI'lar da kendi içinde operasyonel sürece göre ikiye ayrılıyor: uçuş
öncesi (pre-departure) ve uçuş sonrası (post-departure) göstergeler.

Bu ayrım bir sınıflandırma tercihi gibi görünse de aslında iki farklı
kullanım biçimini ayırıyor. Uçuş öncesi göstergeler müdahale imkânı
sunuyor: uçak henüz kalkmamış, envanter hâlâ açık, fiyat ve kapasite
hâlâ değiştirilebilir. Uçuş sonrası göstergeler ise müdahale için geç
kalmış ama ders çıkarmak için doğru zamanda: uçuş kapanmış, sonuç
kesinleşmiş, genel verimlilik artık ölçülebilir.

Brifingin uçuş öncesi izleme için koyduğu kural basit: bir uçuşun
beklenen performansı hakkında şüphe oluştuğunda, yani hedeflenen
KPI'ların altında kalma riski göründüğünde, düzeltici önlem derhal
devreye sokulmalı. "Şüphe oluştuğunda" ifadesi önemli. Uçuş öncesi
göstergenin işi kesin bir sonuç vermek değil, erken bir uyarı üretmek.
Kesin sonuç zaten uçuş sonrası göstergelerin işi.

Yazılım tarafında iki ayrı akış anlamına geliyor bu. Uçuş öncesi
göstergeler canlı envanter ve rezervasyon verisi üzerinden, kalkışa kadar
tekrar tekrar hesaplanan ve eşik aşılınca aksiyon tetikleyen bir izleme
akışı. Uçuş sonrası göstergeler ise kapanmış uçuşlar üzerinde, dönemsel
olarak çalışan ve sonucu modele geri besleyen bir analiz akışı. İkisini
aynı gece çalışan tek bir rapor işine sıkıştırmak, uçuş öncesi tarafı
anlamsızlaştırıyor.

## Doluluk oranı tek başına iyi bir haber değil; RASM ile CASM birlikte okunmalı

Havayolunun genel verimliliği için kaynak metnin önerdiği ölçüt CASM,
kilometre bazında söylendiğinde CASK. İşletme maliyetlerinin toplam
mevcut koltuk miline ya da kilometresine bölünmesiyle bulunuyor, yani
arz edilen her koltuk-mil için ne kadar maliyet katlanıldığını
gösteriyor. Kaynak metnin tanımıyla CASM ne kadar düşükse havayolu o
kadar kârlı ve verimli.

Gelir yönetimi açısından en kritik gösterge ise RASM, ya da RASK. Kaynak
metin onu en önemli tekil ölçüt olarak tanımlıyor ve yolcu gelirinin
mevcut koltuk miline ya da kilometresine oranı olarak hesaplıyor.
Paydaya dikkat: satılan koltuk değil, mevcut koltuk. RASM, arz edilen
kapasitenin ne kadar etkin şekilde gelire dönüştüğünü gösteriyor. Boş
kalkan koltuk da paydaya giriyor; yüksek ücretle satılıp yarı boş
kalkan bir uçuş ile düşük ücretle ağzına kadar dolan bir uçuş bu oranda
aynı yere düşebiliyor.

İki metrik aynı paydayı paylaşıyor ve bu tesadüf değil. Biri arz edilen
birim başına maliyeti, öteki arz edilen birim başına geliri ölçüyor.
Aralarındaki fark, birim başına kârın kabaca nerede durduğunu söylüyor.
Brifingin çıkarımlarından biri tam buna dayanıyor: stratejik kararlarda
yalnızca doluluk oranına (load factor) değil, birim maliyeti yansıtan
CASM ile birim geliri yansıtan RASM arasındaki dengeye odaklanmak.

Doluluk oranı tek başına yanıltıcı, çünkü uçağı doldurmanın en kolay
yolu ucuza satmak. Yüksek doluluk ve düşük RASM, koltukların satıldığını
ama değerinin altında satıldığını söylüyor. Gelir yönetiminin bütün
varlık nedeni de bu farkı kapatmak: aynı kapasiteden, aynı doluluğa
ulaşırken daha fazla gelir çıkarmak.

Yazılım tarafında bunun karşılığı, raporlama modelinde RASM'in ve
CASM'in aynı boyutlarda (uçuş, rota, dönem) ve aynı kapasite tanımıyla
hesaplanması. İki metrik farklı sistemlerden, farklı koltuk sayısı
tanımlarıyla geliyorsa aradaki fark bir iş gerçeği değil, bir veri
tutarsızlığı olur.

## Boş koltuk ve kapıda kalan yolcu aynı kararın iki yanlış yönü

Overbooking bölümlerinde anlatılan denge burada ölçüme dönüşüyor.
Overbooking limiti iki riskin arasında seçiliyor: boş koltuk (spoilage)
ve uçağa alınamayan yolcu (oversale, denied boarding). Performans
ölçümü bu iki riskin gerçekte ne kadar gerçekleştiğini sayıyor.

Spoilage tarafında kaynak metin, kapanan uçuşlardaki boş koltuk sayısını
ve spoilage oranını takip etmeyi öneriyor; oranı brifing boş koltukların
toplam yolcu sayısına oranı olarak tanımlıyor. Buradaki kritik nokta
"kapanan uçuş". Rezervasyonu kapatılmış, yani satışa artık açık olmayan
bir uçuşun boş koltukla kalkması, satılabilecek bir koltuğun
satılmadığını gösteriyor. Bu veri, rezervasyon kapatma kararlarının ya
da fiyatlandırma stratejisinin ne kadar isabetli olduğunun göstergesi
olarak kullanılıyor.

Brifing aynı mantığı overbooking hatalarının kontrolünde de kuruyor:
kapanan uçuşlardaki doluluk oranı (load factor on closed flights) bir
düzeltme faktörü olarak kullanılıyor. Kapanmış bir uçuş dolu
kalkmıyorsa overbooking limiti fazla temkinli; sürekli kapıda yolcu
bırakıyorsa fazla agresif. Bu analizin çözünürlüğü de belirtilmiş:
rezervasyon sınıfı ve uçuş bacağı (leg) bazında, her birinin satış
dönemi boyunca ne zaman açık ne zaman kapalı kaldığına bakan bir
yaşam döngüsü analizi.

Yazılım tarafında bu, envanter sisteminin yalnızca sınıfın şu anki
durumunu değil, açık/kapalı durumunun zaman içindeki geçmişini de
saklaması demek. Kapanış zamanını bilmeden "kapanan uçuşta boş koltuk"
metriği hesaplanamıyor; bir sınıfın ne kadar erken kapandığını bilmeden
de kapanma kararının isabeti sorgulanamıyor.

## Denied boarding'in maliyeti havalimanında oluşuyor, orada tutulmalı

Oversale tarafının maliyeti bir sayı değil, bir kalem listesi. Kaynak
metin bileşenleri sayıyor: kupon (voucher) maliyetleri, yemekler, yer
ulaşımı ve iyi niyet (goodwill). İlk üçü muhasebede görünen nakit
giderler. Sonuncusu ise görünmüyor: kapıda bırakılan yolcunun
havayoluna duyduğu güvenin kaybı, yani müşteri sadakati kaybı.

Brifingin bu maliyeti nerede takip edilmesi gerektiğine dair kuralı net:
havalimanı bazında. Gerekçe de çıkarımlar arasında yer alıyor: oversale
maliyetini yalnızca genel toplamda değil havalimanı bazında izlemek,
operasyonel darboğazları görünür kılıyor. Şirket genelinde kabul
edilebilir görünen bir toplam, belirli bir havalimanında tekrar eden
bir sorunu gizleyebilir. Voucher, yemek ve ulaşım maliyetleri de
havalimanına göre değişen kalemler; aynı sayıda reddedilen yolcu farklı
istasyonlarda farklı bedel doğuruyor.

Yazılım tarafında bu, denied boarding olayının istasyon bilgisiyle ve
maliyet kalemleriyle birlikte, ayrı ayrı kaydedilmesi anlamına geliyor.
Tek bir "tazminat tutarı" alanı, hangi kalemin hangi havalimanında
büyüdüğünü söyleyemez. Goodwill kalemi ise doğrudan ölçülemediği için
modele bir varsayım olarak giriyor; o varsayımın nerede ve hangi
değerle tutulduğunun açık olması, overbooking limitinin neden o
noktada durduğunu açıklayabilmek için gerekiyor.

## Pazar payını kendi verin söylemez

Gelir yönetiminin iç metrikleri havayolunun kendi satışını ölçüyor.
Rekabet içinde ne kadar iyi durduğunu ise dışarıdan gelen veriyle
görmek gerekiyor. Brifing pazar payı tahmini için iki dış kaynak
gösteriyor: MIDT (Marketing Information Data Tapes, pazarlama bilgi veri
bantları) ve yolcu alışveriş verisi (passenger shopping data). Sistemin
rekabet gücü bu veriler üzerinden ölçülüyor.

Bir RASM düşüşü talebin azaldığını da, rakibin aynı talepten daha
büyük pay aldığını da gösterebilir. İç veri bu ikisini ayıramıyor. Dış
veri olmadan yapılan performans analizi, pazarın genel hareketiyle
havayolunun kendi hatasını birbirine karıştırıyor. MIDT'nin neyi
gördüğü ve neyi görmediği, pazarlama planlaması ve alışveriş verisi
bölümlerinde ayrıca anlatıldı.

## Tahmin hatası tek bir sayıyla ölçülmez

Gelir yönetiminin bütün kararları bir tahminin üzerinde duruyor: talep
tahmini, iptal tahmini, show-up tahmini. Bu tahminlerin ne kadar
güvenilir olduğu da ölçülmesi gereken bir performans alanı. Kaynak
metin talep ve iptal tahminlerinin doğruluğunu sorgulamak için bir dizi
istatistiksel metrik sayıyor: ortalama mutlak sapma (Mean Absolute
Deviation, MAD), standart hata, bias (yanlılık), WMAPE ve ortalama kare
hata (Mean Squared Error, MSE). Brifingin ifadesiyle bu metrikler
modelin güvenilirliğini belirliyor.

Birden fazla metrik gerekiyor, çünkü her biri hatanın farklı bir
yüzünü görüyor. MAD ve MSE hatanın büyüklüğünü ölçüyor; MSE büyük
hataları kareyle cezalandırdığı için seyrek ama iri sapmalara daha
duyarlı. WMAPE hatayı ağırlıklı bir yüzde olarak veriyor, böylece
farklı büyüklükteki uçuşların ve pazarların hataları karşılaştırılabilir
hale geliyor. Bias ise ötekilerden farklı bir soru soruyor: hata ne
kadar büyük değil, hangi yönde. Sürekli fazla ya da sürekli eksik
tahmin eden bir model, ortalama hatası küçük olsa bile sistematik bir
zayıflık taşıyor.

Bias'ın özel bir yeri var, çünkü bölümün başındaki "sistematik
zayıflık" tanımına en doğrudan karşılık gelen metrik o. Rastgele hata,
yeterince uçuşta birbirini götürüyor. Yanlılık ise birikiyor: talebi
sürekli eksik tahmin eden bir model sınıfları erken kapatıyor ve
koltukları ucuza bırakıyor; sürekli fazla tahmin eden bir model de
koltukları gelmeyecek yüksek ücretli yolcuya saklıyor. Brifingin
çıkarımı bunu bir iyileştirme döngüsüne bağlıyor: yanlılığı düşürmek
için WMAPE ve MAD sonuçlarını model eğitim süreçlerine entegre etmek.

Yazılım tarafında bunun karşılığı, tahmin servisinin ürettiği her
tahminin, gerçekleşen değer geldiğinde karşılaştırılabilecek şekilde
saklanması. Tahmin anı, tahmin ufku, tahmin edilen değer ve sonradan
gerçekleşen değer aynı kayıtta buluşmuyorsa bu metriklerin hiçbiri
hesaplanamıyor. Bu metrikleri eğitim sürecine geri beslemek de ancak
o kayıt varsa mümkün.

## Yarın işe yarayacak dört çıkarım

1. **Uçuş öncesi göstergeleri aksiyona bağla.** Performansı düşük
   seyreden uçuşları uçuş öncesi metriklerle yakala ve kapasite ya da
   fiyat müdahalesini otomatik tetikle. Kalkıştan sonra görülen bir
   sapma yalnızca bir sonraki sezona ders olur.
2. **Oversale maliyetini havalimanı bazında tut.** Voucher, yemek, yer
   ulaşımı ve goodwill kalemlerini istasyon bazında ayrı kaydet. Şirket
   geneli toplam, tek bir havalimanında tekrar eden darboğazı gizler.
3. **Tahmin hatasını eğitime geri besle.** WMAPE ve MAD sonuçlarını
   model eğitim sürecine entegre et, hedefi özellikle bias'ı düşürmek
   olarak koy. Büyüklüğü küçük ama yönü sabit bir hata, en pahalı hata
   türü.
4. **Doluluğu RASM ve CASM'le birlikte oku.** Stratejik kararlarda
   load factor'ü tek başına başarı ölçütü sayma; birim geliri gösteren
   RASM ile birim maliyeti gösteren CASM arasındaki dengeye bak.

Bu bölümde ne yok: overbooking limitinin nasıl hesaplandığı ve show-up
tahmininin dağılım varsayımları ("Havacılıkta overbooking (fazla
rezervasyon) ve show-up modelleme stratejileri"), tahmin modellerinin
kendisi ("Gelir yönetiminde tahminleme modelleri ve iş mantığı analizi")
ve MIDT gibi pazar verilerinin kapsam sınırları ("Havayolu pazarlama
planlama süreci ve iş mantığı analizi"). Gelir fırsat modeli burada
yalnızca bir kategori olarak geçiyor; iç yapısı bu bölümün kaynağında
yer almıyor. Bu bölüm o kararların sonradan hangi göstergelerle hesaba
çekildiğini anlatmak için var.
