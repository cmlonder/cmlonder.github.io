# cmlonder.com

Kişisel site. Astro 7, statik çıktı, GitHub Pages.

İçerik `src/content/<koleksiyon>/<dil>/<slug>.md` altında düz Markdown olarak
durur. Dört koleksiyon var ve bunlar konuya göre değil, yazının olgunluğuna
göre ayrılır: **essays** (bitmiş argüman), **notes** (sesli düşünme),
**playbooks** (tekrarlanabilir karar), **signals** (link + iki cümle).

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # dist/
```

Mimari kararlar, frontmatter sözleşmesi ve ajan talimatları için
[AGENTS.md](./AGENTS.md).

## Makine tarafı

| Yol | Ne |
|---|---|
| `/<koleksiyon>/<slug>.md` | Her yazının ham Markdown aynası |
| `/llms.txt` | Ajanlar için site özeti |
| `/llms-full.txt` | Tam içerik indeksi |
| `/rss.xml`, `/tr/rss.xml` | Besleme |
