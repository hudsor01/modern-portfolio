/**
 * Blog types — model types come from the Drizzle schema.
 * For row shapes, import directly from `@/db/schema` (or via `@/lib/db`).
 */

import type { BlogPost, Author, Category, Tag, ContentType } from '@/db/schema'

// ContentType enum comes from the Drizzle schema (the single source of truth
// for its values — see src/db/schema.ts pgEnums). PostStatus is imported
// directly from @/db/schema by consumers, so it is not re-exported here.
export type { ContentType }

// ============================================================================
// UTILITY TYPES — Drizzle relational shapes
// ============================================================================

// Shape returned by the canonical Drizzle blog query (relational
// findFirst/findMany with `with: { author, category, tags: { with: { tag } } }`).
export type BlogPostWithRelations = BlogPost & {
  author: Author | null
  category: Category | null
  tags: Array<{ tag: Tag }>
}
