import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Explicit aliases mirror the `paths` entries in tsconfig.json. Preferred over
// `resolve.tsconfigPaths: true` (Vite 8) because it skips the tsconfig parse
// on every resolve and the TS team discourages external tools from honoring
// `paths` at runtime. See: https://vite.dev/config/shared-options#resolve-alias
const dirname = path.dirname(fileURLToPath(import.meta.url))
const r = (p: string) => path.resolve(dirname, p)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Order matters: Vite picks the first matching entry. Specific aliases
      // for the Drizzle layer precede the catch-all `@/` → `src/`. Mirrors
      // the `paths` entries in tsconfig.json.
      { find: /^@\/db$/, replacement: r('./src/db/index.ts') },
      { find: /^@\/db\//, replacement: r('./src/db') + '/' },
      { find: /^@\//, replacement: r('./src') + '/' },
    ],
  },
  test: {
    environment: 'jsdom',
    // Both are Vitest 5's defaults, set explicitly: v5 prints end-of-run tuning
    // hints ("jsdom was created N times", "faster with isolate: false") whenever
    // pool/isolate are implicit. Per-file isolation is deliberate — suites rely
    // on module-level vi.mock() not leaking between files — so neither the
    // `vmThreads` pool nor `isolate: false` is a free speed-up here.
    pool: 'forks',
    isolate: true,
    globals: false,
    include: ['src/**/__tests__/**/*.test.ts', 'src/**/__tests__/**/*.test.tsx'],
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/__tests__/**', 'src/**/*.d.ts'],
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
    setupFiles: ['./src/lib/__tests__/setup.ts'],
  },
})
