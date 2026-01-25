# Todo App Backend

Express + Prisma + PostgreSQL REST API.

## Quick Start

```bash
docker compose up -d          # Start PostgreSQL
npm install                   # Install dependencies
npm run db:migrate            # Run migrations
npm run db:seed               # Seed sample data
npm run dev                   # Start server → http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Prisma Studio GUI |
| `npm run db:reset` | Reset & re-migrate |
| `npm run test` | Run tests (watch mode) |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

## Testing

Tests use **Vitest** + **Supertest** with mocked Prisma.

```bash
npm run test:run      # Run all tests
npm run test          # Watch mode
```

| Test File | Coverage |
|-----------|----------|
| `tasks.spec.ts` | CRUD, filters, stats |
| `users.spec.ts` | CRUD operations |
| `categories.spec.ts` | CRUD operations |
| `config.spec.ts` | Statuses & priorities |

## API Endpoints

| Resource | Endpoints |
|----------|-----------|
| Tasks | `GET\|POST /api/tasks`, `GET\|PUT\|DELETE /api/tasks/:id`, `GET /api/tasks/stats/summary` |
| Users | `GET\|POST /api/users`, `GET\|PUT\|DELETE /api/users/:id` |
| Categories | `GET\|POST /api/categories`, `GET\|PUT\|DELETE /api/categories/:id` |
| Config | `GET\|POST\|PUT\|DELETE /api/config/statuses`, `/api/config/priorities` |

## Database

**PostgreSQL:** `localhost:5432`

```bash
docker compose up -d      # Start
docker compose down -v    # Reset (removes data)
```

## Environment

| Variable | Default |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | `3000` |
| `FRONTEND_URL` | `http://localhost:5173` |

