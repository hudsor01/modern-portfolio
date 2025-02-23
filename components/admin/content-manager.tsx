import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getPosts } from "@/lib/blog/actions"
import { formatDate } from "@/lib/utils"
import { Plus, Edit } from "lucide-react"

export async function ContentManager() {
  const { posts } = await getPosts({ limit: 5 })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Content</CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between space-x-4">
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-muted-foreground">{formatDate(post.publishedAt || post.updatedAt)}</p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/blog/${post.slug}/edit`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit post</span>
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

