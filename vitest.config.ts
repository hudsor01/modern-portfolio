/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const isCI = process.env.CI === 'true'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom', // 2-10x faster than jsdom
    setupFiles: ['./src/test/browser-mocks.ts', './src/test/setup.tsx'],
    css: true,
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'e2e/**/*',
      'playwright-report/**/*',
      '**/*.spec.ts',
    ],
    // Timeout configurations to prevent hanging
    testTimeout: isCI ? 15000 : 10000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
    // CI-specific settings
    watch: false,
    reporters: isCI ? ['default', 'json'] : ['default'],
    outputFile: isCI ? './test-results/results.json' : undefined,
    // Pool options
    pool: 'threads',
    fileParallelism: true,
    // Cleanup
    restoreMocks: true,
    clearMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    passWithNoTests: true,
    dangerouslyIgnoreUnhandledErrors: false,
    fakeTimers: {
      shouldClearNativeTimers: true,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/app/**/layout.tsx',
        'src/app/**/loading.tsx',
        'src/app/**/error.tsx',
        'src/app/**/not-found.tsx',
        'src/app/global-error.tsx',
        'coverage/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: [
      // Prisma aliases must come first (more specific paths)
      {
        find: '@/prisma/client',
        replacement: resolve(__dirname, './prisma/generated/prisma/client.ts'),
      },
      {
        find: '@/prisma/browser',
        replacement: resolve(__dirname, './prisma/generated/prisma/browser.ts'),
      },
      { find: '@/prisma', replacement: resolve(__dirname, './prisma/generated/prisma') },
      // Standard src aliases
      { find: '@/components', replacement: resolve(__dirname, './src/components') },
      { find: '@/lib', replacement: resolve(__dirname, './src/lib') },
      { find: '@/hooks', replacement: resolve(__dirname, './src/hooks') },
      { find: '@/types', replacement: resolve(__dirname, './src/types') },
      { find: '@/app', replacement: resolve(__dirname, './src/app') },
      { find: '@/styles', replacement: resolve(__dirname, './src/styles') },
      { find: '@/content', replacement: resolve(__dirname, './src/content') },
      { find: '@/data', replacement: resolve(__dirname, './src/data') },
      { find: '@', replacement: resolve(__dirname, './src') },
    ],
  },
  define: {
    'import.meta.vitest': false,
  },
})
