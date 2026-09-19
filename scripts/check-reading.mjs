/**
 * Okuma düzeni script'ini asgari bir DOM taklidiyle koşturur.
 *
 * Neden var: bu script iki kez sessizce öldü. Bir kere kur() içindeki
 * sıra yüzünden (temporal dead zone hatası bütün dinleyicileri
 * düşürdü), bir kere de bölüm sayfasına hiç eklenmediği için. İkisinde
 * de build yeşil, sayfa çalışıyor görünüyor, oklar hiçbir şey yapmıyordu.
 *
 * Tarayıcı olmadan yakalanabilecek tek yer burası.
 *
 * Kullanım: node scripts/check-reading.mjs (pnpm verify çağırıyor)
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

class El {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase(); this.dataset = {}; this.attrs = {};
    this.children = []; this.parent = null; this.style = {};
    this.classList = { _s: new Set(),
      add: (...c) => c.forEach((x) => this.classList._s.add(x)),
      remove: (...c) => c.forEach((x) => this.classList._s.delete(x)),
      contains: (c) => this.classList._s.has(c) };
    this.listeners = {}; this.textContent = ''; this.innerHTML = '';
    this.offsetHeight = 40; this.offsetWidth = 100; this.hidden = false; this.tabIndex = 0;
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  addEventListener(t, f) { (this.listeners[t] ??= []).push(f); }
  dispatch(t) { (this.listeners[t] ?? []).forEach((f) => f({ target: this, preventDefault() {} })); }
  append(...n) { n.forEach((x) => { x.parent = this; this.children.push(x); }); }
  remove() {}
  cloneNode() { return new El(this.tagName); }
  getBoundingClientRect() { return { top: 0, left: 0, width: 100, height: 40 }; }
  get childNodes() { return this.children; }
  _hepsi() { return this.children.flatMap((c) => [c, ...c._hepsi()]); }
  _eslesir(sel) {
    if (sel.startsWith('.')) return this.classList.contains(sel.slice(1));
    const m = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(sel);
    if (m) { const v = this.attrs[m[1]] ?? this.dataset[m[1].replace(/^data-/, '')];
             return m[2] === undefined ? v != null : v === m[2]; }
    return this.tagName === sel.toUpperCase();
  }
  querySelectorAll(sel) {
    const parcalar = sel.split(' ').filter(Boolean);
    const son = parcalar[parcalar.length - 1];
    return this._hepsi().filter((e) => son.split(/(?=[.\[])/).every((p) => e._eslesir(p)));
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] ?? null; }
}

const kok = new El('div');
kok.dataset.reading = '';
const prose = new El('div'); prose.classList.add('prose');
const tocRay = new El('aside'); tocRay.classList.add('rail', 'toc-rail'); tocRay.dataset.rail = 'toc';
const tocOk = new El('button'); tocOk.classList.add('ray-ok'); tocOk.dataset.toggle = 'toc';
tocOk.setAttribute('aria-expanded', 'true');
const tocIc = new El('div'); tocIc.classList.add('ray-ic');
tocRay.append(tocOk, tocIc);
const notRay = new El('aside'); notRay.classList.add('rail', 'notes-rail'); notRay.dataset.rail = 'notes';
const notOk = new El('button'); notOk.classList.add('ray-ok'); notOk.dataset.toggle = 'notes';
notOk.setAttribute('aria-expanded', 'true');
const notIc = new El('div'); notIc.classList.add('ray-ic');
notRay.append(notOk, notIc);
kok.append(tocRay, prose, notRay);

globalThis.window = globalThis;
globalThis.document = {
  querySelectorAll: (s) => (s === '[data-reading]' ? [kok] : kok.querySelectorAll(s)),
  querySelector: (s) => kok.querySelector(s),
  getElementById: () => null,
  createElement: (t) => new El(t),
  documentElement: { lang: 'tr' },
  fonts: { ready: Promise.resolve() },
};
globalThis.matchMedia = () => ({ matches: true, addEventListener() {} });
globalThis.localStorage = { getItem: () => null, setItem() {} };
globalThis.IntersectionObserver = class { observe() {} };
globalThis.addEventListener = () => {};
globalThis.history = { replaceState() {} };
globalThis.location = { pathname: '/x', search: '', hash: '' };
globalThis.scrollY = 0;
globalThis.requestAnimationFrame = (f) => f();

// Paket adı hash taşıyor; dist içinde bulup içeri alıyoruz.
const dizin = 'dist/_astro';
const dosya = readFileSync ? readdirSync(dizin).find((f) => /^reading\..*\.js$/.test(f)) : null;
if (!dosya) {
  console.error('reading chunk bulunamadı — önce `pnpm build` çalıştır.');
  process.exit(1);
}
await import(pathToFileURL(join(process.cwd(), dizin, dosya)).href);

const sonuc = [];
sonuc.push(['başlangıç data-toc', kok.dataset.toc, 'acik']);
tocOk.dispatch('click');
sonuc.push(['tıklama sonrası data-toc', kok.dataset.toc, 'kapali']);
sonuc.push(['aria-expanded', tocOk.getAttribute('aria-expanded'), 'false']);
tocOk.dispatch('click');
sonuc.push(['ikinci tıklama', kok.dataset.toc, 'acik']);
notOk.dispatch('click');
sonuc.push(['notlar rayı', kok.dataset.notes, 'kapali']);

let hata = 0;
console.log(`okuma düzeni — ${dosya}`);
for (const [ad, oldu, beklenen] of sonuc) {
  const ok = oldu === beklenen;
  if (!ok) hata++;
  console.log(`${ok ? '✓' : '✗'} ${ad.padEnd(26)} = ${String(oldu).padEnd(8)} (beklenen ${beklenen})`);
}
if (hata) { console.error('\nOkuma düzeni doğrulaması başarısız.'); process.exit(1); }
console.log('Okuma düzeni doğrulaması geçti.');
