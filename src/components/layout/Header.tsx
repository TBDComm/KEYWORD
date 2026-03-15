import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header
      className="sticky top-0 z-[200] bg-white border-b border-[var(--color-border)]"
      style={{ height: 60 }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center">
        <Link to="/" className="font-bold text-base text-[var(--color-text-primary)]">
          키워드분석
        </Link>
      </div>
    </header>
  );
}
