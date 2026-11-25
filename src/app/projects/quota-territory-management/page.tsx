import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import QuotaTerritoryPageContent from './_components/QuotaTerritoryPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Quota & Territory Management Case Study',
  description:
    'Quota and territory case study: data-driven territory design raised forecast accuracy from 64% to 92% and cut quota attainment variance from 32% to 11%.',
  path: '/projects/quota-territory-management',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'quota-territory-management',
})

export default async function QuotaTerritoryManagementPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Quota & Territory Management',
            url: canonicalUrl('/projects/quota-territory-management'),
          },
        ]}
      />
      <QuotaTerritoryPageContent />
    </>
  )
}
