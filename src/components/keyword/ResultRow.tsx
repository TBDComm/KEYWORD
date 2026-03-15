import type { KeywordResult } from '../../api/types';
import { CompetitionBadge } from './CompetitionBadge';

interface ResultRowProps {
  result: KeywordResult;
}

function fmt(n: number | null): string {
  if (n === null) return '—';
  if (n === 5) return '< 10';
  return n.toLocaleString('ko-KR');
}

export function ResultRow({ result }: ResultRowProps) {
  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">
        {result.keyword}
      </td>
      <td
        className="px-4 py-3 text-sm text-right text-[var(--color-text-secondary)]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {fmt(result.pcSearchVolume)}
      </td>
      <td
        className="px-4 py-3 text-sm text-right text-[var(--color-text-secondary)]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {fmt(result.mobileSearchVolume)}
      </td>
      <td
        className="px-4 py-3 text-sm text-right font-medium text-[var(--color-text-primary)]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {fmt(result.totalSearchVolume)}
      </td>
      <td
        className="px-4 py-3 text-sm text-right text-[var(--color-text-secondary)]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {result.monthlyBlogCount === null ? '—' : result.monthlyBlogCount.toLocaleString('ko-KR')}
      </td>
      <td
        className="px-4 py-3 text-sm text-right text-[var(--color-text-secondary)]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {result.blogCount === null ? '—' : result.blogCount.toLocaleString('ko-KR')}
      </td>
      <td className="px-4 py-3 text-sm text-center">
        <CompetitionBadge level={result.competitionLevel} />
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
        {result.shoppingCategory || '—'}
      </td>
    </tr>
  );
}
