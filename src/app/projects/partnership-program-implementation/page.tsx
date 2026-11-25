import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import PartnershipProgramPageContent from './_components/PartnershipProgramPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Partnership Program Implementation',
  description:
    'Partnership program case study: a first partner program built from scratch, onboarding 47 partners with 90%+ automation and 35% of revenue from partners.',
  path: '/projects/partnership-program-implementation',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'partnership-program-implementation',
})

export default async function PartnershipProgramImplementationPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Partnership Program Implementation',
            url: canonicalUrl('/projects/partnership-program-implementation'),
          },
        ]}
      />
      <PartnershipProgramPageContent />
    </>
  )
}
