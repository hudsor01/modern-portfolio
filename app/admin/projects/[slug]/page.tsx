import { notFound } from "next/navigation"
import { getProject } from "@/lib/actions/projects"
import { ProjectEditor } from "@/components/dashboard/project-editor"
import { PageHeader } from "@/components/ui/page-header"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = params.slug === "new" ? null : await getProject(params.slug)

  if (params.slug !== "new" && !project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading={project ? "Edit Project" : "New Project"}
        text={project ? "Edit your project." : "Create a new project."}
      />
      <ProjectEditor project={project} />
    </div>
  )
}

