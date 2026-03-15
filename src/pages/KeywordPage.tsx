import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useKeywordStore } from '../store/keywordStore';
import { KeywordInput } from '../components/keyword/KeywordInput';
import { ResultTable } from '../components/keyword/ResultTable';

export function KeywordPage() {
  const location = useLocation();
  const { setRawInput, status, errorMessage } = useKeywordStore();
  const initialQuery = (location.state as { query?: string } | null)?.query ?? '';

  useEffect(() => {
    if (initialQuery) {
      setRawInput(initialQuery);
    }
  }, [initialQuery, setRawInput]);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-10">
      <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-6">
        키워드 분석
      </h1>
      <KeywordInput />
      {status === 'error' && errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}
      <ResultTable />
    </main>
  );
}
