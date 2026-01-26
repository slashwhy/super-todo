# 📝 Documentation Style Guide

> Unified format for all project documentation—concise, professional, and easy to navigate.

**Audience:** Contributors writing or updating docs | **Prerequisites:** None

---

## Quick Reference

| Element | Format | Example |
|---------|--------|---------|
| Title | `# [Emoji] Title` | `# 🔗 MCP Integrations` |
| Summary | `> One-line description` | `> External tools that extend agent capabilities.` |
| Good practice | `✅ Do This` | ✅ Use `data-testid` selectors |
| Avoid practice | `⚠️ Avoid This` | ⚠️ Hardcoding colors |
| Tips | `> 💡 **Tip:**` | > 💡 **Tip:** Use tables for comparisons |
| Warnings | `> ⚠️ **Warning:**` | > ⚠️ **Warning:** Never commit secrets |
| File links | `[text](relative-path)` | [TaskCard.vue](../src/components/tasks/TaskCard.vue) |

---

## Document Structure

Every documentation file follows this order:

```markdown
# [Emoji] Title

> One-line summary of what this document covers.

**Audience:** Who should read this | **Prerequisites:** What to know first

---

## Quick Reference
[TL;DR table or bullet list for fast lookup]

---

## What & Why
[2-3 paragraphs explaining the concept]

---

## How It Works
[Diagrams, flows, or step-by-step when applicable]

---

## Reference
[Detailed specs: tables, configurations, API details]

---

## Patterns

### ✅ Do This
[Good example with code]

### ⚠️ Avoid This
[What not to do with code—explain why]

---

## Related
- [Link to related doc](./OTHER_DOC.md)
```

---

## Formatting Rules

### Headers

Use consistent emoji prefixes for document types:

| Type | Emoji | Example |
|------|-------|---------|
| Guides | 📖 | `# 📖 AI Development Guide` |
| References | 📋 | `# 📋 Custom Instructions` |
| Security | 🛡️ | `# 🛡️ Governance & Security` |
| Integrations | 🔗 | `# 🔗 MCP Integrations` |
| Advanced | 🎓 | `# 🎓 Context Optimization` |
| Agents | 🤖 | `# 🤖 Custom Agents` |
| Style guides | 📝 | `# 📝 Documentation Style Guide` |

### Code Examples

Always pair good and avoid examples:

```markdown
### ✅ Do This

```typescript
// Clear explanation of why this is correct
const task = await prisma.task.findUnique({
  where: { id },
  include: { status: true, priority: true }
})
```

### ⚠️ Avoid This

```typescript
// Explain what's wrong and why
const task = await prisma.task.findUnique({
  where: { id }
  // Missing relations—UI will break
})
```
```

### Tables

Use tables for:
- Quick reference lookups
- Comparisons (good vs avoid)
- Configuration options
- Agent/tool rosters

```markdown
| Agent | Role | Writes Code? |
|-------|------|--------------|
| @Specify | Planning | ❌ Read-only |
| @Implement | Building | ✅ Yes |
```

### Callouts

Use sparingly for important information:

```markdown
> 💡 **Tip:** Optional helpful information

> ⚠️ **Warning:** Critical information about risks

> 📌 **Note:** Clarifying information
```

### Links

- **Internal docs:** `[Doc Name](./OTHER_DOC.md)`
- **Project files:** `[filename](../path/to/file.ts)`
- **External:** `[Text](https://url)` with brief context

---

## Length Guidelines

| Guideline | Target |
|-----------|--------|
| Document length | 300-400 lines max |
| Section paragraphs | 2-3 max |
| Code examples per concept | 1-3 max |
| Table rows | 10-15 max (split if larger) |

If a document exceeds limits, consider:
- Splitting into multiple files
- Moving details to linked references
- Converting prose to tables

---

## Language Style

### Tone
- **Professional but friendly** – Not stuffy or overly casual
- **Direct** – Get to the point quickly
- **Actionable** – Tell readers what to do

### Word Choice

| Instead of | Use |
|------------|-----|
| "Bad practice" | "Avoid" or "Instead" |
| "Never do this" | "Avoid this because..." |
| "You should" | Direct imperative ("Use...", "Add...") |
| "It is recommended" | "Recommend" or just state the action |
| Long explanations | Bullet points or tables |

### ✅ Do This

> Use `data-testid` attributes for test selectors. They're stable across refactors and clearly signal testing intent.

### ⚠️ Avoid This

> It is generally recommended that developers should consider using data-testid attributes when writing tests because they provide stability.

---

## Checklist Before Committing Docs

- [ ] Follows header structure (emoji + title + summary)
- [ ] Has Quick Reference section
- [ ] Code examples show both ✅ and ⚠️
- [ ] Links work and use relative paths
- [ ] Under 400 lines
- [ ] No duplicate content (cross-reference instead)
- [ ] Related section links to relevant docs

---

## Related

- [AI Development Guide](./AI_DEVELOPMENT_GUIDE.md) – Overview of AI workflows
- [Custom Agents](./CUSTOM_AGENTS.md) – Agent definitions
- [Custom Instructions](./CUSTOM_INSTRUCTIONS.md) – Instruction hierarchy
