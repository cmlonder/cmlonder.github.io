/**
 * Liste sayfalarında satır <-> ızgara.
 *
 * Sunucu her zaman satır basıyor; JS gelirse düğmeler görünür oluyor ve
 * tercih localStorage'da kalıyor. JS yoksa sayfa bugünkü haliyle
 * çalışıyor — slaytlardaki, sekmelerdeki ve raylardaki kuralın aynısı.
 *
 * Düğmeler başlıkta, liste sarmalayıcısının DIŞINDA duruyor. İlk sürüm
 * onları sarmalayıcının içinde arıyordu, bulamayınca sessizce çıkıyordu:
 * düğmeler hiç görünmedi, ızgara hiç açılmadı.
 */
const DEPO = 'liste-kip';

const cubuk = document.querySelector<HTMLElement>('[data-kip-bar]');
const liste = document.querySelector<HTMLElement>('[data-liste]');
const dugmeler = [...document.querySelectorAll<HTMLButtonElement>('[data-kip]')];

if (cubuk && liste && dugmeler.length) {
  const uygula = (kip: string) => {
    liste.dataset.goster = kip;
    dugmeler.forEach((d) => d.setAttribute('aria-pressed', String(d.dataset.kip === kip)));
    try { localStorage.setItem(DEPO, kip); } catch { /* gizli sekme */ }
  };

  let baslangic = 'satir';
  try { baslangic = localStorage.getItem(DEPO) || 'satir'; } catch { /* yok say */ }

  cubuk.removeAttribute('hidden');
  uygula(baslangic === 'izgara' ? 'izgara' : 'satir');

  for (const d of dugmeler) {
    d.addEventListener('click', () => uygula(d.dataset.kip!));
  }
}

export {};
