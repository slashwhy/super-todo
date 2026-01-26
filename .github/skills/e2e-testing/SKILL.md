---
name: e2e-testing
description: 'Playwright E2E testing with Page Objects, API mocking, and Chrome DevTools. Use when writing end-to-end tests, testing user flows, or debugging UI behavior.'
---

# E2E Testing Skill

Patterns for Playwright end-to-end testing.

## When to Use This Skill

- Writing E2E tests for user flows
- Creating Page Objects
- Mocking API responses
- Debugging with Chrome DevTools
- Testing responsive layouts

## Reference Documentation

For detailed patterns and conventions, see:
- [E2E Testing Instructions](../../instructions/testing-e2e.instructions.md)

## Quick Reference

### Basic Test Structure

```typescript
import { test, expect, Page } from '@playwright/test'

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
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
    await expect(page.locator('[data-testid="task-list"]'))
      .toContainText('New E2E Task')
  })

  test('filters tasks by status', async ({ page }) => {
    await page.click('[data-testid="filter-status"]')
    await page.click('[data-testid="filter-option-done"]')
    
    const tasks = page.locator('[data-testid="task-card"]')
    await expect(tasks).toHaveCount(2)
  })
})
```

### Page Object Pattern

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

  async getTaskByTitle(title: string): Locator {
    return this.taskCards.filter({ hasText: title })
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

### Critical Rules

1. **Use `data-testid` selectors** – never CSS classes
2. **Wait for `networkidle`** before assertions
3. **Use Page Objects** for complex pages
4. **Never use hard-coded waits** (`waitForTimeout`)
5. **Mock API for isolation** when needed

### API Mocking

```typescript
test('shows error on API failure', async ({ page }) => {
  // Mock API to return error
  await page.route('**/api/tasks', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    })
  })

  await page.goto('/tasks')
  await expect(page.locator('[data-testid="error-message"]'))
    .toBeVisible()
})

test('shows empty state when no tasks', async ({ page }) => {
  await page.route('**/api/tasks', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([])
    })
  })

  await page.goto('/tasks')
  await expect(page.locator('[data-testid="empty-state"]'))
    .toBeVisible()
})
```

### Waiting Strategies

```typescript
// Wait for element
await page.waitForSelector('[data-testid="task-card"]')

// Wait for network idle
await page.waitForLoadState('networkidle')

// Wait for specific response
await page.waitForResponse('**/api/tasks')

// Wait for element state
await expect(page.locator('[data-testid="btn"]'))
  .toBeEnabled()
```

### Form Testing

```typescript
test('validates form fields', async ({ page }) => {
  await page.click('[data-testid="submit-btn"]')
  
  // Check validation errors
  await expect(page.locator('[data-testid="title-error"]'))
    .toHaveText('Title is required')
})

test('fills form completely', async ({ page }) => {
  await page.fill('[data-testid="title-input"]', 'Task Title')
  await page.fill('[data-testid="description-input"]', 'Description')
  await page.selectOption('[data-testid="priority-select"]', 'High')
  await page.check('[data-testid="vital-checkbox"]')
  await page.click('[data-testid="submit-btn"]')
  
  await expect(page.locator('[data-testid="success-toast"]'))
    .toBeVisible()
})
```

### Visual Testing

```typescript
test('matches screenshot', async ({ page }) => {
  await page.goto('/tasks')
  await expect(page).toHaveScreenshot('tasks-page.png')
})

test('component visual regression', async ({ page }) => {
  const card = page.locator('[data-testid="task-card"]').first()
  await expect(card).toHaveScreenshot('task-card.png')
})
```

### DevTools Integration

Use Chrome DevTools MCP for:

```typescript
// Exploration - get page snapshot
// Use: mcp_io_github_chr_snapshot

// Navigate to URL  
// Use: mcp_io_github_chr_navigate

// Click elements
// Use: mcp_io_github_chr_click

// Take screenshot
// Use: mcp_io_github_chr_screenshot
```

## Commands

```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test e2e/tasks.spec.ts

# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui

# Generate report
npx playwright show-report

# Update snapshots
npx playwright test --update-snapshots
```

## Test Coverage Checklist

For each user flow:

- [ ] Happy path completion
- [ ] Form validation errors
- [ ] Empty states
- [ ] Error states (API failures)
- [ ] Loading states
- [ ] Navigation works
- [ ] Responsive on mobile
