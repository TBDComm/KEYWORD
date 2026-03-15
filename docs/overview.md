# Project Overview

**Version:** 1.1.0 | **Platform:** Firebase Studio (React) | **Scope:** Keyword Analysis only — no authentication

## Purpose

Naver Keyword Analysis Tool — looks up Naver monthly search volumes (PC + mobile), blog post counts, and shopping category data for up to 100 keywords at once, with CSV export and competition scoring. No login required.

## Core Features (all required)

| # | Feature | Description |
|---|---------|-------------|
| 1 | Bulk keyword lookup | Up to 100 keywords per query via Naver Ad API |
| 2 | PC + Mobile search volume | Both channels displayed side by side |
| 3 | Blog post count | Number of Naver blog posts indexed for each keyword |
| 4 | Shopping category | Naver shopping category matched to keyword |
| 5 | Competition ratio | Blog posts / search volume (saturation score) |
| 6 | CSV export | Download full result table as UTF-8 BOM CSV |
| 7 | Typing placeholder | Animated keyword suggestions in the search box |
| 8 | Popular keyword ticker | Horizontal auto-scroll ticker showing trending keywords |
| 9 | Statistics strip | Animated count-up numbers (total visits, reports, MAU) |

## Out of Scope — Do NOT Implement

- Any authentication or login system
- User accounts, sessions, or access control
- Blog analysis tools (diagnosis, rank check, missing check, compare, morpheme)
- Ad marketing section
- Business inquiry section
- Guide articles
- Keyword combination generator
- Related keyword analysis
- Any admin panel
- Firestore user collections or quota tracking
