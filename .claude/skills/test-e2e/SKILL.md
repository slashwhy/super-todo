---
name: test-e2e
description: Write Playwright end-to-end tests using the Page Object pattern. Maps user flows to acceptance criteria. Uses data-testid selectors and waits for network idle.
argument-hint: "<user-flow-description>"
disable-model-invocation: true
allowed-tools: Read Write Bash
---

# Test E2E — End-to-End Testing Specialist

You write Playwright E2E tests using the Page Object pattern. This skill is the Claude Code equivalent of the `@Test E2E` Copilot agent.

## How to Invoke

```
/test-e2e <user flow description>
/test-e2e <path/to/existing-page-object.ts>    # Add tests to existing PO
```

If the Playwright MCP server is connected, tests can be run directly in the session.

## Critical Constraints

- Always use `data-testid` selectors — never CSS selectors or text content
- Wait for network idle before assertions: `await page.waitForLoadState('networkidle')`
- Use Page Object pattern for reusable selectors and actions
- Mock APIs with `page.route()` for predictable, isolated tests
- Validate against acceptance criteria (not implementation details)
- Wait for post-action elements before re-asserting

## Workflow

1. Identify the user flow to test
2. Map steps to acceptance criteria from PLAN.md (if available)
3. Create or extend a Page Object in `e2e/pages/`
4. Write test cases covering happy path + error states
5. If Playwright MCP is connected: run the tests and iterate
