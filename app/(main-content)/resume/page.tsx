'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FileDown,
  ExternalLink,
  Mail,
  Linkedin,
  Globe,
  Calendar,
  Building,
  GraduationCap,
  BadgeCheck,
  Github,
  ArrowRight,
} from 'lucide-react';
import { ResumeViewer } from './resume-viewer';
import type { Route } from 'next';

const experience = [
  {
    title: 'Revenue Operations Consultant',
    company: 'Thryv',
    period: 'December 2022 - November 2024',
    description: [
      'Drove $1.1M+ revenue growth through data-driven forecasting and optimization strategies',
      'Grew partner network by 2,200% and increased transaction volume by 432%',
      'Architected revenue modeling framework in Power BI and Salesforce achieving 95% forecast accuracy',
    ],
  },
  {
    title: 'Sales Operations Analyst',
    company: 'Thryv',
    period: 'February 2022 - December 2022',
    description: [
      'Built automated KPI dashboards driving 28% quota attainment growth across teams',
      'Automated commission management system achieving 100% accuracy and reducing processing time by 73%',
      'Improved forecast accuracy by 40% through standardized metrics and reporting frameworks',
    ],
  },
  {
    title: 'Channel Operations Lead',
    company: 'Thryv',
    period: 'March 2020 - March 2022',
    description: [
      'Scaled network to over 300 active affiliates, resellers, and MSPs, maintaining 99.9% data accuracy',
      'Reduced onboarding time by 45% through PartnerStack automation and workflow optimization',
      'Built scalable infrastructure driving 432% volume growth and 67% faster processing time',
    ],
  },
];

const education = [
  {
    degree: 'Bachelor of Science (BS) in Business Administration',
    institution: 'The University of Texas at Dallas',
    period: '2012 - 2015',
    focus: 'Concentration in Entrepreneurship',
  },
];

const skills = [
  {
    category: 'Revenue Operations',
    items: ['Sales Operations', 'Partner Management', 'Process Optimization', 'Strategic Planning'],
  },
  {
    category: 'Tools & Platforms',
    items: ['Salesforce', 'HubSpot', 'SalesLoft', 'PartnerStack', 'Workato', 'Power BI'],
  },
  {
    category: 'Technical Skills',
    items: [
      'Python',
      'JavaScript',
      'React & Next.js',
      'SQL',
      'Data Visualization',
      'API Integrations',
    ],
  },
];

const certifications = [
  'HubSpot Revenue Operations Certification',
  'Salesforce Partner Relationship Management Specialist',
];

export default function ResumePage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    // Set the PDF URL once on client side
    setPdfUrl('/Richard Hudson - Resume.pdf');
  }, []);

  const handleDownloadResume = async () => {
    setIsDownloading(true);
    toast.loading('Preparing your resume...', { id: 'resume-download', duration: 3000 });

    try {
      // Direct download of the PDF file
      const a = document.createElement('a');
      a.href = '/Richard Hudson - Resume.pdf';
      a.download = 'Richard_Hudson_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success('Resume downloaded successfully!', { id: 'resume-download' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume. Please try again.', { id: 'resume-download' });
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to toggle between stylized and PDF view
  const toggleView = () => {
    setShowPdf(!showPdf);
  };

  return (
    <div className="bg-white dark:bg-slate-900 overflow-auto">
      {/* Hero section with dark navy blue background */}
      <section className="bg-[#0f172a] py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white"
            >
              Professional Resume
            </motion.h1>
            <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white/90 max-w-2xl text-xl md:text-2xl mb-8"
            >
              A comprehensive overview of my professional experience, skills, and qualifications
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center gap-3"
                onClick={handleDownloadResume}
                disabled={isDownloading}
              >
                <FileDown size={20} className="text-white" />
                <span>{isDownloading ? 'Downloading...' : 'Download PDF Resume'}</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Header/Profile */}
      <section className="section-bg-primary py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {showPdf ? (
            // PDF viewer
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              {pdfUrl && <ResumeViewer pdfUrl={pdfUrl} />}
            </div>
          ) : (
            // Stylized resume - Header/Profile
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8">
              <div className="flex flex-col items-center text-center gap-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Richard Hudson
                  </h2>
                  <h3 className="text-xl md:text-2xl font-medium text-blue-600 dark:text-blue-400 mb-4">
                    Revenue Operations Professional
                  </h3>
                </div>

                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md dark:border-slate-700">
                  <Image
                    src="/images/richard.jpg"
                    alt="Richard Hudson"
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-2xl text-justify">
                  Driving business growth through data-driven insights, process optimization, and
                  strategic operational improvements.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>hello@richardwhudsonjr.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                    <span>linkedin.com/in/hudsor01</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span>richardwhudsonjr.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Github className="h-4 w-4 text-blue-600" />
                    <span>github.com/hudsor01</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Professional Experience */}
      {!showPdf && (
        <section className="bg-slate-50 dark:bg-slate-800/20 py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center">
                <Building className="mr-2 text-blue-600" />
                Professional Experience
              </h2>
              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-6 pb-2">
                    <div className="text-center mb-2">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {job.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mb-2">
                      <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                        {job.company}
                      </p>
                      <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {job.period}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {job.description.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-600 mr-2 mt-1">•</span>
                          <span className="text-slate-600 dark:text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {!showPdf && (
        <section className="bg-slate-50 dark:bg-slate-800/20 py-16 px-4 border-t border-slate-200 dark:border-slate-700/30">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center">
                <GraduationCap className="mr-2 text-blue-600" />
                Education
              </h2>
              {education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6">
                  <div className="flex flex-wrap justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {edu.degree}
                    </h3>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">
                    {edu.institution}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">{edu.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills & Expertise */}
      {!showPdf && (
        <section className="bg-slate-50 dark:bg-slate-800/20 py-16 px-4 border-t border-slate-200 dark:border-slate-700/30">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center">
                <BadgeCheck className="mr-2 text-blue-600" />
                Skills & Expertise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {skills.map((skillGroup, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                      {skillGroup.category}
                    </h3>
                    <ul className="space-y-2">
                      {skillGroup.items.map((skill, i) => (
                        <li key={i} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
                          <span className="text-slate-600 dark:text-slate-300">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {!showPdf && (
        <section className="bg-slate-50 dark:bg-slate-800/20 py-16 px-4 border-t border-slate-200 dark:border-slate-700/30">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center">
                <BadgeCheck className="mr-2 text-blue-600" />
                Certifications
              </h2>
              <div className="flex flex-wrap gap-3">
                {certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-lg font-medium"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to action section */}
      <section className="bg-[#0f172a] py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Connect?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Interested in discussing how my skills and experience can help your team? Let&apos;s connect!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Link href={"/contact" as Route<string>} className="flex items-center gap-3">
                <Mail size={20} className="text-white" />
                <span>Contact Me</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
