'use client'

import { siteConfig } from '@/lib/config/site'

export function HomePageSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Richard Hudson - Revenue Operations Professional",
    "description": "Revenue Operations professional specializing in data analytics, business intelligence, and growth strategies for SaaS companies.",
    "url": siteConfig.url,
    "mainEntity": {
      "@type": "Person",
      "name": siteConfig.author.name,
      "jobTitle": "Revenue Operations Professional",
      "url": siteConfig.url,
      "sameAs": [
        siteConfig.links.linkedin,
        siteConfig.links.github
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Revenue Operations Consulting"
      },
      "knowsAbout": [
        "Revenue Operations",
        "Business Intelligence",
        "Data Analytics",
        "SaaS Growth",
        "Sales Pipeline Optimization",
        "Customer Retention Analysis"
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData)
      }}
    />
  )
}