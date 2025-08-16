'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Mail, 
  MapPin, 
  ArrowRight 
} from 'lucide-react'
import Image from 'next/image'

interface PersonalInfo {
  name: string
  title: string
  location: string
  email: string
  bio: string
  highlights: string[]
}

interface PersonalInfoProps {
  personalInfo: PersonalInfo
  onContactClick?: () => void
  className?: string
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

export function PersonalInfo({ 
  personalInfo, 
  onContactClick,
  className = '' 
}: PersonalInfoProps) {
  return (
    <section className={className}>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {personalInfo.name}
            </motion.h1>
            
            <motion.h2 
              className="text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {personalInfo.title}
            </motion.h2>
            
            <ContactInfo personalInfo={personalInfo} />
          </div>

          <motion.p 
            className="text-xl leading-relaxed text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {personalInfo.bio}
          </motion.p>

          {onContactClick && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-4"
            >
              <Button
                onClick={onContactClick}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Let's Connect
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        <ProfileImage />
      </div>
    </section>
  )
}

interface ContactInfoProps {
  personalInfo: PersonalInfo
}

function ContactInfo({ personalInfo }: ContactInfoProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-600" />
        <span>{personalInfo.location}</span>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-blue-600" />
        <a 
          href={`mailto:${personalInfo.email}`}
          className="hover:text-blue-600 transition-colors"
        >
          {personalInfo.email}
        </a>
      </div>
    </div>
  )
}


function ProfileImage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative"
    >
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
        <CardContent className="p-8">
          <div className="relative mx-auto w-80 h-80 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
            <Image
              src="/images/richard.jpg"
              alt="Richard Hudson - Revenue Operations Professional"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 280px, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}