/**
 * Prisma 7 Configuration
 * Used by Prisma CLI for migrations, generate, and other commands
 *
 * Note: The application uses PrismaPg adapter in src/lib/db.ts
 * This config is only for CLI operations
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
    url: env('DATABASE_URL'),
  },
})
