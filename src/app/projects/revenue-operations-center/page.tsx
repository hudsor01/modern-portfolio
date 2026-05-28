import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import RevenueOpsCenterPageContent from './_components/RevenueOpsCenterPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const dynamic = 'force-static'

const ogImageUrl = canonicalUrl(
  `/api/og?${new URLSearchParams({
    title: 'Revenue Operations Command Center',
    subtitle: 'Revenue Operations Project',
  }).toString()}`
)

export const metadata: Metadata = {
  title: 'Revenue Operations Command Center',
  description:
    'Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.',
  openGraph: {
    title: 'Revenue Operations Command Center',
    description:
      'Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.',
    url: canonicalUrl('/projects/revenue-operations-center'),
    siteName: 'Richard Hudson',
    images: [
      { url: ogImageUrl, width: 1200, height: 630, alt: 'Revenue Operations Command Center' },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revenue Operations Command Center',
    description:
      'Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: canonicalUrl('/projects/revenue-operations-center'),
  },
}

export default async function RevenueOperationsCenterPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Revenue Operations Command Center',
            url: canonicalUrl('/projects/revenue-operations-center'),
          },
        ]}
      />
      <RevenueOpsCenterPageContent />
    </>
  )
}
