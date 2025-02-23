export const dashboardConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Posts",
      href: "/dashboard/posts",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
    },
  ],
  sidebarNav: [
    {
      title: "Posts",
      href: "/dashboard/posts",
      icon: "post",
    },
    {
      title: "Pages",
      href: "/dashboard/pages",
      icon: "page",
    },
    {
      title: "Media",
      href: "/dashboard/media",
      icon: "media",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}

export type DashboardConfig = typeof dashboardConfig

