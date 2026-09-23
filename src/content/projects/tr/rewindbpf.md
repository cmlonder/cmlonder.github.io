---
title: "RewindBPF"
summary: "Yapay zekâ ajanını tek kullanımlık bir dosya sistemi işlemi içinde çalıştırıp değişiklikleri kontrollü biçimde geri alma veya onaylama aracı."
what: "Ajana serbestçe çalışabileceği güvenli bir çalışma alanı, geliştiriciye ise onaylayıp reddedebileceği net bir fark dökümü sunuyor."
status: "shipped"
started: 2026-07-17
updated: 2026-07-22
stack: ["Go", "eBPF", "OverlayFS", "Landlock", "cgroup v2", "Codex"]
url: "https://rewind.cmlonder.com"
repo: "https://github.com/cmlonder/rewind-bpf"
event:
  name: "OpenAI Build Week"
  url: "https://devpost.com/software/rewindbpf"
metrics:
  - label: "Gün"
    value: "6"
  - label: "Commit"
    value: "213"
  - label: "Tam zorlanan platform"
    value: "1 / 3"
order: 4
---

Altı gün, 213 commit ve yoğun bir hackathon maratonu. OpenAI Build Week için geliştirilen bu prototip ticari bir ürün değil, ancak ortaya koyduğu mimari fikir tek bir hafta sonundan çok daha uzun ömürlü oldu.

Dosya sistemine yazma yetkisi olan bir yapay zekâ ajanı, farkında olmadan kaynak kod klasörünü silebilir, kritik bir yapılandırmanın üzerine yazabilir veya hassas ortam değişkenlerini okuyabilir. Bu duruma karşı geliştirilen geleneksel yöntem genellikle yasaklı terminal komutlarından oluşan bir kara liste oluşturmaktır. Oysa bu listelerin etrafından dolaşmak son derece kolayken, her çalıştırma öncesinde tüm projeyi kopyalamak ise operasyonel olarak çok pahalıdır.

RewindBPF güvenlik sınırının yerini değiştirir. Gerçek çalışma alanı değişmez bir alt katman olarak korunur. Ajan birleşik dosya görünümü üzerinden normal biçimde çalışır, ancak yaptığı tüm yazma ve silme işlemleri tek kullanımlık geçici bir üst katmana yönlendirilir. Süreç tamamlandığında iki temel seçenek kalır: **üst katmanı tamamen çöpe atmak ya da çakışma kontrollerinden geçirerek ana sisteme dahil etmek.** Okuma izinleri ise ayrı bir politikayla yönetilir. `.env` gibi kritik dosyaları tek tek engellemek yerine desen bazlı kurallarla hassas dosyalara erişim sınırlandırılır.

Bu yapı Git'in yerine geçmediği gibi Git de bu yapının işlevini üstlenemez. Git, geliştiricinin bilinçli olarak kaydettiği commit'leri korur. Rewind ise henüz commit atılmamış dinamik çalışma anını güvenceye alır. Takip edilmeyen veya yok sayılan görseller, ikili dosyalar ve geçici varlıklar da dahil olmak üzere çalışma alanındaki her şey bu güvenlik çemberine dahildir.

## Neyi Geri Almıyor?

Sistemin güvenlik sınırı, koruma altındaki yerel çalışma alanının dosya yollarıyla sınırlıdır. Dolayısıyla veritabanı yazma işlemlerini, bulut API çağrılarını, harici ağ trafiğini, işletim sistemi çekirdeğindeki değişiklikleri ve çalışma alanı dışındaki dosyaları geriye alamaz.

Hackathon teslimlerinde genellikle göz ardı edilen kritik detay burasıdır. Ajan çalışma sırasında harici bir API'ye istek göndermişse, yerel üst katmanı silmek o isteğin dış dünyadaki etkisini geri döndürmez.

## Gerçek Anlamda Zorlanan Tek Platform

Sistemin referans platformu Linux ortamıdır: OverlayFS ile yazma anında kopyalama (copy-on-write), Landlock ile okuma kısıtlamaları, eBPF ile dosya sistemi telemetrisi ve cgroup v2 ile süreç izolasyonu sağlanır. Yetki gerektiren tüm testler Ubuntu 24.04 sanal makinesinde koşturulur.

macOS tarafında APFS anlık kopyalarına (clone) dayanan yerel bir yol bulunur. Bu yapı yerel denetleyiciyi, kontrol paneli arayüzünü, aşamalı fark dökümünü ve geri alma adımlarını çalıştırmaya yeterlidir. Ancak eBPF veya OverlayFS seviyesinde çekirdek zorlaması sunmaz. Windows ortamında ise yalnızca işlem güvenliği sağlayan temel bir sözleşme yer alır.

Yukarıdaki metriklerde "çapraz platform" yerine 1/3 ifadesinin kullanılma sebebi tam olarak budur.

## Ajan Güvenliği Üzerine, Bir Ajanla Birlikte Geliştirildi

Projeyi Codex ortamında, mimari ve kod gözden geçirme partneri olarak GPT modelinden yararlanarak geliştirdim. Altı günde 172 Go dosyası üretmek tek başına bir insanın yazma hızıyla açıklanamaz. Ajan güvenliğini ele alan bir çalışmada bunun aksini ima etmek samimiyetsiz bir başlangıç olurdu.

Ajanlar için güvenlik bariyerleri kurarken asıl soru hangi komutların yasaklanacağı değildir. Asıl soru, **yazma işleminin tam olarak nereye yönlendirildiğidir.** Güvenli mimarinin tüm detayları bu temel sorunun cevabından doğar.
