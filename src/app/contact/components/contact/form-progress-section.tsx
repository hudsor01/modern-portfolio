import { Progress } from '@/components/ui/progress'

interface FormProgressSectionProps {
  progress: number
}

export function FormProgressSection({ progress }: FormProgressSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Form Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}