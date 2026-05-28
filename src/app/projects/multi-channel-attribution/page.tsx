import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import MultiChannelPageContent from './_components/MultiChannelPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const dynamic = 'force-static'

const ogImageUrl = canonicalUrl(
  `/api/og?${new URLSearchParams({
    title: 'Multi-Channel Attribution Analytics Dashboard',
    subtitle: 'Revenue Operations Project',
  }).toString()}`
)

export const metadata: Metadata = {
  title: 'Multi-Channel Attribution Analytics Dashboard',
  description:
    'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.',
  openGraph: {
    title: 'Multi-Channel Attribution Analytics Dashboard',
    description:
      'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.',
    url: canonicalUrl('/projects/multi-channel-attribution'),
    siteName: 'Richard Hudson',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Multi-Channel Attribution Analytics Dashboard',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multi-Channel Attribution Analytics Dashboard',
    description:
      'Advanced marketing attribution analytics platform using machine learning models to track customer journeys across 12+ touchpoints. Delivering 92.4% attribution accuracy and $2.3M ROI optimization through data-driven attribution modeling and cross-channel insights.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: canonicalUrl('/projects/multi-channel-attribution'),
  },
}

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
