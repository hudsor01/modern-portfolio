import { Metadata } from 'next'
import { cache } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BlogList } from './_components/blog-list'
import { BlogJsonLd } from '@/components/seo/blog-json-ld'
import { db } from '@/lib/db'
import { transformToBlogPostData } from '@/lib/api-blog'
import type { BlogPostData, BlogCategoryData } from '@/types/api'

export const metadata: Metadata = {
  title: 'Blog | Richard Hudson - Revenue Operations Insights',
  description: 'Insights on revenue operations, data analytics, and business growth strategies.',
  keywords: ['revenue operations', 'data analytics', 'business intelligence', 'revops'],
  openGraph: {
    title: 'Blog | Richard Hudson',
    description: 'Insights on revenue operations, data analytics, and business growth strategies.',
    url: 'https://richardwhudsonjr.com/blog',
    type: 'website',
  },
}

// Official Next.js 16 Pattern: React cache() for database queries
const getBlogPosts = cache(async (): Promise<BlogPostData[]> => {
  const posts = await db.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: { publishedAt: 'desc' },
    take: 50
  })

  return posts.map(transformToBlogPostData)
})

const getCategories = cache(async (): Promise<BlogCategoryData[]> => {
  const categories = await db.category.findMany({
    orderBy: { totalViews: 'desc' }
  })

  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description ?? undefined,
    color: cat.color ?? undefined,
    icon: cat.icon ?? undefined,
    postCount: cat.postCount,
    totalViews: cat.totalViews,
    createdAt: cat.createdAt.toISOString()
  }))
})

export default async function BlogHomePage() {
  // Fetch data on the server - zero client-side fetching cost
  const posts = await getBlogPosts()
  const categories = await getCategories()

  return (
    <>
      <BlogJsonLd />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

          <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
            <BlogList initialPosts={posts} initialCategories={categories} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
