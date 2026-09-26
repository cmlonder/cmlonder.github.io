---
title: "Havacılıkta overbooking (fazla rezervasyon) ve show-up modelleme stratejileri"
domain: "aviation"
summary: "Overbooking limiti, rezervasyon yapan yolcunun kaçının uçağa geleceğine dair bir tahminin üstüne kurulur; o tahminin ortalaması kadar varyansı da limiti belirler. Bu bölüm Binom ve deterministik modellerin varyansı neden hafife aldığını, kesilmiş normal dağılımın hangi yolcuyu hangi kovaya koyduğunu ve limitin neden doluluğa değil net gelire göre seçilmesi gerektiğini anlatıyor."
audience: "Envanter, rezervasyon ya da gelir yönetimi sistemleriyle çalışan, overbooking limitinin hangi varsayımla hesaplandığını anlamak isteyen yazılımcı ve analist. Olasılık dağılımına aşinalık işe yarar ama şart değil; show-up, spoilage, oversale, denied boarding, yetkilendirme seviyesi ve kesilmiş normal dağılım metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Rezervasyon yapan her yolcu uçağa gelmiyor. Gelmeyen yolcunun koltuğu
kalkışta boş kalıyor ve o koltuk bir daha satılamıyor. Havayolları buna
kapasiteden fazla rezervasyon kabul ederek, yani overbooking yaparak
cevap veriyor. Ama bu cevabın bir bedeli var: tahmin edilenden fazla yolcu
gelirse bir kısmı kapıda kalıyor. Bu bölüm iki risk arasındaki dengeyi
kuran modeli anlatıyor: boş koltuk riski (spoilage) ve yolcunun uçağa
alınamaması riski (oversale). **Overbooking limitini ortalama show-up
oranı değil, o oranın ne kadar oynadığı belirler; varyansı hafife alan
model, kâğıt üzerinde daha çok gelir, pratikte daha çok mağdur yolcu
üretir.**

Show-up, rezervasyonu olan yolcunun kalkışta uçuşa gelmesi demek.
Show-up oranı da gelenlerin rezervasyon sayısına oranı. Overbooking
limitinin bütün hesabı bu oranın bir tahminine dayanıyor. Kaynak metnin
yönetici özeti meseleyi tek cümleye indiriyor: basit Binom dağılımı ya da
deterministik modeller show-up sürecindeki değişkenliği hafife alıyor ve
bu da riskli overbooking limitlerine yol açıyor. Bölümün geri kalanı bu
cümlenin açılımı.

## Tek parametreli bir dağılım, show-up'ın ne kadar oynadığını veriden öğrenemiyor

Show-up'ı modellemenin ilk akla gelen yolu Binom dağılımı. Her yolcu
bağımsız bir yazı-tura atıyor: belirli bir olasılıkla geliyor, kalanında
gelmiyor. Rezervasyon sayısı ve gelme olasılığı biliniyorsa, kaç yolcunun
geleceğinin dağılımı da biliniyor. Hesaplaması kolay, açıklaması kolay.

Sorun, kaynak metnin deyişiyle Binom'un tek parametreli bir dağılım
olması. Rezervasyon sayısı sabitlendiğinde dağılımı belirleyen tek şey
gelme olasılığı; varyans da ondan türetiliyor. Model, show-up'ın ne kadar
oynak olduğunu veriden öğrenmiyor, ortalamadan çıkarıyor. Gözlemlenen
show-up varyansı ise kaynak metne göre genellikle bu modelin tahmininden
daha yüksek.

Buradaki sorun ortalamada değil. Binom ortalama show-up oranını doğru
tutturabilir; eksik çizdiği şey dağılımın genişliği. Kapasiteyi aşan
yolcu sayısını belirleyen de tam olarak o genişlik, yani ortalamanın
üstündeki günlerin ne kadar sık ve ne kadar uzağa düştüğü.

Varyansın düşük tahmin edilmesinin sonucu doğrudan limite yansıyor.
Kaynak metin zinciri açık kuruyor: düşük varyans tahmini sistemin aşırı
agresif overbooking limitleri belirlemesine, bu da operasyonel olarak
yönetilemez düzeyde yolcu reddine yol açıyor. Model kendinden emin
olduğu için az pay bırakıyor; gerçek, modelin öngördüğünden daha sık
kuyruğa düşüyor. İş kuralının cevabı da buna göre: daha yüksek standart
sapma öngören modeller kullanmak ve riski buradan azaltmak.

Yazılım tarafında bunun karşılığı şu: show-up tahmin servisinin çıktısı
tek bir oran olmamalı. Ortalama ile birlikte bir dağılım parametresi,
en azından bir standart sapma dönmeli ve bu parametre veriden ayrı olarak
tahmin edilmeli. Ortalamadan türetilen bir varyans, ayrı bir tahmin gibi
görünse de modelin varsayımını tekrar etmekten öteye geçmiyor.

## Belirsizlik arttıkça limit düşmeli, çünkü risk kuyrukta

Varyansın limite etkisini kaynak metin tek bir kurala bağlıyor: show-up
oranının standart sapması ne kadar büyükse, oversale riskini yönetmek için
overbooking limiti o kadar düşük olmalı. Sezgisi basit. Ortalama show-up
oranı iki uçuşta aynı olsa bile, oranın geniş bir aralıkta oynadığı
uçuşta kalkış anında kapasiteyi aşan yolcu gelme ihtimali daha yüksek.
Aynı limit, oynak uçuşta daha çok reddedilen yolcu üretir.

Bu kural bir yerde muhafazakârlık çağrısı gibi okunabilir ama aslında
limitin uçuş bazında farklılaşması gerektiğini söylüyor. Kaynak metin
güvenli bir iş kuralını şöyle tarif ediyor: belirsizliğin yüksek olduğu
uçuşlarda daha muhafazakâr limitler tanımlamak ve tazminat maliyetlerini
bu yolla kontrol altında tutmak. Yani tek bir ağ geneli overbooking
yüzdesi, belirsizliği düşük uçuşlarda fazla temkinli, yüksek uçuşlarda
fazla cesur kalıyor.

Sistem tasarımı açısından bu, limit hesabının girdileri arasında
varyansın birinci sınıf bir alan olması demek. Limit tablosu yalnızca
"uçuş, kapasite, ortalama show-up" üçlüsüyle tutuluyorsa, iki farklı risk
profilindeki uçuş aynı limiti alıyor ve fark hiçbir raporda görünmüyor.

## Deterministik model belirsizliği sıfır sayıyor, bu yüzden en agresif limiti üretiyor

Binom'un bir adım gerisinde daha basit bir yaklaşım duruyor: deterministik
model. Limit, kapasitenin show-up oranına bölünmesiyle bulunuyor: beklenen
gelen yolcu sayısı kapasiteye tam eşit olacak kadar rezervasyon kabul
ediliyor. Hesap tek satır, açıklaması tek cümle.

Kaynak metin bu modelin neden önerilmediğini açıkça söylüyor:
deterministik modelin varyansı sıfır ve bu Binom'dan bile daha agresif
kontrollere yol açıyor. Model, show-up oranının her uçuşta tam olarak
ortalamada gerçekleşeceğini varsayıyor. Hiçbir belirsizlik payı
bırakmıyor. Ortalamanın üstündeki her gün, doğrudan reddedilen yolcu
demek.

Kaynak metnin buradaki hükmü kesin: bu model risk maliyetini tamamen göz
ardı ettiği için iş kuralları açısından elenmeli. Deterministik formülün
cazibesi basitliği; bir tabloya, bir konfigürasyon dosyasına, bir hesap
tablosuna kolayca giriyor. Ama bu basitlik varyansı sıfıra eşitlemenin
bedeli. Üç modeli yan yana koyunca sıralama netleşiyor: deterministik
model en agresif, Binom ondan daha az agresif, varyansı veriden öğrenen
model en temkinli limiti veriyor. Gözlemlenen varyans Binom'unkinden
yüksekse, doğru limit de bu sıralamanın en temkinli ucuna yakın.

## Kesilmiş normal dağılım, reddedilen yolcuyu hiç kabul edilmemiş talepten ayırıyor

Show-up'ı daha geniş bir dağılımla modellemek ilk adım. İkinci adım,
bu dağılımın nerede kesileceği. Burada iki sınırı ayırmak gerekiyor:
uçağın fiziksel kapasitesi (kaynak metinde c) ve yetkilendirme seviyesi
(authorization level, kaynak metinde Au). Yetkilendirme seviyesi, satılmasına
izin verilen rezervasyon sayısı; overbooking yapıldığında kapasitenin
üstünde duruyor.

Yetkilendirme seviyesinin üstündeki talep uçuş için hiç onaylanamıyor.
Bu yolcular rezervasyon yapamadı; kalkış günü kapıda da değiller.
Kaynak metin bu noktada önemli bir ayrım yapıyor: bu yolcular reddedilen
biniş (denied boarding) kapsamında değerlendirilmemeli. Reddedilen biniş,
rezervasyonu kabul edilmiş, uçuşa gelmiş ama fiziksel kapasite dolduğu
için uçağa alınamamış yolcu için kullanılıyor. Tazminat gerektiren durum
bu.

Kesilmiş normal dağılım (truncated normal distribution) bu ayrımı model
düzeyinde yapıyor. Normal dağılım yetkilendirme seviyesinde kesiliyor;
limitin ötesine taşan olasılık kütlesi modele girmiyor. Kaynak metnin
ifadesiyle amaç, yalnızca uçuşa kabul edilen ve fiziksel olarak kapasiteyi
aşan, yani tazminat gerektiren yolcuları ötekilerden net biçimde ayırmak.

Kesilmiş dağılım üzerinde iki beklenen değer hesaplanıyor. Kaynak metin
bölgeleri şöyle tanımlıyor: kapasiteye kadar olan alan beklenen biniş
sayısını (expected boarded), kapasite ile yetkilendirme seviyesi
arasındaki alan beklenen yolcu reddini (expected oversales) veriyor.
Kapasitenin altında kalan her gelen yolcu uçağa biniyor. Kapasite ile
limit arasına düşen her gelen yolcu, koltuğu olmadığı için reddediliyor.
Limitin üstü ise hiç rezervasyona dönüşmediği için ne biniş ne ret.

Bu ayrımın atlanması iki yönde de yanlış veri üretiyor. Yetkilendirme
seviyesinin üstündeki talep reddedilen biniş sayılırsa, oversale
istatistiği şişiyor ve sistem limiti gereğinden fazla düşürüyor. Tersine,
reddedilen yolcular kaybolan talep olarak kaydedilirse tazminat maliyeti
görünmez oluyor. Kaynak metnin çıkarımı bu yüzden net: uçağa kabul
edilemeyecek talebin reddedilen biniş istatistiklerini kirletmesine izin
verilmemeli.

Yazılım tarafında bunun karşılığı veri modelinde başlıyor. Rezervasyon
sisteminin reddettiği talep ile kapıda reddedilen yolcu farklı olaylar;
farklı kaynaklardan geliyor, farklı tablolara yazılmalı ve farklı
metriklere beslenmeli. İkisi tek bir "karşılanamayan talep" sayacına
toplandığında, sonradan hangi modelin hangisini kullandığını ayırmak
mümkün olmuyor.

## Doğru limit doluluğu değil, net geliri maksimize eden limit

Buraya kadar anlatılan kısım istatistik: kaç yolcu gelecek, ne kadar
oynayacak, kaçı binecek, kaçı reddedilecek. Limitin kendisini seçmek ise
ekonomik bir karar. Kaynak metin amaç fonksiyonunu tek formülle veriyor:
net gelir, beklenen toplam gelirden beklenen boş koltuk maliyeti ile
beklenen reddedilen biniş maliyetinin çıkarılmasıyla bulunuyor.

Bu formülün söylediği şey, doluluk oranının hedef olmadığı. Limit
yükseldikçe boş koltuk azalıyor, doluluk artıyor; ama aynı hareket
reddedilen yolcu sayısını da artırıyor. Kaynak metin başarılı gelir
yönetimini yalnızca doluluk oranına değil, toplam net gelirin maksimize
edilmesine bağlıyor. Yüzde yüz doluluk, kapıda bırakılan yolcuların
maliyetini karşılamıyorsa kötü bir sonuç.

İki maliyetin yapısı farklı. Boş koltuk maliyeti kaynak metinde sabit bir
ortalama maliyet olarak ele alınıyor (Cs): kalkışta boş kalan her koltuk
yaklaşık aynı kaybı temsil ediyor. Reddedilen biniş maliyeti ise lineer
değil. Kaynak metin bunu açıkça söylüyor: reddedilen biniş maliyeti
doğrusal olmayan bir fonksiyon ve fazla satılan yolcu sayısı arttıkça
artan bir oranda artıyor.

Neden artan oranda arttığı da kaynak metinde var. Yolcu reddi arttıkça
havayolunun katlandığı maliyet yalnızca kişi başı tazminat değil;
operasyonel kaos ve tazminat yükü logaritmik ya da üstel biçimde
büyüyor. Kaynak metnin çıkarımları bu kalemleri adıyla sayıyor: otel,
tazminat, itibar kaybı. Tek bir reddedilen yolcu bir tazminat kalemi;
çok sayıda reddedilen yolcu aynı anda yönetilmesi gereken bir operasyon.

Karar kuralı bu iki maliyetin marjinal karşılaştırmasından çıkıyor.
Kaynak metne göre sistem, ek bir yolcu almanın yaratacağı marjinal gelir
olası reddedilme maliyetinden büyük olduğu sürece limiti artırmalı.
Limitin her bir birim artışı iki şeyi değiştiriyor: bir boş koltuğun
dolma ihtimalini ve bir yolcunun kapıda kalma ihtimalini. Birincisi sabit
bir kazanç getiriyor, ikincisi artan bir maliyet. Limit, ikisinin
dengelendiği noktada duruyor.

Reddedilen biniş maliyetinin doğrusal olmaması bu noktanın yerini
belirleyen şey. Maliyet doğrusal olsaydı, her ek ret aynı fiyattan
yazılır ve model bazı durumlarda limiti yüksek tutmayı kârlı bulurdu.
Artan oranlı maliyet ise kuyruğu ağırlaştırıyor: varyansın yüksek olduğu
uçuşta çok sayıda reddin olasılığı küçük olsa bile, o senaryonun maliyeti
büyük olduğu için beklenen maliyete orantısız katkı yapıyor. Varyans ile
maliyet yapısı burada birleşiyor; ikisi birlikte oynak uçuşta limiti
aşağı çekiyor.

## Reddedilen biniş maliyeti her istasyon için ayrı kalibre edilmeli

Maliyet fonksiyonunun şekli kadar hangi veriyle kurulduğu da önemli.
Kaynak metin bu fonksiyonun istasyon bazlı tarihsel verilerle kalibre
edilmesini öneriyor ve fonksiyonu fos(x) olarak adlandırıyor. Çıkarım
bölümünde de aynı vurgu var: reddedilen biniş maliyet fonksiyonu her uçuş
ya da istasyon için sabit tutulmamalı, tarihsel veriler ışığında
lokasyona özel olarak güncellenmeli.

Gerekçe, reddedilen yolcunun maliyetini oluşturan kalemlerin, yani otel,
tazminat ve operasyonel yükün, yere bağlı olması. Aynı fonksiyonu bütün
ağa uygulamak, bazı istasyonlarda
reddi olduğundan ucuz, bazılarında olduğundan pahalı gösteriyor ve
limitler buna göre sapıyor.

Sistem tasarımında bu, maliyet fonksiyonunun kodun içinde sabit bir
eğri olarak durmaması demek. İstasyon anahtarlı, tarihsel veriden
beslenen ve düzenli yeniden hesaplanan bir parametre seti olarak
tutulması gerekiyor. Yeni bir istasyon açıldığında hangi varsayılan
fonksiyonla başlanacağı ve ne zaman kendi verisine geçileceği de
açıkça tanımlanmalı; yoksa varsayılan eğri fark edilmeden kalıcı hale
geliyor.

## Yarın işe yarayacak dört çıkarım

1. **Show-up tahmininde varyansı ayrı ölç.** Yalnızca ortalamaya bakma;
   modelin öngördüğü standart sapmayı gerçek verideki standart sapmayla
   karşılaştır. Varyansı düşük gösteren modeller, Binom gibi, revize
   edilmeli. Deterministik modeli ise hiç kullanma: varyansı sıfır
   sayıyor ve en agresif limiti üretiyor.
2. **Limiti net gelirle seç, doluluk oranıyla değil.** Hesaba yalnızca
   koltuk fiyatını değil, boş koltuk maliyetini ve yolcu reddinde artan
   oranda büyüyen maliyeti (otel, tazminat, itibar kaybı) koy. Ek bir
   rezervasyonun marjinal geliri olası ret maliyetinden büyük olduğu
   sürece limiti artır, eşitlendiği yerde dur.
3. **Reddedilen biniş verisini temiz tut.** Yetkilendirme seviyesinin
   üstündeki, hiç onaylanmamış talebi reddedilen biniş istatistiğine
   karıştırma. Kesilmiş normal yaklaşımını benimse; kapasiteye kadar
   olanı beklenen biniş, kapasite ile limit arasını beklenen ret olarak
   ayrı hesapla.
4. **Ret maliyet fonksiyonunu istasyona göre kalibre et.** fos(x)'i bütün
   ağ için tek eğri olarak tutma; istasyon bazlı tarihsel veriyle
   güncelle ve artan oranlı yapısını koru.

Bu bölümde ne yok: show-up oranının ortalamasının nasıl tahmin edildiği,
iptal ve no-show davranışının rezervasyon eğrisi boyunca nasıl
modellendiği, ve overbooking limitinin ücret sınıflarına nasıl
dağıtıldığı. Talebin kapasiteyi aştığı durumda kaybedilen yolcunun
hesabı spill bölümlerinde; yüksek varyanslı talebin dağılım seçimi
"Yüksek varyanslı talep ve iki aşamalı Cox dağılımı" bölümünde. Bu bölüm
yalnızca iki şeyi netleştirmek için var: show-up varyansının limite nasıl
yansıdığı ve limitin hangi maliyet dengesinde seçildiği.
