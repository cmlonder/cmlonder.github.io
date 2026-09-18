# inbox — otomatik bülten kuyruğu

Apps Script (Google Drive tarafı) Spark'ın ana dizine yazdığı dosyayı buraya
iter: `inbox/radar/<seri>/<YYYY-MM-DD>.md`

Seri, Drive'daki dosya adından çözülüyor:

    <Seri Adı>-PARSE-YYYY-MM-DD.md   ->   inbox/radar/<slug>/<tarih>.md

Eşleştirme `/radar/series.json` üzerinden yapılıyor; o da `src/config.ts`
içindeki `RADAR_SERIES`'ten üretiliyor. Tanınmayan bir seri adı hem Drive'da
hem burada durdurulur — yanlış yere düşmez.

`.github/workflows/radar.yml` bu dizine gelen her push'ta çalışır:

    check-radar.mjs  ->  src/content/radar/<seri>/<tarih>.md
    make-cover.mjs   ->  src/assets/radar/<seri>-<tarih>.png  (isteğe bağlı)
    inbox dosyası silinir, sonuç commit'lenir, site deploy edilir

Bozuk ya da tanınmayan dosya işi düşürmez: kuyrukta kalır, uyarı basılır,
diğer bültenler yayınlanır.

Buraya elle bir şey koymana gerek yok. Koyarsan da çalışır — test için
kullanışlı.
