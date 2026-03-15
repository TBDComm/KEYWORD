export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>네이버 키워드 분석 도구</span>
        <span>데이터 출처: 네이버 검색광고 API</span>
      </div>
    </footer>
  );
}
