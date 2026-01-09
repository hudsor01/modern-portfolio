import { Metadata } from 'next'
export const dynamic = 'force-static'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PostLayout } from '../components/post-layout'
import { BlogPostJsonLd } from '@/components/seo/blog-json-ld'

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
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.data : null
  } catch {
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
      url: `https://richardwhudsonjr.com/blog/${post.slug}`,
      siteName: 'Richard Hudson - RevOps Professional',
      images: post.featuredImage ? [
        {
          url: `https://richardwhudsonjr.com${post.featuredImage}`,
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
      tags: post.tags?.map((tag: { name: string }) => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.metaDescription,
      images: post.featuredImage ? [`https://richardwhudsonjr.com${post.featuredImage}`] : undefined,
    },
    alternates: {
      canonical: post.canonicalUrl || `https://richardwhudsonjr.com/blog/${post.slug}`,
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

          <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
            <PostLayout post={post} />
          </div>
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