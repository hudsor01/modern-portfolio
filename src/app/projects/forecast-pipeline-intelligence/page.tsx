import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import ForecastPageContent from './_components/ForecastPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const dynamic = 'force-static'

const ogImageUrl = canonicalUrl(
  `/api/og?${new URLSearchParams({
    title: 'Forecast Accuracy & Pipeline Intelligence System',
    subtitle: 'Revenue Operations Project',
  }).toString()}`
)

export const metadata: Metadata = {
  title: 'Forecast Accuracy & Pipeline Intelligence System',
  description:
    'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
  openGraph: {
    title: 'Forecast Accuracy & Pipeline Intelligence System',
    description:
      'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
    url: canonicalUrl('/projects/forecast-pipeline-intelligence'),
    siteName: 'Richard Hudson',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Forecast Accuracy & Pipeline Intelligence System',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forecast Accuracy & Pipeline Intelligence System',
    description:
      'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: canonicalUrl('/projects/forecast-pipeline-intelligence'),
  },
}

export default async function ForecastPipelineIntelligencePage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Forecast Accuracy & Pipeline Intelligence',
            url: canonicalUrl('/projects/forecast-pipeline-intelligence'),
          },
        ]}
      />
      <ForecastPageContent />
    </>
  )
}
