import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

/**
 * Çeviri kuyruğu — Türkçesi olup İngilizcesi olmayan girdiler.
 *
 * Apps Script bunu okuyup her kaynağı Drive'a indirir, Spark Drive'dan
 * çevirir, kapı (check-translations) yerine koyar. `raw`: deponun herkese
 * açık ham dosyası (frontmatter dahil); Spark siteye gitmez, Drive'dan okur.
 * `translate: false` yazan dosya kuyruğa girmez.
 */
const REPO = 'https://raw.githubusercontent.com/cmlonder/cmlonder.github.io/main/src/content';

export const GET: APIRoute = async () => {
  const kuyruk: { collection: string; slug: string; title: string; raw: string; target: string; inbox: string }[] = [];

  for (const coll of ['essays', 'notes', 'playbooks'] as const) {
    const all = await getCollection(coll);
    const en = new Set(all.filter((e) => e.id.startsWith('en/')).map((e) => e.id.slice(3)));
    for (const e of all) {
      if (!e.id.startsWith('tr/')) continue;
      const slug = e.id.slice(3);
      if (en.has(slug) || (e.data as any).draft || (e.data as any).placeholder || (e.data as any).translate === false) continue;
      kuyruk.push({ collection: coll, slug, title: e.data.title,
        raw: `${REPO}/${coll}/tr/${slug}.md`, target: `src/content/${coll}/en/${slug}.md`,
        inbox: `${coll}--${slug}` });
    }
  }
  // Bölümler: yalnız domain outline'ında olanlar yayında; klasördeki eski
  // taslaklar (outline dışı) kuyruğa girmez.
  const domains = await getCollection('domains');
  const yayinda = new Set(domains.filter((d) => d.id.startsWith('tr/')).flatMap((d) =>
    d.data.outline.map((b: { slug: string }) => `${d.id.slice(3)}/${b.slug}`)));
  const chapters = await getCollection('chapters');
  const enCh = new Set(chapters.filter((c) => c.id.startsWith('en/')).map((c) => c.id.slice(3)));
  for (const c of chapters) {
    if (!c.id.startsWith('tr/')) continue;
    const rel = c.id.slice(3);                       // aviation/slug
    if (!yayinda.has(rel) || enCh.has(rel) || (c.data as any).placeholder) continue;
    kuyruk.push({ collection: 'chapters', slug: rel, title: c.data.title,
      raw: `${REPO}/chapters/tr/${rel}.md`, target: `src/content/chapters/en/${rel}.md`,
      inbox: `chapters--${rel.replace('/', '--')}` });
  }

  return new Response(JSON.stringify({ site: SITE.url, from: 'tr', to: 'en', count: kuyruk.length, items: kuyruk }, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' },
  });
};
