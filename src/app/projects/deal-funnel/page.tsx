import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import DealFunnelPageContent from './_components/DealFunnelPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one name for the project
// (the catalog's "Sales Funnel Optimization") across title, H1 and JSON-LD.
// Figures are from the write-up and checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Sales Funnel Optimization Case Study',
  description:
    'Sales funnel case study: stage-level pipeline analytics that improved conversion 27%, cut the sales cycle by 31 days and raised forecast accuracy to 89%.',
  path: '/projects/deal-funnel',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'deal-funnel',
})

export default async function DealFunnelPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Sales Funnel Optimization',
            url: canonicalUrl('/projects/deal-funnel'),
          },
        ]}
      />
      <DealFunnelPageContent />
    </>
  )
}
