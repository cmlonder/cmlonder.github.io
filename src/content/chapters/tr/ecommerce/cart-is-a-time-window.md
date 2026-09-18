---
title: "Sepet bir tablo değil, bir zaman penceresi"
domain: "ecommerce"
summary: "Fiyat sepete eklerken mi donar, ödemede mi? Sorunun cevabı bir tercih değil; sistemin hangi sözü verdiğini belirliyor."
pubDate: 2026-09-15
topics: ["solution-architecture"]
crossRef:
  domain: "aviation"
  slug: "pnr-is-a-contract"
  why: "PNR da aynı şekilde bir kayıt değil, taraflar arası süreli bir sözleşme."
placeholder: true
---

Sepet, e-ticaret sistemlerinde en hafife alınan yapı. Görünüşte basit: ürün
kimliği, adet, kullanıcı.

Gerçekte sepet bir **zaman penceresi** — içindeki her şey dışarıdaki dünya
değiştikçe geçersizleşiyor.

## Sepetteki her alan bayatlayabilir

Müşteri ürünü sepete koyduğu anda şunlar doğruydu:

| Alan | Ne kadar sonra bayatlar |
|---|---|
| Fiyat | Kampanya bitince, saniyeler içinde olabilir |
| Stok | Başkası aldığında |
| Kargo ücreti | Adres değişince, sepet tutarı eşiği geçince |
| Kampanya uygunluğu | Sepete başka ürün eklenince |
| Vergi | Teslimat ülkesi seçilince |

Yani sepet, **dondurulmuş bir görüntü** değil; her gösterimde yeniden
hesaplanması gereken türev bir şey. Sepeti bir tablo olarak tutup içine fiyat
yazan sistemler, o fiyatın ne zaman güncelleneceği sorusunu er ya da geç
çözmek zorunda kalıyor — genellikle üretimde, bir şikâyetle.

## Fiyat ne zaman donar

Bu sorunun teknik bir cevabı yok; **ticari bir söz** seçiyorsun.

**Sepete eklerken donuyorsa** müşteriye "gördüğün fiyat senindir" demiş
oluyorsun. Sonucu: sepette iki hafta bekleyen ürün eski fiyatla satılıyor, ve
zamlı dönemde sepetler birer opsiyon sözleşmesine dönüşüyor. Buna bir
son kullanma süresi koymadıysan, bilançoda görürsün.

**Ödemede donuyorsa** müşteri sepete koyduğu fiyattan farklı bir tutar
görebiliyor. Doğru olan bu ama açıkça söylenmesi gerekiyor; söylemezsen
sepette 100 lira gören müşterinin ödemede 120 görmesi bir güven kaybı.

**Ara çözüm** çoğu sistemin yaptığı: fiyat kısa bir süre — tipik olarak
15-30 dakika — donuyor, süre dolduğunda sepet sessizce yeniden
değerleniyor ve değişiklik varsa kullanıcıya gösteriliyor.

Hangisini seçersen seç, **kodda tek bir yerde** olmalı. Bu kararın iki farklı
serviste iki farklı şekilde uygulandığı sistemler gördüm; sonuç, kimsenin
üretemediği ama ayda birkaç kez olan fiyat tutarsızlıkları.

## Sepet kimin

İkinci hafife alınan konu: sepetin sahibi.

Anonim kullanıcının sepeti bir çerezde ya da oturumda yaşıyor. Giriş
yaptığında ne olacak? Eski sepetle yenisi **birleşecek mi**, üzerine mi
yazacak, yoksa kullanıcıya mı sorulacak?

Üçü de savunulabilir. Savunulamaz olan, bu kararın verilmemiş olması —
o zaman davranış hangi servisin önce çalıştığına bağlı kalıyor ve
kullanıcı bazen sepetini kaybediyor.

Aynı soru çoklu cihazda tekrar çıkıyor: telefonda ve masaüstünde açık iki
sepet. Birleştirme kuralın yoksa son yazan kazanıyor, ve müşteri ne
olduğunu anlamıyor.

## Terk edilen sepet bir hata değil

Sepetlerin büyük çoğunluğu siparişe dönüşmüyor ve bu normal. Sepet bir
**niyet sinyali**, bir taahhüt değil.

Bunu kabul etmek iki şeyi değiştiriyor. Birincisi, sepet verisini kalıcı
sipariş verisiyle aynı yerde tutmak gereksiz — farklı ömre sahip veriyi
aynı deponun aynı garantileriyle saklıyorsun. İkincisi, terk edilmiş
sepetler bir temizlik problemi değil, bir **veri kaynağı**: hangi adımda
kaybedildiği ürün ekibinin en değerli girdisi.

Sepeti geçici bir pencere olarak modellemek, hem depolama kararını hem de
ürün kararını netleştiriyor.
