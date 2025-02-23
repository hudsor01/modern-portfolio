import { PostList } from "@/components/dashboard/post-list"
import { getPosts } from "@/lib/actions/server-actions"

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Posts</h1>
      <PostList initialPosts={posts} />
    </div>
  )
}

