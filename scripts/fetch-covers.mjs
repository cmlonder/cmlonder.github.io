#!/usr/bin/env node
/**
 * Kitap kapaklarını Open Library'den indirir.
 *
 * Kapak KONVANSİYONLA bulunuyor: src/assets/covers/<slug>.jpg
 * Dosya varsa BookCard onu gösteriyor, yoksa tipografik kapağa düşüyor.
 * Frontmatter'a bir şey yazmıyoruz.
 *
 * Kapaklar indirilip REPODA tutuluyor — hotlink yok, gizlilik sorunu yok,
 * kaynak sitenin bir gün kapanması bizi etkilemiyor.
 *
 * Eşleşmeyi kör yapmıyoruz: her kitap için bulunan başlık/yazar ekrana
 * basılıyor ki yanlış kapak gözden kaçmasın.
 *
 * Kullanım: node scripts/fetch-covers.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

const SRC = 'src/content/library';
const OUT = 'src/assets/covers';
mkdirSync(OUT, { recursive: true });

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

async function ara(title, author) {
  const u = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
          + `&author=${encodeURIComponent(author)}&limit=5&fields=title,author_name,cover_i,first_publish_year`;
  const res = await fetch(u, { headers: { 'user-agent': 'cmlonder.com library cover fetch (one-off)' } });
  if (!res.ok) return null;
  const { docs = [] } = await res.json();
  // Başlığı gerçekten tutan ve kapağı olan ilk sonuç.
  return docs.find((d) => d.cover_i && norm(d.title).includes(norm(title).slice(0, 14))) ?? null;
}

let indirilen = 0, atlanan = 0, bulunamayan = 0;

for (const lang of readdirSync(SRC)) {
  for (const f of readdirSync(join(SRC, lang)).filter((x) => x.endsWith('.md'))) {
    const slug = f.replace(/\.md$/, '');
    const hedef = join(OUT, `${slug}.jpg`);
    if (existsSync(hedef)) { atlanan++; continue; }

    const raw = readFileSync(join(SRC, lang, f), 'utf8');
    const m = /^---\n([\s\S]*?)\n---/.exec(raw);
    const d = m ? parseYaml(m[1]) : null;
    if (!d?.title || !d?.author) continue;

    const hit = await ara(d.title, d.author);
    if (!hit) {
      console.warn(`  ? ${d.title} — ${d.author}: kapak bulunamadı`);
      bulunamayan++;
      continue;
    }

    const img = await fetch(`https://covers.openlibrary.org/b/id/${hit.cover_i}-L.jpg`);
    if (!img.ok) { console.warn(`  ? ${d.title}: görsel indirilemedi`); bulunamayan++; continue; }
    const buf = Buffer.from(await img.arrayBuffer());
    if (buf.length < 3000) { console.warn(`  ? ${d.title}: kapak boş görünüyor`); bulunamayan++; continue; }

    writeFileSync(hedef, buf);
    const eslesme = norm(hit.title) === norm(d.title) ? '=' : '~';
    console.log(`  ✓ ${slug}.jpg  ${eslesme} "${hit.title}" — ${(hit.author_name ?? []).join(', ')} (${hit.first_publish_year ?? '?'})  ${Math.round(buf.length / 1024)} KB`);
    indirilen++;
    await new Promise((r) => setTimeout(r, 400));   // API'ye nazik ol
  }
}

console.log(`\n${indirilen} kapak indirildi, ${atlanan} zaten vardı, ${bulunamayan} bulunamadı.`);
if (indirilen) console.log('"~" işaretli satırlarda başlık birebir tutmadı — gözden geçir.');
