import { Metadata } from 'next'
import LeadAttributionPageContent from './_components/LeadAttributionPageContent'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution | Richard Hudson',
  description: 'Comprehensive lead attribution analysis with multi-touch attribution modeling. Tracks lead sources, conversion rates, and marketing channel performance to optimize spend and improve pipeline quality.',
  openGraph: {
    title: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution',
    description: 'Comprehensive lead attribution analysis with multi-touch attribution modeling. Tracks lead sources, conversion rates, and marketing channel performance to optimize spend and improve pipeline quality.',
    url: 'https://richardwhudsonjr.com/projects/lead-attribution',
    siteName: 'Richard Hudson',
    images: [{ url: 'https://richardwhudsonjr.com/og-image.png', width: 1200, height: 630, alt: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution',
    description: 'Comprehensive lead attribution analysis with multi-touch attribution modeling. Tracks lead sources, conversion rates, and marketing channel performance to optimize spend and improve pipeline quality.',
    images: ['https://richardwhudsonjr.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/lead-attribution',
  },
}

export default function LeadAttributionPage() {
  return <LeadAttributionPageContent />
}
