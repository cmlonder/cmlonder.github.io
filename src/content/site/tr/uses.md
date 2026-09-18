---
title: Kullandıklarım
description: Gerçekten içinde çalıştığım araçlar ve ajan kurulumunun nasıl bağlandığı.
updated: 2026-09-15
---

Bir [/uses](https://uses.tech) sayfası. Donanım kısmı sıkıcı. Çalışma şeklimi
değiştiren şey altındaki ajan kurulumu, o yüzden asıl oraya yer ayırdım.

## Makine

Apple silicon Mac, macOS 26. zsh. Liste gerçekten bu kadar; bu katmanı
umursamayı bıraktım.

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
  Bu sitede üç tane: link ekleme, yazı ekleme, kitap ekleme. Her biri kısa bir
  markdown: *ne zaman* geçerli ve *iyi olan neye benzer*. Script değil.
- **Bir doğrulama komutu** — burada `pnpm verify`. Bir ajan kendi işini kontrol
  edemiyorsa kontrol eden sen oluyorsun — sen de ölçeklenmiyorsun.

Yöntemin tamamı bu. Dosyaların kendisi [skills](/skills) sayfasında.

## Terminal

iTerm, arama için `ripgrep`, liste olan her şey için `fzf`, GitHub'la ilgili her
şey için `gh`. Bir bağımlılık ısrar ederse `docker`.

## Çalışma zamanı

Node 22 ve pnpm, `packageManager` ile sabitlenmiş — CI ile dizüstüm ayrışamasın
diye. Bu sabitleme var çünkü bir kez ayrıştılar ve build, teşhisi olması
gerekenden uzun süren bir şekilde bozuldu.

## Başka

Henüz herkese açık olmaya hazır olmayan notlar için Obsidian. Başka birinin
okuması gereken her şey için Notion.

> ⚠️ Donanım ve uygulama listesi eksik — kendi kurulumunla tamamla.
