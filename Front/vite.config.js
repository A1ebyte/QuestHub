/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,

    environment: 'jsdom',

    setupFiles: './src/test/setup.ts',

    css: true,

    coverage: {
      provider: 'istanbul',

      reporter: ['text', 'json', 'html'],

      reportsDirectory: './coverage',

      include: ['src/**/*.{ts,tsx}'],

      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.test.*',
        '**/*.spec.*',
      ],

      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
})