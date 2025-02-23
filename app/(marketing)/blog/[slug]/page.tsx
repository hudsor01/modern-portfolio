import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPostHeader } from "@/components/blog/blog-post-header"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { RelatedPosts } from "@/components/blog/related-posts"
import { getPostBySlug, getPosts } from "@/lib/blog/api"
import { getRelatedPosts, generatePostSchema } from "@/lib/blog/utils"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name || ""],
      images: [
        {
          url: post.image || "",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image || ""],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getPosts()
  const relatedPosts = getRelatedPosts(post, allPosts)
  const postSchema = generatePostSchema(post)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }} />

      <article className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <div className="lg:col-span-1">
            <BlogPostHeader post={post} />
            <BlogPostContent content={post.content} />
            <hr className="my-12" />
            <RelatedPosts posts={relatedPosts} />
          </div>
          <aside className="hidden lg:block">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </article>
    </>
  )
}

