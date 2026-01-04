type Phase = 'situation' | 'task' | 'action' | 'result'

interface STARPhaseCardProps {
  phase: Phase
  label: string
}

const phaseStyles: Record<Phase, string> = {
  situation: 'text-primary/70',
  task: 'text-green-400/70',
  action: 'text-amber-400/70',
  result: 'text-cyan-400/70',
}

export function STARPhaseCard({ phase, label }: STARPhaseCardProps) {
  return (
    <div className="text-center p-6 glass rounded-2xl">
      <div className={`text-sm ${phaseStyles[phase]} mb-2`}>
        {phase.charAt(0).toUpperCase() + phase.slice(1)}
      </div>
      <div className="typography-large text-white">{label}</div>
    </div>
  )
}
