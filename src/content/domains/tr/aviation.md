---
title: "Havacılık"
thesis: "Havacılık yazılımı, kırk yıllık bir veri modelinin üzerine kurulmuş gerçek zamanlı bir pazarlık sistemidir."
blurb: "Rezervasyon, envanter ve operasyon. Neden hiçbiri göründüğü kadar basit değil."
order: 1
outline:
  - slug: mail-contracts-to-sabre
    title: "Posta sözleşmesinden SABRE'ye"
    promise: "Envanterle yolcu kaydı neden ayrı doğdu ve o ayrılık neden hâlâ peşimizi bırakmıyor."
    part: "Rezervasyon"
  - slug: sabre-to-pss
    title: "SABRE'den PSS'e: bir mimari neden 60 yıl yaşadı"
    promise: "1964'ün veri modeli bugünkü PSS'lerde hâlâ neden duruyor; standartlaşma ilk denemede neden kaçırıldı."
    part: "Rezervasyon"
  - slug: pnr-is-a-contract
    title: "PNR bir kayıt değil, bir sözleşme"
    promise: "Rezervasyonu satır olarak modellersen ilk ay çalışır, ikinci ay çöker."
    part: "Rezervasyon"
  - slug: overbooking-is-a-model
    title: "Overbooking bir hata değil, bir model"
    promise: "Kasıtlı fazla satışın matematiği ve kabul edilen maliyet kalemi."
    part: "Rezervasyon"
  - slug: inventory-is-not-seats
    title: "Envanter koltuk değildir"
    promise: "Uçakta 180 koltuk var ama envanterde 26 farklı ürün. Sınıflar, kotalar ve neden iç içe."
    part: "Envanter"
  - slug: price-is-a-rule-stack
    title: "Fiyat bir sayı değil, bir kural yığını"
    promise: "Ücret kuralları, vergiler, ek ücretler. Aynı koltuk için neden iki kişi farklı öder."
    part: "Envanter"
  - slug: codeshare
    title: "Kod paylaşımı: iki şirket, tek koltuk"
    promise: "Aynı koltuğu iki ayrı envanterde tutmanın tutarlılık bedeli."
    part: "Envanter"
  - slug: irops
    title: "IROPS: plan çöktüğünde"
    promise: "Düzensiz operasyon bir optimizasyon değil, bir kurtarma problemi."
    part: "Operasyon"
  - slug: crew-scheduling
    title: "Mürettebat çizelgeleme neden NP-zor"
    promise: "Yasal dinlenme, nitelik, üs dönüşü. Kısıtlar birbirini kesiyor."
    part: "Operasyon"
  - slug: edifact-messaging
    title: "Sektör hâlâ EDIFACT konuşuyor"
    promise: "1987 tarihli bir mesaj formatının neden JSON'a yenilmediği."
    part: "Entegrasyon"
  - slug: ndc-distribution
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
