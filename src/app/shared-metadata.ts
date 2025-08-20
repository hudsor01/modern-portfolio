import { Metadata } from 'next'

export const baseMetadata: Metadata = {
  metadataBase: new URL('https://richardwhudsonjr.com'),
  title: {
    default: 'Richard Hudson | Revenue Operations Professional',
    template: '%s | Richard Hudson',
  },
  description:
    'Revenue Operations Professional Richard Hudson specializes in sales automation, CRM optimization, and partnership program development across Dallas-Fort Worth metroplex. SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified. $4.8M+ revenue impact, 432% growth achieved. Available for professional opportunities in Dallas, Fort Worth, Plano, Frisco, and surrounding DFW areas.',
  keywords: [
    'revenue operations professional',
    'revenue operations specialist',
    'RevOps professional',
    'Dallas RevOps professional',
    'Fort Worth RevOps professional',
    'Plano RevOps professional',
    'Frisco RevOps professional',
    'DFW RevOps professional',
    'business optimization',
    'growth strategies',
    'sales automation',
    'CRM optimization',
    'partnership programs',
    'business intelligence',
    'marketing automation',
    'sales optimization',
    'Revenue Operations Professional Dallas',
    'RevOps Fort Worth',
    'Sales Automation Texas',
    'Partnership Specialist DFW',
    'SalesLoft Admin Certified',
    'HubSpot Revenue Operations Certified',
  ],
  authors: [{ name: 'Richard Hudson', url: 'https://richardwhudsonjr.com' }],
  creator: 'Richard Hudson',
  publisher: 'Richard Hudson',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Richard Hudson',
    title: 'Richard Hudson | Revenue Operations Professional',
    description:
      'Revenue Operations Professional Richard Hudson specializes in sales automation, CRM optimization, and partnership program development across Dallas-Fort Worth metroplex. SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified. $4.8M+ revenue impact, 432% growth achieved. Available for professional opportunities in Dallas, Fort Worth, Plano, Frisco, and surrounding DFW areas.',
    url: 'https://richardwhudsonjr.com',
    images: [
      {
        url: '/images/richard.jpg',
        width: 1200,
        height: 630,
        alt: 'Richard Hudson - Revenue Operations Professional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@richardhudson',
    title: 'Richard Hudson | Revenue Operations Professional',
    description:
      'Revenue Operations Professional Richard Hudson specializes in sales automation, CRM optimization, and partnership program development across Dallas-Fort Worth metroplex. SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified. $4.8M+ revenue impact, 432% growth achieved. Available for professional opportunities in Dallas, Fort Worth, Plano, Frisco, and surrounding DFW areas.',
    images: ['/images/richard.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://richardwhudsonjr.com',
  },
  verification: {
    google: 'google-site-verification-code-placeholder',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '152x152', type: 'image/png', rel: 'apple-touch-icon-precomposed' }
    ],
  },
  manifest: '/manifest.webmanifest', // Corrected path
}

// Function to generate page-specific metadata
export function generateMetadata(
  title: string,
  description: string,
  path: string,
  additionalMetadata: Partial<Metadata> = {}
): Metadata {
  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: `https://richardwhudsonjr.com${path}`,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: `https://richardwhudsonjr.com${path}`,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
    },
    ...additionalMetadata,
  }
}
