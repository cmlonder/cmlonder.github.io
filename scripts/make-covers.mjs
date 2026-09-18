/**
 * Film ve oyun kapaklarını üretir.
 *
 * Gerçek afiş kullanamıyoruz — hepsi telifli. Onun yerine sitenin kendi
 * paletinde tipografik kapak basıyoruz. Kitaplarda gerçek kapak fotoğrafı
 * var, o yüzden bunların da BAŞLIK TAŞIMASI gerekiyor; başlıksız soyut
 * bir döşeme kitapların yanında yabancı duruyor.
 *
 * Çıktı konvansiyona uyuyor: src/assets/covers/<slug>.jpg — ShelfCard
 * dosyayı adından buluyor, frontmatter'a alan eklemek gerekmiyor.
 * İleride gerçek bir görsel koyulmak istenirse aynı ada yazmak yeterli.
 *
 * Bir kez çalıştırılıp sonuç commit'leniyor. CI bunu çalıştırmıyor, o
 * yüzden runner'da sistem fontu olup olmaması önemli değil.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';

const KREM = '#f6f5f1';
/* Zeminler koyu: üstüne krem yazı gelince kontrast rahat geçiyor. */
const ZEMIN = ['#5f023e', '#1c1b18', '#00707f', '#960462', '#353534', '#0d3b42'];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Slug'dan deterministik sayı — aynı girdi her zaman aynı kapağı alsın. */
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Serif ortalama harf genişliği ~0.5em; açgözlü sarma bunun için yeterli. */
function sar(metin, puntoda, genislik) {
  const kelimeler = metin.split(/\s+/);
  const maxKarakter = Math.max(6, Math.floor(genislik / (puntoda * 0.5)));
  const satirlar = [];
  let s = '';
  for (const k of kelimeler) {
    if (s && (s + ' ' + k).length > maxKarakter) { satirlar.push(s); s = k; }
    else s = s ? s + ' ' + k : k;
  }
  if (s) satirlar.push(s);
  return satirlar;
}

/* Kompozisyon aileleri. Hepsi aynı dili konuşuyor ama tekrar etmiyor. */
function sus(tip, W, H, renk) {
  const o = `stroke="${renk}" fill="none" stroke-width="2" opacity=".55"`;
  switch (tip) {
    case 0: return Array.from({ length: 5 }, (_, i) =>
      `<circle cx="${W * .78}" cy="${H * .18}" r="${28 + i * 22}" ${o}/>`).join('');
    case 1: return Array.from({ length: 7 }, (_, i) =>
      `<line x1="${W * .12 + i * 26}" y1="${H * .1}" x2="${W * .12 + i * 26}" y2="${H * .26}" ${o}/>`).join('');
    case 2: return `<path d="M0,${H * .3} Q${W * .25},${H * .18} ${W * .5},${H * .3} T${W},${H * .3}" ${o}/>` +
                   `<path d="M0,${H * .36} Q${W * .25},${H * .24} ${W * .5},${H * .36} T${W},${H * .36}" ${o}/>`;
    case 3: return `<rect x="${W * .12}" y="${H * .1}" width="${W * .3}" height="${H * .16}" ${o}/>` +
                   `<rect x="${W * .2}" y="${H * .16}" width="${W * .3}" height="${H * .16}" ${o}/>`;
    case 4: return `<circle cx="${W * .5}" cy="${H * .2}" r="${H * .09}" ${o}/>` +
                   `<ellipse cx="${W * .5}" cy="${H * .2}" rx="${W * .34}" ry="${H * .05}" ${o}/>`;
    default: return Array.from({ length: 4 }, (_, i) =>
      `<path d="M${W * .1},${H * (.28 - i * .05)} L${W * .5},${H * (.1 - i * .02)} L${W * .9},${H * (.28 - i * .05)}" ${o}/>`).join('');
  }
}

function kapak({ slug, baslik, altSatir, W, H, sira }) {
  const h = hash(slug);
  /* Zemin ve süs AYNI hash'ten seçilince ikisi birlikte tekrar ediyordu:
     aynı rengi alan iki kapak aynı süsü de alıp ikiz görünüyordu. */
  /* Renk hash'ten seçilince rafta dört bordo yan yana gelebiliyordu.
     Sıra numarasından seçmek komşuların farklı olmasını garanti ediyor. */
  const zemin = ZEMIN[sira % ZEMIN.length];
  /* 5 ile 6 aralarında asal: komşu iki kapak asla aynı süsü almıyor.
     Hash'i de katıyorum ki desen tahmin edilebilir bir döngüye düşmesin. */
  const susTipi = (sira * 5 + (hash(slug + '~') >> 3)) % 6;
  const punto = baslik.length > 26 ? W * .095 : baslik.length > 14 ? W * .12 : W * .155;
  const satirlar = sar(baslik, punto, W * .78);
  const blokY = H * .58 - (satirlar.length - 1) * punto * .56;
  /* Çizgi sabit yerde durunca iki satırlık başlıklar onun içine giriyordu. */
  const cizgiY = blokY - punto * 1.05;
  /* Uzun yönetmen adları kenardan taşıyordu. */
  const altPunto = Math.min(W * .046, (W * .78) / (altSatir.length * .82));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${zemin}"/>
  ${sus(susTipi, W, H, KREM)}
  <line x1="${W * .11}" y1="${cizgiY}" x2="${W * .34}" y2="${cizgiY}" stroke="${KREM}" stroke-width="3"/>
  ${satirlar.map((s, i) => `<text x="${W * .11}" y="${blokY + i * punto * 1.12}" fill="${KREM}" font-family="Georgia, 'Times New Roman', serif" font-size="${punto}" font-weight="600">${esc(s)}</text>`).join('\n  ')}
  <text x="${W * .11}" y="${H * .9}" fill="${KREM}" opacity=".72" font-family="Helvetica, Arial, sans-serif" font-size="${altPunto}" letter-spacing="${altPunto * .13}" textLength="${Math.min(W * .78, altSatir.length * altPunto * .78)}" lengthAdjust="spacingAndGlyphs">${esc(altSatir.toUpperCase())}</text>
</svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true });
}

let n = 0;
for (const [tur, W, H] of [['films', 600, 900], ['games', 600, 800]]) {
  for (const dosya of readdirSync(`src/content/${tur}/tr`).filter((f) => f.endsWith('.md'))) {
    const slug = dosya.replace(/\.md$/, '');
    const fm = parse(readFileSync(`src/content/${tur}/tr/${dosya}`, 'utf8').split('---')[1]);
    const alt = [fm.director ?? fm.studio ?? fm.developer, fm.year].filter(Boolean).join(' · ');
    const buf = await kapak({ slug, baslik: fm.title, altSatir: alt || String(fm.year ?? ''),
                              W, H, sira: fm.order ?? n }).toBuffer();
    writeFileSync(`src/assets/covers/${slug}.jpg`, buf);
    n++;
  }
}
console.log(`  ${n} kapak üretildi -> src/assets/covers/`);
