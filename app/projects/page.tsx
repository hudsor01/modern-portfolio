import { getProjects } from '@/lib/content/projects'
import type { Project } from '@/types/project'
import { ProjectsTypewriter } from '@/components/projects/projects-typewriter'
import ProjectsClientBoundary from '@/components/projects/projects-client-boundary'
import { CTASection } from '@/components/ui/cta-section'
import { SectionContainer } from '@/components/ui/section-container'
import { generateMetadata } from '@/app/shared-metadata'
import Link from 'next/link'
import Image from 'next/image'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { projectKeys } from '@/lib/queryKeys'
import { createServerQueryClient } from '@/lib/query-config'

export const metadata = generateMetadata(
  "Projects | Richard Hudson's Portfolio",
  "Explore Richard Hudson's portfolio of revenue operations projects and case studies demonstrating successful business optimization strategies.",
  '/projects'
)

export default async function ProjectsPage() {
  // Create optimized server QueryClient for SSR
  const queryClient = createServerQueryClient();

  // Prefetch projects data for hydration
  await queryClient.prefetchQuery({
    queryKey: projectKeys.list(),
    queryFn: () => getProjects(),
  });

  // Also prefetch featured projects 
  await queryClient.prefetchQuery({
    queryKey: projectKeys.featured(),
    queryFn: () => getProjects().then(projects => projects.filter(p => p.featured)),
  });

  // Get the prefetched data for server-side rendering
  const projectsList = queryClient.getQueryData<Project[]>(projectKeys.list()) || [];

  // Witty typewriter titles
  const typewriterPhrases = [
    'Data Visualization Showcase',
    'Data-Driven Solutions',
    'Analytics Portfolio',
    'Revenue Insights',
    'Business Intelligence Projects',
  ]

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="pb-10 overflow-auto">
        {/* Hero Section with Typewriter */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-zinc-900 via-slate-800 to-zinc-900 py-16 sm:py-20 mb-10">
        {/* Background image with overlay */}
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
          alt=""
          fill
          className="absolute inset-0 -z-10 object-cover object-right md:object-center"
          priority
        />

        {/* Gradient effect 1 */}
        <div
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-primary to-secondary opacity-20 [clip-path:polygon(74.1%_44.1%,100%_61.6%,97.5%_26.9%,85.5%_0.1%,80.7%_2%,72.5%_32.5%,60.2%_62.4%,52.4%_68.1%,47.5%_58.3%,45.2%_34.5%,27.5%_76.7%,0.1%_64.9%,17.9%_100%,27.6%_76.8%,76.1%_97.7%,74.1%_44.1%)]"
          ></div>
        </div>

        {/* Gradient effect 2 */}
        <div
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-primary to-secondary opacity-20 [clip-path:polygon(74.1%_44.1%,100%_61.6%,97.5%_26.9%,85.5%_0.1%,80.7%_2%,72.5%_32.5%,60.2%_62.4%,52.4%_68.1%,47.5%_58.3%,45.2%_34.5%,27.5%_76.7%,0.1%_64.9%,17.9%_100%,27.6%_76.8%,76.1%_97.7%,74.1%_44.1%)]"
          ></div>
        </div>

        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-shadow-lg">
              <ProjectsTypewriter phrases={typewriterPhrases} />
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-white/80 sm:text-xl leading-8">
              Interactive dashboards and analytics visualizations built with modern web technologies
            </p>
          </div>

          {/* Project categories */}
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base leading-7 font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              <Link href="#web-development">Web Development <span aria-hidden="true">&rarr;</span></Link>
              <Link href="#data-visualization">Data Visualization <span aria-hidden="true">&rarr;</span></Link>
              <Link href="#analytics">Analytics <span aria-hidden="true">&rarr;</span></Link>
              <Link href="#all-projects">All Projects <span aria-hidden="true">&rarr;</span></Link>
            </div>

            {/* Project stats */}
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base leading-7 text-white/70">Total Projects</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">{projectsList.length}</dd>
              </div>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base leading-7 text-white/70">Featured Projects</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">
                  {projectsList.filter(p => p.featured).length}
                </dd>
              </div>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base leading-7 text-white/70">Technologies</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">
                  {new Set(projectsList.flatMap(p => p.tags || p.technologies || [])).size}+
                </dd>
              </div>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-base leading-7 text-white/70">Years Experience</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">
                  {new Date().getFullYear() - 2018}+
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Projects Section with TanStack Query Hydration */}
      <SectionContainer variant="primary" className="py-0">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProjectsClientBoundary initialProjects={projectsList} />
        </HydrationBoundary>
      </SectionContainer>

      {/* CTA Section moved from homepage */}
      <section className="bg-gradient-to-br from-zinc-900 via-slate-800 to-zinc-900 mt-16">
        <CTASection />
      </section>
    </main>
  </HydrationBoundary>
  )
}
