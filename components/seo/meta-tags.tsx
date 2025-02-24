interface MetaTagsProps {
  title: string
  description: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  canonical?: string
}

export function MetaTags({
  title,
  description,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  canonical,
}: MetaTagsProps) {
  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {image && <meta property="twitter:image" content={image} />}

      {/* Article Specific */}
      {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === "article" && tags?.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
    </>
  )
}

