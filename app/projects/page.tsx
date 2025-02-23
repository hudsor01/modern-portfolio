import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/data/projects"

export default function ProjectsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tighter md:text-6xl">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground">A collection of my work, side projects, and contributions.</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </div>
    </div>
  )
}

