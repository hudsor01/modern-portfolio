import { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import LeadAttributionPageContent from './_components/LeadAttributionPageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution | Richard Hudson',
  description: 'Comprehensive lead attribution analysis with multi-touch attribution modeling. Tracks lead sources, conversion rates, and marketing channel performance to optimize spend and improve pipeline quality.',
  openGraph: {
    title: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution',
    description: 'Comprehensive lead attribution analysis with multi-touch attribution modeling. Tracks lead sources, conversion rates, and marketing channel performance to optimize spend and improve pipeline quality.',
    url: 'https://richardwhudsonjr.com/projects/lead-attribution',
    siteName: 'Richard Hudson',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lead Attribution & Marketing Analytics - Multi-Touch Attribution',
    description: 'Comprehensive lead attribution analysis with multi-touch attribution modeling. Tracks lead sources, conversion rates, and marketing channel performance to optimize spend and improve pipeline quality.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/lead-attribution',
  },
}

export default async function LeadAttributionPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Projects', url: 'https://richardwhudsonjr.com/projects' },
          { name: 'Lead Attribution Analytics', url: 'https://richardwhudsonjr.com/projects/lead-attribution' },
        ]}
      />
      <LeadAttributionPageContent />
    </>
  )
}
