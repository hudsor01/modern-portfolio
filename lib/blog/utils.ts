export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function getRelatedPosts(currentPost: any, allPosts: any[], limit = 3) {
  // Create a set of current post tags
  const currentTags = new Set(currentPost.tags)

  // Score and sort posts based on tag matches
  const scoredPosts = allPosts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => {
      const matchingTags = post.tags.filter((tag: string) => currentTags.has(tag))
      return {
        ...post,
        score: matchingTags.length,
      }
    })
    .sort((a, b) => b.score - a.score)

  return scoredPosts.slice(0, limit)
}

export function generatePostSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: "Richard Hudson",
      logo: {
        "@type": "ImageObject",
        url: "https://richardwhudsonjr.com/logo.png",
      },
    },
  }
}

