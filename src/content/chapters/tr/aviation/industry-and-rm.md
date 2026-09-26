---
title: "Havacılık endüstrisi ve gelir yönetimi analizi"
domain: "aviation"
summary: "Maliyetin yüzde 80-90'ı sabitken fazladan bir yolcunun maliyeti neredeyse sıfır, bu yüzden havayolunda fiyatı maliyet değil yolcunun ödemeye razı olduğu tutar belirliyor. Bu bölüm gelir yönetimini zorunlu kılan maliyet yapısını ve bu yönetimin üzerinde çalıştığı ağ birimlerini, yani bacak, segment, O&D hizmeti ve pazarı anlatıyor."
audience: "Envanter, fiyatlandırma, teklif ya da tarife sistemleriyle çalışan ve gelir yönetiminin neden maliyetten değil talepten başladığını anlamak isteyen yazılımcı ve ürün insanı. Ön bilgi gerekmiyor; CapEx, spoilage, flight leg, flight segment, O&D hizmeti ve market metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [pricing, solution-architecture]
ai: generated
---

Gelir yönetimi bölümlerinin çoğu mekanizmayla başlıyor: kısıtlı indirim,
fazla satış, taşan talebin tahmini. Bu bölüm bir adım geri gidip o
mekanizmaların neden gerektiğini soruyor. Cevap bilançoda duruyor.
**Havayolunda maliyetin büyük kısmı uçak kalkmadan önce harcanmış olduğu
için fiyatı maliyet değil, yolcunun ödemeye razı olduğu tutar belirliyor;
gelir yönetimi de bu yüzden bir lüks değil, hayatta kalma koşulu.** İkinci
yarıda aynı mantığın üzerinde çalıştığı birimlere, yani bir uçuş ağını
yazılımın gözünde oluşturan bacak, segment, hizmet ve pazar kavramlarına
bakacağız.

![Sunumun kapak slaytı. Sol üstte etiket: Endüstri Analizi ve Operasyonel Kavramlar. Başlık: Havacılık Endüstrisinde Gelir Yönetimi. Alt başlık: Ekonomik Dinamikler, Maliyet Yapıları ve Ağ Anatomisi. Sağda dünya haritası üzerinde kıtalar arasında kesişen ince uçuş yayları. Altta Alan Notları kutusu: bu sunum havacılıktaki gelir yönetimi (RM) ve getiri yönetimi (yield management) disiplinlerinin ekonomik temellerini ele alır; RM doğrudan teklif yönetimi (offer management) ve envanter (inventory) akışlarıyla ilgilidir; havacılıkta kârlılık GDS ve PSS altyapılarında çalışan karmaşık optimizasyon algoritmaları ile yönetilir.](/decks/industry-and-rm/01.webp "Alt başlıktaki üç kelime bölümün sırası: önce ekonomi, sonra maliyet yapısı, en son ağ. Harita son kısmın habercisi.")

## Havayolu önce bir sermaye işletmesi

Kaynak metin sektörü üç kaynağın yoğun tüketimiyle tanımlıyor: emek, yakıt
ve her şeyden önce sermaye. Uçak ve tesislere yapılan yatırım o kadar büyük
ki havayolları tarihsel olarak yıllık gelirlerinin yüzde 15'ini sermaye
ekipmanına ayırmış. Karşılaştırma için üretim sektörü: orada sermaye
harcamasının oranı havacılığın yarısından az, kabaca yüzde 7,5.

Bu oranın iki sonucu var. Birincisi giriş bariyeri: her yıl gelirin
yedide birini ekipmana yatırmadan bu işte kalmak mümkün değil. İkincisi
zaman ufku: harcama gelirle doğrudan orantılı olduğu için filo yenileme
kararı bugünkü satışa değil, uzun vadeli pazar tahminine ve gelir
projeksiyonuna dayanmak zorunda. Uçak alımı ya da kiralaması en büyük
bilanço yükü; ağ planlama sistemleri de bu varlıkların rotalarını yıllar
öncesinden optimize etmek için var.

![Başlık: Endüstrinin Temel Gerçekliği, Yoğun Kaynak Tüketimi ve Sermaye İhtiyacı. Açıklama: havacılık sektörü, uçak ve tesislere devasa yatırımlar gerektiren; emek, yakıt ve her şeyden önce sermaye yoğun bir ekosistemdir. Üç simge: Sermaye (Capital), Emek (Labor), Yakıt (Fuel). Altta iki panel. Solda koyu mavi Havacılık Sektörü: yüzde 15, yıllık gelirin yüzde 15'i doğrudan sermaye ekipmanlarına (CapEx) harcanır. Sağda gri Üretim Sektörü: yaklaşık yüzde 7,5, sermaye harcaması havacılığın yarısından daha azdır. Alan notları: CapEx, doğrudan işletme maliyetleri (DOC), dolaylı işletme maliyetleri (IOC) ve filo planlama terimleri; uçak alımı veya kiralaması en büyük bilanço yüküdür, uçağın yerde kalması (AOG) devasa fırsat maliyeti yaratır; ağ planlama sistemleri bu yüksek sermayeli varlıkların rotalarını yıllar öncesinden optimize eder.](/decks/industry-and-rm/02.webp "Alan notundaki AOG satırına dikkat: yerde bekleyen uçak masraf yapmayı bırakmıyor, yalnızca gelir üretmeyi bırakıyor.")

Alan notundaki bir satır bu yapının karanlık yüzünü gösteriyor: uçağın
yerde kalması (AOG, aircraft on ground) devasa bir fırsat maliyeti
yaratıyor. Sermaye yoğun bir varlık çalışmadığında maliyeti durmuyor,
yalnızca karşılığında gelir gelmiyor. Bu, bölümün geri kalanındaki bütün
mantığın ilk ipucu: havayolunun asıl derdi harcamayı kısmak değil, zaten
harcanmış olanın karşılığını almak.

## Fazladan bir yolcu neredeyse bedava, boş koltuk ise geri gelmiyor

Sermaye yoğunluğunun maliyet tablosundaki karşılığı şu: sabit maliyetler
toplam maliyetin yüzde 80 ile 90'ı arasında. Uçak kiraları, personel,
bakım ve operasyon, uçak kalksa da kalkmasa da, dolu da olsa boş da olsa
ödeniyor. Geriye kalan yüzde 10-20'lik değişken dilimin de yalnızca yüzde
20'si gerçekten uçuşla ilişkilendirilebiliyor: yakıt, ikram ve acente
komisyonları.

Buradan brifingin marjinal maliyet paradoksu çıkıyor. Tarifeli bir uçuşta
uçağın kalkması için gereken maliyetin büyük kısmı zaten harcanmış;
fazladan bir yolcu taşımanın artımlı maliyeti minimum. Kaynak metin karar
mekanizmasını buna göre kuruyor: bir yolcunun maliyeti hesaplanırken odak
bu küçük artımlı maliyet değil, yolcunun ödediği ücretin kârlılığa etkisi
olmalı. Sabit maliyetin bu kadar yüksek olması, havayollarının düşük marjlı
ek yolcuyu kabul etmeye neden bu kadar meyilli olduğunun da ekonomik
temeli.

![Başlık: Marjinal Maliyet Paradoksu. Açıklama: uçağın kalkışı için maliyetin büyük kısmı zaten harcanmıştır; tarifeli bir uçuşta ekstra bir yolcu taşımanın marjinal maliyeti minimumdur. Ortada halka grafik: koyu mavi büyük dilim yüzde 80-90 sabit maliyetler (uçak kiraları, personel, bakım, operasyon); turuncu küçük dilim yüzde 10-20 değişken maliyetler; turuncu dilimden ayrılan ince bir parça için not: gerçek değişkenler, toplam değişken maliyetin de sadece yüzde 20'si gerçekten değişkendir (yakıt, ikram, komisyonlar). Sağda boş bir yolcu koltuğu çizimi ve altında kutu: Ekstra Yolcu Maliyeti, Minimum. Alan notları: marginal cost, spoilage (boş koltuk) ve spill (talep kaçırma) terimleri; havacılıkta satılamayan koltuk kalkış anında çöpe gider (spoilage), üretim sektörünün aksine havayolları ürünlerini depolayamaz; bu maliyet yapısı envanter kontrolü sistemlerinin neden fiyat yerine gelir maksimizasyonuna odaklandığını açıklar.](/decks/industry-and-rm/03.webp "Halkanın turuncu dilimindeki o ince parça, uçuşa gerçekten bağlanabilen maliyetin ne kadar küçük olduğunu gösteriyor. Geri kalan her şey paylaştırma sorunu.")

Madalyonun öbür yüzü slaytın alt notunda: satılamayan koltuk kalkış anında
çöpe gidiyor. Buna spoilage deniyor ve havayolunu üretim sektöründen
ayıran asıl fark bu. Fabrika satamadığı ürünü depoya kaldırıp gelecek ay
satabilir; havayolunun ürünü kalkış saatinde son kullanma tarihine ulaşıyor.
Fazladan yolcu neredeyse bedava, boş koltuk ise bir daha satılamıyor. Bu
ikisi birlikte düşünüldüğünde bölümün ilk uygulanabilir kuralı ortaya
çıkıyor: son dakika satışında ya da boş koltuğu doldururken, marjinal
maliyetin üzerindeki her gelir kârdır.

Değişken maliyetin bu kadar azının uçuşa doğrudan bağlanabilmesi yazılım
tarafında da bir soru doğuruyor: bir uçuşun maliyeti nereden
hesaplanacak? Brifingin önerisi değişken maliyetleri istasyon bazlı tahsis
(allocation) yöntemiyle ağ geneline dağıtmak. Yani uçuş başına maliyet
ölçülen bir değer değil, bir paylaştırma kuralının çıktısı. Uçuş
kârlılığını gösteren bir rapor kuruyorsan, o rakamın ne kadarının ölçüm,
ne kadarının tahsis kuralı olduğunu raporun kendisinde göstermen gerekiyor;
aksi halde kural değişince kârlı uçuş bir gecede kârsız görünür.

## Fiyatı maliyet değil ödeme isteği belirliyor

Maliyet tarafı fiyat için bir alt sınır bile sayılmayacak kadar zayıf
olunca, fiyatı belirleyen başka bir şey olmalı. Kaynak metin onu açıkça
söylüyor: değişken maliyetler düşük olduğu için fiyatı belirleyen temel
faktör maliyet değil, müşterinin ödemeye razı olduğu tutar. Havayolları bu
yüzden geleneksel üretim şirketlerinden farklı olarak fiyatlandırmada
değişken maliyete değil, talep yönetimine ve müşteri segmentasyonuna
odaklanmak zorunda.

Bu da brifingin en sert cümlesine götürüyor: müşteri segmentasyonu,
hedefli fiyatlandırma ve gelir yönetimi dinamikleri bir lüks olmaktan
çıkıp hayatta kalma gerekliliğine dönüşmüş. Zincir üç halkalı. Değişken
maliyetin düşüklüğü fiyatlandırmaya esneklik veriyor; o esneklik de
kullanılmadığı sürece boşa gidiyor. Onu kullanan disiplin gelir yönetimi.

![Başlık: Gelir Yönetimi Bir Lüks Değil, Hayatta Kalma Zorunluluğudur. Açıklama: değişken maliyetlerin düşük olması nedeniyle fiyatı belirleyen temel faktör maliyet değil, müşterinin ödemeye razı olduğu tutardır. Üç ok birbirine bağlı: mavi ok Değişken Maliyetlerin Düşüklüğü, turuncu ok Fiyatlandırma Esnekliği, koyu mavi ok Gelir Yönetimi. Altında üç kutu. Müşteri Segmentasyonu: iş seyahati yapanlar ile turistik seyahat edenlerin ayrıştırılması. Hedefli Fiyatlandırma: doğru fiyatı, doğru kitleye, doğru zamanda sunmak. Envanter Kontrolü: kârı değil, toplam geliri maksimize edecek şekilde kapasiteyi yönetmek. Alan notları: dynamic pricing, continuous pricing, fare families, willingness to pay (WTP), booking classes (RBD) terimleri; bu yapı PSS içindeki pricing ve offer management süreçlerinin temelidir; bilet fiyatları dinamik olarak kalan gün sayısına (advance purchase) ve uçuşun doluluk oranına (load factor) göre algoritmalarla anlık belirlenir.](/decks/industry-and-rm/04.webp "Üç kutu üç ayrı sistem: segmentasyon müşteri verisinde, hedefli fiyat ücret tablosunda, envanter kontrolü rezervasyon sınıfında yaşıyor. Gelir yönetimi üçünü aynı hedefe bağlıyor.")

Üç kutu, gelir yönetiminin üç işini ayırıyor. Segmentasyon, iş seyahati
yapanla tatil için uçanı ayırmak. Hedefli fiyatlandırma, doğru fiyatı
doğru kitleye doğru zamanda sunmak. Envanter kontrolü ise kapasiteyi
toplam geliri en yükseğe çıkaracak şekilde yönetmek. Slaytın alt notu
bunun PSS içinde nerede yaşadığını da söylüyor: pricing ve offer management
süreçlerinin temeli bu yapı, bilet fiyatı da kalkışa kalan gün sayısına
(advance purchase) ve uçuşun doluluk oranına (load factor) göre anlık
belirleniyor. Yazılım tarafında bunun karşılığı, fiyatın bir tablo satırı
değil bir fonksiyon çıktısı olması: aynı koltuğun fiyatı, sorgunun
zamanına ve uçağın o anki durumuna bağlı.

Bu tablo, brifingin öne çıkardığı yüksek doluluk oranı vurgusunu da
açıklıyor. Sabit maliyetin yüksek, değişken maliyetin düşük olduğu bir
yapıda havayolu çok hassas bir dengede çalışıyor; operasyonel verimlilik
ve load factor bu dengenin ayakta kalıp kalmadığını gösteren ilk
ölçütler. Ama doluluk tek başına hedef değil. Brifing kârlılık için
yalnızca maliyet düşürmeye odaklanmanın yetersiz kaldığını söylüyor;
segmentasyonu derinleştirmek gerekiyor.

## Gelir mi kâr mı sorusu burada daha az şey değiştiriyor

Envanter kontrolü tasarlanırken sorulacak klasik soru şu: optimize edilen
şey gelir mi, kâr mı? Değişken maliyetin yüksek olduğu bir üretim
şirketinde bu fark büyük; fazladan satılan her birim ciddi bir maliyet
getiriyor ve geliri artıran karar kârı düşürebiliyor. Havayolunda durum
farklı. Kaynak metin sektörün varlık yoğun doğası yüzünden bu ayrımın,
değişken maliyetin yüksek olduğu üretim sektörüne kıyasla daha az kritik
olduğunu söylüyor. Temel odak kapasiteyi en yüksek geliri getirecek
şekilde yönetmek.

Pratik sonucu: koltuk envanteri yönetilirken ana performans göstergesi
gelir maksimizasyonu olarak belirleniyor. Slayt bunu daha keskin
söylüyor: envanter kontrolü kârı değil, toplam geliri maksimize edecek
şekilde kapasiteyi yönetiyor. Artımlı maliyet sıfıra bu kadar yakınken
geliri en yükseğe çıkaran karar ile kârı en yükseğe çıkaran karar çoğu
zaman aynı karar. Bu, RM algoritmalarının hedef fonksiyonunda maliyet
teriminin neden çoğunlukla yer almadığının da açıklaması; eksik bir
tasarım değil, maliyet yapısının doğrudan sonucu.

Bir uyarı notu: "daha az kritik" hiç kritik değil demek değil. Yakıt,
ikram ve acente komisyonu gibi gerçekten uçuşa bağlanan kalemler var. Ama havayolunun
optimizasyon probleminin ağırlık merkezi maliyette değil, sınırlı
kapasitenin hangi talebe verileceğinde.

## Ağın birimi uçuş değil, dört ayrı katman

Gelir yönetiminin neyi optimize ettiği belli oldu: kapasiteden gelen
gelir. Geriye kapasitenin hangi birimle ölçüldüğü kalıyor ve burada
günlük dildeki "uçuş" kelimesi yetmiyor. Brifing bir ağı dört katmanla
tanımlıyor ve bu hiyerarşiyi biletleme ile kapasite yönetimi
yazılımlarının temeli olarak görüyor.

Uçuş bacağı (flight leg) duraksız bir şehir çifti: LAX-ORD gibi. Uçak
kalkıyor ve bir sonraki yerde iniyor; fiziksel kapasite bu birimde
tanımlı. Uçuş segmenti (flight segment) ise aynı uçuş numarası üzerindeki
bütün kalkış-varış çiftleri. Bir uçuş LAX-ORD-LHR rotasını izliyorsa, LAX-LHR
bir segment; yolcu açısından tek uçuş, fiziksel olarak iki bacak.

Üçüncü katman O&D hizmeti (origin and destination service): belirli bir
kalkış, varış ve aktarma noktası olan yolculuk. ORD üzerinden LAX-BOS
böyle bir hizmet; yolcu iki farklı uçuşu birbirine bağlıyor. En üstte
pazar (market) duruyor: aynı başlangıç ve bitiş noktasına sahip bütün O&D
hizmetlerinin toplamı. Brifingin iş kuralı açık: sistem hem duraksız
uçuşları hem de belirli bağlantı noktaları üzerinden sunulan hizmetleri
aynı pazarda değerlendirmeli. LAX-BOS pazarında duraksız uçuşla ORD
aktarmalı hizmet birbirinin rakibi.

![Başlık: Havacılık Ağının Yapı Taşları. Şemada dört havalimanı: LAX, ORD, LHR ve aşağıda BOS. LAX-ORD arasındaki düz hat koyu mavi köşeli parantezle işaretli: uçuş bacağı (flight leg), kesintisiz (non-stop) şehir çifti. LAX'ten LHR'ye uzanan açık mavi yay Uçuş 1 olarak etiketli: segment (flight segment), belirli bir uçuş numarası üzerindeki O/D çifti. LAX'ten ORD'ye ve oradan BOS'a giden turuncu kesikli çizgi: O&D hizmeti (service), belirli kalkış, varış ve aktarma noktaları olan pazar. En üstte LAX ile LHR'yi kapsayan gri parantez: pazar (market), aynı kalkış ve varış noktasına sahip tüm O&D hizmetlerinin toplamı. Alan notları: O&D, married segments, network control ve SSIM terimleri; SSIM (tarife) dosyaları leg bazında oluşturulur, alışveriş motorları bu bacakları algoritmik olarak birleştirerek O&D hizmetleri sunar; modern havayolları bacak bazlı envanterden O&D tabanlı gelir yönetimine geçmiştir, married segments mantığı bu yapıyı korur.](/decks/industry-and-rm/05.webp "Turuncu kesikli çizgi LAX-ORD bacağını Uçuş 1 ile paylaşıyor. Aynı koltuk iki ayrı pazarın talebine hizmet ediyor, sorun da buradan başlıyor.")

Slaytın alt notu bu katmanların sistemlerde nerede yaşadığını söylüyor.
Tarife dosyaları, yani SSIM, bacak bazında oluşturuluyor. Alışveriş
motorları bu bacakları algoritmik olarak birleştirerek O&D hizmeti
sunuyor. Yani veri en alt katmanda saklanıyor, ürün ise bir üst katmanda
kuruluyor. Modern havayolları da envanteri bacak bazlı kontrolden O&D
tabanlı gelir yönetimine taşımış ve married segments mantığı bu yapıyı
koruyor: birlikte satılan bacaklar sistemde bir O&D hizmeti olarak
kalıyor.

Yazılımcı için buradaki ders veri modeliyle ilgili. Kapasite bacakta,
fiyat ve talep pazarda, yolcunun gördüğü ürün ise O&D hizmetinde. Bu üç
birimi tek bir "uçuş" tablosuna sıkıştıran bir model, aktarmalı bir
yolcunun LAX-ORD bacağında kapladığı koltuğu LAX-ORD pazarının yolcusundan
ayırt edemiyor. Envanter kararı bacakta verilip gelir pazarda ölçülürse,
ikisi arasındaki bağı kuran katman eksik kalıyor. Bacak bazlı kontrolden
köken-varış kontrolüne geçişin anlatıldığı bölüm tam bu eksikliğin
hikâyesi.

## Maliyet yapısı ile ağ yapısı aynı problemin iki yüzü

Bölümün iki yarısı ayrı konular gibi duruyor ama tek bir cümlede
birleşiyor. Maliyetin yüzde 80-90'ı sabit ve kalkıştan önce harcanmış
olduğu için havayolunun ürettiği şey aslında belirli bir bacakta,
belirli bir saatte bozulan koltuk. O koltuğu hangi pazarın hangi
yolcusuna vereceğine karar vermek, maliyeti düşürmekten daha çok gelir
getiriyor. Karar da ancak ağın dört katmanı ayrı ayrı modellenmişse
doğru verilebiliyor: kapasite bacaktan, talep ve fiyat pazardan geliyor.

Bu yüzden brifingin segmentasyon önerisi ağ diliyle kurulmuş: kârlılığı
artırmak için pazarın sunduğu farklı bağlantı noktaları ve hizmet
seçenekleri üzerinden müşteri segmentasyonu derinleştirilmeli. Aynı LAX-BOS
pazarında duraksız uçuşu seçen yolcu ile ORD aktarmasını kabul eden
yolcu, büyük ihtimalle aynı fiyata razı olan yolcu değil. Hizmet
seçenekleri segmentasyonun kendisi.

## Yarın işe yarayacak dört çıkarım

1. **Boş koltuğu marjinal maliyete göre fiyatla.** Değişken maliyet
   düşük olduğu için son dakika satışında ve boş koltuk doldururken
   marjinal maliyetin üzerindeki her gelir kârdır. Dinamik fiyatlama
   kuralını bu alt sınıra göre kur, tam maliyete göre değil.
2. **Filo kararını uzun vadeli projeksiyona bağla.** Gelirin yaklaşık
   yüzde 15'i sermaye ekipmanına gittiği için filo yenileme kararları
   bugünkü satışa değil, uzun vadeli pazar tahminine ve gelir
   projeksiyonuna dayanmalı.
3. **Segmentasyonu maliyet kesintisinin önüne koy.** Kârlılığı yalnızca
   maliyet düşürerek artırmak yetmiyor. Pazardaki farklı bağlantı
   noktalarını ve hizmet seçeneklerini ayrı segmentler olarak ele al ve
   fiyatı onlara göre farklılaştır.
4. **Envanterin ana göstergesi gelir olsun.** Sabit maliyet yüksekken
   koltuk envanterini yönetirken temel KPI gelir maksimizasyonu. Uçuş
   bazlı maliyet raporlarında ise istasyon bazlı tahsis kuralının payını
   görünür tut; o rakam ölçüm değil, paylaştırma.

Bu bölümde ne yok: gelir yönetiminin tarihsel doğuşu ("1978: kâr
garantisi kalkınca gelir yönetimi doğdu"), kısıtlı indirim ve fazla
satışın mekanizması (yield management bölümleri), bacak bazlı kontrolden
köken-varış kontrolüne geçişin ayrıntısı ("Gelir yönetimi ve stratejik
operasyonlar: PEOPLExpress ve American Airlines analizi") ve boş koltuğun
tersi olan taşan talebin nasıl tahmin edildiği (spill bölümleri). Bu bölüm
o mekanizmaların hepsinin neden gerektiğini maliyet tablosundan ve ağın
yapısından okumak için var.
