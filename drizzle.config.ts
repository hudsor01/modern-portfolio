import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  // citext + the existing Prisma migration history live in the DB; we baseline
  // against the live schema rather than re-creating tables.
  strict: true,
  verbose: true,
})
