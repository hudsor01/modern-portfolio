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
  Table,
} from 'lucide-react'

interface Tool {
  name: string
  category: string
  icon: React.ElementType
  color: string
}

// Tool icon backgrounds — vendor brand hex literals stripped (palette rule
// forbids arbitrary brand colors). Each tool maps to a palette token that
// approximates its brand hue, preserving visual variety across the grid.
const TOOLS: Tool[] = [
  { name: 'Salesforce', category: 'CRM', icon: Zap, color: 'bg-primary' },
  { name: 'HubSpot', category: 'CRM', icon: TrendingUp, color: 'bg-accent' },
  { name: 'SalesLoft', category: 'Sales Engagement', icon: Mail, color: 'bg-primary' },
  { name: 'PowerBI', category: 'Analytics', icon: BarChart3, color: 'bg-warning' },
  { name: 'Tableau', category: 'Analytics', icon: BarChart3, color: 'bg-accent' },
  { name: 'SQL', category: 'Database', icon: Database, color: 'bg-primary' },
  { name: 'Excel', category: 'Spreadsheet', icon: Table, color: 'bg-secondary' },
  { name: 'Python', category: 'Programming', icon: Code, color: 'bg-primary' },
  { name: 'Zapier', category: 'Automation', icon: Zap, color: 'bg-accent' },
  { name: 'Notion', category: 'Documentation', icon: FileText, color: 'bg-foreground' },
  { name: 'Slack', category: 'Collaboration', icon: Users, color: 'bg-secondary' },
  { name: 'Google Sheets', category: 'Spreadsheet', icon: Table, color: 'bg-success' },
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
              <div
                className={`p-3 rounded-lg ${tool.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm text-foreground">{tool.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{tool.category}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
