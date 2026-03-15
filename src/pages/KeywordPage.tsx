import { useKeywordStore } from '../store/keywordStore';
import { KeywordInput } from '../components/keyword/KeywordInput';
import { ResultTable } from '../components/keyword/ResultTable';

const FEATURE_TAGS = [
  '최대 100개 동시 조회',
  'CSV 다운로드',
  '블로그 경쟁도 분석',
  '월간 검색량 제공',
];

export function KeywordPage() {
  const { status, errorMessage } = useKeywordStore();

  return (
    <main className="flex-1">
      <section
        className="px-6 pt-12 pb-10"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 60%, #818cf8 100%)',
        }}
      >
        <div className="max-w-[720px] mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 mb-4">
            네이버 키워드 분석 도구
          </span>
          <h1
            className="text-white font-extrabold leading-tight mb-2"
            style={{ fontSize: 34 }}
          >
            키워드 검색량을 한번에 확인하세요
          </h1>
          <p className="text-white/75 text-sm mb-6">
            네이버 월간 검색량, 블로그 발행량, 경쟁도를 최대 100개 키워드 동시 조회
          </p>

          <KeywordInput />

          {status === 'error' && errorMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-left"
            >
              {errorMessage}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {FEATURE_TAGS.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white/85 border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {(status === 'loading' || status === 'success') && (
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <ResultTable />
        </div>
      )}
    </main>
  );
}
