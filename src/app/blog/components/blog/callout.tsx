import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertTriangle, Info, CheckCircle, XCircle, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

// Callout/Alert Component for important content
const calloutVariants = cva(
  [
    "rounded-lg border p-4 my-6",
    "[&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    "relative",
  ],
  {
    variants: {
      variant: {
        info: [
          "border-primary/20 bg-primary/5 text-blue-800",
          "dark:border-primary/80 dark:bg-blue-950 dark:text-blue-200",
          "[&>svg]:text-primary dark:[&>svg]:text-primary",
        ],
        warning: [
          "border-yellow-200 bg-yellow-50 text-yellow-800",
          "dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
          "[&>svg]:text-yellow-600 dark:[&>svg]:text-warning",
        ],
        error: [
          "border-red-200 bg-red-50 text-red-800",
          "dark:border-red-800 dark:bg-red-950 dark:text-red-200",
          "[&>svg]:text-destructive dark:[&>svg]:text-destructive",
        ],
        success: [
          "border-green-200 bg-green-50 text-green-800",
          "dark:border-green-800 dark:bg-green-950 dark:text-green-200",
          "[&>svg]:text-success dark:[&>svg]:text-success",
        ],
        tip: [
          "border-purple-200 bg-purple-50 text-purple-800",
          "dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200",
          "[&>svg]:text-purple-600 dark:[&>svg]:text-purple-400",
        ],
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const calloutIcons = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
  tip: Lightbulb,
} as const

interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  title?: string
}

export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant = "info", title, children, ...props }, ref) => {
    const Icon = variant ? calloutIcons[variant] : calloutIcons.info
    
    return (
      <div
        ref={ref}
        className={cn(calloutVariants({ variant }), className)}
        role="alert"
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div>
          {title && (
            <h5 className="mb-2 font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          <div className="text-sm [&_p]:leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Callout.displayName = "Callout"

export { calloutVariants }