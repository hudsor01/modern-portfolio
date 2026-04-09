import { Metadata } from 'next'
import QuotaTerritoryPageContent from './_components/QuotaTerritoryPageContent'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Intelligent Quota Management & Territory Planning | Richard Hudson',
  description: 'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.',
  openGraph: {
    title: 'Intelligent Quota Management & Territory Planning',
    description: 'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.',
    url: 'https://richardwhudsonjr.com/projects/quota-territory-management',
    siteName: 'Richard Hudson',
    images: [{ url: 'https://richardwhudsonjr.com/og-image.png', width: 1200, height: 630, alt: 'Intelligent Quota Management & Territory Planning' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intelligent Quota Management & Territory Planning',
    description: 'Advanced quota setting and territory assignment system using predictive analytics and fairness algorithms. Optimized territory design increased forecast accuracy by 28% and reduced quota attainment variance by 32%.',
    images: ['https://richardwhudsonjr.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com/projects/quota-territory-management',
  },
}

export default function QuotaTerritoryManagementPage() {
  return <QuotaTerritoryPageContent />
}
