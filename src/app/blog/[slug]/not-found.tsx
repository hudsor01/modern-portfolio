import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'

// Segment-level not-found for /blog/[slug]. Rendered when getBlogPost returns
// null and the page calls notFound(). HTTP 404 status comes from the
// notFound() call in the page; this template just supplies the body.
//
// Exporting metadata here overrides the layout-default title ("Richard
// Hudson | Revenue Operations Professional") that would otherwise leak
// into 404 responses — tab strips and social-share previews of bad blog
// URLs would look identical to the homepage.
export const metadata: Metadata = {
  title: '404 — Post not found',
  robots: { index: false, follow: false },
}

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-[70vh] grid place-items-center px-6 pt-24"
      >
        <div className="text-center max-w-md">
          <p aria-hidden="true" className="uppercase tracking-wide">
            404
          </p>
          <h1 className="mt-2 mb-4">Post not found</h1>
          <p className="mb-6">
            The post you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          <Link href="/blog" className="inline-block text-primary hover:underline">
            ← Browse all posts
          </Link>
        </div>
      </main>
    </div>
  )
}
