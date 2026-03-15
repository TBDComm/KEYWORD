type Level = 'low' | 'mid' | 'high' | 'very-high';

interface CompetitionBadgeProps {
  level: Level | null;
}

const CONFIG: Record<Level, { label: string; color: string }> = {
  low: { label: '낮음', color: '#16a34a' },
  mid: { label: '보통', color: '#ca8a04' },
  high: { label: '높음', color: '#ea580c' },
  'very-high': { label: '매우높음', color: '#dc2626' },
};

export function CompetitionBadge({ level }: CompetitionBadgeProps) {
  if (!level) return <span className="text-[var(--color-text-muted)]">—</span>;

  const { label, color } = CONFIG[level];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {label}
    </span>
  );
}
