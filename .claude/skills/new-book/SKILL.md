---
name: new-book
description: Okuma listesine kitap ekler. Kullanıcı bir kitaptan bahsedip "listeye ekle", "kitaplığa koy", "bunu okudum" dediğinde kullan.
allowed-tools: Read, Write, Edit, Bash, Glob, WebFetch
---

# Kitaplığa kitap ekle

Kitaplık bir okuma listesi değil, bir **tavsiye listesi**. Okunmuş ama tavsiye
edilmeyen kitap buraya girmez — kullanıcı emin değilse sor.

## Adımlar

1. **Kitabı doğrula.** Yazar adı ve yayın yılı konusunda emin değilsen
   `WebFetch` ile kontrol et. **Yıl ve yazar uydurma** — yanlış bibliyografik
   veri sitenin güvenilirliğini düşürür. Doğrulayamazsan `year` alanını boş bırak.

2. **Notu yaz.** Tek cümle: *neden bu listede*. Kitabın özeti değil, kullanıcı
   üzerindeki etkisi. Kullanıcı kendi cümlesini söylediyse onu kullan, düzeltme.

   İyi: "Mimari diyagramı okuma şeklimi herhangi bir mimari kitabından daha çok değiştirdi."
   Kötü: "Sistem düşüncesinin temellerini anlatan klasik bir eser."

3. **Sırayı belirle.** `order` alanı küçükten büyüğe sıralanır. Yeni kitap
   genelde sona gider: mevcut en büyük `order` + 1.
   ```bash
   grep -h '^order:' src/content/library/en/*.md | sort -t' ' -k2 -n | tail -1
   ```

4. **Dosyayı yaz:** `src/content/library/en/<slug>.md`
   Slug kebab-case, kitabın İngilizce adından, ASCII.

```markdown
---
title: '<kitap adı>'
author: '<yazar>'
year: <yıl>
note: '<tek cümle: neden bu listede>'
order: <sayı>
---
```

   Opsiyonel `url`: kitabın resmî sayfası veya yayıncısı. Affiliate link koyma.
   Verilirse kapak tıklanabilir olur.

5. **`pnpm verify` çalıştır.** Build ve kırık link kontrolü birlikte koşar.

## Notlar

- Kapak görseli yok ve olmayacak — kapaklar başlıktan tipografik üretiliyor.
  Kitap kapağı indirip koyma.
- Türkçe kitaplık ayrı tutulmuyor; `tr/` boşsa site İngilizce listeyi gösterir.
  Türkçe bir kitap eklenecekse `src/content/library/tr/` altına konur ama o
  zaman **tüm liste** Türkçe doldurulmalı, yoksa yarım görünür.
- `title` ve `author` tek tırnak içinde yazılmalı — kitap adlarında sık sık
  iki nokta ve tırnak geçiyor, YAML bozuluyor.
