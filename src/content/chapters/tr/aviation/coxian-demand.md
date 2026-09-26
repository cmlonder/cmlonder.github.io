---
title: "Yüksek varyanslı talep ve iki aşamalı Cox dağılımı"
domain: "aviation"
summary: "Birinci sınıf kabinde talep o kadar oynak ki negatif üstel dağılımın izin verdiği varyansı aşıyor; iki aşamalı Cox dağılımı bu boşluğu ilk iki momenti eşleştirerek kapatıyor. Bölüm, modelin yapısını, taşan talebin (spill) gözlemlenen dolulukla nasıl ilişkilendiğini ve kapanış doluluğu (LFCF) varsayımındaki 15 puanlık farkın kayıp yolcu tahminini nasıl katladığını anlatıyor."
audience: "Talep tahmini, spill hesabı ya da gelir yönetimi optimizasyonuyla çalışan, istatistiksel modelin hangi varsayımla ne ürettiğini anlamak isteyen yazılımcı ve analist. Olasılık dağılımına aşinalık işe yarar ama şart değil; varyasyon katsayısı (CV), faz tipi dağılım, nominal doluluk ve LFCF metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Talep tahmini bölümlerinin büyük kısmı ortalamayla uğraşır: bu uçuşa kaç
yolcu gelecek, bu sınıfa kaç koltuk ayrılmalı. Birinci sınıf kabin bu
alışkanlığı bozuyor. Orada talep bazı günler neredeyse sıfır, bazı günler
kabinin birkaç katı; ortalama hiçbir günü temsil etmiyor. **Talebin
ortalaması kadar dağılımının şekli de modelin parçası; şekli yanlış
seçilen bir model, doğru ortalamayla yanlış spill hesaplar.** Bu bölüm iki
şeyi anlatıyor: yüksek varyanslı talebi yakalamak için neden iki aşamalı
Cox dağılımına ihtiyaç duyulduğunu, ve kayıp yolcu tahmininin, uçuşun kaç
dolulukta kapandığına dair tek bir varsayıma ne kadar duyarlı olduğunu.

![Sunumun kapak slaytı. Başlık: Yüksek Varyanslı Talebi Modellemek. Alt başlık: First Class kabinler için iki aşamalı Cox dağılımı ve taşma (spill) analizi. Sağda noktalı bir ızgara üzerinde soldan gelen koyu mavi bir çizgi ortada ikiye ayrılıyor: bir kol turuncu renkte yukarı, diğeri koyu mavi renkte aşağı gidiyor.](/decks/coxian-demand/01.webp "Ortadaki çatallanma bölümün özeti: talep ya birinci aşamada biter ya da ikinci aşamaya geçer. Modelin bütün esnekliği o ayrım noktasında.")

## Negatif üstel dağılım birinci sınıfın oynaklığını taşıyamıyor

Taşan talebi hesaplamak için önce talebin bir dağılımını varsaymak
gerekiyor. En basit aday negatif üstel dağılım: tek parametreli,
hesaplaması kolay, kapalı formda çözülebiliyor. Sorun, bu kolaylığın bir
bedeli olması. Üstel dağılımda standart sapma ortalamaya eşit, yani
varyasyon katsayısı (CV, standart sapmanın ortalamaya oranı) her zaman bir.
Model, talebin ne kadar oynak olduğunu veriden öğrenmiyor; bir olarak kabul
ediyor.

Kaynak metin sınırı açıkça koyuyor: birinci sınıf talebini modellemek için
negatif üstel dağılım, bire eşit olan varyasyon katsayısıyla sınırlı.
Gerçek birinci sınıf talebi ise yüksek varyans gösteriyor, CV birden büyük.
Bu durumda üstel model ortalamayı tutturabilir ama dağılımın kuyruğunu
eksik çizer: talebin kapasiteyi çok aştığı günleri olduğundan seyrek
gösterir, dolayısıyla spill'i olduğundan küçük hesaplar.

![Başlık: Neden Standart Modeller Yetersiz Kalıyor. Sol panel, Standart Model (Negatif Üstel): soldan yüksekten başlayıp düzgünce sıfıra inen gri bir eğri. Altında: First Class talebini modellerken negatif üstel dağılımın katı bir matematiksel sınırı vardır, varyasyon katsayısı (CV) en fazla 1 olabilir. Sağ panel: sert iniş çıkışlar yapan turuncu bir zaman serisi, en yüksek tepe CV büyüktür 1 etiketiyle işaretli. Altında: gerçek dünyada First Class talebi yüksek varyans gösterir (CV büyüktür 1); bu ekstrem dalgalanmayı yakalamak ve ilk iki momenti eşleştirmek için daha gelişmiş, çok aşamalı bir modele ihtiyaç vardır.](/decks/coxian-demand/02.webp "Soldaki eğri tek bir sayıyla, ortalamayla tamamen tanımlı. Sağdaki serinin tepelerini açıklamak için ikinci bir sayı, varyans da modele girmeli.")

Buradaki karar kuralı basit ve veriye dayalı. Talep verisinin CV'si bire
yakınsa standart negatif üstel dağılım yeterli. CV birden büyükse, ilk iki
momenti, yani hem ortalamayı hem varyansı doğru yakalayabilen bir dağılım
gerekiyor. Yazılım tarafında bunun karşılığı şu: dağılım seçimi kodun
içine gömülmüş bir sabit olmamalı. Her pazar, kabin ya da sınıf için CV
ölçülüp model seçimi bu ölçüme bağlanmalı. Ekonomi kabininde işleyen
varsayım, aynı kod yolundan geçen birinci sınıf kabininde sessizce yanlış
sonuç üretir.

## Faz tipi dağılımlar oynaklığı üstel parçalardan kuruyor

Çözüm yeni bir dağılım icat etmek değil, üstel dağılımı yapı taşı olarak
kullanmak. Faz tipi (phase type) dağılımlar, seri ya da paralel bağlanmış
üstel dağılımlı fazların birleşiminden oluşuyor. Kaynak metin bu ailenin
gücünü şöyle tarif ediyor: faz tipi dağılımlar, üstel dağılımlı fazların
evrişimiyle oluşur ve pozitif, sürekli herhangi bir dağılımı yaklaşık
olarak ifade etmek için kullanılabilir.

Fikir yeni de değil. Kökü telefon trafiğine uzanıyor: Erlang 1917'de özdeş
üstel dağılımları seri kullanarak telefon trafiğini modelledi. Yöntem
Neuts'un 1981 ve 1989 çalışmalarıyla kuyruk teorisinde standartlaştı,
sistem darboğazlarını çözmek için. Bugün aynı araç gelir yönetimi
sistemlerinde yüksek varyanslı bilet talebini yaklaşık olarak hesaplamak
için kullanılıyor.

![Başlık: Çözüm, Faz Tipi (Phase Type) Dağılımlar. Oklarla birbirine bağlı üç daire. Birincisi, eski tip bir telefon ve santral: Erlang (1917), ilk olarak telefon trafiğini modellemek için özdeş üstel dağılımların seri kullanımıyla geliştirildi. İkincisi, bir darboğazdan geçen nokta dizileri: Neuts (1981, 1989), sistem darboğazlarını çözmek amacıyla kuyruk (queueing) teorisinde standartlaştı. Üçüncüsü, grafik ızgarası önünde bir uçak kuyruğu: Günümüz, havacılık talebi; üstel dağılımlı fazlar kullanılarak herhangi bir pozitif, sürekli dağılımı (yüksek varyanslı bilet talepleri dahil) yaklaşık olarak hesaplamak için günümüzde RM sistemlerinde kullanılıyor.](/decks/coxian-demand/03.webp "Telefon santrali, kuyruk ve koltuk aynı soruyu soruyor: sınırlı kapasiteye rastgele gelen talebin ne kadarı içeri girer, ne kadarı dışarıda kalır.")

Bu soy ağacı mühendis için tanıdık bir şey söylüyor. Spill problemi
yapısal olarak bir kuyruk problemi: kapasite sınırlı, talep rastgele,
sığmayan kısım kayboluyor. Kuyruk teorisinde olgunlaşmış bir araç
setinin havayolu talebine taşınması tesadüf değil.

## İki aşamalı Cox, tek bir olasılıkla varyansı açıyor

Faz tipi ailenin bu iş için en sade üyesi iki aşamalı Cox (Coxian)
dağılımı. Talep önce birinci aşamadan geçiyor; bu aşama γ1 oranına sahip
bir üstel dağılım. Birinci aşamanın sonunda bir çatal var: talep α
olasılıkla ikinci aşamaya, γ2 oranlı ikinci bir üstel faza geçiyor, 1−α
olasılıkla orada bitiyor.

![Başlık: İki Aşamalı Cox Dağılımının Yapısı. Soldan gelen ok, Aşama 1 (Oran γ1) kutusuna giriyor. Kutudan çıkan turuncu ok, Geçiş İhtimali α etiketiyle Aşama 2 (Oran γ2) kutusuna gidiyor. Aynı noktadan aşağıya inen koyu ok, Çıkış İhtimali (1-α) etiketini taşıyor. Altta açıklama: sistem, γ1 ve γ2 oranlarına sahip iki üstel fazın matematiksel bir karışımıdır; ikinci faza geçiş α olasılığına bağlıdır (burada α küçüktür 1 değeri, geçmiş talep verilerinden kalibre edilir).](/decks/coxian-demand/04.webp "Aşağı inen ok, α'nın neden birden küçük olması gerektiğini gösteriyor: talebin bir kısmı hep birinci aşamada çıkıyor. Varyansı büyüten, ikinci aşamaya giden azınlık.")

Varyansı açan mekanizma bu çatal. Talebin çoğu tek aşamada, kısa ve
öngörülebilir biçimde bitiyor; küçük bir kısmı ikinci aşamaya geçip
dağılıma uzun bir kuyruk ekliyor. Böylece tek bir üstel dağılımın asla
üretemeyeceği bir şekil çıkıyor: çoğu gün sakin, bazı günler aşırı.
Parametreler üç tane (γ1, γ2 ve α) ve bunlar ilk iki momenti tutturacak
biçimde seçilebiliyor. Kaynak metin burada iş mantığını da koyuyor: α
parametresi talep verilerinden kalibre ediliyor ve talebin ilk aşamadan
sonra ikinci bir üstel aşamaya geçip geçmeyeceğini belirliyor.

Matematiksel olarak model tek bir değişkene indirgeniyor: Y = X1 + U·X2.
X1 ve X2 üstel dağılımlı rastgele değişkenler; U ise iki değerli bir
gösterge değişkeni. Geçiş olursa U bir oluyor (olasılığı α), çıkış olursa
sıfır (olasılığı 1−α). Olasılık yoğunluk fonksiyonu da iki üstel terimin
ağırlıklı toplamı: f(x) = A·e^(−γ1·x) + B·e^(−γ2·x). A ve B katsayıları,
bileşenlerin Laplace dönüşümü alınıp zaman alanına geri çevrilerek
hesaplanıyor ve γ1, γ2 ile α'ya bağlı ağırlıklar olarak çıkıyor.

![Başlık: Olasılık Yoğunluk Fonksiyonunun (PDF) Çözümlenmesi. Ortada büyük formül: f(x) eşittir A çarpı e üzeri eksi γ1 x artı B çarpı e üzeri eksi γ2 x. Formülün parçalarına bağlanan açıklamalar. Temel değişken (Y eşittir X1 artı U X2): X1 ve X2 üstel dağılımlı rastgele değişkenlerdir. Gösterge değişkeni (U): iki değerli bir fonksiyondur; geçiş olursa P(U=1) eşittir α, çıkış olursa P(U=0) eşittir 1-α. A ve B katsayıları: bireysel bileşenlerin Laplace dönüşümü alınarak ve zaman alanına geri çevrilerek hesaplanan, γ1, γ2 ve α değerlerine dayalı ağırlıklardır.](/decks/coxian-demand/05.webp "Formül iki üstel terimin toplamından ibaret; bu yüzden kapalı formda kalıyor. Esneklik artarken hesaplanabilirlik kaybolmuyor.")

Mühendislik açısından bu yapının iki avantajı var. Birincisi, yoğunluk
fonksiyonu hâlâ üstel terimlerden oluştuğu için spill hesabında gereken
integraller kapalı formda kalıyor; simülasyona ya da sayısal yaklaşıma
mahkûm değilsin. İkincisi, α sıfıra yaklaştıkça model tek bir üstel
dağılıma, yani CV bir durumuna geri dönüyor. Aynı kod yolu hem sakin
ekonomi talebini hem oynak birinci sınıf talebini taşıyabiliyor; aradaki
fark kalibre edilen parametrelerde. Kalibrasyonun kendisi ise ayrı bir iş:
α ve oranların hangi geçmiş veriyle, hangi sıklıkla güncellendiği modelin
doğruluğunu en az dağılım seçimi kadar belirliyor.

## Gözlemlenen doluluk talebi değil, talebin sığan kısmını gösteriyor

Dağılım seçildikten sonra asıl soru geliyor: bu uçuşta kaç yolcu kaybedildi?
Spill, talebin koltuk kapasitesini aştığı durumda reddedilen, yani
havayolunun kaybettiği yolcu. Sorunun zor yanı, spill'in hiçbir sistemde
kayıt olarak durmaması. Satış sistemine düşen her şey koltuğa oturan
yolcu; kapıdan dönen yolcu veri bırakmıyor.

Bu yüzden iki ayrı doluluk kavramı var. Gözlemlenen doluluk (observed load
factor) gerçekleşen, koltuğa oturan yolcuyu sayıyor. Nominal doluluk ise
reddedilenleri de ekleyerek kapasite sınırı olmasaydı gerçekleşecek
talebi hesaplıyor. Aradaki fark spill. Brifingdeki tabloların hepsi 100
koltukluk bir kabin üzerinden kurulu; orada gözlemlenen yüzde 50 doluluk 50
yolcu demek. Kapanış varsayımı yüzde 100 iken model bu uçuş için 12,76
kayıp yolcu hesaplıyor; nominal talep 62,76 oluyor ve spill oranı, kayıp
yolcunun nominal talebe oranı olarak, brifingdeki yüzde 20,32'ye denk
geliyor.

Tablolar bir şeyi daha gösteriyor: doluluk arttıkça kaybedilen yolcu
doğrusal değil, katlanarak artıyor. Aynı varsayım altında yüzde 15
dolulukta spill 0,02 yolcu, yüzde 30'da 1,28, yüzde 50'de 12,76, yüzde
70'te 61,32. Doluluk iki katına çıkarken kayıp on katına çıkıyor. Bunun
nedeni dağılımın kuyruğu: ortalama talep kapasiteye yaklaştıkça,
talebin kapasiteyi aştığı günler hem sıklaşıyor hem de aşımın büyüklüğü
artıyor. Yüksek varyanslı talepte bu kuyruk daha da kalın.

## Kapanış doluluğu varsayımı sonucu yarı yarıya değiştiriyor

Spill tahmininin en hassas girdisi dağılım değil, sessizce konan bir
varsayım: LFCF, yani satışa kapanan uçuşlardaki doluluk oranı (load factor
on closed flights). Bir uçuş satışa kapandığında gerçekten kaç koltuk
doluydu?

İlk akla gelen cevap yüzde 100: uçuş, koltuklar tükendiği için kapandı.
Ama gerçekte uçuşlar tam dolmadan kapanabiliyor; kapanış anındaki
doluluk kapasitenin altında kalabiliyor. Kaynak metin bu ikinci senaryoyu yüzde 85
ile modelliyor. Modelin mantığı şu: uçak yüzde 85 dolulukla satışa
kapandıysa, talep aslında daha yüksekti ama satış kısıtlar yüzünden erken
bitti. Bu da aynı gözlemlenen doluluk için daha yüksek bir kayıp yolcu ve
daha yüksek bir nominal talep tahmini demek.

![Başlık: Taşma (Spill) Tabloları Karşılaştırması. Alt başlık: 100 koltuklu bir kabinde, kapatılan uçuşlardaki varsayılan doluluk oranının (LFCF) yolcu kaybı tahminine etkisi. Üç satırlık tablo, sütunlar gözlemlenen doluluk, LFCF yüzde 100 varsayımı ve LFCF yüzde 85 varsayımı. Yüzde 30 doluluk: 1.28 kayıp ve 2.33 kayıp. Yüzde 50 doluluk: 12.76 kayıp ve 22.34 kayıp. Yüzde 70 doluluk: 61.32 kayıp ve 141.60 kayıp. Hücreler değer büyüdükçe koyulaşan turuncuya boyanmış. Altta not: LFCF varsayımını yüzde 100'den yüzde 85'e düşürmek, hesaplanan taşan yolcu sayısını yüzde 50 dolulukta neredeyse ikiye, yüzde 70 dolulukta ise iki katından fazlasına çıkarır.](/decks/coxian-demand/06.webp "İki sütun aynı uçuşları, aynı gözlemlenen dolulukla anlatıyor. Farkı veri değil, kapanış anına dair tek bir varsayım yaratıyor.")

Rakamlar varsayımın ağırlığını gösteriyor. Yüzde 50 gözlemlenen dolulukta
kayıp yolcu 12,76'dan 22,34'e çıkıyor; spill oranı yüzde 20,32'den yüzde
30,88'e. Brifingdeki sentez tablosunda artış yüzde 15 dolulukta yüzde 150
(0,02'den 0,05'e), yüzde 30'da yüzde 82, yüzde 50'de yüzde 75, yüzde
70'te yüzde 130. Yüzde 80 satırında ise tablo 135,36'ya karşı 613,50 kayıp
yolcu veriyor, yüzde 353'lük bir artış. 100 koltukluk bir kabinde 613
kayıp yolcu, modelin bu bölgede nominal talebi kapasitenin birkaç katı
olarak okuduğu anlamına geliyor. Bu rakamı bir tahmin olarak değil, bir
uyarı işareti olarak okumak gerekiyor: yüksek dolulukta model, LFCF
varsayımına patlayarak tepki veriyor.

![Başlık: Doluluk Oranına Göre Taşma Eğrisi. Yatay eksen gözlemlenen doluluk oranı (15'ten 80'e), dikey eksen taşma oranı (yüzde 0'dan yüzde 100'e). İki eğri: alt eğri koyu mavi, LFCF yüzde 100; üst eğri turuncu, LFCF yüzde 85. Aradaki alan taralı. İki eğri 15 civarında birlikte başlıyor, 40 noktasına işaret eden bir not var: eğriler yüzde 40 gözlemlenen doluluk oranından sonra keskin bir şekilde ayrışmaya başlar. Sağ üstte not: uçuş kapandığında kapasitenin tam dolu olmadığını varsaymak (yüzde 85 LFCF), çok daha yüksek bir potansiyel talep kaybı (spill) gerçeğini ortaya çıkarır.](/decks/coxian-demand/07.webp "Eğriyi değer okumak için değil, şekli için kullan: düşük dolulukta varsayım önemsiz, yüzde 40'tan sonra sonucu o belirliyor.")

Grafik aynı hikâyeyi şekille anlatıyor. Düşük dolulukta iki eğri üst
üste: uçuş zaten kapanmıyor, kapanış varsayımının etkisi yok. Yüzde 40
civarından sonra eğriler ayrışıyor ve aradaki taralı alan, kararın veriye
değil varsayıma dayandığı bölge. Brifingin analiz notu da bunu söylüyor:
doluluk yüzde 70'i geçtiğinde, LFCF varsayımındaki 15 puanlık farkın kayıp
yolcu üzerindeki etkisi katlanarak artıyor.

## Varsayım kapasite kararına dönüşüyor

Spill hesabı akademik bir egzersiz değil; filo ve tarife kararlarının
girdisi. Brifing bunu uçuş kapanış oranı üzerinden bağlıyor: kapanış oranı
yüzde 90'lara ulaştığında tabloda 966,50 nominal talep ve 871,50 spill
yolcu görülüyor. Bu büyüklükte bir kayıp, mevcut kapasitenin talebi
karşılamakta yetersiz kaldığını söylüyor ve daha büyük uçak tipi atanması
ya da ek sefer planlanması için bir karar sinyali oluyor.

İşin zor yanı burada başlıyor. Aynı uçuş, yüzde 100 LFCF varsayımıyla
"kapasite yeterli, biraz kayıp var" diyen bir rapor, yüzde 85 varsayımıyla
"kapasite ciddi yetersiz" diyen bir rapor üretebiliyor. Hangisinin doğru
olduğu modelin içinde değil, kapanış anının gerçek verisinde. Brifingin
önerdiği iş kuralı tutucu tarafta durmak: gelir kaybını en aza indirmeyi
hedefleyen muhafazakâr bir tahmin için düşük LFCF değerini baz almak.
Ama bu kuralın bedeli de var: düşük LFCF daha yüksek nominal talep
demek, daha yüksek nominal talep de daha büyük uçak ya da ek sefer
talebi demek. Tutucu spill tahmini, kapasite tarafında cömert bir karara
dönüşüyor.

Yazılım tarafında bunun karşılığı açık: LFCF bir konfigürasyon sabiti
olarak değil, ölçülen bir girdi olarak ele alınmalı. Satışa kapanan
uçuşlarda kapanış anındaki gerçek doluluk bir ölçüm olarak toplanıp
spill modeline elle girilen yüzde 100 yerine bu ölçüm beslenmeli. Model
çıktısı raporlanırken de hangi LFCF varsayımıyla üretildiği yanında
taşınmalı. Aynı gözlemlenen dolulukla iki kat farklı kayıp yolcu üreten
bir parametre, rapor başlığında görünmüyorsa karar verenden gizlenmiş
demektir.

![Başlık: Temel Çıkarımlar ve Ticari Etki. Üç sütun. Sınırları Aşmak (dağınık noktalar ve bir regresyon çizgisi simgesi): First Class talebi ekstrem dalgalanmalara sahiptir (CV büyüktür 1); basit üstel modeller bu varyansı yakalayamaz ve gerçek talebi ölçemez. İki Aşamalı Doğruluk (iki düğüm arasında iç içe elmaslar simgesi): Coxian dağılımı (γ1, γ2 ve α geçişleri ile), bu dengesiz talebi modellemek için gereken esnekliği ve matematiksel kesinliği sağlar. Gerçekçi Varsayımlar (içinde yükselen bir çubuk grafik olan kalkan simgesi): kapanış oranlarının uçak tamamen dolmadan (örneğin yüzde 85 LFCF) gerçekleştiğini bilmek, reddedilen talepleri (spill) doğru hesaplamanın ve gelir sızıntısını önlemenin anahtarıdır.](/decks/coxian-demand/08.webp "Üç sütun iki ayrı hata kaynağını ayırıyor: yanlış dağılım ve yanlış kapanış varsayımı. İkincisi daha sinsi, çünkü modelin dışında duruyor.")

## Yarın işe yarayacak dört çıkarım

1. **Dağılımı CV'ye göre seç.** Her kabin ve pazar için talebin varyasyon
   katsayısını ölç. CV bire yakınsa negatif üstel dağılım yeterli; birden
   büyükse ilk iki momenti eşleştiren iki aşamalı Cox dağılımına geç.
   Seçimi kodun içine gömme, ölçüme bağla.
2. **α'yı geçmiş veriyle kalibre et ve güncel tut.** İkinci aşamaya geçiş
   olasılığı talebin kuyruğunu belirliyor. Bir kez ayarlanıp bırakılan α,
   bugünün oynaklığını değil kalibre edildiği dönemin oynaklığını taşır.
3. **LFCF'yi varsayma, ölç.** Satışa kapanan uçuşların kapanış anındaki
   gerçek doluluğunu spill modeline besle. Ölçemiyorsan birden fazla LFCF
   senaryosunu yan yana çalıştır ve hangi varsayımla çalıştığını çıktıda
   göster; yüzde 50 dolulukta bile iki varsayım arasındaki fark yüzde 75.
4. **Yüksek dolulukta spill çıktısını kapasite sinyali olarak oku, ama
   hassasiyetini de oku.** Kapanış oranı ve spill birlikte yükseliyorsa
   büyük uçak ya da ek sefer seçeneğini masaya koy. Yüzde 70'in üzerinde
   model LFCF varsayımına patlayarak tepki verdiği için, tek bir
   senaryonun rakamıyla filo kararı verme.

Bu bölümde ne yok: taşan talebin gelir yönetimi optimizasyonuna nasıl
girdiği ve kısıtlanmış talebin geri kazanılması (spill bölümleri), taşan
yolcunun bir kısmının aynı havayolunun başka uçuşuna geçmesi (recapture)
ve ücret sınıfları arasındaki kaymalar. Kapasite kararının planlama
döngüsündeki yeri "Havayolu pazarlama planlama süreci ve iş mantığı
analizi" bölümünde. Bu bölüm yalnızca iki şeyi netleştirmek için var:
oynak talebin hangi dağılımla modelleneceği ve spill rakamının hangi
varsayımın ürünü olduğu.
