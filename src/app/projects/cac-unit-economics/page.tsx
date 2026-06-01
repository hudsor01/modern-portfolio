import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import CACPageContent from './_components/CACPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Customer Acquisition Cost Optimization & Unit Economics Dashboard',
  description:
    'Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization. Industry-benchmark 3.6:1 efficiency ratio with 8.4-month payback period across multi-tier SaaS products.',
  path: '/projects/cac-unit-economics',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
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
            name: 'CAC Optimization & Unit Economics',
            url: canonicalUrl('/projects/cac-unit-economics'),
          },
        ]}
      />
      <CACPageContent />
    </>
  )
}
