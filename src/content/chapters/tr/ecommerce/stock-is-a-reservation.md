---
title: "Stok bir sayı değil, bir rezervasyon"
domain: "ecommerce"
summary: "Stok sayacını azaltmak ile müşteriye söz vermek aynı şey değil. Oversell'in kaynağı neredeyse her zaman bu iki işlemin karıştırılması."
pubDate: 2026-09-11
topics: [solution-architecture, scale-and-performance]
placeholder: true
---

Neredeyse her e-ticaret sisteminde şu satır bir yerlerde duruyor:

```sql
UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0
```

Tek başına doğru bir ifade. Sorun, bu ifadenin **hangi soruyu cevapladığı**.

## İki farklı soru

Sistemde iki ayrı soru var ve ikisi sürekli birbirine karışıyor:

1. **Depoda kaç tane var?** — fiziksel gerçek, sayım sonucu
2. **Kaç tane söz verebilirim?** — ticari karar, hesaplanan bir değer

İkincisine sektörde *available-to-promise* deniyor ve birinciden farklı bir
sayı. Depoda 10 tane olabilir ama:

- 3'ü ödemesi devam eden siparişlere ayrılmış
- 2'si iade olarak gelmiş ama henüz kontrol edilmemiş
- 1'i hasarlı, satılamaz
- 5'i yolda, üç gün sonra gelecek

Söz verebileceğin sayı 10 değil. Ve bu sayı **sorgu anına bağlı** —
beş dakika sonra farklı.

## Rezervasyon: sayaç yerine süreli söz

Doğru model şu: müşteri sepete eklediğinde ya da ödemeye geçtiğinde sayacı
azaltmıyorsun, **süreli bir rezervasyon** yaratıyorsun.

```
rezervasyon
  ürün, adet, sahip (oturum/sipariş), son_geçerlilik
```

Satılabilir miktar artık bir sayaç değil, bir hesap:

```
satılabilir = fiziksel − (süresi dolmamış rezervasyonlar) − (bloke)
```

Bu yapının üç avantajı var.

**Süre dolduğunda kendiliğinden geri geliyor.** Ödemesini yarım bırakan
müşterinin tuttuğu stok, iptal işlemi çalışmasa bile on beş dakika sonra
serbest kalıyor. Sayaç modelinde bunu telafi etmek için bir temizlik işi
yazman ve o işin çalıştığından emin olman gerekiyor — çalışmadığı gün stok
sızıyor.

**Kimin tuttuğu belli.** Sayaç azaldığında geriye bilgi kalmıyor: 7 yerine 4
yazıyor, neden bilmiyorsun. Rezervasyon modelinde "bu üç adedi şu üç oturum
tutuyor" sorusunun cevabı var. Destek ekibi için fark budur.

**Yarış koşulu tek yerde.** Rezervasyon yaratma işlemi tek bir kritik bölge;
gerisi okuma. Sayaç modelinde her akış — sepet, ödeme, iptal, iade — sayaca
dokunuyor ve her biri ayrı bir yarış koşulu kaynağı.

## Nerede tıkanıyor

Rezervasyon modeli bedava değil.

**Popüler ürün tek satıra dönüşüyor.** Bin kişi aynı anda aynı ürünü
rezerve etmeye çalıştığında o ürünün satırı bir kilit noktası oluyor.
Çözümü ürün bazında kilit yerine **rezervasyon eklemek** — yani satır
güncellemek yerine satır yazmak — ve satılabilir miktarı toplamla
hesaplamak. Yazma çakışması kalkıyor, okuma pahalılaşıyor.

**Okuma pahalılaşınca önbellek geliyor, önbellek gelince tutarlılık
gidiyor.** Ürün sayfasında gösterdiğin "son 3 ürün" bilgisinin bayat olması
kabul edilebilir. Sepete eklerken de bayat olması kabul edilemez. Bu iki
okumayı ayırmadığın sürece ya yavaş ya yanlış olacak.

**Kısmi sipariş kararı ticari, teknik değil.** Üç kalemden ikisi rezerve
edilebiliyorsa ne yapacağın bir ürün kararı: bekletmek, kısmi göndermek ya da
tamamını reddetmek. Sistem üçünü de destekleyebilmeli; hangisinin seçileceği
kodda sabit olmamalı.

## Havacılığın tersi

İlginç olan, havacılığın bu problemi **tam tersinden** çözmesi: koltuktan
fazla bilet satıp, açığı kapıda tazminatla kapatıyor.

Bunu yapabilmelerinin tek sebebi tazminatın **önceden hesaplanabilir**
olması — hangi durumda ne ödeneceği düzenlemeyle belli. E-ticarette
siparişi iptal edilen müşterinin kaybı düzenlenmiş değil; maliyet itibar
tarafında ve ölçülemiyor.

Ölçemediğin riski optimize edemezsin. O yüzden biz rezerve ediyoruz,
onlar fazla satıyor. Aynı problem, farklı bir maliyet fonksiyonu.
