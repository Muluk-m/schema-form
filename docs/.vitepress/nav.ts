import { DefaultTheme } from 'vitepress';

const nav = (): DefaultTheme.NavItem[] => [
  {
    text: '指南',
    link: '/guide/start',
  },
  {
    text: '示例',
    link: '/example/using',
  },
];

export default nav;
