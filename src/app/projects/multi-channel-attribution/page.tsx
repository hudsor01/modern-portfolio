import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import MultiChannelPageContent from './_components/MultiChannelPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'
import { generateMetadata as genMeta } from '@/app/shared-metadata'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Multi-Channel Attribution Analytics Dashboard',
  description:
    'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.',
  path: '/projects/multi-channel-attribution',
  subtitle: 'Revenue Operations Project',
  ogType: 'article',
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
