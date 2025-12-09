'use client'

import { useState } from 'react'
import { ContactModal } from '@/components/layout/contact-modal'
import { Navbar } from '@/components/layout/navbar'
import { PersonalInfo } from './personal-info'
import { SkillsSection } from './skills-section'
import { ExperienceStats } from './experience-stats'
import { CertificationsSection } from './certifications-section'
import type { 
  SkillCategory, 
  ExperienceStat, 
  PersonalInfo as PersonalInfoType,
  Certification 
} from '@/hooks/use-about-data'

interface AboutContentProps {
  skills?: SkillCategory[]
  experienceStats?: ExperienceStat[]
  personalInfo?: PersonalInfoType
  certifications?: Certification[]
}

export function AboutContent({ 
  skills = [], 
  experienceStats = [], 
  personalInfo, 
  certifications = [] 
}: AboutContentProps = {}) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const handleContactClick = () => {
    setIsContactModalOpen(true)
  }

  const handleContactModalClose = () => {
    setIsContactModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-page-light dark:bg-page">
      <Navbar />
      
      <main className="w-full mx-auto px-6 py-12 space-y-24">
        {/* Personal Information Section */}
        {personalInfo && (
          <PersonalInfo 
            personalInfo={personalInfo}
            onContactClick={handleContactClick}
            className="pt-8"
          />
        )}

        {/* Experience Stats Section */}
        {experienceStats.length > 0 && (
          <ExperienceStats 
            stats={experienceStats}
            className="py-16"
          />
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <SkillsSection 
            skills={skills}
            className="py-16"
          />
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <CertificationsSection 
            certifications={certifications}
            className="py-16"
          />
        )}
      </main>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={handleContactModalClose}
      />
    </div>
  )
}

export default AboutContent