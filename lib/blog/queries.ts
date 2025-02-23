import { sql } from "@vercel/postgres"
import { cache } from "react"

export const getFilteredPosts = cache(
  async ({
    tag,
    search,
    limit = 10,
    offset = 0,
  }: {
    tag?: string
    search?: string
    limit?: number
    offset?: number
  }) => {
    const conditions = ["p.published = true"]
    const params: any[] = []

    if (tag) {
      conditions.push("t.name = $1")
      params.push(tag)
    }

    if (search) {
      conditions.push("(p.title ILIKE $2 OR p.description ILIKE $2)")
      params.push(`%${search}%`)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

    const { rows: posts } = await sql`
    SELECT DISTINCT
      p.*,
      json_agg(DISTINCT t.name) as tags,
      u.name as author_name,
      u.image as author_image
    FROM posts p
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    LEFT JOIN users u ON p.author_id = u.id
    ${sql(whereClause)}
    GROUP BY p.id, u.id
    ORDER BY p.published_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `

    const {
      rows: [{ count }],
    } = await sql`
    SELECT COUNT(DISTINCT p.id) as count
    FROM posts p
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    ${sql(whereClause)}
  `

    return {
      posts,
      total: Number(count),
      hasMore: Number(count) > offset + limit,
    }
  },
)

