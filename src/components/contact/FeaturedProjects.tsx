'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Briefcase } from 'lucide-react'

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
    <div className="glass rounded-2xl p-8">
      <h3 className="typography-h4 mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" />
        Featured Work
      </h3>
      <div className="space-y-4">
        {featuredProjects.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all duration-300 ease-out group"
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
              <span className="font-medium text-foreground">{project.title}</span>
              <div className="typography-small text-muted-foreground truncate">{project.description}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
