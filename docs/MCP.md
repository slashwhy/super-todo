# 🔗 MCP Integrations

> Model Context Protocol servers that extend agent capabilities with external tools.

**Audience:** Developers configuring or using MCP tools | **Prerequisites:** [Custom Agents](./CUSTOM_AGENTS.md)

---

## Quick Reference

| Server | Purpose | Used By |
|--------|---------|---------|
| **Atlassian** | Jira tickets, Confluence docs | @Specify |
| **Figma Desktop** | Design specs, tokens | @Specify, @Implement |
| **Chrome DevTools** | DOM inspection, debugging | @Test E2E |
| **Playwright** | E2E test execution | @Test E2E |

---

## What & Why

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/) is an open standard connecting AI applications to external systems. Think of it as **USB-C for AI**—a standardized interface to connect to any compatible service.

MCP enables agents to:
- Access external data (Jira, Figma, databases)
- Execute workflows (browser automation, test runs)
- Integrate with services without custom code

---

## How It Works

```
Agent wants ticket details
      ↓
Calls MCP: getJiraIssue("PROJ-123")
      ↓
Atlassian MCP Server
      ↓
Jira API
      ↓
Returns ticket data to agent
```

---

## Configured Servers

### Atlassian (Jira & Confluence)

**Server:** `atlassian/atlassian-mcp-server`

| Tool | Purpose |
|------|---------|
| `getJiraIssue` | Fetch ticket details |
| `searchJiraIssuesUsingJql` | Search with JQL |
| `getConfluencePage` | Read docs |
| `search` | Search across Jira/Confluence |

**Example workflow:**
```
@specify plan PROJ-123
  → getJiraIssue("PROJ-123") → User story + acceptance criteria
  → search("PROJ-123 design") → Linked Figma design
  → Generate implementation plan
```

---

### Figma Desktop

**Server:** `figma-desktop` (local)

| Tool | Purpose |
|------|---------|
| `get_screenshot` | Capture design visuals |
| `get_metadata` | Component structure |
| `get_variable_defs` | Design tokens |
| `get_code_connect_map` | Figma → code mapping |

**Design token mapping:**
```
Figma                    CSS Variables
─────────────────────    ─────────────────────
Primary: #007AFF    →    --color-primary
Spacing: 8px        →    --spacing-base
Font: Inter 14px    →    --font-body
```

> 📌 **Note:** Requires Figma desktop app to be running.

---

### Chrome DevTools

**Server:** `io.github.chromedevtools/chrome-devtools-mcp`

| Tool | Purpose |
|------|---------|
| `navigate` | Go to URL |
| `screenshot` | Capture page state |
| `evaluate` | Run JavaScript |
| `getDocument` | Get DOM structure |

**Example workflow:**
```
@test-e2e explore task list
  → navigate("http://localhost:5173")
  → screenshot() → See current state
  → getDocument() → Analyze DOM
  → Identify data-testid selectors
```

> ⚠️ **Security:** Limited to localhost, test environments only.

---

### Playwright

**Server:** `playwright`

| Tool | Purpose |
|------|---------|
| Test execution | Run test suites |
| Trace analysis | Debug failures |
| Report generation | Create reports |
| Screenshot capture | Save evidence |

---

## Configuration

**Location:** `~/.copilot/mcp-servers.json`

```json
{
  "servers": {
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/sse",
      "auth": { "type": "oauth2" }
    },
    "figma-desktop": {
      "type": "http",
      "url": "http://127.0.0.1:3845/mcp"
    },
    "chrome-devtools": {
      "type": "stdio",
      "command": "chrome-devtools-mcp"
    }
  }
}
```

**Disable unused servers:**
```json
{
  "servers": {
    "atlassian": { "disabled": true }
  }
}
```

---

## Security Risks & Mitigations

### 1. Confused Deputy Problem

Agent combines permissions unintentionally.

| Risk | Mitigation |
|------|------------|
| Agent reads code, writes to Jira | ✅ Separate read-only and write servers |
| Secrets leaked to external service | ✅ Minimal permissions per server |

### 2. Credential Exposure

```typescript
// ⚠️ Avoid
console.log(`Token: ${jiraToken}`)

// ✅ Do This
console.log(`Token: ${jiraToken.slice(0, 4)}...`)
```

### 3. Context Leakage

Sensitive data from one project appears in another.

| Mitigation |
|------------|
| ✅ Workspace-specific MCP configs |
| ✅ Clear context between projects |
| ✅ Separate credentials per project |

---

## Patterns

### ✅ Do This: Minimal Permissions

```yaml
# @Specify agent: read-only
tools:
  - atlassian/search
  - figma-desktop/get_screenshot
  - figma-desktop/get_metadata
```

### ⚠️ Avoid This: Overpowered Access

```yaml
# Too many permissions
tools:
  - atlassian/*
  - figma-desktop/*
  - execute/*
```

---

### ✅ Do This: Document Data Flow

| Agent | MCP | Data Flow | Sensitivity |
|-------|-----|-----------|-------------|
| @Specify | Atlassian | Read requirements | Public |
| @Specify | Figma | Read designs | Public |
| @Test E2E | DevTools | Debug tests | Test only |

### ⚠️ Avoid This: Unknown Data Paths

Connecting MCP servers without understanding what data flows through them.

---

## Related

- [Custom Agents](./CUSTOM_AGENTS.md) – Which agents use which MCP tools
- [Governance & Security](./GOVERNANCE.md) – MCP security details
- [MCP Official Site](https://modelcontextprotocol.io/)
- [MCP Architecture](https://modelcontextprotocol.io/docs/learn/architecture)
