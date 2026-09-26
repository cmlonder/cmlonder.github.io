---
title: "Havacılık talebi tahminleme ve zaman serisi analizi"
domain: "aviation"
summary: "Kalkıştan haftalar önce, uçuşta henüz rezervasyon yokken gelir yönetimi sisteminin elinde yalnızca geçmiş vardır. Bu bölüm o geçmişi tahmine çeviren zaman serisi modellerini, basit hareketli ortalamadan Holt-Winters'a kadar, hangi varsayımı taşıdıklarıyla ve α, β, γ parametrelerinin hangi iş kararına karşılık geldiğiyle anlatıyor."
audience: "Gelir yönetimi, talep tahmini ya da kapasite sistemleriyle çalışan, tahmin modülünün içinde hangi hesabın döndüğünü anlamak isteyen yazılımcı ve analist. İstatistik altyapısı şart değil; hareketli ortalama, üstel düzeltme, kalıcı bileşen, trend, mevsimsel faktör, mevsimsellikten arındırma ve normalizasyon metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Spill bölümleri talebin dağılımıyla uğraşıyordu: kapasiteyi aşan yolcunun
ne kadar olduğu, oynaklığın hangi dağılımla yakalanacağı. Bütün o hesapların
başında sessiz bir girdi duruyor: ortalama talebin kendisi. O sayı bir yerden
geliyor ve kalkıştan haftalar önce, uçuşta tek rezervasyon yokken, geldiği
tek yer geçmiş. **Uzun vadeli talep tahmini bir kehanet değil, geçmişe hangi
ağırlığı vereceğine dair bir karar; model seçmek aslında bu kararı seçmek.**
Bu bölüm o kararın seçeneklerini anlatıyor: her gözleme eşit davranan basit
hareketli ortalama, yakın geçmişe daha çok güvenen üstel düzeltme, ve trendi
ve mevsimselliği ayrı ayrı takip eden Holt-Winters.

## Tarihsel tahmin, rezervasyon olmadığında devreye giren taban

Gelir yönetimi sistemi bir uçuşun talebini iki kaynaktan okuyabilir: o
uçuşa şimdiye kadar gelmiş rezervasyonlardan ve aynı uçuşun geçmiş
dönemlerdeki davranışından. Kalkışa yakın dönemde birincisi zengin, ikincisi
yardımcı. Kalkıştan haftalar önce durum tersine dönüyor. Kaynak metin karar
kuralını açık koyuyor: uçuşta hiç rezervasyon aktivitesi yoksa ya da çok
azsa, sistem tarihsel veriye dayanan sağlam bir uzun vadeli tahmine geçmeli
ve zaman serisi modelini temel almalı.

Bu kuralın arkasında basit bir gözlem var. Beş rezervasyondan çıkarılan bir
eğilim, gürültüden ayırt edilemez. Aynı uçuşun son iki yılda her hafta ne
kadar dolduğu ise gürültüyü ortalamanın içinde eritir. Tahminin sağlamlığı
buradan geliyor: tek bir haftanın tuhaflığı sonucu sürüklemiyor.

Modelin tahmin ettiği şeyin de altını çizmek gerekiyor. Beslenen veri
tarihsel ve kısıtlanmamış (unconstrained) talep, yani kapasite dolduğu için
satılamayan yolcuyu da içeren talep. Spill bölümlerinde gözlemlenen
dolulukla gerçek talep arasındaki farkın nasıl hesaplandığı anlatılmıştı;
zaman serisi modeli o hesabın çıktısını girdi olarak alıyor. Satılan koltuk
sayısını doğrudan seriye vermek, kapasitenin tavanını talebin tavanı gibi
öğretmek demek.

Yazılım tarafında bunun karşılığı iki modlu bir tahmin servisi. Bir mod
rezervasyon eğrisinden besleniyor, diğeri zaman serisinden. Aralarındaki
geçiş, rezervasyon aktivitesinin yeterli olup olmadığına dair açık bir
kurala bağlı olmalı; o eşik bir yapılandırma parametresi, kodun içine
gömülmüş bir sabit değil. Hangi modun hangi uçuşa hangi tarihte cevap
verdiği de çıktıda görünmeli, yoksa analist bir tahminin neden oynadığını
sorduğunda cevap veremezsin.

## Hareketli ortalama ile üstel düzeltme arasındaki fark, geçmişe verilen ağırlık

En basit zaman serisi modeli, basit hareketli ortalama (simple moving
average): son N dönemin gözlemlerini topla, N'ye böl, bir sonraki dönemin
tahmini olsun. Bu modelin gizli varsayımı her gözlemin tahmine eşit katkı
yapması. Pencerenin içindeki en eski hafta ile en yeni hafta aynı ağırlıkta;
pencerenin dışındaki bir hafta ise hiç yok.

Talebin yavaş değiştiği, dünün bugünden farklı bir dünyayı temsil etmediği
bir pazarda bu varsayım makul. Ama havacılık talebi nadiren böyle. Bir rakip
rotadan çekilir, yeni bir sefer açılır, bir pazar büyür; bu değişimlerden
sonra üç ay önceki gözlem bugünkü talebi dünkü kadar iyi anlatmaz.

Üstel düzeltme (exponential smoothing) bu varsayımı tersine çeviriyor.
Kaynak metnin ifadesiyle model, en son gözlemin geçmiş gözlemlerden daha
büyük bir ağırlığa sahip olduğunu varsayıyor. Mekanizma şu: yeni tahmin,
son gözlem ile bir önceki tahminin ağırlıklı karışımı. Son gözleme α kadar,
önceki tahmine 1 eksi α kadar ağırlık veriliyor. Önceki tahmin de kendinden
öncekilerin karışımı olduğu için, her eski gözlemin ağırlığı zamanla
geometrik olarak azalıyor ama hiçbir zaman tamamen sıfırlanmıyor. Geçmiş
unutulmuyor, yalnızca soluyor.

Seçim kuralı buradan çıkıyor. Her gözlemin eşit katkı yapması isteniyorsa
basit hareketli ortalama. En güncel verinin gelecekteki talebi daha iyi
yansıttığı varsayılıyorsa üstel düzeltme. Bu, geçmişin uzak verisi yerine
bugünün eğilimine odaklanma stratejisi ve dinamik piyasa koşullarına uyum
yeteneğinin kaynağı.

## Üstel düzeltmenin asıl avantajı mimaride

Kaynak metin pratikte üstel düzeltmenin daha yaygın olduğunu söylüyor ve
gerekçesi istatistiksel değil, operasyonel: veri depolama gereksinimini
azaltması. Stratejik çıkarımlarda aynı nokta tekrar geçiyor: üstel
düzeltme, basit hareketli ortalamaya göre çok daha az veri saklayarak
benzer sonuçlar veriyor.

Bunun nedeni modelin yapısında. Hareketli ortalama her yeni tahmin için
penceredeki bütün gözlemlere ihtiyaç duyuyor; N haftalık bir pencere, her
seri için N sayıyı sürekli saklamak ve kaydırmak demek. Üstel düzeltme ise
yalnızca bir önceki tahmini ve yeni gözlemi istiyor. Geçmişin tamamı o tek
sayının içinde sıkıştırılmış halde duruyor.

Bir gelir yönetimi sisteminde tahmin edilen seri sayısı uçuş, gün, sınıf ve
kalkışa kalan süre kırılımlarının çarpımı. Bu çarpımda seri başına N sayı
yerine birkaç sayı saklamak, tahmin koşusunun süresini ve durum tablosunun
boyutunu doğrudan belirliyor. Kaynak metin bu verimliliğin sistem mimarisi
tasarlanırken operasyonel hız için önceliklendirilmesini öneriyor.
Yazılım tarafında bunun karşılığı, tahmin durumunun ham gözlem geçmişi
olarak değil, model bileşenlerinin son değerleri olarak tutulması; yeni bir
gözlem geldiğinde bütün seri yeniden hesaplanmıyor, durum artımlı olarak
güncelleniyor. Ham geçmiş denetim ve yeniden kalibrasyon için arşivde
kalabilir, ama sıcak yolda ona ihtiyaç yok.

## Holt-Winters talebi dört parçaya ayırıp üçünü ayrı ayrı izliyor

Tek parametreli üstel düzeltme bir seviyeyi takip eder. Talep sürekli
büyüyorsa ya da her yaz yükseliyorsa, bu model hep bir adım geride kalır:
büyüyen pazarda sürekli düşük, yaz başında sürekli geç tahmin üretir.
Kaynak metin bu durumu şöyle ifade ediyor: veri mevsimsel eğilimlere sahip
olduğunda, trend ve mevsimsel kalıpları tahmin etmek için düşük maliyetli
üstel düzeltme yöntemleri gerekiyor. Bu ihtiyaca cevap veren çizgi Holt'un
1957 ve Winters'ın 1960 çalışmalarından geliyor, ve çekiciliği hesaplama
maliyetini düşük tutarak karmaşık veriyi analiz edebilmesi.

Model talebi dört bileşene ayırıyor:

- **Kalıcı bileşen (a):** temel talep seviyesi, verideki ani değişimlerden
  arındırılmış baz değer.
- **Lineer trend (b):** talebin zaman içindeki yukarı ya da aşağı yönlü
  hareketi.
- **Mevsimsel faktör (s):** haftalık ya da aylık bazda tekrarlanan
  dalgalanma.
- **Rastgele hata (ε):** modelin açıklayamadığı, öngörülemeyen sapma.

İlk üçü izleniyor ve her birinin kendi düzeltme katsayısı var. α rastgele
dalgalanmayı düzeltiyor ve kalıcı bileşenin yeni gözleme ne kadar hızlı
tepki vereceğini belirliyor. β trendi düzeltiyor. γ mevsimsel etkiyi
dengeliyor. Üçü de 0 ile 1 arasında değer alıyor ve modelin hassasiyetini
belirliyor: 1'e yakın bir katsayı, o bileşenin son gözleme hızla
uyduğunu; 0'a yakın bir katsayı, geçmişte öğrendiğini koruduğunu
söylüyor.

Dördüncü bileşen, hata, izlenmiyor ama unutulmamalı. Kaynak metin bunu
ayrı bir çıkarım olarak koyuyor: modellerdeki rastgele hata bileşeni her
zaman göz önünde bulundurulmalı ve tahminlerin bir olasılık aralığı
sunduğu iş birimlerine hatırlatılmalı. Tek bir sayı olarak raporlanan
tahmin, bu aralığı gizliyor.

## Mevsimselliği çıkarmadan trendi okuyamazsın

Holt-Winters'ın içindeki en önemli adım, mevsimsellikten arındırma
(deseasonalization). Mantık şu: yaz haftasında gelen yüksek bir gözlem,
talebin kalıcı olarak yükseldiği anlamına gelmiyor olabilir; o hafta her
yıl yüksek. Model bu ayrımı yapmazsa, her yaz trendin yukarı döndüğünü,
her kış aşağı döndüğünü sanır ve kalıcı bileşeni her mevsimde yanlış yöne
iter.

Çözüm çarpımsal: mevcut gözlem değeri, ilgili dönemin mevsimsel faktörüne
bölünüyor. Ortalamanın üzerinde bir haftada faktör 1'den büyük, altında
bir haftada 1'den küçük; gözlem bu faktöre bölündükten sonra kalıcı
bileşeni güncellemek için kullanılıyor. Böylece
sistem, mevsimin etkisini ayırdıktan sonra kalan saf seviyeyi ve saf
trendi güncelliyor, gelecek tahmini de daha tutarlı çıkıyor. Tahmin
üretirken işlem tersine dönüyor: kalıcı bileşen artı trend, hedef dönemin
mevsimsel faktörüyle çarpılıyor.

Yazılım tarafında bunun karşılığı, mevsimsel faktörlerin seri başına ayrı
bir tablo olarak tutulması: haftalık desende 52, aylık desende 12 satır.
Her gözlemde bu tablonun yalnızca o döneme ait satırı güncelleniyor. Faktör
tablosu modelin durumunun parçası, kalıcı bileşen ve trend gibi
sürümlenmeli ve yeniden hesaplanabilir olmalı.

## Model başlamak için iki yıl istiyor

Üstel düzeltmenin artımlı yapısı bir soruyu açıkta bırakıyor: ilk tahmin
nereden geliyor? Her güncelleme bir önceki durumu kullanıyorsa, ilk durumu
birinin koyması gerekiyor. Buna başlatma (initialization) deniyor ve
Holt-Winters'ta bu iş, mevsimsel faktörlerin ve trendin ilk değerlerini
hesaplamak demek.

Kaynak metnin eşiği net: ideal bir başlangıç değeri için sistemin en az 24
aylık tarihsel veriye sahip olması gerekiyor. Gerekçe mevsimsellikte. Tek
bir yılın verisiyle bir yaz haftasının yüksekliğinin mevsimden mi, o yılın
tesadüfünden mi, yoksa trendden mi geldiğini ayırmak mümkün değil. İki yıl,
aynı dönemi iki kez görmek ve aradaki farkı trende, ortak kısmı mevsime
yazmak için en az gereken şey.

Bu eşiğin altında kalan durumlar gerçek hayatta sık: yeni açılan bir rota,
yeniden numaralanan bir sefer, tarifesi değişen bir uçuş. Kaynak metin bu
durumda sistemin başlangıç değerlerini atamak için ortalama bazlı
alternatif mantıkları devreye sokmasını öneriyor. Yani 24 aylık veri
yoksa model çalışmayı reddetmemeli, ama tam Holt-Winters başlatmasını
yapıyormuş gibi de davranmamalı. Yazılım tarafında bu, başlatma yolunun
eldeki veri miktarına göre dallanması ve hangi dalın kullanıldığının
serinin üst verisinde kayıtlı olması anlamına geliyor. Ortalama bazlı
başlatılmış bir serinin tahmini, tam başlatılmış bir serininkiyle aynı
güvenle okunmamalı.

## Mevsimsel faktörler normalize edilmezse model sessizce kayar

Başlatma tek seferlik bir iş, ama mevsimsel faktörler her gözlemle
güncellenmeye devam ediyor. Her faktör kendi dönemi için ayrı ayrı
güncellendiğinde, faktörlerin toplamı zamanla başlangıçtaki dengesinden
uzaklaşabiliyor. Faktörlerin ortalaması 1'in üzerine çıkarsa, model
talebin bir kısmını hem kalıcı bileşende hem mevsimde sayıyor; altına
inerse bir kısmını hiçbirinde saymıyor.

Kaynak metin bunu kritik bir kontrol mekanizması olarak koyuyor:
mevsimsellik katsayıları düzenli aralıklarla yeniden normalize edilmeli.
İş kuralı olarak, bir periyottaki tüm mevsimsel faktörlerin toplamı
tanımlanan sezon uzunluğuna, T'ye eşit olmalı. Haftalık desende T 52,
aylık desende 12. Başka bir deyişle faktörlerin ortalaması 1: mevsim
talebi dönemler arasında yeniden dağıtıyor, toplamı büyütmüyor ya da
küçültmüyor. Bu kontrolün amacı modelin zaman içinde sapmasını önlemek ve
tahminlerin gerçek toplam talep hacmiyle uyumlu kalmasını sağlamak.

Normalizasyon atlandığında hata bir anda görünmüyor. Her güncelleme küçük
bir kayma ekliyor ve aylar sonra tahminler sistematik olarak yüksek ya da
düşük çıkmaya başlıyor. Bu tür bir hatayı tek bir tahminin sonucuna
bakarak yakalamak zor; faktör tablosunun toplamına bakarak yakalamak
kolay. Yazılım tarafında bunun karşılığı, normalizasyonun ayrı ve
zamanlanmış bir iş olarak çalışması ve her koşuda toplamın T'den ne kadar
saptığının bir metrik olarak yayınlanması.

## Parametre seçimi pazarın karakterini modele yazmak

α, β ve γ'nın 0 ile 1 arasında bir yerde durması teknik bir ayrıntı gibi
görünüyor, ama her biri bir iş varsayımı taşıyor. Yüksek β, trendin hızlı
değiştiğini ve modelin son dönemdeki büyümeye hemen inanması gerektiğini
söylüyor. Düşük β, trendin kalıcı olduğunu ve birkaç haftalık sıçramanın
onu değiştirmemesi gerektiğini söylüyor. Aynı mantık α için seviyeye, γ
için mevsime geçerli.

Kaynak metin bu seçimi havayolunun faaliyet gösterdiği pazarın
volatilitesine bağlıyor ve bir örnek veriyor: hızla büyüyen bir pazarda
trend bileşeni, β, daha hassas hale getirilmeli. Olgun ve durağan bir
pazarda aynı hassasiyet gürültüyü trend sanmak anlamına gelir.

Bu, tek bir parametre setinin bütün ağa uygulanamayacağı demek. Yeni ve
büyüyen bir rota ile yıllardır aynı yolcu profilini taşıyan bir rota aynı
β ile tahmin edilirse, biri hep geride kalır, diğeri hep titrer. Yazılım
tarafında bunun karşılığı, parametrelerin pazar ya da rota grubu
seviyesinde yapılandırılabilir olması ve hangi seriyi hangi parametre
setinin tahmin ettiğinin izlenebilmesi. Parametreyi değiştiren analistin
kararı da, parametrenin kendisi kadar kayıt altında olmalı.

## Yarın işe yarayacak dört çıkarım

1. **Durumu sakla, geçmişi değil.** Tahmin servisini üstel düzeltmenin
   artımlı yapısı üzerine kur: seri başına kalıcı bileşen, trend ve
   mevsimsel faktör tablosunu tut, her yeni gözlemde bunları güncelle.
   Kaynak metin bu veri verimliliğini operasyonel hız için öncelik olarak
   koyuyor.
2. **α, β ve γ'yı pazarın oynaklığına göre ayarla.** Tek parametre setiyle
   bütün ağı tahmin etme. Hızla büyüyen pazarda trend katsayısını daha
   hassas yap, durağan pazarda gürültüyü trend sanmayacak kadar düşük tut.
3. **24 ayı eşik olarak kabul et, altı için ayrı yol yaz.** Mevsimsel
   faktörleri ve trendi başlatmak için iki yıllık veri gerekiyor. Veri
   eksikse ortalama bazlı bir başlatma kullan ve serinin bu yoldan
   başlatıldığını işaretle.
4. **Tahmini aralık olarak raporla, faktörleri düzenli normalize et.**
   Rastgele hata bileşeni her tahminde var; iş birimlerine tek sayı
   değil olasılık aralığı göster. Mevsimsel faktörlerin toplamını düzenli
   olarak sezon uzunluğuna, haftalıkta 52'ye, aylıkta 12'ye çek.

Bu bölümde ne yok: talebin dağılımının şekli ve kapasiteyi aşan yolcunun
hesabı (spill bölümleri, özellikle "Yüksek varyanslı talep ve iki aşamalı
Cox dağılımı"), tahminin koltuk tahsisine ve envanter kontrolüne nasıl
girdiği, rezervasyon eğrisinden üretilen kısa vadeli tahmin. Bu bölüm
yalnızca bir şeyi netleştirmek için var: uçuşta henüz rezervasyon yokken
tahminin geçmişten nasıl üretildiği ve o geçmişe hangi ağırlığın hangi
gerekçeyle verildiği.
