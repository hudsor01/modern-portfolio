import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import RevenueOpsCenterPageContent from './_components/RevenueOpsCenterPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Revenue Operations Center Case Study',
  description:
    'Revenue operations center case study: unified pipeline and partner KPIs that raised forecast accuracy from 74% to 96.8% and cut manual reporting 78%.',
  path: '/projects/revenue-operations-center',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'revenue-operations-center',
})

export default async function RevenueOperationsCenterPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Revenue Operations Center',
            url: canonicalUrl('/projects/revenue-operations-center'),
          },
        ]}
      />
      <RevenueOpsCenterPageContent />
    </>
  )
}
