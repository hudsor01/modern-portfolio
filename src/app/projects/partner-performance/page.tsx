import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import PartnerPerformancePageContent from './_components/PartnerPerformancePageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Partner Performance Intelligence Dashboard',
  description:
    'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.',
  path: '/projects/partner-performance',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
})

export default async function PartnerPerformancePage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Partner Performance Intelligence',
            url: canonicalUrl('/projects/partner-performance'),
          },
        ]}
      />
      <PartnerPerformancePageContent />
    </>
  )
}
