import React from 'react'
import { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BlogHomeLayout } from '@/components/blog/blog-home-layout'
import { BlogJsonLd } from '@/components/seo/blog-json-ld'

/**
 * Blog Home Page - Server Component
 * Lists all published blog posts with filtering and search capabilities
 * Integrates with existing portfolio architecture and design system
 */

export const metadata: Metadata = {
  title: 'Blog | Richard Hudson - Revenue Operations Insights',
  description: 'Expert insights on revenue operations, data analytics, and business process optimization. Practical guides and strategies from Richard Hudson, a seasoned RevOps professional.',
  keywords: [
    'revenue operations blog',
    'revops insights',
    'data analytics guides',
    'sales operations',
    'business intelligence',
    'process automation',
    'CRM optimization',
    'revenue forecasting',
    'sales analytics',
    'dashboard development'
  ],
  openGraph: {
    title: 'Blog | Richard Hudson - Revenue Operations Insights',
    description: 'Expert insights on revenue operations, data analytics, and business process optimization. Practical guides and strategies from a seasoned RevOps professional.',
    url: 'https://richardhudson.dev/blog',
    siteName: 'Richard Hudson - RevOps Professional',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=630&fit=crop&crop=center&q=80',
        width: 1200,
        height: 630,
        alt: 'Richard Hudson Blog - Revenue Operations Insights',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Richard Hudson - Revenue Operations Insights',
    description: 'Expert insights on revenue operations, data analytics, and business process optimization.',
    images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=630&fit=crop&crop=center&q=80'],
  },
  alternates: {
    canonical: 'https://richardhudson.dev/blog',
    types: {
      'application/rss+xml': [
        {
          url: 'https://richardhudson.dev/api/blog/rss?format=xml',
          title: 'Richard Hudson Blog RSS Feed',
        },
      ],
    },
  },
})

export default BlogHomePage

const BlogHomePage = React.memo(function BlogHomePage() {
  return (
    <>
      <BlogJsonLd />
      <div className="min-h-screen bg-[#0f172a] text-white">
        <Navbar />
        
        <main className="pt-20">
          <BlogHomeLayout />
        </main>
        
        <Footer />
      </div>
    </>
  )
}