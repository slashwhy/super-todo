# AGENTS.md

A guide for AI coding agents working on the super-todo project. This file contains setup instructions, testing procedures, and project conventions.

## Project Overview

Super-todo is a Vue 3 + TypeScript task management application built with Vite. It features:
- Dashboard and task management views
- Category-based task organization
- Vital tasks prioritization
- Settings and help documentation
- Component-based architecture with layouts

## Setup Commands

- **Install dependencies:** `npm install` or `pnpm install`
- **Start dev server:** `npm run dev` or `pnpm dev`
- **Build for production:** `npm run build` or `pnpm build`
- **Preview production build:** `npm run preview` or `pnpm preview`
- **Run linting:** `npm run lint` or `pnpm lint`

## Code Style

- **Language:** TypeScript with strict type checking enabled
- **Framework:** Vue 3 with Composition API preferred
- **Component structure:** Single-file components (.vue)
- **Imports:** Use ES6 module syntax
- **Naming conventions:**
  - Components: PascalCase (e.g., `MainLayout.vue`)
  - Composables: camelCase with `use` prefix (e.g., `useTaskManager`)
  - Files: kebab-case for utilities, PascalCase for components
- **CSS:** Scoped styles within components using `<style scoped>`

## Project Structure

- `/src/components/` - Reusable Vue components
- `/src/views/` - Page-level components for routing
- `/src/router/` - Vue Router configuration
- `/src/stores/` - Pinia store definitions
- `/src/assets/` - Static assets and stylesheets
- `/src/main.ts` - Application entry point

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

## Deployment

- Build output goes to `/dist/`
- Production builds are optimized and minified
- Environment variables can be configured via `.env` files
