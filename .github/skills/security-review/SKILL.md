---
name: security-review
description: 'Security review checklist for API endpoints, data handling, and frontend vulnerabilities. Use when performing security audits, reviewing PRs for security issues, or validating implementations against OWASP guidelines.'
---

# Security Review Skill

Comprehensive security checklist for full-stack applications.

## When to Use This Skill

- Reviewing API endpoints for vulnerabilities
- Auditing frontend code for XSS/CSRF risks
- Validating authentication and authorization patterns
- Checking data handling and storage security
- Pre-merge security review
- **Reviewing AI-generated code for common pitfalls**
- **Evaluating MCP server configurations for security risks**

## Security Checklists

### AI-Assisted Development Risks

| Check | Risk | What to Look For |
|-------|------|------------------|
| **Hallucinated Packages** | High | AI-suggested packages that don't exist or have few downloads |
| **Automation Bias** | Medium | Complex logic accepted without thorough review |
| **Context Poisoning** | Medium | Suspicious comments that could manipulate AI suggestions |
| **Prompt Injection Vectors** | High | User input rendered in contexts AI might process (logs, error messages) |
| **Outdated Patterns** | Medium | Deprecated APIs or security anti-patterns from AI training data |

### MCP Server Security

| Check | Risk | What to Look For |
|-------|------|------------------|
| **Hardcoded Credentials** | Critical | API keys or tokens in `mcp.json` instead of `${env:VAR}` |
| **HTTP Transport Exposure** | High | HTTP servers on non-localhost without auth |
| **Excessive Permissions** | High | MCP tools with write/delete access when read-only would suffice |
| **Missing Tool Approval** | Medium | `chat.mcp.autoApprove.enabled: true` in settings |
| **Unvetted Servers** | Medium | Third-party MCP servers without source review |

### API Endpoints (Express/Prisma)

| Check | Risk | What to Look For |
|-------|------|------------------|
| **Mass Assignment** | High | `req.body` passed directly to Prisma `create()` or `update()` |
| **SQL Injection** | Critical | Raw queries with string interpolation |
| **Missing Validation** | Medium | No input validation before database operations |
| **Broken Access Control** | High | Missing ownership checks (e.g., user can edit any task) |
| **Sensitive Data Exposure** | Medium | Passwords, tokens, or PII in responses |
| **Missing Rate Limiting** | Medium | No protection against brute force |

### Frontend (Vue/Pinia)

| Check | Risk | What to Look For |
|-------|------|------------------|
| **XSS** | High | `v-html` with user-supplied content |
| **Secrets in Code** | Critical | API keys or tokens in frontend code |
| **Insecure Storage** | Medium | Sensitive data in localStorage |
| **CSRF** | Medium | State-changing GET requests |

### Authentication & Authorization

| Check | Risk | What to Look For |
|-------|------|------------------|
| **Weak Tokens** | Critical | Predictable session tokens or JWTs without proper signing |
| **Missing Auth Checks** | High | Routes without authentication middleware |
| **Privilege Escalation** | High | Role checks that can be bypassed |
| **Session Management** | Medium | Sessions that don't expire or rotate |

### Data Handling

| Check | Risk | What to Look For |
|-------|------|------------------|
| **Unencrypted Secrets** | Critical | Passwords stored in plain text |
| **Logging Sensitive Data** | Medium | PII or credentials in log output |
| **Insecure Transmission** | High | HTTP instead of HTTPS for sensitive data |
| **Missing Input Sanitization** | Medium | User input used without sanitization |

## Output Format

When reporting security findings, use this structure:

```markdown
## Security Review: [File/Feature Name]

### 🔴 Critical Issues
- **[Issue Name]** at [file.ts#L42](file.ts#L42)
  - **Risk:** Description of what could go wrong
  - **Fix:** Recommended remediation

### 🟠 High Issues
- **[Issue Name]** at [file.ts#L15](file.ts#L15)
  - **Risk:** Description of vulnerability
  - **Fix:** Recommended remediation

### 🟡 Medium Issues
- **[Issue Name]** at [file.ts#L88](file.ts#L88)
  - **Risk:** Description of concern
  - **Fix:** Recommended remediation

### 🟢 Low Issues / Recommendations
- Consider [improvement suggestion]

### ✅ Passed Checks
- Mass assignment protection ✓
- Input validation ✓
- Authentication checks ✓
```

## Secure Patterns for This Project

### Express Route Security

```typescript
// ✅ Correct: Whitelist fields explicitly
const { title, description, priorityId } = req.body
await prisma.task.create({
  data: { title, description, priorityId }
})

// ❌ Wrong: Mass assignment vulnerability
await prisma.task.create({ data: req.body })
```

### Vue Template Security

```vue
<!-- ✅ Correct: Text interpolation (auto-escaped) -->
<p>{{ userInput }}</p>

<!-- ❌ Wrong: XSS vulnerability -->
<p v-html="userInput"></p>
```

### Input Validation

```typescript
// ✅ Correct: Validate before use
if (!title || typeof title !== 'string' || title.length > 200) {
  return res.status(400).json({ error: 'Invalid title' })
}

// ❌ Wrong: Trust user input
await prisma.task.create({ data: { title: req.body.title } })
```

### AI-Generated Code Review

```typescript
// ⚠️ AI suggested this package - VERIFY before installing:
// 1. Check npm: https://www.npmjs.com/package/fast-csv-parser
// 2. Verify downloads (>10k weekly), maintainer, last update
// 3. Check for known vulnerabilities: npm audit
import { parse } from 'fast-csv-parser'

// ⚠️ AI generated complex logic - REVIEW carefully:
// - Does this match requirements?
// - Are edge cases handled?
// - Is error handling complete?
```

### MCP Configuration Security

```jsonc
// ✅ Correct: Use environment variable expansion
{
  "env": {
    "API_TOKEN": "${env:GITHUB_TOKEN}"
  }
}

// ❌ Wrong: Hardcoded credentials
{
  "env": {
    "API_TOKEN": "ghp_xxxxxxxxxxxx"
  }
}
```

## Reference Documentation

For secure implementation patterns and comprehensive security guidelines, see:
- [Backend Routes Instructions](../../instructions/backend-routes.instructions.md) – Secure Express/Prisma patterns
- [Security Guide](../../../docs/SECURITY.md) – AI attack surface and operational checklist

## MCP Risk Scoring Framework

Use this quantitative model to evaluate MCP server and tool risks:

$$R_{total} = \sum_{tool=1}^{n} (A_{tool} \times S_{tool} \times D_{tool})$$

### Scoring Factors

| Factor | Score | Description |
|--------|-------|-------------|
| **A (Agency)** | 0 | Read-only (e.g., `read_file`, `list_tasks`) |
| | 0.5 | Creative/Generative (e.g., `write_draft`, `create_issue`) |
| | 1.0 | Destructive/Executive (e.g., `delete_file`, `execute_terminal`, `drop_table`) |
| **S (Source Trust)** | 0 | Internal/Vetted (company-maintained, code reviewed) |
| | 0.5 | Trusted vendor (Microsoft, GitHub, official integrations) |
| | 1.0 | Public/Unverified (third-party, no source review) |
| **D (Data Sensitivity)** | 0 | Public data only |
| | 0.5 | Internal data (non-sensitive business data) |
| | 1.0 | PII/Secrets/Core IP |

### Risk Thresholds

| Score | Action |
|-------|--------|
| 0.0 - 0.25 | ✅ Auto-approve eligible (read-only, trusted, public data) |
| 0.26 - 0.5 | ⚠️ Requires per-session approval |
| 0.51 - 0.75 | 🔶 Requires explicit user confirmation per action |
| 0.76 - 1.0 | 🔴 Deny by policy; requires security team exception |

**Capability-based overrides:**

Even if a server's numeric score falls into the 0.0–0.25 "Auto-approve eligible" band, require **at least per-session approval** when:

- It can perform any non-read-only action (create/update/delete/execute/generate), or
- It can access internal, customer, or otherwise non-public data, or
- It is vendor-hosted and has broad access to your project or workspace.

These capability-based overrides ensure that powerful or data-sensitive integrations are never fully auto-approved, even with a low numeric risk score.

### Example: Project MCP Servers

| Server | Agency | Source | Data | Risk Score | Recommendation |
|--------|--------|--------|------|------------|----------------|
| figma-desktop | 0 (read) | 0.5 (vendor) | 0 (public) | **0.0** | ✅ Auto-approve eligible |
| atlassian | 0.5 (create) | 0.5 (vendor) | 0.5 (internal) | **0.125** | ⚠️ Session approval (write + internal data → capability override) |
| playwright | 0.5 (execute) | 0.5 (vendor) | 0 (test data) | **0.0** | ⚠️ Session approval (execute capabilities → capability override) |
| chrome-devtools | 0 (read) | 0.5 (vendor) | 0.5 (may see app data) | **0.0** | ⚠️ Session approval (may access app data → capability override) |
| awesome-copilot | 0.5 (generate) | 0.5 (vendor) | 0 (public) | **0.0** | ⚠️ Session approval (generate code/actions → capability override) |
