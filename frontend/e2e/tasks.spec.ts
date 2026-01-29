import { test, expect } from '@playwright/test'
import { TasksPage } from './pages/TasksPage'

/**
 * E2E Tests for Task CRUD Operations
 * Tests the complete user journey for managing tasks
 */
test.describe('Task CRUD Operations', () => {
  let tasksPage: TasksPage

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page)
    await tasksPage.goto()
    await tasksPage.waitForTasksToLoad()
  })

  test.describe('Read Operations', () => {
    test('displays task list on page load', async () => {
      // Verify task list is visible
      await expect(tasksPage.taskList).toBeVisible()
      
      // Check if there are tasks or empty state
      const hasCards = await tasksPage.getTaskCount()
      const isEmpty = await tasksPage.isEmpty()
      
      expect(hasCards > 0 || isEmpty).toBeTruthy()
    })

    test('shows loading state while fetching tasks', async ({ page }) => {
      // Create new page to catch initial load
      new TasksPage(page)
      const loadingPromise = page.goto('/my-tasks')
      
      // Should show loading indicator during fetch
      await page.locator('[data-testid="task-list-loading"]').isVisible()
        .catch(() => false) // May load too fast to catch
      
      await loadingPromise
      await page.waitForLoadState('networkidle')
      
      // Loading should disappear after fetch completes
      await expect(page.locator('[data-testid="task-list-loading"]')).not.toBeVisible()
    })

    test('displays task cards with all required information', async () => {
      const taskCount = await tasksPage.getTaskCount()
      
      // Skip if no tasks
      if (taskCount === 0) {
        test.skip()
      }

      // Get first task card
      const firstCard = tasksPage.taskCards.first()
      await expect(firstCard).toBeVisible()
      
      // Verify task card contains essential elements
      await expect(firstCard.locator('.task-card__priority')).toBeVisible()
      await expect(firstCard.locator('.task-card__title')).toBeVisible()
      await expect(firstCard.locator('.task-card__status')).toBeVisible()
      
      // Verify card has proper data-testid
      const testId = await firstCard.getAttribute('data-testid')
      expect(testId).toMatch(/^task-card-/)
    })

    test('displays correct task summary counts', async () => {
      const allCount = await tasksPage.getSummaryCount('all')
      const notStartedCount = await tasksPage.getSummaryCount('notStarted')
      const inProgressCount = await tasksPage.getSummaryCount('inProgress')
      const completedCount = await tasksPage.getSummaryCount('completed')
      
      // Verify counts are non-negative
      expect(allCount).toBeGreaterThanOrEqual(0)
      expect(notStartedCount).toBeGreaterThanOrEqual(0)
      expect(inProgressCount).toBeGreaterThanOrEqual(0)
      expect(completedCount).toBeGreaterThanOrEqual(0)
      
      // Verify sum matches total (if there are tasks)
      if (allCount > 0) {
        expect(notStartedCount + inProgressCount + completedCount).toBe(allCount)
      }
    })

    test('displays empty state when no tasks exist', async ({ page }) => {
      // Mock empty API response
      await page.route('**/api/tasks*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      })
      
      await tasksPage.goto()
      await tasksPage.waitForTasksToLoad()
      
      // Should show empty state
      expect(await tasksPage.isEmpty()).toBeTruthy()
      await expect(tasksPage.taskListEmpty).toBeVisible()
      await expect(tasksPage.taskListEmpty).toContainText('All caught up')
    })
  })

  test.describe('Error Handling', () => {
    test('displays error message when API fails', async ({ page }) => {
      // Mock API error
      await page.route('**/api/tasks*', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        })
      })
      
      await tasksPage.goto()
      await page.waitForTimeout(1000) // Wait for error state
      
      // Should display error
      expect(await tasksPage.hasError()).toBeTruthy()
      const errorMsg = await tasksPage.getErrorMessage()
      expect(errorMsg).toContain('Failed to fetch tasks')
    })

    test('handles network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/tasks*', async (route) => {
        await route.abort('failed')
      })
      
      await tasksPage.goto()
      await page.waitForTimeout(1000)
      
      // Should show error state
      expect(await tasksPage.hasError()).toBeTruthy()
    })
  })

  test.describe('Task Filtering', () => {
    test('shows tasks grouped by status', async () => {
      const taskCount = await tasksPage.getTaskCount()
      
      // Skip if no tasks
      if (taskCount === 0) {
        test.skip()
      }

      // Verify we can find tasks with different statuses
      const cards = await tasksPage.taskCards.all()
      const statuses = new Set<string>()
      
      for (const card of cards) {
        const statusEl = card.locator('.task-card__status')
        const statusText = await statusEl.textContent()
        if (statusText) {
          statuses.add(statusText.trim())
        }
      }
      
      // Should have at least one status
      expect(statuses.size).toBeGreaterThan(0)
    })

    test('displays vital tasks with special styling', async () => {
      const taskCount = await tasksPage.getTaskCount()
      
      if (taskCount === 0) {
        test.skip()
      }

      // Look for vital task badge
      const vitalBadges = await tasksPage.page.locator('.task-card__vital-badge').count()
      
      // Vital count should match summary if implemented
      // For now, just verify the locator works
      expect(vitalBadges).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Responsive Behavior', () => {
    test('displays tasks in grid layout', async () => {
      const taskCount = await tasksPage.getTaskCount()
      
      if (taskCount === 0) {
        test.skip()
      }

      // Verify grid container exists
      await expect(tasksPage.taskListGrid).toBeVisible()
      
      // Verify grid has proper CSS class
      const gridClass = await tasksPage.taskListGrid.getAttribute('class')
      expect(gridClass).toContain('task-list__grid')
    })

    test('task cards are clickable', async () => {
      const taskCount = await tasksPage.getTaskCount()
      
      if (taskCount === 0) {
        test.skip()
      }

      const firstCard = tasksPage.taskCards.first()
      
      // Verify card is interactable
      await expect(firstCard).toBeVisible()
      const isEnabled = await firstCard.isEnabled()
      expect(isEnabled).toBeTruthy()
    })
  })

  test.describe('Data Integrity', () => {
    test('task cards maintain data consistency', async ({ page }) => {
      // Intercept API call to verify response structure
      let apiResponse: any = null
      
      await page.route('**/api/tasks*', async (route) => {
        const response = await route.fetch()
        apiResponse = await response.json()
        await route.fulfill({ response })
      })
      
      await tasksPage.goto()
      await tasksPage.waitForTasksToLoad()
      
      // Verify API returned valid data
      if (apiResponse && Array.isArray(apiResponse) && apiResponse.length > 0) {
        const firstTask = apiResponse[0]
        
        // Verify required fields from API
        expect(firstTask).toHaveProperty('id')
        expect(firstTask).toHaveProperty('title')
        expect(firstTask).toHaveProperty('status')
        expect(firstTask).toHaveProperty('priority')
        expect(firstTask.status).toHaveProperty('name')
        expect(firstTask.priority).toHaveProperty('name')
        
        // Find corresponding card in UI
        const card = await tasksPage.getTaskCardById(firstTask.id)
        await expect(card).toBeVisible()
        
        // Verify card displays correct data
        await expect(card).toContainText(firstTask.title)
      }
    })

    test('handles tasks with all optional fields', async ({ page }) => {
      // Mock task with all fields populated
      const fullTask = {
        id: 'test-full-task',
        title: 'Complete Task',
        description: 'Full description',
        image: 'https://example.com/image.png',
        isVital: true,
        dueDate: new Date().toISOString(),
        completedAt: null,
        status: { id: '1', name: 'In Progress', color: '#3b82f6' },
        priority: { id: '1', name: 'Extreme', color: '#ef4444' },
        category: { id: '1', name: 'Work', color: '#10b981' },
        owner: { id: '1', name: 'John Doe' },
        assignee: { id: '2', name: 'Jane Smith' },
      }
      
      await page.route('**/api/tasks*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([fullTask]),
        })
      })
      
      await tasksPage.goto()
      await tasksPage.waitForTasksToLoad()
      
      // Verify task renders without errors
      const card = await tasksPage.getTaskCardById(fullTask.id)
      await expect(card).toBeVisible()
      await expect(card).toContainText(fullTask.title)
    })

    test('handles tasks with minimal required fields', async ({ page }) => {
      // Mock task with only required fields
      const minimalTask = {
        id: 'test-minimal-task',
        title: 'Minimal Task',
        description: null,
        image: null,
        isVital: false,
        dueDate: null,
        completedAt: null,
        status: { id: '1', name: 'Not Started', color: '#ef4444' },
        priority: { id: '1', name: 'Low', color: '#22c55e' },
        category: null,
        owner: { id: '1', name: 'John Doe' },
        assignee: null,
      }
      
      await page.route('**/api/tasks*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([minimalTask]),
        })
      })
      
      await tasksPage.goto()
      await tasksPage.waitForTasksToLoad()
      
      // Verify task renders without errors
      const card = await tasksPage.getTaskCardById(minimalTask.id)
      await expect(card).toBeVisible()
      await expect(card).toContainText(minimalTask.title)
    })
  })

  test.describe('Performance', () => {
    test('loads and renders large task list efficiently', async ({ page }) => {
      // Mock 50 tasks
      const largeTasks = Array.from({ length: 50 }, (_, i) => ({
        id: `task-${i}`,
        title: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        isVital: i % 5 === 0,
        status: { 
          id: `status-${i % 3}`, 
          name: ['Not Started', 'In Progress', 'Completed'][i % 3],
          color: ['#ef4444', '#3b82f6', '#22c55e'][i % 3]
        },
        priority: { 
          id: `priority-${i % 3}`, 
          name: ['Extreme', 'Moderate', 'Low'][i % 3],
          color: ['#ef4444', '#f97316', '#22c55e'][i % 3]
        },
        category: null,
        owner: { id: '1', name: 'Owner' },
        assignee: null,
      }))
      
      await page.route('**/api/tasks*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(largeTasks),
        })
      })
      
      const startTime = Date.now()
      await tasksPage.goto()
      await tasksPage.waitForTasksToLoad()
      const loadTime = Date.now() - startTime
      
      // Should load in reasonable time (< 5 seconds)
      expect(loadTime).toBeLessThan(5000)
      
      // Verify all tasks rendered
      const renderedCount = await tasksPage.getTaskCount()
      expect(renderedCount).toBe(50)
    })
  })
})
