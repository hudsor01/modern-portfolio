// Removed 'use client' - this is now a Server Component
import { Metadata } from 'next'
import PageTransition from '@/components/ui/page-transition' // Corrected path
import HomePageContent from '@/components/layout/home-page-content' // Corrected path // Import the new client component
// Removed client-side imports like framer-motion and lucide-react icons as they are in HomePageContent

// Define metadata for SEO
export const metadata: Metadata = {
  title: 'Richard Hudson | Revenue Operations Consultant & Business Growth Expert',
  description:
    'Richard Hudson: Revenue Operations Consultant and Partnership Program Developer in Dallas-Fort Worth. SalesLoft Admin certified (Level 1 & 2) & HubSpot RevOps certified. Expert in sales automation, CRM optimization, and production system implementation. $4.8M+ revenue generated across 11+ projects including first-ever partnership program implementation.',
  keywords: [
    'Richard Hudson',
    'revenue operations consultant Dallas',
    'partnership program implementation',
    'SalesLoft Admin Level 1 certified',
    'SalesLoft Admin Level 2 certified',
    'HubSpot Revenue Operations certified',
    'RevOps expert Dallas Fort Worth',
    'production system implementation',
    'CRM integration specialist',
    'sales automation expert',
    'business intelligence consulting',
    'partner onboarding automation',
    'commission tracking systems',
    'data analytics consulting',
    'process automation expert',
    'revenue forecasting',
    'channel program development',
    'customer lifecycle management',
    'B2B growth strategies',
    'enterprise system integration'
  ],
  openGraph: {
    title: 'Richard Hudson | Revenue Operations Consultant & Business Growth Expert',
    description:
      'Richard Hudson: Revenue Operations Consultant and Partnership Program Developer in Dallas-Fort Worth. SalesLoft Admin certified (Level 1 & 2) & HubSpot RevOps certified. Expert in sales automation, CRM optimization, and production system implementation. $4.8M+ revenue generated across 11+ projects.',
    url: 'https://richardwhudsonjr.com',
    siteName: 'Richard Hudson - RevOps Consultant',
    images: [
      {
        url: 'https://richardwhudsonjr.com/images/richard-og.jpg', // Placeholder, ensure this image exists
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
      'Revenue Operations Consultant & Partnership Program Developer. SalesLoft Admin certified (Level 1 & 2) & HubSpot RevOps certified. $4.8M+ revenue generated across 11+ projects.',
    images: ['https://richardwhudsonjr.com/images/richard-twitter.jpg'], // Placeholder
  },
}

export default function HomePage() {
  return (
    <PageTransition>
      <HomePageContent />
    </PageTransition>
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
