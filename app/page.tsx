import { HeroSection } from "@/components/sections/hero-section"
import { SkillsShowcase } from "@/components/sections/skills-showcase"
import { ProjectsGrid } from "@/components/sections/projects-grid"
import { projects } from "@/lib/data/projects"

export default function HomePage() {
  return (
    <div className="space-y-24 pb-8">
      <HeroSection />
      <SkillsShowcase />
      <section className="container px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
        <ProjectsGrid projects={projects} />
      </section>
    </div>
  )
}

