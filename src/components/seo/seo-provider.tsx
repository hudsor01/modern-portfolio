'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { GlobalSEO } from './global-seo';
import { WebsiteStructuredData, PersonStructuredData } from './structured-data';
import { siteConfig } from '@/lib/site';

interface SEOProviderProps {
  children: React.ReactNode;
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
  const pathname = usePathname();
  const canonicalUrl = `${siteConfig.url}${pathname}`;

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
      <WebsiteStructuredData />
      <PersonStructuredData />
      {children}
    </>
  );
}