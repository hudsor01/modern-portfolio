import { cva } from 'class-variance-authority'

// Section styles
export const sectionStyles = cva('py-10 md:py-16', {
  variants: {
    spacing: {
      none: '',
      sm: 'py-6 md:py-8',
      lg: 'py-16 md:py-24',
    },
    background: {
      default: '',
      muted: 'bg-muted',
      accent: 'bg-primary/5',
    },
  },
  defaultVariants: {
    spacing: 'none',
    background: 'default',
  },
})

// Card styles
export const cardStyles = cva('rounded-lg border bg-card text-card-foreground shadow-sm', {
  variants: {
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
    hover: {
      none: '',
      lift: 'transition-all duration-300 hover:shadow-md hover:-translate-y-1',
      glow: 'transition-all duration-300 hover:shadow-lg hover:shadow-primary/20',
      border: 'transition-all duration-300 hover:border-primary/50',
    },
  },
  defaultVariants: {
    padding: 'md',
    hover: 'none',
  },
})

// Heading styles
export const headingStyles = cva('font-bold tracking-tight', {
  variants: {
    level: {
      h1: 'text-4xl md:text-5xl',
      h2: 'text-3xl md:text-4xl',
      h3: 'text-2xl md:text-3xl',
      h4: 'text-xl md:text-2xl',
      h5: 'text-lg md:text-xl',
      h6: 'text-base md:text-lg',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
    },
  },
  defaultVariants: {
    level: 'h2',
    align: 'left',
    color: 'default',
  },
})

// Container styles
export const containerStyles = cva('container mx-auto px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: '',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

// Button styles (extending shadcn/ui button)
export const buttonExtendedStyles = cva('', {
  variants: {
    size: {
      xs: 'h-7 rounded-md px-2 text-xs',
      xl: 'h-12 rounded-md px-8 text-base',
    },
    width: {
      auto: '',
      full: 'w-full',
    },
    withIcon: {
      true: 'inline-flex items-center gap-2',
    },
  },
  defaultVariants: {
    width: 'auto',
  },
})

// Grid styles
export const gridStyles = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    },
    gap: {
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 'md',
  },
})
