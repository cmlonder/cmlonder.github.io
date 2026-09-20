import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, HERO, ENTRY_TYPE } from '../../config';
import { getAllEntries, parseId, entryPath, getDomains, getChapters } from '../../lib/content';
import { getCollection } from 'astro:content';
import { tamMetin } from '../../lib/rss';

export async function GET(context: APIContext) {
  const lang = 'tr' as const;
  const items = await getAllEntries(lang);

  // Domain bölümleri de beslemede: bunlar tam yazı, liste değil.
  const chapters = await Promise.all((await getChapters(lang)).map(async (c) => ({
    content: await tamMetin(c),
    title: c.data.title,
    description: c.data.summary,
    pubDate: c.data.pubDate,
    link: `/tr/domains/${c.data.domain}/${c.id.split('/').pop()}`,
    categories: ['Domain', c.data.domain],
  })));

  // Radar bültenleri ayrı beslemedeydi; tek beslemede toplandı.
  const radar = (await getCollection('radar'))
    .filter((e) => !e.data.draft)
    .map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: e.data.date,
      link: `/radar/${e.id}`,
      categories: ['Radar'],
    }));

  return rss({
    title: `${SITE.author} — ${HERO[lang].role}`,
    description: `${SITE.author}${HERO[lang].rest}`,
    site: context.site ?? SITE.url,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>${lang}</language>`,
    items: [
      ...(await Promise.all(items.map(async ({ collection, entry }) => {
        const d = entry.data as any;
        return {
          content: await tamMetin(entry),
          title: d.title,
          description: d.description,
          pubDate: d.pubDate,
          link: entryPath(lang, collection, parseId(entry.id).slug),
          categories: [ENTRY_TYPE[collection], ...d.topics],
        };
      }))),
      ...chapters,
      ...radar,
    ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
  });
}
