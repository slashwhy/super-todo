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

---

## 📋 Table of Contents

- [Developer Responsibilities](#-developer-responsibilities) ⬅️ **START HERE**
- [About This Project](#-about-this-project)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Documentation](#-documentation)
- [Official Resources](#-official-resources)

**Deep Dives:** [Custom Agents](docs/CUSTOM_AGENTS.md) · [Instructions](docs/CUSTOM_INSTRUCTIONS.md) · [MCP](docs/MCP.md) · [Responsibilities](docs/RESPONSIBILITIES_AND_SECURITY.md)

---

## 🚨 Developer Responsibilities

> **AI is a co-pilot, not an autopilot.** You remain responsible for code quality, security, and compliance.

```
┌─────────────────────────────────────────────────────┐
│  Skip Review    │   Review Properly               │
├─────────────────┼─────────────────────────────────┤
│  Save 5 min     │   Save 3 min                    │
│  Debt: ∞        │   Debt: Minimal                 │
│  ROI: -1000%    │   ROI: +200%                    │
└─────────────────┴─────────────────────────────────┘
```

**Your checklist:**
- ✅ **Review** all AI code before committing
- ✅ **Test** – run full test suite
- ✅ **Verify** security (auth, credentials, data handling)
- ✅ **Understand** what changed and why

📖 **[Read the full guide →](docs/RESPONSIBILITIES_AND_SECURITY.md)** – detailed examples, checklists, and the true cost of "AI slop"

---

## 📖 About This Project

This project implements a complete **reference implementation** of AI-assisted development using GitHub Copilot's agent architecture.

### Multi-Agent System

| Agent | Role | Writes Code? |
|-------|------|--------------|
| **@Specify & Validate** | Plan features from Jira, validate against Figma | ❌ Read-only |
| **@Implement** | Build features following project conventions | ✅ Yes |
| **@Test Unit** | Write unit & integration tests | ✅ Yes |
| **@Test E2E** | Write Playwright E2E tests | ✅ Yes |

### Instruction Hierarchy

**Global** → **Path-Specific** (9 files) → **Skills** (10 modules)

📖 **[See full hierarchy →](docs/CUSTOM_INSTRUCTIONS.md#instruction-hierarchy)**

### MCP Integrations

**4 servers:** Atlassian (Jira/Confluence), Figma, Chrome DevTools, Playwright

📖 **[See MCP Guide →](docs/MCP.md)**

### Feature Index

| Feature | Documentation |
|---------|---------------|
| **Smart Actions** | [AI Guide](docs/AI_DEVELOPMENT_GUIDE.md#built-in-smart-actions) |
| **Custom Prompts** | [CUSTOM_PROMPTS.md](docs/CUSTOM_PROMPTS.md) |
| **Custom Instructions** | [CUSTOM_INSTRUCTIONS.md](docs/CUSTOM_INSTRUCTIONS.md) |
| **Custom Agents** | [CUSTOM_AGENTS.md](docs/CUSTOM_AGENTS.md) |
| **Skills** | [CUSTOM_AGENTS.md](docs/CUSTOM_AGENTS.md#skills-reference) |
| **MCP** | [MCP.md](docs/MCP.md) |

📖 **[Full Feature Index →](docs/AI_DEVELOPMENT_GUIDE.md#feature-index)**

### Architecture at a Glance

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

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Vue 3, TypeScript, Vite, Pinia, Vue Router |
| **Backend** | Express, Prisma ORM, PostgreSQL |
| **Testing** | Vitest, Vue Test Utils, Supertest, Playwright |
| **AI** | GitHub Copilot, Custom Agents, MCP |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- VS Code with [GitHub Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension

### Installation

```sh
# Clone the repository
git clone <repository-url>
cd todo_app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Type-check & build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run frontend tests (Vitest) |
| `npm run lint` | Lint & auto-fix with ESLint |
| `npm run format` | Format with Prettier |

### Backend Scripts

```bash
cd backend
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API server → http://localhost:3000 |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio ` | Prisma Studio GUI |
| `npm run test:run` | Run backend tests |

---

## 📚 Documentation

### Essential Reading

**Start here to understand this project:**

| Document | Purpose |
|----------|----------|
| [AI_DEVELOPMENT_GUIDE.md](docs/AI_DEVELOPMENT_GUIDE.md) | Overview – agents, instructions, smart actions, MCP |
| [RESPONSIBILITIES_AND_SECURITY.md](docs/RESPONSIBILITIES_AND_SECURITY.md) | **Your responsibilities** – security, safety, oversight |
| [CUSTOM_AGENTS.md](docs/CUSTOM_AGENTS.md) | Agent definitions – what each agent does |
| [backend/README.md](backend/README.md) | Backend API documentation and setup |

### Customization Guides

| Document | Description |
|----------|-------------|
| [CUSTOM_PROMPTS.md](docs/CUSTOM_PROMPTS.md) | Reusable prompt templates (`.prompt.md`) |
| [CUSTOM_INSTRUCTIONS.md](docs/CUSTOM_INSTRUCTIONS.md) | Instruction hierarchy and best practices |
| [MCP.md](docs/MCP.md) | Model Context Protocol integrations |

### Advanced Topics

| Document | Description |
|----------|-------------|
| [CONTEXT_OPTIMIZATION.md](docs/CONTEXT_OPTIMIZATION.md) | Strategies for optimizing LLM context usage |
| [GIT_WORKTREES.md](docs/GIT_WORKTREES.md) | Parallel AI development with Git worktrees |

---

## 🔗 Official Resources

### GitHub Copilot Documentation

| Resource | Purpose |
|----------|---------|
| [What is GitHub Copilot?](https://docs.github.com/en/copilot/get-started/what-is-github-copilot) | Overview and capabilities |
| [Custom Instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) | How to configure custom instructions |
| [Custom Instructions Guide](https://docs.github.com/en/copilot/tutorials/customization-library/custom-instructions) | Examples and best practices |
| [Response Customization](https://docs.github.com/en/copilot/concepts/prompting/response-customization) | How Copilot uses instructions |
| [Trust Center](https://copilot.github.trust.page/) | Security, privacy, and compliance |

### Model Context Protocol

| Resource | Purpose |
|----------|---------|
| [MCP Official Site](https://modelcontextprotocol.io/) | Introduction and core concepts |
| [MCP Architecture](https://modelcontextprotocol.io/docs/learn/architecture) | How MCP works under the hood |
| [Building MCP Servers](https://modelcontextprotocol.io/docs/develop/build-server) | Create custom MCP integrations |

### This Project

| Document | Link |
|----------|------|
| **How to Use This Project** | [docs/AI_DEVELOPMENT_GUIDE.md](docs/AI_DEVELOPMENT_GUIDE.md) |
| **Your Responsibilities** | [docs/RESPONSIBILITIES_AND_SECURITY.md](docs/RESPONSIBILITIES_AND_SECURITY.md) |
| **Agent Definitions** | [docs/CUSTOM_AGENTS.md](docs/CUSTOM_AGENTS.md) |

---

## 📄 About This Project

🎓 **Reference Implementation** – This is a showcase project demonstrating professional practices for AI-assisted software development. It's designed for learning and as a template for your own AI-powered development workflows.

**Not for Production Use** – This is a demonstration project. For production use, customize the agents, instructions, and security policies to match your organization's standards.

---

<p align="center">
  <strong>🧑‍✈️ Remember: You're the Pilot – AI is your co-pilot!</strong><br>
  <strong>You remain responsible for code quality, security, and compliance.</strong>
</p>
