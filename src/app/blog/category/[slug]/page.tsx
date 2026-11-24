import type { Metadata } from 'next'
import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { BlogFeaturedImage } from '@/components/blog/blog-featured-image'
import { BlogCategoryJsonLd } from '@/components/seo/blog-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '@/lib/db'
import { blogPosts, categories } from '@/db/schema'
import { createContextLogger } from '@/lib/logger'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { brandTitle } from '@/app/shared-metadata'
import { BLOG_CONTENT_HEAD_EXTRAS } from '@/lib/blog-content-head'
import { resolveExcerpt } from '@/lib/blog-excerpt'
import { resolveListCovers } from '@/lib/blog-list'
import { formatDate } from '@/lib/data-formatters'
import { DecorativeBlob } from '@/components/ui/decorative-blob'

// Force runtime rendering — see /blog/[slug]/page.tsx for the rationale.
// notFound() inside ISR-rendered Server Components ships HTTP 200 with a
// 404 body, which Google flags as Soft 404. force-dynamic gets reliable
// HTTP 404 for unknown categories.
export const dynamic = 'force-dynamic'

const logger = createContextLogger('BlogCategoryPage')

interface BlogCategoryPageProps {
  params: Promise<{ slug: string }>
}

interface CategoryWithPosts {
  id: string
  name: string
  slug: string
  description: string | null
  postCount: number
  posts: Array<{
    id: string
    slug: string
    title: string
    excerpt: string | null
    featuredImage: string | null
    publishedAt: Date | null
    contentHead?: string | null
    tags: Array<{ tag: { id: string; name: string } }>
  }>
}

const getCategoryWithPosts = cache(async (slug: string): Promise<CategoryWithPosts | null> => {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
      with: {
        posts: {
          where: and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt)),
          orderBy: desc(blogPosts.publishedAt),
          extras: BLOG_CONTENT_HEAD_EXTRAS,
          columns: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            featuredImage: true,
            publishedAt: true,
          },
          with: {
            tags: {
              columns: {},
              with: { tag: { columns: { id: true, name: true } } },
            },
          },
        },
      },
    })
    if (!category) return null
    return category as CategoryWithPosts
  } catch (error) {
    // Distinguish "not found" (null) from "query failed" (re-throw).
    // Returning null on DB errors would trigger notFound() → cached 404.
    // Re-throw lets error.tsx ship 500, which Vercel does not cache.
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      logger.error(
        'Blog category query failed',
        error instanceof Error ? error : new Error(String(error)),
        { slug }
      )
    }
    throw error
  }
})

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryWithPosts(slug)

  // Commit to 404 from the metadata phase. Returning fake metadata (even
  // with robots:noindex) shipped HTTP 200 with a Soft-404 body — same
  // Search Console verdict fixed on /blog/[slug]. Symmetric fix.
  if (!category) {
    notFound()
  }

  const title = `${category.name}: Articles`
  const description =
    category.description ||
    `Articles about ${category.name} from Richard Hudson's revenue operations blog.`

  return {
    title,
    description,
    openGraph: {
      title: brandTitle(title),
      description,
      url: canonicalUrl(`/blog/category/${category.slug}`),
      siteName: 'Richard Hudson',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: brandTitle(title),
      description,
    },
    alternates: {
      canonical: canonicalUrl(`/blog/category/${category.slug}`),
    },
  }
}

function formatPublishedDate(value: Date | null): string {
  if (!value) return ''
  return formatDate(value, { month: 'long' })
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryWithPosts(slug)

  if (!category) {
    notFound()
  }

  const cards = resolveListCovers(
    category.posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      featuredImage: p.featuredImage,
      publishedAt: p.publishedAt,
      excerpt: resolveExcerpt({ excerpt: p.excerpt, content: p.contentHead }) || null,
    })),
    () => category.name
  )

  const nonce = (await headers()).get('x-nonce')

  return (
    <>
      <BlogCategoryJsonLd
        nonce={nonce}
        category={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? undefined,
          postCount: category.postCount,
        }}
      />
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Blog', url: canonicalUrl('/blog') },
          {
            name: category.name,
            url: canonicalUrl(`/blog/category/${category.slug}`),
          },
        ]}
      />

      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="relative overflow-x-clip">
          <DecorativeBlob position="top-right" />
          <DecorativeBlob position="bottom-left" />

          <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="mb-12">
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← All articles
                </Link>
                <h1 className="mt-4 mb-4">{category.name}</h1>
                {category.description && <p className="max-w-3xl">{category.description}</p>}
                <p className="mt-4">
                  {category.posts.length} {category.posts.length === 1 ? 'article' : 'articles'}
                </p>
              </div>

              {category.posts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                      <Card className="hover-lift hover:border-primary/50 transition-all h-full overflow-hidden">
                        {post.featuredImage && (
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <BlogFeaturedImage
                              src={post.featuredImage}
                              alt={post.title}
                              postTitle={post.title}
                              postCategory={category.name}
                              fill
                              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <span className="inline-flex items-center px-2.5 py-1 mb-2 text-xs font-semibold tracking-wide uppercase text-primary bg-primary/8 border border-border rounded-md">
                            {category.name}
                          </span>
                          <CardTitle as="h2" className="line-clamp-3 transition-colors">
                            {post.title}
                          </CardTitle>
                          {post.excerpt && (
                            <CardDescription className="line-clamp-3">
                              {post.excerpt}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <time
                            className="text-sm text-muted-foreground"
                            dateTime={post.publishedAt?.toISOString()}
                          >
                            {formatPublishedDate(post.publishedAt)}
                          </time>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p>No articles published in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
