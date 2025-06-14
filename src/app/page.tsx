// Removed 'use client' - this is now a Server Component
import { Metadata } from 'next'
import PageTransition from '@/components/ui/page-transition' // Corrected path
import HomePageContent from '@/components/layout/home-page-content' // Corrected path // Import the new client component
// Removed client-side imports like framer-motion and lucide-react icons as they are in HomePageContent

// Define metadata for SEO
export const metadata: Metadata = {
  title: 'Richard Hudson | Revenue Operations Consultant & Business Growth Expert',
  description:
    'Expert Revenue Operations Consultant in Dallas. Specializing in sales optimization, marketing automation, and data-driven business growth strategies. $4.8M+ revenue generated.',
  keywords: [
    'revenue operations consultant',
    'RevOps expert Dallas',
    'sales operations optimization',
    'marketing automation specialist',
    'business intelligence consulting',
    'SaaS revenue growth',
    'CRM optimization expert',
    'Salesforce consultant',
    'HubSpot implementation',
    'data analytics consulting',
    'process automation expert',
    'revenue forecasting',
    'sales pipeline optimization',
    'customer lifecycle management',
    'B2B growth strategies'
  ],
  openGraph: {
    title: 'Richard Hudson | Revenue Operations Consultant & Business Growth Expert',
    description:
      'Expert Revenue Operations Consultant in Dallas. Specializing in sales optimization, marketing automation, and data-driven business growth strategies. $4.8M+ revenue generated.',
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
      'Driving business growth through data-driven insights, process optimization, and strategic operational improvements.',
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
