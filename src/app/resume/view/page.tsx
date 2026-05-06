import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/app/shared-metadata'
import ResumeViewClient from './resume-view-client'

// Duplicate-content guard. /resume is the canonical resume URL; /resume/view
// is a viewer surface that should not be indexed independently. Build on
// generateMetadata() so OG/Twitter cards still render for shared links —
// just override canonical (→ /resume) and robots (noindex).
export const metadata: Metadata = {
  ...genMeta(
    'Resume PDF | Richard Hudson',
    'View the resume of Richard Hudson, Revenue Operations Professional.',
    '/resume/view'
  ),
  alternates: { canonical: 'https://richardwhudsonjr.com/resume' },
  robots: { index: false, follow: true },
}

export const dynamic = 'force-dynamic'

export default function ResumeViewPage() {
  return <ResumeViewClient />
}
