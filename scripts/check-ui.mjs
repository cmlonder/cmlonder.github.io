/**
 * Arayüz script'lerini asgari bir DOM taklidiyle GERÇEKTEN koşturur.
 *
 * Neden var: okuma düzeni script'i üç kez sessizce öldü — sıra hatası,
 * eksik import, yanlış kapsamda arama. Üçünde de build yeşildi, sayfa
 * çalışıyor görünüyordu, tıklamak hiçbir şey yapmıyordu. Tarayıcı
 * olmadan bu sınıf hatanın yakalanabileceği tek yer burası.
 *
 * Senaryolar: (1) dipnot numarası notu açıyor, (2) liste kipi ızgaraya geçiyor.
 *
 * Kullanım: node scripts/check-ui.mjs   (pnpm verify çağırıyor; build gerekir)
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

class El {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase(); this.dataset = {}; this.attrs = {};
    this.children = []; this.parent = null; this.style = {}; this.listeners = {};
    this.textContent = ''; this.hidden = false; this.className = '';
    this.classList = { add: () => {}, remove: () => {}, contains: (c) => this.className.split(' ').includes(c) };
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  hasAttribute(k) { return k in this.attrs; }
  removeAttribute(k) { delete this.attrs[k]; }
  toggleAttribute(k, f) { const on = f ?? !this.hasAttribute(k); if (on) this.attrs[k] = ''; else delete this.attrs[k]; return on; }
  addEventListener(t, f) { (this.listeners[t] ??= []).push(f); }
  dispatch(t, ev = {}) { (this.listeners[t] ?? []).forEach((f) => f({ preventDefault() {}, target: this, ...ev })); }
  get offsetWidth() { return 1; }
  append(...n) { n.forEach((x) => { if (x instanceof El) { x.parent = this; } this.children.push(x); }); }
  after(n) { const i = this.parent.children.indexOf(this); n.parent = this.parent; this.parent.children.splice(i + 1, 0, n); }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter((c) => c !== this); }
  cloneNode() { const c = new El(this.tagName); c.textContent = this.textContent; return c; }
  closest(sel) { let e = this; while (e) { if (sel.split(',').some((x) => e._eslesir(x.trim().replace(/^button/i,'BUTTON')) || e.tagName === x.trim().toUpperCase())) return e; e = e.parent; } return null; }
  get childNodes() { return this.children; }
  get hash() { return this.attrs.href ?? ''; }
  _hepsi() { return this.children.flatMap((c) => c instanceof El ? [c, ...c._hepsi()] : []); }
  _eslesir(sel) {
    if (sel.startsWith('.')) return this.classList.contains(sel.slice(1));
    const m = /^\[([\w-]+)(?:\^?="([^"]*)")?\]$/.exec(sel);
    if (m) { const k = m[1]; const v = this.attrs[k] ?? (k.startsWith('data-') ? this.dataset[k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())] : undefined);
             return m[2] === undefined ? v != null : String(v).startsWith(m[2]); }
    return this.tagName === sel.toUpperCase();
  }
  querySelectorAll(sel) {
    return sel.split(',').flatMap((s) => {
      const son = s.trim().split(' ').filter(Boolean).pop().replace(/:is\([^)]*\)/, '');
      return this._hepsi().filter((e) => son.split(/(?=[.\[])/).filter(Boolean).every((p) => e._eslesir(p)));
    });
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] ?? null; }
}

// ---- Sahne (okuyucu v4: kök [data-reader], toggle'lar data-toc/data-notes) ----
const html = new El('html');
const kok = new El('div'); kok.attrs['data-reader'] = ''; kok.dataset.toc = 'on'; kok.dataset.notes = 'on';
const prose = new El('div'); prose.className = 'prose';
const p = new El('p');
const ref = new El('a'); ref.attrs['data-footnote-ref'] = ''; ref.attrs.href = '#user-content-fn-x'; ref.textContent = '1';
p.append(new El('span'), ref); prose.append(p);
const tocGizle = new El('button'); tocGizle.dataset.toggle = 'toc'; tocGizle.attrs['data-toggle'] = 'toc';
const notGizle = new El('button'); notGizle.dataset.toggle = 'notes'; notGizle.attrs['data-toggle'] = 'notes';
kok.append(tocGizle, prose, notGizle); html.append(kok);
const kayit = new El('li'); kayit.attrs.id = 'user-content-fn-x'; const kp = new El('p'); kp.textContent = 'not gövdesi'; kayit.append(kp);

const kipCubuk = new El('p'); kipCubuk.attrs['data-kip-bar'] = ''; kipCubuk.setAttribute('hidden', '');
const kipListe = new El('div'); kipListe.attrs['data-liste'] = '';
const kipSatir = new El('button'); kipSatir.dataset.kip = 'satir';
const kipIzgara = new El('button'); kipIzgara.dataset.kip = 'izgara';

globalThis.window = globalThis;
globalThis.document = {
  documentElement: html,
  querySelector: (s) => ({ '[data-kip-bar]': kipCubuk, '[data-liste]': kipListe })[s] ?? html.querySelector(s),
  querySelectorAll: (s) => (s === '[data-kip]' ? [kipSatir, kipIzgara] : s === '[data-reader]' ? [kok] : s.includes('.prose a') ? [] : html.querySelectorAll(s)),
  getElementById: (id) => (id === 'user-content-fn-x' ? kayit : null),
  body: new El('body'),
  createElement: (t) => new El(t),
  addEventListener() {},
};
globalThis.matchMedia = () => ({ matches: true, addEventListener() {} });
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.location = { pathname: '/x/', hash: '', origin: 'https://cmlonder.com' };
globalThis.removeEventListener = () => {}; globalThis.scrollTo = () => {};
globalThis.IntersectionObserver = class { observe() {} };
globalThis.addEventListener = () => {};
globalThis.scrollY = 0; globalThis.innerHeight = 800; globalThis.innerWidth = 1200;
globalThis.fetch = () => Promise.resolve({ json: () => ({}) });
globalThis.HTMLElement = El;

// ---- Paketleri bul: hash'li chunk ya da sayfaya gömülü ----
const dizin = 'dist/_astro';
function bul(chunkKalip, gomuluIz, ornekHtml) {
  const f = readdirSync(dizin).find((x) => chunkKalip.test(x));
  if (f) return readFileSync(join(dizin, f), 'utf8');
  const h = readFileSync(ornekHtml, 'utf8');
  const m = [...h.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map((x) => x[1]).find((x) => x.includes(gomuluIz));
  if (m) return m;
  console.error(`paket bulunamadı: ${chunkKalip} — önce \`pnpm build\``); process.exit(1);
}
const calistir = (kod) => import('data:text/javascript,' + encodeURIComponent(kod));

await calistir(bul(/^reader\..*\.js$/, 'data-reader', 'dist/tr/domains/aviation/mail-contracts-to-sabre/index.html'));
await calistir(bul(/^layout-toggle\..*\.js$/, 'data-kip', 'dist/tr/essays/index.html'));

// ---- Kontroller ----
const sonuc = [];

const notlar = prose._hepsi().filter((e) => e.className === 'note');
sonuc.push(['not üretildi', notlar.length, 1]);
sonuc.push(['dipnot bölümü gizlendi', kok.hasAttribute('data-has-notes'), true]);
ref.dispatch('click');
sonuc.push(['nota tıklayınca açıldı', notlar[0]?.hasAttribute('data-open'), true]);

sonuc.push(['kip çubuğu görünür', kipCubuk.getAttribute('hidden'), null]);
kipIzgara.dispatch('click');
sonuc.push(['ızgaraya geçiş', kipListe.dataset.goster, 'izgara']);

let hata = 0;
for (const [ad, oldu, beklenen] of sonuc) {
  const ok = oldu === beklenen; if (!ok) hata++;
  console.log(`${ok ? '✓' : '✗'} ${ad.padEnd(26)} = ${String(oldu).padEnd(8)} (beklenen ${beklenen})`);
}
if (hata) { console.error('\nArayüz doğrulaması başarısız.'); process.exit(1); }
console.log('Arayüz doğrulaması geçti.');
