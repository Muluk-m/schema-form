import { defineConfig } from 'vitest/config'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vueJsx()],
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['packages/**/__tests__/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: ['packages/*/src/types/**', '**/*.d.ts'],
    },
  },
  resolve: {
    alias: {
      '@v3sf/core': resolve(__dirname, 'packages/core/src'),
      '@v3sf/vant': resolve(__dirname, 'packages/vant/src'),
      '@v3sf/element-plus': resolve(__dirname, 'packages/element-plus/src'),
      '@v3sf/ai': resolve(__dirname, 'packages/ai/src'),
    },
  },
})
