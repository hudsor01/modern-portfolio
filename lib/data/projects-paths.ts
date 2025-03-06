// Map of project IDs to static path strings
// This avoids dynamic path construction in Link components
export const projectPaths: Record<string, string> = {
  // Your actual project paths based on the project folders
  'churn-retention': '/projects/churn-retention',
  'deal-funnel': '/projects/deal-funnel',
  'lead-attribution': '/projects/lead-attribution',
  'revenue-kpi': '/projects/revenue-kpi',
  // Fallback for any other projects
  default: '/projects',
}

export function getProjectPath(id: string): string {
  return projectPaths[id] || `/projects/${id}`
}
