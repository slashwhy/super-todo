import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import categoriesRouter from './categories.js'

// Mock Prisma
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'

describe('Categories Routes', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/api/categories', categoriesRouter)
    vi.clearAllMocks()
  })

  describe('GET /api/categories', () => {
    it('returns all categories with task count', async () => {
      const mockCategories = [
        {
          id: '1',
          name: 'Work',
          description: 'Work related tasks',
          color: '#FF5733',
          icon: 'briefcase',
          _count: { tasks: 5 },
        },
        {
          id: '2',
          name: 'Personal',
          description: 'Personal tasks',
          color: '#33FF57',
          icon: 'user',
          _count: { tasks: 3 },
        },
      ]

      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any)

      const response = await request(app).get('/api/categories')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockCategories)
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: { name: 'asc' },
      })
    })

    it('returns empty array when no categories', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue([])

      const response = await request(app).get('/api/categories')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.category.findMany).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).get('/api/categories')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch categories' })
    })
  })

  describe('GET /api/categories/:id', () => {
    it('returns a category by id with its tasks', async () => {
      const mockCategory = {
        id: '1',
        name: 'Work',
        description: 'Work related tasks',
        color: '#FF5733',
        icon: 'briefcase',
        tasks: [
          {
            id: 't1',
            title: 'Task 1',
            status: { name: 'Todo' },
            priority: { name: 'High' },
            owner: { name: 'Alice' },
          },
          {
            id: 't2',
            title: 'Task 2',
            status: { name: 'Done' },
            priority: { name: 'Low' },
            owner: { name: 'Bob' },
          },
        ],
      }

      vi.mocked(prisma.category.findUnique).mockResolvedValue(mockCategory as any)

      const response = await request(app).get('/api/categories/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockCategory)
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          tasks: expect.objectContaining({
            include: expect.objectContaining({
              status: true,
              priority: true,
              owner: true,
            }),
          }),
        },
      })
    })

    it('returns 404 when category not found', async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(null)

      const response = await request(app).get('/api/categories/nonexistent')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Category not found' })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.category.findUnique).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).get('/api/categories/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch category' })
    })
  })

  describe('POST /api/categories', () => {
    it('creates a category and returns 201', async () => {
      const newCategory = { name: 'Shopping' }
      const createdCategory = {
        id: '3',
        name: 'Shopping',
        description: null,
        color: null,
        icon: null,
      }

      vi.mocked(prisma.category.create).mockResolvedValue(createdCategory as any)

      const response = await request(app).post('/api/categories').send(newCategory)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdCategory)
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'Shopping' }),
      })
    })

    it('creates category with all optional fields', async () => {
      const newCategory = {
        name: 'Shopping',
        description: 'Shopping related tasks',
        color: '#AABBCC',
        icon: 'cart',
      }
      const createdCategory = { id: '3', ...newCategory }

      vi.mocked(prisma.category.create).mockResolvedValue(createdCategory as any)

      const response = await request(app).post('/api/categories').send(newCategory)

      expect(response.status).toBe(201)
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Shopping',
          description: 'Shopping related tasks',
          color: '#AABBCC',
          icon: 'cart',
        },
      })
    })

    it('returns 400 when name is missing', async () => {
      const response = await request(app).post('/api/categories').send({
        description: 'A description',
        color: '#FF0000',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing required field: name',
      })
    })

    it('returns 400 when body is empty', async () => {
      const response = await request(app).post('/api/categories').send({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing required field: name',
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.category.create).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).post('/api/categories').send({
        name: 'New Category',
      })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to create category' })
    })
  })

  describe('PUT /api/categories/:id', () => {
    it('updates category name', async () => {
      const updates = { name: 'Updated Work' }
      const updatedCategory = {
        id: '1',
        name: 'Updated Work',
        description: 'Work related tasks',
        color: '#FF5733',
        icon: 'briefcase',
      }

      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory as any)

      const response = await request(app).put('/api/categories/1').send(updates)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedCategory)
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Work' },
      })
    })

    it('updates category description', async () => {
      const updates = { description: 'Updated description' }
      const updatedCategory = {
        id: '1',
        name: 'Work',
        description: 'Updated description',
        color: '#FF5733',
        icon: 'briefcase',
      }

      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory as any)

      const response = await request(app).put('/api/categories/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { description: 'Updated description' },
      })
    })

    it('updates category color', async () => {
      const updates = { color: '#00FF00' }
      const updatedCategory = {
        id: '1',
        name: 'Work',
        description: 'Work related tasks',
        color: '#00FF00',
        icon: 'briefcase',
      }

      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory as any)

      const response = await request(app).put('/api/categories/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { color: '#00FF00' },
      })
    })

    it('updates category icon', async () => {
      const updates = { icon: 'folder' }
      const updatedCategory = {
        id: '1',
        name: 'Work',
        description: 'Work related tasks',
        color: '#FF5733',
        icon: 'folder',
      }

      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory as any)

      const response = await request(app).put('/api/categories/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { icon: 'folder' },
      })
    })

    it('updates multiple fields', async () => {
      const updates = {
        name: 'Updated Work',
        description: 'Updated description',
        color: '#00FF00',
        icon: 'folder',
      }
      const updatedCategory = { id: '1', ...updates }

      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory as any)

      const response = await request(app).put('/api/categories/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Updated Work',
          description: 'Updated description',
          color: '#00FF00',
          icon: 'folder',
        },
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.category.update).mockRejectedValue(new Error('DB Error'))

      const response = await request(app)
        .put('/api/categories/1')
        .send({ name: 'Updated' })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to update category' })
    })
  })

  describe('DELETE /api/categories/:id', () => {
    it('deletes category and returns 204', async () => {
      vi.mocked(prisma.category.delete).mockResolvedValue({} as any)

      const response = await request(app).delete('/api/categories/1')

      expect(response.status).toBe(204)
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.category.delete).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).delete('/api/categories/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to delete category' })
    })
  })
})
