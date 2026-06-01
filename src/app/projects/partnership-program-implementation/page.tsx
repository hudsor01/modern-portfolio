import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import PartnershipProgramPageContent from './_components/PartnershipProgramPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Enterprise Partnership Program Implementation',
  description:
    "Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals.",
  path: '/projects/partnership-program-implementation',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
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
            name: 'Enterprise Partnership Program Implementation',
            url: canonicalUrl('/projects/partnership-program-implementation'),
          },
        ]}
      />
      <PartnershipProgramPageContent />
    </>
  )
}
