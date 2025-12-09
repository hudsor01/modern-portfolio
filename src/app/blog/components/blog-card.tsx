'use client'

import Link from 'next/link'
import Image from 'next/image'

interface BlogCardProps {
  url: string
  title: string
  description: string
  date: string
  thumbnail?: string
}

export function BlogCard({
  url,
  title,
  description,
  date,
  thumbnail,
}: BlogCardProps) {
  return (
    <Link href={url} className="group block h-full">
      <article className="portfolio-card h-full overflow-hidden !p-0">
        {/* Image */}
        {thumbnail && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5 stack-sm">
          <h3 className="heading-card group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-body-sm line-clamp-3">{description}</p>
          <time className="text-body-sm text-muted-foreground">{date}</time>
        </div>
      </article>
    </Link>
  )
}
