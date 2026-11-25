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
// findFirst/findMany with `columns: BLOG_POST_COLUMNS` and
// `with: { author, category, tags: { with: { tag } } }`). `searchVector` is
// excluded: it is never selected (src/lib/blog-columns.ts).
export type BlogPostWithRelations = Omit<BlogPost, 'searchVector'> & {
  author: Author | null
  category: Category | null
  tags: Array<{ tag: Tag }>
}

/**
 * What a /blog index card renders, and nothing more. The index used to ship
 * full `BlogPostData` (post bodies and the author's email) in its RSC payload,
 * about 1.1 MB of HTML for 50 posts.
 */
export interface BlogListPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  featuredImage: string | null
  /** ISO 8601. */
  publishedAt: string | null
  categoryName: string | null
  tags: Array<{ id: string; name: string }>
}
