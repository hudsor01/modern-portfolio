"use client"

import type { Post } from "@/lib/blog/types"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, Twitter, Linkedin, Facebook, LinkIcon } from "lucide-react"
import { toast } from "sonner"

interface SharePostProps {
  post: Post
}

export function SharePost({ post }: SharePostProps) {
  const shareUrl = `${window.location.origin}/blog/${post.slug}`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success("Link copied to clipboard!")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink}>
          <LinkIcon className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

