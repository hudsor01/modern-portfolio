import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface BlogPostPreviewProps {
  post: {
    slug: string
    title: string
    description?: string
    image?: string
    publishedAt?: Date
    updatedAt: Date
    tags: string[]
    author: {
      name?: string
      image?: string
    }
  }
}

export function BlogPostPreview({ post }: BlogPostPreviewProps) {
  return (
    <div className="group relative flex flex-col space-y-4">
      {post.image && (
        <Link href={`/blog/${post.slug}`} className="aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={600}
            height={340}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="space-y-2">
        <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
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
          <span>•</span>
          <time dateTime={post.publishedAt?.toISOString() || post.updatedAt.toISOString()}>
            {formatDate(post.publishedAt || post.updatedAt)}
          </time>
        </div>
        <h2 className="text-2xl font-bold">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        {post.description && <p className="text-muted-foreground">{post.description}</p>}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog/tag/${tag}`} className="text-sm text-muted-foreground hover:text-foreground">
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

