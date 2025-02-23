"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Facebook, Copy, Share2, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface SocialShareProps {
  title: string
  url: string
  description?: string
}

export function SocialShare({ title, url, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    text: description,
    url,
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success("Shared successfully!")
      } else {
        handleCopyLink()
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <div className="flex items-center gap-2">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Twitter className="h-5 w-5" />
          <span className="sr-only">Share on Twitter</span>
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Linkedin className="h-5 w-5" />
          <span className="sr-only">Share on LinkedIn</span>
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Facebook className="h-5 w-5" />
          <span className="sr-only">Share on Facebook</span>
        </a>
        <Button variant="ghost" size="icon" onClick={handleCopyLink} className="h-9 w-9">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy link</span>
        </Button>
      </div>
    </div>
  )
}

