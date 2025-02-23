import { PostForm } from "@/components/dashboard/post-form"

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Post</h1>
        <p className="text-muted-foreground">Create a new blog post</p>
      </div>
      <PostForm />
    </div>
  )
}

