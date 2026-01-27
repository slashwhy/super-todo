# 🎓 Context Optimization

> Maximize LLM performance and minimize costs through intelligent context management.

**Audience:** Advanced users optimizing agent efficiency | **Prerequisites:** [Custom Agents](./CUSTOM_AGENTS.md)

---

## Quick Reference

| Technique | Token Savings | Use Case |
|-----------|---------------|----------|
| Local filtering | 60-70% | Database queries |
| Lazy tool loading | 30-40% | Multi-tool workflows |
| Result summarization | 50-80% | API responses |
| Streaming/pagination | 40-60% | Large datasets |
| **Combined** | **70-87%** | Optimized workflows |

---

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

> 📖 **Related:** For MCP-specific optimization (Code Execution Pattern, Progressive Disclosure), see [MCP.md](./MCP.md#context-efficiency-the-code-execution-pattern).

---

## How It Works

### Traditional (High Token Use)

```
User Query → Load ALL tools (50K) → Process → Response
```

### Optimized (Progressive Disclosure)

```
User Query → Minimal context (5K) → Execute locally → Filter results → Response
```

---

## Patterns

### ✅ Do This: Local Data Processing

```typescript
// Filter in database, return summary to LLM
const activeUsers = await db.user.findMany({
  where: { status: 'active' }
})
const summary = { count: activeUsers.length, sample: activeUsers[0] }
return llm.process(summary)
```

### ⚠️ Avoid This

```typescript
// All data goes to LLM context
const allUsers = await db.user.findMany()
const filteredUsers = llm.filter(allUsers, 'active')
```

---

### ✅ Do This: Lazy Tool Loading

```typescript
// Load tools only when needed
const tools = {
  jira: () => import('./mcp/jira'),
  figma: () => import('./mcp/figma'),
}
```

### ⚠️ Avoid This

```typescript
// Load all tools upfront
const tools = [jira, figma, github, slack, docker, ...]
```

---

### ✅ Do This: Result Summarization

```typescript
const design = await figmaApi.getDesign(componentId)
return {
  name: design.name,
  bounds: design.absoluteBoundingBox,
  fills: design.fills,
  // Omit: children, effects, interactions (~48K tokens saved)
}
```

### ⚠️ Avoid This

```typescript
// Full response: 50K tokens
return await figmaApi.getDesign(componentId)
```

---

### ✅ Do This: Pagination

```typescript
const results = await query.findMany({
  take: 10,
  cursor: lastId
})
// Fetch more only if needed
```

### ⚠️ Avoid This

```typescript
const results = await query.findMany({ take: 1000 })
```

---

## Real-World Example

**Scenario:** Search codebase, fetch design, create implementation plan

| Step | Without Optimization | With Optimization |
|------|---------------------|-------------------|
| System prompts | 5K | 5K |
| MCP tools | 45K | — (lazy loaded) |
| Search results | 30K | 8K (local search) |
| Design response | 25K | 3K (summarized) |
| Agent plan | — | 12K |
| **Total** | **105K** | **28K (73% savings)** |

---

## When to Skip Optimization

Some operations need full context:

| Scenario | Why |
|----------|-----|
| First task in session | Context is fresh |
| Complex analysis | Full picture needed |
| Architecture decisions | Complete codebase view |
| Security reviews | Can't summarize safely |

---

## Monitoring

Track these metrics:

```json
{
  "context_used": "145K / 200K",
  "breakdown": {
    "system": "5K (3%)",
    "tools": "8K (6%)",
    "code": "47K (32%)",
    "results": "85K (59%)"
  }
}
```

**Questions to ask:**
- Which MCP tools consume most context?
- Are unused tools being loaded?
- Can results be filtered before returning?
- Is pagination possible?

---

## Related

- [Custom Agents](./CUSTOM_AGENTS.md) – Agent tool configurations
- [MCP Integrations](./MCP.md) – Tool definitions that affect context
- [Anthropic: Prompt Optimization](https://docs.anthropic.com/claude/reference/prompt-optimization)
