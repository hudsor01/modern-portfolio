'use client'

import { useState } from 'react'
import { m as motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag, ExternalLink, TrendingUp, Users, Settings, BarChart } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ContactModal } from '@/components/ui/contact-modal'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProjectJsonLd } from '@/components/seo/json-ld'

const project = {
  id: 'partnership-program-implementation',
  title: 'Enterprise Partnership Program Implementation',
  description: 'Led comprehensive design and implementation of a company\'s first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals, resulting in a highly successful channel program that became integral to company revenue strategy.',
  image: '/images/projects/partner-analytics.jpg',
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
      
      <main className="min-h-screen bg-[#0f172a] text-white pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Back Navigation */}
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Projects
              </Link>

              {/* Project Header */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>May 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    <span>{project.category}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
                  {project.title}
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
                  {project.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-200"
                  >
                    <ExternalLink className="mr-2" size={20} />
                    View Demo
                  </Link>
                  
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                  >
                    <SiGithub className="mr-2" size={20} />
                    View Code
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project Image */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden"
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
            </motion.div>
          </div>
        </section>

        {/* Key Achievements */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Key Achievements
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Strategic implementation results and business impact
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="text-blue-400 mb-4">
                      {achievement.icon}
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-white">{achievement.value}</div>
                      <div className="text-sm font-medium text-blue-400">{achievement.metric}</div>
                      <div className="text-sm text-gray-400 leading-relaxed">{achievement.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Technical Implementation
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Production-ready systems and integrations built from the ground up
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {technicalDetails.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">{detail.title}</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">{detail.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {detail.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Professional Narrative Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl space-y-16">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-6">
                Challenge
              </h2>
              <div className="space-y-4 text-gray-300">
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
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">
                Solution
              </h2>
              <div className="space-y-6 text-gray-300">
                <p className="text-lg leading-relaxed">
                  Led the complete design and implementation of the company's first enterprise partnership program from concept to production, creating a comprehensive channel management system:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="font-semibold text-green-400 mb-4">Program Architecture</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Multi-tier partner classification system</li>
                      <li>Automated onboarding with document verification</li>
                      <li>Training and certification requirements</li>
                      <li>Performance-based tier advancement</li>
                      <li>Partner portal with self-service capabilities</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="font-semibold text-blue-400 mb-4">Technical Integration</h3>
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
            </motion.div>

            {/* Results & Impact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-6">
                Results & Impact
              </h2>
              <div className="space-y-6 text-gray-300">
                <p className="text-lg leading-relaxed">
                  The partnership program became a strategic revenue channel, fundamentally transforming the company's go-to-market approach and establishing a scalable growth engine:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">47</div>
                    <div className="text-sm text-gray-300">Active Partners Onboarded</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">90%+</div>
                    <div className="text-sm text-gray-300">Process Automation</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">35%</div>
                    <div className="text-sm text-gray-300">Revenue Growth from Partners</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2">15 Days</div>
                    <div className="text-sm text-gray-300">Average Onboarding Time</div>
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
            </motion.div>

            {/* Key Learnings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
                Key Learnings
              </h2>
              <div className="space-y-4 text-gray-300">
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
                    <h3 className="font-semibold text-blue-400">Implementation Insights</h3>
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
            </motion.div>

            {/* Technologies Used */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur border border-gray-500/20 rounded-3xl p-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-300 mb-6">
                Technologies Used
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'Salesforce CRM', 'DocuSign API', 'Custom Workflows', 'REST APIs',
                  'Webhooks', 'Database Design', 'Payment Integration', 'React',
                  'TypeScript', 'Data Visualization', 'Automated Testing', 'API Security'
                ].map((tech, index) => (
                  <span key={index} className="bg-white/10 text-gray-300 px-3 py-2 rounded-lg text-sm text-center border border-white/20 hover:bg-white/20 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 }}
              className="text-center space-y-8"
            >
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-6">
                  Interested in Partnership Program Development?
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Ready to build a successful partnership program for your organization? Let's discuss how we can create a strategic channel program that drives revenue growth.
                </p>
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  <TrendingUp className="mr-2" size={20} />
                  Discuss Your Partnership Strategy
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}