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
function classify(text) {
  let meta = null, claims = null;
  for (const block of fences(text)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const pipey = lines.filter((l) => (l.match(/\|/g) ?? []).length >= 3).length;
    if (!claims && pipey >= Math.max(2, lines.length * 0.6)) { claims = block; continue; }
    if (!meta && lines.some((l) => /^date:\s*\d{4}-\d{2}-\d{2}/.test(l))) { meta = block; continue; }
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

// Gövde: çitli blokların dışında kalan metin
const body = text
  .replace(/```[^\n]*\n[\s\S]*?```/g, '')
  .replace(/^#[^\n]*\n/, '')          // ajanın kendi H1'i — başlık frontmatter'da
  .trim();
if (body.length < 200) die(`gövde çok kısa (${body.length} karakter) — ayrıştırma hatalı olabilir`);

/**
 * Yapısal normalleştirme. KELİME DEĞİŞTİRMEZ — yalnızca markdown yapısını
 * düzeltir, çünkü Spark'ın çıktısı bir rapor ama deneme yazısı gibi
 * biçimlenmiş geliyor.
 *
 *  - Docs export başlıkları ** ile sarıyor: "## **Başlık**" -> "## Başlık"
 *  - "Başlık 1:" / "2\. " gibi iskele önekleri başlık değil, kategori
 *    etiketi. Kickers olarak ayrılıyor.
 *  - "- **Etiket:** değer" dizileri aslında tanım listesi. 32 tanesi
 *    madde işareti olarak dizilince okunmuyor.
 */
function normalise(md) {
  const lines = md.split('\n');
  const out = [];
  const caseHeads = new Set();   // 'Başlık N:' iskelesinden gelen satır indeksleri
  let dl = null;

  // <dl> bir HTML bloğu; CommonMark içinde markdown ÇALIŞMAZ, bu yüzden
  // satır içi biçimlendirmeyi burada HTML'e çeviriyoruz. Aksi halde
  // "**GEÇTİ**" ekranda yıldızlarıyla görünüyor.
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Docs export'u markdown kaçışı koyuyor ("2015\\)", "\\~3.000.000").
  // Normal markdown'da görünmez; HTML bloğu içinde harfiyen çıkar.
  const unesc = (t) => t.replace(/\\([\\`*_{}\[\]()#+\-.!~>|])/g, '$1');
  const inline = (t) => esc(unesc(t))
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/(?<![\w*])\*([^*]+)\*(?![\w*])/g, '<em>$1</em>');

  const flushDl = () => {
    if (!dl?.length) { dl = null; return; }
    out.push('<dl class="facts">');
    for (const [k, v] of dl) out.push(`<dt>${inline(k)}</dt><dd>${inline(v).split('\u0001').join('<br>').replace(/^(<br>)+/, '')}</dd>`);
    out.push('</dl>', '');
    dl = null;
  };

  for (let raw of lines) {
    // "- **Etiket:** değer" -> tanım listesi satırı
    const fact = /^\s*[-*]\s+\*\*([^*]+?):\*\*\s*(.+)$/.exec(raw);
    if (fact) { (dl ??= []).push([fact[1].trim(), fact[2].trim()]); continue; }
    // Girintili alt maddeler, açık bir dl'in devamı sayılır
    if (dl && /^\s{2,}[-*]\s+/.test(raw)) {
      const last = dl[dl.length - 1];
      last[1] += '\u0001' + raw.replace(/^\s*[-*]\s+/, '').trim();   // sonra <br>'e dönüşür
      continue;
    }
    if (raw.trim() === '' && dl) continue;
    flushDl();

    const h = /^(#{1,4})\s+(.*)$/.exec(raw);
    if (h) {
      let text = h[2].replace(/^\*\*(.*)\*\*$/, '$1').trim();   // Docs'un kalın sarmalı
      text = text.replace(/^\d+\\?\.\s*/, '');                  // "1\. Donanım"
      const scaffold = /^Başlık\s*\d+\s*[:—-]\s*(.*)$/i.exec(text);
      if (scaffold) {
        let rest = scaffold[1].trim();
        // "Uzun kategori adı (Kurucu — Ürün)" -> başlık isim, kategori kicker
        const named = /^(.*?)\s*\(([^()]*[—-][^()]*)\)\s*$/.exec(rest);
        if (named) {
          out.push(`<p class="kicker">${named[1].trim()}</p>`, '');
          rest = named[2].trim();
        }
        caseHeads.add(out.length);
        out.push(`## ${rest}`);
        continue;
      }
      out.push(`${h[1] === '#' ? '##' : h[1]} ${text}`);   // sayfada zaten h1 var
      continue;
    }
    out.push(raw);
  }
  flushDl();

  // Hiyerarşi: bir kicker+h2 bir VAKA başlatır; sonraki h2'ler o vakanın
  // alt bölümleridir ("Dürüst Değerlendirme" gibi), h3'e inmeli. Yoksa
  // her alt bölüm vaka başlığıyla aynı ağırlıkta görünüyor.
  let inCase = false;
  const levelled = out.map((l, i) => {
    if (/^<p class="kicker"/.test(l)) { inCase = false; return l; }
    const m = /^##\s+(.*)$/.exec(l);
    if (!m) return l;
    if (caseHeads.has(i)) { inCase = true; return l; }   // iskele = her zaman yeni vaka
    if (!inCase) { inCase = true; return l; }
    return `### ${m[1]}`;                        // alt bölüm
  });

  return levelled.join('\n').replace(/\n{3,}/g, '\n\n');
}

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
