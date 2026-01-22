import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import usersRouter from './users.js'

// Mock Prisma
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'

describe('Users Routes', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/api/users', usersRouter)
    vi.clearAllMocks()
  })

  describe('GET /api/users', () => {
    it('returns all users ordered by name', async () => {
      const mockUsers = [
        { id: '1', name: 'Alice', email: 'alice@example.com', avatar: null },
        { id: '2', name: 'Bob', email: 'bob@example.com', avatar: 'https://example.com/bob.png' },
      ]

      vi.mocked(prisma.user.findMany).mockResolvedValue(mockUsers as any)

      const response = await request(app).get('/api/users')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockUsers)
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      })
    })

    it('returns empty array when no users', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([])

      const response = await request(app).get('/api/users')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.user.findMany).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).get('/api/users')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch users' })
    })
  })

  describe('GET /api/users/:id', () => {
    it('returns a user by id with their tasks', async () => {
      const mockUser = {
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        avatar: null,
        tasks: [
          {
            id: 't1',
            title: 'Task 1',
            status: { name: 'Todo' },
            priority: { name: 'High' },
            category: null,
          },
        ],
        assignedTasks: [
          {
            id: 't2',
            title: 'Task 2',
            status: { name: 'In Progress' },
            priority: { name: 'Low' },
            category: { name: 'Work' },
          },
        ],
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)

      const response = await request(app).get('/api/users/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockUser)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          tasks: expect.objectContaining({
            include: expect.objectContaining({
              status: true,
              priority: true,
              category: true,
            }),
          }),
          assignedTasks: expect.objectContaining({
            include: expect.objectContaining({
              status: true,
              priority: true,
              category: true,
            }),
          }),
        },
      })
    })

    it('returns 404 when user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const response = await request(app).get('/api/users/nonexistent')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'User not found' })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).get('/api/users/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to fetch user' })
    })
  })

  describe('POST /api/users', () => {
    it('creates a user and returns 201', async () => {
      const newUser = {
        name: 'Charlie',
        email: 'charlie@example.com',
      }
      const createdUser = {
        id: '3',
        ...newUser,
        avatar: null,
      }

      vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any)

      const response = await request(app).post('/api/users').send(newUser)

      expect(response.status).toBe(201)
      expect(response.body).toEqual(createdUser)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { name: 'Charlie', email: 'charlie@example.com', avatar: undefined },
      })
    })

    it('creates user with avatar', async () => {
      const newUser = {
        name: 'Charlie',
        email: 'charlie@example.com',
        avatar: 'https://example.com/charlie.png',
      }
      const createdUser = { id: '3', ...newUser }

      vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any)

      const response = await request(app).post('/api/users').send(newUser)

      expect(response.status).toBe(201)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          avatar: 'https://example.com/charlie.png',
        }),
      })
    })

    it('returns 400 when name is missing', async () => {
      const response = await request(app).post('/api/users').send({
        email: 'test@example.com',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing required fields: name, email',
      })
    })

    it('returns 400 when email is missing', async () => {
      const response = await request(app).post('/api/users').send({
        name: 'Test User',
      })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing required fields: name, email',
      })
    })

    it('returns 400 when both name and email are missing', async () => {
      const response = await request(app).post('/api/users').send({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Missing required fields: name, email',
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.user.create).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).post('/api/users').send({
        name: 'Test',
        email: 'test@example.com',
      })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to create user' })
    })
  })

  describe('PUT /api/users/:id', () => {
    it('updates user name', async () => {
      const updates = { name: 'Updated Name' }
      const updatedUser = {
        id: '1',
        name: 'Updated Name',
        email: 'alice@example.com',
        avatar: null,
      }

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any)

      const response = await request(app).put('/api/users/1').send(updates)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedUser)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Name' },
      })
    })

    it('updates user email', async () => {
      const updates = { email: 'newemail@example.com' }
      const updatedUser = {
        id: '1',
        name: 'Alice',
        email: 'newemail@example.com',
        avatar: null,
      }

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any)

      const response = await request(app).put('/api/users/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { email: 'newemail@example.com' },
      })
    })

    it('updates user avatar', async () => {
      const updates = { avatar: 'https://example.com/new-avatar.png' }
      const updatedUser = {
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        avatar: 'https://example.com/new-avatar.png',
      }

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any)

      const response = await request(app).put('/api/users/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { avatar: 'https://example.com/new-avatar.png' },
      })
    })

    it('updates multiple fields', async () => {
      const updates = {
        name: 'Updated Name',
        email: 'updated@example.com',
        avatar: 'https://example.com/updated.png',
      }
      const updatedUser = { id: '1', ...updates }

      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser as any)

      const response = await request(app).put('/api/users/1').send(updates)

      expect(response.status).toBe(200)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: 'Updated Name',
          email: 'updated@example.com',
          avatar: 'https://example.com/updated.png',
        },
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.user.update).mockRejectedValue(new Error('DB Error'))

      const response = await request(app)
        .put('/api/users/1')
        .send({ name: 'Updated' })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to update user' })
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('deletes user and returns 204', async () => {
      vi.mocked(prisma.user.delete).mockResolvedValue({} as any)

      const response = await request(app).delete('/api/users/1')

      expect(response.status).toBe(204)
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.user.delete).mockRejectedValue(new Error('DB Error'))

      const response = await request(app).delete('/api/users/1')

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Failed to delete user' })
    })
  })
})
