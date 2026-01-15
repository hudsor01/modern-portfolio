/**
 * Blog API Transformers
 * Centralized transformation logic for converting Prisma results to API response formats
 */

import { Prisma } from '@/generated/prisma/client'
import type { BlogPostData } from '@/types/api'

type BlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: {
    author: true
    category: true
    tags: { include: { tag: true } }
  }
}>

/**
 * Transform a Prisma BlogPost (with relations) to BlogPostData for API responses
 * Centralizes the transformation logic used across blog API routes
 */
export function transformToBlogPostData(post: BlogPostWithRelations): BlogPostData {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content,
    contentType: post.contentType,
    status: post.status,

    // SEO fields
    metaTitle: post.metaTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    keywords: post.keywords,
    canonicalUrl: post.canonicalUrl ?? undefined,

    // Content metadata
    featuredImage: post.featuredImage ?? undefined,
    featuredImageAlt: post.featuredImageAlt ?? undefined,
    readingTime: post.readingTime ?? undefined,
    wordCount: post.wordCount ?? undefined,

    // Publishing
    publishedAt: post.publishedAt?.toISOString(),
    scheduledAt: post.scheduledAt?.toISOString(),

    // Timestamps
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),

    // Relationships
    authorId: post.authorId,
    author: post.author
      ? {
          id: post.author.id,
          name: post.author.name,
          email: post.author.email,
          slug: post.author.slug,
          bio: post.author.bio ?? undefined,
          avatar: post.author.avatar ?? undefined,
          website: post.author.website ?? undefined,
          totalPosts: post.author.totalPosts,
          totalViews: post.author.totalViews,
          createdAt: post.author.createdAt.toISOString(),
        }
      : undefined,
    categoryId: post.categoryId ?? undefined,
    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
          description: post.category.description ?? undefined,
          color: post.category.color ?? undefined,
          icon: post.category.icon ?? undefined,
          postCount: post.category.postCount,
          totalViews: post.category.totalViews,
          createdAt: post.category.createdAt.toISOString(),
        }
      : undefined,
    tags: post.tags.map((pt) => ({
      id: pt.tag.id,
      name: pt.tag.name,
      slug: pt.tag.slug,
      description: pt.tag.description ?? undefined,
      color: pt.tag.color ?? undefined,
      postCount: pt.tag.postCount,
      totalViews: pt.tag.totalViews,
      createdAt: pt.tag.createdAt.toISOString(),
    })),

    // Analytics
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    shareCount: post.shareCount,
    commentCount: post.commentCount,
  }
}
