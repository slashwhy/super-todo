---
applyTo: 'backend/src/routes/**/*.ts'
---

# Express Routes Development

## Route Structure

Use async handlers with proper error handling:

```typescript
import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";  // Note: .js extension required for ESM

const router = Router();

// GET collection with filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, priority, ownerId } = req.query;
    
    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status: { name: status as string } }),
        ...(priority && { priority: { name: priority as string } }),
        ...(ownerId && { ownerId: ownerId as string }),
      },
      include: { status: true, priority: true, category: true, owner: true },
      orderBy: { createdAt: "desc" },
    });
    
    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET single resource
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { status: true, priority: true, category: true, owner: true },
    });
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    res.json(task);
  } catch (error) {
    console.error("Failed to fetch task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// POST create
router.post("/", async (req: Request, res: Response) => {
  try {
    // Explicitly destructure and whitelist allowed fields
    const {
      title,
      description,
      image,
      isVital,
      dueDate,
      statusId,
      priorityId,
      categoryId,
      ownerId,
      assigneeId,
    } = req.body;

    // Validate required fields
    if (!title || !statusId || !priorityId || !ownerId) {
      return res.status(400).json({
        error: "Missing required fields: title, statusId, priorityId, ownerId",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        image,
        isVital: isVital ?? false,
        dueDate: dueDate ? new Date(dueDate) : null,
        statusId,
        priorityId,
        categoryId,
        ownerId,
        assigneeId,
      },
      include: { status: true, priority: true, category: true, owner: true },
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error("Failed to create task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PATCH update
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    // Explicitly destructure and whitelist updatable fields
    const {
      title,
      description,
      image,
      isVital,
      dueDate,
      completedAt,
      statusId,
      priorityId,
      categoryId,
      assigneeId,
    } = req.body;

    // Note: ownerId is intentionally excluded - ownership should not change after creation
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(isVital !== undefined && { isVital }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
        ...(statusId !== undefined && { statusId }),
        ...(priorityId !== undefined && { priorityId }),
        ...(categoryId !== undefined && { categoryId }),
        ...(assigneeId !== undefined && { assigneeId }),
      },
      include: { status: true, priority: true, category: true, owner: true },
    });
    
    res.json(task);
  } catch (error) {
    console.error("Failed to update task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
```

## HTTP Status Codes

| Operation | Success | Not Found | Error |
|-----------|---------|-----------|-------|
| GET collection | 200 | - | 500 |
| GET single | 200 | 404 | 500 |
| POST | 201 | - | 400/500 |
| PATCH/PUT | 200 | 404 | 400/500 |
| DELETE | 204 | 404 | 500 |

## Import Conventions

Always use `.js` extension for ESM imports:

```typescript
import { prisma } from "../lib/prisma.js";
import { validateTask } from "../validators/task.js";
```

## Prisma Query Patterns

Always include related entities:

```typescript
const include = { status: true, priority: true, category: true, owner: true };

// Use conditional spreading for optional filters
const where = {
  ...(status && { status: { name: status as string } }),
  ...(isVital && { isVital: isVital === "true" }),
};
```

## Input Validation

Validate request body before database operations:

```typescript
router.post("/", async (req: Request, res: Response) => {
  const { title, statusId, priorityId } = req.body;
  
  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  
  // Proceed with creation...
});
```

## Security Best Practices

### Prevent Mass-Assignment Vulnerabilities

**Never pass `req.body` directly to Prisma operations.** Always explicitly destructure and whitelist allowed fields:

```typescript
// ❌ DANGEROUS - allows clients to set any field including internal flags
const task = await prisma.task.create({
  data: req.body  // Client could inject ownerId, id, createdAt, etc.
});

// ✅ SECURE - only specified fields can be set
const { title, description, statusId, priorityId, ownerId } = req.body;
const task = await prisma.task.create({
  data: { title, description, statusId, priorityId, ownerId }
});
```

### Protect Server-Controlled Fields

Some fields should never be set by clients:

```typescript
// Fields to exclude from updates:
// - id: Primary key, auto-generated
// - createdAt: Set once on creation
// - updatedAt: Managed by Prisma
// - ownerId: Should not change after creation (or require special authorization)

router.patch("/:id", async (req: Request, res: Response) => {
  // Only allow specific fields to be updated
  const { title, description, statusId, assigneeId } = req.body;
  
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { title, description, statusId, assigneeId }
  });
});
```

### Use Conditional Updates for Optional Fields

When updating, only include fields that are actually provided:

```typescript
const updateData = {
  ...(title !== undefined && { title }),
  ...(description !== undefined && { description }),
  ...(statusId !== undefined && { statusId }),
};
```

## Error Handling

- Log errors with context for debugging
- Return user-friendly error messages
- Never expose internal error details to clients
- Use try/catch in every route handler
- Validate and sanitize all user inputs
- Explicitly whitelist allowed fields to prevent mass-assignment attacks
