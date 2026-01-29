---
name: styling
description: 'CSS variables, BEM naming, spacing scale, and responsive patterns. Use when styling components, applying design tokens, or implementing responsive layouts.'
---

# Styling Skill

CSS patterns using project CSS variables and conventions.

## When to Use This Skill

- Styling Vue components
- Applying colors and spacing
- Creating responsive layouts
- Following BEM naming conventions
- Using design tokens

## Reference Documentation

For detailed patterns and conventions, see:
- [Styling Instructions](../../instructions/styling.instructions.md)

## Quick Reference

### CSS Variables

All styling must use CSS variables from `frontend/src/assets/styles/variables.css`:

```css
/* Colors */
--color-primary: #3B82F6;
--color-primary-hover: #2563EB;
--color-secondary: #6B7280;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;

--color-background: #F9FAFB;
--color-surface: #FFFFFF;
--color-text: #111827;
--color-text-muted: #6B7280;
--color-border: #E5E7EB;

/* Spacing Scale */
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */

/* Border Radius */
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

/* Transitions */
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
```

### Critical Rules

1. **Never hardcode colors** – always use `var(--color-*)`
2. **Never hardcode spacing** – always use `var(--spacing-*)`
3. **Use BEM naming** for class names
4. **Use scoped styles** in Vue components
5. **Mobile-first responsive** design

### BEM Naming

```css
/* Block */
.task-card { }

/* Element */
.task-card__title { }
.task-card__description { }
.task-card__actions { }

/* Modifier */
.task-card--highlighted { }
.task-card--completed { }
.task-card__title--large { }
```

### Component Styling Pattern

```vue
<style scoped>
.task-card {
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);
}

.task-card:hover {
  box-shadow: var(--shadow-md);
}

.task-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
}

.task-card__description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.task-card--vital {
  border-left: 4px solid var(--color-error);
}
</style>
```

### Responsive Patterns

```css
/* Mobile-first approach */
.container {
  padding: var(--spacing-sm);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Flexbox Patterns

```css
/* Row with gap */
.row {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

/* Column layout */
.column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Space between */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Grid Patterns

```css
/* Card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}
```

### Button Styles

```css
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn--primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

.btn--primary:hover {
  background: var(--color-primary-hover);
}

.btn--secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

## File Locations

- Variables: `frontend/src/assets/styles/variables.css`
- Base styles: `frontend/src/assets/styles/base.css`
- Component styles: Scoped within `.vue` files
