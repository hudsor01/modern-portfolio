import type { Metadata } from 'next'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: 'Richard Hudson | Revenue Operations Professional',
    template: '%s | Richard Hudson',
  },
  description:
    'Revenue Operations Professional in Dallas-Fort Worth. SalesLoft Admin (L1/L2) and HubSpot RevOps certified. $4.8M+ revenue impact across 10+ projects.',
  keywords: [
    'revenue operations professional',
    'revenue operations specialist',
    'RevOps professional',
    'Dallas RevOps professional',
    'Fort Worth RevOps professional',
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
  authors: [{ name: 'Richard Hudson', url: SITE_ORIGIN }],
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
      'Revenue Operations Professional in Dallas-Fort Worth. SalesLoft Admin (L1/L2) and HubSpot RevOps certified. $4.8M+ revenue impact across 10+ projects.',
    url: SITE_ORIGIN,
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
    creator: '@hudsor01',
    title: 'Richard Hudson | Revenue Operations Professional',
    description:
      'Revenue Operations Professional in Dallas-Fort Worth. SalesLoft Admin (L1/L2) and HubSpot RevOps certified. $4.8M+ revenue impact across 10+ projects.',
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
  // No site-wide `alternates.canonical` here on purpose. A cascading canonical
  // in root metadata makes any page that omits its own canonical silently point
  // at the homepage — a duplicate-content footgun (it's exactly what made every
  // page on the sister site canonicalize to its homepage). Every route sets its
  // own canonical; a page without one correctly self-canonicalizes via Google.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      {
        url: '/apple-touch-icon.png',
        sizes: '152x152',
        type: 'image/png',
        rel: 'apple-touch-icon-precomposed',
      },
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
  const ogImageUrl = canonicalUrl(`/api/og?${new URLSearchParams({ title }).toString()}`)
  const pageUrl = canonicalUrl(path)
  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [ogImageUrl],
    },
    ...additionalMetadata,
  }
}
