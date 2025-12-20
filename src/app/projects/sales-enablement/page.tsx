'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Zap, Award, BookOpen } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { TIMING } from '@/lib/constants/spacing'
import { ProjectJsonLd } from '@/components/seo/json-ld'

export default function SalesEnablementProject() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), TIMING.LOADING_STATE_RESET)
  }

  const metrics = [
    { label: 'Win Rate Increase', value: '34%', icon: TrendingUp, color: 'text-success' },
    { label: 'Ramp Time Reduction', value: '45%', icon: Zap, color: 'text-primary' },
    { label: 'Sales Team Size', value: '125', icon: Users, color: 'text-secondary' },
    { label: 'Content Pieces Created', value: '450+', icon: BookOpen, color: 'text-primary' },
  ]

  const keyPillars = [
    {
      title: 'Skills Assessment & Development',
      description: 'Comprehensive assessment of sales skills across all stages and industries, with personalized development plans',
      achievements: [
        '45% faster ramp time for new hires',
        'Identified 8 core competencies requiring focus',
        'Created role-specific development tracks'
      ]
    },
    {
      title: 'Content & Playbook Development',
      description: '450+ pieces of multi-format content including videos, case studies, battle cards, and industry-specific playbooks',
      achievements: [
        '82% adoption rate within 3 months',
        'Real-time coaching library integrated with CRM',
        'Updated quarterly based on market feedback'
      ]
    },
    {
      title: 'Manager Coaching & Enablement',
      description: 'Equipped sales managers with coaching frameworks and tools to drive team performance and development',
      achievements: [
        '28% reduction in sales turnover',
        '3.2M additional revenue from improved coaching',
        'Manager satisfaction score: 4.7/5'
      ]
    },
    {
      title: 'Peer Learning Community',
      description: 'Created communities where sales professionals share wins, learn from peers, and celebrate successes',
      achievements: [
        '5,000+ peer interactions monthly',
        'Top performers recognized and featured',
        'Knowledge retention improved by 40%'
      ]
    }
  ]

  return (
    <>
      <ProjectJsonLd
        title="Sales Enablement & Coaching Platform"
        description="Sales enablement platform that improved win rates by 34% and reduced ramp time by 45%"
        slug="sales-enablement"
        category="Sales Operations"
        tags={['Sales Enablement', 'Training', 'Coaching', 'Sales Operations']}
      />

      <ProjectPageLayout
        title="Sales Enablement & Coaching Platform"
        description="Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45%."
        tags={[
          { label: 'Win Rate: +34%', color: 'bg-primary/20 text-primary' },
          { label: 'Ramp Time: -45%', color: 'bg-secondary/20 text-secondary' },
          { label: '125 Sales Team Members', color: 'bg-primary/20 text-primary' },
          { label: '450+ Content Pieces', color: 'bg-secondary/20 text-secondary' },
        ]}
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Key Metrics */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {metrics.map((metric) => {
                const Icon = metric.icon
                return (
                  <div
                    key={metric.label}
                    className="glass rounded-2xl p-6 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`h-8 w-8 ${metric.color}`} />
                    </div>
                    <div className="typography-h2 border-none pb-0 text-2xl text-foreground mb-2">{metric.value}</div>
                    <div className="text-sm text-slate-400">{metric.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Key Pillars */}
            <div
              className="mb-16"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl text-foreground mb-8">Implementation Pillars</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {keyPillars.map((pillar, index) => (
                  <div
                    key={index}
                    className="glass rounded-2xl p-8 hover:border-primary/50 transition-all"
                  >
                    <h3 className="typography-h4 text-foreground mb-3">{pillar.title}</h3>
                    <p className="text-slate-300 mb-6">{pillar.description}</p>
                    <ul className="space-y-2">
                      {pillar.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="text-success mt-1">✓</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Section */}
            <div
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-primary/30 rounded-xl p-12 mb-16"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl text-foreground mb-8">Business Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="typography-h1 text-xl text-success mb-2">34%</div>
                  <p className="text-slate-300">Increase in deal win rates across all sales teams</p>
                </div>
                <div>
                  <div className="typography-h1 text-xl text-primary mb-2">45%</div>
                  <p className="text-slate-300">Reduction in new hire ramp time to full productivity</p>
                </div>
                <div>
                  <div className="typography-h1 text-xl text-secondary mb-2">82%</div>
                  <p className="text-slate-300">Adoption rate for coaching materials within 3 months</p>
                </div>
                <div>
                  <div className="typography-h1 text-xl text-primary mb-2">$3.2M</div>
                  <p className="text-slate-300">Additional revenue attributed to improved sales skills</p>
                </div>
              </div>
            </div>

            {/* Skills & Learnings */}
            <div
              className="mb-16"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl text-foreground mb-8">Skills & Learnings</h2>
              <div className="glass rounded-2xl p-8">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Building scalable learning systems for high-growth sales teams',
                    'Understanding psychology of adult learning and behavior change',
                    'Creating engaging content that drives adoption',
                    'Measuring training ROI and linking to business outcomes',
                    'Change management and overcoming resistance',
                    'Advanced coaching techniques for leaders'
                  ].map((skill, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300">
                      <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technologies */}
            <div
              className="mb-16"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl text-foreground mb-8">Technologies & Tools</h2>
              <div className="flex flex-wrap gap-3">
                {['React', 'Next.js', 'TypeScript', 'Recharts', 'Tailwind CSS', 'PostgreSQL', 'Node.js', 'Learning Management System'].map((tech) => (
                  <span
                    key={tech}
                    className="bg-primary-hover/20 border border-primary/50 rounded-full px-4 py-2 text-sm text-primary/70 hover:bg-primary-hover/30 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
