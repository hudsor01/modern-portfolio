import { headers } from 'next/headers'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { siteConfig } from '@/lib/site'
import { CACContent } from './_components/CACContent'

export default async function CACUnitEconomics() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <>
      <ProjectJsonLd
        title="CAC & Unit Economics Analysis"
        description="Comprehensive CAC analysis and LTV:CAC ratio optimization that achieved 32% cost reduction through strategic partner channel optimization."
        slug="cac-unit-economics"
        category="Data Analytics"
        tags={['Customer Acquisition Cost', 'Unit Economics', 'LTV:CAC Ratio', 'Revenue Operations']}
        nonce={nonce}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Projects', url: `${siteConfig.url}/projects` },
          { name: 'CAC & Unit Economics Analysis', url: `${siteConfig.url}/projects/cac-unit-economics` },
        ]}
        nonce={nonce}
      />
      <CACContent />
    </>
  )
}
