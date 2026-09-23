import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, TRANSLATION_TARGETS } from '../../config';

/**
 * Çeviri kuyruğu — Türkçesi olup hedef dilde karşılığı olmayan girdiler.
 *
 * Apps Script bunu okuyup her kaynağı Drive/Ceviri/Kuyruk/<dil>/ altına indirir,
 * Spark Drive'dan çevirir, kapı (check-translations) yerine koyar. `raw`:
 * deponun herkese açık ham dosyası (frontmatter dahil); Spark siteye gitmez.
 * `translate: false` yazan dosya kuyruğa girmez. Bölümler: yalnız domain
 * outline'ındakiler (klasördeki taslaklar değil).
 */
const REPO = 'https://raw.githubusercontent.com/cmlonder/cmlonder.github.io/main/src/content';

export function getStaticPaths() {
  return TRANSLATION_TARGETS.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as string;
  const kuyruk: { collection: string; slug: string; title: string; raw: string; target: string; inbox: string }[] = [];
  const dahil = (d: any) => !d.draft && !d.placeholder && d.translate !== false;

  for (const coll of ['essays', 'notes', 'playbooks'] as const) {
    const all = await getCollection(coll);
    const var_ = new Set(all.filter((e) => e.id.startsWith(`${lang}/`)).map((e) => e.id.slice(lang.length + 1)));
    for (const e of all) {
      if (!e.id.startsWith('tr/')) continue;
      const slug = e.id.slice(3);
      if (var_.has(slug) || !dahil(e.data)) continue;
      kuyruk.push({ collection: coll, slug, title: e.data.title,
        raw: `${REPO}/${coll}/tr/${slug}.md`, target: `src/content/${coll}/${lang}/${slug}.md`,
        inbox: `${lang}--${coll}--${slug}` });
    }
  }
  const domains = await getCollection('domains');
  const yayinda = new Set(domains.filter((d) => d.id.startsWith('tr/')).flatMap((d) =>
    d.data.outline.map((b: { slug: string }) => `${d.id.slice(3)}/${b.slug}`)));
  const chapters = await getCollection('chapters');
  const varCh = new Set(chapters.filter((c) => c.id.startsWith(`${lang}/`)).map((c) => c.id.slice(lang.length + 1)));
  for (const c of chapters) {
    if (!c.id.startsWith('tr/')) continue;
    const rel = c.id.slice(3);
    if (!yayinda.has(rel) || varCh.has(rel) || !dahil(c.data)) continue;
    kuyruk.push({ collection: 'chapters', slug: rel, title: c.data.title,
      raw: `${REPO}/chapters/tr/${rel}.md`, target: `src/content/chapters/${lang}/${rel}.md`,
      inbox: `${lang}--chapters--${rel.replace('/', '--')}` });
  }

  return new Response(JSON.stringify({ site: SITE.url, from: 'tr', to: lang, count: kuyruk.length, items: kuyruk }, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=300' },
  });
};
