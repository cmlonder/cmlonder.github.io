import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, INTRO, ENTRY_TYPE } from '../config';
import { getAllEntries, parseId, entryPath } from '../lib/content';

export async function GET(context: APIContext) {
  const lang = 'en' as const;
  const items = await getAllEntries(lang);

  return rss({
    title: `${SITE.author} — ${INTRO[lang].role}`,
    description: INTRO[lang].body,
    site: context.site ?? SITE.url,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>${lang}</language>`,
    items: items.map(({ collection, entry }) => {
      const d = entry.data as any;
      return {
        title: d.title,
        description: d.description,
        pubDate: d.pubDate,
        link: entryPath(lang, collection, parseId(entry.id).slug),
        categories: [ENTRY_TYPE[collection], ...d.topics],
      };
    }),
  });
}
