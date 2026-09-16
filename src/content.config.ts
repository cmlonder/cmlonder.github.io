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
  /**
   * Tasarımı doldurmak için eklenen yer tutucu içerik.
   * Gerçek yazıyla değiştirilecek. Bulmak için:
   *   grep -rl 'placeholder: true' src/content
   */
  placeholder: z.boolean().default(false),
  /**
   * Yorum kutusu. Boş bir kutu sayfayı fakir gösterdiği için sadece
   * essay'lerde varsayılan açık; diğer tiplerde tek tek açılır.
   */
  commentable: z.boolean().default(false),
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

/**
 * Okuma listesi. Diğer koleksiyonlardan farklı: kendi sayfası yok,
 * sadece anasayfada ve /library'de kart olarak görünür.
 */
const library = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/library' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    year: z.number().optional(),
    /** Tek cümle: neden burada. */
    note: z.string(),
    url: z.string().url().optional(),
    order: z.number().default(0),
    placeholder: z.boolean().default(false),
  }),
});

/**
 * Skill kütüphanesi. İçerik yazılmaz — repodaki gerçek .claude/skills/
 * dosyalarından okunur. Böylece sayfa asla kaynakla ayrışmaz.
 */
const skills = defineCollection({
  loader: glob({ pattern: '*/SKILL.md', base: './.claude/skills' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    'allowed-tools': z.string().optional(),
  }),
});

/**
 * Radar — makine üretimi günlük bülten.
 *
 * Diğer koleksiyonlardan kategorik olarak farklı: metni bir ajan yazıyor,
 * ben yazmıyorum. Bu yüzden eşit bir bölüm değil, ayrı bir bölge.
 *
 * `claims` alanı ajanın kendi iddia tablosudur. Güven derecesi BURADA YOK —
 * onu `pnpm verify:radar` dolduruyor: her URL'i çekip beklenen değerin
 * metinde geçip geçmediğine bakıyor. Ajanın kendi beyanına güvenmiyoruz.
 */
const radar = defineCollection({
  // Dosya düzeni: src/content/radar/<seri>/<YYYY-MM-DD>.md
  // Entry id'si "solo-founder/2026-09-16" olur; seri ve tarih buradan türer.
  loader: glob({ pattern: '*/[^_]*.md', base: './src/content/radar' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    /** Metni üreten sistem. Künyede ve JSON-LD'de görünür. */
    generator: z.string(),
    /** Yayınlanan prompt sürümü — /ai sayfasından okunabilir. */
    promptVersion: z.string(),
    claims: z.array(z.object({
      claim: z.string(),
      /** Ajan URL bulamadıysa boş bırakır; kapı bunu ERİŞİLEMEDİ sayar. */
      url: z.string().url().optional(),
      sourceDate: z.coerce.date().optional(),
      sourceType: z.string(),
      /** Kaynak metninde aranacak değer (sayı, tarih, isim). */
      expect: z.string().optional(),
    })).min(1),
    // Grafik verisi. Noktalar burada doğrulanmaz — verify-radar.mjs her
    // noktayı doğrulanmış bir iddiayla eşleştirir, eşleşmeyeni çizmez.
    charts: z.array(z.object({
      id: z.string(),
      title: z.string(),
      points: z.array(z.object({
        label: z.string(),
        value: z.number(),
      })).min(2),
    })).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  site,
  radar,
  library,
  skills,
  essays: collection(
    'essays',
    z.object({
      /** Anasayfada öne çıkar. */
      featured: z.boolean().default(false),
      commentable: z.boolean().default(true),
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
      /**
       * Karar ağacı için. Kullanıcının gördüğü belirtiler; /playbooks/find
       * sayfası bunlarla eşleştirme yapar. Boşsa playbook ağaçta çıkmaz.
       */
      symptoms: z.array(z.string()).default([]),
      /** Ağaçta kaba bir "önce buna bak" sırası. Küçük olan önce. */
      tryFirst: z.number().default(50),
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
