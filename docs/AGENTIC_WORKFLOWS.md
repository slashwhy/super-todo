# 🔄 Agentic Workflows & CI

> Two complementary AI automation layers: local VS Code agents for interactive development, and server-side GitHub Agentic Workflows for autonomous repo maintenance.

**Audience:** Developers using or extending automation | **Prerequisites:** [Custom Agents][custom-agents], [AI Development Guide][ai-guide]

## 📋 Quick Reference

### CI Pipeline

| Job               | Command                           | Depends On   |
| ----------------- | --------------------------------- | ------------ |
| **Lint**          | `cd frontend && npm run lint`     | —            |
| **Test Frontend** | `cd frontend && npm run test:run` | —            |
| **Test Backend**  | `cd backend && npm run test:run`  | —            |
| **Build**         | `cd frontend && npm run build`    | Lint + Tests |

> Triggers on pull requests to `main`. See [`.github/workflows/ci.yml`][ci-yml].

### Agentic Workflows

| Workflow                             | Trigger                                        | Purpose                                                | Outputs            |
| ------------------------------------ | ---------------------------------------------- | ------------------------------------------------------ | ------------------ |
| [**Continuous Docs**][wf-docs]       | Weekly + manual                                | Validate docs against code, fix drift                  | Draft PR           |
| [**Code Simplifier**][wf-simplifier] | Weekly (Monday) + manual                       | Detect complexity, duplication, non-idiomatic patterns | Draft PR           |
| [**Security Reviewer**][wf-security] | Weekly (Wednesday) + `/security-review` on PRs | OWASP vulnerability scanning                           | Issue or PR review |

## 🌐 Overview

This project uses **two complementary AI layers** that serve different purposes:

| Aspect      | VS Code Agents                      | Agentic Workflows                   |
| ----------- | ----------------------------------- | ----------------------------------- |
| **Where**   | Your IDE (local)                    | GitHub Actions (server-side)        |
| **When**    | During development, on demand       | On schedule or events, autonomously |
| **How**     | Interactive chat, human-in-the-loop | Event-driven, autonomous execution  |
| **Purpose** | Help you write code                 | Maintain repo quality               |
| **Overlap** | None — they are complementary       | None — they are complementary       |

## 🤖 VS Code Agents (`.github/agents/`)

Interactive AI personas that run **locally in your IDE**. They do NOT run in CI — they assist you during development.

| Agent                   | Role                     | Model      | Writes Code |
| ----------------------- | ------------------------ | ---------- | :---------: |
| **@Specify & Validate** | Planning & validation    | Opus 4.6   |     ❌      |
| **@Implement**          | Feature implementation   | Sonnet 4.6 |     ✅      |
| **@Test Unit**          | Unit & integration tests | Sonnet 4.6 |     ✅      |
| **@Test E2E**           | End-to-end tests         | Sonnet 4.6 |     ✅      |
| **@Onboarding**         | Project orientation      | Sonnet 4.6 |     ❌      |
| **@socratic-mentor**    | Pedagogical tutoring     | Opus 4.6   |     ❌      |

These remain unchanged. See [Custom Agents][custom-agents] for details.

## ⚡ GitHub Agentic Workflows (`.github/workflows/*.md`)

AI-powered GitHub Actions that run **autonomously on the server**. They use natural language instructions compiled to GitHub Actions YAML.

### How They Work

```
.md (Markdown + YAML frontmatter)
    ↓  gh aw compile
.lock.yml (GitHub Actions YAML)
    ↓  push to repo
GitHub Actions (runs autonomously)
    ↓  safe-outputs
Draft PR / Issue / Comment
    ↓  human review
Merge or close
```

### Security Model

- **Read-only by default** — Main job has minimal permissions (`contents: read`)
- **Safe outputs** — Write operations (PRs, issues, comments) are handled by separate secured jobs
- **Sandboxed execution** — Workflows run in the Agent Workflow Firewall (AWF)
- **Draft PRs** — All code changes are draft PRs requiring human review

### Continuous Documentation

**File:** `.github/workflows/continuous-docs.md`
**Trigger:** Weekly schedule + manual (`workflow_dispatch`)

Reviews all documentation files and validates they match the current codebase:

- API endpoints match route handlers
- Data model descriptions match Prisma schema
- CLI commands match `package.json` scripts
- Internal links resolve correctly

Creates a draft PR with fixes if issues found. Does nothing if everything is accurate.

### Code Simplifier

**File:** `.github/workflows/code-simplifier.md`
**Trigger:** Weekly on Monday + manual (`workflow_dispatch`)

Analyzes TypeScript and Vue files for code quality issues:

- Overly complex functions (>30 lines)
- Deep nesting (>3 levels)
- Duplicated logic across files
- Unused imports
- Non-idiomatic patterns (per project conventions in `.github/instructions/`)

Creates at most 1 draft PR per run. All changes must preserve behavior.

### Security Reviewer

**File:** `.github/workflows/security-reviewer.md`
**Trigger:** Weekly on Wednesday + `/security-review` command on PRs

Scans for OWASP Top 10 vulnerabilities adapted to this stack:

- Injection (SQL via Prisma raw queries, command injection)
- XSS (`v-html` with unsanitized input)
- Mass assignment (`req.body` passed directly to Prisma)
- Security misconfiguration (CORS, headers, error exposure)
- Insecure dependencies

**Scheduled runs:** Scan full codebase → create issue with findings
**`/security-review` on PR:** Review PR diff → post comment with findings

## 🛠️ Setup Guide

### Prerequisites

- [GitHub CLI (`gh`)](https://cli.github.com/)
- `gh-aw` extension: `gh extension install github/gh-aw`

### Compiling Workflows

After creating or modifying a `.md` workflow, compile it to generate the GitHub Actions YAML:

```bash
# Compile all workflows
gh aw compile

# Compile a specific workflow
gh aw compile continuous-docs

# Compile with strict security checks
gh aw compile --strict
```

Both the `.md` source and `.lock.yml` compiled output must be committed.

### Running Manually

```bash
# Trigger a workflow run
gh aw run continuous-docs

# View logs
gh aw logs continuous-docs
```

Or use the GitHub Actions UI → "Run workflow" button.

### Triggering Security Review on a PR

Comment `/security-review` on any pull request to trigger an on-demand security scan.

## ✍️ Creating New Agentic Workflows

1. Create `.github/workflows/my-workflow.md` with YAML frontmatter and markdown instructions
2. Compile: `gh aw compile my-workflow`
3. Commit both `.md` and `.lock.yml`
4. Push — the workflow will run on its configured triggers

**Frontmatter template:**

```yaml
---
description: Brief description of what this workflow does
on:
  schedule: weekly
  workflow_dispatch:
permissions:
  contents: read
  actions: read
tools:
  github:
    toolsets: [default]
safe-outputs:
  create-pull-request:
    draft: true
    labels: [automation]
engine: copilot
---
```

> 📖 **Official Docs:** [GitHub Agentic Workflows](https://github.github.com/gh-aw/)

## 📚 Samples & Reference

### Sample Workflows

The [gh-aw repository](https://github.com/github/gh-aw/tree/main/.github/workflows) contains **100+ production workflows** that serve as reference implementations. Notable examples relevant to this project:

| Workflow                                  | Purpose                         | Key Patterns                                        |
| ----------------------------------------- | ------------------------------- | --------------------------------------------------- |
| [`code-simplifier.md`][sample-simplifier] | Detect complexity & duplication | `skip-if-match`, phased analysis, test validation   |
| [`security-review.md`][sample-security]   | OWASP vulnerability scanning    | PR review comments, `cache-memory`, status messages |
| [`daily-doc-updater.md`][sample-docs]     | Keep docs in sync with code     | `cache-memory`, diff-based updates                  |
| [`ci-doctor.md`][sample-ci-doctor]        | Diagnose CI failures            | `issue_comment` trigger, ChatOps pattern            |
| [`auto-triage-issues.md`][sample-triage]  | Classify & label new issues     | `issues.opened` trigger, label safe outputs         |
| [`grumpy-reviewer.md`][sample-reviewer]   | Opinionated PR review           | PR review comments, persona prompting               |

Browse the [full gallery](https://github.github.com/gh-aw/index.html#gallery) for categorized examples (Issue Management, Documentation, Quality, Metrics, etc.).

### Frontmatter Quick Reference

All frontmatter parameters available between `---` markers. See the [full Frontmatter Reference](https://github.github.com/gh-aw/reference/frontmatter/) for details.

| Parameter         | Type             | Description                                                                                                                              |
| ----------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `description`     | `string`         | Human-readable workflow description                                                                                                      |
| `on`              | `object`         | [Trigger events](https://github.github.com/gh-aw/reference/triggers/) (schedule, issues, pull_request, workflow_dispatch, etc.)          |
| `on.roles`        | `array`          | Repository roles allowed to trigger (`admin`, `maintainer`, `write`, `read`, `all`)                                                      |
| `on.skip-roles`   | `array`          | Roles to skip execution for                                                                                                              |
| `on.skip-bots`    | `array`          | Bot accounts to skip execution for                                                                                                       |
| `permissions`     | `object`         | [GitHub Actions permissions](https://github.github.com/gh-aw/reference/permissions/) (`contents`, `issues`, `pull-requests`, etc.)       |
| `tools`           | `object`         | [Available tools](https://github.github.com/gh-aw/reference/tools/) (`github`, `edit`, `bash`, `mcp-servers`)                            |
| `safe-outputs`    | `object`         | [Write operations](https://github.github.com/gh-aw/reference/safe-outputs/) (`create-pull-request`, `create-issue`, `add-comment`, etc.) |
| `engine`          | `string\|object` | [AI engine](https://github.github.com/gh-aw/reference/engines/) (`copilot`, `claude`, `codex`) with optional `model` override            |
| `strict`          | `boolean`        | Enhanced security validation (default: `true`)                                                                                           |
| `timeout-minutes` | `number`         | Max execution time (default: `20`)                                                                                                       |
| `runs-on`         | `string`         | Runner type (default: `ubuntu-latest`)                                                                                                   |
| `concurrency`     | `object`         | [Concurrency control](https://github.github.com/gh-aw/reference/concurrency/) to prevent parallel runs                                   |
| `network`         | `object`         | [Network access](https://github.github.com/gh-aw/reference/network/) allowlist (ecosystem identifiers + custom domains)                  |
| `imports`         | `array`          | [Reusable configs](https://github.github.com/gh-aw/reference/imports/) from shared workflows                                             |
| `cache`           | `object`         | GitHub Actions cache configuration                                                                                                       |
| `steps`           | `array`          | Custom steps before agentic execution                                                                                                    |
| `post-steps`      | `array`          | Custom steps after agentic execution                                                                                                     |
| `jobs`            | `object`         | Custom jobs running before the agentic job                                                                                               |
| `env`             | `object`         | Workflow-level environment variables                                                                                                     |
| `secrets`         | `object`         | Secret values passed to workflow execution                                                                                               |
| `environment`     | `string`         | Environment for deployment protection rules                                                                                              |
| `if`              | `string`         | Conditional execution expression                                                                                                         |
| `labels`          | `array`          | Categorization labels for `gh aw status`                                                                                                 |
| `runtimes`        | `object`         | Override default runtime versions (node, python, go, etc.)                                                                               |
| `plugins`         | `array\|object`  | Experimental plugin support                                                                                                              |
| `features`        | `object`         | Feature flags (`action-mode`, etc.)                                                                                                      |

### Key Documentation Links

| Topic                                  | URL                                                            |
| -------------------------------------- | -------------------------------------------------------------- |
| **Overview**                           | https://github.github.com/gh-aw/introduction/overview/         |
| **Quick Start**                        | https://github.github.com/gh-aw/setup/quick-start/             |
| **Creating Workflows**                 | https://github.github.com/gh-aw/setup/creating-workflows/      |
| **CLI Commands**                       | https://github.github.com/gh-aw/setup/cli/                     |
| **Frontmatter Reference**              | https://github.github.com/gh-aw/reference/frontmatter/         |
| **Frontmatter (Full)**                 | https://github.github.com/gh-aw/reference/frontmatter-full/    |
| **Safe Outputs**                       | https://github.github.com/gh-aw/reference/safe-outputs/        |
| **Tools**                              | https://github.github.com/gh-aw/reference/tools/               |
| **AI Engines**                         | https://github.github.com/gh-aw/reference/engines/             |
| **Network Access**                     | https://github.github.com/gh-aw/reference/network/             |
| **Cache & Memory**                     | https://github.github.com/gh-aw/reference/memory/              |
| **Security Architecture**              | https://github.github.com/gh-aw/introduction/architecture/     |
| **Schedule Syntax**                    | https://github.github.com/gh-aw/reference/schedule-syntax/     |
| **FAQ**                                | https://github.github.com/gh-aw/reference/faq/                 |
| **Common Issues**                      | https://github.github.com/gh-aw/troubleshooting/common-issues/ |
| **Patterns (ChatOps, IssueOps, etc.)** | https://github.github.com/gh-aw/patterns/chatops/              |

## 🔀 Agent vs. Workflow — When to Use What

| Need                              | Use                                        |
| --------------------------------- | ------------------------------------------ |
| Plan a feature interactively      | VS Code Agent (`@Specify`)                 |
| Implement code with guidance      | VS Code Agent (`@Implement`)               |
| Write tests with context          | VS Code Agent (`@Test Unit` / `@Test E2E`) |
| Keep docs in sync automatically   | Agentic Workflow (Continuous Docs)         |
| Detect code quality issues weekly | Agentic Workflow (Code Simplifier)         |
| Scan for security vulnerabilities | Agentic Workflow (Security Reviewer)       |
| Lint/test/build on every PR       | CI Pipeline (`ci.yml`)                     |

**Rule of thumb:**

- **Interactive, needs human judgment** → VS Code Agent
- **Autonomous, runs on schedule/events** → Agentic Workflow
- **Deterministic, no AI needed** → Traditional CI

## 🔗 Related

- [Custom Agents][custom-agents] — VS Code agent definitions and skills
- [AI Development Guide][ai-guide] — Full overview of AI-assisted development
- [Developer Responsibilities][responsibilities] — Your accountability with AI tools
- [Security Guide][security] — Security safeguards and best practices

<!-- Documentation -->

[custom-agents]: ./CUSTOM_AGENTS.md
[ai-guide]: ./AI_DEVELOPMENT_GUIDE.md
[responsibilities]: ./RESPONSIBILITIES.md
[security]: ./SECURITY.md

<!-- Workflow Files -->

[ci-yml]: ../.github/workflows/ci.yml
[wf-docs]: ../.github/workflows/continuous-docs.md
[wf-simplifier]: ../.github/workflows/code-simplifier.md
[wf-security]: ../.github/workflows/security-reviewer.md

<!-- Sample Workflows (gh-aw repo) -->

[sample-simplifier]: https://github.com/github/gh-aw/blob/main/.github/workflows/code-simplifier.md
[sample-security]: https://github.com/github/gh-aw/blob/main/.github/workflows/security-review.md
[sample-docs]: https://github.com/github/gh-aw/blob/main/.github/workflows/daily-doc-updater.md
[sample-ci-doctor]: https://github.com/github/gh-aw/blob/main/.github/workflows/ci-doctor.md
[sample-triage]: https://github.com/github/gh-aw/blob/main/.github/workflows/auto-triage-issues.md
[sample-reviewer]: https://github.com/github/gh-aw/blob/main/.github/workflows/grumpy-reviewer.md
