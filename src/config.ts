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

/**
 * Şemsiye bölüm — Maggie'deki "The Garden"ın karşılığı.
 * Dört koleksiyonun tamamını kapsayan üst kavram. Nav'daki dropdown ve
 * anasayfadaki ikinci blok bunu kullanır.
 * İSİM GEÇİCİ: beğenilmezse sadece bu iki satır değişir.
 */
/** Okuma listesi — koleksiyon makinesinin dışında, kendi sayfası var. */
export const LIBRARY = {
  path: 'library',
  name:  { en: 'Library', tr: 'Kitaplık' } as Record<Locale, string>,
  blurb: {
    en: 'Books that changed how I think about systems, work, or myself.',
    tr: 'Sistemler, iş ya da kendim hakkında düşüncemi değiştiren kitaplar.',
  } as Record<Locale, string>,
};

/** Skill kütüphanesi — agentic kimliğin kanıtı. */
export const SKILLS = {
  path: 'skills',
  name:  { en: 'Skills', tr: 'Skill\'ler' } as Record<Locale, string>,
  blurb: {
    en: 'The actual agent instructions this site runs on. Copy them.',
    tr: 'Bu sitenin üzerinde çalıştığı gerçek ajan talimatları. Kopyalayabilirsin.',
  } as Record<Locale, string>,
};

/**
 * Yorumlar (giscus). Yorumlar repodaki GitHub Discussions'ta durur.
 *
 * enabled=false iken hiçbir şey render edilmez. Açmadan önce giscus GitHub
 * App'inin bu repoda kurulu olması gerekir (github.com/apps/giscus), yoksa
 * her yazıda hata kutusu çıkar.
 */
export const COMMENTS = {
  enabled: true,
  repo: 'cmlonder/cmlonder.github.io',
  repoId: 'R_kgDOUbFfAw',
  category: 'Announcements',
  categoryId: 'DIC_kwDOUbFfA84DFpWk',
};

/**
 * Radar — makine üretimi bölge. Bilerek ayrı tutuluyor: ana RSS'e karışmaz,
 * anasayfada Essays kartlarıyla aynı ızgarada durmaz.
 */
/**
 * Radar sınıflandırma etiketleri.
 * Anahtarlar Spark'ın frontmatter'a yazdığı değerler; burada yalnızca
 * Türkçe karşılıkları duruyor. Bilinmeyen değer sessizce gizleniyor —
 * yeni bir kategori bülteni yayınlanmaktan alıkoymasın.
 */
export const RADAR_CATEGORY: Record<string, string> = {
  kernel: 'Derin sistemler',
  ebpf: 'Derin sistemler',
  'low-level': 'Derin sistemler',
  'indie-game': 'Bağımsız oyun',
  trivia: 'Bağımsız oyun',
  'ip-monetization': 'IP gelirleştirme',
  'tech-media': 'Teknik medya',
  architecture: 'Mimari',
  'asset-library': 'Görsel varlık',
  'prompt-engineering': 'Prompt mühendisliği',
  'dev-tools': 'Geliştirici araçları',
  debugging: 'Hata ayıklama',
  'physical-tech': 'Fiziksel teknoloji',
  chemistry: 'Kimya',
  b2b: 'Görünmez B2B',
  'micro-saas': 'Mikro SaaS',
  'legal-tech': 'Yasal altyapı',
  compliance: 'Uyum',
  'post-mortem': 'Post-mortem',
  failure: 'Post-mortem',
  'cash-cow': 'Çirkin ama kârlı',
  bootstrapped: 'Bootstrapped',
  wildcard: 'Joker',
};

export const RADAR_DEFENSIBILITY: Record<string, string> = {
  deep_tech: 'Derin teknoloji',
  distribution: 'Dağıtım',
  creative_ip: 'Yaratıcı IP',
  operational: 'Operasyon',
};

export const RADAR_STATUS: Record<string, string> = {
  active: 'Faal',
  acquired: 'Satıldı',
  graveyard: 'Kapandı',
};

export const RADAR_REVENUE_SOURCE: Record<string, string> = {
  platform: 'Platform verisi',
  interview: 'Kurucu mülakatı',
  self_reported: 'Kurucu beyanı',
  unknown: 'Kaynağı belirsiz',
};

export const RADAR = {
  path: 'radar',
  name:  { en: 'Radar', tr: 'Radar' } as Record<Locale, string>,
  blurb: {
    en: 'A daily briefing written by an agent, not by me. Every claim is machine-checked before it publishes.',
    tr: 'Günlük bülten — bir ajan yazıyor, ben yazmıyorum. Her iddia yayından önce makineyle doğrulanıyor.',
  } as Record<Locale, string>,
};

/**
 * Radar serileri. Her seri ayrı bir ajan görevine karşılık gelir ve
 * Drive'da kendi klasörü vardır. Yeni bir günlük bülten eklemek:
 * buraya bir satır + Drive'da aynı adla klasör.
 */
export const RADAR_SERIES = {
  'solo-founder': {
    name: 'Solo Kurucu Bülteni',
    driveFolder: 'Radar/Solo Kurucu Bülteni',
    blurb: 'Tek kişilik girişim vakaları, doğrulanmış ciro rakamlarıyla. Günlük.',
  },
} as const;

export type RadarSeries = keyof typeof RADAR_SERIES;

export const HUB = {
  path: 'workbench',
  name:  { en: 'The Workbench', tr: 'Tezgâh' } as Record<Locale, string>,
  blurb: {
    en: 'A workbench of half-built ideas, finished arguments, and notes to myself — kept in the open.',
    tr: 'Yarım kalmış fikirler, bitmiş argümanlar ve kendime notlar — açıkta duran bir tezgâh.',
  } as Record<Locale, string>,
};

/** Anasayfa hero'su. Maggie'nin kalıbı: kalın isim + cümlenin devamı. */
export const HERO: Record<Locale, { name: string; rest: string; role: string; now: string }> = {
  en: {
    name: 'Cemal',
    rest: ' writes about building software with agents, architecture, and scale.',
    role: 'Solution architect and software engineer',
    now: 'Building end to end with agents, and something of my own',
  },
  tr: {
    name: 'Cemal',
    rest: ' ajanlarla yazılım geliştirmeyi, mimariyi ve ölçeği yazıyor.',
    role: 'Çözüm mimarı ve yazılım mühendisi',
    now: 'Uçtan uca ajanlarla geliştiriyor, bir yandan da kendi işini kuruyor',
  },
};

/** Üst navigasyon — Maggie gibi 3 öğe, biri dropdown. */
export const NAV: Record<Locale, { label: string; href: string }[]> = {
  en: [{ label: 'Uses', href: '/uses' }, { label: 'Now', href: '/now' }, { label: 'About', href: '/about' }],
  tr: [{ label: 'Kullandıklarım', href: '/uses' }, { label: 'Şu An', href: '/now' }, { label: 'Hakkında', href: '/about' }],
};

/**
 * Sayfa metinleri. Sayfa dosyaları tek dilli olduğu için içlerinde
 * `lang === 'tr' ? ... : ...` yazmak hem ölü dal hem ikizleme üretiyordu.
 * Metin burada, sayfa sadece `PAGE[lang].x` diyor.
 */
export const PAGE: Record<Locale, {
  back: string;
  home: string;
  updated: string;
  tools: string;
  repoPath: string;
  showFile: string;
  skillsLead: string;
  topicsBlurb: string;
  topicBlurb: (topic: string) => string;
  recently: string;
  findTitle: string;
  findBlurb: string;
  symptoms: string;
  clear: string;
  allPlaybooks: string;
  problem: string;
  context: string;
  match: string;
  noSelection: string;
  noMatch: string;
  findAction: string;
}> = {
  en: {
    back: 'Back to the workbench',
    home: 'Home',
    updated: 'Updated',
    tools: 'Allowed tools',
    repoPath: 'Repo path',
    showFile: 'Show the full file',
    skillsLead:
      'These are not examples — they are the files this site actually runs on. ' +
      'The page is generated from .claude/skills/ at build time, so it cannot ' +
      'drift from the source.',
    topicsBlurb: 'Everything I write sits under one of six headings. A topic can appear in any format.',
    topicBlurb: (t) => `Everything filed under ${t} — essays, notes, playbooks and signals.`,
    recently: 'Recently',
    findTitle: 'Which playbook?',
    findBlurb: 'Pick the symptoms you are seeing. Matching playbooks rise to the top.',
    symptoms: 'Symptoms',
    clear: 'Clear',
    allPlaybooks: 'All playbooks',
    problem: 'Problem',
    context: 'Context',
    match: 'match',
    noSelection: 'Nothing selected — showing everything, cheapest fix first.',
    noMatch: 'Nothing matches that combination. Try removing a symptom.',
    findAction: 'Which playbook? Find it by symptom',
  },
  tr: {
    back: 'Tezgâha dön',
    home: 'Ana sayfa',
    updated: 'Güncellendi',
    tools: 'İzinli araçlar',
    repoPath: 'Repo yolu',
    showFile: 'Tam metni göster',
    skillsLead:
      'Bunlar örnek değil — bu sitenin gerçekten kullandığı dosyalar. Sayfa, ' +
      'repodaki .claude/skills/ klasöründen build sırasında üretiliyor, o yüzden ' +
      'kaynakla ayrışamaz.',
    topicsBlurb: 'Yazdıklarım altı başlık altında toplanıyor. Bir konu her formatta görünebilir.',
    topicBlurb: (t) => `${t} konusundaki tüm yazı, not, playbook ve sinyaller.`,
    recently: 'Son eklenenler',
    findTitle: 'Hangi playbook?',
    findBlurb: "Gördüğün belirtileri seç. Eşleşen playbook'lar öne çıkar.",
    symptoms: 'Belirtiler',
    clear: 'Temizle',
    allPlaybooks: "Tüm playbook'lar",
    problem: 'Problem',
    context: 'Bağlam',
    match: 'eşleşme',
    noSelection: 'Seçim yok — hepsi listeleniyor, en ucuz çözüm önce.',
    noMatch: 'Bu kombinasyona uyan playbook yok. Bir belirti çıkarmayı dene.',
    findAction: 'Hangi playbook? Belirtiden bul',
  },
};
