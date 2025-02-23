import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { ProjectList } from "@/components/dashboard/project-list"
import { ProjectsTableSkeleton } from "@/components/dashboard/projects-table-skeleton"

export const metadata = {
  title: "Projects",
  description: "Manage your portfolio projects",
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader heading="Projects" text="Create and manage your portfolio projects." />
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>
      <Suspense fallback={<ProjectsTableSkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}

