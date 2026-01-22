# Copilot Instructions for Todo App

## Architecture Overview

This is a **monorepo** with a Vue 3 frontend and an Express/Prisma backend:

```
/                   # Vue 3 SPA (Vite, TypeScript, Pinia)
/backend/           # Express REST API (Prisma ORM, PostgreSQL)
```

**Key architectural decisions:**
- Frontend and backend are independent apps with separate `package.json` files
- Prisma Client is generated to `backend/src/generated/prisma/` (custom output path)
- Backend uses ESM modules (`.js` extensions required in imports)
- Frontend uses `@` alias for `src/` directory imports

## Development Workflow

### Starting the Stack

```bash
# Terminal 1: Backend (requires Docker for PostgreSQL)
cd backend
docker compose up -d          # Start PostgreSQL on :5432
npm install && npm run db:migrate && npm run db:seed
npm run dev                   # API on http://localhost:3000

# Terminal 2: Frontend
npm install && npm run dev    # App on http://localhost:5173
```

### Key Backend Commands

| Command | Purpose |
|---------|---------|
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Populate sample data (clears existing) |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:reset` | Full reset: drop, recreate, migrate |

## Code Conventions

### Vue Components

- Use `<script setup lang="ts">` for all components
- Component naming: `PascalCase.vue`
- CSS class naming: BEM-style with component prefix (e.g., `.dashboard__header`, `.dashboard__title`)
- Use CSS variables from [src/assets/styles/variables.css](src/assets/styles/variables.css) for all styling
- Layout components live in `src/components/layout/`
- Views (routed pages) live in `src/views/`

### Backend Routes

- Routes defined in `backend/src/routes/` with resourceful naming
- All routes use async handlers with try/catch error handling
- Include all relations in Prisma queries (`include: { status: true, ... }`)
- Return appropriate HTTP status codes (201 for create, 404 for not found)

### Prisma Patterns

```typescript
// Always use the singleton from lib/prisma.ts
import { prisma } from "../lib/prisma.js";  // Note: .js extension required

// Filtering pattern used in routes
const tasks = await prisma.task.findMany({
  where: {
    ...(status && { status: { name: status as string } }),
  },
  include: { status: true, priority: true, category: true, owner: true },
});
```

## Data Model

Core entities in [backend/prisma/schema.prisma](backend/prisma/schema.prisma):
- **Task** - has `status`, `priority`, `category`, `owner`, `assignee` relations
- **TaskStatus** / **TaskPriority** - configurable enums with `color` and `order`
- **Category** - for organizing tasks with `color` and `icon`
- **User** - can be task owner or assignee

## API Endpoints

| Resource | Base Path | Notes |
|----------|-----------|-------|
| Tasks | `/api/tasks` | Supports query filters: `status`, `priority`, `isVital`, `ownerId` |
| Users | `/api/users` | CRUD operations |
| Categories | `/api/categories` | CRUD operations |
| Config | `/api/config/statuses`, `/api/config/priorities` | Manage status/priority options |

## Styling System

Use CSS custom properties defined in `src/assets/styles/variables.css`:
- Colors: `--color-primary`, `--color-background`, `--color-text-*`
- Spacing: `--spacing-xs` through `--spacing-2xl`
- Layout: `--sidebar-width: 280px`, `--header-height: 100px`
- Typography: `--font-size-*` scale from `xs` to `3xl`

## Testing

Both frontend and backend use **Vitest**. Tests live alongside source files as `*.spec.ts`.

### Backend Tests

- Use `supertest` for HTTP integration tests
- Mock Prisma with `vi.mock('../lib/prisma.js')`
- Test success and error paths (400, 404, 500)

### Frontend Tests

- Use `@vue/test-utils` for component tests
- Mock stores and router as needed

### Commands

```bash
# Frontend
npm run test

# Backend
cd backend && npm run test:run
```
