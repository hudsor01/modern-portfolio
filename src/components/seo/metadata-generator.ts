import { Metadata } from 'next';
import { siteConfig } from '@/lib/config/site';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  pathname?: string;
}

/**
 * Generate comprehensive metadata for Next.js App Router
 * 
 * This function creates a complete Metadata object for use with Next.js 13+ metadata API
 */
export function generateMetadata({
  title,
  description,
  keywords,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  noIndex = false,
  pathname = '',
}: MetadataProps): Metadata {
  // Construct page title
  const pageTitle = title 
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  
  // Use provided description or default
  const pageDescription = description || siteConfig.description;
  
  // Use provided image or default
  const pageImage = image || siteConfig.ogImage;
  
  // Construct canonical URL
  const url = `${siteConfig.url}${pathname}`;

  // Base metadata
  const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords || [],
    authors: authors?.map(author => ({ name: author })) || [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: '@hudsor01',
    },
  };

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      section,
      tags,
    };
  }

  return metadata;
}