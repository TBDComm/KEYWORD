# Coding Standards & Guidelines

Sources: Vercel React Best Practices, Vercel Web Interface Guidelines, Anthropic Frontend Design

---

## Critical Performance Rules

### Async — Always Parallel for Independent Operations

```typescript
// BAD: sequential — unnecessary wait
const adResults = await callNaverAdAPI(keywords);
const blogResults = await callNaverBlogAPI(keywords);

// GOOD: parallel — 2-10x faster
const [adResults, blogResults] = await Promise.all([
  callNaverAdAPI(keywords),
  callNaverBlogAPI(keywords),
]);
```

### Bundle — No Barrel File Imports

```typescript
// BAD: imports entire library (200-800ms overhead)
import { Check, X, ArrowUp } from '@phosphor-icons/react';

// GOOD: import directly from source
import Check from '@phosphor-icons/react/dist/icons/Check';
import X from '@phosphor-icons/react/dist/icons/X';
```

For @phosphor-icons/react, use `optimizePackageImports` in Vite config if supported, or import directly.

### Re-renders — No Inline Components

```typescript
// BAD: ResultRow redefined every render
function ResultTable() {
  const Row = ({ data }) => <tr>...</tr>;  // new component each render
}

// GOOD: define outside
function ResultRow({ data }) { ... }
function ResultTable() { ... }
```

### State — Derive During Render, Not Effects

```typescript
// BAD: state + effect for derived value
const [total, setTotal] = useState(0);
useEffect(() => setTotal(pc + mobile), [pc, mobile]);

// GOOD: derive during render
const total = pc + mobile;
```

---

## UI Compliance Rules (Web Interface Guidelines)

### Accessibility

- Icon-only buttons: always include `aria-label`
- `<button>` for actions, `<a>` for navigation — never `<div onClick>`
- Decorative icons: `aria-hidden="true"`
- Async updates (toasts): `aria-live="polite"`
- Headings must be hierarchical `<h1>` → `<h6>`

### Focus States

- Never `outline-none` without a visible focus replacement
- Use `focus-visible:ring-*` (not `:focus`) to avoid ring on click
- All interactive elements need visible focus ring

### Forms

- Never block paste (`onPaste` + `preventDefault`) — our paste handler splits/deduplicates, which is fine
- Submit button: enabled until request starts, then disabled + spinner
- Errors inline next to fields; focus first error on submit
- Inputs need `autocomplete` and `name` attributes

### Animation

- Always respect `prefers-reduced-motion` (already in globals.css)
- Animate `transform`/`opacity` only — never `transition: all`
- List properties explicitly: `transition: opacity 0.3s ease, transform 0.3s ease`

### Typography (Korean UI)

- Use `…` (ellipsis character) not `...` (three dots) for loading states
- Number columns in result table: `font-variant-numeric: tabular-nums`
- `text-wrap: balance` on headings to prevent widows

### Performance

- `touch-action: manipulation` on all interactive elements (prevents double-tap zoom delay)
- `<img>` needs explicit `width` and `height` to prevent CLS
- Critical fonts: `<link rel="preload" as="font">` with `font-display: swap`
- Result table rows: `content-visibility: auto; contain-intrinsic-size: 0 48px`

### Anti-patterns — Never Do These

- `transition: all` — always list specific properties
- `outline-none` without focus-visible replacement
- `<div onClick>` — use `<button>` or `<a>`
- `user-scalable=no` or `maximum-scale=1`
- Images without `width`/`height`
- Icon buttons without `aria-label`

---

## Design Guidelines (Anthropic Frontend Design)

This project has established brand colors and layout via the spec. Within that constraint:

- **Pretendard is correct** for Korean UI — spec-mandated, not a generic choice
- **Blue→Indigo gradient is brand-defined** — maintain it, don't change for aesthetics
- **Motion**: use animations purposefully — one well-orchestrated reveal beats scattered micro-interactions
- **Spacing**: generous negative space where possible for readability
- **No generic AI-slop patterns**: `transition: all`, cookie-cutter hover states, flat unstyled components

---

## Code Style

- No emojis in any UI output, code comments, or console logs
- TypeScript strict mode — no implicit `any`
- Derive state during render rather than with `useEffect` + `useState`
- `Promise.all()` for all independent async operations
- Import directly from source files, not barrel index files
