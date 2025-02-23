import type { Post } from "@/lib/blog/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface BlogPostCardProps {
  post: Post
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        {post.image && (
          <div className="aspect-video relative">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold leading-tight">{post.title}</h2>
            {post.description && <p className="text-muted-foreground">{post.description}</p>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
            {post.author.image && (
              <Image
                src={post.author.image || "/placeholder.svg"}
                alt={post.author.name || ""}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <div className="flex items-center gap-x-1">
              <span>{post.author.name}</span>
              <span>•</span>
              <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt || post.updatedAt)}</time>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

