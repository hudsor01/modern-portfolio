/**
 * One-off DDL: add a partial unique index on
 * blog_posts.featuredImage scoped to PUBLISHED + non-deleted rows.
 * Prevents new duplicate-image inserts at the database layer — the
 * original 27-posts-share-9-URLs failure class is now blocked at row
 * level, regardless of who's writing (admin POST/PUT, seed, hand SQL).
 *
 * Originally a one-off because drizzle-kit had no baseline against the
 * Prisma-era schema. As of the 0000_rename_referer_to_referrer
 * migration, drizzle-kit IS baselined and the partial unique index is
 * in the snapshot — but this script is kept for backfilling against
 * any DB that pre-dates the Drizzle baseline (e.g. a stale Neon dev
 * branch). For new DBs and forward changes, prefer `bun run
 * db:generate` + `bun run db:migrate`.
 *
 * Idempotent via `IF NOT EXISTS`. Safe to re-run.
 *
 * Usage: `bun run scripts/apply-featured-image-unique-index.ts`
 */
import { sql } from 'drizzle-orm'
import { blogPosts } from '@/db/schema'
import { createScriptDb } from './_db'

const db = createScriptDb({ blogPosts })

async function main() {
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_featuredImage_published_unique_idx"
    ON "blog_posts" ("featuredImage")
    WHERE "status" = 'PUBLISHED' AND "deletedAt" IS NULL
  `)
  console.log('  ✓ blog_posts_featuredImage_published_unique_idx ensured')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('apply-featured-image-unique-index failed:', err)
    process.exit(1)
  })
