import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/schema-form/',
  title: 'v3sf',
  description: 'UI-agnostic JSON Schema form engine for Vue 3',
  lastUpdated: true,
  themeConfig: {
    logo: '/images/logo.jpeg',
    lastUpdatedText: '最后更新',
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
      {
        text: '指南',
        link: '/guide/getting-started',
        activeMatch: '/guide',
      },
      {
        text: 'API',
        link: '/guide/schema-reference',
        activeMatch: '/guide/schema-reference',
      },
      {
        text: 'Playground',
        link: 'https://muluk-m.github.io/schema-form/playground/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/Muluk-m/schema-form',
      },
    ],
    sidebar: {
      '/guide': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: 'Schema 配置参考', link: '/guide/schema-reference' },
            { text: '内置组件', link: '/guide/widgets' },
          ],
        },
        {
          text: 'API 参考',
          items: [
            { text: 'Schema 配置参考', link: '/guide/schema-reference' },
            { text: '内置组件', link: '/guide/widgets' },
          ],
        },
        {
          text: '适配器',
          items: [{ text: '适配器开发指南', link: '/guide/adapters' }],
        },
        {
          text: 'AI 集成',
          items: [{ text: 'AI 生成表单', link: '/guide/ai-integration' }],
        },
        {
          text: '其他',
          items: [{ text: 'v1 → v2 迁移指南', link: '/guide/migration' }],
        },
      ],
    },
  },
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
})
