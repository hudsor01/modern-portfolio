import { Metadata } from 'next'

interface EnhancedMetadataOptions {
  title: string
  description: string
  keywords?: string[]
  authors?: Array<{ name: string; url?: string }>
  creator?: string
  publisher?: string
  canonical?: string
  metadataBase?: URL
  openGraph?: Metadata['openGraph']
  twitter?: Metadata['twitter']
  robots?: Metadata['robots']
  alternates?: Metadata['alternates']
  verification?: Metadata['verification']
  archives?: string[]
  assets?: string[]
  bookmarks?: string[]
  category?: string
  formatDetection?: Metadata['formatDetection']
  itunes?: Metadata['itunes']
  referrer?: Metadata['referrer']
  manifest?: string
  themeColor?: string
  colorScheme?: Metadata['colorScheme']
}

/**
 * Creates enhanced metadata for better SEO
 */
export function createEnhancedMetadata(options: EnhancedMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords,
    authors,
    creator,
    publisher,
    canonical,
    metadataBase,
    openGraph,
    twitter,
    robots,
    alternates,
    verification,
    archives,
    assets,
    bookmarks,
    category,
    formatDetection,
    itunes,
    manifest,
    themeColor,
    colorScheme,
    referrer,
  } = options

  const metadata: Metadata = {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(authors ? { authors } : {}),
    ...(creator ? { creator } : {}),
    ...(publisher ? { publisher } : {}),
    ...(metadataBase ? { metadataBase } : {}),
    ...(openGraph ? { openGraph } : {}),
    ...(twitter ? { twitter } : {}),
    ...(robots ? { robots } : {}),
    ...(alternates
      ? { alternates: { ...alternates, canonical: alternates.canonical || canonical } }
      : canonical
      ? { alternates: { canonical } }
      : {}),
    ...(verification ? { verification } : {}),
    ...(archives ? { archives } : {}),
    ...(assets ? { assets } : {}),
    ...(bookmarks ? { bookmarks } : {}),
    ...(category ? { category } : {}),
    ...(formatDetection ? { formatDetection } : {}),
    ...(itunes ? { itunes } : {}),
    ...(manifest ? { manifest } : {}),
    ...(themeColor ? { themeColor } : {}),
    ...(colorScheme ? { colorScheme } : {}),
    ...(referrer ? { referrer } : {}),
  }

  return metadata
}
