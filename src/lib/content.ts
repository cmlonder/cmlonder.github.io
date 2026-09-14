import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE, type CollectionName, type Locale } from '../config';

export type AnyEntry = CollectionEntry<CollectionName>;

/** Entry id'si "en/agent-harness" → { lang: 'en', slug: 'agent-harness' } */
export function parseId(id: string): { lang: Locale; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Locale, slug: rest.join('/') };
}

const isPublished = (e: AnyEntry) =>
  !e.data.draft || import.meta.env.DEV;

/** Bir koleksiyonun tek dildeki yayınlanmış girdileri, yeniden eskiye. */
export async function getEntries(
  name: CollectionName,
  lang: Locale
): Promise<AnyEntry[]> {
  const all = await getCollection(name);
  return all
    .filter((e) => parseId(e.id).lang === lang && isPublished(e))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Tüm koleksiyonlar tek akışta (anasayfa / arşiv / llms.txt için). */
export async function getAllEntries(lang: Locale) {
  const names: CollectionName[] = ['essays', 'notes', 'playbooks', 'signals'];
  const lists = await Promise.all(
    names.map(async (name) =>
      (await getEntries(name, lang)).map((entry) => ({ collection: name, entry }))
    )
  );
  return lists
    .flat()
    .sort((a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf());
}

/** Aynı slug başka dilde var mı? Dil değiştirici bunu kullanır. */
export async function getTranslations(
  name: CollectionName,
  slug: string
): Promise<Locale[]> {
  const all = await getCollection(name);
  return SITE.locales.filter((lang) =>
    all.some((e) => e.id === `${lang}/${slug}` && isPublished(e))
  );
}

/** Locale'e duyarlı URL. en → /essays/foo, tr → /tr/essays/foo */
export function localePath(lang: Locale, ...segments: string[]): string {
  const prefix = lang === SITE.defaultLocale ? '' : `/${lang}`;
  return `${prefix}/${segments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
}

export function entryPath(
  lang: Locale,
  collection: CollectionName,
  slug: string
): string {
  return localePath(lang, collection, slug);
}

export function formatDate(date: Date, lang: Locale): string {
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
