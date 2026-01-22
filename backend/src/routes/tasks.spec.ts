import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import tasksRouter from './tasks.js'

// Mock Prisma
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
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
        {
          id: '1',
          title: 'Task 1',
          description: null,
          isVital: false,
          status: { id: '1', name: 'Todo' },
          priority: { id: '1', name: 'High' },
          category: null,
          owner: { id: '1', name: 'John' },
          assignee: null,
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'A description',
          isVital: true,
          status: { id: '2', name: 'Done' },
          priority: { id: '2', name: 'Low' },
          category: { id: '1', name: 'Work' },
          owner: { id: '1', name: 'John' },
          assignee: { id: '2', name: 'Jane' },
        },
      ]

      vi.mocked(prisma.task.findMany).mockResolvedValue(mockTasks as any)

      const response = await request(app).get('/api/tasks')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockTasks)
      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            status: true,
            priority: true,
            category: true,
            owner: true,
            assignee: true,
          }),
        })
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

    it('filters by priority', async () => {
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

      await request(app).get('/api/tasks?priority=High')

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            priority: { name: 'High' },
          }),
        })
      )
    })

    it('filters by category', async () => {
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

      await request(app).get('/api/tasks?category=Work')

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { name: 'Work' },
          }),
        })
      )
    })

    it('filters by isVital', async () => {
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

      await request(app).get('/api/tasks?isVital=true')

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isVital: true,
          }),
        })
      )
    })

    it('filters by ownerId', async () => {
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

      await request(app).get('/api/tasks?ownerId=user-123')

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            ownerId: 'user-123',
          }),
        })
      )
    })

    it('supports multiple filters', async () => {
      vi.mocked(prisma.task.findMany).mockResolvedValue([])

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

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.task.findMany).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).get('/api/tasks')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch tasks' })
    })
  })

  describe('GET /api/tasks/:id', () => {
    it('returns a task by id', async () => {
      const mockTask = {
        id: '1',
        title: 'Task 1',
        description: 'Test description',
        isVital: false,
        status: { id: '1', name: 'Todo' },
        priority: { id: '1', name: 'High' },
        category: null,
        owner: { id: '1', name: 'John' },
        assignee: null,
      }

      vi.mocked(prisma.task.findUnique).mockResolvedValue(mockTask as any)

      const response = await request(app).get('/api/tasks/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockTask)
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.objectContaining({
          status: true,
          priority: true,
          category: true,
          owner: true,
          assignee: true,
        }),
      })
    })

    it('returns 404 when task not found', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null)

      const response = await request(app).get('/api/tasks/nonexistent')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.task.findUnique).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).get('/api/tasks/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch task' })
    })
  })

  describe('POST /api/tasks', () => {
    it('creates a task and returns 201', async () => {
      const newTask = {
        title: 'New Task',
        statusId: '1',
        priorityId: '1',
        ownerId: '1',
      }
      const createdTask = {
        id: '3',
        ...newTask,
        description: null,
        image: null,
        isVital: false,
        dueDate: null,
        categoryId: null,
        assigneeId: null,
        status: { id: '1', name: 'Todo' },
        priority: { id: '1', name: 'High' },
        category: null,
        owner: { id: '1', name: 'John' },
        assignee: null,
      }

      vi.mocked(prisma.task.create).mockResolvedValue(createdTask as any)

      const response = await request(app).post('/api/tasks').send(newTask)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdTask)
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'New Task',
          statusId: '1',
          priorityId: '1',
          ownerId: '1',
          isVital: false,
        }),
        include: expect.any(Object),
      })
    })

    it('creates task with all optional fields', async () => {
      const newTask = {
        title: 'New Task',
        description: 'A description',
        image: 'https://example.com/image.png',
        isVital: true,
        dueDate: '2026-02-01T00:00:00.000Z',
        statusId: '1',
        priorityId: '1',
        categoryId: '1',
        ownerId: '1',
        assigneeId: '2',
      }
      const createdTask = { id: '3', ...newTask }

      vi.mocked(prisma.task.create).mockResolvedValue(createdTask as any)

      const response = await request(app).post('/api/tasks').send(newTask)

      expect(response.status).toBe(201)
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'New Task',
          description: 'A description',
          isVital: true,
          categoryId: '1',
          assigneeId: '2',
        }),
        include: expect.any(Object),
      })
    })

    it('returns 400 when title is missing', async () => {
      const response = await request(app).post('/api/tasks').send({
        statusId: '1',
        priorityId: '1',
        ownerId: '1',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing required fields: title, statusId, priorityId, ownerId',
      })
    })

    it('returns 400 when statusId is missing', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'New Task',
        priorityId: '1',
        ownerId: '1',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing required fields: title, statusId, priorityId, ownerId',
      })
    })

    it('returns 400 when priorityId is missing', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'New Task',
        statusId: '1',
        ownerId: '1',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing required fields: title, statusId, priorityId, ownerId',
      })
    })

    it('returns 400 when ownerId is missing', async () => {
      const response = await request(app).post('/api/tasks').send({
        title: 'New Task',
        statusId: '1',
        priorityId: '1',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing required fields: title, statusId, priorityId, ownerId',
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.task.create).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).post('/api/tasks').send({
        title: 'New Task',
        statusId: '1',
        priorityId: '1',
        ownerId: '1',
      })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to create task' })
    })
  })

  describe('PUT /api/tasks/:id', () => {
    it('updates task fields', async () => {
      const updates = { title: 'Updated Title' }
      const updatedTask = {
        id: '1',
        title: 'Updated Title',
        status: { id: '1', name: 'Todo' },
        priority: { id: '1', name: 'High' },
        category: null,
        owner: { id: '1', name: 'John' },
        assignee: null,
      }

      vi.mocked(prisma.task.update).mockResolvedValue(updatedTask as any)

      const response = await request(app).put('/api/tasks/1').send(updates)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedTask)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: 'Updated Title' },
        include: expect.any(Object),
      })
    })

    it('updates multiple fields', async () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated description',
        isVital: true,
        statusId: '2',
      }
      const updatedTask = { id: '1', ...updates }

      vi.mocked(prisma.task.update).mockResolvedValue(updatedTask as any)

      const response = await request(app).put('/api/tasks/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({
          title: 'Updated Title',
          description: 'Updated description',
          isVital: true,
          statusId: '2',
        }),
        include: expect.any(Object),
      })
    })

    it('handles date fields correctly', async () => {
      const updates = {
        dueDate: '2026-03-01T00:00:00.000Z',
        completedAt: '2026-02-15T10:00:00.000Z',
      }
      const updatedTask = { id: '1', ...updates }

      vi.mocked(prisma.task.update).mockResolvedValue(updatedTask as any)

      const response = await request(app).put('/api/tasks/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({
          dueDate: expect.any(Date),
          completedAt: expect.any(Date),
        }),
        include: expect.any(Object),
      })
    })

    it('can clear date fields with null', async () => {
      const updates = { dueDate: null, completedAt: null }
      const updatedTask = { id: '1', dueDate: null, completedAt: null }

      vi.mocked(prisma.task.update).mockResolvedValue(updatedTask as any)

      const response = await request(app).put('/api/tasks/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({
          dueDate: null,
          completedAt: null,
        }),
        include: expect.any(Object),
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.task.update).mockRejectedValue(new Error('DB Error'))

      const response = await request(app)
        .put('/api/tasks/1')
        .send({ title: 'Updated' })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to update task' })
    })
  })

  describe('DELETE /api/tasks/:id', () => {
    it('deletes task and returns 204', async () => {
      vi.mocked(prisma.task.delete).mockResolvedValue({} as any)

      const response = await request(app).delete('/api/tasks/1')

      expect(response.status).toBe(204)
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.task.delete).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).delete('/api/tasks/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to delete task' })
    })
  })

  describe('GET /api/tasks/stats/summary', () => {
    it('returns task statistics', async () => {
      vi.mocked(prisma.task.count)
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(4) // completed
        .mockResolvedValueOnce(3) // inProgress
        .mockResolvedValueOnce(3) // notStarted
        .mockResolvedValueOnce(2) // vital

      const response = await request(app).get('/api/tasks/stats/summary')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        total: 10,
        completed: 4,
        inProgress: 3,
        notStarted: 3,
        vital: 2,
        completedPercentage: 40,
        inProgressPercentage: 30,
        notStartedPercentage: 30,
      })
    })

    it('handles zero tasks correctly', async () => {
      vi.mocked(prisma.task.count).mockResolvedValue(0)

      const response = await request(app).get('/api/tasks/stats/summary')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        vital: 0,
        completedPercentage: 0,
        inProgressPercentage: 0,
        notStartedPercentage: 0,
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.task.count).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).get('/api/tasks/stats/summary')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch task statistics' })
    })
  })
})
