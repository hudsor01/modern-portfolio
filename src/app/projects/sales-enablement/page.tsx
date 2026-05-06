import { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import SalesEnablementPageContent from './_components/SalesEnablementPageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Sales Enablement & Coaching Platform',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Sales Enablement & Coaching Platform | Richard Hudson',
  description: 'Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45% across a 125-person sales organization.',
  openGraph: {
    title: 'Sales Enablement & Coaching Platform',
    description: 'Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45% across a 125-person sales organization.',
    url: 'https://richardwhudsonjr.com/projects/sales-enablement',
    siteName: 'Richard Hudson',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Sales Enablement & Coaching Platform' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sales Enablement & Coaching Platform',
    description: 'Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45% across a 125-person sales organization.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/sales-enablement',
  },
}

export default async function SalesEnablementPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Projects', url: 'https://richardwhudsonjr.com/projects' },
          { name: 'Sales Enablement & Coaching', url: 'https://richardwhudsonjr.com/projects/sales-enablement' },
        ]}
      />
      <SalesEnablementPageContent />
    </>
  )
}
