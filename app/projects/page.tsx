import { Metadata } from 'next'
import { getProjects } from '@/lib/data/projects'
import { ProjectsTypewriter } from '@/components/projects-typewriter'
import { ProjectFiltersEnhanced } from '@/components/project-filters-enhanced'
import { CTASection } from '@/components/cta-section'
import { SectionContainer } from '@/components/ui/section-container'

export const metadata: Metadata = {
  title: 'Projects | Richard Hudson',
  description: 'Explore data analytics dashboards, interactive visualizations and revenue optimization solutions by Richard Hudson.',
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  // Witty typewriter titles
  const typewriterPhrases = [
    "Visualization Showcase",
    "Data-Driven Solutions",
    "Analytics Portfolio",
    "Revenue Insights",
    "Business Intelligence Projects"
  ]

  return (
    <main className="pb-10">
      {/* Hero Section with Typewriter */}
      <section className="section-bg-secondary py-16 mb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            {/* Typewriter Effect */}
            <div className="mb-4 flex justify-center">
              <ProjectsTypewriter phrases={typewriterPhrases} />
            </div>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Interactive dashboards and visualizations showcasing data-driven insights
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <SectionContainer variant="primary" className="py-0">
        <ProjectFiltersEnhanced projects={projects} />
      </SectionContainer>
      
      {/* CTA Section moved from homepage */}
      <section className="section-bg-secondary mt-20">
        <CTASection />
      </section>
    </main>
  )
}