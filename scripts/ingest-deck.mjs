/**
 * Sunum yutucu: PDF -> slayt görselleri + yazıya yapıştırılacak satırlar.
 *
 *   pnpm deck <slug> <pdf-yolu>
 *
 * Çıktı public/decks/<slug>/ altına düşer:
 *   NN.webp       1600px — yazıda gösterilen
 *   NN@800.webp   800px  — dar ekran için srcset
 *   slides.json   ölçüler; remark eklentisi width/height'ı oradan okuyor
 *
 * Sunum AYRI BİR SAYFA DEĞİL. Slaytlar yazının içine, anlattıkları yerin
 * yanına giriyor. Bu yüzden burada bir içerik dosyası üretilmiyor; script
 * sadece görselleri hazırlayıp yapıştırılacak markdown satırlarını yazıyor:
 *
 *   ![Slaytın ne gösterdiği](/decks/<slug>/04.webp "Altına düşecek cümle")
 *
 * Gerisini remark-slides.mjs yapıyor: figure, srcset, ölçü, figcaption.
 *
 * NotebookLM PDF'lerinde metin katmanı yok — her sayfa tek bir görsel.
 * alt metnini ve altyazıyı yazan kişi slayta bakmak zorunda; script
 * bunları uyduramaz, boş bırakır.
 */
import { mkdirSync, existsSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const [slug, pdf] = process.argv.slice(2);

if (!slug || !pdf) {
  console.error('kullanım: pnpm deck <slug> <pdf-yolu>');
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

const GENIS = 1600;
const DAR = 800;
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
z = ${GENIS} / d[0].rect.width
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

const dizin = `public/decks/${slug}`;
mkdirSync(dizin, { recursive: true });

const slaytlar = [];
let toplam = 0;

for (let i = 1; i <= sayfa; i++) {
  const n = String(i).padStart(2, '0');
  const kaynak = join(gecici, `${n}.png`);

  const genis = await sharp(kaynak).webp({ quality: 82 }).toFile(join(dizin, `${n}.webp`));
  const dar = await sharp(kaynak).resize({ width: DAR }).webp({ quality: 80 })
    .toFile(join(dizin, `${n}@${DAR}.webp`));

  slaytlar.push({ n: i, w: genis.width, h: genis.height });
  toplam += genis.size + dar.size;
}
rmSync(gecici, { recursive: true, force: true });

writeFileSync(join(dizin, 'slides.json'), JSON.stringify({ slug, slides: slaytlar }, null, 2) + '\n');

console.log(`${sayfa} slayt -> ${dizin}/  (${(toplam / 1048576).toFixed(2)} MB)\n`);
console.log('Yazıya yapıştır — alt metnini ve altyazıyı slayta bakarak doldur:\n');
for (const s of slaytlar) {
  console.log(`![](/decks/${slug}/${String(s.n).padStart(2, '0')}.webp "")`);
}
