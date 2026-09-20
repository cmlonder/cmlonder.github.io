#!/usr/bin/env node
/**
 * Yeni radar serisi açar: src/config.ts -> RADAR_SERIES'e tek girdi.
 *
 *   pnpm radar:seri <slug> "<Seri Adı>" "<tek cümle açıklama>"
 *   örn. pnpm radar:seri saas "SaaS Bülteni" "Günün SaaS vakası. Günlük."
 *
 * Gerisi otomatik: /radar/<slug> sayfası, /radar/series.json girdisi
 * (Apps Script buradan eşleştirir), check-radar'ın tanıdığı klasör.
 * Drive klasörünü Apps Script ilk bültende kendisi açıyor.
 *
 * Bilerek elle tetikleniyor: Spark'ın dosya adındaki bir yazım hatası
 * sessizce yeni seri açmasın. Bilinmeyen ad Drive'da kuyrukta kalır.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { radarSerileri } from './lib/series.mjs';

const [slug, ad, blurb] = process.argv.slice(2);
if (!slug || !ad || !blurb) {
  console.error('kullanım: pnpm radar:seri <slug> "<Seri Adı>" "<açıklama>"'); process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) { console.error(`slug kebab-case ve ASCII olmalı: ${slug}`); process.exit(1); }
if (radarSerileri().some((s) => s.slug === slug)) { console.error(`zaten var: ${slug}`); process.exit(1); }
if (/'/.test(ad + blurb)) { console.error("ad ve açıklama tek tırnak içeremez"); process.exit(1); }

const yol = 'src/config.ts';
const src = readFileSync(yol, 'utf8');
const isaret = /(export const RADAR_SERIES = \{[\s\S]*?)(\n\} as const;)/;
if (!isaret.test(src)) { console.error('RADAR_SERIES bloğu bulunamadı'); process.exit(1); }
const girdi = `\n  '${slug}': {\n    name: '${ad}',\n    driveFolder: 'Radar/${ad}',\n    blurb: '${blurb}',\n  },`;
writeFileSync(yol, src.replace(isaret, (_m, a, b) => a + girdi + b));

// Apps Script anahtarı: Türkçe harf katlanır, harf-rakam dışı atılır. Dosya adı bununla eşleşmeli.
const anahtar = ad.replace(/ı/g, 'i').replace(/İ/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
console.log(`✓ ${slug} eklendi -> ${yol}`);
console.log(`  Spark dosya adı: <ad>-PARSE-YYYY-MM-DD.md, ad anahtarı "${anahtar}" olmalı`);
console.log(`  örn. ${ad.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').replace(/\s+/g, '-')}-PARSE-2026-01-01.md`);
console.log('  sonra: pnpm verify && git push  (series.json yayına çıkmadan Apps Script eşleştiremez)');
