import { DefaultTheme } from 'vitepress';

type SidebarItem = DefaultTheme.SidebarGroup[];

export const sidebarGuide = (): SidebarItem => [
  {
    text: '指南',
    items: [
      {
        text: '什么是 SchemaForm',
        link: '/guide/what',
      },
      {
        text: '快速开始',
        link: '/guide/start',
      },
      {
        text: '示例',
        items: [
          {
            text: '基本使用',
            link: '/guide/using',
          },
          {
            text: '表单联动',
            link: '/guide/linkage',
          },
          {
            text: '表单校验',
            link: '/guide/validate',
          },
          {
            text: '自定义控件',
            link: '/guide/custom',
          },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Props', link: '/guide/api-props' },
          { text: 'schema', link: '/guide/api-schema' },
          { text: 'rule', link: '/guide/api-rule' },
          { text: 'Instance', link: '/guide/api-instance' },
        ],
      },
      {
        text: '未来规划',
        link: '/guide/roadmap',
      },
    ],
  },
];

export const sidebarExample = (): SidebarItem => [
  {
    text: '示例',
    items: [
      {
        text: '基本使用',
        link: '/example/using',
      },
      {
        text: '表单联动',
        link: '/example/linkage',
      },
      {
        text: '表单校验',
        link: '/example/validate',
      },
      {
        text: '自定义控件',
        link: '/example/custom',
      },
    ],
  },
];
