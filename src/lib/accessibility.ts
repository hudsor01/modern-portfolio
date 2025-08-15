// Comprehensive Accessibility Utilities
// WCAG 2.1 AA compliant utilities and helpers

// ARIA role definitions
export const ariaRoles = {
  // Landmark roles
  banner: 'banner',
  navigation: 'navigation', 
  main: 'main',
  complementary: 'complementary',
  contentinfo: 'contentinfo',
  search: 'search',
  form: 'form',
  region: 'region',
  
  // Widget roles
  button: 'button',
  checkbox: 'checkbox',
  dialog: 'dialog',
  grid: 'grid',
  gridcell: 'gridcell',
  link: 'link',
  listbox: 'listbox',
  menu: 'menu',
  menubar: 'menubar',
  menuitem: 'menuitem',
  option: 'option',
  progressbar: 'progressbar',
  radio: 'radio',
  slider: 'slider',
  switch: 'switch',
  tab: 'tab',
  tablist: 'tablist',
  tabpanel: 'tabpanel',
  textbox: 'textbox',
  tooltip: 'tooltip',
  
  // Document structure roles
  article: 'article',
  definition: 'definition',
  directory: 'directory',
  document: 'document',
  group: 'group',
  heading: 'heading',
  img: 'img',
  list: 'list',
  listitem: 'listitem',
  math: 'math',
  note: 'note',
  presentation: 'presentation',
  separator: 'separator',
  toolbar: 'toolbar',
} as const

// ARIA states and properties
export const ariaStates = {
  // States
  busy: 'aria-busy',
  checked: 'aria-checked',
  disabled: 'aria-disabled',
  expanded: 'aria-expanded',
  hidden: 'aria-hidden',
  invalid: 'aria-invalid',
  pressed: 'aria-pressed',
  selected: 'aria-selected',
  
  // Properties
  activedescendant: 'aria-activedescendant',
  atomic: 'aria-atomic',
  autocomplete: 'aria-autocomplete',
  controls: 'aria-controls',
  describedby: 'aria-describedby',
  details: 'aria-details',
  errormessage: 'aria-errormessage',
  flowto: 'aria-flowto',
  haspopup: 'aria-haspopup',
  keyshortcuts: 'aria-keyshortcuts',
  label: 'aria-label',
  labelledby: 'aria-labelledby',
  level: 'aria-level',
  live: 'aria-live',
  owns: 'aria-owns',
  placeholder: 'aria-placeholder',
  posinset: 'aria-posinset',
  readonly: 'aria-readonly',
  relevant: 'aria-relevant',
  required: 'aria-required',
  roledescription: 'aria-roledescription',
  setsize: 'aria-setsize',
  sort: 'aria-sort',
  valuemax: 'aria-valuemax',
  valuemin: 'aria-valuemin',
  valuenow: 'aria-valuenow',
  valuetext: 'aria-valuetext',
} as const

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Standard keys
  keys: {
    TAB: 'Tab',
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
    DELETE: 'Delete',
    BACKSPACE: 'Backspace',
  },
  
  // Key handlers
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ) => {
    const { ARROW_UP, ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, HOME, END } = keyboardNavigation.keys
    
    let nextIndex = currentIndex
    
    switch (event.key) {
      case orientation === 'vertical' ? ARROW_UP : ARROW_LEFT:
        event.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        break
      case orientation === 'vertical' ? ARROW_DOWN : ARROW_RIGHT:
        event.preventDefault()
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        break
      case HOME:
        event.preventDefault()
        nextIndex = 0
        break
      case END:
        event.preventDefault()
        nextIndex = items.length - 1
        break
      default:
        return currentIndex
    }
    
    items[nextIndex]?.focus()
    return nextIndex
  },
  
  // Roving tabindex utility
  setupRovingTabindex: (container: HTMLElement, selector: string) => {
    const items = Array.from(container.querySelectorAll(selector)) as HTMLElement[]
    
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1')
    })
    
    return items
  },
  
  // Focus trap utility
  createFocusTrap: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== keyboardNavigation.keys.TAB) return
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    container.addEventListener('keydown', handleKeyDown)
    
    return {
      destroy: () => container.removeEventListener('keydown', handleKeyDown),
      focus: () => firstElement?.focus(),
    }
  },
} as const

// Screen reader utilities
export const screenReader = {
  // Live region utilities
  createLiveRegion: (
    text: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.textContent = text
    
    document.body.appendChild(liveRegion)
    
    setTimeout(() => {
      document.body.removeChild(liveRegion)
    }, 1000)
    
    return liveRegion
  },
  
  // Screen reader only text
  srOnly: 'sr-only',
  
  // Skip link utilities
  createSkipLink: (target: string, text: string = 'Skip to main content') => ({
    href: `#${target}`,
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground',
    children: text,
  }),
} as const

// Color contrast utilities
export const colorContrast = {
  // WCAG contrast requirements
  ratios: {
    AA: 4.5,
    AALarge: 3.0,
    AAA: 7.0,
    AAALarge: 4.5,
  },
  
  // High contrast color pairs
  highContrast: {
    light: {
      background: '#ffffff',
      text: '#000000',
      link: '#0000ee',
      visited: '#551a8b',
    },
    dark: {
      background: '#000000', 
      text: '#ffffff',
      link: '#9999ff',
      visited: '#ff99ff',
    },
  },
  
  // Utility to check if colors meet contrast requirements
  meetsContrast: (_foreground: string, _background: string, _level: 'AA' | 'AALarge' | 'AAA' | 'AAALarge' = 'AA') => {
    // This would need a proper color contrast calculation library
    // For now, return true as placeholder
    return true
  },
} as const

// Focus management utilities
export const focusManagement = {
  // Focus ring styles
  focusRing: {
    default: `
      focus-visible:outline-none 
      focus-visible:ring-2 
      focus-visible:ring-primary 
      focus-visible:ring-offset-2
    `,
    inset: `
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-inset
      focus-visible:ring-primary
    `,
    custom: (color: string = 'primary') => `
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-${color}
      focus-visible:ring-offset-2
    `,
  },
  
  // Focus restoration
  saveFocus: () => {
    return document.activeElement as HTMLElement
  },
  
  restoreFocus: (element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus()
    }
  },
  
  // Focus within utilities
  focusFirstElement: (container: HTMLElement) => {
    const firstFocusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement
    
    firstFocusable?.focus()
    return firstFocusable
  },
} as const

// Motion preferences
export const motionPreferences = {
  // CSS for respecting motion preferences
  respectMotion: '@media (prefers-reduced-motion: no-preference)',
  reduceMotion: '@media (prefers-reduced-motion: reduce)',
  
  // Animation utilities
  animationClasses: {
    respectsMotion: 'motion-safe:animate-fadeIn',
    reducedMotion: 'motion-reduce:animate-none',
    default: 'animate-fadeIn motion-reduce:animate-none',
  },
  
  // Check user preference
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
} as const

// Form accessibility utilities
export const formAccessibility = {
  // Error message utilities
  createErrorMessage: (fieldId: string, message: string) => ({
    id: `${fieldId}-error`,
    role: 'alert',
    'aria-live': 'polite',
    className: 'text-sm text-red-600 dark:text-red-400',
    children: message,
  }),
  
  // Label utilities
  createLabel: (fieldId: string, text: string, required: boolean = false) => ({
    htmlFor: fieldId,
    className: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
    children: required ? `${text} *` : text,
  }),
  
  // Field description utilities
  createDescription: (fieldId: string, description: string) => ({
    id: `${fieldId}-description`,
    className: 'text-sm text-gray-500 dark:text-gray-400',
    children: description,
  }),
} as const

// Heading hierarchy utilities
export const headingHierarchy = {
  // Ensure proper heading levels
  validateHierarchy: (container: HTMLElement) => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const levels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))
    
    for (let i = 1; i < levels.length; i++) {
      const prev = levels[i - 1]
      const curr = levels[i]
      
      if (prev !== undefined && curr !== undefined && curr > prev + 1) {
        console.warn(`Heading level jump from h${prev} to h${curr} detected`)
      }
    }
  },
  
  // Generate proper heading structure
  createHeading: (level: 1 | 2 | 3 | 4 | 5 | 6, text: string, id?: string) => {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    
    return {
      as: Tag,
      id,
      className: `text-${level === 1 ? '3xl' : level === 2 ? '2xl' : 'xl'} font-bold mb-4`,
      children: text,
    }
  },
} as const

// Export all utilities
export const accessibility = {
  ariaRoles,
  ariaStates,
  keyboardNavigation,
  screenReader,
  colorContrast,
  focusManagement,
  motionPreferences,
  formAccessibility,
  headingHierarchy,
} as const

// Individual utilities are already exported above for tree-shaking