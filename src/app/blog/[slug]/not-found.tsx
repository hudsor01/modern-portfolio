import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'

// Segment-level not-found for /blog/[slug]. Rendered when getBlogPost returns
// null and the page calls notFound(). HTTP 404 status comes from the
// notFound() call in the page; this template just supplies the body.
export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="min-h-[70vh] grid place-items-center px-6 pt-24">
        <div className="text-center max-w-md">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">404</p>
          <h1 className="text-3xl font-bold mt-2 mb-4 text-foreground">Post not found</h1>
          <p className="text-muted-foreground mb-6">
            The post you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
          </p>
          <Link href="/blog" className="inline-block text-primary hover:underline">
            ← Browse all posts
          </Link>
        </div>
      </main>
    </div>
  )
}
