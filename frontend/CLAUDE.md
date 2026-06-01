# Frontend Conventions — Claude Code

This file is automatically loaded by Claude Code when working in the `frontend/` directory. It imports the project's frontend coding standards.

@../.github/instructions/vue-components.instructions.md

@../.github/instructions/vue-composables.instructions.md

@../.github/instructions/pinia-stores.instructions.md

@../.github/instructions/styling.instructions.md

@../.github/instructions/testing-frontend.instructions.md

@../.github/instructions/testing-e2e.instructions.md

---

## Frontend Quick Reference

| Item | Location |
|---|---|
| Components | `src/components/` |
| Page views | `src/views/` |
| Pinia stores | `src/stores/` |
| Composables | `src/composables/` |
| CSS variables | `src/assets/styles/variables.css` |
| Router config | `src/router/index.ts` |
| API client | `src/api/` |
| E2E tests | `e2e/` |

**Commands:**

```bash
npm run dev          # Start frontend dev server → http://localhost:5173
npm run test         # Run Vitest unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run lint         # ESLint
npm run type-check   # TypeScript type check
npm run build        # Production build
```

**Useful slash commands for frontend work:**

- `/generate-component` — Scaffold a Vue 3 component
- `/generate-pinia-store` — Scaffold a Pinia store
- `/test-unit` — Write Vitest tests for a component
- `/test-e2e` — Write Playwright tests for a user flow
