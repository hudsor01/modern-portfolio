import { LayoutDashboard, FileText, Folder, Settings, BarChart } from "lucide-react"

export const dashboardConfig = {
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Blog Posts",
      href: "/dashboard/posts",
      icon: FileText,
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: Folder,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ],
}

