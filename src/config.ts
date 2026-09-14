/**
 * Sitenin tek doğruluk kaynağı. Metin/isim değişiklikleri burada yapılır.
 */

export const SITE = {
  url: 'https://cmlonder.com',
  author: 'Cemal Önder',
  defaultLocale: 'en' as const,
  locales: ['en', 'tr'] as const,
} as const;

export type Locale = (typeof SITE.locales)[number];

/** İçerik tipleri = olgunluk seviyeleri. Konu DEĞİL. */
export const COLLECTIONS = ['essays', 'notes', 'playbooks', 'signals'] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

/**
 * 6 tematik sütun. Koleksiyondan bağımsız; bir konu her tipte görünebilir.
 * Şemada enum olarak zorunlu tutuluyor — ajanların uydurmasını engeller.
 */
export const TOPICS = [
  'agentic-development',
  'solution-architecture',
  'scale-and-performance',
  'solo-company',
  'ai-news',
  'use-case',
] as const;
export type Topic = (typeof TOPICS)[number];

type Dict = Record<Locale, string>;

export const COLLECTION_LABELS: Record<CollectionName, Dict> = {
  essays:    { en: 'Essays',    tr: 'Yazılar' },
  notes:     { en: 'Notes',     tr: 'Notlar' },
  playbooks: { en: 'Playbooks', tr: "Playbook'lar" },
  signals:   { en: 'Signals',   tr: 'Sinyaller' },
};

/** Makine tarafı için tekil tip adı (.md aynası, llms.txt, JSON-LD). */
export const ENTRY_TYPE: Record<CollectionName, string> = {
  essays: 'essay',
  notes: 'note',
  playbooks: 'playbook',
  signals: 'signal',
};

export const COLLECTION_BLURBS: Record<CollectionName, Dict> = {
  essays: {
    en: 'Finished arguments. Long, opinionated, meant to change your mind.',
    tr: 'Bitmiş argümanlar. Uzun, iddialı, fikrini değiştirmeyi amaçlayan.',
  },
  notes: {
    en: "Thinking out loud. Unfinished, exploratory, often wrong.",
    tr: 'Sesli düşünme. Bitmemiş, keşif halinde, çoğu zaman yanlış.',
  },
  playbooks: {
    en: 'Repeatable decisions. Problem, context, approach, tradeoffs.',
    tr: 'Tekrarlanabilir kararlar. Problem, bağlam, yaklaşım, tradeoff.',
  },
  signals: {
    en: 'A link and why it matters. Two sentences, no more.',
    tr: 'Bir link ve neden önemli olduğu. İki cümle, fazlası yok.',
  },
};

export const TOPIC_LABELS: Record<Topic, Dict> = {
  'agentic-development':   { en: 'Agentic Development',   tr: 'Agentic Geliştirme' },
  'solution-architecture': { en: 'Solution Architecture',  tr: 'Çözüm Mimarisi' },
  'scale-and-performance': { en: 'Scale & Performance',    tr: 'Ölçek & Performans' },
  'solo-company':          { en: 'Solo Company',           tr: 'Tek Kişilik Şirket' },
  'ai-news':               { en: 'AI News',                tr: 'AI Haberleri' },
  'use-case':              { en: 'Use Cases',              tr: "Use-Case'ler" },
};

/** Notların olgunluk aşaması (digital garden konvansiyonu). */
export const STATUS_LABELS = {
  seedling: { en: 'Seedling', tr: 'Fidan' },
  budding:  { en: 'Budding',  tr: 'Filiz' },
  evergreen:{ en: 'Evergreen',tr: 'Kökleşmiş' },
} as const;

/**
 * Anasayfa girişi. Kısa tutuluyor — sayfanın işi yazıları göstermek,
 * kendini anlatmak değil. İşveren adı kasten geçmiyor.
 */
export const INTRO: Record<Locale, { role: string; body: string }> = {
  en: {
    role: 'Solution architect',
    body:
      'I design systems that have to keep working when they get big, and lately ' +
      'I build most of them alongside agents. I write here about what that ' +
      'actually looks like in practice — the architecture decisions, the scale ' +
      'problems, and the parts of the agentic workflow nobody demos.',
  },
  tr: {
    role: 'Çözüm mimarı',
    body:
      'Büyüdüğünde de çalışmak zorunda olan sistemler tasarlıyorum ve son ' +
      "zamanlarda bunların çoğunu ajanlarla birlikte kuruyorum. Burada bunun " +
      'pratikte neye benzediğini yazıyorum — mimari kararlar, ölçek problemleri ' +
      've agentic akışın kimsenin demo yapmadığı kısımları.',
  },
};

export const UI: Record<Locale, Record<string, string>> = {
  en: {
    topics: 'Topics', allTopics: 'All topics', readMore: 'Read',
    empty: 'Nothing here yet.',
    home: 'Home', latest: 'Latest',
  },
  tr: {
    topics: 'Konular', allTopics: 'Tüm konular', readMore: 'Oku',
    empty: 'Burada henüz bir şey yok.',
    home: 'Ana sayfa', latest: 'Son eklenenler',
  },
};
