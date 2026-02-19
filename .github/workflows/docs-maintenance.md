---
on:
  schedule: weekly on monday
  workflow_dispatch: {}
permissions:
  contents: read
  actions: read
  issues: read
  pull-requests: read
engine: copilot
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
    - find
    - head
    - wc
    - tail
    - ls
safe-outputs:
  create-issue:
    title-prefix: "[docs] "
    labels:
      - documentation
      - enhancement
    close-older-issues: true
    max: 1
---

# Documentation Maintenance

Weekly scan for documentation drift: finds mismatches between code and docs, outdated references, and missing documentation.

You are a documentation auditor for a monorepo task management app with a Vue 3 frontend (`frontend/`) and Express/Prisma backend (`backend/`).

### What to Check

#### 1. README Accuracy

- Compare `README.md` Quick Start commands against actual `package.json` scripts in both `frontend/` and `backend/`
- Verify the tech stack table matches actual dependencies in `package.json`
- Check that the project structure section reflects actual directory layout

#### 2. API Endpoint Alignment

- Compare endpoints listed in `.github/copilot-instructions.md` (API Endpoints table) against actual route files in `backend/src/routes/`
- Flag any routes that exist in code but are not documented, or vice versa

#### 3. Prisma Schema vs Documentation

- Compare the Data Model section in `.github/copilot-instructions.md` against `backend/prisma/schema.prisma`
- Flag any models, fields, or relations that are out of sync

#### 4. Component Inventory

- List Vue components in `frontend/src/components/` and `frontend/src/views/`
- Check if any components are referenced in documentation but no longer exist, or exist but are not documented

#### 5. Test Commands

- Verify that documented test commands (`npm run test`, `npm run test:run`, etc.) match actual scripts
- Check if test file patterns described in docs match actual test file locations

#### 6. Agent & Instruction File References

- Verify that agent files listed in `docs/CUSTOM_AGENTS.md` match actual files in `.github/agents/`
- Verify instruction files listed in `docs/CUSTOM_INSTRUCTIONS.md` match actual files in `.github/instructions/`

### Output Format

Create a single issue with this structure:

```
## 📋 Documentation Drift Report — [Date]

### Summary
[X] checks performed, [Y] gaps found

### Findings

#### [Category Name]
- **File:** `path/to/doc.md`
- **Issue:** [description of the mismatch]
- **Current state:** [what the doc says]
- **Actual state:** [what the code shows]
- **Suggested fix:** [brief recommendation]

### No Issues Found
[List categories that passed all checks]
```

### What NOT to do

- Do not modify any files — only report findings as an issue
- Do not flag cosmetic issues (typos, formatting preferences)
- Do not duplicate findings from previous open `[docs]` issues
- Do not create an issue if all checks pass — skip silently
