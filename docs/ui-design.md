# UI / Design System & Component Specifications

## Color Tokens

```css
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #6366f1;
  --color-accent: #818cf8;
  --color-bg: #f4f6f9;
  --color-surface: #ffffff;
  --color-border: #e8eaed;
  --color-text-primary: #191919;
  --color-text-secondary: #666666;
  --color-text-muted: #888888;

  --color-competition-low: #16a34a;
  --color-competition-mid: #ca8a04;
  --color-competition-high: #ea580c;
  --color-competition-very-high: #dc2626;
}
```

## Typography

- Font: `'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Base: 15px / line-height 1.5
- Scale: h1 42px/800, h2 22px/800, h3 16px/700, h4 14px/700

## Spacing & Layout

- Border radius: 8px (default), 12px (cards), 14px (large cards), 20px (pills)
- Section padding: 56px vertical, 24px horizontal
- Max content width: 1200px centered

## Animations

```css
/* Scroll fade-in */
.anim-fade { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
.anim-fade.visible { opacity: 1; transform: translateY(0); }

/* Skeleton shimmer */
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.skeleton { background: linear-gradient(90deg, #e8eaed 25%, #f4f6f9 50%, #e8eaed 75%);
            background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 4px; }

/* Ticker: pure CSS, zero JS in loop */
@keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.ticker-track { animation: ticker-scroll 28s linear infinite; }
.ticker-track:hover { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .anim-fade { opacity: 1; transform: none; transition: none; }
  .skeleton { animation: none; }
  .ticker-track { animation: none; }
}
```

---

## Component Specifications

### Header

- Sticky, z-index 200, height 60px, background #fff, border-bottom 1px solid #e8eaed
- Logo (links to `/`) + Nav with single item: `키워드 분석` (Keyword Analysis) → `/keyword`
- **No login/signup buttons whatsoever**

### HeroSection

- Gradient: `linear-gradient(135deg, #3b82f6 0%, #6366f1 60%, #818cf8 100%)`
- Contains: Badge, h1, p, SearchForm (with TypingPlaceholder), KeywordTicker, FeatureTags
- Feature tags (Korean UI): `최대 100개 동시 조회 | CSV 다운로드 | 블로그·쇼핑 경쟁도 | AI 키워드 진단`
  - English: `Up to 100 simultaneous lookups | CSV download | Blog & shopping competition | AI keyword analysis`
- **No "signup not required" tag**

### TypingPlaceholder

```typescript
const KEYWORDS = ['컨텐츠박스그룹', '다이어트 보조제', '스마트스토어 위탁판매',
                  '홈카페 원두', '블로그 상위노출', '제주 렌트카', '스킨케어 루틴', '무선 청소기 추천'];
// type 90ms/char → pause 1800ms → delete 45ms/char → gap 400ms
// Hidden when input has focus or has value
```

### KeywordTicker

```typescript
// aria-hidden="true" (decorative), pure CSS animation
// Duplicate items array once for seamless loop
const TICKERS = ['다이어트 보조제', '홈카페 원두', '스마트스토어', '제주 렌트카',
                 '블로그 상위노출', '무선 청소기', '스킨케어 루틴', '고양이 사료',
                 '캠핑 장비', '전기자전거', '네이버 블로그', '키워드 분석', '유튜브 수익화', '부업 아이디어'];
```

### StatsStrip

6 cells from Supabase `stats` table + hardcoded fallbacks:

| Cell | Value | Label (Korean UI) |
|------|-------|-------------------|
| 1 | 4,456,620 → 445만 | 누적 방문자 (Total visitors) |
| 2 | 1,441,446 → 144만 | 리포트 생성 (Reports generated) |
| 3 | 323,216 → 32만 | 월간 방문자 (Monthly visitors) |
| 4 | 100개 | 동시 조회 가능 (Simultaneous lookups) |
| 5 | 실시간 | 네이버 API 연동 (Naver API live) |
| 6 | 무료 | 모든 기능 무료 (All features free) |

Short format: `value >= 10000` → `Math.floor(n / 10000) + '만'`
Count-up triggers once on IntersectionObserver (threshold: 0.5)

### KeywordInput

- Textarea, 4 rows min → auto-grow to 12 rows max
- TypingPlaceholder overlaid absolutely (real placeholder hidden)
- onPaste: split by `\n` and `,` → deduplicate → rejoin with `\n`
- Live count label: `N / 100`
- Clear button (X): visible when `value.length > 0`

### ResultTable

```
<div role="region" aria-label="키워드 분석 결과">  {/* Keyword analysis results */}
  <ResultMeta />     ← "N개 결과" (N results) + "N.Ns" badges
  <table>
    <thead>           ← sortable th with aria-sort
    <tbody>
      {loading ? <SkeletonRows count={5} /> : results.map(r => <ResultRow />)}
    </tbody>
  </table>
  <ExportButton />   ← visible only when results.length > 0
</div>
```

Result rows: apply `content-visibility: auto` for rendering performance (100 rows):
```css
/* globals.css */
tbody tr {
  content-visibility: auto;
  contain-intrinsic-size: 0 48px;  /* estimated row height */
}
```

### ExportButton

```typescript
// No auth check — always available when results exist
function ExportButton({ results }: { results: KeywordResult[] }) {
  const handleExport = () => {
    const csv = Papa.unparse(results.map(toCSVRow), { header: true });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naver-keywords-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return <Button onClick={handleExport}>CSV 다운로드</Button>;  {/* CSV Download */}
}
```

### Skeleton Loading State

While API call is in progress:
- 5 skeleton rows with shimmer animation
- Submit button disabled + spinner
- `<form aria-busy="true">`, skeleton container `aria-label="결과 로딩 중" aria-busy="true"` (loading results)
