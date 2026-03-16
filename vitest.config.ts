import { defineConfig } from 'vitest/config'
import vueJsx from '@vitejs/plugin-vue-jsx'

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
      '@v3sf/core': '/Users/qian/Projects/SelfGithub/schema-form/packages/core/src',
      '@v3sf/vant': '/Users/qian/Projects/SelfGithub/schema-form/packages/vant/src',
    },
  },
})
