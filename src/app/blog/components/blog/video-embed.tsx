'use client'

import * as React from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

// Video Embed Component
interface VideoEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  title: string
  aspectRatio?: "video" | "square" | "ultrawide"
  thumbnail?: string
  autoPlay?: boolean
}

export const VideoEmbed = React.forwardRef<HTMLDivElement, VideoEmbedProps>(
  ({ 
    className, 
    src, 
    title, 
    aspectRatio = "video", 
    thumbnail,
    autoPlay = false,
    ...props 
  }, ref) => {
    const [isPlaying, setIsPlaying] = React.useState(autoPlay)
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg bg-muted my-8",
          aspectRatio === "video" && "aspect-video",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "ultrawide" && "aspect-[21/9]",
          className
        )}
        {...props}
      >
        {!isPlaying && thumbnail ? (
          <div className="relative h-full w-full cursor-pointer group" onClick={() => setIsPlaying(true)}>
            <Image
              src={thumbnail}
              alt={`${title} thumbnail`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="flex items-center justify-center w-16 h-16 bg-white/90 rounded-full group-hover:bg-white transition-colors">
                <Play className="h-6 w-6 text-black ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={src}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    )
  }
)
VideoEmbed.displayName = "VideoEmbed"