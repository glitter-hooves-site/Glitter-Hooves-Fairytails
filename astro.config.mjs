import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://glitterhoovesfairytails.org',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      // lastmod helps Google decide what is worth recrawling.
      lastmod: new Date(),
      // The 404 is not a destination; keep it out of the index.
      filter: page => !page.includes('/404'),
    }),
  ],
});
