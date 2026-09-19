/**
 * Okuyucu: içindekiler paneli + satır içi notlar.
 *
 * Kural: sayfa düzenine hiç dokunma. Panel fixed, notlar paragrafın
 * altında. Hangi ekran genişliğinde olursa olsun aynı şekilde çalışıyor
 * — önceki üç sürümün kırıldığı yer tam da ızgara/konum hesabıydı.
 *
 * Notların kaynağı standart markdown dipnotu. JS yoksa dipnot olarak
 * sayfanın altında kalıyorlar; JS gelince numaraya tıklayınca
 * paragrafın altında açılıyorlar.
 */
const DEPO = 'toc-open';
const GENIS = matchMedia('(min-width: 64rem)');

/* — İçindekiler — */
const tab = document.querySelector<HTMLButtonElement>('[data-toc-tab]');
const panel = document.querySelector<HTMLElement>('[data-toc-panel]');
const ortu = document.querySelector<HTMLElement>('[data-toc-ortu]');

if (tab && panel) {
  tab.hidden = false;

  panel.tabIndex = -1;
  const ayarla = (acik: boolean, odak = false) => {
    panel.toggleAttribute('data-open', acik);
    ortu?.toggleAttribute('data-open', acik);
    document.documentElement.toggleAttribute('data-toc-open', acik);
    tab.setAttribute('aria-expanded', String(acik));
    try { localStorage.setItem(DEPO, acik ? '1' : '0'); } catch { /* gizli sekme */ }
    // Klavye kullanıcısı için odak paneli takip etsin; fareyle açılınca dokunma.
    if (odak) (acik ? panel : tab).focus();
  };

  // Geniş ekranda son tercih hatırlanır; dar ekranda her zaman kapalı başlar.
  let ilk = false;
  try { ilk = GENIS.matches && localStorage.getItem(DEPO) === '1'; } catch { /* yok say */ }
  ayarla(ilk);

  tab.addEventListener('click', (e) => ayarla(tab.getAttribute('aria-expanded') !== 'true', e.detail === 0));
  ortu?.addEventListener('click', () => ayarla(false));
  panel.querySelector('[data-toc-kapat]')?.addEventListener('click', () => ayarla(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.hasAttribute('data-open')) ayarla(false, true);
  });
  // Dar ekranda bir başlığa gidince çekmece kapansın.
  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a') && !GENIS.matches) ayarla(false);
  });

  // Okunan bölümü işaretle.
  const baglar = [...panel.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const harita = new Map(baglar.map((a) => [decodeURIComponent(a.hash).slice(1), a]));
  const basliklar = [...document.querySelectorAll<HTMLElement>('.prose :is(h2, h3)[id]')]
    .filter((h) => harita.has(h.id));
  if (basliklar.length && 'IntersectionObserver' in window) {
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

/* — Satır içi notlar — */
for (const kok of document.querySelectorAll<HTMLElement>('[data-reader]')) {
  const refler = [...kok.querySelectorAll<HTMLAnchorElement>('.prose a[data-footnote-ref]')];
  if (!refler.length) continue;

  let tasinan = 0;
  for (const ref of refler) {
    const id = decodeURIComponent(ref.getAttribute('href') || '').slice(1);
    const kayit = document.getElementById(id);
    const paragraf = ref.closest('p, li, blockquote, h2, h3');
    if (!kayit || !paragraf) continue;

    const govde = kayit.cloneNode(true) as HTMLElement;
    govde.querySelectorAll('[data-footnote-backref]').forEach((a) => a.remove());

    const not = document.createElement('aside');
    not.className = 'note-inline';
    not.id = `not-${id}`;
    const ic = document.createElement('div');
    const icerik = document.createElement('div');
    icerik.className = 'govde';
    const n = document.createElement('span');
    n.className = 'sn-n';
    n.textContent = ref.textContent ?? '';
    icerik.append(n, ...govde.childNodes);
    ic.append(icerik);
    not.append(ic);
    paragraf.after(not);
    tasinan++;

    ref.setAttribute('role', 'button');
    ref.setAttribute('aria-expanded', 'false');
    ref.setAttribute('aria-controls', not.id);
    ref.addEventListener('click', (e) => {
      e.preventDefault();
      const acik = !not.hasAttribute('data-open');
      not.toggleAttribute('data-open', acik);
      ref.setAttribute('aria-expanded', String(acik));
    });
  }
  if (tasinan) kok.setAttribute('data-notes-inline', '');
}

export {};
