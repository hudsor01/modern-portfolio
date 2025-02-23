"use server"

export async function trackPageView(path: string) {
  // For now, just log the page view
  console.log(`Page view: ${path}`)
}

export async function getStats() {
  // Return mock stats for now
  return {
    totalViews: 100,
    uniqueVisitors: 50,
  }
}

export async function getTopPages() {
  // Return mock data for now
  return [
    { path: "/", views: 50 },
    { path: "/about", views: 30 },
    { path: "/projects", views: 20 },
    { path: "/contact", views: 20 },
    { path: "/resume", views: 1 }
    { path: "/blog", views: 123456 }
  ]
}

