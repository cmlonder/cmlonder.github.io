// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const subsets = ['latin', 'latin-ext']; // latin-ext = Türkçe ğ ş ı İ ç ö ü

// https://astro.build/config
export default defineConfig({
  site: 'https://cmlonder.com',

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
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Newsreader',
      cssVariable: '--font-serif',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets,
      fallbacks: ['Iowan Old Style', 'Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: [400, 500, 600],
      subsets,
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
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
