/**
 * Yazı gövdesine iki küçük ekleme — her markdown'da, build sırasında.
 *
 * Dış link işareti: http(s) ile başlayan bağlantılara rel="noopener" ve
 * bir sınıf. Okuyucu siteden çıkacağını tıklamadan görüyor, ve sekme
 * ele geçirme (tabnabbing) kapısı kapanıyor.
 *
 * Sätteri'nin hast ziyaretçisi kullanılıyor: client JS ile yapılsaydı
 * .md aynalarında ve JS kapalı tarayıcıda hiç olmayacaktı.
 *
 * Başlık çapası burada DEĞİL: Astro'nun başlık-id eklentisi bu
 * eklentiden sonra koşuyor, yani buradan bakıldığında başlıkların id'si
 * henüz yok. Çapa scripts/reading.ts içinde, istemci tarafında.
 */
const IC = /^(\/|#|mailto:|tel:)/;

export const disLinkler = {
  name: 'dis-linkler',

  element: [
    {
      /* Kaynağı 1200px'ten geniş görsel yazı sütununu taşabilir. */
      filter: ['img'],
      visit(node) {
        const w = Number(node.properties?.width);
        if (!(w >= 1200)) return;
        return { ...node, properties: { ...node.properties, className: [...(node.properties.className ?? []), 'genis'] } };
      },
    },
    {
      filter: ['a'],
      visit(node) {
        const href = node.properties?.href;
        if (typeof href !== 'string' || IC.test(href)) return;
        if (!/^https?:/i.test(href)) return;
        return {
          ...node,
          properties: {
            ...node.properties,
            rel: 'noopener',
            className: [...(node.properties.className ?? []), 'dis'],
          },
        };
      },
    },
  ],
};
