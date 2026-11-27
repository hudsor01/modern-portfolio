import { sql } from 'drizzle-orm'
import { blogPosts } from '@/db/schema'
import { CONTENT_HEAD_CHARS } from '@/lib/blog-excerpt'

/**
 * Relational-query `extras`: only a bounded prefix of the post body is read,
 * and it never leaves the server (derived plain text only crosses to the
 * client). The length is inlined with `sql.raw` so Postgres sees a literal
 * integer rather than an untyped parameter.
 */
export const BLOG_CONTENT_HEAD_EXTRAS = {
  contentHead: sql<string>`left(${blogPosts.content}, ${sql.raw(String(CONTENT_HEAD_CHARS))})`.as(
    'content_head'
  ),
}
