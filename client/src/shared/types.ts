export interface ApiRequestParams {
  filters?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface ApiResponse<TResult> {
  results: TResult;
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
