import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PostsTable } from "@/components/dashboard/posts/posts-table"
import { CreatePostButton } from "@/components/dashboard/posts/create-post-button"
import { getPosts } from "@/lib/actions/server-actions"

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Create and manage your blog posts",
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <DashboardShell>
      <DashboardHeader heading="Blog Posts" text="Create and manage your blog posts">
        <CreatePostButton />
      </DashboardHeader>
      <Suspense fallback={<div>Loading...</div>}>
        <PostsTable posts={posts} />
      </Suspense>
    </DashboardShell>
  )
}

