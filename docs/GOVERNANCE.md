# 🛡️ Governance & Security

> Responsible AI use with proper safeguards and developer accountability.

**Audience:** All developers using AI assistance | **Prerequisites:** None

---

## Quick Reference

> 🚨 **Golden Rule:** AI is a co-pilot, not an autopilot. You are responsible for code quality, security, and compliance.

| Principle | Action |
|-----------|--------|
| **Review** | Read and understand AI-generated code |
| **Validate** | Check against requirements and standards |
| **Test** | Run full test suite before merging |
| **Approve** | Explicit sign-off before deployment |

---

## The True Cost of Skipping Review

Blindly accepting AI-generated code feels fast. You save 5 minutes writing boilerplate. Then you lose those 5 minutes—**and much more**—later:

```
Timeline of "Fast" AI Development Without Review
================================================
T+0min     ✅ AI generates code in seconds
T+5min     🚀 You commit without reading it
T+1hr      👀 Code review: "What is this doing?"
T+2hr      😅 Revert, rewrite, re-review
T+3hr      🐛 Bug appears in production
T+1week    🛠️ Technical debt backlog grows
T+6months  💸 "Why is everything so slow?"

→ Total cost: 1000x the 5 minutes you "saved"
```

### The Compound Interest Problem

```
┌─────────────────────────────────────────────────────┐
│  Skip Review              │  Review Properly        │
├───────────────────────────┼─────────────────────────┤
│  Time Saved: 5 min        │  Time Saved: 3 min      │
│  Technical Debt: ∞        │  Technical Debt: Low    │
│  Hidden Costs:            │  Hidden Costs:          │
│   • Review cycles: +10min │   • None                │
│   • Prod bugs: +2 hours   │                         │
│   • Refactor: +1 week     │                         │
│  ROI: Negative            │  ROI: +200%             │
└───────────────────────────┴─────────────────────────┘
```

### Common "Slop" Patterns to Catch

| Pattern | Example |
|---------|--------|
| Missing error handling | `await fetch()` without try/catch |
| Implicit type coercions | `if (value)` instead of `if (value !== undefined)` |
| N+1 queries | Loop with database call inside |
| Security oversights | `req.body` passed directly to Prisma |
| Convention violations | Hardcoded colors, wrong file structure |

### The Bottom Line

> Reviewing AI code takes **20%** of the time you'd save by skipping review.
> Skipping review costs you **1000%** in technical debt.

The productivity gain is real—**but only if you do the work right.**

---

## What & Why

AI-assisted development boosts productivity but requires discipline. Every AI suggestion—especially for security, complexity, or architecture—must go through human review.

**The workflow:**
```
@Specify (Plan) → [You approve] → @Implement → [You confirm each step]
     ↓
@Test → [You review results] → @Specify (Validate) → [You approve] → Merge
```

---

## Developer Checklists

### Every Feature

- [ ] Review all AI-generated code before committing
- [ ] Run full test suite
- [ ] Verify project conventions (CSS, TypeScript, naming)
- [ ] Check accessibility (WCAG compliance)
- [ ] Check performance (N+1 queries, bundle size)

### Security Changes

- [ ] Manual deep review of security logic
- [ ] Peer security review
- [ ] No hardcoded secrets
- [ ] Test edge cases and error scenarios

### Database Changes

- [ ] Schema matches requirements
- [ ] Test migrations on fresh database
- [ ] Check backward compatibility
- [ ] Verify indexes exist

### API Changes

- [ ] Compare against API specification
- [ ] Input validation in place
- [ ] All error paths covered
- [ ] Authorization enforced

---

## Data Privacy

### Use Enterprise Tiers

| Service | Data Used for Training? | Recommendation |
|---------|-------------------------|----------------|
| GitHub Copilot (Business) | No | ✅ Recommended |
| Anthropic (Enterprise) | No | ✅ Best for sensitive code |
| Claude.ai (Free) | May be | ⚠️ Avoid for proprietary code |
| Free tier services | Unclear | ⚠️ Avoid for proprietary code |

### Data Flow Awareness

```
Your Code → MCP Server → External Service → AI Model
```

Always:
- Use `.env` for secrets, never commit
- Use local MCP servers when possible
- Rotate credentials regularly

---

## MCP Security Risks

### 1. Confused Deputy Problem

**Risk:** Agent combines permissions in unintended ways.

```
Agent has: read code + write to Jira
Unintended: reads secrets, posts them to public Jira ticket
```

**Mitigation:**
- ✅ Minimal permissions per MCP server
- ✅ Separate read-only and write-access servers

### 2. Credential Exposure

**Risk:** API keys logged or exposed.

```typescript
// ⚠️ Avoid
console.log(`Token: ${apiToken}`)

// ✅ Do This
console.log(`Token: ${apiToken.slice(0, 4)}...`)
```

### 3. Agent Tool Overreach

**Risk:** Agent has too many capabilities.

| Agent | Can Access | Cannot Access |
|-------|------------|---------------|
| @Specify | Read code, Jira/Figma (read-only) | Write files, execute code |
| @Implement | Create/edit files, dev execution | Production database, delete without confirm |
| @Test | Edit test files, run tests | Production code, infrastructure |

---

## When to Use AI vs. Manual

### ✅ Use AI For

- Boilerplate following conventions
- Test scaffolding
- Refactoring within patterns
- Documentation

### ⚠️ Code Manually

- Security-critical logic
- Authentication/authorization
- Data encryption
- Novel algorithms
- Architecture decisions

---

## Incident Response

### Security Issue Found

1. **Stop** – Don't commit or deploy
2. **Isolate** – Create private branch
3. **Audit** – Review data exposure
4. **Fix** – Manual security fix
5. **Review** – Peer/security review
6. **Rotate** – Rotate exposed credentials
7. **Document** – Record incident

### Agent Misbehavior

1. **Disable** – Remove tool access
2. **Review** – Examine what happened
3. **Fix** – Update agent constraints
4. **Test** – Verify before re-enabling

---

## Security Checklist

Before deploying AI-assisted code:

- [ ] **Secrets:** No hardcoded credentials, all in `.env`
- [ ] **Agents:** Minimal permissions, combinations reviewed
- [ ] **MCP:** Isolated environments, data flow understood
- [ ] **Code:** Manually reviewed, tests passing
- [ ] **Data:** No sensitive data in logs, compliance met

---

## Patterns

### ✅ Do This

```typescript
// Explicit field whitelisting
await prisma.task.create({
  data: {
    title: req.body.title,
    description: req.body.description
  }
})
```

### ⚠️ Avoid This

```typescript
// Passing raw input to database
await prisma.task.create({
  data: req.body  // Dangerous: any field accepted
})
```

---

## Related

- [Custom Agents](./CUSTOM_AGENTS.md) – Agent tool restrictions
- [MCP Integrations](./MCP.md) – Server security details
- [GitHub Copilot Trust](https://copilot.github.trust.page/)
- [OWASP Security](https://owasp.org/)
