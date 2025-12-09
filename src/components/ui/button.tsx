'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    // Base styles with enhanced accessibility
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-all duration-200 ease-in-out",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "active:scale-[0.98] hover:scale-[1.02]",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    // High contrast mode support
    "@media (prefers-contrast: high) { border-width: 2px }",
    // Reduced motion support
    "@media (prefers-reduced-motion: reduce) { transition-duration: 0.01ms; transform: none }",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground shadow-sm",
          "hover:bg-primary/90 hover:shadow-md",
          "focus-visible:ring-primary/50",
          "active:bg-primary/95",
        ],
        destructive: [
          "bg-destructive text-destructive-foreground shadow-sm",
          "hover:bg-destructive/90 hover:shadow-md",
          "focus-visible:ring-destructive/50",
          "active:bg-destructive/95",
        ],
        outline: [
          "border border-input bg-background shadow-sm",
          "hover:bg-accent hover:text-accent-foreground hover:border-accent/50",
          "focus-visible:ring-ring/50",
          "active:bg-accent/90",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground shadow-sm",
          "hover:bg-secondary/80 hover:shadow-md",
          "focus-visible:ring-secondary/50",
          "active:bg-secondary/90",
        ],
        ghost: [
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-accent/50",
          "active:bg-accent/90",
        ],
        link: [
          "text-primary underline-offset-4",
          "hover:underline hover:text-primary/80",
          "focus-visible:ring-primary/50 focus-visible:ring-offset-1",
          "active:text-primary/90",
        ],
        gradient: [
          "bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold shadow-lg",
          "hover:from-cyan-400 hover:to-blue-400 hover:shadow-xl hover:shadow-cyan-500/25",
          "focus-visible:ring-cyan-400/50",
          "active:from-cyan-600 active:to-blue-600",
          "transition-all duration-300",
        ],
        "gradient-outline": [
          "border border-border text-muted-foreground bg-transparent shadow-sm",
          "hover:border-primary hover:text-primary hover:bg-primary/5",
          "focus-visible:ring-cyan-400/50",
          "active:border-primary active:text-primary/70",
          "transition-all duration-300",
        ],
        success: [
          "bg-success text-foreground shadow-sm",
          "hover:bg-success hover:shadow-md",
          "focus-visible:ring-green-500/50",
          "active:bg-success/80",
        ],
        warning: [
          "bg-warning text-foreground shadow-sm",
          "hover:bg-warning hover:shadow-md",
          "focus-visible:ring-yellow-500/50",
          "active:bg-warning/80",
        ],
      },
      size: {
        xs: "h-8 rounded-md px-2 text-xs gap-1 has-[>svg]:px-1.5",
        sm: "h-9 rounded-md px-3 text-sm gap-1.5 has-[>svg]:px-2.5",
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        lg: "h-11 rounded-lg px-6 text-base has-[>svg]:px-4",
        xl: "h-12 rounded-lg px-8 text-lg has-[>svg]:px-6",
        icon: "size-10 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-12 rounded-lg",
      },
      loading: {
        true: "cursor-wait",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-loading={loading}
        {...props}
      >
        {loading && (
          <Loader2 className="animate-spin" size={size === "sm" || size === "xs" ? 14 : 16} />
        )}
        {!loading && leftIcon && leftIcon}
        {loading ? loadingText || "Loading..." : children}
        {!loading && rightIcon && rightIcon}
      </Comp>
    )
  }
)

Button.displayName = "Button"

// Compound components for common button patterns
const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical"
    attached?: boolean
  }
>(({ className, orientation = "horizontal", attached = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        attached
          ? orientation === "horizontal"
            ? "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px"
            : "[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px"
          : "gap-2",
        className
      )}
      role="group"
      {...props}
    />
  )
})
ButtonGroup.displayName = "ButtonGroup"

// Icon button component
const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "leftIcon" | "rightIcon"> & {
    icon: React.ReactNode
    "aria-label": string
  }
>(({ icon, className, size = "icon", ...props }, ref) => {
  return (
    <Button
      ref={ref}
      size={size}
      className={className}
      {...props}
    >
      {icon}
    </Button>
  )
})
IconButton.displayName = "IconButton"

// Loading button component
const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  return <Button ref={ref} {...props} />
})
LoadingButton.displayName = "LoadingButton"

export { Button, ButtonGroup, IconButton, LoadingButton, buttonVariants }