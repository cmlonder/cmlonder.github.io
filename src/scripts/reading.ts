/**
 * Okuma düzeni: kenar notları, içindekiler vurgusu, açılır kapanır raylar.
 *
 * Kenar notu diye ayrı bir söz dizimi YOK. Yazar standart markdown dipnotu
 * yazıyor:
 *
 *     Cümle.[^kadinlar]
 *     [^kadinlar]: Notun gövdesi.
 *
 * JS gelmezse bunlar sayfanın altında gerçek dipnot olarak duruyor ve
 * çalışıyor. JS gelince sağ raya, referansın hizasına taşınıyorlar.
 * Dar ekranda taşıma hiç yapılmıyor: yer yok, dipnot dipnot olarak kalıyor.
 */
const GENIS = matchMedia('(min-width: 78rem)');
const ARA = 16;          // iki not arasındaki en az boşluk (px)
const DEPO = 'reading-rails';

function railDurumu(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(DEPO) || '{}'); } catch { return {}; }
}
function railYaz(d: Record<string, boolean>) {
  try { localStorage.setItem(DEPO, JSON.stringify(d)); } catch { /* gizli sekme */ }
}

function kur(kok: HTMLElement) {
  const yazi = kok.querySelector<HTMLElement>('.prose');
  const notRay = kok.querySelector<HTMLElement>('[data-rail="notes"] .ray-ic');
  if (!yazi) return;

  /* — Raylar — */
  const durum = railDurumu();
  kok.querySelectorAll<HTMLButtonElement>('[data-toggle]').forEach((d) => {
    const ad = d.dataset.toggle!;
    const uygula = (acik: boolean) => {
      kok.dataset[ad] = acik ? 'acik' : 'kapali';
      d.setAttribute('aria-expanded', String(acik));
      if (ad === 'notes') yerlestir();
    };
    uygula(durum[ad] ?? true);
    d.addEventListener('click', () => {
      const acik = d.getAttribute('aria-expanded') !== 'true';
      durum[ad] = acik;
      railYaz(durum);
      uygula(acik);
    });
  });

  /* — Kenar notları — */
  const kaynak = kok.querySelector<HTMLElement>('[data-footnotes]');
  const refler = [...yazi.querySelectorAll<HTMLAnchorElement>('a[data-footnote-ref]')];
  const notlar: HTMLElement[] = [];

  if (notRay && kaynak && refler.length) {
    refler.forEach((ref, i) => {
      const id = decodeURIComponent(ref.getAttribute('href') || '').slice(1);
      const kayit = document.getElementById(id);
      if (!kayit) return;

      const not = document.createElement('aside');
      not.className = 'sidenote';
      not.id = `sidenote-${i + 1}`;
      const govde = kayit.cloneNode(true) as HTMLElement;
      govde.querySelectorAll('[data-footnote-backref]').forEach((a) => a.remove());
      not.innerHTML = `<span class="sn-n">${ref.textContent ?? ''}</span>`;
      not.append(...govde.childNodes);
      notRay.append(not);
      notlar.push(not);

      // Referansa tıklayınca dar ekranda dipnota gitsin, geniş ekranda
      // notu bir an vurgulasın — ikisi de aynı bağlantıyla.
      ref.addEventListener('click', (e) => {
        if (!GENIS.matches) return;
        e.preventDefault();
        not.classList.remove('vurgu');
        void not.offsetWidth;
        not.classList.add('vurgu');
      });
    });
  }

  function yerlestir() {
    if (!notRay || !notlar.length) return;
    const kapali = kok.dataset.notes === 'kapali';
    if (!GENIS.matches || kapali) {
      kok.dataset.sidenotes = 'yok';   // dipnotlar altta görünür kalsın
      return;
    }
    kok.dataset.sidenotes = 'var';
    const tepe = notRay.getBoundingClientRect().top + scrollY;
    let alt = 0;
    notlar.forEach((not, i) => {
      const ref = refler[i];
      if (!ref) return;
      const hedef = ref.getBoundingClientRect().top + scrollY - tepe;
      const y = Math.max(hedef, alt);
      not.style.transform = `translateY(${y}px)`;
      alt = y + not.offsetHeight + ARA;
    });
    notRay.style.blockSize = `${alt}px`;
  }

  /*
   * Başlık çapaları. Astro'nun başlık-id eklentisi hast eklentimizden
   * sonra koştuğu için build sırasında id görünmüyor; burada görünüyor.
   * Hover'da beliriyor, klavyeyle odaklanınca da.
   */
  yazi.querySelectorAll<HTMLElement>('h2[id], h3[id]').forEach((b) => {
    if (b.querySelector('.capa')) return;
    const a = document.createElement('a');
    a.className = 'capa';
    a.href = `#${encodeURIComponent(b.id)}`;
    a.textContent = '#';
    a.setAttribute('aria-label', document.documentElement.lang === 'tr'
      ? 'Bu başlığa bağlantı' : 'Link to this heading');
    b.append(a);
  });

  /* — İçindekilerde okunan bölüm — */
  const baglar = [...kok.querySelectorAll<HTMLAnchorElement>('.toc a')];
  if (baglar.length) {
    const harita = new Map<string, HTMLAnchorElement>();
    for (const a of baglar) harita.set(decodeURIComponent(a.hash).slice(1), a);
    const basliklar = [...yazi.querySelectorAll<HTMLElement>('h2[id], h3[id]')]
      .filter((h) => harita.has(h.id));

    const gozcu = new IntersectionObserver((girisler) => {
      for (const g of girisler) {
        if (!g.isIntersecting) continue;
        baglar.forEach((a) => a.removeAttribute('data-aktif'));
        harita.get((g.target as HTMLElement).id)?.setAttribute('data-aktif', '');
      }
    }, { rootMargin: '0px 0px -75% 0px' });
    basliklar.forEach((h) => gozcu.observe(h));
  }

  /* Yeniden hesaplama: ölçü değişen her şeyden sonra. */
  let zaman = 0;
  const gecikmeli = () => { clearTimeout(zaman); zaman = window.setTimeout(yerlestir, 120); };
  addEventListener('resize', gecikmeli, { passive: true });
  GENIS.addEventListener('change', yerlestir);
  document.fonts?.ready.then(yerlestir);
  yerlestir();
}

document.querySelectorAll<HTMLElement>('[data-reading]').forEach(kur);

// import'u olmayan dosyayı TypeScript modül saymıyor ve kapsamı
// diğer script'lerle paylaşıyor; bu satır onu modül yapıyor.
export {};
