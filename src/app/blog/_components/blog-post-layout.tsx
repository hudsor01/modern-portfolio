import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, CalendarDays, Clock, Eye } from 'lucide-react'
import type { BlogPostData } from '@/types/shared-api'
import { BlogPostArticle } from './blog-post-article'
import { InlineMarkdown } from './inline-markdown'
import { ContentType } from '@/generated/prisma/client'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface PostLayoutProps {
  post: BlogPostData
}

export function BlogPostLayout({ post }: PostLayoutProps) {
  const publishedDate = post.publishedAt
    ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
    : null
  const wordCount = post.wordCount ?? post.content.split(/\s+/).filter(Boolean).length
  const readingTime = post.readingTime ?? Math.max(1, Math.ceil(wordCount / 200))
  const authorName = post.author?.name ?? 'Richard Hudson'
  const authorImage = '/images/richard.jpg'
  const authorInitials = authorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const detailItems = [
    publishedDate ? { label: 'Published', value: publishedDate } : null,
    readingTime ? { label: 'Reading time', value: `${readingTime} min` } : null,
    wordCount ? { label: 'Word count', value: wordCount.toLocaleString() } : null,
    post.category?.name ? { label: 'Category', value: post.category.name } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <article className="portfolio-container py-10 lg:py-14">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="icon-sm" />
        Back to Blog
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {/* Header */}
          <header className="relative overflow-hidden rounded-md border border-border bg-gradient-to-br from-card via-card to-muted/40 p-8 shadow-sm">

            <div className="relative">
              {/* Category + Date */}
              <div className="flex flex-wrap items-center gap-3 text-body-sm text-muted-foreground">
                {post.category && (
                  <Badge variant="secondary" className="uppercase tracking-wide text-[0.7rem]">
                    {post.category.name}
                  </Badge>
                )}
                {publishedDate && (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="icon-sm" />
                    <time dateTime={post.publishedAt}>{publishedDate}</time>
                  </span>
                )}
                {readingTime ? (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="icon-sm" />
                    {readingTime} min read
                  </span>
                ) : null}
                {post.viewCount > 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <Eye className="icon-sm" />
                    {post.viewCount.toLocaleString()} views
                  </span>
                ) : null}
              </div>

              {/* Title */}
              <h1 className="heading-page mt-6 mb-4">
                <InlineMarkdown value={post.title} />
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-body-lg text-muted-foreground">
                  <InlineMarkdown value={post.excerpt} />
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-border/60">
                    <AvatarImage src={authorImage} alt={authorName} />
                    <AvatarFallback className="text-sm font-semibold">{authorInitials}</AvatarFallback>
                  </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{authorName}</p>
                </div>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <figure className="relative mt-10 aspect-[16/9] overflow-hidden rounded-md border border-border shadow-sm">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 960px"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10" />
              {post.featuredImageAlt && (
                <figcaption className="absolute bottom-4 left-4 rounded-md bg-background/80 px-3 py-1 text-xs text-foreground shadow-sm">
                  {post.featuredImageAlt}
                </figcaption>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            </figure>
          )}

          {/* Content */}
          <div className="mt-10">
            <BlogPostArticle
              content={post.content}
              contentType={post.contentType as ContentType}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="icon-sm" />
              Back to all posts
            </Link>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          <Card variant="outline" className="p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Post details
            </p>
            <div className="mt-4 space-y-3 text-sm">
              {detailItems.map((detail) => (
                <div key={detail.label} className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{detail.label}</span>
                  <span className="font-medium text-foreground">{detail.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {post.author?.bio ? (
            <Card variant="outline" className="p-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                About the author
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-border/60">
                  <AvatarImage src={authorImage} alt={authorName} />
                  <AvatarFallback className="text-sm font-semibold">{authorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{authorName}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {post.author.bio}
              </p>
            </Card>
          ) : null}
        </aside>
      </div>
    </article>
  )
}
