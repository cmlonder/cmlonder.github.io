import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, RADAR, RADAR_SERIES } from '../../config';
import { tamMetin } from '../../lib/rss';

/** Bütün radar serileri tek beslemede; yazılar YOK (ana besleme onlar için). */
export async function GET(context: APIContext) {
  const entries = (await getCollection('radar'))
    .filter((e) => !e.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: `${RADAR.name.tr} — ${SITE.author}`,
    description: RADAR.blurb.tr,
    site: context.site ?? SITE.url,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>tr</language>`,
    items: await Promise.all(entries.map(async (e) => {
      const seri = e.id.split('/')[0] as keyof typeof RADAR_SERIES;
      return {
        title: e.data.title,
        description: e.data.summary,
        content: await tamMetin(e),
        pubDate: e.data.date,
        link: `/radar/${e.id}`,
        categories: [RADAR_SERIES[seri]?.name ?? seri, ...(e.data.topics ?? [])],
      };
    })),
  });
}
