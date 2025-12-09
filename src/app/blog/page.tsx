import { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BlogPageContent } from './components/blog-page-content'
import { BlogJsonLd } from '@/components/seo/blog-json-ld'

export const metadata: Metadata = {
  title: 'Blog | Richard Hudson - Revenue Operations Insights',
  description: 'Insights on revenue operations, data analytics, and business growth strategies.',
  keywords: ['revenue operations', 'data analytics', 'business intelligence', 'revops'],
  openGraph: {
    title: 'Blog | Richard Hudson',
    description: 'Insights on revenue operations, data analytics, and business growth strategies.',
    url: 'https://richardhudson.dev/blog',
    type: 'website',
  },
}

export default function BlogHomePage() {
  return (
    <>
      <BlogJsonLd />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <BlogPageContent />
        </main>
        <Footer />
      </div>
    </>
  )
}