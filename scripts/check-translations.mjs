#!/usr/bin/env node
/**
 * Çeviri kapısı — inbox/translations/<koleksiyon>--<slug>.md dosyalarını
 * Türkçe aslıyla karşılaştırıp src/content/<koleksiyon>/en/ altına koyar.
 *
 * Doğrular (geçmezse dosya kuyrukta kalır, sebebi yazar):
 *   - aslı var mı; frontmatter YAML mı; title/description(summary) dolu mu
 *   - pubDate, topics, ai, domain, crossRef aslıyla aynı mı (çeviri bunları değiştirmez)
 *   - slayt yolları, dipnot sayısı, custom element'ler aslıyla aynı mı
 * Yazar: translation: { from: tr, engine, reviewed: false }.
 * Sahibi gözden geçirince reviewed: true yapar; sayfadaki uyarı kalkar.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { parse as parseYaml, stringify as yamlYaz } from 'yaml';

const IN = 'inbox/translations';
const die = (m) => console.error(`✗ ${m}`);
if (!existsSync(IN)) { console.log('(kuyruk yok)'); process.exit(0); }

const fmAyir = (raw) => {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!m) return null;
  return { fm: parseYaml(m[1]), body: raw.slice(m[0].length) };
};
const slaytlar = (b) => [...b.matchAll(/\]\((\/decks\/[^)\s]+)/g)].map((m) => m[1]).sort().join('|');
const dipnot = (b) => (b.match(/\[\^[^\]]+\]:/g) ?? []).length;
const ozel = (b) => [...b.matchAll(/<(c-[a-z-]+)/g)].map((m) => m[1]).sort().join('|');
const esit = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const tarih = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? '').slice(0, 10));

let islenen = 0, hatali = 0;
for (const name of readdirSync(IN).filter((f) => f.endsWith('.md'))) {
  const src = join(IN, name);
  const m = /^([a-z]+)--(.+)\.md$/.exec(name);
  if (!m) { die(`${src}: ad "<koleksiyon>--<slug>.md" değil`); hatali++; continue; }
  const [, coll, rest] = m;
  const rel = coll === 'chapters' ? rest.replace('--', '/') : rest;
  const asil = join('src/content', coll, 'tr', `${rel}.md`);
  const hedef = join('src/content', coll, 'en', `${rel}.md`);
  if (!existsSync(asil)) { die(`${src}: Türkçe aslı yok (${asil})`); hatali++; continue; }

  let ceviri, kaynak;
  try { ceviri = fmAyir(readFileSync(src, 'utf8')); kaynak = fmAyir(readFileSync(asil, 'utf8')); }
  catch (e) { die(`${src}: YAML okunamadı — ${e.message}`); hatali++; continue; }
  if (!ceviri || !kaynak) { die(`${src}: frontmatter yok`); hatali++; continue; }
  const { fm, body } = ceviri; const k = kaynak.fm;

  const eksik = ['title', coll === 'chapters' ? 'summary' : 'description'].filter((x) => !fm[x]);
  if (eksik.length) { die(`${src}: eksik alan ${eksik.join(', ')}`); hatali++; continue; }
  if (body.trim().length < kaynak.body.trim().length * 0.5) { die(`${src}: gövde aslının yarısından kısa — özet mi çeviri mi?`); hatali++; continue; }

  // Çevirinin değiştirmemesi gereken alanlar aslından kopyalanır; farklıysa uyarı değil, düzeltme.
  const sabit = ['pubDate', 'updatedDate', 'topics', 'ai', 'domain', 'crossRef', 'status', 'featured', 'url', 'source', 'commentable'];
  for (const a of sabit) if (a in k) fm[a] = k[a];
  if (tarih(fm.pubDate) !== tarih(k.pubDate)) { die(`${src}: pubDate uyuşmuyor`); hatali++; continue; }

  const sorun = [];
  if (slaytlar(body) !== slaytlar(kaynak.body)) sorun.push('slayt yolları');
  if (dipnot(body) !== dipnot(kaynak.body)) sorun.push(`dipnot sayısı (${dipnot(body)} / ${dipnot(kaynak.body)})`);
  if (ozel(body) !== ozel(kaynak.body)) sorun.push('açıklayıcı custom element');
  if (sorun.length) { die(`${src}: aslıyla uyuşmuyor — ${sorun.join(', ')}`); hatali++; continue; }

  fm.translation = { from: 'tr', engine: fm.translation?.engine ?? 'Gemini Spark', reviewed: false };
  delete fm.translate;
  mkdirSync(dirname(hedef), { recursive: true });
  writeFileSync(hedef, `---\n${yamlYaz(fm)}---\n\n${body.trim()}\n`);
  rmSync(src);
  console.log(`✓ ${hedef}  (${body.split(/\s+/).length} kelime)`);
  islenen++;
}
console.log(`\n${islenen} çeviri yerine kondu${hatali ? `, ${hatali} dosya kuyrukta bırakıldı` : ''}.`);
