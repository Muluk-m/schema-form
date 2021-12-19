import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';

export default defineConfig({
  optimizeDeps: {
    include: [],
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [reactRefresh(), tsconfigPaths()],
  logLevel: 'error',
  server: {
    open: true,
    fs: {
      strict: false,
    },
    host: 'localhost',
    port: 3000,
  },
  // css: {
  //   preprocessorOptions: {
  //     less: {
  //       javascriptEnabled: true
  //     }
  //   }
  // },
});
