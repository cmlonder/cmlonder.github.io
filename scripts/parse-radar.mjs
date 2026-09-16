/**
 * Spark çıktısını radar girdisine çevirir.
 *
 *   node scripts/parse-radar.mjs <seri> <dosya.txt|->
 *   node scripts/parse-radar.mjs solo-founder gunluk.md
 *
 * Çıktı: src/content/radar/<seri>/<tarih>.md
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

/** Belgedeki tüm çitli blokların içeriği. */
function fences(text) {
  return [...text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map((m) => m[1]);
}

/**
 * Blokları ETİKETE değil İÇERİĞE göre tanı.
 *
 * Google Docs kod bloklarında dil etiketi taşımıyor — Spark ```radar yazsa
 * bile export ```  olarak geliyor. Etikete güvenmek boru hattını Docs'un
 * biçimlendirme davranışına bağımlı kılar.
 */
/**
 * "appalchemy-ciro | AppAlchemy aylık ciro | 2025-08:17000, 2026-09:6441"
 * -> { id, title, points:[{label,value}] }
 *
 * Nokta değerleri burada DOĞRULANMAZ. verify-radar.mjs her noktayı
 * doğrulanmış bir iddiayla eşleştirir; eşleşmeyen nokta çizilmez.
 */
function parseCharts(block) {
  const out = [];
  for (const line of block.split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    if (cells.length < 3) continue;
    if (/^grafik$/i.test(cells[0])) continue;          // başlık satırı
    const [id, title, series] = cells;
    if (!id || !series) continue;
    const points = [];
    for (const raw of series.split(',')) {
      const m = /^\s*([^:]+?)\s*:\s*([-\d.]+)\s*$/.exec(raw);
      if (!m) continue;
      const value = Number(m[2]);
      if (!Number.isFinite(value)) continue;
      points.push({ label: m[1], value });
    }
    if (points.length >= 2) out.push({ id, title, points });
    else if (points.length) console.warn(`  ! grafik "${id}" tek noktalı, atlandı`);
  }
  return out;
}

function classify(text) {
  let meta = null, claims = null;
  for (const block of fences(text)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const pipey = lines.filter((l) => (l.match(/\|/g) ?? []).length >= 3).length;
    if (!claims && pipey >= Math.max(2, lines.length * 0.6)) { claims = block; continue; }
    if (!meta && lines.some((l) => /^date:\s*\d{4}-\d{2}-\d{2}/.test(l))) { meta = block; continue; }
  }
  // Metadata çitlenmemiş olabilir (v7 şablonunda tüm yazı tek blok
  // gösterildiği için ajan metadata'yı ayrıca çitlemiyor). Çit şartı
  // koşmak yerine, metnin başındaki bitişik "anahtar: değer" öbeğini
  // bul. Claims bloğu çitli KALMALI — Docs orada dönüşüm yapmıyor.
  if (!meta) {
    const lines = text.split('\n');
    let run = [];
    for (const l of lines.slice(0, 40)) {
      if (/^\s*\w+:\s*\S/.test(l)) { run.push(l.trim()); continue; }
      if (run.length && l.trim() === '') continue;
      if (run.some(r => /^date:\s*\d{4}-\d{2}-\d{2}/.test(r))) break;
      run = [];
    }
    if (run.some(r => /^date:\s*\d{4}-\d{2}-\d{2}/.test(r))) meta = run.join('\n');
  }

  return { meta, claims };
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

/**
 * YAML'ı biz yazıyoruz. Her değer tırnaklanır — "701" gibi çıplak bir sayı
 * tırnaksız bırakılırsa YAML onu number yapar ve şema doğrulaması patlar.
 * Seçici tırnaklamak yerine hepsini tırnaklamak daha az düşünce gerektiriyor.
 */
const yamlStr = (v) =>
  `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

const series = process.argv[2];
const src = process.argv[3];
if (!series || !src) die('kullanım: node scripts/parse-radar.mjs <seri> <dosya|->');
if (!/^[a-z0-9-]+$/.test(series)) die(`geçersiz seri adı: "${series}"`);
if (!existsSync(`src/content/radar/${series}`)) {
  die(`src/content/radar/${series}/ klasörü yok. Yeni seri açıyorsan önce\n` +
      `   src/config.ts içindeki RADAR_SERIES'e ekle, sonra klasörü oluştur.`);
}
const text = src === '-' ? readFileSync(0, 'utf8') : readFileSync(src, 'utf8');

const { meta: metaBlock, claims: claimsBlock } = classify(text);
if (!metaBlock) die('metadata bloğu bulunamadı — "date: YYYY-MM-DD" satırı olan çitli bir blok gerekiyor.');
if (!claimsBlock) die('claims bloğu bulunamadı — boru ile ayrılmış satırlar içeren çitli bir blok gerekiyor.');

const meta = parseMeta(metaBlock);
for (const k of REQUIRED_META) if (!meta[k]) die(`radar bloğunda "${k}" eksik`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) die(`date "YYYY-MM-DD" olmalı, gelen: "${meta.date}"`);

const claims = parseClaims(claimsBlock);
if (!claims.length) die('claims bloğunda hiç satır yok');

/**
 * Gövde: çitli blokların dışında kalan metin, ön bilgi atılmış.
 *
 * Metadata çitlenmemiş olabiliyor (v7 şablonu). O zaman "date:",
 * "title:" gibi satırlar gövdede kalıp sayfada görünüyordu. Yazının
 * başındaki Doc başlığı + metadata öbeğini burada kesiyoruz.
 */
const META_KEYS = /^(date|title|summary|generator|promptVersion|image|slug|tags?)\s*:/i;

function stripPreamble(md) {
  const lines = md.split('\n');
  let i = 0;
  let gordu = false;
  while (i < lines.length) {
    const l = lines[i].trim();
    if (l === '') { i++; continue; }
    if (META_KEYS.test(l)) { gordu = true; i++; continue; }
    // Metadata'dan ÖNCE gelen tek satırlık Doc başlığı da atılır —
    // başlık frontmatter'dan geliyor.
    if (!gordu && i < 4 && !/^[#>*\-]/.test(l) && l.length < 120) { i++; continue; }
    break;
  }
  return lines.slice(i).join('\n').trim();
}

const body = stripPreamble(
  text
    .replace(/```[^\n]*\n[\s\S]*?```/g, '')
    .replace(/^#[^\n]*\n/, '')        // ajanın kendi H1'i
    .trim()
);
if (body.length < 200) die(`gövde çok kısa (${body.length} karakter) — ayrıştırma hatalı olabilir`);

/**
 * Docs export'u başlıkları kalın sarmalıyla veriyor: "## **Başlık**".
 * v8 çıktısı temiz prose olduğu için başka onarıma gerek yok —
 * eskiden burada 79 satır v6 tamiri vardı, hepsi silindi.
 */
function normalise(md) {
  let out = md.replace(/^(#{1,4})\s+\*\*(.*?)\*\*\s*$/gm, '$1 $2');

  // Başlık seviyesi: sayfada zaten bir h1 var (bültenin adı). Docs
  // bölüm başlıklarını "#" olarak veriyor; olduğu gibi bırakırsak
  // sayfada dört h1 oluşuyor. En sığ başlık h2 olacak şekilde kaydır.
  const levels = [...out.matchAll(/^(#{1,6})\s+\S/gm)].map((m) => m[1].length);
  const shift = levels.length ? 2 - Math.min(...levels) : 0;
  if (shift > 0) {
    out = out.replace(/^(#{1,6})(\s+\S)/gm,
      (_m, h, rest) => '#'.repeat(Math.min(6, h.length + shift)) + rest);
  }

  // Numaralı atıf. Docs export'u köşeli parantezi KAÇIRIYOR: "\[1\]".
  // Kaçışsız hali de kabul ediliyor. Markdown bağlantısını bozmamak
  // için "(" gelirse atlanıyor.
  out = out.replace(/\\?\[(\d{1,2})\\?\](?!\()/g,
    (_m, n) => `<sup class="ref"><a href="#k${n}" id="r${n}">${n}</a></sup>`);

  return out;
}


const fm = [
  '---',
  `title: ${yamlStr(meta.title)}`,
  `summary: ${yamlStr(meta.summary)}`,
  `generator: ${yamlStr(meta.generator ?? 'Gemini Spark')}`,
  `promptVersion: ${yamlStr(meta.promptVersion ?? 'bilinmiyor')}`,
  `date: '${meta.date}'`,
  ...(meta.image ? [`image: ${yamlStr(meta.image)}`] : []),
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


const out = `src/content/radar/${series}/${meta.date}.md`;
if (existsSync(out) && !process.argv.includes('--force')) {
  die(`${out} zaten var. Üzerine yazmak için --force ekle.`);
}
writeFileSync(out, fm + normalise(body) + '\n');

const withUrl = claims.filter((c) => c.url).length;
const withExpect = claims.filter((c) => c.expect).length;
console.log(`\n✓ ${out}`);
console.log(`  ${claims.length} iddia — ${withUrl} tanesinde URL, ${withExpect} tanesinde aranacak değer`);
console.log(`  gövde: ${body.length} karakter`);
console.log(`\n  sıradaki: pnpm verify:radar`);
