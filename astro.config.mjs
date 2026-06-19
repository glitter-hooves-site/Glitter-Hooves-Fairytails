import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://glitterhoovesfairytails.org',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
