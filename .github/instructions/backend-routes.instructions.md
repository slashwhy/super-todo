---
description: 'Express route handlers with Prisma, async error handling, and security patterns'
applyTo: 'backend/src/routes/**/*.ts'
---

# Express Routes Development

## Critical Rules

- Always use `.js` extension for ESM imports: `import { prisma } from "../lib/prisma.js"`
- Always include relations in Prisma queries: `include: { status: true, priority: true }`
- Always wrap handlers in try/catch with proper error responses
- Never pass `req.body` directly to Prisma — whitelist fields explicitly

## Route Pattern

```typescript
import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, priority } = req.query;
    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status: { name: status as string } }),
        ...(priority && { priority: { name: priority as string } }),
      },
      include: { status: true, priority: true, category: true, owner: true },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    // ✅ Whitelist allowed fields - never spread req.body directly
    const { title, description, statusId, priorityId, ownerId } = req.body;
    
    if (!title || !statusId || !priorityId || !ownerId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const task = await prisma.task.create({
      data: { title, description, statusId, priorityId, ownerId },
      include: { status: true, priority: true, owner: true },
    });
    res.status(201).json(task);
  } catch (error) {
    console.error("Failed to create:", error);
    res.status(500).json({ error: "Failed to create task" });
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

## Security: Field Whitelisting

```typescript
// ❌ DANGEROUS - mass-assignment vulnerability
const task = await prisma.task.create({ data: req.body });

// ✅ SECURE - explicit field whitelisting
const { title, description, statusId } = req.body;
const task = await prisma.task.create({ data: { title, description, statusId } });
```

## Conditional Updates

Use spread syntax for optional PATCH fields:

```typescript
const { title, description, statusId } = req.body;
const task = await prisma.task.update({
  where: { id: req.params.id },
  data: {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(statusId !== undefined && { statusId }),
  },
});
```

## Common Pitfalls

- ❌ Missing `.js` extension → ESM import errors
- ❌ Passing `req.body` to Prisma → Security vulnerability
- ❌ Forgetting `include` → Missing nested data in response
- ❌ Not validating required fields → Database constraint errors
