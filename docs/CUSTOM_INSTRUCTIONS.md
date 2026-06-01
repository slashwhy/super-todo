# 📋 Custom Instructions

> Define coding standards and guidelines that Copilot follows automatically in your repository.

**Audience:** Developers customizing Copilot behavior | **Prerequisites:** None

> 📖 **Official Docs:** [VS Code Custom Instructions][vscode-instructions] · [GitHub Repository Instructions][github-instructions] · [Customization Cheat Sheet][copilot-cheat-sheet]

## 🚀 Quick Start – Choose Your Agent

## Quick Reference

| Type              | Location                                 | Use When                                                                   | Claude Code equivalent                        |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------- |
| **Global**        | `AGENTS.md` (root)                       | Project-wide coding standards, always loaded (cross-tool compatible)       | `CLAUDE.md` (root, imports `@AGENTS.md`)      |
| **Path-specific** | `.github/instructions/*.instructions.md` | Rules for specific file types (uses `applyTo` glob)                        | `frontend/CLAUDE.md` / `backend/CLAUDE.md`    |
| **Agent**         | `.github/agents/*.agent.md`              | Specialized personas with tools & handoffs                                 | Built-in subagent types (no `.agent.md` file) |
| **Skills**        | `.github/skills/*/SKILL.md`              | Reusable workflows with scripts (see [Skills Reference][skills-reference]) | Same `SKILL.md` files (shared via `@` import) |

**Priority:** Personal > Repository > Organization (all combined, conflicts favor more specific)

> � **Official feature comparison:** [Customization Cheat Sheet][copilot-cheat-sheet] — covers all instruction types and IDE/surface support.

> �💡 **Tip:** Custom instructions affect chat and agent mode, not inline suggestions as you type.

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
│ 1. Global Instructions (AGENTS.md)                    │
│    AGENTS.md (root)                                   │
│    → Always loaded for every chat request             │
│    → Cross-tool compatible (Copilot, Claude, Cursor)  │
├───────────────────────────────────────────────────────┤
│ 2. Path-Specific Instructions                         │
│    vue-components.instructions.md (applyTo: **/*.vue) │
│    styling.instructions.md (applyTo: **/*.vue)        │
│    → Loaded when editing/creating matching files      │
├───────────────────────────────────────────────────────┤
│ 3. Agent Instructions                                 │
│    .github/agents/implement.agent.md                  │
│    → Loaded when @Implement is invoked                │
├───────────────────────────────────────────────────────┤
│ 4. Skills (on-demand)                                 │
│    .github/skills/vue-components/SKILL.md             │
│    → Loaded when task matches skill description       │
└───────────────────────────────────────────────────────┘
```

**Verification:** Check the **References** section in chat responses to see which instruction files were included.

## 📖 Instruction Types

### 🌍 Global Instructions

**File:** `AGENTS.md` (project root)

This project uses `AGENTS.md` — the [open standard][agents-md-standard] supported by 12+ AI tools — as the global instructions file. It's always loaded and should be kept short (1-2 pages):

```markdown
# Project Name - Instructions

## Tech Stack

- Frontend: Vue 3, TypeScript, Pinia
- Backend: Express, Prisma, PostgreSQL

## Project Structure

/src # Vue SPA
/backend # Express API

## Critical Rules

**Always:**

- Use TypeScript
- Include unit tests

**Never:**

- Commit .env files
- Hardcode API keys
```

See [AGENTS.md][global-instructions] for this project's global instructions.

### 🎯 Path-Specific Instructions

**Location:** `.github/instructions/*.instructions.md`

Loaded only when editing matching files:

```markdown
---
applyTo: "**/*.vue"
name: "Vue Components" # Optional: display name in UI
description: "Composition API patterns" # Optional
---

# Vue Components

Use `<script setup lang="ts">` syntax...
```

**Frontmatter properties:**

| Property      | Required | Description                                                    |
| ------------- | -------- | -------------------------------------------------------------- |
| `applyTo`     | ❌       | Glob pattern for auto-apply (if omitted, must attach manually) |
| `name`        | ❌       | Display name in UI (defaults to filename)                      |
| `description` | ❌       | Short description of the instructions                          |

**ApplyTo patterns:**

| Pattern             | Matches                                       |
| ------------------- | --------------------------------------------- |
| `*.ts`              | `.ts` files in root only                      |
| `**/*.ts`           | All `.ts` files recursively                   |
| `src/**/*.vue`      | Vue files under `src/`                        |
| `**/*.{ts,tsx}`     | All `.ts` and `.tsx` files                    |
| `**/subdir/**/*.py` | All `.py` files in any `subdir/` at any depth |

**This project's path-specific instructions:**

| File                               | Applies To                    |
| ---------------------------------- | ----------------------------- |
| `vue-components.instructions.md`   | `**/*.vue`                    |
| `vue-composables.instructions.md`  | `**/composables/**/*.ts`      |
| `pinia-stores.instructions.md`     | `**/stores/**/*.ts`           |
| `backend-routes.instructions.md`   | `backend/src/routes/**/*.ts`  |
| `prisma-database.instructions.md`  | `backend/prisma/**`           |
| `styling.instructions.md`          | `**/*.css, **/*.vue`          |
| `testing-frontend.instructions.md` | `src/**/*.{spec,test}.ts`     |
| `testing-backend.instructions.md`  | `backend/**/*.{spec,test}.ts` |
| `testing-e2e.instructions.md`      | `e2e/**/*.ts`                 |

### 🤖 AGENTS.md (Open Standard for AI Agents)

**Location:** Root of workspace (or subfolders for monorepos)

`AGENTS.md` is an **open standard** supported by 12+ AI tools: GitHub Copilot, Claude Code, OpenAI Codex, Cursor, Aider, Google Jules, and more. It's maintained by the [Agentic AI Foundation](https://agents.md/) under the Linux Foundation.

#### Why This Project Uses AGENTS.md

This project uses `AGENTS.md` in the project root as its global instructions file because:

1. **Cross-tool compatibility** — Instructions work with any AI tool team members use (Copilot, Claude Code, Cursor, etc.)
2. **Open standard** — Supported by the [Agentic AI Foundation][agents-md-standard] and 12+ tools, future-proof
3. **Subdirectory nesting** — Supports overrides per subdirectory in monorepos
4. **Full Copilot support** — GitHub Copilot reads `AGENTS.md` for chat, agent mode, and cloud agent sessions

#### AGENTS.md vs copilot-instructions.md

| Aspect           | `AGENTS.md`                | `.github/copilot-instructions.md` |
| ---------------- | -------------------------- | --------------------------------- |
| **Supported by** | 12+ tools (cross-platform) | GitHub Copilot only               |
| **Nesting**      | ✅ Subdirectory overrides  | ❌ Repository-wide only           |
| **Code review**  | ❌                         | ✅                                |
| **Copilot Chat** | ✅ (agents only)           | ✅ (all features)                 |
| **Format**       | Plain markdown             | Plain markdown                    |

> 💡 **Note:** If you need Copilot Code Review instructions, you can add a `.github/copilot-instructions.md` alongside `AGENTS.md`. Copilot reads both files.

> 📌 **VS Code setup:** Enable `chat.useAgentsMdFile` in settings. For subfolder support, enable `chat.useNestedAgentsMdFiles` (experimental).

> 📖 **Learn more:** [AGENTS.md Standard][agents-md-standard] · [GitHub Docs](https://agents.md/docs/supported-frameworks#github-copilot)

### 🎭 Agent Instructions

**Location:** `.github/agents/*.agent.md`

Loaded when an agent is invoked. See [Custom Agents][custom-agents] for details.

## Claude Code: CLAUDE.md Hierarchy

Claude Code uses `CLAUDE.md` files instead of per-file instruction frontmatter. Key differences and equivalences:

**How loading works:** Claude Code loads `CLAUDE.md` files recursively based on the current working directory. The root `CLAUDE.md` always loads; subdirectory `CLAUDE.md` files load when the cwd is inside that subtree.

**This project's setup:**

| File | Loads when | What it imports |
| ---- | ---------- | --------------- |
| `CLAUDE.md` (root) | Always | `@AGENTS.md` — single source of truth, no duplication |
| `frontend/CLAUDE.md` | cwd inside `frontend/**` | 6 instruction files from `.github/instructions/` |
| `backend/CLAUDE.md` | cwd inside `backend/**` | 3 instruction files from `.github/instructions/` |

Using `@AGENTS.md` in the root `CLAUDE.md` keeps the setup DRY: global instructions are authored once and consumed by both Copilot and Claude Code.

**Copilot vs. Claude Code — path scoping mechanisms:**

| Tool | Mechanism | Example |
| ---- | --------- | ------- |
| **Copilot** | `applyTo` glob in frontmatter — matches files by pattern regardless of directory | `applyTo: "**/*.vue"` activates for any `.vue` file |
| **Claude Code** | Directory-scoped `CLAUDE.md` — activates when cwd is inside the directory | `frontend/CLAUDE.md` loads when working in `frontend/**` |

Both achieve the same goal — targeted instructions for specific areas of the codebase — through different mechanisms. Copilot's `applyTo` is file-pattern driven; Claude Code's hierarchy is directory driven.

## 💡 Writing Tips

| Principle           | Example                                                     |
| ------------------- | ----------------------------------------------------------- |
| **Be specific**     | "Use `data-testid` for selectors" not "write testable code" |
| **Show examples**   | Code blocks with ✅ and ⚠️                                  |
| **Use tables**      | Quick reference for conventions                             |
| **Link to files**   | `[TaskCard.vue](../src/components/tasks/TaskCard.vue)`      |
| **Keep focused**    | One concept per section                                     |
| **Reference tools** | Use `#tool:<tool-name>` syntax in body text                 |

**Length guidelines:**

| Type          | Target Length                             |
| ------------- | ----------------------------------------- |
| Global        | 1-2 pages max (per GitHub recommendation) |
| Path-specific | 50-150 lines                              |
| Agent         | 100-200 lines                             |

## 🔍 Troubleshooting

**Instructions not being applied?**

1. Check file location matches the type (`AGENTS.md` in root, `.github/instructions/`, etc.)
2. For path-specific: verify `applyTo` glob matches the file you're editing
3. Check **References** section in chat response to see which files were used
4. Enable `github.copilot.chat.codeGeneration.useInstructionFiles` setting for global file

## 🔗 Related

- [Custom Agents][custom-agents] – Agent definitions
- [MCP Integrations][mcp] – External tool connections

<!-- Internal Docs -->

[global-instructions]: ../AGENTS.md
[custom-agents]: ./CUSTOM_AGENTS.md
[mcp]: ./MCP.md

<!-- Agents -->

[implement-agent]: ../.github/agents/implement.agent.md
[specify-agent]: ../.github/agents/specify.agent.md
[test-unit-agent]: ../.github/agents/test-unit.agent.md
[test-e2e-agent]: ../.github/agents/test-e2e.agent.md

<!-- Skills Reference -->

[skills-reference]: ./SKILLS.md

<!-- External Documentation -->

[vscode-instructions]: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
[github-instructions]: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
[custom-instructions-matrix]: https://docs.github.com/en/copilot/reference/custom-instructions-support
[copilot-cheat-sheet]: https://docs.github.com/en/copilot/reference/customization-cheat-sheet
[agents-md-standard]: https://agents.md/
