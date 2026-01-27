# 🤖 Custom Agents

> Specialized AI agents with defined roles, minimal tools, and handoff patterns.

**Audience:** Developers using or extending agents | **Prerequisites:** [Custom Instructions](./CUSTOM_INSTRUCTIONS.md)

---

## Quick Reference

| Agent | Role | Writes Code? | Typical Use |
|-------|------|--------------|-------------|
| **@Specify & Validate** | Planning & validation | ❌ Read-only | `@specify plan PROJ-123`, `@specify challenge` |
| **@Implement** | Feature implementation | ✅ Yes | `@implement`, `@implement from-design` |
| **@Test Unit** | Unit & integration tests | ✅ Yes | After implementation |
| **@Test E2E** | End-to-end tests | ✅ Yes | After unit tests pass |

> 📖 **Official Docs:** [VS Code Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) · [GitHub Custom Agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)

---

## What & Why

Custom agents are specialized AI personas in `.github/agents/*.agent.md`. Each has a focused role, minimal tools, and defined handoffs.

**Why separate agents?**
- **Focus** – Each agent excels at one task type
- **Safety** – Read-only agents can't accidentally modify code
- **Least privilege** – Fewer tools = smaller attack surface, faster responses

---

## Workflow

```
@Specify (Plan)         →  "Start Implementation"
       ↓
@Implement (Build)      →  "Add Unit Tests"
       ↓
@Test Unit              →  "Add E2E Tests"
       ↓
@Test E2E               →  "Validate Complete"
       ↓
@Specify (Validate)     →  Ready for merge
```

Each arrow is a **handoff**—you review before the next agent begins.

---

## Agent Overview

| Agent | Purpose | Key Constraints |
|-------|---------|-----------------|
| **@Specify & Validate** | Creates implementation plans from Jira/Figma; validates completed work | Cannot modify files; asks clarifying questions |
| **@Implement** | Builds features step-by-step from plans | Follows CSS variables, Prisma conventions, confirms before each step |
| **@Test Unit** | Writes Vitest tests for components and routes | Never modifies production code; uses AAA pattern |
| **@Test E2E** | Writes Playwright tests for user flows | Uses `data-testid` selectors; Page Object pattern |

**Modes:**
- `@specify plan <JIRA-ID>` – Generate implementation plan
- `@specify challenge` – Validate implementation against acceptance criteria
- `@specify challenge --layout` – Include spacing/responsive checks
- `@implement from-design` – Build component from Figma
- `@implement fix` – Quick targeted fix

---

## Model Selection

Choose the model that fits your task—don't default to the most powerful option.

| When You Need | Choose | Examples |
|---------------|--------|----------|
| Deep reasoning, architecture decisions | High-reasoning model | System design, complex refactors |
| Precise code generation | Balanced model | Feature implementation, bug fixes |
| Large codebase analysis | High-context model | Cross-file refactoring, dependency analysis |
| Fast iteration, debugging | Low-latency model | Quick fixes, syntax help |
| Batch/bulk operations | Cost-efficient model | Documentation, repetitive tasks |

**Decision factors:**
1. **Complexity** – More reasoning needed → higher-capability model
2. **Context size** – Large codebases → high-context model
3. **Speed** – Interactive work → low-latency model
4. **Cost** – Routine tasks → efficient model

> 💡 **Tip:** Start with a balanced model. Upgrade if you hit reasoning limits; downgrade for routine work.

---

## Tool Selection Principles

**The fewer tools, the better.** Each tool you grant an agent:
- Increases potential for unintended actions
- Expands the attack surface
- Slows response time (more capabilities to consider)
- Reduces focus on core task

| Principle | Why |
|-----------|-----|
| **Least privilege** | Grant only what's needed for the specific task |
| **Read-only by default** | Planning agents should never need `edit` or `execute` |
| **Scope MCP tools** | Use `server/specific-tool` not `server/*` when possible |
| **Audit periodically** | Remove tools that aren't being used |

### Tool Categories

| Category | When to Include |
|----------|-----------------|
| `read`, `search` | Almost always—safe information gathering |
| `edit` | Only for agents that modify code |
| `execute` | Only for agents that run commands/tests |
| `web` | Only if external research is needed |
| `agent` | Only if handoffs to other agents are required |
| MCP tools | Only the specific integrations needed (Jira, Figma, etc.) |

---

## Creating New Agents

Add a file to `.github/agents/`:

### Complete Example

```yaml
---
name: 'Review'
description: 'Code review agent that analyzes PRs for quality, conventions, and potential issues.'
tools: ['read', 'search']  # Read-only: no edit, no execute
model: Claude Sonnet 4.5
handoffs:
  - label: "Request Changes"
    agent: Implement
    send: false
---

# Reviewer – Code Quality Specialist

You analyze code changes for quality issues, convention violations, and potential bugs.

## Role

You are a **code reviewer**. You:
- Read diffs and understand intent
- Check against project conventions in `.github/instructions/`
- Identify bugs, security issues, and style problems
- Suggest improvements without making changes yourself

**You REVIEW, you don't FIX.** Hand off to @Implement for changes.

## Constraints

**ALWAYS:**
- ✅ Reference specific file paths and line numbers
- ✅ Explain *why* something is a problem
- ✅ Prioritize issues (critical → minor)

**NEVER:**
- ❌ Modify files (you're read-only)
- ❌ Run commands
- ❌ Approve without thorough review

## Workflow

1. Read the diff or files under review
2. Check against project conventions
3. List issues with severity and location
4. Suggest specific fixes (for @Implement to apply)
5. Hand off if changes needed
```

### YAML Properties Reference

| Property | Required | Description |
|----------|----------|-------------|
| `name` | ✅ | Display name in VS Code |
| `description` | ✅ | One-line role summary |
| `tools` | ✅ | Array of allowed tools (keep minimal!) |
| `model` | ❌ | Suggested model (user can override) |
| `handoffs` | ❌ | Agents this can hand off to |
| `handoffs[].send` | ❌ | Auto-submit handoff (default: false) |

> 📖 **Full spec:** [Agent Configuration Reference](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

---

## Skills Reference

Skills are folders of instructions, scripts, and resources that Copilot loads on-demand. Unlike custom instructions (which define coding standards), skills enable specialized capabilities with scripts, examples, and other resources.

**Location:** `.github/skills/<skill-name>/SKILL.md`

### This Project's Skills

| Skill | Description |
|-------|-------------|
| `vue-components` | Vue 3 Composition API patterns, props, emits, slots |
| `vue-composables` | Reusable composition functions with `use*` naming |
| `pinia-stores` | State management with Setup Store syntax |
| `prisma-database` | ORM queries, migrations, relations |
| `backend-routes` | Express handlers, async/await, field whitelisting |
| `styling` | CSS variables, BEM naming, responsive patterns |
| `unit-testing` | Vitest patterns, AAA, mocking |
| `e2e-testing` | Playwright Page Objects, `data-testid` selectors |
| `code-documentation` | TSDoc patterns, when to document |
| `architectural-documentation` | Implementation plans, ADRs, README updates |

### How Skills Work (Progressive Disclosure)

| Level | What Happens |
|-------|--------------|
| **1. Discovery** | Copilot reads `name` and `description` from frontmatter to decide relevance |
| **2. Instructions** | If relevant, loads the `SKILL.md` body into context |
| **3. Resources** | Accesses scripts, examples, and docs in the skill directory only when referenced |

This means you can install many skills without consuming context—only relevant content loads.

### Skills vs Custom Instructions

| Aspect | Agent Skills | Custom Instructions |
|--------|--------------|---------------------|
| **Purpose** | Teach specialized capabilities and workflows | Define coding standards and guidelines |
| **Portability** | VS Code, Copilot CLI, and coding agent | VS Code and GitHub.com only |
| **Content** | Instructions, scripts, examples, resources | Instructions only |
| **Scope** | Task-specific, loaded on-demand | Always applied (or via glob patterns) |
| **Standard** | Open standard ([agentskills.io](https://agentskills.io/)) | VS Code-specific |

> 📖 **Docs:** [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) · [Skills Standard](https://agentskills.io/) · [Reference Skills](https://github.com/anthropics/skills)

---

## Patterns

### ✅ Do This

```yaml
# Minimal, focused tools for a read-only agent
name: 'Reviewer'
tools:
  - read
  - search
# Why: Can't accidentally modify code; fast; focused
```

```yaml
# Scoped MCP access
tools:
  - 'atlassian/atlassian-mcp-server/getJiraIssue'
  - 'atlassian/atlassian-mcp-server/search'
# Why: Only the Jira tools needed, not full Confluence access
```

### ⚠️ Avoid This

```yaml
# Overpowered agent
tools:
  - execute
  - read
  - edit
  - delete
  - git
  - deploy
  - 'atlassian/*'
  - 'figma-desktop/*'
# Why: Security risk; slow; unfocused; hard to audit
```

```yaml
# Wildcard MCP access when specific tools suffice
tools:
  - 'figma-desktop/*'
# Why: Grants 7 tools when you might only need get_screenshot
```

---

## Related

- [Custom Prompts](./CUSTOM_PROMPTS.md) – Reusable task templates
- [Custom Instructions](./CUSTOM_INSTRUCTIONS.md) – Instruction hierarchy
- [MCP Integrations](./MCP.md) – External tool connections
- [Governance & Security](./GOVERNANCE.md) – Agent security constraints
