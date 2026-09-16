import type { APIRoute } from 'astro';
import {
  SITE, COLLECTIONS, COLLECTION_LABELS, COLLECTION_BLURBS,
  ENTRY_TYPE, TOPICS, TOPIC_LABELS, HERO, LIBRARY,
} from '../config';
import { getCollection } from 'astro:content';
import { getEntries, parseId, entryPath, getTopicCounts } from '../lib/content';

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
      (t) => `- [${TOPIC_LABELS[t].en}](${abs(entryPath('en', 'topics' as any, t))})`
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

  const books = (await getCollection('library'))
    .filter((b) => b.id.startsWith('en/'))
    .sort((a, b) => a.data.order - b.data.order);
  if (books.length) {
    out.push(`## ${LIBRARY.name.en}`, '', LIBRARY.blurb.en, '');
    for (const b of books) {
      out.push(`- **${b.data.title}** — ${b.data.author}${b.data.year ? ` (${b.data.year})` : ''}: ${b.data.note}`);
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
