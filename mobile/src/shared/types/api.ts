export interface ApiRequestParams {
  filters?: string;
  pageSize?: number;
  pageNumber?: number;
  hasActiveFilters?: boolean;
}

export interface ApiResponseWithPaging<TResult> {
  results: TResult;
  paging: PagingInfo;
}

export interface PagingInfo {
  pageNumber: number;
  pageSize: number;
  totalCount?: number;
  totalPagesCount?: number;
}
