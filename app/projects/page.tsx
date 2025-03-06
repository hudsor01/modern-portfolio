import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getProjects } from '@/lib/data/projects'
import { ArrowRight, Filter } from 'lucide-react'
import { ProjectFilters } from './project-filters'

export const metadata: Metadata = {
  title: 'Projects | Richard Hudson',
  description: 'Explore projects by Richard Hudson in revenue operations and business analytics.',
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore my work in revenue operations, data visualization, and business analytics
          </p>
        </div>

        <ProjectFilters projects={projects} />
      </div>
    </main>
  )
}