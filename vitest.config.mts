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
      // Order matters: Vite picks the first matching entry. Specific
      // Prisma client/browser re-exports precede the generic `@/prisma/`
      // prefix, which precedes the catch-all `@/` → `src/`.
      { find: /^@\/prisma\/client$/, replacement: r('./src/generated/prisma/index.ts') },
      { find: /^@\/prisma\/browser$/, replacement: r('./src/generated/prisma/index-browser.ts') },
      { find: /^@\/prisma\//, replacement: r('./src/generated/prisma') + '/' },
      { find: /^@\//, replacement: r('./src') + '/' },
    ],
  },
  test: {
    environment: 'jsdom',
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
