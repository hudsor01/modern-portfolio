import { headers } from 'next/headers'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { siteConfig } from '@/lib/site'
import { PartnerContent } from './_components/PartnerContent'

export default async function PartnerPerformanceIntelligence() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <>
      <ProjectJsonLd
        title="Partner Performance Analytics"
        description="Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem with real-time performance tracking."
        slug="partner-performance"
        category="Partnership Program"
        tags={['Partner Analytics', 'Channel Performance', 'Partnership Program', 'Revenue Operations']}
        nonce={nonce}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Projects', url: `${siteConfig.url}/projects` },
          { name: 'Partner Performance Analytics', url: `${siteConfig.url}/projects/partner-performance` },
        ]}
        nonce={nonce}
      />
      <PartnerContent />
    </>
  )
}
