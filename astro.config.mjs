// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://cmlonder.com',

  i18n: {
    locales: ['en', 'tr'],
    defaultLocale: 'en',
    routing: {
      // İngilizce prefix'siz: /essays/foo
      // Türkçe prefix'li:     /tr/essays/foo
      prefixDefaultLocale: false,
    },
  },
});
