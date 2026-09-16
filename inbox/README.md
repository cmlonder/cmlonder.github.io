# inbox — otomatik bülten kuyruğu

Apps Script (Google Drive tarafı) Spark'ın yazdığı Doc'u markdown olarak
buraya iter: `inbox/radar/<seri>/<docId>.md`

`.github/workflows/radar.yml` bu dizine gelen her push'ta çalışır:

    parse-radar.mjs  ->  src/content/radar/<seri>/<tarih>.md
    verify-radar.mjs ->  src/data/radar-verification.json
    inbox dosyası silinir, sonuç commit'lenir, site deploy edilir

Buraya elle bir şey koymana gerek yok. Koyarsan da çalışır — test için
kullanışlı.
