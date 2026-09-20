import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, RADAR, RADAR_SERIES } from '../../../config';
import { tamMetin } from '../../../lib/rss';

/** Seri başına besleme: okur (ve Buttondown) yalnız istediği seriyi alsın. */
export function getStaticPaths() {
  return Object.keys(RADAR_SERIES).map((series) => ({ params: { series } }));
}

export async function GET(context: APIContext) {
  const series = context.params.series as keyof typeof RADAR_SERIES;
  const meta = RADAR_SERIES[series];
  const entries = (await getCollection('radar'))
    .filter((e) => e.id.startsWith(`${series}/`) && !e.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: `${meta.name} — ${SITE.author}`,
    description: meta.blurb,
    site: context.site ?? SITE.url,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>tr</language>`,
    items: await Promise.all(entries.map(async (e) => ({
      title: e.data.title,
      description: e.data.summary,
      content: await tamMetin(e),
      pubDate: e.data.date,
      link: `/radar/${e.id}`,
      categories: [RADAR.name.tr, meta.name, ...(e.data.topics ?? [])],
    }))),
  });
}
