/**
 * Raf sayfalarındaki iki bölümü sekmeye çevirir.
 *
 * Sunucu iki bölümü alt alta basıyor: bitirdiklerim ve sırada bekleyenler.
 * JS gelirse bunlar sekme olur; gelmezse sayfa bugünkü haliyle çalışmaya
 * devam eder. Açıklayıcılardaki ve slaytlardaki kural: iyileştirme,
 * bağımlılık değil.
 *
 * Sekme çubuğu sunucuda basılmıyor — JS yokken tıklanmayan bir çubuk
 * bırakmak, hiç bırakmamaktan kötü.
 */
const HASH = { done: '#bitmis', queued: '#sirada' };

function kur(kok: HTMLElement) {
  const paneller = [...kok.querySelectorAll<HTMLElement>('[data-panel]')];
  if (paneller.length < 2) return; // Tek bölüm varsa sekmeye gerek yok.

  const etiketler: Record<string, string> = {
    done: kok.dataset.done ?? '',
    queued: kok.dataset.queued ?? '',
  };

  const cubuk = document.createElement('div');
  cubuk.className = 'tablist';
  cubuk.setAttribute('role', 'tablist');
  cubuk.setAttribute('aria-label', kok.dataset.label ?? '');

  const dugmeler = paneller.map((panel, i) => {
    const ad = panel.dataset.panel!;
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'tab';
    d.id = `tab-${ad}`;
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-controls', panel.id);
    d.innerHTML = `<span class="lbl"></span><span class="n"></span>`;
    d.querySelector('.lbl')!.textContent = etiketler[ad] ?? ad;
    d.querySelector('.n')!.textContent = panel.dataset.count ?? '';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', d.id);
    panel.tabIndex = 0;
    // Sekme etiketi başlığı zaten söylüyor; ikisi birden fazlalık.
    panel.querySelector('h2')?.classList.add('sr-gizli');
    cubuk.append(d);
    return d;
  });

  const murekkep = document.createElement('span');
  murekkep.className = 'ink';
  murekkep.setAttribute('aria-hidden', 'true');
  cubuk.append(murekkep);

  kok.prepend(cubuk);
  kok.classList.add('sekmeli');

  const murekkepTasi = (d: HTMLElement) => {
    murekkep.style.transform = `translateX(${d.offsetLeft}px)`;
    murekkep.style.inlineSize = `${d.offsetWidth}px`;
  };

  let aktif = -1;
  const sec = (i: number, odak = false) => {
    if (i === aktif) return;
    const ilk = aktif === -1;
    aktif = i;

    dugmeler.forEach((d, j) => {
      const secili = i === j;
      const panel = paneller[j]!;
      d.setAttribute('aria-selected', String(secili));
      d.tabIndex = secili ? 0 : -1;
      panel.hidden = !secili;
      // Sınıf duruyorsa animasyon ikinci geçişte hiç oynamıyor: önce sil,
      // reflow'u zorla, sonra ekle. İlk yüklemede hiç oynatma.
      panel.classList.remove('giris');
      if (secili && !ilk) {
        void panel.offsetWidth;
        panel.classList.add('giris');
      }
    });

    murekkepTasi(dugmeler[i]!);
    if (odak) dugmeler[i]!.focus();
    // Çizgi ilk konumuna kayarak değil, orada belirerek gelsin.
    if (ilk) requestAnimationFrame(() => cubuk.classList.add('hazir'));

    // Adres çubuğuna yaz ama sayfayı zıplatma.
    const ad = paneller[i]!.dataset.panel as keyof typeof HASH;
    history.replaceState(null, '', i === 0 ? location.pathname + location.search : HASH[ad]);
  };

  cubuk.addEventListener('click', (e) => {
    const d = (e.target as HTMLElement).closest('.tab');
    if (d) sec(dugmeler.indexOf(d as HTMLButtonElement));
  });

  cubuk.addEventListener('keydown', (e) => {
    const yon = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (yon) {
      e.preventDefault();
      sec((aktif + yon + dugmeler.length) % dugmeler.length, true);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      sec(e.key === 'Home' ? 0 : dugmeler.length - 1, true);
    }
  });

  // /library#sirada doğrudan o sekmeyi açsın.
  const baslangic = paneller.findIndex((p) => HASH[p.dataset.panel as keyof typeof HASH] === location.hash);
  sec(baslangic > 0 ? baslangic : 0);

  // Pencere genişleyince mürekkep çizgisi kaymasın.
  addEventListener('resize', () => murekkepTasi(dugmeler[aktif]!), { passive: true });
}

document.querySelectorAll<HTMLElement>('[data-shelf]').forEach(kur);
