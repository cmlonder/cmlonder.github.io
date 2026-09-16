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

> Ne yazacağını [WRITING.md](./WRITING.md) anlatıyor — bölüm bölüm, örnekli.

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

## 4. Cutover — TAMAM ✅

Site `https://cmlonder.com` adresinde yayında (15 Eyl 2026).

| | |
|---|---|
| apex A + AAAA | GitHub Pages'e işaret ediyor |
| www | `cmlonder.github.io` CNAME, apex'e 301 |
| Sertifika | onaylı, `cmlonder.com` + `www`, 14 Ara 2026'ya kadar |
| Enforce HTTPS | açık, http -> https 301 |
| Eski Hashnode slug'ları | `canonical` + `noindex` ile yeni adrese yönlendiriyor |
| Eski yazıların görselleri | `/legacy/` altında self-host, çalışıyor |
| Sitemap / RSS / llms.txt / `.md` aynaları | hepsi cmlonder.com |
| Zoho e-postası, Zoho + Search Console doğrulamaları | korundu |

Doğrulama: `bash scripts/check-dns.sh`

> Not: script DNS'i DoH ile sorguluyor, `dig` ile değil. Cutover sırasında
> yerel çözümleyici "A kaydı yok" yanıtını 1800 saniye negatif önbellekte
> tuttu ve cutover başarısız görünürken aslında çalışıyordu.

### Kalan iki iş

**1. Hashnode'u kapat.** Blog Dashboard -> Domain -> custom domain'i kaldır.
   Trafik zaten GitHub'a geçti; bu sadece temizlik. Blogu tamamen silmek
   istersen o da oradan.

**2. Çift SPF kaydını düzelt** (cutover'la ilgisi yok, mevcut bir hata).
   Porkbun'da iki `v=spf1` TXT kaydı var; RFC 7208 bunu `permerror` sayar,
   yani Zoho'dan gönderdiğin maillerin SPF doğrulaması şu an başarısız.
   İkisini sil, tek kayıt bırak:

   ```
   v=spf1 include:zoho.com include:_spf.porkbun.com ~all
   ```

### Search Console

`google-site-verification` TXT kaydı korunduğu için erişimin kopmadı.
Yeni sitemap'i bildir: `https://cmlonder.com/sitemap-index.xml`

## 5. Yeni bölümlerin içeriği

Bu turda eklenen bölümlerin bir kısmı senin doldurmanı bekliyor:

- **`/uses`** — donanım ve uygulama listesi eksik, sonunda ⚠️ ile işaretli.
  Ajan kurulumu bölümü gerçek, oraya dokunmaya gerek yok.
- **Playbook belirtileri** — `symptoms` alanları benim yazdığım yer tutucu
  playbook'lardan türetildi. Gerçek playbook yazdıkça belirtileri de sen yaz;
  `/playbooks/find` sayfası kendiliğinden güncellenir.
- **`watch-replicas-stop-helping`** — bu yazı gerçek, yer tutucu değil. Ama
  simülasyonun servis süreleri (`SERVICE_READ` vb.) uydurma sabitler; kendi
  ölçümlerinle değiştirmek istersen `src/scripts/explainers/replicas.ts`.

## 6. Yorumlar — TAMAM

giscus kurulu ve açık. Yorumlar repoda GitHub Discussions olarak duruyor
(`Announcements` kategorisi — tartışmayı sadece sen açabilirsin).

Bilmen gerekenler:

- Yorumlar **sadece essay'lerde** çıkıyor. Bir not veya playbook'ta açmak
  istersen frontmatter'a `commentable: true` yaz.
- Kapatmak istersen tek yer: `src/config.ts` → `COMMENTS.enabled: false`.
  Kapalıyken sayfaya hiçbir şey düşmüyor, ne iframe ne script.
- Tema `public/giscus-light.css` ve `public/giscus-dark.css` dosyalarından
  geliyor; resmi giscus temaları taban alınıp sitenin paletiyle ezildi.
  Palet değişirse bu iki dosyayı da güncelle.
- Moderasyon GitHub'da: repo → Discussions. Bir yorumu silmek, kilitlemek
  veya kullanıcıyı engellemek oradan yapılır.

## 7. Radar — kurulu, boru hattı bekliyor

`/radar` yayında, 3 test bülteniyle. Doğrulama kapısı çalışıyor ve gerçek
hatalar yakalıyor.

Kalan:

1. **Spark çıktısını Drive'a yazdır.** Prompt'un sonuna bir Google Doc'a
   kaydetme talimatı ekle. Drive bağlantısı zaten kurulu.
2. **`/digest` skill'i** — Drive'dan okur, `claims` frontmatter'ını üretir,
   `verify:radar` çalıştırır, sonucu raporlar. Henüz yazılmadı.
3. **Test bültenleri** — `src/content/radar/2026-09-1{4,5,6}.md` deneme
   amaçlı; gerçek akış başlayınca sil.

## 8. Opsiyonel

- **OG görselleri** `public/og/*.png` elle üretildi (PIL). Metinleri
  değişirse yeniden üretilmeli; üretici script commit'te yok.
- **Chrome eklentisi** — `claude.ai/chrome`. Bağlanırsa ajan etkileşimli
  durumları (açık dropdown, hover) doğrudan doğrulayabilir.


## Radar zinciri hakkında yazı (backlog)

Spark → Google Doc → Apps Script → GitHub Actions → site zincirini uçtan
uca anlatan bir yazı. `docs/radar-kurulum.md` ve `docs/spark-prompt.md`
zaten iskeleti taşıyor.

Yazının asıl değeri kurulum adımları değil, yol boyunca çıkan gerçek
bulgular:

- Spark URL çekemiyor. Kanıt: var olmayan bir slug uydurup
  "profilden çekildi" dedi. Doğrulama koda taşındı.
- Uydurmaya karşı eklenen her prompt koruması çıktıda GÖRÜNÜR bir
  bölüme dönüştü. 1538 kelimede 44 başlık. İskele metne değil,
  iddia bloğuna ait.
- Google Docs export'u: prose bağlantılarını koruyor, TABLO HÜCRESİ
  bağlantılarını siliyor, kod bloklarını olduğu gibi geçiriyor, fence
  dil etiketini düşürüyor. Bu yüzden iddialar kod bloğunda taşınıyor.
- Canlı kaynaklar kayıyor. TrustMRR'da "$6,441" bir gün sonra "$6,491"
  oldu. Doğrulama yayın anında dondurulmalı, yoksa yayınlanmış yazı
  zamanla kendiliğinden "doğrulanmamış"a dönüşüyor.
- GITHUB_TOKEN ile atılan push başka workflow tetiklemiyor; çağrılan
  workflow da TETİKLEYEN commit'i checkout ediyor. İkisi birleşince
  zincir "başarılı" görünüp bir gün eski içeriği yayınlıyordu.
- Ajan gerçek bir satılık ilanını doğru aktardı ama fiyatı uydurdu.
  Sayfada ilan var, fiyat yok. Script yakaladı.
