/**
 * Kaydırınca beliren bölümler.
 *
 * Tek seferlik: bir kez göründükten sonra gözcü o elemanı bırakıyor —
 * sayfa yukarı kaydırılınca tekrar tekrar oynayan animasyon okumayı
 * kesiyor.
 *
 * prefers-reduced-motion açıksa hiçbir şey gizlenmiyor: elemanlar
 * doğrudan görünür işaretleniyor ve CSS animasyonu zaten kapalı.
 */
const ogeler = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (ogeler.length) {
  const sakin = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (sakin || !('IntersectionObserver' in window)) {
    ogeler.forEach((e) => e.classList.add('gorunur'));
  } else {
    const gozcu = new IntersectionObserver((girisler) => {
      for (const g of girisler) {
        if (!g.isIntersecting) continue;
        g.target.classList.add('gorunur');
        gozcu.unobserve(g.target);
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    ogeler.forEach((e) => gozcu.observe(e));
  }
}

export {};
