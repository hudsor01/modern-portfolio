import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart2, Users2, LightbulbIcon, BriefcaseIcon, GraduationCapIcon } from 'lucide-react'
import { SectionContainer } from '@/components/ui/section-container'
import { SkillsWithProgress, SkillsSummary } from '@/components/skills-with-progress'

// Skills data
const skillsData = [
  {
    category: "Revenue Operations",
    skills: [
      { name: "Revenue Operations", level: 95 },
      { name: "Sales Operations", level: 90 },
      { name: "Partner Management", level: 88 },
      { name: "Process Optimization", level: 92 },
      { name: "Strategic Planning", level: 85 },
      { name: "Cross-functional Collaboration", level: 90 }
    ]
  },
  {
    category: "Tools & Platforms",
    skills: [
      { name: "Salesforce", level: 95 },
      { name: "HubSpot", level: 85 },
      { name: "SalesLoft", level: 80 },
      { name: "PartnerStack", level: 95 },
      { name: "Workato", level: 85 },
      { name: "Power BI", level: 90 }
    ]
  },
  {
    category: "Technical Skills",
    skills: [
      { name: "Python", level: 75 },
      { name: "JavaScript", level: 70 },
      { name: "React & Next.js", level: 65 },
      { name: "SQL", level: 85 },
      { name: "Data Visualization", level: 90 },
      { name: "API Integrations", level: 80 }
    ]
  }
];

export const metadata = {
  title: 'About | Richard Hudson',
  description: "Learn more about Richard Hudson's experience, skills, and approach to revenue operations and business growth.",
  openGraph: {
    title: 'About Richard Hudson | Revenue Operations Professional',
    description: "Learn more about Richard Hudson's experience, skills, and approach to revenue operations and business growth.",
    images: [{ url: '/images/og-image.jpg' }],
  },
}

export default function AboutPage() {
  return (
    <div className="space-y-0 pb-20">
      {/* Hero Section with brown background */}
      <section className="section-bg-secondary pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h1 className="mui-heading-1 text-gradient">
                About Me
              </h1>
              <p className="mui-body-1">
                Revenue Operations Professional with a passion for driving business growth through data-driven strategies.
              </p>
              <div className="flex gap-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/contact">Contact Me</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/resume">View Resume</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative mx-auto">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 blur-md" />
                <div className="absolute inset-1 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
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
          </div>
        </div>
      </section>

      {/* Professional Background */}
      <SectionContainer variant="primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="mui-heading-2 mb-6 flex items-center">
            <BriefcaseIcon className="mr-3 text-blue-600" /> 
            Professional Background
          </h2>
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <p>
              I'm Richard Hudson, a Revenue Operations Professional with over 7 years of 
              experience optimizing business processes and driving growth. My expertise lies 
              in developing data-driven strategies that enhance operational efficiency and 
              improve financial outcomes.
            </p>
            <p>
              Throughout my career, I've helped companies implement cross-functional workflow improvements, 
              establish effective reporting systems, and create scalable processes that support business growth.
            </p>
            <p>
              Having worked with both startups and established enterprises, I bring a versatile approach to 
              solving complex operational challenges. My focus is always on creating systems that increase revenue, 
              streamline operations, and improve the customer experience.
            </p>
          </div>
        </div>
      </SectionContainer>

      {/* Experience Timeline with Alternating Layout */}
      <SectionContainer variant="secondary" className="py-16">
        <h2 className="mui-heading-2 mb-16 text-center">
          Professional Journey
        </h2>
        
        <div className="max-w-5xl mx-auto relative">
          {/* Center timeline line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-0.5 bg-blue-600"></div>
          
          {/* Timeline items */}
          <div className="space-y-12">
            {/* Item 1 - Right */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 relative">
              {/* Time marker for mobile */}
              <div className="md:hidden mb-2 font-semibold text-blue-600">December 2022 - November 2024</div>
              
              {/* Left side (empty for first item on right) */}
              <div className="hidden md:block md:col-span-3"></div>
              
              {/* Center node */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-10 w-5 h-5 bg-blue-600 rounded-full items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              {/* Right side content */}
              <div className="md:col-span-3 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <div className="hidden md:block text-blue-600 font-semibold">December 2022 - November 2024</div>
                <h3 className="text-xl font-bold mt-1">Revenue Operations Consultant</h3>
                <p className="font-medium text-slate-600 dark:text-slate-300 mb-4">Thryv</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Drove $1.1M+ revenue growth through data-driven forecasting and optimization strategies while scaling partner network by 2,200%.</li>
                  <li>Grew partner network by 2,200% and increased transaction volume by 432%.</li>
                  <li>Architected revenue modeling framework in Power BI and Salesforce achieving 95% forecast accuracy across all divisions.</li>
                </ul>
              </div>
            </div>
            
            {/* Item 2 - Left */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 relative">
              {/* Time marker for mobile */}
              <div className="md:hidden mb-2 font-semibold text-blue-600">February 2022 - December 2022</div>
              
              {/* Left side content */}
              <div className="md:col-span-3 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <div className="hidden md:block text-blue-600 font-semibold">February 2022 - December 2022</div>
                <h3 className="text-xl font-bold mt-1">Sales Operation Analyst</h3>
                <p className="font-medium text-slate-600 dark:text-slate-300 mb-4">Thryv</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Built automated KPI dashboards driving 28% quota attainment growth across teams and divisions.</li>
                  <li>Automated commission management system achieving 100% accuracy and reducing processing time by 73%.</li>
                  <li>Improved forecast accuracy by 40% through standardized metrics and reporting frameworks.</li>
                </ul>
              </div>
              
              {/* Center node */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-10 w-5 h-5 bg-blue-600 rounded-full items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              {/* Right side (empty for this item) */}
              <div className="hidden md:block md:col-span-3"></div>
            </div>
            
            {/* Item 3 - Right */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 relative">
              {/* Time marker for mobile */}
              <div className="md:hidden mb-2 font-semibold text-blue-600">March 2020 - March 2022</div>
              
              {/* Left side (empty for this item) */}
              <div className="hidden md:block md:col-span-3"></div>
              
              {/* Center node */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-10 w-5 h-5 bg-blue-600 rounded-full items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              {/* Right side content */}
              <div className="md:col-span-3 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <div className="hidden md:block text-blue-600 font-semibold">March 2020 - March 2022</div>
                <h3 className="text-xl font-bold mt-1">Channel Operations Lead</h3>
                <p className="font-medium text-slate-600 dark:text-slate-300 mb-4">Thryv</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Scaled network to over 300 active affiliates, resellers, and Managed Service Providers (MSPs), maintaining 99.9% data accuracy.</li>
                  <li>Reduced onboarding time by 45% through PartnerStack automation and workflow optimization.</li>
                  <li>Built scalable infrastructure driving 432% volume growth and 67% faster processing time.</li>
                </ul>
              </div>
            </div>
            
            {/* Item 4 - Left */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 relative">
              {/* Time marker for mobile */}
              <div className="md:hidden mb-2 font-semibold text-blue-600">December 2017 - March 2020</div>
              
              {/* Left side content */}
              <div className="md:col-span-3 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
                <div className="hidden md:block text-blue-600 font-semibold">December 2017 - March 2020</div>
                <h3 className="text-xl font-bold mt-1">Business Systems Specialist</h3>
                <p className="font-medium text-slate-600 dark:text-slate-300 mb-4">Thryv</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Led Salesforce platform integration and automation reducing order processing time by 60%.</li>
                  <li>Achieved 95% SLA compliance managing offshore operations team.</li>
                  <li>Developed KPI monitoring systems improving revenue visibility and team performance metrics.</li>
                </ul>
              </div>
              
              {/* Center node */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-10 w-5 h-5 bg-blue-600 rounded-full items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              {/* Right side (empty for this item) */}
              <div className="hidden md:block md:col-span-3"></div>
            </div>
          </div>
        </div>
      </SectionContainer>
      
      {/* Education with Updated Styling */}
      <SectionContainer variant="primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="mui-heading-2 mb-8 flex items-center justify-center">
            <GraduationCapIcon className="mr-3 text-blue-600" /> 
            Education
          </h2>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-center">
            <h3 className="text-2xl font-bold">Bachelor of Science (BS) in Business Administration</h3>
            <p className="text-blue-600 dark:text-blue-500 font-medium mt-2">The University of Texas at Dallas</p>
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
        <h2 className="mui-heading-2 mb-10 text-center">Skills & Expertise</h2>
        
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
            Let's discuss how I can help optimize your business operations and drive growth.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Link href="/contact" className="group">
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </SectionContainer>
    </div>
  )
}