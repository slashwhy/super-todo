# 🤖 Custom Agents

> Specialized AI agents with defined roles, minimal tools, and handoff patterns.

**Audience:** Developers using or extending agents | **Prerequisites:** [Custom Instructions][custom-instructions]

## 📋 Quick Reference

| Agent | Role | Writes Code? | Auto-Infer | Typical Use |
|-------|------|--------------|------------|-------------|
| [**@Specify & Validate**][agent-specify] | Planning & validation | ❌ Read-only | ✅ Yes | Plan features, validate implementations, design reviews |
| [**@Implement**][agent-implement] | Feature implementation | ✅ Yes | ❌ No | Build from scratch, from design, quick fixes |
| [**@Test Unit**][agent-test-unit] | Unit & integration tests | ✅ Yes | ✅ Yes | After implementation, regression tests, component props/emits validation |
| [**@Test E2E**][agent-test-e2e] | End-to-end tests | ✅ Yes | ❌ No | User interaction flows, complete workflows, cross-feature scenarios |
| [**@Socratic-Mentor**][agent-socratic-mentor] | Pedagogical concept builder | ❌ Read-only | ❌ No | Junior concept gaps, understanding checks, stack trace analysis |
| [**@Spec-First**][agent-spec-first] | Specification gate enforcer | ✅ Saves spec file | ❌ No | Formalise plans before implementing, EARS AC review |
| [**@Code-Review-Trainer**][agent-code-review-trainer] | AutoMCQ comprehension gate | ❌ Read-only | ❌ No | Post-implementation comprehension check (3 questions) |
| [**@Bebugging**][agent-bebugging] | Review muscle trainer (saboteur) | ✅ Sandbox only | ❌ No | Inject subtle bugs for junior review practice |

> **Auto-Infer:** When `✅ Yes`, Copilot can auto-select this agent based on task context. When `❌ No`, you must explicitly select the agent.

> 📖 **Official Docs:** [VS Code Custom Agents][vscode-agents] · [GitHub Custom Agents][github-agents]

## 🎯 What & Why

Custom agents are specialized AI personas in [`.github/agents/*.agent.md`][agent-files]. Each has a focused role, minimal tools, and defined handoffs.

**Why separate agents?**
- **Focus** – Each agent excels at one task type
- **Safety** – Read-only agents can't accidentally modify code
- **Least privilege** – Fewer tools = smaller attack surface, faster responses, less context usage

## 🌐 Agent Environments

VS Code supports four main categories of agents, each designed for different use cases and levels of interaction. Custom agents (defined in `.agent.md` files) can be used with local, background, and cloud agents to apply the same role or persona across environments.

> 📖 **Official Docs:** [Agents Overview][vscode-agents-overview]

| Type | Environment | Interaction | Best For |
|------|-------------|-------------|----------|
| [**Local**][vscode-local-agents] | VS Code on your machine | Interactive chat | Real-time feedback, brainstorming, tasks needing VS Code tools/MCP |
| [**Background**][vscode-background-agents] | CLI on your machine | Autonomous | Well-defined tasks, isolated work via Git worktrees |
| [**Cloud**][vscode-cloud-agents] | Remote infrastructure | Autonomous | Team collaboration via PRs, GitHub integration |
| **Third-party** | External providers | Varies | OpenAI Codex, other AI agents in your workflow |

### Local Agents

Run directly within VS Code for **interactive chat-based tasks**. Local agents have full access to workspace files, all configured tools (built-in, MCP, extensions), and all available models including BYOK.

**Best for:** Brainstorming, planning, tasks requiring immediate feedback, work needing VS Code context (linting errors, test results), or access to MCP servers.

### Background Agents

CLI-based agents that run **autonomously in the background**. Can use Git worktrees to work in isolation, preventing conflicts with your active development. Cannot access MCP or extension-provided tools.

**Best for:** Well-scoped implementation tasks, autonomous work that doesn't need interactive feedback or VS Code runtime context.

### Cloud Agents

Run on **remote infrastructure** and integrate with GitHub repositories and pull requests. Operate via branches and PRs for team collaboration and code reviews. Can access MCP servers configured in the remote environment.

**Best for:** Collaborative tasks requiring PR reviews, well-defined implementations, work that benefits from team oversight.

### Handoffs Between Environments

You can **hand off tasks between agent types** to leverage their unique strengths:

1. **Plan with local agent** → Interactive refinement
2. **Delegate to background** → Create proof-of-concept variants
3. **Continue with cloud** → Implement in PR for team review

Use the **Continue In** control in Chat view, or type `@cli` or `@cloud` in your prompt to delegate.

## 🔄 Our local agents workflow

```
@Specify (Plan)         →  Save plan to .ai/plans/{issue-name}/plan.md
       ↓ (new chat)
@Implement (Build)      →  Read plan file → implement → Completion Protocol
       ↓
@Test Unit              →  "Add E2E Tests"
       ↓
@Test E2E               →  "Validate Complete"
       ↓
@Specify (Validate)     →  Ready for merge
```

Each arrow is a **handoff**—you review before the next agent begins.

### Junior Developer Workflow

For junior developers, an extended workflow enforces comprehension at every step.
See [AI-Native Training][ai-native-training] for the full 12-week rollout guide.

```
[Concept Gap]                    [Feature Request]
      │                                 │
      ▼                                 ▼
@Socratic-Mentor            @Spec-First
(Build mental model)        (Write spec → save to .ai/plans/)
      │                                 │
      │                                 ▼
      │                          @Implement
      │                    (Read spec → build → mark steps)
      │                                 │
      │                                 ▼
      └──────────────────►  @Code-Review-Trainer
                            (AutoMCQ: 3 comprehension questions)
                                         │
                          ┌──────────────┴──────────────┐
                          ▼                             ▼
                      [PASS]                        [FAIL]
                   @Test-Unit                  @Socratic-Mentor
                  @Test-E2E                  (close the gap)
```

**Periodic training:** Use `@Bebugging` to maintain review-muscle skills.

### Plan-Based Handoff

Plans are persisted to `.ai/plans/{issue-name}/plan.md` (gitignored) so @Implement can start in a **new chat session** with a clean context window. This prevents context overflow from the planning phase consuming tokens needed for implementation.

**Workflow:**
1. `@specify plan TASK-123` → researches, plans, saves to `.ai/plans/TASK-123-title/plan.md`
2. Open **new chat** → `@implement Read #file:.ai/plans/TASK-123-title/plan.md and implement step by step`
3. @Implement updates plan checkboxes as it works
4. **Completion Protocol** runs: documentation impact check, cleanup

> 📖 **Details:** [Context Optimization – Plan-Based Handoff][context-optimization]

### Documentation Impact Assessment

Every plan includes a "Documentation Impact Assessment" section. @Implement checks this after completing all implementation steps and updates:

| Target | What to Check |
|--------|---------------|
| `.github/instructions/` | Are coding patterns still accurate? |
| `.github/skills/` | Do skills reflect new capabilities? |
| `.github/agents/` | Do agent definitions need updating? |
| `docs/` | Architecture docs, guides, READMEs current? |
| API / README | Endpoints, data models, commands correct? |

This ensures that features, bug fixes, library updates, and refactors don't silently invalidate project documentation.

## ⚙️ Model Selection

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

## 🛠️ Tool Selection

**The fewer tools, the better.** Each tool you grant an agent increases risk, slows responses, and uses more context. Apply these principles when creating agents:

| Principle | Why |
|-----------|-----|
| **Least privilege** | Grant only what's needed for the specific task |
| **Read-only by default** | Planning agents should never need `edit` or `execute` |
| **Scope MCP tools** | Use `server/specific-tool` not `server/*` when possible |
| **Audit periodically** | Remove tools that aren't being used |

**Common Tool Categories:**

| Category | When to Include |
|----------|-----------------|
| `read`, `search` | Almost always—safe information gathering |
| `edit` | Only for agents that modify code |
| `execute` | Only for agents that run commands/tests |
| `web` | Only if external research is needed |
| `agent` | Only if handoffs to other agents are required |
| MCP tools | Only the specific integrations needed (Jira, Figma, etc.) |

## 📝 Creating New Agents

Add a file to `.github/agents/`:

### Complete Example

```yaml
---
name: 'Review'
description: 'Code review agent that analyzes PRs for quality, conventions, and potential issues.'
tools: ['read', 'search']  # Read-only: no edit, no execute
model: Claude Sonnet 4.5
infer: true  # Allow auto-selection for review tasks
handoffs:
  - label: "Request Changes"
    agent: Implement
    send: false
---

# Reviewer – Code Quality Specialist with skill (see skills reference later)

You analyze code changes for quality issues, convention violations, and potential bugs. You automatically benefit from relevant [**skills**](#-skills-reference) like `code-documentation` to understand project standards.

## Role

You are a **code reviewer**: 
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
| `infer` | ❌ | Allow Copilot to auto-select this agent (default: true). Set `false` for specialized agents that require explicit invocation |
| `handoffs` | ❌ | Agents this can hand off to |
| `handoffs[].send` | ❌ | Auto-submit handoff (default: false) |

> 📖 **Full spec:** [Agent Configuration Reference][agent-config-ref]

## 🎓 Skills Reference

Skills are folders of instructions, scripts, and resources that Copilot loads on-demand. Unlike custom instructions (which define coding standards), skills enable specialized capabilities with scripts, examples, and other resources. 

**Location:** Project skills in `.github/skills/<skill-name>/SKILL.md` or `.claude/skills/<skill-name>/SKILL.md` · Personal skills in `~/.copilot/skills/<skill-name>/SKILL.md`

> 📖 **Learn more:** [About Agent Skills][github-about-agent-skills]

### This Project's Skills

| Skill | Description |
|-------|-------------|
| [`vue-components`][skill-vue-components] | Vue 3 Composition API patterns, props, emits, slots |
| [`vue-composables`][skill-vue-composables] | Reusable composition functions with `use*` naming |
| [`pinia-stores`][skill-pinia-stores] | State management with Setup Store syntax |
| [`prisma-database`][skill-prisma-database] | ORM queries, migrations, relations |
| [`backend-routes`][skill-backend-routes] | Express handlers, async/await, field whitelisting |
| [`styling`][skill-styling] | CSS variables, BEM naming, responsive patterns |
| [`unit-testing`][skill-unit-testing] | Vitest patterns, AAA, mocking |
| [`e2e-testing`][skill-e2e-testing] | Playwright Page Objects, `data-testid` selectors |
| [`code-documentation`][skill-code-documentation] | TSDoc patterns, when to document |
| [`architectural-documentation`][skill-architectural-documentation] | Implementation plans, ADRs, README updates |

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
| **Purpose** |  Specialized capabilities and workflows | Define coding standards and guidelines |
| **Portability** | VS Code, Copilot CLI, and coding agent | VS Code and GitHub.com only |
| **Content** | Instructions, scripts, examples, resources | Instructions only |
| **Scope** | Task-specific, loaded on-demand | Always applied (or via glob patterns) |
| **Standard** | Open standard ([agentskills.io][agentskills]) | VS Code-specific |
| **When to use** | More detailed instructions for specialized tasks | Simple rules relevant to almost every task |

> 📖 **Docs:** [VS Code Agent Skills][vscode-agent-skills] · [GitHub About Agent Skills][github-about-agent-skills] · [Skills Standard][agentskills] · [Reference Skills][reference-skills]


## 🔗 Related

- [Agents Overview][vscode-agents-overview] – VS Code agent types and environments
- [Custom Prompts][custom-prompts] – Reusable task templates
- [Custom Instructions][custom-instructions] – Instruction hierarchy
- [Context Optimization][context-optimization] – Plan-based handoff and Structured Autonomy
- [MCP Integrations][mcp] – External tool connections
- [Developer Responsibilities][responsibilities] – Agent accountability and workflows
- [Security Guide][security] – Agent security constraints and MCP risks

<!-- Agent Files -->
[agent-specify]: ../.github/agents/specify.agent.md
[agent-implement]: ../.github/agents/implement.agent.md
[agent-test-unit]: ../.github/agents/test-unit.agent.md
[agent-test-e2e]: ../.github/agents/test-e2e.agent.md
[agent-socratic-mentor]: ../.github/agents/socratic-mentor.agent.md
[agent-spec-first]: ../.github/agents/spec-first.agent.md
[agent-code-review-trainer]: ../.github/agents/code-review-trainer.agent.md
[agent-bebugging]: ../.github/agents/bebugging.agent.md
[agent-files]: ../.github/agents/

<!-- Skill Files -->
[skill-vue-components]: ../.github/skills/vue-components/SKILL.md
[skill-vue-composables]: ../.github/skills/vue-composables/SKILL.md
[skill-pinia-stores]: ../.github/skills/pinia-stores/SKILL.md
[skill-prisma-database]: ../.github/skills/prisma-database/SKILL.md
[skill-backend-routes]: ../.github/skills/backend-routes/SKILL.md
[skill-styling]: ../.github/skills/styling/SKILL.md
[skill-unit-testing]: ../.github/skills/unit-testing/SKILL.md
[skill-e2e-testing]: ../.github/skills/e2e-testing/SKILL.md
[skill-code-documentation]: ../.github/skills/code-documentation/SKILL.md
[skill-architectural-documentation]: ../.github/skills/architectural-documentation/SKILL.md

<!-- Project Documentation -->
[custom-prompts]: ./CUSTOM_PROMPTS.md
[custom-instructions]: ./CUSTOM_INSTRUCTIONS.md
[context-optimization]: ./CONTEXT_OPTIMIZATION.md
[mcp]: ./MCP.md
[responsibilities]: ./RESPONSIBILITIES.md
[security]: ./SECURITY.md
[ai-native-training]: ./AI_NATIVE_TRAINING.md

<!-- GitHub Copilot Documentation -->
[vscode-agents]: https://code.visualstudio.com/docs/copilot/customization/custom-agents
[vscode-agents-overview]: https://code.visualstudio.com/docs/copilot/agents/overview
[vscode-local-agents]: https://code.visualstudio.com/docs/copilot/chat/copilot-chat
[vscode-background-agents]: https://code.visualstudio.com/docs/copilot/agents/background-agents
[vscode-cloud-agents]: https://code.visualstudio.com/docs/copilot/agents/cloud-agents
[github-agents]: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents
[agent-config-ref]: https://docs.github.com/en/copilot/reference/custom-agents-configuration

<!-- Agent Skills & Standards -->
[vscode-agent-skills]: https://code.visualstudio.com/docs/copilot/customization/agent-skills
[github-about-agent-skills]: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
[agentskills]: https://agentskills.io/
[reference-skills]: https://github.com/anthropics/skills
