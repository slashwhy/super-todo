# 🤖 Custom Agents

> Specialized AI agents with defined roles, minimal tools, and handoff patterns.

**Audience:** Developers using or extending agents | **Prerequisites:** [Custom Instructions][custom-instructions]

## 📋 Quick Reference

| Agent                                    | Role                     | Writes Code? | Auto-Infer | Typical Use                                                              |
| ---------------------------------------- | ------------------------ | ------------ | ---------- | ------------------------------------------------------------------------ |
| [**@Specify & Validate**][agent-specify] | Planning & validation    | ❌ Read-only | ✅ Yes     | Plan features, validate implementations, design reviews                  |
| [**@Implement**][agent-implement]        | Feature implementation   | ✅ Yes       | ❌ No      | Build from scratch, from design, quick fixes                             |
| [**@Test Unit**][agent-test-unit]        | Unit & integration tests | ✅ Yes       | ✅ Yes     | After implementation, regression tests, component props/emits validation |
| [**@Test E2E**][agent-test-e2e]          | End-to-end tests         | ✅ Yes       | ❌ No      | User interaction flows, complete workflows, cross-feature scenarios      |
| [**@Feature Tester**][agent-feature-tester] | Browser-based exploratory testing | ❌ Read-only | ✅ Yes | Visual testing, UI verification, feature walkthroughs, accessibility checks |
| [**@Onboarding**][agent-onboarding]      | Project orientation      | ❌ Read-only | ❌ No      | First day on project, exploring conventions, understanding tooling       |
| [**@socratic-mentor**][agent-socratic]   | Pedagogical tutoring     | ❌ Read-only | ❌ No      | Learning concepts, debugging with understanding, mentoring juniors       |
| **@agentic-workflows**                   | Workflow management      | ❌ Read-only | ❌ No      | Create, debug, and upgrade GitHub Agentic Workflows (gh-aw)              |

> **Auto-Infer:** When `✅ Yes`, Copilot can auto-select this agent based on task context. When `❌ No`, you must explicitly select the agent.

> 📖 **Official Docs:** [VS Code Custom Agents][vscode-agents] · [GitHub Custom Agents][github-agents] · [Customization Cheat Sheet][copilot-cheat-sheet]

## 🎯 What & Why

Custom agents are specialized AI personas in [`.github/agents/*.agent.md`][agent-files]. Each has a focused role, minimal tools, and defined handoffs.

**Scope:** `.github/agents/` covers the repository. For org/enterprise-wide agents, place them in `agents/` within a `.github-private` repo. Agents can also be defined at the user profile level.

**Why separate agents?**

- **Focus** – Each agent excels at one task type
- **Safety** – Read-only agents can't accidentally modify code
- **Least privilege** – Fewer tools = smaller attack surface, faster responses, less context usage

> **Complementary enforcement:** Agent tool restrictions define _which_ tools an agent can use. [Hooks](./HOOKS.md) provide programmatic policy enforcement during execution — blocking edits to protected files, denying dangerous commands, and automating side effects like formatting. Together they form a defense-in-depth approach.

## 🌐 Agent Environments

VS Code supports four main categories of agents, each designed for different use cases and levels of interaction. Custom agents (defined in `.agent.md` files) can be used with local, background, and cloud agents to apply the same role or persona across environments.

> 📖 **Official Docs:** [Agents Overview][vscode-agents-overview]

| Type                                       | Environment             | Interaction      | Best For                                                           |
| ------------------------------------------ | ----------------------- | ---------------- | ------------------------------------------------------------------ |
| [**Local**][vscode-local-agents]           | VS Code on your machine | Interactive chat | Real-time feedback, brainstorming, tasks needing VS Code tools/MCP |
| [**Background**][vscode-background-agents] | CLI on your machine     | Autonomous       | Well-defined tasks, isolated work via Git worktrees                |
| [**Cloud**][vscode-cloud-agents]           | Remote infrastructure   | Autonomous       | Team collaboration via PRs, GitHub integration                     |
| **Third-party**                            | External providers      | Varies           | OpenAI Codex, other AI agents in your workflow                     |

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
@Specify (Plan)         →  Save plan to /memories/session/plan.md
       ↓ (new chat)
@Implement (Build)      →  Read plan file → implement → Completion Protocol
       ↓
@Test Unit              →  "Add E2E Tests"
       ↓
@Test E2E               →  "Validate Complete"
       ↓
@Specify (Validate)     →  Ready for merge

— Training Workflow (for newcomers) —

@Onboarding (Explore)   →  Understand project structure and conventions
       ↓
@socratic-mentor        →  Build conceptual understanding
       ↓
@Specify (Plan)         →  Enter production workflow with solid foundation
```

Each arrow is a **handoff**—you review before the next agent begins.

### RPI Workflow

This flow maps directly to the **Research → Plan → Implement (RPI)** workflow pattern:

| RPI Phase     | Agent(s)                   | What Happens                                                   |
| ------------- | -------------------------- | -------------------------------------------------------------- |
| **Research**  | `@Specify & Validate`      | Reads Jira/Figma/codebase; understands context and constraints |
| **Plan**      | `@Specify & Validate`      | Synthesizes findings into a structured `plan.md`               |
| **Implement** | `@Implement`               | Reads plan; writes code step by step                           |
| **Evaluate**  | `@Test Unit` + `@Test E2E` | Validates correctness; loops back to @Implement if needed      |
| **Validate**  | `@Specify & Validate`      | Confirms implementation matches the plan's acceptance criteria |

`@Specify` handles both the Research and Plan phases in a single session. Separating them from the Implement phase is what makes the handoff effective: the planning session exhausts its research budget so that `@Implement` can start fresh with a full context window.

> 📖 **Why this works:** See [Context Optimization – Plan-Based Handoff][context-optimization] for the token budget analysis.

> **Generator-Evaluator mapping:** The Planner/Generator/Evaluator roles in this table map directly onto the Generator-Evaluator architectural pattern. See [Architectural Patterns → Generator-Evaluator](#generator-evaluator-pattern).

### Plan-Based Handoff

Plans are persisted to `/memories/session/plan.md` so @Implement can start in a **new chat session** with a clean context window. This prevents context overflow from the planning phase consuming tokens needed for implementation.

**Workflow:**

1. `@specify plan TASK-123` → researches, plans, saves to `/memories/session/plan.md`
2. Open **new chat** → `@implement Read #file:/memories/session/plan.md and implement step by step`
3. @Implement updates plan checkboxes as it works
4. **Completion Protocol** runs: documentation impact check, cleanup

> 📖 **Details:** [Context Optimization – Plan-Based Handoff][context-optimization]

### Documentation Impact Assessment

Every plan includes a "Documentation Impact Assessment" section. @Implement checks this after completing all implementation steps and updates:

| Target                  | What to Check                               |
| ----------------------- | ------------------------------------------- |
| `.github/instructions/` | Are coding patterns still accurate?         |
| `.github/skills/`       | Do skills reflect new capabilities?         |
| `.github/agents/`       | Do agent definitions need updating?         |
| `docs/`                 | Architecture docs, guides, READMEs current? |
| API / README            | Endpoints, data models, commands correct?   |

This ensures that features, bug fixes, library updates, and refactors don't silently invalidate project documentation.

## �️ Architectural Patterns

The agent workflow implements several architectural patterns drawn from multi-agent system research. Understanding these helps when extending the system or debugging workflow failures.

### Generator-Evaluator Pattern

Inspired by GAN (Generative Adversarial Network) architectures, the **Generator-Evaluator pattern** separates the agent that creates output from the agent(s) that judge it — preventing the generator from also grading its own work.

| Role          | Agent(s)                           | Responsibility                                          |
| ------------- | ---------------------------------- | ------------------------------------------------------- |
| **Planner**   | `@Specify & Validate`              | Defines what success looks like via the Sprint Contract |
| **Generator** | `@Implement`                       | Produces code to meet the specification                 |
| **Evaluator** | `@Test Unit` + `@Test E2E`         | Validates correctness against acceptance criteria       |
| **Judge**     | `@Specify & Validate` (re-invoked) | Confirms implementation matches the original intent     |

**Current gap:** The test agents validate functional correctness but not quality criteria such as design cohesion, naming conventions, or architectural fit. These are currently reviewed during the final `@Specify & Validate` step rather than by a dedicated evaluator agent.

> 📖 **Related:** [RPI Workflow](#rpi-workflow) — the RPI phases map directly onto these Generator-Evaluator roles.

### Sprint Contracts

A **Sprint Contract** is a formal "Definition of Done" that `@Specify` negotiates with the developer before implementation begins. It makes acceptance criteria explicit, testable, and gradable — bridging the gap between a high-level specification and verifiable code.

Sprint Contracts are embedded in every `plan.md` as a **Done Criteria** section:

| Element                 | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| **Acceptance Criteria** | Numbered, testable conditions the implementation must satisfy     |
| **Test Strategy**       | Which test types cover which criteria (unit / E2E / manual)       |
| **Done Definition**     | The explicit bar for "this is complete"                           |
| **Quality Metrics**     | Non-functional criteria (performance, a11y, convention adherence) |

The Sprint Contract is what `@Test Unit` and `@Test E2E` test against. When `@Specify & Validate` runs its validation pass, it checks the implementation against the Sprint Contract rather than re-interpreting the original Jira ticket.

> 📖 **Implementation:** The plan template in [`.github/agents/specify.agent.md`][agent-specify] includes a Sprint Contract section.

### Independent Review Protocol

When `@Test Unit` reports failures, the default flow is to hand back to `@Implement` to fix them. Research on multi-agent systems suggests a more reliable alternative for persistent failures: route the fix to a **fresh `@Implement` session** rather than the one that wrote the original code.

| Aspect                  | Standard Fix Flow            | Independent Review               |
| ----------------------- | ---------------------------- | -------------------------------- |
| **Who fixes**           | Same @Implement session      | New @Implement session           |
| **Context**             | Carries original assumptions | Starts from failing test output  |
| **Error reinforcement** | Can repeat the same mistakes | Fresh perspective on the failure |
| **Overhead**            | Low — continue in same chat  | Medium — pass test report across |

**Current recommendation:** The standard handoff back to `@Implement` is sufficient for most failures. Adopt the Independent Review Protocol when:

- The same test has failed more than twice on the same logic
- The failing code was written in a long session where context drift is likely
- Fixing it requires rethinking the original approach rather than patching a typo

> ⚠️ **Trade-off:** Independent review adds orchestration overhead. Reserve it for cases where the standard loop has already failed twice.

### Hierarchical Agents

The agent system follows a **three-tier hierarchy** that mirrors how effective software teams are organized. Each tier has a different time-horizon, responsibility scope, and level of autonomy.

```
┌─────────────────────────────────────────────────────┐
│  High-Level (Executive)    @Specify & Validate       │
│  → Defines WHAT; sets constraints; owns the plan     │
├─────────────────────────────────────────────────────┤
│  Mid-Level (Manager)       @Implement                │
│  → Determines HOW; decomposes steps; writes code     │
├─────────────────────────────────────────────────────┤
│  Low-Level (Specialists)   @Test Unit · @Test E2E    │
│  → Executes specific subtasks; reports pass/fail     │
└─────────────────────────────────────────────────────┘
```

| Tier           | Agent(s)                  | Scope           | Output                         |
| -------------- | ------------------------- | --------------- | ------------------------------ |
| **High-Level** | `@Specify & Validate`     | Feature / Epic  | `plan.md` with Sprint Contract |
| **Mid-Level**  | `@Implement`              | Step / Task     | Working code per plan step     |
| **Low-Level**  | `@Test Unit`, `@Test E2E` | Function / Flow | Test results; pass/fail report |

#### Contextual Packets

`@Specify` prunes global context down to a focused **Contextual Packet** before handing off to `@Implement`. The `plan.md` file is this packet: it contains only the decisions, files, and steps relevant to the current task — not the full Jira ticket, Figma design, or research thread.

This prevents two known failure modes:

- **Context Dilution** — the model attends to irrelevant background information and produces off-target outputs
- **Lost-in-the-Middle** — critical instructions buried in a long context receive less attention than instructions near the beginning or end

> 📖 **Details:** [Context Optimization – Contextual Packets][context-optimization]

#### Tool Saturation Risk

**Tool Saturation** occurs when an agent is granted more tools than its task requires. Each extra tool:

- Consumes context tokens (tool definitions are large)
- Expands the attack surface
- Increases the chance of a mistaken or unintended tool call

The current agent tool assignments are deliberately minimal. See [Tool Selection](#️-tool-selection) for the guidance and [OWASP Agentic AI Threats][security] for the security framing.

#### Known Limitations

| Risk                          | Description                                                       | Mitigation                                              |
| ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| **Task Decomposition Errors** | Errors in `@Specify`'s plan cascade to all downstream agents      | Human review at the handoff gate before @Implement runs |
| **Telephone Game Effect**     | Nuance in the original requirement degrades across each tier      | Sprint Contract makes acceptance criteria explicit      |
| **Tier Boundary Violations**  | @Implement making architectural decisions that belong to @Specify | `@Implement` instruction: "escalate ambiguities up"     |

## 🧪 Feature Tester Agent

The `@Feature Tester` is a browser-based exploratory testing agent that navigates the running app, interacts with features, and produces structured test reports — all from natural language prompts. It does **not write code**; it acts as a read-only QA agent.

**Two complementary tool backends:**

| Backend | Tools | Setup | Best For |
|---------|-------|-------|----------|
| **Chrome DevTools MCP** | `chrome-devtools/*` (42 tools) | MCP server config + `npx chrome-devtools-mcp@latest` | Network inspection, performance traces, Lighthouse audits, console debugging, memory profiling |
| **VS Code Built-in Browser Tools** | `openBrowserPage`, `screenshotPage`, `clickElement`, `typeInPage`, `runPlaywrightCode`, etc. | Enable `workbench.browser.enableChatTools` setting | Zero-setup UI verification, quick visual checks, form testing, custom Playwright automation |

**Depth Levels:** The agent supports four analysis depths that can be combined:

- **User** — Visual verification, screenshots, plain-language findings
- **Developer** — API calls, console errors, network requests, component identification
- **QA** — Accessibility, responsive layout, edge cases, error boundaries
- **Performance** — Lighthouse audit, performance trace, Core Web Vitals (Chrome DevTools MCP only)

**Example prompts:**
```
@Feature Tester Go to the app and check every page for visual issues
@Feature Tester Create a task, verify it saved, then delete it
@Feature Tester Check keyboard accessibility on the task list at QA depth
@Feature Tester Something feels slow on My Tasks — investigate at Performance depth
```

> 📖 **Agent file:** [`.github/agents/feature-tester.agent.md`][agent-feature-tester]
> 📖 **MCP setup:** [MCP Integrations – Chrome DevTools][mcp]
> 📖 **Built-in tools:** Requires VS Code 1.101+ with `workbench.browser.enableChatTools` enabled

## 🎓 Training Agents

In addition to the 5 production agents, this project includes **2 training agents** and **1 workflow agent** designed for specific purposes. Training agents differ fundamentally from production agents:

| Aspect              | Training Agents                                                                      | Production Agents                                                |
| ------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Purpose**         | Build understanding                                                                  | Build software                                                   |
| **Tools**           | Read-only (`read`, `search`, `agent`, `web`, `vscode/askQuestions`, `vscode/memory`) | Role-specific tools (some read-only, some with `edit`/`execute`) |
| **Output**          | Explanations, questions, guidance                                                    | Code, tests, plans                                               |
| **Code generation** | Never                                                                                | Varies by agent (many generate code; some are read-only)         |

### @Onboarding

Project orientation guide for newcomers. Walks through project structure, explains conventions, and helps developers pick their first task. Uses three modes: Project Tour, Convention Explorer, and First Task Guide.

- **Model:** Sonnet (balanced — exploration/explanation)
- **Handoffs:** → `@socratic-mentor`, → `@Specify & Validate`

### @socratic-mentor

Pedagogical tutor using Socratic questioning. Never provides direct code answers. Uses prediction-first gates, the Five Whys technique, and comprehension validation to build deep understanding.

- **Model:** Opus (premium — reasoning-heavy pedagogical questioning)
- **Handoffs:** → `@Specify & Validate`, → `@Implement` (only after comprehension validated)

> 📖 **Details:** [AI Skill Levels & Training][skill-levels]

## ⚙️ Model Selection

Choose the model that fits your task—don't default to the most powerful option.

| When You Need                          | Choose               | Examples                                    |
| -------------------------------------- | -------------------- | ------------------------------------------- |
| Deep reasoning, architecture decisions | High-reasoning model | System design, complex refactors            |
| Precise code generation                | Balanced model       | Feature implementation, bug fixes           |
| Large codebase analysis                | High-context model   | Cross-file refactoring, dependency analysis |
| Fast iteration, debugging              | Low-latency model    | Quick fixes, syntax help                    |
| Batch/bulk operations                  | Cost-efficient model | Documentation, repetitive tasks             |

**Decision factors:**

1. **Complexity** – More reasoning needed → higher-capability model
2. **Context size** – Large codebases → high-context model
3. **Speed** – Interactive work → low-latency model
4. **Cost** – Routine tasks → efficient model

> 💡 **Tip:** Start with a balanced model. Upgrade if you hit reasoning limits; downgrade for routine work.

## 🛠️ Tool Selection

**The fewer tools, the better.** Each tool you grant an agent increases risk, slows responses, and uses more context. This principle is also called **Tool Specialization** in multi-agent system research: each agent receives only the minimal toolset required for its specific role, reducing both attack surface and Tool Saturation risk (see [Hierarchical Agents – Tool Saturation Risk](#tool-saturation-risk)).

| Principle                | Why                                                                           |
| ------------------------ | ----------------------------------------------------------------------------- |
| **Least privilege**      | Grant only what's needed for the specific task                                |
| **Read-only by default** | Planning agents should never need `edit` or `execute`                         |
| **Scope MCP tools**      | Use `server/specific-tool` not `server/*` when possible                       |
| **Audit periodically**   | Remove tools that aren't being used                                           |
| **One role, one set**    | Sub-agents get their own constrained toolset, not the parent agent's full set |

> 🔒 **Security framing:** Overly broad tool grants correspond to OWASP Agentic AI Threat #2 (Tool Misuse) and #3 (Identity & Privilege Abuse). See [SECURITY.md][security] for the full threat mapping.

**Common Tool Categories:**

| Category         | When to Include                                           |
| ---------------- | --------------------------------------------------------- |
| `read`, `search` | Almost always—safe information gathering                  |
| `edit`           | Only for agents that modify code                          |
| `execute`        | Only for agents that run commands/tests                   |
| `web`            | Only if external research is needed                       |
| `agent`          | Only if handoffs to other agents are required             |
| MCP tools        | Only the specific integrations needed (Jira, Figma, etc.) |

## 📝 Creating New Agents

Add a file to `.github/agents/`:

### Complete Example

```yaml
---
name: 'Review'
description: 'Code review agent that analyzes PRs for quality, conventions, and potential issues.'
tools: ['read', 'search']  # Read-only: no edit, no execute
model: Claude Sonnet 4.6
infer: true  # Allow auto-selection for review tasks
handoffs:
  - label: "Request Changes"
    agent: Implement
    send: false
---

# Reviewer – Code Quality Specialist with skill (see skills reference later)

You analyze code changes for quality issues, convention violations, and potential bugs. You automatically benefit from relevant [**skills**](./SKILLS.md) like `code-documentation` to understand project standards.

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

| Property          | Required | Description                                                                                                                  |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `name`            | ✅       | Display name in VS Code                                                                                                      |
| `description`     | ✅       | One-line role summary                                                                                                        |
| `tools`           | ✅       | Array of allowed tools (keep minimal!)                                                                                       |
| `model`           | ❌       | Suggested model (user can override)                                                                                          |
| `infer`           | ❌       | Allow Copilot to auto-select this agent (default: true). Set `false` for specialized agents that require explicit invocation |
| `handoffs`        | ❌       | Agents this can hand off to                                                                                                  |
| `handoffs[].send` | ❌       | Auto-submit handoff (default: false)                                                                                         |

> 📖 **Full spec:** [Agent Configuration Reference][agent-config-ref]

## 🎓 Skills Reference

Skills are folders of instructions, scripts, and resources that Copilot loads on-demand. This project uses **11 skills** covering frontend, backend, testing, and documentation patterns.

> 📖 **Full guide:** [SKILLS.md][skills] — Skill format, creating new skills, progressive disclosure, and this project's complete skill inventory.

## 🔗 Related

- [Agentic Workflows & CI][agentic-workflows] – Server-side AI workflows and CI pipeline
- [Agents Overview][vscode-agents-overview] – VS Code agent types and environments
- [Custom Prompts][custom-prompts] – Reusable task templates
- [Agent Skills][skills] – On-demand knowledge modules
- [Custom Instructions][custom-instructions] – Instruction hierarchy
- [Context Optimization][context-optimization] – Plan-based handoff and Structured Autonomy
- [MCP Integrations][mcp] – External tool connections
- [Hooks][hooks] – Agent session lifecycle automation
- [Developer Responsibilities][responsibilities] – Agent accountability and workflows
- [Security Guide][security] – Agent security constraints and MCP risks
- [Skill Levels & Training][skill-levels] – Adapting AI development to different skill levels

<!-- Agent Files -->

[agent-specify]: ../.github/agents/specify.agent.md
[agent-implement]: ../.github/agents/implement.agent.md
[agent-test-unit]: ../.github/agents/test-unit.agent.md
[agent-test-e2e]: ../.github/agents/test-e2e.agent.md
[agent-feature-tester]: ../.github/agents/feature-tester.agent.md
[agent-onboarding]: ../.github/agents/onboarding.agent.md
[agent-socratic]: ../.github/agents/socratic-mentor.agent.md
[agent-files]: ../.github/agents/

<!-- Project Documentation -->

[agentic-workflows]: ./AGENTIC_WORKFLOWS.md
[skills]: ./SKILLS.md
[hooks]: ./HOOKS.md
[custom-prompts]: ./CUSTOM_PROMPTS.md
[custom-instructions]: ./CUSTOM_INSTRUCTIONS.md
[context-optimization]: ./CONTEXT_OPTIMIZATION.md
[skill-levels]: ./AI_SKILL_LEVELS.md
[mcp]: ./MCP.md
[responsibilities]: ./RESPONSIBILITIES.md
[security]: ./SECURITY.md

<!-- GitHub Copilot Documentation -->

[vscode-agents]: https://code.visualstudio.com/docs/copilot/customization/custom-agents
[vscode-agents-overview]: https://code.visualstudio.com/docs/copilot/agents/overview
[vscode-local-agents]: https://code.visualstudio.com/docs/copilot/chat/copilot-chat
[vscode-background-agents]: https://code.visualstudio.com/docs/copilot/agents/background-agents
[vscode-cloud-agents]: https://code.visualstudio.com/docs/copilot/agents/cloud-agents
[github-agents]: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents
[agent-config-ref]: https://docs.github.com/en/copilot/reference/custom-agents-configuration
[copilot-cheat-sheet]: https://docs.github.com/en/copilot/reference/customization-cheat-sheet
