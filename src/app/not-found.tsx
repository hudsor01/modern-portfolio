import Link from 'next/link'

// This template is rendered (with HTTP 404) whenever any page or layout calls
// `notFound()` from next/navigation. The previous version called notFound()
// from within itself, which is recursive and caused Vercel to serve the
// rendered HTML with HTTP 200 instead of 404 — Google's "Soft 404" bucket
// flagged dead /blog/[slug] URLs because of that.
export default function NotFound() {
  return (
    <main id="main-content" className="min-h-[70vh] grid place-items-center px-6">
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
  )
}
