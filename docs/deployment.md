# Deployment & Performance

## Local Development

```bash
npm install
supabase start                    # start local Supabase (DB + Edge Functions)
supabase functions serve          # serve Edge Functions locally
npm run dev                       # Vite dev server — separate terminal
```

## Production Build & Deploy

```bash
# Frontend → Cloudflare Pages
npm run build
npx wrangler pages deploy dist --project-name=keyeord

# Backend → Supabase
supabase functions deploy naver-keyword-proxy
supabase db push                  # apply DB migrations
```

## Cloudflare Pages — Git Integration (recommended)

Connect repo in Cloudflare Pages dashboard:
- Build command: `npm run build`
- Build output: `dist`
- Auto-deploys on push to `main`

Environment variables set in Cloudflare Pages dashboard (Settings → Environment variables):
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_FUNCTIONS_BASE_URL
```

## Supabase Secrets Setup (run once before first deploy)

```bash
supabase secrets set NAVER_API_KEY=...
supabase secrets set NAVER_SECRET_KEY=...
supabase secrets set NAVER_CUSTOMER_ID=...
supabase secrets set NAVER_CLIENT_ID=...
supabase secrets set NAVER_CLIENT_SECRET=...
```

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s on 4G |
| INP | < 100ms |
| CLS | < 0.1 |
| Initial JS bundle (gzipped) | < 200KB |
| API round-trip (100 keywords) | < 8s |
| Lighthouse mobile score | >= 85 |

## Performance Requirements

- `KeywordPage` loaded via `React.lazy()` (code split from home page)
- Pretendard: `rel="preload" as="style"` then `onload` swap
- Logo as inline SVG (no raster images in critical path)
- Ticker animation: pure CSS only — zero JS in animation loop
- Result table rows: `content-visibility: auto; contain-intrinsic-size: 0 48px`
- Supabase Edge Function region: choose `ap-northeast-1` (Tokyo) — closest to Korea
