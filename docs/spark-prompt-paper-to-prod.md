# Spark prompt — Makale Bülteni (Paper-to-Prod)

Canlı prompt Spark'ta; bu dosya kayıt ve düzeltme notu. Seri: `paper-to-prod`,
site adı "Makale Bülteni", dosya adı `Makale-Bulteni-PARSE-YYYY-MM-DD.md`, günlük.

## Frontmatter — site sözleşmesi

```yaml
title: "Makale Bülteni — <Makalenin kısa/popüler adı>"
date: YYYY-MM-DD
topics: ["<havuzdan 2-3: latency, memory, compute, architecture, open-source, benchmark, gpu, kernel, vllm, systems, deployment>"]
readiness_score: 7                  # 0-10, ondalık olabilir; künyede "Hazırlık 7/10"
summary: "<tek cümle, mühendislik açısından önemi>"
generator: "Gemini Spark"
promptVersion: "v1.2-daily-deterministic"
```

Canlı prompt'tan farklar:

- `title` sitedeki kalıpla aynı olsun: seri adı + uzun tire + makale adı. Tarih
  başlığa girmez; `date` alanı zaten var ve künyede görünüyor.
- `category: "applied-research"` **yazma** — sabit, bilgi taşımıyor; kapı siliyor.
- `tags` yerine `topics`. Sabit havuz fikri doğru (deterministik); havuzdaki
  `architecture` sitede `solution-architecture` olarak eşleşir, `systems`
  sitedeki mevcut konuya düşer.
- Kaynak gösterimi diğer serilerle aynı: `<sup><a href="URL">1</a></sup>` +
  `## Kaynaklar`; kapı düz `[1]` yazımını da çeviriyor.

## Gövde (canlı prompt'taki 4 başlık, değişmedi)

Giriş (~150) · `## İddia ve Gerçeklik: <Makale>` (~250-300) ·
`## Kod ve Entegrasyon Haritası` (~250-300) · `## Ticari Etki: Kimin İşine Yarar?` (~200-250).
"Uydurma yok" emniyet sübabı canlı prompt'ta; doğrulama tablosu (`verify:radar`)
bu seride de çalışır.
