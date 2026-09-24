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
    tr: 'Farklı bakış açılarını tartışmaya açan, üzerine düşünülmüş ve derinlemesine ele alınmış kapsamlı yazılar.',
  },
  notes: {
    en: "Thinking out loud. Unfinished, exploratory, often wrong.",
    tr: 'Geliştirme sürecinde aldığım anlık notlar, keşifler ve zamanla olgunlaşacak ham düşünceler.',
  },
  playbooks: {
    en: 'Repeatable decisions. Problem, context, approach, tradeoffs.',
    tr: 'Saha tecrübelerinden süzülen, tekrar eden mimari ve mühendislik kararları için adım adım çözüm rehberleri.',
  },
  signals: {
    en: 'A link and why it matters. Two sentences, no more.',
    tr: 'Teknoloji dünyasında dikkatimi çeken gelişmeler, ilham verici kaynaklar ve kısa değerlendirmeler.',
  },
};

/**
 * Konu etiketleri. Altı ANA konu burada; serbest konular TOPIC_EXTRA'da,
 * ikisinde de yoksa konu adı olduğu gibi gösteriliyor.
 *
 * Tek eksen kararı: eskiden `topics` ve `tags` diye iki kavram vardı,
 * biri enum biri serbest, biri tıklanabilir biri değil. Aynı şeyin iki
 * adı olması her sayfada farklı bir isim demekti.
 */
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
    openNote: 'Read the note',
  },
  tr: {
    topics: 'Konular', allTopics: 'Tüm konular', readMore: 'Oku',
    empty: 'Burada henüz bir şey yok.',
    home: 'Ana sayfa', latest: 'Son eklenenler',
    openNote: 'Notu oku',
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
    tr: { write: 'Bana yaz', elsewhere: 'Başka yerlerde', open: 'Açık olduğum konular', cv: 'CV' },
  } as Record<Locale, Record<string, string>>,
  blurb: {
    en: 'The fastest way to reach me is email. I read everything; I answer what I can.',
    tr: 'Bana ulaşmanın en kolay yolu e-posta. Bütün iletileri okuyor, fırsat buldukça yanıtlıyorum.',
  } as Record<Locale, string>,
};

export const PROJECTS = {
  path: 'projects',
  name:  { en: 'Projects', tr: 'Projeler' } as Record<Locale, string>,
  blurb: {
    en: 'Things I built, with what they actually do and where they stand.',
    tr: 'Geliştirdiğim projeler, çözdükleri problemler ve güncel durumları.',
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
  en: { started: 'Started', updated: 'Updated', stack: 'Stack', live: 'Live', source: 'Source',
        event: 'Hackathon', badge: 'Hackathon' },
  tr: { started: 'Başladı', updated: 'Güncellendi', stack: 'Yığın', live: 'Adres', source: 'Kaynak',
        event: 'Hackathon', badge: 'Hackathon' },
};

/**
 * AI üretimi işareti. İki kademe: `generated` (metni ajan yazdı; işaret
 * görünür) ve `assisted` (AI ile düzeltildi; işaret yok, kural /ai'de).
 * Araç adı (NotebookLM vb.) künyeden çıktı — /ai sayfası anlatıyor.
 */
export const AI_UI: Record<Locale, { label: string; mini: string; title: string; anchor: string }> = {
  en: { label: 'ai-written', mini: 'ai', anchor: '#the-label',
        title: 'An agent wrote this text; I edited it. Click for how that works.' },
  tr: { label: 'ai üretimi', mini: 'ai', anchor: '#etiket',
        title: 'Bu metin bir yapay zekâ ajanı tarafından üretildi ve tarafımdan gözden geçirildi. Detaylar için tıklayın.' },
};

export const DOMAINS = {
  path: 'domains',
  name:  { en: 'Domains', tr: 'Domain' } as Record<Locale, string>,
  blurb: {
    en: 'One domain at a time, written in chapters. The outline is public from day one — including what is not written yet.',
    tr: 'Karmaşık sektörleri ve iş modellerini adım adım, derinlemesine inceliyorum. Henüz yazılmamış bölümleri de içeren yol haritasını ilk günden şeffaf olarak paylaşıyorum.',
  } as Record<Locale, string>,
};

/**
 * Domain sayfa metinleri. Sayfa dosyaları tek dilli olduğu için içlerinde
 * `lang === 'tr' ? ... : ...` yazmak ölü dal üretiyor ve astro check
 * hata veriyor — bu projede daha önce aynı sorun PAGE sözlüğüyle çözüldü.
 */
export const DOMAIN_UI: Record<Locale, Record<string, string>> = {
  en: {
    chapters: 'chapters',
    notes: 'Margin notes',
    audience: 'Assumed audience',
    written: 'chapters written',
    contents: 'Contents',
    note: 'The whole map is here: the parts the book is split into, and inside them the chapters. Parts I have not started yet are listed as well, and the line under each chapter is a promise of what it will cover.',
    chapter: 'Chapter',
    of: 'of',
    nextUp: 'Next chapter',
    notYet: 'Not written yet',
    partsStarted: 'parts started',
    partNotStarted: 'not started yet',
    backToSpine: 'All chapters',
    crossRef: 'Related, in another domain',
  },
  tr: {
    chapters: 'bölüm',
    notes: 'Kenar notları',
    audience: 'Kime',
    written: 'bölüm yazıldı',
    contents: 'İçindekiler',
    note: 'Haritanın tamamı burada: kitabın ayrıldığı parçalar ve içlerindeki bölümler. Henüz başlamadığım parçalar da listede duruyor; bölüm altındaki kısa not ise ele alınacak kapsamı özetliyor.',
    chapter: 'Bölüm',
    of: '/',
    nextUp: 'Sıradaki bölüm',
    notYet: 'Henüz yazılmadı',
    partsStarted: 'parça başladı',
    partNotStarted: 'henüz başlamadı',
    backToSpine: 'Tüm bölümler',
    crossRef: 'Farklı bir sektörde, benzer problem',
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
/** Serbest konuların çevirileri. Yoksa konu adı olduğu gibi çıkar. */
export const TOPIC_EXTRA: Record<string, Record<Locale, string>> = {
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
  'scope': { en: 'scope', tr: 'kapsam' },
  'simulation': { en: 'simulation', tr: 'simülasyon' },
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
      tr: 'Yazılım mimarisine, iş dünyasına ve düşünce sistematiğine bakışımı zenginleştiren kitaplar.',
    },
    creator: { en: 'Author', tr: 'Yazar' },
    done:    { en: 'Read', tr: 'Okuduklarım' },
    queued:  { en: 'Up next', tr: 'Sırada' },
    queuedBlurb: {
      en: 'Unread, and kept in sight on purpose — a reminder of how much I do not know.',
      tr: 'Henüz okumadığım ve bana keşfedecek ne kadar çok şey olduğunu hatırlatan kitaplar.',
    },
    ratio: '2 / 3',
  },
  films: {
    path: 'films',
    name:  { en: 'Films', tr: 'Filmler' },
    blurb: {
      en: 'Films about craft, obsession, and systems that outgrow their makers.',
      tr: 'Mühendislik, zanaat, tutku ve karmaşık sistemleri konu alan filmler.',
    },
    creator: { en: 'Director', tr: 'Yönetmen' },
    done:    { en: 'Watched', tr: 'İzlediklerim' },
    queued:  { en: 'Watchlist', tr: 'İzleme listesi' },
    queuedBlurb: {
      en: 'Queued up, not yet watched.',
      tr: 'İzleme listeme eklediğim, fırsat buldukça izleyeceğim filmler.',
    },
    ratio: '2 / 3',
  },
  games: {
    path: 'games',
    name:  { en: 'Games', tr: 'Oyunlar' },
    blurb: {
      en: 'Mostly built by one or two people. Systems you learn by playing.',
      tr: 'Mekanikleri ve sistem tasarımıyla öne çıkan, büyük ölçüde bağımsız yapım oyunlar.',
    },
    creator: { en: 'Studio', tr: 'Geliştirici' },
    done:    { en: 'Played', tr: 'Oynadıklarım' },
    queued:  { en: 'Backlog', tr: 'Oynanacaklar' },
    queuedBlurb: {
      en: 'Bought, installed, not yet played.',
      tr: 'Deneyimlemek üzere arşivime eklediğim yapımlar.',
    },
    ratio: '3 / 4',
  },
} as const;

/** Eski adlandırma; SHELVES.library ile aynı. */
export const LIBRARY = SHELVES.library;

export type ShelfName = keyof typeof SHELVES;
export const SHELF_NAMES = Object.keys(SHELVES) as ShelfName[];


/**
 * Yorumlar (giscus). Yorumlar repodaki GitHub Discussions'ta durur.
 *
 * enabled=false iken hiçbir şey render edilmez. Açmadan önce giscus GitHub
 * App'inin bu repoda kurulu olması gerekir (github.com/apps/giscus), yoksa
 * her yazıda hata kutusu çıkar.
 */
/**
 * Google Analytics 4.
 *
 * `enabled` kapalıyken sayfaya HİÇBİR ŞEY düşmez — ne script etiketi ne
 * dataLayer; yorumlardaki kuralın aynısı. Ayrıca yalnızca üretim
 * build'inde basılıyor: localhost gezintisi mülke veri yazmasın.
 *
 * Bunu açmak colophon'daki "analitik yok" cümlesini yalanlar; o cümle
 * bu sabitle birlikte güncellendi. İkisi birlikte değişir.
 */
export const ANALYTICS = {
  enabled: true,
  ga4: 'G-1W2Z58W0MF',
};

/**
 * E-posta aboneliği — Buttondown. `username` boşken sayfaya HİÇBİR ŞEY
 * düşmez (form yok, script yok); doldurunca formlar açılır. Form düz HTML
 * POST: JS'siz çalışır, çift onay ve çıkış Buttondown'da.
 *
 * Seri bazlı abonelik etiketle: form her seçili seri için bir `tag`
 * gönderiyor, Buttondown yoksa etiketi kendisi açıyor. RSS-to-email
 * otomasyonları seri beslemesini (/radar/<seri>/rss.xml) o etikete gönderir.
 */
/**
 * Çeviri hedef dilleri. Kuyruk her hedef için ayrı üretilir
 * (/translate-queue/<dil>.json); Spark görevi dil başına tetiklenir.
 * Site bugün yalnız en/tr render ediyor; diğer diller üretilir ama
 * src/translations/<dil>/ altında bekler — locale desteği ayrı iş.
 */
export const TRANSLATION_TARGETS = ['en'] as const;

export const NEWSLETTER = {
  username: '',                      // buttondown.com/<username>; TODO.md madde 10
  /** Abonelik seçenekleri: etiket -> ad. `own` = benim yazdıklarım. */
  lists: {
    own:            { tag: 'yazilar',       name: { en: 'My essays and notes', tr: 'Yazılarım ve notlarım' } as Record<Locale, string>, feed: (l: Locale) => (l === 'tr' ? '/tr/rss.xml' : '/rss.xml') },
    'solo-founder': { tag: 'solo-girisimci', name: { en: 'Solo Founder Bulletin (daily, Turkish)', tr: 'Solo Girişimci Bülteni (günlük)' } as Record<Locale, string>, feed: () => '/radar/solo-founder/rss.xml' },
    'saas':         { tag: 'saas', name: { en: 'SaaS Bulletin (daily, Turkish)', tr: 'SaaS Bülteni (günlük)' } as Record<Locale, string>, feed: () => '/radar/saas/rss.xml' },
    'github-radar': { tag: 'github-radar',  name: { en: 'GitHub Radar (daily, Turkish)', tr: 'GitHub Radar (günlük)' } as Record<Locale, string>, feed: () => '/radar/github-radar/rss.xml' },
    'paper-to-prod':  { tag: 'makale',        name: { en: 'Paper-to-Prod (daily, Turkish)', tr: 'Makale Bülteni (günlük)' } as Record<Locale, string>, feed: () => '/radar/paper-to-prod/rss.xml' },
    'indie-postmortem': { tag: 'indie-game', name: { en: 'Indie Game Bulletin (daily, Turkish)', tr: 'Indie Oyun Bülteni (günlük)' } as Record<Locale, string>, feed: () => '/radar/indie-postmortem/rss.xml' },
  },
};
export type NewsletterList = keyof typeof NEWSLETTER.lists;

export const NEWSLETTER_UI: Record<Locale, Record<string, string>> = {
  en: { title: 'Subscribe', blurb: 'Pick what lands in your inbox. Each bulletin has its own feed; you can also read everything by RSS.',
        email: 'Email', go: 'Subscribe', note: 'Double opt-in, unsubscribe in every email, no tracking pixels.',
        rss: 'RSS', feeds: 'Feeds', compact: 'Get this series by email', all: 'All options', allRadar: 'All radar series' },
  tr: { title: 'Abone ol', blurb: 'İlginizi çeken bültenleri seçerek e-posta kutunuza alabilir veya tüm akışı RSS üzerinden takip edebilirsiniz.',
        email: 'E-posta', go: 'Abone ol', note: 'İki adımlı onay, her iletide çıkış bağlantısı ve takip pikselsiz temiz e-postalar.',
        rss: 'RSS', feeds: 'Beslemeler', compact: 'Bu seriyi e-postayla al', all: 'Bütün seçenekler', allRadar: 'Bütün radar serileri' },
};

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
  'pazar-yeri': 'Pazar yeri',
  'e-ticaret': 'E-ticaret',
};



export const RADAR_REVENUE_SOURCE: Record<string, string> = {
  platform: 'Platform verisi',
  interview: 'Kurucu mülakatı',
  self_reported: 'Kurucu beyanı',
  developer_blog: 'Geliştirici yazısı',
  estimated: 'Tahmin (yöntem yazıda)',
  unknown: 'Kaynağı belirsiz',
};

export const RADAR = {
  path: 'radar',
  name:  { en: 'Radar', tr: 'Radar' } as Record<Locale, string>,
  blurb: {
    en: 'A daily briefing written by an agent, not by me, and not edited by me either. Written in Turkish.',
    tr: 'Yapay zekâ ajanları tarafından derlenen ve otomatik veri akışlarıyla doğrudan yayına alınan günlük bültenler.',
  } as Record<Locale, string>,
};

/**
 * Radar serileri. Her seri ayrı bir ajan görevine karşılık gelir ve
 * Drive'da kendi klasörü vardır. Yeni bir günlük bülten eklemek:
 * buraya bir satır + Drive'da aynı adla klasör.
 */
export const RADAR_SERIES = {
  'solo-founder': {
    name: 'Solo Girişimci Bülteni',
    driveFolder: 'Radar/Solo Girişimci Bülteni',
    blurb: 'Doğrulanmış gelir ve ciro rakamlarıyla tek kişilik yazılım girişimlerini inceleyen günlük bülten.',
  },
  'saas': {
    name: 'SaaS Bülteni',
    driveFolder: 'Radar/SaaS Bülteni',
    blurb: 'Büyüyen SaaS girişimlerinin iş modellerini, gelir metriklerini ve dönüm noktalarını aktaran günlük vaka analizi.',
  },
  'github-radar': {
    name: 'GitHub Radar',
    driveFolder: 'Radar/GitHub Radar',
    blurb: 'Öne çıkan açık kaynak projelerin mimari kararlarını, topluluk dinamiklerini ve canlı sistem risklerini değerlendiren bülten.',
  },
  'indie-postmortem': {
    name: 'Indie Oyun Bülteni',
    driveFolder: 'Radar/Indie Oyun Bülteni',
    blurb: 'Bağımsız oyunların çıkış süreçlerini, istek listesi dinamiklerini, dağıtım stratejilerini ve şeffaf gelir tablolarını ele alan günlük inceleme.',
  },
  'paper-to-prod': {
    name: 'Makale Bülteni',
    driveFolder: 'Radar/Makale Bülteni',
    blurb: 'Akademik yapay zekâ ve bilgisayar bilimleri makalelerinin üretim ortamına uygulanabilirliğini, kod kalitesini ve getireceği maliyet avantajlarını irdeleyen bülten.',
  },
} as const;

export type RadarSeries = keyof typeof RADAR_SERIES;

export const HUB = {
  path: 'workbench',
  name:  { en: 'The Garden', tr: 'Bahçe' } as Record<Locale, string>,
  blurb: {
    en: 'A workbench of half-built ideas, finished arguments, and notes to myself — kept in the open.',
    tr: 'Olgunlaşmış argümanlardan henüz tamamlanmamış keşif notlarına kadar tüm düşünce sürecimi açık bir çalışma alanı gibi burada paylaşıyorum.',
  } as Record<Locale, string>,
};

/** Anasayfa hero'su. Maggie'nin kalıbı: kalın isim + cümlenin devamı. */
/** Yazılımda ilk yıl. Deneyim süresi buradan hesaplanıyor, elle yazılmıyor. */
export const KARIYER_BASLANGIC = 2015;

/** Tarih biçimleme için BCP-47 etiketi. Sayfa dosyalarında lang === 'tr' dallanması yasak. */
export const LOCALE_TAG: Record<Locale, string> = { en: 'en-GB', tr: 'tr-TR' };

export const HERO: Record<Locale, { name: string; rest: string; role: string; now: string }> = {
  en: {
    name: 'Cemal Önder',
    rest: '. I build software with agents, and this is where I work out what I think about it.',
    role: 'Solution architect and software engineer',
    now: 'Working end to end with agents, and building something of my own',
  },
  tr: {
    name: 'Cemal Önder',
    rest: '. Yapay zekâ ajanlarıyla yazılım geliştiriyor, öğrendiklerimi ve mimari deneyimlerimi burada paylaşıyorum.',
    role: 'Çözüm mimarı ve yazılım mühendisi',
    now: 'Geliştirme süreçlerini uçtan uca ajanlarla yönetiyor ve kendi projelerim üzerinde çalışıyorum',
  },
};

/** Üst navigasyon — Maggie gibi 3 öğe, biri dropdown. */
export const NAV: Record<Locale, { label: string; href: string }[]> = {
  en: [{ label: 'About', href: '/about' }, { label: 'Uses', href: '/uses' }, { label: 'Now', href: '/now' }],
  tr: [{ label: 'Hakkında', href: '/about' }, { label: 'Kullandıklarım', href: '/uses' }, { label: 'Şu Sıralar', href: '/now' }],
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
  topicsBlurb: string;
  topicBlurb: (topic: string) => string;
  tagsTitle: string;
  tagsBlurb: string;
  tagBlurb: (tag: string) => string;
  archiveTitle: string;
  archiveBlurb: string;
  nowTitle: string;
  nowBlurb: string;
  nowIntro: string;
  nowAll: string;
  nowOlder: string;
  nowNewer: string;
  subscribe: string;
  translated: string;
  audience: string;
  draftNotice: string;
  draftNoticeLink: string;
  draftNoticeTail: string;
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
    topicsBlurb: 'Everything I write sits under one of six headings. A topic can appear in any format.',
    topicBlurb: (t) => `Everything filed under ${t} — essays, notes, playbooks and signals.`,
    tagsTitle: 'Tags',
    tagsBlurb: 'Free-form labels, unlike the six fixed topics. Bigger means more often.',
    tagBlurb: (t) => `Everything tagged ${t}.`,
    archiveTitle: 'Archive',
    archiveBlurb: 'Everything I have written here, newest first. Yearly, in one list.',
    nowTitle: 'Now',
    nowBlurb: 'A log of where my attention goes — appended irregularly, never overwritten.',
    nowIntro: 'This is a now page, but not the kind that gets overwritten: each update stacks on the last. Every month has its own address.',
    nowAll: 'All updates',
    nowOlder: 'Earlier month',
    nowNewer: 'Later month',
    subscribe: 'Subscribe',
    translated: 'Machine-translated from the Turkish original; not yet reviewed by me.',
    audience: 'Assumed audience',
    draftNotice:
      'Most of the content here is AI-generated. I am working on the design right now and ' +
      'letting an agent fill the pages in the meantime. If you have landed here, the one ' +
      'section worth reading as real content is ',
    draftNoticeLink: 'the radar',
    draftNoticeTail: '. That one comes out of a proper pipeline.',
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
    topicsBlurb: 'Sitedeki tüm çalışmalar altı ana tema etrafında şekillenir; her tema farklı içerik formatlarında karşınıza çıkabilir.',
    topicBlurb: (t) => `${t} teması altındaki tüm yazılar, notlar, kılavuzlar ve sinyaller.`,
    tagsTitle: 'Etiketler',
    tagsBlurb: 'Ana temalardan bağımsız serbest etiketler; yazı boyutu kullanım sıklığını gösterir.',
    tagBlurb: (t) => `${t} etiketli tüm içerikler.`,
    archiveTitle: 'Arşiv',
    archiveBlurb: 'Sitede yayınlanan tüm içeriklerin kronolojik arşivi.',
    nowTitle: 'Şu Sıralar',
    nowBlurb: 'Üzerinde çalıştığım projeler ve odaklandığım konuların aylık günlüğü.',
    nowIntro: 'Klasik now sayfalarının aksine, bu sayfada geçmiş güncellemeler silinmez; her ay kendi kalıcı bağlantısıyla zaman çizgisine eklenir.',
    nowAll: 'Bütün güncellemeler',
    nowOlder: 'Önceki ay',
    nowNewer: 'Sonraki ay',
    subscribe: 'Abone ol',
    translated: 'İngilizce aslından makine çevirisi; henüz gözden geçirmedim.',
    audience: 'Hedef kitle',
    draftNotice:
      'Sitedeki içeriklerin bir kısmı, altyapı ve tasarım sürecinde yer tutucu olarak ' +
      'yapay zekâ desteğiyle oluşturulmuştur. Düzenli veri akışlarıyla üretilen ve ' +
      'doğrulanabilir içerikleri incelemek isterseniz ',
    draftNoticeLink: 'radar',
    draftNoticeTail: ' bölümüne göz atabilirsiniz.',
    recently: 'Son eklenenler',
    findTitle: 'Hangi kılavuz?',
    findBlurb: "Karşılaştığınız mimari ve sistemsel belirtileri seçerek en uygun çözüm rehberlerine ulaşın.",
    symptoms: 'Belirtiler',
    clear: 'Temizle',
    allPlaybooks: "Tüm kılavuzlar",
    problem: 'Problem',
    context: 'Bağlam',
    match: 'eşleşme',
    noSelection: 'Herhangi bir belirti seçilmedi; tüm kılavuzlar en pratik çözümlerden başlayarak listeleniyor.',
    noMatch: 'Seçilen belirtilere uygun bir kılavuz bulunamadı. Lütfen filtreleri gözden geçirin.',
    findAction: 'Hangi kılavuz? Belirtiden bul',
  },
};

/** Bir konunun o dildeki adı: ana konu -> serbest konu -> ham metin. */
export function topicLabel(topic: string, lang: Locale): string {
  return (TOPIC_LABELS as Record<string, Dict>)[topic]?.[lang]
    ?? TOPIC_EXTRA[topic]?.[lang]
    ?? topic;
}
