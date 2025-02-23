import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { Button } from "@/components/ui/button"
import { getProjects } from "@/lib/projects/actions"
import { ProjectList } from "@/components/admin/projects/project-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ProjectsAdminPage() {
  const { projects } = await getProjects()

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="Manage your portfolio projects.">
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </DashboardHeader>

      <ProjectList initialProjects={projects} />
    </DashboardShell>
  )
}

