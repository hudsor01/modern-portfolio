import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'

// Segment-level not-found for /blog/category/[slug]. Rendered when the
// category lookup returns null and the page calls notFound(). HTTP 404
// status comes from the notFound() call in the page; this template just
// supplies the body. Metadata export prevents the layout default title
// from leaking into 404 responses.
export const metadata: Metadata = {
  title: '404 — Category not found',
  robots: { index: false, follow: false },
}

export default function BlogCategoryNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="min-h-[70vh] grid place-items-center px-6 pt-24">
        <div className="text-center max-w-md">
          <p aria-hidden="true" className="text-sm uppercase tracking-wide text-muted-foreground">
            404
          </p>
          <h1 className="text-3xl font-bold mt-2 mb-4 text-foreground">Category not found</h1>
          <p className="text-muted-foreground mb-6">
            That category doesn&apos;t exist or may have been renamed.
          </p>
          <Link href="/blog" className="inline-block text-primary hover:underline">
            ← Browse all posts
          </Link>
        </div>
      </main>
    </div>
  )
}
