import { Metadata } from 'next'
import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BlogPostLayout } from '../_components/blog-post-layout'
import { BlogPostJsonLd } from '@/components/seo/blog-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { transformToBlogPostData } from '@/lib/api-blog'
import { createContextLogger } from '@/lib/logger'
import type { BlogPostData } from '@/types/api'
import { db } from '@/lib/db'

const logger = createContextLogger('BlogPost')

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

const POST_IMAGE_OVERRIDES: Record<string, { src: string; alt: string }> = {
  'unlocking-power-sales-automation-salesloft-game-changer': {
    src: '/images/blog/sales-automation-salesloft-hero.jpg',
    alt: 'Sales automation dashboard with pipeline analytics and workflow nodes',
  },
}

// Official Next.js 16 Pattern: Use React cache() for database queries
// This automatically deduplicates requests across generateMetadata and page component
// Gracefully handles missing database (CI builds)
const getBlogPost = cache(async (slug: string): Promise<BlogPostData | null> => {
  try {
    const post = await db.blogPost.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!post) return null

    return transformToBlogPostData(post)
  } catch (error) {
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      logger.error(
        'Blog post query failed',
        error instanceof Error ? error : new Error(String(error)),
        { slug }
      )
    }
    return null
  }
})

function applyPostOverrides(post: BlogPostData | null) {
  if (!post) return post
  const override = POST_IMAGE_OVERRIDES[post.slug]
  if (!override) return post

  return {
    ...post,
    featuredImage: post.featuredImage ?? override.src,
    featuredImageAlt: post.featuredImageAlt ?? override.alt,
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = applyPostOverrides(await getBlogPost(slug))

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
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
      tags: post.tags?.map(tag => tag.name),
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
  const post = applyPostOverrides(await getBlogPost(slug))

  if (!post) {
    notFound()
  }

  const nonce = (await headers()).get('x-nonce')

  return (
    <>
      <BlogPostJsonLd post={post} nonce={nonce} />
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Blog', url: 'https://richardwhudsonjr.com/blog' },
          { name: post.title, url: `https://richardwhudsonjr.com/blog/${post.slug}` },
        ]}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

          <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
            <BlogPostLayout post={post} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

// Official Next.js 16 Pattern: generateStaticParams for Static Site Generation
// This pre-renders all blog posts at build time (zero runtime cost)
// Falls back to empty array during CI builds without database
export async function generateStaticParams() {
  // During build, skip DB — pages are generated on-demand via ISR
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return []
  }

  try {
    const posts = await db.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
      orderBy: { publishedAt: 'desc' },
    })

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
