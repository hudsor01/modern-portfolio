import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjects, getProject } from '@/lib/projects'
import { showcaseProjects } from '@/data/projects'
import { canonicalUrl } from '@/lib/absolute-url'
import { safeFeaturedImageUrl } from '@/lib/featured-image-url'
import ProjectDetailClientBoundary from './_components/project-detail-client-boundary'

// Force runtime rendering. notFound() inside Next.js 16's ISR-rendered
// Server Components doesn't propagate HTTP 404 — fake project slugs were
// 500-ing instead of returning 404. force-dynamic + s-maxage=60 CDN
// caching gets the same performance for real slugs while fixing 404s
// for unknown ones. Upstream: https://github.com/vercel/next.js/issues/79465
export const dynamic = 'force-dynamic'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

// Every project in the catalog has its own dedicated /projects/<slug>/page.tsx,
// which takes precedence over this dynamic segment. So this catch-all route only
// ever runs for slugs NOT in the catalog — where getProject() returns null and
// we notFound(). There are therefore no static params to pre-render; deriving
// the exclusion set from the catalog (rather than a hand-kept list that drifts)
// makes that explicit and self-maintaining: if a project ever loses its
// dedicated page, it automatically becomes statically generated here instead.
export async function generateStaticParams() {
  const dedicatedPageSlugs = new Set(showcaseProjects.map((p) => p.slug))
  const projects = await getProjects()
  return projects
    .filter((project) => project.slug && !dedicatedPageSlugs.has(project.slug))
    .map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  // Commit to 404 from the metadata phase. Returning fake "Project Not Found"
  // metadata shipped HTTP 200 + Soft-404 body — same Search Console "Crawled
  // - currently not indexed" signal fixed on /blog/[slug]. Symmetric fix.
  if (!project) {
    notFound()
  }

  // Use the real project image when available, branded /api/og card
  // when not — same contract as blog/[slug] generateMetadata and the
  // sitemap. Subtitle reflects the project domain so the OG card
  // copy matches the page context.
  const ogImage = safeFeaturedImageUrl(project.image, {
    title: project.title,
    subtitle: 'Revenue Operations Project',
  })
  const projectUrl = canonicalUrl(`/projects/${slug}`)

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: projectUrl,
      images: [
        {
          url: ogImage.url,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [ogImage.url],
    },
    alternates: {
      canonical: projectUrl,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  // Pass project data directly to client component
  // No TanStack Query, no fetch, no hydration boundary needed
  return <ProjectDetailClientBoundary slug={slug} initialProject={project} />
}
