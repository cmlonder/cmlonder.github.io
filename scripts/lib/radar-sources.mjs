/**
 * Kaynak bölümü ve atıf normalizasyonu — Spark'ın iki farklı prompt'u iki
 * farklı biçim yazıyor:
 *
 *   Solo/SaaS:  gövdede <sup><a href="URL">1</a></sup>, sonda "1. [ad](url)"
 *   GitHub:     gövdede düz "[1]", sonda "[1] https://…" düz satırlar
 *
 * İkincisi Markdown'da tek paragrafa katlanıyor (satır satır görünmüyor)
 * ve atıflar tıklanamıyor. Burada hepsi ilk biçime çevriliyor. Kural:
 * prompt'u düzeltmek yerine kapıda normalize et — ajanın kelime seçimi
 * gibi biçim seçimi de bizim elimizde değil.
 */

const BASLIK = /^##\s+(Kaynaklar|Sources)\s*$/m;

/** "[1] url", "[1]: url", "1) url", "1. url", "1. [ad](url)" -> { n, ad, url } */
function satirAyristir(satir) {
  const m = /^\s*(?:\[(\d+)\]:?|(\d+)[.)])\s+(.*?)\s*$/.exec(satir);
  if (!m) return null;
  const n = Number(m[1] ?? m[2]);
  const kalan = m[3];
  const link = /^\[([^\]]+)\]\((\S+?)\)\s*(.*)$/.exec(kalan);   // [ad](url) [ek]
  if (link) return { n, ad: link[1], url: link[2], ek: link[3] };
  const url = /(https?:\/\/\S+)/.exec(kalan);
  if (!url) return { n, ad: kalan, url: null, ek: '' };
  const ad = kalan.replace(url[1], '').replace(/[\s—–:-]+$/, '').replace(/^[\s—–:-]+/, '').trim();
  return { n, ad: ad || alanAdi(url[1]), url: url[1], ek: '' };
}
/** Çıplak URL'nin bağlantı metni: protokolsüz, www'suz, 72 karakterde kesilmiş. */
const alanAdi = (u) => {
  const s = u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  return s.length > 72 ? s.slice(0, 69) + '…' : s;
};

/** @returns {{ body: string, degisen: string[] }} */
export function normalizeSources(body) {
  const degisen = [];
  const bm = BASLIK.exec(body);
  if (!bm) return { body, degisen };
  const bas = bm.index + bm[0].length;
  // Bölüm: başlıktan bir sonraki "## " başlığa ya da dosya sonuna kadar.
  const sonM = /^##\s/m.exec(body.slice(bas));
  const son = sonM ? bas + sonM.index : body.length;
  const ham = body.slice(bas, son);
  const satirlar = ham.split('\n').map((s) => s.trim()).filter(Boolean);
  const kaynaklar = satirlar.map(satirAyristir);
  if (!kaynaklar.length || kaynaklar.some((k) => !k)) return { body, degisen }; // tanımadığımız biçim: dokunma

  const liste = kaynaklar.map((k) => {
    const govde = k.url ? `[${k.ad}](${k.url})` : k.ad;
    return `${k.n}. ${govde}${k.ek ? ' ' + k.ek : ''}`;
  }).join('\n');
  const yeniBolum = `\n\n${liste}\n`;
  if (yeniBolum.trim() !== ham.trim()) degisen.push('kaynak listesi sıralı listeye çevrildi');

  // Gövdedeki düz [N] atıfları -> <sup><a href="URL">N</a></sup>. Bağlantı
  // ya da kod içindekilere dokunma; zaten <sup> olanlara dokunma.
  const url = new Map(kaynaklar.filter((k) => k.url).map((k) => [k.n, k.url]));
  let govde = body.slice(0, bm.index);
  let atif = 0;
  govde = govde.replace(/(`[^`\n]*`)|(\[(\d{1,2})\](?![(:\]]))/g, (m, kod, _ref, n) => {
    if (kod) return kod;
    const u = url.get(Number(n));
    if (!u) return m;
    atif++;
    return `<sup><a href="${u}" rel="noopener">${n}</a></sup>`;
  });
  if (atif) degisen.push(`${atif} düz [n] atıfı üst simgeye çevrildi`);

  return { body: govde.replace(/\s+$/, '') + '\n\n' + bm[0].trim() + yeniBolum + body.slice(son), degisen };
}
