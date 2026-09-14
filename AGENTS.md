# cmlonder.com

Cemal Önder'in kişisel sitesi. Astro 7, statik çıktı, GitHub Pages.
İçerik Markdown dosyaları olarak repoda durur — ajanların yazı ekleyip
düzenlemesi bu yüzden birinci sınıf bir kullanım senaryosudur.

> `CLAUDE.md` bu dosyaya symlink'tir. Tek kaynak; ikisini senkronize etmeye çalışma.

## Geliştirme

```bash
pnpm dev      # arka planda: pnpm astro dev --background
pnpm build    # dist/ üretir — şema ihlalleri ve tip hataları burada patlar
```

`pnpm astro dev stop | status | logs` ile arka plan sunucusu yönetilir.

**Değişiklikten sonra her zaman `pnpm build` çalıştır.**

## Mimari kararlar (değiştirmeden önce oku)

**İçerik tipi = olgunluk seviyesi, konu değil.** Dört koleksiyon konuya göre
değil, yazının ne kadar pişmiş olduğuna göre ayrılır:

| Koleksiyon | Ne | Uzunluk |
|---|---|---|
| `essays` | Bitmiş argüman. İddialı, fikir değiştirmeyi amaçlar | 1000+ kelime |
| `notes` | Sesli düşünme. Bitmemiş, çoğu zaman yanlış | 200-800 kelime |
| `playbooks` | Tekrarlanabilir karar. Sabit şablon | 500-1500 kelime |
| `signals` | Link + neden önemli. İki cümle, fazlası değil | 100 kelimeden az |

**Konular ayrı bir eksen.** `src/config.ts` içindeki `TOPICS` altı sabit
sütundur ve zod enum'u olarak zorunludur. Yeni konu uydurma — build patlar.
Serbest etiket gerekiyorsa `tags` alanını kullan.

**Çeviri opsiyoneldir.** Aynı slug iki dilde varsa otomatik bağlanır. Bir yazı
tek dilde yaşayabilir. Kullanıcı açıkça istemedikçe çeviri üretme.

**Renk sadece `src/styles/tokens.css` içinde tanımlanır.** Başka hiçbir dosyada
ham hex olmamalı. Token eklersen açık ve koyu temanın ikisini de tanımla ve
kontrastı ölç (gövde metni en az 4.5:1).

## Dosya düzeni

```
src/
  config.ts              Tek doğruluk kaynağı: koleksiyonlar, konular, etiketler, intro
  content.config.ts      Zod şemaları
  content/<koleksiyon>/<dil>/<slug>.md
  lib/content.ts         Dil-duyarlı sorgular, çeviri eşleme, URL üretimi
  lib/routes.ts          getStaticPaths üreteci (en ve tr tek yerden)
  layouts/               Base, EntryPage, ListPage, HomePage
  components/            EntryCard, ThemeToggle, StructuredData
  pages/                 en kökte, tr /tr/ altında
  styles/tokens.css      Renk, tipografi, boşluk token'ları
```

## Yazı ekleme

Dosya yolu: `src/content/<koleksiyon>/<dil>/<slug>.md`
Slug: kebab-case, İngilizce, ASCII, tarih içermez.

Her koleksiyonda zorunlu frontmatter:

```yaml
title: string
description: string     # tek cümle; liste sayfalarında ve meta description'da kullanılır
pubDate: YYYY-MM-DD
topics: [...]           # TOPICS enum'undan en az bir tane
```

Opsiyonel: `updatedDate`, `draft` (varsayılan false), `tags: []`

Koleksiyona özel zorunlu alanlar:

| Koleksiyon | Ek alan |
|---|---|
| `essays` | `featured: boolean` (varsayılan false) |
| `notes` | `status`: seedling, budding veya evergreen (varsayılan seedling) |
| `playbooks` | `problem: string` ve `context: string` — ikisi de zorunlu |
| `signals` | `url: string` (geçerli URL) ve `source: string` — ikisi de zorunlu |

`playbooks` gövdesi şu başlıkları bu sırayla içermeli:
`## Problem`, `## Context`, `## Approach`, `## Tradeoffs`, `## When this stops working`

## Makine tarafı (otomatik üretiliyor, elle düzenleme)

| Yol | Ne |
|---|---|
| `/<koleksiyon>/<slug>.md` | Her yazının ham Markdown aynası |
| `/llms.txt` | Ajanlar için site özeti ve öne çıkan içerik |
| `/llms-full.txt` | Her dildeki her girdinin tam indeksi |
| `/rss.xml`, `/tr/rss.xml` | Besleme |
| `/sitemap-index.xml` | Sitemap (`.md` aynaları hariç) |
| JSON-LD | Her yazıda BlogPosting/TechArticle artı Person |

Yeni koleksiyon eklersen şu üretenleri de güncelle:
`src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`,
`src/pages/[collection]/[...slug].md.ts` ve Türkçe karşılığı.

## Kurallar

- `/notes/` klasörü (kökte) gitignore'da — kişisel araştırma notları, asla commit etme.
- `src/content/notes/` ise takip edilir. İkisini karıştırma.
- Tohum içerikler gövdesinde "Tohum içerik" uyarısı taşır; gerçek yazı
  eklenince silinmeli.
- Kod yorumları ve commit mesajları Türkçe. Site içeriği İngilizce veya Türkçe.

## Araç zinciri

`packageManager` alanı pnpm sürümünü sabitler — CI ve local aynı sürümü
kullanır. pnpm 10'a geçerken dikkat: build script onayı (`esbuild`, `sharp`)
artık `package.json` içindeki `pnpm.onlyBuiltDependencies` alanından değil,
`pnpm-workspace.yaml` içindeki `allowBuilds` alanından okunuyor. Sürümü
yükseltirken o dosyayı geri getir, yoksa CI `ERR_PNPM_IGNORED_BUILDS` ile durur.
