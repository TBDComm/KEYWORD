import Papa from 'papaparse';
import type { KeywordResult } from '../../api/types';
import { Button } from '../ui/Button';
import { trackEvent } from '../../utils/analytics';

interface ExportButtonProps {
  results: KeywordResult[];
}

function toCSVRow(r: KeywordResult) {
  return {
    키워드: r.keyword,
    PC검색량: r.pcSearchVolume ?? '',
    모바일검색량: r.mobileSearchVolume ?? '',
    총검색량: r.totalSearchVolume ?? '',
    블로그발행량: r.blogCount ?? '',
    경쟁비율: r.competitionRatio ?? '',
    경쟁도: r.competitionLevel ?? '',
    쇼핑카테고리: r.shoppingCategory ?? '',
  };
}

export function ExportButton({ results }: ExportButtonProps) {
  const handleExport = () => {
    const csv = Papa.unparse(results.map(toCSVRow), { header: true });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `naver-keywords-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent('csv_export', { keyword_count: results.length });
  };

  return <Button onClick={handleExport}>CSV 다운로드</Button>;
}
