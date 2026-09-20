---
title: "Yield Management: rekabet stratejileri ve PEOPLExpress analizi"
domain: "aviation"
summary: "PEOPLExpress'in American Airlines'tan yılda bir milyar dolar daha düşük maliyeti vardı ve 1987'de kapandı. Bu bölüm, gelir yönetiminin neden maliyet avantajını geçersiz kıldığını kaybeden tarafın kendi sözleriyle anlatıyor: rakibin pazarının yarısını almana gerek yok, her uçuştan birkaç koltuk yeter."
audience: "Bir önceki bölümü okuyup 'peki karşı taraf ne yaşadı' diye soran yazılımcı ve ürün insanı. Finans bilgisi gerekmiyor; başabaş noktası kavramı metnin içinde anlatılıyor."
pubDate: 2026-09-21
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölüm 17 Ocak 1985'te bitmişti: American Airlines, DINAMO'ya bağlı
Ultimate Super Saver'ı piyasaya sürdü ve ucuz bilet satarken kârlı kalmanın
formülünü buldu. Bu bölüm aynı olayı öbür taraftan anlatıyor. **PEOPLExpress
o formülün karşısında iki yıldan kısa sürede kapandı** ve bunu en iyi
anlatan kişi şirketin kurucusu Donald Burr. Onun sözleri, gelir yönetiminin
neden bir maliyet avantajını değil, iş modelinin kendisini geçersiz kıldığını
gösteriyor.

![Sunumun kapak slaytı. Solda başlık: Gelir Yönetiminin (Yield Management) Erken Dönemi. Alt başlık: Bir havacılık devinin çöküşü, PEOPLExpress vakası (1986-1987). Sağda kareli zemin üzerinde yolcu uçağı planı ve gövdeyi kesen zikzak bir kırılma çizgisi. Altta iki not: bu vaka modern gelir yönetimi sistemlerinin doğuşunu simgeler, 1978 serbestleşmesi sonrası havayolları bilet fiyatını kendileri belirlemeye başladı; erken dönem PSS ve envanter modüllerinin pasif kayıt defteri olmaktan çıkıp geliri optimize eden karar destek sistemine dönüşmesinin miladıdır.](/decks/peoplexpress/01.webp "Uçağın gövdesini kesen çizgi bir grafik değil, bir kırılma. Altta küçük yazılmış ikinci not bu bölümün yazılımcı için asıl iddiası: kayıt defteri karar sistemine dönüştü.")

## Aynı şirket, aynı maliyet yapısı, farklı son

1981'den 1985'e kadar PEOPLExpress sürekli büyüyen ve yüksek kâr eden bir
şirketti; sektörde konumu sarsılmaz görünüyordu. 1986 ortasında American
Airlines Ultimate Super Savers ile PEOPLExpress'in pazarlarına girdi. 1986
sonunda şirket ayda 50 milyon dolar zarar ediyordu. 1 Şubat 1987'de
operasyonlar durdu ve şirket Continental Airlines ile birleşti. Önceki
bölümdeki iflas listesinde PEOPLExpress'in yanında 1986 yazıyordu; sonun
resmi tarihi 1987'nin ikinci ayına sarktı.

![Lacivert zeminde zaman çizgisi grafiği, 1981'den 1987'ye. Sol üstte kutu: aynı şirket, aynı maliyet yapısı, ama farklı bir son. Gri çizgi 1981-1985 arasında yükseliyor: sürekli büyüme ve yüksek kârlılık dönemi, sektörde sarsılmaz konum. 1986 ortalarında kırılma noktası: American Airlines'ın pazara Ultimate Super Savers ile müdahalesi. Oradan itibaren turuncu çizgi dik iniyor. 1986 sonları çöküş: ayda 50 milyon dolar zarar, derin finansal kriz. 1 Şubat 1987 son: operasyonların durdurulması ve Continental Airlines ile birleşme.](/decks/peoplexpress/02.webp "Çizginin gri kısmında şirketin içinde değişen bir şey yok. Turuncu kısmı başlatan olay dışarıda, rakibin sisteminde oldu.")

Burr'un 1986'daki cümlesi olayı kendisi özetliyor: 1981'den 1985'e kadar
canlı ve kârlı bir şirkettik, sonra aniden ayda 50 milyon dolar zarar
etmeye başladık; değişen tek şey, American'ın her bir pazarımızda yaygın
gelir yönetimi yapabilme yeteneğiydi. Yazılımcı için bu cümlenin ağırlığı
şurada: şirketin iç sisteminde hiçbir şey bozulmadan, dışarıdaki bir
sistemin yeteneği bütün iş modelini geçersiz kılabiliyor.

| Tarih | Olay | Sonuç |
|---|---|---|
| 1981-1985 | PEOPLExpress'in altın çağı | Canlı ve kârlı bir şirket |
| 1985 sonrası | AA'nın gelir yönetimi hamlesi | Ultimate Super Savers pazara girer |
| Eylül 1986 | Finansal kriz | Ayda 50 milyon dolar zarar |
| 1 Şubat 1987 | Operasyonların durması | Continental ile birleşme |

## Hassas müdahale: fiyatı eşitle, envanteri kısıtla

American'ın hamlesi üç adımdı. Kampanya: PEOPLExpress'in ultra düşük
fiyatlarıyla rekabet etmek için Ultimate Super Savers başlatıldı. Taktik:
fiyat PEOPLExpress seviyesine indirildi ama o fiyattan satılacak koltuk
sayısı çok kısıtlı tutuldu. Sonuç: ucuz envanter kontrol edildiği için
yüksek gelirli iş yolcusunun ucuz bilet alması engellendi ve ağ geliri
maksimize edildi.

![Başlık: Hassas Müdahale, Fiyatı Eşitle, Envanteri Kısıtla. Lacivert zeminde uçak kabin planı; koltukların büyük çoğunluğu gri, arka tarafta küçük bir blok mavi renkte işaretli. Üç adım: 1. Hamle (kampanya), American Airlines PEOPLExpress'in ultra düşük fiyatlarıyla rekabet etmek için Ultimate Super Savers kampanyasını başlattı. 2. Taktik (sınırlı envanter), fiyatları PEOPLExpress seviyesine indirdi ancak bu fiyattan satılacak koltuk sayısını çok kısıtlı tuttu. 3. Sonuç (ağ optimizasyonu), ucuz envanter kontrol edilerek yüksek gelirli iş yolcularının ucuz bilet alması engellendi, ağ gelirleri maksimize edildi. Altta iki not. Airline flow (offer ve order management): American sadece fiyat sunmadı, pricing ve inventory'yi bağlayarak modern offer management'ın temelini attı; fiyat ATPCO üzerinden düşük yayınlanıyor ancak sistem üzerinden availability kısıtlanıyor. Technical terms: nesting ve bucket allocation kavramları; ucuz sınıflar (örneğin X, V sınıfları) için limitler belirlenir, bu kotalar dolduğunda sistem otomatik olarak o fiyattan satışı kapatır.](/decks/peoplexpress/04.webp "Kabindeki mavi blok kampanyanın bütün gerçek boyutu. Reklamda uçağın tamamı ucuz, sistemde birkaç sıra.")

Slaytın altındaki iki not mekanizmayı açıyor. Fiyat ATPCO üzerinden düşük
yayınlanıyor; acente o fiyatı görüyor. Ama uygunluk (availability) sistem
tarafından kısıtlanıyor: ucuz sınıflar için (X, V gibi) limit belirleniyor,
kota dolunca sistem o fiyattan satışı kendiliğinden kapatıyor. Nesting ve
bucket allocation önceki bölümde DINAMO ile Sabre PSS arasındaki köprüde
gördüğümüz kavramlar. Burada fiyatlama ile envanterin bağlanması, bugün
offer management denen şeyin temeli.

Kârlılığı koruyan mantık bu: rakibin düşük fiyatını bütün koltuklar için
değil, sınırlı sayıda koltuk için eşitle. Pazar payı korunur, uçağın geri
kalanı daha yüksek fiyattan satılır. Karşı tarafta ise envanter kontrolü
olmayan bir havayolu, rakibin gizlice ve isteğe bağlı olarak yaptığı fiyat
kırmalarına karşı savunmasız kalır. PEOPLExpress, American'ın hangi
uçuşta kaç koltuğu ucuza açtığını göremiyordu; gördüğü tek şey kendi
uçağındaki boş koltuklardı.

## Bir milyar dolarlık maliyet avantajı neden yetmedi

Burr'un ikinci cümlesi bir yanılgının itirafı: bizi savunacak hiçbir
şeyimiz kalmamıştı, elimizde kalan tek şey o dönemde American'dan yıllık
bir milyar dolar daha düşük olan maliyet yapımızdı; safça, bu milyar
dolarlık tamponun bize yeterli alanı sağlayacağını umduk.

![Başlık: 1 Milyar Dolarlık Maliyet Avantajı Neden Yetmedi? Yatay bir çubuk uçağın toplam uçuş kapasitesini yüzde 0'dan 100'e gösteriyor. Yüzde 0-60 arası turuncu: zarar, sabit maliyetler. Yüzde 60-65 arası gri: başabaş noktası. Yüzde 65-100 arası lacivert: marjinal trafik, net kâr; üstünde aşağı bakan kalın bir ok. Altta alıntı: maliyet yapımız American'dan 1 milyar dolar daha ucuzdu, bunun bizi koruyacağını safça umduk; rakibinizin pazarının yarısını almanıza gerek yoktur, her uçuşta alınan fazladan birkaç koltuk rakibi iflasa sürüklemek için yeterlidir. Donald Burr, PEOPLExpress CEO, yanılgı ve gerçek.](/decks/peoplexpress/05.webp "Okun gösterdiği lacivert bölge kârın tamamı. American'ın alması gereken pazar payı bu bölge kadar, uçağın tamamı değil.")

Çubuk neden yetmediğini anlatıyor. Bir uçuşun sabit maliyeti kapasitenin
büyük bölümünü yutar; başabaş noktasına kadar satılan her koltuk zararı
kapatır, kâr üretmez. Kâr, başabaş noktasının üzerindeki marjinal
trafikten gelir: uçağı dolduran son birkaç koltuk. Burr'un üçüncü
cümlesi tam bunu söylüyor: adamın pazarının yarısını elinden almanıza
gerek yok, her uçuştan birkaç koltuk almanız yeter, o zaman o adam ölür.

Kritik eşik bu yüzden genel doluluk oranı değil, başabaş üzerindeki
marjinal trafiktir. American'ın sınırlı kontenjanlı ucuz koltukları tam
o birkaç yolcuyu aldı. PEOPLExpress'in uçakları hâlâ büyük ölçüde doluydu;
sadece kârı taşıyan dilim eksikti. Bir milyar dolarlık maliyet farkı
başabaş noktasını sola kaydırır ama marjinal trafiğin gittiğini geri
getirmez. İş kuralı şu: maliyet avantajı, rakibin veriye dayalı koltuk
yönetimi karşısında tek başına koruma sağlamaz. Gelir tarafındaki
zayıflık, maliyet tarafındaki gücü yok eder.

## Çöküşü getiren iki hata birbirini büyüttü

Gelir yönetimi eksikliği tek başına ölümcül olmayabilirdi; PEOPLExpress
onu bir başka hatayla birleştirdi. Frontier Airlines, Britt Airways ve
PBA agresif satın alımlarla filoya katıldı. Sonuç, havayolunun sırtına
binen sürdürülemez bir borç yükü. Rota haritası genişledi, ama o
kapasiteyi talebe göre optimize edecek sistem yoktu. Yeni kapasite,
rakibin veri hamlelerine karşı savunmasız yeni cephe demekti.

![Başlık: Çöküşü Getiren İki Temel Hata. Solda, kontrolsüz filo büyümesi (kaba kuvvet): ABD haritası üzerinde yüzlerce turuncu çizgiyle örülmüş rota ağı. Notlar: Frontier, Britt Airways ve PBA'nın agresif satın alımı; sonuç, havayolunun sırtına binen sürdürülemez devasa borç yükü. Sağda, gelir yönetimi eksikliği (zayıf nokta): boş bir tablo ve üzerinde VERİ YOK damgası. Notlar: koltuk envanterini talebe göre optimize edecek sistemlerin yokluğu; sonuç, rakiplerin stratejik veri hamlelerine karşı tamamen savunmasız kalma.](/decks/peoplexpress/03.webp "Soldaki harita ne kadar kalabalıksa sağdaki tablo o kadar boş. Her yeni rota, hakkında veri tutulmayan bir cephe daha.")

Genişleme kararının finansal kriteri buradan çıkıyor: satın alma ve filo
büyütme, gelir yönetimi kontrolleriyle eş zamanlı gitmeli. Kontrolsüz
genişleme ve yüksek borç, envanter kontrolünün yokluğuyla birleştiğinde
operasyonları durduran temel iş riski haline geliyor. Yazılım tarafındaki
karşılığı tanıdık: ölçeği, onu yönetecek sistem olgunlaşmadan büyütmek.

## İki felsefe: en ucuz maliyet değil, en akıllı envanter kazandı

Üç boyutta iki model yan yana. Kapasite ve filo: PEOPLExpress'te agresif
satın alımlarla kontrolsüz büyüme ve devasa borç; American'da ağ yapısına
uygun, optimize edilmiş ölçek. Fiyatlandırma: PEOPLExpress'te sistematik,
tek tip, ultra düşük maliyet tabanlı sabit fiyat; American'da rakibi
hedef alan dinamik ve esnek fiyat. Envanter kontrolü: PEOPLExpress'te
kontrol mekanizması yok, bütün koltuklar en düşük fiyattan satılabilir;
American'da gelir yönetimiyle korunmuş koltuk envanteri.

![Başlık: İki Farklı Felsefenin Çarpışması. Üç satırlı karşılaştırma tablosu. Kapasite ve filo: PEOPLExpress (kaybeden model) agresif satın alımlarla kontrolsüz büyüme, devasa borçlanma; American Airlines (kazanan model) ağ yapısına uygun, optimize edilmiş ölçek ekonomisi. Fiyatlandırma stratejisi: PEOPLExpress sistematik, tek tip, ultra düşük maliyet tabanlı sabit fiyatlar; American dinamik, rakibi hedef alan esnek fiyatlandırma (Ultimate Super Savers). Envanter kontrolü: PEOPLExpress kontrol mekanizması yok, tüm koltuklar en düşük fiyattan satılabilir; American gelir yönetimi ile korunmuş koltuk envanteri. Altta lacivert kutu: havacılıkta en ucuz maliyete sahip olmak yetmez, en akıllı koltuk envanterine sahip olmak oyunu kazandırır.](/decks/peoplexpress/06.webp "Tablonun ilk iki satırı stratejik tercih, üçüncü satırı sistem yeteneği. PEOPLExpress ilk ikisini değiştirebilirdi; üçüncüsü için yazılım gerekiyordu ve o yoktu.")

Üçüncü satır belirleyici. PEOPLExpress'in tek tip fiyatı bir tercihti,
ama "bütün koltuklar en düşük fiyattan satılabilir" bir tercih değil, bir
sistem eksikliğiydi. Kapak slaytındaki cümleye dönersek: rezervasyon
sistemi pasif kayıt defteri olmaktan çıkıp geliri optimize eden karar
sistemine dönüşmüştü ve bu dönüşümü yapmayan taraf, maliyet yapısı ne
olursa olsun, kaybetti.

## Yarın işe yarayacak dört çıkarım

1. **Ucuz olduğun için tercih edileceğini varsayma.** Rakip sınırlı
   kontenjanla fiyatını eşitlediğinde müşteri onun ucuz koltuğunu alır,
   senin ucuz koltuğunu değil. Cevap koltuk bazlı yönetim: hangi birimi
   hangi fiyattan kaç adet açtığını sistem karar versin.
2. **Ortalamayı değil marjı koru.** Kârlılık analizi genel doluluk
   üzerinden yapılırsa tehlike görünmez; uçakları hâlâ dolu görünür.
   Uçağı başabaş üzerine taşıyan son %5-10'luk yolcu dilimini ayrı izle
   ve ona özel fiyatlama ya da sadakat stratejisi kur.
3. **Kapasiteyi, onu yönetecek sistemden önce büyütme.** Satın alma ve
   filo kararları pazar payı hedefiyle değil, mevcut kontrol sistemlerinin
   yeni kapasiteyi yönetecek olgunlukta olup olmadığına bakılarak
   verilmeli. Yönetilmeyen ölçek borç ve savunmasız cephe üretir.
4. **Rakibin hamlesini görmüyorsan veri odaklı savunma kurmak zorundasın.**
   Fiyat kırma gizlice ve isteğe bağlı yapılabildiğinde, pazar değişimini
   anlık izleyen ve otomatik tepki veren sistem bir seçenek değil,
   zorunluluk.

Bu bölümde ne yok: American tarafındaki sistemin iç yapısı (bir önceki
bölüm, DINAMO ve Sabre PSS köprüsü) ve ucuz sınıfların kotalarının bugün
nasıl kurulduğu ("Envanter koltuk değildir"). Bu bölüm sistemin karşı
tarafta nasıl hissedildiğini anlatmak için var.
