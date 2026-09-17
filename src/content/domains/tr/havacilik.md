---
title: "Havacılık"
thesis: "Havacılık yazılımı, kırk yıllık bir veri modelinin üzerine kurulmuş gerçek zamanlı bir pazarlık sistemidir."
blurb: "Rezervasyon, envanter ve operasyon. Neden hiçbiri göründüğü kadar basit değil."
order: 1
outline:
  - slug: pnr-bir-kayit-degil
    title: "PNR bir kayıt değil, bir sözleşme"
    promise: "Rezervasyonu satır olarak modellersen ilk ay çalışır, ikinci ay çöker."
    part: "Rezervasyon"
  - slug: overbooking-bir-hata-degil
    title: "Overbooking bir hata değil, bir model"
    promise: "Kasıtlı fazla satışın matematiği ve kabul edilen maliyet kalemi."
    part: "Rezervasyon"
  - slug: envanter-koltuk-degildir
    title: "Envanter koltuk değildir"
    promise: "Uçakta 180 koltuk var ama envanterde 26 farklı ürün. Sınıflar, kotalar ve neden iç içe."
    part: "Envanter"
  - slug: fiyat-bir-sayi-degil
    title: "Fiyat bir sayı değil, bir kural yığını"
    promise: "Ücret kuralları, vergiler, ek ücretler. Aynı koltuk için neden iki kişi farklı öder."
    part: "Envanter"
  - slug: kod-paylasimi
    title: "Kod paylaşımı: iki şirket, tek koltuk"
    promise: "Aynı koltuğu iki ayrı envanterde tutmanın tutarlılık bedeli."
    part: "Envanter"
  - slug: irops
    title: "IROPS: plan çöktüğünde"
    promise: "Düzensiz operasyon bir optimizasyon değil, bir kurtarma problemi."
    part: "Operasyon"
  - slug: mürettebat-ciozelgeleme
    title: "Mürettebat çizelgeleme neden NP-zor"
    promise: "Yasal dinlenme, nitelik, üs dönüşü. Kısıtlar birbirini kesiyor."
    part: "Operasyon"
  - slug: mesajlasma-edifact
    title: "Sektör hâlâ EDIFACT konuşuyor"
    promise: "1987 tarihli bir mesaj formatının neden JSON'a yenilmediği."
    part: "Entegrasyon"
  - slug: dagitim-ndc
    title: "NDC: dağıtımı kim kontrol ediyor"
    promise: "GDS'ten doğrudan bağlantıya geçişin teknik değil ticari bir kavga olduğu."
    part: "Entegrasyon"
---

Havacılık, yazılımcıların "bu neden bu kadar karmaşık" dediği ama karmaşıklığın
neredeyse tamamının **gerçek bir sebebi olduğu** ender alanlardan biri.

Bu dosyayı yazma sebebim, kariyerim boyunca gördüğüm en öğretici modelleme
hatalarının burada toplanması. Rezervasyonu bir satır sanmak, koltuğu bir stok
kalemi sanmak, gecikmeyi bir istisna sanmak — üçü de yazılımın başka
alanlarında da yapılan hatalar, ama havacılıkta sonuçları hemen görünüyor.

Kaynaklarım kamusal: IATA standartları, yayınlanmış kaza ve kesinti raporları,
havayollarının kendi teknik dokümanları. Belirli bir şirketin iç bilgisi
değil.
