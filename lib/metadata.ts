import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

const defaultOpenGraph = {
  type: "website",
  locale: "en_US",
  url: siteConfig.url,
  title: siteConfig.name,
  description: siteConfig.description,
  siteName: siteConfig.name,
  images: [
    {
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: siteConfig.name,
    },
  ],
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Revenue Operations",
    "Technology",
    "Professional",
    "Richard Hudson",
    "Portfolio",
    "RevOps",
    "Business Growth",
    "Sales Operations",
  ],
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  openGraph: defaultOpenGraph,
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: defaultOpenGraph.images,
    creator: "@dickswayze",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
}

