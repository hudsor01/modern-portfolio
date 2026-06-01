import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import CLVPageContent from './_components/CLVPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Customer Lifetime Value Predictive Analytics Dashboard',
  description:
    'Advanced CLV analytics platform leveraging BTYD (Buy Till You Die) predictive modeling framework. Achieving 94.3% prediction accuracy through machine learning algorithms and real-time customer behavior tracking across 5 distinct customer segments.',
  path: '/projects/customer-lifetime-value',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
})

export default async function CustomerLifetimeValuePage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Customer Lifetime Value Analytics',
            url: canonicalUrl('/projects/customer-lifetime-value'),
          },
        ]}
      />
      <CLVPageContent />
    </>
  )
}
