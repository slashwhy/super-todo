# 🛡️ Security Guide

> Security safeguards and best practices when using AI assistance in development.

**Audience:** All developers using AI assistance | **Prerequisites:** Understanding of [MCP integrations](./MCP.md)

---

## Data Privacy

### Use Enterprise Tiers

| Service | Data Used for Training? | Recommendation |
|---------|-------------------------|----------------|
| GitHub Copilot (Business) | No | ✅ Recommended |
| Anthropic (Enterprise) | No | ✅ Best for sensitive code |
| Claude.ai (Free) | May be | ⚠️ Avoid for proprietary code |
| Free tier services | Unclear | ⚠️ Avoid for proprietary code |

**Reference:** [GitHub Copilot Trust Center](https://copilot.github.trust.page/)

### Data Flow Awareness

```
Your Code → MCP Server → External Service → AI Model
```

Always:
- Use `.env` for secrets, never commit
- Use `.gitignore` to exclude sensitive files
- Use local MCP servers when possible
- Understand what data flows to which services

**Learn more:** [MCP Integrations](./MCP.md) – Detailed data flow diagrams

---

## MCP Security Risks

**New to MCP?** The [Model Context Protocol](https://modelcontextprotocol.io/) allows AI agents to access external tools and data. Learn how [this project uses MCP](./MCP.md) and understand the security implications when you grant agents permissions.

### 1. 🔓 Confused Deputy Problem

| Aspect | Details |
|--------|---------|
| **Risk** | Agent combines permissions in unintended ways |
| **Example** | Agent has read code + write to Jira → reads secrets, posts to public Jira |
| **Prevention** | Minimal permissions per custom agent and server, separate read-only & write access |

**Configuration:** See [Custom Agents](./CUSTOM_AGENTS.md) for agent tool restrictions

### 2. 🔑 Credential Exposure

| Aspect | Details |
|--------|---------|
| **Risk** | API keys logged or exposed in output/errors |
| **❌ Bad** | `console.log(\`Token: ${apiToken}\`)` |
| **✅ Good** | `console.log(\`Token: ${apiToken.slice(0, 4)}...\`)` |

### 3. 🎯 Agent Tool Overreach

| Agent | Can Access | Cannot Access |
|-------|------------|---------------|
| @Specify | Read code, Jira/Figma (read-only) | Write files, execute code |
| @Implement | Create/edit files, dev execution | Prod database, delete without confirm |
| @Test | Edit test files, run tests | Prod code, infrastructure |

**Configuration:** [Custom Agents](./CUSTOM_AGENTS.md) – Complete agent permission matrix

### 4. 🌐 External API Risks

When MCP servers connect to external services:

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Data leakage** | Sensitive code sent to third-party APIs | Use enterprise tiers, review data flows |
| **API key compromise** | Unauthorized access to services | Rotate keys regularly, use short-lived tokens |
| **Service outages** | AI agent functionality breaks | Graceful degradation, local fallbacks |

### 5. 🔄 Context Leakage

Sensitive data from one project appears in another.

| Mitigation |
|------------|
| ✅ Workspace-specific MCP configs |
| ✅ Clear context between projects |
| ✅ Separate credentials per project |

### 6. 🎫 Token Passthrough Anti-Pattern

An MCP server should **never** accept tokens not explicitly issued for it.

```typescript
// ❌ DANGEROUS: Passing through external tokens
server.use(req.headers.externalApiToken)

// ✅ CORRECT: Validate token audience
const token = validateAudience(req.token, 'mcp-server-id')
if (!token.valid) throw new AuthError('Invalid audience')
```

| Risk | Why It Matters |
|------|----------------|
| Bypasses server authorization | Client impersonates user |
| Breaks audit trail | Server can't log who did what |
| Enables privilege escalation | Downstream APIs trust the token |

**Rule:** MCP servers must validate all tokens were issued specifically for them.

---

## Incident Response

### 🚨 Agent Misbehavior

If an agent performs unexpected actions:

| Step | Action | Details |
|------|--------|---------|
| 1️⃣ | 🛑 **Disable** | Remove tool access immediately |
| 2️⃣ | 👀 **Review** | Examine what happened & root cause |
| 3️⃣ | 🔧 **Fix** | Update agent constraints/permissions |
| 4️⃣ | ✅ **Test** | Verify constraints work before re-enabling |



## Security Resources

### Internal Documentation

- [MCP Integrations](./MCP.md) – MCP server security configuration
- [Custom Agents](./CUSTOM_AGENTS.md) – Agent permission boundaries
- [Developer Responsibilities](./RESPONSIBILITIES.md) – Code review practices

### External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) – Most critical web application security risks
- [Model Context Protocol Docs](https://modelcontextprotocol.io/) – MCP security guidelines
- [GitHub Copilot Trust Center](https://copilot.github.trust.page/) – Enterprise security features
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance) – Database security

### Security Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **GitHub Advanced Security** | Secret scanning, dependency alerts | All repositories |
| **npm audit** | Dependency vulnerability scanning | Before every deployment |
| **ESLint security plugins** | Static analysis for security issues | CI/CD pipeline |
| **OWASP ZAP** | Web application security testing | Penetration testing |

---

## Questions?

- **Need to configure agent permissions?** → [Custom Agents](./CUSTOM_AGENTS.md)
- **Setting up MCP servers?** → [MCP Integrations](./MCP.md)
- **Not sure if you should review something?** → [Developer Responsibilities](./RESPONSIBILITIES.md)
- **Planning a new feature with security implications?** → Consult security team before implementation
