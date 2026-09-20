/**
 * Radar sınıflandırmasının tek sözlüğü — Spark ne yazarsa yazsın, siteye
 * girmeden buradan geçer. Hem check-radar (girişte) hem check-topics
 * (doğrulamada) aynı tabloyu okur; ikisi ayrı liste tutmaz.
 *
 * Neden: Spark 21 bültende 35 farklı etiket yazdı; "devtool" ile
 * "gelistirici-araci", "productized-service" ile "hizmet-urunu" aynı
 * şeydi. Ajanın kelime seçimini kontrol edemiyoruz; normalize ediyoruz.
 */

/** Etiket takma adı -> site konusu. Sağ taraf ya sitede zaten var ya da Türkçe kebab ürün türü. */
export const TOPIC_ALIASES = {
  // İngilizce/Türkçe ikizler
  'devtool': 'tools', 'devtools': 'tools', 'ai-tools': 'tools',
  'productized-service': 'hizmet-urunu',
  'chrome-extension': 'eklenti', 'extension': 'eklenti',
  'ai-directory': 'dizin', 'directory': 'dizin',
  'newsletter': 'bulten', 'substack': 'bulten', 'yayin': 'bulten',
  'kurs': 'bilgi-urunu', 'course': 'bilgi-urunu',
  'tasarim': 'design',
  'indie-hacker': 'solo-company', 'indie-hackers': 'solo-company', 'solo': 'solo-company',
  'ai': 'ai-news',
  'scale': 'scale-and-performance',
  'otomasyon': 'automation',
  'marketplace': 'pazar-yeri',
  'developer-tools': 'tools', 'mikro-saas': 'saas', 'ai-saas': 'saas', 'medya': 'icerik',
  'veri-urunu': 'dizin-veri', 'dijital-urun': 'dijital-varlik',
  'architecture': 'solution-architecture', 'software-architecture': 'solution-architecture',
  'opensource': 'open-source', 'oss': 'open-source',
  'indie-game': 'oyun', 'indie-games': 'oyun', 'gamedev': 'oyun', 'game-dev': 'oyun',
  'solo-founder': 'solo-company', 'bootstrapped': 'solo-company', 'ai-integration': 'ai-news',
  'solo-dev': 'solo-company', 'steam-next-fest': 'next-fest', 'conversion-rate': 'conversion',
};

/**
 * Seri başına konu kimliği alanı: aynı değer seride ikinci kez gelirse
 * dosya yayına alınmaz. "Son 30 gün tekrar seçme" kuralı prompt'ta
 * yaşayamaz (ajanın hafızası yok); burada yaşar.
 */
export const SUBJECT_KEY = {
  'paper-to-prod':    { key: 'arxiv',    required: true },   // "2403.12345"
  'github-radar':     { key: 'repo',     required: true },   // "owner/name" (prompt v2.1'den beri zorunlu)
  'indie-postmortem': { key: 'game',     required: true },   // oyun adı, kebab (prompt v2.2'den beri zorunlu)
  'solo-founder':     { key: 'subjects', required: true,  also: ['saas'] },         // ["urun-adi", ...]; iki seri aynı şirketi paylaşmasın
  'saas':             { key: 'subjects', required: true,  also: ['solo-founder'] },
};

const kebabKimlik = (v) => String(v).trim().toLowerCase().replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\.git$/, '')
  .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9/]+/g, '-').replace(/^-|-$/g, '');

/** Kimlik değerlerini normalize eder (liste ya da tek), boşsa [] döner. */
export function kimlikler(fm, seri) {
  const t = SUBJECT_KEY[seri]; if (!t) return [];
  const v = fm[t.key]; if (v == null || v === '') return [];
  const liste = Array.isArray(v) ? v : [v];
  return liste.map((x) => t.key === 'arxiv' ? String(x) : kebabKimlik(x)).filter(Boolean);
}

/** Seri sabiti olarak yazılan kategoriler: ürün türü değil, bilgi taşımıyor. */
export const CATEGORY_DROP = new Set(['applied-research', 'research', 'paper']);

/** Hiçbir şey söylemeyen etiketler: seri adının tekrarı ya da her yazıya yapışan jenerikler. */
export const TOPIC_DROP = new Set(['github', 'engineering', 'software', 'programming', 'tech', 'technology', 'postmortem', 'indie-game']);

/** Kategori takma adı -> RADAR_CATEGORY anahtarı (src/config.ts). */
export const CATEGORY_ALIASES = {
  'icerik-medya': 'icerik', 'topluluk-egitim': 'icerik', 'bilgi-urunu': 'icerik',
  'mikro-e-ticaret': 'e-ticaret', 'e-commerce': 'e-ticaret',
  'marketplace': 'pazar-yeri',
  'devtool': 'gelistirici-araci', 'developer-tool': 'gelistirici-araci',
  'chrome-extension': 'eklenti', 'extension': 'eklenti',
  'automation': 'otomasyon',
  'productized-service': 'hizmet-urunu',
  'directory': 'dizin-veri', 'dizin': 'dizin-veri',
  'gamedev': 'oyun', 'game': 'oyun', 'games': 'oyun', 'indie-game': 'oyun', 'video-game': 'oyun',
};

const kebab = (s) => String(s).trim().toLowerCase()
  .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Frontmatter'ı yerinde normalize eder, değişen alanların listesini döner.
 * - tags -> topics (eski sözleşme), küçük harf kebab, takma ad çözümü,
 *   tekrar ve kategoriyle aynı olanlar düşer, en çok 6.
 * - category takma adı çözülür.
 */
export function normalizeRadar(fm, seri = '') {
  const degisen = [];
  // Kategori serinin kendisiyse (github-radar serisinde category: github-radar) bilgi taşımıyor.
  if (fm.category && ((seri && kebab(fm.category) === seri) || CATEGORY_DROP.has(kebab(fm.category)))) { degisen.push(`category ${fm.category} silindi (seri sabiti)`); delete fm.category; }
  if (fm.category) {
    const c = CATEGORY_ALIASES[kebab(fm.category)] ?? kebab(fm.category);
    if (c !== fm.category) { degisen.push(`category ${fm.category} -> ${c}`); fm.category = c; }
  }
  if (typeof fm.arxiv === 'string') {
    const a = fm.arxiv.trim().replace(/^arxiv:\s*/i, '').replace(/v\d+$/i, '');
    if (a !== fm.arxiv) { degisen.push(`arxiv ${fm.arxiv} -> ${a}`); fm.arxiv = a; }
  }
  const ham = [...(Array.isArray(fm.topics) ? fm.topics : []), ...(Array.isArray(fm.tags) ? fm.tags : [])];
  const gorulen = new Set();
  const temiz = [];
  for (const t of ham) {
    const k = kebab(t); if (!k) continue;
    const son = TOPIC_ALIASES[k] ?? k;
    if (TOPIC_DROP.has(son) || son === seri) continue;
    // Kategorinin kendisi ya da onun bir takma adı konu olarak tekrar edilmez.
    const kategoriGibi = son === fm.category || (CATEGORY_ALIASES[son] ?? son) === fm.category;
    if (kategoriGibi || gorulen.has(son)) continue;
    gorulen.add(son); temiz.push(son);
  }
  const yeni = temiz.slice(0, 6);
  if (JSON.stringify(yeni) !== JSON.stringify(fm.topics ?? []) || 'tags' in fm) {
    degisen.push(`topics [${ham.join(', ')}] -> [${yeni.join(', ')}]`);
    fm.topics = yeni; delete fm.tags;
  }
  return degisen;
}
