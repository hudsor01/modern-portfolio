'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { m as motion } from 'framer-motion'
import { 
  Calendar, 
  Tag, 
  User, 
  TrendingUp, 
  Clock, 
  Eye, 
  MessageCircle,
  Folder,
  Star,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { BlogCategory, BlogTag, BlogAuthor, BlogPostSummary } from '@/types/blog'

interface BlogSidebarProps {
  categories: BlogCategory[]
  tags: BlogTag[]
  authors?: BlogAuthor[]
  recentPosts?: BlogPostSummary[]
  popularPosts?: BlogPostSummary[]
  featuredPosts?: BlogPostSummary[]
  className?: string
}

export function BlogSidebar({
  categories,
  tags,
  authors = [],
  recentPosts = [],
  popularPosts = [],
  featuredPosts = [],
  className
}: BlogSidebarProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('space-y-6', className)}
    >
      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="glass rounded-3xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.slice(0, 5).map((post, index) => (
                <div key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <div className="flex gap-3">
                      {post.featuredImage && (
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</span>
                          <Eye className="h-3 w-3" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {index < recentPosts.slice(0, 5).length - 1 && (
                    <Separator className="mt-4 opacity-20" />
                  )}
                </div>
              ))}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full mt-4 text-primary hover:bg-primary/5 dark:hover:bg-primary/20/20"
              >
                <Link href="/blog" className="flex items-center justify-center">
                  View All Posts
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="glass rounded-3xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-success" />
                Popular Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularPosts.slice(0, 5).map((post, index) => (
                <div key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-foreground text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-success transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.viewCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{post.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {index < popularPosts.slice(0, 5).length - 1 && (
                    <Separator className="mt-4 opacity-20" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="glass rounded-3xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-warning" />
                Featured Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <div key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <div className="space-y-2">
                      {post.featuredImage && (
                        <div className="aspect-video rounded-lg overflow-hidden relative">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>
                      )}
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-warning transition-colors">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.author.name}</span>
                        <span>•</span>
                        <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</span>
                      </div>
                    </div>
                  </Link>
                  {index < featuredPosts.slice(0, 3).length - 1 && (
                    <Separator className="mt-4 opacity-20" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Categories */}
      <motion.div variants={itemVariants}>
        <Card className="glass rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Folder className="h-5 w-5 text-purple-500" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color || '#6366f1' }}
                  />
                  <span className="text-sm font-medium group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.postCount}
                </Badge>
              </Link>
            ))}
            {categories.length > 8 && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Link href="/blog/categories" className="flex items-center justify-center">
                  View All Categories
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tags */}
      <motion.div variants={itemVariants}>
        <Card className="glass rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="h-5 w-5 text-orange-500" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                  <Badge
                    variant="outline"
                    className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 dark:hover:bg-orange-900/20 transition-colors cursor-pointer"
                  >
                    {tag.name}
                    {tag.postCount > 0 && (
                      <span className="ml-1 text-xs opacity-70">
                        {tag.postCount}
                      </span>
                    )}
                  </Badge>
                </Link>
              ))}
            </div>
            {tags.length > 12 && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full mt-4 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                <Link href="/blog/tags" className="flex items-center justify-center">
                  View All Tags
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Authors */}
      {authors.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="glass rounded-3xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-secondary" />
                Authors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {authors.slice(0, 5).map((author) => (
                <Link
                  key={author.id}
                  href={`/blog/author/${author.slug}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  {author.avatar && (
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium group-hover:text-secondary transition-colors truncate">
                        {author.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {author.totalPosts}
                      </Badge>
                    </div>
                    {author.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {author.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
              {authors.length > 5 && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-secondary hover:bg-secondary/5 dark:hover:bg-secondary/20/20"
                >
                  <Link href="/blog/authors" className="flex items-center justify-center">
                    View All Authors
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}