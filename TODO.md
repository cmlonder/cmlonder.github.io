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

## 4. Cutover — kod tarafı TAMAM, DNS bekliyor

Yapılanlar (deploy edildi):

- `SITE_URL` ve `SITE.url` -> `https://cmlonder.com`
- `public/CNAME` eklendi, GitHub Pages custom domain API'den set edildi
- Eski Hashnode yazıları yayına açıldı, kök slug'lardan yönlendirme üretiliyor
  (`canonical` + `noindex` ile)
- Sitemap, llms.txt, `.md` aynaları, giscus tema URL'leri hepsi yeni adrese döndü

### Kalan: Porkbun DNS

`dash.porkbun.com` -> cmlonder.com -> **DNS**

**DEĞİŞTİR — apex A kaydı.** Tek `76.76.21.21` kaydını sil, yerine dört tane:

| Tip | Host | Cevap |
|---|---|---|
| A | (boş) | `185.199.108.153` |
| A | (boş) | `185.199.109.153` |
| A | (boş) | `185.199.110.153` |
| A | (boş) | `185.199.111.153` |

**A kayıtları zorunlu.** IPv6 (AAAA) ek olarak konur, A'nın yerine geçmez —
internetin çoğu hâlâ IPv4. Sadece AAAA eklersen alan adı hiç yanıt vermez.

| Tip | Host | Cevap |
|---|---|---|
| AAAA | (boş) | `2606:50c0:8000::153` |
| AAAA | (boş) | `2606:50c0:8001::153` |
| AAAA | (boş) | `2606:50c0:8002::153` |
| AAAA | (boş) | `2606:50c0:8003::153` |

**DEĞİŞTİR — www.** `CNAME www -> hashnode.network` kaydını sil,
yerine `CNAME www -> cmlonder.github.io`

**SAKIN SİLME** (e-posta ve doğrulama):

| Tip | Değer | Ne işe yarıyor |
|---|---|---|
| MX | `10 mx.zoho.com` / `20 mx2.zoho.com` / `50 mx3.zoho.com` | Zoho e-posta |
| TXT | `zoho-verification=zb90139965...` | Zoho doğrulaması |
| TXT | `google-site-verification=yB-RRM76...` | Search Console erişimi |

**AYRICA DÜZELT — çift SPF kaydı.** Şu an iki tane var, bu geçersiz:

```
v=spf1 include:zoho.com ~all
v=spf1 mx include:_spf.porkbun.com ~all
```

RFC 7208 birden fazla SPF kaydını `permerror` sayar; alıcı sunucular SPF'i
başarısız kabul eder. İkisini sil, tek kayıt bırak:

```
v=spf1 include:zoho.com include:_spf.porkbun.com ~all
```

(Porkbun e-posta yönlendirmesi kullanmıyorsan sadece `v=spf1 include:zoho.com ~all` yeter.)

### Sonra

```bash
bash scripts/check-dns.sh    # hepsi yeşil olana kadar
```

DNS yayıldıktan sonra GitHub sertifikayı üretir (5-30 dk). Ardından:
repo -> Settings -> Pages -> **Enforce HTTPS** işaretle.

### En son: Hashnode

DNS geçtiğini `check-dns.sh` ile doğruladıktan **sonra**:
Hashnode -> Blog Dashboard -> Domain -> custom domain'i kaldır.
Blogu tamamen silmek istersen o da oradan.

### Search Console

`google-site-verification` TXT kaydı durduğu için erişimin kopmaz.
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

## 7. Opsiyonel

- **OG görselleri** `public/og/*.png` elle üretildi (PIL). Metinleri
  değişirse yeniden üretilmeli; üretici script commit'te yok.
- **Chrome eklentisi** — `claude.ai/chrome`. Bağlanırsa ajan etkileşimli
  durumları (açık dropdown, hover) doğrudan doğrulayabilir.
