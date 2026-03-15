import axios from 'axios';
import type { AnalysisResponse } from './types';

const client = axios.create({
  baseURL: import.meta.env.VITE_FUNCTIONS_BASE_URL,
  timeout: 35_000,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  },
});

export async function analyzeKeywords(keywords: string[]): Promise<AnalysisResponse> {
  const { data } = await client.post<AnalysisResponse>('/naver-keyword-proxy', { keywords });
  return data;
}
