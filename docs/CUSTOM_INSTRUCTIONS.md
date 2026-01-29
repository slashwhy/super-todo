# 📋 Custom Instructions

> Define coding standards and guidelines that Copilot follows automatically in your repository.

**Audience:** Developers customizing Copilot behavior | **Prerequisites:** None

> 📖 **Official Docs:** [VS Code Custom Instructions][vscode-instructions] · [GitHub Repository Instructions][github-instructions]

## 🚀 Quick Start – Choose Your Agent

## Quick Reference

| Type | Location | Use When |
|------|----------|----------|
| **Global** | `.github/copilot-instructions.md` | Project-wide coding standards, always loaded |
| **Path-specific** | `.github/instructions/*.instructions.md` | Rules for specific file types (uses `applyTo` glob) |
| **AGENTS.md** | Root or subfolders | Multi-agent workflows (CLI, coding agent) |
| **Agent** | `.github/agents/*.agent.md` | Specialized personas with tools & handoffs |
| **Skills** | `.github/skills/*/SKILL.md` | Reusable workflows with scripts (see [Skills Reference][skills-reference]) |

**Priority:** Personal > Repository > Organization (all combined, conflicts favor more specific)

> 💡 **Tip:** Custom instructions affect chat and agent mode, not inline suggestions as you type.

## 📚 What & Why

Custom instructions define common guidelines that automatically influence how Copilot generates code. Instead of repeating context in every prompt, store it once:

- **Coding standards** – Naming, patterns, conventions
- **Build & test** – Commands, validation steps, environment setup
- **Project structure** – Where files go, how they relate
- **Domain knowledge** – Business rules, constraints

Instructions are combined from multiple sources and added to chat context automatically.

## 🔄 How It Works

When you start a chat or invoke an agent, Copilot gathers applicable instructions:

```
User starts @Implement to edit TaskCard.vue
                    ↓
┌───────────────────────────────────────────────────────┐
│ 1. Global Instructions                                │
│    .github/copilot-instructions.md                    │
│    → Always loaded for every chat request             │
├───────────────────────────────────────────────────────┤
│ 2. AGENTS.md (if enabled)                             │
│    AGENTS.md in root or nearest subfolder             │
│    → Loaded if chat.useAgentsMdFile is enabled        │
├───────────────────────────────────────────────────────┤
│ 3. Path-Specific Instructions                         │
│    vue-components.instructions.md (applyTo: **/*.vue) │
│    styling.instructions.md (applyTo: **/*.vue)        │
│    → Loaded when editing/creating matching files      │
├───────────────────────────────────────────────────────┤
│ 4. Agent Instructions                                 │
│    .github/agents/implement.agent.md                  │
│    → Loaded when @Implement is invoked                │
├───────────────────────────────────────────────────────┤
│ 5. Skills (on-demand)                                 │
│    .github/skills/vue-components/SKILL.md             │
│    → Loaded when task matches skill description       │
└───────────────────────────────────────────────────────┘
```

**Verification:** Check the **References** section in chat responses to see which instruction files were included.

## 📖 Instruction Types

### 🌍 Global Instructions

**File:** `.github/copilot-instructions.md`

Always loaded. Keep short (1-2 pages):

```markdown
# Project Name - Copilot Instructions

## Tech Stack
- Frontend: Vue 3, TypeScript, Pinia
- Backend: Express, Prisma, PostgreSQL

## Project Structure
/src          # Vue SPA
/backend      # Express API

## Critical Rules
**Always:**
- Use TypeScript
- Include unit tests

**Never:**
- Commit .env files
- Hardcode API keys
```

See [copilot-instructions.md][global-instructions] for this project's example.

### 🎯 Path-Specific Instructions

**Location:** `.github/instructions/*.instructions.md`

Loaded only when editing matching files:

```markdown
---
applyTo: "**/*.vue"
name: "Vue Components"        # Optional: display name in UI
description: "Composition API patterns"  # Optional
---

# Vue Components

Use `<script setup lang="ts">` syntax...
```

**Frontmatter properties:**

| Property | Required | Description |
|----------|----------|-------------|
| `applyTo` | ❌ | Glob pattern for auto-apply (if omitted, must attach manually) |
| `name` | ❌ | Display name in UI (defaults to filename) |
| `description` | ❌ | Short description of the instructions |

**ApplyTo patterns:**

| Pattern | Matches |
|---------|---------|
| `*.ts` | `.ts` files in root only |
| `**/*.ts` | All `.ts` files recursively |
| `src/**/*.vue` | Vue files under `src/` |
| `**/*.{ts,tsx}` | All `.ts` and `.tsx` files |
| `**/subdir/**/*.py` | All `.py` files in any `subdir/` at any depth |

**This project's path-specific instructions:**

| File | Applies To |
|------|------------|
| `vue-components.instructions.md` | `**/*.vue` |
| `vue-composables.instructions.md` | `**/composables/**/*.ts` |
| `pinia-stores.instructions.md` | `**/stores/**/*.ts` |
| `backend-routes.instructions.md` | `backend/src/routes/**/*.ts` |
| `prisma-database.instructions.md` | `backend/prisma/**` |
| `styling.instructions.md` | `**/*.css, **/*.vue` |
| `testing-frontend.instructions.md` | `src/**/*.{spec,test}.ts` |
| `testing-backend.instructions.md` | `backend/**/*.{spec,test}.ts` |
| `testing-e2e.instructions.md` | `e2e/**/*.ts` |

### 🤖 AGENTS.md (Multi-Agent Support)

**Location:** Root of workspace (or subfolders with experimental setting)

Useful when working with multiple AI agents. The nearest `AGENTS.md` in the directory tree takes precedence.

```markdown
# AGENTS.md

This project uses Vue 3, Express, and Prisma.

## Build
npm install && npm run dev

## Test
npm run test
```

> 📌 **Note:** Enable with `chat.useAgentsMdFile` setting. For subfolder support, enable `chat.useNestedAgentsMdFiles` (experimental).

### 🎭 Agent Instructions

**Location:** `.github/agents/*.agent.md`

Loaded when an agent is invoked. See [Custom Agents][custom-agents] for details.

## 💡 Writing Tips

| Principle | Example |
|-----------|---------|
| **Be specific** | "Use `data-testid` for selectors" not "write testable code" |
| **Show examples** | Code blocks with ✅ and ⚠️ |
| **Use tables** | Quick reference for conventions |
| **Link to files** | `[TaskCard.vue](../src/components/tasks/TaskCard.vue)` |
| **Keep focused** | One concept per section |
| **Reference tools** | Use `#tool:<tool-name>` syntax in body text |

**Length guidelines:**

| Type | Target Length |
|------|---------------|
| Global | 1-2 pages max (per GitHub recommendation) |
| Path-specific | 50-150 lines |
| Agent | 100-200 lines |

## 🔍 Troubleshooting

**Instructions not being applied?**

1. Check file location matches the type (`.github/copilot-instructions.md`, `.github/instructions/`, etc.)
2. For path-specific: verify `applyTo` glob matches the file you're editing
3. Check **References** section in chat response to see which files were used
4. Enable `github.copilot.chat.codeGeneration.useInstructionFiles` setting for global file

## 🔗 Related

- [Custom Agents][custom-agents] – Agent definitions
- [MCP Integrations][mcp] – External tool connections

<!-- Internal Docs -->
[global-instructions]: ../.github/copilot-instructions.md
[custom-agents]: ./CUSTOM_AGENTS.md
[mcp]: ./MCP.md

<!-- Agents -->
[implement-agent]: ../.github/agents/implement.agent.md
[specify-agent]: ../.github/agents/specify.agent.md
[test-unit-agent]: ../.github/agents/test-unit.agent.md
[test-e2e-agent]: ../.github/agents/test-e2e.agent.md

<!-- Skills Reference -->
[skills-reference]: ./CUSTOM_AGENTS.md#skills-reference

<!-- External Documentation -->
[vscode-instructions]: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
[github-instructions]: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
[custom-instructions-matrix]: https://docs.github.com/en/copilot/reference/custom-instructions-support
