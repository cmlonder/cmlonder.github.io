# Radar otomasyonu — kurulum (bir kez, ~5 dakika)

Google Cloud Console'da **hiçbir şey yapılmıyor**. Servis hesabı, API
anahtarı, OAuth istemcisi gerekmiyor — Apps Script senin hesabın olarak
çalıştığı için Drive erişimi kendiliğinden var.

Artık tek bir değer gerekiyor: `GITHUB_TOKEN`. (Eski `FOLDER_ID`
kaldırıldı; script ana dizini tarıyor.)

## Akış

Spark bülteni Drive'ın **ana dizinine** şu adla yazıyor:

    <Seri Adı>-PARSE-YYYY-MM-DD.md
    örn. Solo-Kurucu-Bulteni-PARSE-2026-09-18.md

Apps Script günde bir kez ana dizine bakıyor ve bu kalıba uyan dosyalar için:

1. Addaki seri adını `cmlonder.com/radar/series.json` ile eşleştiriyor
2. GitHub'a `inbox/radar/<slug>/<tarih>.md` olarak itiyor
3. Drive'da seri klasörüne taşıyıp adını `<tarih>.md` yapıyor
   (`Radar/Solo Kurucu Bülteni/` — klasör yoksa oluşturuyor)

Kalıba uymayan dosyalara dokunulmuyor; ana dizindeki kişisel dosyaların
hiçbiri görülmüyor bile. Seri adı eşleşmezse dosya olduğu yerde kalıyor ve
yürütme kaydına sebebi yazılıyor.

**Yeni seri açarken bu script'e dokunmuyorsun.** `src/config.ts` içindeki
`RADAR_SERIES`'e bir satır ekle, site deploy olsun, yeter — Drive tarafı
listeyi oradan okuyor.

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

       → Solo-Kurucu-Bulteni-PARSE-2026-09-18.md
          GitHub : inbox/radar/solo-founder/2026-09-18.md
          Drive  : Radar/Solo Kurucu Bülteni/2026-09-18.md

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
