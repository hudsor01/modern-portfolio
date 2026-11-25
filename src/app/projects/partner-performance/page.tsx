import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import PartnerPerformancePageContent from './_components/PartnerPerformancePageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Partner Performance Intelligence Case Study',
  description:
    'Partner performance case study: ROI-based tiering behind an 83.2% partner win rate, 63% more certified-partner revenue and a 4.7x quick ratio.',
  path: '/projects/partner-performance',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'partner-performance',
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
