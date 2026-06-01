import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import DealFunnelPageContent from './_components/DealFunnelPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Sales Pipeline Funnel Analysis - Deal Stage Optimization',
  description:
    'Interactive sales funnel dashboard showing deal progression, conversion rates, and sales cycle optimization. Tracks pipeline opportunities through each stage with real-time metrics on deal velocity and revenue forecasting.',
  path: '/projects/deal-funnel',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
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
            name: 'Sales Pipeline Funnel Analysis',
            url: canonicalUrl('/projects/deal-funnel'),
          },
        ]}
      />
      <DealFunnelPageContent />
    </>
  )
}
