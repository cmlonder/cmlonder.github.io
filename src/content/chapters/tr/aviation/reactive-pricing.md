---
title: "Reaktif fiyatlandırma süreci ve stratejik karar mekanizmaları"
domain: "aviation"
summary: "Havayolu fiyat aksiyonlarının çoğu kendi planından değil, bir rakibin hamlesinden doğuyor. Bu bölüm o hamleye verilen yanıtı beş aşamalı bir döngü olarak anlatıyor: tespit, etki değerlendirmesi, yanıt kararı, dağıtım ve performans izleme; eşitlememenin ne zaman doğru karar olduğunu ve başarının neden rakibin davranışıyla ölçüldüğünü de."
audience: "Ücret izleme, fiyat yayınlama ya da gelir yönetimi sistemleri üzerinde çalışan, rakip fiyat değişikliğine verilen yanıtın arkasındaki iş mantığını anlamak isteyen yazılımcı ve ürün insanı. Pazarlama planlama bölümünün okunmuş olması işe yarar; fare matching, gelir seyrelmesi (dilution) ve fiyat dağıtım penceresi metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Pazarlama planlama bölümünde fiyatlandırma, rakiplere ve pazar koşullarına
bakarak ücret dosyalayan bir fonksiyon olarak geçmişti. O cümledeki
"rakiplere bakarak" kısmı sanıldığından büyük. Kaynak metin bunu açıkça
söylüyor: fiyat aksiyonlarının çoğu reaktif ve bir rakibin fiyatlandırma
girişimine dayanıyor. **Reaktif fiyatlandırma bir refleks değil, hızla
tamamlanması gereken beş aşamalı bir karar süreci; ve bu sürecin
çıktılarından biri, bilerek hiçbir şey yapmamak.** Havayolunun rakip
hamlesine verdiği yanıt, kendi fiyat stratejisinin görünen yüzü; çoğu
zaman da tek görünen yüzü.

![Sunumun kapak slaytı. Arka planda enlem ve boylam çizgileri işaretli açık renkli bir dünya haritası, kıtalar arasında ince uçuş hatları. Ortadaki beyaz kutuda başlık: Reaktif Fiyatlandırma Süreci. Alt başlık: Havacılıkta Rekabetçi Fiyat Aksiyonları ve Yanıt Stratejileri.](/decks/reactive-pricing/01.webp "Haritadaki her hat bir pazar ve her pazarda başka bir rakip fiyat değiştiriyor. Reaktif fiyatlandırma bu hamlelerin hepsine aynı anda bakabilmekle başlıyor.")

## Başarıyı rakip ölçüyor, havayolu değil

Sürecin neden var olduğu iki taraflı bir hesapla açıklanıyor. Bir tarafta
riske edilen şey duruyor: rakibin fiyat hamlesine yanıtsız kalmak gelir
kaybına ve pazar payının erimesine yol açıyor. Öbür tarafta başarı
kriteri: hızlı analiz ve zamanında yanıt. Buraya kadar beklenen bir tablo.

Tanımın ilginç kısmı başarının nerede ölçüldüğü. Kaynak metne göre başarı,
rakiplerin fiyat değişikliğini kabul etmesi ve kendi fiyatlarını yeni fiyat
girişimine uyacak şekilde belirlemesi. Yani bir fiyat aksiyonunun iyi olup
olmadığını yalnızca havayolunun kendi gelir tablosu söylemiyor; pazarın,
özellikle de rakiplerin o yeni seviyeyi standart olarak benimseyip
benimsemediği söylüyor. Fiyat burada tek taraflı bir karar değil, pazarla
yapılan bir müzakerenin bir hamlesi.

![Başlık: Stratejik Önem. Ortada bir terazi, iki yanında iki kart. Sol kart, turuncu şeritli, aşağı inen bir grafik ikonu: Riske Edilenler, rakiplerin fiyat hamlelerine yanıtsız kalmak gelir kaybına ve pazar payı erimesine yol açar. Sağ kart, mavi şeritli, hedef tahtası içinde kilit ikonu: Başarı Kriteri, hızlı analiz ve zamanında yanıt; gerçek başarı, rakiplerin sizin fiyat değişikliğinizi kabul edip kendi fiyatlarını buna göre eşitlemesidir.](/decks/reactive-pricing/02.webp "Sağ karttaki ikinci cümle tanımın ağırlık merkezi: başarının ölçüsü havayolunun dışında, rakibin bir sonraki hamlesinde duruyor.")

Bunun yazılım tarafındaki karşılığı şu: bir fiyat aksiyonunun sonucunu
ölçen sistem yalnızca kendi rezervasyon ve gelir verisine bakıyorsa işin
yarısını görüyor. Aksiyondan sonra rakip ücretlerinin nereye gittiği de
aynı ölçümün parçası. Tespit için kurulan rakip izleme verisi, sonucu
değerlendirmek için de kullanılacak.

## Döngü beş adım ama tek bir zaman diliminde kapanmalı

Kaynak metin süreci beş aşamada tanımlıyor: fiyat aksiyonlarını tespit
etmek, etkiyi değerlendirmek, yanıtı belirlemek, fiyatları dağıtmak ve
performansı izlemek. Son adım ilkine geri bağlanıyor; izleme, bir sonraki
tespitin ve bir sonraki kararın girdisi oluyor. Bu yüzden şekil bir çizgi
değil, bir çember.

![Başlık: Rekabetçi Yanıt Döngüsü. Saat yönünde dönen koyu lacivert oklarla çizilmiş bir çember üzerinde beş ikonlu durak: 1. Aksiyonları Tespit Et (radar ikonu), 2. Etkiyi Değerlendir (belge ve büyüteç), 3. Yanıtı Belirle (yol tabelası), 4. Fiyatları Dağıt (yayın anteni), 5. Performansı İzle (yükselen grafik). Çemberin ortasında Rekabetçi Yanıt Döngüsü yazıyor.](/decks/reactive-pricing/03.webp "Beşinci adımdan birinciye dönen ok, döngünün kapanmadığı sürece öğrenmediğini söylüyor. İzleme atlanırsa her rakip hamlesi ilk kez görülmüş gibi değerlendiriliyor.")

Çemberin bir de hız koşulu var. Kaynak metin tespit, etki değerlendirmesi
ve yanıt döngüsünün ideal olarak aynı zaman dilimi içinde gerçekleşmesi
gerektiğini söylüyor. Aşamaların sırası sabit ama aralarında beklemeye
yer yok. Bu koşulun neden bu kadar sert olduğunu dağıtım adımına
gelince görüyoruz; önce ilk adımın neden fiyat seviyesinden fazlasını
izlemesi gerektiğine bakmak lazım.

## Rakibin niyeti fiyat tutarında değil, kuralda da saklı

Tespit aşamasında bir fiyat değişikliği algılandığında sistemin ayrıştırması
gereken şey yalnızca yeni tutar değil. Brifing üç veri bileşeni sayıyor:
fiyat seviyeleri (fare levels), kural setleri (rules) ve dipnotlar
(footnotes); bunlara satış istihbaratından gelen bilgi ekleniyor.
Değişimin niteliği, yani rakibin bir kuralı mı değiştirdiği yoksa doğrudan
tutarı mı oynadığı, verilecek yanıtın stratejisini belirliyor.

Bu ayrımın pratik anlamı büyük. Aynı tutarda kalan ama kuralı gevşetilmiş
bir ücret, fiilen bir indirim olabilir; tutara bakan bir izleme sistemi
bunu hiç fark etmez. Tersine, yalnızca tutarı düşen ama kısıtlaması sıkı
bir ücret, düşük talep bekleyen bir pazara atılmış dar bir hamle olabilir
ve ona fiyat seviyesinde tam eşitlemeyle karşılık vermek gereğinden geniş
bir yanıt olur. Brifingin uygulanabilir öngörüler kısmı bunu tek bir
ilkeye bağlıyor: yalnızca baz ücretlerin değil, kuralların, dipnotların ve
yan ürünlerin de izlenmesi rakibin niyetini anlamak için kritik.

İzleme sıklığının cevabı da veri kaynağında. Kaynak metne göre rakip
faaliyetleri, fiyat dağıtıcılarının (fare distributors) yayınladığı
verilerin frekansına ve pazar istihbaratına dayalı olarak proaktif ve
sürekli izlenmeli. Yani izleme hızı havayolunun keyfine göre değil, fiyat
verisinin pazara düştüğü ritme göre ayarlanıyor. Yazılım tarafında bunun
karşılığı, izleme işinin kendi zamanlayıcısıyla değil, dağıtıcının yayın
döngüsüyle tetiklenmesi ve karşılaştırmanın tek bir alan üzerinde değil,
ücret kaydının tamamı (tutar, kural, dipnot) üzerinde fark çıkarması.

## Yanıt vermemenin de bir faturası var ve o hesaplanabilir

Tespit edilen her değişiklik ikinci aşamaya, etki değerlendirmesine
giriyor. Buradaki soru "rakip ne yaptı" değil, "yanıt vermezsem bana ne
olur". Karar mekanizması dört şeyi birlikte tartıyor: havayolunun o
pazardaki güçlü ve zayıf yönleri, potansiyel gelir kaybı, pazar payı
erozyonu ve gelir seyrelmesi (revenue dilution) riski.

![Başlık: Veri Filtrasyonu ve Etki Analizi. Üstte mavi kutu, 1. Tespit: satış istihbaratı ve fiyat dağıtıcıları üzerinden proaktif takip; sadece fiyat seviyeleri değil, kurallar ve dipnotlardaki değişiklikler de izlenmelidir. Kutudan inen üç ok bir süzgeçten geçerek alttaki beyaz kutuya iniyor. 2. Etki Değerlendirmesi, yanıt vermemenin potansiyel faturası; dört kart: Pazardaki Güç / Zayıflık, Potansiyel Gelir Etkisi, Pazar Payı Değişimi, Gelir Seyrelmesi (Dilution).](/decks/reactive-pricing/04.webp "Süzgeç, tespit edilen her değişikliğin yanıt gerektirmediğini gösteriyor. Alttaki dört kart, hangisinin gerektirdiğine karar veren sorular.")

Dört kriterin ikisi birbirine ters yönde çekiyor. Pazar payı erozyonu
eşitlemeye iter: rakip ucuzlamışsa ve biz yerimizde duruyorsak yolcu
kayar. Gelir seyrelmesi ise eşitlemekten uzak tutar: rakibi takip etmek,
zaten daha yüksek fiyattan satın alacak olan yolcuya da düşük fiyatı
açmak demek. Eşitlemenin maliyeti yalnızca kazanılacak yeni yolcuda değil,
fiyat indiği için daha az ödeyen mevcut yolcuda ortaya çıkıyor.

Pazardaki güç ya da zayıflık bu iki kuvvetin hangisinin ağır basacağını
belirliyor. Güçlü olunan bir pazarda yolcunun küçük bir fiyat farkıyla
kaymama ihtimali daha yüksek, dolayısıyla eşitlemenin getirdiği seyrelme
kazanılan paydan pahalıya gelebilir. Zayıf olunan pazarda aynı fark
doğrudan pay kaybı olarak geri dönebilir. Etki değerlendirmesi bu yüzden
pazar pazar yapılıyor; tek bir havayolu için tek bir "eşitleme politikası"
yok.

## Eşitlemek norm, eşitlememek bir karar

Üçüncü aşamada değerlendirme bir yanıta dönüşüyor. Kaynak metin burada
dengeli bir cümle kuruyor: eşitleme (fare matching) norm olma eğiliminde
olsa da bir rakibin fiyat aksiyonunu takip etmenin mantıklı olmadığı
durumlar sıklıkla ortaya çıkıyor. Varsayılan yol eşitlemek; ama varsayılan
yol otomatik yol değil.

Brifingin iş kuralı eşitlememe koşulunu tanımlıyor: analiz, rakibi takip
etmenin pazar payını korumaktan çok geliri ciddi biçimde seyrelteceğini ya
da havayolunun o pazardaki stratejik üstünlüğüne zarar vereceğini
gösteriyorsa, eşitleme yapılmıyor. Sunum aynı kararı iki sütunda
somutlaştırıyor. Pazar payını korumak kritikse ya da rakibin hamlesi
doğrudan ana rotaları hedefliyorsa eşitlemek. Rakibin o hattaki kapasitesi
çok düşükse ya da marka değerini ve premium algısını korumak daha kârlıysa
eşitlememek.

![Başlık: Yanıt Stratejisini Belirleme. Alt başlık: fiyat eşitlemek genel norm olsa da, her hamleye yanıt vermek stratejik olarak doğru olmayabilir. Ortada VS yazan bir daireyle ayrılmış iki sütun. Sol, lacivert başlıklı Eşitle (Match): 1. pazar payını korumak kritikse, 2. rakip hamlesi doğrudan ana rotalarımızı hedefliyorsa. Sağ, turuncu başlıklı Eşitleme (Do Not Match): 1. rakibin o hattaki kapasitesi çok düşükse, 2. marka değerini ve premium algısını korumak daha kârlıysa.](/decks/reactive-pricing/05.webp "Sağ sütundaki ilk madde en kolay gözden kaçanı: az koltukla gelen bir ucuz fiyat pazarı taşıyamaz, ona bütün envanterle yanıt vermek seyrelmeyi kendi elinle büyütmek olur.")

Rakip kapasitesi koşulu, gelir yönetimi bölümlerindeki mantığın fiyat
tarafındaki yansıması. Rakibin düşük fiyatı yalnızca birkaç koltukta
geçerliyse, o fiyattan uçmak isteyen talebin çoğu zaten o koltuklara
sığmayacak ve havayoluna geri dönecek. Bu durumda bütün pazarda fiyatı
indirmek, rakibin küçük hamlesine büyük bir gelir fedakârlığıyla karşılık
vermek oluyor.

Yazılım tarafında bunun karşılığı, "eşitleme" kararının bir boolean değil
bir sonuç kaydı olması. Eşitlememe kararı da en az eşitleme kadar veri
üretmeli: hangi pazarda, hangi rakip hamlesine, hangi gerekçeyle yanıt
verilmedi. Beşinci aşamada bu kararın doğru olup olmadığını ölçmek ancak
böyle mümkün; kaydı olmayan bir "hiçbir şey yapmadık" kararı sonradan
sorgulanamıyor.

## Geç verilen doğru yanıt, yanlış yanıttır

Karar verildiğinde iş bitmiyor; yeni fiyat pazara ulaşana kadar hiçbir
etkisi yok. Kaynak metin burada zaman kısıtını adlandırıyor: tespit, etki
değerlendirmesi ve yanıt belirleme döngüsü, bir sonraki fiyat dağıtım
penceresi (fare distribution window) içinde tamamlanmalı. Belirlenen yeni
fiyatlar derhal pazar yerine dağıtılmalı. Gecikme, rekabet avantajının ve
pazar payının kaybına yol açıyor.

![Başlık: Fiyat Dağıtımı ve Hız. Soldaki turuncu noktada Tespit ve Analiz, sağdaki lacivert noktada Pazar Yeri (Dağıtım) yazan yatay bir zaman çizgisi. Çizginin tamamını mavi bir parantez kapsıyor, parantezin üstündeki kutu, Kritik Pencere: tespit, etki analizi ve yanıt aynı zaman diliminde gerçekleşmelidir. Alttaki kutu: belirlenen yeni fiyatlar derhal pazar yerine dağıtılmalıdır; gerekli durumlarda yeni fiyatlar reklam ve medya kanalları üzerinden promosyonlarla desteklenir.](/decks/reactive-pricing/06.webp "Parantez tespitten dağıtıma kadar bütün hattı kapsıyor: analiz süresi pencereden ayrı bir bütçe değil, aynı pencereden düşülüyor.")

Bu kısıt, bütün sürecin mühendislik tasarımını belirliyor. Dağıtım
penceresi dışarıdan konan bir son teslim tarihi; havayolu onu
değiştiremiyor, yalnızca yakalayabiliyor ya da kaçırabiliyor. Tespit,
değerlendirme ve karar aşamalarının toplam süresi o pencerenin içine
sığmak zorunda. Etki analizi ne kadar ince olursa olsun, pencereyi
kaçırırsa rakibin fiyatı bir dağıtım döngüsü boyunca yanıtsız kalıyor.
Brifingin öngörüsü de bunu sistem gereksinimi olarak koyuyor: analiz
sistemleri, tespit edilen bir değişikliğe hemen bir sonraki dağıtım
penceresinde yanıt verebilecek çeviklikte olmalı. Yani tasarım sorusu
"en iyi analizi nasıl yaparız" değil, "pencereye sığan en iyi analizi
nasıl yaparız".

Dağıtım adımının bir de destekleyici kolu var. Brifinge göre fiyat
değişikliği tek başına yeterli olmadığında iş mantığı, fiyat yanıtının
seçili medya kanalları üzerinden reklam ve promosyonlarla desteklenmesini
öngörüyor. Fiyat dosyalanmış ama yolcu tarafından görülmemişse, pazarda
yalnızca rakiplerin haberi oluyor.

## İzleme bir rapor değil, bir sonraki kararın girdisi

Beşinci aşama döngüyü kapatıyor. Bir fiyat aksiyonunun başarısının temel
ölçüsü, kaynak metnin "yard stick" dediği referans noktası, rezervasyon
sayıları ve gelir performansındaki değişim. Bunun yanında başarının ana
göstergesi, bölümün başında gördüğümüz gibi, rakiplerin yeni fiyatı kabul
edip kendi fiyatlarını o seviyeye çekip çekmediği.

![Başlık: Performans İzleme ve Geri Bildirim. Solda dört haftalık bir rezervasyon hacmi grafiği, çizgi birinci haftadan dördüncü haftaya yükseliyor. Grafiğin altında iki etiket. Süreç: rezervasyon ve gelir performansının sürekli incelenmesi. Amaç: alınan fiyat aksiyonunun başarısını ölçmek için pazar performansını yansıtan bir referans noktası (yard stick) oluşturmak. Sağda iki kutu, Gelir Yönetimi ve Finans; ortadaki Döngüyü Kapatmak metninden (elde edilen verilerin departmanlara kesintisiz olarak aktarılması) iki kutuya ok çıkıyor.](/decks/reactive-pricing/07.webp "Oklar iki ayrı birime gidiyor çünkü aynı veri iki ayrı soruya cevap veriyor: gelir yönetimi envanteri, finans beklentiyi yeniden ayarlıyor.")

Toplanan veri kimde kalıyor sorusunun cevabı da açık. Kaynak metne göre
performans verileri, sürekli bir geri bildirim döngüsü sağlamak amacıyla
gelir yönetimi ve finans departmanlarına aktarılmalı ve gelecekteki
fiyatlandırma kararlarına dayanak oluşturmalı. Brifingin öngörüsü bunu
bir konumlandırma farkı olarak koyuyor: izleme süreci yalnızca bir sonuç
raporu değil, gelir yönetimi ve finans için stratejik bir girdi aracı.

Fark şurada. Rapor olarak kurulan izleme geriye bakıyor ve bir yerde
okunmayı bekliyor. Girdi olarak kurulan izleme, bir sonraki etki
değerlendirmesinin veri setini oluşturuyor: geçen sefer bu pazarda bu
rakibe eşitlemedik, rezervasyonlar ne yaptı, rakip fiyatını geri çekti mi.
İkinci aşamadaki "pazardaki güç ve zayıflık" sorusu soyut bir yargı
olmaktan, bu kayıtlarla beslenen ölçülebilir bir girdiye dönüşüyor.
Yazılım tarafında bunun karşılığı, fiyat aksiyonunun, gerekçesinin ve
sonraki haftalardaki sonucunun aynı kayıtta birleşmesi; ayrı sistemlerde
duran üç veri, geri bildirim döngüsü değil üç ayrı arşiv.

## Yarın işe yarayacak beş çıkarım

1. **Taklit etme, beş adımı işlet.** Rakip hamlesine yanıt, tespit,
   etki değerlendirmesi, yanıt kararı, dağıtım ve izlemeden oluşan
   disiplinli bir süreçten geçsin. Etki değerlendirmesi pazar gücünü ve
   gelir seyrelmesini mutlaka içersin; rakibi kopyalamak strateji değil.
2. **Analiz süresini dağıtım penceresinden düş.** Tespitten karara kadar
   geçen süre bir sonraki fiyat dağıtım penceresine sığmalı. Sistemi en
   derin analize göre değil, pencereyi kaçırmayacak analize göre kur.
3. **Ücret kaydının tamamını izle.** Yalnızca baz ücreti değil, kuralları,
   dipnotları ve yan ürünleri de karşılaştır. Rakibin niyeti çoğu zaman
   tutarda değil, kısıtlamada değişiyor.
4. **İzlemeyi girdi olarak kur, rapor olarak değil.** Rezervasyon ve gelir
   değişimini, rakibin yeni fiyatı benimseyip benimsemediğiyle birlikte
   gelir yönetimi ve finansa kesintisiz akıt; bir sonraki etki
   değerlendirmesi bu veriyle başlasın.
5. **Güçlü olduğun pazarda seçici ol.** Eşitlemeyi varsayılan kabul et ama
   otomatik yapma. Rakibin kapasitesi düşükse ya da premium konumu korumak
   daha kârlıysa eşitleme; bu kararı da gerekçesiyle kaydet.

Bu bölümde ne yok: rakip fiyatının hangi ücret ürünü, sınıf ve kural
yapısıyla kurulduğu (ücret ürünleri ve kural motoru bölümleri), eşitleme
kararından sonra o fiyatın kaç koltukta açık kalacağı (gelir yönetimi
bölümleri) ve ücretlerin dosyalandığı dağıtım altyapısının kendisi
("Havacılık endüstri standartları ve yönetişim: stratejik analiz belgesi").
Bu bölüm, rakip bir fiyat değiştirdiğinde o altyapının üzerinde hangi
kararın hangi sırayla ve hangi hızda verildiğini anlatmak için var.
