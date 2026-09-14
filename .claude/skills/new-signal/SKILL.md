---
name: new-signal
description: Bir linki siteye "sinyal" olarak ekler — link-blog akışının hızlı yolu. Kullanıcı bir URL paylaşıp "bunu ekle", "sinyal yap", "signal olarak koy" dediğinde kullan.
allowed-tools: Read, Write, Edit, Bash, WebFetch
---

# Sinyal ekle

Sinyal = bir link ve neden önemli olduğu. **İki cümle, fazlası değil.**
Daha uzun bir şey söylemek gerekiyorsa bu bir sinyal değil, not veya yazıdır —
kullanıcıya söyle ve `new-entry` skill'ini öner.

## Adımlar

1. **Linki oku.** `WebFetch` ile sayfayı getir; başlık, yazar/yayıncı ve ana
   iddiayı çıkar. Sayfa alınamıyorsa kullanıcıdan özet iste, uydurma.

2. **Alanları belirle.**
   - `title` — sinyalin başlığı. Kaynağın başlığını kopyalama; senin ilgini
     çeken şeyi söyle. Örnek: kaynak "Building effective agents" ise başlık
     "Workflow mu agent mı" olabilir.
   - `url` — kanonik URL (takip/kampanya parametrelerini at).
   - `source` — yayıncı veya yazar. "Anthropic Engineering", "@simonw" gibi.
   - `description` — tek cümle, liste sayfasında görünür.
   - `topics` — `src/config.ts` içindeki TOPICS enum'undan. Uydurma.
   - `pubDate` — bugün. Tarihi `date +%F` ile al, tahmin etme.

3. **Dosyayı yaz:** `src/content/signals/en/<slug>.md`
   Slug kebab-case, İngilizce, ASCII, tarihsiz. Kullanıcı Türkçe yazmak
   isterse `tr/` altına koy.

```markdown
---
title: <başlık>
description: <tek cümle>
pubDate: <YYYY-MM-DD>
url: <kanonik url>
source: <yayıncı>
topics: [<enum değerleri>]
tags: []
---

<Kaynağın ne dediği ve neden önemli olduğu — iki cümle. Özet değil, yorum.
Katılmadığın bir yer varsa söyle; sinyali değerli kılan o.>
```

4. **`pnpm build` çalıştır.** Şema hatası varsa düzelt.

5. Kullanıcıya dosya yolunu ve iki cümlelik gövdeyi göster.

## Kurallar

- Gövde iki cümleyi aşarsa kes. Bu formatın tek kuralı bu.
- Kaynağın özetini yazma — kaynağın kendisi orada. Senin katkın yorum.
- `topics` enum dışında bir değer build'i patlatır.
