# 🤖 AI-Assisted Development Guide

> **Reference implementation: How to structure AI-assisted development with GitHub Copilot's multi-agent system, skills, custom instructions, and Model Context Protocol.**

This is a **showcase project** demonstrating best practices for using GitHub Copilot to orchestrate the full software development lifecycle through specialized agents, enforced conventions, and secure integrations.


## 🚨 Developer Responsibilities

> **AI is a co-pilot, not an autopilot.** You are responsible for code quality, security, and compliance.

### Your Accountability

| | Responsibility | Action |
|---|---|---|
| 👁️ | **Review** | Read and understand all AI-generated code before committing |
| ✅ | **Validate** | Check against requirements and project standards |
| 🧪 | **Test** | Run full test suite before merging |
| 🔒 | **Security** | Verify auth, credentials, and data handling |
| 💡 | **Understand** | Know what changed and why it changed |

📖 **[Read the full guide →][responsibilities]** – detailed checklists, incident response, and MCP security


## Quick Start

- **New here?** Start with [What is AI-Assisted Development?][what-is-ai]
- **Know what you need?** Use the [Feature Index][feature-index]
- **Ready to use agents?** Jump to [The Multi-Agent System][multi-agent]
- **Want detailed guides?** See [Documentation by Topic][doc-by-topic]


## Feature Index

Quick lookup for all Copilot customization features:

| Feature | Purpose | File Type | Documentation |
|---------|---------|-----------|---------------|
| **Smart Actions** | Built-in IDE commands (no setup needed) | N/A | [VS Code Copilot][copilot-smart-actions] |
| **Custom Prompts** | Reusable task templates | `.prompt.md` | [CUSTOM_PROMPTS.md][custom-prompts] |
| **Custom Instructions** | Coding standards & conventions | `.instructions.md` | [CUSTOM_INSTRUCTIONS.md][custom-instructions] |
| **Custom Agents** | Specialized AI personas with roles | `.agent.md` | [CUSTOM_AGENTS.md][custom-agents] |
| **Skills** | On-demand knowledge modules | `SKILL.md` | [CUSTOM_AGENTS.md][skills-reference] |
| **MCP** | External tool connections | `mcp-servers.json` | [MCP.md][mcp] |

**Learning path:** Smart Actions → Prompts → Instructions → Agents → MCP


## Built-in Smart Actions

GitHub Copilot includes many built-in features that work out of the box—code generation, fixing errors, understanding code, version control assistance, and more. Rather than duplicating documentation here, see the official resources for the most current information:

- **[VS Code Copilot Overview][vscode-copilot-docs]** – Core features and capabilities
- **[Smart Actions][copilot-smart-actions]** – Built-in AI-powered editor actions
- **[Copilot Chat][copilot-chat-features]** – Natural language chat interface


## What is AI-Assisted Development?

AI-assisted development is a **paradigm shift** in how teams build software with AI. Instead of treating AI as autocomplete, you orchestrate **specialized agents** with defined roles, constrained capabilities, and human oversight.

### The Key Insight

| Aspect | General AI | Specialized Agents |
|--------|------------|-------------------|
| **Approach** | Autocomplete mindset | Orchestrated agents with defined roles |
| **Output** | Generic suggestions | Follow project conventions |
| **Process** | Manual filtering required | Human review at handoff points |
| **Results** | Inconsistent | Consistent, testable |

**What this means for your team:**
- ✅ **Consistency** – Agents follow the same rules every time
- ✅ **Focus** – Each agent has one responsibility
- ✅ **Safety** – Humans remain in command
- ✅ **Productivity** – Developers focus on problem-solving
- ✅ **Traceability** – Clear audit trail of who did what

## The Multi-Agent System

This project uses **4 specialized agents** with defined roles and constrained tool access. See the [README][readme-agents] for the full agent table.

**Typical Flow:** `@Specify` → `@Implement` → `@Test Unit` → `@Test E2E` → `@Specify` (validate)

### Key Principle: Human in Command

> **AI is a co-pilot, not an autopilot.**

- Agents confirm before major actions
- Handoffs require human approval
- Critical changes need explicit consent

See [RESPONSIBILITIES_AND_SECURITY.md][responsibilities] for detailed developer responsibilities.

## Documentation by Topic

Pick a topic below to get started. Each guide includes real examples from this project.

| Topic | Best For |
|-------|----------|
| [🤖 **Agents**][custom-agents] | Understanding agent roles and responsibilities, model selection, tool constraints, and how each agent works in your workflow |
| [📋 **Custom Instructions**][custom-instructions] | Learning the instruction hierarchy and best practices for encoding project conventions, coding standards, and patterns |
| [🎯 **Custom Prompts**][custom-prompts] | Creating reusable prompt templates for recurring tasks, automating workflows, and triggering specific agent behaviors |
| [🔌 **MCP Integrations**][mcp] | Connecting external services, APIs, databases, and specialized tools to extend agent capabilities |
| [🔒 **Responsibilities & Security**][responsibilities] | Understanding your accountability, security risks, compliance requirements, and incident response procedures |
| [⚡ **Context Optimization**][context-optimization] | Maximizing efficiency with large codebases, optimizing token usage, and advanced patterns for scaling |

## When to Use What?

Choose the right tool for your needs:

| Need | Solution | File |
|------|----------|------|
| 🌍 Rules that apply **everywhere** | [Global Instructions][when-global-instructions] | `.github/copilot-instructions.md` |
| 📋 Rules for **specific file types** or **folders** | [Path-Specific Instructions][custom-instructions] | `.github/instructions/*.instructions.md` |
| 🤖 A **different persona/permissions** | [Custom Agent][custom-agents] | `.github/agents/*.agent.md` |
| 🛠️ **Complex procedures/scripts** | [Agent Skill][skills-reference] | `.github/skills/*/SKILL.md` |
| 🎯 **Reusable task templates** | [Custom Prompts][custom-prompts] | `.github/prompts/*.prompt.md` |

## Project Structure

```
.github/
├── copilot-instructions.md              # 🌍 Global rules: Tech stack, conventions, security
├── agents/                              # 🤖 4 specialized agent definitions
├── instructions/                        # 📋 9 path-specific instruction files
├── prompts/                             # 🎯 7 reusable prompt templates
└── skills/                              # ⚡ 11 specialized knowledge modules

docs/
├── AI_DEVELOPMENT_GUIDE.md              # ← You are here (high-level overview)
├── CUSTOM_AGENTS.md                     # 🤖 Agent definitions & skills
├── CUSTOM_INSTRUCTIONS.md               # 📋 Instruction hierarchy & best practices
├── CUSTOM_PROMPTS.md                    # 🎯 Reusable prompt templates
├── MCP.md                               # 🔌 Model Context Protocol guide
├── RESPONSIBILITIES_AND_SECURITY.md     # 🔒 Security & responsibilities
├── CONTEXT_OPTIMIZATION.md              # ⚡ Advanced: context optimization
└── GIT_WORKTREES.md                     # 🌳 Advanced: parallel development
```

## Key Principles

> Core values that guide AI-assisted development in this project.

| | Principle | Description |
|---|-----------|-------------|
| 🎯 | **Separation of Concerns** | Each agent has one, clearly defined job |
| 📋 | **Convention Over Configuration** | Standards are encoded in instructions, not config files |
| 📦 | **Progressive Disclosure** | Skills load on-demand, not all at once |
| 👤 | **Human Remains in Control** | Developers make final decisions; |
| 📝 | **Auditable Workflow** | Clear record of what each agent did and why |

## Model Selection

> Match model capabilities to task complexity—don't default to the most powerful option.

| Task Type | Recommended Model | Why |
|-----------|-------------------|-----|
| 🏗️ **Architecture & System Design** | High-reasoning (e.g., GPT-5.2) | Complex logic, bottleneck analysis |
| 🔧 **Production Refactoring** | High-precision (e.g., Claude Opus 4.5) | Strict convention adherence |
| 📚 **Large Codebase Analysis** | High-context (e.g., Gemini 3 Pro) | 1M token window for full-repo analysis |
| 📝 **Bulk/Routine Tasks** | Cost-efficient model | Documentation, repetitive work |

### Decision Framework

Optimize across four dimensions:

| Factor | More → Better | Application |
|--------|---------------|-------------|
| 🧠 **Complexity** | Reasoning → higher-capability model | Architecture, design patterns |
| 📦 **Context Size** | Large codebase → high-context model | Full-repo analysis |
| ⚡ **Speed** | Interactive work → low-latency model | Documentation |
| 💰 **Cost** | Routine tasks → efficient model | Repetitive, bulk work |


> 💡 **Tip:** Start with a balanced model. Upgrade for reasoning limits; downgrade for routine work.

---


<!-- Internal Documentation -->
[ai-guide]: #what-is-ai-assisted-development
[feature-index]: #feature-index
[multi-agent]: #the-multi-agent-system
[doc-by-topic]: #documentation-by-topic
[what-is-ai]: #what-is-ai-assisted-development
[readme-agents]: ../README.md#multi-agent-system

<!-- Documentation Files -->
[custom-agents]: ./CUSTOM_AGENTS.md
[custom-instructions]: ./CUSTOM_INSTRUCTIONS.md
[custom-prompts]: ./CUSTOM_PROMPTS.md
[mcp]: ./MCP.md
[responsibilities]: ./RESPONSIBILITIES_AND_SECURITY.md
[context-optimization]: ./CONTEXT_OPTIMIZATION.md
[git-worktrees]: ./GIT_WORKTREES.md

<!-- Anchor Links -->
[skills-reference]: ./CUSTOM_AGENTS.md#skills-reference
[built-in-smart-actions]: #built-in-smart-actions
[when-global-instructions]: ../.github/copilot-instructions.md

<!-- GitHub Copilot Documentation -->
[copilot-what-is]: https://docs.github.com/en/copilot/get-started/what-is-github-copilot
[copilot-custom-instructions]: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
[copilot-response-customization]: https://docs.github.com/en/copilot/concepts/prompting/response-customization
[copilot-smart-actions]: https://code.visualstudio.com/docs/copilot/copilot-smart-actions
[copilot-chat-features]: https://code.visualstudio.com/docs/copilot/chat/copilot-chat
[vscode-copilot-docs]: https://code.visualstudio.com/docs/copilot/overview

<!-- Model Context Protocol -->
[mcp-site]: https://modelcontextprotocol.io/
[mcp-architecture]: https://modelcontextprotocol.io/docs/learn/architecture
[mcp-build-servers]: https://modelcontextprotocol.io/docs/develop/build-server


<p align="center">
  <strong>This reference implementation demonstrates that AI-assisted development is not about replacing developers—it's about amplifying their capabilities while maintaining safety, consistency, and quality</strong><br>
</p>
