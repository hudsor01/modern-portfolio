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
import { withDbRetry } from '@/lib/db-retry'
import { blogPosts } from '@/db/schema'
import { canonicalUrl } from '@/lib/absolute-url'
import { resolveMetaDescription, resolvePostLede } from '@/lib/blog-excerpt'
import { safeFeaturedImageUrl } from '@/lib/featured-image-url'
import { BLOG_POST_COLUMNS } from '@/lib/blog-columns'
import { displayPostTitle } from '@/lib/brand'
import { resolveSeoTitle, seoTitleMetadata } from '@/lib/post-title'

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

// The lede and meta description are resolved here once (bio-free, boundary-clean)
// and returned as `excerpt` (up to LEDE_MAX) and `metaDescription` (up to
// META_MAX). The page lede and the JSON-LD description read `excerpt`;
// generateMetadata's description, og:description and twitter:description read
// `metaDescription`, so the two can differ for a post with a long excerpt.
// Drizzle relational query — deduplicated via React cache() across
// generateMetadata + page render. Filters are inline so the database does the
// status check; no post-fetch JS filtering.
const getBlogPost = cache(async (slug: string): Promise<BlogPostData | null> => {
  try {
    const post = await withDbRetry(() =>
      db.query.blogPosts.findFirst({
        where: and(eq(blogPosts.slug, slug), eq(blogPosts.status, 'PUBLISHED')),
        columns: BLOG_POST_COLUMNS,
        with: {
          author: true,
          category: true,
          tags: { with: { tag: true } },
        },
      })
    )

    if (!post) return null
    if (post.deletedAt) return null

    const data = transformToBlogPostData(post)
    const lede = resolvePostLede({
      excerpt: data.excerpt,
      content: data.content,
      metaDescription: data.metaDescription,
    })
    const meta = resolveMetaDescription({
      metaDescription: data.metaDescription,
      excerpt: data.excerpt,
      content: data.content,
    })
    return { ...data, excerpt: lede || undefined, metaDescription: meta || undefined }
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

  // OG/Twitter share previews now share the same image resolution
  // path as sitemap + BlogPostJsonLd: prefer the validated stored
  // featuredImage, fall back to the branded /api/og card. Previously
  // this handler hand-rolled the OG URL and ALWAYS shipped the card,
  // so a post with a perfectly good Unsplash hero shared as a generic
  // brand placeholder on Twitter/LinkedIn — three SEO surfaces
  // disagreed about the canonical image for the same URL.
  //
  // `category` flows through to /api/og when isFallback so the card
  // still renders the bronze category badge (the same `?category=…`
  // param that the pre-helper hand-rolled URL passed).
  // Full title without a stored brand suffix: the card is not a search title.
  const cardTitle = displayPostTitle(post.title)
  const ogImage = safeFeaturedImageUrl(post.featuredImage, {
    title: cardTitle,
    subtitle: 'Blog Post',
    category: post.category?.name,
  })
  // Alt-text contract: when ogImage.url IS the fallback card, the
  // stored featuredImageAlt describes the absent hero (not the card),
  // so it's a misleading alt for screen readers / unfurlers. Use the
  // title — which is the visible text on the /api/og card.
  const ogImageAlt = ogImage.isFallback ? cardTitle : post.featuredImageAlt || cardTitle

  const postUrl = canonicalUrl(`/blog/${post.slug}`)
  // One canonical resolved title (src/lib/post-title.ts, the same rule applied
  // on write) feeds <title>, og:title and twitter:title, so legacy stored values
  // render within the 60-char budget: branded via the root template, or the
  // full post title as `{ absolute }` when it fits only without the brand.
  const resolved = resolveSeoTitle(post.metaTitle, post.title)
  const { title, shareTitle } = seoTitleMetadata(
    resolved.text ? resolved : { text: 'Blog', branded: true }
  )
  return {
    title,
    description: post.metaDescription,
    openGraph: {
      title: shareTitle,
      description: post.metaDescription,
      url: postUrl,
      siteName: 'Richard Hudson',
      images: [
        {
          url: ogImage.url,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
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
      title: shareTitle,
      description: post.metaDescription,
      images: [ogImage.url],
    },
    alternates: {
      canonical: postUrl,
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
          { name: 'Home', url: canonicalUrl('/') },
          { name: 'Blog', url: canonicalUrl('/blog') },
          { name: displayPostTitle(post.title), url: canonicalUrl(`/blog/${post.slug}`) },
        ]}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <div className="pt-24 pb-12 lg:pb-16">
            <BlogPostLayout post={post} />
            <div className="portfolio-container">
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

// Under `dynamic = 'force-dynamic'` above, these slugs are not prerendered and
// there is no ISR: the route builds as `ƒ /blog/[slug]` (server-rendered on
// demand). Real-slug requests are CDN-cached via next.config.js's s-maxage
// headers instead (see the comment on `dynamic`).
//
// Real slugs are still returned because returning [] tripped an upstream
// Next.js bug (vercel/next.js#79465, 500s on the dynamic-render path) back when
// this route used ISR; whether it still would under force-dynamic is untested.
//
// CI without DATABASE_URL falls back to [] and the build still succeeds.
// Vercel's production build always has DATABASE_URL set, so this branch is
// only hit on GitHub Actions runs that don't deploy.
export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) {
    return []
  }

  try {
    const posts = await withDbRetry(() =>
      db
        .select({ slug: blogPosts.slug })
        .from(blogPosts)
        // Exclude soft-deleted posts so the build doesn't prerender slugs
        // that runtime getBlogPost now rejects with notFound() → HTTP 404.
        .where(and(eq(blogPosts.status, 'PUBLISHED'), isNull(blogPosts.deletedAt)))
    )

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
