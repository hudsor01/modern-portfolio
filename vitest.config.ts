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
    exclude: ['node_modules', 'dist', '.next', 'e2e/**/*', 'playwright-report/**/*', '**/*.spec.ts'],
    // Timeout configurations to prevent hanging
    testTimeout: isCI ? 15000 : 10000, // Slightly longer in CI
    hookTimeout: 10000, // 10 seconds for beforeEach/afterEach
    teardownTimeout: 5000, // 5 seconds for cleanup
    // CI-specific settings to prevent hanging
    watch: false, // Never watch in CI (also enforced by --run flag)
    reporters: isCI ? ['default', 'json'] : ['default'],
    outputFile: isCI ? './test-results/results.json' : undefined,
    // Pool options for proper worker cleanup
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true, // Use single fork for better stability in CI
        isolate: true, // Isolate each test file
      },
    },
    // Ensure proper cleanup
    restoreMocks: true,
    clearMocks: true,
    resetMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    // Force exit after tests complete (prevents hanging)
    passWithNoTests: true,
    dangerouslyIgnoreUnhandledErrors: false,
    // Ensure timers are properly cleaned up
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
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/types': resolve(__dirname, './src/types'),
      '@/app': resolve(__dirname, './src/app'),
      '@/styles': resolve(__dirname, './src/styles'),
      '@/content': resolve(__dirname, './src/content'),
      '@/data': resolve(__dirname, './src/data'),
    },
  },
  define: {
    'import.meta.vitest': false,
  },
})