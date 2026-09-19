import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { COLLECTIONS, COLLECTION_LABELS, SHELVES, type Locale } from '../config';
import { entryPath, localePath, parseId } from '../lib/content';

/**
 * İç bağlantı önizlemesi için sözlük: yol -> { başlık, açıklama, tür }.
 * Yalnızca frontmatter'daki açıklama; gövdeden cümle uydurulmuyor.
 */
export const GET: APIRoute = async () => {
  const out: Record<string, { t: string; d: string; k: string }> = {};
  for (const c of COLLECTIONS) {
    for (const e of (await getCollection(c as any)) as any[]) {
      const { lang, slug } = parseId(e.id);
      out[entryPath(lang as Locale, c, slug).replace(/\/$/, '')] =
        { t: e.data.title, d: e.data.description, k: COLLECTION_LABELS[c][lang as Locale] };
    }
  }
  for (const raf of ['library', 'films', 'games'] as const) {
    for (const e of (await getCollection(raf as any)) as any[]) {
      const [lang, slug] = e.id.split('/') as [Locale, string];
      out[localePath(lang, SHELVES[raf].path, slug).replace(/\/$/, '')] =
        { t: e.data.title, d: e.data.note, k: SHELVES[raf].name[lang] };
    }
  }
  for (const e of (await getCollection('chapters')) as any[]) {
    const [lang, domain, slug] = e.id.split('/') as [Locale, string, string];
    out[localePath(lang, 'domains', domain, slug).replace(/\/$/, '')] =
      { t: e.data.title, d: e.data.summary, k: domain };
  }
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json; charset=utf-8' } });
};
