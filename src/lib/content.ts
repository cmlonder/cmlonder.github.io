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

/**
 * "About 1 year ago" / "8 ay önce" — Maggie'nin liste sayfalarındaki kalıp.
 * Mutlak tarih `datetime` niteliğinde kalır; bu sadece görünen metin.
 */
export function relativeDate(date: Date, lang: Locale, now = new Date()): string {
  const days = Math.round((now.getTime() - date.getTime()) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    numeric: 'auto',
  });
  if (days < 1) return lang === 'tr' ? 'bugün' : 'today';
  /*
   * Türkçe ICU verisi -2 gün için "evvelsi gün" üretiyor. Doğru bir
   * kelime ama günlük Türkçede kullanılmıyor; okur duraksıyor.
   * Sadece bu durumu ele alıyoruz — "dün", "geçen ay", "geçen yıl"
   * gibi diğer 'auto' karşılıkları doğal, onlara dokunmuyoruz.
   */
  if (lang === 'tr' && days === 2) return '2 gün önce';
  if (days < 30) return rtf.format(-days, 'day');
  if (days < 365) return rtf.format(-Math.round(days / 30), 'month');
  return rtf.format(-Math.round(days / 365), 'year');
}

/** Aynı konuyu paylaşan diğer girdiler — okuma sayfasının altında. */
export async function getRelated(
  collection: CollectionName,
  entry: AnyEntry,
  lang: Locale,
  limit = 4
) {
  const topics = new Set(entry.data.topics as string[]);
  const all = await getAllEntries(lang);
  return all
    .filter((i) => i.entry.id !== entry.id)
    .map((i) => ({
      ...i,
      shared: (i.entry.data.topics as string[]).filter((t) => topics.has(t)).length,
    }))
    .filter((i) => i.shared > 0)
    .sort((a, b) => b.shared - a.shared || b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf())
    .slice(0, limit);
}

/** Aynı koleksiyonda tarihe göre önceki ve sonraki girdi. */
export async function getNeighbours(
  collection: CollectionName,
  entry: AnyEntry,
  lang: Locale
) {
  const list = await getEntries(collection, lang);   // yeniden eskiye
  const i = list.findIndex((e) => e.id === entry.id);
  return {
    newer: i > 0 ? list[i - 1] : null,
    older: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  };
}

/**
 * Backlink haritası — "buraya bağlananlar".
 *
 * Digital garden'ın ikinci imzası. Yazıların gövdesindeki iç bağlantılar
 * taranıp ters indeks kuruluyor. Şu an içerikte tek bir iç bağlantı var,
 * dolayısıyla çoğu yazıda bölüm hiç görünmüyor — ilk bağlantıyı yazdığın
 * an kendiliğinden dolmaya başlar.
 *
 * Yalnızca aynı dildeki yazılar eşleşiyor; /tr/ ve kök ayrı ağlar.
 */
export type Backlink = { collection: CollectionName; id: string; title: string; href: string };

// Dile göre ayrı: /tr/ ve kök ayrı ağlar. Tek bir önbellek
// kullanınca ilk çağıran dilin haritası diğerine de dönüyordu.
const _backlinks = new Map<Locale, Map<string, Backlink[]>>();

export async function getBacklinks(lang: Locale): Promise<Map<string, Backlink[]>> {
  const cached = _backlinks.get(lang);
  if (cached) return cached;

  const map = new Map<string, Backlink[]>();
  const all = await getAllEntries(lang);

  // Hedef yolu -> giriş. Yol, sitenin gerçek URL'i.
  const byHref = new Map<string, { collection: CollectionName; entry: any }>();
  for (const { collection, entry } of all) {
    byHref.set(entryPath(lang, collection, parseId(entry.id).slug), { collection, entry });
  }

  for (const { collection, entry } of all) {
    const body: string = (entry as any).body ?? '';
    const kaynak: Backlink = {
      collection,
      id: entry.id,
      title: (entry.data as any).title,
      href: entryPath(lang, collection, parseId(entry.id).slug),
    };
    // Markdown bağlantılarındaki site içi yolları topla.
    const hedefler = new Set(
      [...body.matchAll(/\]\((\/[^)\s#?]+)/g)].map((m) => m[1].replace(/\/$/, '')),
    );
    for (const h of hedefler) {
      const hedef = byHref.get(h) ?? byHref.get(h + '/');
      if (!hedef) continue;
      const anahtar = hedef.entry.id;
      if (anahtar === entry.id) continue;               // kendine bağlantı sayılmaz
      const liste = map.get(anahtar) ?? [];
      if (!liste.some((b) => b.id === kaynak.id)) liste.push(kaynak);
      map.set(anahtar, liste);
    }
  }

  _backlinks.set(lang, map);
  return map;
}

/**
 * Domain ve bölümler dile göre süzülür.
 *
 * Bunlar `parseId` kullanamıyor: domain'ler `<dil>/<slug>`, bölümler ise
 * `<dil>/<domain>/<slug>` şeklinde iki kademeli. Süzme elle yapılıyor.
 *
 * Bu yardımcılar var çünkü yokluklarında İngilizce sayfalar `startsWith('tr/')`
 * yazıp Türkçe içeriği İngilizce kabukta sunuyordu.
 */
export async function getDomains(lang: Locale) {
  return (await getCollection('domains'))
    .filter((d) => d.id.startsWith(`${lang}/`))
    .sort((a, b) => a.data.order - b.data.order);
}

export function domainSlug(id: string): string {
  return id.split('/').pop()!;
}

export async function getChapters(lang: Locale, domain?: string) {
  const all = (await getCollection('chapters')).filter((c) => c.id.startsWith(`${lang}/`));
  return domain ? all.filter((c) => c.data.domain === domain) : all;
}

export function chapterSlug(id: string): string {
  return id.split('/').pop()!;
}

/**
 * Okuma süresi — dakika.
 *
 * Kelime sayısı gövdenin ham markdown'ından; frontmatter ve kod bloğu
 * dahil, çünkü ikisi de okunuyor. 200 kelime/dakika ortalama okuma hızı.
 * 1 dakikanın altına düşmüyor: "0 dk" diye bir okuma yok.
 */
export function readingMinutes(entry: { body?: string }): number {
  const kelime = (entry.body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(kelime / 200));
}

/**
 * Etiketler — konulardan farklı bir eksen.
 *
 * `topics` altı sabit sütun ve zorunlu; `tags` serbest ve isteğe bağlı.
 * Şemada baştan beri vardı ama gezilebilir değildi: hiçbir sayfası yoktu.
 *
 * Slug URL için; arama slug üzerinden yapılıyor çünkü etiket serbest
 * metin ve "Kafka" ile "kafka" aynı etiket sayılmalı.
 */
export const tagSlug = (t: string) =>
  t.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function getAllTags(lang: Locale) {
  const all = await getAllEntries(lang);
  const sayac = new Map<string, { tag: string; count: number }>();
  for (const { entry } of all) {
    for (const ham of ((entry.data as any).tags ?? []) as string[]) {
      const slug = tagSlug(ham);
      if (!slug) continue;
      const v = sayac.get(slug) ?? { tag: ham, count: 0 };
      v.count++;
      sayac.set(slug, v);
    }
  }
  return [...sayac.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getEntriesByTag(slug: string, lang: Locale) {
  const all = await getAllEntries(lang);
  return all.filter(({ entry }) =>
    (((entry.data as any).tags ?? []) as string[]).some((t) => tagSlug(t) === slug));
}
