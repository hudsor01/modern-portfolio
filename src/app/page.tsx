
import { Metadata } from 'next'
import HomePageContent from '@/components/layout/home-page-content'

export const dynamic = 'force-static'

const HOMEPAGE_OG_IMAGE_URL = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
  title: 'Richard Hudson',
  subtitle: 'Revenue Operations Professional',
}).toString()}`

export const metadata: Metadata = {
  title: 'Richard Hudson | Revenue Operations Professional | Dallas-Fort Worth',
  description:
    'Richard Hudson: Revenue Operations Professional in Dallas-Fort Worth. Experienced RevOps specialist with $4.8M+ revenue impact and 432% growth delivered. Salesloft Certified Administrator & HubSpot RevOps certified. Expert in sales automation, CRM optimization, and system implementation across 10+ successful projects.',
  keywords: [
    'Richard Hudson',
    'revenue operations professional Dallas',
    'partnership program implementation',
    'Salesloft Certified Administrator',
    'Salesloft Administrator Certification',
    'HubSpot Revenue Operations certified',
    'revenue operations Dallas Fort Worth',
    'production system implementation',
    'CRM integration specialist',
    'sales automation expert',
    'revenue operations leadership',
    'partner onboarding automation',
    'commission tracking systems',
    'data analytics expertise',
    'process automation expert',
    'revenue forecasting',
    'channel program development',
    'customer lifecycle management',
    'B2B growth strategies',
    'enterprise system integration'
  ],
  openGraph: {
    title: 'Richard Hudson | Revenue Operations Professional | Dallas-Fort Worth',
    description:
      'Richard Hudson: Revenue Operations Professional in Dallas-Fort Worth. Experienced RevOps specialist with $4.8M+ revenue impact and 432% growth delivered. Salesloft Certified Administrator & HubSpot RevOps certified. Expert in sales automation and CRM optimization across 10+ successful projects.',
    url: 'https://richardwhudsonjr.com',
    siteName: 'Richard Hudson - Revenue Operations Professional',
    images: [
      {
        url: HOMEPAGE_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Richard Hudson - Revenue Operations Professional',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@hudsor01',
    title: 'Richard Hudson | Revenue Operations Professional | Dallas-Fort Worth',
    description:
      'Richard Hudson: Revenue Operations Professional in Dallas-Fort Worth. Experienced RevOps specialist with $4.8M+ revenue impact and 432% growth delivered. Salesloft Certified Administrator & HubSpot RevOps certified. Expert in sales automation and CRM optimization across 10+ successful projects.',
    images: [HOMEPAGE_OG_IMAGE_URL],
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com',
  },
}

export default function HomePage() {
  return (
    <div className="animate-fade-in-up">
      <HomePageContent />
    </div>
  )
}
