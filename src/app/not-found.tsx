import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'

// Override the root layout's homepage default title so 404 pages render
// "404 — Page Not Found" instead of "Richard Hudson | Revenue Operations
// Professional" (browser audit finding). robots.noindex prevents Google
// from indexing the 404 body — segment-level not-found.tsx files already
// set this; the global template did not.
export const metadata: Metadata = {
  title: '404 — Page Not Found',
  robots: { index: false, follow: false },
}

// Rendered (with HTTP 404) whenever any page or layout calls `notFound()`
// from next/navigation. The previous version called notFound() from inside
// itself, which is recursive and caused Vercel to serve the rendered HTML
// with HTTP 200 instead of 404 — Google's "Soft 404" bucket flagged dead
// /blog/[slug] URLs because of that. The template now matches the
// segment-level not-found.tsx files (Navbar + 404 body) so a global 404
// (e.g. /totally-fake-url) is visually consistent with /blog/<bad>,
// /projects/<bad>, /blog/category/<bad>.
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="min-h-[70vh] grid place-items-center px-6 pt-24">
        <div className="text-center max-w-md">
          <p aria-hidden="true" className="text-sm uppercase tracking-wide text-muted-foreground">
            404
          </p>
          <h1 className="text-3xl font-bold mt-2 mb-4 text-foreground">Page not found</h1>
          <p className="text-muted-foreground mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className="inline-block text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  )
}
