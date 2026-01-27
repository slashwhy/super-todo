---
description: Security review checklist for API endpoints and data handling
agent: Specify & Validate
---

# Security Review

Perform a security review of the specified code against common vulnerabilities.

## Task

Analyze the code for security issues without making changes. Report findings with:
- Severity level (Critical, High, Medium, Low)
- Specific file and line references
- Explanation of the vulnerability
- Recommended remediation

## Checklist

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

## Context

Reference these files:
- `.github/instructions/backend-routes.instructions.md` for secure patterns
- `backend/src/routes/tasks.ts` for existing endpoint patterns

## Output Format

```markdown
## Security Review: [File/Feature Name]

### 🔴 Critical Issues
- **[Issue Name]** at [file.ts#L42](file.ts#L42)
  - **Risk:** Description of what could go wrong
  - **Fix:** Recommended remediation

### 🟠 High Issues
...

### 🟡 Medium Issues
...

### 🟢 Low Issues / Recommendations
...

### ✅ Passed Checks
- Mass assignment protection ✓
- Input validation ✓
```

## Constraints

- **Read-only review** — do not modify any files
- Report specific line numbers for each finding
- Prioritize findings by severity
- Include both issues found AND checks that passed
