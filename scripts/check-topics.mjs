/**
 * Konu sağlığı.
 *
 * `topics` eskiden altı değerli bir enum'du: yazım hatası şemadan
 * geçemiyordu. Tek eksene inince (topics + tags birleşti) serbest metne
 * döndü ve o koruma kayboldu. Bu script onun yerini alıyor:
 *
 *   - birbirine çok benzeyen iki konu (tool / tools, retry / retries)
 *   - yalnızca BİR kez kullanılmış konu (çoğu zaman yazım hatası)
 *
 * İkincisi hata değil uyarı: gerçekten tek kullanımlık konu olabilir.
 * Birincisi hata: aynı şeyin iki adı, tam da birleştirdiğimiz sorun.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { TOPIC_ALIASES, CATEGORY_ALIASES } from './lib/radar-topics.mjs';

/** RADAR_CATEGORY anahtarları — config.ts'ten regex'le (Node TS okumuyor). */
const kategoriler = new Set(
  [...(/export const RADAR_CATEGORY[^{]*\{([\s\S]*?)\n\};/.exec(readFileSync('src/config.ts', 'utf8'))?.[1] ?? '')
    .matchAll(/^\s*'?([a-z0-9-]+)'?:/gm)].map((m) => m[1]));

const KOK = 'src/content';
const KAPSAM = ['essays', 'notes', 'playbooks', 'signals', 'library', 'films', 'games', 'chapters', 'radar'];

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

const sayac = new Map();
const takmaAd = [];      // sözlükteki bir takma ad hâlâ kullanılıyor
const bilinmeyenKat = []; // radar category RADAR_CATEGORY'de yok
for (const tur of KAPSAM) {
  let dosyalar = [];
  try { dosyalar = walk(join(KOK, tur)); } catch { continue; }
  for (const f of dosyalar.filter((x) => x.endsWith('.md'))) {
    const fmm = /^---\n([\s\S]*?)\n---/.exec(readFileSync(f, 'utf8'));
    if (!fmm) continue;
    let fm; try { fm = parseYaml(fmm[1]); } catch { continue; }
    const topics = Array.isArray(fm?.topics) ? fm.topics.map(String) : [];
    for (const ham of topics) {
      const v = sayac.get(ham) ?? { count: 0, dosyalar: [] };
      v.count++; v.dosyalar.push(f);
      sayac.set(ham, v);
      if (ham in TOPIC_ALIASES) takmaAd.push(`${f}: topics "${ham}" -> "${TOPIC_ALIASES[ham]}"`);
    }
    if (tur === 'radar') {
      if (fm?.tags) takmaAd.push(`${f}: "tags" alanı — radar sözleşmesi "topics" (check-radar çevirmeliydi)`);
      if (fm?.category) {
        if (fm.category in CATEGORY_ALIASES) takmaAd.push(`${f}: category "${fm.category}" -> "${CATEGORY_ALIASES[fm.category]}"`);
        else if (!kategoriler.has(fm.category)) bilinmeyenKat.push(`${f}: category "${fm.category}" RADAR_CATEGORY'de yok`);
        if (topics.includes(fm.category)) takmaAd.push(`${f}: kategori "${fm.category}" konu olarak tekrar edilmiş`);
      }
    }
  }
}

/** Tekil/çoğul ve küçük yazım farklarını aynı anahtara indiriyor. */
const kok = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(ies|es|s)$/, '');

const gruplar = new Map();
for (const t of sayac.keys()) {
  const k = kok(t);
  gruplar.set(k, [...(gruplar.get(k) ?? []), t]);
}

const cakisan = [...gruplar.values()].filter((g) => g.length > 1);
const tekil = [...sayac.entries()].filter(([, v]) => v.count === 1).map(([t]) => t);

console.log(`\n${sayac.size} konu, ${[...sayac.values()].reduce((a, v) => a + v.count, 0)} kullanım`);

for (const g of cakisan) {
  console.error(`ÇAKIŞAN KONU  ${g.join(' / ')} — aynı şeyin iki adı, birini seç`);
}
for (const t of takmaAd) console.error(`TAKMA AD      ${t}`);
for (const k of bilinmeyenKat) console.warn(`uyarı: ${k} (etiket ekle ya da CATEGORY_ALIASES'a bağla)`);
console.log(`çakışan konu:     ${cakisan.length}`);
console.log(`takma ad:         ${takmaAd.length}`);
console.log(`bilinmeyen kategori: ${bilinmeyenKat.length}`);
console.log(`tek kullanımlık:  ${tekil.length}${tekil.length ? ` (${tekil.slice(0, 8).join(', ')}${tekil.length > 8 ? '…' : ''})` : ''}`);

if (cakisan.length || takmaAd.length) {
  console.error('\nKonu doğrulaması başarısız.');
  process.exit(1);
}
console.log('Konu doğrulaması geçti.');
