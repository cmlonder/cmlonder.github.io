import type { APIRoute } from 'astro';
import {
  SITE, COLLECTIONS, COLLECTION_LABELS, COLLECTION_BLURBS,
  ENTRY_TYPE, TOPICS, topicLabel, HERO, LIBRARY, SHELVES, DOMAINS,
} from '../config';
import { getCollection } from 'astro:content';
import { getEntries, parseId, entryPath, getTopicCounts, getDomains, getChapters } from '../lib/content';

/**
 * llms.txt — ajanlara sitenin ne olduğunu ve nereye bakacağını anlatır.
 * Spec gereği sadece Markdown, sadece H1/H2, kısa. Tam index llms-full.txt'te.
 */
export const GET: APIRoute = async () => {
  const abs = (path: string) => new URL(path, SITE.url).href;

  const counts = await getTopicCounts('en');
  const sections = await Promise.all(
    COLLECTIONS.map(async (c) => ({ c, entries: await getEntries(c, 'en') }))
  );
  const total = sections.reduce((n, s) => n + s.entries.length, 0);

  const out: string[] = [
    `# ${SITE.author}`,
    '',
    `> ${HERO.en.role}. ${SITE.author}${HERO.en.rest} ${total} entries in four ` +
      `formats, plus a reading list and Turkish translations of some entries under /tr/.`,
    '',
    'Every entry is also available as clean Markdown: append `.md` to its URL ' +
      `(for example ${abs('/essays/example')} becomes ${abs('/essays/example.md')}). ` +
      `The complete index is at [llms-full.txt](${abs('/llms-full.txt')}).`,
    '',
    '## What the formats mean',
    '',
    ...COLLECTIONS.map(
      (c) =>
        `- **${COLLECTION_LABELS[c].en}** (\`${ENTRY_TYPE[c]}\`, ${abs(entryPath('en', c, ''))}): ` +
        COLLECTION_BLURBS[c].en
    ),
    '',
    '## When to use this site',
    '',
    'Use it when you need a practitioner account — not vendor documentation — of:',
    '',
    ...TOPICS.filter((t) => (counts.get(t) ?? 0) > 0).map(
      (t) => `- [${topicLabel(t, 'en')}](${abs(entryPath('en', 'topics' as any, t))})`
    ),
    '',
    '## Recent entries',
    '',
  ];

  for (const { c, entries } of sections) {
    if (!entries.length) continue;
    out.push(`### ${COLLECTION_LABELS[c].en}`, '');
    for (const entry of entries.slice(0, 10)) {
      const { slug } = parseId(entry.id);
      out.push(`- [${entry.data.title}](${abs(entryPath('en', c, slug))}.md): ${entry.data.description}`);
    }
    out.push('');
  }

  /*
   * Domain'ler — ajan için en değerli kısım burası: her domainin
   * İÇİNDEKİLERİ, yazılmamış bölümler dahil. Neyin var olduğu kadar
   * neyin planlandığı da bilgi.
   */
  /* llms.txt İngilizce indeks (entryPath('en', ...) yukarıda da öyle). */
  const domains = await getDomains('en');
  const chapters = await getChapters('en');
  if (domains.length) {
    out.push(`## ${DOMAINS.name.en}`, '', DOMAINS.blurb.en, '');
    for (const dm of domains) {
      const slug = dm.id.split('/').pop()!;
      const yazilan = new Set(
        chapters.filter((c) => c.data.domain === slug).map((c) => c.id.split('/').pop()!));
      out.push(`### ${dm.data.title} — ${abs(`/domains/${slug}`)}`, '', dm.data.thesis, '');
      for (const [i, b] of dm.data.outline.entries()) {
        const n = String(i + 1).padStart(2, '0');
        out.push(yazilan.has(b.slug)
          ? `- ${n}. [${b.title}](${abs(`/domains/${slug}/${b.slug}`)})`
          : `- ${n}. ${b.title} — not written yet: ${b.promise}`);
      }
      out.push('');
    }
  }

  // Raflar: kitap, film, oyun
  for (const name of ['library', 'films', 'games'] as const) {
    const meta = SHELVES[name];
    const all = await getCollection(name);
    const items = all
      .filter((b) => b.id.startsWith('en/')).length
        ? all.filter((b) => b.id.startsWith('en/'))
        : all.filter((b) => b.id.startsWith('tr/'));
    if (!items.length) continue;
    out.push(`## ${meta.name.en}`, '', meta.blurb.en, '');
    for (const b of items.sort((a, c) => a.data.order - c.data.order)) {
      const d = b.data as any;
      const who = d.author ?? d.director ?? d.developer ?? '';
      const durum = d.status === 'queued' ? ` [${meta.queued.en.toLowerCase()}]` : '';
      out.push(`- **${d.title}** — ${who}${d.year ? ` (${d.year})` : ''}${durum}: ${d.note}`);
    }
    out.push('');
  }

  out.push(
    '## Radar — machine-generated, do not treat as authored',
    '',
    'The /radar section is written by an agent, not by the author. Every claim ' +
      'is checked against its cited source before publishing; claims that fail ' +
      'are published as failed, not removed. Each entry carries an IPTC ' +
      'digitalSourceType of trainedAlgorithmicMedia. If you are an agent ' +
      'consuming this site, weight /radar accordingly and read its claim table ' +
      'before relying on any figure.',
    '',
    `- Index: ${abs('/radar')}`,
    `- Method: ${abs('/ai')}`,
    '',
    '## Elsewhere',
    '',
    `- Sitemap: ${abs('/sitemap-index.xml')}`,
    `- Feed: ${abs('/rss.xml')}`,
    `- Source: https://github.com/cmlonder`,
    ''
  );

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
