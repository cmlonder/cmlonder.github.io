# Yapılacaklar

Bu dosya sahibinin karar vermesi gereken işleri listeler. Bir ajan bunları
kendi başına yapmamalı — hepsi kişisel tercih veya dış sistem erişimi gerektirir.

## 1. Marka kararları

`src/config.ts` içindeki iki değer yer tutucu:

| Sabit | Şu anki değer |
|---|---|
| `HUB.name` | "The Workbench" / "Tezgâh" |
| `HERO[lang].rest` | " writes about building software with agents, architecture, and scale." |

İkisi de nav'da ve anasayfada görünüyor. Değiştirmek tek satır.

## 2. Yer tutucu içeriği değiştir

```bash
grep -rl 'placeholder: true' src/content     # listeyi gör
grep -rl 'placeholder: true' src/content | wc -l
```

Bu girdiler tasarımı doldurmak için yazıldı, gerçek görüş değil.
`signals` içindeki **link, başlık ve kaynak gerçek** — sadece iki cümlelik
yorum yer tutucu. `library` gerçek kitaplar ama tavsiye iddiası onaylanmadı.

Gerçek yazı eklerken dosyayı sil veya içeriği değiştirip `placeholder` satırını
kaldır.

## 3. Sabit sayfaları gözden geçir

`src/content/site/{en,tr}/` altında `now.md`, `about.md`, `colophon.md`.
Üçü de yazılı ve yayında ama sahibinin sesiyle değil.

## 4. Cutover: cmlonder.com'a taşınma

Şu an site `https://cmlonder.github.io` adresinde. `cmlonder.com` hâlâ
Hashnode'da (DNS `hashnode.network`). Sıra önemli.

1. Yer tutucu içeriği temizle (madde 2).
2. Eski repoda Pages kapalı olduğunu doğrula — alan adı serbest olmalı:
   ```bash
   gh api repos/cmlonder/legacy-cmlonder-github-io --jq '.has_pages'   # false
   ```
3. `astro.config.mjs` → `const SITE_URL = 'https://cmlonder.com';`
   Bu tek değişiklik `IS_CUTOVER` üzerinden eski yazıların yönlendirmelerini de
   otomatik açar.
4. `src/config.ts` → `SITE.url` aynı değer.
5. `public/CNAME` oluştur, tek satır: `cmlonder.com`
6. Taşınan iki yazıyı yayınla: `src/content/essays/en/how-*.md` içinde
   `draft: true` → `false`.
7. Push et, deploy'un geçmesini bekle.
8. GitHub → Settings → Pages → Custom domain `cmlonder.com`, Enforce HTTPS.
9. DNS kayıtlarını değiştir (registrar'da):
   - `cmlonder.com` A → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `www` CNAME → `cmlonder.github.io`
10. Hashnode blogunu kapat.
11. Google Search Console'a yeni sitemap: `https://cmlonder.com/sitemap-index.xml`

### Taşınmış eski yazılar

Hashnode'daki iki yazı repoya alındı, görselleri indirilip
`public/legacy/` altına kondu (5.95 MB → 0.87 MB sıkıştırıldı).
`draft: true` oldukları için yayında değiller.

| Eski URL | Yeni URL |
|---|---|
| `/how-buying-an-iphone-helped-me-to-land-my-first-job-as-a-developer` | `/essays/...` (aynı slug) |
| `/how-one-feature-from-a-failed-startup-can-become-a-billion-dollar-idea` | `/essays/...` (aynı slug) |

Kök seviyedeki eski URL'lerden yeni adreslere yönlendirme `astro.config.mjs`
içinde tanımlı ve cutover'da kendiliğinden devreye giriyor.

## 5. Opsiyonel

- **OG görselleri** `public/og/*.png` elle üretildi (PIL). Metinleri
  değişirse yeniden üretilmeli; üretici script commit'te yok.
- **Chrome eklentisi** — `claude.ai/chrome`. Bağlanırsa ajan etkileşimli
  durumları (açık dropdown, hover) doğrudan doğrulayabilir.
