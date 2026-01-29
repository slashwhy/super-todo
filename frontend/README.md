# Todo App Frontend

Vue 3 + TypeScript + Vite single-page application.

> 📚 See [docs/AI_DEVELOPMENT_GUIDE.md](../docs/AI_DEVELOPMENT_GUIDE.md) for AI-assisted development architecture.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vue 3** | Reactive UI framework with Composition API |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool & dev server |
| **Pinia** | State management |
| **Vue Router** | Client-side routing |
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |

## Quick Start

```bash
npm install                   # Install dependencies
npm run dev                   # Start dev server → http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Type-check & build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Lint & auto-fix with ESLint |
| `npm run format` | Format with Prettier |

## Testing

### Unit Tests

```bash
npm run test              # Watch mode
npm run test:run          # Run once
npm run test:coverage     # With coverage report
```

Tests use **Vitest** + **Vue Test Utils**. Test files live alongside source as `*.spec.ts`.

### E2E Tests

```bash
npm run test:e2e          # Run Playwright tests
npm run test:e2e:headed   # Run with browser visible
npm run test:e2e:ui       # Interactive UI mode
npm run test:e2e:report   # View test report
```

E2E tests use **Playwright** with Page Object pattern. Tests are in `e2e/`.

## Project Structure

```
src/
├── assets/           # CSS variables and base styles
├── components/       # Reusable Vue components
│   ├── common/       # Generic UI components
│   ├── icons/        # Icon components
│   ├── layout/       # Layout components (header, sidebar)
│   └── tasks/        # Task-related components
├── composables/      # Reusable composition functions
├── router/           # Vue Router configuration
├── stores/           # Pinia stores
├── types/            # TypeScript type definitions
└── views/            # Route-level page components

e2e/
├── pages/            # Page Objects
└── *.spec.ts         # E2E test files
```

## Environment

The frontend expects the backend API at `http://localhost:3000`. Start the backend first:

```bash
cd ../backend
npm run dev
```
