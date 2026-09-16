# Radar otomasyonu — kurulum (bir kez, ~5 dakika)

Google Cloud Console'da **hiçbir şey yapılmıyor**. Servis hesabı, API
anahtarı, OAuth istemcisi gerekmiyor — Apps Script senin hesabın olarak
çalıştığı için Drive erişimi kendiliğinden var.

İki değer gerekiyor.

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

Neden bu izin: Apps Script, Doc'un markdown çıktısını GitHub Contents
API ile `inbox/radar/solo-founder/<docId>.md` olarak yazıyor. Başka
hiçbir yetkiye ihtiyacı yok.

## 2. `FOLDER_ID` — Drive klasörünün URL'sinden

Spark'ın yazdığı klasörü Drive'da aç. Adres çubuğu şuna benzer:

    https://drive.google.com/drive/folders/1a2B3cD4eF5gH6iJ7kL8mN9oP0qR
                                           └──────── bunu kopyala ────┘

Klasörün ID'si son parçadır. Doc'un değil, **klasörün**.

## 3. Apps Script'e gir

1. <https://script.google.com> → **Yeni proje**
2. `docs/drive-to-github.gs` dosyasının tamamını yapıştır
3. Sol menü **Proje ayarları** (dişli) → en altta
   **Komut dosyası özellikleri** → **Özellik ekle**:

   | Özellik | Değer |
   |---|---|
   | `GITHUB_TOKEN` | 1. adımdaki `github_pat_…` |
   | `FOLDER_ID` | 2. adımdaki klasör ID'si |

4. Editöre dön, üstteki fonksiyon listesinden **`kur`** seç → **Çalıştır**
5. Google izin isteyecek → hesabını seç → "Gelişmiş" → "…projesine git"
   → **İzin ver**. (Kendi yazdığın script olduğu için "doğrulanmamış"
   uyarısı normal.)

`kur()` günlük 08:00 tetikleyicisini kurar ve hemen bir deneme yapar.
**Yürütmeler** sekmesinden sonucu görebilirsin.

## Çalıştığını nasıl anlarsın

- Apps Script → **Yürütmeler**: `gönderildi: <Doc adı>` satırı
- GitHub → repoda `inbox/radar/solo-founder/<id>.md` beliriyor
- Birkaç dakika sonra **Actions → Radar** çalışıyor, kuyruk boşalıyor
- `cmlonder.com/radar` altında bülten yayında

Sorun çıkarsa Apps Script **Yürütmeler** sekmesindeki hata mesajı
doğrudan söyler (token yanlışsa `GitHub yazma başarısız (401)`,
klasör ID yanlışsa `FOLDER_ID script property tanımlı değil` ya da
`File not found`).
