# API Layer

## Frontend Client — src/api/naverKeyword.ts

```typescript
import axios from 'axios';
import type { KeywordResult, AnalysisResponse } from './types';

const client = axios.create({
  baseURL: import.meta.env.VITE_FUNCTIONS_BASE_URL,
  timeout: 35_000,
});

export async function analyzeKeywords(keywords: string[]): Promise<AnalysisResponse> {
  const { data } = await client.post<AnalysisResponse>('/naver-keyword-proxy', { keywords });
  return data;
}
```

No auth token headers. No Supabase Auth dependency.

## Supabase Edge Function — naver-keyword-proxy

**Endpoint:** `POST https://[ref].supabase.co/functions/v1/naver-keyword-proxy`
**Runtime:** Deno | **Region:** `ap-northeast-1` (Tokyo)

Full implementation: see `docs/backend.md`

**Request:**
```json
{ "keywords": ["keyword1", "keyword2"] }
```

**Behavior:**
- Validates: non-empty array, max 100 items (Naver API hard limit)
- IP-based rate limiting: 20 req/min per IP (in-memory Map)
- Calls Naver Ad API `/keywordstool` with HMAC-SHA256 auth
- Calls Naver Blog Search API per keyword (batched, max 5 concurrent)
- On Naver API 429: retry once after 2s, then return partial results
- Total timeout: 30s

**Response (200):**
```json
{ "results": [KeywordResult], "queryTime": 1234, "partial": false }
```

**Rate limit response (429):**
```json
{ "error": "RATE_LIMIT", "retryAfter": 60 }
```

**Cloud Function skeleton:**
```typescript
// functions/src/naverKeywordProxy.ts
import { onRequest } from 'firebase-functions/v2/https';
import { checkRateLimit } from './utils/rateLimit';

export const naverKeywordProxy = onRequest(
  { region: 'asia-northeast3', minInstances: 1, cors: true },
  async (req, res) => {
    if (req.method !== 'POST') { res.status(405).send('Method Not Allowed'); return; }

    const ip = req.ip ?? 'unknown';
    if (await checkRateLimit(ip)) {
      res.status(429).json({ error: 'RATE_LIMIT', retryAfter: 60 }); return;
    }

    const { keywords } = req.body as { keywords: string[] };
    if (!Array.isArray(keywords) || keywords.length === 0) {
      res.status(400).json({ error: 'INVALID_INPUT' }); return;
    }
    if (keywords.length > 100) {
      res.status(400).json({ error: 'TOO_MANY_KEYWORDS' }); return;
    }

    const start = Date.now();
    const [adResults, blogResults] = await Promise.all([
      callNaverAdAPI(keywords),
      callNaverBlogAPI(keywords),
    ]);

    const results = mergeResults(keywords, adResults, blogResults);
    res.json({ results, queryTime: Date.now() - start, partial: results.some(r => r.blogCount === null) });
  }
);
```

## Keyword Analysis Flow

```
User submits keywords
  → validate (empty / over 100)
  → POST /naverKeywordProxy { keywords: string[] }
  → Cloud Function → Naver Ad API + Naver Blog API
  → returns KeywordResult[]
  → store in keywordStore
  → render ResultTable
```

## Result Table Columns (exact order)

| # | Header (Korean UI) | Source | Notes |
|---|-------------------|--------|-------|
| 1 | 키워드 (Keyword) | input | Plain text |
| 2 | PC 검색량 (PC Search Volume) | Naver Ad API | monthlyPcQcCnt; "< 10" if < 10 |
| 3 | 모바일 검색량 (Mobile Search Volume) | Naver Ad API | monthlyMobileQcCnt; "< 10" if < 10 |
| 4 | 총 검색량 (Total Search Volume) | PC + Mobile | Sum; "< 10" if both < 10 |
| 5 | 블로그 발행량 (Blog Post Count) | Naver Blog API | null → "—" |
| 6 | 경쟁도 (Competition) | blogCount / totalSearch | CompetitionBadge |
| 7 | 쇼핑카테고리 (Shopping Category) | Naver Ad API | "—" if empty |

Sortable columns: PC검색량, 모바일검색량, 총검색량, 블로그발행량, 경쟁도
Sort cycle: asc → desc → original

## CompetitionBadge

| Level | Label (Korean UI) | Ratio | Color |
|-------|-------------------|-------|-------|
| low | 낮음 (Low) | < 0.3 | Green `#16a34a` |
| mid | 보통 (Mid) | 0.3 – 1.0 | Yellow `#ca8a04` |
| high | 높음 (High) | 1.0 – 3.0 | Orange `#ea580c` |
| very-high | 매우높음 (Very High) | > 3.0 | Red `#dc2626` |

If blogCount is null → "—" (no badge)

## CSV Export

- Filename: `naver-keywords-YYYY-MM-DD.csv`
- Encoding: UTF-8 with BOM (`\uFEFF`)
- 8 column headers (Korean, for Excel compatibility): `키워드,PC검색량,모바일검색량,총검색량,블로그발행량,경쟁비율,경쟁도,쇼핑카테고리`
- Values: raw numbers; competition ratio as decimal (e.g. 1.23)
- "< 10" exports as 5 (Naver API returns 5 for sub-10)
- No auth gate — always available when results exist
