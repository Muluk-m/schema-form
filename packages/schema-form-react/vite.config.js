import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';

export default defineConfig({
  optimizeDeps: {
    include: []
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  plugins: [reactRefresh(), tsconfigPaths()],
  logLevel: 'error',
  server: {
    open: true,
    fs: {
      strict: false
    },
    host: 'localhost',
    port: 9000
    // proxy: {
    //   '/sso': {
    //     target: 'http://localhost',
    //     // rewrite: (path: any) => path.replace(/^\/api/, ''),
    //     changeOrigin: true,
    //     cookieDomainRewrite: 'localhost'
    //   }
    // }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  build: {
    sourcemap: 'inline'
  }
});
