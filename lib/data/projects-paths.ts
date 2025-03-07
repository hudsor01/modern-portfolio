import type { Route } from 'next';
import { asRoute } from '@/lib/utils';

// Map of project IDs to static path strings
// This avoids dynamic path construction in Link components
export const projectPaths: Record<string, Route<string>> = {
  // Your actual project paths based on the project folders
  'churn-retention': asRoute('/projects/churn-retention'),
  'deal-funnel': asRoute('/projects/deal-funnel'),
  'lead-attribution': asRoute('/projects/lead-attribution'),
  'revenue-kpi': asRoute('/projects/revenue-kpi'),
  // Fallback for any other projects
  default: asRoute('/projects'),
};

export function getProjectPath(id: string): Route<string> {
  return projectPaths[id] || asRoute(`/projects/${id}`);
}
