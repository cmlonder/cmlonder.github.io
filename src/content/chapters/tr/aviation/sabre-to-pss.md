---
title: "SABRE'den PSS'e: bir mimari neden 60 yıl yaşadı"
domain: "aviation"
summary: "1964'te iki ana bilgisayarla kurulan rezervasyon sistemi, bugün bulutta koşan PSS'lerin veri modelini hâlâ belirliyor. Bu bölüm, o mimarinin neden eskimediğini ve standartlaşmanın neden ilk denemede kaçırıldığını anlatıyor."
audience: "Bir PSS ya da rezervasyon entegrasyonuna girmek üzere olan, 'bu sistemler neden böyle' sorusunu soran yazılımcı ve mimar. Önceki bölümü okumuş olmak yeter."
pubDate: 2026-09-20
topics: [solution-architecture]
ai: generated
---

Manuel dönemde bir rezervasyonun işlenmesi ortalama 90 dakika sürüyordu.
Kart dolapları, telefon, tekrar kart. 1964'te SABRE devreye girdi; süre
saniyelere indi, hata payı %1'in altına çekildi. Bu bölüm o sıçramanın
nasıl olduğunu değil, **neden kalıcı olduğunu** anlatıyor: bugünkü Yolcu
Servis Sistemleri (PSS) hâlâ 1964'ün veri modelini taşıyor.

![Sunumun kapak slaytı. Başlık: Havacılık Rezervasyon Sistemlerinin Evrimi. Alt başlık: Manuel kartlardan modern PSS ekosistemine dijital bir dönüşüm hikâyesi. Bir yolcu uçağının teknik çizimi; kuyruk tarafı noktalara ve bir ağ grafına dönüşüyor.](/decks/reservation-evolution/01.webp "Çizimin sağ ucu işin özeti: uçak aynı uçak, arkasındaki şey artık bir veri ağı.")

## Darboğaz uçak değildi, kart dolabıydı

Kapasite sınırı kabinde değil, rezervasyon masasındaydı. Fiziksel kartlara
ve telefon görüşmelerine dayalı süreç saatte belli sayıda işlemden fazlasını
kaldıramıyordu; havayolu büyüdükçe masa büyümüyordu. Hedef baştan belliydi:
envanterin otomatik güncellenmesi ve anında uygunluk kontrolü — bugün OLTP
dediğimiz şey.

![Solda kart dolabı, basınç göstergesi ve telefon: işlem süresi 90 dakika. Sağda dijital sayaç 00:00:02: işlem süresi saniyeler. Altta tarihsel not: 25.000 komutluk ilk IBM 650 demosu potansiyeli gösterdi ama silinen tambur bellek gibi donanım hataları başlangıçta şüphe yarattı.](/decks/reservation-evolution/02.webp "Alttaki nota dikkat: ilk demo etkileyiciydi ama tambur bellek siliniyordu. Güven, hızdan sonra geldi.")

## Standartlaşma ilk denemede kaçırıldı

American Airlines, Delta ve Pan Am için geliştirilen üç sistem — SABRE,
Deltamatic, Panamac — farklı donanım üzerine kuruldu. SABRE IBM 7090'da
ikili (binary), diğer ikisi IBM 7070 ve 7080'de ondalık (decimal) mimaride
çalışıyordu. Yazılım taşınamadı; her havayolu kendi geliştirme maliyetini
tek başına ödedi.

![Tablo: American Airlines, SABRE, IBM 7090, ikili mimari; Delta, DELTAMATIC, IBM 7070, ondalık; Pan Am, PANAMAC, IBM 7080, ondalık. Altta kritik hata notu: IBM'in uyumsuz donanım önermesi üç havayolunun geliştirme maliyetini paylaşmasını engelledi; sektör daha pahalı ama standart 7090'da birleşmeliydi.](/decks/reservation-evolution/03.webp "Tablodaki tek turuncu hücre ikili mimari; geri kalanlar ondalık. Uyumsuzluk donanımda değil, satış kararında başladı.")

Sektörün sonradan çıkardığı ders net: daha pahalı ama ortak bir platformda
(IBM 7090) birleşmek, üç ayrı ucuz platformdan daha ucuza geliyor. Bu
cümle 1960'lardan; bugün "ortak stack" tartışmalarında aynen geçerli.

## 1964'te devrim hız değil, hata oranıydı

SABRE, Briarcliff Manor'daki iki IBM 7090 üzerinde açıldı. Kapasite saatte
7.500 işlem, yanıt süresi saniyeler, hata payı %1'in altında. Dönemin
tanımıyla ABD hükümetinden sonra dünyadaki en büyük özel gerçek zamanlı
veri işleme sistemiydi. Bilet işlemi yapılır yapılmaz yolcu kaydı (PNR)
oluşuyordu; envanter ve kayıt aynı işlemin içinde güncelleniyordu.

![Ortada ana bilgisayar: Briarcliff Manor, NY. Solda altyapı kutusu: iki IBM 7090, uçak bileti işlemlerinin anında PNR olarak kaydedilmesi. Sağda performans: kapasite 7.500 işlem/saat, saniyeler içinde yanıt; doğruluk: hata payı %1'in altında. Altta: dünyanın ilk ticari OLTP sistemi.](/decks/reservation-evolution/04.webp "Üç kutunun en önemlisi sağ alttaki: hata payı. 90 dakikayı saniyeye indirmek yetmezdi, yanlış rezervasyon hızlı rezervasyondan pahalıdır.")

Proje kolay gitmedi. Programcılardan Bill Elmore'un sözü, süreyi Sing Sing
Hapishanesi'yle kıyaslıyor: "Mahkumlar ne zaman çıkacaklarını biliyorlardı."
Belirsiz bitiş tarihi, o günden bugüne büyük rezervasyon projelerinin
değişmeyen özelliği.

## Uçtaki ekran aptal, akıl merkezde

Acentelerin önündeki Raytheon CRT ekranlar sektörün deyimiyle "aptal
terminal"di (dumb terminal): kendi işlem gücü yok, sadece veri gösterip
klavye girdisi taşıyor. Envanter hesabı, iş mantığı, kayıt — hepsi ana
bilgisayarda. Uç noktada zeka yoktu; bu bir eksiklik değil, tasarım
kararıydı. Tek doğruluk kaynağı tek yerde duruyordu.

![Ortada ana bilgisayar (host): tüm işlem gücü, envanter hesapları ve iş mantığı burada. Dört köşede Raytheon CRT ekranlar: aptal terminal, kendi başına işlem yeteneği yok, tamamen ana bilgisayara bağımlı. Acenteler sadece veri gösteren ve klavye girdisi sağlayan ekranlar üzerinden erişiyordu.](/decks/reservation-evolution/05.webp "Bugünün ince istemci ve merkezi API tartışması, 1964'te çoktan kararlaştırılmış: durum merkezde, uç sadece görüntüler.")

## Tele-işlem bilmeyen tedarikçi seni rakibin yazılımına götürür

TWA ve United donanımı Burroughs ve Univac'tan aldı. İkisinin de ağ ve
tele-işlem (teleprocessing) tecrübesi yoktu; projeler teknik krizlere
saplandı. Sonuç: iki havayolu da rotayı değiştirip Eastern Airlines'ın IBM
tabanlı PARS sistemini satın aldı. IBM'in avantajı ucuz donanım değildi;
askeri SAGE projesinden gelen uzaktan erişim tecrübesiydi.

![Akış şeması. Karar: TWA ve United, donanım Burroughs ve Univac. Sorun: telekomünikasyon tecrübesizliği, donanım üreticilerinin ağ tecrübesi yok, projeler teknik krizlerle tıkandı. Çözüm ve eksen kayması: IBM destekli PARS yazılımı; United ve TWA Eastern Airlines'ın IBM sistemini satın aldı. Altta sistem ipucu: IBM'in SAGE projesinden gelen tele-işlem tecrübesi sivil rezervasyon sistemlerinin başarısındaki gizli anahtardı.](/decks/reservation-evolution/06.webp "Şemadaki çarpı işareti ucuz tedarikçiye değil, alan tecrübesi olmayan tedarikçiye konmuş.")

Rezervasyon sistemi doğası gereği uzaktan erişim sistemidir. Tedarikçi
seçerken sorulacak soru "işlemci ne kadar hızlı" değil, "bu yükü ağ
üzerinden daha önce taşıdı mı".

## PARS sektör standardı oldu: 1971'de 10 havayolundan 9'u

1960'ların sonunda IBM, Eastern Airlines için System/360 üzerinde PARS'ı
(Programmed Airline Reservations System) yayınladı. 1971'de United,
PARS tabanlı Apollo'yu tanıttı; SABRE de tamamen PARS mimarisine geçti.
O yıldan sonra ABD'nin en büyük 10 havayolundan 9'u PARS altyapısı
kullanıyordu. Uluslararası sürüm IPARS küresel standart oldu.

![Zaman çizgisi: geç 1960'lar, IBM System/360 üzerinde Eastern Airlines için PARS'ı yayınladı; 1971, United Airlines PARS tabanlı Apollo'yu tanıttı, SABRE tamamen PARS mimarisine geçti; sonrasında üç kola ayrılıyor. Sağ üstte turuncu kutu: pazar hakimiyeti 9/10, 1971'den sonra ABD'nin en büyük 10 havayolundan 9'u PARS kullanıyordu, uluslararası sürüm IPARS küresel standart oldu.](/decks/reservation-evolution/07.webp "1960'ta üç ayrı mimari, 1971'de tek standart. Konsolidasyon on yıl sürdü; bugünkü PSS pazarının şekli o on yılda çizildi.")

## 1960'larda yazılan kod 21. yüzyıla nasıl çıktı

PARS'ın altındaki işletim sistemi ACP (Airline Control Program), sonra TPF
(Transaction Processing Facility) adını aldı. Assembly ile yazıldı;
soyutlama katmanı yok, doğrudan makineye konuşuyor. Bellek sabit
bloklara bölünmüş — 128 byte, 381 byte, 4K — kod bloğa sığmazsa
zincirleniyor (chaining). Bu yapı saniyede çok yüksek hacimde mesajı
neredeyse saf I/O hızında işliyor.

![Başlık: Yıkılmaz motor, ACP ve TPF mimarisi; 1960'larda yazılan kod neden 21. yüzyılda hâlâ yaşıyor. Ortada bellek bloğu kavramı: 128 byte, 128 byte, 381 byte ve 4K bloklar zincirle bağlı; zincirleme kesintisiz yüksek hızlı veri akışı. Altta üç kutu: işletim sistemi ACP sonra TPF; dil ve yapı, fazlalığı olmayan doğrudan makineye konuşan Assembly; işlem gücü, saniyede devasa hacimde mesaj, saf I/O hızı.](/decks/reservation-evolution/08.webp "Zincir metaforu tesadüf değil: sabit blok + zincirleme, bugünün sayfa tabanlı depolama motorlarının atası.")

Neden değişmedi? Çünkü işi tek: mesaj al, envanteri güncelle, cevap ver.
Bu işi milisaniye altında yapan bir çekirdeği daha genel bir şeyle
değiştirmenin getirisi, riskini hiç karşılamadı.

## Rezervasyon için kurulan sistem şirketin omurgası oldu

Başlangıçta sadece rezervasyon için kurulan altyapı zamanla beş işlevi
birden taşır oldu: envanter (koltuk uygunluğu ve kapasite), PNR kaydı
(müşteri verisi ve rezervasyon takibi), fiyatlandırma ve alışveriş
(rota, tarife, teklif), biletleme (finansal kayıt ve elektronik onay),
kalkış kontrolü DCS (check-in, biniş, ağırlık). Havayolunun kârlılığını
belirleyen her ticari süreç aynı işlem çekirdeğinden geçiyor.

![Ortada altıgen: işlem odaklı sistem, ana bilgisayar (TPF). Beş kol: envanter, koltuk uygunluğu ve kapasite yönetimi; PNR kaydı, müşteri verisi ve rezervasyon takibi; biletleme, finansal kayıt ve elektronik onay; kalkış kontrolü DCS, havaalanı check-in, biniş ve ağırlık işlemleri; fiyatlandırma ve alışveriş, rota, tarife ve teklif optimizasyonu. Altta sonuç: rezervasyon için kurulan altyapı havayolu kârlılığını belirleyen tüm ticari süreçlerin omurgası oldu.](/decks/reservation-evolution/09.webp "Beş kolun beşi de aynı çekirdeğe bağlı. PSS'i parçalamanın zor olmasının sebebi bu şema.")

## Pazar konsolide oldu, ama üçte biri hâlâ kendi sistemini koşuyor

Bugün pazarın iki büyük hosting sağlayıcısı var: Amadeus (Altea) ve Sabre
(SabreSonic). Konsolidasyon satın almayla ilerledi — Navitaire 2015'te
Amadeus'a, Radixx 2019'da Sabre'ye geçti. Shares, SITA Horizon ve Hitit
gibi sağlayıcılar ikinci halkada. Çin'de CAAC regülasyonu yerel
barındırmayı zorunlu tutuyor; Çinli taşıyıcılar TravelSky ve UniSys
Aircore üzerinde.

![Dört kutu: pazar liderleri, Amadeus (Altea) ve Sabre (SabreSonic); stratejik satın alımlar, Navitaire 2015'te Amadeus tarafından, Radixx 2019'da Sabre tarafından alındı; diğer sağlayıcılar, Shares, SITA Horizon, Hitit; bölgesel zorunluluk Çin, TravelSky ve UniSys Aircore, CAAC regülasyonu gereği Çinli taşıyıcılar için yasal zorunluluk. Altta sektör gerçeği: büyük konsolidasyona rağmen dünyadaki havayollarının üçte biri hâlâ kendi özel rezervasyon sistemini kullanıyor.](/decks/reservation-evolution/10.webp "Alttaki cümle listeden önemli: üçte bir hâlâ proprietary. Standart PSS ölçek ekonomisi verir; farklılaşmak isteyen havayolu kontrolü elinde tutuyor.")

Konsolidasyon havayolu için risk mi avantaj mı? İkisi de. Standart PSS
bakım maliyetini ve entegrasyon yükünü düşürüyor. Ama ürünüyle farklılaşmak
isteyen havayolu, standardın sınırına hızlı çarpıyor; proprietary sistemde
kalmak o durumda maliyet değil, tercih. Veri egemenliği (data residency) bu
denklemi bir kez daha büküyor: Çin'e giren global sağlayıcı ya yerel ortak
buluyor ya altyapısını o bölgeye özel kuruyor.

## Arayüz değişti, veri modeli değişmedi

Raytheon ekranların yerini bulut ve mobil API'ler aldı. Sunucular, ağlar,
istemciler tamamen yenilendi. Değişmeyen tek şey ortadaki blok: PNR ve
envanter. 1964'te atılan veri temeli sabit; modern havacılık 60 yıl önce
çizilen planın üzerinde uçuyor. Önceki bölümdeki "envanter ve yolcu kaydı
ayrı doğdu" tespiti burada kapanıyor: ayrı doğdular ve ayrı kaldılar.

![Solda geçmiş: Raytheon ekran ve ana bilgisayarlar. Sağda bugün: bulut mimarisi ve mobil API'ler, telefon ekranı. Ortada turuncu kutu: PNR ve envanter veri bloğu, ikisini bağlıyor. Altta: arayüzler ve sunucular tamamen değişti; ancak 1964'te atılan havacılık veri mimarisi (PNR, envanter) sabit kaldı. Modern havacılık 60 yıl önce yazılmış bir dijital planın üzerinde uçmaktadır.](/decks/reservation-evolution/11.webp "Ortadaki turuncu kutu değişmeyen şey. Bir PSS entegrasyonuna girerken bakılacak yer orası, kenardaki API değil.")

## Yarın işe yarayacak dört çıkarım

1. **Ortak stack, pahalı olsa bile ucuzdur.** 1960'ta üç havayolu üç
   mimari seçti ve maliyeti üç kez ödedi. Departmanlar ya da şirketler
   arası sistem geçişinde tek platformda birleşmek başlangıç maliyetini
   uzun vadede amorti eder.
2. **OLTP'de gecikme bütçesi milisaniyedir.** Yüksek hacimli işlem
   çekirdeğinde düşük seviyeli mantık ya da yüksek performanslı mimari
   lüks değil, gereklilik. TPF'in 60 yıl yaşamasının sebebi bu.
3. **Regülasyonu mimariye baştan koy.** Çin gibi pazarlarda yerel
   barındırma ve stratejik ortaklık (TravelSky, UniSys) sonradan eklenen
   bir özellik değil, işin devam şartı.
4. **Hedef hız değil, hata oranı.** Manuelden dijitale geçişte SABRE'nin
   asıl kazanımı 90 dakikadan saniyeye inmek değil, hata payını %1'in
   altına çekmekti. Yeni sistemin başarı ölçütünü buna göre yaz.

Bu bölümde ne yok: PNR'ın iç yapısı ve neden "kayıt değil sözleşme"
olduğu. O sıradaki bölümün konusu.
