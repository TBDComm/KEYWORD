import { SearchForm } from './SearchForm';
import { KeywordTicker } from './KeywordTicker';

const FEATURE_TAGS = [
  '최대 100개 동시 조회',
  'CSV 다운로드',
  '블로그·쇼핑 경쟁도',
  'AI 키워드 진단',
];

export function HeroSection() {
  return (
    <section
      className="py-16 px-6"
      style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 60%, #818cf8 100%)',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center gap-6">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
          네이버 키워드 분석 도구
        </span>
        <h1
          className="text-white font-extrabold leading-tight"
          style={{ fontSize: 42, textWrap: 'balance' } as import('react').CSSProperties}
        >
          키워드 검색량을<br />한번에 확인하세요
        </h1>
        <p className="text-white/80 text-base max-w-md">
          네이버 월간 검색량, 블로그 발행량, 쇼핑 경쟁도를 최대 100개 키워드 동시 조회
        </p>
        <SearchForm />
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {FEATURE_TAGS.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white/90 border border-white/20"
            >
              {tag}
            </span>
          ))}
        </div>
        <KeywordTicker />
      </div>
    </section>
  );
}
