import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import CommissionPageContent from './_components/CommissionPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Commission & Incentive Optimization',
  description:
    'Commission optimization case study: automated commission tracking cut weekly processing from 8.5 to 2.3 hours and disputes 68%, with 99.8% calculation accuracy.',
  path: '/projects/commission-optimization',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'commission-optimization',
})

export default async function CommissionOptimizationPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Commission & Incentive Optimization',
            url: canonicalUrl('/projects/commission-optimization'),
          },
        ]}
      />
      <CommissionPageContent />
    </>
  )
}
