# Spark prompt — Indie Game Weekly

Canlı prompt Spark'ta; bu dosya kayıt ve düzeltme notu. Seri: `indie-postmortem`
(sitede "Indie Game Weekly"), dosya adı `Indie-Postmortem-PARSE-YYYY-MM-DD.md`,
haftalık. Eşleşme slug üzerinden (`indie-postmortem`), seri adı farklı olabilir.

## Frontmatter — site sözleşmesi

```yaml
title: "Indie Postmortem — <Oyun Adı>"     # canlı prompt'ta " — :" yazıyor, iki noktayı sil
date: YYYY-MM-DD
category: "oyun"                            # gamedev yazarsan kapı oyun'a çevirir
topics: ["<oyuna özgü 2-4: steam, godot, next-fest, regional-pricing, publisher…>"]
revenue_source: "<developer_blog | interview | estimated | unknown>"
summary: "<tek cümle, en fazla 25 kelime>"
generator: "Gemini Spark"
promptVersion: "v1"
```

Canlı prompt'tan farklar:

- `revenue_source` değerleri `estimated` ve `developer_blog` şemaya eklendi;
  künyede "Tahmin (yöntem yazıda)" / "Geliştirici yazısı" olarak çıkıyor.
  Boxleiter tahmini kullanıldıysa `estimated` ver; okur bunu künyede görür.
- `tags: ["indie-game", "postmortem", "steam", "marketing"]` her sayıda aynı —
  `indie-game` kategoriye çevrilip düşüyor, geri kalanı konu sayfası olarak
  anlamsızlaşıyor. `topics` olsun ve oyuna göre değişsin (motor, platform,
  festival, fiyat mekanizması).
- Kaynak gösterimi Solo bülteniyle aynı: `<sup><a href>1</a></sup>` + `## Kaynaklar`.
- Blockquote alıntı ve Türkçe sayı biçimi site tarafında sorun değil.

## Gövde (canlı prompt'taki 4 başlık, değişmedi)

Giriş (~150) · `## Lansman Anatomisi: <Oyun>` (~400-500) ·
`## Wishlist ve Dağıtım Mekaniği` (~350-400) · `## Ekonomi: Görünen ve Gerçek Tablo` (~350-400).
