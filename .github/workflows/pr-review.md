---
on:
  issue_comment:
    types: [created]
if: |
  github.event.issue.pull_request &&
  contains(github.event.comment.body, '/copilot review')
permissions:
  contents: read
  actions: read
  issues: read
  pull-requests: read
engine:
  id: copilot
  agent: implement
network:
  allowed:
    - defaults
    - node
tools:
  github:
    toolsets: [default]
  edit:
  bash:
    - cat
    - grep
    - head
    - tail
    - wc
safe-outputs:
  create-pull-request-review-comment:
    max: 10
    side: RIGHT
  submit-pull-request-review:
    max: 1
---

# PR Code Review

AI-powered second-pass code review. Runs **only when explicitly requested** via a `/copilot review` comment. This preserves the human-first review process: junior developers complete `@Code-Review-Trainer` AutoMCQ and a human reviews before AI provides a safety net.

### Review Checklist

#### Backend Conventions

- [ ] ESM imports use `.js` extension: `import { prisma } from "../lib/prisma.js"`
- [ ] Prisma queries include required relations: `include: { status: true, priority: true }`
- [ ] Route handlers whitelist fields explicitly — never pass `req.body` directly to Prisma
- [ ] Async route handlers are wrapped for error propagation
- [ ] Input validation uses `express-validator` where appropriate

#### Frontend Conventions

- [ ] Vue components use `<script setup lang="ts">`
- [ ] No `v-if` with `v-for` on the same element
- [ ] CSS uses variables from `variables.css` — no hardcoded colors or spacing
- [ ] Pinia state is not mutated directly from components
- [ ] Test selectors use `data-testid` attributes

#### Security — AI-ism Patterns

These are common patterns in AI-generated code that indicate insufficient review:

| Pattern                         | Risk                                       | What to flag                                     |
| ------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| `cors({ origin: '*' })`         | Allows all origins                         | Flag unless the endpoint is intentionally public |
| Direct `req.body` to Prisma     | Mass assignment / injection                | Must whitelist every field                       |
| Missing `await` on async call   | Returns Promise, not data                  | TypeScript may not catch this                    |
| `npm install [unknown-package]` | Supply chain attack (hallucinated package) | Verify the package exists on npm                 |
| Empty `catch` blocks            | Silent failure masking                     | What should happen on failure?                   |
| Hardcoded credentials           | Secret exposure                            | Must use environment variables                   |
| `allow_all_origins: true`       | CORS misconfiguration                      | Same risk as `cors({ origin: '*' })`             |

#### Testing

- [ ] New functionality has corresponding test files (`*.spec.ts`)
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Prisma is mocked with `vi.mock('../lib/prisma.js')`

### Review Style

- Be specific: reference exact file paths and line numbers
- Be actionable: explain what to change and why
- Be constructive: frame issues as suggestions, not accusations
- Prioritize: security issues > convention violations > style nits
- Limit: max 10 inline comments + 1 summary review
- Do NOT approve or request changes — submit as a "COMMENT" review to defer the decision to the human reviewer

### What NOT to do

- Do not auto-approve or auto-merge
- Do not suggest refactoring unrelated code
- Do not comment on formatting handled by Prettier/ESLint
- Do not duplicate issues the human reviewer already flagged
