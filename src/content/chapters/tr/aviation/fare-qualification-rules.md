---
title: "Yolcu değerlemesinde ücret kalifikasyon kuralları"
domain: "aviation"
summary: "O&D envanter kontrolü bir koltuk talebini kabul ederken sınıfa değil, o talebin gerçekte ne kadar para getireceğine bakar: kalifiye ücretten yolculuğun geçtiği her bacağın bid price'ını düşer, kalan net katkıdır. Bu bölüm o kalifiye ücretin hangi kurallarla süzüldüğünü, pazar değeri tablosunun neden NDC ile birlikte bir milyar satırı aşıp sürdürülemez hale geldiğini ve yolculuğun başlangıç noktasının dönüş segmentinin kaderini nasıl belirlediğini anlatıyor."
audience: "Müsaitlik (availability) servisi, O&D envanter kontrolü ya da pricing engine entegrasyonu üzerinde çalışan yazılımcı ve ürün insanı. Bid price ve O&D kavramlarını anlatan envanter ve talep tahmini bölümlerinin okunmuş olması işe yarar; net katkı, kalifiye ücret, pazar değeri, POS/PCC ve POC metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing, scale-and-performance]
ai: generated
---

Envanter bölümleri koltuğu bir sınıf merdiveni olarak anlattı: hangi
sınıf açık, hangisi kapalı. O&D kontrolünde soru değişiyor. Sistem artık
"bu sınıfta yer var mı" diye değil, "bu talep bana ne kadar kazandırır"
diye soruyor. Cevabı da bir sayı: net katkı. **O&D envanterinde bir koltuk
talebinin değeri, o talebe hangi ücretin gerçekten uygulanacağını ne kadar
doğru bildiğinle sınırlı; ücret kalifikasyon kuralları o bilginin
kendisi.** Kural yanlış süzülürse formül doğru çalışır ama yanlış sayıyla
çalışır, ve müsaitlik kararı sessizce bozulur.

Bu bölüm dört şeyi anlatıyor: net katkının nasıl hesaplandığı, kalifiye
ücreti hangi kuralların süzdüğü, o ücretin arkasındaki pazar değerinin
nasıl üretildiği ve neden artık eski yolla üretilemediği, son olarak da
yolculuğun nereden başladığının bütün segmentleri nasıl etkilediği.

## Koltuk, sınıfa göre değil net katkıya göre açılıyor

Formül kısa. Sistem ilgili yolculuk ve sınıf için belirlenmiş kalifiye
ücretten, yolculuğun geçtiği bütün uçuş bacaklarının (leg) güncel
rezervasyon durumuna dayanan teklif fiyatlarının (bid price) toplamını
çıkarıyor:

`Net Contribution = Qualified Fare − Σ γj`

Burada γj, j bacağı için geçerli bid price. Sonuç pozitifse ya da
havayolunun belirlediği bir eşiğin üzerindeyse koltuk müsaitlik veriyor;
değilse vermiyor.

Formülün iki tarafı farklı sistemlerden besleniyor ve bu ayrım önemli.
Sağ taraf, yani bid price'lar, envanter optimizasyonunun ürünü; her bacağın
o anki doluluğunu ve kalan talep beklentisini yansıtıyor. Sol taraf, yani
kalifiye ücret, bir fiyatlama sorusunun cevabı: bu yolcu, bu yolculukta,
bu kanaldan, bu tarihte sorduğunda hangi ücrete hak kazanıyor? Envanter
tarafına ne kadar yatırım yaparsan yap, sol taraf gerçeğe uzaksa net katkı
da uzak kalır. Bid price'ı hassas hesaplayıp kalifiye ücreti kaba
bir ortalamadan almak, terazinin bir kefesini hassas tartıp ötekine göz
kararı ağırlık koymak demek.

Yazılım tarafında bunun karşılığı şu: müsaitlik servisi iki bağımlılığa
sahip, biri envanter durumuna (bid price), öbürü ücret kurallarına. İkisi
farklı hızda değişiyor ve farklı ekiplerin sahipliğinde. Net katkı
kararının kalitesi, bu iki girdinin en zayıfıyla belirleniyor.

## Müsaitlik anında bilinemeyen kural hesaba katılmıyor

Kalifiye ücreti süzen kuralların hepsi müsaitlik sorgusu anında
uygulanabilir değil. En az kalış (minimum stay) ve en fazla kalış (maximum
stay) bunun en belirgin örneği. Müsaitlik sorulduğu anda yolcunun kesin
dönüş tarihi, hatta dönüp dönmeyeceği bile tam bilinmiyor olabilir. Bu
kurallar o an doğrulanamayacağı için hesaba katılmıyor; yerine ATPCO
kuralları ve dipnotları gibi anlık doğrulanabilen parametreler kullanılıyor.

Bu bir kusur değil, bilinçli bir sınır. Müsaitlik kararı fiyatlamadan önce
geliyor ve eksik bilgiyle veriliyor. Tasarımda yapılması gereken, hangi
kuralın "sorgu anında bilinir" hangisinin "sonra bilinir" kümesinde
olduğunu açıkça ayırmak. Yazılım tarafında bu, kural motoruna gelen
bağlamın (context) iki katmanlı olması demek: müsaitlik çağrısında dolu
olan alanlar ve ancak fiyatlama ya da biletleme adımında dolan alanlar.
Sorgu anında boş olan bir alana dayanan kuralı müsaitlik hesabına sokmak,
ya her şeyi kapatır ya her şeyi açar.

## Kalifiye ücret, kanal, rota ve zamanla süzülüyor

Geriye kalan kurallar, kalifiye ücreti pazar değerine olabildiğince
yaklaştırmak için var. Üç grupta toplanıyorlar.

### Satış noktası ve kanal

Rezervasyonun nereden yapıldığı müsaitliği doğrudan etkiliyor. Sistem
satışın yapıldığı bölgeye, acente kimlik koduna (PCC, pseudo city code) ya
da ofis muhasebe koduna (OAC) göre farklı pazar değerleri atıyor. Bir ücret
yalnızca belirli bir bölgedeki ya da belirli bir GDS'teki satışlara açıksa,
o kanaldan gelen sorguda değer algoritması değişiyor. Aynı uçuş, aynı
tarih, aynı sınıf; iki farklı satış noktasından sorulduğunda iki farklı
net katkı üretebiliyor.

Bunun pratik sonucu şu: satış noktası (POS) bir raporlama boyutu değil,
bir fiyatlama girdisi. Müsaitlik isteği bu bilgiyi taşımıyorsa sistem ya
varsayılan bir değere düşüyor ya da yanlış kanalın ücretini kalifiye
sayıyor.

### Uçuş ve taşıyıcı

İkinci grup rotaya ve operatöre bakıyor. Uçuş numarası aralıkları (flight
number ranges) ve ortak taşıyıcı kısıtları (joint carrier restrictions)
burada devreye giriyor. Talep edilen ücret yalnızca belirli uçuş
numaralarında ya da belirli interline ortaklarla geçerliyse, sistem bu
kısıtları kontrol edip pazar değerini buna göre kalibre ediyor. Yani
aynı O&D için iki farklı güzergâh, üzerlerinde uçan uçuş numaralarına
göre farklı kalifiye ücrete sahip olabiliyor.

### Zamanlama

Üçüncü grup takvimle ilgili. Önceden satın alma (advance purchase) ve
kalkıştan önce açık/kapalı gün sayısı (days open/closed prior to departure)
kurallarına bakılıyor. Yolcu uçuşa çok yakın ya da çok uzak bir tarihte
sorgu yapıyorsa, o zaman dilimine uymayan ücret kalemleri kalifiye ücret
hesabından çıkarılıyor. Bu kurallar min/max stay'in aksine sorgu anında
kesin olarak biliniyor: sorgunun tarihi ve kalkış tarihi elde.

### Kuralların tam listesi

Kaynak metin bu üç grubun ötesinde temel kalifikasyon kurallarını da
sayıyor. Frekans (frequency) kalkış tarihi için haftanın günü niteleyicisi.
Yolculuk tipi (trip type) aktarmasız, direkt, online bağlantı ya da
interline bağlantı ayrımını yapıyor. Blackout tarihleri ücret sınıfının
kullanılamayacağı aralıkları tanımlıyor. Uçuş güzergâhı (flight routing)
belirli bağlantı noktaları, kalkış noktaları ya da bağlantı dizisi
gereksinimleri koyuyor. Kısıtlar (inhibits) yalnızca rezervasyon, yalnızca
host acente gibi kullanım sınırları getiriyor. Ortak taşıyıcı (joint
carrier) kuralı ise bir interline bağlantısına hangi taşıyıcıların dahil
olabileceğini belirliyor.

Listeye yazılımcı gözüyle bakınca bir şey dikkat çekiyor: kuralların
çoğu tek bir segmente değil, yolculuğun bütününe bakıyor. Yolculuk tipi,
güzergâh, ortak taşıyıcı; hiçbiri tek bacağa bakarak değerlendirilemez.
Bu, bölümün son kısmına bağlanıyor.

## Pazar değeri tablosu NDC ile sürdürülemez hale geldi

Kalifiye ücretin arkasında bir pazar değeri (market value) duruyor. Hedef
kaynak metinde açıkça konmuş: değerler hiçbir zaman birebir aynı olmasa da
amaç, müsaitlikte kullanılan pazar değerinin biletlenen ücrete mümkün
olduğunca yakın olması. Bu hedefe iki yoldan gidiliyor ve ikisi arasındaki
fark, bir mimari kararın farkı.

### Geleneksel yol: geçmişten ortalama

Çevrimdışı yöntemde gelir muhasebesinden (revenue accounting) gelen geçmiş
fare basis kodlarının ilk birkaç karakteri, gelecekteki olası ücretlerle
eşleştiriliyor. Bu eşleşmeler havayolunun kural setlerine göre
ağırlıklandırılıyor ve sonunda bir ortalama pazar değeri tablosu çıkıyor.
Müsaitlik sorgusu geldiğinde sistem bu tabloya bakıyor.

Yöntem iki varsayıma dayanıyor. Birincisi, geçmişte satılan ücret yapısı
gelecekte de benzer olacak. İkincisi, ücret sayısı tabloyu makul boyutta
tutacak kadar az. İkincisi artık geçerli değil.

### NDC tabloyu patlatıyor

NDC ile günün saatine, tarihe ve rotaya özel ücretler çoğalıyor. Kaynak
metne göre bu durumda pazar değeri tablosu bir milyar girişi aşabiliyor.
Bu büyüklükte bir tabloyu her gün güncellemek zor ve kaynak metin bunu
açıkça kaçınılması gereken bir hata noktası olarak işaretliyor. Güncelleme
gecikirse tablo dünün ücretlerini yansıtıyor; müsaitlik kararı da dünün
fiyatına göre veriliyor.

Burada sorun tablonun yavaş olması değil, tablonun var olması.
Önceden hesaplanmış bir değer, kaynağı hızla değişen bir girdiden
türetildiğinde, bayatlık tasarımın kendisine gömülü. Ücret sayısı
arttıkça bayatlık penceresi daralmıyor, genişliyor, çünkü bir turu
hesaplamak daha uzun sürüyor.

### Yeni yol: sorgu anında fiyatla

Önerilen alternatif, statik tabloyu günlük güncellemek yerine her
müsaitlik sorgusunda çok hızlı bir fiyatlama motoru (pricing engine)
çalıştırmak. Motor o anki kurallarla bütün rezervasyon sınıflarını (RBD)
fiyatlıyor ve pazar değerini doğrudan gerçek ücret olarak belirliyor.
Böylece tahmin edilen değer ile biletlenen ücret arasındaki fark
kapanıyor; müsaitlikte kullanılan sayı, yolcunun ödeyeceği sayının ta
kendisi oluyor.

Yazılım tarafında bu, bir toplu iş (batch) mimarisinden istek anında
hesaplamaya (compute on request) geçiş. Kazanç doğruluk; bedel gecikme ve
hesaplama yükü. Müsaitlik servisi artık bir tabloya bakıp dönmüyor, her
çağrıda bir fiyatlama motorunu çağırıyor ve bu motor bütün RBD'leri
fiyatlamak zorunda. Bu yüzden kaynak metin "ultra hızlı" sıfatını
tesadüfen kullanmıyor: fiyatlama motorunun gecikmesi doğrudan müsaitlik
yanıtının gecikmesine ekleniyor. NDC@Scale bölümünde anlatılan arama
trafiği yükü burada ikinci kez karşımıza çıkıyor; bu sefer fiyatlama
katmanında değil, envanter kararının içinde.

## Dönüş segmentinin kaderini gidişin başladığı yer belirliyor

Son kural en kolay gözden kaçanı. Yolculuğun başlangıç noktası (POC, point
of commencement) bütün seyahatin yönünü tayin ediyor. Kaynak metnin
örneğiyle: DFW-FRA gidiş, FRA-DFW dönüş bir seyahatte, her iki segmentin
müsaitlik kararı da DFW-FRA yönü için hesaplanmış pazar değerleri
üzerinden veriliyor. Dönüş segmenti FRA'dan kalkıyor olsa bile, ücret
yönü (fare direction) DFW'den başlayan yolculuğa göre belirleniyor.

Bunun nedeni ücret yapısının kendisi. Gidiş-dönüş ücreti, yolculuğun
başladığı pazarda satılan bir ürün. Frankfurt'tan kalkan bir yolcunun
pazar değeri ile Dallas'tan kalkıp Frankfurt'tan dönen bir yolcunun dönüş
bacağının pazar değeri aynı şey değil. Dönüş segmentini kendi başına,
FRA-DFW pazarının değeriyle değerlendirmek yanlış sayıyla net katkı
hesaplamak demek.

Buradan daha genel bir ilke çıkıyor: O&D bazlı yönetimde bir segmentin
müsaitliği ancak bütün yolculuk bilinerek kontrol edilebilir. Sistem
yolcunun yalnızca o segmentte mi uçacağını, yoksa o segmentin bir
bağlantılı uçuşun parçası mı olduğunu anlamak zorunda. Koltuk tek bir
segment için değil, bütün yolculuğun getireceği toplam değere göre
açılıyor ya da kapanıyor. Bir önceki kısımdaki kural listesinin çoğunun
yolculuk bütününe bakması da bu yüzden.

Yazılım tarafında bunun karşılığı: müsaitlik isteği yolculuk verisini
(journey data) eksiksiz taşımalı. POC eksikse ya da yanlış iletilirse
sistem hata vermiyor; dönüş segmentinde yanlış yönün pazar değerini
kullanıp yanlış müsaitlik kararı veriyor. Bu, kırmızı bir hata ekranı
değil, gelir raporunda yavaş yavaş beliren bir sapma olarak ortaya çıkan
türden bir hata.

## Yarın işe yarayacak dört çıkarım

1. **Pazar değerini fiyatlama motorundan al, tablodan değil.** Statik
   pazar değeri tablolarının ürettiği tutarsızlığı önlemek için gerçek
   zamanlı pricing engine entegrasyonunu önceliklendir. Tablo bir milyar
   satıra yaklaşıyorsa sorun güncelleme sıklığında değil, tablonun
   varlığında.
2. **Satış noktasını müsaitlik isteğinin zorunlu alanı yap.** POS ve PCC
   bazlı kurallarla farklı satış kanallarına optimize edilmiş envanter
   erişimi sağla. Bu bilgi istekte yoksa kanal bazlı strateji yalnızca
   kâğıt üzerinde kalır.
3. **POC'yi doğrula, varsayma.** Müsaitlik sorgularında yolculuk başlangıç
   noktasının hatasız iletildiğinden emin ol. Yanlış POC, dönüş
   segmentlerinde yanlış pazar değeri üzerinden yanlış müsaitlik kararına
   yol açar ve bunu hiçbir hata mesajı söylemez.
4. **Kuralları sorgu anında bilinirliğe göre ayır.** Min/max stay gibi
   müsaitlik anında doğrulanamayan kuralları hesaptan bilinçli olarak dışarıda
   tut; advance purchase, blackout, frekans, güzergâh ve ortak taşıyıcı
   gibi anlık doğrulanabilenleri ise eksiksiz uygula.

Bu bölümde ne yok: bid price'ın kendisinin nasıl hesaplandığı ve envanter
kontrolünün sınıf mantığı (envanter kontrolü bölümleri), ücret kurallarının
yolculuk tipleriyle ilişkisi ("Havacılık ücret kuralları ve yolculuk
tipleri stratejik analizi") ve O&D talebinin nasıl tahmin edildiği ("O&D
talep tahmini: birinci ve ikinci nesil yaklaşımlar"). Bu bölüm, net katkı
formülünün sol tarafına giren sayının nereden geldiğini anlatmak için var.
