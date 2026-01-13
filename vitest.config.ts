import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * Vitest Configuration
 * Optimized for fast unit tests only (*.unit.test.ts)
 * Excludes slow Bun-specific test files
 *
 * @see https://vitest.dev/config/
 * @see https://nextjs.org/docs/app/guides/testing/vitest
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node', // Fast node environment for pure logic
    setupFiles: ['./vitest.unit.setup.ts'],
    // Only run renamed unit tests
    include: ['**/*.unit.test.{ts,tsx}'],
    // Exclude everything else
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/e2e/**',
      '**/*.e2e.test.ts',
      // Exclude all Bun-specific test files
      'src/__tests__/**',
      'src/hooks/__tests__/**/*.test.ts',
      'src/hooks/__tests__/**/*.test.tsx',
      'src/components/**/*.test.tsx',
      'src/app/**/*.test.tsx',
      // Exclude integration tests (can add later)
      '**/*.integration.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/coverage/**',
        '**/*.config.*',
        '**/test/**',
      ],
    },
  },
})
