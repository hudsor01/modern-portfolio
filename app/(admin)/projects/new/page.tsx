import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { AdminSidebar } from "@/components/admin/sidebar"
import { ProjectEditor } from "@/components/admin/projects/project-editor"

export default function NewProjectPage() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen p-8">
        <DashboardShell>
          <DashboardHeader heading="New Project" text="Add a new project to your portfolio." />
          <div className="grid gap-8">
            <ProjectEditor />
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}

