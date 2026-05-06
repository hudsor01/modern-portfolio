import type { Metadata } from 'next'
import ResumeViewClient from './resume-view-client'

// Duplicate-content guard. /resume is the canonical resume URL; /resume/view
// is a viewer surface that should not be indexed independently.
export const metadata: Metadata = {
  title: 'Resume PDF | Richard Hudson',
  description: 'View the resume of Richard Hudson, Revenue Operations Professional.',
  alternates: { canonical: 'https://richardwhudsonjr.com/resume' },
  robots: { index: false, follow: true },
}

export const dynamic = 'force-dynamic'

export default function ResumeViewPage() {
  return <ResumeViewClient />
}
