/**
 * Shared hook for project tab management
 * Reduces duplication across 14+ project pages
 */

import { useQueryState } from 'nuqs'

export interface TabConfig<T extends string = string> {
  id: T
  label: string
}

interface UseProjectTabsOptions<T extends string> {
  tabs: readonly T[]
  defaultTab?: T
}

interface UseProjectTabsReturn<T extends string> {
  activeTab: T
  setActiveTab: (tab: T) => void
  // For ProjectPageLayout compatibility
  timeframes: string[]
  activeTimeframe: string
  onTimeframeChange: (timeframe: string) => void
}

/**
 * Hook for managing project tabs with URL state
 *
 * @example
 * ```tsx
 * const tabs = ['overview', 'pipeline', 'forecasting'] as const
 * const { activeTab, timeframes, activeTimeframe, onTimeframeChange } = useProjectTabs({
 *   tabs,
 *   defaultTab: 'overview'
 * })
 *
 * // Use with ProjectPageLayout
 * <ProjectPageLayout
 *   showTimeframes={true}
 *   timeframes={timeframes}
 *   activeTimeframe={activeTimeframe}
 *   onTimeframeChange={onTimeframeChange}
 * >
 *   <ProjectTabContent activeTab={activeTab} tabs={tabComponents} />
 * </ProjectPageLayout>
 * ```
 */
export function useProjectTabs<T extends string>({
  tabs,
  defaultTab,
}: UseProjectTabsOptions<T>): UseProjectTabsReturn<T> {
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: (defaultTab || tabs[0]) as T,
  })

  // Convert tab IDs to display labels (capitalize first letter)
  const timeframes = tabs.map((tab) => tab.charAt(0).toUpperCase() + tab.slice(1))
  const activeTimeframe = activeTab.charAt(0).toUpperCase() + activeTab.slice(1)

  // Handle timeframe changes (convert back to lowercase tab ID)
  const onTimeframeChange = (timeframe: string) => {
    setActiveTab(timeframe.toLowerCase() as T)
  }

  return {
    activeTab: activeTab as T,
    setActiveTab,
    timeframes,
    activeTimeframe,
    onTimeframeChange,
  }
}
