/**
 * Liste sayfalarında satır <-> ızgara.
 *
 * Sunucu her zaman satır basıyor; JS gelirse düğme çıkıyor ve tercih
 * localStorage'da kalıyor. JS yoksa sayfa bugünkü haliyle çalışıyor —
 * slaytlardaki, sekmelerdeki ve raylardaki kuralın aynısı.
 */
const DEPO = 'liste-kip';

function kur(kok: HTMLElement) {
  const dugmeler = [...kok.querySelectorAll<HTMLButtonElement>('[data-kip]')];
  if (!dugmeler.length) return;

  const uygula = (kip: string) => {
    kok.dataset.goster = kip;
    dugmeler.forEach((d) => d.setAttribute('aria-pressed', String(d.dataset.kip === kip)));
    try { localStorage.setItem(DEPO, kip); } catch { /* gizli sekme */ }
  };

  kok.closest('.wrap')?.querySelector<HTMLElement>('[data-kip-bar]')?.removeAttribute('hidden');

  let baslangic = 'satir';
  try { baslangic = localStorage.getItem(DEPO) || 'satir'; } catch { /* yok say */ }
  uygula(baslangic === 'izgara' ? 'izgara' : 'satir');

  for (const d of dugmeler) {
    d.addEventListener('click', () => uygula(d.dataset.kip!));
  }
}

document.querySelectorAll<HTMLElement>('[data-liste]').forEach(kur);

// import'u olmayan dosyayı TypeScript modül saymıyor.
export {};
