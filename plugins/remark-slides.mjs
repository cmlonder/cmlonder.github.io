/**
 * Markdown görselini figure'a çevirir — sunum slaytları yazının içinde.
 *
 * Yazar düz markdown yazıyor:
 *
 *   ![Slaytın ne gösterdiği](/decks/crs-evolution/04.webp "Altına düşecek cümle")
 *
 * Çıkan HTML: <figure class="slide"> + srcset + width/height + <figcaption>.
 *
 * Neden eklenti: slaytı yazının içine koymanın tek yolu markdown'a ham HTML
 * yazmaktı — her slayt için altı satır, ve alt metnini unutmak kolay. Burada
 * satır tek ve alt metni ZORUNLU: boşsa build durur.
 *
 * Ölçüler public/decks/<slug>/slides.json'dan okunuyor (`pnpm deck` yazıyor).
 * width/height olmadan sayfa slayt yüklenirken zıplıyor.
 *
 * Bu bir unified/remark eklentisi DEĞİL: Astro 7'nin varsayılan markdown
 * işleyicisi Sätteri ve kendi ziyaretçi API'si var. Klasik remarkPlugins'e
 * geçmek bütün sitenin işleyicisini değiştirmek demekti; slayt için o bedel
 * ödenmez. Dosya adı alışkanlıktan böyle.
 */
import { readFileSync, existsSync } from 'node:fs';

const KOK = '/decks/';
const YOL = /^\/decks\/([a-z0-9-]+)\/(\d{2})\.webp$/;
const bellek = new Map();

function olculer(slug) {
  if (!bellek.has(slug)) {
    const yol = `public/decks/${slug}/slides.json`;
    if (!existsSync(yol)) {
      throw new Error(`slaytlar: ${yol} yok — 'pnpm deck ${slug} <pdf>' çalıştırıldı mı?`);
    }
    const m = new Map();
    for (const s of JSON.parse(readFileSync(yol, 'utf8')).slides) {
      m.set(String(s.n).padStart(2, '0'), s);
    }
    bellek.set(slug, m);
  }
  return bellek.get(slug);
}

const kacir = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Sätteri mdast eklentisi: tek başına duran slayt görselini figure yapar. */
export const slaytlar = {
  name: 'slaytlar',

  paragraph(node) {
    // Paragrafta görselden başka bir şey varsa karışmıyoruz.
    const cocuk = (node.children ?? []).filter(
      (c) => c.type !== 'text' || c.value.trim());
    if (cocuk.length !== 1 || cocuk[0].type !== 'image') return;

    const img = cocuk[0];
    if (!img.url?.startsWith(KOK)) return;

    const m = YOL.exec(img.url);
    if (!m) throw new Error(`slaytlar: beklenmeyen slayt yolu "${img.url}"`);

    const [, slug, no] = m;
    const olcu = olculer(slug).get(no);
    if (!olcu) throw new Error(`slaytlar: ${slug} içinde ${no}. slayt yok`);

    // Alt metni pazarlık konusu değil: slaytın içindeki her şey görsel.
    if (!img.alt?.trim()) throw new Error(`slaytlar: ${img.url} için alt metni boş`);

    const dar = img.url.replace(/\.webp$/, '@800.webp');
    const altyazi = img.title?.trim();

    return {
      mdxExpressions: false,
      raw:
        `<figure class="slide">` +
        `<img src="${img.url}" srcset="${dar} 800w, ${img.url} ${olcu.w}w" ` +
        `sizes="(max-width: 46rem) 92vw, 42rem" ` +
        `width="${olcu.w}" height="${olcu.h}" loading="lazy" decoding="async" ` +
        `alt="${kacir(img.alt.trim())}">` +
        (altyazi ? `<figcaption>${kacir(altyazi)}</figcaption>` : '') +
        `</figure>`,
    };
  },
};
