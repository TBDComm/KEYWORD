import { create } from 'zustand';
import { analyzeKeywords } from '../api/naverKeyword';
import type { KeywordResult, SortableColumn } from '../api/types';

interface SortConfig {
  column: SortableColumn;
  direction: 'asc' | 'desc' | 'none';
}

interface KeywordStore {
  rawInput: string;
  setRawInput: (v: string) => void;

  status: 'idle' | 'loading' | 'success' | 'error';
  results: KeywordResult[];
  queryTime: number | null;
  partial: boolean;
  errorMessage: string | null;

  analyze: (keywords: string[]) => Promise<void>;
  clearResults: () => void;

  sortConfig: SortConfig;
  setSort: (column: SortableColumn) => void;
}

export const useKeywordStore = create<KeywordStore>((set, get) => ({
  rawInput: '',
  setRawInput: (v) => set({ rawInput: v }),

  status: 'idle',
  results: [],
  queryTime: null,
  partial: false,
  errorMessage: null,

  analyze: async (keywords) => {
    set({ status: 'loading', errorMessage: null, partial: false });
    try {
      const data = await analyzeKeywords(keywords);
      set({
        status: 'success',
        results: data.results,
        queryTime: data.queryTime,
        partial: data.partial,
        sortConfig: { column: 'totalSearchVolume', direction: 'none' },
      });
    } catch (err: unknown) {
      let message = '오류가 발생했습니다. 다시 시도해주세요.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { status?: number; data?: { error?: string } } }).response;
        if (res?.status === 429) {
          message = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
        } else if (res?.data?.error === 'NAVER_API_ERROR') {
          message = '네이버 API가 응답하지 않습니다. 잠시 후 다시 시도해주세요.';
        }
      } else if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code?: string }).code;
        if (code === 'ECONNABORTED') {
          message = '요청 시간이 초과되었습니다. 연결 상태를 확인해주세요.';
        }
      }
      set({ status: 'error', errorMessage: message });
    }
  },

  clearResults: () =>
    set({ status: 'idle', results: [], queryTime: null, partial: false, errorMessage: null }),

  sortConfig: { column: 'totalSearchVolume', direction: 'none' },
  setSort: (column) => {
    const { sortConfig } = get();
    let direction: 'asc' | 'desc' | 'none' = 'asc';
    if (sortConfig.column === column) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = 'none';
    }
    set({ sortConfig: { column, direction } });
  },
}));
