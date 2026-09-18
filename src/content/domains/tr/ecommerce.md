---
title: "E-ticaret"
thesis: "E-ticaret yazılımı, stoğun aslında bir söz olduğunu kabul etmeyi reddeden sistemlerin mezarlığıdır."
blurb: "Stok, sepet, sipariş. Üçü de göründüğünden daha geçici."
order: 2
outline:
  - slug: stock-is-a-reservation
    title: "Stok bir sayı değil, bir rezervasyon"
    promise: "Sayaç azaltmakla söz vermek arasındaki fark, ve oversell'in kaynağı."
    part: "Envanter"
  - slug: cart-is-a-time-window
    title: "Sepet bir tablo değil, bir zaman penceresi"
    promise: "Fiyat ne zaman donar? Sepete eklerken mi, ödemede mi? Yanlış cevabın maliyeti."
    part: "Sipariş"
  - slug: order-state-machine
    title: "Sipariş bir durum makinesi, ama kimin?"
    promise: "Ödeme, depo ve kargo aynı siparişe farklı durumlar atıyor. Tek doğru yok."
    part: "Sipariş"
  - slug: promotion-engine
    title: "Kampanya motoru neden her zaman yavaş"
    promise: "Kural sayısı arttıkça kombinatoryal patlama ve önbelleğin neden işe yaramadığı."
    part: "Fiyatlama"
  - slug: returns-are-a-new-flow
    title: "İade tersine akış değil, yeni bir akış"
    promise: "Siparişi geri sarmaya çalışan sistemlerin neden muhasebeyi bozduğu."
    part: "Sipariş"
  - slug: search-relevance-or-revenue
    title: "Arama: alaka mı, ciro mu"
    promise: "Alakalı sonuç ile kârlı sonuç aynı şey değil, ve bunu kim seçiyor."
    part: "Keşif"
  - slug: marketplace-many-truths
    title: "Pazaryeri: aynı ürün, on farklı gerçek"
    promise: "Çoklu satıcıda ürün kimliği, fiyat ve stoğun neden ayrışması gerektiği."
    part: "Pazaryeri"
  - slug: black-friday-constraint
    title: "Kara Cuma bir yük testi değil, bir tasarım kısıtı"
    promise: "Yılın bir gününe göre tasarlamanın diğer 364 güne maliyeti."
    part: "Ölçek"
---

E-ticaretin yazılım tarafı aldatıcı derecede tanıdık görünüyor: ürün, sepet,
sipariş. Herkes bir e-ticaret sistemi çizebileceğini sanıyor.

Sorun şu ki bu üç kelimenin hiçbiri sabit bir şeyi tarif etmiyor. Ürün
satıcıya göre değişiyor, sepet dakikalar içinde geçersizleşiyor, sipariş
üç farklı sistemde üç farklı durumda olabiliyor.

Bu dosyanın asıl konusu **geçicilik**: hangi verinin ne kadar süre doğru
kaldığı ve sistemleri buna göre tasarlamak.
