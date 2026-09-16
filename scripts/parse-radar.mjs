/**
 * Spark çıktısını radar girdisine çevirir.
 *
 *   node scripts/parse-radar.mjs <dosya.txt|->
 *
 * Sözleşme: ajan İKİ çitli blok üretir, aralarında serbest metin.
 *
 *   ```radar
 *   date: 2026-09-16
 *   title: Solo Kurucu Bülteni — 16 Eylül 2026
 *   summary: Tek cümlelik özet.
 *   ```
 *
 *   ... gövde, ajan nasıl isterse ...
 *
 *   ```claims
 *   iddia | url | tarih | tür | aranacak
 *   Pieter Levels ~3M $ ARR | https://... | 2025-10-29 | İkincil analiz | 3M
 *   Post Bridge 55.175 $ MRR |  |  | TrustMRR — derin link yok |
 *   ```
 *
 * Neden böyle:
 *  - Ajan YAML YAZMAZ. Türkçe kesme işareti ("BuiltWith'in") YAML'ı bozuyor;
 *    bu hata hem ajanda hem bende ayrı ayrı gerçekleşti. Burada değer,
 *    ilk iki noktadan sonrasının tamamı — kaçış kuralı yok.
 *  - Boru tablosunda tırnak/girinti kuralı yok, yalnızca alan sayısı sabit.
 *  - Frontmatter'ı BU SCRIPT yazıyor, gerçek bir YAML kütüphanesiyle.
 *
 * Eksik ya da bozuk blok = HATA. Yarım ayrıştırıp devam etmez; sessizce
 * yanlış veri üretmektense durur.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FIELDS = ['claim', 'url', 'sourceDate', 'sourceType', 'expect'];
const REQUIRED_META = ['date', 'title', 'summary'];

const die = (msg) => { console.error(`\n✗ ${msg}\n`); process.exit(1); };

function fence(text, name) {
  const re = new RegExp('```' + name + '\\s*\\n([\\s\\S]*?)```', 'm');
  const m = re.exec(text);
  return m ? m[1] : null;
}

/** key: value — değer satır sonuna kadar aynen alınır, tırnak yok. */
function parseMeta(block) {
  const out = {};
  for (const line of block.split('\n')) {
    const i = line.indexOf(':');
    if (i < 1) continue;
    const key = line.slice(0, i).trim();
    if (!/^[a-zA-Z]\w*$/.test(key)) continue;
    out[key] = line.slice(i + 1).trim();
  }
  return out;
}

function parseClaims(block) {
  const rows = [];
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  for (const [i, line] of lines.entries()) {
    if (!line.includes('|')) continue;
    if (/^[|\s:-]+$/.test(line)) continue;                 // markdown ayraç satırı
    const cells = line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    // Başlık satırını atla
    if (i === 0 && /iddia|claim/i.test(cells[0]) && /url|kaynak/i.test(cells[1] ?? '')) continue;
    if (cells.length < 4) die(`claims satırı ${i + 1}: ${cells.length} alan var, en az 4 gerekiyor\n   ${line}`);
    const row = {};
    FIELDS.forEach((f, n) => { if (cells[n]) row[f] = cells[n]; });
    if (!row.claim) die(`claims satırı ${i + 1}: iddia boş`);
    if (!row.sourceType) row.sourceType = 'belirtilmemiş';
    if (row.url && !/^https?:\/\//.test(row.url)) {
      die(`claims satırı ${i + 1}: geçersiz URL "${row.url}"`);
    }
    if (row.url && /google\.[a-z.]+\/search/.test(row.url)) {
      die(`claims satırı ${i + 1}: Google ARAMA linki kaynak değil — "URL YOK" yaz\n   ${row.url}`);
    }
    rows.push(row);
  }
  return rows;
}

/** YAML'ı biz yazıyoruz — blok skaler ile kaçış sorunu tamamen yok. */
const yamlStr = (v) => {
  const s = String(v);
  return /[:#\-?{}[\]&*!|>'"%@`\n]/.test(s) ? `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : s;
};

const src = process.argv[2];
if (!src) die('kullanım: node scripts/parse-radar.mjs <dosya|->');
const text = src === '-' ? readFileSync(0, 'utf8') : readFileSync(src, 'utf8');

const metaBlock = fence(text, 'radar');
const claimsBlock = fence(text, 'claims');
if (!metaBlock) die('```radar bloğu yok. Spark prompt\'u güncellenmeli.');
if (!claimsBlock) die('```claims bloğu yok. Spark prompt\'u güncellenmeli.');

const meta = parseMeta(metaBlock);
for (const k of REQUIRED_META) if (!meta[k]) die(`radar bloğunda "${k}" eksik`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) die(`date "YYYY-MM-DD" olmalı, gelen: "${meta.date}"`);

const claims = parseClaims(claimsBlock);
if (!claims.length) die('claims bloğunda hiç satır yok');

// Gövde: iki blok arasında kalan metin
const body = text
  .replace(/```radar\s*\n[\s\S]*?```/m, '')
  .replace(/```claims\s*\n[\s\S]*?```/m, '')
  .replace(/^#[^\n]*\n/, '')          // ajanın kendi H1'i — başlık frontmatter'da
  .trim();
if (body.length < 200) die(`gövde çok kısa (${body.length} karakter) — ayrıştırma hatalı olabilir`);

const fm = [
  '---',
  `title: ${yamlStr(meta.title)}`,
  `summary: ${yamlStr(meta.summary)}`,
  `generator: ${yamlStr(meta.generator ?? 'Gemini Spark')}`,
  `promptVersion: ${yamlStr(meta.promptVersion ?? 'bilinmiyor')}`,
  `date: '${meta.date}'`,
  'claims:',
  ...claims.flatMap((c) => [
    `  - claim: ${yamlStr(c.claim)}`,
    ...(c.url ? [`    url: ${yamlStr(c.url)}`] : []),
    ...(c.sourceDate ? [`    sourceDate: '${c.sourceDate}'`] : []),
    `    sourceType: ${yamlStr(c.sourceType)}`,
    ...(c.expect ? [`    expect: ${yamlStr(c.expect)}`] : []),
  ]),
  '---',
  '',
].join('\n');

const out = `src/content/radar/${meta.date}.md`;
if (existsSync(out) && !process.argv.includes('--force')) {
  die(`${out} zaten var. Üzerine yazmak için --force ekle.`);
}
writeFileSync(out, fm + body + '\n');

const withUrl = claims.filter((c) => c.url).length;
const withExpect = claims.filter((c) => c.expect).length;
console.log(`\n✓ ${out}`);
console.log(`  ${claims.length} iddia — ${withUrl} tanesinde URL, ${withExpect} tanesinde aranacak değer`);
console.log(`  gövde: ${body.length} karakter`);
console.log(`\n  sıradaki: pnpm verify:radar`);
