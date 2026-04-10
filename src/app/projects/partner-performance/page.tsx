import { Metadata } from 'next'
import PartnerPerformancePageContent from './_components/PartnerPerformancePageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Partner Performance Intelligence Dashboard',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Partner Performance Intelligence Dashboard | Richard Hudson',
  description: 'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.',
  openGraph: {
    title: 'Partner Performance Intelligence Dashboard',
    description: 'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.',
    url: 'https://richardwhudsonjr.com/projects/partner-performance',
    siteName: 'Richard Hudson',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Partner Performance Intelligence Dashboard' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partner Performance Intelligence Dashboard',
    description: 'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/partner-performance',
  },
}

export default function PartnerPerformancePage() {
  return <PartnerPerformancePageContent />
}
