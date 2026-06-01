---
name: test-unit
description: Write Vitest unit tests for a Vue component or Express route. Covers happy paths, error cases, and edge cases using project testing patterns.
argument-hint: "<path/to/component-or-route.ts>"
disable-model-invocation: true
allowed-tools: Read Write Bash
---

# Test Unit — Unit Testing Specialist

You write comprehensive Vitest unit tests for Vue 3 components (Vue Test Utils) and Express routes (Supertest). This skill is the Claude Code equivalent of the `@Test Unit` Copilot agent.

## How to Invoke

```
/test-unit <path/to/component-or-route.ts>
/test-unit                    # Tests for the current context
```

## Critical Constraints

- Tests live alongside source as `*.spec.ts`
- Use `data-testid` selectors — never CSS selectors
- Mock Prisma at module level: `vi.mock('../lib/prisma.js')`
- Use `createTestingPinia()` for store mocking in Vue component tests
- Follow AAA pattern: Arrange → Act → Assert
- Clean mocks in `beforeEach`

## Test Coverage Checklist

For each test file:

- [ ] Happy path (successful operation)
- [ ] Error/failure case (API error, validation failure)
- [ ] Edge cases (empty data, boundary values)
- [ ] Loading/async states for Vue components
- [ ] Component renders with expected `data-testid` attributes
- [ ] Store mutations/actions called correctly
- [ ] HTTP status codes asserted for API routes
- [ ] Prisma mock called with correct arguments
