import { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BlogPageContent } from './components/blog-page-content'
import { BlogJsonLd } from '@/components/seo/blog-json-ld'

export const dynamic = 'force-static'
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
        <main className="relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

          <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
            <BlogPageContent />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}