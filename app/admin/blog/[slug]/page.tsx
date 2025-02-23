import { notFound } from "next/navigation"
import { getPost } from "@/lib/actions/posts"
import { PostEditor } from "@/components/dashboard/post-editor"
import { PageHeader } from "@/components/ui/page-header"

interface PostPageProps {
  params: {
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = params.slug === "new" ? null : await getPost(params.slug)

  if (params.slug !== "new" && !post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading={post ? "Edit Post" : "New Post"}
        text={post ? "Edit your blog post." : "Create a new blog post."}
      />
      <PostEditor post={post} />
    </div>
  )
}

