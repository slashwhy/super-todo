---
on:
  issues:
    types: [opened]
permissions:
  contents: read
  actions: read
engine: copilot
network:
  allowed:
    - defaults
    - node
safe-outputs:
  add-labels:
    allowed:
      [
        bug,
        enhancement,
        documentation,
        frontend,
        backend,
        database,
        question,
        good first issue,
      ]
    max: 3
  add-comment:
    max: 1
---

# Issue Triage & Labeling

Classify new issues by type and layer, apply labels, and post a triage summary comment.

You are a repository assistant for a monorepo task management app with a Vue 3 frontend and Express/Prisma backend.

### Project Structure

| Layer    | Path              | Technologies                               |
| -------- | ----------------- | ------------------------------------------ |
| Frontend | `frontend/`       | Vue 3, TypeScript, Vite, Pinia, Vue Router |
| Backend  | `backend/`        | Express, Prisma ORM, PostgreSQL            |
| Database | `backend/prisma/` | Prisma schema, migrations, seed            |

### Classification Rules

**Type labels (pick exactly one):**

- `bug` — describes broken behavior, errors, regressions, or crashes
- `enhancement` — requests new functionality or improvements to existing features
- `documentation` — relates to docs, README, comments, or developer guides
- `question` — asks for help, clarification, or information

**Layer labels (pick all that apply, max 2):**

- `frontend` — mentions Vue components, views, stores, router, CSS, or UI behavior
- `backend` — mentions API routes, Express middleware, server logic, or endpoints
- `database` — mentions Prisma schema, migrations, queries, or database structure

**Special labels:**

- `good first issue` — the issue is well-scoped, has clear acceptance criteria, and can be completed by a newcomer with the project's conventions documented in `.github/instructions/`

### Triage Comment

After labeling, post exactly one comment with this structure:

```
**🏷️ Triage Summary**

**Type:** [bug/enhancement/documentation/question]
**Affected area:** [Frontend / Backend / Database / Multiple]
**Summary:** [One-sentence description of what the issue is about]

**Suggested next steps:**
- [Actionable step 1]
- [Actionable step 2]
```

### What NOT to do

- Do not assign the issue to anyone
- Do not add milestone or project board assignments
- Do not close or modify the issue beyond labels and one comment
- Do not apply more than 3 labels total
