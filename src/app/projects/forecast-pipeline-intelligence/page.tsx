import { Metadata } from 'next'
import ForecastPageContent from './_components/ForecastPageContent'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Forecast Accuracy & Pipeline Intelligence System | Richard Hudson',
  description: 'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
  openGraph: {
    title: 'Forecast Accuracy & Pipeline Intelligence System',
    description: 'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
    url: 'https://richardwhudsonjr.com/projects/forecast-pipeline-intelligence',
    siteName: 'Richard Hudson',
    images: [{ url: 'https://richardwhudsonjr.com/og-image.png', width: 1200, height: 630, alt: 'Forecast Accuracy & Pipeline Intelligence System' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forecast Accuracy & Pipeline Intelligence System',
    description: 'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
    images: ['https://richardwhudsonjr.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/forecast-pipeline-intelligence',
  },
}

export default function ForecastPipelineIntelligencePage() {
  return <ForecastPageContent />
}
