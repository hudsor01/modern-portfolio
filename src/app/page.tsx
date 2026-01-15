
import { Metadata } from 'next'
import HomePageContent from '@/components/layout/home-page-content'

export const dynamic = 'force-static'
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
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&crop=face&q=80',
        width: 1200,
        height: 630,
        alt: 'Richard Hudson - Revenue Operations Professional',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <div className="animate-fade-in-up">
      <HomePageContent />
    </div>
  )
}
