# Yapılacaklar

Bu dosya sahibinin karar vermesi gereken işleri listeler. Bir ajan bunları
kendi başına yapmamalı — hepsi kişisel tercih veya dış sistem erişimi gerektirir.

> Son gözden geçirme: 19 Eyl 2026. Radar bölümü o gün baştan yazıldı;
> Google Docs'lu eski akış artık yok.

## 1. Marka kararı — TAMAM ✅

`HUB.name` karar: "Bahçe" / "The Garden" (digital garden göndermesi).
19 Eyl 2026'da bağlandı; yer tutucu kalmadı.

## 2. Yer tutucu içeriği onayla ya da değiştir

> Ne yazacağını [WRITING.md](./WRITING.md) anlatıyor — bölüm bölüm, örnekli.

```bash
grep -rl 'placeholder: true' src/content | wc -l      # 128
```

Metinlerin hepsi yazılı. `placeholder: true` "bu metin var" demiyor,
**"bu benim onayladığım görüşüm değil"** diyor. Dağılım:

| Koleksiyon | Adet | Sorulacak soru |
|---|---|---|
| `library` | 24 | Okudun mu, tek cümlelik not senin mi |
| `films` | 22 | Aynı soru |
| `games` | 22 | Aynı soru |
| `notes` | 16 | Bu gerçekten senin düşüncen mi |
| `essays` | 12 | Aynı soru, iddia taşıyor |
| `playbooks` | 12 | Aynı soru, tavsiye veriyor |
| `signals` | 12 | Link ve kaynak gerçek; yalnızca yorum yer tutucu |
| `chapters` | 8 | Havacılık ve e-ticaret dummy bölümleri |

68'i raf girdisi (hızlı geçilir), 40'ı görüş metni (asıl iş).

Onaylıyorsan `placeholder` satırını sil. Onaylamıyorsan dosyayı sil ya da
içeriğini değiştir. **Yer tutucuyu olduğu gibi bırakıp gerçek gibi sunma.**

## 3. Sabit sayfaları gözden geçir

`src/content/site/{en,tr}/` altında `now.md` (122 kelime), `about.md` (148),
`colophon.md` (212). Üçü de yayında ama senin sesinle değil.

Artık `cemal-writing-voice` skill'i kurulu — istersen ajan taslak çıkarır,
sen onaylarsın.

## 4. Cutover — TAMAM ✅

Site `https://cmlonder.com` adresinde yayında (15 Eyl 2026). Doğrulama:
`bash scripts/check-dns.sh`

> Not: script DNS'i DoH ile sorguluyor, `dig` ile değil. Cutover sırasında
> yerel çözümleyici "A kaydı yok" yanıtını 1800 saniye negatif önbellekte
> tuttu ve cutover başarısız görünürken aslında çalışıyordu.

### Kalan iki iş

**1. Hashnode'u kapat.** Blog Dashboard -> Domain -> custom domain'i kaldır.
   Trafik zaten GitHub'a geçti; bu sadece temizlik.

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

## 5. Senin doldurman gereken bölümler

- **`/uses`** — donanım ve uygulama listesi eksik, sayfada ⚠️ ile işaretli.
  Ajan kurulumu bölümü gerçek, oraya dokunmaya gerek yok.
- **Playbook belirtileri** — `symptoms` alanları yer tutucu playbook'lardan
  türetildi. Gerçek playbook yazdıkça belirtileri de sen yaz;
  `/playbooks/find` sayfası kendiliğinden güncellenir.
- **`watch-replicas-stop-helping`** — yazı gerçek, yer tutucu değil. Ama
  simülasyonun servis süreleri (`SERVICE_READ` vb.) uydurma sabitler; kendi
  ölçümlerinle değiştirmek istersen `src/scripts/explainers/replicas.ts`.

## 6. Yorumlar — TAMAM

giscus kurulu ve açık. Yorumlar repoda GitHub Discussions olarak duruyor
(`Announcements` kategorisi — tartışmayı sadece sen açabilirsin).

- Yorumlar **sadece essay'lerde** çıkıyor. Bir not veya playbook'ta açmak
  istersen frontmatter'a `commentable: true` yaz.
- Kapatmak istersen tek yer: `src/config.ts` → `COMMENTS.enabled: false`.
  Kapalıyken sayfaya hiçbir şey düşmüyor, ne iframe ne script.
- Tema `public/giscus-light.css` ve `public/giscus-dark.css` dosyalarından
  geliyor. Palet değişirse bu iki dosyayı da güncelle.
- Moderasyon GitHub'da: repo → Discussions.

## 7. Radar — zincir uçtan uca çalışıyor ✅

Spark bülteni Drive'ın **ana dizinine** `<Seri Adı>-PARSE-YYYY-MM-DD.md`
adıyla yazıyor; Apps Script eşleştirip GitHub'a itiyor, sonra Drive'da seri
klasörüne taşıyor; workflow doğrulayıp yayınlıyor. Ayrıntı:
[docs/radar-kurulum.md](./docs/radar-kurulum.md).

Seri listesi tek yerde: `src/config.ts` → `RADAR_SERIES`. Site onu
`/radar/series.json` olarak yayınlıyor, Drive tarafı oradan okuyor. **Yeni
seri açmak = config.ts'e bir satır.**

### Bakman gerekenler

1. **Geriye dönük üretim.** 19 Eyl itibarıyla klasörde 1-8 Eylül arası
   bültenler var. Bu senin istediğin bir backfill mi, yoksa Spark kendi
   kafasına göre tarih mi üretiyor — karar senin.
2. ~~`/digest` skill'i~~ — silindi (19 Eyl). Spark yayına hazır markdown
   yazıyor; gerekçesi kalmadı.

## 8. Opsiyonel / açık kalanlar

**OG görselleri — TAMAM ✅** `pnpm og` (fontlar `assets/og-fonts/`).

**Sunum PDF'i git geçmişinde.** 11 MB'lık `crs-evolution.pdf` HEAD'den
silindi ama geçmişte duruyor. Temizlemek geçmişi yeniden yazıp zorla push
etmeyi gerektirir.

**RIGGED'in durumu.** `src/content/projects/*/rigged.md` içinde
`status: "shipped"` duruyor. Reddit app'i artık ayakta değilse `archived`
daha dürüst.

**Chrome eklentisi.** `claude.ai/chrome`. Bağlanırsa ajan etkileşimli
durumları (açık dropdown, hover, tema değişimi) doğrudan doğrulayabilir.
Şu an bağlı değil; görsel doğrulamayı sen yapıyorsun.

## 9. Yalnızca senin yapabileceklerin — özet

Ajanın onaysız dokunmadığı her şey burada; ayrıntı ilgili bölümde.

- 128 yer tutucu: onayla ya da sil (bölüm 2)
- Hashnode'u kapat; çift SPF kaydını düzelt; Search Console'a sitemap bildir (bölüm 4)
- `/uses` donanım ve uygulama listesi (bölüm 5)
- Radar'daki geriye dönük üretim kasıtlı mı (bölüm 7)
- RIGGED `shipped` mı `archived` mı (bölüm 8)
- Sunum PDF'i git geçmişinden temizlensin mi — zorla push gerektirir (bölüm 8)
- Colophon'u kendi sesinle; ajan taslak çıkarır, yayın kararı sende (bölüm 3)
- Radar zinciri yazısı: taslağı ajan yazar, yayın kararı sende (aşağıda)

## 10. E-posta aboneliği — Buttondown (sen)

Site tarafı hazır ve KAPALI: `src/config.ts` → `NEWSLETTER.username` boş olduğu
sürece sayfaya form düşmüyor. Açmak için:

1. <https://buttondown.com> hesabı aç (ilk 100 abone ücretsiz; RSS-to-email
   eklentisi +9 $/ay). Settings → tracking pikselini kapat, double opt-in açık.
2. `NEWSLETTER.username`'e kullanıcı adını yaz → push. Formlar açılır:
   `/subscribe`, footer, her radar bülteni ve seri sayfası.
3. Etiketler formdan kendiliğinden oluşur (`yazilar`, `solo-girisimci`,
   `saas`, `github-radar`, `indie-game`). İlk abone gelince
   Subscribers → Tags altında görürsün.
4. Settings → RSS-to-email: her seri için bir otomasyon, kaynak seri
   beslemesi (`/radar/<seri>/rss.xml`), hedef kitle o etiket. Solo günlük;
   istersen "weekly digest" seç. Yazılar için `/tr/rss.xml`.
5. Doğrula: kendi adresinle abone ol, onay maili, ilk bülten, çıkış bağlantısı.

Otomasyonun etikete göre süzüp süzmediğini panelde teyit et (dokümantasyon
"audience filter" diyor); süzmüyorsa seri başına ayrı newsletter aç.

## Radar zinciri hakkında yazı (backlog)

Spark → Drive → Apps Script → GitHub Actions → site zincirini uçtan uca
anlatan bir yazı. Malzeme hazır; asıl değeri kurulum adımları değil, yol
boyunca çıkan gerçek bulgular:

- Spark URL çekemiyor. Kanıt: var olmayan bir slug uydurup "profilden
  çekildi" dedi. Doğrulama koda taşındı.
- Uydurmaya karşı eklenen her prompt koruması çıktıda GÖRÜNÜR bir bölüme
  dönüştü. 1538 kelimede 44 başlık. İskele metne değil, iddia bloğuna ait.
- Google Docs export'u prose bağlantılarını koruyup TABLO HÜCRESİ
  bağlantılarını siliyordu. Docs zincirden çıkınca 485 satırlık onarım kodu
  60 satıra düştü — karmaşıklığın kaynağını aramadan onu yönetmeye çalışma.
- Canlı kaynaklar kayıyor. TrustMRR'da "$6,441" bir gün sonra "$6,491" oldu.
  Doğrulama yayın anında dondurulmalı.
- `GITHUB_TOKEN` ile atılan push başka workflow tetiklemiyor; çağrılan
  workflow da tetikleyen commit'i checkout ediyor. İkisi birleşince zincir
  "başarılı" görünüp bir gün eski içeriği yayınlıyordu.
- Ajan gerçek bir satılık ilanını doğru aktardı ama fiyatı uydurdu. Sayfada
  ilan var, fiyat yok. Script yakaladı.
- Klasör dinlemekten ada göre eşleştirmeye geçiş: seri listesi iki yerde
  durunca biri mutlaka unutuluyor. Liste repoda kaldı, Drive onu okuyor.
