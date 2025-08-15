'use client'

import { motion } from 'framer-motion'
import { BlogPostCardProps } from '@/types/blog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  Eye, 
  MessageCircle, 
  ArrowRight,
  Bookmark,
  Share2,
  TrendingUp
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export function BlogPostCard({
  post,
  variant = 'default',
  showCategory = true,
  showTags = true,
  showReadingTime = true,
  showViewCount = false,
  showCommentCount = false,
  showAuthor = true,
  className,
  onClick
}: BlogPostCardProps) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(post)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -8,
      transition: { duration: 0.2 }
    }
  }

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: { duration: 0.2 }
    }
  }

  if (variant === 'compact') {
    return (
      <motion.article
        className={cn(
          "group cursor-pointer",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={handleCardClick}
      >
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-colors">
            <div className="flex gap-4">
              {post.featuredImage && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <motion.div variants={imageVariants}>
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 96px"
                    />
                  </motion.div>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                {showCategory && post.category && (
                  <Badge 
                    variant="secondary"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-2"
                  >
                    {post.category.name}
                  </Badge>
                )}
                
                <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    {showAuthor && post.author && (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback className="text-xs">
                            {post.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.author.name}</span>
                      </div>
                    )}
                    {post.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(post.publishedAt, { addSuffix: true })}
                      </div>
                    )}
                  </div>
                  
                  {showReadingTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} min
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.article
        className={cn("group cursor-pointer", className)}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={handleCardClick}
      >
        <Link href={`/blog/${post.slug}`} className="block p-4 hover:bg-white/5 rounded-xl transition-colors">
          <div className="flex items-start justify-between mb-2">
            {showCategory && post.category && (
              <Badge variant="outline" className="text-xs">
                {post.category.name}
              </Badge>
            )}
            {post.publishedAt && (
              <time className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(post.publishedAt, { addSuffix: true })}
              </time>
            )}
          </div>
          
          <h3 className="font-semibold mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            {showAuthor && post.author && (
              <span>{post.author.name}</span>
            )}
            {showReadingTime && (
              <span>{post.readingTime} min read</span>
            )}
          </div>
        </Link>
      </motion.article>
    )
  }

  return (
    <motion.article
      className={cn(
        "group cursor-pointer",
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={handleCardClick}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden h-full hover:bg-white/10 transition-all duration-300">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
              <motion.div variants={imageVariants}>
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
              
              {/* Overlay with actions */}
              <motion.div
                className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0"
                variants={overlayVariants}
              >
                <Button size="sm" variant="secondary" className="h-8 px-3">
                  <Bookmark className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 px-3">
                  <Share2 className="h-3 w-3" />
                </Button>
              </motion.div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {post.featured && (
                  <Badge className="bg-yellow-500/90 text-white backdrop-blur">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {showCategory && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white backdrop-blur">
                    {post.category.name}
                  </Badge>
                )}
              </div>
              
              {/* Reading time */}
              {showReadingTime && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readingTime} min
                  </Badge>
                </div>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {/* Tags */}
            {showTags && post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={tag.id || index} variant="outline" className="text-xs">
                    {typeof tag === 'object' && 'name' in tag ? tag.name : String(tag)}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Title */}
            <h3 className="font-bold text-xl leading-tight mb-3 group-hover:text-blue-500 transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            {/* Excerpt */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            
            {/* Author and Meta */}
            <div className="flex items-center justify-between">
              {showAuthor && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback className="text-xs">
                      {post.author?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{post.author.name}</div>
                    <time className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(post.publishedAt, { addSuffix: true })}
                    </time>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                {showViewCount && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.viewCount.toLocaleString()}
                  </div>
                )}
                {showCommentCount && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {post.commentCount}
                  </div>
                )}
              </div>
            </div>
            
            {/* Read More */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-500 group-hover:text-blue-400">
                  Read More
                </span>
                <ArrowRight className="h-4 w-4 text-blue-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}