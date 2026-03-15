# Error Handling & Accessibility

## Error Display Strategy

| Type | Where |
|------|-------|
| Form validation errors | Inline text below input field |
| API errors | Toast notification (bottom-right, auto-dismiss 5s) |
| Partial results | Warning banner above results table |

## Error Messages (Korean UI strings — shown to end users)

| Scenario | User message (Korean) |
|----------|-----------------------|
| Empty input | "키워드를 입력해주세요." (Please enter keywords.) |
| Over 100 keywords | "최대 100개까지 입력 가능합니다." (Maximum 100 keywords allowed.) |
| Rate limit (429) | "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." (Too many requests. Please try again shortly.) |
| Network timeout | "요청 시간이 초과되었습니다. 연결 상태를 확인해주세요." (Request timed out. Please check your connection.) |
| Naver API error | "네이버 API가 응답하지 않습니다. 잠시 후 다시 시도해주세요." (Naver API is not responding. Please try again shortly.) |
| Unknown server error | "오류가 발생했습니다. 다시 시도해주세요." (An error occurred. Please try again.) |

## Partial Results Banner

When `partial === true`, show above table:
> "일부 키워드의 블로그 발행량을 가져오지 못했습니다. 해당 항목은 '—'으로 표시됩니다."
> (Could not retrieve blog post counts for some keywords. Those items are displayed as '—'.)

## Accessibility Requirements

- All interactive elements: `outline: 2px solid var(--color-primary); outline-offset: 2px`
- Sort `<th>` elements: `aria-sort="ascending" | "descending" | "none"`
- Form while loading: `aria-busy="true"` on the `<form>` element
- Skeleton container: `aria-label="결과 로딩 중"` (loading results) + `aria-busy="true"`
- Competition badges: text label + color (never color alone)
- Ticker: `aria-hidden="true"` (decorative)
- All images: descriptive `alt` text
- Minimum touch target: 44×44px for all mobile buttons
- Lighthouse accessibility score: >= 90 on both pages
