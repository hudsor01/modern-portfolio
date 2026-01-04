/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const isCI = process.env.CI === 'true'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.tsx'],
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
    testTimeout: isCI ? 15000 : 10000, // Slightly longer in CI
    hookTimeout: 10000, // 10 seconds for beforeEach/afterEach
    teardownTimeout: 5000, // 5 seconds for cleanup
    // CI-specific settings to prevent hanging
    watch: false, // Never watch in CI (also enforced by --run flag)
    reporters: isCI ? ['default', 'json'] : ['default'],
    outputFile: isCI ? './test-results/results.json' : undefined,
    // Vitest 4: Pool options are now top-level
    pool: 'threads',
    isolate: true, // Enable isolation to prevent cross-test pollution
    fileParallelism: false, // Run tests sequentially for stability
    // Ensure proper cleanup
    restoreMocks: true,
    clearMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    // Force exit after tests complete (prevents hanging)
    passWithNoTests: true,
    dangerouslyIgnoreUnhandledErrors: false,
    // Ensure timers are properly cleaned up
    fakeTimers: {
      shouldClearNativeTimers: true,
    },
    // Explicit environment options for jsdom
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        url: 'http://localhost:3000',
      },
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
