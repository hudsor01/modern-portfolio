import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import CLVPageContent from './_components/CLVPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Customer Lifetime Value Analytics',
  description:
    'Customer lifetime value case study: CLV models with 94.3% prediction accuracy; at-risk churn fell from 21% to 12.8% and marketing ROI rose 42%.',
  path: '/projects/customer-lifetime-value',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'customer-lifetime-value',
})

export default async function CustomerLifetimeValuePage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Customer Lifetime Value Analytics',
            url: canonicalUrl('/projects/customer-lifetime-value'),
          },
        ]}
      />
      <CLVPageContent />
    </>
  )
}
