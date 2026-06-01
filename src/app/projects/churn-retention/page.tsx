import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import ChurnPageContent from './_components/ChurnPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Customer Churn & Retention Analysis - Predictive Analytics',
  description:
    'Advanced churn prediction and retention analysis dashboard with customer lifecycle metrics, retention heatmaps, and predictive modeling for customer success optimization.',
  path: '/projects/churn-retention',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
})

export default async function ChurnRetentionPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Customer Churn & Retention Analysis',
            url: canonicalUrl('/projects/churn-retention'),
          },
        ]}
      />
      <ChurnPageContent />
    </>
  )
}
