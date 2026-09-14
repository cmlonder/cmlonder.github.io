import { COLLECTIONS, type Locale } from '../config';
import { getEntries, parseId } from './content';

/**
 * Bir dil için tüm <koleksiyon>/<slug> yollarını üretir.
 * İki route dosyası (en ve tr) da bunu kullanır — mantık tek yerde.
 */
export async function entryPaths(lang: Locale) {
  const lists = await Promise.all(
    COLLECTIONS.map(async (collection) => {
      const entries = await getEntries(collection, lang);
      return entries.map((entry) => ({
        params: { collection, slug: parseId(entry.id).slug },
        props: { collection, entry, lang },
      }));
    })
  );
  return lists.flat();
}
