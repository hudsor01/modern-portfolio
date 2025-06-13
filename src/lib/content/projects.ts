import { cache } from 'react'
import projectsData from '@/content/projects.json'
import type { Project } from '@/types/project'

// Re-export the Project type for components to use
export type { Project }

// Define a type for the raw project data from JSON.
// This should align with the structure of projects.json and be mapped to the canonical Project type.
// For simplicity, let's assume projects.json is an array of objects that are mostly compatible
// with the canonical Project type, but may need some transformation (e.g., for dates, metrics).
type RawJsonProject = Omit<Project, 'createdAt' | 'updatedAt' | 'date' | 'metrics' | 'charts' | 'details' | 'testimonial' | 'gallery'> & {
  // Fields from JSON that might need transformation or are not directly in canonical Project
  date?: string; // Assuming date in JSON is string
  createdAt?: string; // Assuming createdAt in JSON is string
  updatedAt?: string; // Assuming updatedAt in JSON is string
  // Add other fields from JSON that are not directly in canonical Project or need transformation
  // For example, if your JSON has 'project_metrics' instead of 'metrics'
  metrics?: Record<string, unknown>; // Allow any value type in metrics initially
  charts?: Array<{ // Assuming this structure is in JSON and matches canonical or needs mapping
    type: 'line' | 'bar' | 'pie' | 'funnel' | 'heatmap';
    title: string;
    dataKey: string;
  }>;
  details?: { // Assuming this structure is in JSON
    challenge: string;
    solution: string;
    impact: string;
  };
  // Testimonial and gallery might be more complex and require specific mapping if they exist in JSON
};


// Cache the getProjects function for the duration of the request
export const getProjects = cache(async (): Promise<Project[]> => {
  const rawProjects = projectsData.projects as RawJsonProject[];

  return rawProjects.map((rawProject: RawJsonProject) => {
    // Perform mapping from RawJsonProject to the canonical Project type
    const project: Project = {
      ...rawProject,
      id: rawProject.id, // Ensure all required fields from canonical Project are present
      title: rawProject.title,
      slug: rawProject.slug,
      description: rawProject.description,
      featured: rawProject.featured || false, // Ensure boolean
      category: rawProject.category || 'Uncategorized', // Provide default if necessary
      // Dates: Convert string dates from JSON to Date objects for canonical type
      createdAt: rawProject.createdAt ? new Date(rawProject.createdAt) : new Date(), // Default or handle error
      updatedAt: rawProject.updatedAt ? new Date(rawProject.updatedAt) : undefined,
      date: rawProject.date ? (typeof rawProject.date === 'string' ? new Date(rawProject.date) : rawProject.date) : undefined,
      // Ensure optional fields are handled
      image: rawProject.image,
      link: rawProject.link,
      github: rawProject.github,
      tags: rawProject.tags || [],
      technologies: rawProject.technologies || [],
      liveUrl: rawProject.liveUrl,
      githubUrl: rawProject.githubUrl,
      client: rawProject.client,
      role: rawProject.role,
      content: rawProject.content,
      longDescription: rawProject.longDescription,
      // Map metrics, charts, and details from JSON
      metrics: rawProject.metrics as Record<string, string>,
      details: rawProject.details,
      charts: rawProject.charts,
    };
    // Remove any fields from rawProject that are not in the canonical Project type if spread syntax includes them
    // Or ensure RawJsonProject only contains fields that can be spread or are explicitly mapped.
    return project;
  });
})

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  const projects = await getProjects()
  return projects.find(p => p.slug === slug) || null
})

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = await getProjects()
  return projects.filter(p => p.featured)
})

export const getProjectsByCategory = cache(async (category: string): Promise<Project[]> => {
  const projects = await getProjects()
  return projects.filter(p => p.category === category)
})

export const getCategories = cache(async (): Promise<string[]> => {
  const projects = await getProjects()
  const categories = new Set(projects.map(p => p.category))
  return Array.from(categories)
})
