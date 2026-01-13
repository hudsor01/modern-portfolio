/**
 * Shared component for rendering project tab content
 * Reduces conditional rendering boilerplate across project pages
 */

import { type ComponentType } from 'react'

export interface TabComponent<T extends string = string> {
  id: T
  component: ComponentType
}

interface ProjectTabContentProps<T extends string> {
  activeTab: T
  tabs: TabComponent<T>[]
}

/**
 * Renders the active tab component based on activeTab value
 *
 * @example
 * ```tsx
 * const tabComponents: TabComponent<Tab>[] = [
 *   { id: 'overview', component: OverviewTab },
 *   { id: 'pipeline', component: PipelineTab },
 *   { id: 'forecasting', component: ForecastingTab },
 * ]
 *
 * <ProjectTabContent activeTab={activeTab} tabs={tabComponents} />
 * ```
 */
export function ProjectTabContent<T extends string>({
  activeTab,
  tabs,
}: ProjectTabContentProps<T>) {
  const activeTabComponent = tabs.find((tab) => tab.id === activeTab)

  if (!activeTabComponent) {
    console.warn(`Tab "${activeTab}" not found in tab components`)
    return null
  }

  const Component = activeTabComponent.component

  return <Component />
}
