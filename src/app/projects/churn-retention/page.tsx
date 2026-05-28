import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import ChurnPageContent from './_components/ChurnPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const dynamic = 'force-static'

const ogImageUrl = canonicalUrl(
  `/api/og?${new URLSearchParams({
    title: 'Customer Churn & Retention Analysis - Predictive Analytics',
    subtitle: 'Revenue Operations Project',
  }).toString()}`
)

export const metadata: Metadata = {
  title: 'Customer Churn & Retention Analysis - Predictive Analytics',
  description:
    'Advanced churn prediction and retention analysis dashboard with customer lifecycle metrics, retention heatmaps, and predictive modeling for customer success optimization.',
  openGraph: {
    title: 'Customer Churn & Retention Analysis - Predictive Analytics',
    description:
      'Advanced churn prediction and retention analysis dashboard with customer lifecycle metrics, retention heatmaps, and predictive modeling for customer success optimization.',
    url: canonicalUrl('/projects/churn-retention'),
    siteName: 'Richard Hudson',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Customer Churn & Retention Analysis - Predictive Analytics',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Churn & Retention Analysis - Predictive Analytics',
    description:
      'Advanced churn prediction and retention analysis dashboard with customer lifecycle metrics, retention heatmaps, and predictive modeling for customer success optimization.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: canonicalUrl('/projects/churn-retention'),
  },
}

export default async function ChurnRetentionPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Customer Churn & Retention Analysis',
            url: canonicalUrl('/projects/churn-retention'),
          },
        ]}
      />
      <ChurnPageContent />
    </>
  )
}
