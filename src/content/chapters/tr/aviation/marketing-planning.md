---
title: "Havayolu pazarlama planlama süreci ve iş mantığı analizi"
domain: "aviation"
summary: "Havayolu planlaması arzla talebi farklı ayrıntı düzeylerinde tekrar tekrar eşleştirme işidir: filo kararıyla beş yıl önce başlar, kalkışa üç ay kala uçak değişimiyle sürer ve MIDT, T100, IATA DDS gibi veri setlerinin hangisine ne kadar güvenildiğiyle şekillenir. Bu bölüm o döngünün adımlarını, adımlar arasındaki geri beslemeyi ve veri kaynaklarının kör noktalarını anlatıyor."
audience: "Tarife, kapasite, fiyatlandırma ya da gelir yönetimi sistemleriyle çalışan, bu sistemlerin birbirine neden bu kadar bağlı olduğunu anlamak isteyen yazılımcı ve ürün insanı. Gelir yönetimi bölümlerinin okunmuş olması işe yarar; re-fleeting, MIDT ve DB1B metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, use-case]
ai: generated
---

Önceki bölümler tek tek fonksiyonları anlatıyordu: gelir yönetimi koltuğu
kime satacağını, dağıtım o koltuğu kimin ekranına taşıyacağını, NDC fiyatı
kimin kuracağını. Bu bölüm geri çekilip hepsinin oturduğu masaya bakıyor.
**Havayolu planlaması tek bir karar değil, arzla talebin farklı ayrıntı
düzeylerinde tekrar tekrar eşleştirilmesi.** Filo planlaması, fiyatlandırma,
gelir yönetimi, çizelgeleme ve dağıtım bu eşleştirmenin farklı
çözünürlükleri. Başarı da tek birinin iyi olmasına değil, beş yıl önce
verilen stratejik kararla kalkış gününe kadar süren taktik müdahalelerin
birbirine uymasına bağlı.

![Sunumun kapak slaytı. Ortada bir yapay ufuk göstergesi: üst yarısı mavi gökyüzü, alt yarısı turuncu zemin, ufuk çizgisi hafif eğik, üzerinde 5, 10 ve 15 derecelik yunuslama çizgileri. Başlık: Havayolu Pazarlama Planlaması. Alt başlık: Arz, Talep ve Karlılık Arasındaki Stratejik Denge. Alt metin: havacılık endüstrisinde uzun vadeli vizyondan uçuş gününe kadar operasyonel planlama süreçleri.](/decks/marketing-planning/01.webp "Gösterge bir yapay ufuk: pilotun uçağı dengede tutmak için baktığı alet. Planlama da aynı işi yapıyor, sadece yıllara yayılmış halde.")

![Başlık: Temel Hedef, Arz ve Talebi Eşleştirmek. Üstte kutu: havayolu pazarlama planlamasının temel amacı, kapasite (arz) ile yolcu ihtiyacını (talep) en hassas seviyede buluşturmaktır. Solda mavi Arz (Kapasite) kutusu: doğru uçak tipi, doğru rota, doğru koltuk sayısı. Sağda turuncu Talep (Yolcu) kutusu: doğru yolcu karması, rekabetçi fiyat, doğru zamanlama. İki kutudan inen oklar ortada bir terazinin dayanak noktasında birleşiyor; dayanağın üzerinde Karlılık yazıyor.](/decks/marketing-planning/02.webp "Terazinin iki kolundaki maddeler farklı departmanlara ait: soldakileri filo ve tarife, sağdakileri fiyatlandırma ve gelir yönetimi belirliyor. Dayanak ise ortak.")

## Planlama bir zincir değil, bir geri besleme döngüsü

Kaynak metin koordinasyonu doğrudan sürecin verimine bağlıyor: bu büyük
fonksiyonel alanlar arasındaki koordinasyon düzeyi, pazarlama planlama
sürecinin ne kadar etkili olduğunu belirliyor. Yani fiyatlandırma, gelir
yönetimi ve çizelgeleme ayrı silolarda en iyi kararı verse bile, birbirinden
habersizse bütün kötü çıkıyor.

![Başlık: Pazarlama Planlamasının Temel Bileşenleri. Bir tapınak şeması: çatıda Pazarlama Stratejisi yazıyor. Dört sütun: Tarife Planlama (uçuş ağının kalkış/varış zamanlaması), Fiyatlandırma (rekabetçi pazar fiyatlarının belirlenmesi), Getiri Yönetimi (kabul edilecek en uygun yolcu karmasının optimize edilmesi), Satış ve Dağıtım (ürünün online/offline kanallarla müşteriye ulaştırılması). Temelde iki katman: Filo Planlama (gelecekteki uçuş ağı için uçak tipi, menzil ve maliyet analizi) ve Sadakat Programları (uzun vadeli müşteri tutundurma).](/decks/marketing-planning/03.webp "Filo en altta duruyor: diğer dört sütun, üzerine oturdukları uçak kararını değiştiremiyor, yalnızca ona uyum sağlıyor.")

İlişki tek yönlü de değil. Fiyatlandırma ve gelir yönetimi kararları yalnızca
bugünkü satışı etkilemiyor; filo planına ve uçuş çizelgesine geri dönen bir
sinyal üretiyor. Hangi rotada hangi segmentin ne kadar ödediği, bir sonraki
dönemde o rotaya hangi uçağın konacağının girdisi oluyor. Yazılım tarafında
bunun karşılığı şu: tarife sistemi ile RM sistemi arasındaki arayüz bir
toplu aktarım değil, iki yönlü bir sözleşme.

![Başlık: Karar Ekosistemi, Fonksiyonlar Arası Etkileşim. Ortada daire: Fiyatlandırma ve Getiri Yönetimi (Merkezi Zeka). Daireden üç yöne dönen oklar çıkıyor: mavi ok Filo Planlama'ya (uçak tipi ve büyüklüğünü şekillendirir), turuncu ok Tarife Planlama'ya (kârlı saatleri ve rotaları belirler), turuncu ok Satış ve Dağıtım'a (dağıtım kanallarındaki ürün stratejisini yönlendirir). Altta özet: bir havayolunun kârlılığı izole kararlara değil, bu birimler arasındaki koordinasyon seviyesine bağlıdır.](/decks/marketing-planning/07.webp "Oklar merkezden dışarı ve geri dönüyor: fiyat ve getiri verisi, filo ve tarife kararlarının girdisi. Bu, önceki slayttaki tapınağın yukarıdan aşağıya okunmadığını söylüyor.")

## Arzı kuran karar uçakla başlıyor

Eşleştirmenin en kaba çözünürlüğü filo. Yeni bir uçak tipi satın alınırken
ya da kiralanırken soru, bu uçağın gelecekteki rota ağında nereye
oturacağı. İş mantığı dört kritere dayanıyor: uçağın menzili, işletme
maliyeti, kapasitesi ve gelecekteki ağda kârlı hizmet verme maliyeti. Hedef
kapasiteyi pazar talebiyle en yüksek kârlılıkta buluşturmak.

Filonun yanında ürünü şekillendiren ikinci karar tarife planlaması: talebi
maksimize edecek uçuş ağını ve pazar akışını tasarlamak, yani pazardaki
yolcu akışına uygun frekansı ve kalkış-varış saatlerini belirlemek. Filo
donanımı, tarife zamanlamayı belirliyor.

![Başlık: Ürünü Şekillendirmek, Filo ve Tarife. Sol panel, Filo Planlama (Donanım): gelecekteki uçuş ağını kârlı bir şekilde sunmak için doğru uçağın seçilmesi. Bir uçağın yandan teknik çizimi; menzil, koltuk kapasitesi ve yük kapasitesi ölçü çizgileriyle işaretli. Altta kritik metrikler: menzil, işletme maliyeti, kapasite. Sağ panel, Tarife Planlama (Zamanlama): talebi maksimize edecek uçuş ağının ve pazar akışının tasarlanması. Kronometrelerle işaretli üç turuncu nokta arasında kesikli oklar. Altta: pazardaki yolcu akışına uygun frekans ve kalkış-varış saatlerinin belirlenmesi.](/decks/marketing-planning/04.webp "Soldaki metrikler yıllarca sabit kalıyor; sağdaki kronometreler her sezon yeniden kuruluyor. Aynı ürünün iki farklı hızda değişen yarısı.")

Bu kararın ağırlığı zamanından geliyor. Planlama döngüsü beş yıl öncesinden
başlıyor; uçak bir sermaye yatırımı ve kolayca geri alınamıyor. Bu yüzden
havayolu iş mantığı sürekli iki şey arasında denge kuruyor: uzun vadeli
sermaye yatırımı olan filo ile kısa vadeli piyasa oynaklığına cevap veren
fiyatlandırma.

## Talebi kuran karar yolcu miksinde bitiyor

Eşleştirmenin en ince çözünürlüğü tek bir uçuşun koltukları. Kaynak metin
gelir yönetimini tam olarak bu konuma yerleştiriyor: gelir yönetimi, kabul
edilmesi gereken optimum yolcu miksini belirleyerek arz-talep eşleştirme
sürecinin ince ayarını yapıyor.

Mekanizma şöyle işliyor. Sistem fiyatlandırmanın belirlediği pazar
fiyatlarını girdi olarak alıyor, farklı segmentlerdeki yolcuların beklenen
gelir katkısını karşılaştırıyor ve en yüksek getiriyi sağlayacak yolcu
kombinasyonunu kabul edecek şekilde envanteri kontrol ediyor. Amaç bilet
satmak değil, doğru yolcuya satmak. Gelir yönetimi bölümlerinde gördüğümüz
kısıtlı indirim ve Littlewood kuralı bu cümlenin uygulamasıydı; burada
görünen, o mekanizmanın planlama döngüsünün son halkası olduğu.

![Başlık: Değeri Maksimize Etmek, Fiyatlandırma ve Getiri. Yukarıdan aşağı daralan bir huni. Üst katman, Fiyatlandırma (Pricing): rakiplere ve pazar koşullarına dayalı bilet ücretlerinin (fare filings) oluşturulması; dört bir yandan içeri akan mavi oklar. Orta katman, Getiri Yönetimi (Yield Management): arz ve talep eşleşmesine algoritmik ince ayar yapılması, sınırlı kapasitenin en değerli yolculara saklanması; aşağı akan turuncu oklar. En alttaki kutu, Sonuç, Optimum Yolcu Karması: hangi fiyattan hangi yolcunun uçağa kabul edileceğinin kesin kararı.](/decks/marketing-planning/05.webp "Huninin sırası önemli: gelir yönetimi fiyatı kurmuyor, fiyatlandırmanın kurduğu fiyatlar arasından hangisinin açık kalacağını seçiyor.")

## Bütçe bilinenle tahmin edileni ayrı tutuyor

Beş yıllık ufukla kalkış günü arasında bütçe duruyor ve bütçe iki tür
ölçütle çalışıyor. Mevcut sektör geliri, yield (mil başına gelir) ve doluluk
oranı "bilinen ve düzeltilen" ölçütler: geçmişten geliyor, ölçülebiliyor,
düzeltilebiliyor. GSYİH büyümesi, makroekonomik trendler ve yeni pazara
girişler ise "tahmini" ölçütler: stratejik yönü belirliyor ama doğrulanması
ancak sonradan mümkün.

Bu ayrım karar mekanizmasında önemli, çünkü iki türü aynı güvenle
kullanmak hatalı özgüven üretiyor. Brifingin önerdiği iş kuralı ikisini
birbirine bağlamak: yeni pazar girişlerinde temel karar kriteri,
makroekonomik veriler ile geçmiş dönem doluluk oranları arasındaki
korelasyon olmalı. Tahmin edilen, bilinenle sınanıyor.

![Başlık: Planlama Zaman Çizelgesi (Uçuş Profili). Bir uçuşun alçalma profili gibi çizilmiş, soldan sağa basamak basamak inen mavi hat ve en sağda pist. Dört durak: Uzun Vadeli (1-5 yıl), stratejik temeller, seyir irtifası; Bütçe Planlama (3 yıl - 3 ay), finansal çerçeve, alçalma; Orta Vadeli (1 yıl - 3 ay), taktiksel düzenlemeler, yaklaşma; Kısa Vadeli (3 ay - kalkış), dinamik optimizasyon, son yaklaşma.](/decks/marketing-planning/08.webp "Her basamakta ufuk kısalıyor ama karar daha somutlaşıyor. Pist, kalkış günü: planın bütün katmanlarının aynı uçuşta buluştuğu an.")

![Başlık: Yüksek İrtifa, Uzun Vadeli ve Bütçe Planlaması. Üstte uçuş profilinin ilk iki durağı küçük olarak tekrar ediliyor. Sol kutu, Uzun Vadeli (1-5 yıl ötesi): filo siparişleri ve ağ yeniden tasarımı; yeni pazar fırsatlarının değerlendirilmesi; ittifaklar, ortak girişimler ve partnerlikler. Sağ kutu, Bütçe Planlaması (3 yıllık görünüm). Bilinen metrikler: sektör geliri, getiri (yield), RASM (arz edilen koltuk mili başına gelir), doluluk oranı. Tahmini metrikler: yeni pazar penetrasyonu ve kapanışlar, GSYİH ve makroekonomik trendler.](/decks/marketing-planning/09.webp "Sağ kutudaki iki liste ayrı başlık altında duruyor ve öyle kalmalı: bilinenle tahmin edilen aynı sütunda toplanınca bütçe kendi varsayımını veri sanıyor.")

## Son üç ayda kapasite hâlâ değişebiliyor

Uzun vadeli plan uçağı rotaya koyuyor ama o uçağın kalkış günü doğru uçak
olup olmadığı son aylarda belli oluyor. Kaynak metin kısa vadeli planlamayı
bununla tanımlıyor: kısa vadeli planlama, arzı talebe daha iyi uydurmak
için yakın dönem filo değişimini ele alıyor. Bu dönem kalkışa üç ay kala
başlıyor.

Close-in re-fleeting adı verilen bu hamlede, talep tahmini başlangıçtaki
kapasiteden belirgin şekilde saparsa havayolu o sefere başka bir uçak tipi
atıyor. Talep düşük kalan seferde uçak küçültülüyor ve operasyonel maliyet
düşüyor. Değişim yalnız başına yapılmıyor: aynı anda rekabetçi ücret
düzenlemeleri ve envanter kontrolleri de devreye giriyor. Yani kapasite
statik bir girdi değil; son üç ayda hâlâ oynayan bir değişken. RM sistemi
bir uçuşun kapasitesini sabit bir sayı olarak önbelleğe alıyorsa, bu
dönemde yanlış koltuk sayısıyla optimizasyon yapıyor demek.

![Başlık: Son Yaklaşma, Orta ve Kısa Vadeli Planlama. Üstte orta vadeli ve kısa vadeli durakları piste bağlayan küçük bir rota. Sol kutu, Orta Vadeli (1 yıl - 3 ay kala): yeni rotaların lansmanı ve uçuş saatlerinin revize edilmesi (retiming); ortak uçuş (codeshare) fırsatlarının değerlendirilmesi; küresel görünüme göre fiyatlandırma/getiri stratejisi. Sağ kutu, Kısa Vadeli (3 ay kala - kalkış günü): talebe göre son dakika uçak tipi değişiklikleri (close-in re-fleeting); pazar koşullarına göre rekabetçi fiyat güncellemeleri; getiri yönetimi envanter kontrolleri.](/decks/marketing-planning/10.webp "Sağ kutudaki üç madde üç ayrı ekibin işi ama aynı üç ayda, aynı talep sinyaline göre yapılıyor. Ayrı ayrı çalışırlarsa birbirinin ayarını bozuyorlar.")

## Tek veri seti pazarın bir kısmını görüyor

Bütün bu kararlar pazar verisine dayanıyor ve endüstrinin veri setleri
aynı pazarı farklı yerlerden görüyor. MIDT acente rezervasyonlarına, yani
GDS üzerinden geçen satışa odaklanıyor. IATA DDS hem doğrudan hem dolaylı
satışları kapsıyor ve daha geniş bir görünürlük sağlıyor. T100 de planlama
sürecinde kullanılan setler arasında.

![Başlık: Motorun Yakıtı, Endüstri Veri Setleri. Üstte kutu: sağlıklı bir tarife geliştirme süreci ve rekabetçi getiri yönetimi uygulamaları için çoklu kaynaklardan veri entegrasyonu şarttır. Ortada Kapsamlı Trafik Veritabanı; ona kesikli oklarla bağlanan dört kaynak: GDS, DOT, IATA, ATPCO. Altta, bu veriler neden zorunludur: pazar payını ve yolcu akışlarını anlamak; rakip havayollarının kapasite ve fiyat stratejilerini izlemek (competitive revenue management); gelecekteki arz/talep eğrisini modellemek.](/decks/marketing-planning/11.webp "Dört kaynak dört ayrı kurumdan geliyor ve hiçbiri tek başına veritabanını doldurmuyor. Birleştirme işi havayolunun kendisine kalıyor.")

![Başlık: Rezervasyon ve Kapasite Verileri. Üç sütun. MIDT (Marketing Information Data Tapes): kapsam, bilet kesilmeden önceki GDS rezervasyon verisi (PNR); kaynak, Amadeus, Sabre, Travelport. IATA DDS (Direct Data Solutions): kapsam, MIDT'den daha üstündür, doğrudan (havayolu) hem dolaylı (acente) satışları küresel olarak kapsar; kaynak, ARC, Cirium ve havayolu ortaklığı. OAG (Official Airline Guide): kapsam, tüm havayollarının küresel uçuş tarifelerini barındırır; kaynak, OAG, Innovata, Cirium.](/decks/marketing-planning/12.webp "MIDT'nin kapsamındaki önceki kelimesi italik: veri bilet kesilmeden, yani iptaller ve no-show'lar ayıklanmadan önceki rezervasyonu gösteriyor.")

Sonuç basit: yalnızca MIDT'ye güvenen bir havayolu doğrudan satışları
göremiyor. Pazar payı analizi ve rekabetçi gelir yönetimi için iş kuralı,
en geniş kapsamın, yani doğrudan ve dolaylı satışların birlikte entegre
edilmesi. Doğrudan kanalın payı büyüdükçe MIDT'nin kör noktası da büyüyor.

Ölçtüğü birimin de bir kör noktası var. T100 uçuş bacağı bazlı: yalnızca belirli
bir uçaktaki yolcu sayısını, doğrudan satışlar dahil ve aylık olarak veriyor.
DB1B ise kalkış-varış (O&D) anket verisi: yolcunun tüm seyahat rotasını ve
biletleyen ya da işleten havayolunu gösteriyor.

Bir veri setinin kör noktası bazen yapısal. DB1B verisi yalnızca yüzde
10'luk bir örnekleme dayanıyor ve ABD dışındaki ilk uluslararası limandan
sonrasını kaydetmiyor. Bu yüzden uluslararası kapasite planlamasında ana
kaynak değil, yardımcı bir doğrusal trend göstergesi olarak kullanılmalı.
Mühendislik dersi tanıdık: veri setinin ne ölçtüğünü bilmeden onun
üzerine kurulan model, eksik ölçümü talep eksikliği sanıyor.

![Başlık: Biletleme, Rota ve Ücret Verileri. Üç havalimanı bir kesikli hat üzerinde: PVG, NRT, LAX. Üstte mavi parantez yalnızca NRT-LAX bacağını kapsıyor: T100 (sadece uçuş bacağı / leg). Altta turuncu parantez PVG'den LAX'e bütün hattı kapsıyor: DB1B (tüm güzergah / origin & destination). Altta açıklama: T100 (DOT) uçuş bacağı bazlı veridir, örneğin sadece NRT-LAX uçağındaki yolcu sayısı, doğrudan satışları içerir, aylıktır. DB1B kalkış-varış anket verisidir (%10 örneklem), yolcunun tüm seyahat rotasını, örneğin PVG'den çıkıp LAX'e gidişi, ve biletleyen/işletici havayolunu gösterir. Sağda kutu: ATPCO / SITA, küresel bilet ücreti toplayıcılarıdır, havayollarının fiyat dosyalamalarını içerir.](/decks/marketing-planning/13.webp "Aynı yolcu iki veri setinde iki farklı yolculuk gibi görünüyor: T100'de NRT'den binen biri, DB1B'de PVG'den yola çıkan biri.")

Her veri seti tek bir soruya cevap veriyor; hangisinin hangi soruya
ait olduğunu bilmek, birini ötekinin yerine kullanmamanın yolu.

![Başlık: Veri Seti Sentezi, Doğru Analiz İçin Doğru Araç. Dört sütunlu tablo: veri seti, veri türü, kapsam, temel uygulama. MIDT: rezervasyon (PNR), GDS acenteleri, pazar payı ve acente performansı. IATA DDS: bilet/satış, doğrudan ve dolaylı (küresel), kapsamlı pazar ve rakip analizi. T100: uçuş bacağı (leg), kesin trafik (aylık), hat bazlı fiziksel doluluk analizi. DB1B: güzergah (O&D), %10 örneklem (biletli), uçtan uca yolcu akışı analizi. OAG: tarife (schedule), tüm havayolları, ağ planlama ve kapasite takibi. ATPCO: ücret (fare), küresel fiyat dosyaları, rekabetçi fiyatlandırma stratejisi.](/decks/marketing-planning/14.webp "Son sütunu soru listesi olarak oku: bir analize başlamadan önce sorunun hangi satıra düştüğüne bak, veriyi oradan seç.")

## Dağıtım kanalı da bir maliyet kararı

Planlamanın son ayağı dağıtım. Temel strateji zaman içinde satış maliyetini
(cost of sale), diğer adıyla dağıtım maliyetini düşürmek. Bu, düşük
maliyetli doğrudan online kanalların payını artırmak demek. Ama dolaylı
kanal pazar erişimi için hâlâ kritik; o yüzden maliyet-fayda dengesi sürekli
izleniyor ve acente kanalı, pazar payını korumak için stratejik olarak
kullanılmaya devam ediyor. Acente kanalının nabzı da yine MIDT verisiyle
tutuluyor. Önceki bölümlerde anlatılan komisyon kesintileri ve NDC bu
dengenin farklı yıllardaki halleriydi.

![Başlık: Pazara Sunum, Satış ve Dağıtım. Sağ üstte turuncu kutu, stratejik hedef: zaman içinde satış ve dağıtım maliyetlerini (cost of sale) kademeli olarak düşürmek. Solda Havayolu, sağda Yolcu yazan iki daire, aralarında iki hat. Üstteki mavi hat, Doğrudan Kanallar (Direct): online, havayolu web sitesi ve mobil uygulama; offline, çağrı merkezleri ve bilet satış ofisleri. Alttaki gri hat, Dolaylı Kanallar (Indirect): seyahat acenteleri (GDS) ve kurumsal seyahat yöneticileri.](/decks/marketing-planning/06.webp "İki hat da aynı yolcuya varıyor. Stratejik hedef hatlardan birini kapatmak değil, trafiği zamanla daha ucuz olanına kaydırmak.")

Kapanış slaytı bütün bu parçaları tek cümleye bağlıyor: pazarlama planı
durağan bir belge değil, verilerle sürekli optimize edilen bir operasyon.

![Başlık: Özet, Bütüncül Pazarlama Planlaması. Solda bir sunucudan çıkan turuncu ok bir teraziye gidiyor; sunucunun üstünde düşen bir çizgi grafiği. Sağda üç kutu. Hizalanma (Alignment): kârlılık, tarife, fiyat, getiri ve dağıtım kararlarının kusursuz bir ekosistem içinde uyumuna bağlıdır. Zamanlama (Timing): kararlar, 5 yıl öncesinden başlayan stratejik vizyon ile kalkış günündeki son dakika optimizasyonlarının (close-in re-fleeting) birleşimidir. Veri Odaklılık (Data-Driven): MIDT, DDS, OAG ve DB1B gibi sektörel veri setleri, rekabetçi kalabilmek ve pazar talebini doğru okumak için vazgeçilmez yakıttır. Alt bant: havayolu pazarlama planlaması durağan bir belge değil, verilerle sürekli optimize edilen, dinamik bir operasyondur.](/decks/marketing-planning/15.webp "Üç kutu bu bölümün üç ekseni: hangi fonksiyonlar, hangi zaman ufku, hangi veri. Aşağıdaki çıkarımların her biri bu üçünden en az birine dokunuyor.")

## Yarın işe yarayacak dört çıkarım

1. **RM parametrelerini düzenli güncelle.** Talep yüksek olduğunda koltuğu
   düşük ücretli sınıflar yerine yüksek getirili yolcuya saklamak, algoritma
   parametrelerinin güncel talebi yansıtmasına bağlı. Bir kez ayarlanıp
   bırakılan parametre, doğru yolcu miksini değil geçen sezonunkini seçer.
2. **Son üç ayı kapasite kararına açık tut.** Talep tahmini planlanan
   kapasiteden belirgin şekilde saptığında uçak tipini değiştir; düşük
   talepli seferde küçült. Sistemlerini kapasitenin bu dönemde
   değişebileceğini varsayarak kur, fiyat ve envanter ayarını aynı hamlede
   yap.
3. **Doğrudan kanalı teşvik et, acente kanalını ölç.** Dağıtım maliyetini
   online doğrudan kanal üzerinden düşür, ama acente kanalını MIDT ile
   izleyerek pazar payını koruyacak kadar canlı tut.
4. **Pazar verisini kapsamına göre tart.** Pazar payı ve rekabet analizini
   yalnızca MIDT'ye dayandırma; doğrudan satışları da gören IATA DDS gibi
   setlerle birleştir. DB1B'yi uluslararası rotalarda ana kaynak değil,
   trend göstergesi olarak kullan. Yeni pazar kararında makroekonomik
   tahmini geçmiş doluluk oranıyla sına.

Bu bölümde ne yok: yolcu miksini seçen mekanizmanın kendisi (gelir yönetimi
bölümleri), acente kanalının maliyet yapısı ve komisyonun tarihi ("Seyahat
dağıtım ekosistemi ve yeni dağıtım yeteneği"). Bu bölüm o parçaların hangi
zaman çizelgesinde ve hangi veriyle birbirine bağlandığını anlatmak için var.
