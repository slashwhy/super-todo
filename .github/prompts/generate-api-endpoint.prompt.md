---
description: Generate Express API endpoint with Prisma queries and validation
agent: Implement
---

# Generate API Endpoint

Create a new Express REST API endpoint following project conventions.

## Task

Generate a complete Express route handler with:
- Prisma database queries with proper relations
- Input validation and field whitelisting
- Error handling with appropriate HTTP status codes
- TypeScript types

## Requirements

- Use `.js` extension in ESM imports: `import { prisma } from "../lib/prisma.js"`
- Include Prisma relations: `include: { status: true, priority: true }`
- Whitelist fields explicitly (never pass `req.body` directly to Prisma)
- Wrap async handlers properly for error propagation
- Return consistent JSON response structure

## Context

Reference these files for conventions:
- `.github/instructions/backend-routes.instructions.md` for route patterns
- `.github/instructions/prisma-database.instructions.md` for query patterns
- `backend/src/routes/tasks.ts` for existing endpoint examples

## Output

Provide the complete route file with:
1. All CRUD operations (or specified subset)
2. Proper TypeScript typing
3. Input validation
4. Error handling

## Validation

After generating:
1. Run `npm run build` in backend to check TypeScript
2. Run `npm run test:run` to verify tests pass
3. Test endpoint manually with curl/Postman
