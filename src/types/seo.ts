/**
 * SEO Types
 * Contains all SEO-related interfaces consolidated from across the application
 */

import { Metadata } from 'next';

/**
 * Basic metadata for pages
 */
export interface MetaData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

/**
 * Site configuration for SEO
 */
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  author: {
    name: string;
    email: string;
  };
}

/**
 * Meta configuration for generating meta tags
 */
export interface MetaConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  section?: string;
}

/**
 * Enhanced metadata options for Next.js
 */
export interface EnhancedMetadataOptions extends Partial<Metadata> {
  title?: string | { absolute: string } | { template: string; default: string };
  description?: string;
  keywords?: string | string[];
  authors?: { name: string; url?: string }[];
  creator?: string;
  publisher?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    images?: { url: string; width?: number; height?: number; alt?: string }[];
    locale?: string;
    type?: string;
    determiner?: "" | "an" | "a" | "the" | "auto";
    audio?: { url: string; secureUrl?: string; type?: string }[];
    video?: { url: string; secureUrl?: string; type?: string; width?: number; height?: number }[];
    phoneNumbers?: string[];
    emails?: string[];
    countryName?: string;
    postalCode?: string;
    streetAddress?: string;
    publishedTime?: string;
    modifiedTime?: string;
    expirationTime?: string;
    section?: string;
    tags?: string[];
  };
  twitter?: {
    title?: string;
    description?: string;
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    images?: string[];
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    nocache?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
      noimageindex?: boolean;
      'max-video-preview'?: number | string;
      'max-image-preview'?: 'none' | 'standard' | 'large';
      'max-snippet'?: number;
    };
  };
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
    media?: Record<string, string>;
    types?: Record<string, string>;
  };
  verification?: {
    google?: string | string[];
    yandex?: string | string[];
    yahoo?: string | string[];
    other?: Record<string, string | string[]>;
  };
  appLinks?: {
    ios?: {
      url: string;
      app_store_id?: string;
      app_name?: string;
    }[];
    android?: {
      package: string;  // Made required
      app_name?: string;
      url?: string;
    }[];
    web?: {
      url: string;
      should_fallback?: boolean;
    }[];
  };
  archives?: string[];
  assets?: string[];
  bookmarks?: string[];
  category?: string;
  formatDetection?: {
    telephone?: boolean;
    date?: boolean;
    address?: boolean;
    email?: boolean;
    url?: boolean;
  };
  itunes?: {
    appId: string;
    appArgument?: string;
  };
  referrer?: 'no-referrer' | 'origin' | 'no-referrer-when-downgrade' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin';
  manifest?: string;
  themeColor?: string | { media: string; color: string }[];
  colorScheme?: 'normal' | 'light' | 'dark' | 'light dark' | 'dark light' | null;
}

/**
 * SEO score for content analysis
 */
export interface SEOScore {
  title: number;
  description: number;
  keywords: number;
  content: number;
  overall: number;
}

/**
 * SEO suggestion for content improvement
 */
export interface SEOSuggestion {
  type: 'title' | 'description' | 'keywords' | 'content';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Keyword ranking data
 */
export interface KeywordRanking {
  keyword: string;
  position: number;
  change: number;
  volume: number;
  difficulty: number;
}