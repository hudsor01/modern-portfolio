import { Metadata } from 'next'
import SalesEnablementPageContent from './_components/SalesEnablementPageContent'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Sales Enablement & Coaching Platform | Richard Hudson',
  description: 'Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45% across a 125-person sales organization.',
  openGraph: {
    title: 'Sales Enablement & Coaching Platform',
    description: 'Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45% across a 125-person sales organization.',
    url: 'https://richardwhudsonjr.com/projects/sales-enablement',
    siteName: 'Richard Hudson',
    images: [{ url: 'https://richardwhudsonjr.com/og-image.png', width: 1200, height: 630, alt: 'Sales Enablement & Coaching Platform' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sales Enablement & Coaching Platform',
    description: 'Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45% across a 125-person sales organization.',
    images: ['https://richardwhudsonjr.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/sales-enablement',
  },
}

export default function SalesEnablementPage() {
  return <SalesEnablementPageContent />
}
