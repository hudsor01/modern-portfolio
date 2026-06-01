'use client'

import { useQueryState } from 'nuqs'

/**
 * Shared tab state for project pages. Owns the nuqs `?tab=` query param plus the
 * lowercase-key ⇄ Title-Case-label round-trip that every *PageContent component
 * was duplicating, including hyphenated keys (e.g. 'top-performers' ⇄
 * 'Top performers'). Returns props ready to spread onto ProjectPageLayout.
 *
 *   const { activeTab, timeframes, activeTimeframe, onTimeframeChange } =
 *     useTabQueryState(tabs)
 *
 * Pass `tabs` as a const tuple so `activeTab` stays narrowed to that page's
 * Tab union.
 */
function toLabel(tab: string): string {
  const spaced = tab.replace(/-/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function toTab(label: string): string {
  return label.toLowerCase().replace(/ /g, '-')
}

export function useTabQueryState<const Tabs extends readonly string[]>(tabs: Tabs) {
  type Tab = Tabs[number]
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: tabs[0] as Tab,
  })

  return {
    activeTab: activeTab as Tab,
    setActiveTab,
    timeframes: tabs.map(toLabel),
    activeTimeframe: toLabel(activeTab),
    onTimeframeChange: (timeframe: string) => setActiveTab(toTab(timeframe) as Tab),
  }
}
