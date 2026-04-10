import { Metadata } from 'next'
import CommissionPageContent from './_components/CommissionPageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Commission & Incentive Optimization System',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Commission & Incentive Optimization System | Richard Hudson',
  description: 'Advanced commission management and partner incentive optimization platform managing $254K+ commission structures. Automated tier adjustments with 23% average commission rate optimization and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency.',
  openGraph: {
    title: 'Commission & Incentive Optimization System',
    description: 'Advanced commission management and partner incentive optimization platform managing $254K+ commission structures. Automated tier adjustments with 23% average commission rate optimization and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency.',
    url: 'https://richardwhudsonjr.com/projects/commission-optimization',
    siteName: 'Richard Hudson',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Commission & Incentive Optimization System' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commission & Incentive Optimization System',
    description: 'Advanced commission management and partner incentive optimization platform managing $254K+ commission structures. Automated tier adjustments with 23% average commission rate optimization and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/commission-optimization',
  },
}

export default function CommissionOptimizationPage() {
  return <CommissionPageContent />
}
