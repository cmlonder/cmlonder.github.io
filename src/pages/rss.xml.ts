import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, HERO, ENTRY_TYPE } from '../config';
import { getAllEntries, parseId, entryPath, getDomains, getChapters } from '../lib/content';
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

/*
 * Tam metin: okuyucu (Reeder, NetNewsWire) yazıyı beslemede okusun, siteye
 * tıklamak zorunda kalmasın. Markdown container API ile HTML'e çevriliyor;
 * göreli yollar mutlaklaştırılıyor, açıklayıcı custom element'ler (canvas
 * simülasyonu, beslemede boş kutu) atılıyor.
 */
const kap = await AstroContainer.create();
async function tamMetin(entry: any): Promise<string> {
  const { Content } = await render(entry);
  const html = await kap.renderToString(Content);
  return html
    .replace(/<c-[a-z-]+[^>]*>[\s\S]*?<\/c-[a-z-]+>/g, '')
    .replace(/(src|href|srcset)="\/(?!\/)/g, `$1="${SITE.url.replace(/\/$/, '')}/`)
    .replace(/srcset="([^"]*)"/g, (_m, v) => `srcset="${v.replace(/(^|,\s*)\/(?!\/)/g, `$1${SITE.url.replace(/\/$/, '')}/`)}"`);
}

export async function GET(context: APIContext) {
  const lang = 'en' as const;
  const items = await getAllEntries(lang);

  // Domain bölümleri de beslemede: bunlar tam yazı, liste değil.
  const chapters = await Promise.all((await getChapters(lang)).map(async (c) => ({
    content: await tamMetin(c),
    title: c.data.title,
    description: c.data.summary,
    pubDate: c.data.pubDate,
    link: `/domains/${c.data.domain}/${c.id.split('/').pop()}`,
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
