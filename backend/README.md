# Todo App Backend

Node.js/Express backend for the Todo App with PostgreSQL and Prisma ORM.

## Prerequisites

- Node.js >= 20.0.0
- Docker & Docker Compose
- npm or pnpm

## Quick Start

### 1. Start PostgreSQL Database

```bash
# Start PostgreSQL and pgAdmin containers
docker compose up -d

# Verify containers are running
docker compose ps
```

**Database Access:**
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050` (login: `admin@todo.local` / `admin`)

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes (dev only) |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Reset database and re-run migrations |

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/stats/summary` | Get task statistics |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:id` | Get category by ID |
| POST | `/api/categories` | Create new category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Configuration (Statuses & Priorities)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/config/statuses` | List task statuses |
| POST | `/api/config/statuses` | Create status |
| PUT | `/api/config/statuses/:id` | Update status |
| DELETE | `/api/config/statuses/:id` | Delete status |
| GET | `/api/config/priorities` | List task priorities |
| POST | `/api/config/priorities` | Create priority |
| PUT | `/api/config/priorities/:id` | Update priority |
| DELETE | `/api/config/priorities/:id` | Delete priority |

## Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │     │    Task     │     │  Category   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │────<│ ownerId     │>────│ id          │
│ name        │     │ assigneeId  │     │ name        │
│ email       │     │ title       │     │ description │
│ avatar      │     │ description │     │ color       │
└─────────────┘     │ image       │     │ icon        │
                    │ isVital     │     └─────────────┘
                    │ dueDate     │
┌─────────────┐     │ completedAt │     ┌─────────────┐
│ TaskStatus  │     │ statusId    │     │TaskPriority │
├─────────────┤     │ priorityId  │     ├─────────────┤
│ id          │────<│ categoryId  │>────│ id          │
│ name        │     └─────────────┘     │ name        │
│ color       │                         │ color       │
│ order       │                         │ order       │
└─────────────┘                         └─────────────┘
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | - | PostgreSQL connection string |
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |
| `FRONTEND_URL` | http://localhost:5173 | CORS allowed origin |

## Docker Commands

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f postgres

# Reset database (removes volumes)
docker compose down -v
```

