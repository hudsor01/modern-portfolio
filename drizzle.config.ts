import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  // The Postgres schema (citext extension, all tables, indexes, FKs) was
  // already created by an earlier ORM and is the source of truth in the live
  // DB. drizzle-kit baselines against that existing schema rather than
  // re-creating tables — `bunx drizzle-kit generate` emits forward-only
  // migrations from this point.
  strict: true,
  verbose: true,
})
