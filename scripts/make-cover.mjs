#!/usr/bin/env node
/**
 * Kapağı olmayan bültenler için görsel üretir.
 *
 * Spark görsel üretmiyor — bir araştırma/yazma ajanı, Drive'a ikili
 * dosya bırakması beklenen bir yetenek değil. Bu yüzden kapak burada,
 * boru hattında üretiliyor.
 *
 * Kapak KONVANSİYONLA bulunuyor: src/assets/radar/<seri>-<tarih>.png
 * Dosya varsa sayfa onu gösteriyor. Frontmatter'a dokunmuyoruz —
 * Spark'ın yazdığı dosya değiştirilmiyor.
 *
 * GEMINI_API_KEY yoksa hiçbir şey yapmadan çıkar. Görsel üretimi
 * yayını ASLA engellemez: kapak isteğe bağlı.
 *
 * Kullanım: GEMINI_API_KEY=... node scripts/make-cover.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

const KEY = process.env.GEMINI_API_KEY;
const DIR = 'src/content/radar';
const OUT = 'src/assets/radar';
// Sırayla denenir; ilki çalışmazsa diğerine geçilir.
const MODELS = ['gemini-2.5-flash-image', 'imagen-4.0-generate-001'];

if (!KEY) { console.log('GEMINI_API_KEY yok — kapak üretimi atlandı.'); process.exit(0); }
if (!existsSync(DIR)) process.exit(0);
mkdirSync(OUT, { recursive: true });

/** Yazının konusundan görsel istemi. Sitenin paletine ve tonuna sabitli. */
function istem(title, summary) {
  return [
    'A wide, abstract, atmospheric editorial cover illustration.',
    `Theme, interpreted loosely and symbolically: ${summary}`,
    'Style: muted warm palette — cream, soft clay, deep crimson accent, muted teal.',
    'Textured, printmaking / risograph feel. Soft grain. Calm and restrained.',
    'STRICT CONSTRAINTS: absolutely no people, no faces, no human figures or body parts.',
    'No text, no letters, no numbers, no logos, no brand marks, no UI or screenshots.',
    'Not photorealistic. Purely decorative and conceptual.',
    'Composition: wide 16:9 landscape, clear focal point, generous negative space.',
  ].join(' ');
}

async function uret(model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) return { ok: false, reason: `HTTP ${res.status} ${(await res.text()).slice(0, 180)}` };
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) return { ok: false, reason: 'yanıtta görsel yok: ' + JSON.stringify(data).slice(0, 180) };
  return { ok: true, bytes: Buffer.from(img.inlineData.data, 'base64') };
}

let uretilen = 0;

for (const series of readdirSync(DIR, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const name of readdirSync(join(DIR, series.name)).filter((f) => f.endsWith('.md'))) {
    const date = name.replace(/\.md$/, '');
    const hedef = join(OUT, `${series.name}-${date}.png`);
    if (existsSync(hedef)) continue;

    const raw = readFileSync(join(DIR, series.name, name), 'utf8');
    const m = /^---\n([\s\S]*?)\n---\n/.exec(raw);
    if (!m) continue;
    let fm; try { fm = parseYaml(m[1]); } catch { continue; }
    if (!fm?.summary) continue;

    const prompt = istem(fm.title, fm.summary);
    let son = null;
    for (const model of MODELS) {
      const r = await uret(model, prompt);
      if (r.ok) {
        writeFileSync(hedef, r.bytes);
        console.log(`✓ ${hedef}  (${model}, ${Math.round(r.bytes.length / 1024)} KB)`);
        uretilen++;
        son = null;
        break;
      }
      son = `${model}: ${r.reason}`;
    }
    // Kapak isteğe bağlı — üretilemezse uyar, yayını durdurma.
    if (son) console.warn(`! ${date} için kapak üretilemedi — ${son}`);
  }
}

console.log(`${uretilen} kapak üretildi.`);
