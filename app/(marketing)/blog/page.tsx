import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { getPosts } from "@/lib/blog/api"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { blogConfig } from "@/config/blog"
import { FadeIn } from "@/components/ui/fade-in"

export const metadata = {
  title: "Blog | Richard Hudson",
  description: blogConfig.description,
}

export default async function BlogPage() {
  const posts = await getPosts()

  const words = [{ text: "Latest" }, { text: "Insights" }, { text: "&" }, { text: "Thoughts" }]

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-12">
        <div className="text-center">
          <TypewriterEffect words={words} />
          <p className="mt-4 text-lg text-muted-foreground">{blogConfig.description}</p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <FadeIn key={post.id}>
              <BlogPostCard post={post} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  )
}

