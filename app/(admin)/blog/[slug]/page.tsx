import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { BlogPostEditor } from "@/components/admin/blog/blog-post-editor"
import { getPostBySlug } from "@/lib/blog/api"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={post.title} text="Edit your blog post." />
      <div className="grid gap-8">
        <BlogPostEditor post={post} />
      </div>
    </DashboardShell>
  )
}

