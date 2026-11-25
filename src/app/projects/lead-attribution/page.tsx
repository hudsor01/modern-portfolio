import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import LeadAttributionPageContent from './_components/LeadAttributionPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Marketing Attribution Platform Case Study',
  description:
    'Marketing attribution case study: multi-touch models that raised marketing ROI 34%, saved $480K a year and lifted lead-to-customer conversion 29%.',
  path: '/projects/lead-attribution',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'lead-attribution',
})

export default async function LeadAttributionPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Marketing Attribution Platform',
            url: canonicalUrl('/projects/lead-attribution'),
          },
        ]}
      />
      <LeadAttributionPageContent />
    </>
  )
}
