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

## Security Checklists

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

## Reference Documentation

For secure implementation patterns and comprehensive security guidelines, see:
- [Backend Routes Instructions](../../instructions/backend-routes.instructions.md) – Secure Express/Prisma patterns
