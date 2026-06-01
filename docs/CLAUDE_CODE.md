# Claude Code Integration Guide

> This guide is the Claude Code parallel to the [AI Development Guide][ai-guide]. It documents how to use Claude Code (the CLI) on this project — all conventions, skills, hooks, MCP servers, and scheduled routines.

**Claude Code** is Anthropic's terminal-native, agentic CLI. Where GitHub Copilot integrates into VS Code as an extension, Claude Code runs in your terminal and works with any editor. Both tools read `AGENTS.md` (an open standard) and are fully configured in this project.

---

## Quick Reference: Copilot ↔ Claude Code

| Concept | GitHub Copilot | Claude Code | Config Location |
|---|---|---|---|
| Global conventions | `AGENTS.md` | `AGENTS.md` + `CLAUDE.md` | Root |
| Path-scoped context | `.github/instructions/*.instructions.md` | `frontend/CLAUDE.md`, `backend/CLAUDE.md` | Subdirectory |
| Specialized agents | `.github/agents/*.agent.md` | Built-in subagent types + `CLAUDE.md` | Built-in |
| Task templates | `.github/prompts/*.prompt.md` | `.claude/skills/**/SKILL.md` (skills) | `.claude/skills/` |
| Hooks | `.github/hooks/project-hooks.json` | `.claude/settings.json` `hooks` block | `.claude/settings.json` |
| MCP servers | `.vscode/mcp.json` | `.mcp.json` (project-scoped) | `.mcp.json` |
| Persistent plans | `/memories/session/plan.md` | `PLAN.md` (repo root) + auto memory | Project directory |
| Automated workflows | `gh-aw` agentic workflows | `CronCreate` scheduled routines | Claude Code API |
| Worktree isolation | `.trees/` convention + manual | `isolation: "worktree"` on subagents | Built-in |

---

## The `.claude/` Harness

The `.claude/` directory is the Claude Code configuration harness, parallel to `.github/` for Copilot.

```
.mcp.json              # MCP server config (project-scoped, shared via git)
.claude/
├── settings.json      # Hooks and permissions
├── hooks/
│   ├── safety-guard.sh    # PreToolUse: block dangerous operations
│   └── auto-format.sh     # PostToolUse: run Prettier on frontend files
├── agents/            # Custom subagents (parallel to .github/agents/)
│   ├── specify.md         # @specify — planning specialist
│   ├── implement.md       # @implement — implementation specialist
│   ├── test-unit.md       # @test-unit — unit testing specialist
│   ├── test-e2e.md        # @test-e2e — E2E testing specialist
│   ├── feature-tester.md  # @feature-tester — QA browser tester
│   ├── onboarding.md      # @onboarding — project orientation guide
│   └── mentor.md          # @mentor — Socratic learning guide
└── skills/            # Skills (parallel to .github/skills/)
    ├── specify/            # /specify — create implementation plan
    ├── implement/          # /implement — execute plan step by step
    ├── test-unit/          # /test-unit — write Vitest tests
    ├── test-e2e/           # /test-e2e — write Playwright tests
    ├── generate-component/
    ├── generate-api-endpoint/
    ├── generate-pinia-store/
    ├── generate-unit-test/
    ├── generate-e2e-test/
    ├── security-review/
    ├── onboard/
    ├── mentor/
    ├── vue-components/     # Reference skill (auto-invoked)
    ├── vue-composables/    # Reference skill (auto-invoked)
    ├── pinia-stores/       # Reference skill (auto-invoked)
    ├── backend-routes/     # Reference skill (auto-invoked)
    ├── prisma-database/    # Reference skill (auto-invoked)
    ├── unit-testing/       # Reference skill (auto-invoked)
    ├── e2e-testing/        # Reference skill (auto-invoked)
    ├── styling/            # Reference skill (auto-invoked)
    ├── code-documentation/ # Reference skill (auto-invoked)
    └── architectural-documentation/ # Reference skill (auto-invoked)
```

Plus the CLAUDE.md hierarchy at the project root:

```
CLAUDE.md              # Root: imports AGENTS.md + Claude Code workflow notes
frontend/CLAUDE.md     # Frontend: imports 6 instruction files
backend/CLAUDE.md      # Backend: imports 3 instruction files
```

---

## CLAUDE.md Hierarchy

Claude Code loads CLAUDE.md files recursively based on the working directory:

1. `~/.claude/CLAUDE.md` — user-level (applies everywhere)
2. `CLAUDE.md` (repo root) — loaded in every session in this project
3. `frontend/CLAUDE.md` — loaded when working in `frontend/`
4. `backend/CLAUDE.md` — loaded when working in `backend/`

### `@` Import Syntax

CLAUDE.md files can import other markdown files with `@path`:

```markdown
@AGENTS.md
@.github/instructions/vue-components.instructions.md
```

This is the DRY mechanism: the root `CLAUDE.md` imports `AGENTS.md` rather than duplicating conventions. The `frontend/CLAUDE.md` imports the six frontend instruction files from `.github/instructions/`.

### Comparison to Copilot's `applyTo` Globs

Copilot's `.github/instructions/*.instructions.md` files use `applyTo:` frontmatter to match files by glob pattern:

```yaml
# Copilot: applies to any .vue file regardless of directory
applyTo: "**/*.vue"
```

Claude Code's subdirectory CLAUDE.md files use filesystem hierarchy instead:

```
# Claude Code: applies when cwd is frontend/ or any subdirectory
frontend/CLAUDE.md → loads when working in frontend/**
```

Both approaches achieve the same goal — the right conventions load in the right context. The AGENTS.md open standard works with both: Claude Code reads `AGENTS.md` at the project root automatically.

---

## Skills

`.claude/skills/<name>/SKILL.md` files are the Claude Code equivalent of `.github/skills/<name>/SKILL.md` for Copilot. They appear as `/skill-name` in the Claude Code interface.

Key differences from Copilot skills:
- Supports `disable-model-invocation: true` for task/action skills (user-invokes manually)
- Reference skills (no `disable-model-invocation`) are auto-invoked by Claude when relevant
- Supports `argument-hint`, `allowed-tools`, `when_to_use`, and other Claude frontmatter fields
- Skills can be invoked from the terminal: `claude "/specify plan TASK-123"`

### Project Skills

**Reference skills** — Claude auto-invokes these when they match the current task:

| Skill | Purpose | Equivalent Copilot |
|---|---|---|
| `/architectural-documentation` | Implementation plans, ADRs, README | `architectural-documentation` skill |
| `/backend-routes` | Express route handlers with Prisma | `backend-routes` skill |
| `/code-documentation` | TSDoc and inline comment patterns | `code-documentation` skill |
| `/e2e-testing` | Playwright tests with Page Objects | `e2e-testing` skill |
| `/pinia-stores` | Pinia Setup Store patterns | `pinia-stores` skill |
| `/prisma-database` | Schema, migrations, seed, queries | `prisma-database` skill |
| `/styling` | CSS variables, BEM, responsive | `styling` skill |
| `/unit-testing` | Vitest for Vue components and routes | `unit-testing` skill |
| `/vue-components` | Vue 3 Composition API patterns | `vue-components` skill |
| `/vue-composables` | Reusable composable patterns | `vue-composables` skill |

**Task skills** — user-invokes manually with `/skill-name`:

| Skill | Purpose | Equivalent Copilot |
|---|---|---|
| `/specify` | Create implementation plan → `PLAN.md` | `@Specify & Validate` |
| `/implement` | Execute `PLAN.md` step by step | `@Implement` |
| `/test-unit` | Write Vitest tests | `@Test Unit` |
| `/test-e2e` | Write Playwright tests | `@Test E2E` |
| `/generate-component` | Scaffold Vue 3 component | `generate-component.prompt.md` |
| `/generate-api-endpoint` | Scaffold Express route | `generate-api-endpoint.prompt.md` |
| `/generate-pinia-store` | Scaffold Pinia store | `generate-pinia-store.prompt.md` |
| `/generate-unit-test` | Generate unit test file | `generate-unit-test.prompt.md` |
| `/generate-e2e-test` | Generate E2E test file | `generate-e2e-test.prompt.md` |
| `/security-review` | OWASP review for this stack | `review-security.prompt.md` |
| `/onboard` | Project orientation guide | `@Onboarding` |
| `/mentor` | Socratic learning guide | `@Socratic Mentor` |

### Built-in Claude Code Skills

Claude Code ships with built-in skills that require no project configuration:

| Skill | Purpose | Copilot equivalent |
|---|---|---|
| `/code-review` | Review current diff for bugs | `code-documentation` skill |
| `/security-review` | Built-in OWASP review | `security-review` skill |
| `/verify` | Run app and confirm a change works interactively | `@Feature Tester` agent |
| `/run` | Start the app and observe behavior | Manual dev server start |
| `/init` | Generate CLAUDE.md from the codebase | `@Onboarding` agent |
| `/fewer-permission-prompts` | Auto-build allowlist from transcripts | No equivalent |

> **Note:** The project's custom `/security-review` skill supplements the built-in one — it includes this project's specific OWASP checklist and MCP security guidance from `.claude/skills/security-review/SKILL.md`.

---

## Custom Subagents

Claude Code has a full custom subagent system at `.claude/agents/` — the direct parallel to `.github/agents/` for Copilot. Subagents are markdown files with YAML frontmatter that define specialized AI assistants invoked by Claude or via `@agent-name` mentions.

### This Project's Custom Agents

| Agent | Frontmatter name | Equivalent Copilot Agent | Model |
|---|---|---|---|
| `.claude/agents/specify.md` | `specify` | `@Specify & Validate` | Opus |
| `.claude/agents/implement.md` | `implement` | `@Implement` | Sonnet |
| `.claude/agents/test-unit.md` | `test-unit` | `@Test Unit` | Sonnet |
| `.claude/agents/test-e2e.md` | `test-e2e` | `@Test E2E` | Sonnet |
| `.claude/agents/feature-tester.md` | `feature-tester` | `@Feature Tester` | Sonnet |
| `.claude/agents/onboarding.md` | `onboarding` | `@Onboarding` | Sonnet |
| `.claude/agents/mentor.md` | `mentor` | `@Socratic Mentor` | Opus |

### Subagent File Format

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices. Use after writing code.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a code reviewer. Analyze the code and provide actionable feedback.
```

### Supported Frontmatter Fields

| Field | Description |
|---|---|
| `name` | Unique identifier (lowercase, hyphens) |
| `description` | When Claude should delegate to this agent |
| `tools` | Tool allowlist (inherits all if omitted) |
| `disallowedTools` | Tool denylist |
| `model` | `sonnet`, `opus`, `haiku`, full model ID, or `inherit` |
| `mcpServers` | MCP servers scoped to this agent (inline or by name) |
| `hooks` | Lifecycle hooks scoped to this agent |
| `memory` | Persistent memory: `user`, `project`, or `local` |
| `isolation` | `worktree` for git-isolated execution |
| `skills` | Skills to preload into the agent's context |
| `permissionMode` | `default`, `acceptEdits`, `auto`, `bypassPermissions`, `plan` |

### Invoking Subagents

```
# Natural language (Claude decides)
Use the test-unit agent to write tests for the tasks store

# @-mention (guarantees this agent runs)
@test-unit write tests for frontend/src/stores/tasks.ts

# Session-wide (whole session uses this agent)
claude --agent implement
```

### Built-in Subagent Types

In addition to project custom agents, Claude Code has four built-in subagent types:

| Built-in | Best for | Copilot equivalent |
|---|---|---|
| **Explore** | Fast, read-only codebase search (uses Haiku) | Research phase of `@Specify` |
| **Plan** | Designing implementation approaches (plan mode) | Planning phase of `@Specify` |
| **general-purpose** | Writing code, multi-step tasks | `@Implement` |
| **code-reviewer** | Independent code review | Security review skill |

### Worktree Isolation

Add `isolation: worktree` to a subagent's frontmatter to run it in a temporary git worktree. This is the built-in equivalent of the `.trees/` pattern in [GIT_WORKTREES.md][git-worktrees]:

```yaml
---
name: safe-refactor
isolation: worktree
---
```

Claude Code creates the worktree, runs the agent, and cleans it up automatically if no changes were made.

---

## Plan Mode

Plan mode is Claude Code's native equivalent of the `@Specify → PLAN.md → @Implement` handoff.

**How to trigger:** Press `Shift+Tab` before submitting a prompt (or use `--plan` flag).

**What happens:**
1. Claude proposes a full implementation plan
2. You review and approve (or request changes)
3. Claude implements the approved plan — no deviations

**Equivalent workflow:**

```
Copilot:                          Claude Code:
@Specify (create plan)            Plan mode (Shift+Tab)
  → save to /memories/plan.md       → plan shown inline for approval
  → open new chat with @Implement   → approved plan is implemented immediately
  → reference plan file
```

**When to use Plan mode vs `/specify`:**

- **Plan mode:** Quick features where you want structured review before implementation
- **`/specify`:** Complex features needing Jira/Figma context, detailed sprint contracts, and a persistent `PLAN.md` artifact for long sessions or handoffs

---

## Auto Memory

Claude Code maintains persistent project memory at `~/.claude/projects/<hash>/memory/`.

This is the structural equivalent of Copilot's `vscode/memory` tool (used by `@Specify` to save `/memories/session/plan.md`). Key differences:

| | Copilot (`vscode/memory`) | Claude Code (auto memory) |
|---|---|---|
| Storage location | `/memories/session/plan.md` in workspace | `~/.claude/projects/<hash>/memory/` |
| Visibility | Visible file in workspace | Hidden in user home directory |
| Persistence | Survives between sessions in the same workspace | Survives between sessions globally |
| Portability | Can be committed to git | Cannot be committed |

**For this project:** The `/specify` command writes `PLAN.md` to the repo root as a visible, portable handoff artifact. This is recommended over relying on auto memory for plans that span multiple sessions or need to be shared with teammates.

---

## Hooks Configuration

Hooks are configured in `.claude/settings.json` under the `hooks` key. They run shell scripts at lifecycle events — identical in purpose to `.github/hooks/project-hooks.json` for Copilot.

### This Project's Hooks

| Hook | Event | What it does |
|---|---|---|
| `safety-guard.sh` | `PreToolUse` on Bash, Write, Edit, MultiEdit | Blocks dangerous commands and protected files |
| `auto-format.sh` | `PostToolUse` on Write, Edit, MultiEdit | Runs Prettier on modified frontend files |

### Configuration Format Comparison

**Copilot (`.github/hooks/project-hooks.json`):**
```json
{
  "hooks": {
    "preToolUse": [{
      "type": "command",
      "bash": "./scripts/safety-guard.sh",
      "cwd": ".github/hooks"
    }]
  }
}
```

**Claude Code (`.claude/settings.json`):**
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash|Write|Edit|MultiEdit",
      "hooks": [{
        "type": "command",
        "command": "bash .claude/hooks/safety-guard.sh"
      }]
    }]
  }
}
```

### Key Differences

| Aspect | Copilot | Claude Code |
|---|---|---|
| Config location | Separate `project-hooks.json` file | Inside `settings.json` |
| Event casing | `preToolUse`, `postToolUse` | `PreToolUse`, `PostToolUse` |
| Tool name format | `edit`, `create`, `bash` | `Write`, `Edit`, `MultiEdit`, `Bash` |
| Stdin key names | `toolName`, `toolArgs` | `tool_name`, `tool_input` |
| Block response | `{"permissionDecision":"deny","permissionDecisionReason":"..."}` | `{"decision":"block","reason":"..."}` |
| Script location | `.github/hooks/scripts/` | `.claude/hooks/` |

The hook scripts in `.claude/hooks/` use Claude Code's format (snake_case keys). The logic mirrors `.github/hooks/scripts/` exactly — the same files and operations are protected.

### What the Safety Guard Blocks

**File edits:**
- `backend/src/generated/` — auto-generated Prisma client
- `prisma/migrations/*.sql` — immutable after creation
- `migration_lock.toml` — Prisma-managed
- `.github/**` — the Copilot configuration harness

**Bash commands:**
- `rm -rf /` or `rm -rf ~` — destructive filesystem operations
- `DROP TABLE` / `DROP DATABASE` — destructive database operations
- `git push --force` / `git reset --hard` — destructive git operations
- `docker rm` / `docker system prune` — destructive container operations

---

## MCP Configuration

MCP servers are configured in `.mcp.json` at the project root for **project-scoped** configuration (shared with your team via git). This is the same servers as `.vscode/mcp.json`, minus the two Copilot-only servers (`awesome-copilot` and `github-agentic-workflows`).

### MCP Scopes

| Scope | File | Shared with team? |
|---|---|---|
| Project (recommended for team tools) | `.mcp.json` in project root | ✅ Yes, via git |
| Local (private, current project) | `~/.claude.json` under project path | No |
| User (private, all projects) | `~/.claude.json` | No |

Use `claude mcp add --scope project` to add a server to `.mcp.json`, or edit it directly.

### Configured Servers

| Server | What it enables |
|---|---|
| `figma-desktop` | Design-to-code in `@implement`, `/generate-component` |
| `atlassian` | Jira + Confluence in `@specify` |
| `playwright` | Run E2E tests directly in `@test-e2e` (scoped to that agent) |
| `chrome-devtools` | Browser inspection in `@feature-tester` |

### Configuration Format Comparison

**Copilot (`.vscode/mcp.json`):**
```json
{
  "servers": {
    "figma-desktop": { "type": "http", "url": "http://127.0.0.1:3845/mcp" }
  }
}
```

**Claude Code (`.mcp.json`):**
```json
{
  "mcpServers": {
    "figma-desktop": { "type": "http", "url": "http://127.0.0.1:3845/mcp" }
  }
}
```

The server definitions are identical — only the filename and top-level key differ.

> **Tip:** Some agents scope specific MCP servers to themselves via the `mcpServers` frontmatter field. The `test-e2e` agent includes Playwright and the `feature-tester` agent includes Chrome DevTools — keeping these tools out of the main conversation context unless actually needed.

### Setup Notes

- **Figma Desktop:** Requires the Figma desktop app running locally. See [MCP.md][mcp] for details.
- **Atlassian:** Requires OAuth2 authentication. Run `npx @atlassianlabs/mcp-server-atlassian` and follow the OAuth flow on first use.
- **Playwright + Chrome DevTools:** Run via `npx` — no global install needed.

See [MCP.md][mcp] for full server documentation and security guidance.

---

## Scheduled Routines (CronCreate)

Claude Code supports scheduled remote agents via `CronCreate` — the equivalent of the GitHub Agentic Workflows (`continuous-docs`, `code-simplifier`, `security-reviewer`).

### Comparison

| gh-aw workflow | Claude Code routine | Schedule | Trigger |
|---|---|---|---|
| `continuous-docs.md` | `continuous-docs` routine | Weekly | Cron + manual |
| `code-simplifier.md` | `code-simplifier` routine | Weekly (Monday) | Cron + manual |
| `security-reviewer.md` | `security-reviewer` routine | Weekly (Wednesday) | Cron + `/security-review` |

### Setting Up Routines

Use `CronCreate` in Claude Code to register scheduled routines. Example for continuous docs validation:

```
/schedule Create a weekly routine that validates the docs/ folder against
the codebase. Check that API endpoints in docs match actual routes,
data model descriptions match prisma/schema.prisma, and CLI commands
match package.json scripts. Create a PR if issues found.
```

### Key Differences from gh-aw

| Aspect | gh-aw | CronCreate |
|---|---|---|
| Config format | Compiled YAML from `.md` source | API-based registration |
| Execution | GitHub Actions runners | Remote Claude Code agents |
| PR creation | `safe-outputs.create-pull-request` | `gh pr create` via Bash |
| On-demand trigger | `/security-review` PR comment | `/security-review` slash command |
| Maintenance | `gh aw compile` after changes | Update via Claude Code API |

---

## Claude Code-Unique Capabilities

These capabilities exist in Claude Code and have no direct GitHub Copilot equivalent.

### Plan Mode

`Shift+Tab` triggers structured plan approval before any code is written. The plan is presented inline for review, edited if needed, then approved. No Copilot equivalent — the closest is the `@Specify → review → @Implement` multi-agent workflow.

### Auto Memory

Persistent cross-session memory at `~/.claude/projects/<hash>/memory/`. Claude Code automatically builds up a picture of who you are, how you work, and project context — surfacing it in future sessions without you needing to re-explain. This memory is per-project and per-user.

### `/fewer-permission-prompts`

Scans your Claude Code transcripts for commonly approved tool calls and automatically generates a minimal allowlist in `.claude/settings.json`. Run this after your first few sessions to reduce approval friction:

```
/fewer-permission-prompts
```

No Copilot equivalent — Copilot uses VS Code's extension trust model.

### Keybindings

Customize keyboard shortcuts in `~/.claude/keybindings.json`. This is unique to Claude Code's terminal interface:

```json
[
  { "key": "ctrl+e", "command": "sendToClaudeCode", "mode": "insert" }
]
```

### Status Line

The Claude Code status line shows the current task, token usage, and session state. Configure it via the `statusline-setup` skill or `/config` command.

### Worktree Isolation on Subagents

When Claude Code spawns a subagent with `isolation: "worktree"`, it automatically creates a git worktree, does the work in isolation, and either commits or cleans up. The user never needs to run `git worktree add/remove`. See [GIT_WORKTREES.md][git-worktrees] for the full parallel-agent workflow.

---

## Quickstart

### 1. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Start a Session

```bash
cd todo_app
claude
```

`CLAUDE.md` is loaded automatically. You'll see the project context and available skills.

### 3. Try Your First Skill

```
/onboard
```

Walks you through the project structure, conventions, and skill system.

### 4. Plan a Feature

```
/specify plan add task filtering by category
```

Researches the codebase, creates a structured `PLAN.md`, resolves questions before handoff.

### 5. Implement It

```
/implement
```

Reads `PLAN.md`, confirms each step, implements with project conventions.

### 6. Review Before Merging

```
/code-review
/security-review
```

---

## Official Resources

| Resource | Purpose |
|---|---|
| [Claude Code Overview][claude-code-docs] | Installation, features, CLI reference |
| [CLAUDE.md Memory System][claude-code-memory] | How CLAUDE.md and auto memory work |
| [Settings Reference][claude-code-settings] | hooks, permissions, mcpServers format |
| [Claude Code GitHub][claude-code-github] | Issues, changelog, extensions |
| [Anthropic API Docs][anthropic-api] | Claude models and API reference |

---

## Related Docs in This Project

| Doc | Purpose |
|---|---|
| [AI Development Guide][ai-guide] | Overview of both tools, agent system, learning paths |
| [Custom Agents][custom-agents] | Copilot agents + Claude Code subagent mapping |
| [Custom Instructions][custom-instructions] | CLAUDE.md hierarchy vs. Copilot instructions |
| [Custom Prompts][custom-prompts] | Slash commands vs. Copilot prompts |
| [Hooks][hooks] | Hook lifecycle, safety guard, auto-formatter |
| [MCP][mcp] | MCP server details and security |
| [Agentic Workflows][agentic-workflows] | gh-aw workflows + CronCreate routines |
| [Git Worktrees][git-worktrees] | Parallel agent isolation patterns |
| [Security][security] | AI attack surface, prompt injection, OWASP |
| [Responsibilities][responsibilities] | Developer accountability with AI tools |

<!-- Links -->
[ai-guide]: AI_DEVELOPMENT_GUIDE.md
[custom-agents]: CUSTOM_AGENTS.md
[custom-instructions]: CUSTOM_INSTRUCTIONS.md
[custom-prompts]: CUSTOM_PROMPTS.md
[hooks]: HOOKS.md
[mcp]: MCP.md
[agentic-workflows]: AGENTIC_WORKFLOWS.md
[git-worktrees]: GIT_WORKTREES.md
[security]: SECURITY.md
[responsibilities]: RESPONSIBILITIES.md

[claude-code-docs]: https://docs.anthropic.com/en/docs/claude-code/overview
[claude-code-memory]: https://docs.anthropic.com/en/docs/claude-code/memory
[claude-code-settings]: https://docs.anthropic.com/en/docs/claude-code/settings
[claude-code-github]: https://github.com/anthropics/claude-code
[anthropic-api]: https://docs.anthropic.com/
