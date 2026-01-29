import { Page, Locator } from '@playwright/test'

/**
 * Page Object for Task Management
 * Handles all task-related user interactions
 */
export class TasksPage {
  readonly page: Page
  
  // Locators
  readonly taskList: Locator
  readonly taskCards: Locator
  readonly taskListLoading: Locator
  readonly taskListEmpty: Locator
  readonly taskListGrid: Locator
  readonly summaryAllCount: Locator
  readonly summaryNotStartedCount: Locator
  readonly summaryInProgressCount: Locator
  readonly summaryCompletedCount: Locator

  constructor(page: Page) {
    this.page = page
    this.taskList = page.locator('[data-testid="task-list"]')
    this.taskCards = page.locator('[data-testid^="task-card-"]')
    this.taskListLoading = page.locator('[data-testid="task-list-loading"]')
    this.taskListEmpty = page.locator('[data-testid="task-list-empty"]')
    this.taskListGrid = page.locator('[data-testid="task-list-grid"]')
    
    // Summary counts
    this.summaryAllCount = page.locator('.page__summary-item').nth(0).locator('.page__summary-count')
    this.summaryNotStartedCount = page.locator('.page__summary-item--not-started .page__summary-count')
    this.summaryInProgressCount = page.locator('.page__summary-item--in-progress .page__summary-count')
    this.summaryCompletedCount = page.locator('.page__summary-item--completed .page__summary-count')
  }

  async goto() {
    await this.page.goto('/my-tasks')
    await this.page.waitForLoadState('networkidle')
  }

  async waitForTasksToLoad() {
    // Wait for either loading to disappear or tasks/empty state to appear
    await this.page.waitForFunction(() => {
      const loading = document.querySelector('[data-testid="task-list-loading"]')
      const grid = document.querySelector('[data-testid="task-list-grid"]')
      const empty = document.querySelector('[data-testid="task-list-empty"]')
      return !loading && (grid || empty)
    }, { timeout: 10000 })
  }

  async getTaskCount(): Promise<number> {
    await this.waitForTasksToLoad()
    return await this.taskCards.count()
  }

  async getTaskCardById(taskId: string): Locator {
    return this.page.locator(`[data-testid="task-card-${taskId}"]`)
  }

  async getTaskCardByTitle(title: string): Locator {
    return this.page.locator('[data-testid^="task-card-"]', { hasText: title })
  }

  async verifyTaskExists(title: string): Promise<boolean> {
    const card = await this.getTaskCardByTitle(title)
    return await card.isVisible()
  }

  async getSummaryCount(status: 'all' | 'notStarted' | 'inProgress' | 'completed'): Promise<number> {
    let locator: Locator
    switch (status) {
      case 'all':
        locator = this.summaryAllCount
        break
      case 'notStarted':
        locator = this.summaryNotStartedCount
        break
      case 'inProgress':
        locator = this.summaryInProgressCount
        break
      case 'completed':
        locator = this.summaryCompletedCount
        break
    }
    const text = await locator.textContent()
    return parseInt(text || '0', 10)
  }

  async isLoading(): Promise<boolean> {
    return await this.taskListLoading.isVisible()
  }

  async isEmpty(): Promise<boolean> {
    await this.waitForTasksToLoad()
    return await this.taskListEmpty.isVisible()
  }

  async hasError(): Promise<boolean> {
    return await this.page.locator('.page__error').isVisible()
  }

  async getErrorMessage(): Promise<string> {
    const errorEl = this.page.locator('.page__error p')
    return await errorEl.textContent() || ''
  }
}
