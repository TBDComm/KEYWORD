# Tech Stack

## Frontend

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | React | 18.x | Strict Mode enabled |
| Language | TypeScript | 5.x | Strict null checks on |
| Build tool | Vite | 5.x | |
| Styling | Tailwind CSS | 3.x | + custom CSS variables for tokens |
| Icons | @phosphor-icons/react | latest | Replaces Material Symbols |
| Fonts | Pretendard (CDN) | — | Korean UI font |
| HTTP client | axios | latest | With interceptors |
| State | Zustand | 4.x | Lightweight global store |
| CSV export | papaparse | latest | CSV generation |
| Form | React Hook Form | 7.x | Textarea keyword input |
| Routing | React Router v6 | 6.x | BrowserRouter (Cloudflare Pages handles SPA routing) |

## Backend / BaaS

| Layer | Technology | Notes |
|-------|-----------|-------|
| Edge Functions | Supabase Edge Functions (Deno) | Proxy for Naver Ad API — hides credentials |
| Hosting | Cloudflare Pages | SPA routing via `_redirects` |
| Database | Supabase (PostgreSQL) | Read-only `stats` table — single row |
| JS Client | @supabase/supabase-js | latest |

No authentication is used. Edge Functions are protected by IP-based rate limiting.

## External APIs

| API | Purpose | Called from |
|-----|---------|-------------|
| Naver Search Ad API | Monthly search volume | Supabase Edge Function ONLY |
| Naver Open API Blog Search | Blog post count | Supabase Edge Function ONLY |

> **SECURITY RULE:** Naver API credentials must NEVER appear in the frontend bundle. All Naver API calls go through a Supabase Edge Function.

## Key Constraints

- Naver Ad API hard limit: **100 keywords per request** (cannot be bypassed — API-level restriction)
- Batching beyond 100 is possible but doubles latency and complexity — not recommended
