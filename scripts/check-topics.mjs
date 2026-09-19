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

const KOK = 'src/content';
const KAPSAM = ['essays', 'notes', 'playbooks', 'signals', 'library', 'films', 'games', 'chapters', 'radar'];

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

const sayac = new Map();
for (const tur of KAPSAM) {
  let dosyalar = [];
  try { dosyalar = walk(join(KOK, tur)); } catch { continue; }
  for (const f of dosyalar.filter((x) => x.endsWith('.md'))) {
    const m = /^topics:\s*\[(.*?)\]/m.exec(readFileSync(f, 'utf8'));
    if (!m) continue;
    for (const ham of m[1].split(',').map((t) => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)) {
      const v = sayac.get(ham) ?? { count: 0, dosyalar: [] };
      v.count++; v.dosyalar.push(f);
      sayac.set(ham, v);
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
console.log(`çakışan konu:     ${cakisan.length}`);
console.log(`tek kullanımlık:  ${tekil.length}${tekil.length ? ` (${tekil.slice(0, 8).join(', ')}${tekil.length > 8 ? '…' : ''})` : ''}`);

if (cakisan.length) {
  console.error('\nKonu doğrulaması başarısız.');
  process.exit(1);
}
console.log('Konu doğrulaması geçti.');
