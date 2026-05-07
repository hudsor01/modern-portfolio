import Link from 'next/link'
import { db } from '@/lib/db'
import { selectRelatedPosts, type RelatedPostInput } from './related-posts-utils'

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
  limit?: number
}

export async function RelatedPosts({ currentSlug, currentTags, limit = 3 }: RelatedPostsProps) {
  const safeLimit = Math.min(limit, 3)

  const posts = await db.blogPost.findMany({
    where: { status: 'PUBLISHED', deletedAt: null, NOT: { slug: currentSlug } },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      tags: { select: { tag: { select: { name: true } } } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 50,
  })

  const candidates: (RelatedPostInput & { excerpt: string | null })[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    tags: p.tags.map((t) => t.tag.name),
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
