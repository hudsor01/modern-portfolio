/**
 * Prisma 7 Configuration
 * Used by Prisma CLI for migrations, generate, and other commands
 *
 * Note: The application uses PrismaNeon adapter in src/lib/db.ts
 * This config uses DIRECT_URL for CLI operations (migrations, etc.)
 */

import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Use DIRECT_URL for migrations and other CLI operations
    // This should be the direct connection string (not pooled)
    url: env('DIRECT_URL') || env('DATABASE_URL'),
  },
})
