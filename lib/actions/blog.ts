"use server"

import { getPosts } from "@/lib/actions/server-actions"

export async function getBlogPosts(page = 1, perPage = 10) {
  const posts = await getPosts()
  const totalPages = Math.ceil(posts.length / perPage)
  const currentPosts = posts.slice((page - 1) * perPage, page * perPage)

  return {
    posts: currentPosts,
    totalPages,
    currentPage: page,
  }
}

