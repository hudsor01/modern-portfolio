/**
 * Column selections for `blogPosts` relational queries.
 *
 * A Drizzle relational query with no `columns` selects every column, and that
 * includes the generated `search_vector` tsvector: about as large as the post
 * body (roughly 17 KB per live post as text) and read only inside Postgres by
 * the full-text search in src/lib/search.ts. Fetching it shipped that weight
 * over the Neon HTTP driver on every post render, RSS fetch and blog API call,
 * and Neon bills every byte as network transfer. Every `db.query.blogPosts`
 * call declares `columns` (guard: src/lib/__tests__/blog-columns-guard.test.ts).
 */

/** Every `blogPosts` column except the search index. */
export const BLOG_POST_COLUMNS = { searchVector: false } as const
