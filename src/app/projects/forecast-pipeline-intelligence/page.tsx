import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import ForecastPageContent from './_components/ForecastPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Forecast Accuracy & Pipeline Intelligence System',
  description:
    'Enterprise forecasting and pipeline intelligence platform combining predictive analytics, deal health monitoring, and early warning systems. Improved forecast accuracy by 31% and reduced slippage by 26%.',
  path: '/projects/forecast-pipeline-intelligence',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
})

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
