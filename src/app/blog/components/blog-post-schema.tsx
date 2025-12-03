'use client'

import { BlogPost } from '@/types/blog'

interface BlogPostSchemaProps {
  post: BlogPost
}

export function BlogPostSchema({ post }: BlogPostSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage || '',
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.website || '',
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Richard Hudson Portfolio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&q=80',
      },
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://richardhudson.dev/blog/${post.slug}`,
    },
    wordCount: post.content?.length || 0,
    keywords: post.tags?.map(tag => 
      typeof tag === 'object' && 'name' in tag ? tag.name : String(tag)
    ).join(', ') || '',
    articleSection: post.category?.name || '',
    inLanguage: 'en-US',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}