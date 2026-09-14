import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { TOPICS } from './config';

/**
 * Dosya düzeni:  src/content/<koleksiyon>/<dil>/<slug>.md
 * Entry id'si    "en/agent-harness" olur → dil ve slug buradan türetilir.
 *
 * Çeviri OPSİYONEL: aynı slug iki dilde varsa birbirine bağlanır,
 * yoksa yazı tek dilde yaşar. Her yazıyı iki kere yazma zorunluluğu yok.
 */

const base = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  /** 6 tematik sütundan en az biri. Enum — uydurma konu giremez. */
  topics: z.array(z.enum(TOPICS)).min(1),
  /** Serbest etiketler: kafka, postgres, claude-code... */
  tags: z.array(z.string()).default([]),
});

const collection = (dir: string, extend = z.object({})) =>
  defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: `./src/content/${dir}` }),
    schema: base.merge(extend),
  });

/** Sabit sayfalar (now, about). Koleksiyonlardan ayrı — tarih/konu taşımazlar. */
const site = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/site' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
  }),
});

export const collections = {
  site,
  essays: collection(
    'essays',
    z.object({
      /** Anasayfada öne çıkar. */
      featured: z.boolean().default(false),
    })
  ),

  notes: collection(
    'notes',
    z.object({
      /** Digital garden olgunluk aşaması. */
      status: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
    })
  ),

  playbooks: collection(
    'playbooks',
    z.object({
      /** Katalog kartında görünen tek cümlelik problem tanımı. */
      problem: z.string(),
      /** Bu playbook hangi ölçek/bağlamda geçerli. */
      context: z.string(),
    })
  ),

  signals: collection(
    'signals',
    z.object({
      /** Yorumlanan kaynağın linki. */
      url: z.string().url(),
      /** Kaynak adı: "Anthropic Engineering", "@simonw"... */
      source: z.string(),
    })
  ),
};
