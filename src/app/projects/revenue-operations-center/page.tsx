import { headers } from 'next/headers'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { siteConfig } from '@/lib/site'
import { RevOpsCenterContent } from './_components/RevOpsCenterContent'

export default async function RevenueOperationsCenter() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <>
      <ProjectJsonLd
        title="Revenue Operations Center"
        description="Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs with 96.8% forecast accuracy."
        slug="revenue-operations-center"
        category="Revenue Operations"
        tags={['Revenue Operations', 'RevOps Dashboard', 'Sales Analytics', 'Business Intelligence']}
        nonce={nonce}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Projects', url: `${siteConfig.url}/projects` },
          { name: 'Revenue Operations Center', url: `${siteConfig.url}/projects/revenue-operations-center` },
        ]}
        nonce={nonce}
      />
      <RevOpsCenterContent />
    </>
  )
}
