// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

const ndsTokens = fileURLToPath(
  new URL('./node_modules/@unkn0wndo3s/nova-design-system/src/styles/tokens', import.meta.url),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://louis-potevin.dev',
  trailingSlash: 'ignore',

  // About & Contact now live on the home timeline.
  redirects: {
    '/about': '/#about',
    '/contact': '/#contact',
    '/en/about': '/en/#about',
    '/en/contact': '/en/#contact',
  },

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR', en: 'en-US' },
      },
    }),
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [ndsTokens],
        },
      },
    },
  },
});
