'use client'

import { Card } from '@/components/ui/card'
import {
  Database,
  BarChart3,
  Mail,
  Zap,
  FileText,
  Users,
  TrendingUp,
  Code,
  Table
} from 'lucide-react'

interface Tool {
  name: string
  category: string
  icon: React.ElementType
  color: string
}

const TOOLS: Tool[] = [
  { name: 'Salesforce', category: 'CRM', icon: Zap, color: 'bg-[#00A1E0]' },
  { name: 'HubSpot', category: 'CRM', icon: TrendingUp, color: 'bg-[#FF7A59]' },
  { name: 'SalesLoft', category: 'Sales Engagement', icon: Mail, color: 'bg-[#1F4788]' },
  { name: 'PowerBI', category: 'Analytics', icon: BarChart3, color: 'bg-[#F2C811]' },
  { name: 'Tableau', category: 'Analytics', icon: BarChart3, color: 'bg-[#E97627]' },
  { name: 'SQL', category: 'Database', icon: Database, color: 'bg-[#00758F]' },
  { name: 'Excel', category: 'Spreadsheet', icon: Table, color: 'bg-[#217346]' },
  { name: 'Python', category: 'Programming', icon: Code, color: 'bg-[#3776AB]' },
  { name: 'Zapier', category: 'Automation', icon: Zap, color: 'bg-[#FF4F00]' },
  { name: 'Notion', category: 'Documentation', icon: FileText, color: 'bg-black dark:bg-white' },
  { name: 'Slack', category: 'Collaboration', icon: Users, color: 'bg-[#4A154B]' },
  { name: 'Google Sheets', category: 'Spreadsheet', icon: Table, color: 'bg-[#34A853]' },
]

interface ToolsIUseProps {
  className?: string
}

export function ToolsIUse({ className = '' }: ToolsIUseProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
          Tools & Technologies
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enterprise-grade platforms I leverage to drive revenue operations
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {TOOLS.map((tool, index) => (
          <Card
            key={tool.name}
            className="group bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-6 flex flex-col items-center gap-3">
              <div className={`p-3 rounded-lg ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm text-foreground">
                  {tool.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {tool.category}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
