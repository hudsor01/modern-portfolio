import { notFound } from "next/navigation"
import { PostForm } from "@/components/dashboard/post-form"
import { getPostBySlug } from "@/lib/actions/posts"

interface EditPostPageProps {
  params: {
    slug: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground">Edit and update your blog post</p>
      </div>
      <PostForm post={post} />
    </div>
  )
}

