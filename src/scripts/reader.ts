/**
 * Okuyucu: sol içindekiler + sağ kenar notları, ikisi de kapanabilir.
 *
 * Yerleşim TAMAMEN CSS'te. Bu script yalnızca üç şey yapıyor:
 *   1. [data-toggle] düğmeleri köke data-toc / data-notes yazıyor
 *      (tercih localStorage'da).
 *   2. Markdown dipnotlarını, referansın olduğu paragrafın hemen ardına
 *      <aside class="note"> olarak kopyalıyor. Geniş ekranda CSS bu
 *      aside'ı sağ kenara yüzdürüyor (Tufte float: üst üste binme
 *      fiziksel olarak imkânsız), dar ekranda tıklayınca açılan kutu.
 *   3. İçindekilerde okunan bölümü işaretliyor.
 *
 * Konum hesabı, yükseklik ölçümü, scroll dinleme YOK. Önceki sürümler
 * tam da orada kırılıyordu.
 */
const DEPO = 'okuyucu';

function tercih(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(DEPO) || '{}'); } catch { return {}; }
}
function yaz(d: Record<string, boolean>) {
  try { localStorage.setItem(DEPO, JSON.stringify(d)); } catch { /* gizli sekme */ }
}

for (const kok of document.querySelectorAll<HTMLElement>('[data-reader]')) {
  /* — 1. Aç/kapa — */
  const durum = tercih();
  const uygula = (ad: string, acik: boolean) => {
    kok.dataset[ad] = acik ? 'on' : 'off';
    kok.querySelectorAll<HTMLButtonElement>(`[data-toggle="${ad}"]`)
      .forEach((d) => d.setAttribute('aria-expanded', String(acik)));
  };
  for (const ad of ['toc', 'notes']) {
    if (!kok.querySelector(`[data-toggle="${ad}"]`)) continue;
    uygula(ad, durum[ad] ?? true);
  }
  kok.addEventListener('click', (e) => {
    const d = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-toggle]');
    if (!d) return;
    const ad = d.dataset.toggle!;
    const acik = kok.dataset[ad] !== 'on';
    durum[ad] = acik; yaz(durum); uygula(ad, acik);
  });

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

  /* — 2b. Kaydırma yönü: aşağı inerken içindekiler kenara çekilir — */
  let sonY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (Math.abs(y - sonY) < 12) return;
    kok.dataset.scroll = y > sonY && y > 120 ? 'down' : 'up';
    sonY = y;
  }, { passive: true });

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

export {};
