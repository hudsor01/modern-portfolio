import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import PartnerPerformancePageContent from './_components/PartnerPerformancePageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const dynamic = 'force-static'

const ogImageUrl = canonicalUrl(
  `/api/og?${new URLSearchParams({
    title: 'Partner Performance Intelligence Dashboard',
    subtitle: 'Revenue Operations Project',
  }).toString()}`
)

export const metadata: Metadata = {
  title: 'Partner Performance Intelligence Dashboard',
  description:
    'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.',
  openGraph: {
    title: 'Partner Performance Intelligence Dashboard',
    description:
      'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.',
    url: canonicalUrl('/projects/partner-performance'),
    siteName: 'Richard Hudson',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Partner Performance Intelligence Dashboard',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partner Performance Intelligence Dashboard',
    description:
      'Strategic channel analytics and partner ROI intelligence demonstrating 83.2% win rate across multi-tier partner ecosystem. Real-time performance tracking following industry-standard 80/20 partner revenue distribution.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: canonicalUrl('/projects/partner-performance'),
  },
}

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
