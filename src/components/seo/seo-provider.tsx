'use client'

import type React from 'react'
import { usePathname } from 'next/navigation'
import { GlobalSEO } from './global-seo'
import { canonicalUrl as buildCanonicalUrl } from '@/lib/absolute-url'

interface SEOProviderProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: 'website' | 'article'
  article?: {
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    section?: string
    tags?: string[]
  }
  noIndex?: boolean
}

/**
 * SEO Provider Component
 *
 * A wrapper component that provides SEO metadata and structured data
 * for all pages in the application.
 */
export function SEOProvider({
  children,
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  article,
  noIndex = false,
}: SEOProviderProps) {
  const pathname = usePathname()
  // Pin canonical to prod even on preview deploys — Search Console
  // expects the production URL in `<link rel=canonical>`.
  const canonicalUrl = buildCanonicalUrl(pathname)

  return (
    <>
      <GlobalSEO
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogType={ogType}
        article={article}
        noIndex={noIndex}
        canonicalUrl={canonicalUrl}
      />
      {children}
    </>
  )
}
