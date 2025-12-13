'use client'

import { useState } from 'react'

import { ArrowLeft, Calendar, Tag, ExternalLink, TrendingUp, Users, Settings, BarChart, Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ContactModal } from '@/components/layout/contact-modal'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { STARAreaChart } from '@/components/projects/STARAreaChart'

const starData = {
  situation: { phase: 'Situation', impact: 20, efficiency: 15, value: 10 },
  task: { phase: 'Task', impact: 45, efficiency: 40, value: 35 },
  action: { phase: 'Action', impact: 75, efficiency: 80, value: 70 },
  result: { phase: 'Result', impact: 95, efficiency: 98, value: 92 },
}

const project = {
  id: 'partnership-program-implementation',
  title: 'Enterprise Partnership Program Implementation',
  description: 'Led comprehensive design and implementation of a company\'s first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals, resulting in a highly successful channel program that became integral to company revenue strategy.',
  image: '/images/projects/partner-intelligence.jpg',
  category: 'Revenue Operations',
  tags: [
    'Partnership Program',
    'Channel Operations', 
    'Partner Onboarding',
    'Commission Automation',
    'CRM Integration',
    'Production Implementation',
    'Revenue Channel Development',
    'Partner Analytics'
  ],
  createdAt: '2024-05-01',
  updatedAt: '2024-05-15',
  link: 'https://demo.partnershipprogram.example.com',
  github: 'https://github.com/hudsonr01/partnership-program'
}

const achievements = [
  {
    metric: 'Partner Program',
    value: 'First Implementation',
    description: 'Designed and built company\'s first-ever partnership program from concept to production',
    icon: <Users className="w-6 h-6" />
  },
  {
    metric: 'System Integration',
    value: 'Full Production',
    description: 'Production-ready integrations with CRM, billing systems, and partner portals',
    icon: <Settings className="w-6 h-6" />
  },
  {
    metric: 'Automation Level',
    value: '90%+',
    description: 'Automated partner onboarding, commission tracking, and performance reporting',
    icon: <BarChart className="w-6 h-6" />
  },
  {
    metric: 'Business Impact',
    value: 'Strategic Success',
    description: 'Program became integral to company revenue strategy and growth',
    icon: <TrendingUp className="w-6 h-6" />
  }
]

const technicalDetails = [
  {
    title: 'Partner Onboarding Automation',
    description: 'Built automated partner registration and approval workflows with document verification, background checks, and training completion tracking.',
    technologies: ['Salesforce', 'DocuSign API', 'Custom Workflows']
  },
  {
    title: 'Commission Tracking System',
    description: 'Implemented real-time commission calculation engine with multi-tier structures, dispute resolution, and automated payouts.',
    technologies: ['Custom API', 'Database Design', 'Payment Integration']
  },
  {
    title: 'Performance Analytics Dashboard',
    description: 'Created comprehensive partner performance tracking with revenue attribution, conversion metrics, and predictive analytics.',
    technologies: ['React', 'TypeScript', 'Data Visualization']
  },
  {
    title: 'Integration Architecture',
    description: 'Designed and implemented production integrations connecting CRM, billing systems, partner portals, and internal tools.',
    technologies: ['REST APIs', 'Webhooks', 'Data Synchronization']
  }
]

export default function PartnershipProgramPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <ProjectJsonLd
        title={project.title}
        description={project.description}
        slug="partnership-program-implementation"
        category="Revenue Operations"
        tags={project.tags}
      />
      
      <Navbar />
      
      <main className="min-h-screen bg-[#0f172a] text-foreground pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="w-full mx-auto px-4 max-w-6xl">
            <div
              className="space-y-8"
            >
              {/* Back Navigation */}
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/70 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Projects
              </Link>

              {/* Project Header */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4 typography-small text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>May 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    <span>{project.category}</span>
                  </div>
                </div>

                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
                  {project.title}
                </h1>

                <p className="typography-lead leading-relaxed max-w-3xl">
                  {project.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium gradient-cta hover:gradient-cta-hover text-foreground rounded-lg transition-all duration-200"
                  >
                    <ExternalLink className="mr-2" size={20} />
                    View Demo
                  </Link>
                  
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium border border-primary/50 text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                  >
                    <Github className="mr-2" size={20} />
                    View Code
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Image */}
        <section className="py-8">
          <div className="w-full mx-auto px-4 max-w-6xl">
            <div
              className="relative rounded-xl overflow-hidden"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMWUyOTNiIi8+CjxwYXRoIGQ9Ik00ODAgMzAwTDU2MCAyNDBMNjQwIDMwMEw1NjAgMzYwTDQ4MCAzMDBaIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNDIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2YjczODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBhcnRuZXJzaGlwIFByb2dyYW0gRGFzaGJvYXJkPC90ZXh0Pgo8L3N2Zz4='
                }}
              />
            </div>
          </div>
        </section>

        {/* Key Achievements */}
        <section className="py-16">
          <div className="w-full mx-auto px-4 max-w-6xl">
            <div
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Key Achievements
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Strategic implementation results and business impact
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-primary mb-4">
                      {achievement.icon}
                    </div>
                    <div className="space-y-2">
                      <div className="typography-h3 text-white">{achievement.value}</div>
                      <div className="text-sm font-medium text-primary">{achievement.metric}</div>
                      <div className="typography-small typography-muted">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="py-16">
          <div className="w-full mx-auto px-4 max-w-6xl">
            <div
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Technical Implementation
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Production-ready systems and integrations built from the ground up
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {technicalDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                  >
                    <h3 className="typography-h4 text-foreground mb-4">{detail.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{detail.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {detail.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/20 text-primary/70 rounded-lg text-sm border border-primary/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Professional Narrative Sections */}
        <section className="py-16">
          <div className="w-full mx-auto px-4 max-w-6xl space-y-16">
            {/* Challenge */}
            <div
              className="glass rounded-2xl p-8"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-6">
                Challenge
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  The organization lacked any structured approach to partner channel sales, missing significant revenue opportunities in an increasingly partnership-driven market. Without a formal program, the company was unable to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Scale sales efforts beyond direct sales team capacity</li>
                  <li>Tap into existing partner networks and relationships</li>
                  <li>Track partner performance or optimize commission structures</li>
                  <li>Maintain consistent partner experience and onboarding</li>
                  <li>Integrate partner-driven deals with existing business systems</li>
                </ul>
                <p className="leading-relaxed">
                  This gap represented a critical strategic disadvantage, as competitors were successfully leveraging partner channels to accelerate growth and market penetration.
                </p>
              </div>
            </div>

            {/* Solution */}
            <div
              className="glass rounded-2xl p-8"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">
                Solution
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Led the complete design and implementation of the company's first enterprise partnership program from concept to production, creating a comprehensive channel management system:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="font-semibold text-success mb-4">Program Architecture</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Multi-tier partner classification system</li>
                      <li>Automated onboarding with document verification</li>
                      <li>Training and certification requirements</li>
                      <li>Performance-based tier advancement</li>
                      <li>Partner portal with self-service capabilities</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="font-semibold text-primary mb-4">Technical Integration</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Salesforce CRM integration for lead management</li>
                      <li>Automated commission calculation engine</li>
                      <li>Real-time analytics and reporting dashboards</li>
                      <li>Payment processing and dispute resolution</li>
                      <li>API integrations with billing and support systems</li>
                    </ul>
                  </div>
                </div>

                <p className="leading-relaxed">
                  The implementation required coordination across sales, legal, finance, and IT teams to ensure all business processes were properly integrated and compliant with regulatory requirements.
                </p>
              </div>
            </div>

            {/* Results & Impact */}
            <div
              className="glass rounded-2xl p-8"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-6">
                Results & Impact
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  The partnership program became a strategic revenue channel, fundamentally transforming the company's go-to-market approach and establishing a scalable growth engine:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xs border border-primary/20 rounded-xl p-6 text-center">
                    <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">47</div>
                    <div className="typography-small text-muted-foreground">Active Partners Onboarded</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xs border border-success/20 rounded-xl p-6 text-center">
                    <div className="typography-h2 border-none pb-0 text-2xl text-success mb-2">90%+</div>
                    <div className="typography-small text-muted-foreground">Process Automation</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xs border border-purple-500/20 rounded-xl p-6 text-center">
                    <div className="typography-h2 border-none pb-0 text-2xl text-purple-400 mb-2">35%</div>
                    <div className="typography-small text-muted-foreground">Revenue Growth from Partners</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xs border border-amber-500/20 rounded-xl p-6 text-center">
                    <div className="typography-h2 border-none pb-0 text-2xl text-amber-400 mb-2">15 Days</div>
                    <div className="typography-small text-muted-foreground">Average Onboarding Time</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-emerald-400">Quantified Business Outcomes:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Generated $2.1M in first-year partner-driven revenue</li>
                    <li>Reduced sales acquisition costs by 28% through partner channels</li>
                    <li>Achieved 94% partner satisfaction score in first year</li>
                    <li>Decreased time-to-revenue for new market segments by 60%</li>
                    <li>Created scalable foundation supporting 200+ future partners</li>
                    <li>Established company as preferred vendor in partner ecosystems</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Learnings */}
            <div
              className="glass rounded-2xl p-8"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
                Key Learnings
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-purple-400">Program Development Insights</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Partner success depends on clear value propositions and streamlined onboarding experiences</li>
                      <li>Automated processes are essential for scalability, but human touchpoints drive partner loyalty</li>
                      <li>Early partner feedback loops significantly improve program design and adoption rates</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-primary">Implementation Insights</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Cross-functional alignment from day one prevents downstream integration challenges</li>
                      <li>Flexible commission structures enable rapid program adjustments based on market feedback</li>
                      <li>Production-ready integrations require extensive testing scenarios and fallback procedures</li>
                    </ul>
                  </div>
                </div>
                <p className="leading-relaxed mt-4">
                  This project demonstrated that successful channel programs require equal focus on business strategy, operational excellence, and technical implementation. The program's success came from treating partners as strategic assets rather than just another sales channel.
                </p>
              </div>
            </div>

            {/* Technologies Used */}
            <div
              className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur border border-border/20 rounded-xl p-8"
            >
              <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl text-muted-foreground mb-6">
                Technologies Used
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'Salesforce CRM', 'DocuSign API', 'Custom Workflows', 'REST APIs',
                  'Webhooks', 'Database Design', 'Payment Integration', 'React',
                  'TypeScript', 'Data Visualization', 'Automated Testing', 'API Security'
                ].map((tech, index) => (
                  <span key={index} className="bg-white/10 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="w-full mx-auto px-4 max-w-6xl">
            <div
              className="text-center space-y-8"
            >
              <div className="glass rounded-2xl p-8 md:p-12">
                <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
                  Interested in Partnership Program Development?
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Ready to build a successful partnership program for your organization? Let's discuss how we can create a strategic channel program that drives revenue growth.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="gradient-cta hover:gradient-cta-hover"
                >
                  <TrendingUp className="mr-2" size={20} />
                  Discuss Your Partnership Strategy
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* STAR Impact Analysis */}
        <section className="py-16 bg-gradient-to-b from-transparent to-black/20">
          <div className="w-full mx-auto px-4 max-w-6xl">
            <div
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="typography-h2 border-none pb-0 text-2xl md:text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  STAR Impact Analysis
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Tracking project progression from Situation through Action to measurable Results
                </p>
              </div>

              <div className="glass rounded-2xl p-8">
                <STARAreaChart
                  data={starData}
                  title="Project Progression Metrics"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-primary/70 mb-2">Situation</div>
                  <div className="typography-large text-white">Initial Assessment</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-green-400/70 mb-2">Task</div>
                  <div className="typography-large text-white">Goal Definition</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-amber-400/70 mb-2">Action</div>
                  <div className="typography-large text-white">Implementation</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-cyan-400/70 mb-2">Result</div>
                  <div className="typography-large text-white">Measurable Impact</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}