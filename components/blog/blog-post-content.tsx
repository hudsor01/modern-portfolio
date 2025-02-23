"use client"

import { useEffect } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useMounted } from "@/lib/hooks/use-mounted"

interface BlogPostContentProps {
  content: string
  className?: string
}

export function BlogPostContent({ content, className }: BlogPostContentProps) {
  const mounted = useMounted()

  useEffect(() => {
    // Add IDs to headings for table of contents
    const headings = document.querySelectorAll("h1, h2, h3")
    headings.forEach((heading) => {
      const id = heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      if (id) heading.id = id
    })
  }, [])

  const components = {
    img: (props: any) => (
      <div className="relative aspect-video my-8">
        <Image
          {...props}
          alt={props.alt || ""}
          fill
          className="object-cover rounded-lg"
          sizes="(min-width: 1280px) 1200px, (min-width: 1040px) 950px, (min-width: 780px) 700px, 100vw"
        />
      </div>
    ),
  }

  return (
    <article
      className={cn(
        "prose prose-lg dark:prose-invert max-w-none",
        "prose-headings:scroll-mt-20",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-a:underline prose-a:decoration-primary",
        "prose-code:rounded-md prose-code:bg-muted prose-code:p-1",
        "prose-pre:rounded-lg prose-pre:border",
        className,
      )}
    >
      <MDXRemote source={content} components={components} />
    </article>
  )
}

