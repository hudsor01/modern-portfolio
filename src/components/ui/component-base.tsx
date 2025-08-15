import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Base component interface for all UI components
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
  asChild?: boolean
}

// Polymorphic component utility type
export type PolymorphicRef<E extends React.ElementType> = React.ComponentPropsWithRef<E>['ref']

export type PolymorphicComponentProp<
  E extends React.ElementType,
  P = {}
> = P & {
  as?: E
} & Omit<React.ComponentPropsWithRef<E>, keyof P | 'as'>

export type PolymorphicComponent<P = {}, D extends React.ElementType = 'div'> = <
  E extends React.ElementType = D
>(
  props: PolymorphicComponentProp<E, P>
) => React.ReactElement | null

// Size variant type
export type SizeVariant = 'xs' | 'sm' | 'default' | 'lg' | 'xl'

// Color variant type
export type ColorVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted'

// Common variant props interface
export interface CommonVariantProps {
  size?: SizeVariant
  variant?: ColorVariant
  disabled?: boolean
  loading?: boolean
}

// Accessibility props interface
export interface AccessibilityProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  role?: string
  tabIndex?: number
}

// Animation props interface
export interface AnimationProps {
  animate?: boolean
  animateOnMount?: boolean
  animationDelay?: number
  animationDuration?: number
}

// Layout props interface
export interface LayoutProps {
  fullWidth?: boolean
  centered?: boolean
  spacing?: 'none' | 'sm' | 'default' | 'lg' | 'xl'
}

// Complete component props interface
export interface ComponentProps
  extends BaseComponentProps,
    CommonVariantProps,
    AccessibilityProps,
    AnimationProps,
    LayoutProps {}

// Base component variants
export const baseVariants = cva(
  [
    // Base styles
    "transition-all duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    
    // Reduced motion support
    "@media (prefers-reduced-motion: reduce) { transition-duration: 0.01ms; transform: none }",
    
    // High contrast support
    "@media (prefers-contrast: high) { border-width: 2px }",
  ],
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-secondary",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400", 
        error: "text-red-600 dark:text-red-400",
        muted: "text-muted-foreground",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      disabled: {
        true: "opacity-50 pointer-events-none cursor-not-allowed",
        false: "",
      },
      loading: {
        true: "cursor-wait",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      centered: {
        true: "mx-auto text-center",
        false: "",
      },
      spacing: {
        none: "gap-0",
        sm: "gap-2",
        default: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      disabled: false,
      loading: false,
      fullWidth: false,
      centered: false,
      spacing: "default",
    },
  }
)

// Generic component factory
export function createComponent<
  E extends React.ElementType = 'div',
  P extends Record<string, unknown> = {}
>(
  displayName: string,
  defaultElement: E,
  variants?: ReturnType<typeof cva>,
  defaultProps?: Partial<P>
) {
  const Component = React.forwardRef<
    React.ElementRef<E>,
    PolymorphicComponentProp<E, P & ComponentProps>
  >(({ as, className, children, ...props }, ref) => {
    const Element = as || defaultElement
    const variantClasses = variants ? variants(props as Record<string, unknown>) : ''
    
    return (
      <Element
        ref={ref}
        className={cn(variantClasses, className)}
        {...defaultProps}
        {...props}
      >
        {children}
      </Element>
    )
  })
  
  Component.displayName = displayName
  return Component
}

// Compound component utilities
export interface CompoundComponentProps extends ComponentProps {
  items?: React.ReactNode[]
  separator?: React.ReactNode
  direction?: 'horizontal' | 'vertical'
}

// Stack component for layout composition
export const Stack = React.forwardRef<
  HTMLDivElement,
  CompoundComponentProps
>(({
  className,
  children,
  items,
  separator,
  direction = 'vertical',
  spacing = 'default',
  ...props
}, ref) => {
  const content = items || React.Children.toArray(children)
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        baseVariants({ spacing, ...props }),
        className
      )}
      {...props}
    >
      {separator 
        ? content.flatMap((item, index) => 
            index === content.length - 1 ? [item] : [item, separator]
          )
        : content
      }
    </div>
  )
})
Stack.displayName = "Stack"

// Grid component for layout composition  
export const Grid = React.forwardRef<
  HTMLDivElement,
  CompoundComponentProps & {
    columns?: 1 | 2 | 3 | 4 | 5 | 6
    rows?: number
    autoFit?: boolean
    minItemWidth?: string
  }
>(({
  className,
  children,
  columns = 1,
  rows,
  autoFit = false,
  minItemWidth = '250px',
  spacing = 'default',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid",
        !autoFit && {
          1: "grid-cols-1",
          2: "grid-cols-1 md:grid-cols-2",
          3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
          6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
        }[columns],
        rows && `grid-rows-${rows}`,
        baseVariants({ spacing, ...props }),
        className
      )}
      style={{
        ...(autoFit && {
          gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
        })
      }}
      {...props}
    >
      {children}
    </div>
  )
})
Grid.displayName = "Grid"

// Flex component for flexible layouts
export const Flex = React.forwardRef<
  HTMLDivElement,
  CompoundComponentProps & {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    wrap?: boolean
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  }
>(({
  className,
  children,
  direction = 'row',
  wrap = false,
  justify = 'start',
  align = 'center',
  spacing = 'default',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        {
          row: "flex-row",
          column: "flex-col", 
          'row-reverse': "flex-row-reverse",
          'column-reverse': "flex-col-reverse",
        }[direction],
        wrap && "flex-wrap",
        {
          start: "justify-start",
          end: "justify-end",
          center: "justify-center",
          between: "justify-between",
          around: "justify-around",
          evenly: "justify-evenly",
        }[justify],
        {
          start: "items-start",
          end: "items-end", 
          center: "items-center",
          baseline: "items-baseline",
          stretch: "items-stretch",
        }[align],
        baseVariants({ spacing, ...props }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Flex.displayName = "Flex"

// Container component with responsive behavior
export const Container = React.forwardRef<
  HTMLDivElement,
  ComponentProps & {
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
    padding?: boolean
  }
>(({
  className,
  maxWidth = 'xl',
  padding = true,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto",
        {
          xs: "max-w-xs",
          sm: "max-w-sm", 
          md: "max-w-md",
          lg: "max-w-lg",
          xl: "max-w-4xl",
          '2xl': "max-w-6xl",
          '3xl': "max-w-7xl",
          full: "max-w-none",
        }[maxWidth],
        padding && "px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  )
})
Container.displayName = "Container"

// Export types for external use
export type {
  PolymorphicComponentProp,
  PolymorphicComponent,
  PolymorphicRef,
}