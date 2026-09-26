---
title: "Rezervasyon envanter kontrolü ve gelir yönetimi"
domain: "aviation"
summary: "Gelir yönetimi sisteminin ürettiği her tavsiye, sonunda rezervasyon sistemindeki bir sınıfın açık ya da kapalı olmasına dönüşür. Bu bölüm o dönüşümün üç biçimini anlatıyor: sınıfları birbirinden bağımsız tutan non-nested kontrol, her şeyi en üst sınıfın içine koyan paralel yuvalama ve sınıfları değer sırasıyla iç içe dizen seri yuvalama. Ortak kural tek: düşük değerli sınıf, yüksek değerli sınıf kapalıyken açık kalamaz."
audience: "Envanter, rezervasyon ya da gelir yönetimi sistemleriyle çalışan, RMS'ten çıkan sayının CRS'te hangi kurala dönüştüğünü anlamak isteyen yazılımcı ve ürün insanı. Overbooking bölümlerinin okunmuş olması işe yarar; yuvalama (nesting), non-nested, paralel ve seri yuvalama, revenue dilution ve segment kapatma göstergesi metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler bir uçuşa kaç rezervasyon kabul edileceğini anlatıyordu:
show-up oranı, varyans, overbooking limiti. Bu bölüm o limitin içinin nasıl
bölündüğüne bakıyor. Gelir yönetimi sistemi (RMS) hangi yolcuya ne kadar
koltuk ayrılacağını hesaplıyor, ama hesap kendi başına hiçbir şey satmıyor.
Satışı, merkezi rezervasyon sistemindeki (CRS) envanter kontrolleri yapıyor.
Kaynak metin bunu açıkça söylüyor: envanter kontrolleri, gelir yönetimi
tavsiyelerinin uygulama bileşeni. **Gelir yönetiminin ne kadar iyi olduğu,
tahminin kalitesinden önce envanterin sınıfları hangi hiyerarşiyle
tuttuğuna bağlı; yanlış hiyerarşi en iyi tahmini bile yüksek değerli yolcuyu
kapıdan çeviren bir sisteme dönüştürür.**

## Tavsiye yalnızca CRS'e yazıldığı anda gerçek

RMS ile CRS arasındaki akış bir kez kurulup bırakılan bir aktarım değil.
Standart düzende envanter limitleri günde bir kez güncelleniyor. Uçuş
yeniden optimize edildiğinde ise aynı gün içinde birkaç kez daha. Amaç
kapasiteyi talebe göre neredeyse anlık yönetebilmek: sabah satışlar
beklenenden hızlı gittiyse akşam tavsiyesi değişiyor ve bu değişiklik
ertesi güne kalmadan satış kanalına yansımalı.

Yazılım tarafında bunun karşılığı şu: RMS'ten CRS'e giden arayüz gece
çalışan bir toplu iş olarak tasarlanırsa, günde birden fazla optimizasyonun
hiçbir değeri kalmaz. Arayüz, uçuş bazında ve gün içinde tekrar tekrar
tetiklenebilen bir güncelleme olarak kurulmalı. Kaynak metnin iş kuralı da
bunu istiyor: CRS'teki envanter limitleri, RMS'ten gelen yeni veriyle,
gerektiğinde günde birden fazla kez, otomatik olarak güncellenmeli. Elle
onaylanan her adım, optimizasyonun hızını insanın hızına indiriyor.

Güncellenen şeyin dış dünyaya nasıl göründüğü de standart. IATA'nın
belirlediği yapıda uçuşun mevcudiyet durumu GDS'lere 26 rezervasyon sınıf
kodu ve bir kabin belirleyicisiyle aktarılıyor. Acentenin ekranında gördüğü
şey, her harf için bir açık ya da kapalı bilgisi ve bir koltuk sayısı. İçeride
kurulan bütün hiyerarşi, o harflerin hangi kurala göre açılıp kapandığı.
Sınıf kodu sayısı sabit; dolayısıyla havayolunun satmak istediği her ücret
ürünü bu 26 harften birine eşlenmek zorunda. Hiyerarşi de o harflerin
üzerine kuruluyor.

## Bağımsız sınıflar, kimsenin istemediği bir sırayla kapanıyor

En sade kontrol biçimi non-nested, yani ilişkisiz envanter. Her rezervasyon
sınıfının kendi kapasitesi var ve sınıflar birbirinden habersiz. Y sınıfına
belli sayıda koltuk, V sınıfına belli sayıda koltuk ayrılıyor; biri
dolduğunda öteki etkilenmiyor.

Sorun tam bu bağımsızlıkta. Y, kısıtlamasız ve en yüksek değerli sınıf. V
ise daha ucuz ve kurallarla kısıtlanmış bir sınıf. Y'nin payı dolup satışa
kapandığında V'nin payında hâlâ koltuk varsa, uçak son koltuklarını ucuz
sınıftan satmaya devam ediyor. Y fiyatını ödemeye razı olan geç gelen iş
yolcusu Y'yi kapalı buluyor; ya V'den alıyor ya da başka havayoluna gidiyor.
İki durumda da havayolu, alabileceği parayı almıyor. Kaynak metin bunun adını
koyuyor: ilişkisiz rezervasyon sınıfları birbirinden bağımsız olduğu için
gelir seyreltmesine (revenue dilution) yol açıyor.

Bu yapının çalışabilmesi için tek bir şart var: her sınıfa gelecek talebin
kesin olarak bilinmesi. Y'ye tam olarak kaç yolcu geleceğini bilseydiniz,
Y'ye tam o kadar koltuk ayırır, kalanını V'ye verirdiniz ve hiçbir yolcu
yanlış sınıfa düşmezdi. Ama talep tahmini bölümlerinin tamamı bu kesinliğin
olmadığını anlatıyor. Belirsizlik altında sabit paylar, her tahmin hatasını
doğrudan gelir kaybına çeviriyor: tahmin düşük kalırsa yüksek değerli yolcu
geri çevriliyor, yüksek kalırsa ayrılan koltuk boş gidiyor. Havayollarının
yuvalanmış sistemlere geçmesinin nedeni bu imkânsızlık.

## Yuvalama, sınıflar arasındaki ilişkiyi kuralın içine yazıyor

Yuvalama (nesting), sınıfları birbirinden bağımsız paylar olarak değil,
iç içe geçmiş havuzlar olarak tutmak demek. Kaynak metin amacı tek cümleyle
tanımlıyor: hiyerarşideki daha düşük değerli bir rezervasyon sınıfının,
daha yüksek değerli bir sınıf satışa kapalıyken satışa sunulmamasını
sağlamak. Non-nested yapının ürettiği mantıksız durum, yani Y kapalıyken V
açık, yuvalanmış yapıda tanım gereği oluşamıyor.

Bu fikrin ne kadar yaygın olduğunu kaynak metin bir oranla veriyor: bugün
faaliyet gösteren yaklaşık 400 havayolundan 50'den azı O&D kontrolü
uyguluyor. Kalan büyük çoğunluk, rezervasyon sisteminde yuvalanmış bacak ya
da segment bazlı envanter kontrolleriyle çalışıyor. O&D bölümlerinde
anlatılan yolculuk bazlı optimizasyon ne kadar çok konuşulursa konuşulsun,
sektörün gündelik satışını bu bölümdeki mekanizma yürütüyor. Bir envanter
sistemi yazıyorsanız, müşterilerinizin çoğu bu modeli kullanacak.

Yuvalamanın iki biçimi var ve aralarındaki fark, hiyerarşinin ne kadar
derine indiği.

## Paralel yuvalama yalnızca en üst sınıfı korur

Paralel yuvalamada bütün düşük değerli ve kısıtlı sınıflar (B, M, V, Q) en
yüksek değerli kısıtlamasız sınıfın, Y'nin içinde duruyor. Sistem tek bir
eşitsizliği garanti ediyor: Y'nin mevcudiyeti her zaman alt sınıfların her
birininkinden büyük ya da ona eşit. Alt sınıflardan biri koltuk sattığında
Y'nin havuzundan da düşüyor; Y koltuk sattığında alt sınıfların payı Y'nin
kalanını aşamıyor.

Bunun sonucu şu: son satılan koltuk her zaman Y'den satılabilir durumda.
Uçak dolmaya yaklaştıkça alt sınıflar Y'den önce tükeniyor, Y ise en sona
kalıyor. Geç gelen ve en çok ödeyen yolcu için kapı açık kalıyor.

Kaynak metnin verdiği örnek sayılar bir noktaya dikkat çekiyor: 100
koltukluk bir uçakta Y sınıfına 115 gibi bir değer atanabiliyor. Y'nin
limiti fiziksel kapasiteyi aşıyor ve alt sınıflar bu havuzdan pay alıyor.
Kaynak bu farkın nedenini açmıyor, ama önceki bölümleri okuyan için sayının
kapasiteyle eşit olmak zorunda olmadığı tanıdık bir durum. Yazılım tarafında
çıkarım şu: sınıf limitini fiziksel koltuk sayısıyla sınırlayan bir doğrulama
kuralı, doğru bir konfigürasyonu reddeder. Kısıtlanması gereken, limitin
kapasiteye göre büyüklüğü değil, sınıflar arasındaki sıralama.

Paralel yuvalamanın bıraktığı boşluk da burada. Garanti yalnızca Y'ye karşı
tanımlı. B, M, V ve Q'nun birbirine göre nasıl durduğunu bu model
söylemiyor; hepsi Y'nin içinde ama birbirinin içinde değil. Y açık kaldığı
sürece, M kapalıyken V'nin açık olmasını engelleyen bir kural modelde yok.

## Seri yuvalama aynı garantiyi her basamağa yayar

Seri yuvalamada sınıflar değerlerine göre sıralanıp birbirinin içine
diziliyor: Q, V'nin içinde; V, M'nin içinde; M, B'nin içinde; B, Y'nin
içinde. Her sınıf kendinden bir üsttekinin havuzundan pay alıyor.

Kaynak metin bu yapının dayandığı mantığı şöyle koyuyor: yüksek değerli bir
sınıf satışa kapandığında, ondan daha düşük değerli hiçbir sınıf açık
kalamaz. Paralel yuvalamada bu kural yalnızca Y için geçerliydi; seride her
basamak için geçerli. M kapandığı anda V ve Q da kapanıyor. Satış kanalının
gördüğü tablo her zaman aynı biçimde: yukarıdan aşağıya açık sınıflar, sonra
bir eşik, eşiğin altında kapalı sınıflar. Arada boşluklu bir desen oluşmuyor.

Operasyonda seri yuvalama tek başına bırakılmıyor. Genellikle segment
kapatma göstergeleri (segment close indicators) ya da segment limitleriyle
birlikte kullanılıyor. Yuvalama sınıflar arasındaki ilişkiyi kuruyor; segment
göstergeleri ise o ilişkinin üzerine segment düzeyinde ayrı bir anahtar
ekliyor ve kontrolü daha hassas hale getiriyor. Kaynak metin bu
göstergelerin iç işleyişine girmiyor; bilinmesi gereken, seri yuvalamanın
pratikte bu ek katmanla birlikte çalıştığı.

Paralel ile seri arasındaki seçim, alt sınıflar arasındaki sıranın ne kadar
önemli olduğuna bağlı. İkisi de Y'yi koruyor. Fark, Y'nin altındaki
sınıfların da birbirini koruyup korumadığında.

## Hiyerarşi bir kural değil, bir değişmez

Kaynak metnin iş kuralları listesinin son maddesi, yazılımcı için en somut
olanı: sistem, alt bir sınıfın (örneğin Q) üst bir sınıftan (örneğin Y)
daha fazla kontenjana sahip olduğu ya da üst sınıf kapalıyken alt sınıfın
açık kaldığı durumları otomatik olarak reddetmeli.

Bu cümle bir doğrulama kuralını tarif ediyor ve nerede uygulanacağı önemli.
Envanter limitleri RMS'ten gün içinde birkaç kez geliyor, bazen bir
analistin elle müdahalesiyle değişiyor, bazen bir satış işleminin ardından
yeniden hesaplanıyor. Değişmezi yalnızca tek bir giriş noktasında, örneğin
RMS arayüzünde kontrol etmek, diğer yollardan gelen hatalı durumu içeri
alır. Kural, envanterin her yazımında geçerli olmalı: bir güncelleme sonrası
herhangi bir alt sınıfın mevcudiyeti üstündekini aşıyorsa ya da üst sınıf
kapalıyken alt sınıf açık kalıyorsa, güncelleme reddedilmeli.

Non-nested yapıda bu değişmez kurulamaz, çünkü sınıflar arasında
tanımlanmış bir ilişki yok. Paralel yuvalamada yalnızca Y'ye karşı
kurulabilir. Seri yuvalamada zincirin her halkasında kurulabilir. Bir
anlamda envanter modelinin seçimi, sistemin hangi hatayı yapısal olarak
imkânsız hale getirdiğinin seçimi.

## Yarın işe yarayacak dört çıkarım

1. **Bütün sınıfları değer sırasıyla yuvala.** Gelir seyreltmesini önlemenin
   yolu, rezervasyon sınıflarını değerlerine göre yuvalanmış bir yapıda
   kurmak. Bağımsız paylar ancak talep kesin bilinseydi işe yarardı, ve
   bilinmiyor.
2. **RMS-CRS arayüzünü gün içi güncellemeye göre kur.** Envanter limitleri
   RMS'ten gelen yeni veriyle, gerektiğinde günde birden fazla kez, otomatik
   olarak güncellenmeli. Gece çalışan toplu aktarım, gün içindeki
   optimizasyonu boşa çıkarır.
3. **Son koltuğu Y'ye sakla.** Satış stratejisi, son koltuğun her zaman en
   yüksek değerli ve kısıtlamasız sınıftan satılabilmesini garanti eden
   paralel ya da seri yuvalamaya dayanmalı. Alt sınıflar arasındaki sıra da
   önemliyse seri yuvalamayı seç ve segment kapatma göstergeleriyle destekle.
4. **Hiyerarşi ihlalini her yazımda reddet.** Alt sınıfın üst sınıftan daha
   fazla kontenjana sahip olduğu ya da üst sınıf kapalıyken açık kaldığı
   durumu sistem otomatik olarak reddetmeli. Kontrolü yalnızca RMS
   arayüzüne değil, envantere yazan her yola koy; limiti fiziksel
   kapasiteyle sınırlayan bir kontrol ise ekleme.

Bu bölümde ne yok: bir uçuşa toplamda kaç rezervasyon kabul edileceği
(overbooking bölümleri), sınıf limitlerini besleyen talep tahmini (talep
tahmini bölümleri) ve bacak yerine yolculuk bazında kontrol yapan O&D
yaklaşımı ("O&D talep tahmini: birinci ve ikinci nesil yaklaşımlar"). Bu
bölüm yalnızca RMS'in ürettiği sayının CRS'te hangi hiyerarşiyle tutulduğunu
anlatmak için var.
