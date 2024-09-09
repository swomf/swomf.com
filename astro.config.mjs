import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

import rehypeExternalLinks from 'rehype-external-links';
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// https://astro.build/config
export default defineConfig({
  site: 'https://swomf.codeberg.page',
  integrations: [mdx(), sitemap(), react(), tailwind()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypeExternalLinks,
        {
          target: '_blank'
        }
      ],
      rehypeHeadingIds,
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
      }],
    ]
  },
  build: {
    assets: 'assets'
  }
});