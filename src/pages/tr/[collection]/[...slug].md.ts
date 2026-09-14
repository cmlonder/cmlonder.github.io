import type { APIRoute } from 'astro';
import { COLLECTIONS, SITE, ENTRY_TYPE } from '../../../config';
import { getEntries, parseId, entryPath } from '../../../lib/content';

/**
 * Her yazının ham Markdown aynası: /essays/foo -> /essays/foo.md
 * Ajanlar HTML ayrıştırmak zorunda kalmaz; llms.txt bu konvansiyonu ilan eder.
 */
export async function getStaticPaths() {
  const lists = await Promise.all(
    COLLECTIONS.map(async (collection) => {
      const entries = await getEntries(collection, 'tr');
      return entries.map((entry) => ({
        params: { collection, slug: parseId(entry.id).slug },
        props: { collection, entry },
      }));
    })
  );
  return lists.flat();
}

export const GET: APIRoute = ({ props }) => {
  const { collection, entry } = props as any;
  const d = entry.data;
  const { slug } = parseId(entry.id);
  const url = new URL(entryPath('tr', collection, slug), SITE.url).href;

  const header = [
    `# ${d.title}`,
    '',
    `> ${d.description}`,
    '',
    `- Type: ${ENTRY_TYPE[collection as keyof typeof ENTRY_TYPE]}`,
    `- Published: ${d.pubDate.toISOString().slice(0, 10)}`,
    ...(d.updatedDate ? [`- Updated: ${d.updatedDate.toISOString().slice(0, 10)}`] : []),
    `- Topics: ${d.topics.join(', ')}`,
    ...(d.tags.length ? [`- Tags: ${d.tags.join(', ')}`] : []),
    ...(d.problem ? [`- Problem: ${d.problem}`] : []),
    ...(d.context ? [`- Context: ${d.context}`] : []),
    ...(d.url ? [`- Source: ${d.source} — ${d.url}`] : []),
    `- Canonical: ${url}`,
    '',
    '---',
    '',
  ].join('\n');

  return new Response(header + entry.body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
