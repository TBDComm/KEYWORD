# Acceptance Criteria

All items must pass before the project is considered complete.

## Home Page
- [ ] Header: logo + "키워드 분석" (Keyword Analysis) nav only, 60px height — no login/signup buttons
- [ ] Hero gradient: `linear-gradient(135deg, #3b82f6 0%, #6366f1 60%, #818cf8 100%)`
- [ ] Typing placeholder cycles at correct timing (type 90ms/char, pause 1800ms, delete 45ms/char)
- [ ] Typing placeholder hides when input has focus or value
- [ ] Keyword ticker scrolls left continuously, pauses on hover
- [ ] Stats strip shows all 6 cells with correct labels
- [ ] Number count-up triggers on first scroll into view
- [ ] Short format: 4456620 displays as "445만"
- [ ] Feature tag pills visible — no "signup not required" tag

## Keyword Analysis — Input
- [ ] Textarea shows live count (N / 100)
- [ ] Paste splits on newline and comma, deduplicates
- [ ] Clear button (X) appears and clears content
- [ ] Over 100 keywords: warning shown, submit disabled
- [ ] During API call: spinner shown, submit disabled

## Keyword Analysis — Results
- [ ] All 7 columns in exact specified order
- [ ] Numbers use Korean thousands separator (comma)
- [ ] "< 10" volumes display as "< 10" (not as 5)
- [ ] Missing blog count → "—"
- [ ] Missing shopping category → "—"
- [ ] Competition badge: correct color and label for all 4 levels
- [ ] 5 sortable columns: asc → desc → original (three-click cycle)
- [ ] "N개 결과" (N results) and "N.Ns" badges above table
- [ ] 5 skeleton rows with shimmer during loading

## CSV Export
- [ ] Download button visible only when results exist
- [ ] Immediate download — no auth check
- [ ] Filename: `naver-keywords-YYYY-MM-DD.csv`
- [ ] UTF-8 BOM; Korean opens correctly in Excel
- [ ] 8 correct column headers
- [ ] Data values match what is displayed in the table

## Performance & Accessibility
- [ ] `prefers-reduced-motion: reduce` disables all animations
- [ ] CLS < 0.1 on home and keyword pages
- [ ] Sort `<th>` elements have correct `aria-sort` attributes
- [ ] Lighthouse accessibility >= 90 on both pages
- [ ] Lighthouse performance >= 85 on mobile
- [ ] Initial gzipped JS bundle < 200KB
