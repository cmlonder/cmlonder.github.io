# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Sahibi: Cemal Önder, çözüm mimarı. Site onun düşüncesini yazarak
netleştirdiği ve ajanlı yayın hattını denediği yer; ama yalnız kendisi için
değil — dışarıya açık bir yüz (21 Eyl 2026).

Okurlar, önem sırasıyla:
1. Meslektaş mühendisler ve mimarlar — topluluk buradan oluşur.
2. İşveren, müşteri ve ortak adayları — "bu adam nasıl çalışıyor" sorusunu
   sitede cevaplayıp iş teklifi ya da müşteri olarak gelirler.
3. Radar okurları — küçük internet pazarlarını izleyen kurucular; ödeme
   yapabilecek kitle.
4. Makine okurları (llms.txt, .md aynaları, JSON-LD, ajanlar).

## Product Purpose

Kişisel site ve digital garden. Astro, statik, GitHub Pages, iki dil
(en kökte, tr `/tr/` altında).

Amaç (21 Eyl 2026): site üzerinden bir topluluk oluşturmak, iş teklifi
almak, yapılan işlere müşteri bulmak ve mümkünse siteden gelir elde etmek.
Başarı bu dört şeyin gerçekleşmesiyle ölçülür; kendi sesiyle yazılmış
gerçek yazılar bunun aracı, kendisi değil.

Bundan çıkan öncelikler: alan kitapları ve denemeler (yetkinliğin kanıtı,
İngilizce), radar ve doğrulama defteri (topluluk ve olası gelir, Türkçe),
abonelik ve iletişim yolları (topluluk ve teklifler için kapı).

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

Gerçek: radar boru hattı ve bültenleri, projeler (RewindBPF ve RIGGED
hackathon işleri; cmlonder-com, radar-pipeline ve spark-prompt-contract
sayfaları 21 Eyl 2026'da kaldırıldı), havacılık bölümü `mail-contracts-to-sabre` (NotebookLM
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
