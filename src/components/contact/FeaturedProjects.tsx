'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// ============================================================================
// Static Data
// ============================================================================

const featuredProjects = [
  {
    title: 'Revenue Operations Center',
    description: 'Unified RevOps platform with 96.8% forecast accuracy',
    image: '/images/projects/revenue-operations.jpg',
    href: '/projects/revenue-operations-center',
  },
  {
    title: 'Lead Attribution System',
    description: 'Multi-touch attribution with ROI tracking',
    image: '/images/projects/lead-attribution.jpg',
    href: '/projects/lead-attribution',
  },
  {
    title: 'Commission Optimization',
    description: 'Automated commission tracking with $240K savings',
    image: '/images/projects/commission-dashboard.jpg',
    href: '/projects/commission-optimization',
  },
] as const

// ============================================================================
// Component
// ============================================================================

export function FeaturedProjects() {
  return (
    <div className="space-y-4">
      <h4 className="typography-large text-primary font-display">Featured Work</h4>
      <div className="space-y-3">
        {featuredProjects.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="flex items-center gap-4 p-3 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-300 group"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-foreground text-sm truncate">{project.title}</h5>
              <p className="typography-small text-muted-foreground truncate">{project.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
