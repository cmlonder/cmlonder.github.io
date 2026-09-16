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

Ayrıca `library` var: okuma listesi. Diğerlerinden farklı — tarihi, konusu ve
kendi yazı sayfası yok. Sadece anasayfada ve `/library`'de kart olarak görünür.
Alanları: `title`, `author`, `year`, `note` (tek cümle), `url`, `order`.

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

## Radar — makine üretimi bölge

`/radar` diğer koleksiyonlardan **kategorik olarak farklı**: metni bir ajan
yazıyor. Bu yüzden kardeş bir bölüm değil, ayrı bir bölge — ana RSS'e karışmaz,
anasayfa ızgarasında durmaz, kendi beslemesi vardır.

**Ajanın kendi güven beyanına güvenilmez.** Çıktı yalnızca iddia + kaynak URL +
kaynak tarihi içerir; kararı `scripts/verify-radar.mjs` verir:

```bash
pnpm verify:radar    # her kaynağı çeker, beklenen değer metinde mi diye bakar
```

Sonuç `src/data/radar-verification.json`'a yazılır, sayfa oradan okur.
Doğrulanamayan iddialar **silinmez** — gövdeden önce ayrı bir kutuda listelenir.

Neden böyle: ajan URL çekemiyor. Çekemediği bir sayfanın adresini tahmin edip
Google arama linkine sarıp "profilden çekildi" dediği gözlendi. Bu bir talimat
sorunu değil, yetenek sınırı. Detay: `/ai` sayfası.

### Yeni bülten ekleme

```bash
pnpm radar <spark-ciktisi.txt>   # ayrıştır -> src/content/radar/<tarih>.md
pnpm verify:radar                 # her kaynağı çek, iddiayı test et
pnpm verify                       # build + tip + link
```

**Frontmatter'ı elle yazma.** `parse-radar.mjs` yazıyor, çünkü Türkçe kesme
işareti (`BuiltWith'in`) elle tırnaklanan YAML'ı bozuyor — bu hata hem ajanda
hem bu repoda ayrı ayrı gerçekleşti.

Ajanın sözleşmesi: iki çitli blok, arada serbest metin.

````
```radar
date: 2026-09-16
title: ...
summary: ...
```

... gövde ...

```claims
iddia | url | tarih | tür | aranacak
Pieter Levels ~3M $ ARR | https://... | 2025-10-29 | İkincil analiz | 3M
Post Bridge 55.175 $ MRR |  |  | TrustMRR — derin link yok |
```
````

`aranacak` = kaynak metninde aranacak değer. Boşsa kapı doğrulayamaz.

Ayrıştırıcı **sessizce devam etmez**: blok eksikse, alan sayısı tutmazsa,
URL geçersizse veya Google arama linkiyse durur. Yarım ayrıştırıp yanlış veri
üretmektense hata vermeyi tercih eder.

## Ne nereye yazılır

Editoryal rehber **[WRITING.md](./WRITING.md)** içinde: hangi içerik hangi
bölüme ait, başlık nasıl atılır, ne yazılmaz. Bir girdi eklerken oradaki
tanımlara uy — özellikle `signals` iki cümle, `playbooks` son başlığı atlamaz,
`notes` emin olmadığını söyler.

## Sahibinin yapacakları

Marka kararları, yer tutucu temizliği ve cutover adımları **[TODO.md](./TODO.md)**
içinde. Oradaki maddeleri kendi başına yapma — hepsi kişisel tercih veya dış
sistem erişimi gerektiriyor.

## Doğrulama

```bash
pnpm verify    # build + tip kontrolü + kırık link ve başlık hiyerarşisi
pnpm check     # tip kontrolü + link kontrolü (dist/ zaten varsa)
```

CI aynı adımları çalıştırır; tip hatası, kırık link veya başlık atlaması
deploy'u durdurur.

**TypeScript 6'da sabit.** `astro check`, TS 7'nin kaldırdığı programatik
API'ye dayanıyor. Astro destek verene kadar `typescript@^6` kalmalı, yoksa
`astro check` çalışmadan hata verir.

Sayfa dosyalarında `lang === 'tr' ? ... : ...` **yazma**. Sayfalar tek dilli;
TypeScript o karşılaştırmayı ölü dal olarak işaretler ve iki dilin metni aynı
dosyada ikizlenir. Metinler `src/config.ts` içindeki `PAGE` sözlüğünde durur,
sayfa `PAGE[lang].x` der.

## İnteraktif açıklayıcılar

Yöntem [samwho.dev](https://samwho.dev/load-balancing/)'den alındı: simülasyon,
yazının içine **düz HTML custom element** olarak gömülür. Parametreler HTML
niteliği. MDX gerekmez, framework yok.

```markdown
<c-replicas rps="30" read-pct="90" replicas="2" style="--ex-height: 210px" description="Ekran okuyucu için ne olduğunu anlatan cümle.">
</c-replicas>
```

**Markdown tuzağı:** açılış etiketi tek satırda ve satırda başka bir şey
olmadan bitmeli, kapanış etiketi alt satıra alınmalı. Aksi halde CommonMark
bunu blok saymaz ve `<p>` içine sarar.

### Yeni açıklayıcı ekleme

1. `src/scripts/explainers/<ad>.ts` — `Explainer` taban sınıfından türet.
   Doldurman gerekenler: `controls()`, `reset()`, `step(dt)`, `draw()`,
   opsiyonel `stats()`. Taban sınıf canvas ölçeklemeyi, oynat/durdur/sıfırla
   kontrollerini, ekran dışında duraklatmayı, `prefers-reduced-motion`'ı ve
   renklerin `tokens.css`'ten okunmasını halleder — tema değişince simülasyon
   da değişir.
2. Dosyanın sonunda `customElements.define('c-<ad>', Sinif)`.
3. `src/scripts/explainers/boot.ts` içindeki `REGISTRY`'ye bir satır ekle.
   Sayfada o etiket yoksa modül indirilmez.
4. Stil gerekiyorsa `base.css` içindeki `.ex` bloğuna ekle; her açıklayıcı aynı
   çerçeveyi paylaşır.

**Kurallar:**
- `description` niteliği zorunlu — canvas'ın `aria-label`'ı olur.
- Renkleri elle yazma, `this.palette` kullan.
- `step(dt)` saf olmalı: aynı dt ile aynı sonucu vermeli, `Date.now()` çağırma.
- Simülasyon bir iddiayı görünür kılmalı. Süs olacaksa koyma.

Örnek: [`replicas.ts`](./src/scripts/explainers/replicas.ts) ve onu kullanan
`src/content/essays/en/watch-replicas-stop-helping.md`.

## Yorumlar

giscus (GitHub Discussions). `src/config.ts` içindeki `COMMENTS.enabled`
kapalıyken sayfaya **hiçbir şey** düşmez — ne iframe ne script. Açma adımları
[TODO.md](./TODO.md) madde 6'da; giscus GitHub App kurulmadan açma.

`Comments.astro` içindeki script `is:inline` olmak zorunda: Astro normal
`<script>` etiketlerini koşuldan bağımsız paketler ve kapalıyken sayfaya ölü
kod düşer.

Yorum kutusu `commentable: true` olan girdilerde çıkar. Essay'lerde varsayılan
açık, diğer koleksiyonlarda kapalı — boş bir yorum kutusu sayfayı fakir
gösteriyor.

## Yer tutucu içerik

Sitedeki yazıların çoğu şu an **yer tutucu** — tasarımı doldurmak için yazıldı,
gerçek değil. Hepsinde frontmatter'da `placeholder: true` var.

```bash
grep -rl 'placeholder: true' src/content     # hepsini listele
grep -rc 'placeholder: true' src/content -r  # sayısı
```

Gerçek yazı eklerken o dosyayı sil ya da içeriğini değiştirip `placeholder`
satırını kaldır. **Yer tutucu bir yazıyı olduğu gibi bırakıp gerçek gibi
sunma.** `signals` içindeki link ve kaynak bilgileri gerçek, yorum kısmı değil.

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
