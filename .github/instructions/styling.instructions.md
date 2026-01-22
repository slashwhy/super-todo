---
applyTo: '**/*.css, **/*.scss, **/*.vue'
---

# Styling Guidelines

## CSS Variables

Use design tokens from `src/assets/styles/variables.css`:

```css
.component {
  /* Colors */
  color: var(--color-text-primary);
  background: var(--color-background);
  border-color: var(--color-border);
  
  /* Spacing scale */
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-sm);
  
  /* Typography scale */
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  
  /* Layout tokens */
  max-width: var(--content-max-width);
  border-radius: var(--border-radius-md);
}
```

## BEM Naming Convention

Use Block-Element-Modifier pattern with component prefix:

```css
/* Block */
.task-card { }

/* Element (double underscore) */
.task-card__header { }
.task-card__title { }
.task-card__actions { }

/* Modifier (double hyphen) */
.task-card--completed { }
.task-card--high-priority { }
.task-card__title--truncated { }
```

## Component Scoped Styles

In Vue SFCs, use scoped styles:

```vue
<style scoped>
.dashboard {
  padding: var(--spacing-lg);
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.dashboard__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}
</style>
```

## Spacing Scale

Use consistent spacing tokens:

| Token | Use Case |
|-------|----------|
| `--spacing-xs` | Tight spacing (icons, small gaps) |
| `--spacing-sm` | Compact spacing (buttons, form elements) |
| `--spacing-md` | Standard spacing (sections) |
| `--spacing-lg` | Generous spacing (major sections) |
| `--spacing-xl` | Large gaps (page sections) |
| `--spacing-2xl` | Extra large (hero sections) |

## Layout Patterns

### Flexbox Layouts

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### CSS Grid Layouts

```css
.dashboard-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}
```

## Color Usage

- Use semantic color variables, not raw values
- Maintain sufficient contrast (WCAG AA minimum)
- Use color consistently for states:

```css
/* Status colors */
.status--todo { color: var(--color-status-todo); }
.status--in-progress { color: var(--color-status-progress); }
.status--done { color: var(--color-status-done); }

/* Interactive states */
.button:hover { background: var(--color-primary-hover); }
.button:focus { outline: 2px solid var(--color-focus-ring); }
.button:disabled { opacity: 0.5; cursor: not-allowed; }
```

## Responsive Design

Mobile-first approach with breakpoints:

```css
.sidebar {
  display: none;
}

@media (min-width: 768px) {
  .sidebar {
    display: block;
    width: var(--sidebar-width);
  }
}

@media (min-width: 1024px) {
  .content {
    max-width: var(--content-max-width);
  }
}
```

## Best Practices

- Never use inline styles
- Never use `!important` (fix specificity instead)
- Avoid deep nesting (max 3 levels)
- Use CSS custom properties for theming
- Prefer `rem`/`em` for font sizes, `px` for borders
- Use `gap` instead of margins for flex/grid layouts
- Add focus states for accessibility
- Test with dark mode if supported
