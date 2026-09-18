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
let missingImg = 0;
let altsizSlayt = 0;
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

  /*
   * Görsel varlığı gerçekten üretilmiş mi.
   * Gözlenen: sharp kurulu değilken Astro UYARI basıp geçiyor, <img>
   * var olmayan bir .webp'yi gösteriyor ve build "başarılı" görünüyor.
   * Sessiz kırılma; burada yakalanmalı.
   */
  for (const [, src] of html.matchAll(/<img[^>]+src="(\/_astro\/[^"]+)"/g)) {
    if (!known.has(src)) {
      console.error(`EKSİK GÖRSEL  ${from}  ->  ${src}`);
      missingImg++;
    }
  }

  /*
   * Slayt görselinin alt metni. Sunum PDF'lerinde metin katmanı yok —
   * her sayfa tek görsel. Transcript doldurulmazsa slayt sayfada sessizce
   * "boş" durur: ekran okuyucu okumaz, pagefind indekslemez. Görsel var
   * diye build yeşil geçtiği için burada yakalanmalı.
   */
  for (const [fig] of html.matchAll(/<figure[^>]+data-n="[^"]*"[^>]*>[\s\S]*?<\/figure>/g)) {
    const alt = /<img[^>]+alt="([^"]*)"/.exec(fig)?.[1] ?? '';
    // "Slayt 4: " / "Slide 4: " kalıbından sonrası boşsa transcript yok.
    if (!alt.replace(/^\s*\S+\s*\d+\s*:?\s*/, '').trim()) {
      console.error(`ALTSIZ SLAYT  ${from}`);
      altsizSlayt++;
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
console.log(`eksik görsel:      ${missingImg}`);
console.log(`altsız slayt:      ${altsizSlayt}`);
console.log(`başlık atlaması:   ${headingProblems.length}`);
for (const h of headingProblems.slice(0, 10)) console.error(`  ${h}`);
if (placeholders) console.log(`yer tutucu içerik: ${placeholders} (bilgi amaçlı)`);

if (broken || missingImg || altsizSlayt || headingProblems.length) {
  console.error('\nBuild doğrulaması başarısız.');
  process.exit(1);
}
console.log('Build doğrulaması geçti.');
