/**
 * Sabit sayfalarda başlık çapaları.
 *
 * İki iş yapıyor:
 *  1. Her h2/h3'e hover'da beliren "#" bağlantısı — yazı sayfalarındaki
 *     davranışın aynısı.
 *  2. /now zaman çizelgesinde AY BAŞLIĞININ KENDİSİ bağlantı oluyor.
 *     Orası bir dikkat arşivi: her ay kendi adresi olan bir girdi,
 *     okuyucu ona doğrudan link verebilmeli.
 *
 * Neden istemci tarafında: Astro'nun başlık-id eklentisi bizim hast
 * eklentimizden sonra koşuyor, build sırasında id'ler henüz yok.
 */
const TR = document.documentElement.lang === 'tr';

for (const yazi of document.querySelectorAll<HTMLElement>('.prose')) {
  const zamanCizelgesi = yazi.classList.contains('timeline');

  for (const b of yazi.querySelectorAll<HTMLElement>('h2[id], h3[id]')) {
    if (b.querySelector('.capa, .ay-bag')) continue;

    // Zaman çizelgesinde ay başlığının tamamı bağlantı.
    if (zamanCizelgesi && b.tagName === 'H2') {
      const a = document.createElement('a');
      a.className = 'ay-bag';
      a.href = `#${encodeURIComponent(b.id)}`;
      a.append(...b.childNodes);
      b.append(a);
      continue;
    }

    const a = document.createElement('a');
    a.className = 'capa';
    a.href = `#${encodeURIComponent(b.id)}`;
    a.textContent = '#';
    a.setAttribute('aria-label', TR ? 'Bu başlığa bağlantı' : 'Link to this heading');
    b.append(a);
  }
}

export {};
