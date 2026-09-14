---
name: new-entry
description: Siteye yeni yazı, not veya playbook ekler. Kullanıcı "yazı ekle", "not al", "playbook yaz", "essay ekle" dediğinde veya bir taslak metin paylaşıp siteye koymak istediğinde kullan. Sadece link paylaşıldıysa new-signal skill'ini kullan.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Yazı / not / playbook ekle

## 1. Koleksiyonu seç

Kullanıcı söylemediyse **sor, tahmin etme.** Ayrım konuya göre değil,
yazının olgunluğuna göredir:

| Seç | Ne zaman |
|---|---|
| `essays` | Argüman bitmiş, iddia net, fikir değiştirmeyi amaçlıyor |
| `notes` | Henüz düşünüyor, emin değil, yarım. "Bunu çözemedim" havası |
| `playbooks` | Tekrar eden bir karar. Başkası aynı durumda kullanabilir |

Kullanıcı uzun bir metin paylaştıysa ve hangisi olduğu belliyse sorma —
söyle ve devam et.

## 2. Alanları hazırla

Ortak zorunlular:

```yaml
title:       # başlık. İddiayı söyle, konuyu değil
description: # tek cümle. Liste sayfasında ve meta description'da çıkar
pubDate:     # bugün — `date +%F` ile al, tahmin etme
topics:      # src/config.ts TOPICS enum'undan en az bir tane. Uydurma
```

Koleksiyona özel:

- `essays` → `featured: false` (kullanıcı öne çıkarmak isterse true)
- `notes` → `status: seedling` (olgunlaştıkça budding, evergreen)
- `playbooks` → `problem` ve `context` zorunlu. İkisi de tek cümle.
  `problem`: hangi durumda bu playbook'a bakılır.
  `context`: hangi ölçek/teknoloji/sınırlar içinde geçerli.

`topics` değerlerini uydurma — önce `src/config.ts` dosyasındaki TOPICS
listesini oku.

## 3. Dosyayı yaz

Yol: `src/content/<koleksiyon>/<dil>/<slug>.md`
Dil varsayılan `en`; kullanıcı Türkçe yazdıysa `tr`.
Slug kebab-case, İngilizce, ASCII, tarih içermez.

`playbooks` gövdesi **bu başlıkları bu sırayla** içermeli:

```markdown
## Problem
## Context
## Approach
## Tradeoffs
## When this stops working
```

Son başlık atlanmamalı — playbook'u dürüst kılan o.

## 4. Doğrula

```bash
pnpm build
```

Şema hatası varsa düzelt ve tekrar çalıştır. Build geçmeden bitirme.

## 5. Çeviri

**Kullanıcı istemedikçe çeviri üretme.** Çeviri opsiyoneldir; aynı slug
iki dilde varsa site otomatik bağlar. İstenirse diğer dil klasörüne
aynı slug'la yaz — çeviri değil, o dilde yeniden yaz.

## Kurallar

- Kullanıcının sesiyle yaz. Metin verdiyse onu düzeltme, yerleştir.
- Gövdeyi kullanıcı için uydurma. Taslak yoksa taslağı iste veya
  sadece iskeleti oluşturup `draft: true` koy.
- Başlıkta "The Ultimate Guide to", "Everything You Need to Know" gibi
  kalıpları kullanma.
