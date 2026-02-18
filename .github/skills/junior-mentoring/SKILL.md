---
name: junior-mentoring
description: 'Pedagogical patterns for AI-native junior developer training. Provides Socratic questioning templates, AutoMCQ question patterns, AI-ism detection catalogue, bebugging bug types, and SDD maturity assessment rubric. Use when running any mentoring, comprehension-checking, or code-review-training session.'
---

# Junior Mentoring Skill

This skill equips any agent operating in a pedagogical context with the patterns, templates, and catalogues needed to build genuine engineering capability in junior developers.

---

## 1. Socratic Questioning Patterns

The Socratic method works by asking questions that make the correct mental model obvious through reasoning, rather than by stating it.

### Opening Questions (Surface the current mental model)

```
"What do you already know about [concept]?"
"Walk me through what you think happens when [action]."
"If you had to explain [X] to a non-developer, what would you say?"
"Before we look at code — what is [concept] trying to solve?"
```

### Hypothesis Probes (Sharpen the reasoning)

```
"Why do you think [X] causes [Y]?"
"What would you expect to see if that hypothesis is correct?"
"What evidence would rule out your hypothesis?"
"If you're right, what else would need to be true?"
```

### Alternative Contrast Questions (Prevent single-track thinking)

```
"What other approaches could solve this? What are the trade-offs?"
"Why [approach A] and not [approach B]?"
"Under what circumstances would the alternative be better?"
"What does [approach A] give up that [approach B] would have?"
```

### Depth Probes (Test for brittleness)

```
"When would that break down?"
"What assumptions are you relying on?"
"What happens if [edge condition]?"
"Does this still hold if [change one variable]?"
```

### Restatement Confirmations (Catch misunderstanding)

```
"Restate that in your own words."
"Give me an analogy for what [concept] is doing."
"If you had to teach this to someone else, what would be the most important thing to convey?"
```

---

## 2. AutoMCQ Question Templates

Three question types, always in this order. Questions must reference specific code in the implementation being reviewed.

### Q1: Logic-Check

Tests understanding of intentional design decisions.

**Templates:**
```
"Why was [operation X] placed before [operation Y]? What would happen if they were swapped?"
"Why does this function return early at [condition]? What would break if it continued?"
"Why is [data structure] used here instead of [simpler alternative]?"
"What is the purpose of the [guard/check] at line [N]?"
"The [method] is called with [argument] — why not [alternative argument]?"
```

**Evaluation criteria:** The answer must explain architectural intent, not just describe what the code does.

### Q2: Side-Effects

Tests understanding of second-order impact beyond the immediate function.

**Templates:**
```
"What state, cache, or store does this change affect outside of this function?"
"Which components/routes NOT directly edited will behave differently after this change, and why?"
"If 10 concurrent requests hit this endpoint, what could go wrong?"
"What happens in the Pinia store when this API call resolves?"
"Does this Prisma update trigger any cascading changes in related records?"
```

**Evaluation criteria:** The answer must identify at least one external dependency or shared state.

### Q3: Error-Handling

Tests understanding of failure modes and their user-facing consequences.

**Templates:**
```
"What happens if [external API] returns a 5xx here? What does the user see?"
"If this Prisma query finds nothing, what does the component render?"
"Where does an unhandled exception from this async function surface?"
"What is the user experience when [network request] times out?"
"If [foreign key] references a deleted record, which HTTP status does the client receive?"
```

**Evaluation criteria:** The answer must trace the failure path to its user-visible outcome.

---

## 3. AI-ism Detection Catalogue

"AI-isms" are patterns characteristic of AI-generated code that indicate insufficient review. A junior who learns to spot these has developed the audit skill needed to safely use AI at scale.

### Security AI-isms

| Pattern | Risk Level | Detection |
|---------|-----------|-----------|
| `cors({ origin: '*' })` | 🔴 High | CORS allows all origins — inject point for XSS |
| `req.body` passed directly to Prisma/ORM | 🔴 High | Mass assignment injection |
| Hardcoded credentials or API keys | 🔴 High | Secret exposure |
| `{ secure: false }` on production cookies | 🔴 High | Session hijacking risk |
| Missing `httpOnly: true` on session cookies | 🟠 Medium | XSS cookie theft |
| `eval()` on user input | 🔴 High | Remote code execution |

### Logic AI-isms

| Pattern | Risk Level | Detection |
|---------|-----------|-----------|
| Missing `await` on async call | 🟠 Medium | Returns Promise object not data |
| Empty or swallowed `catch` blocks | 🟠 Medium | Silent failures reach production |
| `||` vs `&&` confusion in guards | 🟠 Medium | Inverted authorization logic |
| Off-by-one in array bounds | 🟡 Low | Edge case failures |
| Mutation of function parameters | 🟡 Low | Shared reference bugs |

### Supply Chain AI-isms

| Pattern | Risk Level | Detection |
|---------|-----------|-----------|
| `import x from 'lodash.util'` (slight typo) | 🔴 High | Typosquatting — verify on npm |
| Hallucinated npm package names | 🔴 High | Non-existent packages |
| Unexplained new dependency in `package.json` | 🟠 Medium | Verify the package's reputation |

### Over-Engineering AI-isms

| Pattern | Risk Level | Detection |
|---------|-----------|-----------|
| Abstraction for a one-off operation | 🟡 Low | Generic utility no one else will use |
| Unnecessary defensive checks on internal APIs | 🟡 Low | Adds noise without value |
| Comments that describe what the code does (not why) | 🟡 Low | Documentation that will go stale |

---

## 4. Bebugging Bug-Type Catalogue

Reference for `@Bebugging` sessions. Inject only from this list. Each bug type must be:
- **Subtle:** Not caught by a linter or type checker alone
- **Realistic:** The kind of mistake AI actually makes
- **Educational:** Teaches a genuine review pattern

### Approved Bug Types

| Category | Bug Type | Injection Example |
|----------|----------|------------------|
| Logic | Off-by-one | `arr.length - 1` instead of `arr.length` |
| Logic | Wrong comparator | `>` instead of `>=` on boundary check |
| Logic | Inverted condition | `if (isAuthenticated)` instead of `if (!isAuthenticated)` |
| Logic | Wrong boolean operator | `&&` instead of `\|\|` in a guard |
| Async | Missing `await` | `const data = prisma.task.findMany()` |
| Async | Unhandled rejection | `.catch(() => {})` (swallowed) |
| Async | Wrong order | Reading state before async update resolves |
| Security | Over-permissive CORS | `origin: '*'` |
| Security | Mass assignment | `prisma.task.create({ data: req.body })` |
| Security | Insecure default | `{ secure: false, httpOnly: false }` |
| Data | Null dereference | `tasks[0].title` without null check |
| Data | Wrong array method | `.find()` when `.filter()` is needed |
| Data | Missing Prisma include | Query without `include: { status: true }` |
| Supply Chain | Hallucinated package | `import { deepMerge } from 'deep-merger-utils'` |

---

## 5. SDD Maturity Assessment Rubric

Use this rubric to assess a junior developer's current Spec-Driven Development maturity and guide their progression.

### Level 1: Spec-Aware (Junior)

**Indicators:**
- Can implement against an existing, detailed spec
- Needs explicit AC to know when they're done
- Cannot produce a spec independently

**Coaching approach:**
- Always provide structured specs with EARS criteria
- Ask them to identify which AC each piece of code satisfies
- Use `@Socratic-Mentor` to build conceptual foundations

**Target:** Ask them to rewrite a spec they followed, in their own words — after implementation.

---

### Level 2: Spec-Led (Mid-Level)

**Indicators:**
- Can write User Stories and draft AC before coding
- Uses specs to drive their own work
- Can identify untestable criteria after prompting

**Coaching approach:**
- Enforce EARS notation strictly via `@Spec-First`
- Require edge case hypotheses before implementation
- Challenge their AC with "How would you test that?"

**Target:** Have them write a spec from a vague feature request, then implement against it unassisted.

---

### Level 3: Spec-as-Source (Senior)

**Indicators:**
- Treats the spec as the authoritative source; code is derived from it
- Can regenerate code from an updated spec
- Identifies spec gaps proactively during discussion
- Writes AC that another developer could implement correctly without conversation

**Coaching approach:**
- Involve them in spec review for other juniors
- Discuss spec design trade-offs (granularity, coupling)
- Encourage them to use `@Spec-First` as a documentation tool, not just a gate

---

## 6. Plan-Act-Verify Quick Reference

For any pedagogical agent facilitating the core workflow:

```
PLAN
└── Junior writes pseudocode plan
└── @Spec-First validates and saves spec
└── Explicit approval before generation

ACT
└── Junior observes generation
└── Stops if something looks wrong
└── Must explain last block before more generation

VERIFY
└── Junior forms hypothesis before debugging
└── States hypothesis in chat before AI help
└── No "Auto-Fix" without explanation
└── @Socratic-Mentor if no hypothesis possible
```

---

## 7. Centaur-Team Role Definitions

The mature end-state for AI-native engineering teams:

### Junior as Architect (not Typist)
The junior defines intent, structure, and constraints. The AI translates to syntax. The junior verifies and takes ownership.

### AI as Translator (not Author)
The AI converts the junior's well-formed intent into syntactically correct code. It does not make architectural decisions — those come from the spec.

### Senior as Reviewer (not Rescuer)
The senior reviews the junior's spec quality and comprehension, not the generated code quality. The audit happens at the spec level, not the implementation level.
