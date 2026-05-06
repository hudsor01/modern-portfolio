import type { Metadata } from 'next'
import RevenueOpsCenterPageContent from './_components/RevenueOpsCenterPageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Revenue Operations Command Center',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Revenue Operations Command Center | Richard Hudson',
  description:
    'Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.',
  openGraph: {
    title: 'Revenue Operations Command Center',
    description:
      'Comprehensive revenue operations dashboard consolidating pipeline health, forecasting accuracy, partner performance, and operational KPIs. Real-time insights with 96.8% forecast accuracy and 89.7% operational efficiency across sales, marketing, and partner channels.',
    url: 'https://richardwhudsonjr.com/projects/revenue-operations-center',
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
    canonical: 'https://richardwhudsonjr.com/projects/revenue-operations-center',
  },
}

export default function RevenueOperationsCenterPage() {
  return <RevenueOpsCenterPageContent />
}
