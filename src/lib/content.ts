import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE, type CollectionName, type Locale, type Topic } from '../config';

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

/** Bir konuya ait tüm girdiler, koleksiyon fark etmeksizin. */
export async function getEntriesByTopic(topic: Topic, lang: Locale) {
  const all = await getAllEntries(lang);
  return all.filter(({ entry }) => (entry.data.topics as Topic[]).includes(topic));
}

/** Konu → o konudaki girdi sayısı. Boş konular listede gösterilmez. */
export async function getTopicCounts(lang: Locale): Promise<Map<Topic, number>> {
  const all = await getAllEntries(lang);
  const counts = new Map<Topic, number>();
  for (const { entry } of all) {
    for (const topic of entry.data.topics as Topic[]) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return counts;
}

/**
 * "1 entry" / "3 entries" — Türkçede sayıdan sonra çoğul eki gelmez,
 * bu yüzden dil bazlı ayrışıyor.
 */
export function countLabel(n: number, lang: Locale): string {
  if (lang === 'tr') return `${n} girdi`;
  return `${n} ${n === 1 ? 'entry' : 'entries'}`;
}
