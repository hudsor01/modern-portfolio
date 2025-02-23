import Image from "next/image"
import { formatDate } from "@/lib/utils/formatting"
import type { Post } from "@/types/blog"

interface BlogHeaderProps {
  post: Post
}

export function BlogHeader({ post }: BlogHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        {post.description && <p className="text-xl text-muted-foreground">{post.description}</p>}
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {post.author && (
          <div className="flex items-center gap-2">
            {post.author.image && (
              <Image
                src={post.author.image || "/placeholder.svg"}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{post.author.name}</span>
          </div>
        )}
        {post.date && <time dateTime={post.date}>{formatDate(post.date)}</time>}
        {post.readingTime && <span>{post.readingTime} min read</span>}
      </div>
      {post.image && (
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          width={1200}
          height={630}
          className="rounded-lg border bg-muted"
          priority
        />
      )}
    </div>
  )
}

