import { defineConfig } from 'astro/config';

export default defineConfig({
  // Set PUBLIC_SITE_URL only after the public domain is confirmed.
  site: process.env.PUBLIC_SITE_URL,
  output: 'static',
  devToolbar: {
    enabled: false
  },
  build: {
    format: 'directory'
  }
});
