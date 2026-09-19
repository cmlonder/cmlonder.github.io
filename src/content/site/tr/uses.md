---
title: Kullandıklarım
description: Gerçekten içinde çalıştığım araçlar ve ajan kurulumunun nasıl bağlandığı.
updated: 2026-09-15
---

Bir [/uses](https://uses.tech) sayfası. Donanım kısmı sıkıcı. Çalışma şeklimi
değiştiren şey altındaki ajan kurulumu, o yüzden asıl oraya yer ayırdım.

## Editör ve ajanlar

İşin çoğunu editörde değil, terminalde
**[Claude Code](https://claude.com/claude-code)** üzerinden yapıyorum.
**Cursor** ve **VS Code** okumak ve ara sıra elle düzeltmek için açık duruyor
ama işin geçtiği yer artık orası değil.

Önemli olan araç değil, deponun o araca ne söylediği. Önemsediğim her projede
şunlar var:

- **`AGENTS.md`** — mimari kararlar, içerik veya veri sözleşmesi, ve aksi
  halde sadece kafamda duracak kurallar. `CLAUDE.md` buna symlink, böylece
  doğru tutulacak tek dosya var.
- **`.claude/skills/` altındaki skill'ler** — tekrar eden her iş için bir tane.
  Bu sitede dört tane: link ekleme, yazı ekleme, kitap ekleme, ve bir brifing
  ile sunumu bölüme çevirme. Her biri kısa bir markdown: *ne zaman* geçerli ve
  *iyi olan neye benzer*. Script değil.
- **Bir doğrulama komutu** — burada `pnpm verify`. Bir ajan kendi işini kontrol
  edemiyorsa kontrol eden sen oluyorsun — sen de ölçeklenmiyorsun.

Yöntemin tamamı bu. Dosyaların kendisi repoda, etki ettikleri kodun yanında duruyor.

> ⚠️ Donanım ve uygulama listesi eksik — kendi kurulumunla tamamla.
