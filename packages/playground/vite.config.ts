import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  base: '/playground/',
  resolve: {
    alias: {
      '@v3sf/generator': resolve(__dirname, '../generator/src'),
    },
  },
  build: {
    target: 'esnext',
  },
})
