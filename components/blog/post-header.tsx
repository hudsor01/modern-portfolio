import type { Post } from "@/lib/blog/types"
import { formatDate } from "@/lib/utils"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Clock, Calendar } from "lucide-react"
import { SharePost } from "./share-post"
import { estimateReadingTime } from "@/lib/blog/utils"

interface PostHeaderProps {
  post: Post
}

export function PostHeader({ post }: PostHeaderProps) {
  const readingTime = estimateReadingTime(post.content)

  return (
    <header className="space-y-8 mb-10">
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          ...(post.tags[0] ? [{ label: post.tags[0], href: `/blog/tag/${post.tags[0]}` }] : []),
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{post.title}</h1>
        {post.description && <p className="text-xl text-muted-foreground">{post.description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
        <SharePost post={post} />
      </div>

      {post.image && (
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="object-cover w-full h-full" />
        </div>
      )}
    </header>
  )
}

