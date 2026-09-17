---
title: "Radar boru hattı"
summary: "Günlük bir bülten yazan, kimsenin dokunmadığı yayın zinciri."
what: "Bir ajanın yazdığı bülteni her gün insan müdahalesi olmadan yayınlıyor."
status: "live"
started: 2026-09-15
updated: 2026-09-17
stack: ["Gemini Spark", "Google Apps Script", "GitHub Actions", "Astro"]
url: "https://cmlonder.com/radar"
metrics:
  - label: "Zincirdeki insan"
    value: "0"
  - label: "Dönüştüren satır"
    value: "60"
  - label: "Sıklık"
    value: "günlük"
order: 2
---

Spark her sabah bir bülten yazıp Drive'a düz markdown olarak bırakıyor. Bir
Apps Script dosyayı repoya itiyor, bir GitHub Action doğrulayıp yerine
taşıyor, site yeniden kuruluyor. **Arada metni okuyan, düzelten ya da
biçimlendiren kimse yok** — ne insan ne başka bir model.

## En pahalı ders

Başta zincirde 485 satır kod vardı: bir ayrıştırıcı, bir doğrulayıcı, grafik
motoru, kapak üreticisi. Bugün 60 satır kaldı ve o da dönüştürmüyor —
sadece dosyanın sağlam olduğunu kontrol edip yerine taşıyor.

Silinen kodun çoğu **Google Docs'un bozduklarını onarıyordu**: kaçırdığı
köşeli parantezler (`[1]` → `\[1\]`), düzleştirdiği başlık seviyeleri, araya
serpiştirdiği `&nbsp;`, sildiği tablo bağlantıları. Spark'ı Doc yerine düz
`.md` yazmaya geçirince bütün bir hata sınıfı ortadan kalktı.

Ders şu: **karmaşıklığın kaynağını aramadan onu yönetmeye çalışma.** Ben
aylarca semptomu tedavi ettim; taşıyıcıyı değiştirmek üç dakika sürdü.

## Sessizce bayat yayınlayan zincir

Bir gün zincir yeşil göründü ve **bir gün eski içeriği yayınladı**. İki hata
üst üste binmişti: `GITHUB_TOKEN` ile atılan push başka workflow
tetiklemiyor (döngü koruması), ve çağrılan workflow tetikleyen commit'i
checkout ediyor. İkisi birleşince bot yeni bülteni commit'liyor, deploy ise
bir önceki commit'i kuruyordu.

İlk testte fark etmeseydim her gün sessizce bir gün geriden yayınlayacaktı.
