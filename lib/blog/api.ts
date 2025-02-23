import { sql } from "@vercel/postgres"
import type { Post, Tag } from "./types"
import { cache } from "react"

export const getPosts = cache(async ({ limit = 10, offset = 0 } = {}) => {
  const { rows } = await sql<Post>`
    SELECT 
      p.*,
      json_build_object(
        'name', u.name,
        'image', u.image
      ) as author,
      ARRAY_AGG(t.name) as tags
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.published = true
    GROUP BY p.id, u.id
    ORDER BY p.published_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `

  return rows
})

export const getPostBySlug = cache(async (slug: string) => {
  const { rows } = await sql<Post>`
    SELECT 
      p.*,
      json_build_object(
        'name', u.name,
        'image', u.image
      ) as author,
      ARRAY_AGG(t.name) as tags
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.slug = ${slug}
    AND p.published = true
    GROUP BY p.id, u.id
    LIMIT 1
  `

  return rows[0]
})

export const getTags = cache(async () => {
  const { rows } = await sql<Tag>`
    SELECT 
      t.id,
      t.name,
      COUNT(pt.post_id) as count
    FROM tags t
    LEFT JOIN post_tags pt ON t.id = pt.tag_id
    LEFT JOIN posts p ON pt.post_id = p.id
    WHERE p.published = true
    GROUP BY t.id
    ORDER BY count DESC
  `

  return rows
})

export const getRelatedPosts = cache(async (postId: string, limit = 3) => {
  const { rows } = await sql<Post>`
    WITH post_tags AS (
      SELECT tag_id
      FROM post_tags
      WHERE post_id = ${postId}
    )
    SELECT DISTINCT 
      p.*,
      json_build_object(
        'name', u.name,
        'image', u.image
      ) as author,
      ARRAY_AGG(t.name) as tags
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.id != ${postId}
    AND p.published = true
    AND pt.tag_id IN (SELECT tag_id FROM post_tags)
    GROUP BY p.id, u.id
    ORDER BY p.published_at DESC
    LIMIT ${limit}
  `

  return rows
})

