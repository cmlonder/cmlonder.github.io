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
import { createHash } from 'node:crypto';

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


/*
 * Yayın anındaki sonuç DONDURULUR.
 *
 * Gözlenen: TrustMRR canlı bir ciro takipçisi; dün "$6,441" yazan sayfa
 * bugün "$6,491" yazıyor. Her çalıştırmada her şeyi yeniden kontrol
 * edersek yayınlanmış bülten, kaynağı değiştikçe kendiliğinden
 * "doğrulanmamış"a dönüşür. Oysa iddia O GÜN doğruydu ve sonucun
 * yanında tarihi duruyor.
 *
 * Bu yüzden: iddialar değişmediyse saklanan sonuç korunur. Tam yeniden
 * kontrol isteniyorsa --recheck.
 */
const RECHECK = process.argv.includes('--recheck');
let previous = {};
try { previous = JSON.parse(readFileSync(OUT, 'utf8')); } catch {}
const claimsHash = (claims) =>
  createHash('sha1').update(JSON.stringify(claims)).digest('hex').slice(0, 12);

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

  const hash = claimsHash(fm.claims);
  const prev = previous[slug];
  if (!RECHECK && prev?.claimsHash === hash && prev.claims?.length) {
    // İddialar değişmemiş; yayın anındaki sonuç geçerli.
    results[slug] = prev;
    console.log(`\n${slug}  (${fm.claims.length} iddia)`);
    console.log(`  → ${prev.passed}/${prev.total} — ${prev.checkedAt} tarihinde dondurulmuş`);
    continue;
  }

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
      let r = await fetchText(c.url);
      /*
       * Bot duvarları yaygın (gözlenen: Medium HTTP 403). Kaynağın
       * kendisine erişilemiyorsa iddia hâlâ kontrol edilebilir — sadece
       * nereden baktığımız değişir, ve bunu sonuçta SÖYLÜYORUZ.
       *
       * Doğrudan erişilemezse Wayback arşivine düşüyoruz. Arşiv de
       * yoksa ERISILEMEDI diyoruz — tahmin etmiyoruz.
       * (r.jina.ai denendi, artık 403 veriyor; eklenmedi.)
       */
      let via = null;
      if (!r.ok) {
        const w = await fetchText(
          `https://archive.org/wayback/available?url=${encodeURIComponent(c.url)}`);
        let snap = null;
        try { snap = JSON.parse(w.text ?? '{}')?.archived_snapshots?.closest?.url; } catch {}
        if (snap) {
          const s2 = await fetchText(snap);
          if (s2.ok) { r = s2; via = 'arşiv kopyası'; }
        }
      }
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
        if (hay.includes(needle)) {
          verdict = 'DOGRULANDI';
          if (via) detail = `kaynağa erişilemedi, ${via} üzerinden teyit edildi`;
        }
        else {
          verdict = 'BULUNAMADI';
          detail = `"${c.expect}" kaynakta yok${via ? ` (${via})` : ''}`;
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
    claimsHash: hash,
  };
  console.log(`  → ${pass}/${checked.length} doğrulandı, ${fail} başarısız, ${inconclusive} sonuçsuz`);

}

mkdirSync('src/data', { recursive: true });
writeFileSync(OUT, JSON.stringify(results, null, 2) + '\n');
console.log(`\n${Object.keys(results).length} bülten kontrol edildi → ${OUT}`);
