import type { APIRoute } from 'astro';
import { SITE } from '../config';

/**
 * AI tarayıcıları kasten ENGELLENMİYOR — ajanların bu içeriği bulması
 * sitenin amaçlarından biri. llms.txt burada ilan ediliyor.
 */
export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${new URL('/sitemap-index.xml', SITE.url).href}`,
      `# Machine-readable index: ${new URL('/llms.txt', SITE.url).href}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
