// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import { satteri } from '@astrojs/markdown-satteri';
import { slaytlar } from './plugins/remark-slides.mjs';
import { disLinkler } from './plugins/hast-polish.mjs';

/** @type {['latin', 'latin-ext']} */
const subsets = ['latin', 'latin-ext']; // latin-ext = Türkçe ğ ş ı İ ç ö ü

/**
 * Hashnode'dan taşınan yazılar kök seviyedeydi (/slug), bizde /essays/slug.
 * Bu yönlendirmeler SADECE cutover'da (site cmlonder.com olunca) devreye girer —
 * önizleme adresinde eski URL'ler zaten yok, boşuna sayfa üretilmesin.
 */
/** Cutover'da 'https://cmlonder.com' olacak. @type {string} */
const SITE_URL = 'https://cmlonder.com';
const IS_CUTOVER = SITE_URL === 'https://cmlonder.com';

/**
 * Eski Hashnode slug'ları -> /essays/<slug>.
 * Üçüncüsü yazının Hashnode'da yeniden adlandırılmadan önceki adı; HackerNoon
 * hâlâ ona link veriyor ve cutover sonrası 404 dönüyordu.
 */
const LEGACY_SLUGS = {
  'how-buying-an-iphone-helped-me-to-land-my-first-job-as-a-developer':
    'how-buying-an-iphone-helped-me-to-land-my-first-job-as-a-developer',
  'how-one-feature-from-a-failed-startup-can-become-a-billion-dollar-idea':
    'how-one-feature-from-a-failed-startup-can-become-a-billion-dollar-idea',
  'interesting-startup-story-can-a-feature-of-your-project-make-you-a-billionaire':
    'how-one-feature-from-a-failed-startup-can-become-a-billion-dollar-idea',
};

/**
 * Domain ve bölüm slug'ları 2026-09-18'de Türkçeden İngilizceye çevrildi.
 *
 * Sebep: site kuralı URL parçalarının İngilizce ve ASCII olmasını istiyor
 * (yazılarda zaten öyleydi) ve iki dilli bir sitede İngilizce okuyucuya
 * /domains/havacilik/stok-bir-sayi-degil göstermek tutarsızdı. Ayrıca
 * `mürettebat-ciozelgeleme` slug'ında ASCII olmayan bir harf vardı.
 *
 * Eskiler canlıda yayındaydı; bunlar onları yeni adrese taşıyor.
 */
const DOMAIN_SLUGS = {
  havacilik: 'aviation',
  eticaret: 'ecommerce',
};
const CHAPTER_SLUGS = {
  'havacilik/pnr-bir-kayit-degil':        'aviation/pnr-is-a-contract',
  'havacilik/overbooking-bir-hata-degil': 'aviation/overbooking-is-a-model',
  'eticaret/stok-bir-sayi-degil':         'ecommerce/stock-is-a-reservation',
  'eticaret/sepet-bir-tablo-degil':       'ecommerce/cart-is-a-time-window',
};
/* Proje slug'ları da aynı sebeple İngilizceye çevrildi. */
const PROJECT_SLUGS = {
  'radar-boru-hatti': 'radar-pipeline',
  'spark-prompt-sozlesmesi': 'spark-prompt-contract',
};

/* Her ikisi de iki dilde yayındaydı: /domains/... ve /tr/domains/... */
const domainYonlendirmeleri = Object.fromEntries(
  ['', '/tr'].flatMap((on) => [
    ...Object.entries(DOMAIN_SLUGS).map(([e, y]) => [`${on}/domains/${e}`, `${on}/domains/${y}`]),
    ...Object.entries(CHAPTER_SLUGS).map(([e, y]) => [`${on}/domains/${e}`, `${on}/domains/${y}`]),
    /* "Tek sayfa" görünümü 21 Eyl 2026'da kaldırıldı; eski ve yeni slug'ın
       /read adresi domain sayfasına düşer. */
    ...Object.entries(DOMAIN_SLUGS).flatMap(([e, y]) => [
      [`${on}/domains/${e}/read`, `${on}/domains/${y}`],
      [`${on}/domains/${y}/read`, `${on}/domains/${y}`],
    ]),
    ...Object.entries(PROJECT_SLUGS).map(([e, y]) => [`${on}/projects/${e}`, `${on}/projects/${y}`]),
  ])
);

// https://astro.build/config
export default defineConfig({
  // Sitenin GERÇEKTEN yayınlandığı adres. Canonical, sitemap, llms.txt ve
  // .md aynalarındaki mutlak URL'ler buradan türer.
  // Cutover (DNS cmlonder.com'a çevrildiğinde): bunu ve src/config.ts'deki
  // SITE.url'i 'https://cmlonder.com' yap, public/CNAME ekle.
  site: SITE_URL,

  redirects: {
    // /work /about ile birleşti (19 Eyl 2026): eski adres gitmesin.
    '/work': '/about',
    '/tr/work': '/tr/about',
    ...domainYonlendirmeleri,
    ...(IS_CUTOVER
      ? Object.fromEntries(
          Object.entries(LEGACY_SLUGS).map(([from, to]) => [`/${from}`, `/essays/${to}`])
        )
      : {}),
  },

  integrations: [
    // Build sonrası dist/ üzerinden statik arama indeksi üretir. Sunucu yok.
    pagefind(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', tr: 'tr' } },
      // .md aynaları insan sayfası değil — sitemap'e girmemeli.
      filter: (page) => !page.endsWith('.md'),
    }),
  ],

  i18n: {
    locales: ['en', 'tr'],
    defaultLocale: 'en',
    routing: {
      // İngilizce prefix'siz: /essays/foo
      // Türkçe prefix'li:     /tr/essays/foo
      prefixDefaultLocale: false,
    },
  },

  // Build sırasında indirilip self-host edilir — harici istek yok.
  // Fraunces: Maggie'nin Canela'sının (ticari) serbest en yakın karşılığı —
  // değişken opsz ekseniyle tek aile hem gövde hem display rolünü karşılıyor.
  // Lato ve IBM Plex Mono onun kullandıklarıyla birebir aynı.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-serif',
      // Sadece iki ağırlık: gövde/başlık 400, vurgu 700. Ara ağırlıklar
      // kullanılmıyordu ve her biri ayrı dosya demek.
      weights: [400, 700],
      styles: ['normal', 'italic'],
      subsets,
      fallbacks: ['Iowan Old Style', 'Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Lato',
      cssVariable: '--font-sans',
      weights: [400, 700],
      // Sans italic hiç kullanılmıyor — bütün italikler serif.
      styles: ['normal'],
      subsets,
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400],
      subsets,
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  ],

  markdown: {
    // Yazının içindeki slayt görsellerini figure'a çeviriyor.
    // Sätteri Astro 7'nin varsayılan işleyicisi; klasik remarkPlugins'e
    // geçmek @astrojs/markdown-remark kurup bütün siteyi eski boru hattına
    // almak demekti. Tek eklenti için o bedel ödenmiyor.
    processor: satteri({ mdastPlugins: [slaytlar], hastPlugins: [disLinkler] }),
    shikiConfig: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      defaultColor: 'light',
      wrap: false,
    },
  },
});
