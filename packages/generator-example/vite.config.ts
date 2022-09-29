import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  plugins: [
    vueJsx(),
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
});
