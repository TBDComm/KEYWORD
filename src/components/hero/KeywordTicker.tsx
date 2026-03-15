const TICKERS = [
  '다이어트 보조제',
  '홈카페 원두',
  '스마트스토어',
  '제주 렌트카',
  '블로그 상위노출',
  '무선 청소기',
  '스킨케어 루틴',
  '고양이 사료',
  '캠핑 장비',
  '전기자전거',
  '네이버 블로그',
  '키워드 분석',
  '유튜브 수익화',
  '부업 아이디어',
];

const items = [...TICKERS, ...TICKERS];

export function KeywordTicker() {
  return (
    <div
      className="overflow-hidden w-full mt-6"
      aria-hidden="true"
    >
      <div className="ticker-track flex gap-3 whitespace-nowrap w-max">
        {items.map((item, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white/90 border border-white/20"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
