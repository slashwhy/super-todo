# 🤖 AI-Assisted Development Guide

> **Reference implementation: How to structure AI-assisted development with GitHub Copilot's multi-agent system, skills, custom instructions, and Model Context Protocol.**

This is a **showcase project** demonstrating best practices for using GitHub Copilot to orchestrate the full software development lifecycle through specialized agents, enforced conventions, and secure integrations.

---

## Quick Start

- **New here?** Start with [What is AI-Assisted Development?](#what-is-ai-assisted-development)
- **Ready to use agents?** Jump to [The Multi-Agent System](#the-multi-agent-system)
- **Want detailed guides?** See navigation below

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
└── instructions/                # 9 path-specific instruction files

docs/
├── AI_DEVELOPMENT_GUIDE.md      # ← You are here (high-level overview)
├── CUSTOM_AGENTS.md             # Detailed agent definitions + skills
├── CUSTOM_INSTRUCTIONS.md       # Instruction hierarchy + best practices
├── MCP.md                        # Model Context Protocol guide
├── GOVERNANCE.md                # Security & responsibilities
└── CONTEXT_OPTIMIZATION.md      # Advanced: context window optimization
```

---

## Key Principles

1. **Separation of Concerns** – Each agent has one job
2. **Convention Over Configuration** – Standards encoded in instructions
3. **Progressive Disclosure** – Skills load on-demand, not all at once
4. **Human Remains in Control** – Developers make final decisions
5. **Auditable Workflow** – Clear record of what each agent did

---

## Learning Path

```
START HERE
   ↓
├─ Read this file (you are here)
│
├─ Choose a topic based on your question:
│  ├─ "What agents exist?" → CUSTOM_AGENTS.md
│  ├─ "How do conventions work?" → CUSTOM_INSTRUCTIONS.md
│  ├─ "What's MCP?" → MCP.md
│  ├─ "What's my responsibility?" → GOVERNANCE.md
│  └─ "How do I optimize context?" → CONTEXT_OPTIMIZATION.md
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
| How do agents work? | This file | [CUSTOM_AGENTS.md](./CUSTOM_AGENTS.md) |
| How do instructions work? | This file | [CUSTOM_INSTRUCTIONS.md](./CUSTOM_INSTRUCTIONS.md) |
| What is MCP? | This file | [MCP.md](./MCP.md) |
| What's my responsibility? | [GOVERNANCE.md](./GOVERNANCE.md) | Security section |
| Need to optimize context? | [CONTEXT_OPTIMIZATION.md](./CONTEXT_OPTIMIZATION.md) | Advanced patterns |

---

## Official References

- **GitHub Copilot Documentation:** https://docs.github.com/en/copilot
- **Model Context Protocol:** https://modelcontextprotocol.io/
- **Custom Instructions Guide:** https://docs.github.com/en/copilot/concepts/prompting/response-customization

---

**This reference implementation demonstrates that AI-assisted development is not about replacing developers—it's about amplifying their capabilities while maintaining safety, consistency, and quality.**
