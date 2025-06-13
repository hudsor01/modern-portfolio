import React from 'react';
import { siteConfig } from '@/lib/config/site';
import { Project } from '@/types/project';

// More specific types for structured data
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
interface JsonObject extends Record<string, JsonValue> {}
interface JsonArray extends Array<JsonValue> {}

interface StructuredDataProps {
  data: JsonObject;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.email,
    ],
  };

  return <StructuredData data={data} />;
}

export function PersonStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
    jobTitle: 'Revenue Operations Professional',
    email: siteConfig.links.email || siteConfig.author.name,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.email,
    ],
  };

  return <StructuredData data={data} />;
}

export function ProjectStructuredData({ project, url }: { project: Project; url: string }) {
  const data: JsonObject = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
    },
    datePublished: project.createdAt.toISOString(),
    dateModified: (project.updatedAt || project.createdAt).toISOString(),
  };

  if (project.image) {
    data.image = project.image;
  }

  return <StructuredData data={data} />;
}

export function ArticleStructuredData({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  url,
  authorName,
}: {
  title: string;
  description: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  url: string;
  authorName?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: authorName || siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <StructuredData data={data} />;
}