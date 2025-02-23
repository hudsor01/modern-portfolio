import { BlogCard } from "./blog-card"
import { BlogPagination } from "./blog-pagination"
import { getBlogPosts } from "@/lib/actions/blog"

interface BlogListProps {
  page?: number
  perPage?: number
}

export async function BlogList({ page = 1, perPage = 10 }: BlogListProps) {
  const { posts, totalPages, currentPage } = await getBlogPosts(page, perPage)

  return (
    <div className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      <BlogPagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  )
}

