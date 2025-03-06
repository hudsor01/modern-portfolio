import { getProjects } from '@/lib/data/projects'

// Import original components until MUI is installed
import { HeroSection } from '@/components/hero-section-fixed'
import { AchievementsSection } from '@/components/achievements-section'
import { FeaturedProjectsSection } from '@/components/featured-projects-section-updated'
import { TestimonialsSection } from '@/components/testimonials-section-updated'
import { SkillsSection } from '@/components/skills-section'
import { CTASection } from '@/components/cta-section'

export const metadata = {
  title: 'Richard Hudson | Revenue Operations Professional',
  description: 'Driving business growth through data-driven insights, process optimization, and strategic operational improvements.',
}

export default async function HomePage() {
  // Fetch projects data
  const projects = await getProjects();
  const featuredProjects = projects.filter(project => project.featured);
  
  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection
        titles={[
          'Revenue Operations Professional',
          'Data Analytics Expert',
          'Process Optimization Specialist',
          'Business Intelligence Strategist'
        ]}
      />

      {/* Achievements Section */}
      <AchievementsSection />

      {/* Featured Projects Section */}
      <FeaturedProjectsSection projects={featuredProjects} />
      
      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* CTA Section */}
      <CTASection />
    </main>
  )
}
