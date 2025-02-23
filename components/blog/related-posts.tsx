import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RelatedPostsProps {
  posts: Array<{
    slug: string
    title: string
    description?: string
    image?: string
    publishedAt?: Date
    updatedAt: Date
  }>
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              {post.image && (
                <div className="aspect-video relative">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {post.description && <p className="text-muted-foreground line-clamp-2 mb-4">{post.description}</p>}
                <time
                  className="text-sm text-muted-foreground"
                  dateTime={post.publishedAt?.toISOString() || post.updatedAt.toISOString()}
                >
                  {formatDate(post.publishedAt || post.updatedAt)}
                </time>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

