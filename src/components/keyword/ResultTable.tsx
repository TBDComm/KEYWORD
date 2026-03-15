import { useMemo } from 'react';
import { useKeywordStore } from '../../store/keywordStore';
import type { SortableColumn } from '../../api/types';
import { ResultRow } from './ResultRow';
import { ExportButton } from './ExportButton';
import { ArrowUpIcon } from '@phosphor-icons/react/dist/csr/ArrowUp';
import { ArrowDownIcon } from '@phosphor-icons/react/dist/csr/ArrowDown';

const COLUMNS: { key: SortableColumn | null; label: string; sortable: boolean; align: string }[] =
  [
    { key: null, label: '키워드', sortable: false, align: 'left' },
    { key: 'pcSearchVolume', label: 'PC 검색량', sortable: true, align: 'right' },
    { key: 'mobileSearchVolume', label: '모바일 검색량', sortable: true, align: 'right' },
    { key: 'totalSearchVolume', label: '총 검색량', sortable: true, align: 'right' },
    { key: 'monthlyBlogCount', label: '월간 블로그 발행량', sortable: true, align: 'right' },
    { key: 'blogCount', label: '총 블로그 발행량', sortable: true, align: 'right' },
    { key: 'competitionRatio', label: '경쟁도', sortable: true, align: 'center' },
    { key: null, label: '쇼핑카테고리', sortable: false, align: 'left' },
  ];

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-[var(--color-border)]">
          {COLUMNS.map((col) => (
            <td key={col.label} className="px-4 py-3">
              <div className="skeleton h-4 rounded" style={{ width: col.key ? '60%' : '80%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function ResultTable() {
  const { status, results, queryTime, partial, sortConfig, setSort } = useKeywordStore();

  const sorted = useMemo(() => {
    if (sortConfig.direction === 'none') return results;
    return [...results].sort((a, b) => {
      const col = sortConfig.column;
      const av = a[col] ?? -Infinity;
      const bv = b[col] ?? -Infinity;
      return sortConfig.direction === 'asc' ? av - bv : bv - av;
    });
  }, [results, sortConfig]);

  if (status === 'idle') return null;

  return (
    <div role="region" aria-label="키워드 분석 결과" className="mt-6">
      {partial && (
        <div className="mb-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          일부 키워드의 블로그 발행량을 가져오지 못했습니다. 해당 항목은 &apos;—&apos;으로 표시됩니다.
        </div>
      )}

      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {status === 'success' && (
            <>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {results.length}개 결과
              </span>
              {queryTime !== null && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-[var(--color-text-muted)]">
                  {(queryTime / 1000).toFixed(1)}s
                </span>
              )}
            </>
          )}
        </div>
        {status === 'success' && results.length > 0 && <ExportButton results={results} />}
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-gray-50">
                {COLUMNS.map((col) => (
                  <th
                    key={col.label}
                    className={`px-4 py-3 font-semibold text-[var(--color-text-secondary)] text-${col.align} whitespace-nowrap ${
                      col.sortable ? 'cursor-pointer hover:text-[var(--color-text-primary)] select-none' : ''
                    }`}
                    aria-sort={
                      col.sortable && col.key && sortConfig.column === col.key
                        ? sortConfig.direction === 'asc'
                          ? 'ascending'
                          : sortConfig.direction === 'desc'
                          ? 'descending'
                          : 'none'
                        : undefined
                    }
                    onClick={col.sortable && col.key ? () => setSort(col.key as SortableColumn) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.sortable && col.key && sortConfig.column === col.key && sortConfig.direction !== 'none' && (
                        sortConfig.direction === 'asc'
                          ? <ArrowUpIcon size={12} aria-hidden="true" />
                          : <ArrowDownIcon size={12} aria-hidden="true" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              aria-busy={status === 'loading'}
              aria-label={status === 'loading' ? '결과 로딩 중' : undefined}
            >
              {status === 'loading' ? (
                <SkeletonRows count={5} />
              ) : (
                sorted.map((r) => <ResultRow key={r.keyword} result={r} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
