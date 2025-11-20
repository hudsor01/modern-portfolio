import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BlogPostLayout } from '@/components/blog/blog-post-layout'
import { BlogPostJsonLd } from '@/components/seo/blog-json-ld'
import { createContextLogger } from '@/lib/logging/logger'

const logger = createContextLogger('BlogPostPage')

/**
 * Dynamic Blog Post Page - Server Component
 * Displays individual blog posts with SEO optimization
 * Integrates with existing portfolio architecture and design system
 */

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Function to fetch post data from API
async function getBlogPost(slug: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://richardwhudsonjr.com' 
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    logger.error('Error fetching blog post', error instanceof Error ? error : new Error(String(error)))
    return null
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }
  
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.metaDescription,
      url: `https://richardhudson.dev/blog/${post.slug}`,
      siteName: 'Richard Hudson - RevOps Professional',
      images: post.featuredImage ? [
        {
          url: `https://richardhudson.dev${post.featuredImage}`,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || post.title,
        },
      ] : undefined,
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name || 'Richard Hudson'],
      section: post.category?.name,
      tags: post.tags?.map(tag => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.metaDescription,
      images: post.featuredImage ? [`https://richardhudson.dev${post.featuredImage}`] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || `https://richardhudson.dev/blog/${post.slug}`,
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
      <div className="min-h-screen bg-[#0f172a] text-white">
        <Navbar />
        
        <main className="pt-20">
          <BlogPostLayout post={post} />
        </main>
        
        <Footer />
      </div>
    </>
  )
}

// Generate static params for known blog posts
export async function generateStaticParams() {
  // In real implementation, fetch all published post slugs
  return [
    { slug: 'revenue-operations-best-practices-complete-guide' },
    { slug: 'building-effective-sales-dashboards-real-time-data' },
    { slug: 'advanced-customer-churn-analysis-techniques' },
    { slug: 'automating-revenue-reporting-modern-tools' },
    { slug: 'kpi-design-principles-revenue-operations' },
  ]
}