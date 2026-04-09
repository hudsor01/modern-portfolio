import { headers } from 'next/headers'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { siteConfig } from '@/lib/site'
import { AttributionContent } from './_components/AttributionContent'

export default async function MultiChannelAttribution() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <>
      <ProjectJsonLd
        title="Multi-Channel Attribution"
        description="Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints with 92.4% attribution accuracy."
        slug="multi-channel-attribution"
        category="Data Analytics"
        tags={['Marketing Attribution', 'Multi-Channel Analytics', 'Revenue Attribution', 'Data Analytics']}
        nonce={nonce}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Projects', url: `${siteConfig.url}/projects` },
          { name: 'Multi-Channel Attribution', url: `${siteConfig.url}/projects/multi-channel-attribution` },
        ]}
        nonce={nonce}
      />
      <AttributionContent />
    </>
  )
}
