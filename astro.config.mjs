// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

/**
 * NDS's _typography.scss ships a Google Fonts `@import` which lands mid-file
 * in the bundled CSS - invalid per spec (W3C error) and a hidden render
 * blocker. The fonts are loaded via <link> in BaseLayout instead, and this
 * plugin strips the stray @import from every emitted CSS asset.
 */
const stripFontImport = {
  name: 'strip-google-fonts-import',
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.type === 'asset' && chunk.fileName.endsWith('.css') && typeof chunk.source === 'string') {
        chunk.source = chunk.source.replace(
          /@import url\((['"]?)https:\/\/fonts\.googleapis\.com[^)]*\);?/g,
          '',
        );
      }
    }
  },
};

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
    plugins: [stripFontImport],
    build: {
      // Source maps help debugging in prod and satisfy Lighthouse's audit.
      sourcemap: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [ndsTokens],
        },
      },
    },
  },
});
