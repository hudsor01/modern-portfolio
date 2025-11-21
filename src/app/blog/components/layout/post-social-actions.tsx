'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BlogShareButtons } from '../blog-share-buttons'
import { BlogPostData } from '@/types/shared-api'
import { Heart, Bookmark, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostSocialActionsProps {
  post: BlogPostData
  showSocialShare?: boolean
}

export function PostSocialActions({ post, showSocialShare = true }: PostSocialActionsProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likeCount)

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${post.id}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setIsBookmarked(!isBookmarked)
      }
    } catch (error) {
      console.error('Failed to bookmark post:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex items-center justify-between mb-8 p-4 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "flex items-center gap-2",
            isLiked && "text-red-500"
          )}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          {likeCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={cn(
            "flex items-center gap-2",
            isBookmarked && "text-blue-500"
          )}
        >
          <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          Save
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      {showSocialShare && (
        <BlogShareButtons
          url={`https://richardwhudsonjr.com/blog/${post.slug}`}
          title={post.title}
          description={post.excerpt || ''}
        />
      )}
    </div>
  )
}