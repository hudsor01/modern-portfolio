"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Facebook, LinkIcon } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" asChild>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="icon" onClick={copyLink}>
        <LinkIcon className="h-4 w-4" />
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  )
}

