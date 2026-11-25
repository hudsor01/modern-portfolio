import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import CACPageContent from './_components/CACPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Customer Acquisition Cost Optimization',
  description:
    'CAC optimization case study: acquisition cost cut 32% through partner-channel and unit-economics work, with a 3.6:1 LTV:CAC ratio and 8.4-month payback.',
  path: '/projects/cac-unit-economics',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'cac-unit-economics',
})

export default async function CACUnitEconomicsPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Customer Acquisition Cost Optimization',
            url: canonicalUrl('/projects/cac-unit-economics'),
          },
        ]}
      />
      <CACPageContent />
    </>
  )
}
