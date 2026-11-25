import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import ForecastPageContent from './_components/ForecastPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Forecast & Pipeline Intelligence Case Study',
  description:
    'Forecast and pipeline case study: predictive deal-health monitoring that raised forecast accuracy from 63% to 94% and cut deal slippage from 26% to 19%.',
  path: '/projects/forecast-pipeline-intelligence',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'forecast-pipeline-intelligence',
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
            name: 'Forecast & Pipeline Intelligence',
            url: canonicalUrl('/projects/forecast-pipeline-intelligence'),
          },
        ]}
      />
      <ForecastPageContent />
    </>
  )
}
