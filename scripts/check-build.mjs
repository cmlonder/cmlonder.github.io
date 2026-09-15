/**
 * Build sonrası doğrulama. Bağımlılık yok, Node'un kendisiyle çalışır.
 *   node scripts/check-build.mjs
 * Kırık iç link veya başlık atlaması bulursa 1 ile çıkar — CI'ı durdurur.
 * Yer tutucu içerik sayısı sadece raporlanır, hata değildir.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const DIST = 'dist';
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(DIST);
const htmls = files.filter((f) => f.endsWith('.html'));

const urlOf = (f) =>
  '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\/$/, '');

const known = new Set([
  ...htmls.map((f) => urlOf(f) || '/'),
  ...files.filter((f) => extname(f) !== '.html').map((f) => '/' + relative(DIST, f)),
]);

let broken = 0;
const headingProblems = [];

for (const f of htmls) {
  const html = readFileSync(f, 'utf8');
  const from = urlOf(f) || '/';

  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#|data:)/.test(href)) continue;
    const target = href.split('#')[0].replace(/\/$/, '') || '/';
    if (!known.has(target)) {
      console.error(`KIRIK LİNK  ${from}  ->  ${href}`);
      broken++;
    }
  }

  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      headingProblems.push(`${from}  h${levels[i - 1]} -> h${levels[i]}`);
      break;
    }
  }
}

// Yer tutucular .md aynalarından sayılır — hata değil, sadece hatırlatma.
const placeholders = files
  .filter((f) => f.endsWith('.md') && !f.includes('/legacy/'))
  .filter((f) => /placeholder/i.test(readFileSync(f, 'utf8'))).length;

console.log(`\n${htmls.length} sayfa tarandı`);
console.log(`kırık link:        ${broken}`);
console.log(`başlık atlaması:   ${headingProblems.length}`);
for (const h of headingProblems.slice(0, 10)) console.error(`  ${h}`);
if (placeholders) console.log(`yer tutucu içerik: ${placeholders} (bilgi amaçlı)`);

if (broken || headingProblems.length) {
  console.error('\nBuild doğrulaması başarısız.');
  process.exit(1);
}
console.log('Build doğrulaması geçti.');
