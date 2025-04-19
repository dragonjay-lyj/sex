// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap()],
  site: 'https://edge.dragonjay.top',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel()
});