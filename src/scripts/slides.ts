/**
 * <x-slides deck="crs-evolution" range="4-5"> — gövdenin içine slayt alıntısı.
 *
 * Kendi verisi yok: aynı sayfadaki tam destenin (#deck-<slug>) figürlerini
 * KOPYALIYOR. Böylece görseller Astro'nun optimize ettiği tek kaynaktan
 * geliyor ve JS kapalıyken element içindeki yedek metin olduğu gibi kalıyor.
 */
class Slides extends HTMLElement {
  connectedCallback() {
    const slug = this.getAttribute('deck');
    const range = this.getAttribute('range') ?? '';
    if (!slug) return;

    const kaynak = document.getElementById(`deck-${slug}`);
    if (!kaynak) return; // Tam deste sayfada yoksa yedek metin kalsın.

    const [bas, son] = range.split('-').map(Number);
    const bitis = Number.isFinite(son) ? son : bas;
    if (!Number.isFinite(bas)) return;

    const figurler: HTMLElement[] = [];
    for (let n = bas; n <= bitis; n++) {
      const f = kaynak.querySelector<HTMLElement>(`figure[data-n="${n}"]`);
      if (f) figurler.push(f.cloneNode(true) as HTMLElement);
    }
    if (!figurler.length) return;

    const not = this.getAttribute('caption');
    this.replaceChildren();
    this.classList.add('exslides');
    this.style.setProperty('--n', String(figurler.length));
    for (const f of figurler) {
      // Kopyalar tembel yüklenmeye devam etsin, ilk ekranda da olabilirler.
      f.querySelector('img')?.setAttribute('loading', 'lazy');
      this.append(f);
    }
    if (not) {
      const p = document.createElement('p');
      p.className = 'xcap';
      p.textContent = not;
      this.append(p);
    }
  }
}

customElements.define('x-slides', Slides);
