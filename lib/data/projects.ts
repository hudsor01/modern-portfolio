import fs from 'fs';
import path from 'path';
import { cache } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  featured?: boolean;
  features?: string[];
}

// Load project data from filesystem instead of hardcoding
export const getProjects = cache((): Project[] => {
  try {
    const projectsDirectory = path.join(process.cwd(), 'app', '(marketing)', 'projects');

    // Get all directories inside projects folder, excluding files and special directories
    const projectFolders = fs.readdirSync(projectsDirectory, { withFileTypes: true })
      .filter(dirent =>
        dirent.isDirectory() &&
        !dirent.name.startsWith('.') &&
        !['project-carousel.tsx', 'project-quick-view.tsx'].includes(dirent.name)
      )
      .map(dirent => dirent.name);

    // Load project metadata from each folder
    const projects = projectFolders.map(folder => {
      const projectId = folder;

      // Try to load project metadata (you can create a metadata.json in each project folder)
      let metadata: Partial<Project> = {};
      const metadataPath = path.join(projectsDirectory, folder, 'metadata.json');

      if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      }

      // Default values if metadata.json doesn't exist or is incomplete
      return {
        id: projectId,
        title: metadata.title || startCase(projectId.replace(/-/g, ' ')),
        description: metadata.description || 'A portfolio project',
        image: metadata.image || `/images/projects/${projectId}.jpg`,
        liveUrl: metadata.liveUrl,
        githubUrl: metadata.githubUrl,
        technologies: metadata.technologies || [],
        featured: metadata.featured !== undefined ? metadata.featured : true,
        features: metadata.features || []
      };
    });

    return projects;
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
});

export function getProjectById(id: string): Project | undefined {
  return getProjects().find(project => project.id === id);
}

// Helper function to convert slug to title case
function startCase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
