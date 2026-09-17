---
title: "cmlonder.com"
summary: "Bu site. İki dilli, ajan dostu, yayın zinciri tamamen otomatik."
what: "Yazdıklarımı barındırıyor ve ajanların okuyabileceği bir yüzey sunuyor."
status: "live"
started: 2026-09-15
updated: 2026-09-17
stack: ["Astro", "TypeScript", "GitHub Actions", "GitHub Pages"]
url: "https://cmlonder.com"
repo: "https://github.com/cmlonder/cmlonder.github.io"
metrics:
  - label: "Sayfa"
    value: "189"
  - label: "Bölüm"
    value: "12"
  - label: "Yayın süresi"
    value: "2 dk"
order: 1
---

Hashnode'da iki yazılık ölü bir blog vardı. Onu kapatıp sıfırdan kurdum;
amaç yazmak değildi, **yazmayı kolaylaştıracak bir zemin** kurmaktı.

## Neyi farklı yapıyor

İçerik repoda düz Markdown. Konvansiyonlar `AGENTS.md` içinde — yani bir
ajan repoyu açıp nasıl yazı ekleneceğini kendisi okuyabiliyor. Her yazının
bir `.md` aynası var, `llms.txt` ve `llms-full.txt` bütün siteyi makine
okunur biçimde sunuyor.

Bahçe mantığı: notlar **Fidan → Filiz → Kökleşmiş** diye olgunlaşıyor ve
rozet bunu gösteriyor. Domain bölümlerinde içindekiler ilk günden açık —
**yazılmamış bölümler dahil**, her birinin altında ne anlatacağına dair bir
cümleyle.

## Ne öğrendim

Build'in yeşil olması sayfanın çalıştığı anlamına gelmiyor. `sharp` kurulu
değilken Astro optimize görsel üretemiyor ama **uyarı basıp geçiyor**;
`<img>` var olmayan bir dosyayı gösteriyor, build başarılı görünüyor, sayfa
kırık. Şimdi `check-build.mjs` her görselin gerçekten üretildiğini
doğruluyor.

Benzer bir tanesi daha: `.controls` sınıfına hiç CSS yazmamışım. Arama, dil
ve tema düğmeleri her sayfada üst üste diziliyordu ve **ekran görüntülerine
defalarca bakıp görmedim**. Bir tasarım denetimi yakaladı.
