#!/usr/bin/env node
/**
 * Radar kuyruğunu işler.
 *
 * Spark artık Drive'a doğrudan yayına hazır markdown yazıyor:
 * "---" frontmatter, gövde, sonunda "## Kaynaklar" listesi. Dosya adı
 * zaten hedef ad (2026-09-16.md). Yani DÖNÜŞÜM YOK — bu script sadece
 * dosyanın sağlam olduğunu doğrulayıp yerine taşıyor.
 *
 * Eskiden burada 257 satırlık bir ayrıştırıcı vardı; Google Docs'un
 * bozduklarını onarıyordu. Docs zincirden çıkınca hepsi gereksizleşti.
 *
 * Kullanım: node scripts/check-radar.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { radarSerileri } from './lib/series.mjs';

const IN  = 'inbox/radar';
const OUT = 'src/content/radar';

/*
 * Bozuk dosya İŞİ DÜŞÜRMEZ — karantinanın bütün amacı bu. Dosya
 * kuyrukta kalır, uyarı basılır, diğer bültenler yayınlanır.
 * Workflow "en az bir ✓ var mı" diye bakıp karar veriyor.
 */
const die = (m) => {
  console.error(`\n✗ ${m}\n`);
  if (process.env.GITHUB_ACTIONS) console.log(`::warning::${m.split('\n')[0]}`);
};

if (!existsSync(IN)) { console.log('kuyruk yok, yapacak bir şey yok.'); process.exit(0); }

/*
 * Tanınan seriler config.ts'ten geliyor. Bilinmeyen bir seri klasörü
 * yayına alınırsa dosya src/content/radar altına düşer ama RADAR_SERIES'te
 * karşılığı olmadığı için ne liste sayfası ne de başlığı olur — build ya
 * patlar ya da adsız bir sayfa üretir. Kuyrukta bırakıp söylemek daha iyi.
 */
const taninan = new Set(radarSerileri().map((s) => s.slug));

let islenen = 0, hatali = 0;

for (const series of readdirSync(IN, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const dir = join(IN, series.name);

  if (!taninan.has(series.name)) {
    const adet = readdirSync(dir).filter((f) => f.endsWith('.md')).length;
    if (adet) {
      die(`inbox/radar/${series.name}: RADAR_SERIES'te böyle bir seri yok.\n` +
          `  src/config.ts'e ekle, ya da klasörü düzelt. ${adet} dosya kuyrukta bırakıldı.`);
      hatali += adet;
    }
    continue;
  }
  for (const name of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const src = join(dir, name);
    const raw = readFileSync(src, 'utf8');

    const m = /^---\n([\s\S]*?)\n---\n/.exec(raw);
    if (!m) { die(`${src}: "---" frontmatter yok. Spark'ın dosyayı yayına hazır yazması gerekiyor.`); hatali++; continue; }

    let fm;
    try { fm = parseYaml(m[1]); }
    catch (e) { die(`${src}: frontmatter YAML olarak okunamadı — ${e.message}`); hatali++; continue; }

    const eksik = ['title', 'date', 'summary'].filter((k) => !fm?.[k]);
    if (eksik.length) { die(`${src}: frontmatter'da eksik alan: ${eksik.join(', ')}`); hatali++; continue; }

    const date = String(fm.date).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { die(`${src}: date "${fm.date}" YYYY-MM-DD değil`); hatali++; continue; }

    const body = raw.slice(m[0].length).trim();
    if (body.length < 500) { die(`${src}: gövde çok kısa (${body.length} karakter)`); hatali++; continue; }

    mkdirSync(join(OUT, series.name), { recursive: true });
    const dest = join(OUT, series.name, `${date}.md`);
    writeFileSync(dest, raw);
    rmSync(src);
    console.log(`✓ ${dest}  (${body.split(/\s+/).length} kelime)`);
    islenen++;
  }
}

console.log(`\n${islenen} bülten yayına alındı${hatali ? `, ${hatali} dosya kuyrukta bırakıldı` : ''}.`);
if (islenen === 0 && hatali === 0) console.log('(kuyruk boştu)');
