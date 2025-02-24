import { siteConfig } from "@/config/site"

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  }
}

export function generateBlogPostSchema(post: any) {
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
      url: `${siteConfig.url}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
  }
}

export function generateProjectSchema(project: any) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.image,
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: `${siteConfig.url}/about`,
    },
    url: `${siteConfig.url}/projects/${project.slug}`,
  }
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    jobTitle: "Revenue Operations & Technology Professional",
    image: siteConfig.author.image,
    sameAs: [siteConfig.links.linkedin, siteConfig.links.twitter, siteConfig.links.github],
  }
}

