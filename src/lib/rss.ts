/**
 * Besleme tam metni — tek yerden. rss.xml, tr/rss.xml ve radar serileri
 * aynı dönüştürücüyü kullanır: markdown -> HTML (container API), göreli
 * yollar mutlak, açıklayıcı custom element'ler (canvas) atılır.
 */
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { SITE } from '../config';

let kap: AstroContainer | null = null;
const kok = SITE.url.replace(/\/$/, '');

export async function tamMetin(entry: any): Promise<string> {
  kap ??= await AstroContainer.create();
  const { Content } = await render(entry);
  const html = await kap.renderToString(Content);
  return html
    .replace(/<c-[a-z-]+[^>]*>[\s\S]*?<\/c-[a-z-]+>/g, '')
    .replace(/(src|href|srcset)="\/(?!\/)/g, `$1="${kok}/`)
    .replace(/srcset="([^"]*)"/g, (_m, v) => `srcset="${v.replace(/(^|,\s*)\/(?!\/)/g, `$1${kok}/`)}"`);
}
