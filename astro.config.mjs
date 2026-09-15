// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const subsets = ['latin', 'latin-ext']; // latin-ext = Türkçe ğ ş ı İ ç ö ü

/**
 * Hashnode'dan taşınan yazılar kök seviyedeydi (/slug), bizde /essays/slug.
 * Bu yönlendirmeler SADECE cutover'da (site cmlonder.com olunca) devreye girer —
 * önizleme adresinde eski URL'ler zaten yok, boşuna sayfa üretilmesin.
 */
const SITE_URL = 'https://cmlonder.github.io';
const IS_CUTOVER = SITE_URL === 'https://cmlonder.com';

const LEGACY_SLUGS = [
  'how-buying-an-iphone-helped-me-to-land-my-first-job-as-a-developer',
  'how-one-feature-from-a-failed-startup-can-become-a-billion-dollar-idea',
];

// https://astro.build/config
export default defineConfig({
  // Sitenin GERÇEKTEN yayınlandığı adres. Canonical, sitemap, llms.txt ve
  // .md aynalarındaki mutlak URL'ler buradan türer.
  // Cutover (DNS cmlonder.com'a çevrildiğinde): bunu ve src/config.ts'deki
  // SITE.url'i 'https://cmlonder.com' yap, public/CNAME ekle.
  site: SITE_URL,

  redirects: IS_CUTOVER
    ? Object.fromEntries(LEGACY_SLUGS.map((s) => [`/${s}`, `/essays/${s}`]))
    : {},

  integrations: [
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
    shikiConfig: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      defaultColor: 'light',
      wrap: false,
    },
  },
});
