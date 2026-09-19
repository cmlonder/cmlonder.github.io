/**
 * Yazı gövdesi ekleri — site geneli, Base'den yükleniyor.
 *
 *  1. Kod bloğu: üstte dil etiketi ve kopyala düğmesi. Shiki'nin ürettiği
 *     <pre> bir figure'a sarılıyor; markdown'a dokunulmuyor.
 *  2. Büyütme: yazı içindeki görsel ve slayta tıklayınca karartmalı
 *     tam ekran (<dialog>). Escape ve karartma kapatır. Kütüphane yok.
 *
 * İkisi de iyileştirme: JS yoksa blok ve görsel olduğu gibi çalışıyor.
 */
const TR = document.documentElement.lang === 'tr';
const T = TR
  ? { copy: 'Kopyala', copied: 'Kopyalandı', close: 'Kapat', zoom: 'Büyüt' }
  : { copy: 'Copy', copied: 'Copied', close: 'Close', zoom: 'Enlarge' };

/* — 1. Kod blokları — */
for (const pre of document.querySelectorAll<HTMLPreElement>('.prose pre')) {
  if (pre.closest('.kod')) continue;
  const fig = document.createElement('figure');
  fig.className = 'kod';
  const bar = document.createElement('div');
  bar.className = 'kod-bar';
  const dil = pre.dataset.language && pre.dataset.language !== 'plaintext' ? pre.dataset.language : '';
  const baslik = pre.dataset.title ?? '';
  const sol = document.createElement('span');
  sol.className = 'kod-ad';
  sol.textContent = baslik || dil;
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'kod-kopyala'; btn.textContent = T.copy;
  btn.setAttribute('aria-label', T.copy);
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ''));
      btn.textContent = T.copied; btn.dataset.ok = '';
      setTimeout(() => { btn.textContent = T.copy; delete btn.dataset.ok; }, 1600);
    } catch { /* izin yoksa sessiz */ }
  });
  bar.append(sol, btn);
  pre.replaceWith(fig);
  fig.append(bar, pre);
}

/* — 2. Büyütme — */
const buyut = document.createElement('dialog');
buyut.className = 'buyut';
buyut.setAttribute('aria-label', T.zoom);
buyut.innerHTML = `<button type="button" class="buyut-kapat" aria-label="${T.close}">&times;</button><figure><img alt=""><figcaption></figcaption></figure>`;
document.body.append(buyut);
const bImg = buyut.querySelector('img')!;
const bCap = buyut.querySelector('figcaption')!;
buyut.querySelector('.buyut-kapat')!.addEventListener('click', () => buyut.close());
buyut.addEventListener('click', (e) => { if (e.target === buyut) buyut.close(); });

for (const img of document.querySelectorAll<HTMLImageElement>('.prose img')) {
  if (img.closest('a')) continue;
  img.classList.add('buyutulebilir');
  img.tabIndex = 0;
  img.setAttribute('role', 'button');
  img.setAttribute('aria-label', `${T.zoom}: ${img.alt}`);
  const ac = () => {
    bImg.src = img.currentSrc || img.src;
    bImg.alt = img.alt;
    const cap = img.closest('figure')?.querySelector('figcaption')?.textContent ?? img.alt;
    bCap.textContent = cap; bCap.hidden = !cap;
    buyut.showModal();
  };
  img.addEventListener('click', ac);
  img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ac(); } });
}

export {};
