import { headers } from 'next/headers'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { siteConfig } from '@/lib/site'
import { CLVContent } from './_components/CLVContent'

export default async function CustomerLifetimeValueAnalytics() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <>
      <ProjectJsonLd
        title="Customer Lifetime Value Analysis"
        description="Advanced CLV analytics platform leveraging BTYD predictive modeling framework with 94.3% prediction accuracy across 5 customer segments."
        slug="customer-lifetime-value"
        category="Data Analytics"
        tags={['Customer Lifetime Value', 'CLV', 'Retention Analytics', 'Revenue Operations']}
        nonce={nonce}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Projects', url: `${siteConfig.url}/projects` },
          { name: 'Customer Lifetime Value Analysis', url: `${siteConfig.url}/projects/customer-lifetime-value` },
        ]}
        nonce={nonce}
      />
      <CLVContent />
    </>
  )
}
