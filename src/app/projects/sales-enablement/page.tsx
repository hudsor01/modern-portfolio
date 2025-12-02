'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Users, Zap, Award, BookOpen } from 'lucide-react'
import { m as motion } from 'framer-motion'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'

export default function SalesEnablementProject() {
  const [_isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TIMING_CONSTANTS.LOADING_STATE_RESET)
    return () => clearTimeout(timer)
  }, [])

  const metrics = [
    { label: 'Win Rate Increase', value: '34%', icon: TrendingUp, color: 'text-success' },
    { label: 'Ramp Time Reduction', value: '45%', icon: Zap, color: 'text-primary' },
    { label: 'Sales Team Size', value: '125', icon: Users, color: 'text-purple-500' },
    { label: 'Content Pieces Created', value: '450+', icon: BookOpen, color: 'text-amber-500' },
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

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/70 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>

            <h1 className="text-5xl font-bold text-foreground mb-4">
              Sales Enablement & Coaching Platform
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl">
              Transformed sales team performance through structured training, real-time coaching, and continuous skill development. Increased win rates by 34% and reduced ramp time by 45%.
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div
                  key={metric.label}
                  className="glass rounded-xl p-6 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                  <div className="text-sm text-slate-400">{metric.label}</div>
                </div>
              )
            })}
          </motion.div>

          {/* Key Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Implementation Pillars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {keyPillars.map((pillar, index) => (
                <div
                  key={index}
                  className="glass rounded-xl p-8 hover:border-primary/50 transition-all"
                >
                  <h3 className="text-xl font-bold text-foreground mb-3">{pillar.title}</h3>
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
          </motion.div>

          {/* Impact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-primary/30 rounded-xl p-12 mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Business Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-success mb-2">34%</div>
                <p className="text-slate-300">Increase in deal win rates across all sales teams</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">45%</div>
                <p className="text-slate-300">Reduction in new hire ramp time to full productivity</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">82%</div>
                <p className="text-slate-300">Adoption rate for coaching materials within 3 months</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-400 mb-2">$3.2M</div>
                <p className="text-slate-300">Additional revenue attributed to improved sales skills</p>
              </div>
            </div>
          </motion.div>

          {/* Skills & Learnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Skills & Learnings</h2>
            <div className="glass rounded-xl p-8">
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
          </motion.div>

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Technologies & Tools</h2>
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
          </motion.div>
        </div>
      </div>
    </>
  )
}
