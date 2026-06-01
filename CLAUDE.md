# Todo App — Claude Code Instructions

This file is the Claude Code entry point for the Todo App project. It imports the shared project conventions from `AGENTS.md` (an open standard read by both GitHub Copilot and Claude Code) and adds Claude Code-specific workflow guidance.

@AGENTS.md

---

## Claude Code Workflow

This project has **7 custom agents** in `.claude/agents/` and **22 skills** in `.claude/skills/`, mirroring the GitHub Copilot system.

### Custom Agents (invoke with @-mention)

| Agent | Invoke with | Equivalent Copilot Agent | Purpose |
|---|---|---|---|
| `@specify` | `@specify plan <description>` | `@Specify & Validate` | Create `PLAN.md` from requirements |
| `@implement` | `@implement` | `@Implement` | Execute `PLAN.md` step by step |
| `@test-unit` | `@test-unit <file>` | `@Test Unit` | Write Vitest unit tests |
| `@test-e2e` | `@test-e2e <flow>` | `@Test E2E` | Write Playwright E2E tests |
| `@feature-tester` | `@feature-tester` | `@Feature Tester` | QA test the running app in a browser |
| `@onboarding` | `@onboarding` | `@Onboarding` | Project orientation guide |
| `@mentor` | `@mentor <concept>` | `@Socratic Mentor` | Learn through Socratic questioning |

**Plan mode** (`Shift+Tab` before submitting) is Claude Code's native equivalent of the `@specify → @implement` handoff. Claude proposes a full plan for review before writing any code.

### Skills

Skills live in `.claude/skills/<name>/SKILL.md`. There are two kinds:

**Reference skills** — Claude auto-invokes these when they match the current task:

| Skill | Purpose |
|---|---|
| `/architectural-documentation` | Implementation plans, README updates, ADRs |
| `/backend-routes` | Express route handlers with Prisma, error handling, security |
| `/code-documentation` | TSDoc and inline comment patterns |
| `/e2e-testing` | Playwright tests with Page Objects and API mocking |
| `/pinia-stores` | Pinia Setup Store syntax with TypeScript |
| `/prisma-database` | Schema conventions, migrations, seed data, queries |
| `/styling` | CSS variables, BEM naming, responsive patterns |
| `/unit-testing` | Vitest tests for Vue components and Express routes |
| `/vue-components` | Vue 3 Composition API, props, emits, slots |
| `/vue-composables` | Reusable composable patterns with cleanup |

**Task skills** — invoke manually with `/skill-name`:

| Skill | Purpose |
|---|---|
| `/specify` | Create implementation plan → `PLAN.md` |
| `/implement` | Execute `PLAN.md` step by step |
| `/test-unit` | Write Vitest tests |
| `/test-e2e` | Write Playwright tests |
| `/generate-component` | Scaffold a Vue 3 component |
| `/generate-api-endpoint` | Scaffold an Express route handler |
| `/generate-pinia-store` | Scaffold a Pinia store |
| `/generate-unit-test` | Generate unit test file |
| `/generate-e2e-test` | Generate E2E test file |
| `/security-review` | OWASP review for this stack |
| `/onboard` | Project orientation |
| `/mentor` | Socratic learning guide |

### Built-in Claude Code Skills

| Skill | Purpose |
|---|---|
| `/code-review` | Review the current diff for correctness bugs |
| `/verify` | Launch and interact with the running app to confirm a change works |
| `/run` | Start the app and observe its behavior |
| `/init` | Generate a fresh `CLAUDE.md` from the codebase |
| `/fewer-permission-prompts` | Auto-build an allowlist from your transcript to reduce prompts |

---

## Subagent System

Claude Code has four built-in subagent types that map to the Copilot agent roles:

| Claude Code Subagent | Copilot Equivalent | Best for |
|---|---|---|
| **Explore** | Codebase research in `@Specify` | Fast, read-only codebase search |
| **Plan** | Planning phase of `@Specify` | Designing implementation approaches |
| **general-purpose** | `@Implement` | Writing code, multi-step tasks |
| **code-reviewer** | `security-review` skill | Independent code review |

Use `isolation: "worktree"` in agent calls for full git isolation — equivalent to the `.trees/` pattern in `docs/GIT_WORKTREES.md`.

---

## MCP Servers

Four MCP servers are configured in `.mcp.json` at the project root (the same servers as `.vscode/mcp.json`, minus Copilot-only servers):

| Server | Purpose | Benefits |
|---|---|---|
| `figma-desktop` | Figma design context | Design-to-code in `/implement`, `/generate-component` |
| `atlassian` | Jira + Confluence | Ticket context in `/specify` |
| `playwright` | E2E browser automation | Run tests directly in `/test-e2e` |
| `chrome-devtools` | Browser inspection | Debugging and performance analysis |

See `docs/MCP.md` for full server documentation and security guidance.

---

## Scheduled Routines

Claude Code supports scheduled remote agents via `CronCreate` — the equivalent of the GitHub Agentic Workflows (`continuous-docs`, `code-simplifier`, `security-reviewer`). See `docs/CLAUDE_CODE.md` for how to set these up.

---

## Auto Memory

Claude Code maintains persistent project memory at `~/.claude/projects/<hash>/memory/`. This replaces the `/memories/session/plan.md` handoff pattern used by `@Specify` in Copilot. For long-running features, use `/specify` to create an explicit `PLAN.md` file as a durable handoff artifact.

---

## Learn More

- `docs/CLAUDE_CODE.md` — Full Claude Code integration guide for this project
- `docs/AI_DEVELOPMENT_GUIDE.md` — Multi-agent system overview (both tools)
- `docs/CUSTOM_AGENTS.md` — Agent roles and handoff patterns
- `docs/RESPONSIBILITIES.md` — Developer accountability when using AI assistance
