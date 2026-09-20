import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://zhanghaibiao.loc.cc',
  output: 'static',
  devToolbar: {
    enabled: false
  },
  build: {
    format: 'directory'
  }
});
