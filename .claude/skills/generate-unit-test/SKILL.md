---
name: generate-unit-test
description: Generate a Vitest unit test file for a specific Vue component or Express route with mocking, fixtures, and edge cases.
argument-hint: "<path/to/file.ts>"
disable-model-invocation: true
allowed-tools: Read Write Bash
---

# Generate Unit Test

Generate a complete unit test file for an existing component or route.

## How to Invoke

```
/generate-unit-test <path/to/file.ts|.vue>
```

## What to Specify

- The file to test (Claude Code will read it before generating tests)
- Key scenarios to cover (optional — will be inferred from the source)
- Any specific edge cases to include

## Output

The generated test file will:
- Mock Prisma at module level (backend): `vi.mock('../lib/prisma.js')`
- Use `createTestingPinia()` (Vue components): stable store mocking
- Follow AAA pattern: Arrange → Act → Assert
- Assert on `data-testid` selectors (not CSS)
- Use `flushPromises()` for async operations in Vue tests
- Use Supertest for HTTP assertions in route tests
- Cover: happy path, error case, loading state, edge cases
