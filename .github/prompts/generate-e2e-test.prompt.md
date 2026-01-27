---
description: Generate Playwright E2E test with Page Object pattern
agent: Test E2E
---

# Generate E2E Test

Create a Playwright end-to-end test for a user flow.

## Task

Generate a complete Playwright test with:
- Page Object class for the tested page
- Test cases for happy path and error scenarios
- Proper waiting strategies (no hard-coded waits)
- API mocking when testing frontend in isolation

## Requirements

- Use `data-testid` selectors exclusively (never CSS classes)
- Create Page Object in `e2e/pages/` directory
- Wait for network idle before assertions
- Use `test.describe()` for grouping related tests
- Include both success and failure scenarios

## Context

Reference these files for conventions:
- `.github/instructions/testing-e2e.instructions.md` for E2E patterns
- `e2e/pages/TasksPage.ts` for Page Object example
- `e2e/tasks.spec.ts` for existing test example

## Output

### Page Object (`e2e/pages/YourPage.ts`)
```typescript
import { Page, Locator } from '@playwright/test'

export class YourPage {
  readonly page: Page
  readonly someElement: Locator

  constructor(page: Page) {
    this.page = page
    this.someElement = page.getByTestId('element-id')
  }

  async goto() {
    await this.page.goto('/your-route')
    await this.page.waitForLoadState('networkidle')
  }

  async performAction() {
    await this.someElement.click()
  }
}
```

### Test File (`e2e/your-feature.spec.ts`)
```typescript
import { test, expect } from '@playwright/test'
import { YourPage } from './pages/YourPage'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    const yourPage = new YourPage(page)
    await yourPage.goto()
    // assertions
  })
})
```

## Validation

After generating:
1. Run `npx playwright test your-feature.spec.ts`
2. Check test report with `npx playwright show-report`
3. Verify no flaky tests by running multiple times
