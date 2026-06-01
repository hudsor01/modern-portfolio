import type { Metadata } from 'next'
import { canonicalUrl, SITE_ORIGIN, OG_IMAGE_SIZE, ogImageUrl } from '@/lib/absolute-url'

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

/**
 * Per-page OG card options. `ogTitle`/`subtitle`/`ogAlt` shape the dynamic
 * `/api/og` card; `ogType` switches the OpenGraph type (project case studies
 * use `'article'`); `keywords` and `additional` merge into the final object.
 */
export interface PageMetadataOptions {
  /** OG card heading. Defaults to the page `title`. */
  ogTitle?: string
  /** OG card subheading (e.g. 'Revenue Operations Project'). */
  subtitle?: string
  /** alt text for the OG image. Defaults to the page `title`. */
  ogAlt?: string
  /** OpenGraph type. Defaults to `'website'`; case studies pass `'article'`. */
  ogType?: 'website' | 'article'
  keywords?: string[]
  /** Escape hatch merged last (e.g. robots overrides). */
  additional?: Partial<Metadata>
}

/**
 * The single canonical builder for page-level metadata. Every static page
 * (and the dynamic `[slug]` routes) routes through this so siteName, OG/Twitter
 * cards, canonical URL, and image dimensions have exactly one source of truth.
 *
 * Accepts either the legacy positional form `(title, description, path,
 * additional)` or an options object `({ title, description, path, ... })`.
 */
export function generateMetadata(
  titleOrOptions:
    | string
    | ({ title: string; description: string; path: string } & PageMetadataOptions),
  description?: string,
  path?: string,
  additionalMetadata: Partial<Metadata> = {}
): Metadata {
  const opts =
    typeof titleOrOptions === 'string'
      ? {
          title: titleOrOptions,
          description: description as string,
          path: path as string,
          additional: additionalMetadata,
        }
      : titleOrOptions

  const { title, ogTitle, subtitle, ogAlt, ogType = 'website', keywords, additional } = opts
  // Root canonical is the bare origin (no trailing slash) — `canonicalUrl('/')`
  // would yield '…com/', which Search Console treats as a distinct URL.
  const pageUrl = opts.path === '/' ? SITE_ORIGIN : canonicalUrl(opts.path)
  const cardUrl = ogImageUrl({ title: ogTitle ?? title, subtitle })

  return {
    ...baseMetadata,
    title,
    description: opts.description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      type: ogType,
      title,
      description: opts.description,
      url: pageUrl,
      images: [
        {
          url: cardUrl,
          ...OG_IMAGE_SIZE,
          alt: ogAlt ?? title,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description: opts.description,
      images: [cardUrl],
    },
    ...(additional ?? {}),
  }
}
