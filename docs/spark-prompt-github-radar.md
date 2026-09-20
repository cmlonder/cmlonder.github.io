# Spark prompt — Haftalık GitHub Radar

Canlı prompt Spark'ta; bu dosya kayıt ve düzeltme notu. Seri: `github-radar`,
dosya adı `Haftalik-Github-Radar-PARSE-YYYY-MM-DD.md`, her cumartesi.
Apps Script pazar 08:00'de alır (aynı gün istersen `kur()`'daki saati değiştir).

## Frontmatter — site sözleşmesi

```yaml
title: "GitHub Radar — <Proje Adı>"        # canlı prompt'ta " — :" yazıyor, iki noktayı sil
date: YYYY-MM-DD
topics: ["<projeye özgü 2-4 konu: rust, ebpf, database, cli, networking, observability…">"]
health_score: 7                             # 1-10 tam sayı, tırnaksız
summary: "<tek cümle, projenin temel mimari farkı>"
generator: "Gemini Spark"
promptVersion: "v1"
```

Canlı prompt'tan farklar ve neden:

- `category: "github-radar"` **yazma.** Kategori ürün türü ekseni; seri adının
  tekrarı bilgi taşımıyor. Yazarsan giriş kapısı siliyor.
- `tags: ["architecture", "open-source", "github", "engineering"]` **her sayıda
  aynı** — konu sayfaları anlamsızlaşır. `topics` olsun ve projeye göre değişsin
  (dil, alan, katman). `github` ve `engineering` giriş kapısında düşüyor,
  `architecture` -> `solution-architecture`'a bağlanıyor; ama asıl istenen
  projeye özgü konu.
- Kaynak gösterimi Solo bülteniyle aynı: cümle içinde `<sup><a href>1</a></sup>`,
  sonda `## Kaynaklar`. Site köşeli parantezle `[1]` gösteriyor.

## Gövde (canlı prompt'taki 4 başlık, değişmedi)

1. Giriş (~150 kelime) — proje ve neden gürültüden sıyrıldığı, "X için Y".
2. `## Mimari Deep-Dive: <Proje>` (~400-500) — nasıl yaptığı: dil, bellek,
   eşzamanlılık, sistem çağrıları, eBPF/COW/veri yapısı.
3. `## Kod ve Topluluk Sağlığı` (~250-300) — bakımcı ekibi, issue kalitesi,
   yol haritası; `health_score` buradan çıkar.
4. `## Production Riski: Gerçekten Kullanılır mı?` (~200-250) — ne zaman
   kurtarır, ne zaman patlatır; lisans ve lock-in.

Anti-klişe kalkanı ve "uydurma yok" kuralı canlı prompt'ta; siteye giren
metin bunları aşarsa düzeltme yeri prompt, giriş kapısı değil.
