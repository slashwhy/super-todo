# Backend Conventions — Claude Code

This file is automatically loaded by Claude Code when working in the `backend/` directory. It imports the project's backend coding standards.

@../.github/instructions/backend-routes.instructions.md

@../.github/instructions/prisma-database.instructions.md

@../.github/instructions/testing-backend.instructions.md

---

## Backend Quick Reference

| Item | Location |
|---|---|
| Route handlers | `src/routes/` |
| Prisma client | `src/lib/prisma.ts` (import as `../lib/prisma.js` in ESM) |
| Database schema | `prisma/schema.prisma` |
| Migrations | `prisma/migrations/` (immutable after creation) |
| Seeds | `prisma/seed.ts` |
| Unit tests | Alongside source as `*.spec.ts` |

**Commands:**

```bash
npm run dev          # Start backend dev server → http://localhost:3000
npm run test:run     # Run Vitest backend tests
npm run db:migrate   # Apply pending Prisma migrations
npm run db:seed      # Seed the database
npm run db:studio    # Open Prisma Studio
docker compose up -d # Start PostgreSQL (required)
```

**Useful slash commands for backend work:**

- `/generate-api-endpoint` — Scaffold an Express route handler
- `/test-unit` — Write Vitest + Supertest tests for a route
- `/security-review` — Review route for injection, mass assignment, auth issues
