# Architecture

## Project Structure

```
project-root/
├── public/
│   └── _redirects              ← Cloudflare Pages SPA routing
├── supabase/
│   ├── config.toml
│   └── functions/
│       └── naver-keyword-proxy/
│           └── index.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── router.tsx
    ├── supabase.ts             ← Supabase client
    ├── env.d.ts
    ├── assets/logo.svg
    ├── styles/
    │   ├── globals.css
    │   └── tailwind.css
    ├── store/keywordStore.ts
    ├── hooks/
    │   ├── useKeywordAnalysis.ts
    │   └── useTypingPlaceholder.ts
    ├── api/
    │   ├── naverKeyword.ts
    │   └── types.ts
    ├── components/
    │   ├── layout/      Header.tsx, Footer.tsx
    │   ├── hero/        HeroSection.tsx, SearchForm.tsx, TypingPlaceholder.tsx, KeywordTicker.tsx
    │   ├── stats/       StatsStrip.tsx
    │   ├── keyword/     KeywordAnalyzer.tsx, KeywordInput.tsx, ResultTable.tsx, ResultRow.tsx, CompetitionBadge.tsx, ExportButton.tsx
    │   └── ui/          Badge.tsx, Button.tsx, Spinner.tsx, AnimatedNumber.tsx
    └── pages/
        ├── HomePage.tsx
        └── KeywordPage.tsx
```

## Routing

```typescript
// src/router.tsx — BrowserRouter (Cloudflare Pages handles SPA via _redirects)
createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,     element: <HomePage /> },
      { path: 'keyword', element: <KeywordPage /> },  // loaded via React.lazy()
    ],
  },
]);
```

Hero form navigates with pre-filled state:
```typescript
navigate('/keyword', { state: { query: inputValue } });
```

KeywordPage reads it on mount:
```typescript
const initialQuery = (useLocation().state as { query?: string })?.query ?? '';
useEffect(() => {
  if (initialQuery) keywordStore.getState().setRawInput(initialQuery);
}, [initialQuery]);
```

## State Management — keywordStore (Zustand)

```typescript
interface KeywordStore {
  rawInput: string;
  setRawInput: (v: string) => void;

  status: 'idle' | 'loading' | 'success' | 'error';
  results: KeywordResult[];
  queryTime: number | null;
  partial: boolean;
  errorMessage: string | null;

  analyze: (keywords: string[]) => Promise<void>;
  clearResults: () => void;
  sortConfig: { column: SortableColumn; direction: 'asc' | 'desc' | 'none' };
  setSort: (column: SortableColumn) => void;
}
```

No auth store. No quota store.

## Data Models

```typescript
// src/api/types.ts

export interface KeywordResult {
  keyword: string;
  pcSearchVolume: number | null;      // null if API error
  mobileSearchVolume: number | null;
  totalSearchVolume: number | null;   // pc + mobile; null if both null
  blogCount: number | null;           // null if blog API failed
  competitionRatio: number | null;    // blogCount / totalSearchVolume
  competitionLevel: 'low' | 'mid' | 'high' | 'very-high' | null;
  shoppingCategory: string | null;
}

export interface AnalysisResponse {
  results: KeywordResult[];
  queryTime: number;   // ms
  partial: boolean;
}

export type SortableColumn =
  | 'pcSearchVolume' | 'mobileSearchVolume' | 'totalSearchVolume'
  | 'blogCount' | 'competitionRatio';
```
