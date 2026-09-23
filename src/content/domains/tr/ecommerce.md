---
title: "E-ticaret"
thesis: "E-ticaret mimarisi, stoğun aslında geleceğe verilmiş bir taahhüt olduğunu kabul etmeyen sistemlerin çıkmazlarıyla doludur."
blurb: "Stok, sepet ve sipariş döngüsünün perde arkası ile e-ticaretteki geçici veri durumlarının analizi."
order: 2
outline:
  - slug: stock-is-a-reservation
    title: "Stok bir sayı değil, bir rezervasyon"
    promise: "Veritabanında basit bir sayaç azaltmak ile müşteriye teslimat sözü vermek arasındaki fark ve fazla satış krizlerinin kök nedenleri."
    part: "Envanter"
  - slug: cart-is-a-time-window
    title: "Sepet bir tablo değil, bir zaman penceresi"
    promise: "Fiyatın ve envanterin sepete ekleme anında mı yoksa ödeme aşamasında mı kilitlenmesi gerektiği, hatalı kararların operasyonel maliyeti."
    part: "Sipariş"
  - slug: order-state-machine
    title: "Sipariş bir durum makinesi, ama kimin?"
    promise: "Ödeme altyapısı, depo yönetimi ve kargo entegrasyonlarının aynı sipariş için ürettiği çelişkili durumlar ve mutabakat modelleri."
    part: "Sipariş"
  - slug: promotion-engine
    title: "Kampanya motoru neden her zaman yavaş"
    promise: "Kural kombinasyonları arttıkça yaşanan işlemci darboğazları ve dinamik sepetlerde önbellek stratejilerinin neden yetersiz kaldığı."
    part: "Fiyatlama"
  - slug: returns-are-a-new-flow
    title: "İade tersine akış değil, yeni bir akış"
    promise: "İptal ve iade süreçlerini geriye dönük işlem gibi kurgulayan sistemlerin muhasebe ve stok dengesini nasıl bozduğu."
    part: "Sipariş"
  - slug: search-relevance-or-revenue
    title: "Arama: alaka mı, ciro mu"
    promise: "Kullanıcı aramalarında en alakalı ürün ile işletme için en kârlı ürün arasındaki algoritma dengesi ve sıralama stratejileri."
    part: "Keşif"
  - slug: marketplace-many-truths
    title: "Pazaryeri: aynı ürün, on farklı gerçek"
    promise: "Pazaryeri modellerinde tek bir ürün kimliğinin farklı satıcılar, fiyatlar ve teslimat süreleri altında nasıl yönetileceği."
    part: "Pazaryeri"
  - slug: black-friday-constraint
    title: "Kara Cuma bir yük testi değil, bir tasarım kısıtı"
    promise: "Yılın birkaç yoğun gününü karşılamak üzere tasarlanan altyapıların yılın kalan dönemine getirdiği mimari ve maliyet yükü."
    part: "Ölçek"
---

E-ticaret sistemleri dışarıdan bakıldığında aldatıcı bir sadeliğe sahiptir: ürün listelenir, sepete atılır ve sipariş verilir. Bu yüzden birçok mühendis başlangıçta standart bir e-ticaret akışını kolaylıkla modelleyebileceğini düşünür.

Oysa pratikte bu kavramların hiçbiri durağan bir gerçeğe karşılık gelmez. Ürün bilgisi satıcıya ve kanala göre farklılaşır, sepet dakikalar içinde güncelliğini yitirir, sipariş ise ödeme, depo ve kargo sistemlerinde eş zamanlı olarak bambaşka durumlarda yaşayabilir.

Bu incelemenin odak noktası **verinin geçiciliği**: hangi bilginin ne kadar süreyle geçerli kaldığı ve sistemlerin bu dinamik belirsizliğe göre nasıl kurgulanması gerektiğidir.
