/**
 * Sunum yutucu: PDF -> slayt görselleri + slayt iskeleti.
 *
 *   pnpm deck <slug> <pdf-yolu> [--lang tr]
 *
 * Ne yapar:
 *   1. PDF'in her sayfasını 1600px genişlikte render eder (python3 + PyMuPDF)
 *   2. sharp ile WebP'ye çevirip src/assets/decks/<slug>/NN.webp altına yazar
 *   3. Orijinal PDF'i public/decks/<slug>.pdf olarak kopyalar
 *   4. src/content/decks/<lang>/<slug>.md iskeletini yazar
 *
 * Transcript'i DOLDURMAZ. NotebookLM sunumlarında metin katmanı yok — her
 * sayfa tek bir görsel. Başlık ve sunucu notları slayta bakılarak yazılır;
 * o yüzden iskelette boş bırakılır ve `transcript: none` ile işaretlenir.
 *
 * Var olan deck dosyasının üzerine YAZMAZ: transcript emeği kaybolmasın.
 * Görseller yeniden üretilir, metin dosyası korunur.
 */
import { mkdirSync, existsSync, writeFileSync, copyFileSync, statSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const [slug, pdf, ...rest] = process.argv.slice(2);
const lang = rest.includes('--lang') ? rest[rest.indexOf('--lang') + 1] : 'tr';

if (!slug || !pdf) {
  console.error('kullanım: pnpm deck <slug> <pdf-yolu> [--lang tr]');
  process.exit(1);
}
if (!existsSync(pdf)) {
  console.error(`PDF bulunamadı: ${pdf}`);
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('slug kebab-case ve ASCII olmalı');
  process.exit(1);
}

const GENISLIK = 1600;
const gecici = join(tmpdir(), `deck-${slug}-${Date.now()}`);
mkdirSync(gecici, { recursive: true });

// PyMuPDF sharp gibi sessizce eksik kalmasın: yoksa burada, yüksek sesle dur.
const PY = `
import sys
try:
    import fitz
except ImportError:
    sys.exit("PyMuPDF yok. Kurulum: pip3 install --user PyMuPDF")
d = fitz.open(sys.argv[1])
z = ${GENISLIK} / d[0].rect.width
for i, p in enumerate(d):
    p.get_pixmap(matrix=fitz.Matrix(z, z)).save(f"{sys.argv[2]}/{i+1:02d}.png")
print(d.page_count)
`;

let sayfa;
try {
  sayfa = Number(execFileSync('python3', ['-c', PY, pdf, gecici], { encoding: 'utf8' }).trim());
} catch (e) {
  console.error(e.stderr?.toString().trim() || e.message);
  process.exit(1);
}

const gorselDir = `src/assets/decks/${slug}`;
mkdirSync(gorselDir, { recursive: true });
mkdirSync('public/decks', { recursive: true });

let toplam = 0;
for (let i = 1; i <= sayfa; i++) {
  const n = String(i).padStart(2, '0');
  const cikti = join(gorselDir, `${n}.webp`);
  await sharp(join(gecici, `${n}.png`)).webp({ quality: 82 }).toFile(cikti);
  toplam += statSync(cikti).size;
}
rmSync(gecici, { recursive: true, force: true });

copyFileSync(pdf, `public/decks/${slug}.pdf`);
const pdfMb = (statSync(pdf).size / 1048576).toFixed(1);

const hedef = `src/content/decks/${lang}/${slug}.md`;
mkdirSync(`src/content/decks/${lang}`, { recursive: true });

if (existsSync(hedef)) {
  console.log(`${sayfa} slayt yenilendi — ${hedef} korundu (transcript silinmedi).`);
} else {
  const slaytlar = Array.from({ length: sayfa }, (_, i) =>
    `  - n: ${i + 1}\n    title: ""\n    notes: ""`).join('\n');
  writeFileSync(hedef, `---
title: ""
source: "NotebookLM"
pdf: "/decks/${slug}.pdf"
pdfSize: "${pdfMb} MB"
# Slayt metinleri PDF'te yok (her sayfa tek görsel). Doldurunca
# transcript'i agent ya da human yap; boş kaldığı sürece none.
transcript: "none"
slides:
${slaytlar}
---
`);
  console.log(`iskelet yazıldı: ${hedef}`);
}

console.log(`${sayfa} slayt -> ${gorselDir}/  (${(toplam / 1048576).toFixed(2)} MB WebP, PDF ${pdfMb} MB)`);
