import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import CommissionPageContent from './_components/CommissionPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Commission & Incentive Optimization System',
  description:
    'Advanced commission management and partner incentive optimization platform managing $254K+ commission structures. Automated tier adjustments with 23% average commission rate optimization and ROI-driven compensation strategy delivering 34% performance improvement and 87.5% automation efficiency.',
  path: '/projects/commission-optimization',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
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
