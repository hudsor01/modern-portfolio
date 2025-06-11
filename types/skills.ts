export interface Skill {
  name: string
  icon?: string | React.ComponentType<{ className?: string }>
  level?: number // 1-5 or 1-100
  category?: string
  description?: string
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}
