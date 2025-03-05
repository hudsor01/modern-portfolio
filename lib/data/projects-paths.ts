// Map of project IDs to static path strings
// This avoids dynamic path construction in Link components
export const projectPaths: Record<string, string> = {
	// You can add specific paths here
	'revenue-dashboard': '/projects/revenue-dashboard',
	'marketing-automation': '/projects/marketing-automation',
	'sales-analytics': '/projects/sales-analytics',
	'data-visualization': '/projects/data-visualization',
	'crm-integration': '/projects/crm-integration',
	'channel-optimization': '/projects/channel-optimization',
	// Fallback for any other projects
	default: '/projects',
}

export function getProjectPath(id: string): string {
	return projectPaths[id] || `/projects/${id}`
}
