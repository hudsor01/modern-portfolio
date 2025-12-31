/**
 * Contact form constants and static data
 */

import {
  Mail,
  User,
  Building,
  MessageSquare,
  Calendar,
  Briefcase,
} from 'lucide-react'

export const subjectOptions = [
  { value: 'job-opportunity', label: 'Job Opportunity', icon: 'Briefcase' },
  { value: 'networking', label: 'Networking / Connect', icon: 'User' },
  { value: 'project-collaboration', label: 'Project Collaboration', icon: 'MessageSquare' },
  { value: 'speaking', label: 'Speaking / Podcast', icon: 'Calendar' },
  { value: 'mentorship', label: 'Mentorship', icon: 'Building' },
  { value: 'other', label: 'Other', icon: 'Mail' },
] as const

export const budgetRanges = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 - $15,000' },
  { value: '15k-50k', label: '$15,000 - $50,000' },
  { value: '50k-plus', label: '$50,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const

export const timelineOptions = [
  { value: 'asap', label: 'ASAP (Rush project)' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: '6-months', label: '6+ months' },
  { value: 'exploring', label: 'Just exploring' },
] as const

export const iconMap = {
  Briefcase,
  User,
  MessageSquare,
  Building,
  Calendar,
  Mail,
} as const

export type SubjectOption = (typeof subjectOptions)[number]
export type BudgetRange = (typeof budgetRanges)[number]
export type TimelineOption = (typeof timelineOptions)[number]
