
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KeywordResult {
  keyword: string;
  pcSearchVolume: number | null;
  mobileSearchVolume: number | null;
  totalSearchVolume: number | null;
  blogCount: number | null;
  competitionRatio: number | null;
  competitionLevel: 'low' | 'mid' | 'high' | 'very-high' | null;
  shoppingCategory: string | null;
}

interface NaverAdKeyword {
  relKeyword: string;
  monthlyPcQcCnt: number | '<10';
  monthlyMobileQcCnt: number | '<10';
  compIdx: string;
  plAvgDepth: number;
}

interface NaverAdResponse {
  keywordList: NaverAdKeyword[];
}

// ---------------------------------------------------------------------------
// Rate limiting (in-memory, per IP)
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (entry && now < entry.reset) {
    if (entry.count >= 20) return true;
    entry.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
  }
  return false;
}

// ---------------------------------------------------------------------------
// CORS headers
// ---------------------------------------------------------------------------

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ---------------------------------------------------------------------------
// Naver Ad API
// ---------------------------------------------------------------------------

async function buildNaverAdSignature(
  timestamp: string,
  method: string,
  path: string,
  secretKey: string
): Promise<string> {
  const message = `${timestamp}.${method}.${path}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function callNaverAdAPI(keywords: string[]): Promise<Map<string, NaverAdKeyword>> {
  const apiKey = Deno.env.get('NAVER_API_KEY') ?? '';
  const secretKey = Deno.env.get('NAVER_SECRET_KEY') ?? '';
  const customerId = Deno.env.get('NAVER_CUSTOMER_ID') ?? '';

  const timestamp = String(Date.now());
  const method = 'GET';
  const path = '/keywordstool';
  const signature = await buildNaverAdSignature(timestamp, method, path, secretKey);

  const params = new URLSearchParams();
  params.set('hintKeywords', keywords.join(','));
  params.set('showDetail', '1');

  const url = `https://api.naver.com/keywordstool?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      'X-Timestamp': timestamp,
      'X-API-KEY': apiKey,
      'X-Customer': customerId,
      'X-Signature': signature,
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`NAVER_AD_API_ERROR: ${res.status}`);
  }

  const data: NaverAdResponse = await res.json();
  const map = new Map<string, NaverAdKeyword>();
  for (const kw of data.keywordList) {
    map.set(kw.relKeyword, kw);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Naver Blog API
// ---------------------------------------------------------------------------

async function callNaverBlogAPI(keyword: string): Promise<number | null> {
  const clientId = Deno.env.get('NAVER_CLIENT_ID') ?? '';
  const clientSecret = Deno.env.get('NAVER_CLIENT_SECRET') ?? '';

  const url = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(keyword)}&display=1`;

  const res = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) return null;

  const data: { total: number } = await res.json();
  return data.total ?? null;
}

async function callNaverBlogAPIBatched(
  keywords: string[],
  concurrency = 5
): Promise<Map<string, number | null>> {
  const results = new Map<string, number | null>();
  for (let i = 0; i < keywords.length; i += concurrency) {
    const batch = keywords.slice(i, i + concurrency);
    const counts = await Promise.all(batch.map((kw) => callNaverBlogAPI(kw)));
    batch.forEach((kw, idx) => results.set(kw, counts[idx]));
  }
  return results;
}

// ---------------------------------------------------------------------------
// Result merging
// ---------------------------------------------------------------------------

function resolveVolume(raw: number | '<10'): number | null {
  if (raw === '<10') return 5;
  return typeof raw === 'number' ? raw : null;
}

function competitionLevel(ratio: number | null): 'low' | 'mid' | 'high' | 'very-high' | null {
  if (ratio === null) return null;
  if (ratio < 0.3) return 'low';
  if (ratio < 1.0) return 'mid';
  if (ratio < 3.0) return 'high';
  return 'very-high';
}

function mergeResults(
  keywords: string[],
  adMap: Map<string, NaverAdKeyword>,
  blogMap: Map<string, number | null>
): KeywordResult[] {
  return keywords.map((kw) => {
    const ad = adMap.get(kw);
    const pc = ad ? resolveVolume(ad.monthlyPcQcCnt) : null;
    const mobile = ad ? resolveVolume(ad.monthlyMobileQcCnt) : null;
    const total = pc !== null && mobile !== null ? pc + mobile : null;
    const blog = blogMap.get(kw) ?? null;
    const ratio =
      blog !== null && total !== null && total > 0
        ? Math.round((blog / total) * 100) / 100
        : null;

    return {
      keyword: kw,
      pcSearchVolume: pc,
      mobileSearchVolume: mobile,
      totalSearchVolume: total,
      blogCount: blog,
      competitionRatio: ratio,
      competitionLevel: competitionLevel(ratio),
      shoppingCategory: null,
    };
  });
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (checkRateLimit(ip)) {
    return Response.json(
      { error: 'RATE_LIMIT', retryAfter: 60 },
      { status: 429, headers: CORS }
    );
  }

  let keywords: string[];
  try {
    const body = await req.json() as { keywords: unknown };
    if (!Array.isArray(body.keywords) || body.keywords.length === 0) {
      return Response.json({ error: 'INVALID_INPUT' }, { status: 400, headers: CORS });
    }
    if (body.keywords.length > 100) {
      return Response.json({ error: 'TOO_MANY_KEYWORDS' }, { status: 400, headers: CORS });
    }
    keywords = (body.keywords as unknown[]).map((k) => String(k).trim()).filter(Boolean);
  } catch {
    return Response.json({ error: 'INVALID_JSON' }, { status: 400, headers: CORS });
  }

  const start = Date.now();

  try {
    const [adMap, blogMap] = await Promise.all([
      callNaverAdAPI(keywords),
      callNaverBlogAPIBatched(keywords),
    ]);

    const results = mergeResults(keywords, adMap, blogMap);
    const partial = results.some((r) => r.blogCount === null);

    return Response.json(
      { results, queryTime: Date.now() - start, partial },
      { headers: CORS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'UNKNOWN';
    if (message.startsWith('NAVER_AD_API_ERROR')) {
      return Response.json({ error: 'NAVER_API_ERROR' }, { status: 502, headers: CORS });
    }
    return Response.json({ error: 'SERVER_ERROR' }, { status: 500, headers: CORS });
  }
});
