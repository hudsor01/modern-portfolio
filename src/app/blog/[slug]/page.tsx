import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { and, eq, isNull } from 'drizzle-orm'
import { Navbar } from '@/components/layout/navbar'
import { BlogPostLayout } from '../_components/blog-post-layout'
import { RelatedPosts } from '@/components/blog/related-posts'
import { BlogPostJsonLd } from '@/components/seo/blog-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { transformToBlogPostData } from '@/lib/api-blog'
import { createContextLogger } from '@/lib/logger'
import type { BlogPostData } from '@/types/api'
import { db } from '@/lib/db'
import { blogPosts } from '@/db/schema'

// Force runtime rendering. notFound() inside Next.js 16's ISR-rendered
// Server Components doesn't propagate HTTP 404 status to Vercel — the
// rendered template ships with HTTP 200, which Google flags as Soft 404
// in Search Console. force-dynamic skips the ISR pipeline so notFound()
// reliably yields HTTP 404 from the runtime render path.
//
// Performance: s-maxage=60 + stale-while-revalidate=86400 in next.config.js
// caches successful responses at the CDN, so real-slug requests are still
// served without function invocation after the first hit. Net effect for
// real slugs is nearly identical to ISR; the difference is that fake
// slugs now correctly emit HTTP 404 instead of 200-with-body.
//
// Upstream tracking: https://github.com/vercel/next.js/issues/79465
export const dynamic = 'force-dynamic'

const logger = createContextLogger('BlogPost')

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Drizzle relational query — deduplicated via React cache() across
// generateMetadata + page render. Filters are inline so the database does the
// status check; no post-fetch JS filtering.
const getBlogPost = cache(async (slug: string): Promise<BlogPostData | null> => {
  try {
    const post = await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'PUBLISHED')),
      with: {
        author: true,
        category: true,
        tags: { with: { tag: true } },
      },
    })

    if (!post) return null
    if (post.deletedAt) return null

    return transformToBlogPostData(post)
  } catch (error) {
    // Distinguish "not found" (null) from "query failed" (re-throw).
    // Without this, a transient Neon outage would return null → trigger
    // notFound() in generateMetadata → ship HTTP 404 → get CDN-cached for
    // up to 24h via the /blog/* cache rule. Re-throwing lets error.tsx
    // handle it as 500, which Vercel does not cache.
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      logger.error(
        'Blog post query failed',
        error instanceof Error ? error : new Error(String(error)),
        { slug }
      )
    }
    throw error
  }
})

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  // Commit to 404 from the metadata phase. Returning fake "Post Not Found"
  // metadata here used to ship HTTP 200 with a Soft-404 body (title set,
  // canonical pointing at the homepage) — exactly the signal Search Console
  // bucketed as "Crawled - currently not indexed". notFound() here renders
  // not-found.tsx and propagates HTTP 404 before the page body runs.
  if (!post) {
    notFound()
  }

  const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
    title: post.title,
    ...(post.category?.name && { category: post.category.name }),
  }).toString()}`

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.metaDescription,
      url: `https://richardwhudsonjr.com/blog/${post.slug}`,
      siteName: 'Richard Hudson - RevOps Professional',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ['Richard Hudson'],
      section: post.category?.name,
      tags: post.tags?.map((tag) => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.metaDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `https://richardwhudsonjr.com/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <BlogPostJsonLd post={post} />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Blog', url: 'https://richardwhudsonjr.com/blog' },
          { name: post.title, url: `https://richardwhudsonjr.com/blog/${post.slug}` },
        ]}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <div className="pt-24 pb-16 lg:pt-32 lg:pb-20">
            <BlogPostLayout post={post} />
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <RelatedPosts
                currentSlug={post.slug}
                currentTags={post.tags?.map((t) => t.name) ?? []}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

// Query published slugs at build time so each post page is statically
// prerendered to HTML. Real slug requests become CDN cache hits with no
// function invocation; ISR (revalidate = 60) keeps content fresh.
//
// Returning [] here triggers an upstream Next.js bug
// (vercel/next.js#79465) where the ISR runtime render pipeline 500s for
// the dynamic-render path. Returning real slugs sidesteps it because
// every existing post is served from the static cache.
//
// CI without DATABASE_URL falls back to [] — the build still succeeds,
// the deploy just renders pages on-demand at runtime instead of at
// build. Vercel's production build always has DATABASE_URL set so this
// branch is only hit on GitHub Actions runs that don't deploy.
export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) {
    return []
  }

  try {
    const posts = await db
      .select({ slug: blogPosts.slug })
      .from(blogPosts)
      // Exclude soft-deleted posts so the build doesn't prerender slugs
      // that runtime getBlogPost now rejects with notFound() → HTTP 404.
      .where(and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt)))

    return posts.map((post) => ({ slug: post.slug }))
  } catch (error) {
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      logger.error(
        'generateStaticParams blog slug query failed',
        error instanceof Error ? error : new Error(String(error))
      )
    }
    // Pages will be generated on-demand at runtime
    return []
  }
}
