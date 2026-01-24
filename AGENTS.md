# AGENTS.md

A guide for AI coding agents working on the super-todo project. This file contains setup instructions, testing procedures, and project conventions.

## Project Overview

Super-todo is a **Vue 3 + TypeScript** task management application built with **Vite**, designed as a GitHub Copilot onboarding showcase. The project demonstrates Copilot capabilities in a realistic full-stack application with both frontend and backend.

**Frontend Features:**
- Dashboard and task management views
- Category-based task organization
- Vital tasks prioritization
- Settings and help documentation
- Component-based architecture with layouts

**Backend Features:**
- Express.js API with TypeScript
- Prisma ORM for database management
- PostgreSQL database with migrations
- RESTful routes for tasks, categories, and users

## Setup Commands

### Frontend Setup

- **Install dependencies:** `npm install` or `pnpm install`
- **Start dev server:** `npm run dev` or `pnpm dev`
- **Build for production:** `npm run build` or `pnpm build`
- **Preview production build:** `npm run preview` or `pnpm preview`
- **Run linting:** `npm run lint` or `pnpm lint`

### Backend Setup

- **Navigate to backend:** `cd backend`
- **Install dependencies:** `npm install` or `pnpm install`
- **Setup environment:** Copy `.env.example` to `.env` and configure database connection
- **Database setup:** `npx prisma migrate dev` (creates database and runs migrations)
- **Seed database:** `npm run seed` or `npx ts-node prisma/seed.ts`
- **Start server:** `npm run dev` (runs on http://localhost:3000 by default)
- **Generate Prisma client:** `npx prisma generate` (auto-run after migrations)

### Docker Setup (Optional)

- **Start PostgreSQL:** `docker-compose up -d` (from backend directory)
- **View logs:** `docker-compose logs -f postgres`
- **Stop services:** `docker-compose down`

## Code Style

### Frontend (Vue 3 + TypeScript)

- **Language:** TypeScript with strict type checking enabled
- **Framework:** Vue 3 with Composition API and `<script setup>` syntax
- **Component structure:** Single-file components (.vue)
- **Imports:** Use ES6 module syntax
- **Naming conventions:**
  - Components: PascalCase (e.g., `MainLayout.vue`)
  - Composables: camelCase with `use` prefix (e.g., `useTaskManager`)
  - Files: kebab-case for utilities, PascalCase for components
- **CSS:** Scoped styles within components using `<style scoped>`
- **State Management:** Pinia stores using Composition API setup syntax

### Backend (Express.js + TypeScript)

- **Language:** TypeScript with strict type checking
- **Framework:** Express.js with TypeScript
- **Database:** Prisma ORM with PostgreSQL
- **Code organization:** Routes in `/src/routes/`, utilities in `/src/lib/`
- **API style:** RESTful endpoints
- **Type generation:** Use Prisma-generated types for database models

## Project Structure

### Frontend

- `/src/components/` - Reusable Vue components
- `/src/views/` - Page-level components for routing
- `/src/router/` - Vue Router configuration
- `/src/stores/` - Pinia store definitions
- `/src/assets/` - Static assets and stylesheets
- `/src/main.ts` - Application entry point

### Backend

- `/backend/src/routes/` - API route handlers (tasks, categories, users, config)
- `/backend/src/lib/` - Utility functions and helpers (Prisma client)
- `/backend/prisma/` - Database schema, migrations, and seed files
- `/backend/src/generated/` - Prisma-generated types and client
- `/backend/.env` - Environment variables (database connection, etc.)

## Testing Instructions

- Run all tests: `npm run test` or `pnpm test`
- Watch mode: `npm run test:watch` or `pnpm test:watch`
- Code coverage: `npm run test:coverage` or `pnpm test:coverage`
- ESLint checks: `npm run lint` or `pnpm lint`
- Type checking: `npm run type-check` or `pnpm type-check`

## Pull Request Guidelines

- **Branch naming:** Use descriptive kebab-case (e.g., `feature/task-filtering`, `fix/sidebar-layout`)
- **Commit messages:** Start with a verb, keep first line under 50 characters
- **Before committing:**
  - Run `npm run lint` to fix style issues
  - Run `npm run type-check` to verify TypeScript
  - Run `npm run test` to ensure tests pass
- **PR title format:** `[Feature/Fix/Docs] Brief description`
- **Include:** Description of changes, any breaking changes, testing performed

## Important Conventions

- Always use TypeScript strict mode
- Components should be single-responsibility
- Stores should be defined using Pinia composables
- Use Vue Router for all navigation
- Update tests whenever modifying functionality
- Keep components under 300 lines when possible
- Use Prisma types from generated client instead of defining database types manually
- Always run migrations before committing schema changes
- Document API endpoints with clear request/response examples

## Deployment

- Build output goes to `/dist/`
- Production builds are optimized and minified
- Environment variables can be configured via `.env` files
