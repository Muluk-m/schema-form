import { defineConfig } from 'vitepress'
import { registerPlugin } from '../plugin'

export default defineConfig({
  title: 'v3sf',
  description: 'AI-Native Form Schema Toolkit — 用自然语言生成表单，编译为任意框架配置',
  base: '/schema-form/',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/schema-form/favicon.svg' }]],

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/getting-started' },
          { text: 'API', link: '/api/schema' },
          { text: 'Playground', link: 'https://muluk-m.github.io/schema-form/playground/' },
        ],
        sidebar: {
          '/guide/': [
            {
              text: '入门',
              items: [
                { text: '快速开始', link: '/guide/getting-started' },
                { text: 'Schema 配置', link: '/guide/schema-reference' },
              ],
            },
            {
              text: '核心功能',
              items: [
                { text: '内置组件', link: '/guide/widgets' },
                { text: '表达式联动', link: '/guide/expressions' },
                { text: '表单校验', link: '/guide/validation' },
              ],
            },
            {
              text: '进阶',
              items: [
                { text: '适配器开发', link: '/guide/adapters' },
                { text: '自定义组件', link: '/guide/custom-widgets' },
                { text: 'AI 集成', link: '/guide/ai-integration' },
              ],
            },
            {
              text: '其他',
              items: [{ text: '迁移指南', link: '/guide/migration' }],
            },
          ],
          '/api/': [
            {
              text: 'API 参考',
              items: [
                { text: 'Schema', link: '/api/schema' },
                { text: '组件 Props', link: '/api/props' },
                { text: '校验规则', link: '/api/rules' },
                { text: '表单实例', link: '/api/form-ref' },
                { text: '适配器', link: '/api/adapter' },
              ],
            },
          ],
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'API', link: '/en/api/schema' },
          { text: 'Playground', link: 'https://muluk-m.github.io/schema-form/playground/' },
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Quick Start', link: '/en/guide/getting-started' },
                { text: 'Schema Config', link: '/en/guide/schema-reference' },
              ],
            },
            {
              text: 'Core Features',
              items: [
                { text: 'Built-in Widgets', link: '/en/guide/widgets' },
                { text: 'Expressions', link: '/en/guide/expressions' },
                { text: 'Validation', link: '/en/guide/validation' },
              ],
            },
            {
              text: 'Advanced',
              items: [
                { text: 'Adapter Development', link: '/en/guide/adapters' },
                { text: 'Custom Widgets', link: '/en/guide/custom-widgets' },
                { text: 'AI Integration', link: '/en/guide/ai-integration' },
              ],
            },
            {
              text: 'Other',
              items: [{ text: 'Migration Guide', link: '/en/guide/migration' }],
            },
          ],
          '/en/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'Schema', link: '/en/api/schema' },
                { text: 'Component Props', link: '/en/api/props' },
                { text: 'Validation Rules', link: '/en/api/rules' },
                { text: 'Form Ref', link: '/en/api/form-ref' },
                { text: 'Adapter', link: '/en/api/adapter' },
              ],
            },
          ],
        },
      },
    },
  },

  markdown: {
    config: (md) => registerPlugin(md),
  },

  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [{ icon: 'github', link: 'https://github.com/Muluk-m/schema-form' }],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present v3sf',
    },
  },
})
