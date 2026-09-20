---
name: radar-bulten
description: cmlonder.com/radar bültenlerinin ortak sözleşmesi — Spark ajanı bir sayı yazarken, ya da bir bülten/prompt incelenirken kullanılır. Dosya adı, frontmatter, gövde ve kaynak kuralları; kapının (check-radar) neyi durdurup neyi düzelttiği; görülmüş hatalar.
---

# Radar bülteni yazma sözleşmesi — v0.3 (taslak, olgunlaşıyor)

Bu skill iki yerde yaşar: Spark'ta (bülteni yazan ajan) ve bu repoda
(prompt ve bülten incelemesi). Seriye özgü ses ve gövde yapısı her serinin
kendi prompt'unda; burada **hepsinde aynı olan** kurallar var. Çelişirse bu
dosya kazanır — kapı bu dosyaya göre çalışıyor.

## 1. Zincir ve kapı

```
Spark → Drive kökü → Apps Script (08:00) → GitHub inbox/radar/<seri>/ → check-radar → site
```

Arada insan yok. Yazdığın bayt sitede yayınlanır. `check-radar` ("kapı") iki
şey yapar: **durdurur** (frontmatter bozuk, alan eksik, seri bilinmiyor, aynı
konu ikinci kez) ya da **düzeltir** (tags→topics, ikiz konular, düz `[1]`
atıflar, kaynak listesi biçimi, ondalık puanlar). Düzeltiyor diye gevşeme:
sözlükte olmayan hata düzelmez, kuyrukta kalan dosyayı kimse görmez.

## 2. Seriler

| Seri (slug) | Site adı | Dosya adı | `title:` | Kimlik alanı |
|---|---|---|---|---|
| `solo-founder` | Solo Girişimci Bülteni | `Solo-Girisimci-Bulteni-PARSE-YYYY-MM-DD.md` | `"Solo Girişimci Bülteni — <D Ay YYYY>"` | `subjects: [üç ürün]` |
| `saas` | SaaS Bülteni | `SaaS-Bulteni-PARSE-YYYY-MM-DD.md` | `"SaaS Bülteni — <D Ay YYYY>"` | `subjects: [...]` |
| `github-radar` | GitHub Radar | `GitHub-Radar-PARSE-YYYY-MM-DD.md` | `"GitHub Radar — <Proje>"` | `repo: "owner/name"` |
| `indie-postmortem` | Indie Oyun Bülteni | `Indie-Oyun-Bulteni-PARSE-YYYY-MM-DD.md` | `"Indie Oyun Bülteni — <Oyun>"` | `game: "oyun-adi"` |
| `paper-to-prod` | Makale Bülteni | `Makale-Bulteni-PARSE-YYYY-MM-DD.md` | `"Makale Bülteni — <Makale>"` | `arxiv: "2403.12345"` |

Dosya adı = seri adı (Türkçe harf ve büyük-küçük fark etmez, boşluk yerine
tire) + `-PARSE-` + bugünün tarihi. Kalıba uymayan dosyaya kimse dokunmaz.
Drive kökünde, `application/x-markdown`, klasöre taşıma yok, Google Doc'a
çevirme yok, tek dosya.

## 3. Frontmatter

```yaml
---
title: "<Seri adı> — <sayı adı>"        # çift tırnak; tarih başlığa yalnız günlük serilerde girer
date: YYYY-MM-DD                          # tırnaksız, bugünün tarihi
topics: ["<2-4 konu>"]                    # tags DEĞİL
summary: "<tek cümle, yüklemli, en fazla 25 kelime>"
generator: "Gemini Spark"
promptVersion: "<sürüm>"
# seriye göre:
category: "<ürün türü>"                   # yalnız Solo/SaaS; matristen. GitHub/Indie/Makale YAZMAZ
revenue_source: "<platform | interview | self_reported | developer_blog | estimated | unknown>"
health_score: 7.5                         # GitHub; tırnaksız sayı, 0-10
readiness_score: 6.5                      # Makale; tırnaksız sayı, 0-10
arxiv: "2403.12345"                       # Makale; sürümsüz, "arXiv:" öneksiz
repo: "owner/name"                        # GitHub
game: "oyun-adi"                          # Indie; küçük harf, tire
subjects: ["urun-bir", "urun-iki"]        # Solo/SaaS; her vaka için ürün adı, küçük harf, tire
---
```

Kurallar: `---` tam üç tire, öncesi sonrası boşluk yok. `title` ve `summary`
çift tırnak (Türkçe kesme işareti tek tırnaklı YAML'ı bozuyor). Listede
olmayan alan ekleme. Puanlar tırnaksız sayı; ondalık serbest.

**Kimlik alanı tekrar seçimi engeller.** Ajanın hafızası yoktur; "son 30 gün
aynı konuyu seçme" kuralı prompt'ta değil kapıda yaşar: kimlik değeri seride
daha önce yayınlandıysa dosya kuyrukta kalır. Kimlik değeri her sayıda dolu
olsun; boşsa denetlenemez.

**Konular:** küçük harf, kebab-case, kategoriyle aynı kelimeyi tekrar etme.
Önce mevcut sözlükten: `b2b`, `tools`, `bulten`, `dizin`, `sablon`, `ajans`,
`pricing`, `analytics`, `open-core`, `ai-agents`, `solo-company`, `design`,
`automation`, `hizmet-urunu`, `bilgi-urunu`, `steam`, `postmortem`,
`latency`, `memory`, `compute`, `gpu`, `kernel`, `vllm`, `systems`,
`deployment`, `inference`, `quantization`, `database`, `cryptography`, `edge`.
İngilizce/Türkçe ikiz yazma (`devtool` değil `tools`, `chrome-extension`
değil `eklenti`, `indie-game` değil kategori `oyun`). Her sayıda aynı olan
etiket (`github`, `engineering`, `open-source` her sayıda) konu değildir.

## 4. Gövde

- **Giriş başlıksız**, ilk cümle konunun adıyla başlar. "Bu hafta X'i
  inceliyoruz", "Trending listesi yine…" gibi ısınma yok.
- **Girişin son paragrafı üç kalın rakam** taşır (serinin en önemli üç
  sayısı). Rakam yoksa "rakam yok" yazılır, uydurulmaz.
- Başlıklar yalnız `##`; `#` hiç yok; serinin prompt'undaki adlar ve sıra;
  son `##` her zaman `Kaynaklar`.
- Madde işareti yalnız `## Kaynaklar` altında. Etiket satırı (`**Durum:** x`)
  yok. "Sonuç" / "Karşılaştırma" / "Çıkarım" diye ayrı bölüm yok; çıkarım
  okura kalır.
- Kalın: paragraf başına en fazla üç; rakam, yüzde, teknoloji adı.
- Sayılar Türkçe: `6.441 dolar`, `2,5 milyon`, `%30`, `17 bin`.
- Teknik terim orijinal (compute, latency, wishlist, churn); zorlama çeviri yok.
- Kelime tavanı serinin prompt'unda; aşma.
- LLM gevezeliği yok: "gözler önüne seriyor", "derinlemesine incelendiğinde",
  "şüphesiz ki", "devrim niteliğinde", "büyüleyici", "önümüze koyuyor".
  "Kategori Uygunluk Testi" gibi iç kontrol metni yazıya girmez.

## 5. Kaynaklar

- Cümle içinde: `<sup><a href="https://tam-url">3</a></sup>`, noktadan önce.
  Düz `[3]`, bağlantısız `<sup>3</sup>` yazma (kapı çevirir ama sözleşme bu).
- Sonda `## Kaynaklar`, sıralı liste: `3. [Kaynağın ne olduğu](https://tam-url)`.
  Adı olup URL'si olmayan satır geçersiz. Numaralar gövdeyle aynı.
- Aynı yazının/aynı alan adının kopyaları ayrı kaynak sayılmaz. Arama
  motoru bağlantısı (`google.com/search?…`) yasak. Tahmin edilmiş URL yasak.
- Kurucu/yazar alıntısı varsa `>` blok alıntı, birebir, çevirisiz,
  düzeltmesiz; bağlamı Türkçe açıklanır.

## 6. Dürüstlük

- Kaynakta olmayan rakam yazılmaz. Tahminse cümlede "tahmin" der, yöntemi
  yazar (`Boxleiter: yorum × 30`), frontmatter'da `revenue_source: estimated`.
- "Doğrulandı", "teyit edildi" yazılmaz — doğrulamayı site yapar.
- Teyit edemedin: "…ama bunu ikinci bir kaynakta bulamadım." Rakam eski:
  "Ağustos 2025'teki son açıklanan rakam…". Portföy toplamı: söyle.
- Güncel kaynak yoksa "hâlâ ayakta" deme.
- **Emniyet sübabı:** kaynak, kod, PR, alıntı ya da rakam bulamıyorsan
  uydurma; vakayı değiştir ya da kuralı gevşet (4 kaynak yerine 2) ve bunu
  yazıda söyle. Doğruluk, kural setinden önemli.

## 7. Görülmüş hatalar (hepsi yaşandı)

| Hata | Sonuç | Kural |
|---|---|---|
| `health_score: "9.2"` (şema tam sayı) | sayı işlenemedi, sonra şema gevşetildi | puan tırnaksız sayı, ondalık serbest |
| Kaynaklar `[1] https://…` düz satır | tek paragrafa katlandı | sıralı liste, markdown bağlantı |
| Gövdede düz `[1]` | tıklanamaz atıf | `<sup><a href>` |
| `tags:` yazıldı, şema `topics` | 21 bültenin etiketi hiç okunmadı | `topics` |
| `category: github-radar` | seri adının tekrarı | ürün türü değilse kategori yazma |
| `tags: ["architecture","open-source","github","engineering"]` her sayıda | konu sayfaları anlamsız | konuya özgü, değişen konular |
| `title: "Github Radar — : TigerBeetle"` | başlıkta " — :" | `<Seri> — <Ad>` |
| `Haftalik-…-PARSE` dosya adı, seri adı değişti | eşleşmedi, kuyrukta kaldı | dosya adı = güncel seri adı |
| "profilden çekildi" diyen 404 adres, Google arama linki | yanlış kaynak | URL uydurma; arama linki yasak |
| `BuiltWith'in` tek tırnaklı YAML | frontmatter bozuldu | çift tırnak |
| Aynı şirket 4 kaynak gibi | sahte kaynak zenginliği | alan adı başına bir kaynak |

## 8. Seriye özgü olanlar (prompt'ta yaşar, burada yalnız işaret)

- **Solo Girişimci** (onaylı v14.2): günün kategorisi DD%10 matrisi; üç vaka
  (AI öncesi / AI çağı / ulaşılabilir olan); her vakada kurucunun birebir
  blok alıntısı; ilk iki vakada ≥4 alan adı, üçüncüde ≥2; 1.000–1.200 kelime.
- **Makale** (onaylı v1.4): `arxiv` zorunlu; sabit konu havuzu; giriş +
  İddia ve Gerçeklik / Kod ve Entegrasyon Haritası / Ticari Etki; 800–1.000.
- **GitHub Radar**, **Indie Oyun**, **SaaS**: inceleme sırada.

Prompt'u Spark'a **ham metin** olarak yapıştır: işlenmiş görünümden kopya
`---`, `##` ve kod çitlerini düşürüyor (iki kez yaşandı).

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
