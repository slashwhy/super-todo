# 🎓 🤖 AI-Assisted Development Showcase

> 🔄 **Living Project** – Continuously updated with the latest AI-assisted development practices, patterns, and learnings.

> **Vue 3 Todo Dashboard** – A **reference implementation** demonstrating multi-agent AI development with **GitHub Copilot** and **Claude Code**.
>
> This project showcases **how professional teams use AI to boost productivity while maintaining quality, safety, and developer control**.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0-yellow?logo=vue.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma&logoColor=white)

---

## 🚨 Developer Responsibilities

> **AI is a co-pilot, not an autopilot.** You are responsible for code quality, security, and compliance.

### Your Accountability

|     | Responsibility | Action                                                      |
| --- | -------------- | ----------------------------------------------------------- |
| 👁️  | **Review**     | Read and understand all AI-generated code before committing |
| ✅  | **Validate**   | Check against requirements and project standards            |
| 🧪  | **Test**       | Run full test suite before merging                          |
| 🔒  | **Security**   | Verify auth, credentials, and data handling                 |
| 💡  | **Understand** | Know what changed and why it changed                        |

📖 **[Read the full guide →][responsibilities]** – detailed checklists on developer accountability and AI-assisted workflows (see SECURITY.md for security and incident response)

## 📖 Let's start

**New to this project?** Begin with the **[AI Development Guide][ai-guide]** for a complete overview of agents, instructions, MCP, and how everything works together.

**In This README:**

- [Developer Responsibilities](#-developer-responsibilities) – Your accountability when working AI-Assisted
- [Getting Started](#-getting-started) – Run locally in 3 steps
- [Tech Stack](#-tech-stack) – Technologies used

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        GitHub Copilot Agent Mode                             │
├──────────────────────────────────────────────────────────────────────────────┤
│  Agents (8)           │  Instructions (10)    │  Skills (11)                 │
│  ├── Implement        │  ├── Global           │  ├── Architectural Docs      │
│  ├── Specify          │  ├── Backend Routes   │  ├── Backend Routes          │
│  ├── Test Unit        │  ├── Pinia Stores     │  ├── Code Documentation      │
│  ├── Test E2E         │  ├── Prisma Database  │  ├── E2E Testing             │
│  ├── Feature Tester   │  ├── Styling          │  ├── Pinia Stores            │
│  ├── Onboarding       │  ├── Testing Backend  │  ├── Prisma Database         │
│  ├── Socratic Mentor  │  ├── Testing E2E      │  ├── Security Review         │
│  └── Agentic Workflows│  ├── Testing Frontend │  ├── Styling                 │
│                       │  ├── Vue Components   │  ├── Unit Testing            │
│                       │  └── Vue Composables  │  ├── Vue Components          │
│                       │                       │  └── Vue Composables         │
├──────────────────────────────────────────────────────────────────────────────┤
│  Prompts (10)                                                                │
│  ├── Generate API Endpoint     ├── Generate Pinia Store                      │
│  ├── Generate Component        ├── Generate Unit Test                        │
│  ├── Generate E2E Test         ├── Review Security                           │
│  ├── Specify                   ├── Implement                                 │
│  ├── Onboard                   └── Mentor                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  MCP Integrations (4)                                                        │
│  ├── Atlassian (Jira/Confluence)     ├── Chrome DevTools                     │
│  ├── Figma Desktop                   └── Playwright                          │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         Claude Code (CLI)                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  Agents (7)           │  Instructions         │  Built-in Skills (6)         │
│  ├── @specify         │  ├── CLAUDE.md (root) │  ├── /code-review            │
│  ├── @implement       │  │   @AGENTS.md       │  ├── /security-review        │
│  ├── @test-unit       │  ├── frontend/        │  ├── /verify                 │
│  ├── @test-e2e        │  │   CLAUDE.md        │  ├── /run                    │
│  ├── @feature-tester  │  └── backend/         │  ├── /init                   │
│  ├── @onboarding      │      CLAUDE.md        │  └── /fewer-permission-prompts│
│  └── @mentor          │                       │                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  Slash Commands (12)              │  Hooks (.claude/settings.json)           │
│  ├── /specify, /implement         │  ├── PreToolUse: safety-guard            │
│  ├── /test-unit, /test-e2e        │  └── PostToolUse: auto-format            │
│  ├── /generate-component          │                                          │
│  ├── /generate-api-endpoint       │  Plan Mode · Auto Memory                 │
│  ├── /generate-pinia-store        │  Worktree Isolation · CronCreate         │
│  └── /security-review, /onboard   │                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│  MCP Integrations (4 — same as Copilot, configured in .mcp.json)             │
│  ├── Atlassian (Jira/Confluence)     ├── Chrome DevTools                     │
│  ├── Figma Desktop                   └── Playwright                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 🛠 Tech Stack

| Layer        | Stack                              | Details                               |
| ------------ | ---------------------------------- | ------------------------------------- |
| **Frontend** | Vue 3 + TypeScript + Vite          | [frontend/README.md][frontend-readme] |
| **Backend**  | Express + Prisma + PostgreSQL      | [backend/README.md][backend-readme]   |
| **Testing**  | Vitest, Playwright                 | Unit & E2E                            |
| **AI**       | GitHub Copilot + Claude Code, Custom Agents, MCP | See [docs/][ai-guide], [Claude Code][claude-code-guide] |

## 🚀 Getting Started

### Prerequisites

- Node.js `>=22.12.0`
- Docker (for PostgreSQL)
- **VS Code** with [GitHub Copilot Extension][copilot-extension] — for the Copilot agent system
- **Claude Code CLI** (`npm install -g @anthropic-ai/claude-code`) — for the terminal-native agent system

### Quick Start (Dev Container – Recommended)

For a **secure, isolated development environment**, use Dev Containers:

1. Install the [Dev Containers extension][devcontainers-extension]
2. Open Command Palette (`Cmd+Shift+P`) → **"Dev Containers: Reopen in Container"**
3. Wait for container to build (first time takes ~2 minutes)
4. Run `whoami` in terminal to verify non-root user (should show `node`)

The container automatically installs dependencies, starts PostgreSQL, and runs migrations.

### Quick Start (Local)

```bash
# Clone and install all dependencies
git clone <repository-url>
cd todo_app
npm run install:all

# Start backend (requires Docker)
cd backend
docker compose up -d
npm run db:migrate && npm run db:seed
npm run dev                    # API → http://localhost:3000

# Start frontend (new terminal)
cd frontend
npm run dev                    # App → http://localhost:5173
```

### Workspace Scripts

| Command               | Description                           |
| --------------------- | ------------------------------------- |
| `npm run dev`         | Start frontend & backend concurrently |
| `npm run install:all` | Install all dependencies              |
| `npm run test`        | Run all tests                         |
| `npm run test:e2e`    | Run Playwright E2E tests              |

📖 See [frontend/README.md][frontend-readme] and [backend/README.md][backend-readme] for full command reference.

## 🔗 Official Resources

### GitHub Copilot Documentation

| Resource                                                 | Purpose                                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [What is GitHub Copilot?][copilot-what-is]               | Overview and capabilities                                                       |
| [Response Customization][copilot-response-customization] | Examples and best practices                                                     |
| [Customization Cheat Sheet][copilot-cheat-sheet]         | Compare all customization features (instructions, agents, prompts, skills, MCP) |
| [Trust Center][copilot-trust-center]                     | Security, privacy, and compliance                                               |

### Claude Code Documentation

| Resource | Purpose |
|---|---|
| [What is Claude Code?][claude-code-what-is] | Overview, installation, and CLI reference |
| [CLAUDE.md Memory System][claude-code-memory] | How CLAUDE.md hierarchy and auto memory work |
| [Settings Reference][claude-code-settings] | Hooks, permissions, mcpServers configuration |
| [Claude Code GitHub][claude-code-github] | Issues, changelog, and IDE extensions |

### Model Context Protocol

| Resource                                  | Purpose                        |
| ----------------------------------------- | ------------------------------ |
| [MCP Official Site][mcp-site]             | Introduction and core concepts |
| [MCP Architecture][mcp-architecture]      | How MCP works under the hood   |
| [Building MCP Servers][mcp-build-servers] | Create custom MCP integrations |

### Learning & Inspiration

| Resource                                               | Purpose                                             |
| ------------------------------------------------------ | --------------------------------------------------- |
| [Awesome Copilot][awesome-copilot]                     | Community examples and best practices               |
| [Customization Library][copilot-customization-library] | Official curated examples of customization features |

## 📄 About This Project

🎓 **Reference Implementation** – This is a showcase project demonstrating professional practices for AI-assisted software development. It's designed for learning and as a template for your own AI-powered development workflows.

**Skill-Level Awareness** – The project includes training agents (`@Onboarding`, `@socratic-mentor`) that adapt to different developer skill levels, from juniors learning through Socratic questioning to seniors orchestrating full agent workflows. See the [Skill Levels Guide][skill-levels] for details.

**Not for Production Use** – This is a demonstration project. For production use, customize the agents, instructions, and security policies to match your organization's standards.

**Code Quality Notice** – While we strive to maintain the code quality standards expected at [slashwhy](https://github.com/slashwhy), the experimental and educational nature of this project means quality cannot be guaranteed. Code in this repository does not necessarily reflect the production code quality expectations of slashwhy.

---

<p align="center">
  <strong>🧑‍✈️ Remember: You are the Pilot – AI is your co-pilot!</strong><br>
  <strong>You remain responsible for your output, code quality, security, and compliance.</strong>
</p>

<!-- Project Documentation -->

[ai-guide]: docs/AI_DEVELOPMENT_GUIDE.md
[claude-code-guide]: docs/CLAUDE_CODE.md
[skill-levels]: docs/AI_SKILL_LEVELS.md
[custom-agents]: docs/CUSTOM_AGENTS.md
[custom-instructions]: docs/CUSTOM_INSTRUCTIONS.md
[custom-prompts]: docs/CUSTOM_PROMPTS.md
[mcp]: docs/MCP.md
[responsibilities]: docs/RESPONSIBILITIES.md
[security]: docs/SECURITY.md
[context-optimization]: docs/CONTEXT_OPTIMIZATION.md
[git-worktrees]: docs/GIT_WORKTREES.md
[frontend-readme]: frontend/README.md
[backend-readme]: backend/README.md

<!-- Features and Sections -->

[instruction-hierarchy]: docs/CUSTOM_INSTRUCTIONS.md#instruction-hierarchy
[skills-reference]: docs/SKILLS.md

<!-- Extensions -->

[copilot-extension]: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot
[devcontainers-extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers
[vue-extension]: https://marketplace.visualstudio.com/items?itemName=Vue.volar

<!-- GitHub Copilot Documentation -->

[claude-code-what-is]: https://docs.anthropic.com/en/docs/claude-code/overview
[claude-code-memory]: https://docs.anthropic.com/en/docs/claude-code/memory
[claude-code-settings]: https://docs.anthropic.com/en/docs/claude-code/settings
[claude-code-github]: https://github.com/anthropics/claude-code

[copilot-what-is]: https://docs.github.com/en/copilot/get-started/what-is-github-copilot
[copilot-response-customization]: https://docs.github.com/en/copilot/concepts/prompting/response-customization
[copilot-cheat-sheet]: https://docs.github.com/en/copilot/reference/customization-cheat-sheet
[copilot-customization-library]: https://docs.github.com/en/copilot/tutorials/customization-library
[copilot-trust-center]: https://copilot.github.trust.page/

<!-- Model Context Protocol -->

[mcp-site]: https://modelcontextprotocol.io/
[mcp-architecture]: https://modelcontextprotocol.io/docs/learn/architecture
[mcp-build-servers]: https://modelcontextprotocol.io/docs/develop/build-server

<!-- Community & Resources -->

[awesome-copilot]: https://github.com/github/awesome-copilot
