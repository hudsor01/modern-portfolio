import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import SalesEnablementPageContent from './_components/SalesEnablementPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Sales Enablement Platform Case Study',
  description:
    'Sales enablement case study: structured training and real-time coaching that lifted win rates from 52% to 70% and cut new-hire ramp from 9 to 5 months.',
  path: '/projects/sales-enablement',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'sales-enablement',
})

export default async function SalesEnablementPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Sales Enablement Platform',
            url: canonicalUrl('/projects/sales-enablement'),
          },
        ]}
      />
      <SalesEnablementPageContent />
    </>
  )
}
