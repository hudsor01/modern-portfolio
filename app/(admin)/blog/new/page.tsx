import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { AdminSidebar } from "@/components/admin/sidebar"
import { BlogPostEditor } from "@/components/admin/blog/blog-post-editor"

export default function NewBlogPostPage() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen p-8">
        <DashboardShell>
          <DashboardHeader heading="New Blog Post" text="Create a new blog post." />
          <div className="grid gap-8">
            <BlogPostEditor />
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}

