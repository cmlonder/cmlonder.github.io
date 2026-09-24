---
title: "Havacılık"
thesis: "Havacılık yazılımları, kırk yıllık köklü veri modelleri üzerine kurulu ve gerçek zamanlı uzlaşmaya dayanan devasa bir ekosistemdir."
blurb: "Rezervasyon, envanter ve operasyon süreçlerinin perde arkası ile bu sistemlerin neden göründüğünden çok daha karmaşık olduğunun analizi."
order: 1
outline:
  - slug: mail-contracts-to-sabre
    title: "Posta sözleşmesinden SABRE'ye"
    promise: "Envanterle yolcu kaydının neden ayrı doğduğunu ve bu tarihsel ayrılığın günümüze uzanan etkilerini inceliyoruz."
    part: "Rezervasyon"
  - slug: sabre-to-pss
    title: "SABRE'den PSS'e: bir mimari neden 60 yıl yaşadı"
    promise: "1964 yılından kalan veri modelinin bugünkü PSS yapılarında neden hâlâ yaşadığını ve standartlaşmanın ilk denemede neden kaçırıldığını ele alıyoruz."
    part: "Rezervasyon"
  - slug: deregulation-1978
    title: "1978: kâr garantisi kalkınca gelir yönetimi doğdu"
    promise: "%55 dolulukla sağlanan kâr garantisi kalkınca fiyat, rota ve envanter kararlarının kime devredildiğini ve gelir yönetiminin nasıl bir hayatta kalma şartına dönüştüğünü aktarıyoruz."
    part: "Rezervasyon"
  - slug: yield-management-origins
    title: "Yield Management: erken dönem stratejik analiz ve iş mantığı"
    promise: "Kısıtlı indirimler, kontrollü fazla bilet satışı ve Littlewood kuralının DINAMO çatısı altında nasıl birleştiği, ucuz bilet satarken kârlı kalmanın temel formülü."
    part: "Rezervasyon"
  - slug: yield-management-peoplexpress
    title: "Yield Management: rekabet stratejileri ve PEOPLExpress analizi"
    promise: "Yılda bir milyar dolar daha düşük operasyon maliyetinin neden yetersiz kaldığı ve marjinal trafik kontrolünün kaybeden tarafın gözünden analizi."
    part: "Rezervasyon"
  - slug: revenue-management-operations
    title: "Gelir yönetimi ve stratejik operasyonlar: PEOPLExpress ve American Airlines analizi"
    promise: "Bacak bazlı kontrolden köken-varış kontrolüne geçiş, aktarmalı hatların matematiksel dengesi ve sadakat programı verilerinin aynı modelde birleşmesi."
    part: "Rezervasyon"
  - slug: loyalty-and-gds
    title: "PEOPLExpress ve havacılık sektörü: sadakat programları ve dağıtım sistemleri stratejik analizi"
    promise: "Mil kullanımının biletli yolcularla ilişkisi, bağımsız ortak sistem denemelerinin akıbeti ve ekran sıralamalarının ardındaki kritik iş kuralları."
    part: "Rezervasyon"
  - slug: crs-to-gds
    title: "Havacılık rezervasyon ve küresel dağıtım sistemleri (GDS) analizi: stratejik gelişim ve iş mantığı"
    promise: "Erken dönem rezervasyon sistemlerinin çöküş nedenleri, 1984 kurallarının getirdiği yasaklar ve pazarın üç büyük küresel dağıtım sistemine dönüşme süreci."
    part: "Rezervasyon"
  - slug: industry-standards
    title: "Havacılık endüstri standartları ve yönetişim: stratejik analiz belgesi"
    promise: "Standartları belirleyen otoriteler, mesaj trafiğini yöneten ağlar, tarifeleri dağıtan platformlar ve takas odaları arasındaki operasyonel işleyiş."
    part: "Rezervasyon"
  - slug: gds-ecosystem
    title: "GDS ve havacılık dağıtım ekosistemi: stratejik analiz ve iş mantığı rehberi"
    promise: "Elektronik bilet devrimi, internet üzerinden gelen yoğun sorguların ana çatı sistemlerini nasıl zorladığı ve dönüşüm oranlarının evrimi."
    part: "Rezervasyon"
  - slug: tpf-to-metasearch
    title: "Havacılık rezervasyon sistemleri ve dijital dağıtım kanalları stratejik analizi"
    promise: "Sistemin çekirdeğindeki düşük seviyeli dillerden modern açık mimarilere geçiş ve dağıtım kontrolünün envanter yönetiminden arama motorlarına kayması."
    part: "Rezervasyon"
  - slug: travel-value-chain
    title: "Seyahat değer zinciri ve dağıtım kanalları analizi: stratejik brifing notu"
    promise: "Gelir yönetimi kararları ile ana rezervasyon sistemlerinin uyumu, vitrin tutarlılığı, bilet başına düşen rezervasyon oranları ve doğrudan satış yetkinlikleri."
    part: "Rezervasyon"
  - slug: ndc-retailing
    title: "Seyahat dağıtım ekosistemi ve yeni dağıtım yeteneği (NDC) analizi"
    promise: "Acentelerin gelir modelleri, komisyon yapısındaki değişimler, modern perakendecilik kabiliyetleri ve sipariş verilerinin tekilleştirilmesi."
    part: "Rezervasyon"
  - slug: ndc-at-scale
    title: "NDC@Scale: havacılık dağıtım kanallarında dönüşüm ve iş mantığı analizi"
    promise: "Fiyatlandırma gücüyle birlikte hesaplama yükü de havayoluna geçti: günde 675 milyon arama, GDS'in varoluşsal tercihi, agregatörlerin açtığı boşluk ve şeffaflığın yerini alan normalizasyon."
    part: "Rezervasyon"
---

Havacılık, yazılımcıların ilk bakışta “bu süreç neden bu kadar karmaşık” diye sorduğu, ancak sistemin içine girdikçe her karmaşıklığın arkasında haklı bir gerekçe olduğunu gördüğü ender alanlardan biridir.

Bu incelemeyi kaleme alma amacım, mühendislik kariyerim boyunca karşılaştığım en öğretici modelleme hatalarının tam olarak bu sektörde kesişmesi. Rezervasyonu veritabanında tek bir satır, uçaktaki koltuğu basit bir stok kalemi, operasyonel gecikmeyi ise beklenmedik bir istisna olarak kurgulamak, yazılım dünyasında sıkça düşülen tuzaklar arasında yer alıyor. Havacılıkta ise bu tür varsayımların faturası dakikalar içinde kesiliyor.

İncelemede yararlandığım tüm kaynaklar kamusal niteliktedir: IATA standartları, resmi kaza ve kesinti raporları ile havayolu şirketlerinin teknik dokümantasyonlarından derlenmiştir. Belirli bir kurumun iç sırlarını veya özel ticari verilerini içermez.
