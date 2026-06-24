import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://louis-potevin.dev',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          loadPaths: [
            'node_modules',
            'node_modules/@unkn0wndo3s/nova-design-system/src/styles',
            'src',
          ],
        },
      },
    },
  },
});
