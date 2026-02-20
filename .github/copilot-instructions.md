# Todo App - Copilot Instructions

A monorepo task management app with Vue 3 frontend and Express/Prisma backend.

## Tech Stack

| Layer        | Technologies                               |
| ------------ | ------------------------------------------ |
| **Frontend** | Vue 3, TypeScript, Vite, Pinia, Vue Router |
| **Backend**  | Express, Prisma ORM, PostgreSQL            |
| **Testing**  | Vitest, Vue Test Utils, Supertest          |

## Project Structure

```
/frontend/             # Vue 3 SPA (Vite + TypeScript + Pinia)
  src/components/      # Reusable Vue components
  src/views/           # Route-level page components
  src/router/          # Vue Router configuration
/backend/              # Express REST API
  src/routes/          # API route handlers
  src/lib/prisma.ts    # Prisma client singleton
  prisma/schema.prisma # Database schema
```

## Quick Start Commands

```bash
# Backend (requires Docker)
cd backend && docker compose up -d
npm install && npm run db:migrate && npm run db:seed
npm run dev                    # API → http://localhost:3000

# Frontend
cd frontend && npm install && npm run dev     # App → http://localhost:5173
```

## Critical Rules

**Always:**

- Use `.js` extension in backend ESM imports: `import { prisma } from "../lib/prisma.js"`
- Include relations in Prisma queries: `include: { status: true, priority: true }`
- Use `<script setup lang="ts">` for Vue components
- Use CSS variables from `frontend/src/assets/styles/variables.css`
- Whitelist fields explicitly in route handlers (never pass `req.body` directly to Prisma)

**Never:**

- Use `v-if` with `v-for` on the same element
- Mutate Pinia state directly from components
- Hardcode colors or spacing values

## API Endpoints

| Resource   | Path                                             | Notes                                               |
| ---------- | ------------------------------------------------ | --------------------------------------------------- |
| Tasks      | `/api/tasks`                                     | Filters: `status`, `priority`, `isVital`, `ownerId` |
| Users      | `/api/users`                                     | CRUD                                                |
| Categories | `/api/categories`                                | CRUD                                                |
| Config     | `/api/config/statuses`, `/api/config/priorities` | Lookup tables                                       |

## Data Model

- **Task** → `status`, `priority`, `category`, `owner`, `assignee` relations
- **TaskStatus/TaskPriority** → configurable with `color` and `order`
- **Category** → `color` and `icon` properties
- **User** → can be task owner or assignee

## Testing

```bash
cd frontend && npm run test     # Frontend tests
cd backend && npm run test:run  # Backend tests
```

- Tests live alongside source as `*.spec.ts`
- Mock Prisma with `vi.mock('../lib/prisma.js')`
- Use `data-testid` attributes for stable selectors

## Debugging

- **Database:** `npm run db:studio` (Prisma Studio)
- **Frontend:** Vue DevTools
- **Tests:** `--reporter=verbose` for detailed output

## CI & Agentic Workflows

```bash
# Compile agentic workflows after changes
gh aw compile

# Compile a specific workflow
gh aw compile <workflow-name>

# View workflow logs
gh aw logs <workflow-name>
```

- CI runs on PRs to `main` (lint, test, build)
- Agentic workflows: `continuous-docs`, `code-simplifier`, `security-reviewer`
- Trigger security review on a PR: comment `/security-review`
