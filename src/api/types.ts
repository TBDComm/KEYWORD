export interface KeywordResult {
  keyword: string;
  pcSearchVolume: number | null;
  mobileSearchVolume: number | null;
  totalSearchVolume: number | null;
  blogCount: number | null;
  monthlyBlogCount: number | null;
  competitionRatio: number | null;
  competitionLevel: 'low' | 'mid' | 'high' | 'very-high' | null;
  shoppingCategory: string | null;
}

export interface AnalysisResponse {
  results: KeywordResult[];
  queryTime: number;
  partial: boolean;
}

export type SortableColumn =
  | 'pcSearchVolume'
  | 'mobileSearchVolume'
  | 'totalSearchVolume'
  | 'blogCount'
  | 'monthlyBlogCount'
  | 'competitionRatio';
