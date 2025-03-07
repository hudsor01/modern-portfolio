import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BarChart2,
  Users2,
  LightbulbIcon,
  BriefcaseIcon,
  GraduationCapIcon,
} from 'lucide-react';
import { SectionContainer } from '@/components/ui/section-container';
import { SkillsWithProgress, SkillsSummary } from '@/components/skills-with-progress';

// Skills data
const skillsData = [
  {
    category: 'Revenue Operations',
    skills: [
      { name: 'Revenue Operations', level: 95 },
      { name: 'Sales Operations', level: 90 },
      { name: 'Partner Management', level: 88 },
      { name: 'Process Optimization', level: 92 },
      { name: 'Strategic Planning', level: 85 },
      { name: 'Cross-functional Collaboration', level: 90 },
    ],
  },
  {
    category: 'Tools & Platforms',
    skills: [
      { name: 'Salesforce', level: 95 },
      { name: 'HubSpot', level: 85 },
      { name: 'SalesLoft', level: 80 },
      { name: 'PartnerStack', level: 95 },
      { name: 'Workato', level: 85 },
      { name: 'Power BI', level: 90 },
    ],
  },
  {
    category: 'Technical Skills',
    skills: [
      { name: 'Python', level: 75 },
      { name: 'JavaScript', level: 70 },
      { name: 'React & Next.js', level: 65 },
      { name: 'SQL', level: 85 },
      { name: 'Data Visualization', level: 90 },
      { name: 'API Integrations', level: 80 },
    ],
  },
];

export const metadata = {
  title: 'About | Richard Hudson',
  description:
    "Learn more about Richard Hudson's experience, skills, and approach to revenue operations and business growth.",
  openGraph: {
    title: 'About Richard Hudson | Revenue Operations Professional',
    description:
      "Learn more about Richard Hudson's experience, skills, and approach to revenue operations and business growth.",
    images: [{ url: '/images/og-image.jpg' }],
  },
};

export default function AboutPage() {
  return (
    <div className="pb-20 overflow-auto">
      {/* Hero Section with background */}
      <section className="section-bg-secondary pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="relative md:w-1/3 order-2 md:order-1">
              <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 blur-md transform rotate-3"></div>
                <div className="absolute inset-1 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden transform -rotate-3">
                  <Image
                    src="/images/richard.jpg"
                    alt="Richard Hudson"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 256px, 320px"
                    quality={95}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 md:w-2/3 order-1 md:order-2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                About Me
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                As a Revenue Operations Professional with over 7 years of experience, I specialize
                in optimizing business processes and driving growth through data-driven strategies.
                My approach combines analytical expertise with strategic vision to deliver
                measurable business results.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={'/contact' as Route<string>}>Contact Me</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={'/resume' as Route<string>}>View Resume</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Background */}
      <SectionContainer variant="primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
            <BriefcaseIcon className="mr-3 text-blue-600" />
            Professional Background
          </h2>
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <p>
              I&apos;m Richard Hudson, a Revenue Operations Professional with over 7 years of
              experience optimizing business processes and driving growth. My expertise lies in
              developing data-driven strategies that enhance operational efficiency and improve
              financial outcomes.
            </p>
            <p>
              Throughout my career, I&apos;ve helped companies implement cross-functional workflow
              improvements, establish effective reporting systems, and create scalable processes
              that support business growth.
            </p>
            <p>
              Having worked with both startups and established enterprises, I bring a versatile
              approach to solving complex operational challenges. My focus is always on creating
              systems that increase revenue, streamline operations, and improve the customer
              experience.
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Experience Timeline with Alternating Layout */}
      <SectionContainer variant="secondary" className="py-16">
        <h2 className="text-3xl font-bold mb-16 text-center text-slate-900 dark:text-white">
          Professional Journey
        </h2>

        <div className="max-w-5xl mx-auto relative">
          {/* Center timeline line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-1 bg-blue-600 rounded-full"></div>

          {/* Timeline items */}
          <div className="relative space-y-12">
            {/* Item 1 - Left */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700 relative">
                  {/* Arrow pointing to timeline */}
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0 translate-x-12 w-12 h-1 bg-blue-600"></div>

                  {/* Content */}
                  <div>
                    <div className="text-blue-600 font-semibold mb-2">
                      December 2022 - November 2024
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Revenue Operations Consultant
                    </h3>
                    <p className="font-medium text-slate-600 dark:text-slate-300 mb-4">Thryv</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                      <li>
                        Drove $1.1M+ revenue growth through data-driven forecasting and optimization
                        strategies
                      </li>
                      <li>
                        Grew partner network by 2,200% and increased transaction volume by 432%
                      </li>
                      <li>
                        Architected revenue modeling framework in Power BI and Salesforce achieving
                        95% forecast accuracy
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Timeline node */}
              <div className="z-10 w-10 h-10 rounded-full border-4 border-blue-600 bg-white dark:bg-slate-900 absolute left-1/2 -translate-x-1/2"></div>

              {/* Right side (empty for this item) */}
              <div className="md:w-1/2 md:pl-12"></div>
            </div>

            {/* Item 2 - Right */}
            <div className="flex flex-col md:flex-row items-center">
              {/* Left side (empty for this item) */}
              <div className="md:w-1/2 md:pr-12"></div>

              {/* Timeline node */}
              <div className="z-10 w-10 h-10 rounded-full border-4 border-blue-600 bg-white dark:bg-slate-900 absolute left-1/2 -translate-x-1/2"></div>

              {/* Right side content */}
              <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700 relative">
                  {/* Arrow pointing to timeline */}
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 -translate-x-12 w-12 h-1 bg-blue-600"></div>

                  {/* Content */}
                  <div>
                    <div className="text-blue-600 font-semibold mb-2">
                      February 2022 - December 2022
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Sales Operations Analyst
                    </h3>
                    <p className="font-medium text-slate-600 dark:text-slate-300 mb-4">Thryv</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                      <li>
                        Built automated KPI dashboards driving 28% quota attainment growth across
                        teams
                      </li>
                      <li>
                        Automated commission management system achieving 100% accuracy and reducing
                        processing time by 73%
                      </li>
                      <li>
                        Improved forecast accuracy by 40% through standardized metrics and reporting
                        frameworks
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 3 - Left */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700 relative">
                  {/* Arrow pointing to timeline */}
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0 translate-x-12 w-12 h-1 bg-blue-600"></div>

                  {/* Content */}
                  <div>
                    <div className="text-blue-600 font-semibold mb-2">March 2020 - March 2022</div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Channel Operations Lead
                    </h3>
                    <p className="font-medium text-slate-600 dark:text-slate-300 mb-4">Thryv</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                      <li>
                        Scaled network to over 300 active affiliates, resellers, and MSPs,
                        maintaining 99.9% data accuracy
                      </li>
                      <li>
                        Reduced onboarding time by 45% through PartnerStack automation and workflow
                        optimization
                      </li>
                      <li>
                        Built scalable infrastructure driving 432% volume growth and 67% faster
                        processing time
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Timeline node */}
              <div className="z-10 w-10 h-10 rounded-full border-4 border-blue-600 bg-white dark:bg-slate-900 absolute left-1/2 -translate-x-1/2"></div>

              {/* Right side (empty for this item) */}
              <div className="md:w-1/2 md:pl-12"></div>
            </div>

            {/* Item 4 - Right */}
            <div className="flex flex-col md:flex-row items-center">
              {/* Left side (empty for this item) */}
              <div className="md:w-1/2 md:pr-12"></div>

              {/* Timeline node */}
              <div className="z-10 w-10 h-10 rounded-full border-4 border-blue-600 bg-white dark:bg-slate-900 absolute left-1/2 -translate-x-1/2"></div>

              {/* Right side content */}
              <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700 relative">
                  {/* Arrow pointing to timeline */}
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 -translate-x-12 w-12 h-1 bg-blue-600"></div>

                  {/* Content */}
                  <div>
                    <div className="text-blue-600 font-semibold mb-2">
                      December 2017 - March 2020
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Business Systems Specialist
                    </h3>
                    <p className="font-medium text-slate-600 dark:text-slate-300 mb-4">Thryv</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                      <li>
                        Led Salesforce platform integration and automation reducing order processing
                        time by 60%
                      </li>
                      <li>Achieved 95% SLA compliance managing offshore operations team</li>
                      <li>
                        Developed KPI monitoring systems improving revenue visibility and team
                        performance metrics
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Education with Updated Styling */}
      <SectionContainer variant="primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 flex items-center justify-center text-slate-900 dark:text-white">
            <GraduationCapIcon className="mr-3 text-blue-600" />
            Education
          </h2>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Bachelor of Science (BS) in Business Administration
            </h3>
            <p className="text-blue-600 dark:text-blue-500 font-medium mt-2">
              The University of Texas at Dallas
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-300">2012 - 2015</p>
            <div className="mt-6 flex justify-center">
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                Concentration in Entrepreneurship
              </span>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Skills Section with RPG-style Bars */}
      <SectionContainer variant="secondary">
        <h2 className="text-3xl font-bold mb-10 text-center text-slate-900 dark:text-white">
          Skills & Expertise
        </h2>

        {/* Using client component for MUI components with dynamic styling */}
        <SkillsWithProgress skillsData={skillsData} />

        {/* Skills Summary client component */}
        <SkillsSummary />
      </SectionContainer>

      {/* CTA Section */}
      <SectionContainer variant="primary">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-slate-900 dark:text-white text-center border border-slate-200 dark:border-slate-700 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Interested in Working Together?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how I can help optimize your business operations and drive growth.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Link href={'/contact' as Route<string>} className="group">
              Get in Touch
            </Link>
          </Button>
        </div>
      </SectionContainer>
    </div>
  )
}
