/**
 * Radar doğrulama kapısı.
 *
 *   node scripts/verify-radar.mjs
 *
 * Her radar girdisinin `claims` tablosunu alır, HER kaynağı gerçekten çeker ve
 * beklenen değerin metinde geçip geçmediğine bakar. Ajanın kendi "DOĞRULANDI"
 * beyanına güvenmez — çünkü ajan URL çekemiyor ve çekemediğinde slug uydurup
 * doğruladığını iddia ettiği gözlendi.
 *
 * Sonuç src/data/radar-verification.json dosyasına yazılır; sayfa oradan okur.
 *
 * Verdict'ler:
 *   DOGRULANDI  kaynak çekildi, beklenen değer metinde bulundu
 *   BULUNAMADI  kaynak çekildi ama beklenen değer metinde yok
 *               (yakın bir sayı varsa raporlanır — "5,890 bekleniyordu, 5,889 var")
 *   YETERSIZ    sayfa istemci tarafında render ediliyor, metin çıkarılamadı.
 *               Bu "iddia yanlış" demek DEĞİL — "doğrulanamadı" demek.
 *   ERISILEMEDI kaynak çekilemedi (404, timeout, engel)
 *   URL_YOK     ajan kaynak veremedi
 *   KAYNAKSIZ   iddia zaten kaynaksız olduğunu beyan ediyor (mimari taslak vb.)
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

const DIR = 'src/content/radar';
const OUT = 'src/data/radar-verification.json';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36';
const TIMEOUT = 20_000;
const MAX_AGE_MONTHS = 12;

/** Kaba frontmatter okuyucu — bağımlılık eklemeden yeterli. */
function parseFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!m) return null;
  // Elle yazılmış ayrıştırıcı bu projede iki kez hata verdi (Türkçe
  // kesme işareti, ve "^\\S" çıkış koşulunun iddia listesini daha
  // başlamadan bitirmesi). Gerçek ayrıştırıcı kullanıyoruz.
  const fm = parseYaml(m[1]) ?? {};
  fm.claims ??= [];
  return fm;
}

const strip = (v) => v.trim().replace(/^['"]|['"]$/g, '');

/** "55.175", "$55,175", "55175" hepsi aynı sayıya indirgensin. */
const normalise = (s) =>
  s.toLowerCase()
   .replace(/[ \s]/g, '')
   .replace(/[.,](?=\d{3}\b)/g, '')
   .replace(/[^a-z0-9$%/-]/g, '');

/**
 * Beklenen sayıya en yakın sayıyı kaynakta ara. "5,890 bekleniyordu ama
 * 5,889 var" bilgisi, çıplak bir BULUNAMADI'dan çok daha kullanışlı.
 */
function nearestNumber(text, expect) {
  const target = Number(String(expect).replace(/[^0-9]/g, ''));
  if (!target) return null;
  const nums = [...text.matchAll(/\$?\d[\d.,]{2,}/g)].map((m) => m[0]);
  let best = null, bestDiff = Infinity;
  for (const n of nums) {
    const v = Number(n.replace(/[^0-9]/g, ''));
    if (!v) continue;
    const diff = Math.abs(v - target);
    // Sadece anlamlı yakınlıkları bildir (%5 içinde)
    if (diff < bestDiff && diff > 0 && diff / target < 0.05) { best = n; bestDiff = diff; }
  }
  return best;
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA }, signal: ctrl.signal, redirect: 'follow' });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ');
    return { ok: true, text };
  } catch (e) {
    return { ok: false, reason: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally {
    clearTimeout(t);
  }
}

function monthsOld(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(+d)) return null;
  return Math.round((Date.now() - +d) / (1000 * 60 * 60 * 24 * 30.44));
}


// ─────────────────────────────────────────────────────────────────────
// Grafikler
//
// Kural: bir veri noktası, DOĞRULANMIŞ bir iddiayla eşleşmiyorsa
// çizilmez. Böylece grafik uydurmanın taşıyıcısı değil, doğrulamanın
// görünür hâli olur.
// ─────────────────────────────────────────────────────────────────────

/** "17K" -> 17000, "6,441" -> 6441, "$3M" -> 3000000, "45k" -> 45000 */
function toNumber(s) {
  if (s == null) return null;
  const m = /^\$?\s*([\d.,]+)\s*([kmb])?/i.exec(String(s).trim());
  if (!m) return null;
  let body = m[1].replace(/[.,](?=\d{3}(\D|$))/g, '');  // binlik ayıracı at
  body = body.replace(',', '.');                         // kalan virgül ondalık
  let n = Number(body);
  if (!Number.isFinite(n)) return null;
  const suf = (m[2] || '').toLowerCase();
  if (suf === 'k') n *= 1e3;
  if (suf === 'm') n *= 1e6;
  if (suf === 'b') n *= 1e9;
  return n;
}

/** Nokta değeri, doğrulanmış bir iddianın aranan değeriyle örtüşüyor mu? */
function pointBacked(value, checks) {
  for (const c of checks) {
    if (c.verdict !== 'DOGRULANDI') continue;
    const n = toNumber(c.expect);
    if (n == null) continue;
    if (n === value) return c;
    if (Math.abs(n - value) / Math.max(n, value) < 0.005) return c;  // 3M ≈ 3.000.000
  }
  return null;
}

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderChart(chart, checks) {
  const pts = chart.points.map((p) => ({ ...p, backing: pointBacked(p.value, checks) }));
  const drawn = pts.filter((p) => p.backing);
  const dropped = pts.length - drawn.length;

  if (drawn.length < 2) {
    return `<figcaption class="chart-empty">${esc(chart.title)} — `
         + `veri noktaları doğrulanmış iddialarla eşleşmediği için çizilmedi.</figcaption>`;
  }

  const W = 640, H = 240, L = 58, R = 18, T = 34, B = 34;
  const iw = W - L - R, ih = H - T - B;
  const max = Math.max(...drawn.map((p) => p.value));
  const min = Math.min(...drawn.map((p) => p.value), 0);
  const span = (max - min) || 1;
  const x = (i) => L + (drawn.length === 1 ? iw / 2 : (iw * i) / (drawn.length - 1));
  const y = (v) => T + ih - ((v - min) / span) * ih;

  const fmt = (v) => v >= 1e6 ? (v / 1e6).toFixed(v % 1e6 ? 1 : 0) + 'M'
                   : v >= 1e3 ? (v / 1e3).toFixed(v % 1e3 ? 1 : 0) + 'K'
                   : String(v);

  const line = drawn.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const dots = drawn.map((p, i) => {
    const px = x(i).toFixed(1), py = y(p.value).toFixed(1);
    const anchor = i === 0 ? 'start' : i === drawn.length - 1 ? 'end' : 'middle';
    return `    <circle class="dot" cx="${px}" cy="${py}" r="4.5" />\n`
         + `    <text class="val" x="${px}" y="${(+py - 14).toFixed(1)}" text-anchor="${anchor}">${fmt(p.value)}</text>\n`
         + `    <text class="lbl" x="${px}" y="${H - 10}" text-anchor="${anchor}">${esc(p.label)}</text>`;
  }).join('\n');

  const ilk = drawn[0].value, son = drawn[drawn.length - 1].value;
  const degisim = ilk ? Math.round(((son - ilk) / ilk) * 100) : 0;
  const ozet = `${esc(chart.title)}: ${fmt(ilk)} (${esc(drawn[0].label)}) → `
             + `${fmt(son)} (${esc(drawn[drawn.length - 1].label)}), `
             + `%${Math.abs(degisim)} ${degisim < 0 ? 'düşüş' : 'artış'}`;

  return `  <svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${ozet}" preserveAspectRatio="xMidYMid meet">
    <line class="base" x1="${L}" y1="${T + ih}" x2="${W - R}" y2="${T + ih}" />
    <polyline class="line" points="${line}" />
${dots}
  </svg>
  <figcaption>${esc(chart.title)}${dropped ? ` · ${dropped} nokta doğrulanmadığı için çizilmedi` : ''}</figcaption>`;
}

/** Yer tutucu <figure>'ların içini doldur. Tekrar çalıştırılabilir. */
function injectCharts(file, charts, checks) {
  if (!charts?.length) return;
  let md = readFileSync(file, 'utf8');
  let n = 0;
  for (const chart of charts) {
    const re = new RegExp(
      `(<figure class="chart" data-chart="${chart.id.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}">\\n)[\\s\\S]*?(</figure>)`,
    );
    if (!re.test(md)) continue;
    md = md.replace(re, (_m, open, close) => `${open}${renderChart(chart, checks)}\n${close}`);
    n++;
  }
  if (n) writeFileSync(file, md);
  return n;
}

const results = {};
// src/content/radar/<seri>/<tarih>.md
const files = readdirSync(DIR)
  .filter((d) => statSync(join(DIR, d)).isDirectory())
  .flatMap((series) =>
    readdirSync(join(DIR, series))
      .filter((f) => f.endsWith('.md'))
      .map((f) => join(series, f))
  );

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const fm = parseFrontmatter(readFileSync(join(DIR, file), 'utf8'));
  if (!fm) { console.error(`  frontmatter okunamadı: ${file}`); continue; }

  console.log(`\n${slug}  (${fm.claims.length} iddia)`);
  const checked = [];

  for (const c of fm.claims) {
    const age = monthsOld(c.sourceDate);
    const stale = age !== null && age > MAX_AGE_MONTHS;
    let verdict, detail = '';

    if (!c.url) {
      verdict = /taslak|kaynaksız|model/i.test(c.sourceType || '') ? 'KAYNAKSIZ' : 'URL_YOK';
      detail = c.sourceType || '';
    } else {
      const r = await fetchText(c.url);
      if (!r.ok) { verdict = 'ERISILEMEDI'; detail = r.reason; }
      else if (!c.expect) { verdict = 'ERISILDI'; detail = 'beklenen değer tanımlanmamış'; }
      else if (r.text.replace(/\s+/g, ' ').trim().length < 600) {
        // Next.js/Nuxt kabuğu: HTML geldi ama içerik istemcide oluşuyor.
        // "Bulunamadı" demek yanıltıcı olur — doğrulanamadı demek doğru.
        verdict = 'YETERSIZ';
        detail = 'sayfa istemci tarafında render ediliyor';
      }
      else {
        const hay = normalise(r.text);
        const needle = normalise(c.expect);
        if (hay.includes(needle)) verdict = 'DOGRULANDI';
        else {
          verdict = 'BULUNAMADI';
          detail = `"${c.expect}" kaynakta yok`;
          const near = nearestNumber(r.text, c.expect);
          if (near) detail += ` — kaynakta en yakın: "${near}"`;
        }
      }
    }

    const icon = { DOGRULANDI: '✓', BULUNAMADI: '✗', ERISILEMEDI: '✗',
                   URL_YOK: '—', KAYNAKSIZ: '·', ERISILDI: '?', YETERSIZ: '?' }[verdict];
    console.log(`  ${icon} ${verdict.padEnd(12)} ${c.claim.slice(0, 58)}${stale ? `  [${age} ay eski]` : ''}${detail ? `  ${detail}` : ''}`);
    checked.push({ ...c, verdict, detail, ageMonths: age, stale });
  }

  const pass = checked.filter((c) => c.verdict === 'DOGRULANDI').length;
  // YETERSIZ "başarısız" değil — doğrulanamadı. Ayrı sayılıyor.
  const fail = checked.filter((c) => ['BULUNAMADI', 'ERISILEMEDI', 'URL_YOK'].includes(c.verdict)).length;
  const inconclusive = checked.filter((c) => ['YETERSIZ', 'ERISILDI'].includes(c.verdict)).length;
  results[slug] = {
    checkedAt: new Date().toISOString().slice(0, 10),
    total: checked.length,
    passed: pass,
    failed: fail,
    inconclusive,
    unsourced: checked.filter((c) => c.verdict === 'KAYNAKSIZ').length,
    staleCount: checked.filter((c) => c.stale).length,
    claims: checked,
  };
  console.log(`  → ${pass}/${checked.length} doğrulandı, ${fail} başarısız, ${inconclusive} sonuçsuz`);

  // Grafikler: doğrulama sonuçları hazır, yer tutucuları doldur.
  const cizilen = injectCharts(join(DIR, file), fm.charts, checked);
  if (cizilen) {
    const toplam = fm.charts.reduce((n, g) => n + g.points.length, 0);
    const backed = fm.charts.reduce(
      (n, g) => n + g.points.filter((pt) => pointBacked(pt.value, checked)).length, 0);
    console.log(`  ▪ ${cizilen} grafik — ${backed}/${toplam} nokta doğrulanmış iddiaya dayanıyor`);
  }
}

mkdirSync('src/data', { recursive: true });
writeFileSync(OUT, JSON.stringify(results, null, 2) + '\n');
console.log(`\n${Object.keys(results).length} bülten kontrol edildi → ${OUT}`);
