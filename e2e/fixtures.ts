import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Define custom fixture types
type TestFixtures = {
  homePage: HomePage
  projectsPage: ProjectsPage
  contactPage: ContactPage
  projectDetailPage: ProjectDetailPage
}

// Page Object Models
class HomePage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
    // Wait for hero title to be visible
    await this.page.locator('h1').waitFor({ state: 'visible', timeout: 30000 })
  }

  async getHeroTitle() {
    return this.page.locator('h1').first()
  }

  async clickViewProjects() {
    // Look for navigation links to projects page
    const projectsLink = this.page.locator('a[href*="/projects"]').first()
    await projectsLink.click()
  }

  async clickContactButton() {
    // Look for contact buttons or modals
    const contactBtn = this.page.locator('button:has-text("Contact")').first()
    if (await contactBtn.isVisible()) {
      await contactBtn.click()
    } else {
      // Try navigation link to contact
      await this.page.locator('a[href*="/contact"]').first().click()
    }
  }
}

class ProjectsPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto('/projects')
    await this.page.waitForLoadState('networkidle')
    // Wait for page content to load
    await this.page.locator('h1').waitFor({ state: 'visible', timeout: 30000 })
  }

  async getProjectCards() {
    // Look for project cards/links
    return this.page.locator('a[href*="/projects/"]')
  }

  async getBlueCTAButtons() {
    return this.page.locator('a').filter({ 
      hasText: /See Revenue Magic|Come Find|Pipeline|Track|Meet|Calculate|Enter|Predict|Optimize|Follow|Explore/ 
    })
  }

  async clickProject(slug: string) {
    await this.page.locator(`a[href*="/projects/${slug}"]`).first().click()
  }

  async clickBlueCTAButton(buttonText: string | RegExp) {
    const button = this.page.locator('a').filter({ hasText: buttonText })
    await button.click()
  }

  async filterByCategory(category: string) {
    const filterBtn = this.page.locator(`button:has-text("${category}")`)
    if (await filterBtn.isVisible()) {
      await filterBtn.click()
    }
  }

  async searchProjects(query: string) {
    const searchInput = this.page.locator('input[placeholder*="search" i]')
    if (await searchInput.isVisible()) {
      await searchInput.fill(query)
    }
  }

  async verifyProjectCardCount() {
    const cards = await this.getProjectCards()
    const count = await cards.count()
    return count > 0
  }

  async getAllBlueCTAButtonTexts() {
    const buttons = await this.getBlueCTAButtons()
    const count = await buttons.count()
    const texts: string[] = []
    
    for (let i = 0; i < count; i++) {
      const text = await buttons.nth(i).textContent()
      if (text) texts.push(text.trim())
    }
    
    return texts
  }
}

class ProjectDetailPage {
  constructor(public readonly page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/projects/${slug}`)
    await this.page.waitForLoadState('networkidle')
    await this.page.locator('h1').waitFor({ state: 'visible', timeout: 30000 })
  }

  async getPageTitle() {
    return this.page.locator('h1').first()
  }

  async clickBackToProjects() {
    const backButton = this.page.locator('a', { hasText: /Back to Projects/i })
    await backButton.click()
  }

  async getCharts() {
    return this.page.locator('svg, canvas, [class*="recharts"], [class*="chart"]')
  }

  async getMetricsCards() {
    return this.page.locator('[class*="bg-white/5"]')
  }

  async getTimeframeButtons() {
    return this.page.locator('button', { hasText: /2020|2022|2024|All/ })
  }

  async getRefreshButton() {
    return this.page.locator('button:has(svg)')
  }

  async verifyDashboardElements() {
    const title = await this.getPageTitle()
    await expect(title).toBeVisible()
    
    const charts = await this.getCharts()
    if (await charts.count() > 0) {
      await expect(charts.first()).toBeVisible()
    }
    
    const backButton = this.page.locator('a', { hasText: /Back to Projects/i })
    await expect(backButton).toBeVisible()
  }

  async verifyLoadingState() {
    // Check for loading indicators
    const loadingIndicators = this.page.locator('[class*="loading"], [class*="spinner"], [class*="animate-spin"]')
    if (await loadingIndicators.count() > 0) {
      await expect(loadingIndicators.first()).not.toBeVisible({ timeout: 10000 })
    }
  }
}

class ContactPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto('/contact')
    await this.page.waitForLoadState('networkidle')
    // Wait for specific form elements to be loaded
    await this.page.locator('input[name="name"]').waitFor({ state: 'visible', timeout: 30000 })
  }

  async fillContactForm(data: {
    name: string
    email: string
    subject: string
    message: string
  }) {
    // Use the name attributes instead of labels for more reliable selection
    await this.page.fill('input[name="name"]', data.name)
    await this.page.fill('input[name="email"]', data.email)
    await this.page.selectOption('select[name="subject"]', data.subject || 'general')
    await this.page.fill('textarea[name="message"]', data.message)
  }

  async submitForm() {
    await this.page.click('button[type="submit"]')
  }

  async getSuccessMessage() {
    return this.page.locator('text=Message Sent!')
  }

  async getErrorMessage() {
    return this.page.locator('text=Something went wrong')
  }

  async waitForFormLoad() {
    await this.page.locator('form').waitFor({ state: 'visible', timeout: 15000 })
    await this.page.locator('input[name="name"]').waitFor({ state: 'visible', timeout: 15000 })
    await this.page.locator('input[name="email"]').waitFor({ state: 'visible', timeout: 15000 })
    await this.page.locator('select[name="subject"]').waitFor({ state: 'visible', timeout: 15000 })
    await this.page.locator('textarea[name="message"]').waitFor({ state: 'visible', timeout: 15000 })
  }
}

// Extend the base test with custom fixtures
export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await use(homePage)
  },

  projectsPage: async ({ page }, use) => {
    const projectsPage = new ProjectsPage(page)
    await use(projectsPage)
  },

  contactPage: async ({ page }, use) => {
    const contactPage = new ContactPage(page)
    await use(contactPage)
  },

  projectDetailPage: async ({ page }, use) => {
    const projectDetailPage = new ProjectDetailPage(page)
    await use(projectDetailPage)
  },
})

export { expect } from '@playwright/test'