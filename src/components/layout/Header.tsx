import { Link, NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header
      className="sticky top-0 z-[200] bg-white border-b border-[var(--color-border)]"
      style={{ height: 60 }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="font-bold text-base text-[var(--color-text-primary)]">
          키워드분석
        </Link>
        <nav>
          <NavLink
            to="/keyword"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`
            }
          >
            키워드 분석
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
