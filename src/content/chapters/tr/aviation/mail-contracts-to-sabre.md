---
title: "Posta sözleşmesinden SABRE'ye"
domain: "aviation"
summary: "Havayolu rezervasyonunun bugünkü tuhaflıklarının çoğu 1925'te posta uçağındaki tek koltukta başladı. Bu bölüm, envanterle yolcu kaydının neden ayrı doğduğunu ve o ayrılığın hâlâ neden peşimizi bırakmadığını anlatıyor."
pubDate: 2026-09-18
topics: ["solution-architecture"]
deck: "crs-evolution"
origin:
  tool: "NotebookLM"
  kind: "brifingi"
  note: "Kaynak deste ve brifing bu bölümün sonunda duruyor; tarihler ve isimler oradan geliyor."
crossRef:
  domain: "ecommerce"
  slug: "stock-is-a-reservation"
  why: "Tampon koltuk ile emniyet stoğu aynı problemin iki adı."
---

Bir havayolu rezervasyon sistemine ilk kez bakan yazılımcının sorusu hep aynı:
koltuk ile yolcuyu tek bir tabloda tutmak bu kadar zor olamaz, neden ortalık
bu kadar karışık?

Cevabı 1925'te, posta uçağında satılan tek koltukta.

## Yolcu bir yan üründü

1925 Kelly Act posta tekelini bitirip hava posta hizmetini özel şirketlere
açtı. Uçuşun birincil amacı posta taşımaktı; **ticari yolcu için ayrılan
koltuk sayısı bir taneydi.** Yolcu kalkış şehrini arar, koltuk boşsa
rezervasyon yapılırdı.

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

Bu doğru çalışıyordu ve çok yavaştı. Her satış bir telefon görüşmesi
demekti.

1939'da Boston'da çözüm bulundu: **sat ve bildir** (sell and report).
Temsilciler uçuş belirli bir doluluk eşiğine ulaşana kadar onay almadan
serbestçe satıyor, eşik aşılınca merkezden bir "satışı durdur" (stop sale)
mesajı geçiyor ve sistem yavaş ama güvenli olan eski mantığa dönüyordu.

<x-slides deck="crs-evolution" range="4" caption="İki envanter modeli yan yana: her satışta onay isteyen talep-yanıt, ve eşiğe kadar serbest bırakan sat-bildir.">
<p>Sunumun 4. slaytı: manuel envanter kontrolünün 1930'lardaki evrimi.</p>
</x-slides>

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

Ama cihaz sorunu yarısından fazla çözmüyordu. Acente ile operatör hâlâ
telefonun iki ucundaydı, ve daha önemlisi: **satılan koltuk ile yolcu isim
kaydı elle eşleştiriliyordu.**

Bunun doğurduğu iş kuralı tanıdık gelecek. Envanterle kayıt anında
senkronize edilemediği için son birkaç koltuk satışa kapatılıyor, sistemde
**tampon** bırakılıyordu. Çifte rezervasyon (oversale) ve yolcunun uçağa
alınamaması riskini böyle yönetiyorlardı.

<x-slides deck="crs-evolution" range="5" caption="Reservisor'ün kazandırdıkları ve kazandıramadıkları — tampon koltuk ikinci sütunda.">
<p>Sunumun 5. slaytı: elektromekanik köprü dönemi.</p>
</x-slides>

Tampon bedava değil. Boş uçan koltuk demek — sektörün adı **spoilage**.
Modern gelir yönetiminin tek cümlelik tarifi buradan çıkıyor: overbooking'i
doğru yönetirken spoilage'ı en aza indirmek. İkisi de aynı senkronizasyon
probleminin faturası.

## Fiyat sabitse gelir yönetimi diye bir şey yoktur

1938'den 1970'lerin sonuna kadar Sivil Havacılık Kurulu (CAB) sektörü mikro
düzeyde yönetti: hangi havayolu hangi rotada uçacak, her rotanın bileti kaç
para olacak, birleşmelere izin var mı. Fiyat rekabeti yasaktı.

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

O güne kadar havayolu bilgisayarları envanter için birer hesap makinesiydi.
Bu fikir özünde ilişkisel bir veritabanı fikri: **sayısal envanter varlığını
alfasayısal müşteri varlığına bağlamak.** Modern PNR kavramı burada doğdu.

Araştırma 1958'de tamamlandı, sözleşme imzalandı. Teknik temel askeriyeden
geldi: uçak takip eden SAGE hava savunma sistemi, koltuk takip etmek için de
uygun altyapıyı sunuyordu — etkileşimli gerçek zamanlı hesaplama, manyetik
çekirdek bellek, aktif yedekli çift işlemci, modemlerle dijital iletişim.
SAGE, IBM'in ACP'sine dönüştü; ACP de TPF'ye. **TPF bugün hâlâ büyük
GDS'lerin çekirdeğinde koşuyor.**

<x-slides deck="crs-evolution" range="6-8" caption="Fikrin doğuşu, projenin onayı ve askeri teknolojinin ticari sisteme aktarılması.">
<p>Sunumun 6-8. slaytları: 1953 uçuşu, SABER projesi ve SAGE aktarımı.</p>
</x-slides>

1961'de SABRE'ın aşamalı kurulumu başladı. O aşamalı kurulum yaklaşımı da
bize kaldı: bugünkü PSS geçişleri hâlâ aynı şekilde, parça parça yapılıyor.

## 1961'de verilen karar hâlâ duruyor

SABRE'ın mimarisi beş modül bıraktı: programlar, envanter, PNR, biletleme ve
DCS. Her biri kendi sorusuna cevap veriyor — nereye uçulacak, kaç koltuk
satılabilir, yolcu kim, ödeme ne oldu, uçağa kim bindi.

Dikkat edilecek yer şu: **PNR, biletleme ve envanter ayrı modüller.** Bu
1961'de verilmiş bir karar ve bugün hâlâ bedelini ödüyoruz. E-bilet ile PNR
senkronizasyonu kaybedebiliyor, çünkü mimari onları ayrı doğurdu. IATA'nın
ONE Order girişimi tam olarak bu ayrılığı geri almaya çalışıyor: PNR, bilet
ve EMD'yi tek bir perakende siparişi olarak birleştirmek.

Altmış yıl sonra bir modülerleştirme kararını geri almaya çalışıyoruz.

## Ne kaldı bize

Üç şey, ve üçü de havacılığa özgü değil.

**Senkronizasyon yavaşsa envanteri saklarsın.** Tampon koltuk bir beceriksizlik
değil, gecikmenin faturası. Kendi sisteminde emniyet stoğu tutuyorsan aynı
faturayı ödüyorsun; sorulacak soru "stoğu nasıl azaltırım" değil, "senkronu
neden hızlandıramıyorum".

**Kısıt her zaman teknik değil.** CAB döneminde eksik olan algoritma değildi,
izindi. Bir sistemde yapılmayan şeye bakarken önce kuralı sor.

**Erken verilmiş sınır kararları en uzun yaşayanlardır.** Envanteri kayıttan
ayırmak 1952'de doğru karardı; 2026'da onu birleştirmek için uluslararası bir
standart girişimi gerekiyor. Bugün böldüğün şey, bölünmüş kalıyor.
