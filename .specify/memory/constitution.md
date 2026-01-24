<!--
## Sync Impact Report

**Version Change**: 1.0.0 → 1.1.0 (MINOR)

### Summary
Updated Super Todo Constitution to reflect the full-stack architecture with Express.js backend,
Prisma ORM, and PostgreSQL database alongside the existing Vue 3 frontend. Added backend-specific
principles and expanded governance for database schema management.

### Modified Principles
- I. Component-Driven Architecture → Expanded to cover both frontend Vue components and backend route modules
- II. Type Safety (NON-NEGOTIABLE) → Enhanced with Prisma type generation requirements
- III. Centralized State Management → Split into frontend (Pinia) and backend (Prisma) concerns

### New Principles (3 additions)
- VII. API Contract Consistency (NEW) - RESTful endpoint design and versioning
- VIII. Database Schema Integrity (NEW) - Prisma migrations and seed data management  
- IX. Environment-Aware Configuration (NEW) - Separation of dev/prod configs

### Expanded Sections
- Technology Stack Requirements: Added Express.js, Prisma, PostgreSQL
- Development Workflow: Added database migration and seeding steps
- Governance: Added database schema change review requirements

### Templates Status
- ✅ plan-template.md: Web app structure (Option 2) aligns with backend/ and frontend/ separation
- ✅ spec-template.md: Already supports independent user stories for full-stack features
- ✅ tasks-template.md: Foundation phase pattern supports database setup tasks

### Key Alignments
- Constitution Principle VII (API Contracts) ↔ plan-template.md contracts/ directory
- Constitution Principle VIII (Database) ↔ tasks-template.md foundational phase (schema setup)
- Constitution Principle IX (Config) ↔ plan-template.md Technical Context (environment section)

### Follow-Up Items
- None - all templates already support full-stack project structure

-->

# Super Todo Constitution

## Core Principles

### I. Component-Driven Architecture

**Frontend**: All UI features MUST be built as composable, reusable Vue components using Composition API with `<script setup>`. Components must have clear, single responsibilities. Each component MUST:
- Accept props for configuration and emit events for side effects
- Include TypeScript type definitions for props and emits
- Be independently testable with isolated concerns
- Document expected prop shapes and event payloads

**Backend**: All API features MUST be organized as route modules with clear separation of concerns. Each route module MUST:
- Handle a single resource domain (tasks, users, categories, config)
- Use Express Router for endpoint definitions
- Validate request payloads before processing
- Return consistent response structures (success/error formats)

### II. Type Safety (NON-NEGOTIABLE)

TypeScript strict mode is mandatory across frontend and backend. All code MUST:
- Declare explicit types for function parameters, return values, and component props
- Avoid `any` types; use `unknown` with proper type guards when necessary
- Include type definitions for store state, mutations, and actions (frontend)
- Use Prisma-generated types for all database models (backend) - NEVER manually define database types
- Enable full type-checking via `vue-tsc --build` (frontend) and `tsc` (backend) before build/deploy

**Prisma Type Generation**: After ANY schema change, `npx prisma generate` MUST be run to regenerate types in `backend/src/generated/prisma/`. Import types from this location only.

### III. Centralized State Management

**Frontend**: All application state MUST flow through Pinia stores. State mutations MUST be traceable and testable. Each store:
- Defines a single domain concern (tasks, filters, settings, etc.)
- Uses typed getters and actions with Composition API setup syntax
- Includes validation of state transitions
- Logs significant state changes for observability

**Backend**: All database operations MUST use the Prisma client from `backend/src/lib/prisma.ts`. Data access patterns MUST:
- Use typed Prisma queries (no raw SQL unless absolutely necessary)
- Handle connection pooling through the shared client instance
- Include proper error handling for constraint violations
- Log database errors with context for debugging

### IV. Feature-First Development

New features MUST follow the specification-first workflow:
- Start with user scenarios and acceptance criteria (spec.md)
- Design data model and API contracts before implementation
- Create implementation plan with phased tasks
- Implement independently testable slices per user story

### V. Design System Integration

All UI components MUST respect the design system defined in Figma. Visual changes MUST:
- Align with Figma component specifications
- Use CSS variables from `src/assets/styles/variables.css`
- Support theme consistency across all views
- Be validated against Figma designs using code connect mappings

### VI. Testing & Observability

Testing and debugging capabilities are essential for quality. Projects MUST:
- Include unit tests for store logic and component logic (frontend)
- Include API endpoint tests for route handlers (backend)
- Use Chrome DevTools for runtime debugging and performance analysis
- Include console logging for state transitions and user actions
- Document performance targets and measure against them
- Log all database errors with query context for debugging

### VII. API Contract Consistency

All backend API endpoints MUST follow RESTful conventions and maintain consistent contracts. Each endpoint MUST:
- Use standard HTTP methods correctly (GET for reads, POST for creates, PUT/PATCH for updates, DELETE for removals)
- Return consistent response structures: `{ data: T }` for success, `{ error: string }` for failures
- Include proper HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Error)
- Validate request payloads and return 400 with descriptive error messages for invalid data
- Document request/response schemas with examples in API endpoint comments

**Versioning**: Breaking API changes MUST increment the major version and maintain backward compatibility via versioned routes (`/api/v2/...`) or deprecation periods.

### VIII. Database Schema Integrity

All database schema changes MUST go through Prisma migrations. Direct database modifications are FORBIDDEN. Schema management MUST:
- Create migrations via `npx prisma migrate dev --name descriptive-name` for every schema change
- Run `npx prisma generate` after migrations to update TypeScript types
- Include seed data in `backend/prisma/seed.ts` for development and testing environments
- Test migrations on a copy of production data before deploying to production
- Document breaking schema changes in migration commit messages

**Seed Data Requirements**: The seed script MUST create realistic sample data including users, tasks, categories, statuses, and priorities to enable frontend development without backend dependencies.

### IX. Environment-Aware Configuration

Configuration MUST be externalized and environment-specific. The project MUST:
- Use `.env` files for environment variables (NEVER commit `.env` to version control)
- Provide `.env.example` templates documenting all required variables
- Support different configurations for development, staging, and production
- Validate required environment variables at application startup
- Use environment variables for: database URLs, API ports, CORS origins, external service credentials

**Required Variables**:
- Backend: `DATABASE_URL`, `PORT`, `FRONTEND_URL`
- Frontend: `VITE_API_BASE_URL` (if different from default)

## Technology Stack Requirements

### Frontend
- **Framework**: Vue 3 with Composition API (TypeScript required)
- **Build Tool**: Vite (configured in `vite.config.ts`)
- **State Management**: Pinia for all application state
- **Routing**: Vue Router for navigation
- **Type Checking**: TypeScript 5.9+ with strict mode enabled
- **Code Quality**: ESLint + Prettier (automatically applied on commit)

### Backend
- **Runtime**: Node.js ^20.19.0 or >=22.12.0
- **Framework**: Express.js with TypeScript
- **ORM**: Prisma for database access and migrations
- **Database**: PostgreSQL (local via Docker Compose for development)
- **Type Generation**: Prisma Client (generated to `backend/src/generated/prisma/`)
- **Code Quality**: ESLint + Prettier (shared config with frontend)

### Development Tools
- **Database GUI**: Prisma Studio (`npm run db:studio` from backend/)
- **API Testing**: REST client of choice (recommended: VS Code REST Client extension)
- **Version Control**: Git with conventional commit messages

## Development Workflow

All work MUST follow this workflow:

1. **Research & Planning**: Create feature spec with user stories and acceptance criteria
2. **Design**: Define data model, API contracts, and visual design in Figma
3. **Database Schema** (if applicable): 
   - Update `backend/prisma/schema.prisma`
   - Run `npx prisma migrate dev --name feature-name`
   - Run `npx prisma generate` to update types
   - Update `backend/prisma/seed.ts` if new entities require seed data
4. **Implementation**: Build features in isolated, independently testable slices
   - Backend: Implement API routes in `backend/src/routes/`
   - Frontend: Implement components and views in `src/components/` and `src/views/`
   - State: Create or update Pinia stores in `src/stores/` for frontend state
5. **Validation**: Verify against spec, Figma designs, and type checks before merging
6. **Testing**: Include unit tests for critical logic; use Chrome DevTools for integration verification

Code reviews MUST verify:
- All TypeScript errors resolved (strict mode) in both frontend and backend
- Components follow single-responsibility principle
- Store mutations are traceable and validated (frontend)
- API endpoints return consistent response structures (backend)
- Database migrations are reversible and documented
- UI components match Figma specifications
- Feature specification acceptance criteria met
- No `.env` files committed (only `.env.example`)

## Governance

This constitution supersedes all other development practices and guidelines. All team members MUST comply with these core principles when contributing.

**Amendments**: Constitution changes require documentation of the amendment, rationale, and migration path. Version bumps follow semantic versioning:
- **MAJOR**: Principle removal or incompatible redefinition
- **MINOR**: New principle or expanded guidance
- **PATCH**: Clarifications, wording, typo fixes

**Compliance Review**: Before each feature merge, verify compliance with all applicable principles. Use `.specify/templates/` to guide implementation and documentation. For database-related features, additionally verify:
- Migration files are committed alongside schema changes
- Prisma-generated types are regenerated and committed
- Seed data reflects new schema entities
- API documentation updated with new endpoint contracts

**Version**: 1.1.0 | **Ratified**: 2026-01-19 | **Last Amended**: 2026-01-24
