import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
  /**
   * Konular. Tek eksen: eskiden `topics` (altı sabit enum) ve `tags`
   * (serbest) diye iki ayrı kavram vardı, ikisi farklı yerlerde farklı
   * adla görünüyor ve raflarda hiç tıklanmıyordu. Birleştirildi.
   *
   * Serbest metin — enum değil. Bedeli: yazım hatası artık şemadan
   * geçer. Karşılığında `check-topics.mjs` tek kullanımlık ve birbirine
   * çok benzeyen konuları yakalıyor.
   *
   * config.ts'teki TOPICS altı ANA konuyu tutuyor; listelerde önce
   * onlar geliyor. Gerisi serbest.
   */
  topics: z.array(z.string()).min(1),
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
  /**
   * Kime yazıldı — standfirst'ün altında tek satır (Maggie'nin
   * "Assumed audience"ı). Okur ilk cümlede kendisi için olup olmadığını
   * anlıyor. Yazar yazıyor; ajan uydurmuyor.
   */
  audience: z.string().optional(),
  /**
   * Köken: metni ajan mı yazdı (`generated`), yoksa AI yalnızca düzeltti mi
   * (`assisted`)? Yalnız `generated` sayfada işaret çıkarır. Boşsa insan.
   */
  ai: z.enum(['generated', 'assisted']).optional(),
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
/**
 * Raf koleksiyonları — kitap, film, oyun.
 *
 * Ortak alanlar `rafBase`'te; her ortamın kendine özgü alanı ayrı.
 * Gövde metni İNCELEMEDİR: tekil sayfada o render ediliyor.
 */
/**
 * Domain omurgası. `outline` yazılmamış bölümleri de içeriyor: dosyası
 * olan bölüm bağlanıyor, olmayan "söz" olarak duruyor. İskeleti dosya
 * sistemine bağlamamak kasıtlı — plan içerikten önce var olmalı.
 */
const domains = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/domains' }),
  schema: z.object({
    title: z.string(),
    /** Tek cümle: bu domainin tezi. */
    thesis: z.string(),
    blurb: z.string(),
    order: z.number().default(0),
    outline: z.array(z.object({
      slug: z.string(),
      title: z.string(),
      /** Yazılmamış bölümün vaadi — ne anlatacak. */
      promise: z.string(),
      part: z.string().optional(),
    })).min(1),
  }),
});

/**
 * Şu sıralar — her ay kendi girdisi, kendi adresi (/now/2026-09).
 * Tek dosyalık now.md'de ay başlığına tıklamak yalnızca odak
 * kaydırıyordu; Maggie'deki gibi her güncelleme ayrı sayfa olmalı.
 */
const now = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/now' }),
  schema: z.object({
    /** Girdinin gerçek tarihi; slug ay (2026-09), tarih gün. */
    date: z.coerce.date(),
    title: z.string().optional(),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/chapters' }),
  schema: z.object({
    title: z.string(),
    domain: z.string(),
    summary: z.string(),
    audience: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Başka bir domaindeki kardeş bölüme çapraz gönderme. */
    crossRef: z.object({ domain: z.string(), slug: z.string(), why: z.string() }).optional(),
    topics: z.array(z.string()).default([]),
    ai: z.enum(['generated', 'assisted']).optional(),
    placeholder: z.boolean().default(false),
  }),
});

/**
 * Projeler.
 *
 * Sitenin tüm konumlandırması "kendi işini kuruyor" ama yapılmış tek
 * bir şey görünmüyordu. Bu bölüm, yazılanların değil KURULANLARIN
 * kaydı — ve diğerlerinden farklı olarak gerçek içerikle başlıyor.
 *
 * `status` bir vitrin değil, dürüst durum: canlı, bitti, terk edildi.
 * Terk edilmiş projeyi göstermek, göstermemekten daha çok şey anlatır.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    /** Ne işe yarıyor — tek cümle, teknik değil sonuç odaklı. */
    what: z.string(),
    status: z.enum(['live', 'shipped', 'building', 'archived']),
    started: z.coerce.date(),
    updated: z.coerce.date().optional(),
    stack: z.array(z.string()).default([]),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    /**
     * Hackathon çıktısıysa etkinliğin adı ve gönderim linki. Alan doluysa kart
     * da proje sayfası da "Hackathon" rozeti gösterir — bir hafta sonunda
     * yazılmış iş, sürdürdüğüm işlerle aynı rafta sessizce durmasın.
     */
    event: z.object({ name: z.string(), url: z.string().url().optional() }).optional(),
    /** Ölçülebilir sonuç: "189 sayfa", "günde 1 bülten, insan yok". */
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    order: z.number().default(0),
    placeholder: z.boolean().default(false),
  }),
});

const rafBase = {
  title: z.string(),
  year: z.number().optional(),
  /** done: bitirdim · queued: sırada bekliyor (Maggie'nin antilibrary'si) */
  status: z.enum(['done', 'queued']).default('done'),
  /** 1-5. Yoksa hiç gösterilmiyor — zorunlu değil. */
  rating: z.number().int().min(1).max(5).optional(),
  /** Tek cümle: neden burada. Kartta görünen metin. */
  note: z.string(),
  url: z.string().url().optional(),
  /** Yazılarla AYNI eksen: raf girdileri de konu sayfalarında çıkıyor. */
  topics: z.array(z.string()).default([]),
  order: z.number().default(0),
  placeholder: z.boolean().default(false),
};

const library = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/library' }),
  schema: z.object({
    ...rafBase,
    author: z.string(),
    pages: z.number().optional(),
  }),
});

const films = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/films' }),
  schema: z.object({
    ...rafBase,
    director: z.string(),
    runtime: z.number().optional(),
  }),
});

const games = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/games' }),
  schema: z.object({
    ...rafBase,
    developer: z.string(),
    platform: z.string().optional(),
    hours: z.number().optional(),
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
  loader: glob({ pattern: '*/[^_]*.md', base: './src/content/radar' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    generator: z.string().default('Gemini Spark'),
    promptVersion: z.string().optional(),

    // — Sınıflandırma —
    // Yalnızca GEZİNMEYE yarayanlar duruyor. status, defensibility ve
    // core_stack kaldırıldı: üç vakalı bir yazıda tek bir "durum" ya da
    // "yığın" hangi vakayı anlatıyor belirsizdi, ve bülten bir veritabanı
    // değil — hikâye anlatıyor.
    category: z.string().optional(),
    topics: z.array(z.string()).default([]),
    revenue_source: z.enum(['platform', 'interview', 'self_reported', 'developer_blog', 'estimated', 'unknown']).optional(),
    /** GitHub Radar: projenin yaşam belirtisi, 0-10; ondalık olabilir ("9.2"). Ajanın tahmini; künyede öyle yazıyor. */
    health_score: z.coerce.number().min(0).max(10).optional(),
    /** Makale Bülteni: production'a hazırlık, 0-10. Ajanın tahmini. */
    readiness_score: z.coerce.number().min(0).max(10).optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = {
  site,
  radar,
  projects,
  domains,
  chapters,
  now,
  library,
  films,
  games,
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
