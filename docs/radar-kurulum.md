# Radar otomasyonu — kurulum (bir kez, ~5 dakika)

Google Cloud Console'da **hiçbir şey yapılmıyor**. Servis hesabı, API
anahtarı, OAuth istemcisi gerekmiyor — Apps Script senin hesabın olarak
çalıştığı için Drive erişimi kendiliğinden var.

Artık tek bir değer gerekiyor: `GITHUB_TOKEN`. (Eski `FOLDER_ID`
kaldırıldı; script ana dizini tarıyor.)

## Akış

Spark bülteni Drive'ın **ana dizinine** şu adla yazıyor:

    <Seri Adı>-PARSE-YYYY-MM-DD.md
    örn. Solo-Girisimci-Bulteni-PARSE-2026-09-18.md

Apps Script günde bir kez ana dizine bakıyor ve bu kalıba uyan dosyalar için:

1. Addaki seri adını `cmlonder.com/radar/series.json` ile eşleştiriyor
2. GitHub'a `inbox/radar/<slug>/<tarih>.md` olarak itiyor
3. Drive'da seri klasörüne taşıyıp adını `<tarih>.md` yapıyor
   (`Radar/Solo Girişimci Bülteni/` — klasör yoksa oluşturuyor)

Kalıba uymayan dosyalara dokunulmuyor; ana dizindeki kişisel dosyaların
hiçbiri görülmüyor bile. Seri adı eşleşmezse dosya olduğu yerde kalıyor ve
yürütme kaydına sebebi yazılıyor.

## Kapı: `scripts/check-radar.mjs`

Spark'ın dosyası siteye girmeden önce tek bir yerden geçer. `radar.yml`
inbox'a düşen her dosya için bunu çalıştırır. İki iş yapar:

**Durdurur** (dosya inbox'ta kalır, kayıtta sebebi yazar):

| Sebep | Kayıttaki mesaj |
|---|---|
| `---` frontmatter yok ya da YAML bozuk | `frontmatter yok` / `YAML olarak okunamadı` |
| `title`, `date`, `summary` eksik | `frontmatter'da eksik alan` |
| `date` YYYY-MM-DD değil | `YYYY-MM-DD değil` |
| gövde 500 karakterden kısa | `gövde çok kısa` |
| seri `RADAR_SERIES`'te yok | `böyle bir seri yok` |
| kimlik alanı boş ya da seride zaten var (`arxiv` gibi) | `zaten yayında (…) — aynı konu ikinci kez seçilmiş` |

**Düzeltir** (dosya yayına girer, kayıtta `~` ile ne değiştiği yazar):

| Gelen | Olan |
|---|---|
| `tags: [...]` | `topics: [...]` |
| `devtool`, `chrome-extension`, `indie-hacker`… | sözlükteki tek ad (`tools`, `eklenti`, `solo-company`) |
| kategoriyle aynı konu, `github`/`engineering` gibi jenerikler | düşer |
| `category: github-radar` / `applied-research` (seri sabiti) | silinir |
| `category: gamedev`, `icerik-medya`… | `oyun`, `icerik` |
| `health_score: "9.2"` | sayı |
| `arxiv: "arXiv:2403.12345v2"` | `2403.12345` |
| `[1] https://…` düz satırlar | `1. [ad](url)` sıralı liste |
| gövdede düz `[1]` | `<sup><a href="url">1</a></sup>` |

Sözlük tek yerde: `scripts/lib/radar-topics.mjs` (konu/kategori) ve
`scripts/lib/radar-sources.mjs` (kaynaklar). Yeni bir ikiz görürsen oraya
ekle; `pnpm verify` içindeki `check-topics` sözlükteki bir takma adın içerikte
kaldığını hata sayar.

Yerelde denemek için: dosyayı `inbox/radar/<seri>/<tarih>.md` olarak koy,
`node scripts/check-radar.mjs` çalıştır, `src/content/radar/<seri>/`'ye bak.

## Çeviri zinciri (TR → EN, API'siz)

```
site /translate-queue/<dil>.json     hedef dilde karşılığı olmayan TR yazı ve bölümler (diller: config TRANSLATION_TARGETS) (yalnız outline'daki bölümler; taslak, yer tutucu, translate:false hariç)
  → Apps Script (AYRI proje: docs/drive-to-github-ceviri.gs) ceviriKuyrugunuIndir()  02:00  Drive/Ceviri/Kuyruk/<dil>/<dil>--<koleksiyon>--<slug>.md
  → Spark görevi (docs/spark-prompt-ceviri.md)  04:00  köke Ceviri-PARSE-<dil>--<koleksiyon>--<slug>.md (görev dil başına, prompt'un tepesindeki HEDEF_DIL)
  → Apps Script cevirileriIsle()  09:00  GitHub inbox/translations/  (kaynak Kuyruk → Islendi, çıktı → Gonderilen)
  → check-translations kapısı  → src/content/<koleksiyon>/<dil>/<slug>.md  (en/tr dışı diller src/translations/<dil>/ altında bekler; site o dili render etmiyor)
  → EN sayfada "Machine-translated from the Turkish original; not yet reviewed by me."
```

Kapı neyi durdurur: aslı yok, frontmatter bozuk, title/description boş, gövde
aslının yarısından kısa (özet), slayt yolları / dipnot sayısı / açıklayıcı
element'ler aslıyla uyuşmuyor. Neyi düzeltir: pubDate, topics, ai, domain,
crossRef gibi çevirinin değiştirmemesi gereken alanları aslından kopyalar.

Kurulum: `docs/drive-to-github-ceviri.gs` yeni bir Apps Script projesine yapıştır,
`GITHUB_TOKEN` script property'sini gir (radar kuryesindeki aynı token), `kur()` çalıştır.
Apps Script çevirmez; çeviren Spark. İki kurye birbirinden bağımsız.

Gözden geçirince: EN dosyasında `reviewed: false` → `true`; uyarı satırı kalkar.
Çevrilmesin istediğin yazıya `translate: false` yaz.

Google Translate: Apps Script'te `LanguageApp.translate()` ücretsiz ve anahtarsız
ama Markdown'ı bozuyor ve ses taşımıyor; bu zincirde kullanılmıyor.

## Seriler — dosya adı ve başlık sözleşmesi

Kural tek: dosya adı = seri adı (Türkçe harf ve büyük-küçük fark etmez,
boşluk yerine tire), `-PARSE-` şart; `title` = seri adı + uzun tire + sayı.

| Seri (slug) | Site adı | Spark dosya adı | `title:` |
|---|---|---|---|
| `solo-founder` | Solo Girişimci Bülteni | `Solo-Girisimci-Bulteni-PARSE-YYYY-MM-DD.md` | `"Solo Girişimci Bülteni — <D Ay YYYY>"` |
| `saas` | SaaS Bülteni | `SaaS-Bulteni-PARSE-YYYY-MM-DD.md` | `"SaaS Bülteni — <D Ay YYYY>"` |
| `github-radar` | GitHub Radar | `GitHub-Radar-PARSE-YYYY-MM-DD.md` | `"GitHub Radar — <Proje Adı>"` |
| `indie-postmortem` | Indie Oyun Bülteni | `Indie-Oyun-Bulteni-PARSE-YYYY-MM-DD.md` | `"Indie Oyun Bülteni — <Oyun Adı>"` |
| `paper-to-prod` | Makale Bülteni | `Makale-Bulteni-PARSE-YYYY-MM-DD.md` | `"Makale Bülteni — <Makale Adı>"` |

Ortak frontmatter: `date`, `summary`, `generator`, `promptVersion`, `topics`
(2-4 konu, `tags` değil); seriye özgü `revenue_source`, `health_score`,
`readiness_score`. `category` yalnız ürün türü olarak anlamlı (Solo/SaaS);
seri sabiti kategoriler (`github-radar`, `applied-research`) kapıda siliniyor.

## Yeni seri açmak

**Apps Script'e dokunmuyorsun.** Üç adım:

```bash
pnpm radar:seri saas "SaaS Bülteni" "Günün SaaS vakası. Günlük."
pnpm verify
git push            # series.json yayına çıkmadan Drive tarafı seriyi tanımaz
```

Komut `src/config.ts` → `RADAR_SERIES`'e tek girdi yazar ve Spark'ın
kullanması gereken dosya adını basar. Slug kebab-case ve ASCII olmalı
(`saas`), ad ve açıklama tek tırnak içeremez.

Sonra Spark'ta dosya adını şu kalıba göre ver — **`-PARSE-` şart**:

```
SaaS-Bulteni-PARSE-2026-09-20.md
```

Eşleşme Türkçe harfe ve büyük-küçüğe duyarsız: "SaaS Bülteni",
"saas-bulteni", "SAAS BULTENI" hepsi aynı seriye gider.
Boşluk yerine tire kullan; `-PARSE-` olmayan dosyaya hiç dokunulmuyor.

Ne olur, ne olmaz:

- `/radar/<slug>` sayfası deploy'la birlikte hemen vardır.
- `/radar` listesi ve anasayfa seriyi **ilk bülten gelene kadar göstermez** —
  boş bölüm açmamak için, bilerek.
- Seri kendiliğinden açılmaz. Spark bilinmeyen bir ad yazarsa dosya Drive
  ana dizininde kalır, yürütme kaydına "seri eşleşmedi" düşer. Yazım
  hatasının sessizce yeni seri açmaması için böyle.
- Apps Script her gün 08:00'de bakıyor; bir gün önce yazılan bülten ertesi
  sabah GitHub'a düşer. Daha erken istiyorsan Apps Script'te `kur()` içindeki saati değiştir.
- Seri adını değiştirirsen Spark'taki dosya adını da değiştir; eşleşme ad
  üzerinden, eski ad kuyrukta kalır.

## 1. `GITHUB_TOKEN` — github.com'dan

1. <https://github.com/settings/personal-access-tokens/new>
   (Settings → Developer settings → Personal access tokens →
   **Fine-grained tokens** → Generate new token)
2. **Token name**: `radar-drive-bridge`
3. **Expiration**: 1 yıl (süresi dolunca yenilemen gerekecek)
4. **Resource owner**: `cmlonder`
5. **Repository access**: *Only select repositories* → `cmlonder.github.io`
6. **Permissions → Repository permissions**:
   - **Contents: Read and write**  ← tek gereken bu
   - (Metadata: Read-only kendiliğinden geliyor, dokunma)
7. **Generate token** → çıkan `github_pat_…` değerini kopyala.
   Sayfadan ayrılınca bir daha gösterilmiyor.

## 2. Apps Script'e gir

1. <https://script.google.com> → **Yeni proje**
2. `docs/drive-to-github.gs` dosyasının tamamını yapıştır
3. Sol menü **Proje ayarları** (dişli) → en altta
   **Komut dosyası özellikleri** → **Özellik ekle**:

   | Özellik | Değer |
   |---|---|
   | `GITHUB_TOKEN` | 1. adımdaki `github_pat_…` |

4. Editöre dön, fonksiyon listesinden **`deneme`** seç → **Çalıştır**.
   Google izin isteyecek → hesabını seç → "Gelişmiş" → "…projesine git"
   → **İzin ver**. (Kendi yazdığın script olduğu için "doğrulanmamış"
   uyarısı normal.)

   `deneme()` hiçbir şeye dokunmaz; sadece ne olacağını yazar:

       → Solo-Girisimci-Bulteni-PARSE-2026-09-18.md
          GitHub : inbox/radar/solo-founder/2026-09-18.md
          Drive  : Radar/Solo Girişimci Bülteni/2026-09-18.md

5. Çıktı doğruysa **`kur`** fonksiyonunu çalıştır. Günlük 08:00
   tetikleyicisini kurar ve hemen bir kez işler.

## Çalıştığını nasıl anlarsın

- Apps Script → **Yürütmeler**: `gönderildi: <ad> -> inbox/radar/…` satırı
- Drive → dosya ana dizinden çıkıp seri klasöründe `<tarih>.md` olmuş
- GitHub → repoda `inbox/radar/<seri>/<tarih>.md` beliriyor
- Birkaç dakika sonra **Actions → Radar** çalışıyor, kuyruk boşalıyor
- `cmlonder.com/radar` altında bülten yayında

## Sorun çıkarsa

Apps Script **Yürütmeler** sekmesindeki mesaj doğrudan söyler:

| Mesaj | Anlamı |
|---|---|
| `GITHUB_TOKEN script property tanımlı değil` | 2. adımdaki özellik eklenmemiş |
| `GitHub yazma başarısız (401)` | Token yanlış ya da süresi dolmuş |
| `GitHub yazma başarısız (404)` | Token'ın repo erişimi yok |
| `Seri listesi alınamadı` | Site erişilemiyor ya da `/radar/series.json` yayında değil |
| `atlandı — …: seri eşleşmedi` | Dosya adındaki seri `RADAR_SERIES`'te yok |
| `atlandı (çok kısa)` | Spark dosyayı yarım yazmış; 200 karakterin altı kuyruğa alınmıyor |
| `UYARI …: ad X diyor, frontmatter Y` | Dosya adı ile içerideki tarih farklı; yayına frontmatter'daki tarih giriyor |
