import { getPostBySlug } from "@/lib/blog/actions"
import { notFound } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"

interface EditPostPageProps {
  params: {
    slug: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { post } = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Post" text="Make changes to your blog post" />
      <div className="grid gap-8">
        <PostEditor post={post} />
      </div>
    </DashboardShell>
  )
}

