---
title: "Posta sözleşmesinden SABRE'ye"
domain: "aviation"
summary: "Havayolu rezervasyonunun bugünkü tuhaflıklarının çoğu 1925'te posta uçağındaki tek koltukta başladı. Bu bölüm, envanterle yolcu kaydının neden ayrı doğduğunu ve o ayrılığın hâlâ neden peşimizi bırakmadığını anlatıyor."
pubDate: 2026-09-18
topics: ["solution-architecture"]
origin:
  tool: "NotebookLM"
  kind: "brifingi"
  note: "Slaytlar aynı sunumdan; alt metinlerini ve altyazılarını ben yazdım."
crossRef:
  domain: "ecommerce"
  slug: "stock-is-a-reservation"
  why: "Tampon koltuk ile emniyet stoğu aynı problemin iki adı."
---

Bir havayolu rezervasyon sistemine ilk kez bakan yazılımcının sorusu hep aynı:
koltuk ile yolcuyu tek bir tabloda tutmak bu kadar zor olamaz, neden ortalık
bu kadar karışık?

Cevabı 1925'te, posta uçağında satılan tek koltukta.

![Sunumun kapak slaytı. Başlık: Havacılıkta Rezervasyon Sistemlerinin Evrimi. Alt başlık: Posta sözleşmelerinden dünyanın ilk bilgisayarlı rezervasyon ağına, SABRE.](/decks/crs-evolution/01.webp "Otuz beş yıllık bir hat: posta sözleşmesiyle başlayıp gerçek zamanlı bir veri tabanıyla bitiyor.")

## Yolcu bir yan üründü

1925 Kelly Act posta tekelini bitirip hava posta hizmetini özel şirketlere
açtı. Uçuşun birincil amacı posta taşımaktı; **ticari yolcu için ayrılan
koltuk sayısı bir taneydi.** Yolcu kalkış şehrini arar, koltuk boşsa
rezervasyon yapılırdı.

![Slayt iki kavramı yan yana koyuyor: solda posta çantası, üzerinde faydalı yük kapasitesi etiketi; sağda tek bir yolcu koltuğu, üzerinde kalıntı envanter etiketi. Altında 1925 Kelly Act ve tek koltuk dönemi maddeleri.](/decks/crs-evolution/02.webp "Sağdaki etiket işin özeti: yolcu koltuğu kendi başına bir ürün değil, posta yükünden artan kapasite.")

Buradaki iş mantığı önemli: uçağın faydalı yükü kargo için optimize
edilmişti, yolcu envanteri ondan **artan** kapasiteydi. Modern terimle sabit
bir kontenjan (allotment): fiziksel alan neyse sınır o. Gelir devlet posta
sözleşmesinden geldiği için getiri (yield) diye bir kavram da yoktu. Fiyatı
optimize etmek istediğin bir şey değil, sözleşmede yazan bir sayıydı.

## Envanteri kim biliyor

İlk envanter kontrolü merkezi değildi. Koltukların gerçek durumunu **uçağın
kalkacağı şehirdeki istasyon** biliyordu. Satış temsilcisi rezervasyon
yapmadan önce o istasyonu arayıp onay almak zorundaydı: talep ve yanıt
(request and reply). Onay gelince PNR kartına yazılır, teletiple iletilirdi.

Bu doğru çalışıyordu ve çok yavaştı. Her satış bir telefon görüşmesi demekti.

1939'da Boston'da çözüm bulundu: **sat ve bildir** (sell and report).
Temsilciler uçuş belirli bir doluluk eşiğine ulaşana kadar onay almadan
serbestçe satıyor, eşik aşılınca merkezden bir "satışı durdur" (stop sale)
mesajı geçiyor ve sistem yavaş ama güvenli olan eski mantığa dönüyordu.

![Slayt iki envanter modelini karşılaştırıyor. Solda talep ve yanıt: acente kalkış şehrini arar, boş yer sorulur, onay gelir ve PNR kartına yazılır. Sağda sat ve bildir: acenteler serbestçe satar, satışı durdur mesajı gelir, sistem eski mantığa döner.](/decks/crs-evolution/04.webp "Soldaki zincir her satışta bir telefon demek. Sağdaki döngü telefonu sadece eşiğe yaklaşınca çalıyor.")

Bunu bugünün diliyle okursan ne olduğu ortaya çıkıyor: her satışta senkron
kilit almak yerine **eventual consistency**'ye geçmişler. Uygunluk bilgisi,
aksini söyleyen bir mesaj gelene kadar doğru varsayılıyor. Aynı fikir hâlâ
sahada: eski GDS dağıtımındaki AVS mesajları bu stop sale mesajının torunu.

Verimlilik kazancı da tam olarak bugünkü gerekçeyle alınmış — istisna bazlı
yönetim. İletişim trafiğini her işlem için değil, sadece sınıra yaklaşınca
başlatıyorsun.

## Tampon koltuk: senkronizasyon yavaşsa envanteri saklarsın

Savaş sonrası trafik büyüdü, süreçler eskiydi. Boston Reservisor (1946) kart
dosyalarının yerini alan ilk cihazdı; Magnetronic Reservisor (1952)
LaGuardia'da kuruldu ve **1000 uçuşun 10 günlük verisini** tutup aynı anda
sorgulanabiliyordu.

![Slayt Reservisor dönemini iki sütunda özetliyor. Solda kapasite başlığı altında Boston Reservisor 1946 ve Magnetronic Reservisor 1952 maddeleri. Sağda sınırlamalar başlığı altında iletişim, eşleştirme sorunu ve tampon koltuklar maddeleri.](/decks/crs-evolution/05.webp "Sağ sütunun üçüncü maddesi kırk yıl sürecek bir alışkanlığın adı: satılmayan yedek koltuk.")

Ama cihaz sorunu yarısından fazla çözmüyordu. Acente ile operatör hâlâ
telefonun iki ucundaydı, ve daha önemlisi: **satılan koltuk ile yolcu isim
kaydı elle eşleştiriliyordu.**

Bunun doğurduğu iş kuralı tanıdık gelecek. Envanterle kayıt anında senkronize
edilemediği için son birkaç koltuk satışa kapatılıyor, sistemde **tampon**
bırakılıyordu. Çifte rezervasyon (oversale) ve yolcunun uçağa alınamaması
riskini böyle yönetiyorlardı.

Tampon bedava değil. Boş uçan koltuk demek — sektörün adı **spoilage**.
Modern gelir yönetiminin tek cümlelik tarifi buradan çıkıyor: overbooking'i
doğru yönetirken spoilage'ı en aza indirmek. İkisi de aynı senkronizasyon
probleminin faturası.

## Fiyat sabitse gelir yönetimi diye bir şey yoktur

1938'den 1970'lerin sonuna kadar Sivil Havacılık Kurulu (CAB) sektörü mikro
düzeyde yönetti: hangi havayolu hangi rotada uçacak, her rotanın bileti kaç
para olacak, birleşmelere izin var mı.

![Slayt CAB'nin kontrol alanlarını ABD haritası üzerinde gösteriyor: rotalar, fiyatlandırma ve rekabet. Ortada kilit simgesi. Altta sonuç kutusu: fiyat rekabetinin yasak olduğu bu dönemde havayolları yalnızca operasyonel verimlilik ve hizmet kalitesiyle öne çıkabilirdi.](/decks/crs-evolution/03.webp "Kırk yıl boyunca fiyat bir değişken değil, kurumun yazdığı bir sabitti.")

Bu, teknik bir bölümde görünmesi tuhaf ama belirleyici bir kısıt. **Tarife
sabitse dinamik fiyatlandırma diye bir problem yoktur.** Ne zaman rezervasyon
yaparsan yap koltuğun fiyatı aynıdır. Getiri yönetimi, deregülasyon CAB'nin
fiyat kontrolünü kaldırana kadar var olamadı — teknoloji yetmediği için
değil, kural izin vermediği için.

Sistemlerin neyi çözmediğine bakarken bunu hatırlamak gerekiyor: bazı
özellikler eksik değildir, **yasaktır.**

## Asıl fikir: envanteri müşteriye bağlamak

1953'te American Airlines CEO'su C.R. Smith ile genç bir IBM satıcısı olan
R. Blair Smith aynı uçuşta yan yana oturdu. Blair Smith'in anlattığı makine
yalnızca uygunluk durumunu tutmakla kalmayacak; yolcunun adını, seyahat
programını (itinerary) ve telefon numarasını da kaydedebilecekti.

![Slayt 1953'teki uçuşu anlatıyor ve R. Blair Smith'in sözünü aktarıyor: sadece uygunluk durumunu tutmaktan çok daha fazlasını yapabilecek bir bilgisayar; yolcunun adını, seyahat programını ve telefon numarasını da kaydedebilirdi. Altta vizyon cümlesi: yolcunun adını koltuk rezervasyonuyla entegre edecek ilk bilgisayarlı sistem.](/decks/crs-evolution/06.webp "Alıntıdaki üç alan — ad, seyahat programı, telefon — bugün hâlâ PNR'ın çekirdeği.")

O güne kadar havayolu bilgisayarları envanter için birer hesap makinesiydi.
Bu fikir özünde ilişkisel bir veritabanı fikri: **sayısal envanter varlığını
alfasayısal müşteri varlığına bağlamak.** Modern PNR kavramı burada doğdu.

![Slayt SABER projesinin fikirden yatırıma geçişini anlatıyor: araştırma aşaması PNR sisteminin fizibilitesini kanıtlıyor, IBM projeyi yüksek riskli görüp yazılım geliştirmeye de yatırım yapma kararı alıyor, 1958'de resmî sözleşme imzalanıyor.](/decks/crs-evolution/07.webp "Ortadaki madde sektörü kuran karar: donanım satan şirket yazılım yazmaya başlıyor.")

Sadece havayolunun ihtiyacını karşılamak için donanımdan yazılıma geçen bir
IBM, bugünkü havayolu BT tedarikçi modelinin de başlangıcı. Amadeus, Sabre,
Travelport — hepsi bu kararın torunu.

Teknik temel ise askeriyeden geldi. Uçak takip eden SAGE hava savunma
sistemi, koltuk takip etmek için de uygun altyapıyı sunuyordu.

![Slayt askeri teknolojinin ticari sisteme aktarımını üç adımda gösteriyor: SAGE 1951, IBM bilgisayarı, rezervasyon sistemi. Altta SAGE'in sağladığı temeller: gerçek zamanlı hesaplama, manyetik çekirdek bellek, aktif yedekli çift işlemci, ses bantları üzerinden dijital iletişim ve anlık veri alan iletişim arayüzü.](/decks/crs-evolution/08.webp "Listedeki maddelerin hepsi bugün sıradan. 1951'de hiçbiri değildi.")

SAGE, IBM'in ACP'sine dönüştü; ACP de TPF'ye. **TPF bugün hâlâ büyük
GDS'lerin çekirdeğinde koşuyor** — altmış yıllık bir işletim sistemi, hâlâ
üretimde.

## 1961'de verilen karar hâlâ duruyor

![Slayt 99 Park Avenue'daki ortak ekibi tanıtıyor: Roger Burkhardt ve Fred Plugge, matematikçi Mal Perry, dünyanın eşleştirilmiş ilk PNR kodunu yazan Bill Elmore. Sağda 1961 ve aşamalı kurulum kutusu.](/decks/crs-evolution/09.webp "Aşamalı kurulum burada icat edilmedi ama burada standart oldu: bugünkü PSS geçişleri aynı şekilde yapılıyor.")

SABRE'ın mimarisi beş modül bıraktı: programlar, envanter, PNR, biletleme ve
DCS. Her biri kendi sorusuna cevap veriyor — nereye uçulacak, kaç koltuk
satılabilir, yolcu kim, ödeme ne oldu, uçağa kim bindi.

![Slayt Host CRS'i merkeze koyup beş modülü çevresine diziyor: uçuş programları, envanter, PNR, biletleme ve kalkış kontrolü. Solda beş soru maddelenmiş.](/decks/crs-evolution/10.webp "Bu halka bir mimari şema değil, bir miras listesi. Beş kutunun her biri bugün ayrı bir ürün.")

Dikkat edilecek yer şu: **PNR, biletleme ve envanter ayrı modüller.** Bu
1961'de verilmiş bir karar ve bugün hâlâ bedelini ödüyoruz. E-bilet ile PNR
senkronizasyonu kaybedebiliyor, çünkü mimari onları ayrı doğurdu. IATA'nın
ONE Order girişimi tam olarak bu ayrılığı geri almaya çalışıyor: PNR, bilet
ve EMD'yi tek bir perakende siparişi olarak birleştirmek.

Altmış yıl sonra bir modülerleştirme kararını geri almaya çalışıyoruz.

## Ne kaldı bize

Üç şey, ve üçü de havacılığa özgü değil.

**Senkronizasyon yavaşsa envanteri saklarsın.** Tampon koltuk bir
beceriksizlik değil, gecikmenin faturası. Kendi sisteminde emniyet stoğu
tutuyorsan aynı faturayı ödüyorsun; sorulacak soru "stoğu nasıl azaltırım"
değil, "senkronu neden hızlandıramıyorum".

**Kısıt her zaman teknik değil.** CAB döneminde eksik olan algoritma değildi,
izindi. Bir sistemde yapılmayan şeye bakarken önce kuralı sor.

**Erken verilmiş sınır kararları en uzun yaşayanlardır.** Envanteri kayıttan
ayırmak 1952'de doğru karardı; 2026'da onu birleştirmek için uluslararası bir
standart girişimi gerekiyor. Bugün böldüğün şey, bölünmüş kalıyor.
