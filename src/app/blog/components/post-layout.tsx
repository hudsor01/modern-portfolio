'use client'

import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import type { BlogPostData } from '@/types/shared-api'
import { BlogContent } from './blog-content'
import { ContentType } from '@/types/blog'

interface PostLayoutProps {
  post: BlogPostData
}

export function PostLayout({ post }: PostLayoutProps) {
  const publishedDate = post.publishedAt
    ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
    : null

  return (
    <article className="portfolio-container py-12">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="icon-sm" />
        Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-8 max-w-3xl">
        {/* Category + Date */}
        <div className="flex items-center gap-3 text-body-sm mb-4">
          {post.category && (
            <span className="portfolio-badge">{post.category.name}</span>
          )}
          {publishedDate && <time className="text-muted-foreground">{publishedDate}</time>}
          {post.readingTime && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{post.readingTime} min read</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="heading-page mb-4">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-body-lg">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative aspect-[16/9] mb-10 overflow-hidden rounded-xl max-w-4xl border border-border">
          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl">
        <BlogContent
          content={post.content}
          contentType={ContentType[post.contentType as keyof typeof ContentType]}
        />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 pt-8 border-t border-border max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag.id} className="portfolio-badge">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Back to Blog */}
      <div className="mt-12 pt-8 border-t border-border max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="icon-sm" />
          Back to all posts
        </Link>
      </div>
    </article>
  )
}
