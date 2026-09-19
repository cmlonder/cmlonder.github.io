# Modern referanslar — sitedeki özellik ↔ bugün örnek aldığım sayfa

19 Eyl 2026. Her bağlantı `curl` ile test edildi (200). Bot engeli veren
siteler (Letterboxd, Backloggd, Literal, Gates Notes) listeye alınmadı.

| Bizdeki özellik | Nerede | Modern referans | Ne alınmalı |
|---|---|---|---|
| Kenar notları + içindekiler | yazı sayfaları, bölümler | [Maggie — AI Enlightenment](https://maggieappleton.com/ai-enlightenment) · [Gwern — sidenotes](https://gwern.net/sidenote) · [Tufte CSS](https://edwardtufte.github.io/tufte-css/) | Sol sütun sessiz liste, sağ kenar notu referansın hizasında; dar ekranda notlar satır içi |
| Bulduklarım (akış) | `/signals` | [Maggie — Smidgeons](https://maggieappleton.com/smidgeons) · [Brian Lovin — HN](https://brianlovin.com/hn) · [Simon Willison](https://simonwillison.net/) | Tarih + konu üstte, dış link kart, yazar altta, gövde satır içinde |
| Raflar (kitap/film/oyun) | `/library` `/films` `/games` | [Maggie — Library](https://maggieappleton.com/library) · [Maggie — Antilibrary](https://maggieappleton.com/antilibrary) · [Oku](https://oku.club/) | Kapak ızgarası, sekme yok; bitirilen ve sırada bekleyen ayrı sayfalar |
| Notlar (bahçe, olgunluk) | `/notes` | [Maggie — Garden](https://maggieappleton.com/garden) · [Joel Hooks — Digital Garden](https://joelhooks.com/digital-garden) · [Andy Matuschak — Notes](https://notes.andymatuschak.org/) · [Tom Critchlow — Wiki](https://tomcritchlow.com/wiki/) | Olgunluk işareti (filiz/fidan/kökleşmiş), notlar arası bağlantı, "büyüyen" his |
| Konu sayfaları | `/topics/*` | [Simon Willison — Tags](https://simonwillison.net/tags/) · [Maggie — Garden filtreleri](https://maggieappleton.com/garden) | Tipe göre bölümler, sayaç, tek eksen |
| Şu sıralar | `/now` | [nownownow](https://nownownow.com/) · [Derek Sivers — now](https://sive.rs/now) · [Maggie — now](https://maggieappleton.com/now) · [Linear — Now](https://linear.app/now) | Tarihli girdi arşivi, her girdi kendi adresi |
| Kullandıklarım | `/uses` | [Wes Bos — uses](https://wesbos.com/uses) · [uses.tech](https://uses.tech/) | Kategorili kartlar, kısa "neden", bağlantı |
| Mesleki geçmiş | `/work` | [Brian Lovin](https://brianlovin.com/) · [Lee Robinson](https://leerob.com/) · [Paco](https://paco.me/) | Zaman çizgisi, sakin tipografi, "nasıl çalışırım" önce |
| Anasayfa / hero | `/` | [Josh Comeau](https://www.joshwcomeau.com/) · [Rauno](https://rauno.me/) · [Emil Kowalski](https://emilkowal.ski/) · [Pedro Duarte](https://ped.ro/) | Küçük, kendinden emin hero; bölümler kendi biçimiyle |
| Hover / mikro-etkileşim | site geneli | [Rauno — Craft](https://rauno.me/craft) · [Emil Kowalski](https://emilkowal.ski/) · [Jhey](https://jhey.dev/) | Tek yerde tanımlı hareket dili, 150–300 ms, reduced-motion |
| Açıklayıcılar (simülasyon) | `c-replicas`, slaytlar | [samwho — Load Balancing](https://samwho.dev/load-balancing/) · [Bartosz Ciechanowski — Mechanical Watch](https://ciechanow.ski/mechanical-watch/) · [Red Blob Games](https://www.redblobgames.com/) · [Explorables](https://explorabl.es/) · [Distill](https://distill.pub/) · [The Pudding](https://pudding.cool/) | Simülasyon iddiayı görünür kılar; süs olacaksa konmaz |
| Radar (makine bülteni) | `/radar` | [Linear — Changelog](https://linear.app/changelog) · [Raycast — Changelog](https://www.raycast.com/changelog) · [Vercel — Changelog](https://vercel.com/changelog) | Tarihli akış, tek sütun, sakin ritim, kaynak/kanıt görünür |
| Projeler | `/projects` | [Brian Lovin](https://brianlovin.com/) · [Sindre Sorhus](https://sindresorhus.com/) · [Max Stoiber](https://mxstbr.com/) | Durum + ölçülebilir sonuç; hackathon işi ayrı işaretli |
| Arşiv | `/archive` | [Dan Luu](https://danluu.com/) · [Julia Evans](https://jvns.ca/) · [Kent C. Dodds](https://kentcdodds.com/) | Yoğun tek liste, yıl başlıkları, tip işareti |
| Tipografi / okuma deneyimi | site geneli | [Gwern — Design](https://gwern.net/design) · [Tufte CSS](https://edwardtufte.github.io/tufte-css/) · [Robin Sloan](https://www.robinsloan.com/) | Ölçü 66ch, satır arası, seçim rengi, tabular rakam |
| Hakkımda / kimlik | `/about` | [Cassidy Williams](https://cassidoo.co/) · [swyx](https://www.swyx.io/) · [Anh](https://anhvn.com/) | Kısa, sesli, tek sayfa; iletişim net |
| Slayt/deste yazının içinde | havacılık bölümü | [Bartosz Ciechanowski](https://ciechanow.ski/) · [samwho](https://samwho.dev/) | Görsel anlattığı paragrafın yanında, metin sütununu hafif taşar |
| Değişiklik/yöntem sayfası | `/ai`, colophon | [Gwern — Design](https://gwern.net/design) · [Frontend Masters Blog](https://frontendmasters.com/blog/) | Yöntemi ve araç zincirini dürüstçe anlatan sayfa |

## Sitede henüz olmayan, referanslarda olan

> Karar (19 Eyl): "kime yazıldı" satırı, not ağı ve ikinci açıklayıcı yapıldı; yıllık seçme listeden çıkarıldı; radar changelog ritmi ve anasayfa "son güncellemeler" akışı (brianlovin.com, simonwillison.net) karar bekliyor.
>
> İkinci tur (19 Eyl): kod bloğu üst çubuğu (dil + kopyala), görsel/slayt büyütme, makine için görünmez `text/markdown` alternate bağlantısı ve ⌘K arama paleti yapıldı. Kalanlar: anasayfa "son güncellemeler" akışı ve radar changelog ritmi — silinmedi, karar bekliyor.

- **Notlar arası "backlink + önizleme" hover'ı** (Maggie garden, Andy Matuschak): bağlantının üstüne gelince hedef notun ilk paragrafı beliriyor. Bizde backlink listesi var, önizleme yok.
- **Okuma ilerleme göstergesi / "kaldığın yer"** (Gwern): uzun bölümlerde.
- **Yazı içi "Assumed audience" satırı** (Maggie): her yazının başında kime yazıldığı. Playbook `context` alanı buna çok yakın; essays'e de eklenebilir.
