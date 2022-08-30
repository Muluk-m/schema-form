import { DefaultTheme } from 'vitepress';

const nav = (): DefaultTheme.NavItem[] => [
  {
    text: '指南',
    link: '/guide/start',
    activeMatch: '/guide',
  },
  {
    text: '示例',
    link: '/example/using',
    activeMatch: '/example',
  },
];

export default nav;
