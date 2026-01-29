# 🎓 🤖 AI-Assisted Development Showcase

> **Vue 3 Todo Dashboard** – A **reference implementation** demonstrating multi-agent AI development with GitHub Copilot.
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

| | Responsibility | Action |
|---|---|---|
| 👁️ | **Review** | Read and understand all AI-generated code before committing |
| ✅ | **Validate** | Check against requirements and project standards |
| 🧪 | **Test** | Run full test suite before merging |
| 🔒 | **Security** | Verify auth, credentials, and data handling |
| 💡 | **Understand** | Know what changed and why it changed |

📖 **[Read the full guide →][responsibilities]** – detailed checklists, incident response, and MCP security


## 📖 Let's start

**New to this project?** Begin with the **[AI Development Guide][ai-guide]** for a complete overview of agents, instructions, MCP, and how everything works together.

**In This README:**
- [Developer Responsibilities](#-developer-responsibilities) – Your accountability when working AI-Assisted
- [Getting Started](#-getting-started) – Run locally in 3 steps
- [System Architecture](#-system-architecture) – Visual overview
- [Tech Stack](#-tech-stack) – Technologies used
- [Documentation](#-documentation) – All learning resources



```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        GitHub Copilot Agent Mode                             │
├──────────────────────────────────────────────────────────────────────────────┤
│  Agents (4)           │  Instructions (10)    │  Skills (11)                 │ 
│  ├── Implement        │  ├── Global           │  ├── Architectural Docs      │
│  ├── Specify          │  ├── Backend Routes   │  ├── Backend Routes          │
│  ├── Test Unit        │  ├── Pinia Stores     │  ├── Code Documentation      │
│  └── Test E2E         │  ├── Prisma Database  │  ├── E2E Testing             │
│                       │  ├── Styling          │  ├── Pinia Stores            │
│                       │  ├── Testing Backend  │  ├── Prisma Database         │
│                       │  ├── Testing E2E      │  ├── Security Review         │
│                       │  ├── Testing Frontend │  ├── Styling                 │
│                       │  ├── Vue Components   │  ├── Unit Testing            │
│                       │  └── Vue Composables  │  ├── Vue Components          │
│                       │                       │  └── Vue Composables         │
├──────────────────────────────────────────────────────────────────────────────┤
│  Prompts (7)                                                                 │
│  ├── Generate API Endpoint     ├── Generate Pinia Store                      │
│  ├── Generate Component        ├── Generate Unit Test                        │
│  ├── Generate E2E Test         ├── Review Security                           │
│  └── Specify                                                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│  MCP Integrations (4)                                                        │
│  ├── Atlassian (Jira/Confluence)     ├── Chrome DevTools                     │
│  ├── Figma Desktop                   └── Playwright                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 🛠 Tech Stack

| Layer | Stack | Details |
|-------|-------|---------|
| **Frontend** | Vue 3 + TypeScript + Vite | [frontend/README.md][frontend-readme] |
| **Backend** | Express + Prisma + PostgreSQL | [backend/README.md][backend-readme] |
| **Testing** | Vitest, Playwright | Unit & E2E |
| **AI** | GitHub Copilot, Custom Agents, MCP | See [docs/][ai-guide] |

## 🚀 Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- Docker (for PostgreSQL)
- VS Code with [GitHub Copilot Extension][copilot-extension]
- [Vue (Official)][vue-extension] extension

### Quick Start

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

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend & backend concurrently |
| `npm run install:all` | Install all dependencies |
| `npm run test` | Run all tests |
| `npm run test:e2e` | Run Playwright E2E tests |

📖 See [frontend/README.md][frontend-readme] and [backend/README.md][backend-readme] for full command reference.

## 🔗 Official Resources

### GitHub Copilot Documentation

| Resource | Purpose |
|----------|---------|
| [What is GitHub Copilot?][copilot-what-is] | Overview and capabilities |
| [Response Customization][copilot-response-customization] | Examples and best practices |
| [Trust Center][copilot-trust-center] | Security, privacy, and compliance |

### Model Context Protocol

| Resource | Purpose |
|----------|---------|
| [MCP Official Site][mcp-site] | Introduction and core concepts |
| [MCP Architecture][mcp-architecture] | How MCP works under the hood |
| [Building MCP Servers][mcp-build-servers] | Create custom MCP integrations |


### Learning & Inspiration

| Resource | Purpose |
|----------|---------|
| [Awesome Copilot][awesome-copilot] | Community examples and best practices |

## 📄 About This Project

🎓 **Reference Implementation** – This is a showcase project demonstrating professional practices for AI-assisted software development. It's designed for learning and as a template for your own AI-powered development workflows.

**Not for Production Use** – This is a demonstration project. For production use, customize the agents, instructions, and security policies to match your organization's standards.

---

<p align="center">
  <strong>🧑‍✈️ Remember: You are the Pilot – AI is your co-pilot!</strong><br>
  <strong>You remain responsible for your output, code quality, security, and compliance.</strong>
</p>

<!-- Project Documentation -->
[ai-guide]: docs/AI_DEVELOPMENT_GUIDE.md
[custom-agents]: docs/CUSTOM_AGENTS.md
[custom-instructions]: docs/CUSTOM_INSTRUCTIONS.md
[custom-prompts]: docs/CUSTOM_PROMPTS.md
[mcp]: docs/MCP.md
[responsibilities]: docs/RESPONSIBILITIES_AND_SECURITY.md
[context-optimization]: docs/CONTEXT_OPTIMIZATION.md
[git-worktrees]: docs/GIT_WORKTREES.md
[frontend-readme]: frontend/README.md
[backend-readme]: backend/README.md

<!-- Features and Sections -->
[instruction-hierarchy]: docs/CUSTOM_INSTRUCTIONS.md#instruction-hierarchy
[skills-reference]: docs/CUSTOM_AGENTS.md#skills-reference

<!-- Extensions -->
[copilot-extension]: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot
[vue-extension]: https://marketplace.visualstudio.com/items?itemName=Vue.volar

<!-- GitHub Copilot Documentation -->
[copilot-what-is]: https://docs.github.com/en/copilot/get-started/what-is-github-copilot
[copilot-response-customization]: https://docs.github.com/en/copilot/concepts/prompting/response-customization
[copilot-trust-center]: https://copilot.github.trust.page/

<!-- Model Context Protocol -->
[mcp-site]: https://modelcontextprotocol.io/
[mcp-architecture]: https://modelcontextprotocol.io/docs/learn/architecture
[mcp-build-servers]: https://modelcontextprotocol.io/docs/develop/build-server

<!-- Community & Resources -->
[awesome-copilot]: https://github.com/github/awesome-copilot
