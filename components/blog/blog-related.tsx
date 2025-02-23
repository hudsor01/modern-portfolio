import Link from "next/link"
import type { Post } from "@/types/blog"

interface BlogRelatedProps {
  posts: Post[]
}

export function BlogRelated({ posts }: BlogRelatedProps) {
  if (posts.length === 0) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Related Posts</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-lg border p-4 transition-colors hover:border-foreground"
          >
            <h3 className="font-semibold tracking-tight group-hover:underline">{post.title}</h3>
            {post.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}

