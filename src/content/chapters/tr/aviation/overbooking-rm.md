---
title: "Havacılıkta overbooking stratejileri ve gelir yönetimi"
domain: "aviation"
summary: "Overbooking, gelir yönetiminin kenarında duran bir kapasite ayarı değil; verim yönetimi gelir fırsatının yaklaşık dörtte biri ondan geliyor. Bu bölüm overbooking limitinin ücret karmasıyla neden aynı anda çözülmesi gerektiğini, iptal döngüsünü modellemek yerine fall-off oranının neden daha sağlam bir girdi olduğunu, kuponun gerçek maliyetini ve fazla satışın bilet fiyatını nasıl aşağı çektiğini anlatıyor."
audience: "Envanter, gelir yönetimi ya da kalkış kontrol sistemleriyle çalışan ve overbooking hesaplayıcısının RM motorunun geri kalanıyla nasıl konuşması gerektiğini anlamak isteyen yazılımcı ve ürün insanı. Önceki üç overbooking bölümünün okunmuş olması işe yarar; fall-off oranı, okuma günü, iptal oranı profili, spoilage ve discount allocation metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Önceki üç bölüm overbooking'i içeriden açtı: boş koltukla kapıda geri
çevrilen yolcu arasındaki denge, kaç kişinin gerçekten bineceğinin
tahmini, o tahminin varyansının limiti nasıl aşağı çektiği. Bu bölüm
bir adım geri çekilip overbooking'in gelir yönetimi sisteminin içinde
nerede durduğuna bakıyor. Kaynak metin bunu tek bir oranla söylüyor:
overbooking, toplam verim yönetimi gelir fırsatının yaklaşık %25'ine
katkıda bulunuyor. **Bu büyüklükteki bir kaldıraç, RM motorunun yanına
iliştirilmiş ayrı bir modül olarak değil, ücret karmasıyla aynı
hesabın içinde çözülmesi gereken bir değişken.** Bölümün geri kalanı bu
iddianın dört sonucunu anlatıyor: eşzamanlı optimizasyon, fall-off
oranıyla sadeleştirilmiş tahmin, kuponun gerçek maliyeti ve fazla
satışın fiyata yansıması.

## Overbooking gelir yönetiminin dörtte biri, bir yan ayar değil

Kaynak metnin çerçevesi tanıdık: amaç, iptaller ve gelmeyen yolcular
(no-show) yüzünden kalkışta boş kalacak koltuk kaybını, yani spoilage'ı
en aza indirirken uçağa kabul edilmeme (denied boarding) maliyetini
dengede tutmak. Karar kuralı da iki maliyetin karşılaştırması. Bir
koltuğun boş kalmasının maliyeti, uçağa alınmayan bir yolcuya ödenecek
tazminattan ve o yolcunun sadakatinden kaybedilecek olandan yüksekse,
limit yukarı çekiliyor. Bu dengenin eğrileri, havalimanına göre değişen
tazminat ve hukukun limiti optimumun altına itmesi önceki bölümlerde
anlatıldı; burada tekrar etmeye gerek yok.

Yeni olan, bu dengenin ağırlığı. Gelir yönetimi deyince akla genelde
ücret sınıflarının açılıp kapanması, yani hangi yolcuya hangi fiyattan
koltuk verileceği geliyor. Kaynak metnin %25 tahmini, bu sınıf
kararlarının dayandığı kapasitenin kendisini belirleyen overbooking'in
toplam kazancın küçümsenemeyecek bir parçası olduğunu söylüyor. Satışa
açılan koltuk sayısı yanlışsa, o koltukların arasındaki sınıf dağılımı
ne kadar iyi olursa olsun, eksik bir sayının üzerine kurulu.

Yazılım tarafında bunun karşılığı öncelik sırası. Bir RM platformunun
yol haritasında overbooking çoğu zaman "sonra iyileştiririz" diye
bırakılan, sabit bir yüzdeyle çalışan bir parametre oluyor. Getirinin
dörtte birini taşıyan bir bileşen için bu kabul edilebilir bir
sadeleştirme değil.

## Limit ile ücret karması ardışık değil, aynı anda çözülmeli

En kritik iş kuralı şu: sistem overbooking seviyesini ve kabin içindeki
indirimli koltuk tahsisini (discount allocation) birbiri ardına değil,
eşzamanlı çözmeli. Discount allocation, kabindeki koltukların ne kadarının
indirimli sınıflara açılacağını belirleyen karar. Kaynak metin
eşzamanlılığın gerekçesini istatistikten veriyor: overbooking seviyesindeki
her bir birimlik artış, hesaba giren ortalamayı (μs) ve standart sapmayı
(σs) değiştiriyor ve bu da gelir optimizasyonunu doğrudan etkiliyor.

Bunun anlamı, iki kararın birbirinin girdisi olması. Limit yükseldiğinde
satışa açılan koltuk artıyor ve dağılımın hem merkezi hem genişliği
kayıyor. Sınıf tahsisi bu dağılıma göre hesaplandığı için, limit
değiştikten sonra eski tahsis artık optimum değil. Tersi de geçerli:
tahsisi değiştirmek, hangi yolcunun hangi olasılıkla geleceğini
değiştiriyor ve limitin dayandığı varsayımları kaydırıyor.

Ardışık çözüm pratikte cazip, çünkü iki ekibi ve iki servisi
birbirinden ayırıyor. Önce overbooking servisi bir kapasite sayısı
üretiyor, sonra RM motoru o sayıyı sabit kabul edip sınıfları
dağıtıyor. Arayüz basit: tek bir tam sayı. Ama kaynak metnin
söylediğine göre bu basitlik, iki modelin birbirinin çıktısına tepki
veremediği bir boru hattı kuruyor. Yazılım tarafında eşzamanlı çözümün
karşılığı, overbooking seviyesinin RM optimizasyonuna dışarıdan gelen
bir sabit değil, optimizasyonun içinde aranan bir değişken olması; ya da
en azından iki modelin bir yakınsama döngüsünde birbirini besleyerek
birlikte çalışması. Kaynak metnin aksiyon listesi bunu doğrudan
söylüyor: overbooking limitlerini belirleyen algoritmalar, sınıf
tahsis sistemleriyle eşzamanlı çalışacak şekilde entegre edilmeli.

Limitin kendisini aramak için kaynak metin iki yöntem sayıyor: farklı
overbooking değerlerini tek tek deneyen ardışık arama ve aralığı her
adımda yarıya indiren ikiye bölme araması. Bu iki yöntemin maliyet
farkı biniş oranı tahmini bölümünde anlatıldı. Burada eklenmesi gereken,
eşzamanlı çözümde her aday limitin bir sınıf tahsisi hesabını da
tetiklemesi. Aday başına maliyet büyüdükçe arama yönteminin seçimi bir
performans ayrıntısı olmaktan çıkıp mimari bir karara dönüşüyor. Kaynak
metin ayrıca ekonomik limitin hesaplanmasında geçmiş verilerden çıkan
ampirik dağılımların kullanılmasını öneriyor; yani aranan eğri
varsayılmış bir dağılım değil, havayolunun kendi geçmişi.

## İptal döngüsünü modellemek yerine fall-off oranını ölç

Overbooking limitinin arkasında, kalkışa kadar kaç rezervasyonun
düşeceğine dair bir tahmin duruyor. Bunu doğrudan modellemek demek,
her okuma gününde gelen yeni rezervasyonlarla düşen iptallerin
birleşimini (convolution) kurmak demek. Kaynak metin bu karmaşık yapının
yerine daha sade bir ölçü öneriyor: fall-off oranı.

Fall-off oranı, belirli bir okuma günündeki (reading day) rezervasyon
miktarının kalkış anında beklenen rezervasyona yüzdesi. Okuma günü,
rezervasyon verisinin kalkıştan önceki sabit noktalarda alınan kesiti.
Oran her kesitte "bugün eldeki rezervasyon, kalkışta kalacak olanın ne
kadarı" sorusuna cevap veriyor. Kaynak metnin vurgusu bu oranın çok daha
stabil sonuç üretmesi. Rezervasyon ve iptal akışlarını ayrı ayrı tahmin
edip birleştirmek, iki ayrı tahmin hatasını üst üste bindiriyor; fall-off
oranı ise ikisinin net etkisini tek bir sayıda gözlüyor.

Aksiyon listesi bunu model seçimine bağlıyor: karmaşık dinamik modeller
yerine, kabin ve gün bazlı fall-off oranlarını kullanan statik modelleri
devreye almak. Rezervasyonların kalkıştan önceki günlerde nasıl düştüğünü
gösteren tutma profilleri analiz edilip limitler bu düşüş eğrisine göre
güncelleniyor. Böylece model zamanı tamamen görmezden gelmiyor; zamanın
etkisi fall-off eğrisinin şekline gömülü duruyor.

Yazılım tarafında bu sadeleştirmenin getirisi veri hattında. İptal ve
rezervasyon akışlarını ayrı modellemek, her iki olay türünü de zaman
damgasıyla, rezervasyon sınıfıyla ve iptal nedeniyle birlikte saklamayı
ve iki modeli ayrı ayrı kalibre etmeyi gerektiriyor. Fall-off oranı için
her okuma gününde alınan tek bir sayım ve kalkıştaki son sayım yetiyor.
Tutulması gereken şey olay günlüğü değil, anlık görüntü dizisi.

## Statik model daha az hassas ama kalibre edilebilir olduğu için kazanıyor

Overbooking stratejileri bölümü, iptal ve yeni rezervasyon akışı yoğun
uçuşlarda dinamik modelin daha doğru olduğunu anlatıyordu. Kaynak metin
bu tercihin öbür yüzünü gösteriyor. Dinamik modeller zaman içindeki
rezervasyon ve iptal akışını takip ettiği için daha hassas, ama
kalibrasyonları oldukça zor. Kalkış anındaki beklenen katılım oranına
odaklanan statik modeller ise uygulama kolaylığı yüzünden pratikte daha
yaygın tercih ediliyor.

Bu iki bölüm arasında bir çelişki değil, bir sıralama var. Doğru
soru "hangisi daha hassas" değil, "hangisini gerçekten kalibre edip
çalışır tutabilirim". Kalibre edilemeyen bir dinamik model, iyi
beslenmiş bir statik modelden daha kötü sonuç verir; hassasiyeti ancak
parametreleri gerçeğe yakın olduğunda işe yarar. Yazılım tarafında bu,
kararın algoritma kalitesine değil operasyonel olgunluğa göre
verilmesi demek: parametreleri izleyecek, sapmayı fark edecek ve yeniden
kalibre edecek bir süreç yoksa, dinamik modele geçmek teknik borçla
hassasiyet satın almak.

## Limit, iptal profiline göre ve zirve gününe kadar sabit kurulmalı

Kalkış öncesi (predeparture) limitlerin nasıl ayarlanacağı konusunda
kaynak metin iki kural koyuyor. Birincisi limitin tek bir global oran
olmaması. Limit, iptal oranı profili baz alınarak belirleniyor ve bu
profil pazara, haftanın gününe, sezona ve hatta günün saatine göre
değişiyor. Sabah ilk uçuşuyla akşam son uçuşunun, aynı rotada bile,
farklı iptal davranışı olabiliyor. Aksiyon listesi de iptal ve no-show
tahminlerinin pazar, sezon ve günün saati bazında segmente edilmesini
öneriyor.

İkinci kural daha az sezgisel: maksimum limit, zirve gününe kadar olan
bütün günler için geçerli kılınmalı. Gerekçe, bu süreçte iptal edilen
koltukların yeni rezervasyonlarla doldurulamayacağı varsayımı. Yani
kalkışa yaklaşırken iptal edilen bir koltuğun yerine satış gelmeyecekse,
o koltuğu baştan fazla satarak korumak gerekiyor. Limiti erken günlerde
temkinli tutup kalkışa doğru gevşetmek, tam da bu boşluğu dolduramama
riskini büyütüyor.

Yazılım tarafında bunun karşılığı, overbooking tablosunun anahtarının
genişlemesi. Rota ve kabin yetmiyor; haftanın günü, sezon ve kalkış
saati dilimi de anahtara giriyor. Bu kırılımlar arttıkça her hücreye
düşen gözlem azalıyor, bu yüzden segmentasyonun ne kadar ince
yapılacağı veri hacmiyle birlikte düşünülmeli. Fall-off oranının stabil
olması burada da işe yarıyor: ince segmentlerde bile iptal ve
rezervasyonu ayrı ayrı modellemekten daha az gürültü üretiyor.

## Kuponun havayoluna maliyeti, üzerindeki değerin üçte biri

Kapasiteden fazla yolcu kapıya geldiğinde işleyiş önceki bölümlerde
anlatıldı: önce gönüllü aranıyor, gönüllüye bir sonraki uçuşta koltuk
garantisi ve ileride bilet alımında kullanılacak bir kupon (voucher)
teklif ediliyor. Kaynak metin bu tabloya bir sayı ekliyor. American
Airlines'ta yapılan çalışmalar, kuponun havayoluna gerçek maliyetinin,
üzerinde yazan nominal değerin yaklaşık üçte biri olduğunu tahmin
etmiş.

Bu oran iki şeyi değiştiriyor. Birincisi, overbooking denkleminin
reddetme tarafındaki maliyeti. Modele kuponun nominal değeri girerse,
reddetme olduğundan üç kat pahalı görünüyor ve limit gereğinden aşağı
iniyor. İkincisi, gönüllü teklifinin tasarımı. Aksiyon listesi bunu
açıkça söylüyor: kuponun gerçek maliyetinin düşük olduğunu göz önünde
bulundurarak gönüllüleri ikna etmek için daha cömert nominal değerli
teklifler kurgulanmalı. Yolcu kuponu yüzündeki değerle tartıyor,
havayolu ise o değerin üçte biriyle ödüyor. Aradaki fark, gönüllü
bulmanın ucuz kaldığı alan.

Yazılım tarafında bunun karşılığı, tazminat maliyetinin modelde tek bir
alan olarak tutulmaması. Nominal değer yolcuya gösterilen teklifin
girdisi, gerçek maliyet ise overbooking optimizasyonunun girdisi. İkisi
aynı alanı paylaşırsa ya teklif cimri ya model temkinli kalıyor.

## Fazla satış, bilet fiyatını aşağıda tutan bir sübvansiyon

Overbooking kamuoyunda genelde yolcunun aleyhine bir uygulama olarak
anılıyor. Kaynak metin buna iki karşı argüman veriyor. Birincisi
fiyat. American Airlines'tan Robert Crandall'ın sözünü aktarıyor:
no-show'ların boş bırakacağı koltukları doldurarak elde edilen gelir
olmasaydı, fiyatları yükseltmekten başka seçenek kalmazdı; overbooking
bu yüzden ücretleri mümkün olduğunca düşük tutmaya yardım ediyor. Kaynak
metin bunu bir iş kuralı olarak tanımlıyor: no-show kaynaklı boş
koltuklardan elde edilen ek gelir, genel bilet fiyatlarını düşük tutmak
için bir sübvansiyon olarak kullanılmalı. Bu uygulama olmasaydı boş
koltukların maliyeti diğer yolcuların biletine yansıtılmak zorunda
kalırdı.

İkinci argüman erişim. Kaynak metne göre overbooking, müşterinin ilk
tercih ettiği uçuşta yer bulma olasılığını artırıyor, çünkü iş seyahati
yapan yolcular planları değiştiğinde genellikle rezervasyonlarını iptal
etmiyor. Overbooking olmasa bu yolcuların tuttuğu ama kullanmayacağı
koltuklar, o uçuşu gerçekten isteyen başka bir yolcuya "dolu" olarak
görünürdü. Fazla satış, iptal edilmeyen rezervasyonun kilitlediği
envanteri geri açıyor.

Bu iki argüman, overbooking'in maliyetini kimin taşıdığı sorusunu
yeniden dağıtıyor. Kapıda geri çevrilen yolcu görünür ve tekil; düşük
kalan fiyat ve ilk tercih uçuşta bulunan koltuk ise görünmez ve bütün
yolculara yayılmış. Yazılım tarafında bunun pratik bir sonucu var:
overbooking'in performansını yalnızca reddedilen yolcu sayısıyla
raporlayan bir gösterge paneli, faydanın tamamını dışarıda bırakıyor.
Spoilage'dan geri kazanılan gelir aynı raporda durmadıkça, limit her
şikayette biraz daha aşağı çekilir.

## Yarın işe yarayacak beş çıkarım

1. **Overbooking'i RM optimizasyonunun içine al.** Limiti sınıf
   tahsisine sabit bir sayı olarak devretme; iki algoritmayı eşzamanlı
   çalışacak şekilde entegre et. Limitteki her birimlik değişim
   ortalamayı ve standart sapmayı değiştiriyor, ardışık çözüm bunu
   göremiyor.
2. **Tahmini fall-off oranıyla sadeleştir.** İptal ve rezervasyon
   akışlarının birleşimini modellemek yerine kabin ve gün bazlı fall-off
   oranlarını kullanan statik bir modelle başla. Dinamik modele ancak
   onu kalibre edip izleyecek süreç hazır olduğunda geç.
3. **İptal profilini segmente et.** İptal ve no-show tahminlerini pazar,
   haftanın günü, sezon ve günün saati bazında ayır; maksimum limiti
   zirve gününe kadar bütün okuma günlerinde geçerli tut.
4. **Kuponun iki değerini ayrı tut.** Gönüllü teklifinde nominal değeri,
   overbooking modelinde ise gerçek maliyeti kullan. Gerçek maliyetin
   nominalin yaklaşık üçte biri olduğu bilgisiyle gönüllüye daha cömert
   teklif kur.
5. **Faydayı da raporla.** Denied boarding sayısının yanına spoilage'dan
   geri kazanılan geliri koy. Yalnızca maliyeti gösteren bir rapor,
   limiti zamanla gereğinden aşağı çeker.

Bu bölümde ne yok: boş koltuk ile reddedilen yolcu arasındaki maliyet
dengesinin kendisi ve hukukun bu dengeyi nasıl kaydırdığı ("Havacılık ve
hizmet sektöründe overbooking stratejileri ve operasyonel analiz"), kaç
yolcunun gerçekten bineceğinin tahmini ("Biniş oranı tahmini ve
overbooking stratejileri") ve show-up dağılımının varyansı ("Havacılıkta
overbooking (fazla rezervasyon) ve show-up modelleme stratejileri"). Bu
bölüm, o parçaların gelir yönetimi sisteminin geri kalanına nasıl
bağlandığını anlatmak için var.
