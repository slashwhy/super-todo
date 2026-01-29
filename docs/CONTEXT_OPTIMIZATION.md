# 🎓 Context Optimization

> Maximize LLM performance and minimize costs through intelligent context management.

**Audience:** Advanced users optimizing agent efficiency | **Prerequisites:** [CUSTOM_AGENTS.md][custom-agents]

## ⚡ Quick Navigation

| Section | Purpose |
|---------|---------|
| [❓ What & Why](#what--why) | Understand the problem |
| [✨ Best Practices](#best-practices) | Instructions and tools strategies |
| [🔗 Key Resources](#key-resources) | Where to implement optimization |

## What & Why

LLM context windows (100K-1M tokens) fill faster than expected due to hidden overhead:

```
200K Token Context Window
├─ System prompts         2-5K   ━━
├─ Custom instructions    5-10K  ━━━━
├─ Agent definitions      3-8K   ━━━
├─ MCP tool definitions   20-50K ━━━━━━━━━━━━━  ← Biggest culprit
├─ Skills & procedures    5-15K  ━━━━━━
└─ Your actual code       ~100K  ━━━━━━━━━━━━━━━━━━━━━
```

**Result:** 50-70K tokens consumed before addressing your problem.

> 📖 **Related:** For MCP-specific optimization (Code Execution Pattern, Progressive Disclosure), see [MCP.md][mcp].

## Best Practices

### 🎯 The Golden Rule

**As much as needed, but as few and small and specific as you can go.**

Keep your instructions and tools:
- ✅ **Focused** – Each instruction should solve one problem
- ✅ **Minimal** – Include only what's necessary
- ✅ **Specific** – Be precise about scope and requirements
- ✅ **Reusable** – Build skills that work across tasks

### 📋 Instruction Strategy

Structure your instructions across three levels:

1. **Global Instructions** – Foundational rules (coding standards, naming conventions)
2. **Task-Specific Instructions** – Problem-domain rules (backend routes, Vue components, testing)
3. **Agent Skills** – Specialized knowledge used by agents to accomplish goals

👉 See [CUSTOM_INSTRUCTIONS.md][custom-instructions] for the instruction hierarchy and composition patterns.

### 🛠 Custom Agents Strategy

Design agents with focused toolsets:

1. **Define clear agent scope** – What problem does this agent solve?
2. **Attach minimal instructions** – Only rules this agent needs
3. **Use skill references** – Point to reusable skills, don't duplicate
4. **Load tools on-demand** – Include only tools the agent needs use

👉 See [CUSTOM_AGENTS.md][custom-agents] for agent definitions and skills reference.

## Key Resources

| Resource | Purpose |
|----------|---------|
| [CUSTOM_INSTRUCTIONS.md][custom-instructions] | How to structure and compose instructions at scale |
| [CUSTOM_AGENTS.md][custom-agents] | How to define focused agents with targeted skills |
| [MCP.md][mcp] | How to integrate external tools efficiently |

---

<!-- Related Documentation -->
[custom-agents]: ./CUSTOM_AGENTS.md
[custom-instructions]: ./CUSTOM_INSTRUCTIONS.md
[mcp]: ./MCP.md
[prompt-optimization]: https://docs.anthropic.com/claude/reference/prompt-optimization
