/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.tsx'],
    css: true,
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.next', 'e2e/**/*', 'playwright-report/**/*'],
    // Timeout configurations to prevent hanging
    testTimeout: 10000, // 10 seconds per test
    hookTimeout: 10000, // 10 seconds for beforeEach/afterEach
    teardownTimeout: 10000, // 10 seconds for cleanup
    // Pool options for proper worker cleanup
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true, // Use single fork for better stability in CI
      },
    },
    // Ensure proper cleanup
    restoreMocks: true,
    clearMocks: true,
    resetMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
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