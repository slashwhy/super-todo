# 👤 Developer Responsibilities

> Your accountability as a developer using AI assistance – maintaining code quality and making informed decisions.

**Audience:** All developers using AI assistance | **Prerequisites:** None

---

## AI-Slop

> 🚨 **Golden Rule:** AI is a co-pilot, not an autopilot. You are responsible for code quality, security, and compliance.

⚡ **Blindly accepting AI-generated code feels fast.** You save 5 minutes writing code or reviewing a PR. Then you lose those 5 minutes—**and much more**—later when bugs surface and technical debt accumulates:

### Timeline: What "Saving Time" Really Costs

| Time | Event | Impact |
|------|-------|--------|
| T+0min | ✅ AI generates code in seconds | Feels productive |
| T+5min | 🚀 You commit without reading it | No review friction |
| T+1hr | 👀 Code review: "What is this doing?" | Questions arise |
| T+2hr | 😅 Revert, rewrite, re-review | The real cost begins |
| T+3hr | 🐛 Bug appears in production | Users report issues |
| T+1week | 🛠️ Technical debt backlog grows | More rework needed |
| T+6months | 💸 "Why is everything so slow?" | Systemic slowdown |

**📊 Total cost: 1000x the 5 minutes you "saved"**

---

### The Compound Interest Problem

| Aspect | ❌ Skip Review | ✅ Review Properly |
|--------|-----------|-----------------|
| **Time Saved** | 5 min | 3 min |
| **Technical Debt** | ∞ | Low |
| **Review Cycles** | +10min | None |
| **Prod Bugs** | +2 hours | None |
| **Refactoring** | +1 week | Minimal |
| **ROI** | **Negative** | **+200%** |

### Common "Slop" Patterns to Catch

AI-generated code often exhibits predictable weaknesses. These **code smells** indicate problems that require deeper investigation:

#### 🔴 Critical (Security & Data Loss)

| Pattern | Red Flag | Why It Matters |
|---------|----------|---|
| 🛡️ **Exposed internals** | Raw objects passed to external layers | Security & API brittleness |
| ✅ **Missing validation** | Accepts user input without checking | Injection attacks, data corruption |
| 🚨 **Silent data loss** | Catches errors without logging/rethrowing | Bugs disappear into void |

#### 🟠 High (Performance & Stability)

| Pattern | Red Flag | Why It Matters |
|---------|----------|---|
| ⚡ **N+1 queries** | Database calls inside loops | Terrible performance at scale |
| 💥 **Missing error handling** | No try/catch, null checks, or fallbacks | Silent failures in production |
| 🎯 **Implicit assumptions** | Assumes happy path, ignores edge cases | Crashes on unexpected input |

#### 🟡 Medium (Maintainability & Testing)

| Pattern | Red Flag | Why It Matters |
|---------|----------|---|
| 🔢 **Magic numbers & strings** | Hardcoded values scattered throughout | Impossible to maintain |
| 📋 **Duplicated logic** | Similar code in multiple places | Inconsistencies when fixing bugs |
| 🎪 **God objects** | Huge functions/classes doing everything | Unmaintainable, impossible to test |
| 📦 **Too many parameters** | Functions with 5+ arguments | Hard to test, easy to confuse |

### The Bottom Line

> Reviewing AI code takes **20%** of the time you'd save by skipping review.
> Skipping review costs you **1000%** in technical debt.

The productivity gain is real—**but only if you do the work right.**

---

## What & Why

AI boosts productivity—but only with discipline. Every AI suggestion passes through **human checkpoints**, especially for security, complexity, and architecture. This project demonstrates a workflow where **you make the calls** and AI handles the grunt work.

### The Human-in-the-Loop Workflow

```
YOU PLAN          YOU CONFIRM      YOU REVIEW       YOU APPROVE
   ↓                 ↓                ↓                ↓
@Specify → [✅ You] → @Implement → [✅ You] → @Test → [✅ You] → Merge
   
Key: AI generates ideas. You decide what ships.
```

**Critical approval points (all require human sign-off):**
- ✅ **Specification** – Scope & acceptance criteria
- ✅ **Implementation** – Each code change confirmed
- ✅ **Testing** – Results validated, edge cases checked
- ✅ **Merge** – Final review before production

This isn't "let AI do the work." It's "let AI do the repetitive work while you focus on quality, security, and decision-making."

---

## AI-Assisted Version Control

Copilot provides built-in features for version control tasks. Use them, but review the output.

### Available Features

| Feature | Access | Review Requirement |
|---------|--------|-------------------|
| **Commit Messages** | Sparkle icon in Source Control | ✅ Review before commit |
| **PR Descriptions** | GitHub PR extension | ✅ Review before opening |
| **Merge Conflict Resolution** | "Resolve with AI" button | ⚠️ **Careful review** required |
| **Code Review** | Right-click → Review | Use as input, not final answer |

### 💬 Commit Message Generation

The AI summarizes staged changes into a commit message. **You decide if it's accurate.**

#### Workflow Comparison

| Step | ✅ Good Workflow | ⚠️ Bad Workflow |
|------|-----------------|-----------------|
| 1 | Stage changes | Stage changes |
| 2 | Click sparkle → Generate message | Click sparkle → Generate message |
| 3 | **Read & edit** the message | Accept blindly |
| 4 | Commit | Commit |

#### Verification Checklist

Before committing an AI-generated message:
- [ ] 📝 Message accurately describes all changes
- [ ] 🔒 No sensitive information included
- [ ] 📋 Follows project conventions (if any)

### Merge Conflict Resolution

> ⚠️ **High risk.** AI may choose the wrong resolution.

```
Conflict: Both branches modified the same function

AI suggestion: Keep branch A changes
Reality: Branch B has the critical fix

→ Always verify merge resolutions line-by-line
```

**When to use AI for conflicts:**
- Simple text conflicts (documentation, comments)
- Obvious additions (new imports, new functions)

**When to resolve manually:**
- Logic changes in the same function
- Security-related code
- Complex refactors

---

## When to Use AI vs. Manual

| Task Category | ✅ AI Excels | ⚠️ You Handle |
|---|---|---|
| **Boilerplate** | Following conventions | ❌ Never skip review |
| **Testing** | Scaffolding, setup | Security-critical tests |
| **Refactoring** | Within patterns | Novel architecture |
| **Docs** | Initial drafts, formatting | Security docs |
| **Features** | Initial drafts | Complex logic, auth, encryption |

**Golden Rule:** If it involves security, novel decisions, or your domain's core logic—you write it.

---

## Related

- [Security Guide](./SECURITY.md) – Data privacy, MCP security, incident response
- [Custom Agents](./CUSTOM_AGENTS.md) – Agent configurations and workflows
- [Custom Instructions](./CUSTOM_INSTRUCTIONS.md) – Project-specific AI guidance
- [AI Development Guide](./AI_DEVELOPMENT_GUIDE.md) – Complete workflow overview
- [GitHub Copilot Trust Center](https://copilot.github.trust.page/)
