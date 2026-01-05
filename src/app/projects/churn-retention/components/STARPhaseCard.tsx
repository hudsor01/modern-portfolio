type Phase = 'situation' | 'task' | 'action' | 'result'

interface STARPhaseCardProps {
  phase: Phase
  label: string
}

const phaseStyles: Record<Phase, string> = {
  situation: 'text-primary',
  task: 'text-secondary',
  action: 'text-accent',
  result: 'text-primary',
}

export function STARPhaseCard({ phase, label }: STARPhaseCardProps) {
  return (
    <div className="text-center p-6 bg-card border border-border rounded-2xl">
      <div className={`text-sm ${phaseStyles[phase]} mb-2`}>
        {phase.charAt(0).toUpperCase() + phase.slice(1)}
      </div>
      <div className="typography-large text-foreground">{label}</div>
    </div>
  )
}
