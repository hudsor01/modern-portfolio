import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import MultiChannelPageContent from './_components/MultiChannelPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

// Title ≤60 chars with the brand, description ≤160; one project name (the
// catalog's) across title, H1, breadcrumb and JSON-LD. Figures come from the
// write-up and are checked by project-page-copy-sourced.test.ts.
export const metadata = genMeta({
  title: 'Multi-Channel Attribution Analytics',
  description:
    'Multi-channel attribution case study: ML models across 12 channels raised ROI prediction accuracy from 67% to 92.4%, cut CAC 31% and saved $640K a year.',
  path: '/projects/multi-channel-attribution',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
  ogProject: 'multi-channel-attribution',
})

export default async function MultiChannelAttributionPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Multi-Channel Attribution Analytics',
            url: canonicalUrl('/projects/multi-channel-attribution'),
          },
        ]}
      />
      <MultiChannelPageContent />
    </>
  )
}
