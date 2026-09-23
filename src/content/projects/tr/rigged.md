---
title: "RIGGED"
summary: "Reddit gönderisi içinde doğrudan çalışan ve topluluk tahminleriyle puanlanan günlük fizik tabanlı bulmaca oyunu."
what: "Oyuncuların fizik düzenekleri kurduğu, diğer kullanıcıların ise sistem çalışmadan önce sonucunu tahmin ettiği etkileşimli bir oyun."
status: "shipped"
started: 2026-07-04
updated: 2026-07-19
stack: ["Devvit", "Phaser 4", "Matter.js", "TypeScript", "Hono", "Redis"]
url: "https://www.reddit.com/r/RiggerGame/comments/1uxg0xy/"
event:
  name: "Reddit — Games with a Hook"
  url: "https://devpost.com/software/rigged"
metrics:
  - label: "Fizik parçası"
    value: "11"
  - label: "Rotasyon günü"
    value: "24"
  - label: "Drift yüzünden çıkan level"
    value: "3"
order: 5
---

Tek bir Reddit gönderisi içinde gömülü olarak çalışan günlük bir fizik bulmaca oyunu. Reddit'in "Games with a Hook" hackathon'u için geliştirildi. Her gün oyunculara engelleri ve hedef noktası önceden tanımlanmış yeni bir sahne sunulur. Oyuncu 11 farklı parçayı kullanarak bir düzenek tasarlar, simülasyonu çalıştırır ve sahneyi yayınlar. Diğer kullanıcılar ise bu düzeneği henüz harekete geçmemiş, **donmuş** haliyle görür ve kritik kararı verir: Bu sistem çalışır mı, yoksa çöker mi? Ardından simülasyon başlar ve sonuç ortaya çıkar.

Bu yapıyı klasik bulmacalardan ayırıp gerçek bir oyuna dönüştüren unsur puanlama sistemidir. Düzenek sahibi sahneyi temiz çözdüğü için değil, topluluğu ne kadar yanılttığı üzerinden puan kazanır. Yani imkânsız gibi duran ama tıkır tıkır çalışan bir düzenek, çalışacağı ilk bakışta belli olan garantili çözümlerden çok daha yüksek değer taşır.

## Asıl Mücadele: Determinizm Problemi

Her sahne açılışı önceden kaydedilmiş bir video akışı değil, kullanıcının kendi cihazında canlı olarak koşan bir simülasyondur. Bu nedenle aynı düzeneğin her tarayıcıda ve her donanımda istisnasız aynı sonucu üretmesi gerekir, aksi halde oyun mekaniği güvenilirliğini kaybeder.

Fizik motorlarında "aynı" görünen iki simülasyon, nesnelerin sahneye eklenme sırası gibi önemsiz görünen ayrıntılarda dahi farklılaşabilir. Çözüm olarak tarayıcının kare döngüsüne (frame loop) bağımlı kalmak yerine, simülasyon dünyasını `1000 / 60` sabit adımlarla manuel olarak ilerleten bir yapı kuruldu. Ayrıca sunucu tarafında çalışan bir test aracı, bot düzeneklerini önceden simüle ederek her seviyenin gerçekten çözülebilir olduğunu doğruladı.

Buna rağmen bazı uç senaryolarda bu tedbirler yetersiz kaldı. Çok hassas temas gerektiren üç seviye, 24 günlük rotasyondan çıkarıldı. Çünkü milimetrik sapmalar dahi çalışan bir sistemi başarısızlığa sürükleyebiliyordu. Sonuçlar konusunda ara sıra da olsa tutarsızlık yaşayan bir oyun sunmaktansa, riskli seviyeleri kapsam dışında bırakmayı tercih ettim.

## Serbest Metin Kutusu Olmadan Kullanıcı İçeriği Yönetimi

Oyuncular kendi bölümlerini toplulukla paylaşabilir, ancak bu süreçte hiçbir serbest metin girişine izin verilmez. Tüm parametreler önceden belirlenmiş şablonlardan seçilir, sunucu her gönderimi bağımsız olarak simüle edip doğrular ve bir bölüm ancak üreticisi tarafından bizzat çözüldükten sonra yayına alınır. Böylece henüz ortaya çıkmamış bir moderasyon yükü, en düşük maliyetle kaynağından çözülmüş olur.

## Süreçten Çıkardığım Ders

İlk aşamada ekran tasarımlarını çalışan canlı prototip üzerinden değil, prototipin kod yapısından ve iş kurallarından yola çıkarak modelledim. Küçük bir ayrıntı gibi görünse de faturası ağır oldu: CSS animasyonları eksik aktarıldı, eleman konumları kaydı ve yalnızca sistem çalışırken görünür olan bazı ara akışlar tamamen gözden kaçtı.

Bu deneyim bana kıymetli bir gerçeği bir kez daha hatırlattı: **Bir sistemin kaynak kodunu okumak, o sistemin gerçek çalışma anını izlemekle aynı şey değildir.** Artık her ekran tasarımı statik dosyalarla değil, canlı ve çalışan prototiple doğrudan kıyaslanarak doğrulanıyor.
