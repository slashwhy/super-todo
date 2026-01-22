---
applyTo: 'backend/**/*.{spec,test}.ts'
---

# Backend Testing with Vitest

## Test File Structure

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import tasksRouter from '../routes/tasks.js'

// Mock Prisma
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
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
        { id: '1', title: 'Task 1', status: { name: 'Todo' } },
        { id: '2', title: 'Task 2', status: { name: 'Done' } },
      ]
      
      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks)

      const response = await request(app).get('/api/tasks')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockTasks)
      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ include: expect.any(Object) })
      )
    })

    it('filters by status', async () => {
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

      await request(app).get('/api/tasks?status=Done')

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { name: 'Done' },
          }),
        })
      )
    })
  })

  describe('POST /api/tasks', () => {
    it('creates a task and returns 201', async () => {
      const newTask = { title: 'New Task', statusId: '1' }
      const createdTask = { id: '3', ...newTask, status: { name: 'Todo' } }

      vi.mocked(prisma.task.create).mockResolvedValue(createdTask)

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdTask)
    })
  })

  describe('GET /api/tasks/:id', () => {
    it('returns 404 when task not found', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null)

      const response = await request(app).get('/api/tasks/nonexistent')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
    })
  })
})
```

## Mocking Prisma

### Create a Mock Factory

```typescript
// test/mocks/prisma.ts
import { vi } from 'vitest'

export const mockPrisma = {
  task: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  $transaction: vi.fn((callbacks) => Promise.all(callbacks)),
}
```

### Reset Between Tests

```typescript
beforeEach(() => {
  vi.clearAllMocks()
})
```

## Testing Patterns

### Testing Error Handling

```typescript
it('returns 500 on database error', async () => {
  vi.mocked(prisma.task.findMany).mockRejectedValue(new Error('DB Error'))

  const response = await request(app).get('/api/tasks')

  expect(response.status).toBe(500)
  expect(response.body).toEqual({ error: 'Failed to fetch tasks' })
})
```

### Testing with Query Parameters

```typescript
it('supports multiple filters', async () => {
  await request(app).get('/api/tasks?status=Todo&priority=High&isVital=true')

  expect(prisma.task.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        status: { name: 'Todo' },
        priority: { name: 'High' },
        isVital: true,
      },
    })
  )
})
```

### Testing PATCH Updates

```typescript
it('updates task fields', async () => {
  const updates = { title: 'Updated Title' }
  vi.mocked(prisma.task.update).mockResolvedValue({ id: '1', ...updates })

  const response = await request(app)
    .patch('/api/tasks/1')
    .send(updates)

  expect(response.status).toBe(200)
  expect(prisma.task.update).toHaveBeenCalledWith({
    where: { id: '1' },
    data: updates,
    include: expect.any(Object),
  })
})
```

## Best Practices

- Mock at the module level with `vi.mock()`
- Use `vi.mocked()` for type-safe mock assertions
- Clear mocks between tests with `vi.clearAllMocks()`
- Test both success and error paths
- Verify Prisma was called with correct parameters
- Use supertest for HTTP-level integration tests
- Keep test data minimal but realistic
- Use descriptive test names: "returns 404 when task not found"
