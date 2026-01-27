---
description: Generate Vitest unit test for Vue component or Express route
agent: Test Unit
---

# Generate Unit Test

Create a Vitest unit test for a component or backend route.

## Task

Generate comprehensive unit tests with:
- Proper mocking (Prisma for backend, Pinia for frontend)
- AAA pattern (Arrange, Act, Assert)
- Happy path and error case coverage
- Edge case handling

## Requirements

### For Vue Components
- Use Vue Test Utils with `mount()` or `shallowMount()`
- Use `createTestingPinia()` for store mocking
- Use `data-testid` selectors via `wrapper.find('[data-testid="..."]')`
- Test user interactions with `await wrapper.trigger('click')`

### For Express Routes
- Use Supertest for HTTP assertions
- Mock Prisma with `vi.mock('../lib/prisma.js')`
- Test all HTTP methods and status codes
- Verify response body structure

## Context

Reference these files for conventions:
- `.github/instructions/testing-frontend.instructions.md` for Vue tests
- `.github/instructions/testing-backend.instructions.md` for Express tests
- `src/components/tasks/TaskCard.spec.ts` for component test example
- `backend/src/routes/tasks.spec.ts` for route test example

## Output

### Vue Component Test
```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import YourComponent from './YourComponent.vue'

describe('YourComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(YourComponent, {
      global: {
        plugins: [createTestingPinia()]
      },
      props: { /* props */ }
    })
    expect(wrapper.find('[data-testid="element"]').exists()).toBe(true)
  })
})
```

### Express Route Test
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import router from './your-route.js'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    yourModel: {
      findMany: vi.fn(),
    }
  }
}))

describe('GET /api/your-route', () => {
  // tests
})
```

## Validation

After generating:
1. Run `npm run test` (frontend) or `npm run test:run` (backend)
2. Check coverage with `npm run test -- --coverage`
3. Ensure all assertions are meaningful (not just `toBeDefined()`)
