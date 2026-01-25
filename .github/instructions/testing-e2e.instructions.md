---
description: 'Playwright E2E testing with Page Objects, API mocking, and data-testid selectors'
applyTo: 'e2e/**/*.ts, **/*.e2e.ts, **/*.e2e-spec.ts'
---

# End-to-End Testing with Playwright

> Create E2E tests in `e2e/` directory. Install Playwright: `npm create playwright@latest`

## Test File Structure

```typescript
import { test, expect, Page } from '@playwright/test'

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Reset to known state before each test
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('creates a new task', async ({ page }) => {
    // Arrange
    await page.click('[data-testid="add-task-btn"]')
    
    // Act
    await page.fill('[data-testid="task-title-input"]', 'New E2E Task')
    await page.selectOption('[data-testid="status-select"]', 'Todo')
    await page.click('[data-testid="save-task-btn"]')
    
    // Assert
    await expect(page.locator('[data-testid="task-list"]')).toContainText('New E2E Task')
  })

  test('filters tasks by status', async ({ page }) => {
    await page.click('[data-testid="filter-status"]')
    await page.click('[data-testid="filter-option-done"]')
    
    const tasks = page.locator('[data-testid="task-card"]')
    await expect(tasks).toHaveCount(2)
    
    for (const task of await tasks.all()) {
      await expect(task.locator('[data-testid="task-status"]')).toHaveText('Done')
    }
  })
})
```

## Page Object Pattern

Create reusable page objects for complex pages:

```typescript
// e2e/pages/TasksPage.ts
import { Page, Locator } from '@playwright/test'

export class TasksPage {
  readonly page: Page
  readonly addTaskButton: Locator
  readonly taskList: Locator
  readonly taskCards: Locator

  constructor(page: Page) {
    this.page = page
    this.addTaskButton = page.locator('[data-testid="add-task-btn"]')
    this.taskList = page.locator('[data-testid="task-list"]')
    this.taskCards = page.locator('[data-testid="task-card"]')
  }

  async goto() {
    await this.page.goto('/tasks')
    await this.page.waitForLoadState('networkidle')
  }

  async createTask(title: string, status: string) {
    await this.addTaskButton.click()
    await this.page.fill('[data-testid="task-title-input"]', title)
    await this.page.selectOption('[data-testid="status-select"]', status)
    await this.page.click('[data-testid="save-task-btn"]')
  }

  async getTaskCount(): Promise<number> {
    return this.taskCards.count()
  }
}

// Usage in tests
test('creates task via page object', async ({ page }) => {
  const tasksPage = new TasksPage(page)
  await tasksPage.goto()
  await tasksPage.createTask('New Task', 'Todo')
  expect(await tasksPage.getTaskCount()).toBeGreaterThan(0)
})
```

## Locator Strategies

Prefer `data-testid` attributes for stable selectors:

```typescript
// Good - stable selectors
page.locator('[data-testid="submit-btn"]')
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')
page.getByText('Welcome')

// Avoid - brittle selectors
page.locator('.btn-primary')
page.locator('#submit')
page.locator('div > button:first-child')
```

## API Mocking

Mock API responses for predictable tests:

```typescript
test('displays error on API failure', async ({ page }) => {
  await page.route('/api/tasks', (route) => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server Error' }),
    })
  })

  await page.goto('/tasks')
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
})

test('loads tasks from API', async ({ page }) => {
  await page.route('/api/tasks', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: '1', title: 'Mocked Task', status: { name: 'Todo' } },
      ]),
    })
  })

  await page.goto('/tasks')
  await expect(page.locator('[data-testid="task-card"]')).toHaveCount(1)
})
```

## Waiting Strategies

```typescript
// Wait for element
await page.waitForSelector('[data-testid="task-list"]')

// Wait for network
await page.waitForLoadState('networkidle')

// Wait for specific response
await Promise.all([
  page.waitForResponse('/api/tasks'),
  page.click('[data-testid="refresh-btn"]'),
])

// Wait for navigation
await Promise.all([
  page.waitForNavigation(),
  page.click('[data-testid="nav-link"]'),
])
```

## Best Practices

- Use `data-testid` attributes for stable selectors
- Implement Page Object Pattern for complex pages
- Mock APIs for predictable test data
- Run tests in isolation - each test should be independent
- Use `beforeEach` to reset state
- Wait for network idle before assertions

## Common Pitfalls

- ❌ Brittle CSS selectors → Use `data-testid` or role-based selectors
- ❌ Not waiting for async → Use `waitForLoadState('networkidle')`
- ❌ Sharing state between tests → Reset in `beforeEach`
- ❌ Hardcoded waits → Use proper wait strategies
```
