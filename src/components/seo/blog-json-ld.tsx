/**
 * Blog JSON-LD Structured Data Components
 * Integrates with existing SEO architecture and follows Google's guidelines
 * Part of the comprehensive SEO optimization strategy
 */

import Script from 'next/script'
import { BlogPostData } from '@/types/shared-api'

/**
 * Blog Website JSON-LD Schema
 * Defines the blog as a website section with proper structured data
 */
export function BlogJsonLd() {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Richard Hudson - Revenue Operations Blog',
    description: 'Expert insights on revenue operations, data analytics, and business process optimization from Richard Hudson, a seasoned RevOps professional.',
    url: 'https://richardhudson.dev/blog',
    publisher: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: 'https://richardhudson.dev',
      sameAs: [
        'https://www.linkedin.com/in/richardhudsonjr',
        'https://github.com/richardhudson'
      ],
      jobTitle: 'Revenue Operations Professional',
      worksFor: {
        '@type': 'Organization',
        name: 'Hudson Digital Solutions'
      }
    },
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: 'https://richardhudson.dev',
      sameAs: [
        'https://www.linkedin.com/in/richardhudsonjr',
        'https://github.com/richardhudson'
      ]
    },
    inLanguage: 'en-US',
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    copyrightHolder: {
      '@type': 'Person',
      name: 'Richard Hudson'
    },
    copyrightYear: new Date().getFullYear(),
    keywords: [
      'revenue operations',
      'data analytics',
      'business intelligence',
      'sales operations',
      'process automation',
      'CRM optimization',
      'dashboard development',
      'revenue forecasting'
    ],
    about: [
      {
        '@type': 'Thing',
        name: 'Revenue Operations',
        description: 'Strategic approach to optimizing business revenue through data-driven insights and process improvements'
      },
      {
        '@type': 'Thing',
        name: 'Data Analytics',
        description: 'Analysis and interpretation of business data to drive decision-making and performance optimization'
      },
      {
        '@type': 'Thing',
        name: 'Business Intelligence',
        description: 'Technologies and strategies for analyzing business information and presenting insights'
      }
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://richardhudson.dev/blog'
    }
  }

  return (
    <Script
      id="blog-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
    />
  )
}

/**
 * Individual Blog Post JSON-LD Schema
 * Creates rich structured data for individual blog posts
 */
interface BlogPostJsonLdProps {
  post: BlogPostData
}

export function BlogPostJsonLd({ post }: BlogPostJsonLdProps) {
  const postSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: post.featuredImage ? `https://richardhudson.dev${post.featuredImage}` : undefined,
    url: `https://richardhudson.dev/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    dateCreated: post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Richard Hudson',
      url: 'https://richardhudson.dev',
      sameAs: [
        'https://www.linkedin.com/in/richardhudsonjr',
        'https://github.com/richardhudson'
      ],
      jobTitle: 'Revenue Operations Professional',
      description: post.author?.bio,
      worksFor: {
        '@type': 'Organization',
        name: 'Hudson Digital Solutions'
      }
    },
    publisher: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: 'https://richardhudson.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://richardhudson.dev/images/logo.png',
        width: 60,
        height: 60
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://richardhudson.dev/blog/${post.slug}`
    },
    articleSection: post.category?.name,
    keywords: post.keywords.join(', '),
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    copyrightHolder: {
      '@type': 'Person',
      name: 'Richard Hudson'
    },
    copyrightYear: new Date(post.createdAt).getFullYear(),
    // Add tags as keywords
    ...(post.tags && post.tags.length > 0 && {
      about: post.tags.map(tag => ({
        '@type': 'Thing',
        name: tag.name,
        description: tag.description
      }))
    }),
    // Add interaction statistics
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ReadAction',
        userInteractionCount: post.viewCount
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: post.likeCount
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ShareAction',
        userInteractionCount: post.shareCount
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: post.commentCount
      }
    ],
    // Add breadcrumb navigation
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://richardhudson.dev'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://richardhudson.dev/blog'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://richardhudson.dev/blog/${post.slug}`
        }
      ]
    }
  }

  return (
    <Script
      id="blogpost-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
    />
  )
}

/**
 * Blog Category JSON-LD Schema
 * For category pages when they're implemented
 */
interface BlogCategoryJsonLdProps {
  category: {
    name: string
    slug: string
    description?: string
    postCount: number
  }
}

export function BlogCategoryJsonLd({ category }: BlogCategoryJsonLdProps) {
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} - Richard Hudson Blog`,
    description: category.description || `Articles about ${category.name} from Richard Hudson's revenue operations blog`,
    url: `https://richardhudson.dev/blog/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      name: `${category.name} Articles`,
      description: category.description,
      numberOfItems: category.postCount
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://richardhudson.dev'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://richardhudson.dev/blog'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `https://richardhudson.dev/blog/category/${category.slug}`
        }
      ]
    }
  }

  return (
    <Script
      id="blog-category-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
    />
  )
}

/**
 * Blog FAQ JSON-LD Schema
 * For posts that contain FAQ sections
 */
interface BlogFAQJsonLdProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function BlogFAQJsonLd({ faqs }: BlogFAQJsonLdProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <Script
      id="blog-faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  )
}