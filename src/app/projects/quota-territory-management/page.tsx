import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import QuotaTerritoryPageContent from './_components/QuotaTerritoryPageContent'

export const dynamic = 'force-static'

const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Intelligent Quota Management & Territory Planning',
  subtitle: 'Revenue Operations Project',
}).toString()}`

export const metadata: Metadata = {
  title: 'Intelligent Quota Management & Territory Planning | Richard Hudson',
  description:
    'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.',
  openGraph: {
    title: 'Intelligent Quota Management & Territory Planning',
    description:
      'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.',
    url: 'https://richardwhudsonjr.com/projects/quota-territory-management',
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
    canonical: 'https://richardwhudsonjr.com/projects/quota-territory-management',
  },
}

export default async function QuotaTerritoryManagementPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Projects', url: 'https://richardwhudsonjr.com/projects' },
          {
            name: 'Intelligent Quota Management & Territory Planning',
            url: 'https://richardwhudsonjr.com/projects/quota-territory-management',
          },
        ]}
      />
      <QuotaTerritoryPageContent />
    </>
  )
}
