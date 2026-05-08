import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjects, getProject } from '@/lib/projects'
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

// Official Next.js 16 Pattern: generateStaticParams for SSG
// Pre-renders all projects at build time (zero runtime cost)
export async function generateStaticParams() {
  const projects = await getProjects()

  // Exclude projects that have their own dedicated pages
  const excludedSlugs = [
    'partnership-program-implementation',
    'cac-unit-economics',
    'churn-retention',
    'commission-optimization',
    'customer-lifetime-value',
    'deal-funnel',
    'lead-attribution',
    'multi-channel-attribution',
    'partner-performance',
    'revenue-kpi',
    'revenue-operations-center',
  ]

  return projects
    .filter((project) => !excludedSlugs.includes(project.slug || ''))
    .map((project) => ({
      slug: project.slug,
    }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found',
    }
  }

  const ogImageUrl = `https://richardwhudsonjr.com/api/og?${new URLSearchParams({
    title: project.title,
    subtitle: 'Revenue Operations Project',
  }).toString()}`

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://richardwhudsonjr.com/projects/${slug}`,
      images: [
        {
          url: ogImageUrl,
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
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `https://richardwhudsonjr.com/projects/${slug}`,
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
