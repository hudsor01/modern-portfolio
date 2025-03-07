import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchFeaturedProjects, fetchProjectById, Project } from '@/lib/api';

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
}

export function useFeaturedProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects', 'featured'],
    queryFn: fetchFeaturedProjects,
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id, // Only fetch when id is available
  });
}
