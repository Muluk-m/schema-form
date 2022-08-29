import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/schema-form',
  title: 'Vue3 Schema Form',
  description: 'Example of configured options of VitePress',
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
    nav: [
      { text: '指导', link: '/guide/props', activeMatch: '/guide/' },
      { text: '配置', link: '/config/config', activeMatch: '/config/' },
    ],
    sidebar: {
      '/config': [
        {
          text: 'API',
          items: [
            {
              text: '基本使用',
              link: '/config/use',
            },
          ],
        },
      ],
      '/guid': [
        {
          text: '指导',
          items: [
            {
              text: 'Props',
              link: '/guide/props',
            },
          ],
        },
      ],
    },
  },
});
