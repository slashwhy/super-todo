---
name: generate-e2e-test
description: Generate a Playwright E2E test file with Page Object pattern for a specific user flow.
argument-hint: "<user-flow-description>"
disable-model-invocation: true
allowed-tools: Read Write
---

# Generate E2E Test

Generate a Playwright E2E test file for a user flow.

## How to Invoke

```
/generate-e2e-test <user flow description>
/generate-e2e-test "create a task, assign it, and mark it complete"
```

## What to Specify

- The user flow to test (described in user-facing terms)
- The view/page involved (optional — will be inferred)
- Whether to create a new Page Object or extend an existing one
- Any acceptance criteria the test should validate

## Output

The generated test will:
- Create or extend a Page Object in `e2e/pages/`
- Use only `data-testid` selectors (never CSS or text)
- Wait for `networkidle` before assertions
- Mock API calls with `page.route()` for isolation
- Cover: happy path + at least one error/edge case
- Map each test case to a specific acceptance criterion (from PLAN.md if present)
