# 🤖 AI-Assisted Development Guide

> **Reference implementation: How to structure AI-assisted development with GitHub Copilot's multi-agent system, skills, custom instructions, and Model Context Protocol.**

This is a **showcase project** demonstrating best practices for using GitHub Copilot to orchestrate the full software development lifecycle through specialized agents, enforced conventions, and secure integrations.

## 🚨 Developer Responsibilities

> **AI is a co-pilot, not an autopilot.** You are responsible for code quality, security, and compliance.

### Your Accountability

|     | Responsibility | Action                                                      |
| --- | -------------- | ----------------------------------------------------------- |
| 👁️  | **Review**     | Read and understand all AI-generated code before committing |
| ✅  | **Validate**   | Check against requirements and project standards            |
| 🧪  | **Test**       | Run full test suite before merging                          |
| 🔒  | **Security**   | Verify auth, credentials, and data handling                 |
| 💡  | **Understand** | Know what changed and why it changed                        |

📖 **[Read the full guide →][responsibilities]** – detailed checklists, incident response, and MCP security

## Quick Start

- **New here?** Start with [What is AI-Assisted Development?][what-is-ai]
- **Know what you need?** Use the [Feature Index][feature-index]
- **Ready to use agents?** Jump to [The Multi-Agent System][multi-agent]
- **Want detailed guides?** See [Documentation by Topic][doc-by-topic]

## Feature Index

Quick lookup for all Copilot customization features:

| Feature                 | Purpose                                  | File Type              | Documentation                                   |
| ----------------------- | ---------------------------------------- | ---------------------- | ----------------------------------------------- |
| **Smart Actions**       | Built-in IDE commands (no setup needed)  | N/A                    | [VS Code Copilot][copilot-smart-actions]        |
| **Agent Environments**  | Local, background, and cloud agent types | N/A                    | [Agents Overview][vscode-agents-overview]       |
| **Custom Prompts**      | Reusable task templates                  | `.prompt.md`           | [CUSTOM_PROMPTS.md][custom-prompts]             |
| **Custom Instructions** | Coding standards & conventions           | `.instructions.md`     | [CUSTOM_INSTRUCTIONS.md][custom-instructions]   |
| **Custom Agents**       | Specialized AI personas with roles       | `.agent.md`            | [CUSTOM_AGENTS.md][custom-agents]               |
| **Subagents**           | Delegated subtasks in isolated context   | N/A (runtime)          | [CONTEXT_OPTIMIZATION.md][context-optimization] |
| **Skills**              | On-demand knowledge modules              | `SKILL.md`             | [SKILLS.md][skills]                             |
| **Hooks**               | Agent session lifecycle automation       | `.github/hooks/*.json` | [HOOKS.md][hooks]                               |
| **MCP**                 | External tool connections                | `mcp.json`             | [MCP.md][mcp]                                   |

**Learning path:** Smart Actions → Prompts → Instructions → Agents → Hooks → MCP

> 📖 **Official comparison:** [Customization Cheat Sheet][copilot-cheat-sheet] — compare all features, usage scenarios, and IDE support in one place.

## Built-in Smart Actions

GitHub Copilot includes many built-in features that work out of the box—code generation, fixing errors, understanding code, version control assistance, and more. Rather than duplicating documentation here, see the official resources for the most current information:

- **[VS Code Copilot Overview][vscode-copilot-docs]** – Core features and capabilities
- **[Smart Actions][copilot-smart-actions]** – Built-in AI-powered editor actions
- **[Copilot Chat][copilot-chat-features]** – Natural language chat interface

## What is AI-Assisted Development?

AI-assisted development is a **paradigm shift** in how teams build software with AI. Instead of treating AI as autocomplete, you orchestrate **specialized agents** with defined roles, constrained capabilities, and human oversight.

### The Key Insight

| Aspect       | General AI                | Specialized Agents                     |
| ------------ | ------------------------- | -------------------------------------- |
| **Approach** | Autocomplete mindset      | Orchestrated agents with defined roles |
| **Output**   | Generic suggestions       | Follow project conventions             |
| **Process**  | Manual filtering required | Human review at handoff points         |
| **Results**  | Inconsistent              | Consistent, testable                   |

**What this means for your team:**

- ✅ **Consistency** – Agents follow the same rules every time
- ✅ **Focus** – Each agent has one responsibility
- ✅ **Safety** – Humans remain in command
- ✅ **Productivity** – Developers focus on problem-solving
- ✅ **Traceability** – Clear audit trail of who did what

## Harness Engineering

The `.github/` directory is more than configuration — it is a **deliberate harness** that shapes how AI agents behave, what they can access, and how they collaborate across every session.

> **Harness Engineering:** Designing and maintaining the system of instructions, agent definitions, tool constraints, and workflows that make AI agents reliably useful in your specific codebase.

Each layer of the harness plays a defined role:

| Component             | Location                | Role                                                     |
| --------------------- | ----------------------- | -------------------------------------------------------- |
| **Global Rules**      | `AGENTS.md`             | Baseline conventions applied across all tools and agents |
| **Instructions**      | `.github/instructions/` | Path-scoped coding standards and domain patterns         |
| **Agent Definitions** | `.github/agents/`       | Personas, role boundaries, and tool constraints          |
| **Skills**            | `.github/skills/`       | On-demand knowledge modules loaded when relevant         |
| **Hooks**             | `.github/hooks/`        | Session lifecycle automation (safety guards, formatting) |
| **Workflows**         | `.github/workflows/`    | CI and agentic pipeline automation                       |

The harness evolves continuously: when agents produce incorrect outputs or violate conventions, the harness is updated rather than just re-prompting. This creates a **continuous improvement loop** where observed failures feed back into better constraints.

> **Tool-agnostic:** Depending on your stack, the harness may live elsewhere. A custom agent framework might define agents in `agent.yaml`, an MCP server config, or a platform-specific folder — the concept is the same regardless of tooling.

📖 **Components:** [CUSTOM_INSTRUCTIONS.md][custom-instructions] · [CUSTOM_AGENTS.md][custom-agents] · [SKILLS.md][skills-reference] · [HOOKS.md][hooks] · [AGENTIC_WORKFLOWS.md][agentic-workflows]

### Context Engineering

**Context Engineering** is the practice of deliberately controlling what information the model receives — which instructions load, when skills activate, and how much codebase context flows into each session.

> Context engineering is not just about fitting within token limits. It's about ensuring the model receives the _right_ information at the _right_ time to produce reliable, convention-following outputs.

Key practices in this project:

| Practice             | Mechanism                                                     | Docs                                            |
| -------------------- | ------------------------------------------------------------- | ----------------------------------------------- |
| Minimal instructions | Each instruction solves one problem; no global noise          | [CUSTOM_INSTRUCTIONS.md][custom-instructions]   |
| Skills on demand     | Loaded only when the agent invokes them                       | [SKILLS.md][skills-reference]                   |
| Subagent isolation   | Research runs in a separate context; only the summary returns | [CONTEXT_OPTIMIZATION.md][context-optimization] |
| Plan-based handoff   | Planning sessions never bleed into implementation             | [CONTEXT_OPTIMIZATION.md][context-optimization] |

📖 **Details:** [Context Optimization][context-optimization]

## The Multi-Agent System

This project uses **7 agents** (4 production + 2 training + 1 workflow) with defined roles and constrained tool access. See the [README][readme-agents] for the full agent table.

**New to this project?** Start with `@Onboarding` to understand the codebase, then use `@socratic-mentor` to build mental models before diving in. See the [Skill Levels Guide][skill-levels] for guidance tailored to your experience level.

**Typical Production Flow:** `@Specify` → `@Implement` → `@Test Unit` → `@Test E2E` → `@Specify` (validate)

**Training Flow:** `@Onboarding` → `@socratic-mentor` → production agents

### Agent Environments

VS Code supports different agent environments. Your custom agents (`.agent.md` files) can be used across all of them:

| Type                                       | Description                  | Best For                                                   |
| ------------------------------------------ | ---------------------------- | ---------------------------------------------------------- |
| [**Local**][vscode-local-agents]           | Interactive chat in VS Code  | Real-time feedback, planning, tasks needing MCP/extensions |
| [**Background**][vscode-background-agents] | Autonomous CLI-based agents  | Well-defined tasks, isolated via Git worktrees             |
| [**Cloud**][vscode-cloud-agents]           | Remote execution with GitHub | Team collaboration via PRs, code reviews                   |

> 📖 **Learn more:** [Agents Overview][vscode-agents-overview] · [CUSTOM_AGENTS.md][custom-agents]

### Key Principle: Human in Command

> **AI is a co-pilot, not an autopilot.**

- Agents confirm before major actions
- Handoffs require human approval
- Critical changes need explicit consent

See [Developer Responsibilities][responsibilities] for detailed accountability and code review practices.

## Documentation by Topic

Pick a topic below to get started. Each guide includes real examples from this project.

| Topic                                                 | Best For                                                                                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [🌐 **Agents Overview**][vscode-agents-overview]      | Understanding agent environments (local, background, cloud), session management, and handoffs between agent types            |
| [🤖 **Agents**][custom-agents]                        | Understanding agent roles and responsibilities, model selection, tool constraints, and how each agent works in your workflow |
| [📋 **Custom Instructions**][custom-instructions]     | Learning the instruction hierarchy and best practices for encoding project conventions, coding standards, and patterns       |
| [🎯 **Custom Prompts**][custom-prompts]               | Creating reusable prompt templates for recurring tasks, automating workflows, and triggering specific agent behaviors        |
| [🎓 **Agent Skills**][skills]                         | On-demand knowledge modules, creating skills, progressive disclosure, and skill inventory                                    |
| [🔌 **MCP Integrations**][mcp]                        | Connecting external services, APIs, databases, and specialized tools to extend agent capabilities                            |
| [👤 **Developer Responsibilities**][responsibilities] | Understanding your accountability, code review practices, AI-assisted workflows, and decision-making frameworks              |
| [🔒 **Security Guide**][security]                     | MCP security risks, data privacy, incident response procedures, pre-deployment checklists, and vulnerability prevention      |
| [🎓 **Skill Levels & Training**][skill-levels]        | Adapting AI-assisted development to different skill levels, training agents, dos/don'ts, and AI-native metrics               |
| [⚡ **Context Optimization**][context-optimization]   | Maximizing efficiency with large codebases, optimizing token usage, and advanced patterns for scaling                        |
| [⚙️ **Hooks**][hooks]                                 | Automating agent behavior with pre/post tool checks, safety guards, and formatting                                           |
| [🔄 **Agentic Workflows & CI**][agentic-workflows]    | Server-side AI workflows (docs, code quality, security) and CI pipeline configuration                                        |

## When to Use What?

Choose the right tool for your needs:

| Need                                                | Solution                                          | File                                     |
| --------------------------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| 🌍 Rules that apply **everywhere**                  | [Global Instructions][when-global-instructions]   | `AGENTS.md` (root)                       |
| 📋 Rules for **specific file types** or **folders** | [Path-Specific Instructions][custom-instructions] | `.github/instructions/*.instructions.md` |
| 🤖 A **different persona/permissions**              | [Custom Agent][custom-agents]                     | `.github/agents/*.agent.md`              |
| 🛠️ **Complex procedures/scripts**                   | [Agent Skill][skills]                             | `.github/skills/*/SKILL.md`              |
| 🎯 **Reusable task templates**                      | [Custom Prompts][custom-prompts]                  | `.github/prompts/*.prompt.md`            |
| ⚙️ **Automated checks during agent sessions**       | [Hooks][hooks]                                    | `.github/hooks/*.json`                   |

> 📖 **Official reference:** [Customization Cheat Sheet][copilot-cheat-sheet] — full comparison including subagents and IDE/surface support matrix.

## Project Structure

```
.github/
├── agents/                              # 🤖 7 agent definitions (4 production + 2 training + 1 workflow)
├── hooks/                               # ⚙️ Agent session hooks (safety guard, auto-formatter)
├── instructions/                        # 📋 9 path-specific instruction files
├── prompts/                             # 🎯 10 reusable prompt templates
└── skills/                              # ⚡ 11 specialized knowledge modules

AGENTS.md                                    # 🌍 Global rules (cross-tool compatible)

docs/
├── AI_DEVELOPMENT_GUIDE.md              # ← You are here (high-level overview)
├── CUSTOM_AGENTS.md                     # 🤖 Agent definitions
├── SKILLS.md                            # 🎓 Agent skills guide
├── CUSTOM_INSTRUCTIONS.md               # 📋 Instruction hierarchy & best practices
├── CUSTOM_PROMPTS.md                    # 🎯 Reusable prompt templates
├── MCP.md                               # 🔌 Model Context Protocol guide
├── RESPONSIBILITIES.md                  # 👤 Developer accountability & AI workflows
├── SECURITY.md                          # 🔒 Security safeguards & best practices
├── HOOKS.md                             # ⚙️ Agent session hooks guide
├── CONTEXT_OPTIMIZATION.md              # ⚡ Advanced: context optimization
└── GIT_WORKTREES.md                     # 🌳 Advanced: parallel development
```

## Key Principles

> Core values that guide AI-assisted development in this project.

|     | Principle                         | Description                                             |
| --- | --------------------------------- | ------------------------------------------------------- |
| 🎯  | **Separation of Concerns**        | Each agent has one, clearly defined job                 |
| 📋  | **Convention Over Configuration** | Standards are encoded in instructions, not config files |
| 📦  | **Progressive Disclosure**        | Skills load on-demand, not all at once                  |
| 👤  | **Human Remains in Control**      | Developers make final decisions;                        |
| 📝  | **Auditable Workflow**            | Clear record of what each agent did and why             |

## Research & Evidence

The patterns in this project are informed by empirical research on AI-assisted software development. Key findings that shaped design decisions:

- **Collaboration decline (Harvard/MIT 2026):** Developers using AI tools saw +12.4% more coding time but −80% fewer peer collaboration events. The plan-based workflow and required human peer reviews are direct mitigations. → [RESPONSIBILITIES.md – AI and Team Collaboration][responsibilities]
- **Trust-to-Toil paradox (2026):** 96% of developers distrust AI code, yet 38% find reviewing it harder than human-written code. Reviewing a plan before code is written reduces this toil. → [RESPONSIBILITIES.md – Trust-to-Toil Ratio][responsibilities]
- **Skill decay is context-dependent:** AI accelerates learning in new domains but inhibits maintenance of core competencies. The `@socratic-mentor` agent operationalizes the mitigation. → [AI Skill Levels – Skill Decay vs. Formation][skill-levels]
- **Context window limits degrade output quality (Context Anxiety):** Models exhibit measurable output degradation as context fills. Session-separated planning and implementation is the structural fix. → [Context Optimization][context-optimization]
- **Hierarchical agent systems have known failure modes:** Task Decomposition errors cascade and the Telephone Game effect degrades requirements fidelity. Sprint Contracts and human review gates mitigate both. → [CUSTOM_AGENTS.md – Hierarchical Agents][custom-agents]

## Model Selection

> Match model capabilities to task complexity—don't default to the most powerful option.

| Task Type                           | Recommended Model                      | Why                                    |
| ----------------------------------- | -------------------------------------- | -------------------------------------- |
| 🏗️ **Architecture & System Design** | High-reasoning (e.g., GPT-5.2)         | Complex logic, bottleneck analysis     |
| 🔧 **Production Refactoring**       | High-precision (e.g., Claude Opus 4.5) | Strict convention adherence            |
| 📚 **Large Codebase Analysis**      | High-context (e.g., Gemini 3 Pro)      | 1M token window for full-repo analysis |
| 📝 **Bulk/Routine Tasks**           | Cost-efficient model                   | Documentation, repetitive work         |

### Decision Framework

Optimize across four dimensions:

| Factor              | More → Better                        | Application                   |
| ------------------- | ------------------------------------ | ----------------------------- |
| 🧠 **Complexity**   | Reasoning → higher-capability model  | Architecture, design patterns |
| 📦 **Context Size** | Large codebase → high-context model  | Full-repo analysis            |
| ⚡ **Speed**        | Interactive work → low-latency model | Documentation                 |
| 💰 **Cost**         | Routine tasks → efficient model      | Repetitive, bulk work         |

> 💡 **Tip:** Start with a balanced model. Upgrade for reasoning limits; downgrade for routine work.

---

<!-- Internal Documentation -->

[ai-guide]: #what-is-ai-assisted-development
[feature-index]: #feature-index
[multi-agent]: #the-multi-agent-system
[doc-by-topic]: #documentation-by-topic
[what-is-ai]: #what-is-ai-assisted-development
[readme-agents]: ../README.md

<!-- Documentation Files -->

[skill-levels]: ./AI_SKILL_LEVELS.md
[custom-agents]: ./CUSTOM_AGENTS.md
[custom-instructions]: ./CUSTOM_INSTRUCTIONS.md
[custom-prompts]: ./CUSTOM_PROMPTS.md
[mcp]: ./MCP.md
[responsibilities]: ./RESPONSIBILITIES.md
[security]: ./SECURITY.md
[hooks]: ./HOOKS.md
[agentic-workflows]: ./AGENTIC_WORKFLOWS.md
[context-optimization]: ./CONTEXT_OPTIMIZATION.md
[git-worktrees]: ./GIT_WORKTREES.md

<!-- Anchor Links -->

[skills-reference]: ./SKILLS.md
[skills]: ./SKILLS.md
[built-in-smart-actions]: #built-in-smart-actions
[when-global-instructions]: ../AGENTS.md

<!-- GitHub Copilot Documentation -->

[copilot-what-is]: https://docs.github.com/en/copilot/get-started/what-is-github-copilot
[copilot-cheat-sheet]: https://docs.github.com/en/copilot/reference/customization-cheat-sheet
[copilot-custom-instructions]: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
[copilot-response-customization]: https://docs.github.com/en/copilot/concepts/prompting/response-customization
[copilot-smart-actions]: https://code.visualstudio.com/docs/copilot/copilot-smart-actions
[copilot-chat-features]: https://code.visualstudio.com/docs/copilot/chat/copilot-chat
[vscode-copilot-docs]: https://code.visualstudio.com/docs/copilot/overview
[vscode-agents-overview]: https://code.visualstudio.com/docs/copilot/agents/overview
[vscode-local-agents]: https://code.visualstudio.com/docs/copilot/chat/copilot-chat
[vscode-background-agents]: https://code.visualstudio.com/docs/copilot/agents/background-agents
[vscode-cloud-agents]: https://code.visualstudio.com/docs/copilot/agents/cloud-agents

<!-- Model Context Protocol -->

[mcp-site]: https://modelcontextprotocol.io/
[mcp-architecture]: https://modelcontextprotocol.io/docs/learn/architecture
[mcp-build-servers]: https://modelcontextprotocol.io/docs/develop/build-server

<p align="center">
  <strong>This reference implementation demonstrates that AI-assisted development is not about replacing developers—it's about amplifying their capabilities while maintaining safety, consistency, and quality</strong><br>
</p>
