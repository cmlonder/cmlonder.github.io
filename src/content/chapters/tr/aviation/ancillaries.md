---
title: "Havayolu ek hizmetleri (ancillaries) ve iş mantığı analizi"
domain: "aviation"
summary: "Havayolları yalın bir temel ücret satıp yolcunun gerçekten ödemeye razı olduğu hizmetleri üzerine geri ekliyor. Bu bölüm o ekleme işinin arkasındaki iş mantığını anlatıyor: hizmetin nerede tüketildiğine göre hangi belgeye yazıldığı, sabit ücretten pazar bazlı fiyata geçiş, ATPCO S-8 kaydıyla markanın kanallara taşınması ve sadakat statüsüne göre değişen toplam güzergâh fiyatı."
audience: "Fiyatlandırma, teklif yönetimi, biletleme ya da gelir muhasebesi sistemleriyle çalışan ve ek hizmetin neden sepete bir satır eklemekten ibaret olmadığını anlamak isteyen yazılımcı ve ürün insanı. Ücret ürünleri bölümlerinin okunmuş olması işe yarar; EMD, YQ/YR, S-8 kaydı, RBD ve toplam güzergâh fiyatlaması metnin içinde tanımlanıyor."
pubDate: 2026-09-26
topics: [solution-architecture, pricing]
ai: generated
---

Önceki bölümler ücreti tek bir şey gibi ele aldı: bir fiyat, bir kural
seti, bir rezervasyon sınıfı. Bu bölüm o ücretin parçalandığı anı
anlatıyor. Havayolları artık her şeyi içine alan bir bilet satmıyor; yalın
bir temel ücret satıp yolcunun istediği hizmetleri üzerine geri ekliyor.
Kaynak metin bunu açıkça söylüyor: havayolları gösterişsiz bir temel ücret
sunuyor ve müşterinin rezervasyon anında gerçekten ödemeye razı olduğu
hizmetleri bunun üzerine geri ekliyor. **Ek hizmet satmak bir ürün kararı
olduğu kadar bir belge, kayıt ve mutabakat kararı: her eklenen hizmet
biletin dışında ayrı bir hayat sürüyor ve o hayatın kuralları ATPCO ile
IATA standartlarında yazılı.**

![Sunumun kapak slaytı. Ortada lacivert, üç yanında girinti olan bir blok; üzerinde Temel Ücret yazıyor. Blokun üç girintisine yukarıdan ve iki yandan birer küp (sarı, turkuaz, turuncu) oklarla yaklaşıyor, her küp bir yapboz parçası gibi yerine oturmak üzere. Başlık: Havayolu Ek Hizmetleri ve Modüler Fiyatlandırma. Alt başlık: Geleneksel Biletlemeden Kişiselleştirilmiş Toplam Fiyatlandırmaya Geçiş. Konuşmacı notu: sunum eski dosyalanmış ücretlerden modern teklif yönetimine ve modüler dağıtıma geçişi anlatıyor; hedef kitle havayolu yöneticileri, fiyatlandırma analistleri ve ticari strateji ile ATPCO/GDS teknik mimarisinin kesişimini anlamak isteyen sistem mühendisleri.](/decks/ancillaries/01.webp "Temel ücret bloğunun girintileri boş bırakılmış: ürün, eksik parçalarıyla birlikte tasarlanıyor. Hangi parçanın takılacağına yolcu karar veriyor.")

## Paketi bozmak iki gelir kalemi yarattı

Her şey dahil bilet tek bir fiyattı ve tek bir belgeydi. Yemek, bagaj,
koltuk seçimi o fiyatın içinde eriyordu; hangisinin ne kadar değer
ürettiğini ayrıştırmak mümkün değildi. Paket bozulunca iki şey birden oldu.
Temel ücret, rekabet edilen fiyat olarak aşağı indi. Geri kalan hizmetler
ise ayrı ayrı fiyatlanabilir, ayrı ayrı satılabilir hale geldi.

Brifing bu değişimin iki amacını sayıyor: marka sadakati oluşturmak ve
artımlı gelir elde etmek. İkincisinin mantığı basit: yolcu yalnızca
istediği hizmete para ödüyor, havayolu da temel ücretten taviz vermeden
marjını hizmet üzerinden artırıyor. Kaynak metnin analizi de bunu
doğruluyor: bu yaklaşım, fiyat rekabetçiliğini korurken kişiselleştirilmiş
hizmetlerle marjı büyütme stratejisi.

Aynı slaytta üçüncü bir kalem daha duruyor: YQ ve YR. Bunlar yakıt ve
sigorta ek ücretleri (surcharge). Modern perakende anlamında ek hizmet
değiller; yolcu bunları seçmiyor. Brifingin tanımına göre YQ/YR
biletlemenin bir parçası sayılıyor, havayolu bilet faturalama süreci
sırasında sistem tarafından otomatik hesaplanıyor ve finansal mutabakatları
(settlement) da bu aşamada yapılıyor. Slaytın konuşmacı notu neden yine de
bu başlık altında durduklarını söylüyor: tarihsel olarak, gelir
muhasebesinde temel ücret gelirini diğer gelirden ayırmanın ilk zemini
bunlardı.

![Başlık: Her Şey Dahil Modelden İsteğe Bağlı Hizmetlere. Solda ortasından çatlamış gri bir blok: Geleneksel Her Şey Dahil Bilet. Ortada sağa bakan bir ok. Sağda lacivert, alçak bir blok: Yalın Temel Ücret; üzerinde yemek tabağı, bavul, koltuk, iki Wi-Fi simgesi ve bir ikon daha; en sağda bu simgeleri kendine çeken bir mıknatıs, altında Müşteri Tercihi yazıyor. Altta üç kutu. 1, Marka Farkındalığı: havayolu markasını farklılaştırma. 2, Ek Gelir (Ancillary): sadece müşterinin ödemeye istekli olduğu hizmetlerin sunulmasıyla yaratılan yeni gelir akışları. 3, YQ/YR Ek Ücretleri: bilet faturalandırma sürecinde tahsil edilen yakıt ve sigorta ek ücretleri. Konuşmacı notu: YQ yakıt, YR sigorta/sistem ek ücreti; teklif yönetiminde temel değişim durağan, önceden paketlenmiş ücretlerden havayolunun perakendeci gibi davrandığı dinamik paketlemeye geçiş.](/decks/ancillaries/02.webp "Üçüncü kutu diğer ikisiyle aynı sırada ama aynı türden değil: YQ/YR yolcunun seçtiği bir hizmet değil, biletle birlikte zorunlu gelen bir kalem.")

Yazılım tarafında bunun karşılığı şu: fiyat modelinde tek bir "ekstra"
kavramı yok. Biletle birlikte zorunlu hesaplanan ve biletle aynı anda
mutabakata giren kalemler bir yerde, yolcunun seçip ayrıca ödediği
hizmetler başka bir yerde duruyor. İkisini aynı tabloya aynı bayrakla
koymak, faturalama ve mutabakatta ayrışmaları gereken anda ayrıştırılamaz
hale getiriyor.

## Hizmetin nerede tüketildiği hangi belgeye yazılacağını belirliyor

Brifing ek hizmetleri üç ana kategoride topluyor: işlem ücretleri, uçuş
ekstraları (air extras) ve seyahat ekstraları. Ayrımın ölçütü hizmetin ne
olduğu değil, nerede tüketildiği ve nasıl tahsil edildiği.

İşlem ücretleri, kredi kartı işlem ücreti ya da seyahat acentesi kanal
ücreti gibi kalemler, uçak biletinde görünmüyor; ayrı bir yolcu makbuzuna
(passenger receipt) ekleniyor. Uçuş ekstraları uçağın içinde tüketilen
hizmetler: internet, önceden koltuk seçimi, yemek, uçak içi eğlence. Bunlar
için ayrı bir Elektronik Çeşitli Belge (EMD) düzenlenmesi ve ona uygun bir
mesajlaşma altyapısı gerekiyor. Seyahat ekstraları ise uçuştan önce ya da
sonra tüketilen hizmetler: yer ulaşımı, evden havalimanına bagaj taşıma,
özel yolcu salonu erişimi.

![Başlık: Ek Hizmetlerin (Ancillary) Sınıflandırılması. Üç sütun. Mavi, Bilet İşlem Ücretleri: kredi kartı işlem ücretleri veya seyahat acentesi kanal ücretleri; uçak biletinde değil, yeni bir yolcu makbuzunda (passenger receipt) görünür. Turkuaz, Uçuş Ekstraları: uçak içinde tüketilen hizmetler (örnek: internet, önceden koltuk seçimi, yemek, uçak içi eğlence); gereksinim: ayrı bir EMD (Elektronik Çeşitli Belge) düzenlenmesi ve özel mesajlaşma altyapısı. Turuncu, Seyahat Ekstraları: uçuştan önce veya sonra tüketilen hizmetler (örnek: yer ulaşımı, evden havalimanına bagaj taşıma, özel yolcu salonu erişimi). Konuşmacı notu: kağıt MCO'lardan IATA standardı EMD'lere geçiş (uçuşa bağlı kalemler için EMD-A, bağımsız kalemler için EMD-S) büyük bir teknik engeldi; işlem ücretleri biletleme ve gelir muhasebesini ana e-bilet yerine ayrı makbuzlar üzerinden etkiliyor.](/decks/ancillaries/03.webp "Ortadaki sütun en fazla altyapı isteyen sütun: uçuş ekstrası bilete değil, kendi belgesine yazılıyor ve o belgenin kendi mesajları var.")

Slaytın konuşmacı notu bu tablonun arkasındaki teknik yükü gösteriyor.
Uçuş ekstraları eskiden kağıt MCO'larla (çeşitli ücret belgesi)
işleniyordu; IATA standardı EMD'ye geçiş büyük bir teknik engel oldu. EMD
de tek tip değil: uçuşa bağlı kalemler için EMD-A, bağımsız kalemler için
EMD-S kullanılıyor. İşlem ücretleri ise biletleme ve gelir muhasebesini ana
e-bilet üzerinden değil, ayrı makbuzlar üzerinden etkiliyor.

Buradan çıkan mühendislik sonucu, sepetteki her kalemin bir "belge tipi"
özelliği taşıması gerektiği. Aynı sipariş içinde bir e-bilet, bir ya da
birkaç EMD ve bir yolcu makbuzu yan yana durabiliyor; her biri farklı bir
biletleme ve muhasebe akışına gidiyor. Bu ayrımı sipariş anında
yapmayan bir sistem, onu biletleme anında tahmin etmek zorunda kalıyor.

## Sabit ücret, değerin rotaya göre değiştiğini görmüyor

Bugün ek hizmetlerin çoğu sistem genelinde sabit bir ücretle satılıyor:
koltuk seçimi her uçuşta aynı fiyat. Kaynak metin bunun kalıcı olmadığını
söylüyor: ek hizmet fiyatlandırması, bugün çoğunlukla geçerli olan sistem
genelinde sabit ücret yerine, eninde sonunda pazar bazlı olacak. Brifingin
analizi bunu gelir yönetiminin bir sonraki aşaması olarak okuyor: ek
hizmetlerin de ana bilet fiyatları gibi dinamik ve pazar koşullarına
duyarlı hale gelmesi.

Değer algısı sistemleştirilirken ölçüt, hizmetin uçuş süresi ve rotasıyla
korelasyonu. Brifingin örneği somut: uzun mesafeli bir uçuşta önceden
ayrılmış bir koltuk, kısa mesafeli bir uçuştakine göre yolcu gözünde daha
değerli. Aynı hizmet, aynı fiyatla iki farklı rotada satıldığında birinde
masada para bırakılıyor, diğerinde talep kaçırılıyor.

![Başlık: Sabit Ücretlerden Pazar Odaklı Fiyatlandırmaya. Solda Algısal Değer Eğrisi adlı bir grafik: yatay eksen uçuş mesafesi (kısadan uzuna), dikey eksen ödeme istekliliği (algılanan değer). Turkuaz bir S eğrisi soldaki turuncu noktadan (Kısa Mesafe: Düşük Değer, yanında turuncu bir koltuk) sağ üstteki sarı noktaya (Uzun Mesafe: Yüksek Değer, yanında sarı bir koltuk) yükseliyor. Sağda iki kutu. Geleneksel: sistem geneli sabit ücretler (flat fee). Modern: pazar dinamiklerine ve algılanan değere dayalı fiyatlandırma (örnek: önceden ayrılmış bir koltuk uzun mesafeli uçuşlarda müşteri için daha değerlidir). Altta not: doğru pazar fiyatlarını belirlemek için uçak içi ve online rezervasyon anket verileri (survey data) ile kalibrasyon şarttır. Konuşmacı notu: RM sistemleri tarihsel olarak yalnızca temel ücreti optimize etti; ek hizmetleri dinamik fiyatlamak, ödeme istekliliğini O&D, ekipman tipi ve uçuş süresine göre gerçek zamanlı ölçen yeni modeller gerektiriyor.](/decks/ancillaries/04.webp "Sabit ücret bu eğrinin üzerinde yatay bir çizgi: bir yerde eğrinin altında kalıp para bırakıyor, bir yerde üstüne çıkıp talebi kaçırıyor.")

Konuşmacı notu bu geçişin neden kolay olmadığını da söylüyor: gelir
yönetimi sistemleri tarihsel olarak yalnızca temel ücreti optimize etti.
Ek hizmeti dinamik fiyatlamak, ödeme istekliliğini köken-varış (O&D),
ekipman tipi ve uçuş süresine göre gerçek zamanlı ölçen yeni modeller
istiyor ve durağan ATPCO isteğe bağlı hizmet tablolarına bağımlılığı
azaltıyor. Yazılım tarafında bunun anlamı, ek hizmet fiyatının bir
yapılandırma değeri olmaktan çıkıp bir fiyatlama çağrısının sonucu haline
gelmesi. Fiyatı bir tablodan okuyan kod ile fiyatı bağlamdan hesaplayan
kod aynı arayüzü paylaşmıyor.

## Geçmiş veri yoksa fiyatı anket kuruyor

Pazar bazlı fiyatlamanın bariz bir sorunu var: yeni bir hizmet ya da yeni
bir rota için geçmiş satış verisi yok. Ödeme istekliliğini gözlemleyecek
satış olmadan, hangi fiyatın doğru olduğunu ölçmek mümkün değil.

Brifingin önerdiği iş kuralı bu boşluğu anketle dolduruyor. Veri eksik
olduğunda sistem uçak içi ve çevrimiçi rezervasyon anketlerinden gelen
veriyi kullanıyor; müşterinin belirli hizmetler için ödeme istekliliği
(willingness to pay) bu verilerle modelleniyor ve pazar fiyatları buradan
kuruluyor. Slayt da aynı notu düşüyor: doğru pazar fiyatını belirlemek
için anket verisiyle kalibrasyon şart.

Bu, fiyatlama modelinin iki ayrı girdi kaynağıyla çalışması gerektiği
anlamına geliyor. Satış geçmişi olan rotada model gözlenen davranıştan
öğreniyor; olmayan rotada beyan edilen tercihten başlıyor. İkisinin
güvenilirliği aynı değil, dolayısıyla bir fiyatın hangi kaynaktan
türetildiği fiyatla birlikte saklanmaya değer bir bilgi.

## Marka, ATPCO'da bir kayıt olarak var oluyor

Havayolu "Basic Economy" ya da benzeri bir marka tanımladığında bu marka
kendi web sitesinde bir tasarım kararı olarak kalamaz. Brifingin iş kuralı
şu: havayolları ek hizmetleri tüm kanallarda satabilmeli, dağıtabilmeli ve
mutabakatını yapabilmeli. GDS'teki acentenin ekranında da, havayolunun
kendi sitesinde de aynı marka aynı içerikle görünmeli.

Bunu mümkün kılan ATPCO'nun S-8 kaydı (Branded Fares Record). S-8 marka
tanımlarını standartlaştırıyor: marka adını, rezervasyon sınıflarını (RBD)
ve ücret baz kodlarını (fare basis code) ilgili havayolu ürünüyle
eşleştiriyor. ATPCO'nun Tablo 166 ve Tablo 189'u da bu hizmetlerin
ücretlerle çapraz referanslanmasını sağlıyor. Slaytın konuşmacı notu iki
tablonun görevini ayırıyor: Tablo 166 hangi isteğe bağlı hizmetlere izin
verildiğini, Tablo 189 ise hangi ücretlerin uygun olduğunu tanımlıyor.
S-8 dosyalamak, GDS'e markanın nasıl kurulacağını tam olarak söylemek
demek.

![Başlık: Dağıtımın Omurgası: ATPCO ve S-8 Kaydı. Açıklama: havayollarının ek hizmetleri tüm kanallarda (GDS, Web) satabilmesi, dağıtabilmesi ve faturalandırabilmesi için IATA ile entegre standart altyapı. Ortada lacivert bir altıgen: ATPCO S-8 Kaydı. Altıgenden üç bağlantı çıkıyor: yukarıda Marka Tanımı (Brand Definition), ona bağlı RBD / Ücret Temel Kodları Eşleşmesi; solda Tablo 166 (Ek Hizmetler Çapraz Referansı / Optional Services); sağda Tablo 189 (Ücret Kimlikleri / Fare IDs). Sağ altta not: S-8 Branded Fares kaydı havayolunun sunduğu marka tanımlarını ve ek ürünleri standartlaştırır, hizmetleri ve ücret kimliklerini birbirine bağlar. Konuşmacı notu: bu, fiyatlandırma ve dağıtımın çekirdeği; S-8 dosyalamak GDS'e markanın (örneğin Basic Economy) nasıl kurulacağını söyler, Tablo 166 hangi isteğe bağlı hizmetlere izin verildiğini, Tablo 189 hangi ücretlerin uygun olduğunu tanımlar.](/decks/ancillaries/05.webp "Marka burada bir ad değil, bir eşleştirme: hangi ücret kodları hangi hizmetlerle birlikte bu markanın altına giriyor. Eşleştirme yoksa kanal markayı kuramıyor.")

İçerik farklılaştırmasının altyapısı için brifing iki şey istiyor: fiyatın
merkezi bir yapıdan belirlenmesi ve GDS ile rezervasyon sistemleri
arasında senkronize bir mesajlaşma altyapısı. Mantığı açık: marka ve
hizmet fiyatı kanal başına ayrı ayrı tanımlanırsa, aynı yolcu iki kanalda
aynı markayı iki farklı içerikle görüyor. Yazılım tarafında bunun
karşılığı, marka tanımının tek bir kaynaktan yayınlanan ve her kanalın
okuduğu bir referans veri olması; kanalların kendi kopyasını tutup
güncellemesi değil.

## Aynı sepet iki yolcuya iki farklı toplam fiyat

Ek hizmetlerin fiyatı yalnızca rotaya göre değil, yolcuya göre de
değişiyor. Toplam güzergâh fiyatlaması (total itinerary pricing) bu işi
yapıyor: GDS'ler ve havayolu web siteleri temel ücreti ve yolcunun
tercihlerine ya da statüsüne göre değişen ek hizmetleri birlikte
hesaplayıp tek bir toplam fiyat sunuyor.

Bagaj örneği kararın öncelik sırasını gösteriyor. Karar mantığı yolcunun
sık uçan yolcu (frequent flyer) programındaki statüsüne ve havayoluyla
ilişkisine dayanıyor. Elite statüdeki bir yolcu için sistem bagaj ücretini
toplam fiyata eklemiyor, ondan feragat ediyor. Statüsü olmayan bir yolcu
için aynı hizmet toplam fiyata ek bir kalem olarak yansıyor. Kurumsal
müşteride de benzer bir kontrol var: sistem kurumsal profili tanıdığında
üzerinde anlaşılmış (negotiated) indirimleri ya da ek hizmet feragatlerini
(waiver) kontrol ediyor. Salon erişimi, koltuk seçimi ya da Wi-Fi bu
anlaşmalar çerçevesinde toplam fiyata indirimli ya da ücretsiz yansıyor.

![Başlık: Toplam Seyahat Fiyatlandırması (Total Itinerary Pricing). Açıklama: GDS'ler ve havayolu web siteleri, temel ücreti ve müşteri tercihlerine/statüsüne dayalı ek hizmetleri hesaplayarak toplam fiyatı sunar. İki yığın yan yana. Yolcu A (Elite Statü, Havayolu A): lacivert Temel Ücret bloğunun üzerinde iki altın renkli kutu, 1. Bagaj (Ücretsiz / $0) ve 2. Bagaj (Ücretsiz / $0); altında Daha Düşük Toplam Fiyat. Yolcu B (Standart Statü, Havayolu B): aynı Temel Ücret bloğunun üzerinde iki turuncu kutu, 1. Bagaj (Ücretli / $X) ve 2. Bagaj (Ücretli / $Y); altında Daha Yüksek Toplam Fiyat. Sağda kutu: sık uçan yolcu statüsü bagaj, lounge ve Wi-Fi gibi ücretleri sıfırlayabilir; kurumsal müşteriler için müzakere edilmiş indirimler anında yansıtılır. Konuşmacı notu: AirShopping sırasında PSS/GDS havayolunun sık uçan yolcu CRM veritabanına gerçek zamanlı çağrı yapar; statü Elite ise fiyatlama motoru son teklifi döndürmeden önce ücret feragatini uygular (EMD ücretini sıfıra indirir).](/decks/ancillaries/06.webp "İki yığının temel ücret bloğu aynı boyda. Toplam fiyatı ayıran şey bilet değil, üstteki kutuların hangi yolcu için sıfırlandığı.")

Konuşmacı notu bunun mimari bedelini açık ediyor. AirShopping sırasında
PSS ya da GDS, havayolunun sık uçan yolcu CRM veritabanına gerçek zamanlı
bir çağrı yapıyor; statü Elite ise fiyatlama motoru son teklifi
döndürmeden önce feragati uyguluyor ve EMD ücretini sıfıra indiriyor. Yani
sadakat sistemi artık teklif akışının dışında, sonradan puan yazan bir
arka ofis sistemi değil; arama cevabının yolu üzerinde duran bir
bağımlılık. Onun gecikmesi arama gecikmesine ekleniyor, onun kesintisi
fiyatın doğruluğunu bozuyor. Brifingin iş kuralı da bunu istiyor:
toplam fiyatlandırma motoru sadakat statüsünü ve kurumsal indirimleri
gerçek zamanlı olarak fiyata yansıtabilmeli.

## Yarın işe yarayacak dört çıkarım

1. **Ek hizmet fiyatını rotaya bağla.** Sistem genelindeki sabit ücretten
   vazgeç; uçuş süresine ve rota tipine göre kademeli bir fiyatlandırma
   modeline geç. Uzun mesafede önceden ayrılan koltuğun değeri kısa
   mesafedekiyle aynı değil, fiyatı da aynı olmamalı.
2. **Belge ve mesaj altyapısını bütün kanallarda aynı tut.** ATPCO S-8
   kayıtları ve EMD mesajlaşma altyapısı GDS'te ve web'de hatasız
   çalışmalı. Marka tanımı tek bir merkezden yayınlanmalı, her kanal aynı
   eşleştirmeyi okumalı.
3. **Toplam fiyatı yolcuyu tanıyarak hesapla.** Toplam fiyatlandırma
   motoru sadakat statüsünü ve kurumsal indirimleri gerçek zamanlı olarak
   fiyata yansıtabilmeli. Feragat teklif döndükten sonra değil, teklif
   kurulurken uygulanmalı.
4. **Satış verisi yoksa ankete dayan.** Satış geçmişinin yetersiz olduğu
   yeni rotalarda ödeme istekliliğini uçak içi ve çevrimiçi anket
   verisiyle kalibre et; satış geldikçe modeli gözlenen davranışa taşı.

Bu bölümde ne yok: ek hizmetin satıldığı teklifin nasıl kurulduğu ve NDC
ile fiyat gücünün havayoluna geçişi ("NDC@Scale: havacılık dağıtım
kanallarında dönüşüm ve iş mantığı analizi"), ATPCO ve takas odalarının
kurumsal rolü ("Havacılık endüstri standartları ve yönetişim: stratejik
analiz belgesi"), temel ücretin kendisini optimize eden mekanizma (gelir
yönetimi bölümleri). Bu bölüm, temel ücretin üzerine eklenen parçaların
hangi belgeye, hangi kayda ve hangi fiyat mantığına bağlandığını anlatmak
için var.
