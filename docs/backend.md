# Backend Configuration (Supabase + Cloudflare Pages)

## Environment Variables

**.env.local** (frontend — never commit):
```
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=
VITE_FUNCTIONS_BASE_URL=https://[project-ref].supabase.co/functions/v1
```

**Supabase Edge Function secrets** (set via CLI — never commit):
```
NAVER_API_KEY=
NAVER_SECRET_KEY=
NAVER_CUSTOMER_ID=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

## Cloudflare Pages — SPA Routing

Create `public/_redirects`:
```
/* /index.html 200
```

No other special config needed. Cloudflare Pages auto-detects Vite projects.

## Supabase Database Schema

Single read-only row for stats display:
```sql
create table stats (
  id text primary key default 'global',
  total_visits bigint default 4456620,
  total_reports bigint default 1441446,
  monthly_visits bigint default 323216
);

-- RLS: anyone can read, nobody can write
alter table stats enable row level security;
create policy "public read" on stats for select using (true);
```

## Frontend Supabase Client

```typescript
// src/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Usage in StatsStrip:
const { data } = await supabase
  .from('stats')
  .select('total_visits, total_reports, monthly_visits')
  .eq('id', 'global')
  .single();
```

## Supabase Edge Function — naverKeywordProxy

**File:** `supabase/functions/naver-keyword-proxy/index.ts`

**Endpoint:** `POST https://[ref].supabase.co/functions/v1/naver-keyword-proxy`

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const rateLimitMap = new Map<string, { count: number; reset: number }>();

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // IP rate limiting: 20 req/min per IP
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (entry && now < entry.reset) {
    if (entry.count >= 20) {
      return Response.json({ error: 'RATE_LIMIT', retryAfter: 60 }, { status: 429 });
    }
    entry.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
  }

  const { keywords } = await req.json() as { keywords: string[] };
  if (!Array.isArray(keywords) || keywords.length === 0) {
    return Response.json({ error: 'INVALID_INPUT' }, { status: 400 });
  }
  if (keywords.length > 100) {
    return Response.json({ error: 'TOO_MANY_KEYWORDS' }, { status: 400 });
  }

  const start = Date.now();
  const [adResults, blogResults] = await Promise.all([
    callNaverAdAPI(keywords),
    callNaverBlogAPI(keywords),  // batched, max 5 concurrent
  ]);

  const results = mergeResults(keywords, adResults, blogResults);
  return Response.json({
    results,
    queryTime: Date.now() - start,
    partial: results.some(r => r.blogCount === null),
  });
});
```

**Secrets setup (run once):**
```bash
supabase secrets set NAVER_API_KEY=...
supabase secrets set NAVER_SECRET_KEY=...
supabase secrets set NAVER_CUSTOMER_ID=...
supabase secrets set NAVER_CLIENT_ID=...
supabase secrets set NAVER_CLIENT_SECRET=...
```

**Deploy:**
```bash
supabase functions deploy naver-keyword-proxy
```

## Project Structure (Supabase)

```
project-root/
├── public/
│   └── _redirects          ← Cloudflare Pages SPA routing
├── supabase/
│   ├── config.toml
│   └── functions/
│       └── naver-keyword-proxy/
│           └── index.ts
└── src/
    ├── supabase.ts          ← Supabase client (replaces firebase.ts)
    └── ...
```
