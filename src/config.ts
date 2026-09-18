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
  playbooks: { en: 'Playbooks', tr: "Kılavuzlar" },
  signals:   { en: 'Signals',   tr: 'Bulduklarım' },
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
    tr: 'Arkasında durabildiğim argümanlar. Uzun ve iddialılar, çünkü amaçları seni ikna etmek.',
  },
  notes: {
    en: "Thinking out loud. Unfinished, exploratory, often wrong.",
    tr: 'Sesli düşündüğüm yer. Henüz bitmediler, bir kısmı da muhtemelen yanlış çıkacak.',
  },
  playbooks: {
    en: 'Repeatable decisions. Problem, context, approach, tradeoffs.',
    tr: 'Birden fazla kez verdiğim için artık bir yöntemi oturmuş kararlar. Her birinde problemi, bağlamı ve neyi neye karşı takas ettiğimi yazıyorum.',
  },
  signals: {
    en: 'A link and why it matters. Two sentences, no more.',
    tr: 'Okuduğum ve aklımda kalan linkler. Her birine neden önemli olduğunu anlatan iki cümle ekliyorum, fazlasını yazmıyorum.',
  },
};

export const TOPIC_LABELS: Record<Topic, Dict> = {
  'agentic-development':   { en: 'Agentic Development',   tr: 'Ajanlarla Geliştirme' },
  'solution-architecture': { en: 'Solution Architecture',  tr: 'Çözüm Mimarisi' },
  'scale-and-performance': { en: 'Scale & Performance',    tr: 'Ölçek & Performans' },
  'solo-company':          { en: 'Solo Company',           tr: 'Tek Kişilik Şirket' },
  'ai-news':               { en: 'AI News',                tr: 'Yapay Zeka Haberleri' },
  'use-case':              { en: 'Use Cases',              tr: "Use-Case'ler" },
};

/** Notların olgunluk aşaması (digital garden konvansiyonu). */
export const STATUS_LABELS = {
  /* Türkçede sıra: filiz (yeni sürgün) -> fidan (genç ağaç).
     Önceden ters yazılmıştı. */
  seedling: { en: 'Seedling', tr: 'Filiz' },
  budding:  { en: 'Budding',  tr: 'Fidan' },
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
/**
 * Raflar — kitap, film, oyun.
 *
 * Üçü de aynı şablonu paylaşıyor ama alanları kendine özgü: kitabın
 * yazarı, filmin yönetmeni, oyunun geliştiricisi var.
 *
 * Maggie'nin "Antilibrary"si burada ayrı bir koleksiyon değil, her rafın
 * içindeki `queued` durumu. Böylece fikir üç ortama da genelleşiyor:
 * okunmamış kitap, izlenmemiş film, oynanmamış oyun.
 */
/**
 * Domain'ler — tek bir alanda parça parça yazılan, ama bütün olarak
 * okunabilen gövdeler.
 *
 * Koleksiyonlar (yazı/not/playbook) bir BİÇİM ekseni, konular bir KONU
 * ekseni. Domain üçüncü bir eksen: aynı zanaatın belirli bir sektöre
 * uygulanması. Havacılıkta overbooking ile e-ticarette oversell aynı
 * problem — bunu görebilmek tek alan uzmanlığından zor taklit edilir.
 *
 * Omurga dosyası yazılmamış bölümleri de tanımlıyor: içindekiler ilk
 * günden tam yayınlanıyor, yazılmamışlar söz olarak duruyor.
 */
/**
 * İletişim. Sitede ikna olmuş bir okurun gidecek yeri yoktu: ne e-posta,
 * ne ne yaptığına dair bir cümle. Tek çağrı "RSS ile takip et"ti.
 *
 * `open` alanları şimdilik yer tutucu — doldurulunca sayfada görünürler,
 * boşken hiç render edilmiyorlar.
 */
export const CONTACT = {
  email: 'cemalonder1@gmail.com',
  github: 'https://github.com/cmlonder',
  linkedin: 'https://www.linkedin.com/in/cmlonder/',
  /** Boş bırakılan alanlar sayfada görünmez. */
  open: {
    en: ['', ''],
    tr: ['', ''],
  } as Record<Locale, string[]>,
  cv: '',
  label: {
    en: { write: 'Write to me', elsewhere: 'Elsewhere', open: 'What I am up for', cv: 'CV' },
    tr: { write: 'Bana yaz', elsewhere: 'Başka yerlerde', open: 'Ne yapmaya açığım', cv: 'CV' },
  } as Record<Locale, Record<string, string>>,
  blurb: {
    en: 'The fastest way to reach me is email. I read everything; I answer what I can.',
    tr: 'Bana ulaşmanın en hızlı yolu e-posta. Hepsini okuyorum, elimden geleni yanıtlıyorum.',
  } as Record<Locale, string>,
};

export const PROJECTS = {
  path: 'projects',
  name:  { en: 'Projects', tr: 'Projeler' } as Record<Locale, string>,
  blurb: {
    en: 'Things I built, with what they actually do and where they stand.',
    tr: 'Kurduğum şeyler; her birinin ne işe yaradığını ve şu an hangi durumda olduğunu yazdım.',
  } as Record<Locale, string>,
};

export const PROJECT_STATUS: Record<string, Record<Locale, string>> = {
  live:     { en: 'Live',      tr: 'Canlı' },
  shipped:  { en: 'Shipped',   tr: 'Yayında' },
  building: { en: 'Building',  tr: 'Yapılıyor' },
  archived: { en: 'Archived',  tr: 'Arşivde' },
};

/** Proje sayfası metinleri — sayfa dosyaları tek dilli, ölü dal olmasın. */
export const PROJECT_UI: Record<Locale, Record<string, string>> = {
  en: { started: 'Started', updated: 'Updated', stack: 'Stack', live: 'Live', source: 'Source' },
  tr: { started: 'Başladı', updated: 'Güncellendi', stack: 'Yığın', live: 'Adres', source: 'Kaynak' },
};

export const DOMAINS = {
  path: 'domains',
  name:  { en: 'Domains', tr: 'Domain' } as Record<Locale, string>,
  blurb: {
    en: 'One domain at a time, written in chapters. The outline is public from day one — including what is not written yet.',
    tr: 'Tek bir alanı bölüm bölüm yazıyorum. İçindekiler listesi ilk günden açıkta duruyor, daha yazmadığım bölümler de dahil.',
  } as Record<Locale, string>,
  readAll: { en: 'read', tr: 'oku' },
};

/**
 * Domain sayfa metinleri. Sayfa dosyaları tek dilli olduğu için içlerinde
 * `lang === 'tr' ? ... : ...` yazmak ölü dal üretiyor ve astro check
 * hata veriyor — bu projede daha önce aynı sorun PAGE sözlüğüyle çözüldü.
 */
export const DOMAIN_UI: Record<Locale, Record<string, string>> = {
  en: {
    chapters: 'chapters',
    written: 'chapters written',
    contents: 'Contents',
    note: 'Unwritten chapters are listed too. The line beneath each is a promise of what it will cover.',
    readAll: 'Read written chapters on one page',
    chapter: 'Chapter',
    of: 'of',
    nextUp: 'Next chapter',
    notYet: 'Not written yet',
    backToSpine: 'All chapters',
    onePage: 'One page',
    crossRef: 'Related, in another domain',
  },
  tr: {
    chapters: 'bölüm',
    written: 'bölüm yazıldı',
    contents: 'İçindekiler',
    note: 'Yazılmamış bölümler de listede. Altlarındaki cümle, ne anlatacaklarına dair söz.',
    readAll: 'Yazılmış bölümleri tek sayfada oku',
    chapter: 'Bölüm',
    of: '/',
    nextUp: 'Sıradaki bölüm',
    notYet: 'Henüz yazılmadı',
    backToSpine: 'Tüm bölümler',
    onePage: 'Tek sayfa',
    crossRef: 'Başka bir domainde, aynı problem',
  },
};

/**
 * Etiket sözlüğü.
 *
 * Kural: SLUG HER ZAMAN ASCII/İngilizce, gösterim yerelleştirilmiş.
 * Sebebi basit — slug URL'de yaşıyor. "tek-kişi" gibi bir slug hem
 * yüzde-kodlanmış çirkin bir adres üretiyor hem de dil değiştirince
 * bağlantı kırılıyor.
 *
 * Sözlükte olmayan slug ham haliyle gösteriliyor; yeni etiket eklemek
 * için burayı güncellemek ZORUNLU değil.
 */
export const TAG_LABELS: Record<string, Record<Locale, string>> = {
  'abstraction': { en: 'abstraction', tr: 'soyutlama' },
  'automation': { en: 'automation', tr: 'otomasyon' },
  'bottleneck': { en: 'bottleneck', tr: 'darboğaz' },
  'career': { en: 'career', tr: 'kariyer' },
  'combinatorics': { en: 'combinatorics', tr: 'bileşim' },
  'communication': { en: 'communication', tr: 'iletişim' },
  'complexity': { en: 'complexity', tr: 'karmaşıklık' },
  'cost': { en: 'cost', tr: 'bedel' },
  'craft': { en: 'craft', tr: 'zanaat' },
  'data': { en: 'data', tr: 'veri' },
  'deduction': { en: 'deduction', tr: 'çıkarım' },
  'depth': { en: 'depth', tr: 'derinlik' },
  'design': { en: 'design', tr: 'tasarım' },
  'determinism': { en: 'determinism', tr: 'belirlilik' },
  'discovery': { en: 'discovery', tr: 'keşif' },
  'distributed': { en: 'distributed', tr: 'dağıtık' },
  'distribution': { en: 'distribution', tr: 'dağıtım' },
  'documentary': { en: 'documentary', tr: 'belgesel' },
  'ethics': { en: 'ethics', tr: 'etik' },
  'failure': { en: 'failure', tr: 'başarısızlık' },
  'feedback': { en: 'feedback', tr: 'geribesleme' },
  'form': { en: 'form', tr: 'biçim' },
  'foundational': { en: 'foundational', tr: 'temel' },
  'founding': { en: 'founding', tr: 'kuruluş' },
  'games': { en: 'games', tr: 'oyun' },
  'habit': { en: 'habit', tr: 'alışkanlık' },
  'institutions': { en: 'institutions', tr: 'kurum' },
  'ip': { en: 'ip', tr: 'ip monetization' },
  'knowledge': { en: 'knowledge', tr: 'bilgi' },
  'language': { en: 'language', tr: 'dil' },
  'longform': { en: 'longform', tr: 'uzun soluklu' },
  'mastery': { en: 'mastery', tr: 'ustalık' },
  'method': { en: 'method', tr: 'yöntem' },
  'models': { en: 'models', tr: 'model' },
  'optimization': { en: 'optimization', tr: 'optimizasyon' },
  'partnership': { en: 'partnership', tr: 'ortaklık' },
  'patterns': { en: 'patterns', tr: 'örüntü' },
  'production': { en: 'production', tr: 'üretim' },
  'puzzles': { en: 'puzzles', tr: 'bulmaca' },
  'repetition': { en: 'repetition', tr: 'tekrar' },
  'resilience': { en: 'resilience', tr: 'dayanıklılık' },
  'risk': { en: 'risk', tr: 'risk' },
  'rules': { en: 'rules', tr: 'kural' },
  'scale': { en: 'scale', tr: 'ölçek' },
  'scope': { en: 'scope', tr: 'kapsam' },
  'simulation': { en: 'simulation', tr: 'simülasyon' },
  'solo': { en: 'solo', tr: 'tek kişi' },
  'systems': { en: 'systems', tr: 'sistem' },
  'teaching': { en: 'teaching', tr: 'öğretme' },
  'team': { en: 'team', tr: 'ekip' },
  'time': { en: 'time', tr: 'süre' },
  'timing': { en: 'timing', tr: 'zamanlama' },
  'tradeoffs': { en: 'tradeoffs', tr: 'ödün' },
};

export const SHELVES = {
  library: {
    path: 'library',
    name:  { en: 'Library', tr: 'Kitaplık' },
    blurb: {
      en: 'Books that changed how I think about systems, work, or myself.',
      tr: 'Sistemler, iş ya da kendim hakkında düşüncemi değiştiren kitaplar.',
    },
    creator: { en: 'Author', tr: 'Yazar' },
    queued:  { en: 'Up next', tr: 'Sırada' },
    queuedBlurb: {
      en: 'Unread, and kept in sight on purpose — a reminder of how much I do not know.',
      tr: 'Okumadıklarım burada duruyor — bildiklerimden çok bilmediklerimi hatırlatsın diye.',
    },
    ratio: '2 / 3',
  },
  films: {
    path: 'films',
    name:  { en: 'Films', tr: 'Filmler' },
    blurb: {
      en: 'Films about craft, obsession, and systems that outgrow their makers.',
      tr: 'Zanaat, saplantı ve yapıcısını aşan sistemler üzerine filmler.',
    },
    creator: { en: 'Director', tr: 'Yönetmen' },
    queued:  { en: 'Watchlist', tr: 'İzleme listesi' },
    queuedBlurb: {
      en: 'Queued up, not yet watched.',
      tr: 'Sıraya aldım, henüz izlemedim.',
    },
    ratio: '2 / 3',
  },
  games: {
    path: 'games',
    name:  { en: 'Games', tr: 'Oyunlar' },
    blurb: {
      en: 'Mostly built by one or two people. Systems you learn by playing.',
      tr: 'Çoğu bir ya da iki kişinin işi. Oynayarak öğrenilen sistemler.',
    },
    creator: { en: 'Studio', tr: 'Geliştirici' },
    queued:  { en: 'Backlog', tr: 'Oynanacaklar' },
    queuedBlurb: {
      en: 'Bought, installed, not yet played.',
      tr: 'Aldım, kurdum, henüz oynamadım.',
    },
    ratio: '3 / 4',
  },
} as const;

/** Eski adlandırma; SHELVES.library ile aynı. */
export const LIBRARY = SHELVES.library;

export type ShelfName = keyof typeof SHELVES;
export const SHELF_NAMES = Object.keys(SHELVES) as ShelfName[];


/** Skill kütüphanesi — agentic kimliğin kanıtı. */
export const SKILLS = {
  path: 'skills',
  name:  { en: 'Skills', tr: 'Skill dosyaları' } as Record<Locale, string>,
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
/**
 * Radar kategorileri — eksen ÜRÜN TİPİ.
 *
 * Önceki set ("eBPF", "moleküler gastronomi", "noir asset kütüphaneleri")
 * taksonomi değil örnek listesiydi; o gün o dalda iki doğrulanabilir solo
 * kurucu bulmak neredeyse imkânsızdı ve joker sürekli devreye giriyordu.
 *
 * Bu on kova hem dünyayı kapsıyor hem de her gün bulunabilir, ve
 * aralarındaki fark bir iş modeli farkı — yani bültenin sorduğu
 * "hangisi ayakta kalıyor" sorusuna gerçekten cevap veriyorlar.
 */
export const RADAR_CATEGORY: Record<string, string> = {
  saas: 'SaaS',
  eklenti: 'Eklenti',
  'gelistirici-araci': 'Geliştirici aracı',
  oyun: 'Oyun',
  icerik: 'İçerik',
  'dijital-varlik': 'Dijital varlık',
  'dizin-veri': 'Dizin & veri',
  otomasyon: 'Otomasyon',
  donanim: 'Donanım',
  'hizmet-urunu': 'Hizmet ürünü',
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
    en: 'A daily briefing written by an agent, not by me. I do not edit it either — what it writes is what you read.',
    tr: 'Günlük bülteni bir ajan yazıyor, ben yazmıyorum. Sonradan düzeltmiyorum da; ajan ne yazdıysa onu okuyorsunuz.',
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
  name:  { en: 'The Workbench', tr: 'Bahçe' } as Record<Locale, string>,
  blurb: {
    en: 'A workbench of half-built ideas, finished arguments, and notes to myself — kept in the open.',
    tr: 'Yarım kalmış fikirler, bitirdiğim argümanlar ve kendime aldığım notlar bir arada duruyor. Hepsini açıkta tutuyorum, çünkü ancak düzelte düzelte büyüyorlar.',
  } as Record<Locale, string>,
};

/** Anasayfa hero'su. Maggie'nin kalıbı: kalın isim + cümlenin devamı. */
export const HERO: Record<Locale, { name: string; rest: string; role: string; now: string }> = {
  en: {
    name: 'Cemal Önder',
    rest: '. I build software with agents, and this is where I work out what I think about it.',
    role: 'Solution architect and software engineer',
    now: 'Working end to end with agents, and building something of my own',
  },
  tr: {
    name: 'Cemal Önder',
    rest: '. Ajanlarla yazılım geliştiriyorum, burası da onu anlamaya çalıştığım yer.',
    role: 'Çözüm mimarı ve yazılım mühendisi',
    now: 'Ajanlarla uçtan uca çalışıyorum, bir yandan kendi işimi kuruyorum',
  },
};

/** Üst navigasyon — Maggie gibi 3 öğe, biri dropdown. */
export const NAV: Record<Locale, { label: string; href: string }[]> = {
  en: [{ label: 'Uses', href: '/uses' }, { label: 'Now', href: '/now' }, { label: 'About', href: '/about' }],
  tr: [{ label: 'Kullandıklarım', href: '/uses' }, { label: 'Şu Sıralar', href: '/now' }, { label: 'Hakkında', href: '/about' }],
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
    back: 'Bahçeye dön',
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
