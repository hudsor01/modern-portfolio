export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Richard Hudson",
    url: process.env.NEXT_PUBLIC_APP_URL,
    sameAs: [
      "https://github.com/yourgithub",
      "https://linkedin.com/in/yourlinkedin",
      "https://twitter.com/yourtwitter",
    ],
    jobTitle: "Software Developer",
    worksFor: {
      "@type": "Organization",
      name: "Your Company",
    },
  }
}

export function generateBlogPostSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: "Richard Hudson",
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    image: post.coverImage,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
  }
}

