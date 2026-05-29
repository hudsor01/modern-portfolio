/**
 * Blog JSON-LD Structured Data Components
 * Integrates with existing SEO architecture and follows Google's guidelines
 * Part of the comprehensive SEO optimization strategy
 */

import type { BlogPostData } from '@/types/api'
import { JsonLdScript } from '@/components/seo/json-ld-script'
import { SITE_ORIGIN } from '@/lib/absolute-url'
import { safeFeaturedImageUrl } from '@/lib/featured-image-url'

/**
 * Blog Website JSON-LD Schema
 * Defines the blog as a website section with proper structured data
 */
export function BlogJsonLd({ nonce }: { nonce?: string | null } = {}) {
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Richard Hudson - Revenue Operations Blog',
    description:
      'Expert insights on revenue operations, data analytics, and business process optimization from Richard Hudson, a seasoned RevOps professional.',
    url: `${SITE_ORIGIN}/blog`,
    publisher: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: SITE_ORIGIN,
      sameAs: ['https://www.linkedin.com/in/hudsor01', 'https://github.com/hudsor01'],
      jobTitle: 'Revenue Operations Professional',
      worksFor: {
        '@type': 'Organization',
        name: 'Hudson Digital Solutions',
      },
    },
    author: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: SITE_ORIGIN,
      sameAs: ['https://www.linkedin.com/in/hudsor01', 'https://github.com/hudsor01'],
    },
    inLanguage: 'en-US',
    copyrightHolder: {
      '@type': 'Person',
      name: 'Richard Hudson',
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
      'revenue forecasting',
    ],
    about: [
      {
        '@type': 'Thing',
        name: 'Revenue Operations',
        description:
          'Strategic approach to optimizing business revenue through data-driven insights and process improvements',
      },
      {
        '@type': 'Thing',
        name: 'Data Analytics',
        description:
          'Analysis and interpretation of business data to drive decision-making and performance optimization',
      },
      {
        '@type': 'Thing',
        name: 'Business Intelligence',
        description:
          'Technologies and strategies for analyzing business information and presenting insights',
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_ORIGIN}/blog`,
    },
  }

  return <JsonLdScript json={blogSchema} nonce={nonce} />
}

/**
 * Individual Blog Post JSON-LD Schema
 * Creates rich structured data for individual blog posts
 */
interface BlogPostJsonLdProps {
  post: BlogPostData
}

export function BlogPostJsonLd({ post, nonce }: BlogPostJsonLdProps & { nonce?: string | null }) {
  const postSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    // safeFeaturedImageUrl re-validates at read time so a legacy or
    // imported row with a bad value (`//evil.com/x`, traversal token,
    // off-allowlist host) doesn't ship verbatim into Google's
    // structured-data validator. Bad values fall back to the branded
    // /api/og card — JSON-LD always needs an image (BlogPosting
    // schema requires it), unlike the sitemap which omits <image:loc>
    // for the fallback case. Sitemap aggregates the bad-row signal
    // once per build; this surface isn't separately logged because
    // every BlogPostJsonLd render is also covered by the sitemap log
    // for the same post (and JSON-LD renders happen on every blog
    // page render, which would amplify the same signal N×).
    image: safeFeaturedImageUrl(post.featuredImage, {
      title: post.title,
      subtitle: 'Blog Post',
    }).url,
    url: `${SITE_ORIGIN}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    dateCreated: post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Richard Hudson',
      url: SITE_ORIGIN,
      sameAs: ['https://www.linkedin.com/in/hudsor01', 'https://github.com/hudsor01'],
      jobTitle: 'Revenue Operations Professional',
      description: post.author?.bio,
      worksFor: {
        '@type': 'Organization',
        name: 'Hudson Digital Solutions',
      },
    },
    publisher: {
      '@type': 'Person',
      name: 'Richard Hudson',
      url: SITE_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/images/richard.jpg`,
        width: 739,
        height: 739,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_ORIGIN}/blog/${post.slug}`,
    },
    articleSection: post.category?.name,
    keywords: post.keywords.join(', '),
    wordCount: post.wordCount,
    timeRequired: post.readingTime != null ? `PT${post.readingTime}M` : undefined,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    copyrightHolder: {
      '@type': 'Person',
      name: 'Richard Hudson',
    },
    copyrightYear: new Date(post.createdAt).getFullYear(),
    // Add tags as keywords
    ...(post.tags &&
      post.tags.length > 0 && {
        about: post.tags.map((tag) => ({
          '@type': 'Thing',
          name: tag.name,
          description: tag.description,
        })),
      }),
    // Add interaction statistics
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ReadAction',
        userInteractionCount: post.viewCount,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: post.likeCount,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ShareAction',
        userInteractionCount: post.shareCount,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: post.commentCount,
      },
    ],
    // Add breadcrumb navigation
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_ORIGIN,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${SITE_ORIGIN}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `${SITE_ORIGIN}/blog/${post.slug}`,
        },
      ],
    },
  }

  return <JsonLdScript json={postSchema} nonce={nonce} />
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

export function BlogCategoryJsonLd({
  category,
  nonce,
}: BlogCategoryJsonLdProps & { nonce?: string | null }) {
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} - Richard Hudson Blog`,
    description:
      category.description ||
      `Articles about ${category.name} from Richard Hudson's revenue operations blog`,
    url: `${SITE_ORIGIN}/blog/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      name: `${category.name} Articles`,
      description: category.description,
      numberOfItems: category.postCount,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_ORIGIN,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${SITE_ORIGIN}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `${SITE_ORIGIN}/blog/category/${category.slug}`,
        },
      ],
    },
  }

  return <JsonLdScript json={categorySchema} nonce={nonce} />
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

export function BlogFAQJsonLd({ faqs, nonce }: BlogFAQJsonLdProps & { nonce?: string | null }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return <JsonLdScript json={faqSchema} nonce={nonce} />
}
