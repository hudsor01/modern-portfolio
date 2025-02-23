import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogContent } from "@/components/blog/blog-content"
import { BlogHeader } from "@/components/blog/blog-header"
import { BlogRelated } from "@/components/blog/blog-related"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { getRelatedPosts } from "@/lib/utils"

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
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getAllPosts()
  const relatedPosts = getRelatedPosts(post, allPosts)

  return (
    <article className="container py-8 md:py-12">
      <BlogHeader post={post} />
      <BlogContent content={post.content} />
      <hr className="my-12" />
      <BlogRelated posts={relatedPosts} />
    </article>
  )
}

