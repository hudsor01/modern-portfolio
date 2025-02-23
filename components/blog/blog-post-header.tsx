import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { estimateReadingTime } from "@/lib/blog/utils"
import { Clock, Calendar } from "lucide-react"
import { ShareButtons } from "./share-buttons"
import { Badge } from "@/components/ui/badge"

interface BlogPostHeaderProps {
  post: {
    title: string
    description?: string
    image?: string
    publishedAt?: Date
    updatedAt: Date
    author: {
      name?: string
      image?: string
    }
    tags: string[]
    content: string
  }
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const readingTime = estimateReadingTime(post.content)
  const url = typeof window !== "undefined" ? window.location.href : ""

  return (
    <header className="space-y-8 mb-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{post.title}</h1>
        {post.description && <p className="text-xl text-muted-foreground">{post.description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          {post.author.image && (
            <Image
              src={post.author.image || "/placeholder.svg"}
              alt={post.author.name || ""}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span>{post.author.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.publishedAt?.toISOString() || post.updatedAt.toISOString()}>
            {formatDate(post.publishedAt || post.updatedAt)}
          </time>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{readingTime} min read</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {post.image && (
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1280px) 1200px, (min-width: 1040px) 950px, (min-width: 780px) 700px, 100vw"
          />
        </div>
      )}

      <div className="flex items-center justify-between border-y py-4">
        <ShareButtons title={post.title} url={url} />
      </div>
    </header>
  )
}

