// Blog-specific design tokens extending the main design system
// Optimized for readability, engagement, and accessibility

// Blog-specific design tokens
export const blogTokens = {
  // Reading optimized typography
  typography: {
    article: {
      fontSize: {
        sm: '0.9rem',      // 14.4px
        base: '1.1rem',    // 17.6px - optimal reading size
        lg: '1.25rem',     // 20px
        xl: '1.375rem',    // 22px - for featured content
      },
      lineHeight: {
        sm: '1.7',         // Relaxed for better reading
        base: '1.75',      // Optimal for body text
        lg: '1.6',         // Tighter for large text
        xl: '1.5',         // Headlines
      },
      maxWidth: {
        prose: '65ch',     // Optimal line length for reading
        wide: '85ch',      // For wider content
        narrow: '45ch',    // For quotes/callouts
        full: '100%',      // Full width sections
      },
    },
    
    headings: {
      scale: {
        h1: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' },
        h2: { fontSize: '2rem', lineHeight: '1.3', fontWeight: '600' },
        h3: { fontSize: '1.5rem', lineHeight: '1.4', fontWeight: '600' },
        h4: { fontSize: '1.25rem', lineHeight: '1.5', fontWeight: '600' },
        h5: { fontSize: '1.125rem', lineHeight: '1.5', fontWeight: '500' },
        h6: { fontSize: '1rem', lineHeight: '1.6', fontWeight: '500' },
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
      },
    },
    
    code: {
      fontSize: {
        inline: '0.875em',  // Relative to parent
        block: '0.9rem',    // Fixed size for code blocks
      },
      fontFamily: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Monaco', 'monospace'],
      background: {
        light: 'oklch(0.98 0.005 240)',
        dark: 'oklch(0.15 0.01 240)',
      },
      padding: {
        inline: '0.2em 0.4em',
        block: '1rem 1.25rem',
      },
    },
  },
  
  // Content spacing optimized for reading flow
  spacing: {
    paragraph: '1.5rem',    // Between paragraphs
    section: '3rem',        // Between major sections
    subsection: '2rem',     // Between subsections
    heading: {
      above: '2.5rem',      // Space above headings
      below: '1rem',        // Space below headings
      h1: { above: '0', below: '1.5rem' },
      h2: { above: '3rem', below: '1.25rem' },
      h3: { above: '2.5rem', below: '1rem' },
      h4: { above: '2rem', below: '0.75rem' },
    },
    list: {
      item: '0.5rem',       // Between list items
      nested: '1rem',       // For nested lists
      margin: '1rem 0',     // Around lists
    },
    quote: {
      padding: '1.5rem 2rem',
      margin: '2rem 0',
    },
    code: {
      margin: '1.5rem 0',   // Around code blocks
    },
  },
  
  // Blog-specific colors optimized for readability
  colors: {
    content: {
      // Text colors
      primary: 'oklch(0.2 0.01 240)',      // Primary text - high contrast
      secondary: 'oklch(0.4 0.005 240)',   // Secondary text
      muted: 'oklch(0.55 0.005 240)',      // Muted text, captions
      inverse: 'oklch(0.95 0.005 240)',    // Light text on dark backgrounds
      
      // Dark mode variants
      primaryDark: 'oklch(0.95 0.005 240)',
      secondaryDark: 'oklch(0.8 0.005 240)',
      mutedDark: 'oklch(0.65 0.005 240)',
      inverseDark: 'oklch(0.15 0.01 240)',
    },
    
    // Syntax highlighting theme
    syntax: {
      comment: 'oklch(0.55 0.005 240)',
      keyword: 'oklch(0.6 0.15 280)',      // Purple
      string: 'oklch(0.6 0.12 140)',       // Green
      number: 'oklch(0.65 0.15 25)',       // Orange
      function: 'oklch(0.65 0.18 235)',    // Blue
      variable: 'oklch(0.3 0.01 240)',     // Dark gray
      operator: 'oklch(0.45 0.01 240)',    // Medium gray
      punctuation: 'oklch(0.4 0.01 240)',  // Dark gray
    },
    
    // Interactive elements
    interactive: {
      link: 'oklch(0.6 0.18 235)',         // Blue links
      linkHover: 'oklch(0.55 0.2 240)',    // Darker blue on hover
      linkVisited: 'oklch(0.6 0.15 280)',  // Purple for visited
      highlight: 'oklch(0.85 0.08 60)',    // Yellow highlight
      selection: 'oklch(0.8 0.1 235 / 0.3)', // Blue selection
      focus: 'oklch(0.7 0.18 235)',        // Focus ring color
    },
    
    // Semantic content colors
    semantic: {
      quote: 'oklch(0.45 0.005 240)',      // Quote text
      quoteBorder: 'oklch(0.7 0.15 235)',  // Quote left border
      codeBackground: 'oklch(0.98 0.005 240)', // Inline code background
      codeBlockBg: 'oklch(0.96 0.005 240)', // Code block background
      
      // Callout backgrounds
      info: {
        background: 'oklch(0.95 0.08 235 / 0.1)',
        border: 'oklch(0.7 0.15 235)',
        text: 'oklch(0.3 0.1 235)',
      },
      warning: {
        background: 'oklch(0.95 0.08 60 / 0.1)',
        border: 'oklch(0.7 0.15 60)',
        text: 'oklch(0.3 0.1 60)',
      },
      success: {
        background: 'oklch(0.95 0.08 140 / 0.1)',
        border: 'oklch(0.7 0.15 140)',
        text: 'oklch(0.3 0.1 140)',
      },
      error: {
        background: 'oklch(0.95 0.08 25 / 0.1)',
        border: 'oklch(0.7 0.15 25)',
        text: 'oklch(0.3 0.1 25)',
      },
    },
  },
  
  // Layout configurations for optimal reading
  layout: {
    article: {
      width: {
        mobile: '100%',
        tablet: '90%',
        desktop: '65ch',
        wide: '85ch',
      },
      padding: {
        mobile: '1rem',
        tablet: '2rem',
        desktop: '3rem',
      },
      margin: {
        mobile: '0 auto',
        tablet: '0 auto',
        desktop: '0 auto',
      },
    },
    
    sidebar: {
      width: {
        collapsed: '0',
        compact: '12rem',
        expanded: '16rem',
        wide: '20rem',
      },
      gap: '2rem',
    },
    
    card: {
      aspectRatio: {
        square: '1 / 1',
        landscape: '16 / 9',
        portrait: '3 / 4',
        golden: '1.618 / 1',
        ultrawide: '21 / 9',
      },
      padding: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
    },
    
    grid: {
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
        wide: 4,
      },
      gap: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
    },
  },
  
  // Animation presets for blog interactions
  animations: {
    reading: {
      fadeIn: {
        duration: '0.3s',
        timing: 'ease-out',
        delay: '0s',
      },
      slideIn: {
        duration: '0.4s',
        timing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        delay: '0s',
      },
      highlight: {
        duration: '0.2s',
        timing: 'ease-in-out',
        delay: '0s',
      },
      stagger: {
        duration: '0.3s',
        timing: 'ease-out',
        delay: '0.1s', // Per item delay
      },
    },
    
    navigation: {
      quick: {
        duration: '0.15s',
        timing: 'ease-out',
      },
      smooth: {
        duration: '0.3s',
        timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      bounce: {
        duration: '0.4s',
        timing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
    
    hover: {
      scale: {
        transform: 'scale(1.02)',
        duration: '0.2s',
        timing: 'ease-out',
      },
      lift: {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px -5px oklch(0 0 0 / 0.1)',
        duration: '0.2s',
        timing: 'ease-out',
      },
    },
  },
  
  // Border radius for consistent styling
  borderRadius: {
    content: '0.75rem',     // For content cards
    code: '0.5rem',         // For code blocks
    callout: '0.75rem',     // For callouts/alerts
    image: '0.75rem',       // For content images
    button: '0.5rem',       // For blog-specific buttons
  },
  
  // Shadow system for blog components
  shadows: {
    card: '0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -1px oklch(0 0 0 / 0.06)',
    cardHover: '0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -2px oklch(0 0 0 / 0.05)',
    floating: '0 20px 25px -5px oklch(0 0 0 / 0.1), 0 10px 10px -5px oklch(0 0 0 / 0.04)',
    inner: 'inset 0 2px 4px 0 oklch(0 0 0 / 0.06)',
  },
} as const

// Utility functions for blog design tokens
export const blogUtils = {
  // Generate reading-optimized typography styles
  readingType: (size: keyof typeof blogTokens.typography.article.fontSize = 'base') => ({
    fontSize: blogTokens.typography.article.fontSize[size],
    lineHeight: blogTokens.typography.article.lineHeight[size],
    maxWidth: blogTokens.typography.article.maxWidth.prose,
  }),
  
  // Generate heading styles
  headingType: (level: keyof typeof blogTokens.typography.headings.scale) => 
    blogTokens.typography.headings.scale[level],
  
  // Generate semantic spacing
  contentSpacing: (element: keyof typeof blogTokens.spacing | 'heading') => {
    if (element === 'heading') {
      return blogTokens.spacing.heading
    }
    return blogTokens.spacing[element as keyof typeof blogTokens.spacing]
  },
  
  // Generate responsive grid
  responsiveGrid: (breakpoint: keyof typeof blogTokens.layout.grid.columns = 'desktop') => ({
    gridTemplateColumns: `repeat(${blogTokens.layout.grid.columns[breakpoint]}, 1fr)`,
    gap: blogTokens.layout.grid.gap.md,
  }),
  
  // Generate animation styles
  animationStyle: (
    type: keyof typeof blogTokens.animations,
    variant: string
  ) => {
    const animationType = blogTokens.animations[type] as Record<string, unknown>;
    const animation = animationType[variant] as Record<string, unknown> | string | undefined;
    
    if (typeof animation === 'object' && animation && 'duration' in animation && 'timing' in animation) {
      return `${String(animation.duration)} ${String(animation.timing)}`;
    }
    return String(animation || '');
  },
  
  // Generate callout styles
  calloutStyle: (type: keyof typeof blogTokens.colors.semantic) => {
    if (typeof blogTokens.colors.semantic[type] === 'object') {
      const callout = blogTokens.colors.semantic[type] as Record<string, string>
      return {
        backgroundColor: callout.background,
        borderColor: callout.border,
        color: callout.text,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: blogTokens.borderRadius.callout,
        padding: '1rem 1.25rem',
      }
    }
    return {}
  },
} as const

export default blogTokens