import { defineConfig } from 'vitepress';
import { registerPlugin } from '../plugin';
import { sidebarExample, sidebarGuide } from './sidebar';
import nav from './nav';

export default defineConfig({
  base: '/schema-form',
  title: 'Vue3 Schema Form',
  description: 'Declarative form based on JSON-Schema',
  lastUpdated: true,
  themeConfig: {
    logo: '/images/logo.jpeg',
    lastUpdatedText: 'Updated Date',
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Muluk',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Muluk-m/schema-form',
      },
    ],
    nav: nav(),
    sidebar: {
      // '/example': sidebarExample(),
      '/guide': sidebarGuide(),
    },
  },
  markdown: {
    config: (md) => {
      registerPlugin(md);
    },
  },
  vite: {
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      },
    },
  },
});
