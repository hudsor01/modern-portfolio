import { Metadata } from 'next'

export const baseMetadata: Metadata = {
  metadataBase: new URL('https://richardwhudsonjr.com'),
  title: {
    default: 'Richard Hudson | Revenue Operations Consultant',
    template: '%s | Richard Hudson',
  },
  description:
    'Revenue Operations Consultant Richard Hudson specializes in sales automation, CRM optimization, and data-driven growth strategies. $4.8M+ revenue generated, 432% growth achieved. Serving Dallas-Fort Worth.',
  keywords: [
    'revenue operations',
    'business consulting',
    'RevOps expert',
    'Dallas consultant',
    'business optimization',
    'growth strategy',
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
    title: 'Richard Hudson | Revenue Operations Consultant',
    description:
      'Revenue Operations Consultant Richard Hudson specializes in sales automation, CRM optimization, and data-driven growth strategies. $4.8M+ revenue generated, 432% growth achieved. Serving Dallas-Fort Worth.',
    url: 'https://richardwhudsonjr.com',
    images: [
      {
        url: '/images/richard.jpg',
        width: 1200,
        height: 630,
        alt: 'Richard Hudson - Revenue Operations Consultant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@richardhudson',
    title: 'Richard Hudson | Revenue Operations Consultant',
    description:
      'Revenue Operations Consultant Richard Hudson specializes in sales automation, CRM optimization, and data-driven growth strategies. $4.8M+ revenue generated, 432% growth achieved. Serving Dallas-Fort Worth.',
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
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
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
