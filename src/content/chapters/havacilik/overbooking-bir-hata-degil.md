---
title: "Overbooking bir hata değil, bir model"
domain: "havacilik"
summary: "Havayolları koltuktan fazla bilet satıyor ve bu bir yazılım hatası değil, bilinçli bir karar. İlginç olan kararın kendisi değil, sistemin onu nasıl taşıdığı."
pubDate: 2026-09-13
topics: ["solution-architecture", "scale-and-performance"]
crossRef:
  domain: "eticaret"
  slug: "stok-bir-sayi-degil"
  why: "E-ticarette oversell hata sayılıyor, havacılıkta model. Fark tazminatın fiyatlanabilir olmasında."
placeholder: true
---

180 koltuklu uçağa 186 bilet satılıyor. Yazılımcılar bunu ilk duyduğunda
hata arıyor. Hata yok — **kasıt var.**

## Sayı neden fazla

Uçuşa gelmeyen yolcu oranı — sektörde *no-show* — rotaya göre değişmekle
birlikte azımsanacak bir sayı değil. Esnek bileti olan iş yolcusu son anda
planını değiştiriyor, aktarmalı yolcu ilk bacağı kaçırıyor, bazıları hiç
gelmiyor.

Koltuk **bozulabilir bir ürün**: kapı kapandığı anda o koltuğun değeri
sıfırlanıyor, bir daha satılamıyor. Otel odası, konser bileti, reklam
gösterimi aynı kategoride.

Bu yüzden havayolu tahmini no-show oranı kadar fazla satıyor. Tahmin
tutmazsa bindirme kapısında koltuk yetmiyor ve yolcu **denied boarding**
oluyor — yani gönüllü ya da gönülsüz olarak uçuşa alınmıyor.

## Kararı taşınabilir kılan şey

Burada asıl ilginç olan tazminat. Yolcunun uçağa alınmaması durumunda
ödenecek bedel **önceden belli ve düzenlenmiş**: Avrupa'da 261/2004 sayılı
düzenleme, ABD'de DOT kuralları, başka yerlerde başka rejimler. Rakam mesafeye
ve gecikmeye göre değişiyor ama **hesaplanabilir**.

Bu tek özellik bütün modeli mümkün kılıyor. Riskin bedeli bilindiği için
karar bir kumar olmaktan çıkıp bir optimizasyon problemine dönüşüyor:

```
beklenen kazanç = P(no-show) × ek bilet geliri
beklenen maliyet = P(fazla yolcu) × tazminat + itibar maliyeti
```

Havayolu ikincisini birincisinden küçük tutacak kadar fazla satıyor. Fazlası
değil.

## Yazılım tarafında ne değişiyor

Buradan çıkan mimari sonuçlar, havacılıkla ilgilenmesen bile işine yarayan
türden.

**Envanter sayacı tek bir sayı olamaz.** Satılabilir koltuk sayısı fiziksel
koltuk sayısı değil; sınıfa, tarifeye ve tahmine göre hesaplanan türev bir
değer. Sisteminde `available_seats` diye tek bir alan varsa modelin daha
baştan yanlış.

**Fazla satış bir istisna değil, normal akış.** Bindirme sürecinin gönüllü
arama, yükseltme, yeniden yönlendirme ve tazminat adımlarını **rutin olarak**
desteklemesi gerekiyor. Bunları "hata durumu" olarak kodlarsan, yılda
binlerce kez çalışan bir hata yolun olur — ve hata yolları hep en az test
edilen yollardır.

**Karar anı geç olmalı.** Kimin uçağa alınmayacağı bilet satışında değil,
kapıda belli oluyor. Yani sistem son ana kadar **kararsız kalabilmeli**; erken
bağlanan bir tasarım burada işe yaramıyor.

## Neden e-ticarette aynısı yapılmıyor

E-ticarette stoktan fazla satmak — *oversell* — hata sayılıyor ve haklı
olarak. Aradaki fark modelde değil, **tazminatın fiyatlanabilir olmasında.**

Havayolunda yolcuya ne ödeneceği kanunla belli. E-ticarette sipariş iptal
edildiğinde müşterinin kaybı düzenlenmiş değil; maliyet tamamen itibar
tarafında ve ölçülemiyor. Ölçemediğin riski optimize edemezsin.

Bu yüzden e-ticaret sistemleri stoğu **rezervasyonla** koruyor: sayaç
azaltmak yerine süreli bir söz veriyor. Aynı problemin, tazminatın
hesaplanamadığı durumdaki çözümü bu.

İki alan aynı soruyu soruyor: *bozulabilir bir kaynağı, talebin belirsiz
olduğu bir dünyada nasıl satarsın.* Cevapları farklı, çünkü yanlış cevabın
bedeli birinde bilinir, diğerinde değil.
