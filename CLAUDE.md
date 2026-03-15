# Naver Keyword Analyzer — AI Instructions

**Version:** 1.1.0 | **Stack:** React 19 + TypeScript + Vite + Tailwind + Supabase + Cloudflare Pages

---

## AI Behavior Rules

- **No assumptions**: Do not guess or speculate uncertain facts. Say "I don't know" when unsure.
- **Ask first**: If requirements are unclear or have multiple interpretations, ask before implementing.
- **Share improvements**: If a more efficient approach exists, share it before implementing.
- **No emojis**: Never use emojis in UI, code comments, or console logs.
- **No over-abstraction**: Do not design ahead for features not currently needed.
- **No over-engineering**: Build only what is requested. Do not add unrequested features, configs, or comments.

---

## Critical Project Rules

1. **No auth** — No login, signup, sessions, auth store, or quota tracking of any kind
2. **API credentials server-only** — Naver API calls only from Supabase Edge Function. Never include keys in the frontend bundle
3. **Scope: keyword analysis only** — See `docs/overview.md` for out-of-scope list
4. **No "signup not required" text** — Never display this anywhere in UI
5. **Use BrowserRouter** — Cloudflare Pages handles SPA routing via `_redirects` (not HashRouter)
6. **No emojis** — Applies to all UI, code, and comments

---

## Documentation Index

| File | Contents |
|------|----------|
| `docs/overview.md` | Project purpose, core features, out-of-scope list |
| `docs/tech-stack.md` | Frontend/backend tech stack, external APIs |
| `docs/architecture.md` | Project structure, routing, Zustand store, data models |
| `docs/api.md` | Frontend API client, Edge Function spec, result table, CompetitionBadge, CSV |
| `docs/ui-design.md` | Color tokens, typography, animations, full component specs |
| `docs/backend.md` | Supabase setup, Cloudflare Pages, env vars, DB schema, Edge Function code |
| `docs/analytics.md` | GTM setup, dataLayer events, Naver Analytics |
| `docs/deployment.md` | Deploy commands, secrets setup, performance targets |
| `docs/error-handling.md` | Error messages, display strategy, accessibility requirements |
| `docs/acceptance.md` | Acceptance criteria checklist |
| `docs/coding-standards.md` | Performance rules, UI compliance, design guidelines |

---

## Quick Reference

| Item | Value |
|------|-------|
| Primary color | `#3b82f6` (blue-500) |
| Hero gradient | `linear-gradient(135deg, #3b82f6 0%, #6366f1 60%, #818cf8 100%)` |
| Font | Pretendard (CDN) |
| Edge Function region | `ap-northeast-1` (Tokyo) |
| Rate limit | 20 req/min per IP |
| Max keywords | 100 (Naver API hard limit — cannot be changed) |
| DB | Supabase — `stats` table, read-only single row |
| Router | `createBrowserRouter` |
| Hosting | Cloudflare Pages (SPA handled via `public/_redirects`) |
