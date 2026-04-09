import { headers } from 'next/headers'
import { ProjectJsonLd } from '@/components/seo/json-ld/project-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { siteConfig } from '@/lib/site'
import { CommissionContent } from './_components/CommissionContent'

export default async function CommissionOptimization() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <>
      <ProjectJsonLd
        title="Commission Optimization"
        description="Advanced commission management and partner incentive optimization platform managing $254K+ commission structures with 34% performance improvement."
        slug="commission-optimization"
        category="Revenue Operations"
        tags={['Commission Management', 'Sales Compensation', 'Incentive Design', 'Revenue Operations']}
        nonce={nonce}
      />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Projects', url: `${siteConfig.url}/projects` },
          { name: 'Commission Optimization', url: `${siteConfig.url}/projects/commission-optimization` },
        ]}
        nonce={nonce}
      />
      <CommissionContent />
    </>
  )
}
