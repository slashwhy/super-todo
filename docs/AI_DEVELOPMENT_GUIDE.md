# 🤖 AI-Assisted Development Guide

> **Reference implementation: How to structure AI-assisted development with GitHub Copilot's multi-agent system, skills, custom instructions, and Model Context Protocol.**

This is a **showcase project** demonstrating best practices for using GitHub Copilot to orchestrate the full software development lifecycle through specialized agents, enforced conventions, and secure integrations.

---

## Quick Start

- **New here?** Start with [What is AI-Assisted Development?](#what-is-ai-assisted-development)
- **Know what you need?** Use the [Feature Index](#feature-index)
- **Ready to use agents?** Jump to [The Multi-Agent System](#the-multi-agent-system)
- **Want detailed guides?** See [Documentation by Topic](#documentation-by-topic)

---

## Feature Index

Quick lookup for all Copilot customization features:

| Feature | Purpose | File Type | Documentation |
|---------|---------|-----------|---------------|
| **Smart Actions** | Built-in IDE commands (no setup needed) | N/A | [Below](#built-in-smart-actions) |
| **Custom Prompts** | Reusable task templates | `.prompt.md` | [CUSTOM_PROMPTS.md](./CUSTOM_PROMPTS.md) |
| **Custom Instructions** | Coding standards & conventions | `.instructions.md` | [CUSTOM_INSTRUCTIONS.md](./CUSTOM_INSTRUCTIONS.md) |
| **Custom Agents** | Specialized AI personas with roles | `.agent.md` | [CUSTOM_AGENTS.md](./CUSTOM_AGENTS.md) |
| **Skills** | On-demand knowledge modules | `SKILL.md` | [CUSTOM_AGENTS.md](./CUSTOM_AGENTS.md#skills-reference) |
| **MCP** | External tool connections | `mcp-servers.json` | [MCP.md](./MCP.md) |

**Learning path:** Smart Actions → Prompts → Instructions → Agents → MCP

---

## Built-in Smart Actions

Before customizing Copilot, know these built-in features—they work out of the box:

### Code Generation & Fixing

| Action | How to Access | Use Case |
|--------|--------------|----------|
| **Fix Errors** | Lightbulb on error → "Fix with Copilot" | Resolve compile/lint errors |
| **Generate Tests** | Right-click → Generate Code → Generate Tests | Quick test scaffolding |
| **Generate Docs** | Right-click → Generate Code → Generate Docs | Document functions/classes |
| **Implement TODO** | Lightbulb on TODO comment → "Delegate to Copilot" | Auto-implement TODOs |
| **Rename Symbol** | F2 on symbol → AI suggestions appear | Context-aware renaming |

### Understanding & Debugging

| Action | How to Access | Use Case |
|--------|--------------|----------|
| **Explain Code** | Right-click → Explain | Understand unfamiliar code |
| **Fix Terminal Error** | Sparkle icon after failed command | Debug terminal failures |
| **Fix Test Failure** | Sparkle in Test Explorer | Fix failing tests |
| **Start Debugging** | Chat: `/startDebugging` | Generate launch.json |
| **Debug Command** | Terminal: `copilot-debug node app.js` | Debug any command |

### Version Control

| Action | How to Access | Use Case |
|--------|--------------|----------|
| **Generate Commit Message** | Sparkle in Source Control | Summarize staged changes |
| **Generate PR Description** | GitHub PR extension | Title + description |
| **Resolve Merge Conflict** | "Resolve with AI" button | AI-guided conflict resolution |
| **Code Review** | Right-click → Generate Code → Review | Review selected code |

### Search & Navigation

| Action | How to Access | Use Case |
|--------|--------------|----------|
| **Semantic Search** | Search view toggle | Find conceptually related code |
| **Search Settings** | Settings: natural language query | "increase font size" |
| **Generate Alt Text** | Lightbulb on Markdown image | Accessibility |

> 💡 **Tip:** These actions require no configuration. Start here before building custom agents.

---

## What is AI-Assisted Development?

AI-assisted development is a **paradigm shift** in how teams build software with AI. Instead of treating AI as autocomplete, you orchestrate **specialized agents** with defined roles, constrained capabilities, and human oversight.

### The Key Insight

```
General AI (less effective)        →        Specialized Agents (more effective)
                                              • Each agent has one job
Generic suggestions              →        • Agents follow project conventions
Lots of manual filtering         →        • Humans review at handoff points
Inconsistent results             →        • Consistent, testable results
```

**Benefits:**
- Consistency: Agents follow the same rules every time
- Focus: Each agent has one responsibility
- Safety: Humans remain in command
- Productivity: Developers focus on problem-solving
- Traceability: Clear audit trail of who did what

---

## The Multi-Agent System

This project uses **4 specialized agents** with defined roles and constrained tool access. See the [README](../README.md#multi-agent-system) for the full agent table.

**Typical Flow:** `@Specify` → `@Implement` → `@Test Unit` → `@Test E2E` → `@Specify` (validate)

### Key Principle: Human in Command

> **AI is a co-pilot, not an autopilot.**

- Agents confirm before major actions
- Handoffs require human approval
- Critical changes need explicit consent

See [GOVERNANCE.md](./GOVERNANCE.md) for detailed developer responsibilities.

---

## Documentation by Topic

### 1. Understanding Agents

**File:** [CUSTOM_AGENTS.md](./CUSTOM_AGENTS.md)

Comprehensive guide covering:
- Detailed definition of each agent
- Role, constraints, and tool access for each
- Agent interaction patterns
- **NEW:** Skills system (11 specialized knowledge modules)
- How agents use MCP tools
- Operating modes and examples

**Start here if:** You want to know exactly what each agent does and how to use them.

### 2. Understanding Custom Instructions

**File:** [CUSTOM_INSTRUCTIONS.md](./CUSTOM_INSTRUCTIONS.md)

Complete guide covering:
- Instruction hierarchy (Global → Path-Specific → Agent-Specific)
- How to write effective instructions
- Common pitfalls and best practices
- All 9 path-specific instructions in the project
- Do's and Don'ts for instruction writing
- Real examples from this project

**Start here if:** You want to understand how project conventions are encoded and enforced.

### 3. Understanding MCP Integrations

**File:** [MCP.md](./MCP.md)

In-depth guide covering:
- What is Model Context Protocol (USB-C analogy)
- 4 MCP servers configured in this project (Atlassian, Figma, Chrome DevTools, Playwright)
- How agents use MCP tools
- Security risks and mitigations
- Best practices for MCP usage
- Typical usage patterns

**Start here if:** You want to understand how agents connect to external services.

### 4. Governance & Security

**File:** [GOVERNANCE.md](./GOVERNANCE.md)

Covers:
- Developer responsibilities checklist
- Human in Command principle
- MCP security risks and mitigations
- Incident response procedures
- Audit and compliance

**Start here if:** You have security concerns or want to understand developer accountability.

### 5. Advanced: Context Optimization

**File:** [CONTEXT_OPTIMIZATION.md](./CONTEXT_OPTIMIZATION.md)

For developers who want to:
- Maximize LLM context window efficiency
- Optimize instruction loading
- Advanced patterns for large projects
- Memory management strategies

**Start here if:** You're working with large codebases and need context optimization.

---

## Project Structure

```
.github/
├── copilot-instructions.md      # Global: Tech stack, conventions, rules
├── agents/                       # 4 agent definitions (@Specify, @Implement, etc.)
├── instructions/                 # 9 path-specific instruction files
└── prompts/                      # Reusable prompt templates (.prompt.md)

docs/
├── AI_DEVELOPMENT_GUIDE.md      # ← You are here (high-level overview)
├── CUSTOM_PROMPTS.md            # Reusable prompt files
├── CUSTOM_INSTRUCTIONS.md       # Instruction hierarchy + best practices
├── CUSTOM_AGENTS.md             # Agent definitions + skills
├── MCP.md                       # Model Context Protocol guide
├── GOVERNANCE.md                # Security & responsibilities
├── CONTEXT_OPTIMIZATION.md      # Advanced: context window optimization
└── GIT_WORKTREES.md             # Advanced: parallel AI development
```

---

## Key Principles

1. **Separation of Concerns** – Each agent has one job
2. **Convention Over Configuration** – Standards encoded in instructions
3. **Progressive Disclosure** – Skills load on-demand, not all at once
4. **Human Remains in Control** – Developers make final decisions
5. **Auditable Workflow** – Clear record of what each agent did

---

## Model Selection

Choose the right model for the task—don't default to the most powerful option:

| Task Type | Recommended Model | Why |
|-----------|-------------------|-----|
| **Architecture & System Design** | High-reasoning (e.g., GPT-5.2) | Complex logic, bottleneck analysis |
| **Production Refactoring** | High-precision (e.g., Claude Opus 4.5) | Strict convention adherence |
| **Large Codebase Analysis** | High-context (e.g., Gemini 3 Pro) | 1M token window for full-repo analysis |
| **Rapid Debugging** | Fast model (e.g., GPT-5 mini) | Low latency, quick iterations |
| **Bulk/Routine Tasks** | Cost-efficient model | Documentation, repetitive work |

**Decision factors:**
1. **Complexity** → More reasoning needed = higher-capability model
2. **Context size** → Large codebase = high-context model
3. **Speed** → Interactive work = low-latency model
4. **Cost** → Routine tasks = efficient model

> 💡 **Tip:** Start with a balanced model. Upgrade for reasoning limits; downgrade for routine work.

---

## Learning Path

```
START HERE
   ↓
├─ Read this file (you are here)
│
├─ Choose a topic based on your question:
│  ├─ "What built-in features exist?" → See Smart Actions above
│  ├─ "How do I save reusable prompts?" → CUSTOM_PROMPTS.md
│  ├─ "How do conventions work?" → CUSTOM_INSTRUCTIONS.md
│  ├─ "What agents exist?" → CUSTOM_AGENTS.md
│  ├─ "What's MCP?" → MCP.md
│  ├─ "What's my responsibility?" → GOVERNANCE.md
│  └─ "How do I optimize context?" → CONTEXT_OPTIMIZATION.md
│
├─ Advanced Topics:
│  └─ "Parallel AI development?" → GIT_WORKTREES.md
│
└─ Dive deeper with official docs:
   ├─ GitHub Copilot: https://docs.github.com/en/copilot
   ├─ MCP Protocol: https://modelcontextprotocol.io/
   └─ Your project instructions: .github/copilot-instructions.md
```

---

## Summary

| Question | Learn In | Deep Dive |
|----------|----------|-----------|
| What built-in features exist? | [Smart Actions](#built-in-smart-actions) | VS Code docs |
| How do I save reusable prompts? | This file | [CUSTOM_PROMPTS.md](./CUSTOM_PROMPTS.md) |
| How do agents work? | This file | [CUSTOM_AGENTS.md](./CUSTOM_AGENTS.md) |
| How do instructions work? | This file | [CUSTOM_INSTRUCTIONS.md](./CUSTOM_INSTRUCTIONS.md) |
| What is MCP? | This file | [MCP.md](./MCP.md) |
| What's my responsibility? | [GOVERNANCE.md](./GOVERNANCE.md) | Security section |
| Need to optimize context? | [CONTEXT_OPTIMIZATION.md](./CONTEXT_OPTIMIZATION.md) | Advanced patterns |
| Parallel AI development? | [GIT_WORKTREES.md](./GIT_WORKTREES.md) | Advanced |

---

## Official References

- **GitHub Copilot Documentation:** https://docs.github.com/en/copilot
- **Model Context Protocol:** https://modelcontextprotocol.io/
- **Custom Instructions Guide:** https://docs.github.com/en/copilot/concepts/prompting/response-customization

---

**This reference implementation demonstrates that AI-assisted development is not about replacing developers—it's about amplifying their capabilities while maintaining safety, consistency, and quality.**
