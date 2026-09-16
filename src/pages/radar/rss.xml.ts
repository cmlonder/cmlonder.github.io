import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, RADAR } from '../../config';
import verification from '../../data/radar-verification.json';

/**
 * Radar'ın kendi beslemesi. Ana /rss.xml'e KARIŞMAZ — makine üretimi içeriğe
 * istemeden abone olmak mümkün olmasın.
 */
export async function GET(context: APIContext) {
  const v = verification as Record<string, any>;
  const entries = (await getCollection('radar'))
    .filter((e) => !e.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: `${SITE.author} — ${RADAR.name.tr}`,
    description: RADAR.blurb.tr,
    site: context.site ?? SITE.url,
    customData: '<language>tr</language>',
    items: entries.map((e) => {
      const s = v[e.id];
      const audit = s
        ? ` [Makine üretimi · ${s.passed}/${s.total} iddia doğrulandı${s.failed ? `, ${s.failed} doğrulanamadı` : ''}]`
        : ' [Makine üretimi]';
      return {
        title: e.data.title,
        description: e.data.summary + audit,
        pubDate: e.data.date,
        link: `/radar/${e.id}`,
        categories: ['radar', 'machine-generated'],
      };
    }),
  });
}
