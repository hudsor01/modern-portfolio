import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import LeadAttributionPageContent from './_components/LeadAttributionPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution',
  description:
    'Comprehensive lead attribution analysis with multi-touch attribution modeling. Tracks lead sources, conversion rates, and marketing channel performance to optimize spend and improve pipeline quality.',
  path: '/projects/lead-attribution',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
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
            name: 'Lead Attribution & Marketing Analytics',
            url: canonicalUrl('/projects/lead-attribution'),
          },
        ]}
      />
      <LeadAttributionPageContent />
    </>
  )
}
