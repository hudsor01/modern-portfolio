import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { NotFoundEvent } from '@/components/analytics/not-found-event'

// Segment-level not-found for /projects/[slug]. Rendered when getProject
// returns null and the page calls notFound(). HTTP 404 status comes from
// the notFound() call in the page; this template just supplies the body.
// Metadata export prevents the layout default title from leaking into
// 404 responses.
export const metadata: Metadata = {
  title: '404 — Project not found',
  robots: { index: false, follow: false },
}

export default function ProjectNotFound() {
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
          <h1 className="mt-2 mb-4">Project not found</h1>
          <p className="mb-6">
            The project you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          <Link
            data-track="CTA Click"
            data-track-location="not-found"
            href="/projects"
            className="inline-block text-primary hover:underline"
          >
            ← Browse all projects
          </Link>
        </div>
        <NotFoundEvent kind="project" />
      </main>
    </div>
  )
}
