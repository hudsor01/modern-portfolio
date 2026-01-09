// Removed 'use client' - this is now a Server Component
import { Metadata } from 'next'
import HomePageContent from '@/components/layout/home-page-content' // Corrected path // Import the new client component
// Removed client-side imports like framer-motion and lucide-react icons as they are in HomePageContent

// Define metadata for SEO
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
  twitter: {
    card: 'summary_large_image',
    title: 'Richard Hudson - Revenue Operations Professional',
    description:
      'Revenue Operations Professional & Strategic Partnership Specialist. Salesloft Certified Administrator & HubSpot RevOps certified. $4.8M+ revenue impact and 432% growth delivered across 10+ successful projects.',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&crop=face&q=80'],
  },
}

export default function HomePage() {
  return (
    <div className="animate-fade-in-up">
      <HomePageContent />
    </div>
  )
}

// Note for animations (relevant to home-page-content.tsx):
// Ensure you have keyframes for 'animate-blob' in your global CSS or Tailwind config.
// Example for globals.css or a dedicated animation CSS file:
/*
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}
*/
