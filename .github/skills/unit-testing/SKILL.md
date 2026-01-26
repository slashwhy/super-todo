---
name: unit-testing
description: 'Vitest testing patterns for Vue components and Express routes. Use when writing unit tests, integration tests, mocking dependencies, or testing async code.'
---

# Unit Testing Skill

Patterns for unit and integration testing with Vitest.

## When to Use This Skill

- Writing Vue component tests
- Writing Express route tests
- Mocking Pinia stores
- Mocking Prisma database
- Testing async operations

## Reference Documentation

For detailed patterns and conventions, see:
- [Frontend Testing Instructions](../../instructions/testing-frontend.instructions.md)
- [Backend Testing Instructions](../../instructions/testing-backend.instructions.md)

## Quick Reference

### Vue Component Test Pattern

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import TaskCard from '@/components/TaskCard.vue'

describe('TaskCard', () => {
  let wrapper: VueWrapper

  const mockTask = {
    id: '1',
    title: 'Test Task',
    status: { name: 'Todo', color: '#6B7280' },
    priority: { name: 'High', color: '#EF4444' }
  }

  beforeEach(() => {
    wrapper = mount(TaskCard, {
      props: { task: mockTask },
      global: {
        plugins: [createTestingPinia()]
      }
    })
  })

  it('renders task title', () => {
    expect(wrapper.text()).toContain('Test Task')
  })

  it('emits update event on save', async () => {
    await wrapper.find('[data-testid="save-btn"]').trigger('click')
    expect(wrapper.emitted('update')).toBeTruthy()
  })
})
```

### Backend Route Test Pattern

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import tasksRouter from '../routes/tasks.js'

// Mock Prisma BEFORE importing it
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}))

import { prisma } from '../lib/prisma.js'

describe('Tasks Routes', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/api/tasks', tasksRouter)
    vi.clearAllMocks()
  })

  describe('GET /api/tasks', () => {
    it('returns all tasks', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: { name: 'Todo' } }
      ]
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks)

      const response = await request(app).get('/api/tasks')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockTasks)
    })
  })

  describe('POST /api/tasks', () => {
    it('creates task and returns 201', async () => {
      const newTask = { title: 'New Task', statusId: '1' }
      const created = { id: '2', ...newTask }
      vi.mocked(prisma.task.create).mockResolvedValue(created)

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(created)
    })
  })

  describe('GET /api/tasks/:id', () => {
    it('returns 404 when not found', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null)

      const response = await request(app).get('/api/tasks/nonexistent')

      expect(response.status).toBe(404)
    })
  })
})
```

### Critical Rules

1. **Use `data-testid` selectors** – not CSS classes
2. **Mock at module level** – before imports
3. **Clear mocks in `beforeEach`** – prevent test pollution
4. **Use AAA pattern** – Arrange, Act, Assert
5. **Test behavior, not implementation**

### Pinia Store Mocking

```typescript
import { createTestingPinia } from '@pinia/testing'

// With initial state
const wrapper = mount(Component, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          tasks: { 
            tasks: [mockTask], 
            isLoading: false 
          }
        }
      })
    ]
  }
})

// Access store in tests
const store = useTasksStore()
expect(store.tasks).toHaveLength(1)
```

### Vue Router Mocking

```typescript
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } }
  ]
})

const wrapper = mount(Component, {
  global: {
    plugins: [router]
  }
})

await router.isReady()
```

### Testing Async Operations

```typescript
it('handles async action', async () => {
  const mockData = { id: '1', title: 'Task' }
  vi.mocked(fetchData).mockResolvedValue(mockData)

  const { result } = await doAsyncOperation()

  expect(result).toEqual(mockData)
})

it('handles async errors', async () => {
  vi.mocked(fetchData).mockRejectedValue(new Error('Failed'))

  await expect(doAsyncOperation()).rejects.toThrow('Failed')
})
```

### Test Coverage Checklist

For each unit:

- [ ] Renders correctly with props
- [ ] Handles user interactions
- [ ] Emits correct events
- [ ] Handles loading states
- [ ] Handles error states
- [ ] Handles edge cases (null, empty, etc.)

## Commands

```bash
# Frontend tests
npm run test

# Backend tests
cd backend && npm run test:run

# Watch mode
npm run test -- --watch

# Coverage
npm run test -- --coverage
```
