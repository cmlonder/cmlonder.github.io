/**
 * Okuyucu: sol içindekiler (sabit, kaydırınca küçülür) + sağ kenar
 * notları (Tufte float: clear:right ⇒ üst üste binemez).
 */
for (const kok of document.querySelectorAll<HTMLElement>('[data-reader]')) {
  /* — 2. Notlar — */
  const yazi = kok.querySelector<HTMLElement>('.prose');
  if (yazi) {
    let n = 0;
    for (const ref of yazi.querySelectorAll<HTMLAnchorElement>('a[data-footnote-ref]')) {
      const id = decodeURIComponent(ref.getAttribute('href') || '').slice(1);
      const kayit = document.getElementById(id);
      const blok = ref.closest('p, li, blockquote, h2, h3');
      if (!kayit || !blok) continue;

      const govde = kayit.cloneNode(true) as HTMLElement;
      govde.querySelectorAll('[data-footnote-backref]').forEach((a) => a.remove());

      const not = document.createElement('aside');
      not.className = 'note';
      not.id = `not-${id}`;
      const num = document.createElement('span');
      num.className = 'note-n';
      num.textContent = ref.textContent ?? '';
      const ic = document.createElement('div');
      ic.className = 'note-ic';
      ic.append(num, ...govde.childNodes);
      not.append(ic);
      blok.after(not);
      n++;

      ref.setAttribute('aria-controls', not.id);
      ref.setAttribute('aria-expanded', 'false');
      ref.addEventListener('click', (e) => {
        e.preventDefault();
        const acik = !not.hasAttribute('data-open');
        not.toggleAttribute('data-open', acik);
        ref.setAttribute('aria-expanded', String(acik));
        // Kenarda dururken tıklamak notu bir an vurgular.
        not.classList.remove('vurgu'); void not.offsetWidth; not.classList.add('vurgu');
      });
    }
    if (n) kok.setAttribute('data-has-notes', '');
  }

  /*
   * — 2a. Geniş görsel —
   * Eski yazılardaki <img> markdown'a ham HTML olarak yazılmış; Sätteri
   * onu hast elemanı değil ham düğüm olarak taşıyor, build'deki eklenti
   * göremiyor. İşaret burada konuyor: 1200px'ten geniş kaynak metin
   * sütununu taşabilir (.genis, CSS'te).
   */
  yazi?.querySelectorAll<HTMLImageElement>('img[width]').forEach((img) => {
    if (Number(img.getAttribute('width')) >= 1200) img.classList.add('genis');
  });

  /* — 2b. Kaydırma yönü: aşağı inerken içindekiler kenara çekilir — */
  let sonY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (Math.abs(y - sonY) < 12) return;
    kok.dataset.scroll = y > sonY && y > 120 ? 'down' : 'up';
    sonY = y;
  }, { passive: true });

  /* — 2c. Okuma ilerlemesi: üstte ince çizgi (Gwern) — */
  const cubuk = document.createElement('div');
  cubuk.className = 'ilerleme'; cubuk.setAttribute('aria-hidden', 'true');
  document.body.append(cubuk);
  const ilerle = () => {
    const doc = document.documentElement;
    const oran = doc.scrollHeight > innerHeight ? scrollY / (doc.scrollHeight - innerHeight) : 0;
    cubuk.style.transform = `scaleX(${Math.min(1, Math.max(0, oran))})`;
  };
  addEventListener('scroll', ilerle, { passive: true });
  ilerle();

  /* — 3. Okunan bölüm — */
  const baglar = [...kok.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]')];
  if (baglar.length && yazi && 'IntersectionObserver' in window) {
    const harita = new Map(baglar.map((a) => [decodeURIComponent(a.hash).slice(1), a]));
    const basliklar = [...yazi.querySelectorAll<HTMLElement>('h2[id], h3[id]')].filter((h) => harita.has(h.id));
    const gozcu = new IntersectionObserver((girisler) => {
      for (const g of girisler) {
        if (!g.isIntersecting) continue;
        baglar.forEach((a) => a.removeAttribute('data-aktif'));
        harita.get((g.target as HTMLElement).id)?.setAttribute('data-aktif', '');
      }
    }, { rootMargin: '0px 0px -75% 0px' });
    basliklar.forEach((h) => gozcu.observe(h));
  }
}

/*
 * — 4. İç bağlantı önizlemesi (Maggie / Matuschak) —
 * Siteye ait bir bağlantının üstünde kısa bekleyince hedefin başlığı ve
 * açıklaması beliriyor. Veri build'de üretilen /preview.json; ilk
 * hover'da bir kez çekiliyor. Bağlantıyı değiştirmiyor, üstüne kart
 * koyuyor; klavye odağında da çalışıyor, Escape kapatıyor.
 */
let veri: Record<string, { t: string; d: string; k: string }> | null = null;
let yukleniyor: Promise<void> | null = null;
const kart = document.createElement('div');
kart.className = 'onizleme'; kart.setAttribute('role', 'tooltip'); kart.hidden = true;
document.body.append(kart);
let zaman = 0;

const yukle = () => yukleniyor ??= fetch('/preview.json').then((r) => r.json()).then((j) => { veri = j; }).catch(() => { veri = {}; });

function goster(a: HTMLAnchorElement) {
  if (!veri) return;
  const yol = a.pathname.replace(/\/$/, '') || '/';
  const v = veri[yol];
  if (!v) return;
  kart.innerHTML = `<p class="on-k">${v.k}</p><p class="on-t">${v.t}</p><p class="on-d">${v.d}</p>`;
  kart.hidden = false;
  const r = a.getBoundingClientRect();
  const w = Math.min(22 * 16, innerWidth - 32);
  let x = r.left + scrollX; if (x + w > scrollX + innerWidth - 16) x = scrollX + innerWidth - 16 - w;
  const alttaYer = innerHeight - r.bottom > 160;
  kart.style.left = `${Math.max(16, x)}px`;
  kart.style.top = alttaYer ? `${r.bottom + scrollY + 8}px` : '';
  kart.style.bottom = alttaYer ? '' : `${document.documentElement.scrollHeight - (r.top + scrollY) + 8}px`;
  kart.dataset.on = '';
}
function gizle() { clearTimeout(zaman); delete kart.dataset.on; kart.hidden = true; }

for (const a of document.querySelectorAll<HTMLAnchorElement>('.prose a[href^="/"], .backlinks a[href^="/"]')) {
  if (a.hasAttribute('data-footnote-ref') || a.classList.contains('capa')) continue;
  const bekle = () => { clearTimeout(zaman); yukle().then(() => { zaman = window.setTimeout(() => goster(a), 220); }); };
  a.addEventListener('mouseenter', bekle);
  a.addEventListener('focus', bekle);
  a.addEventListener('mouseleave', gizle);
  a.addEventListener('blur', gizle);
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') gizle(); });
addEventListener('scroll', gizle, { passive: true });

export {};
