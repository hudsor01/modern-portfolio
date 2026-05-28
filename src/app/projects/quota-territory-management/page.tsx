import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import QuotaTerritoryPageContent from './_components/QuotaTerritoryPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const dynamic = 'force-static'

const ogImageUrl = canonicalUrl(
  `/api/og?${new URLSearchParams({
    title: 'Intelligent Quota Management & Territory Planning',
    subtitle: 'Revenue Operations Project',
  }).toString()}`
)

export const metadata: Metadata = {
  title: 'Intelligent Quota Management & Territory Planning',
  description:
    'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.',
  openGraph: {
    title: 'Intelligent Quota Management & Territory Planning',
    description:
      'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.',
    url: canonicalUrl('/projects/quota-territory-management'),
    siteName: 'Richard Hudson',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Intelligent Quota Management & Territory Planning',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intelligent Quota Management & Territory Planning',
    description:
      'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.',
    images: [ogImageUrl],
  },
  alternates: {
    canonical: canonicalUrl('/projects/quota-territory-management'),
  },
}

export default async function QuotaTerritoryManagementPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Intelligent Quota Management & Territory Planning',
            url: canonicalUrl('/projects/quota-territory-management'),
          },
        ]}
      />
      <QuotaTerritoryPageContent />
    </>
  )
}
