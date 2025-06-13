import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
 * GlobalSEO Component
 * 
 * A comprehensive SEO component that handles all meta tags, Open Graph, Twitter Cards,
 * canonical URLs, and structured data for the entire site.
 */
export function GlobalSEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  article,
  noIndex = false,
  canonicalUrl,
}: GlobalSEOProps) {
  const router = useRouter();
  
  // Construct page title
  const pageTitle = title 
    ? `${title} | ${siteConfig.name}`
    : siteConfig.name;
  
  // Use provided description or default
  const pageDescription = description || siteConfig.description;
  
  // Use provided image or default
  const pageImage = ogImage || siteConfig.ogImage;
  
  // Construct canonical URL
  const canonical = canonicalUrl || `${siteConfig.url}${router.asPath}`;
  
  // Construct keywords string
  const keywordsString = keywords?.join(', ') || '';

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
          url: `${siteConfig.url}/logo.png`,
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
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      
      {/* Robots Meta Tags */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteConfig.name} />
      
      {/* Article-specific Open Graph Tags */}
      {ogType === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags?.map((tag, index) => (
            <meta key={`tag-${index}`} property="article:tag" content={tag} />
          ))}
          {article.authors?.map((author, index) => (
            <meta key={`author-${index}`} property="article:author" content={author} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}