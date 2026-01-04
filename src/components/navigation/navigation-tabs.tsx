'use client'

import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useAccessibilityAnnouncer } from './keyboard-navigation'

export interface NavigationTab {
  id: string
  label: string
  content?: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface NavigationTabsProps {
  tabs: NavigationTab[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'default' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  fullWidth?: boolean
}

/**
 * Standardized tab navigation component with consistent interaction patterns
 * Provides uniform tab behavior across all project pages with enhanced accessibility
 */
export const NavigationTabs = React.forwardRef<HTMLDivElement, NavigationTabsProps>(
  (
    {
      tabs,
      defaultValue,
      value,
      onValueChange,
      className,
      variant = 'default',
      size = 'default',
      orientation = 'horizontal',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = React.useState(value || defaultValue || tabs[0]?.id)
    const { announce } = useAccessibilityAnnouncer()

    // Handle tab change with accessibility announcement
    const handleTabChange = React.useCallback(
      (newValue: string) => {
        const tab = tabs.find((t) => t.id === newValue)
        if (tab && !tab.disabled) {
          setActiveTab(newValue)
          onValueChange?.(newValue)
          announce(`Switched to ${tab.label} tab`)
        }
      },
      [tabs, onValueChange, announce]
    )

    // Update active tab when value prop changes
    React.useEffect(() => {
      if (value !== undefined) {
        setActiveTab(value)
      }
    }, [value])

    const tabsListStyles = cn(
      'bg-muted text-muted-foreground',
      {
        // Variant styles
        'inline-flex h-9 items-center justify-center rounded-lg p-1': variant === 'default',
        'inline-flex h-10 items-center justify-center rounded-full p-1 bg-muted/50':
          variant === 'pills',
        'inline-flex h-auto items-center justify-start border-b border-border bg-transparent p-0':
          variant === 'underline',

        // Size styles
        'h-8': size === 'sm' && variant !== 'underline',
        'h-10': size === 'lg' && variant !== 'underline',

        // Orientation styles
        'flex-col w-fit': orientation === 'vertical',
        'w-full': fullWidth && orientation === 'horizontal',
      },
      className
    )

    const tabsTriggerStyles = cn(
      'data-[state=active]:bg-background data-[state=active]:text-foreground',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring',
      'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5',
      'text-sm font-medium whitespace-nowrap transition-all duration-150 ease-out',
      'focus-visible:ring-[3px] focus-visible:outline-1',
      'disabled:pointer-events-none disabled:opacity-50',
      'hover:bg-background/50 hover:text-foreground',
      {
        // Variant-specific styles
        'data-[state=active]:shadow-xs': variant === 'default',
        'data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-full':
          variant === 'pills',
        'rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2':
          variant === 'underline',

        // Size styles
        'px-2 py-1 text-xs': size === 'sm',
        'px-4 py-2 text-base': size === 'lg',

        // Full width
        'flex-1': fullWidth,
      }
    )

    return (
      <Tabs
        ref={ref}
        defaultValue={defaultValue || tabs[0]?.id}
        value={activeTab}
        onValueChange={handleTabChange}
        orientation={orientation}
        className={cn('w-full', className)}
        data-testid="navigation-tabs"
        {...props}
      >
        <TabsList
          className={tabsListStyles}
          data-testid="tabs-list"
          role="tablist"
          aria-orientation={orientation}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={tabsTriggerStyles}
              data-testid={`tab-trigger-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tab-content-${tab.id}`}
              aria-label={`Switch to ${tab.label} tab${tab.badge ? ` (${tab.badge} items)` : ''}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    'ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium',
                    'bg-primary/10 text-primary',
                    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                  )}
                  aria-hidden="true"
                >
                  {tab.badge}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(
          (tab) =>
            tab.content && (
              <TabsContent
                key={`content-${tab.id}`}
                value={tab.id}
                className="mt-4 focus-visible:outline-none"
                data-testid={`tab-content-${tab.id}`}
                role="tabpanel"
                aria-labelledby={`tab-trigger-${tab.id}`}
                id={`tab-content-${tab.id}`}
              >
                {tab.content}
              </TabsContent>
            )
        )}
      </Tabs>
    )
  }
)

NavigationTabs.displayName = 'NavigationTabs'
