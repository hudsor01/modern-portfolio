import { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import DealFunnelPageContent from './_components/DealFunnelPageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Sales Pipeline Funnel Analysis - Deal Stage Optimization',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Sales Pipeline Funnel Analysis - Deal Stage Optimization | Richard Hudson',
  description: 'Interactive sales funnel dashboard showing deal progression, conversion rates, and sales cycle optimization. Tracks pipeline opportunities through each stage with real-time metrics on deal velocity and revenue forecasting.',
  openGraph: {
    title: 'Sales Pipeline Funnel Analysis - Deal Stage Optimization',
    description: 'Interactive sales funnel dashboard showing deal progression, conversion rates, and sales cycle optimization. Tracks pipeline opportunities through each stage with real-time metrics on deal velocity and revenue forecasting.',
    url: 'https://richardwhudsonjr.com/projects/deal-funnel',
    siteName: 'Richard Hudson',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Sales Pipeline Funnel Analysis - Deal Stage Optimization' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sales Pipeline Funnel Analysis - Deal Stage Optimization',
    description: 'Interactive sales funnel dashboard showing deal progression, conversion rates, and sales cycle optimization. Tracks pipeline opportunities through each stage with real-time metrics on deal velocity and revenue forecasting.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/deal-funnel',
  },
}

export default async function DealFunnelPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Projects', url: 'https://richardwhudsonjr.com/projects' },
          { name: 'Deal Funnel Analysis', url: 'https://richardwhudsonjr.com/projects/deal-funnel' },
        ]}
      />
      <DealFunnelPageContent />
    </>
  )
}
