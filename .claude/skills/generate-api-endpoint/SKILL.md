---
name: generate-api-endpoint
description: Generate an Express route handler with Prisma queries, explicit field whitelisting, try/catch error handling, and proper HTTP status codes.
argument-hint: "<resource> <HTTP-methods>"
disable-model-invocation: true
allowed-tools: Read Write Edit Bash
---

# Generate API Endpoint

Scaffold an Express route handler following all backend conventions.

## How to Invoke

```
/generate-api-endpoint <resource> <HTTP methods>
/generate-api-endpoint tasks GET,POST
/generate-api-endpoint users/:id GET,PUT,DELETE
```

## What to Specify

Provide as much context as helpful:
- Resource name (e.g., `tasks`, `categories`)
- HTTP methods needed
- Prisma model fields to read/write
- Relations to include in queries
- Any filters, sorting, or pagination requirements
- Auth/ownership constraints

## Critical Security Rule

**Always whitelist fields explicitly — never pass `req.body` directly to Prisma.** The generated handler will extract only the expected fields:

```typescript
const { title, statusId, priorityId } = req.body;
// NOT: prisma.task.create({ data: req.body }) ← NEVER
```

## Output

The generated route will include:
- ESM imports with `.js` extension
- Explicit field whitelisting from `req.body`
- Prisma queries with `include: { status: true, priority: true }` where relevant
- `try/catch` with appropriate HTTP status codes (200/201/400/404/500)
- Route registered in the appropriate `src/routes/` file
