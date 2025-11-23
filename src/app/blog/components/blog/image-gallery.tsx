import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Image Gallery Component
interface ImageGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: 1 | 2 | 3 | 4
  aspectRatio?: "square" | "landscape" | "portrait"
}

export const ImageGallery = React.forwardRef<HTMLDivElement, ImageGalleryProps>(
  ({ className, images, columns = 2, aspectRatio = "landscape", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4 my-8",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          className
        )}
        {...props}
      >
        {images.map((image, index) => (
          <figure key={index} className="group">
            <div className={cn(
              "relative overflow-hidden rounded-lg bg-muted",
              "transition-transform duration-300 group-hover:scale-105",
              aspectRatio === "square" && "aspect-square",
              aspectRatio === "landscape" && "aspect-video",
              aspectRatio === "portrait" && "aspect-[3/4]",
            )}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {image.caption && (
              <figcaption className="mt-2 text-sm text-muted-foreground text-center">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    )
  }
)
ImageGallery.displayName = "ImageGallery"