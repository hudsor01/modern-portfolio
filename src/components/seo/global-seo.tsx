'use client'

import React from 'react';
import { siteConfig } from '@/lib/config/site';

interface GlobalSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
  };
  noIndex?: boolean;
  canonicalUrl?: string;
}

/**
 * GlobalSEO Component (App Router)
 *
 * Provides structured data and SEO utilities for the application.
 *
 * NOTE: In Next.js 15 App Router, meta tags should be set via the metadata API
 * in layout.ts or generateMetadata() functions, not from client components.
 * This component now focuses on structured data and SEO utilities.
 *
 * For per-page metadata, use the generateMetadata() function from
 * src/app/shared-metadata.ts in your route's layout.ts or page.ts.
 */
export function GlobalSEO({
  title,
  description,
  keywords: _keywords,
  ogImage,
  ogType = 'website',
  article,
  noIndex: _noIndex = false,
  canonicalUrl: _canonicalUrl,
}: GlobalSEOProps) {
  // Use provided description or default
  const pageDescription = description || siteConfig.description;

  // Use provided image or default
  const pageImage = ogImage || siteConfig.ogImage;

  // JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ogType === 'article' ? 'Article' : 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    ...(ogType === 'article' && article ? {
      headline: title,
      image: pageImage,
      datePublished: article.publishedTime,
      dateModified: article.modifiedTime || article.publishedTime,
      author: article.authors?.map(author => ({
        '@type': 'Person',
        name: author,
      })) || [{ '@type': 'Person', name: siteConfig.author.name }],
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        logo: {
          '@type': 'ImageObject',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&q=80',
        },
      },
    } : {
      description: pageDescription,
      author: {
        '@type': 'Person',
        name: siteConfig.author.name,
      },
    }),
  };

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}