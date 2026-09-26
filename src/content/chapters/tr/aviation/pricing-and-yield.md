---
title: "Havayolu fiyatlandırma ve verim yönetimi stratejileri: analitik bir bakış"
domain: "aviation"
summary: "1978'den sonra havayolu fiyatı devletin belirlediği bir sabit olmaktan çıkıp rakibe verilen bir cevaba dönüştü. Bu bölüm fiyatlandırmanın neden reaktif olduğunu, bir fiyat değişikliğinin hangi kapsamda ve hangi gerekçeyle yapıldığını ve o değişikliğin ATPCO ile GDS'ler üzerinden dünyaya nasıl yayıldığını anlatıyor."
audience: "Fiyat dosyalama, ücret kuralı ya da rakip fiyat izleme sistemleriyle çalışan, fiyatlandırmanın gelir yönetiminden nerede ayrıldığını görmek isteyen yazılımcı ve ürün insanı. Deregülasyon bölümünün okunmuş olması işe yarar; SIFL, price matching, marjinal maliyet ve ATPCO metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Gelir yönetimi bölümleri koltuğun kime açık kalacağını anlatıyordu. Bu
bölüm bir adım geriye, o koltuğun üzerindeki fiyatın nereden geldiğine
bakıyor. Kaynak metin iki kavramı baştan ayırıyor: havayolu fiyatlandırması
gelir yönetimi değil, ama ikisini dinamik fiyatlandırma altında birleştirme
çabaları sürüyor. Fiyatlandırma pazara hangi fiyatların sunulacağını
belirliyor; gelir yönetimi o fiyatlardan hangisinin hangi an açık kalacağını.
**Deregülasyondan sonra havayolu fiyatı bir strateji olmaktan çok bir
refleks haline geldi: rakip hareket ediyor, havayolu eşliyor, ve bu cevap
saniyeler içinde bütün dağıtım ağına yayılıyor.** Bu refleksin nedeni
psikolojik değil, maliyet yapısının kendisi.

![Sunumun kapak slaytı. Açık zemin üzerinde bir dünya haritası; kıtalar arasında havalimanlarını temsil eden koyu noktalar ve onları bağlayan ince, kavisli uçuş hatları. Başlık: Havayolu Fiyatlandırmasının Evrimi ve Dağıtım Ekosistemi. Alt başlık: Regülasyonlardan Küresel Dağıtım Sistemlerine (GDS) Geçiş. Altında: Strateji ve Mimari İncelemesi.](/decks/pricing-and-yield/01.webp "Haritadaki hatların her biri bir fiyat taşıyor ve fiyatların hiçbiri yalnız değişmiyor: bu bölümün konusu o hatların birbirine nasıl bağlı olduğu.")

## Regülasyon fiyatı sabitliyordu, serbestleşme onu segmente böldü

Deregülasyondan önce fiyatı havayolu kurmuyordu. ABD'de Sivil Havacılık
Kurulu (CAB), uluslararası hatlarda IATA, Standart Endüstri Ücret Seviyesi
(SIFL) adı verilen bir çerçeveyle fiyatları belirliyordu. Kâr marjı devlet
tarafından sabitlenmişti; rekabet sınırlıydı ve kârlılık, sunumun deyişiyle,
devlet onaylı gizli anlaşmalarla garanti altındaydı.

Bu düzenin bir yolcu varsayımı vardı. Kaynak metin bunu açıkça söylüyor:
deregülasyon öncesinde hava yolculuğunun yalnızca ayrıcalıklı bir azınlık
için olduğu görüşü yaygındı ve yolcuların çoğu fiyata karşı nispeten
esnek değildi. Fiyata duyarsız bir kitleye tek fiyat satmak mantıklıydı;
fiyatı düşürmek talebi pek büyütmeyecek, yalnızca geliri azaltacaktı.

1978'de ikisi birden değişti. Fiyatlama yetkisi serbest piyasaya geçti ve
fiyat taşıyıcıya özel, esnek, anlık değişen bir şeye dönüştü. Aynı anda
yolcu profili genişledi: daha önce hiç uçmamış, fiyata son derece duyarlı
geniş kitleler pazara girdi. Sonuç, sunumun ifadesiyle, agresif bir pazar
payı savaşı ve segmentlere özel fiyatların patlaması oldu.

![Başlık: 1978 Serbestleşmesi, Fiyatlandırmada Paradigma Değişimi. İki sütunlu karşılaştırma. Sol, gri zeminli sütun, Regüle Dönem (1978 Öncesi): otorite Sivil Havacılık Kurulu (CAB) ve IATA; fiyat modeli SIFL (Standart Endüstri Fiyat Seviyesi) ile devlet tarafından belirlenen sabit kâr marjları; rekabet sınırlı, kârlılık devlet onaylı gizli anlaşmalar ile garanti altında; yolcu profili fiyata duyarsız, ayrıcalıklı ve dar bir kitle. Sağ sütun, Serbestleşme (1978 Sonrası): otorite serbest piyasa dinamikleri; fiyat modeli taşıyıcıya özel, esnek ve anlık değişen fiyatlandırma; rekabet agresif pazar payı savaşı, segmentlere özel fiyatların patlaması; yolcu profili daha önce hiç uçmamış, fiyata son derece duyarlı geniş kitleler.](/decks/pricing-and-yield/02.webp "Dört satırın dördü de aynı anda değişti. Yalnız fiyat modeli değişseydi tek fiyat yeterdi; yolcu profili de değiştiği için fiyat segmentlere bölünmek zorunda kaldı.")

Segmentasyon bu iki değişikliğin kesiştiği yerde doğuyor. Aynı uçakta hem
fiyata duyarsız eski yolcu hem fiyata duyarlı yeni yolcu oturuyor. Birine
göre kurulan tek fiyat ötekini kaybettiriyor: yüksek fiyat yeni kitleyi
uzaklaştırıyor, düşük fiyat eski kitlenin ödemeye hazır olduğu parayı masada
bırakıyor. Çözüm, aynı koltuğa birden fazla fiyat ve her fiyata ayrı bir
kural seti bağlamak. Deregülasyon bölümünde anlatılan gelir yönetiminin
doğuşu bu sorunun envanter tarafıydı; burada görünen fiyat tarafı.

## Fiyat reaktif, çünkü boş koltuk hiçbir şey kazandırmıyor

Havayolu yöneticilerinin fiyatı proaktif olarak yönetip piyasaya liderlik
etmesi beklenirdi. Kaynak metin tersini söylüyor: bir havayolunun fiyat
eylemleri çoğunlukla reaktif ve bu davranış çoğu havayolunun pazar payını
koruma arzusuyla tutarlı. Yani havayolu fiyatı kendisi kurmaktan çok
rakibin fiyatını eşliyor. Buna price matching deniyor.

Bu davranışın gerekçesi maliyet yapısında. Havayolu sermaye ve varlık
yoğun bir sektör; uçak, yakıt ve operasyonel giderler uçuş planlandığı
anda sabitleniyor. Uçağa fazladan bir yolcu eklemenin maliyeti, yani
marjinal maliyet, neredeyse sıfır. Koltuk da bozulabilir bir varlık: uçak
kalktığında satılmamış koltuk sonsuza kadar kayboluyor. Bu iki gerçek bir
araya geldiğinde karar basitleşiyor. Sabit maliyetin karşılanması gerekiyor
ve koltuğu boş bırakmak onu karşılamıyor. Düşük fiyatla bile olsa satılan
koltuk, sabit giderin bir kısmını ödüyor.

![Başlık: Fiyatlandırma Neden Reaktif Bir Süreçtir. Ortada bir tahterevalli: sol ucunda ağır bir yolcu uçağı yere basıyor, sağ ucunda havada tek bir insan figürü duruyor. Sol kutu, Ağır Yük (Sabit Maliyetler): havayolu sermaye ve varlık yoğun bir sektördür, uçak, yakıt ve operasyonel giderler sabittir. Sağ kutu, Hafif Yük (Marjinal Maliyet): uçağa fazladan tek bir yolcu eklemenin maliyeti neredeyse sıfırdır. Alttaki kutu: temel hedef pazar payını korumak ve sabit giderleri ödemek; piyasa davranışı (price matching), proaktif fiyat liderliği yerine rakiplerin fiyatlarına anında yanıt verme zorunluluğu.](/decks/pricing-and-yield/03.webp "Tahterevallinin dengesizliği kararı açıklıyor: sağ taraftaki yolcunun getireceği her kuruş, sol taraftaki sabit yükün bir parçasını kaldırıyor.")

Rakip bir fiyat indirimi başlattığında sorulacak soru şu: sistem bu fiyatı
otomatik olarak eşlemeli mi, yoksa önce gelir kaybı riskini mi hesaplamalı?
Brifingin iş mantığı cevabı net: havayolu pazar payını korumak için gelir
etkisine bakılmaksızın rakip fiyatını eşliyor. Pazar payını elde tutma
arzusu, gelir maksimizasyonunun önüne geçebiliyor. Kapanış slaytı aynı şeyi
daha çıplak söylüyor: uçuş maliyeti sabit olduğundan, rakipten 1 dolar
ucuza bile olsa o koltuğu satmak hayati önem taşıyor.

Bu kuralın bir istisnası var. Havayolunun hâlihazırda devam eden bir satışı
ya da promosyonu, rakibin yeni sunduğu teşvikten daha cazipse, sistem
eşleme yapmama kararı alabiliyor. Eşlemenin amacı rakibin gerisinde
kalmamak; zaten önündeyse eşleme gelirden vazgeçmekten başka bir şey
getirmiyor.

Yazılım tarafında bunun karşılığı şu: rakip fiyat izleme sisteminin
çıktısı bir rapor değil, bir tetikleyici. Varsayılan eylem eşleme; önündeki
tek koruma da havayolunun kendi aktif kampanyalarıyla yapılan bir
karşılaştırma. Bu karşılaştırmayı yapabilmek için sistemin, aynı pazardaki
kendi promosyonlarının güncel durumunu rakip fiyatla aynı anda görmesi
gerekiyor. Rakip fiyatı gören ama kendi kampanyasını görmeyen bir motor,
zaten daha ucuz olduğu pazarda gereksiz yere fiyat kırar.

## Fiyat değişikliğinin kapsamı, gerekçesini ele veriyor

Her fiyat değişikliği aynı türden değil. Kaynak metin iki temel tür
ayırıyor: bölgesel ya da sistem genelinde değişiklikler ve pazara özel
değişiklikler. Ayrımın ölçütü, değişikliği neyin tetiklediği.

Sistem genelindeki değişiklikler genellikle enflasyon ya da genel maliyet
odaklı: ağ çapında bir zam, genel bir satış kampanyası, ağ çapında bir
indirim. Bunlara piyasanın tepkisi hızlı; rakipler çok daha iyi bir
alternatif kampanyaları yoksa bu değişiklikleri anında eşliyor.

Pazara özel değişikliklerin gerekçesi farklı. Brifing üç neden sayıyor:
talebi canlandırmak (demand stimulation), havayolunun o pazardaki
hakimiyeti ve uçuş programındaki hizmet değişiklikleri. Bu tür
değişiklik tek bir taşıyıcının stratejik hamlesiyle başlıyor ve bir
kaskad etkisi yaratıyor: rakipler gelir kaybına bakılmaksızın pazar payını
korumak için aynı şekilde yanıt veriyor, pazarda bir dalgalanma oluşuyor.

![Başlık: Fiyat Değişikliklerinin İki Temel Türü. İki kart yan yana. Sol kart, dünya küresi simgesiyle, Bölgesel veya Sistem Geneli: kapsam, genel satış kampanyaları veya ağ çapında (network-wide) indirim/zamlar; piyasa tepkisi, rakipler tarafından anında eşleştirilir (çok daha iyi bir alternatif kampanya yoksa). Sağ kart, kesişen uçuş hatları üzerinde turuncu bir konum işaretiyle, Pazara Özel (Market-Specific): tetikleyici, tek bir taşıyıcının stratejik hamlesi; temel nedenler, bölgesel talebi canlandırmak, pazardaki hakimiyeti artırmak, hizmet değişikliklerini yansıtmak; kaskad etkisi, gelir kaybına bakılmaksızın rakipler pazar payını korumak için aynı şekilde yanıt verir ve dalgalanma yaratır.](/decks/pricing-and-yield/04.webp "Sol karttaki parantez, önceki bölümdeki istisnanın aynısı: daha iyi bir kampanya varsa eşleme yok. Sağ kartta böyle bir parantez yok.")

Hakimiyet kavramı burada ayrıca önemli. Bir havayolu belirli bir rotada
dominant olduğunda, fiyat liderliğini sürdürmek için tetikleyici rolünü
üstleniyor; diğer taşıyıcılar kendi fiyatlarını bu havayolunun eylemlerine
göre konumlandırıyor. Yani reaktif bir sektörde bile her pazarda biri
harekete ilk geçiyor ve bu kişi genellikle o pazarda en büyük olan.
Algoritma açısından bu, rakiplerin eşit ağırlıkta olmadığı anlamına
geliyor: dominant taşıyıcının hamlesi pazarı yeniden kuruyor, küçük bir
oyuncunun hamlesi kurmayabiliyor.

Bir fiyat değişikliğini modellerken kapsam alanı bu yüzden süs değil.
Aynı indirim sistem genelinde bir kampanyanın parçasıysa bir anlama, tek
bir pazarda hakimiyet hamlesiyse başka bir anlama geliyor ve rakiplerin
vereceği tepki de ona göre değişiyor.

## Kısıtlamalar indirimi fiyata duyarsız yolcudan koruyor

Düşük fiyat pazar payını koruyorsa, neden herkese düşük fiyat
verilmiyor? Çünkü o zaman fiyata duyarsız yolcu da düşük fiyatı alıyor.
Fiyat kurallarındaki kısıtlamalar, satın alma süresi ve seyahat
kısıtlamaları gibi, tam bu sızıntıyı engellemek için kurgulanıyor.
Brifingin ifadesiyle amaç, fiyat esnekliği düşük olan yolcuyu daha yüksek
ücretli sınıflara yönlendirmek ve farklı müşteri segmentleri için farklı
değer önerileri oluşturmak.

Mantık, deregülasyonun ürettiği ikili yolcu profiline doğrudan cevap
veriyor. Tatil yolcusu erken satın almaya ve kısıtlamaya razı; iş yolcusu
esneklik istiyor ve bunun için ödüyor. Kısıtlama, iki segmenti fiyat
etiketine değil davranışa göre ayırmanın yolu. Bu yüzden kural seti ücretin
kendisi kadar önemli: kuralı olmayan düşük ücret, bir segmentasyon aracı
değil, genel bir indirim.

Yazılım tarafında bunun anlamı, ücretin tek başına bir sayı olmadığı.
Ücret, kendisini kimin alabileceğini tanımlayan kurallarla birlikte
yaşıyor. Fiyatı değiştirip kuralını değiştirmeyen bir süreç, segmentler
arasındaki çiti bilmeden yerinden oynatabilir.

## Fiyatı havayolu kuruyor, ama dünyaya ATPCO dağıtıyor

Bir havayolunun fiyat kararı kendi sisteminde kalsaydı reaktif
fiyatlandırma yavaş ve yerel olurdu. Öyle değil. Fiyatlandırma kararları
karmaşık bir veri ağında hareket ediyor ve akış dört adımdan oluşuyor.
Taşıyıcı önce kısıtlamaları ve seyahat kurallarını kendi sisteminde
belirliyor. Fiyatlar sonra ATPCO ya da SITA gibi bir takas odasına, yani
veri toplayıcıya yükleniyor; buna filing, dosyalama deniyor. Veriler
oradan Amadeus, Sabre, Travelport ve TOPAS gibi küresel dağıtım
sistemlerine yayınlanıyor. Son adımda GDS'ler fiyat kurallarını işleyerek
satış noktasındaki acenteye bir fiyat teklifi (quote) üretiyor.

![Başlık: Havayolu Fiyat Yönetimi ve Dağıtım Akışı (Mimari Görünüm). Soldan sağa oklarla bağlı dört kutu. 1. Havayolu (Oluşturma), uçak kuyruğu simgesi: taşıyıcı kısıtlamaları ve seyahat kurallarını kendi sisteminde belirler. 2. Takas Odası (Aggregator), sunucu ve veritabanı simgesi: fiyatlar ATPCO veya SITA gibi veri toplayıcılarına yüklenir (file edilir). 3. GDS (Dağıtım), çanak anten simgesi: veriler küresel dağıtım sistemlerine yayınlanır; Amadeus, Sabre, Travelport, TOPAS. 4. POS (Satış Noktası), bilgisayar ekranı simgesi: GDS'ler fiyat kurallarını işleyerek acentelere fiyat teklifi (quote) üretir.](/decks/pricing-and-yield/05.webp "Teklifi üreten havayolu değil, dördüncü kutu: acentenin gördüğü fiyat, havayolunun dosyaladığı kuralın GDS tarafından yorumlanmış hali.")

Bu akışın merkezinde ATPCO duruyor ve kaynak metin ağırlığını sayılarla
veriyor: dünyadaki fiyat dosyalamalarının yüzde 87'si ATPCO üzerinden
yapılıyor ve veritabanında 223 milyondan fazla fiyat bulunuyor. Sunum buna
bir sayı daha ekliyor: dünya çapında 400'den fazla havayoluna takas
hizmeti veriliyor. ATPCO havayollarının ortak mülkiyetinde; günlük fiyat
konsolidasyonu yaparak uçtan uca bütün GDS ve rezervasyon ekosistemini
besliyor.

![Başlık: Dağıtımın Merkezindeki Güç, ATPCO. Ortada iç içe dairelerden oluşan bir göbek, üzerinde ATPCO/SITA yazıyor; göbekten dışarı uzanan kollar üç büyük sayıya bağlanıyor. Sol üst: yüzde 87, dünya çapındaki küresel fiyat yüklemelerinin (filing) pazardaki payı. Sağ üst: 223 milyon+, sistemde aktif olarak tutulan devasa fiyat veri tabanı. Sol alt: 400+, dünya çapında takas hizmeti (clearing house) verilen havayolu sayısı. Sağ alt kutu, Sektörün Omurgası: ATPCO havayollarının ortak mülkiyetindedir, günlük fiyat konsolidasyonu yaparak uçtan uca tüm GDS ve rezervasyon ekosistemini besler.](/decks/pricing-and-yield/06.webp "Rakipler aynı merkezden besleniyor: bir havayolunun dosyaladığı fiyat, eşleme kararını verecek rakibin önüne de aynı kanaldan düşüyor.")

Bu merkeziyetçiliğin fiyatlandırma davranışına iki etkisi var. Birincisi
görünürlük: bütün taşıyıcıların fiyatları aynı havuzda toplandığı için bir
havayolunun indirimi rakiplerin gözünden kaçmıyor. Reaktif fiyatlandırma
bu görünürlük olmadan işlemezdi. İkincisi hız: brifingin dağıtım
verimliliği çıkarımı, ATPCO ve SITA gibi merkezi otoritelerle olan
entegrasyonun hızını ve doğruluğunu pazar payını korumak adına kritik bir
operasyonel zorunluluk olarak tanımlıyor. Rakibin fiyatını doğru tespit edip
eşleme kararı vermek yetmiyor; o kararın dosyalanıp GDS'lere ulaşması da
gerekiyor. Dosyalama hattı yavaşsa, karar ne kadar doğru olursa olsun
pazar o arada rakibe kayıyor.

Mühendislik açısından bu, fiyatlandırma sisteminin sınırının havayolunun
kendi sunucularında bitmediği anlamına geliyor. Fiyatın doğru olup olmadığı,
dosyalanan kuralın dört adım sonra GDS'de doğru yorumlanıp yorumlanmadığıyla
ölçülüyor. Havayolunun kendi ekranında gördüğü fiyatla acentenin aldığı
teklif arasında iki aracı ve bir kural yorumlama adımı var.

## Fiyatlandırma tek bir karar değil, bir ağ etkisi

Bütün bu parçalar birleşince fiyatlandırma kapalı bir döngüye dönüşüyor.
Sunumun kapanış slaytı döngüyü dört durakla çiziyor. Miras: sektör 1978'den
bu yana kâr garantisinden pazar payı savunmasına geçti. Ekonomik zorunluluk:
uçuş maliyeti sabit olduğu için koltuğu rakipten 1 dolar ucuza bile olsa
satmak hayati. Dağıtımın hızı: bir havayolu fiyatı değiştirdiği an, bilgi
ATPCO ve GDS'ler aracılığıyla bütün küresel ağa yayılıyor. Mekanik
reaksiyon: fiyatlandırma izole bir strateji değil, binlerce sistemin
saniyeler içinde kaskad reaksiyon verdiği bir ağ etkisi.

![Başlık: Fiyatlandırma Döngüsü, Ağ Etkisi ve Gelecek. Saat yönünde dönen oklarla birbirine bağlı dört kutudan oluşan bir çember. Üst, Miras (1978'den Bugüne): sektör, kâr garantisinden pazar payı savunmasına geçmiştir. Sağ, Ekonomik Zorunluluk: uçuş maliyeti sabit olduğundan, rakipten 1 dolar ucuza bile olsa o koltuğu satmak hayati önem taşır. Alt, Dağıtımın Hızı: bir havayolu fiyatı değiştirdiği an, ATPCO ve GDS'ler aracılığıyla bilgi tüm küresel ağa anında yayılır. Sol, Mekanik Reaksiyon: fiyatlandırma izole bir strateji değil, binlerce sistemin saniyeler içinde kaskad reaksiyon verdiği bir ağ etkisidir.](/decks/pricing-and-yield/07.webp "Döngünün başı yok: rakibin fiyatı bir havayolunun girdisi, o havayolunun cevabı da bir sonraki rakibin girdisi oluyor.")

Döngünün pratik sonucu, tek bir fiyat kararının yerel etkisinin
hesaplanamayacak olması. Bir pazardaki indirim rakiplerin cevabını
tetikliyor, o cevaplar başka pazarlarda başka cevapları. Fiyatlandırma
sistemi rakibin hamlesini girdi olarak aldığı gibi, kendi hamlesinin de
başkalarının girdisi olacağını hesaba katmak zorunda.

Başa dönersek, kaynak metnin fiyatlandırma ile gelir yönetimi arasına
koyduğu ayrım bu döngüde anlam kazanıyor. Fiyatlandırma döngüsü dışa bakıyor:
rakibe, pazara, dağıtım ağına. Gelir yönetimi içe bakıyor: bu uçuşta, bu
fiyatlar arasından hangisinin açık kalacağına. İkisini dinamik
fiyatlandırma altında birleştirme çabası, bu iki bakışı aynı karar
motorunda buluşturma çabası.

## Yarın işe yarayacak dört çıkarım

1. **Rakip fiyatı izleyen sistemi rapor değil, tetikleyici olarak kur.**
   Brifingin önerisi, rakip hamlelerini anlık izleyip otomatik tepki
   verebilen reaktif sistemlere yatırım yapmak. Varsayılan eylem eşleme;
   eşlememe kararı için havayolunun kendi aktif kampanyasının daha cazip
   olup olmadığını aynı anda kontrol et.
2. **Her segment için ayrı kural seti tut.** Deregülasyon sonrası genişleyen
   yolcu profili, iş ve tatil gibi segmentlere farklı kısıtlama ve kural
   setleriyle hitap eden ücret yapıları gerektiriyor. Kuralı olmayan düşük
   ücret fiyata duyarsız yolcuya da sızar.
3. **Dosyalama hattını pazar payı altyapısı olarak gör.** ATPCO ve SITA ile
   entegrasyonun hızı ve doğruluğu operasyonel bir zorunluluk. Doğru eşleme
   kararı, GDS'lere geç ulaştığında pazar payını korumuyor.
4. **Kararı marjinal maliyet üzerinden ver.** Boş koltuğun maliyeti ile
   düşük ücretli satış arasındaki dengeyi sürekli optimize et. Sabit maliyet
   uçuş planlandığında ödenmiş sayılır; soru, o koltuktan uçak kalkmadan
   önce ne alınabileceği.

Bu bölümde ne yok: fiyatların ardındaki koltuk kontrolü ve kısıtlı indirimin
mekanizması (gelir yönetimi bölümleri), ATPCO ve SITA'nın standart ve
yönetişim tarafı ("Havacılık endüstri standartları ve yönetişim: stratejik
analiz belgesi") ve fiyatın planlama döngüsündeki yeri ("Havayolu pazarlama
planlama süreci ve iş mantığı analizi"). Bu bölüm fiyatın neden reaktif
olduğunu ve o reaksiyonun hangi hat üzerinden yayıldığını anlatmak için
var.
