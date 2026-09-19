# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Birincil kullanıcı sitenin sahibi: Cemal Önder, çözüm mimarı. Site önce
onun kendi düşüncesini yazarak netleştirdiği ve ajanlı yayın hattını
denediği yer; okurlar bunun yan ürünü. (Görüşme, 19 Eyl 2026.)

İkincil okurlar — onaylanmış sıra yok, kayıt olarak: meslektaş
mühendisler/mimarlar; nasıl çalıştığını görmek isteyen işveren, müşteri
veya ortak; ve makine okurları (llms.txt, .md aynaları, JSON-LD).

## Product Purpose

Kişisel site ve digital garden. Astro, statik, GitHub Pages, iki dil
(en kökte, tr `/tr/` altında). Başarı ölçüsü tek: bir yıl sonra yer
tutucular gitmiş, sahibinin kendi sesiyle yazılmış gerçek bir külliyat
birikmiş olmalı. Trafik, iş teklifi veya ürün vitrini başarı ölçüsü
DEĞİL (görüşmede seçilmedi).

## Positioning

- İçerik tipi = olgunluk seviyesi, konu değil: essays (bitmiş argüman),
  notes (sesli düşünme), playbooks (tekrarlanabilir karar), signals
  (link + iki cümle). Raflar (library/films/games), domains/chapters,
  projects ayrı.
- Dürüst makine kaynağı: ajan ürettiği her şey işaretli. Radar
  (`/radar`) makine üretimi ayrı bölge; ana RSS'e ve anasayfa ızgarasına
  karışmaz; iddialar `verify:radar` ile doğrulanır, doğrulanamayan
  silinmez, işaretlenir.
- Ajanlara birinci sınıf yüzey: içerik repoda düz Markdown, kurallar
  AGENTS.md'de, yazı ekleme bir skill.

## Operating Context

Sahip Claude Code ile terminalde çalışıyor; içerik `src/content/<koleksiyon>/<dil>/<slug>.md`.
Yayın: `pnpm verify` (build + tip + kırık link + başlık hiyerarşisi + UI
DOM testi + konu sağlığı) → main'e push → GitHub Actions deploy.
Radar hattı: Gemini Spark → Drive ana dizini → Apps Script → `inbox/radar/`
→ workflow → site. Sahibin yazı sesi `~/.claude/skills/cemal-writing-voice`
skill'inde tanımlı (Türkçe akış + İngilizce teknik terim, sayı yoksa
cümle yok, eksik olanı saklama).

## Capabilities and Constraints

- Tek sınıflandırma ekseni: `topics` (serbest metin; altı ana konu
  `TOPICS`'te). `tags` yok. Konu sayfaları raf girdilerini de listeler.
- Renk yalnızca `src/styles/tokens.css`; açık ve koyu tema; gövde
  kontrastı ≥4.5:1. MDX yok; açıklayıcılar ve slaytlar düz HTML/markdown.
- `@astrojs/markdown-satteri` doğrudan bağımlılık, astro ile aynı sürümde
  kalmalı. TypeScript 6'da sabit.
- Çeviri opsiyonel; aynı slug iki dilde varsa bağlanır.
- Kenar notları standart markdown dipnotu; içindekiler build'de
  başlıklardan.
- Açık kararlar: `/digest` skill'inin gerekliliği; radar'daki geriye
  dönük üretimin isteniyor olup olmadığı.

## Brand Commitments

- Ad: Cemal Önder. Alan: cmlonder.com.
- Hub adı bağlayıcı: "Bahçe" (tr) / "The Garden" (en) — digital garden
  göndermesi (görüşme, 19 Eyl 2026).
- Ses: kendi sesi; ajan çıktısı sahibin sesi gibi sunulmaz.

## Evidence on Hand

Gerçek: radar boru hattı ve bültenleri, projeler (cmlonder-com,
radar-pipeline, spark-prompt-contract; RewindBPF ve RIGGED hackathon
işleri), havacılık bölümü `mail-contracts-to-sabre` (NotebookLM
brifinginden, künyeli), `/work` mesleki geçmiş, `watch-replicas-stop-helping`.
Yer tutucu: 128 girdi `placeholder: true` taşıyor (raf 68, görüş metni
40, signal yorumu 12, dummy bölüm 8) — gerçek gibi sunulmaz. Anasayfada
taslak uyarısı var. Referans, müşteri, ölçüm iddiası yok; uydurulmaz.

## Product Principles

1. Eksik olanı sakla­ma: yer tutucu, makine kaynağı ve doğrulanamayan
   iddia görünür işaretlenir.
2. Yerleşim ve davranış her ekranda aynı çalışmalı; süs, okuma ölçüsünü
   ve sakinliği bozamaz.
3. Yapı anlam taşır: koleksiyon = olgunluk, konu = tek eksen, radar =
   ayrı bölge.
4. İnsan ve makine aynı kaynağı okur: Markdown, .md aynaları, llms.txt.
5. Sahibin sesi ölçüt; ajan üretimi sahibin sesinin yerine geçmez.
