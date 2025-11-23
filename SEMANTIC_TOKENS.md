# Semantic Tokens Reference

All semantic design tokens are defined as CSS variables in `src/app/globals.css`. Use them directly in your styles—no wrappers needed.

## Quick Start

Use CSS variables directly in any style:

```typescript
// Inline styles
<div style={{ color: 'var(--primary)' }} />
<div style={{ backgroundColor: 'var(--card)' }} />

// Tailwind arbitrary values
<div className="bg-[var(--primary)] text-[var(--primary-foreground)]" />
<div className="border-[var(--border)] rounded-[var(--radius-lg)]" />

// CSS
.my-element {
  background-color: var(--primary);
  color: var(--primary-foreground);
  padding: var(--spacing-md);
}
```

## Available Tokens

### Colors (25 tokens)

**Brand & Semantic:**
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--accent` / `--accent-foreground`
- `--destructive` / `--destructive-foreground`
- `--color-success`
- `--color-warning`

**Background System:**
- `--background` / `--foreground`
- `--card` / `--card-foreground`
- `--popover` / `--popover-foreground`
- `--muted` / `--muted-foreground`

**Interactive:**
- `--border` / `--border-hover`
- `--input`
- `--ring`

**Charts:**
- `--chart-1` through `--chart-5`

### Motion & Animation (14 tokens)

**Durations:**
- `--motion-duration-fast` (150ms)
- `--motion-duration-normal` (300ms)
- `--motion-duration-slow` (500ms)

**Easings:**
- `--motion-ease-linear`
- `--motion-ease-in`
- `--motion-ease-out`
- `--motion-ease-in-out`
- `--motion-ease-bounce`
- `--motion-ease-spring`

**Transitions:**
- `--transition-fast`
- `--transition-base`
- `--transition-slow`
- `--transition-spring`

### Spacing (8 tokens)

- `--spacing-xs` (0.25rem)
- `--spacing-sm` (0.5rem)
- `--spacing-md` (1rem)
- `--spacing-lg` (1.5rem)
- `--spacing-xl` (2rem)
- `--spacing-2xl` (3rem)
- `--spacing-3xl` (4rem)
- `--spacing-4xl` (6rem)

### Border Radius (8 tokens)

- `--radius-none`
- `--radius-sm` (0.25rem)
- `--radius-md` (0.375rem)
- `--radius-lg` (0.5rem)
- `--radius-xl` (0.75rem)
- `--radius-2xl` (1rem)
- `--radius-3xl` (1.5rem)
- `--radius-full` (9999px)

### Shadows (7 tokens)

- `--shadow-sm`
- `--shadow-md`
- `--shadow-lg`
- `--shadow-xl`
- `--shadow-input-focus`
- `--shadow-error`
- `--shadow-success`

### Z-Index (11 tokens)

- `--z-below` (-1)
- `--z-base` (0)
- `--z-raised` (10)
- `--z-overlay` (20)
- `--z-dropdown` (30)
- `--z-sticky` (40)
- `--z-modal` (50)
- `--z-popover` (60)
- `--z-tooltip` (70)
- `--z-notification` (80)
- `--z-maximum` (9999)

### Form Tokens (13 tokens)

- `--form-label-color`
- `--form-input-background`
- `--form-input-border`
- `--form-input-border-focus`
- `--form-input-error-border`
- `--form-input-error-background`
- `--form-input-success-border`
- `--form-input-success-background`
- `--form-placeholder`
- `--form-error-text`
- `--form-success-text`
- `--form-helper-text`
- `--form-input-disabled`

### Layout Tokens (3 tokens)

- `--layout-max-width` (80rem / 1280px)
- `--layout-content-width` (65ch)
- `--layout-sidebar-width` (16rem)

### Size Tokens (3 tokens)

- `--size-touch-target` (44px)
- `--size-input-height` (2.5rem)
- `--size-button-height` (2.5rem)

## Theme Switching

The tokens automatically respond to light/dark mode via the `[data-theme="light"]` selector in globals.css. No additional code needed.

## Timing Values for JavaScript

For animation timing in JavaScript (setTimeout, intervals, etc.), use `TIMING_CONSTANTS` from `src/lib/constants/ui-thresholds.ts`:

```typescript
import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'

setTimeout(() => {
  setSubmitState('idle')
}, TIMING_CONSTANTS.FORM_SUCCESS_DISPLAY) // 3000ms

const transitionDuration = TIMING_CONSTANTS.LOADING_STATE_RESET // 500ms
```

These are kept separate because they're used in JavaScript logic, not CSS styling.

## Real-World Examples

### Form Input

```typescript
<input
  style={{
    backgroundColor: 'var(--form-input-background)',
    borderColor: 'var(--form-input-border)',
    color: 'var(--foreground)',
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
  }}
/>
```

### Card Component

```typescript
<div
  style={{
    backgroundColor: 'var(--card)',
    color: 'var(--card-foreground)',
    borderColor: 'var(--border)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-md)',
    padding: 'var(--spacing-lg)',
  }}
>
  Card content
</div>
```

### Button with Hover

```typescript
<button
  className="bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-lg)] px-[var(--spacing-lg)]"
  style={{ transition: 'var(--transition-base)' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
  }}
/>
```

### Responsive Layout

```typescript
<div
  style={{
    maxWidth: 'var(--layout-content-width)',
    marginInline: 'auto',
    paddingInline: 'var(--spacing-md)',
  }}
>
  Centered content
</div>
```

## Why No Wrappers?

CSS variables are a native browser feature designed for exactly this use case. Using them directly:

- ✅ No abstraction layers
- ✅ Native browser support
- ✅ Automatic light/dark mode switching
- ✅ Runtime theme changes if needed
- ✅ Cleaner, more maintainable code
- ✅ Better performance (no helper function overhead)

## Modifying Tokens

All tokens are defined in `src/app/globals.css` in the `@theme {}` block and `:root {}` selector. Modify them there for site-wide changes.

For component-specific overrides, use inline styles or CSS modules:

```css
.custom-button {
  background-color: var(--primary);
  /* Custom override just for this component */
  padding: 1rem;
}
```

## Related Files

- Token definitions: `src/app/globals.css`
- JavaScript timing values: `src/lib/constants/ui-thresholds.ts`
