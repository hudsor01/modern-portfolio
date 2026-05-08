import Link from 'next/link'
import { and, desc, eq, isNull, ne } from 'drizzle-orm'
import { db } from '@/lib/db'
import { blogPosts } from '@/db/schema'
import { createContextLogger } from '@/lib/logger'
import { selectRelatedPosts, type RelatedPostInput } from './related-posts-utils'

const logger = createContextLogger('RelatedPosts')

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
  limit?: number
}

export async function RelatedPosts({ currentSlug, currentTags, limit = 3 }: RelatedPostsProps) {
  const safeLimit = Math.min(limit, 3)

  type PostRow = {
    slug: string
    title: string
    excerpt: string | null
    publishedAt: Date | null
    tags: { tag: { name: string } }[]
  }
  let posts: PostRow[]
  try {
    posts = await db.query.blogPosts.findMany({
      where: and(
        eq(blogPosts.status, 'PUBLISHED'),
        isNull(blogPosts.deletedAt),
        ne(blogPosts.slug, currentSlug)
      ),
      columns: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
      },
      with: {
        tags: {
          columns: {},
          with: { tag: { columns: { name: true } } },
        },
      },
      orderBy: desc(blogPosts.publishedAt),
      limit: 50,
    })
  } catch (error) {
    logger.error(
      'RelatedPosts DB query failed; rendering nothing',
      error instanceof Error ? error : new Error(String(error)),
      { currentSlug }
    )
    return null
  }

  const candidates: (RelatedPostInput & { excerpt: string | null })[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    tags: (p.tags ?? []).map((t) => t?.tag?.name).filter((n): n is string => !!n),
    publishedAt: p.publishedAt?.toISOString() ?? '1970-01-01',
    excerpt: p.excerpt,
  }))

  const current: RelatedPostInput & { excerpt: string | null } = {
    slug: currentSlug,
    title: '',
    tags: currentTags,
    publishedAt: '',
    excerpt: null,
  }
  const related = selectRelatedPosts(candidates, current, safeLimit)

  if (related.length === 0) return null

  return (
    <aside className="mt-16 pt-12 border-t border-border" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="text-2xl font-semibold mb-6 text-foreground">
        Related reading
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            )}
          </Link>
        ))}
      </div>
    </aside>
  )
}
