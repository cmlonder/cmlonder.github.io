import type { APIRoute } from 'astro';
import { SITE, COLLECTIONS, COLLECTION_LABELS, ENTRY_TYPE } from '../config';
import { getAllEntries, parseId, entryPath, formatDate } from '../lib/content';

/**
 * llms-full.txt — her dildeki her girdinin tam indeksi.
 * Gövde metni yok (o .md aynasında); burada sadece adresler ve özetler var,
 * böylece dosya ajanların context'ini şişirmeden tarama yapılabilir kalıyor.
 */
export const GET: APIRoute = async () => {
  const abs = (p: string) => new URL(p, SITE.url).href;
  const out: string[] = [
    `# ${SITE.author} — complete index`,
    '',
    '> Every entry on the site. Append nothing: each link already points at the ' +
      'Markdown mirror. English entries live at the root, Turkish under /tr/.',
    '',
  ];

  for (const lang of SITE.locales) {
    const items = await getAllEntries(lang);
    if (!items.length) continue;
    out.push(`## ${lang === 'en' ? 'English' : 'Türkçe'} (${items.length})`, '');

    for (const c of COLLECTIONS) {
      const ofType = items.filter((i) => i.collection === c);
      if (!ofType.length) continue;
      out.push(`### ${COLLECTION_LABELS[c][lang]} — \`${ENTRY_TYPE[c]}\``, '');
      for (const { entry } of ofType) {
        const { slug } = parseId(entry.id);
        const d = entry.data as any;
        out.push(
          `- [${d.title}](${abs(entryPath(lang, c, slug))}.md) — ${formatDate(d.pubDate, 'en')}` +
            ` — topics: ${d.topics.join(', ')}`,
          `  ${d.description}`
        );
      }
      out.push('');
    }
  }

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
