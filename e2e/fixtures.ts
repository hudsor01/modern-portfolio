import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// Define custom fixture types
type TestFixtures = {
  homePage: HomePage
  projectsPage: ProjectsPage
  contactPage: ContactPage
}

// Page Object Models
class HomePage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
    // Wait for hero title to be visible
    await this.page.waitForSelector('h1', { timeout: 30000 })
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
    await this.page.waitForSelector('h1', { timeout: 30000 })
  }

  async getProjectCards() {
    // Look for project cards/links
    return this.page.locator('a[href*="/projects/"]')
  }

  async clickProject(slug: string) {
    await this.page.locator(`a[href*="/projects/${slug}"]`).first().click()
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
}

class ContactPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto('/contact')
    await this.page.waitForLoadState('networkidle')
    // Wait for specific form elements to be loaded
    await this.page.waitForSelector('input[name="name"]', { timeout: 30000 })
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
    await this.page.waitForSelector('form', { timeout: 15000 })
    await this.page.waitForSelector('input[name="name"]', { timeout: 15000 })
    await this.page.waitForSelector('input[name="email"]', { timeout: 15000 })
    await this.page.waitForSelector('select[name="subject"]', { timeout: 15000 })
    await this.page.waitForSelector('textarea[name="message"]', { timeout: 15000 })
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
})

export { expect } from '@playwright/test'