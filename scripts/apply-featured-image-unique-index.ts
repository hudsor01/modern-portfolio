/**
 * One-off: add a partial unique index on blog_posts.featuredImage scoped
 * to PUBLISHED + non-deleted rows. Prevents new duplicate-image inserts
 * at the database layer — the original failure class this whole branch
 * exists to fix would have been blocked at the row level.
 *
 * Why not via drizzle-kit migrate: the Postgres schema was created by
 * Prisma (pre-Drizzle migration), so drizzle-kit has no baseline and
 * `db:generate` emits the entire schema as migration 0000 — unsafe to
 * run against prod which already has those tables. Until someone
 * baselines drizzle-kit against the current prod schema, focused
 * one-off scripts like this one are the project's idiom (see also
 * scripts/update-blog-featured-images.ts and scripts/touch-blog-lastmod.ts).
 *
 * Idempotent via `IF NOT EXISTS`. Safe to run twice.
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
