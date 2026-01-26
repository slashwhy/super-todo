---
name: backend-routes
description: 'Express route handlers with Prisma ORM, async error handling, and security patterns. Use when creating API endpoints, handling requests, or implementing CRUD operations.'
---

# Backend Routes Skill

Patterns for Express route handlers with Prisma and proper error handling.

## When to Use This Skill

- Creating new API endpoints
- Implementing CRUD operations
- Adding request validation
- Handling async errors
- Securing route handlers

## Reference Documentation

For detailed patterns and conventions, see:
- [Backend Routes Instructions](../../instructions/backend-routes.instructions.md)

## Quick Reference

### Route Handler Structure

```typescript
// backend/src/routes/tasks.ts
import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// Async wrapper for error handling
const asyncHandler = (fn: Function) => (
  req: Request, res: Response, next: NextFunction
) => Promise.resolve(fn(req, res, next)).catch(next)

// GET all with filters
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { status, priority } = req.query
  
  const where: any = {}
  if (status) where.status = { name: String(status) }
  if (priority) where.priority = { name: String(priority) }
  
  const tasks = await prisma.task.findMany({
    where,
    include: {
      status: true,
      priority: true,
      category: true,
      owner: true,
      assignee: true
    },
    orderBy: { createdAt: 'desc' }
  })
  
  res.json(tasks)
}))

// GET by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: {
      status: true,
      priority: true,
      category: true
    }
  })
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  
  res.json(task)
}))

// POST create
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  // Whitelist fields explicitly - NEVER pass req.body directly
  const { title, description, statusId, priorityId, categoryId, ownerId } = req.body
  
  const task = await prisma.task.create({
    data: {
      title,
      description,
      statusId,
      priorityId,
      categoryId,
      ownerId
    },
    include: {
      status: true,
      priority: true
    }
  })
  
  res.status(201).json(task)
}))

// PATCH update
router.patch('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { title, description, statusId, priorityId } = req.body
  
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(statusId && { statusId }),
      ...(priorityId && { priorityId })
    },
    include: {
      status: true,
      priority: true
    }
  })
  
  res.json(task)
}))

// DELETE
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  await prisma.task.delete({
    where: { id: req.params.id }
  })
  
  res.status(204).send()
}))

export default router
```

### Critical Rules

1. **Use `.js` extension** in ESM imports: `import { prisma } from '../lib/prisma.js'`
2. **Whitelist fields explicitly** – never pass `req.body` directly to Prisma
3. **Always include relations** in Prisma queries
4. **Wrap handlers with asyncHandler** for error handling
5. **Return appropriate status codes** (201 for create, 204 for delete)

### Error Handling

```typescript
// Global error handler in index.ts
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})
```

### Query Filters

```typescript
// Build dynamic where clause
const where: Prisma.TaskWhereInput = {}

if (req.query.status) {
  where.status = { name: String(req.query.status) }
}

if (req.query.isVital === 'true') {
  where.isVital = true
}

if (req.query.ownerId) {
  where.ownerId = String(req.query.ownerId)
}
```

### Include Relations

```typescript
// Always include needed relations
const include = {
  status: true,
  priority: true,
  category: true,
  owner: true,
  assignee: true
}
```

## File Naming

- Routes: `resource.ts` (e.g., `tasks.ts`)
- Tests: `resource.spec.ts` alongside
- Location: `backend/src/routes/`
