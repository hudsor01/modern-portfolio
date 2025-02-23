import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { PostList } from "@/components/dashboard/post-list"
import { PostsTableSkeleton } from "@/components/dashboard/posts-table-skeleton"

export const metadata = {
  title: "Blog Posts",
  description: "Manage your blog posts",
}

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader heading="Blog Posts" text="Create and manage your blog posts." />
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>
      <Suspense fallback={<PostsTableSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  )
}

