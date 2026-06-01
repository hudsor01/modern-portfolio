import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import RevenueOpsCenterPageContent from './_components/RevenueOpsCenterPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Revenue Operations Command Center',
  description:
    'Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.',
  path: '/projects/revenue-operations-center',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
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
            name: 'Revenue Operations Command Center',
            url: canonicalUrl('/projects/revenue-operations-center'),
          },
        ]}
      />
      <RevenueOpsCenterPageContent />
    </>
  )
}
