---
title: "Dinamik sanal gruplama (dynamic virtual nesting) ve gelir yönetimi analizi"
domain: "aviation"
summary: "Sanal gruplamada her rota bir sepete düşer ve sepetin koltuk hakkını paylaşır; dinamik sanal gruplama o sepetin hangisi olacağını tabloya bakarak değil, uygunluk sorgusu geldiği anda gece hesaplanmış aralıklara göre seçer. Bu bölüm kararın neden sorgu anına taşındığını, aynı sepete düşen iki ücretin neden birbirinin koltuğunu çalabildiğini ve sepet sınırlarının neden eşit trafikle değil dinamik programlamayla çizilmesi gerektiğini anlatıyor."
audience: "Envanter, uygunluk (availability) ya da O&D kontrol sistemleriyle çalışan, bir rotanın hangi kovaya neden düştüğünü anlamak isteyen yazılımcı ve analist. Gelir yönetimi ve O&D tahmin bölümlerinin okunmuş olması işe yarar; sepet (bucket), sanal gruplama, CER, deplasman, eşit trafik sezgiseli, bitişiklik özelliği ve dual/multi-indexing metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Gelir yönetimi bölümleri koltuğun kime satılacağını ücret sınıfları
üzerinden anlatıyordu: her sınıfın bir limiti var, pahalı sınıf ucuzun
koltuğunu kullanabiliyor, tersi olmuyor. O&D dünyasında bu yapı çatlıyor.
Aynı uçuş bacağında yüzlerce farklı rota ve ücret kombinasyonu satılıyor
ve bunların her birine ayrı bir limit vermek mümkün değil. Çözüm, rotaları
değerine göre az sayıda sanal sepete (bucket) toplamak ve limitleri o
sepetlere koymak. Buna sanal gruplama (virtual nesting) deniyor. Bu bölüm
onun dinamik halini anlatıyor. **Sanal gruplamada gelir, sepet sayısından
değil sepet sınırlarının nereye çizildiğinden çıkar; yanlış çizilmiş bir
sınır, düşük ücretli yolcunun yüksek ücretlinin koltuğunu meşru olarak
almasına izin verir.**

Kaynak metnin yönetici özeti iki iddia taşıyor. Birincisi, dinamik sanal
gruplama envanter kararını talep anında veriyor ve bu havayoluna esneklik
kazandırıyor. İkincisi, sepet sınırlarını optimal çizen bir indeksleme
modeli havayolu ağlarında yaklaşık yüzde 0,5 civarında doğrudan gelir
artışı sağlayabiliyor. Metin bunu American Airlines gibi büyük
taşıyıcıların kullandığı dinamik programlama algoritmaları üzerinden
anlatıyor ve aynı mantığın otel ve araç kiralamaya taşınabileceğini
söylüyor. Bölümün geri kalanı bu iki iddianın mekanizması.

## Sepet kararı rezervasyon tablosunda değil, sorgu anında veriliyor

Statik sanal gruplamada bir rotanın hangi sepete düştüğü önceden
hesaplanıp saklanıyor. Rota ile sepet arasında bir eşleme tablosu var;
uygunluk sorgusu gelince sistem tabloya bakıyor, sepeti buluyor, o
sepette koltuk kalıp kalmadığını söylüyor. Tablo ne zaman güncellendiyse
o günün dünyasını yansıtıyor.

Dinamik sanal gruplamada bu tablo yok. Kaynak metin farkı tek cümleyle
koyuyor: belirli bir rota için sepet indeksinin belirlenmesi dinamik ve
uygunluk talep edildiği anda yapılıyor. Karar iki girdiden çıkıyor.
Birincisi rotanın CER değeri (Contribution-to-Earnings Ratio), yani o
rotanın katkısını ifade eden sayı. İkincisi, gece çalışan toplu
işlemde (batch) hesaplanmış CER aralıkları. Sorgu geldiğinde sistem
rotanın CER'ini hesaplıyor, hangi aralığa düştüğüne bakıyor, sepeti
oradan seçiyor.

Yazılım tarafında bunun karşılığı ağır ve hafif işin ayrılması. Ağır iş,
yani aralıkların nereden geçeceğinin optimizasyonu, gece ve toplu olarak
yapılıyor. Hafif iş, yani bir sayının hangi aralığa düştüğünü bulmak,
her uygunluk sorgusunda gerçek zamanlı yapılıyor. Statik veri deposu
ortadan kalkıyor ama yerine iki şey geliyor: gece üretilen aralıkların
sorgu yoluna güvenli biçimde yüklenmesi ve sorgu anında CER hesabının
ucuz kalması. Look-to-book oranının yüksek olduğu bir dünyada bu hesap
her aramada yapılıyor; pahalı olursa dinamikliğin faydası kapasite
maliyetine gidiyor.

Kaynak metin optimizasyonun operasyona nereden bağlandığını da söylüyor:
optimizasyon algoritmasından gelen indeksleme önerileri, gerçek zamanlı
O&D kontrolü için ana bilgisayar üzerindeki merkezi rezervasyon sisteminde
(CRS) saklanıyor. Yani matematik bir analiz ortamında dönüyor, sonucu ise
envanterin gerçekten yaşadığı yere, CRS'e yazılıyor. İki sistem arasındaki
sözleşme aralık tablosunun kendisi.

## Birden fazla bacak, birden fazla indeks demek

Tek bacaklı bir rotada sepet seçimi tek bir karar. Ama bir O&D rotası
çoğu zaman birden fazla uçuş bacağından geçiyor ve her bacağın kendi
envanteri, kendi doluluğu var. Aktarmalı bir yolcu, iki ayrı uçağın
iki ayrı sepetinden koltuk istiyor.

Sistem bunu her bacak için ayrı bir sanal gruplama aralığı tanımlayarak
çözüyor. İki bacaklı rotalarda buna dual indexing, ikiden fazla bacak
içeren rotalarda multi-indexing deniyor. Her bacağın envanter durumu
ayrı ayrı değerlendiriliyor; rota, ancak geçtiği her bacakta düştüğü
sepette yer varsa satılabiliyor.

Buradaki mühendislik çıkarımı açık: aktarmalı bir rotanın uygunluk
cevabı, bacak sayısı kadar bağımsız sepet kontrolünün birleşimi. Bir
bacakta yer olup diğerinde olmaması, rotayı satılamaz yapıyor. Sepet
seçimini tek bir global indeks gibi modelleyen bir tasarım, bu yapıyı
taşıyamıyor; indeks bacak başına tutulmalı.

## Aynı sepete düşen iki ücret birbirinin koltuğunu çalabiliyor

Sepet mantığının zayıf noktası burada. Bir sepetin içine birden fazla
pazar sınıfı (market class) düşüyor ve sepetin içindeki sınıflar
arasında öncelik yok. Kaynak metnin örneği 399 dolarlık ve 299 dolarlık
iki bilet. İkisi de aynı sepete düşmüşse ve sepette tek koltuk
kalmışsa, sistem ilk gelen alır prensibiyle çalışıyor. 299 dolarlık
yolcu önce gelirse koltuğu alıyor; 399 dolarlık yolcu sonra geldiğinde
sepet kapalı.

Bunun adı deplasman (displacement): yüksek değerli rezervasyonun düşük
değerli olan tarafından yerinden edilmesi. Sistem açısından hiçbir kural
çiğnenmemiş oluyor. İki bilet de aynı sepetteydi, sepette yer vardı,
satış yapıldı. Kayıp, sepet sınırının bu iki ücreti aynı yere koymasında.
Kaynak metin bunu açıkça problem olarak tanımlıyor: aynı sanal gruplama
sepeti içinde yüksek değerli rezervasyonların düşük değerli olanlar
tarafından engellenmesi problemini ele almak için optimal bir indeksleme
algoritması geliştirilmiş.

Bu yüzden deplasman bir envanter kontrol hatası değil, bir sınıflandırma
hatası. Sepetin içinde ne kadar kontrol koyarsanız koyun, sepetin
kendisi iki farklı değeri eşit sayıyor. Çözüm sepetin içinde değil,
sepetin sınırında: benzer gelir potansiyeline sahip sınıfları bir araya
getiren bir indeksleme modeliyle sepetlerin sınırlarını matematiksel
olarak yeniden tanımlamak.

## Eşit trafik sezgiseli sepetleri dengeler ama geliri korumaz

Pazar sınıflarını sepetlere dağıtmanın akla gelen ilk yolu eşit trafik
(equal traffic) sezgiseli: her sepete kabaca aynı miktarda trafik düşecek
şekilde sınırları çizmek. Sezgisel olarak mantıklı görünüyor, çünkü her
sepetin limitinin anlamlı bir trafiğe karşılık gelmesini sağlıyor.

Ama bu kriter gelire kördür. Trafiği eşitlerken hangi ücretlerin yan
yana düştüğüne bakmıyor. Yoğun trafikli bir fiyat aralığında sepet dar
kalıyor, seyrek trafikli bir aralıkta ise çok farklı değerdeki ücretler
tek sepete doluşuyor. Deplasman riski en çok orada büyüyor. Kaynak metnin
önerisi eşit trafik yerine, sepet içindeki deplasman maliyetini minimize
eden optimal eşleme algoritmalarını kullanmak. Hedef fonksiyon değişiyor:
dengeli sepet değil, sepet içinde kaybedilen gelirin en az olduğu sepet.

## Sınırları dinamik programlama çiziyor, çünkü gruplar bitişik olmak zorunda

Sepet sınırlarını optimal çizmek bir kombinatorik problem. Kaynak metnin
örneğinde 20 farklı ücret sınıfı 7 sepete dağıtılıyor. Olası gruplamaların
sayısı çok büyük; elle sıralama ya da bütün olasılıkları tek tek sayan
tam sayım (explicit enumeration) ekonomik değil.

Problemi çözülebilir yapan, gruplamanın bir kısıtı. Kaynak metin buna
bitişiklik özelliği (string property) diyor: iki farklı ücret seviyesi
aynı gruptaysa, bu iki değer arasındaki bütün diğer ücretler de aynı
gruba dahil edilmeli. Yani 299 ile 399 aynı sepetteyse, aradaki her
ücret de o sepette. Sepet, sıralı ücret listesinin kesintisiz bir dilimi.

Bu kısıt problemin yapısını değiştiriyor. Artık "20 ücreti 7 kümeye
nasıl dağıtırım" diye sormuyorsunuz, "sıralı bir listeyi 6 kesme
noktasıyla 7 parçaya nasıl bölerim" diye soruyorsunuz. Bu, dinamik
programlamanın klasik biçimi: ilk k ücreti j sepete bölmenin en iyi
maliyeti, daha küçük alt problemlerin en iyi maliyetlerinden kuruluyor.
Kaynak metin bu yaklaşımın saniyeler içinde binlerce senaryoyu optimize
edebildiğini, 1000 farklı ücret ve 10 sepet içeren büyük ölçekli bir
problemin orta sınıf bir sunucuda 1 saniyenin altında çözülebildiğini
söylüyor.

Yazılım tarafında bu rakam önemli bir şeyi söylüyor: sepet sınırlarının
optimizasyonu bir kapasite problemi değil. Gece toplu işinde her bacak
için yeniden çalıştırılabilecek kadar ucuz. O yüzden aralıkları seyrek
güncellemenin gerekçesi hesaplama maliyeti olamaz; güncelleme sıklığını
talebin ne kadar hızlı değiştiği belirlemeli.

Bitişiklik özelliği aynı zamanda bir doğrulama kuralı. Optimizasyon
çıktısını CRS'e yazmadan önce, her sepetin sıralı listede kesintisiz
bir aralık olduğunu kontrol etmek ucuz ve anlamlı bir test. Bu kuralı
bozan bir çıktı, algoritmanın varsayımının dışına çıkıldığını gösteriyor.

## Sepetin değeri ortalama ücret değil, trafikle ağırlıklandırılmış ücret

Bir sepet kurulduktan sonra onu temsil eden tek bir değer gerekiyor:
limit hesabı, deplasman maliyeti ve sepetler arası karşılaştırma bu
değer üzerinden yapılıyor. Kaynak metin burada basit aritmetik
ortalamayı reddediyor. Grubun temsil değeri, içindeki ücretlerin trafik
miktarına göre ağırlıklandırılmış ortalaması (weighted average fare)
olmalı.

Sebep şu: aritmetik ortalama her ücreti eşit sayıyor. Sepette nadiren
satılan yüksek bir ücret ile çok satılan düşük bir ücret varsa, düz
ortalama sepetin değerini olduğundan yüksek gösteriyor. Ağırlıklı
ortalama ise sepetin gerçekten ne getirdiğini, yani gerçek gelir
potansiyelini yansıtıyor. Temsil değeri yanlışsa, doğru çizilmiş
sınırlar bile yanlış limitlere yol açıyor.

## Aynı model otelde oran havuzu, rezervasyonda kontrol noktası

Kaynak metin sepet mantığını havacılığa özgü görmüyor. Otel ve araç
kiralama sektörlerinde sanal sepetin karşılığı oran kategorileri (rate
categories) ya da oran havuzları (rate pools). Talep tahmini ve envanter
optimizasyonu bu birimler üzerinden yürüyor. Havayolları için geliştirilen
model, otellerde talep tahmini ve gelir karması optimizasyonu için
doğrudan bir araç olarak kullanılabiliyor.

Modelin ikinci kullanımı envanter kontrolünün dışında. İndeksleme modeli
rezervasyon sistemlerinde gerçek zamanlı bir kontrol noktası olarak da
çalışıyor ve ücret baz kodlarının (fare basis code) rezervasyon
sınıflarıyla (booking class) değer bazlı olarak yeniden eşleştirilmesinde
(realignment) kullanılıyor. Ücret bölümlerinde anlatılan fare basis ile
booking class arasındaki eşleme çoğu zaman elle ve kurallarla
kuruluyordu. Burada aynı eşleme bir değer optimizasyonunun çıktısı
oluyor: hangi ücretin hangi sınıfa gideceğini, sınıfların hangi değer
aralığını temsil ettiği belirliyor.

Yazılım tarafında bunun anlamı, sepet aralıklarının tek bir tüketicisi
olmaması. Uygunluk motoru onları sepet seçimi için, ücret yönetimi
sistemi sınıf eşlemesi için kullanıyor. Aralık tablosu bir iç veri yapısı
değil, birden fazla sistemin okuduğu bir sözleşme; sürümlenmesi ve
yayınlanması ona göre tasarlanmalı.

## Yarın işe yarayacak beş çıkarım

1. **Sepet kararını sorgu anına taşı, optimizasyonu gecede bırak.**
   Rota ile sepet arasında statik bir tablo tutma. Gece toplu işte CER
   aralıklarını hesapla, uygunluk sorgusu geldiğinde rotanın CER'ini bu
   aralıklarla kıyasla. Sorgu yolundaki hesabı ucuz tut; yüksek
   look-to-book trafiğinde her aramada çalışıyor.
2. **İndeksi bacak başına tut.** Aktarmalı rotalarda her bacak için ayrı
   sanal gruplama aralığı tanımla; iki bacakta dual, daha fazlasında
   multi-indexing. Rotanın uygunluğu, her bacaktaki sepet kontrolünün
   birleşimi.
3. **Sepet sınırlarını eşit trafikle değil deplasman maliyetiyle çiz.**
   Hedef dengeli sepet değil, sepet içinde düşük ücretin yüksek ücreti
   yerinden etmesiyle kaybedilen gelirin en aza indiği sepet. Kaynak
   metne göre optimal indeksleme yaklaşık yüzde 0,5 doğrudan gelir
   artışı getirebiliyor.
4. **Bitişiklik özelliğini koru ve dinamik programlamayla çöz.** Aynı
   gruptaki iki ücretin arasındaki her ücret de o grupta olmalı. Bu kısıt
   problemi sıralı bir listeyi bölmeye indiriyor; 1000 ücret ve 10 sepet
   orta sınıf bir sunucuda 1 saniyenin altında çözülüyor. Tam sayıma ya
   da elle sıralamaya gerek yok, çıktıyı da bu kurala göre doğrula.
5. **Sepetin değerini trafikle ağırlıklandır.** Grubu temsil eden ücreti
   aritmetik ortalamayla değil, trafik ağırlıklı ortalamayla hesapla.
   Aynı aralık tablosunu fare basis ile booking class eşlemesinde de
   kullanacaksan, onu sürümlenen bir sözleşme olarak yayınla.

Bu bölümde ne yok: sepet limitlerinin, yani her sepete kaç koltuk
açılacağının nasıl hesaplandığı; CER değerinin arkasındaki deplasman
maliyetinin ağ genelinde nasıl tahmin edildiği; ve bu kararların
girdisi olan O&D talep tahmini. Tahmin tarafı "O&D talep tahmini:
birinci ve ikinci nesil yaklaşımlar" ve "O&D tahminleme ve must-forecast
listesi" bölümlerinde; koltuk fazlasının kapasiteye nasıl eklendiği
overbooking bölümlerinde. Bu bölüm yalnızca bir rotanın hangi sepete
düştüğünü ve o sepetin sınırlarının nereden geçmesi gerektiğini
anlatmak için var.
