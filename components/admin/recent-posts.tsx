import { getPosts } from "@/lib/blog/actions"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Eye } from "lucide-react"

export async function RecentPosts() {
  const { posts } = await getPosts({ limit: 5 })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
        <CardDescription>Your latest blog posts and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between space-x-4">
              <div className="flex flex-col space-y-1">
                <Link href={`/admin/blog/${post.slug}`} className="font-medium hover:underline">
                  {post.title}
                </Link>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
                  <span>•</span>
                  <span>{post.published ? "Published" : "Draft"}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View post</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/blog/${post.slug}/edit`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit post</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

