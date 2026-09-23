---
title: "Stok salt bir sayı değil, dinamik bir rezervasyondur"
domain: "ecommerce"
summary: "Veritabanındaki bir stok sayacını eksiltmek ile müşteriye kesin teslimat sözü vermek aynı şey değildir. Stok fazlası satış hatalarının kaynağı bu iki kavramın birbirine karıştırılmasıdır."
pubDate: 2026-09-11
topics: [solution-architecture, scale-and-performance]
placeholder: true
---

Neredeyse her e-ticaret altyapısında şu tanıdık SQL sorgusu bir yerlerde sessizce bekler:

```sql
UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0
```

Kendi başına bakıldığında matematiksel olarak gayet doğru bir ifadedir. Asıl problem, bu ifadenin **hangi soruya cevap verdiğidir**.

## Birbirine karışan iki farklı soru

Stok yönetiminde iki ayrı soru vardır ve ikisi sürekli olarak birbiriyle karıştırılır:

1. **Fiziksel depoda kaç adet ürün var?** — Fiziksel sayım gerçeği
2. **Kaç adet ürün için müşteriye kesin satış sözü verebilirim?** — İş mantığına dayalı hesaplanan değer

İkinci kavrama tedarik zincirinde *satılabilir stok* (available-to-promise) denir ve fiziksel adetten çok farklı bir sayıdır. Depoda 10 adet ürün bulunabilir fakat:

- 3 adedi ödeme adımı devam eden sepetlere ayrılmıştır
- 2 adedi müşteriden iade gelmiştir ancak henüz kalite kontrolünden geçmemiştir
- 1 adedi rafta hasar görmüştür ve satışa uygun değildir
- 5 adedi ise tedarikçiden yola çıkmıştır ve üç gün sonra depoya girecektir

Dolayısıyla müşteriye taahhüt edebileceğiniz sayı 10 değildir. Üstelik bu sayı **sorgunun yapıldığı ana bağlıdır** ve beş dakika sonra tamamen değişebilir.

## Rezervasyon modeli: Sayaç yerine süreli taahhüt

Doğru mimari yaklaşım şudur: Müşteri ürünü sepete eklediğinde ya da ödeme adımına geçtiğinde veritabanındaki ana sayacı doğrudan eksiltmezsiniz, **süreli bir rezervasyon** kaydı oluşturursunuz:

```
rezervasyon:
  ürün_id, adet, oturum_veya_sipariş_id, son_geçerlilik_zamanı
```

Böylece satılabilir stok artık veritabanında tutulan statik bir sayaç değil, anlık bir formül haline gelir:

```
satılabilir = fiziksel_stok − aktif_rezervasyonlar − hasarlı_veya_bloke_stok
```

Bu yapının sisteme kazandırdığı üç devasa avantaj vardır:

**Süresi dolan stok kendiliğinden sisteme döner.** Ödeme adımını yarıda bırakan bir müşterinin kilitlediği stok, herhangi bir iptal işlemi çalışmasa bile on beş dakika sonra rezervasyonun süresi bittiği için otomatikman serbest kalır. Sayaç modelinde bunu telafi etmek için arka planda sürekli bir temizlik görevi çalıştırmak zorundasınızdır ve o görevin aksadığı gün stoklar sessizce sızar.

**Hangi adedin kime ayrıldığı nettir.** Basit sayaç modelinde 7 yerine 4 yazdığında aradaki 3 adedin kime ve neden gittiğini izleyemezsiniz. Rezervasyon modelinde ise "bu 3 adedi şu sipariş adımları tutuyor" yanıtı her zaman hazırdır. Müşteri destek ve operasyon ekipleri için aradaki fark paha biçilemezdir.

**Yarış koşulları tek bir kritik noktada toplanır.** Rezervasyon oluşturma adımı sistemdeki tek kritik eşzamanlılık bölgesidir, geri kalan tüm akışlar salt okumadan ibarettir. Sayaç modelinde ise sepet, ödeme, iptal ve iade gibi tüm servisler doğrudan aynı sayıya yazmaya çalışır ve her biri bağımsız bir yarış koşulu (race condition) riski doğurur.

## Bu mimari nerede zorlanır?

Rezervasyon modeli elbette kendi içinde yeni teknik bedeller getirir:

**Çok popüler ürünlerde kilitlenme yaşanabilir.** Binlerce müşteri aynı saniyede sınırlı sayıdaki tek bir ürünü rezerve etmeye çalıştığında o satır bir kilit noktasına dönüşür. Çözüm, ürün kaydını kilitlemek yerine **append-only rezervasyon kayıtları eklemek** ve satılabilir miktarı anlık toplamlarla hesaplamaktır. Bu tercih yazma kilitlenmesini çözer fakat okuma maliyetini artırır.

**Okuma pahalılaşınca önbellek devreye girer, önbellek girince tutarlılık riski doğar.** Ürün detay sayfasında kullanıcıya gösterilen "son 3 ürün" bilgisinin birkaç saniye eski kalması kabul edilebilir bir durumdur. Ancak ödeme anında da bayat veriye bakılması kesinlikle kabul edilemez. Bu iki okuma ihtiyacını birbirinden ayırmadığınız sürece sistem ya çok yavaşlayacak ya da hatalı stok sözü verecektir.

**Kısmi sipariş politikası teknik değil, ticari bir karardır.** Üç ürünlük bir sepetin sadece iki kalemi rezerve edilebiliyorsa ne yapılacağı bir mühendislik kararı değil, ürün stratejisidir: Siparişi bekletmek mi, eldekileri hemen kargolamak mı, yoksa siparişi tamamen reddetmek mi gerekir? Sistem bu üç senaryoyu da destekleyecek esneklikte tasarlanmalıdır ve karar koda sabitlenmemelidir.

## Havacılık sektörünün zıt yaklaşımı

İlginç bir karşılaştırma olarak, havacılık sektörü aynı kapasite problemini **tam tersi bir mantıkla** çözer: Uçaktaki koltuk sayısından daha fazla bilet satar (overbooking) ve kapıda açıkta kalan yolculara nakit tazminat öder.

Havayollarının bunu göze alabilmesinin yegane sebebi, ödenecek tazminatın **kanunlarla önceden belirlenmiş ve hesaplanabilir** olmasıdır. Hangi gecikmede ne kadar ceza ödeneceği bellidir. E-ticarette ise siparişi iptal edilen bir müşterinin yarattığı itibar kaybı yasal kurallarla sınırlandırılmamıştır ve maliyeti ölçülemez.

Ölçemediğiniz bir riski matematiksel olarak optimize edemezsiniz. Bu yüzden e-ticaret sistemleri süreli rezervasyon yapar, havayolları ise fazla bilet satar. Problem aynıdır fakat maliyet fonksiyonu taban tabana zıttır.

