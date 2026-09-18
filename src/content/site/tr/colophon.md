---
title: Künye
description: Bu site nasıl kuruldu ve neden böyle kuruldu.
updated: 2026-09-15
---

Bu siteyi kurarken tek bir şeyi denedim: içerik repoda düz dosya olarak dursun
ki bir ajan üzerinde gerçekten çalışabilsin. Aşağıdaki kararların hepsi bunun
sonucu.

## Yığın

Astro, statik çıktı, `main`'e her push'ta GitHub Actions ile GitHub Pages'e
deploy. Veritabanı yok, sunucu yok, analitik yok.

## Tipografi

Serif olan her şey **Fraunces** — optik boyut ekseni sayesinde tek aile hem
display hem gövde rolünü karşılıyor. Arayüz metni **Lato**, kod **IBM Plex
Mono**. Üçü de build sırasında indirilip bu alan adından sunuluyor; sayfa hiçbir
harici font isteği yapmıyor.

## Renk

Altı token, bir kez tanımlı, koyu tema için bir kez yeniden tanımlı. Her
eşleşme yayına çıkmadan WCAG AA'ya karşı ölçülüyor. Bir renk — deniz mavisi —
metin için kontrastı geçmediğinden sadece ikonlarda kullanılıyor.

## Ajanlar için

Her yazının temiz Markdown hâli var: URL'nin sonuna `.md` ekle. Bir
[llms.txt](/llms.txt) indeksi ve iki dildeki her girdinin
[tam listesi](/llms-full.txt) mevcut. Yazılar, Markdown aynalarını işaret eden
JSON-LD taşıyor.

Repoda içerik sözleşmesini anlatan bir `AGENTS.md` ve iki skill var: biri link
eklemek, biri yazı/not/playbook eklemek için.

## Hakkını teslim etmek

Bilgi mimarisi, tipografi ölçeği ve düzen açıkça
[Maggie Appleton](https://maggieappleton.com)'a borçlu. İçerik tiplerinin konuya
göre değil düşüncenin ne kadar bittiğine göre ayrılması fikri ona ait.
