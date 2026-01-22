import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import configRouter from './config.js'

// Mock Prisma
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    taskStatus: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    taskPriority: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    task: {
      count: vi.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'

describe('Config Routes', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/api/config', configRouter)
    vi.clearAllMocks()
  })

  // ============ TASK STATUSES ============

  describe('GET /api/config/statuses', () => {
    it('returns all statuses with task count ordered by order', async () => {
      const mockStatuses = [
        { id: '1', name: 'Not Started', color: '#808080', order: 1, _count: { tasks: 5 } },
        { id: '2', name: 'In Progress', color: '#FFA500', order: 2, _count: { tasks: 3 } },
        { id: '3', name: 'Completed', color: '#00FF00', order: 3, _count: { tasks: 8 } },
      ]

      vi.mocked(prisma.taskStatus.findMany).mockResolvedValue(mockStatuses as any)

      const response = await request(app).get('/api/config/statuses')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockStatuses)
      expect(prisma.taskStatus.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: { order: 'asc' },
      })
    })

    it('returns empty array when no statuses', async () => {
      vi.mocked(prisma.taskStatus.findMany).mockResolvedValue([])

      const response = await request(app).get('/api/config/statuses')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.taskStatus.findMany).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).get('/api/config/statuses')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch statuses' })
    })
  })

  describe('POST /api/config/statuses', () => {
    it('creates a status and returns 201', async () => {
      const newStatus = { name: 'On Hold' }
      const createdStatus = {
        id: '4',
        name: 'On Hold',
        color: null,
        order: null,
      }

      vi.mocked(prisma.taskStatus.create).mockResolvedValue(createdStatus as any)

      const response = await request(app).post('/api/config/statuses').send(newStatus)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdStatus)
      expect(prisma.taskStatus.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'On Hold' }),
      })
    })

    it('creates status with color and order', async () => {
      const newStatus = {
        name: 'On Hold',
        color: '#FFFF00',
        order: 4,
      }
      const createdStatus = { id: '4', ...newStatus }

      vi.mocked(prisma.taskStatus.create).mockResolvedValue(createdStatus as any)

      const response = await request(app).post('/api/config/statuses').send(newStatus)

      expect(response.status).toBe(201)
      expect(prisma.taskStatus.create).toHaveBeenCalledWith({
        data: {
          name: 'On Hold',
          color: '#FFFF00',
          order: 4,
        },
      })
    })

    it('returns 400 when name is missing', async () => {
      const response = await request(app).post('/api/config/statuses').send({
        color: '#FF0000',
        order: 1,
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Missing required field: name' })
    })

    it('returns 400 when body is empty', async () => {
      const response = await request(app).post('/api/config/statuses').send({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Missing required field: name' })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.taskStatus.create).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).post('/api/config/statuses').send({
        name: 'New Status',
      })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to create status' })
    })
  })

  describe('PUT /api/config/statuses/:id', () => {
    it('updates status name', async () => {
      const updates = { name: 'Updated Status' }
      const updatedStatus = {
        id: '1',
        name: 'Updated Status',
        color: '#808080',
        order: 1,
      }

      vi.mocked(prisma.taskStatus.update).mockResolvedValue(updatedStatus as any)

      const response = await request(app).put('/api/config/statuses/1').send(updates)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedStatus)
      expect(prisma.taskStatus.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Status' },
      })
    })

    it('updates status color', async () => {
      const updates = { color: '#00FF00' }
      const updatedStatus = {
        id: '1',
        name: 'Not Started',
        color: '#00FF00',
        order: 1,
      }

      vi.mocked(prisma.taskStatus.update).mockResolvedValue(updatedStatus as any)

      const response = await request(app).put('/api/config/statuses/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.taskStatus.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { color: '#00FF00' },
      })
    })

    it('updates status order', async () => {
      const updates = { order: 5 }
      const updatedStatus = {
        id: '1',
        name: 'Not Started',
        color: '#808080',
        order: 5,
      }

      vi.mocked(prisma.taskStatus.update).mockResolvedValue(updatedStatus as any)

      const response = await request(app).put('/api/config/statuses/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.taskStatus.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { order: 5 },
      })
    })

    it('updates multiple fields', async () => {
      const updates = {
        name: 'Updated Status',
        color: '#00FF00',
        order: 5,
      }
      const updatedStatus = { id: '1', ...updates }

      vi.mocked(prisma.taskStatus.update).mockResolvedValue(updatedStatus as any)

      const response = await request(app).put('/api/config/statuses/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.taskStatus.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Updated Status',
          color: '#00FF00',
          order: 5,
        },
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.taskStatus.update).mockRejectedValue(new Error('DB Error'))

      const response = await request(app)
        .put('/api/config/statuses/1')
        .send({ name: 'Updated' })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to update status' })
    })
  })

  describe('DELETE /api/config/statuses/:id', () => {
    it('deletes status and returns 204 when not in use', async () => {
      vi.mocked(prisma.task.count).mockResolvedValue(0)
      vi.mocked(prisma.taskStatus.delete).mockResolvedValue({} as any)

      const response = await request(app).delete('/api/config/statuses/1')

      expect(response.status).toBe(204)
      expect(prisma.task.count).toHaveBeenCalledWith({
        where: { statusId: '1' },
      })
      expect(prisma.taskStatus.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('returns 400 when status is in use', async () => {
      vi.mocked(prisma.task.count).mockResolvedValue(5)

      const response = await request(app).delete('/api/config/statuses/1')

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Cannot delete status: 5 tasks are using it',
      })
      expect(prisma.taskStatus.delete).not.toHaveBeenCalled()
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.task.count).mockResolvedValue(0)
      vi.mocked(prisma.taskStatus.delete).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).delete('/api/config/statuses/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to delete status' })
    })
  })

  // ============ TASK PRIORITIES ============

  describe('GET /api/config/priorities', () => {
    it('returns all priorities with task count ordered by order', async () => {
      const mockPriorities = [
        { id: '1', name: 'Low', color: '#00FF00', order: 1, _count: { tasks: 10 } },
        { id: '2', name: 'Medium', color: '#FFFF00', order: 2, _count: { tasks: 7 } },
        { id: '3', name: 'High', color: '#FF0000', order: 3, _count: { tasks: 3 } },
      ]

      vi.mocked(prisma.taskPriority.findMany).mockResolvedValue(mockPriorities as any)

      const response = await request(app).get('/api/config/priorities')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockPriorities)
      expect(prisma.taskPriority.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: { order: 'asc' },
      })
    })

    it('returns empty array when no priorities', async () => {
      vi.mocked(prisma.taskPriority.findMany).mockResolvedValue([])

      const response = await request(app).get('/api/config/priorities')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.taskPriority.findMany).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).get('/api/config/priorities')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch priorities' })
    })
  })

  describe('POST /api/config/priorities', () => {
    it('creates a priority and returns 201', async () => {
      const newPriority = { name: 'Critical' }
      const createdPriority = {
        id: '4',
        name: 'Critical',
        color: null,
        order: null,
      }

      vi.mocked(prisma.taskPriority.create).mockResolvedValue(createdPriority as any)

      const response = await request(app).post('/api/config/priorities').send(newPriority)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdPriority)
      expect(prisma.taskPriority.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'Critical' }),
      })
    })

    it('creates priority with color and order', async () => {
      const newPriority = {
        name: 'Critical',
        color: '#FF0000',
        order: 4,
      }
      const createdPriority = { id: '4', ...newPriority }

      vi.mocked(prisma.taskPriority.create).mockResolvedValue(createdPriority as any)

      const response = await request(app).post('/api/config/priorities').send(newPriority)

      expect(response.status).toBe(201)
      expect(prisma.taskPriority.create).toHaveBeenCalledWith({
        data: {
          name: 'Critical',
          color: '#FF0000',
          order: 4,
        },
      })
    })

    it('returns 400 when name is missing', async () => {
      const response = await request(app).post('/api/config/priorities').send({
        color: '#FF0000',
        order: 1,
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Missing required field: name' })
    })

    it('returns 400 when body is empty', async () => {
      const response = await request(app).post('/api/config/priorities').send({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Missing required field: name' })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.taskPriority.create).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).post('/api/config/priorities').send({
        name: 'New Priority',
      })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to create priority' })
    })
  })

  describe('PUT /api/config/priorities/:id', () => {
    it('updates priority name', async () => {
      const updates = { name: 'Updated Priority' }
      const updatedPriority = {
        id: '1',
        name: 'Updated Priority',
        color: '#00FF00',
        order: 1,
      }

      vi.mocked(prisma.taskPriority.update).mockResolvedValue(updatedPriority as any)

      const response = await request(app).put('/api/config/priorities/1').send(updates)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedPriority)
      expect(prisma.taskPriority.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Priority' },
      })
    })

    it('updates priority color', async () => {
      const updates = { color: '#0000FF' }
      const updatedPriority = {
        id: '1',
        name: 'Low',
        color: '#0000FF',
        order: 1,
      }

      vi.mocked(prisma.taskPriority.update).mockResolvedValue(updatedPriority as any)

      const response = await request(app).put('/api/config/priorities/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.taskPriority.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { color: '#0000FF' },
      })
    })

    it('updates priority order', async () => {
      const updates = { order: 10 }
      const updatedPriority = {
        id: '1',
        name: 'Low',
        color: '#00FF00',
        order: 10,
      }

      vi.mocked(prisma.taskPriority.update).mockResolvedValue(updatedPriority as any)

      const response = await request(app).put('/api/config/priorities/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.taskPriority.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { order: 10 },
      })
    })

    it('updates multiple fields', async () => {
      const updates = {
        name: 'Updated Priority',
        color: '#0000FF',
        order: 10,
      }
      const updatedPriority = { id: '1', ...updates }

      vi.mocked(prisma.taskPriority.update).mockResolvedValue(updatedPriority as any)

      const response = await request(app).put('/api/config/priorities/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.taskPriority.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Updated Priority',
          color: '#0000FF',
          order: 10,
        },
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.taskPriority.update).mockRejectedValue(new Error('DB Error'))

      const response = await request(app)
        .put('/api/config/priorities/1')
        .send({ name: 'Updated' })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to update priority' })
    })
  })

  describe('DELETE /api/config/priorities/:id', () => {
    it('deletes priority and returns 204 when not in use', async () => {
      vi.mocked(prisma.task.count).mockResolvedValue(0)
      vi.mocked(prisma.taskPriority.delete).mockResolvedValue({} as any)

      const response = await request(app).delete('/api/config/priorities/1')

      expect(response.status).toBe(204)
      expect(prisma.task.count).toHaveBeenCalledWith({
        where: { priorityId: '1' },
      })
      expect(prisma.taskPriority.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('returns 400 when priority is in use', async () => {
      vi.mocked(prisma.task.count).mockResolvedValue(7)

      const response = await request(app).delete('/api/config/priorities/1')

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Cannot delete priority: 7 tasks are using it',
      })
      expect(prisma.taskPriority.delete).not.toHaveBeenCalled()
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.task.count).mockResolvedValue(0)
      vi.mocked(prisma.taskPriority.delete).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).delete('/api/config/priorities/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to delete priority' })
    })
  })
})
