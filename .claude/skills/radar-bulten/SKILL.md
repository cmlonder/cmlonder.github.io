---
name: radar-bulten
description: cmlonder.com/radar bültenlerinin ortak sözleşmesi — Spark ajanı bir sayı yazarken, ya da bir bülten/prompt incelenirken kullanılır. Dosya adı, frontmatter, gövde ve kaynak kuralları; kapının (check-radar) neyi durdurup neyi düzelttiği; görülmüş hatalar. Beş seri onaylı; v1.0.
---

# Radar bülteni yazma sözleşmesi — v1.0 (21 Eyl 2026)

Bu dosya iki yerde yaşar: Spark'ta (bülteni yazan ajanın skill'i) ve bu
repoda (prompt ve bülten incelemesi). Seriye özgü ses ve gövde yapısı her
serinin kendi prompt'unda (`docs/spark-prompt*.md`); burada **hepsinde aynı
olan** kurallar var. Çelişirse bu dosya kazanır — kapı buna göre çalışır.

## 1. Zincir ve kapı

```
Spark → Drive kökü → Apps Script (08:00) → GitHub inbox/radar/<seri>/ → check-radar → site
```

Arada insan yok; yazdığın bayt sitede yayınlanır. `check-radar` ("kapı")
iki şey yapar: **durdurur** (frontmatter bozuk, alan eksik, seri bilinmiyor,
aynı konu ikinci kez) ya da **düzeltir** (tags→topics, ikiz konular, düz
`[1]` atıflar, kaynak listesi biçimi, ondalık puanlar, sürüm ekleri).
Düzeltiyor diye gevşeme: sözlükte olmayan hata düzelmez; kuyrukta kalan
dosyayı kimse görmez, bir sonraki sabah yeniden denenir.

## 2. Seriler

| Seri (slug) | Site adı | Dosya adı | `title:` | Kimlik (zorunlu) | Ek alan |
|---|---|---|---|---|---|
| `solo-founder` | Solo Girişimci Bülteni | `Solo-Girisimci-Bulteni-PARSE-YYYY-MM-DD.md` | `"Solo Girişimci Bülteni — <D Ay YYYY>"` | `subjects: [üç ürün]` | `category` (matris), `revenue_source` |
| `saas` | SaaS Bülteni | `SaaS-Bulteni-PARSE-YYYY-MM-DD.md` | `"SaaS Bülteni — <D Ay YYYY>"` | `subjects: [...]` | `revenue_source` |
| `github-radar` | GitHub Radar | `GitHub-Radar-PARSE-YYYY-MM-DD.md` | `"GitHub Radar — <Proje>"` | `repo: "owner/name"` | `health_score` |
| `indie-postmortem` | Indie Oyun Bülteni | `Indie-Oyun-Bulteni-PARSE-YYYY-MM-DD.md` | `"Indie Oyun Bülteni — <Oyun>"` | `game: "oyun-adi"` | `game_genre`, `revenue_source` |
| `paper-to-prod` | Makale Bülteni | `Makale-Bulteni-PARSE-YYYY-MM-DD.md` | `"Makale Bülteni — <Makale>"` | `arxiv: "2403.12345"` | `readiness_score` |

Dosya adı = seri adı (Türkçe harf ve büyük-küçük fark etmez, boşluk yerine
tire) + `-PARSE-` + bugünün tarihi. Kalıba uymayan dosyaya kimse dokunmaz.
Drive kökünde, `application/x-markdown`, klasöre taşıma yok, Google Doc'a
çevirme yok, tek dosya. `category` yalnız Solo'da (ürün türü matrisi);
diğer serilerde yazılmaz — seri sabiti bilgi taşımaz, kapı siler.

## 3. Frontmatter

```yaml
---
title: "<Seri adı> — <sayı adı>"        # çift tırnak; tarih yalnız Solo/SaaS başlığında
date: YYYY-MM-DD                          # tırnaksız, bugünün tarihi
topics: ["<2-4 konu>"]                    # tags DEĞİL; serinin havuzundan
summary: "<tek cümle, yüklemli, en fazla 25 kelime>"
generator: "Gemini Spark"
promptVersion: "<sürüm>"
# seriye göre (tablo):
subjects: ["urun-bir", "urun-iki"]        # küçük harf, tire
repo: "owner/name"
game: "oyun-adi"
arxiv: "2403.12345"                       # sürümsüz, "arXiv:" öneksiz
category: "<matristen>"                   # yalnız Solo
revenue_source: "<platform | interview | self_reported | developer_blog | estimated | unknown>"
health_score: 7.5                         # tırnaksız sayı, 0-10
readiness_score: 6.5                      # tırnaksız sayı, 0-10
game_genre: "Roguelike"                   # İngilizce, kısa
---
```

Kurallar: `---` tam üç tire, öncesi sonrası boşluk yok; her alan kendi
satırında. `title` ve `summary` çift tırnak (Türkçe kesme işareti tek
tırnaklı YAML'ı bozuyor). Listede olmayan alan ekleme. Puanlar tırnaksız
sayı, ondalık serbest.

**Kimlik alanı tekrar seçimi engeller.** Ajanın hafızası yoktur; "aynı
konuyu seçme" kuralı prompt'ta değil kapıda yaşar: kimlik değeri seride
(Solo ve SaaS için iki seride birden) daha önce yayınlandıysa dosya kuyrukta
kalır. Boş bırakılamaz.

**Konular:** küçük harf, kebab-case, serinin sabit havuzundan; kategoriyle
aynı kelimeyi tekrar etme. İngilizce/Türkçe ikiz yazma (`devtool` değil
`tools`, `chrome-extension` değil `eklenti`). Her sayıda aynı olan etiket
(`github`, `postmortem`, `indie-game`, `engineering`) konu değildir, kapı
düşürür. Eşleşen takma adlar: `solo-founder`/`solo-dev`/`bootstrapped` →
`solo-company`, `ai-integration`/`ai` → `ai-news`, `architecture` →
`solution-architecture`, `steam-next-fest` → `next-fest`.

## 4. Gövde

- **Giriş başlıksız**, ilk cümle konunun adıyla başlar. "Bugün X'i
  inceliyoruz", "Trending listesi yine…" gibi ısınma yok.
- **Girişin son paragrafı üç kalın rakam** taşır (serinin prompt'unda hangi
  üçü olduğu yazar). Rakam yoksa "rakam yok" yazılır, uydurulmaz.
- Başlıklar yalnız `##`; `#` hiç yok; serinin prompt'undaki adlar ve sıra;
  son `##` her zaman `Kaynaklar`.
- Madde işareti yalnız `## Kaynaklar` altında. Etiket satırı (`**Durum:** x`)
  yok. Ayrı "Sonuç"/"Karşılaştırma"/"Çıkarım" bölümü yok; çıkarım okura kalır.
- Kalın: paragraf başına en fazla üç; rakam, yüzde, teknoloji adı.
- Sayılar Türkçe: `6.441 dolar`, `2,5 milyon`, `%30`, `17 bin`.
- Teknik terim orijinal (compute, latency, wishlist, churn); zorlama çeviri yok.
- Kelime tavanı serinin prompt'unda; aşma.
- Kurucu/geliştirici/yazar alıntısı: `>` blok alıntı, birebir, çevirisiz,
  düzeltmesiz; bağlamı Türkçe.
- LLM gevezeliği yok: "gözler önüne seriyor", "derinlemesine incelendiğinde",
  "şüphesiz ki", "devrim niteliğinde", "büyüleyici", "önümüze koyuyor".
  İç kontrol metni ("Kategori Uygunluk Testi") yazıya girmez.

## 5. Kaynaklar

- Cümle içinde: `<sup><a href="https://tam-url">3</a></sup>`, noktadan önce.
  Düz `[3]`, bağlantısız `<sup>3</sup>` yazma.
- Sonda `## Kaynaklar`, sıralı liste: `3. [Kaynağın ne olduğu](https://tam-url)`.
  URL'siz satır geçersiz. Numaralar gövdeyle eş.
- Aynı yazının/alan adının kopyaları ayrı kaynak sayılmaz. Arama motoru
  bağlantısı yasak. Tahmin edilmiş URL yasak.

## 6. Dürüstlük

- Kaynakta olmayan rakam yazılmaz. Tahminse cümlede "tahmin" der, yöntemi
  yazar (`Boxleiter: yorum × 30`), `revenue_source: estimated`.
- "Doğrulandı", "teyit edildi" yazılmaz — doğrulamayı site yapar.
- Teyit edemedin: "…ama bunu ikinci bir kaynakta bulamadım." Rakam eski:
  "Ağustos 2025'teki son açıklanan rakam…". Portföy toplamı: söyle.
  Güncel kaynak yoksa "hâlâ ayakta" deme.
- **Emniyet sübabı:** kaynak, kod, PR, alıntı ya da rakam bulamıyorsan
  uydurma; vakayı değiştir ya da kuralı gevşet (4 kaynak yerine 2) ve bunu
  yazıda söyle. Doğruluk, kural setinden önemli.

## 7. Görülmüş hatalar (hepsi yaşandı)

| Hata | Sonuç | Kural |
|---|---|---|
| `health_score: "9.2"` (şema tam sayı) | sayı işlenemedi | puan tırnaksız sayı, ondalık serbest |
| Kaynaklar `[1] https://…` düz satır | tek paragrafa katlandı | sıralı liste, markdown bağlantı |
| Gövdede düz `[1]` | tıklanamaz atıf | `<sup><a href>` |
| `tags:` yazıldı, şema `topics` | 21 bültenin etiketi hiç okunmadı | `topics` |
| `category: github-radar` / `applied-research` | seri adının tekrarı | ürün türü değilse kategori yazma |
| Her sayıda aynı `tags` | konu sayfaları anlamsız | konuya özgü, değişen konular |
| `title: "Github Radar — : TigerBeetle"` | başlıkta " — :" | `<Seri> — <Ad>` |
| `Haftalik-…-PARSE` dosya adı, seri adı değişti | eşleşmedi, kuyrukta kaldı | dosya adı = güncel seri adı |
| "profilden çekildi" diyen 404 adres, Google arama linki | yanlış kaynak | URL uydurma; arama linki yasak |
| `BuiltWith'in` tek tırnaklı YAML | frontmatter bozuldu | çift tırnak |
| Aynı şirket 4 kaynak gibi | sahte kaynak zenginliği | alan adı başına bir kaynak |
| Prompt işlenmiş görünümden kopyalandı | `---`, `##`, `<sup>` yutuldu | prompt'u `docs/spark-prompt*.md`'den ham kopyala |

## 8. Seriye özgü (prompt'ta yaşar; burada yalnız işaret)

- **Solo Girişimci** (v14.2): DD%10 kategori matrisi; üç vaka (AI öncesi /
  AI çağı / ulaşılabilir olan); her vakada blok alıntı; ilk iki vakada ≥4
  alan adı; 1.000–1.200 kelime.
- **SaaS** (v2.1): tek ana hikâye/pattern; Günün Hikâyesi / Dağıtım / Para /
  AI'ın Gerçekten Değiştirdiği Şey; `subjects` Solo ile çapraz; 800–1.000.
- **GitHub Radar** (v2.1): tek proje; Mimari Deep-Dive / Kod ve Topluluk
  Sağlığı / Production Riski; `health_score` Sağlık bölümünden; 800–1.000.
- **Indie Oyun** (v2.2): Lansman Anatomisi / Wishlist ve Dağıtım Mekaniği /
  Ekonomi; Boxleiter tahmini → `estimated`; `game_genre`; 800–1.000.
- **Makale** (v1.4): İddia ve Gerçeklik / Kod ve Entegrasyon Haritası /
  Ticari Etki; `arxiv` sürümsüz; `readiness_score`; 800–1.000.

## 9. Son kontrol (yazmadan önce, yazıya koymadan)

- Frontmatter geçerli YAML, `---` üç tire, her alan kendi satırında?
- `title` kalıbı, `date` bugün, `topics` (tags değil), kimlik alanı dolu?
- Dosya adı `<Seri>-PARSE-YYYY-MM-DD.md`, Drive kökü, tek dosya?
- Giriş başlıksız ve ilk cümle konu adıyla; üç kalın rakam; `##` başlıklar
  tam adıyla; son `##` Kaynaklar?
- Her `<sup>` içinde `<a href>`; Kaynaklar'da her satırda URL; numaralar eş?
- Uydurulmuş rakam/URL/alıntı yok; tahminler "tahmin" diyor?
- Madde işareti yalnız Kaynaklar'da; etiket satırı yok; klişe yok?
- Kelime sayısı serinin tavanında?
