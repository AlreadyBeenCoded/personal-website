// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Canonical origin for absolute URLs (OG image, og:url). Swap when the
  // custom domain lands.
  site: 'https://andrewsnider.vercel.app',
  integrations: [mdx(), react()],
  // Respect an externally assigned port (e.g. the preview harness) so dev
  // servers from parallel sessions don't fight over 4321.
  server: process.env.PORT ? { port: Number(process.env.PORT) } : {},
  vite: {
    plugins: [tailwindcss()],
  },
});
