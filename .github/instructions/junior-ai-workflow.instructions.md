---
description: 'AI-native junior developer workflow: Cognitive Forcing Functions, Plan-Act-Verify protocol, Ghost Text policy, and agent selection guide. Ensures junior developers build genuine understanding rather than becoming passive AI operators.'
applyTo: '**'
---

# Junior AI Workflow – Cognitive Forcing Functions

This instruction defines the non-negotiable workflow discipline for junior developers using AI tools in this project. Its purpose is to ensure AI assistance builds engineering capability rather than creating dependency.

> **Why this exists:** AI code generation decouples production from comprehension. Without deliberate friction, juniors produce working code they cannot explain — leaving them helpless at the production incident that matters most.

---

## The Core Distinction: Vibe Coding vs. Engineering

| Vibe Coding | Engineering |
|-------------|-------------|
| Prompt → code → done | Spec → plan → implement → verify |
| Accepts first output | Critically reviews every output |
| Velocity as the goal | Comprehension as the constraint |
| Appropriate for: throwaway prototypes | Required for: all production code |

**Junior developers must be in Engineering mode for all production work.** Vibe Coding is only acceptable for isolated sandbox experiments, never for code that will be reviewed or merged.

---

## Ghost Text Policy

**Inline autocomplete (Ghost Text) must be disabled during active implementation for junior developers.**

Rationale: Concurrent suggestion presentation prevents the formation of a mental model. When code appears before thought completes, the junior learns to select rather than to design.

**When Ghost Text is acceptable:**
- Completing boilerplate (import statements, closing brackets)
- After the junior has already written the logical skeleton themselves
- For repetitive patterns in a file the junior already fully understands

**How to disable in VS Code:**
`Settings → Editor: Inline Suggest Enabled → false`

---

## The Plan-Act-Verify Protocol

Every implementation task must follow this 3-phase protocol. No phase may be skipped.

### PLAN — Human Checkpoint Required

Before any AI generates code:

1. Write the pseudocode plan in plain English (no syntax)
2. Identify edge cases: "What could go wrong at each step?"
3. Route to `@Spec-First` to formalize the plan
4. The approved spec is saved to `.ai/plans/{issue}/spec.md`

**Cognitive Forcing Function:** The junior must explicitly approve the plan in writing before implementation begins. "I'll figure it out as I go" is not planning.

### ACT — Observe, Do Not Auto-Pilot

Once the spec is approved and `@Implement` is generating:

1. Read every generated line as it appears
2. Stop the agent if something looks wrong — do not let it continue blindly
3. Note any line you do not fully understand — these are comprehension gaps to address in VERIFY

**Cognitive Forcing Function:** The junior cannot request further generation until they can explain the last generated block.

### VERIFY — Hypothesis Before Fix

When tests fail or an error appears:

1. Form a hypothesis: "I think the problem is [X] because [Y]"
2. State this hypothesis in chat before asking for help
3. Do not click "Auto-Fix" — explain what you want to change and why
4. Route to `@Socratic-Mentor` if you cannot form a hypothesis

**Cognitive Forcing Function:** "I don't know what's wrong" is not a starting point for AI assistance. The minimum input is: "I think the issue might be in [area], possibly because [reason]."

---

## When to Use Which Agent

| Situation | Route To |
|-----------|----------|
| Don't understand a concept before writing code | `@Socratic-Mentor` |
| Ready to formalize a plan for a feature | `@Spec-First` |
| Spec approved, ready to build | `@Implement` (with spec file reference) |
| Implementation complete, want to ensure understanding | `@Code-Review-Trainer` |
| Want to practice finding bugs in AI-generated code | `@Bebugging` |
| Want to write tests for completed code | `@Test-Unit` |
| Want to validate full user flows | `@Test-E2E` |

**Do not skip `@Socratic-Mentor` or `@Spec-First`.** Routing directly to `@Implement` without a spec is the primary way juniors create code they cannot explain.

---

## Context Discipline — The Memory Axiom

The AI has no memory across conversations. The junior must be the keeper of context.

**Before starting any AI session, the junior must be able to answer:**
1. What am I trying to accomplish? (Feature goal)
2. What have I already tried? (Ruled out paths)
3. What is my current hypothesis? (The most likely cause / approach)

**Rubber Duck Test:** If you cannot explain your goal and current state to the AI in 3 sentences, you are not ready to use the AI on this problem. Spend 5 minutes writing it out first.

---

## Comprehension Gates

The following gates are non-negotiable. Work cannot advance without passing them.

| Gate | When | Enforced By |
|------|------|-------------|
| **Prediction-First** | Before any implementation discussion | `@Socratic-Mentor` |
| **Spec Approval** | Before `@Implement` runs | `@Spec-First` |
| **AutoMCQ Check** | After implementation, before tests | `@Code-Review-Trainer` |
| **Bebugging Session** | Periodically, to maintain audit skills | `@Bebugging` |

---

## AI-ism Awareness

These patterns are common in AI-generated code and indicate lack of review:

| Pattern | Risk | What to check |
|---------|------|----------------|
| `cors({ origin: '*' })` | Security: allows all origins | Does this endpoint need to be public? |
| Direct `req.body` to Prisma | Injection: mass assignment | Explicitly whitelist every field |
| Missing `await` on async call | Logic: returns Promise not data | TypeScript may not catch this |
| `npm install [unknown-package]` | Supply chain: hallucinated package | Verify the package exists on npm |
| Empty `catch` blocks | Silent failure | What should happen when this fails? |
| `allow_all_origins: true` | Security: CORS misconfiguration | Same as the CORS pattern above |
| hardcoded credentials | Security: secret exposure | Use environment variables |

**Review every AI-generated file for these patterns before marking a task complete.**

---

## SDD Maturity Self-Assessment

Use this to understand where you currently stand:

| Level | You Know You're Here When... |
|-------|------------------------------|
| **Spec-Aware** | You can read a spec and implement against it without help |
| **Spec-Led** | You can write the spec yourself before any code is touched |
| **Spec-as-Source** | You write the spec first, treat it as ground truth, and regenerate code when the spec changes |

The goal is to reach **Spec-as-Source**. Every `@Spec-First` session moves you one step closer.
