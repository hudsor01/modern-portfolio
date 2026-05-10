// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { ProjectTabContent, type TabComponent } from '../shared/project-tab-content'

function Overview() {
  return <div data-testid="t-overview">Overview content</div>
}
function Pipeline() {
  return <div data-testid="t-pipeline">Pipeline content</div>
}
function Forecasting() {
  return <div data-testid="t-forecasting">Forecasting content</div>
}

type Tab = 'overview' | 'pipeline' | 'forecasting'

const tabs: TabComponent<Tab>[] = [
  { id: 'overview', component: Overview },
  { id: 'pipeline', component: Pipeline },
  { id: 'forecasting', component: Forecasting },
]

describe('ProjectTabContent', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the component matching activeTab', () => {
    const { getByTestId, queryByTestId } = render(
      <ProjectTabContent activeTab="overview" tabs={tabs} />
    )
    expect(getByTestId('t-overview')).toBeTruthy()
    expect(queryByTestId('t-pipeline')).toBeNull()
    expect(queryByTestId('t-forecasting')).toBeNull()
  })

  it('switches the rendered component when activeTab changes', () => {
    const { rerender, queryByTestId } = render(
      <ProjectTabContent activeTab="overview" tabs={tabs} />
    )
    expect(queryByTestId('t-overview')).toBeTruthy()
    rerender(<ProjectTabContent activeTab="pipeline" tabs={tabs} />)
    expect(queryByTestId('t-pipeline')).toBeTruthy()
    expect(queryByTestId('t-overview')).toBeNull()
  })

  it('returns null when activeTab does not match any registered tab', () => {
    const { container } = render(<ProjectTabContent activeTab={'unknown' as Tab} tabs={tabs} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when tabs array is empty', () => {
    const { container } = render(<ProjectTabContent activeTab="overview" tabs={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
