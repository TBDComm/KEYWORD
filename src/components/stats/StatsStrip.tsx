import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../supabase';
import { AnimatedNumber } from '../ui/AnimatedNumber';

interface StatsData {
  total_visits: number;
  total_reports: number;
  monthly_visits: number;
}

const FALLBACK: StatsData = {
  total_visits: 4456620,
  total_reports: 1441446,
  monthly_visits: 323216,
};

function shortFormat(n: number): string {
  if (n >= 10000) return `${Math.floor(n / 10000)}만`;
  return n.toLocaleString('ko-KR');
}

const STATIC_CELLS = [
  { value: '100개', label: '동시 조회 가능' },
  { value: '실시간', label: '네이버 API 연동' },
  { value: '무료', label: '모든 기능 무료' },
];

export function StatsStrip() {
  const [stats, setStats] = useState<StatsData>(FALLBACK);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from('stats')
      .select('total_visits, total_reports, monthly_visits')
      .eq('id', 'global')
      .single()
      .then(({ data }) => {
        if (data) setStats(data as StatsData);
      });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-white border-b border-[var(--color-border)]">
      <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          { value: stats.total_visits, label: '누적 방문자' },
          { value: stats.total_reports, label: '리포트 생성' },
          { value: stats.monthly_visits, label: '월간 방문자' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-2xl font-extrabold text-[var(--color-text-primary)]">
              {triggered ? (
                <AnimatedNumber value={value} format={shortFormat} />
              ) : (
                shortFormat(0)
              )}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
          </div>
        ))}
        {STATIC_CELLS.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-2xl font-extrabold text-[var(--color-primary)]">{value}</span>
            <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
