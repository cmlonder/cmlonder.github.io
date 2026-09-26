---
title: "Gamma dağılımı ve indirim tahsisi: koruma seviyeleri ve gelir oranları"
domain: "aviation"
summary: "İndirimli koltuk tahsisi bir fiyat kararı değil, garantili düşük geliri daha yüksek ama belirsiz bir gelir için geri çevirme riskidir. Bu bölüm koruma seviyesinin neden yalnızca talep dağılımı ve sınıflar arası gelir oranından çıktığını, Gamma dağılımının geçmiş veriden nasıl parametrelendiğini ve reddedilen talebin upsell ve recapture ile nasıl geri kazanıldığını anlatıyor."
audience: "Envanter, fiyatlandırma ya da gelir yönetimi sistemleriyle çalışan, bir ücret sınıfının neden kapandığını hesabın içinden anlamak isteyen yazılımcı ve analist. Olasılık dağılımına aşinalık işe yarar ama şart değil; indirim tahsisi, koruma seviyesi, gelir oranı, Gamma dağılımı, upsell, recapture ve bacak bazlı kontrol metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler talebin ne kadar olacağını ve kapasiteye sığmayanın ne
kadarının taşacağını tahmin etmekle uğraştı. Bu bölüm o tahminin ilk
kullanıldığı yere geliyor: bir rezervasyon talebi geldiğinde, düşük
ücretli sınıftan koltuk verilip verilmeyeceği kararına. Kaynak metin bu
kararı tek cümleyle tanımlıyor: indirim tahsisi, düşük ücret ödeyen bir
yolcuyu koltuğu daha yüksek ücret ödeyen biriyle doldurma umuduyla geri
çevirerek ek gelir üretmeye yönelik bir risk yönetimi. **İndirim tahsisi
bir fiyat kararı değil, bir risk kararı: elde olan garantili düşük
geliri, olasılığı hesaplanmış daha yüksek bir gelir için geri çevirmek.**
Bu bölüm o hesabın hangi iki girdiyle kurulduğunu, talebin neden Gamma
dağılımıyla modellendiğini ve ret kararının yolcuyu kaybetmekle neden
bitmek zorunda olmadığını anlatıyor.

## Düşük ücretli talebi reddetmek, kesin geliri bir olasılığa takas etmek

Derin indirimli (deep discount) bir rezervasyon talebi geldiğinde sistemin
önünde iki seçenek var. Kabul ederse düşük ama kesin bir gelir elde
ediyor. Reddederse o koltuğu, kalkışa kadar daha yüksek ücret ödeyecek
bir yolcuya satma ihtimalini canlı tutuyor. Karar kuralı da buna göre:
koltuğu şimdi düşük ücretle satmak, gelecekte o koltuğu daha yüksek
fiyata alacak bir yolcunun önünü kesecekse ve bu ihtimal matematiksel
olarak daha kârlıysa, talep reddediliyor.

Bu cümledeki kritik kelime "ihtimal". Reddedilen yolcunun ödeyeceği para
belli; beklenen yüksek ücretli yolcu ise gelmeyebilir. Gelmezse koltuk
boş kalkıyor ve reddedilen düşük gelir de kaybedilmiş oluyor. Yani ret
kararı her seferinde bir bahis. Gelir yönetimini bir kural motoru olarak
değil bir risk yönetimi süreci olarak düşünmenin sebebi bu: tek tek
kararların bir kısmı kaçınılmaz olarak kaybettiriyor, hedef kararların
toplamında beklenen gelirin en yüksek olması.

Yazılım tarafında bunun karşılığı şu: bir ücret sınıfının kapalı olması
"bu fiyattan koltuk yok" demek değil, "bu fiyattan koltuk vermek beklenen
gelir açısından kötü bir bahis" demek. Müsaitlik servisini tasarlarken bu
ayrımı kaybetmemek gerekiyor. Kapalı sınıf fiziksel bir tükenmişlik değil,
bir olasılık hesabının çıktısı; hesabın girdileri değiştiğinde aynı koltuk
aynı fiyattan yeniden açılabilir.

## Çok sınıflı ortamda hedef en yüksek ücret değil, en iyi karışım

Kaynak metnin tanımladığı temel amaç tek bir yolcu tipini maksimize etmek
değil: bir uçuşta tam ücretli (full fare), indirimli (discount) ve derin
indirimli yolcuların optimal karışımını elde edip toplam geliri
maksimize etmek. Uçağı tamamen tam ücretli yolcuya ayırmak, o talep
gelmediğinde boş koltuk üretiyor. Tamamen indirimli yolcuya açmak, gelen
tam ücretli yolcuyu kapıdan çeviriyor. Doğru cevap ikisinin arasında bir
yerde ve o yer uçuştan uçuşa değişiyor.

Dengeyi belirleyen şey, düşük ücretli yolcudan gelecek garantili gelir
ile yüksek ücretli yolcudan gelmesi beklenen muhtemel gelir arasındaki
olasılıksal fark. Bu fark her sınıf çifti için ayrı ayrı hesaplanabilir
ve çok sınıflı bir yapıda karar, en üstteki sınıftan aşağıya doğru her
basamakta aynı soruyla tekrarlanıyor: bu koltuğu bir alttaki sınıfa
bırakmak mı, bir üsttekine saklamak mı daha kârlı?

## Koruma seviyesi yalnızca iki girdiden çıkıyor: talep dağılımı ve gelir oranı

Bu sorunun sayısal cevabı koruma seviyesi (protection level). Koruma
seviyesi, yüksek ücretli bir sınıf için düşük ücretli sınıflara
kapatılan, yani yüksek ücretli talebe saklanan koltuk sayısı. Kaynak
metin iki sınıflı durumu Y (yüksek ücret) ve B (düşük ücret) üzerinden
kuruyor ve hesabın neye dayandığını açıkça sınırlıyor: koruma
değerlerinin hesaplanması tamamen talebin dağılımı ve ilgili sınıfların
gelir oranları tarafından belirleniyor.

Kural şu biçimde yazılıyor: Y sınıfının talebinin korunan koltuk sayısı
x'ten fazla olma olasılığı, iki sınıfın gelir oranına eşit olduğunda
optimal koruma seviyesine ulaşılmış oluyor.

Pr(D > x) = R_B / R_Y

Buradaki mantık marjinal bir karşılaştırma. Y için bir koltuk daha
korumayı düşündüğünü varsay. O koltuğu B'ye satarsan R_B kadar kesin
gelir alıyorsun. Y'ye saklarsan, ancak Y talebi o koltuğa kadar
uzanırsa R_Y alıyorsun; bunun olasılığı Pr(D > x). Korunan koltuk sayısı
arttıkça Y talebinin o kadar yükseğe çıkma olasılığı düşüyor, yani
saklanan her ek koltuğun beklenen değeri azalıyor. Beklenen değer kesin
B gelirinin altına indiği noktada korumayı durdurmak gerekiyor. Eşitlik
o noktayı tanımlıyor.

Bu formülde kapasite, rezervasyon sayısı ya da ücretlerin kendisi yok.
Talebin olasılık dağılımı ve iki ücret arasındaki oran var, o kadar.
Bu, hesabın hem neden basit hem neden kırılgan olduğunu gösteriyor:
basit, çünkü iki girdi yetiyor; kırılgan, çünkü iki girdiden biri,
talep dağılımı, bir tahmin. Önceki bölümlerde anlatılan talep tahmini
ve arındırma işinin tamamı, sonunda bu formülün sol tarafına
giriyor.

## Mutlak fiyat önemsiz, sınıflar arası oranı bilmek yetiyor

Formülün en az sezgisel sonucu, kaynak metnin de altını çizdiği gibi,
mutlak ücret değerlerinin kendi başlarına önemli olmaması. Kaynak metnin
örneği: 1000 ile 700 arasındaki oran 0,70; 100 ile 70 arasındaki oran da
0,70. Talep dağılımı aynıysa ikisi de aynı koruma seviyesini üretiyor.
Karar mekanizmasında önemli olan dolar değeri değil, sınıflar arasındaki
hiyerarşik oran.

Bunun pratik değeri, gerçek bilet değerinin tam bilinmediği yerlerde
ortaya çıkıyor. Kaynak metin özellikle uluslararası pazarları örnek
veriyor: komisyonlar ve ek hükümler yüzünden bir biletin havayoluna net
olarak ne kazandırdığı çoğu zaman kesin olarak bilinemiyor. Mutlak
değere ihtiyaç duyan bir model bu belirsizlik karşısında tıkanırdı.
Oranla çalışan model ise sınıflar arasındaki tahmini gelir oranıyla
yetiniyor ve kaynak metne göre bu, koruma seviyelerini belirlemek için
yeterli ve güvenilir bir yöntem.

Yazılım tarafında bunun karşılığı şu: RM motoruna beslenen ücret
verisinin kesin net tutar olması şart değil, sınıflar arasındaki
oranı doğru taşıması şart. Bu da veri kalitesi kontrolünün nereye
odaklanması gerektiğini değiştiriyor. İki sınıfın ücretinin aynı oranda
yanlış olması koruma seviyesini bozmuyor; birinin yanlış, ötekinin doğru
olması bozuyor. Ücret yüklemesinden sonra yapılacak doğrulama, tek tek
tutarların makul olup olmadığından çok sınıflar arası oranların
beklenen hiyerarşiyi koruyup korumadığına bakmalı.

## Gamma dağılımı, geçmiş verinin ortalaması ve varyansından kuruluyor

Formülün sol tarafı, Pr(D > x), bir talep dağılımı gerektiriyor. Kaynak
metin bu dağılım için Gamma'yı kullanıyor. Gamma dağılımı iki
parametreyle tanımlanıyor, α (şekil) ve β (ölçek), ve ortalaması ile
varyansı bu iki parametreden doğrudan çıkıyor:

μ = αβ
σ² = αβ²

Sistemi otomatikleştirmeyi mümkün kılan şey bu ilişkinin ters
çevrilebilmesi. Geçmiş rezervasyon verisinden bir sınıfın talebinin
ortalaması ve varyansı hesaplandığında, parametreler kapalı formda
bulunuyor:

α = μ² / σ²
β = σ² / μ

Yani bir optimizasyon ya da iteratif uydurma adımı gerekmiyor. Her uçuş,
her sınıf için iki özet istatistik hesaplanıyor, iki bölme işlemiyle
dağılım kuruluyor, dağılımın kuyruk olasılığı gelir oranıyla
karşılaştırılıyor ve koruma seviyesi okunuyor. Binlerce uçuş ve her
birinde birden fazla sınıf çifti için bu hesabın her gece tekrar
yapılabilmesi, parametrizasyonun bu kadar ucuz olmasına bağlı.

Matematiksel bir not: Gamma yalnızca pozitif değerler üzerinde tanımlı
bir dağılım, dolayısıyla negatif talep olasılığı üretmiyor. Varyansı da
ortalamadan bağımsız olarak veriden geliyor; iki parametreli olduğu için
dağılımın hem merkezi hem genişliği ayrı ayrı ayarlanabiliyor.

Yazılım tarafında bunun karşılığı şu: tahmin servisinin koruma
seviyesi hesabına vermesi gereken şey tek bir talep sayısı değil, en az
bir ortalama ve bir varyans. Ortalama tek başına Pr(D > x) sorusuna
cevap veremiyor; aynı ortalamaya sahip iki uçuştan talebi daha oynak
olanda kuyruk olasılığı farklı çıkıyor ve dolayısıyla korunan koltuk
sayısı da farklı. Varyansı hesaplamayan ya da saklamayan bir tahmin
katmanı, üstündeki optimizasyonun yarısını boş bırakmış oluyor.

## Ret kararı yolcuyu kaybetmekle bitmek zorunda değil

Buraya kadar anlatılan model ikili bir karar veriyor: kabul ya da ret.
Kaynak metin bunun eksik olduğunu, karar ağacına iki dalın daha
eklenmesi gerektiğini söylüyor. Düşük ücretli talep reddedildiğinde
yolcu henüz kaybedilmiş değil.

İlk dal upsell. Sistem reddedilen düşük ücret yerine yolcuya daha yüksek
bir ücret sınıfını, örneğin Y sınıfını teklif ediyor. Yolcu kabul ederse
havayolu hem koltuğu satmış hem de düşük ücrete göre gelir artışı elde
etmiş oluyor. Bu, koruma seviyesinin zaten saklamak istediği yüksek
ücretli satışın, başka bir yoldan gelmiş hali.

İkinci dal recapture. Yolcu aynı uçuşta yüksek ücreti de reddederse,
havayolu onu kendi ilk tercihi olmayan ama hâlâ indirimli koltuğu
bulunan alternatif bir uçuşa yönlendiriyor. Amaç yolcunun rakip
havayoluna gitmesini engellemek. Gelir aynı uçuşta değil, havayolunun
ağında kalıyor.

Kaynak metne göre bu iki dalı karar ağacına dahil etmek, dökülen
(spilled) yolcu sayısını azaltırken toplam sistem gelirini artırıyor.
Buradaki "sistem" kelimesi önemli: recapture, tek uçuşun gelirini değil
havayolunun toplam gelirini optimize ediyor. Tek bir uçuşa bakan bir
koruma seviyesi hesabı, reddedilen yolcunun ne kadarının başka bir
uçuşa geçeceğini bilmiyor.

Yazılım tarafında bunun karşılığı şu: müsaitlik cevabı "yok" ile
bitmemeli. Kapalı bir sınıf için dönen cevap, aynı uçuşta açık olan bir
üst sınıfı ve aynı pazarda indirimli sınıfı hâlâ açık olan alternatif
uçuşları taşıyabilmeli. Bu, müsaitlik ile alışveriş (shopping) katmanı
arasındaki sözleşmeyi değiştiriyor: tek bir uçuşun tek bir sınıfını
sorgulayan bir arayüz upsell'i de recapture'ı da ifade edemez.

## Kontrol, uçuşun hangi parçasında uygulandığına göre farklı sonuç veriyor

Koruma seviyesi hesaplandıktan sonra bir yerde uygulanması gerekiyor.
Kaynak metin iki operasyonel seviye sayıyor. Birincisi bacak bazlı
(leg-based) kontrol: koltuk kararı fiziksel uçuş bacağı üzerinde
veriliyor, segment limitleriyle destekleniyor. İkincisi segment sınıfı
(segment class) kontrolü: karar doğrudan yolcunun satın aldığı segment
ve sınıf kombinasyonu üzerinde veriliyor. İkisinin de amacı ağdaki her
uçuş parçasının kârlılığını optimize etmek.

Kaynak metnin çıkarımı, uygulamada ikisinin hibrit kullanımının
karmaşık uçuş ağlarında daha hassas koltuk yönetimi sağladığı. Yani
soru hangisinin doğru olduğu değil; bacak seviyesindeki kapasite
sınırıyla segment seviyesindeki satış kararının aynı anda tutulması.

Yazılım tarafında bunun karşılığı şu: envanter veri modeli koruma
seviyesini tek bir anahtara bağlamamalı. Aynı uçuş için hem bacak hem
segment seviyesinde limit tutabilen, bir satışta ikisini birlikte
güncelleyen bir model, kontrol stratejisi değiştiğinde şema değişikliği
gerektirmiyor.

## Yarın işe yarayacak dört çıkarım

1. **Net ücreti bilmiyorsan oranla çalış.** Komisyonlar ve ek hükümler
   yüzünden biletlerin net değeri bilinmiyorsa, sınıflar arasındaki
   tahmini gelir oranı koruma seviyesini belirlemek için yeterli. Veri
   doğrulamasını tutarlara değil oranların hiyerarşisine odakla.
2. **Gamma parametrelerini veriden kapalı formda üret.** Geçmiş talebin
   ortalamasından ve varyansından α = μ²/σ² ve β = σ²/μ ile dağılımı
   kur. İki özet istatistik ve iki bölme işlemi yetiyor; hesap her gece
   bütün ağ için otomatik tekrarlanabilir. Bunun için tahmin katmanı
   varyansı da üretmeli ve saklamalı.
3. **Karar ağacına upsell ve recapture'ı ekle.** Kabul-ret ikiliğinde
   kalma. Reddedilen düşük ücretli talebe önce aynı uçuşta üst sınıfı,
   o da reddedilirse indirimli koltuğu olan alternatif uçuşu teklif et.
   Dökülen yolcu azalır, gelir havayolunun ağında kalır.
4. **Bacak ve segment kontrolünü birlikte kullan.** Karmaşık ağlarda
   bacak bazlı kontrolü segment bazlı kontrolle hibrit uygula; envanter
   modelini de iki seviyede limit tutabilecek şekilde kur.

Bu bölümde ne yok: talep dağılımının kendisinin nasıl tahmin edildiği ve
kısıtlanmamış talebin nasıl elde edildiği (talep tahmini bölümleri),
reddedilen talebin ne kadarının kaybedildiği (spill bölümleri) ve
kapasitenin üstünde ne kadar rezervasyon kabul edileceği ("Havacılık ve
hizmet sektöründe overbooking stratejileri ve operasyonel analiz"). Bu
bölüm, bu tahminlerin bir koltuğun hangi fiyattan satılacağı kararına
hangi formülle dönüştüğünü anlatmak için var.
