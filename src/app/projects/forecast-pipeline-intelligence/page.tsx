import { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import ForecastPageContent from './_components/ForecastPageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Forecast Accuracy & Pipeline Intelligence System',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Forecast Accuracy & Pipeline Intelligence System | Richard Hudson',
  description: 'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
  openGraph: {
    title: 'Forecast Accuracy & Pipeline Intelligence System',
    description: 'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
    url: 'https://richardwhudsonjr.com/projects/forecast-pipeline-intelligence',
    siteName: 'Richard Hudson',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Forecast Accuracy & Pipeline Intelligence System' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forecast Accuracy & Pipeline Intelligence System',
    description: 'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/forecast-pipeline-intelligence',
  },
}

export default async function ForecastPipelineIntelligencePage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Projects', url: 'https://richardwhudsonjr.com/projects' },
          { name: 'Forecast Accuracy & Pipeline Intelligence', url: 'https://richardwhudsonjr.com/projects/forecast-pipeline-intelligence' },
        ]}
      />
      <ForecastPageContent />
    </>
  )
}
