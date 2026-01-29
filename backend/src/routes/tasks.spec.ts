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
    taskStatus: {
      findUnique: vi.fn(),
    },
    taskPriority: {
      findUnique: vi.fn(),
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

      vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue({ id: '1', name: 'Todo' } as any)
      vi.mocked(prisma.taskPriority.findUnique).mockResolvedValue({ id: '1', name: 'High' } as any)
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

      vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue({ id: '1', name: 'Todo' } as any)
      vi.mocked(prisma.taskPriority.findUnique).mockResolvedValue({ id: '1', name: 'High' } as any)
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
      vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue({ id: '1', name: 'Todo' } as any)
      vi.mocked(prisma.taskPriority.findUnique).mockResolvedValue({ id: '1', name: 'High' } as any)
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

    it('returns 400 for invalid statusId', async () => {
      vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue(null)

      const response = await request(app).post('/api/tasks').send({
        title: 'New Task',
        statusId: 'invalid-status',
        priorityId: '1',
        ownerId: '1',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid statusId: invalid-status' })
    })

    it('returns 400 for invalid priorityId', async () => {
      vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue({ id: '1', name: 'Todo' } as any)
      vi.mocked(prisma.taskPriority.findUnique).mockResolvedValue(null)

      const response = await request(app).post('/api/tasks').send({
        title: 'New Task',
        statusId: '1',
        priorityId: 'invalid-priority',
        ownerId: '1',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid priorityId: invalid-priority' })
    })
  })

  describe('PATCH /api/tasks/:id', () => {
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

      vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
      vi.mocked(prisma.task.update).mockResolvedValue(updatedTask as any)

      const response = await request(app).patch('/api/tasks/1').send(updates)

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

      vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
      vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue({ id: '2', name: 'Done' } as any)
      vi.mocked(prisma.task.update).mockResolvedValue(updatedTask as any)

      const response = await request(app).patch('/api/tasks/1').send(updates)

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

      vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
      vi.mocked(prisma.task.update).mockResolvedValue(updatedTask as any)

      const response = await request(app).patch('/api/tasks/1').send(updates)

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

      vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
      vi.mocked(prisma.task.update).mockResolvedValue(updatedTask as any)

      const response = await request(app).patch('/api/tasks/1').send(updates)

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
      vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
      vi.mocked(prisma.task.update).mockRejectedValue(new Error('DB Error'))

      const response = await request(app)
        .patch('/api/tasks/1')
        .send({ title: 'Updated' })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to update task' })
    })

    it('returns 404 when task not found', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null)

      const response = await request(app)
        .patch('/api/tasks/nonexistent')
        .send({ title: 'Updated' })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
    })

    it('returns 400 for invalid statusId', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
      vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue(null)

      const response = await request(app)
        .patch('/api/tasks/1')
        .send({ statusId: 'invalid-status' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid statusId: invalid-status' })
    })

    it('returns 400 for invalid priorityId', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
      vi.mocked(prisma.taskPriority.findUnique).mockResolvedValue(null)

      const response = await request(app)
        .patch('/api/tasks/1')
        .send({ priorityId: 'invalid-priority' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid priorityId: invalid-priority' })
    })
  })

  describe('DELETE /api/tasks/:id', () => {
    it('deletes task and returns 204', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
      vi.mocked(prisma.task.delete).mockResolvedValue({} as any)

      const response = await request(app).delete('/api/tasks/1')

      expect(response.status).toBe(204)
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('returns 404 when task not found', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null)

      const response = await request(app).delete('/api/tasks/nonexistent')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
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

    it('calculates percentages correctly with 1 task', async () => {
      vi.mocked(prisma.task.count)
        .mockResolvedValueOnce(1) // total
        .mockResolvedValueOnce(1) // completed
        .mockResolvedValueOnce(0) // inProgress
        .mockResolvedValueOnce(0) // notStarted
        .mockResolvedValueOnce(0) // vital

      const response = await request(app).get('/api/tasks/stats/summary')

      expect(response.status).toBe(200)
      expect(response.body.completedPercentage).toBe(100)
      expect(response.body.inProgressPercentage).toBe(0)
      expect(response.body.notStartedPercentage).toBe(0)
    })
  })

  describe('Edge Cases & Validation', () => {
    describe('Empty query parameters', () => {
      it('returns all tasks when no filters applied', async () => {
        vi.mocked(prisma.task.findMany).mockResolvedValue([])

        const response = await request(app).get('/api/tasks')

        expect(response.status).toBe(200)
        expect(prisma.task.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: {},
          })
        )
      })
    })

    describe('Boolean parameter handling', () => {
      it('correctly parses isVital=false as string', async () => {
        vi.mocked(prisma.task.findMany).mockResolvedValue([])

        await request(app).get('/api/tasks?isVital=false')

        // When isVital is "false" string, it's truthy, so it shouldn't filter
        // This tests the current implementation behavior
        expect(prisma.task.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              isVital: false,
            }),
          })
        )
      })
    })

    describe('Invalid ID format handling', () => {
      it('handles invalid UUID format gracefully in GET', async () => {
        vi.mocked(prisma.task.findUnique).mockResolvedValue(null)

        const response = await request(app).get('/api/tasks/not-a-valid-uuid')

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Task not found' })
      })

      it('handles invalid UUID format gracefully in PATCH', async () => {
        vi.mocked(prisma.task.findUnique).mockResolvedValue(null)

        const response = await request(app)
          .patch('/api/tasks/invalid-uuid')
          .send({ title: 'Updated' })

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Task not found' })
      })

      it('handles invalid UUID format gracefully in DELETE', async () => {
        vi.mocked(prisma.task.findUnique).mockResolvedValue(null)

        const response = await request(app).delete('/api/tasks/invalid-uuid')

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Task not found' })
      })
    })

    describe('Concurrent validation edge cases', () => {
      it('validates both statusId and priorityId when both provided', async () => {
        vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue({ id: '1', name: 'Todo' } as any)
        vi.mocked(prisma.taskPriority.findUnique).mockResolvedValue({ id: '1', name: 'High' } as any)
        vi.mocked(prisma.task.create).mockResolvedValue({
          id: '1',
          title: 'Test',
        } as any)

        await request(app).post('/api/tasks').send({
          title: 'Test Task',
          statusId: 'valid-status',
          priorityId: 'valid-priority',
          ownerId: 'user-1',
        })

        expect(prisma.taskStatus.findUnique).toHaveBeenCalledWith({ where: { id: 'valid-status' } })
        expect(prisma.taskPriority.findUnique).toHaveBeenCalledWith({ where: { id: 'valid-priority' } })
      })

      it('validates only statusId in PATCH when only status provided', async () => {
        vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
        vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue({ id: '1', name: 'Todo' } as any)
        vi.mocked(prisma.task.update).mockResolvedValue({ id: '1' } as any)

        await request(app)
          .patch('/api/tasks/1')
          .send({ statusId: 'new-status' })

        expect(prisma.taskStatus.findUnique).toHaveBeenCalledWith({ where: { id: 'new-status' } })
        expect(prisma.taskPriority.findUnique).not.toHaveBeenCalled()
      })

      it('validates only priorityId in PATCH when only priority provided', async () => {
        vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
        vi.mocked(prisma.taskPriority.findUnique).mockResolvedValue({ id: '1', name: 'High' } as any)
        vi.mocked(prisma.task.update).mockResolvedValue({ id: '1' } as any)

        await request(app)
          .patch('/api/tasks/1')
          .send({ priorityId: 'new-priority' })

        expect(prisma.taskPriority.findUnique).toHaveBeenCalledWith({ where: { id: 'new-priority' } })
        expect(prisma.taskStatus.findUnique).not.toHaveBeenCalled()
      })
    })

    describe('Required fields validation', () => {
      it('returns 400 when all required fields missing', async () => {
        const response = await request(app).post('/api/tasks').send({})

        expect(response.status).toBe(400)
        expect(response.body.error).toContain('Missing required fields')
      })

      it('returns 400 when title is empty string', async () => {
        const response = await request(app).post('/api/tasks').send({
          title: '',
          statusId: '1',
          priorityId: '1',
          ownerId: '1',
        })

        expect(response.status).toBe(400)
        expect(response.body.error).toContain('Missing required fields')
      })
    })

    describe('Optional field handling', () => {
      it('accepts null for optional categoryId', async () => {
        vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue({ id: '1', name: 'Todo' } as any)
        vi.mocked(prisma.taskPriority.findUnique).mockResolvedValue({ id: '1', name: 'High' } as any)
        vi.mocked(prisma.task.create).mockResolvedValue({
          id: '1',
          categoryId: null,
        } as any)

        const response = await request(app).post('/api/tasks').send({
          title: 'Task without category',
          statusId: '1',
          priorityId: '1',
          ownerId: '1',
          categoryId: null,
        })

        expect(response.status).toBe(201)
        expect(prisma.task.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              categoryId: null,
            }),
          })
        )
      })

      it('accepts null for optional assigneeId', async () => {
        vi.mocked(prisma.taskStatus.findUnique).mockResolvedValue({ id: '1', name: 'Todo' } as any)
        vi.mocked(prisma.taskPriority.findUnique).mockResolvedValue({ id: '1', name: 'High' } as any)
        vi.mocked(prisma.task.create).mockResolvedValue({
          id: '1',
          assigneeId: null,
        } as any)

        const response = await request(app).post('/api/tasks').send({
          title: 'Unassigned task',
          statusId: '1',
          priorityId: '1',
          ownerId: '1',
          assigneeId: null,
        })

        expect(response.status).toBe(201)
        expect(prisma.task.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              assigneeId: null,
            }),
          })
        )
      })
    })

    describe('PATCH partial updates', () => {
      it('allows updating only isVital field', async () => {
        vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1', isVital: false } as any)
        vi.mocked(prisma.task.update).mockResolvedValue({ id: '1', isVital: true } as any)

        const response = await request(app)
          .patch('/api/tasks/1')
          .send({ isVital: true })

        expect(response.status).toBe(200)
        expect(prisma.task.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: { isVital: true },
          })
        )
      })

      it('allows updating only description field', async () => {
        vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
        vi.mocked(prisma.task.update).mockResolvedValue({ id: '1' } as any)

        const response = await request(app)
          .patch('/api/tasks/1')
          .send({ description: 'New description' })

        expect(response.status).toBe(200)
        expect(prisma.task.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: { description: 'New description' },
          })
        )
      })

      it('allows clearing description by setting to null', async () => {
        vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: '1' } as any)
        vi.mocked(prisma.task.update).mockResolvedValue({ id: '1' } as any)

        const response = await request(app)
          .patch('/api/tasks/1')
          .send({ description: null })

        expect(response.status).toBe(200)
        expect(prisma.task.update).toHaveBeenCalledWith(
          expect.objectContaining({
            data: { description: null },
          })
        )
      })
    })

    describe('Ordering and sorting', () => {
      it('orders tasks by createdAt descending', async () => {
        vi.mocked(prisma.task.findMany).mockResolvedValue([])

        await request(app).get('/api/tasks')

        expect(prisma.task.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            orderBy: [{ createdAt: 'desc' }],
          })
        )
      })
    })
  })
})
