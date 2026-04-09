import { Metadata } from 'next'
import MultiChannelPageContent from './_components/MultiChannelPageContent'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Multi-Channel Attribution Analytics Dashboard | Richard Hudson',
  description: 'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.',
  openGraph: {
    title: 'Multi-Channel Attribution Analytics Dashboard',
    description: 'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.',
    url: 'https://richardwhudsonjr.com/projects/multi-channel-attribution',
    siteName: 'Richard Hudson',
    images: [{ url: 'https://richardwhudsonjr.com/og-image.png', width: 1200, height: 630, alt: 'Multi-Channel Attribution Analytics Dashboard' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multi-Channel Attribution Analytics Dashboard',
    description: 'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.',
    images: ['https://richardwhudsonjr.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/multi-channel-attribution',
  },
}

export default function MultiChannelAttributionPage() {
  return <MultiChannelPageContent />
}
