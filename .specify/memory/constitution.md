<!--
## Sync Impact Report

**Initial Constitution Creation**: 1.0.0

### Summary
This is the initial creation of the Super Todo Constitution, establishing governance principles
and development standards for a Vue 3 Todo Dashboard application with TypeScript.

### Principles Created (6 new)
- I. Component-Driven Architecture (NEW)
- II. Type Safety (NON-NEGOTIABLE) (NEW)
- III. Centralized State Management (NEW)
- IV. Feature-First Development (NEW)
- V. Design System Integration (NEW)
- VI. Testing & Observability (NEW)

### New Sections
- Technology Stack Requirements
- Development Workflow
- Governance

### Templates Status
- ✅ plan-template.md: Already aligns with principles (constitutional check section ready)
- ✅ spec-template.md: Already aligns with principles (user story format matches principle IV)
- ✅ tasks-template.md: Already aligns with principles (independent test slices match principle IV)

### Key Alignments
- Constitution Principle I (Component-Driven) ↔ plan-template.md project structure guidance
- Constitution Principle II (Type Safety) ↔ plan-template.md language/version field expectations
- Constitution Principle III (State Management) ↔ tasks-template.md foundational phase patterns
- Constitution Principle IV (Feature-First) ↔ spec-template.md user story structure
- Constitution Principle V (Design System) ↔ Available Figma MCP integration
- Constitution Principle VI (Testing) ↔ Available Chrome DevTools MCP integration

### No Follow-Up Required
All templates are compatible with the established principles. Code connect mappings with Figma
can be established as features are implemented.

-->

# Super Todo Constitution

## Core Principles

### I. Component-Driven Architecture

All features MUST be built as composable, reusable Vue components using Composition API with `<script setup>`. Components must have clear, single responsibilities. Each component MUST:
- Accept props for configuration and emit events for side effects
- Include TypeScript type definitions for props and emits
- Be independently testable with isolated concerns
- Document expected prop shapes and event payloads

### II. Type Safety (NON-NEGOTIABLE)

TypeScript strict mode is mandatory. All code MUST:
- Declare explicit types for function parameters, return values, and component props
- Avoid `any` types; use `unknown` with proper type guards when necessary
- Include type definitions for store state, mutations, and actions
- Enable full type-checking via `vue-tsc --build` before build/deploy

### III. Centralized State Management

All application state MUST flow through Pinia stores. State mutations MUST be traceable and testable. Each store:
- Defines a single domain concern (tasks, filters, settings, etc.)
- Uses typed getters and actions
- Includes validation of state transitions
- Logs significant state changes for observability

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
- Include unit tests for store logic and component logic
- Use Chrome DevTools for runtime debugging and performance analysis
- Include console logging for state transitions and user actions
- Document performance targets and measure against them

## Technology Stack Requirements

- **Framework**: Vue 3 with Composition API (TypeScript required)
- **Build Tool**: Vite (configured in `vite.config.ts`)
- **State Management**: Pinia for all application state
- **Routing**: Vue Router for navigation
- **Type Checking**: TypeScript 5.9+ with strict mode enabled
- **Code Quality**: ESLint + Prettier (automatically applied on commit)
- **Node Version**: ^20.19.0 or >=22.12.0

## Development Workflow

All work MUST follow this workflow:

1. **Research & Planning**: Create feature spec with user stories and acceptance criteria
2. **Design**: Define data model, API contracts, and visual design in Figma
3. **Implementation**: Build features in isolated, independently testable slices
4. **Validation**: Verify against spec, Figma designs, and type checks before merging
5. **Testing**: Include unit tests for critical logic; use Chrome DevTools for integration verification

Code reviews MUST verify:
- All TypeScript errors resolved (strict mode)
- Components follow single-responsibility principle
- Store mutations are traceable and validated
- UI components match Figma specifications
- Feature specification acceptance criteria met

## Governance

This constitution supersedes all other development practices and guidelines. All team members MUST comply with these core principles when contributing.

**Amendments**: Constitution changes require documentation of the amendment, rationale, and migration path. Version bumps follow semantic versioning:
- **MAJOR**: Principle removal or incompatible redefinition
- **MINOR**: New principle or expanded guidance
- **PATCH**: Clarifications, wording, typo fixes

**Compliance Review**: Before each feature merge, verify compliance with all applicable principles. Use `.specify/templates/` to guide implementation and documentation.

**Version**: 1.0.0 | **Ratified**: 2026-01-19 | **Last Amended**: 2026-01-19
