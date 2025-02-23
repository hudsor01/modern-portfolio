import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { Button } from "@/components/ui/button"
import { getPosts } from "@/lib/blog/api"
import { BlogPostList } from "@/components/admin/blog/blog-post-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function BlogAdminPage() {
  const posts = await getPosts()

  return (
    <DashboardShell>
      <DashboardHeader heading="Blog Posts" text="Manage your blog posts.">
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </DashboardHeader>

      <BlogPostList initialPosts={posts} />
    </DashboardShell>
  )
}

