import type { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/app/shared-metadata'
import ResumeViewClient from './resume-view-client'
import { canonicalUrl } from '@/lib/absolute-url'

// Duplicate-content guard. /resume is the canonical resume URL; /resume/view
// is a viewer surface that should not be indexed independently, so it is
// noindex. Its canonical stays self: Google advises against pairing noindex
// with a canonical to another URL (conflicting signals; the noindex can carry
// over to the target). genMeta() keeps OG/Twitter cards for shared links.
export const metadata: Metadata = {
  ...genMeta(
    'Resume PDF',
    'View the resume of Richard Hudson, Revenue Operations Professional.',
    '/resume/view'
  ),
  alternates: { canonical: canonicalUrl('/resume/view') },
  robots: { index: false, follow: true },
}

// Nothing here varies per request; the root layout's header read would
// otherwise render it on every hit.
export const dynamic = 'force-static'

export default function ResumeViewPage() {
  return <ResumeViewClient />
}
