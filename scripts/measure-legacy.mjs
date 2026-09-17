#!/usr/bin/env node
/**
 * public/legacy görsellerinin boyutlarını ölçüp JSON'a yazar.
 * rehype eklentisi senkron çalıştığı için boyutu build sırasında
 * ölçemiyor; ölçüm burada bir kez yapılıp dosyadan okunuyor.
 */
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const DIR = 'public/legacy';
if (!existsSync(DIR)) { console.log('legacy dizini yok'); process.exit(0); }

const out = {};
for (const f of readdirSync(DIR).filter((x) => /\.(jpe?g|png|gif|webp)$/i.test(x))) {
  const { width, height } = await sharp(join(DIR, f)).metadata();
  if (width && height) out[`/legacy/${f}`] = { w: width, h: height };
}
writeFileSync('src/data/legacy-image-sizes.json', JSON.stringify(out, null, 2) + '\n');
console.log(`${Object.keys(out).length} görselin boyutu ölçüldü`);
