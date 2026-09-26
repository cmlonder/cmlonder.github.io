---
title: "Beklenen kapasite aşımı (expected spill) ve Boeing modeli analizi"
domain: "aviation"
summary: "Uçak dolduğunda satış kapanıyor ve kapıdan dönen yolcu hiçbir sisteme kaydedilmiyor. Boeing spill modeli bu görünmeyen kaybı ortalama talep, standart sapma ve kapasiteyle tahmin ediyor. Bu bölüm modelin mantığını, talep değişkenliğinin aynı dolulukta kaybı nasıl ikiye katladığını ve overbooking düzeltmesinin tabloları neden yukarı çektiğini anlatıyor."
audience: "Gelir yönetimi, envanter, kapasite ya da filo atama sistemleriyle çalışan ve bu sistemlerin görmediği talebi nasıl tahmin ettiğini anlamak isteyen yazılımcı ve ürün insanı. Temel olasılık bilgisi yeterli; spill, kısıtlanmamış talep, değişkenlik katsayısı (CV), nominal ve gözlemlenen yük faktörü, LFCF ve logit yaklaşımı metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Bir uçuş satışa kapandığında envanter sistemi son koltuğun kime satıldığını
biliyor. Ondan sonra bilet almak isteyen yolcuyu ise hiç görmüyor: talep
vardı ama kaydı yok. Havacılıkta bu kayba spill (taşma) deniyor; yolcu
talebi uçak kapasitesini aştığında uçağa kabul edilemeyen ve kaybedilen
potansiyel yolcular. **Spill ölçülemez, yalnızca tahmin edilir; ve aynı
doluluk oranı arkasında birbirinden üç kattan fazla farklı kayıplar saklanabilir.**
Boeing spill modeli bu tahmini yapmanın endüstride yaygın kabul görmüş
yolu. Bu bölüm modelin ne varsaydığını, hangi parametrenin sonucu ne kadar
oynattığını ve bir sistemin bu sayıyla ne yapması gerektiğini anlatıyor.

![Sunumun kapak slaytı. Başlık: Beklenen Taşma (Expected Spill). Alt başlık: Havayolu Talebini ve Kapasite Sınırlarını İstatistiksel Olarak Modellemek. Koyu zemin üzerinde saydam çizilmiş bir yolcu uçağı; soldan gelen turuncu bir talep akışı dalga halinde yükseliyor, uçağın ortasından geçen mavi dikey Kapasite Sınırı çizgisini aşan kısım parçacıklar halinde dağılıyor ve Taşma olarak işaretli. Sağda Uzman Notu, Havacılık Domaini kutusu: süreç, gelir yönetimi ve envanter kontrolü; ilgili akışlar, offer management ve order management; içgörü, havayolları uçak boyutuna karar verirken veya fiyatlandırma yaparken uçuş kapandıktan sonra bilet alabilecek potansiyel talebi tam olarak göremez, ölçülemeyen bu kayba taşma (spill) denir, tüm taşma modelleri temelinde bir yield (birim gelir) maksimizasyonu oyunudur.](/decks/expected-spill-boeing/01.webp "Dalganın kapasite çizgisini aşan kısmı dağılıyor ve bir daha görünmüyor. Bölümün bütün meselesi o parçacıkları geri saymak.")

## Kapanmış bir uçuş talebi değil, kendi kapasitesini ölçüyor

Envanter tarafında olan şey basit. Altea veya Sabre gibi bir envanter
sisteminde kapasite dolduğunda uçuşun durumu kapalıya dönüyor; PSS
üzerinden GDS'e giden uygunluk (AVS, availability status) mesajları sıfır
dönüyor ve sistem o andan itibaren talebe karşı kör. Satış verisi ne kadar
ayrıntılı olursa olsun, kapasitenin üstündeki talebi içermiyor. Bu yüzden
gelir yönetiminde kısıtlanmamış talep (unconstrained demand) ayrı bir
kavram: kapasite sınırı olmasaydı gelecek yolcu sayısı.

Yazılım tarafında bunun karşılığı tanıdık bir istatistik problemi:
sansürlenmiş veri. Dolu kapanan her uçuşun satış kaydı gerçek talebin
alt sınırı, kendisi değil. Bu veriyle doğrudan eğitilen bir talep tahmini,
dolu uçuşların talebini sistematik olarak düşük görüyor ve bir sonraki
dönemde o uçuşa daha az kapasite önerecek kadar yanılıyor. Spill modeli bu
döngüyü kırmanın aracı.

Matematiksel tanım koşullu beklenti üzerine kurulu. Talep D rastgele bir
değişken, kapasite c sabit. Beklenen spill, talebin kapasiteyi aştığı
durumlarda aşan talebin ortalamasından kapasitenin çıkarılması ve bunun o
durumun gerçekleşme olasılığıyla çarpılması. Yani iki soru birden
soruluyor: talep kapasiteyi ne sıklıkla aşıyor ve aştığında ne kadar
aşıyor.

![Başlık: Talep Kapasiteyi Aştığında Ne Olur? Sol panel, Olay: mavi koltuk simgelerinden oluşan dört sütun beş satırlık bir blok, kesikli bir çizgiyle ayrılmış, çizginin öte tarafında bir uyarı işareti ve altı turuncu yolcu figürü; altta D büyüktür c, talep kapasiteyi aşar. Sağ panel, Matematik: E(D | D büyüktür c) ifadesi; D'den çıkan ok rastgele değişken (uçuş talebi), sol alttaki ok beklenen taşma (expected spill), sağ alttaki ok fiziksel uçak kapasitesi olarak etiketli; altta koşullu beklenti hesabı, uçağa binemeyen (taşan) yolcuların istatistiksel ortalaması. Alt bant, sistem içgörüsü: kısıtlanmamış talep; Altea veya Sabre gibi envanter sistemlerinde kapasite dolduğunda uçuş durumu kapalı olur, PSS üzerinden GDS'e giden AVS mesajları sıfır döner ve sistem talebe karşı körleşir.](/decks/expected-spill-boeing/02.webp "Alt banttaki cümle modelin gerekçesi: AVS sıfıra düştüğü an talep verisi de kesiliyor, geri kalanı tahmin.")

## Model dört sayıyla çalışıyor ve bir tanesi her şeyi taşıyor

Boeing spill modeli talebi normal dağılımla temsil ediyor ve dört
parametreye indiriyor. Kapasite (c) mevcut koltuk sayısı. Ortalama talep
(μ) beklenen yolcu sayısı. Standart sapma (σ) talebin ne kadar geniş
dağıldığı. Dördüncüsü bunların birleşimi: k = (c − μ) / σ, yani kapasitenin
ortalama talepten kaç standart sapma uzakta olduğu. k büyükse uçak
talebe göre geniş, spill ihtimali düşük; k sıfıra ya da negatife yaklaştıkça
dağılımın kuyruğu kapasite çizgisini geçiyor ve taşan yolcu artıyor.

Modelin çıktısı beklenen trafik: toplam ortalama talepten beklenen spill
çıkarıldığında kalan, yani gerçekte uçağa binecek yolcu sayısı.
E[Trafik] = μ − E[Spill]. Bir sistem bu formülü iki yönde kullanabiliyor.
İleri yönde, tahmin edilen talep ve seçilen uçak tipiyle kaç yolcu
taşınacağını hesaplıyor. Geri yönde, gözlemlenen trafikten kısıtlanmamış
talebi geri kuruyor.

![Başlık: Boeing Taşma Modeli, Talebi Standartlaştırmak. Alt başlık: ilk olarak overbooking bağlamında Shlifer ve Vardi (1975) tarafından türetilmiş, Boeing tarafından standartlaştırılmıştır. Solda dört numaralı kutu: 1, μ (Mu), beklenen trafik (ortalama talep); 2, σ (Sigma), standart sapma; 3, c, uçak kapasitesi; 4, k eşittir c eksi μ bölü σ, kapasitenin standart sapma cinsinden ifadesi. Ortada bir normal dağılım eğrisi; sağ tarafta kesikli dikey çizgi c (Kapasite), çizginin sağında kalan turuncu boyalı kuyruk Taşan Yolcular (Spill). Altta anahtar formül: Beklenen Trafik eşittir μ eksi E(Spill). Sağda Mühendislik ve Filo Notları: filo atama, Boeing bu tabloları havayollarına hangi rotaya daha büyük (geniş gövdeli) uçak atanması gerektiğini matematiksel olarak kanıtlamak için sundu; pratik sınır, normal dağılım endüstri standardı olsa da özellikle aşırı talep sıçramaları olan tatil (leisure) rotalarında gerçek talep genellikle Gamma dağılımı izler.](/decks/expected-spill-boeing/03.webp "Turuncu kuyruğun alanı k ile belirleniyor: aynı kapasite, σ büyüdükçe ortalamaya yaklaşıyor ve kuyruk kalınlaşıyor.")

Modelin kökeni de ne için kullanıldığını açıklıyor. Kaynak metin normal
spill modelinin ilk türetilişini Shlifer ve Vardi'ye (1975) atfediyor ve
bunun overbooking bağlamında yapıldığını not ediyor. Boeing ise tabloları
standartlaştırdı ve kaynak metnin ifadesiyle Boeing spill tabloları
endüstride yaygın olarak kullanılıyor. Slaytın mühendislik notu Boeing'in
motivasyonunu da söylüyor: hangi rotaya daha büyük, geniş gövdeli uçak
atanması gerektiğini havayollarına matematiksel olarak göstermek. Yani bu
tablolar filo atamanın gerekçe belgesi olarak doğdu.

Aynı slayt modelin pratik sınırını da işaretliyor: normal dağılım
endüstri standardı olsa da, aşırı talep sıçramaları olan tatil rotalarında
gerçek talep genellikle Gamma dağılımına daha yakın. Bir sistem için bunun
anlamı, dağılım varsayımının bir yapılandırma parametresi olması gerektiği;
koda gömülü bir sabit değil.

## Aynı dolulukta kayıp, talebin ne kadar oynadığına bağlı

Modelin en az sezgisel sonucu değişkenlik katsayısında çıkıyor.
Değişkenlik katsayısı (CV, coefficient of variation) standart sapmanın
ortalamaya oranı; talebin ortalamasına göre ne kadar dalgalandığını
söylüyor. Slaytın ticari çerçevesi net: iş amaçlı rotalarda her hafta
benzer sayıda yolcu uçtuğu için CV düşük, tatil rotalarında yüksek.

Kaynak tablolar 100 koltukluk bir uçak ve gözlemlenen yüzde 80 doluluk
için şunu gösteriyor. CV 0,30 iken nominal talep 84,03 yolcu, spill 4,03
yolcu, spill oranı yüzde 4,79. CV 0,40 olduğunda aynı yüzde 80 dolulukta
nominal talep 89,81'e, spill 9,81 yolcuya, spill oranı yüzde 10,92'ye
çıkıyor. Doluluk raporunda iki uçuş aynı görünüyor; kaybedilen yolcu iki
katından fazla.

Fark doluluk arttıkça açılıyor. Brifingdeki örnekte yüzde 90 yük
faktöründe spill CV 0,30 için 15,71 iken CV 0,40'ta 34,38. Oynak rotada
uçağı yüzde 90 dolduran havayolu, sakin rotadakinin iki katından fazla
yolcuyu kapıdan çeviriyor ve bunu doluluk raporundan göremiyor.

![Başlık: Talep Dalgalanmasının (Volatility) Yıkıcı Etkisi. Üst bilgi: kapasite 100 koltuk; varsayım, uçuşlar yüzde 100 dolulukla kapanır (LFCF eşittir 1,0). Grafik: yatay eksen gözlemlenen doluluk oranı (observed load factor), yüzde 55'ten yüzde 95'e; dikey eksen taşan yolcu sayısı, 0'dan 15'e. Mavi eğri düşük dalgalanma (CV eşittir 0,30), turuncu eğri yüksek dalgalanma (CV eşittir 0,40); iki eğri de yüzde 55 civarında sıfırdan başlıyor, turuncu eğri çok daha dik yükseliyor ve arası turuncu boyalı. Yüzde 80'de kesikli dikey çizgi; turuncu eğride 9,81 taşan yolcu, mavi eğride 4,03 taşan yolcu etiketi. Sağda Ana İçgörü: talep öngörülemezliği (CV) arttıkça taşma çok daha düşük doluluk oranlarında başlar, yüzde 80 dolulukta bile yüksek oynaklık kaybı iki katından fazlaya çıkarır. Alt bant, CV nedir: iş amaçlı rotalar düşük CV'ye sahiptir (her hafta benzer sayıda yolcu), tatil rotalarında CV yüksektir; yüksek CV'li rotalarda taşma geliri çok daha erken yok ettiği için bu uçuşlarda kapasite atanırken veya koruma koltukları ayarlanırken çok daha esnek davranılmalıdır.](/decks/expected-spill-boeing/04.webp "İki eğri arasındaki turuncu alan, doluluk raporunun göstermediği kayıp. Yüzde 80 çizgisinde bile genişliği iki katı aşıyor.")

Buradan çıkan iş kuralı, tek bir doluluk hedefinin bütün ağa uygulanmaması.
Yüksek CV'li rotalarda nominal yük faktörü hedefi spill kaybını azaltmak
için daha esnek tutulmalı; slaytın ifadesiyle kapasite atanırken ya da
koruma koltukları ayarlanırken bu uçuşlarda daha esnek davranılmalı. Bir
kapasite ya da RM sisteminde bunun karşılığı, doluluk hedefinin rota
düzeyinde tutulan ve CV ile birlikte okunan bir değer olması. Hedefi
filo ortalamasından alan bir kural, sakin rotada fazla kapasite, oynak
rotada fazla spill üretiyor.

## Gözlemlenen doluluk bir tavan, nominal doluluk bir iddia

Tablolardaki iki kolon karıştırılmaya çok müsait. Gözlemlenen yük faktörü
uçakta fiilen oturan yolcunun kapasiteye oranı. Nominal yük faktörü ise
sınırsız talep varsayımı altındaki potansiyel, yani ortalama talebin
kapasiteye oranı. CV 0,30 örneğinde gözlemlenen yüzde 80, nominal yüzde
84,03; aradaki 4,03 puan tam olarak spill. Formül burada kendini
doğruluyor: 84,03 − 4,03 = 80.

Sistemin bu farkı yorumlama kuralı da buradan geliyor. Nominal değer
gözlemlenenden büyükse, aradaki fark kapasite kısıtı yüzünden reddedilen
yolcu potansiyeli olarak okunmalı; talep eksikliği olarak değil. Mühendislik
açısından bu, raporlama katmanında iki ayrı alan demek. Dashboard'da
yalnızca gözlemlenen doluluğu gösteren bir sistem, en çok yolcu kaybeden
uçuşları en başarılı uçuşlar gibi sunuyor.

## Uçuşlar yüzde 100'de kapanmıyor, tablolar da buna göre kaymalı

Yukarıdaki rakamların hepsi bir varsayıma dayanıyor: uçuş tam yüzde 100
dolulukla satışa kapanıyor. Bu varsayımın adı LFCF (load factor on closed
flights), kapanmış uçuşlardaki yük faktörü. Kaynak tablolar LFCF'nin yüzde
96'ya çekildiği ikinci bir set veriyor. Slayt nedenini operasyon
diliyle anlatıyor: havayolları bağlantı uçuşunu kaçıranları, son dakika
grup iptallerini ya da kargo ağırlık kısıtlarını (weight and balance)
biliyor; iptaller, no-show ve operasyonel kısıtlar yüzünden satışa kapanan
uçuş fiziksel olarak tam dolu uçmuyor.

Etki büyük. CV 0,30 ve yüzde 80 gözlemlenen dolulukta spill, LFCF yüzde
100 iken 4,03 yolcu, yüzde 96 iken 6,10 yolcu; spill oranı yüzde 4,79'dan
yüzde 7,09'a çıkıyor. CV 0,40'ta aynı düzeltme spill'i 9,81'den 14,05'e,
oranı yüzde 10,92'den yüzde 14,94'e taşıyor. Brifingin özetlediği gibi
aynı yüzde 80 dolulukta, CV ve LFCF değiştikçe kaybedilen yolcu 4'ten 14'e
kadar yükselebiliyor.

![Başlık: Çifte Rezervasyon (Overbooking) Düzeltmesi. Sol panel, Teorik Model: mavi bir gösterge yüzde 100'ü gösteriyor; LFCF eşittir 1,0; uçağın fiziksel olarak tamamen dolduğu varsayımı; matematiksel olarak kusursuz, operasyonel olarak imkansız senaryo; altta taşma oranı (yüzde 80 doluluk, CV 0,30), 4,03 yolcu. Orta panel, Operasyonel Gerçeklik (Overbooking): turuncu bir gösterge yüzde 96'yı gösteriyor; LFCF eşittir 0,96; gerçek dünyada uçuşların yüzde 96 dolulukta satışa kapanması; iptaller ve operasyonel kısıtlamaları içeren düzeltilmiş Boeing tablosu; altta taşma oranı (yüzde 80 doluluk, CV 0,30), 6,10 yolcu. İki panelin altından geçen ok, sonuç: uçağın kapanma anındaki doluluk oranının yüzde 96 olacağı gerçeği erken kapasite dolumuna yol açar ve taşan yolcu sayısını dramatik şekilde artırır. Sağda Gizli Operasyonel Bilgi: terimler, no-show, denied boarding, LFCF (load factor on closed flights); neden yüzde 96, havayolları bağlantı uçuşunu kaçıranları, son dakika grup iptallerini veya kargo ağırlık kısıtlamalarını (weight and balance) bilir, envanter yönetimi sistemdeki bu yüzde 4'lük operasyonel sızıntıyı karşılamak için baz taşma tablolarını yukarı yönlü revize etmek zorundadır.](/decks/expected-spill-boeing/05.webp "Soldaki gösterge hiç yaşanmayan bir kapanışı modelliyor. Aradaki dört puanlık fark, spill'i yüzde elliden fazla büyütmeye yetiyor.")

Mantık şu: uçuş yüzde 96'da satışa kapanıyorsa, satış daha erken
duruyor ve talebin daha büyük kısmı kapıda kalıyor. Aynı gözlemlenen
doluluk, daha fazla spill anlamına geliyor. İş kuralı olarak sistem
LFCF yüzde 96 iken daha ihtiyatlı bir kapasite yönetimi varsaymalı.
Spill uyarısı ya da satış kapatma kararı da yalnızca fiziksel kapasiteye
değil, kapanış yük faktörüyle düzeltilmiş kapasite sınırına göre
tetiklenmeli: gözlemlenen talep bu düzeltilmiş sınıra yaklaşıyorsa sistem
uyarı vermeli ya da satışı kapatmalı.

Yazılım tarafında LFCF'nin yeri bir parametre tablosu. Model her
çağrıldığında aynı yüzde 100 varsayımıyla çalışıyorsa, overbooking
modülüyle spill modülü aynı uçuş için birbiriyle çelişen iki gerçeklik
tutuyor demek. Bu bölümün en pratik bulgusu bu çelişkinin maliyetinin
sayılabilir olması: 4,03 ile 6,10 arasındaki fark.

## Hesabın maliyeti, modelin kendisi kadar belirleyici

Normal dağılımın bir sorunu var: kümülatif dağılım fonksiyonunun kapalı
bir formu yok, bir integral. Büyük ölçekli bir rezervasyon sisteminde bu
hesabın her uçuş ve her sınıf için tekrar tekrar yapılması gerekiyor.
Kaynak metin burada bir alternatife işaret ediyor: Swan (1983) normal
dağılıma bir logit yaklaşımı önerdi ve bu yaklaşımda beklenen spill'in daha
basit bir temsili var.

Yaklaşım normal dağılımın kümülatifini 1 / (1 + e^(−1,702k)) biçiminde
tek bir üstel ifadeyle değiştiriyor. Brifinge göre sonuçları normal
dağılıma çok yakın, hesap ise çok daha ucuz. Slayt bu farkı tarihsel
bağlama oturtuyor: 1980'ler ve 90'ların TPF mainframe sistemleri düşük
işlem gücüne sahipti ve binlerce uçuş sınıfı için integral çözmek
donanımı kilitliyordu. Slayt, karmaşık eğri hesaplarını basit üstel
denklemlere çevirmenin ağ geneli optimizasyon süresini saatlerden
milisaniyelere indirdiğini ve PROS ya da Amadeus Altéa gibi modern RM
motorlarında bile bu deterministik arama tablosu ve logit izlerinin
sürdüğünü söylüyor.

![Başlık: Sistemler İçin Matematiksel Optimizasyon. Alt başlık: Swan (1983) normal dağılıma alternatif logit yaklaşımı. Sol kutu, Problem, Yüksek CPU Maliyeti: Φ(z) eşittir sıfırdan başlayan f(x)dx integrali; normal dağılım integralleri büyük ölçekli rezervasyon sistemlerinde saniyede binlerce kez hesaplanırken aşırı işlemci maliyeti yaratır. Ortada Optimizasyon Motoru dairesi, altında The Catalyst, işlemsel dönüşüm. Sağ kutu, Çözüm, Logit Yaklaşımı (Etkinlik): Φ(z) yaklaşık eşittir 1 bölü 1 artı e üzeri eksi 1,702k; beklenen taşma değerini çok daha basit bir fonksiyonel yapıyla temsil eden logit yaklaşımı. Alt sol bant, sistem avantajı, performans kazanımı: karmaşık eğri hesaplamalarını basit eksponansiyel denklemlere dönüştürerek ağ geneli optimizasyon sürelerini saatlerden milisaniyelere indirir. Alt sağ kutu, sistem mimarisi notları: teknoloji, 1980/90'ların TPF (mainframe) sistemleri düşük işlem gücüne sahipti, binlerce uçuş sınıfı için integral çözmek donanımı kilitliyordu; modern miras, PROS veya Amadeus Altéa gibi modern revenue management motorları bile fiyatlandırma motorlarını hızlı tutmak için temel mantıkta bu deterministik lookup table ve logit yaklaşımlarının izlerini taşır.](/decks/expected-spill-boeing/06.webp "Sağdaki formül tek bir üstel çağrı. Soldaki integral her uçuş sınıfı için ayrı ayrı çözülmesi gereken bir iş.")

Buradaki mühendislik dersi, model seçiminin yalnızca doğruluk sorusu
olmaması. Bir yaklaşımın hatası küçükse ve çağrı sayısı büyükse, ucuz
yaklaşım doğru seçim. Ama bu karar bir kez verilip unutulmamalı: logit ile
normal arasındaki farkın hangi k aralığında kabul edilebilir kaldığı,
yaklaşımı kullanan sistemin test setinde duran bir şey olmalı. Aksi halde
bir sonraki ekip, yaklaşımın neden orada olduğunu bilmeden onu gerçek model
sanıyor.

## Spill tek başına bir hedef değil, spoilage ile bir denge

Spill modelinin var olma nedeni bir ikilem. Slaytın ifadesiyle sınıfları
çok erken kapatırsan yolcu reddediyorsun, bu spill; çok geç kapatırsan
uçak boş koltukla uçuyor, bu spoilage. Spill modeli bu terazinin bir
kefesini ölçülebilir hale getiriyor. Tek başına minimize edilecek bir
metrik değil: sıfır spill, büyük olasılıkla fazla kapasite ve boş koltuk
demek.

Slayt aynı yerde modelin sınırını da çiziyor: modelleme veriyi sağlıyor,
ama weight and balance sınırları, overbooking limitleri ve GDS polling
oranları gibi operasyonel kısıtlar nihai gerçekliği belirliyor. Hedef
de açıkça yazılı: arz edilen koltuk mili (available seat mile) başına
birim geliri maksimize etmek. Kapak slaytındaki uzman notu aynı şeyi
söylüyordu; bütün spill modelleri temelde bir yield maksimizasyonu oyunu.

![Başlık: Büyük Resim, Taşmayı Neden Modelliyoruz? Üstte bir uçak simgesinden üç kutuya inen oklar. Birinci kutu, Talep Sınırı: gerçek talebi görmek, bilet satışları bittiğinde dışarıda kalan kısıtlanmamış talebi (unconstrained demand) ölçmek doğru filo ataması ve fiyatlandırma sınıfları için şarttır. İkinci kutu, Değişkenlik: dalgalanmayı yönetmek, uçuş rotasındaki oynaklık (CV) arttıkça kapasite daha erken dolar ve gelir kaybı (spill) tahmin edilenden çok daha hızlı ivmelenir. Üçüncü kutu, Operasyonel Gerçeklik, yüzde 96 gösteren bir gösterge simgesiyle: pratik uygulama, LFCF'yi yüzde 96 olarak modellemek ve logit yaklaşımları kullanmak teorik matematiği sistemlerin ve havalimanlarının operasyonel kısıtlamalarıyla uyumlu hale getirir. Alt bant, Gelir Yönetimi Analisti'nin İkilemi: spill ve spoilage, sınıfları çok erken kapatırsanız yolcu reddedersiniz (spill), çok geç kapatırsanız uçak boş uçar (spoilage); mühendislik perspektifi, modelleme veriyi sağlar ancak weight and balance sınırları, overbooking limitleri ve GDS polling oranları gibi operasyonel kısıtlamalar nihai gerçekliği belirler, nihai amaç available seat mile (YAM) başına birim geliri maksimize etmektir.](/decks/expected-spill-boeing/07.webp "Üç kutu bu bölümün üç bölümüne karşılık geliyor: görünmeyen talep, değişkenlik ve kapanış düzeltmesi. Alt bant ise hangisinin tek başına hedef olmadığını hatırlatıyor.")

Pazarlama planlama bölümünde anlatılan son dakika uçak değişimi bu
modelin en doğrudan kullanıcısı. Talep tahmini planlanan kapasiteden
saptığında uçak tipini değiştirme kararı, iki uçak tipi için ayrı ayrı
hesaplanmış beklenen trafik ve beklenen spill olmadan verilemiyor. Boeing'in
tabloları ilk olarak tam bu soruya, hangi rotaya hangi büyüklükte uçak
konacağına cevap vermek için hazırlanmıştı.

## Yarın işe yarayacak beş çıkarım

1. **Satış verisini talep sanma.** Dolu kapanan uçuşun satış kaydı talebin
   alt sınırı. Talep tahminini bu veriyle beslemeden önce spill tahminiyle
   kısıtlanmamış talebe geri çevir; beklenen trafik ile ortalama talep
   arasındaki ilişki (E[Trafik] = μ − E[Spill]) bunun için var.
2. **Doluluk hedefini rota düzeyinde ve CV ile birlikte tut.** Yüzde 80
   gözlemlenen dolulukta spill, CV 0,30 için 4,03, CV 0,40 için 9,81 yolcu.
   Oynak rotalarda nominal yük faktörü hedefini daha esnek bırak; tek bir
   ağ geneli hedef, iki tür rotayı da yanlış yönetir.
3. **Gözlemlenen ve nominal doluluğu ayrı raporla.** Aradaki fark
   reddedilen yolcu potansiyeli. Yalnızca gözlemlenen doluluğu gösteren
   bir rapor, en çok kaybeden uçuşu en başarılısı gibi gösterir.
4. **LFCF'yi yüzde 100 bırakma.** Uçuşlar iptal, no-show ve operasyonel
   kısıtlar yüzünden tam dolu kapanmıyor. Kapanış yük faktörünü yüzde 96
   gibi gerçekçi bir değerle modelle, spill uyarısını ve satış kapatmayı
   bu düzeltilmiş sınıra göre tetikle.
5. **Hesap maliyeti yüksekse logit yaklaşımını kullan, sınırını test et.**
   Swan'ın (1983) yaklaşımı normal dağılım integralini tek bir üstel
   ifadeye indiriyor. Kullandığın k aralığında normal modelle farkını
   ölçen bir testi yaklaşımın yanında tut; dağılım varsayımını da (normal,
   Gamma) kod sabiti değil parametre yap.

Bu bölümde ne yok: kapanmış sınıfların talebini tarihsel veriden geri
kuran detruncation yöntemleri, overbooking seviyesinin kendisinin nasıl
seçildiği ve spill tahmininin tam bir filo atama optimizasyonuna nasıl
girdiği. Envanteri yolcu miksine göre açıp kapatan mekanizma gelir yönetimi
bölümlerinde, son üç aydaki uçak değişimi kararının planlama döngüsündeki
yeri "Havayolu pazarlama planlama süreci ve iş mantığı analizi" bölümünde.
