---
title: "Havacılık gelir yönetimi: envanter kontrolü ve iş mantığı analizi"
domain: "aviation"
summary: "Gelir yönetimi sisteminin ürettiği karar, envanterde bir kontrol mekanizmasına dönüşmeden hiçbir şey değiştirmez. Bu bölüm o mekanizmaların dört ailesini anlatıyor: sınıfları iç içe yerleştirmenin iki yolu (net ve threshold nesting), çok segmentli uçuşta güzergâh kontrolü (SCI ve segment limitleri) ve aynı sınıfı farklı satış noktalarına farklı açan POS kontrolleri."
audience: "Envanter, rezervasyon (CRS) ya da gelir yönetimi sistemleriyle çalışan, bir optimizasyon kararının satışa nasıl bir kural olarak indiğini anlamak isteyen yazılımcı ve analist. Overbooking ve talep tahmini bölümlerinin okunmuş olması işe yarar; nesting, net ve threshold nesting, bottom-up nesting, SCI, segment limiti, spoilage ve POS kontrolü metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler gelir yönetiminin iki yüzünü anlattı: ne kadar talep
geleceğinin tahmini ve kapasitenin ne kadar aşılabileceğinin hesabı
(overbooking). İkisi de bir sayı üretiyor. Ama o sayı satış ekranına
kendiliğinden inmiyor. Arada bir katman daha var: envanter kontrolü, yani
hangi rezervasyon sınıfının, hangi güzergâhta, hangi satış noktasına kaç
koltukla açık olduğunu belirleyen kurallar. **Envanter kontrolünde
yöntem seçimi teknik bir tercih değil, bir iş kararı: hangi sınıfta
belirsizlik olduğuna, hangi yolcuya son koltuğun garanti edileceğine ve
kontrolün iptallere ne kadar hızlı tepki vermesi gerektiğine göre
seçiliyor.** Yanlış mekanizma, doğru tahmini boşa çıkarıyor.

Kaynak metin konuyu üç başlık altında topluyor: sınıfların iç içe nasıl
yerleştirileceği (nesting), çok duraklı uçuşlarda kısa ve uzun
güzergâhın aynı koltuk için nasıl yarıştırılacağı ve aynı sınıfın farklı
satış noktalarında nasıl farklı açılacağı. Üçü de aynı soruya farklı
çözünürlükte cevap veriyor: koltuğu en yüksek geliri getirecek yolcuya
nasıl saklarsın.

## Net nesting belirsizliğin aşağıda olduğu yerde, threshold nesting yukarıda olduğu yerde doğru

Nesting, rezervasyon sınıflarının birbirinin içine yerleştirilmesi
demek. Sınıflar bir hiyerarşide duruyor: en üstte tam ücretli Y, altında
giderek ucuzlayan sınıflar. Hiyerarşinin anlamı şu: alt sınıfa ayrılan
koltuklar üst sınıfın da erişebildiği koltuklar, ama üst sınıf için
korunan (protected) koltuklar alt sınıfa satılmıyor. Asıl soru bu
korumanın hangi hesapla yapılacağı.

Net nesting'in tanımını kaynak metin tek cümleyle veriyor: talep edilen
sınıfta ve hiyerarşide bu sınıfın üstündeki bütün sınıflarda, genellikle
Y'ye kadar, envanter işlemi yapılmasını gerektiriyor. Yani alt sınıftan
bir satış, üstündeki her sınıfın sayacına dokunuyor. Bu, muhafazakâr bir
yaklaşım. Kaynak metnin önerisi de buna göre: erken rezervasyon yapan ve
düşük değerli olan sınıflardaki talep belirsizliği yüksekse net nesting
tercih ediliyor.

Belirsizlik yukarıdaysa, yani yüksek değerli üst sınıflarda
yoğunlaşıyorsa, iş mantığına daha uygun olan threshold nesting. Kaynak
metin bunu daha agresif bir yaklaşım olarak tanımlıyor. Aradaki farkın
en keskin görüldüğü yer son koltuk. İş kuralı en yüksek sınıfa son
koltuğa kadar erişim garantisi (last seat availability) veriyorsa
threshold nesting kullanılmalı; net nesting, hesaplama yapısı gereği üst
sınıflara son koltuğun her zaman açık olacağını garanti etmiyor.

Buradaki ayrım bir mühendislik ayrımı gibi görünüyor ama altında bir
ticari taahhüt yatıyor. Son koltuk garantisi, en yüksek sınıfa verilmiş
bir söz. Envanter yöntemi o sözü tutamıyorsa, sözü veren tarafla
envanteri kuran taraf farklı şeyler bildiği için tutamıyor. Yazılım tarafında bunun
karşılığı şu: nesting yöntemi bir yapılandırma bayrağı olarak değil, iş
kuralıyla birlikte belgelenmesi gereken bir karar olarak ele alınmalı.
"Bu pazarda Y'ye son koltuk garantisi var mı" sorusunun cevabı, hangi
yöntemin çalıştığını belirliyor.

Kaynak metnin çıkarımlarından biri seçimi bir koşula daha bağlıyor:
havayolu ağı sık sık optimize ediliyorsa ve tahminleme modelleri
güncelse, threshold nesting gelir maksimizasyonu için daha etkin. Agresif
yöntemin bedeli tahmine daha çok güvenmesi. Tahmin eskiyse agresiflik
yanlış yöne gidiyor.

## Sırasız gelen rezervasyon, korunan koltuğu yanlış sınıftan yer

Net nesting'in pratikte bir zayıflığı var: rezervasyonlar hiyerarşinin
beklediği sırayla gelmiyor. Düşük sınıflar erken satılır, üst sınıflar
kalkışa yakın gelir varsayımı ortalamada doğru, tek tek rezervasyonda
değil. Kaynak metin buna sırasız satış (out of sequence) sorunu diyor.

Çözüm olarak bir varyasyon öneriliyor: bottom-up nesting, yani aşağıdan
yukarıya yerleştirme. Mantığı envanterin doğru hiyerarşiden düşülmesini
sağlamak; böylece üst sınıflar için korunan envanter, düşük sınıflar
tarafından tüketilmiyor. Burada korunan şey bir koltuk sayısı değil, o
sayının hangi kovadan eksildiği. Aynı satış, hangi seviyeden düşüldüğüne
göre bir sonraki talebe farklı bir tablo bırakıyor.

Yazılım tarafında bunun karşılığı tanıdık bir sorun: sayaçların
güncellenme sırası ile olayların gerçekleşme sırası aynı değil. Envanter
düşümü sırayla gelen olayların üstüne kurulmuşsa, sıra bozulduğunda sonuç
da bozuluyor. Düşümün hangi seviyeden yapılacağı kuralı, olayın geliş
sırasından bağımsız tanımlanmalı.

## SCI kısa güzergâhı kapatıp uzun güzergâhı açık tutuyor, ama iptali görmüyor

Tek bacaklı bir uçuşta sınıf kontrolü yeterli. Çok duraklı bir uçuşta
değil. Kaynak metnin örneği DFW-JFK-LHR: aynı uçuş numarası, aynı
fiziksel bacak, ama o bacaktaki koltuğu iki farklı yolcu istiyor. Biri
yalnızca DFW-JFK uçacak, diğeri DFW'den LHR'ye gidecek. Aynı rezervasyon
sınıfında ikisine aynı cevabı vermek, uçağı kısa mesafe yolcusuyla
doldurma riskini taşıyor.

Segment kapatma göstergeleri (Segment Close Indicator, SCI) bu çakışmayı
çözmek için var. Kaynak metin SCI'yı bir uçuş numarası içindeki O&D'ler
(Origin & Destination, kalkış ve varış çifti) için güzergâh kontrolü
sağlayan bir mekanizma olarak tanımlıyor. Örnekte kısa mesafe DFW-JFK
için düşük değerli sınıflar satışa kapatılıyor; aynı fiziksel bacaktaki
uzun mesafe DFW-LHR talebi için aynı sınıflar açık tutuluyor. İş kuralı
uçağın uzun mesafe yolcusuyla dolmasını teşvik etmek.

Sorun SCI'nın doğasında. Kaynak metin açıkça söylüyor: SCI'lar dinamik
değil. Bir iptal olduğunda sınıfı otomatik olarak geri açmıyorlar. Uzun
mesafe talebi beklenen kadar gelmezse ya da gelen iptal ederse, kısa
mesafe için kapatılan sınıf kapalı kalıyor. Sonuç spoilage: satılabilecek
bir koltuğun kalkışta boş gitmesi. Kapatmanın amacı geliri artırmaktı;
kapatma yerinde kaldığı için gelir kaybettiriyor.

Kaynak metin bu riski yönetmenin iki yolunu veriyor. Birincisi, gelir
yönetimi sisteminin merkezi rezervasyon sistemine (CRS) sık aralıklarla
envanter kontrol güncellemesi göndermesi. İkincisi, SCI yerine daha
dinamik olan segment limitlerini, yani sayısal kontrolleri kullanmak.
İlk yol statik mekanizmanın etrafını sık güncellemeyle sarıyor; ikinci
yol mekanizmayı değiştiriyor.

Yazılım tarafında bunun karşılığı bir durum yönetimi meselesi. SCI bir
bayrak: açık ya da kapalı, ve kapanma nedeni ortadan kalktığında bunu
bilmiyor. Segment limiti bir sayı: satış ve iptalle birlikte hareket
ediyor. Bayrakla yönetilen bir kontrolün ne kadar sık yeniden
hesaplanacağı, bu yüzden bir performans parametresi değil, doğrudan bir
gelir parametresi. RM ile CRS arasındaki güncelleme aralığı uzadıkça
yanlış kapalı kalan sınıfların ömrü de uzuyor.

## Segment limiti, yasal bir tavanı envanter kuralına çeviriyor

Segment limitlerinin ikinci kullanım alanı ticari değil, hukuki.
Beşinci trafik hakkı (fifth freedom rights), bir havayolunun kendi ülkesi
dışındaki iki nokta arasında yolcu taşımasına izin veriyor ve bu izin
çoğu zaman kısıtlamalarla geliyor. Kaynak metne göre belirli bir
segmentte taşınabilecek toplam yolcu sayısı üzerinde yasal bir kısıtlama
olduğunda segment limitleri devreye giriyor. Limit sayısal bir sınır
koyuyor ve o segmentteki satışların uçuş bazında ya da aylık bazda
belirlenen sınırı aşmamasını sağlıyor.

Burada dikkat çeken ayrıntı aylık bazda limit. Uçuş bazlı bir sınır tek
bir envanter kaydında tutulabiliyor. Aylık bir sınır ise birden fazla
uçuşun satışlarını toplamayı gerektiriyor. Yazılım tarafında bunun
karşılığı, limitin tek bir uçuşun envanterinde değil, uçuşlar üstü bir
sayaçta yaşaması ve her satışta o sayacın da kontrol edilmesi.

Kaynak metnin çıkarımlarından biri segment limitlerine bir esneklik daha
ekliyor: rezervasyon sınıflarının hiyerarşisi bozulmadan, yani iç içe
olmayan (non-nested) segment limitleriyle, pazar koşullarına göre
aradaki bir sınıfın kapatılabilmesi. Değişen ücret aksiyonlarına hızlı
uyum sağlamanın yolu, hiyerarşiyi yeniden kurmak yerine ortadan tek bir
basamağı çekebilmek.

## POS kontrolü aynı sınıfı herkese aynı fiyata açmamanın yolu

Buraya kadar anlatılan kontroller koltuğun hangi sınıfa ve hangi
güzergâha gideceğini belirliyordu. Satış noktası (Point of Sale, POS)
kontrolleri üçüncü bir ekseni ekliyor: aynı sınıf, aynı güzergâh, ama
farklı satış noktası.

Neden gerektiğini kaynak metin iki durumla açıklıyor: döviz kuru
dalgalanmaları ve acente bazlı özel anlaşmalar. İkisinde de aynı pazarda,
aynı rezervasyon sınıfında satılan koltuğun havayoluna getirdiği değer
farklı. POS kontrolleri bölge, ülke ya da tek tek seyahat acentesi
düzeyinde öncelikli kullanılabilirlik (preferential availability)
tanımlıyor. Böylece aynı pazar ve aynı sınıf için farklı değerdeki
müzakere edilmiş ücretler (negotiated fares) ayrı ayrı yönetilebiliyor.

Kaynak metin bunun stratejik önemini dolaylı kanala bağlıyor: satış
noktası kontrolleri, dolaylı kanallardaki tek tek seyahat acenteleriyle
müzakere edilen ücret değerlerindeki geniş dağılımı yönetmek için
önemli. Bir sınıfın bütün acentelere aynı koşulla açık olması, en düşük
net ücreti müzakere etmiş acentenin en çok koltuğu almasına kapı açıyor.

Aynı mantık online tarafta da geçerli. Kaynak metnin çıkarımlarından
biri, online kanallar ve web süpermarketleriyle yapılan net ücret
anlaşmalarında POS kontrolleri kullanılarak dağıtım kanalları üzerindeki
stratejik hakimiyetin yeniden kazanılması gerektiğini söylüyor. Net
ücret anlaşması fiyatı sabitliyor; kaç koltuğun o fiyattan satılacağını
belirleyen ise envanter kontrolü.

## POS alt sınıfı bir temsil, mutabakat ana sınıfta yapılıyor

POS kontrollerinin nasıl uygulandığına dair kaynak metin tek bir somut
örnek veriyor: BABS (British Airways Booking System). Burada POS bazlı
paralel yerleştirme (parallel nesting) kullanılıyor ve bir rezervasyon
sınıfı için POS alt sınıfları oluşturuluyor: M için M1, M2, M3 gibi.

Önemli olan bu alt sınıfların statüsü. Kaynak metne göre her biri asıl
rezervasyon sınıfının, yani M'nin birer temsilcisi. Envanter mutabakatı
ve gece bakımı işlemleri, yolcu isim kaydını (PNR) etkilemeden ana sınıf
seviyesinde yapılıyor. Satış anında satış noktasına göre ayrışan
envanter, muhasebe ve bakım anında tekrar tek bir sınıfta birleşiyor.

Yazılım tarafında bunun karşılığı açık bir veri modeli kararı: POS alt
sınıfı satışın kontrol edildiği katmanda var, kaydın tutulduğu katmanda
yok. PNR'a yazılan M; M1, M2, M3 envanterin kendi iç bölümlemesi. Bu
ayrım korunmazsa, POS kuralı her değiştiğinde PNR'lara ve onları okuyan
her aşağı akış sistemine dokunmak gerekiyor. Ayrım korunduğunda satış
noktası kuralları, rezervasyon kaydına dokunmadan değiştirilebiliyor.

## Yarın işe yarayacak dört çıkarım

1. **Nesting yöntemini tahminin tazeliğine göre seç.** Ağ sık optimize
   ediliyor ve tahmin modelleri güncelse threshold nesting gelir
   maksimizasyonu için daha etkin. Belirsizlik alt ve erken satılan
   sınıflardaysa net nesting'in muhafazakârlığı daha güvenli. Üst sınıfa
   son koltuk garantisi verilmişse seçim zaten yapılmış demek: threshold
   nesting.
2. **SCI yerine segment limiti kullan.** SCI iptali görmüyor ve kapattığı
   sınıfı kendiliğinden açmıyor; kapasite kaybı buradan geliyor. İptale
   ve talep değişikliğine tepki verebilen sayısal segment limitleri bu
   kaybı önlüyor. SCI'dan vazgeçilemiyorsa RM'den CRS'e giden güncelleme
   aralığını kısalt.
3. **Net ücret anlaşmasını POS kontrolüyle bağla.** Online kanallar ve web
   süpermarketleriyle yapılan net ücret anlaşmalarında, hangi satış
   noktasının o sınıfa ne kadar erişeceğini POS kontrolleriyle belirle.
   Fiyatı anlaşma, miktarı envanter yönetiyor.
4. **Hiyerarşiyi bozmadan tek basamak kapatabil.** İç içe olmayan segment
   limitleriyle sınıf hiyerarşisini yeniden kurmadan aradaki bir sınıfı
   kapatabilmek, değişen ücret aksiyonlarına hızlı uyum sağlıyor.

Bu bölümde ne yok: korunan koltuk sayısının nasıl hesaplandığı ve talep
tahmininin kendisi (talep tahmini bölümleri), kapasitenin ne kadar
aşılacağının hesabı ("Havacılık ve hizmet sektöründe overbooking
stratejileri ve operasyonel analiz"), rezervasyon sınıflarının ücret
ürünlerine nasıl bağlandığı (ücret ve fiyatlama bölümleri). Bu bölüm o
hesapların çıktısının satış ekranına hangi kuralla indiğini anlatmak
için var.
