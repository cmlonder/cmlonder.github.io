---
title: "Havacılık gelir yönetimi ve envanter kontrol sistemleri: post-process nesting analizi"
domain: "aviation"
summary: "Ağ optimizasyonu ne kadar iyi olursa olsun, önerisi host CRS'te gerçek zamanlı bir müsaitlik ve satış isteğine cevap veremiyorsa bir işe yaramaz. Bu bölüm idealize edilmiş ağ çıktısının hiyerarşik envanter limitlerine nasıl dönüştürüldüğünü, TPF/ALCS kısıtının neden uydu işlemcilerle aşıldığını ve aynı dönemde kriptik ücret kodlarının yerini markalı ailelerin nasıl aldığını anlatıyor."
audience: "Envanter, müsaitlik (availability) ya da teklif motoru üzerinde çalışan ve legacy PSS ile modern RM arasındaki arayüzü anlamak isteyen yazılımcı ve ürün insanı. Overbooking ve sürekli hiyerarşi bölümlerinin okunmuş olması işe yarar; post-process nesting, indirgenmiş maliyet, AVS mesajı, uydu işlemci ve markalı ücret metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler koltuğun kaç kez satılacağını, hangi yolcunun gelip hangisinin
gelmeyeceğini hesapladı. Bu bölüm o hesabın nereye düştüğüne bakıyor.
Gelir yönetimi masada bir optimizasyon modeli çalıştırıyor, ama koltuk bir
başka makinede satılıyor: havayolunun ana rezervasyon sisteminde, yani host
CRS'te. **Bir RM önerisinin değeri, modelin ne kadar zarif olduğuyla değil,
host CRS'teki gerçek zamanlı bir müsaitlik ve satış isteğine karşı
uygulanabilir olup olmadığıyla ölçülür.** Kaynak metin bunu açıkça söylüyor:
gelir yönetimindeki ilerlemeler ancak envanter kontrol önerileri ana CRS
üzerinde gerçek zamanlı müsaitlik ve satış taleplerine karşı
uygulanabildiğinde anlam kazanıyor. Bu bölümün geri kalanı o köprünün nasıl
kurulduğunu, neden pahalı olduğunu ve aynı dönemde ürünün kendisinin nasıl
değiştiğini anlatıyor.

## Ağ modelinin çıktısı envanter değil, envantere çevrilmesi gereken bir sıralama

Endüstrinin geçtiği yol basit bacak bazlı (leg-based) envanterden
menşe-varış (O&D) kontrollerine doğru. Bacak bazlı dünyada her uçuş
bacağının kendi sınıf limitleri var ve karar o bacağın doluluğuna göre
veriliyor. O&D dünyasında ise aynı koltuk, üzerinden geçen farklı
güzergâhlara farklı değerde satılabiliyor ve karar bu değere göre
verilmek isteniyor.

Ağ optimizasyon modeli bu değeri hesaplıyor ama çıktısı idealize edilmiş bir
yapı: her güzergâh ve ücret kombinasyonu için ne kadar kabul edilmesi
gerektiğini söyleyen bir çözüm. Host CRS bunu olduğu gibi okuyamıyor. Arada
bir dönüştürme adımı var ve adı da buradan geliyor: *post-process nesting*,
yani optimizasyondan sonra yapılan hiyerarşi kurma işlemi.

Mantık şöyle. Sistem her bir uçuş bacağı üzerinden akan hizmet sınıflarını
indirgenmiş maliyet (reduced cost) kriterine göre sıralıyor. Bu kriter
ağ modelinin kendi çıktısından geliyor; yani sıralama, host'un bilmediği ağ
bilgisini host'un anlayacağı tek boyuta indiriyor. Sıralama çıktıktan sonra sıralamanın
değişim noktaları belirleniyor ve bu noktalardan hiyerarşik (nested) tahsisat
limitleri kuruluyor. Sonuç, host CRS'in tanıdığı bir şey: iç içe geçmiş sınıf
limitleri.

Yazılım tarafında bunun karşılığı şu: optimizasyon servisi ile envanter
servisi arasındaki sözleşme bir çözüm vektörü değil, bir sıralama ve bu
sıralamadan türetilmiş limit seti. Sıralamayı üreten kod ile limitleri host'a
yazan kod ayrı bileşenler; birincisi hesap, ikincisi çeviri. Çeviri adımı
atlandığında elde host'un okuyamadığı bir optimum kalıyor.

## Geçiş dönemi eski borudan yeni mesaj geçirerek atlatılıyor

O&D kontrollerine tek hamlede geçmek mümkün değil. Kaynak metin iki ara
çözüm tarif ediyor ve ikisi de mevcut altyapıyı yerinde bırakmaya dayanıyor.

Birincisi, hiyerarşik envanter kontrollerinin bacak veya segment bazlı
kontrollerden türetilmesi. Yani host'taki mevcut kontrol yapısı korunuyor,
O&D mantığı onun üzerine bir türetme katmanı olarak oturuyor. Envanter
kaydı değişmiyor; değişen, o kayda yazılan limitlerin nereden hesaplandığı.

İkincisi mesajlaşma tarafında. Teklif fiyatı (bid price) tabanlı mesaj
üretimine alternatif olarak, ana sistem altyapısı üzerinden GDS'lere AVS
(Availability Status) mesajları gönderilebiliyor. AVS, bir sınıfın açık mı
kapalı mı olduğunu dağıtım kanalına bildiren mesaj. GDS'ler bu mesajı
zaten tanıyor; dolayısıyla O&D mantığıyla hesaplanmış bir kapatma kararı,
dağıtım tarafında hiçbir şey değiştirmeden eski kanal üzerinden
iletilebiliyor.

Bu iki çözümün ortak noktası, karar mantığını modernleştirirken arayüzü
dondurmak. Mühendislik açısından bu tanıdık bir desen: iç model değişiyor,
dışarıya açılan sözleşme aynı kalıyor. Bedeli de tanıdık: eski arayüzün
ifade gücü neyse, yeni kararın dışarıya taşınabilen kısmı da o kadar. AVS bir
sınıfı açıp kapatabilir, ama bir talebin değerini taşıyamaz.

## Legacy CRS'te O&D kontrolü bir kayıt genişletme projesidir

Neden doğrudan host'u değiştirmiyorlar? Çünkü host TPF veya ALCS üzerinde
çalışıyor ve bu sistemlerde envanter kaydı bir veri yapısı değil, bir
sözleşme. Kaynak metin zorluğu tek cümleyle koyuyor: eski rezervasyon
sistemlerinde O&D kontrol yeteneğine sahip olmanın zorluğu, envanter
kayıtlarının genişletilmesi ve buna bağlı değişikliklerle gelen yüksek
geliştirme maliyetine katlanmak.

Bu girişimler çok yıllı projeler. Maliyetin kaynağı iki katmanlı. İlki
doğrudan iş: envanter kayıtlarını yeni veri alanlarını taşıyacak şekilde
genişletmek. İkincisi asıl yük: envanter verisine güvenen bütün yan
uygulamaların kapsamlı şekilde test edilmesi. Envanter kaydını okuyan her
program, kayıt düzeni değiştiğinde potansiyel olarak kırılıyor ve bunların
hangileri olduğunu bulmak başlı başına bir iş.

Yazılım tarafından bakınca bu, paylaşılan bir veritabanı şemasını değiştirmeye
çalışmanın büyük ölçekli hali. Kayda bir alan eklemek kolay; o kaydı
okuyan, sabit ofsetlere güvenen, yıllardır dokunulmamış onlarca programın
hiçbirinin bozulmadığını kanıtlamak zor. Maliyeti belirleyen değişikliğin
kendisi değil, değişikliğin dokunduğu yüzey. "SABRE'den PSS'e: bir mimari
neden 60 yıl yaşadı" bölümünde anlatılan dayanıklılığın öbür yüzü bu:
bu kadar uzun yaşayan bir kayıt yapısının etrafında, ona bağımlı bir ekosistem
birikiyor.

## Host'u değiştirmek yerine yanına açık sistem bir işlemci koymak

Bu kısıtı aşmak için izlenen mimari strateji, host CRS'e kanal üzerinden
bağlı, Unix tabanlı uydu kooperatif işlemciler (satellite processors)
kullanmak. O&D müsaitlik ve satış işlemleri bu dış işlemcilerde, açık sistem
ortamında yürütülüyor. Host envanterin kaydını tutmaya devam ediyor, ama
kararı veren mantık artık onun içinde değil.

Tarihsel olarak bu yolu 1997'de Air France ve Sabre'nin Availability
Processor'ı açıyor. Bugün aynı işi yapan güncel ürünler de aynı çizgide:
SabreSonic, Altea Inventory ve PROS RTDP, açık sistem ortamında çalışan
envanter işlemcileri olarak sayılıyor.

Yazılım tarafında bunun karşılığı bir strangler deseni. Legacy sistem
yerinde kalıyor, yeni sorumluluklar onun etrafında büyüyen bir servise
taşınıyor ve host yavaş yavaş kayıt defterine indirgeniyor. Avantajı açık:
çok yıllı bir kayıt genişletme projesine girmeden O&D mantığı devreye
alınabiliyor, üstelik yeni mantık TPF'in değil modern bir ortamın geliştirme
hızıyla evriliyor. Mimari sorusu da açık: iki sistemin aynı envanter
hakkında tutarlı kalması gerekiyor ve kanal bağlantısı bu tutarlılığın
taşındığı yer. Brifing bu tutarlılığın nasıl sağlandığına girmiyor; ama bir
uydu işlemci tasarlıyorsan ilk soracağın soru bu olmalı.

## Sanal hiyerarşiden teklif fiyatına: sınıftan talebe

O&D kontrolünün ilk adımı sanal hiyerarşi (virtual nesting) oldu. American
Airlines, SAS, KLM, United ve Delta bu yaklaşımı 1987 ile 1990'ların başı
arasında devreye aldı. Sanal hiyerarşide her güzergâh ve ücret kombinasyonu
değerine göre sanal kovalara yerleştiriliyor ve kontrol bu kovalar üzerinden
yürüyor. Hâlâ bir sınıf mantığı, sadece sınıflar fiziksel rezervasyon
kodlarından değil değerden türetiliyor.

Bir sonraki adım sürekli hiyerarşi, yani teklif fiyatı (bid price)
kontrolü. American Airlines, Canadian Airlines ve US Airways bu kontrole
1998'de Sabre PSS üzerinde geçti. Tercih edilme sebebi ayrıntı düzeyi:
bid price kontrolü her rezervasyon talebini satış noktasına ve o talebin
anlık değerine göre tek tek değerlendirebiliyor. Kova yok; her istek kendi
değeriyle eşiğe karşı tartılıyor.

Karar kuralı da buradan çıkıyor. Bir satış talebi, değeri sistemin
belirlediği eşik değerin üzerindeyse kabul ediliyor. Eşik, o anki
envanterin fırsat maliyeti. Talebin değeri de artık yalnızca uçağın ne kadar
dolu olduğuna değil, talebin nereden geldiğine, yani satış noktasına
(point of sale) bağlı. Aynı koltuk, aynı güzergâh, farklı satış noktası
farklı karar üretebiliyor.

Yazılım tarafında bu, müsaitlik cevabının bir sınıf tablosu okumasından bir
hesaplamaya dönüşmesi demek. Sanal hiyerarşide müsaitlik servisi bir
kovanın açık olup olmadığına bakıyor; bid price'ta her isteğin değerini
bağlamıyla birlikte hesaplayıp bir eşikle karşılaştırıyor. Satış noktası
isteğin bir parametresi haline geliyor ve eşik değerleri gerçek zamanlı
sorgulanabilir bir veri olarak servisin yanında durmak zorunda. Önceki
paragraftaki uydu işlemcinin anlamı da burada netleşiyor: bu hesaplamayı
her müsaitlik isteğinde yapmak, TPF'in envanter kaydına sığdırmaktan çok
açık bir ortamda koşturmaya uygun bir iş.

## Kriptik ücret kodu tüketiciye değer anlatamaz, marka anlatır

Envanter kontrolü değişirken satılan ürün de değişiyordu. Geleneksel
dünyada bir ücret, sekiz karakterli bir ücret tabanı koduyla (fare basis
code) tanımlanıyor. Bu kod sistem için anlamlı, tüketici için değil. Kodun
içindeki kuralları, iadeyi, değişikliği, bagajı okuyamayan bir yolcu, iki
ücret arasındaki farkı yalnızca fiyattan görüyor ve doğal olarak en ucuzu
seçiyor.

Markalı ücret aileleri bu sorunu çözmek için ortaya çıktı. Kriptik kod yerine
bir marka adı kullanılıyor; kaynak metin örnek olarak Freedom gibi bir adı
veriyor. Marka, arkasındaki hizmet paketini şeffaf hale getiriyor:
müşteri ödediği ücretle aldığı özellikler arasında doğrudan bir bağ
kurabiliyor. Bu, pazarlama kampanyalarının da elini güçlendiriyor, çünkü
bir kod değil bir ürün tanıtılıyor.

Brifing bu ürünlerin öncüleri olarak Air New Zealand, Air Canada ve
Qantas'ı sayıyor ve tarihi 2006 olarak veriyor. Motivasyon da açık: gelir
düşüşünü durdurmak için paketli ürünler başlatmak.

## Marka satışın yönünü aşağıdan yukarıya çevirmekten kurtarıyor

Markalı ürünlerin asıl etkisi satış stratejisinde. Geleneksel model
aşağıdan yukarıya (bottom-up) çalışıyor: sistem en düşük uygun ücreti
gösteriyor ve yolcu oradan yukarı ancak kural kısıtları onu zorlarsa
çıkıyor. Kaynak metin farkı şöyle koyuyor: markalı ürünlerle bir havayolu,
tüketicinin markalı ürünle ilişkilendirdiği özelliklere duyduğu tercihe
dayanarak en düşük uygun ücretten değil, ortadan ya da üstten satış
yapabilir.

Yani koltuk seçimi, bagaj gibi özellikler görünür olduğunda yolcu bir
özelliği istediği için bir üst pakete geçiyor. Bu merchandising: fiyatla
değil, içerikle yönlendirilen satış.

Yazılım tarafında bunun anlamı, arama sonucu ekranının veri modelinin
değişmesi. Bottom-up modelde bir uçuş için tek bir fiyat, en düşüğü,
yeterli. Markalı modelde her uçuş için bir aile satırı döndürmek gerekiyor:
her markanın fiyatı ve her markanın içerdiği özellikler. Karşılaştırma
tablosu ürünün kendisi haline geliyor. Bu, envanter tarafında da bir
soru doğuruyor: markalı ailelerin her biri hangi rezervasyon sınıflarına
eşleniyor ve bir sınıf kapandığında o markanın fiyatı nasıl değişiyor.
Brifing bu eşlemeye girmiyor, ama ikisi aynı müsaitlik cevabının içinde
buluşuyor.

## Yan hizmetin ücretlendirilmesi üç modelden birine oturuyor

Markalı ücret bir paket olduğu için, pakete neyin gireceği ve neyin ayrı
satılacağı sorusu hemen arkasından geliyor. Kaynak metin üç temel model
sayıyor.

Paketli (bundled) modelde hizmetler ödenen ücretin içinde. Ayrıştırılmış
(unbundled, à la carte) modelde ücret yalnızca ulaşımı kapsıyor ve her ek
hizmet ayrı ücretlendiriliyor. Hibrit modelde hizmet paketleri tek tek
almaktan daha ucuza sunuluyor, ama düşük değerli paketi alan yolcuya da ek
hizmet satın alma seçeneği açık bırakılıyor.

Hibrit model iki dünyanın mantığını birleştiriyor: düşük maliyetli
taşıyıcının esnekliğini ve geleneksel taşıyıcının paket avantajını. En alt
paketi alan yolcu bagaj ekleyebiliyor; bagaj, koltuk ve öncelikli check-in
isteyen yolcu ise üst paketi daha ucuza alıyor. Her segmentten yolcuya
satılabilecek bir şey var.

Mühendislik açısından hibrit model en çok iş çıkaran model. Paketli modelde
yan hizmet ücretin bir özelliği; ayrıştırılmış modelde her hizmet ayrı bir
ürün. Hibritte ikisi aynı anda doğru: aynı hizmet hem bir paketin parçası
hem ayrıca satılabilir bir kalem. Fiyat motoru, bir yolcunun sepetindeki
kalemlerin paket fiyatını mı tek tek fiyatlarını mı alacağını bilmek zorunda.
Yan hizmetlerin kendisi "Havayolu ek hizmetleri (ancillaries) ve iş mantığı
analizi" bölümünde ayrıntılı anlatılıyor.

## Envanter ve ürün aynı dönüşümün iki yüzü

Bölümün iki yarısı ilk bakışta ayrı konular gibi duruyor: biri legacy
host'ta O&D kontrolü, öteki kriptik koddan markaya geçiş. Ama ikisi de aynı
yöne itiyor. Bid price, bir talebi satış noktasına ve anlık değerine göre
tekil olarak değerlendiriyor; markalı ürün, yolcunun hangi özelliğe değer
verdiğini görünür kılıp ona göre satış yapıyor. İkisi de kararı sınıftan
alıp talebe, yolcuya taşıyor.

İkisinin de önündeki engel aynı: TPF/ALCS döneminden kalma bir envanter
kaydı ve onun etrafında birikmiş sözleşmeler. Uydu işlemci birinci yarının
cevabı. İkinci yarının cevabı perakendecilik ve NDC
bölümlerinde, teklif yönetimiyle birlikte geliyor.

## Yarın işe yarayacak dört çıkarım

1. **Hibrit merchandising modelini tasarla.** Düşük maliyetli taşıyıcının
   ayrıştırılmış esnekliğini ve geleneksel taşıyıcının paket avantajını aynı
   üründe sun. Fiyat motorunu, aynı hizmetin hem paket içinde hem tek başına
   satılabildiğini varsayarak kur; en alt paketi alan yolcuya da ek hizmet
   yolu açık kalsın.
2. **Host'u yenilemek yerine yanına işlemci koy.** O&D mantığını ve bid
   price hesabını legacy envanter kaydının içine sığdırmaya çalışma; çok
   yıllı kayıt genişletme ve regresyon testi faturası oradan çıkıyor. Açık
   sistemde çalışan bir uydu işlemciyle kararı dışarı al, host'u kayıt
   defteri olarak bırak ve iki sistem arasındaki tutarlılığı ilk tasarım
   sorusu yap.
3. **Bid price'ı satış noktasıyla birlikte değerlendir.** Eşik
   karşılaştırmasını yalnızca uçağın doluluğuna göre değil, isteğin geldiği
   satış noktasının değerine göre yap. Müsaitlik isteğinin sözleşmesinde
   satış noktası birinci sınıf bir parametre olsun.
4. **Kriptik kodu vitrinden kaldır.** Ücret tabanı kodu sistemde kalsın ama
   müşteriye marka ailesiyle konuş: her markanın içerdiği Wi-Fi, öncelikli
   check-in gibi hizmetler arama sonucunda görünür olsun ki satış en düşük
   ücretten değil ortadan ya da üstten başlayabilsin.

Bu bölümde ne yok: bid price'ın ve eşik değerlerin nasıl hesaplandığı
(sürekli hiyerarşi ve envanter kontrolü bölümleri), overbooking limitlerinin
bu hiyerarşiye nasıl eklendiği ("Havacılık ve hizmet sektöründe overbooking
stratejileri ve operasyonel analiz"), host CRS'in kendi tarihi ("SABRE'den
PSS'e: bir mimari neden 60 yıl yaşadı") ve markalı ürünlerin NDC ile teklif
olarak dağıtılması (perakendecilik bölümleri). Bu bölüm, optimizasyonun
çıktısının satışın yapıldığı makineye nasıl ulaştığını ve aynı dönemde
satılan şeyin nasıl yeniden paketlendiğini anlatmak için var.
