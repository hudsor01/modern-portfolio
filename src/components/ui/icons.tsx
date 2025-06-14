import type React from 'react'
import {
  type LucideIcon,
  Twitter,
  Github,
  Linkedin,
  Moon,
  Sun,
  Menu,
  Loader2,
  Briefcase,
  Monitor,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  spinner: Loader2,
  sun: Sun,
  moon: Moon,
  menu: Menu,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  briefcase: Briefcase,
  monitor: Monitor,
  chart: BarChart3,
  spreadsheet: FileSpreadsheet,
  logo: ({ ...props }: React.ComponentProps<LucideIcon>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
      <polyline points="11 12 12 12 12 16 13 16" />
    </svg>
  ),
}
